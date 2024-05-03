// Import necessary ECS classes from AWS CDK library for deploying an ECS infrastructure.
import {
  Cluster,
  ContainerDefinition,
  ContainerImage,
  Ec2Service,
  Ec2TaskDefinition,
  LogDriver,
} from "aws-cdk-lib/aws-ecs";
// Import necessary Elastic Load Balancing classes for managing traffic to ECS services.
import {
  ApplicationListener,
  ApplicationLoadBalancer,
  ApplicationProtocol,
  Protocol,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
// Import logging classes to handle logs for ECS services.
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
// Base class for all constructs that represents a single deployable unit.
import { Construct } from "constructs";
// Importing types for ECS properties to help with type checking and autocompletion.
import { InfraECSProps } from "./types";
// Import core constructs for CloudFormation outputs and other settings.
import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
// EC2 related imports for specifying instance types.
import { InstanceType } from "aws-cdk-lib/aws-ec2";
// Helper functions to resolve directory paths.
import { resolve } from "path";
// Import Route 53 DNS management classes.
import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
// Target helper for Route 53 alias to point at resources like load balancers.
import { LoadBalancerTarget } from "aws-cdk-lib/aws-route53-targets";
// Configuration constants like domain names and subdomains.
import {
  domain_name as domainName,
  backend_api_subdomain as backendApiSubdomain,
} from "../../../config.json";

// Define the ECS class extending Construct for creating ECS infrastructure with associated components.
export class ECS extends Construct {
  // Public members of the class to hold resources for external reference.
  public readonly cluster: Cluster;
  public readonly taskDefinition: Ec2TaskDefinition;
  public readonly container: ContainerDefinition;
  public readonly service: Ec2Service;
  public readonly loadBalancer: ApplicationLoadBalancer;
  public readonly listener: ApplicationListener;
  public readonly logGroup: LogGroup;

  // Constructor for setting up the ECS infrastructure with provided properties.
  constructor(scope: Construct, id: string, props: InfraECSProps) {
    super(scope, id);

    // Create a log group for storing logs, with a policy to destroy logs after one day.
    this.logGroup = new LogGroup(scope, "ECS-Log-Group", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Initialize ECS cluster within a specified VPC.
    this.cluster = new Cluster(scope, "ECS-Cluster", { vpc: props.vpc });

    // Add EC2 Auto Scaling capacity to the ECS cluster.
    this.cluster.addCapacity("Default-Auto-Scaling-Group", {
      instanceType: new InstanceType("t2.micro"),
    });

    // Define the ECS task definition which specifies the Docker container configuration.
    this.taskDefinition = new Ec2TaskDefinition(scope, "Task-Definition");

    // Add a container to the task definition, specifying its properties and log configuration.
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

    // Create an ECS service to run and maintain the specified task definition on the cluster.
    this.service = new Ec2Service(scope, "Service", {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    });

    // Create an Application Load Balancer to distribute incoming application traffic.
    this.loadBalancer = new ApplicationLoadBalancer(scope, "LoadBalancer", {
      vpc: props.vpc,
      internetFacing: true,
    });

    // Add a listener to the load balancer to handle incoming traffic on port 443 (HTTPS).
    this.listener = this.loadBalancer.addListener("Public-Listener", {
      port: 443,
      open: true,
      certificates: [props.acm.certificate],
    });

    // Define targets for the listener, specifying routing and health check
    // configuration. Add targets to the listener with specific settings for
    // handling requests to the ECS service.
    this.listener.addTargets("ECS", {
      // Specify the protocol used by the targets in the target group. Here,
      // HTTP is used, meaning the load balancer will route HTTP requests to the
      // targets.
      protocol: ApplicationProtocol.HTTP,
      // Define the actual targets that this listener will forward traffic to.
      // In this case, it's an ECS service.
      targets: [
        this.service.loadBalancerTarget({
          // Name of the container within the ECS task definition that should
          // receive the traffic.
          containerName: "Payload",
          // The port on the container to which the load balancer should send
          // traffic. Port 80 is standard for HTTP.
          containerPort: 80,
        }),
      ],
      // Configure checks to ensure traffic is routed to healthy instances.
      healthCheck: {
        // The protocol used by the health check, HTTP, which checks the target
        // by sending HTTP requests.
        protocol: Protocol.HTTP,
        // The URL path on the target to request for health checks. A response
        // of 200 OK from this path indicates healthiness.
        path: "/health",
        // The amount of time to wait for a response from the health check
        // before failing the check.
        timeout: Duration.seconds(10),
        // The number of consecutive failed health checks required before
        // considering the target unhealthy.
        unhealthyThresholdCount: 5,
        // The number of consecutive successful health checks required before
        // considering the target healthy.
        healthyThresholdCount: 5,
        // The interval between health checks. It's set to every 60 seconds.
        interval: Duration.seconds(60),
      },
    });

    // Create a DNS A record pointing to the load balancer.
    new ARecord(this, "Backend-Payload-API-Alias-Record", {
      zone: props.route53.hostedZone,
      target: RecordTarget.fromAlias(new LoadBalancerTarget(this.loadBalancer)),
      recordName: `${backendApiSubdomain}.${domainName}`,
    });

    // Output the DNS name of the load balancer for easy access.
    new CfnOutput(scope, "Backend-URL", {
      value: this.loadBalancer.loadBalancerDnsName,
    });
  }
}
