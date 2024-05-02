import { Route53 } from "../Route53";
import { ACM } from "../ACM";

export interface InfraS3Props {
  acm: ACM;
  route53: Route53;
}
