import { Construct } from "constructs";
import { SecurityGroup, Peer, Port } from "aws-cdk-lib/aws-ec2";
import { DatabaseCluster, DatabaseClusterProps } from "aws-cdk-lib/aws-docdb";

// Constructs are the basic building blocks of AWS CDK apps. A construct is a
// component within your app that represents one or more AWS CloudFormation
// resources and their configuration. You build your app, piece by piece, by
// importing and configuring constructs.
export class DocumentDb extends Construct {
  public readonly cluster: DatabaseCluster;

  constructor(scope: Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id);

    this.cluster = new DatabaseCluster(this, "DocumentDbCluster", props);

    const securityGroup = new SecurityGroup(this, "SecurityGroup", {
      vpc: props.vpc,
      description: "Security group for DocumentDB",
      allowAllOutbound: false,
    });

    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(27017),
      "Allow MongoDB access from specific resources",
    );

    this.cluster.addSecurityGroups(securityGroup);
  }
}
