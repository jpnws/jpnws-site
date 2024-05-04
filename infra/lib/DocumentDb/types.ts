import { Vpc } from "aws-cdk-lib/aws-ec2";

export interface InfraDocumentDbProps {
  vpc: Vpc;
}
