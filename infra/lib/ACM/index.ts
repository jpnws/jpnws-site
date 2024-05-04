import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { domain_name as domainName } from "../../../config.json";

interface InfraACMProps {
  hostedZone: IHostedZone;
}

export class ACM extends Construct {
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: InfraACMProps) {
    super(scope, id);

    // Create and configure a new SSL/TLS certificate with DNS validation
    this.certificate = new Certificate(scope, "Certificate", {
      // Domain name to be secured by the certificate
      domainName,
      // Use DNS validation for the certificate, leveraging the provided hosted zone
      validation: CertificateValidation.fromDns(props.hostedZone),
      // Secure all subdomains under the primary domain
      subjectAlternativeNames: [`*.${domainName}`],
    });
  }
}
