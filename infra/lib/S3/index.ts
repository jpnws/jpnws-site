// import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
// import { Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
// import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
// import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
// import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
// import {
//   BlockPublicAccess,
//   Bucket,
//   BucketAccessControl,
// } from "aws-cdk-lib/aws-s3";
// import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
// import { Construct } from "constructs";
// import { resolve } from "path";
// import {
//   domain_name as domainName,
//   frontend_subdomain as frontEndSubDomain,
// } from "../../../config.json";
// import { ACM } from "../ACM";
// import { Route53 } from "../Route53";

// interface InfraS3Props {
//   acm: ACM;
//   route53: Route53;
// }

// export class S3 extends Construct {
//   public readonly webBucket: Bucket;
//   public readonly webBucketDeployment: BucketDeployment;
//   public readonly frontEndDistribution: Distribution;

// constructor(scope: Construct, id: string, props: InfraS3Props) {
//   super(scope, id);

// Initialize and configure the S3 bucket for web hosting with public read
// access and an auto-deletion policy for easier cleanup in non-production
// environments.
// this.webBucket = new Bucket(scope, "WebBucket", {
//   websiteIndexDocument: "index.html",
//   websiteErrorDocument: "index.html",
//   publicReadAccess: true,
//   removalPolicy: RemovalPolicy.DESTROY,
//   blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
//   accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
//   autoDeleteObjects: true,
// });

// Deploy the static content to the S3 bucket from a local directory. This
// is typically run during a CI/CD pipeline to ensure the latest content is
// served.
// this.webBucketDeployment = new BucketDeployment(
//   scope,
//   "Web-Bucket-Deployment",
//   {
//     sources: [
//       Source.asset(resolve(__dirname, "..", "..", "..", "web", "dist")),
//     ],
//     destinationBucket: this.webBucket,
//   },
// );

// Setup the CloudFront distribution to serve the S3 bucket's content
// securely over HTTPS, including a custom domain and SSL certificate
// configuration.
// this.frontEndDistribution = new Distribution(
//   scope,
//   "Frontend-Distribution",
//   {
//     certificate: props.acm.certificate,
//     domainNames: [`${frontEndSubDomain}.${domainName}`],
//     defaultRootObject: "index.html",
//     defaultBehavior: {
//       origin: new S3Origin(this.webBucket),
//       viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
//     },
//   },
// );

// Configure a DNS A Record to point to the CloudFront distribution,
// enabling the use of a friendly URL to access the website.
// new ARecord(scope, "Frontend-Alias-Record", {
//   zone: props.route53.hostedZone,
//   target: RecordTarget.fromAlias(
//     new CloudFrontTarget(this.frontEndDistribution),
//   ),
//   recordName: `${frontEndSubDomain}.${domainName}`,
// });

// Output the URL of the deployed site to allow easy access post-deployment.
// new CfnOutput(scope, "Frontend-URL", {
//   value: this.webBucket.bucketWebsiteUrl,
// });
//   }
// }
