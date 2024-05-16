import * as cdk from "aws-cdk-lib";
import * as acbd from "aws-cdk-lib/aws-codebuild";
import * as cpln from "aws-cdk-lib/aws-codepipeline";
import * as cpac from "aws-cdk-lib/aws-codepipeline-actions";
import * as aiam from "aws-cdk-lib/aws-iam";
import * as secm from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

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
            region: "",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-lookup-role-*",
            region: "",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-deploy-role-*",
            region: "",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-file-publishing-*",
            region: "",
          },
          this,
        ),
        cdk.Arn.format(
          {
            service: "iam",
            resource: "role",
            resourceName: "cdk-hnb659fds-image-publishing-role-*",
            region: "",
          },
          this,
        ),
      ],
    });

    const buildProject = new acbd.PipelineProject(this, "BuildProject", {
      environment: {
        privileged: true,
        buildImage: acbd.LinuxBuildImage.STANDARD_5_0,
        environmentVariables: {
          INFRA_STACK: {
            value: true,
          },
        },
      },
      buildSpec: acbd.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              nodejs: 20,
            },
            commands: [
              "cd $CODEBUILD_SRC_DIR/web",
              "npm install",
              "cd $CODEBUILD_SRC_DIR/server",
              "npm install",
              "cd $CODEBUILD_SRC_DIR/infra",
              "npm install",
            ],
          },
          build: {
            "on-failure": "ABORT",
            commands: [
              "cd $CODEBUILD_SRC_DIR/web",
              "npm run build",
              "cd $CODEBUILD_SRC_DIR/server",
              "npm run build",
              "cd $CODEBUILD_SRC_DIR/infra",
              "npx cdk synth InfraStack",
            ],
          },
        },
        artifacts: {
          "base-directory": ".",
          files: ["**/*"],
        },
      }),
    });

    buildProject.addToRolePolicy(codeBuildDeployPolicy);

    const deployProject = new acbd.PipelineProject(this, "DeployProject", {
      environment: {
        privileged: true,
        buildImage: acbd.LinuxBuildImage.STANDARD_5_0,
        environmentVariables: {
          INFRA_STACK: {
            value: true,
          },
        },
      },
      buildSpec: acbd.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              nodejs: 20,
            },
            commands: [
              "ls -R $CODEBUILD_SRC_DIR",
              "cd $CODEBUILD_SRC_DIR/web",
              "npm install",
              "cd $CODEBUILD_SRC_DIR/server",
              "npm install",
              "cd $CODEBUILD_SRC_DIR/infra",
              "npm install",
            ],
          },
          build: {
            "on-failure": "ABORT",
            commands: [
              "cd $CODEBUILD_SRC_DIR/web",
              "npm run build",
              "cd $CODEBUILD_SRC_DIR/server",
              "npm run build",
              "cd $CODEBUILD_SRC_DIR/infra",
              "npx cdk deploy InfraStack",
            ],
          },
        },
      }),
    });

    deployProject.addToRolePolicy(codeBuildDeployPolicy);

    const pipeline = new cpln.Pipeline(this, "Pipeline", {});

    const sourceArtifact = new cpln.Artifact("SourceArtifact");

    const githubSecret = secm.Secret.fromSecretNameV2(
      this,
      "GitHubSecret",
      "github/token/jpnws-site",
    );

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new cpac.GitHubSourceAction({
          actionName: "Source",
          owner: "jpnws",
          repo: "jpnws-site",
          branch: "main",
          oauthToken: githubSecret.secretValueFromJson(
            "jpnws-site-github-token1",
          ),
          output: sourceArtifact,
          trigger: cpac.GitHubTrigger.WEBHOOK,
        }),
      ],
    });

    const buildArtifact = new cpln.Artifact("BuildArtifact");

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
      stageName: "Deploy",
      actions: [
        new cpac.CodeBuildAction({
          actionName: "Deploy",
          project: deployProject,
          input: buildArtifact,
        }),
      ],
    });

    new cdk.CfnOutput(this, "PipelineArn", {
      value: pipeline.pipelineArn,
      description: "The ARN of the CodePipeline",
    });

    new cdk.CfnOutput(this, "BuildProjectName", {
      value: buildProject.projectName,
      description: "The name of the CodeBuild project for building",
    });

    new cdk.CfnOutput(this, "DeployProjectName", {
      value: deployProject.projectName,
      description: "The name of the CodeBuild project for deploying",
    });
  }
}
