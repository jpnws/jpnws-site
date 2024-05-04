import * as cdk from "aws-cdk-lib";
import { InstanceType, Vpc } from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import {
  Cluster,
  ContainerDefinition,
  ContainerImage,
  Ec2Service,
  Ec2TaskDefinition,
  LogDriver,
} from "aws-cdk-lib/aws-ecs";
import {
  ApplicationListener,
  ApplicationLoadBalancer,
  ApplicationProtocol,
  Protocol,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { LoadBalancerTarget } from "aws-cdk-lib/aws-route53-targets";
import * as smg from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { resolve } from "path";
import { ACM } from "../ACM";
import { DocumentDB } from "../DocumentDB";
import { Route53 } from "../Route53";

interface InfraECSProps {
  docDb: DocumentDB;
  vpc: Vpc;
  acm: ACM;
  route53: Route53;
}

export class ECS extends Construct {
  public readonly cluster: Cluster;
  public readonly taskDefinition: Ec2TaskDefinition;
  public readonly container: ContainerDefinition;
  public readonly service: Ec2Service;
  public readonly loadBalancer: ApplicationLoadBalancer;
  public readonly listener: ApplicationListener;
  public readonly logGroup: LogGroup;

  constructor(scope: Construct, id: string, props: InfraECSProps) {
    super(scope, id);

    // Log group for storing logs with a retention policy of 7 days for better traceability
    this.logGroup = new LogGroup(this, "ECS-Log-Group", {
      retention: RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ECS cluster setup in the provided VPC
    this.cluster = new Cluster(this, "ECS-Cluster", { vpc: props.vpc });

    // Adding an Auto Scaling group with an instance type suitable for the load
    this.cluster.addCapacity("Default-Auto-Scaling-Group", {
      instanceType: new InstanceType("t3.medium"),
    });

    // Define the ECS task definition with container configurations
    this.taskDefinition = new Ec2TaskDefinition(this, "Task-Definition");

    // Ensure environment variable for DocDB secret ARN is set
    // const docDbSecretArn = process.env.DOCDB_SECRET_ARN;
    // if (!docDbSecretArn) {
    //   throw new Error("DOCDB_SECRET_ARN environment variable is not set.");
    // }

    // Retrieve DocDB credentials from Secrets Manager
    const docDbCredentials = smg.Secret.fromSecretCompleteArn(
      this,
      "DocDBCredentials",
      props.docDb.secret.secretArn,
    );

    // Define the container using a Docker image from a local path
    this.container = this.taskDefinition.addContainer("Payload", {
      image: ContainerImage.fromAsset(resolve(__dirname, "../../../server")),
      memoryLimitMiB: 512, // Increased memory limit for better performance
      logging: LogDriver.awsLogs({
        streamPrefix: "payload",
        logGroup: this.logGroup,
      }),
      environment: {
        DOCDB_HOST: props.docDb.cluster.clusterEndpoint.hostname,
      },
      secrets: {
        DOCDB_USER: ecs.Secret.fromSecretsManager(docDbCredentials, "username"),
        DOCDB_PASS: ecs.Secret.fromSecretsManager(docDbCredentials, "password"),
      },
    });

    // Add port mapping for the Payload container
    this.container.addPortMappings({
      containerPort: 3001, // This matches the port exposed by the Dockerfile
      protocol: ecs.Protocol.TCP, // Specify TCP protocol
    });

    // Create the ECS service with a task definition and attach it to the cluster
    this.service = new Ec2Service(this, "Service", {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    });

    // Setup an Application Load Balancer for distributing incoming traffic
    this.loadBalancer = new ApplicationLoadBalancer(this, "LoadBalancer", {
      vpc: props.vpc,
      internetFacing: true,
    });

    // Listener for HTTPS traffic using the ACM certificate
    this.listener = this.loadBalancer.addListener("Public-Listener", {
      port: 443,
      open: true,
      certificates: [props.acm.certificate],
    });

    // Route traffic to the ECS service with HTTP health checks
    this.listener.addTargets("ECS", {
      protocol: ApplicationProtocol.HTTP,
      targets: [
        this.service.loadBalancerTarget({
          containerName: "Payload",
          containerPort: 3001,
        }),
      ],
      healthCheck: {
        protocol: Protocol.HTTP,
        path: "/health",
        timeout: cdk.Duration.seconds(5),
        unhealthyThresholdCount: 2,
        healthyThresholdCount: 2,
        interval: cdk.Duration.seconds(30),
      },
    });

    // DNS A record pointing to the load balancer
    new ARecord(this, "Backend-Payload-API-Alias-Record", {
      zone: props.route53.hostedZone,
      target: RecordTarget.fromAlias(new LoadBalancerTarget(this.loadBalancer)),
      recordName: `api.${props.route53.hostedZone.zoneName}`,
    });

    // Output the DNS name of the load balancer for easy access
    new cdk.CfnOutput(this, "Backend-URL", {
      value: this.loadBalancer.loadBalancerDnsName,
    });
  }
}
