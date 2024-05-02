// Core constructs
import { Construct } from "constructs";

// General AWS CDK library imports
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";

// AWS S3 and related deployments
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

// AWS CloudFront and origins
import { Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

// AWS Route53 and targets
import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

// Node.js utilities
import { resolve } from "path";

// Local configuration and types
import {
  domain_name as domainName,
  frontend_subdomain as frontEndSubDomain,
} from "../../../config.json";
import { InfraS3Props } from "./types";

/**
 * This class encapsulates the deployment of a static website hosted on AWS
 * S3with a CloudFront distribution and Route53 DNS configuration. It ensures
 * resources are properly constructed with dependencies and configurations tied
 * to given properties, allowing for flexible and dynamic web hosting setups.
 */
export class S3 extends Construct {
  public readonly webBucket: Bucket;
  public readonly webBucketDeployment: BucketDeployment;
  public readonly frontEndDistribution: Distribution;

  /**
   * Constructs a new instance of the S3 class, setting up all required AWS
   * resources.
   *
   * @param scope - The parent construct.
   * @param id - The unique identifier for this construct.
   * @param props - The properties passed to configure the AWS resources, such
   * as the S3 bucket, CloudFront distribution, and Route53 records.
   */
  constructor(scope: Construct, id: string, props: InfraS3Props) {
    super(scope, id);

    // Initialize and configure the S3 bucket for web hosting with public read
    // access and an auto-deletion policy for easier cleanup in non-production
    // environments.
    this.webBucket = new Bucket(scope, "Web-Bucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      autoDeleteObjects: true,
    });

    // Deploy the static content to the S3 bucket from a local directory. This
    // is typically run during a CI/CD pipeline to ensure the latest content is
    // served.
    this.webBucketDeployment = new BucketDeployment(
      scope,
      "Web-Bucket-Deployment",
      {
        sources: [
          Source.asset(resolve(__dirname, "..", "..", "..", "web", "build")),
        ],
        destinationBucket: this.webBucket,
      },
    );

    // Setup the CloudFront distribution to serve the S3 bucket's content
    // securely over HTTPS, including a custom domain and SSL certificate
    // configuration.
    this.frontEndDistribution = new Distribution(
      scope,
      "Frontend-Distribution",
      {
        certificate: props.acm.certificate,
        domainNames: [`${frontEndSubDomain}.${domainName}`],
        defaultRootObject: "index.html",
        defaultBehavior: {
          origin: new S3Origin(this.webBucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    );

    // Configure a DNS A Record to point to the CloudFront distribution,
    // enabling the use of a friendly URL to access the website.
    new ARecord(scope, "Frontend-Alias-Record", {
      zone: props.route53.hostedZone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(this.frontEndDistribution),
      ),
      recordName: `${frontEndSubDomain}.${domainName}`,
    });

    // Output the URL of the deployed site to allow easy access post-deployment.
    new CfnOutput(scope, "Frontend-URL", {
      value: this.webBucket.bucketWebsiteUrl,
    });
  }
}
