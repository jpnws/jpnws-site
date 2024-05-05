import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { ACM } from "./ACM";
import { DocumentDB } from "./DocumentDB";
import { ECS } from "./ECS";
import { Route53 } from "./Route53";
import { S3 } from "./S3";

export class InfraStack extends Stack {
  public readonly acm: ACM;
  public readonly ecs: ECS;
  public readonly docDb: DocumentDB;
  public readonly route53: Route53;
  public readonly s3: S3;
  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Initialize the Route53 component
    this.route53 = new Route53(this, "Route53");

    // Set up ACM with the hosted zone
    this.acm = new ACM(this, "ACM", {
      hostedZone: this.route53.hostedZone,
    });

    // Create a VPC with public, private (egress), and isolated subnets
    this.vpc = new Vpc(this, "MyVPC", {
      maxAzs: 2, // Adjust as per your requirements
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "ingress",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "compute",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: "docdb",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Create an S3 component for hosting
    this.s3 = new S3(this, "S3", {
      acm: this.acm,
      route53: this.route53,
    });

    // Create a security group for DocumentDB and then instantiate DocumentDB
    const docDbSecurityGroup = new ec2.SecurityGroup(this, "DocDBSecGroup", {
      vpc: this.vpc,
      description: "Security group for DocumentDB",
      allowAllOutbound: true,
    });

    this.docDb = new DocumentDB(this, "DocumentDb", {
      vpc: this.vpc,
      docDbSecurityGroup,
      instanceType: InstanceType.of(InstanceClass.R5, InstanceSize.LARGE),
      instances: 1,
    });

    // Create the ECS instance and pass in ACM, Route53, and DocumentDB
    this.ecs = new ECS(this, "PayloadECS", {
      vpc: this.vpc,
      acm: this.acm,
      route53: this.route53,
      docDb: this.docDb,
    });

    // Allow ECS to access DocumentDB on the MongoDB default port
    this.docDb.cluster.connections.allowFrom(
      this.ecs.cluster,
      ec2.Port.tcp(27017),
    );

    // Grant ECS task role access to read secrets from Secrets Manager
    this.ecs.taskDefinition.taskRole.addToPrincipalPolicy(
      new PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [this.docDb.secret.secretArn],
      }),
    );

    // Establish dependency to ensure DocumentDB is created before ECS
    this.ecs.node.addDependency(this.docDb);

    // Output the DocumentDB endpoint for easy reference
    new CfnOutput(this, "DocDbEndpoint", {
      value: this.docDb.cluster.clusterEndpoint.hostname,
    });
  }
}
