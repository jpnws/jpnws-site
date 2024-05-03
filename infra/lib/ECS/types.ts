import { Vpc } from "aws-cdk-lib/aws-ec2";
import { DocumentDb } from "../DocumentDb";
import { ACM } from "../ACM";
import { Route53 } from "../Route53";

export interface InfraECSProps {
  docDb: DocumentDb;
  vpc: Vpc;
  acm: ACM;
  route53: Route53;
}
