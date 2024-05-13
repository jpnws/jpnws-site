import * as cdk from "aws-cdk-lib";
import * as cmg from "aws-cdk-lib/aws-certificatemanager";
import * as cfr from "aws-cdk-lib/aws-cloudfront";
import * as s3o from "aws-cdk-lib/aws-cloudfront-origins";
import * as ddb from "aws-cdk-lib/aws-docdb";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elb from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as lgp from "aws-cdk-lib/aws-logs";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as rtg from "aws-cdk-lib/aws-route53-targets";
import * as s3l from "aws-cdk-lib/aws-s3";
import * as s3d from "aws-cdk-lib/aws-s3-deployment";
import * as smg from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { resolve } from "path";
import {
  backend_subdomain as backendSubdomain,
  domain_name as domainName,
  frontend_subdomain as frontendSubdomain,
} from "../../config.json";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // * =====================================
    // * Virtual Private Cloud (VPC)
    // * =====================================

    // Define the VPC and Security Group. You must define the public subnet
    // where containerized apps are deployed and the private subnet where
    // DocumentDB is deployed.
    const vpc = new ec2.Vpc(this, "VPC", {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "private",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // * =====================================
    // * Route 53
    // * =====================================

    // Define the Route 53 hosted zone.
    const hostedZone = r53.HostedZone.fromLookup(this, "HostedZone", {
      domainName,
    });

    // * =====================================
    // * Certificate Manager
    // * =====================================

    const certificate = new cmg.Certificate(this, "Certificate", {
      // Domain name to be secured by the certificate
      domainName,
      // Use DNS validation for the certificate.
      validation: cmg.CertificateValidation.fromDns(hostedZone),
      // Secure all subdomains under the primary domain
      subjectAlternativeNames: [`*.${domainName}`],
    });

    // * =====================================
    // * DocumentDB
    // * =====================================

    // Define the security group for the DocumentDB cluster.
    const docDbSecurityGroup = new ec2.SecurityGroup(
      this,
      "DocumentDBSecurityGroup",
      {
        vpc: vpc,
      },
    );

    // Retrieve the DocumentDB credentials from Secrets Manager. The credentials
    // must have been created in the AWS Management Console manually, where the
    // name of the secret should be "universal/db/credentials".
    const docDbCredentials = smg.Secret.fromSecretNameV2(
      this,
      "DocDBCredentials",
      "universal/db/credentials",
    );

    const docDbCluster = new ddb.DatabaseCluster(this, "DocDB", {
      masterUser: {
        username: docDbCredentials
          .secretValueFromJson("dbMainUsername")
          .unsafeUnwrap(),
        password: docDbCredentials.secretValueFromJson("dbMainPassword"),
      },
      vpc: vpc,
      vpcSubnets: vpc.selectSubnets({ subnetGroupName: "private" }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM,
      ),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // Define the security group for DocumentDB. You must define the security
      // group to allow incoming traffic from the containerized application's
      // security group.
      securityGroup: docDbSecurityGroup,
    });

    // * =====================================
    // * Elastic Container Service (ECS)
    // * =====================================

    // Create ECS task definition.
    const ecsTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "TaskDefinition",
    );

    // Create a new secret for PAYLOAD_SECRET with a random value
    const payloadSecret = new smg.Secret(this, "PayloadSecret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: "payloadSecret",
        excludeCharacters: '"@/\\ ',
      },
    });

    // Create a log group for the ECS task.
    const logGroup = new lgp.LogGroup(this, "ECSLogGroup", {
      retention: lgp.RetentionDays.ONE_DAY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // * Backend S3

    // Initialize and configure the S3 bucket for backend storage with only ECS
    // to be able to access it and an auto-deletion policy for easier cleanup in
    // non-production environments.
    const backendBucket = new s3l.Bucket(this, "PayloadBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3l.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3l.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      autoDeleteObjects: true,
    });

    // Grant read and write access to the ECS task.
    backendBucket.grantReadWrite(ecsTaskDefinition.taskRole);

    // Add a container to the task definition.
    ecsTaskDefinition.addContainer("PayloadContainer", {
      image: ecs.ContainerImage.fromAsset(
        resolve(__dirname, "..", "..", "server"),
      ),
      memoryLimitMiB: 512,
      cpu: 256,
      environment: {
        DB_HOST: docDbCluster.clusterEndpoint.hostname,
        S3_REGION: props?.env?.region as string,
        S3_BUCKET: backendBucket.bucketName,
        // DOMAIN_NAME: domainName, FRONTEND_SUBDOMAIN: frontendSubdomain,
        // BACKEND_SUBDOMAIN: backendSubdomain,
      },
      secrets: {
        PAYLOAD_SECRET: ecs.Secret.fromSecretsManager(
          payloadSecret,
          "payloadSecret",
        ),
        DB_USERNAME: ecs.Secret.fromSecretsManager(
          docDbCredentials,
          "dbMainUsername",
        ),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(
          docDbCredentials,
          "dbMainPassword",
        ),
      },
      portMappings: [
        {
          // Expose the container port.
          containerPort: 3000,
          protocol: ecs.Protocol.TCP,
        },
      ],
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "ecs",
        logGroup,
      }),
    });

    // Define the security group for the ECS cluster.
    const ecsSecurityGroup = new ec2.SecurityGroup(this, "ECSSecurityGroup", {
      vpc: vpc,
    });

    // Create an ECS cluster.
    const ecsCluster = new ecs.Cluster(this, "ECSCluster", { vpc });

    // Create an ECS service.
    const ecsService = new ecs.FargateService(this, "ECSService", {
      cluster: ecsCluster,
      taskDefinition: ecsTaskDefinition,
      securityGroups: [ecsSecurityGroup],
      assignPublicIp: true,
      vpcSubnets: vpc.selectSubnets({ subnetGroupName: "public" }),
    });

    // * =====================================
    // * Application Load Balancer and ECS
    // * =====================================

    // Application load balancer.
    const loadBalancer = new elb.ApplicationLoadBalancer(this, "LoadBalancer", {
      vpc: vpc,
      internetFacing: true,
    });

    // Add a listener to the load balancer.
    const loadBalancerListener = loadBalancer.addListener("Listener", {
      port: 443,
      protocol: elb.ApplicationProtocol.HTTPS,
      certificates: [certificate],
    });

    // Add the ECS service as a target to the load balancer listener.
    loadBalancerListener.addTargets("ECS", {
      // The port the container is listening on.
      port: 3000,
      // The protocol the container is listening on.
      protocol: elb.ApplicationProtocol.HTTP,
      targets: [ecsService],
      healthCheck: {
        interval: cdk.Duration.seconds(30),
        path: "/health",
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
        // The protocol the container is listening on.
        protocol: elb.Protocol.HTTP,
      },
    });

    // * =====================================
    // * ECS and DocumentDB interaction setup.
    // * =====================================

    // Allow incoming traffic from the ECS security group to the DocumentDB
    // security group.
    docDbSecurityGroup.addIngressRule(
      ecsSecurityGroup,
      ec2.Port.tcp(27017),
      "Allow DocumentDB traffic from ECS",
    );

    // Ensure that the ECS service depends on the DocumentDB cluster. This means
    // that the ECS service will only be created after the DocumentDB cluster is
    // created.
    ecsService.node.addDependency(docDbCluster);

    // * =====================================
    // * Backend DNS
    // * =====================================

    // DNS A record pointing to the load balancer
    new r53.ARecord(this, "BackendPayloadARecord", {
      zone: hostedZone,
      target: r53.RecordTarget.fromAlias(
        new rtg.LoadBalancerTarget(loadBalancer),
      ),
      recordName: `${backendSubdomain}.${domainName}`,
    });

    // Output the DNS name of the load balancer.
    new cdk.CfnOutput(this, "BackendPayloadURL", {
      value: loadBalancer.loadBalancerDnsName,
    });

    // * =====================================
    // * Frontend S3
    // * =====================================

    // Initialize and configure the S3 bucket for web hosting with public read
    // access and an auto-deletion policy for easier cleanup in non-production
    // environments.
    const webBucket = new s3l.Bucket(this, "WebBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3l.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3l.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      autoDeleteObjects: true,
    });

    // Deploy the static content to the S3 bucket from a local directory. This
    // is typically run during a CI/CD pipeline to ensure the latest content is
    // served.
    new s3d.BucketDeployment(this, "WebBucketDeployment", {
      sources: [
        s3d.Source.asset(resolve(__dirname, "..", "..", "web", "dist")),
      ],
      destinationBucket: webBucket,
    });

    // Setup the CloudFront distribution to serve the S3 bucket's content
    // securely over HTTPS, including a custom domain and SSL certificate
    // configuration.
    const frontendDistribution = new cfr.Distribution(
      this,
      "FrontendDistribution",
      {
        certificate: certificate,
        domainNames: [`${frontendSubdomain}.${domainName}`],
        defaultRootObject: "index.html",
        defaultBehavior: {
          origin: new s3o.S3Origin(webBucket),
          viewerProtocolPolicy: cfr.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    );

    // * =====================================
    // * Frontend DNS
    // * =====================================

    // Configure a DNS A Record to point to the CloudFront distribution,
    // enabling the use of a friendly URL to access the website.
    new r53.ARecord(this, "FrontendAliasRecord", {
      zone: hostedZone,
      target: r53.RecordTarget.fromAlias(
        new rtg.CloudFrontTarget(frontendDistribution),
      ),
      recordName: `${frontendSubdomain}.${domainName}`,
    });

    // Output the URL of the deployed site to allow easy access post-deployment.
    new cdk.CfnOutput(this, "FrontendURL", {
      value: webBucket.bucketWebsiteUrl,
    });
  }
}
