import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { domain_name as domainName } from "../../../config.json";

export class Route53 extends Construct {
  public readonly hostedZone: IHostedZone;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Lookup an existing hosted zone using the domain name provided in the
    // configuration file and assign it to the 'hostedZone' property. This
    // utilizes the HostedZone class's fromLookup method.
    this.hostedZone = HostedZone.fromLookup(scope, "HostedZone", {
      domainName,
    });
  }
}
