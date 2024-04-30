import { Construct } from "constructs";
import { Bucket, BucketProps } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";

export class S3Bucket extends Construct {
  constructor(scope: Construct, id: string, props?: BucketProps) {
    super(scope, id);

    const bucket = new Bucket(this, "Bucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}
