// Import classes and interfaces related to SSL/TLS certificates, DNS
// management, and constructs from AWS CDK. Handle SSL/TLS certificates in AWS
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

// Interface for interacting with DNS hosted zones in Amazon Route53
import { IHostedZone } from "aws-cdk-lib/aws-route53";

// Base class for all construct declarations in AWS CDK
import { Construct } from "constructs";

// Load config settings, such as the domain name, from an external JSON file
import { domain_name as domainName } from "../../../config.json";

// Extend the base properties of a certificate with custom properties, including
// the hosted zone for DNS management
interface InfraACMProps {
  // Include the Route53 hosted zone used for domain management and DNS settings
  hostedZone: IHostedZone;
}

// Define a new construct class for managing SSL/TLS certificates in AWS
export class ACM extends Construct {
  // Publicly accessible certificate instance
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: InfraACMProps) {
    // Initialize the base Construct class
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
