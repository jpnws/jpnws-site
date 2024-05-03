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
import { Construct } from "constructs";
import { InfraECSProps } from "./types";
import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import { InstanceType } from "aws-cdk-lib/aws-ec2";
import { resolve } from "path";
import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { LoadBalancerTarget } from "aws-cdk-lib/aws-route53-targets";
import {
  domain_name as domainName,
  backend_api_subdomain as backendApiSubdomain,
} from "../../../config.json";

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

    this.logGroup = new LogGroup(scope, "ECS-Log-Group", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.cluster = new Cluster(scope, "ECS-Cluster", { vpc: props.vpc });

    this.cluster.addCapacity("Default-Auto-Scaling-Group", {
      instanceType: new InstanceType("t2.micro"),
    });

    this.taskDefinition = new Ec2TaskDefinition(scope, "Task-Definition");

    this.container = this.taskDefinition.addContainer("Payload", {
      image: ContainerImage.fromAsset(
        resolve(__dirname, "..", "..", "..", "server"),
      ),
      memoryLimitMiB: 256,
      logging: LogDriver.awsLogs({
        streamPrefix: "payload",
        logGroup: this.logGroup,
      }),
      environment: {
        DOCDB_HOST: props.docDb.cluster.clusterEndpoint.hostname,
      },
    });

    this.service = new Ec2Service(scope, "Service", {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    });

    this.loadBalancer = new ApplicationLoadBalancer(scope, "LoadBalancer", {
      vpc: props.vpc,
      internetFacing: true,
    });

    this.listener = this.loadBalancer.addListener("Public-Listener", {
      port: 443,
      open: true,
      certificates: [props.acm.certificate],
    });

    this.listener.addTargets("ECS", {
      protocol: ApplicationProtocol.HTTP,
      targets: [
        this.service.loadBalancerTarget({
          containerName: "Payload",
          containerPort: 80,
        }),
      ],
      healthCheck: {
        protocol: Protocol.HTTP,
        path: "/health",
        timeout: Duration.seconds(10),
        unhealthyThresholdCount: 5,
        healthyThresholdCount: 5,
        interval: Duration.seconds(60),
      },
    });

    new ARecord(this, "Backend-Payload-API-Alias-Record", {
      zone: props.route53.hostedZone,
      target: RecordTarget.fromAlias(new LoadBalancerTarget(this.loadBalancer)),
      recordName: `${backendApiSubdomain}.${domainName}`,
    });

    new CfnOutput(scope, "Backend-URL", {
      value: this.loadBalancer.loadBalancerDnsName,
    });
  }
}
