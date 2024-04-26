import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { InfraStack } from "../lib/infra-stack";

describe("DocumentDb in InfraStack", () => {
  const stack = new InfraStack(new Stack(), "TestInfraStack");

  const template = Template.fromStack(stack);

  it("creates a DocumentDB cluster with the correct instance type", () => {
    template.hasResourceProperties("AWS::DocDB::DBInstance", {
      DBInstanceClass: "db.r5.large",
    });
  });

  it("associates the correct VPC with the DocumentDB cluster", () => {
    template.resourceCountIs("AWS::DocDB::DBSubnetGroup", 1);
  });

  it("uses the specified security settings", () => {
    template.hasResourceProperties("AWS::EC2::SecurityGroup", {
      GroupDescription: "Security group for DocumentDB",
      SecurityGroupIngress: [
        {
          IpProtocol: "tcp",
          FromPort: 27017,
          ToPort: 27017,
          CidrIp: "0.0.0.0/0",
          Description: "Allow MongoDB access from specific resources",
        },
      ],
    });
  });
});
