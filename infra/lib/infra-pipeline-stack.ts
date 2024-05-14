import * as cdk from "aws-cdk-lib";
import * as acbd from "aws-cdk-lib/aws-codebuild";
import * as cpln from "aws-cdk-lib/aws-codepipeline";
import * as cpac from "aws-cdk-lib/aws-codepipeline-actions";
import * as aiam from "aws-cdk-lib/aws-iam";

import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const codeBuildDeployPolicy = new aiam.PolicyStatement({
      sid: "CodeBuildPolicy",
      effect: aiam.Effect.ALLOW,
      actions: ["sts:AssumeRole", "iam:PassRole"],
      resources: [
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-readOnlyRole",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-lookup-role-*",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-deploy-role-*",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-file-publishing-*",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-image-publishing-role-*",
          },
          this,
        ),
      ],
    });

    const buildProject = new acbd.PipelineProject(this, "BuildProject", {
      environment: {
        privileged: true,
        buildImage: acbd.LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: acbd.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              nodejs: 20,
            },
          },
          pre_build: {
            "on-failure": "ABORT",
            commands: [
              "cd web",
              "npm install",
              "cd ../server",
              "npm install",
              "cd ../infra",
              "npm install",
            ],
          },
          build: {
            "on-failure": "ABORT",
            commands: [
              "cd ../web",
              "npm run build",
              "cd ../server",
              "npm run build",
            ],
          },
          post_build: {
            "on-failure": "ABORT",
            commands: [""],
          },
        },
      }),
    });

    buildProject.addToRolePolicy(codeBuildDeployPolicy);

    const deployProject = new acbd.PipelineProject(this, "DeployProject", {
      environment: {
        privileged: true,
        buildImage: acbd.LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: acbd.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: ["echo Restoring artifacts..."],
          },
          build: {
            commands: ["cd infra", "npm cdk deploy --require-approval never"],
          },
        },
      }),
    });

    deployProject.addToRolePolicy(codeBuildDeployPolicy);

    const pipeline = new cpln.Pipeline(this, "Pipeline", {});

    const sourceArtifact = new cpln.Artifact();

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new cpac.GitHubSourceAction({
          actionName: "Source",
          owner: "jpnws",
          repo: "deploy-pipeline1",
          branch: "main",
          oauthToken: cdk.SecretValue.secretsManager("github-token"),
          output: sourceArtifact,
          trigger: cpac.GitHubTrigger.WEBHOOK,
        }),
      ],
    });

    const buildArtifact = new cpln.Artifact("BuildOutput");

    pipeline.addStage({
      stageName: "Build",
      actions: [
        new cpac.CodeBuildAction({
          actionName: "Build",
          project: buildProject,
          input: sourceArtifact,
          outputs: [buildArtifact],
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Approve",
      actions: [
        new cpac.ManualApprovalAction({
          actionName: "Approve",
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new cpac.CodeBuildAction({
          actionName: "Deploy",
          project: deployProject,
          input: buildArtifact,
        }),
      ],
    });
  }
}
