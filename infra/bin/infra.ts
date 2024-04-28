#!/usr/bin/env node

// The `source-map-support` module helps the AWS CDK CLI to map errors back to
// the original TypeScript source code. This is useful for debugging.
import "source-map-support/register";

// `aws-cdk-lib` is the AWS Construct Library. It has the essential building
// blocks - constructs - to define cloud resources. The `App` class is a unique
// construct. Compared to other constructs, they don't configure AWS resources
// on its own. Instead, it is used to provide context for the other constructs.
import { App } from "aws-cdk-lib";

import { InfraStack } from "../lib/infra-stack";

// The AWS CDK app is a collection of one or more CDK stacks. Stacks are a
// collection of one or more constructs, which define the AWS resources and
// properties. Therefore, the overall grouping of your stacks and constructs are
// known as the CDK app.
const app = new App();

// An AWS CDK stack is a collection of one or more constructs, which define AWS
// resources. Each CDK stack represents an AWS CloudFormation stack in your CDK
// app. At deployment, constructs within a stack are provisioned as a single
// unit, called AWS CloudFormation stack.
new InfraStack(app, "InfraStack", {
  // Environment is the target AWS account and AWS Region that stacks are
  // deployed to. All stacks in your CDK app are explicitly or implicitly
  // associated with an environment.
  // https://docs.aws.amazon.com/cdk/latest/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
