# My Personal Blogsite CDK

This is an AWS Cloud Development Kit (CDK) TypeScript code that sets up a web application with ECS, DocumentDB, and S3. It defines several resources such as:

1. **ECS Service**: A containerized service running on Amazon Elastic Container Service (ECS).
2. **Load Balancer**: An Application Load Balancer (ALB) to distribute traffic to the ECS service.
3. **DocumentDB Cluster**: A MongoDB-like NoSQL database that allows for flexible schema and easy scaling.
4. **S3 Bucket**: A storage bucket for static web content, with auto-deletion policy for easier cleanup in non-production environments.

Here's a brief overview of each section:

**ECS and Load Balancer Setup**

- Creates an ECS service with a container running on port 3000.
- Adds the ECS service as a target to an ALB listener (port 443) with HTTPS protocol.
- Configures health checks for the ECS service.

**DocumentDB Interaction Setup**

- Allows incoming traffic from the ECS security group to the DocumentDB security group.
- Ensures that the ECS service depends on the DocumentDB cluster, which means the ECS service will only be created after the DocumentDB cluster is created.

**Backend DNS**

- Creates a DNS A Record pointing to the load balancer for backend traffic.
- Outputs the DNS name of the load balancer.

**S3 Setup**

- Initializes and configures an S3 bucket for web hosting with public read access and auto-deletion policy.
- Deploys static content from a local directory to the S3 bucket using AWS CDK's `BucketDeployment` construct.

**Frontend DNS**

- Configures a DNS A Record pointing to a CloudFront distribution.
- Outputs the URL of the deployed site.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
