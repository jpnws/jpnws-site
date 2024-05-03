// Import necessary classes and types from CDK library and constructs module
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

// Import domain name from config JSON file located in a higher-level directory
import { domain_name as domainName } from "../../../config.json";

// Define a new class 'Route53' that extends the 'Construct' class, allowing it
// to be used in CDK stacks
export class Route53 extends Construct {
  // Declare a public read-only property 'hostedZone' of type 'IHostedZone'
  public readonly hostedZone: IHostedZone;

  // Constructor for the 'Route53' class takes 'scope' and 'id' as parameters
  // for the construct configuration
  constructor(scope: Construct, id: string) {
    // Call the superclass 'Construct' constructor with scope and id
    super(scope, id);

    // Lookup an existing hosted zone using the domain name provided in the
    // configuration file and assign it to the 'hostedZone' property. This
    // utilizes the HostedZone class's fromLookup method.
    this.hostedZone = HostedZone.fromLookup(scope, "HostedZone", {
      domainName,
    });
  }
}
