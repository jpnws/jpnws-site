import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

import { domain_name as domainName } from "../../../config.json";

export class Route53 extends Construct {
  public readonly hostedZone: IHostedZone;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.hostedZone = HostedZone.fromLookup(scope, "HostedZone", {
      domainName,
    });
  }
}
