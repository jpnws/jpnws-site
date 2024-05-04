// DocumentDB.ts
import * as cdk from "aws-cdk-lib";
import * as docdb from "aws-cdk-lib/aws-docdb";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

interface DocumentDBProps {
  vpc: ec2.IVpc;
  payloadSecurityGroup: ec2.ISecurityGroup;
  instanceType?: ec2.InstanceType;
  instances?: number;
}

export class DocumentDB extends Construct {
  public readonly cluster: docdb.DatabaseCluster;
  public readonly secret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: DocumentDBProps) {
    super(scope, id);

    // Default instance type if not provided
    const instanceType =
      props.instanceType ||
      ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE);

    // Create a security group for the DocumentDB cluster
    const securityGroup = new ec2.SecurityGroup(
      this,
      "DocumentDBSecurityGroup",
      {
        vpc: props.vpc,
        description: "Security group for DocumentDB",
        allowAllOutbound: true,
      },
    );

    // Allow inbound traffic from the Payload security group on port 27017
    securityGroup.addIngressRule(
      props.payloadSecurityGroup,
      ec2.Port.tcp(27017),
      "Allow MongoDB traffic from PayloadCMS",
    );

    // Create a secret for the DocumentDB credentials
    this.secret = new secretsmanager.Secret(this, "DocDBCredentials", {
      secretName: "docdbCredentials",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "docdbadmin" }),
        generateStringKey: "password",
        excludeCharacters: '"@/\\ ',
      },
    });

    // Create the DocumentDB cluster
    this.cluster = new docdb.DatabaseCluster(this, "Cluster", {
      masterUser: {
        username: this.secret.secretValueFromJson("username").unsafeUnwrap(),
        password: this.secret.secretValueFromJson("password"),
      },
      instanceType,
      instances: props.instances || 1,
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroup,
      dbClusterName: `${cdk.Stack.of(this).stackName}-docdb`,
      engineVersion: "4.0",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Adjust based on environment
      storageEncrypted: true,
    });

    // Output the DocumentDB cluster endpoint and the ARN of the secret
    new cdk.CfnOutput(this, "DocumentDBClusterEndpoint", {
      value: this.cluster.clusterEndpoint.hostname,
    });
    new cdk.CfnOutput(this, "DocumentDBCredentialsSecretArn", {
      value: this.secret.secretArn,
    });
  }
}
