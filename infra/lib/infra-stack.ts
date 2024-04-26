import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";
import { DocumentDb } from "./DocumentDb";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 1,
      natGateways: 1,
    });

    const documentDb = new DocumentDb(this, "DocumentDb", {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.R5,
        ec2.InstanceSize.LARGE,
      ),
      vpc,
      masterUser: {
        username: "docdbadmin",
        excludeCharacters: '"@/:',
      },
      deletionProtection: true,
    });

    new cdk.CfnOutput(this, "DocDbEndpoint", {
      value: documentDb.cluster.clusterEndpoint.hostname,
    });
  }
}
