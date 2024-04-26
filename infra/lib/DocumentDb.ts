import { Construct } from "constructs";
import { SecurityGroup, Peer, Port } from "aws-cdk-lib/aws-ec2";
import { DatabaseCluster, DatabaseClusterProps } from "aws-cdk-lib/aws-docdb";

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
