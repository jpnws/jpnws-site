import {
  Vpc,
  InstanceType,
  InstanceClass,
  InstanceSize,
} from "aws-cdk-lib/aws-ec2";

// `aws-cdk-lib` is the AWS Construct Library. It has the essential building
// blocks - constructs - to define cloud resources. The `Stack` class is a
// construct that defines a new stack. Stacks are a collection of one or more
// constructs, which define the AWS resources and properties. It is a unique
// construct. Compared to other constructs, it doesn't configure AWS resources
// on its own. Instead, it is used to provide context for the other constructs.
// All constructs that represent AWS resources must be defined, directly or
// indirectly, within the scope of a `Stack` construct. `Stack` constructs are
// defined within the scope of an `App` construct.
import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";

import { Construct } from "constructs";

import { DocumentDb } from "./DocumentDb";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    const documentDb = new DocumentDb(this, "DocumentDb", {
      instanceType: InstanceType.of(InstanceClass.R5, InstanceSize.LARGE),
      vpc,
      masterUser: {
        username: "docdbadmin",
        excludeCharacters: '"@/:',
      },
    });

    new CfnOutput(this, "DocDbEndpoint", {
      value: documentDb.cluster.clusterEndpoint.hostname,
    });
  }
}
