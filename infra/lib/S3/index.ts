import { Construct } from "constructs";
import { Bucket, BucketProps } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import { BucketDeployment } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Route53 } from "../Route53";
import { ACM } from "../ACM";

interface Props extends BucketProps {
  acm: ACM;
  route53: Route53;
}

export class S3 extends Construct {
  public readonly webBucket: Bucket;
  public readonly webBucketDeployment: BucketDeployment;
  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props?: BucketProps) {
    super(scope, id);

    const bucket = new Bucket(this, "Bucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}
