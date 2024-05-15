import * as cdk from "aws-cdk-lib";
import * as acbd from "aws-cdk-lib/aws-codebuild";
import * as cpln from "aws-cdk-lib/aws-codepipeline";
import * as cpac from "aws-cdk-lib/aws-codepipeline-actions";
import * as aiam from "aws-cdk-lib/aws-iam";
import * as secm from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

/**
 * Represents the infrastructure pipeline stack.
 */
export class InfraPipelineStack extends cdk.Stack {
  /**
   * Constructs a new instance of the InfraPipelineStack.
   * @param scope The parent construct.
   * @param id The stack ID.
   * @param props The stack properties.
   */
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the IAM policy statement for CodeBuild build and deployment.
    const codeBuildDeployPolicy = new aiam.PolicyStatement({
      sid: "CodeBuildPolicy",
      effect: aiam.Effect.ALLOW,
      actions: ["sts:AssumeRole", "iam:PassRole"],
      resources: [
        // Specify the IAM roles.
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

    // Create the CodeBuild project for building the application.
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
            commands: [
              "cd $CODEBUILD_SRC_DIR/web && npm install",
              "cd $CODEBUILD_SRC_DIR/server && npm install",
              "cd $CODEBUILD_SRC_DIR/infra && npm install",
            ],
          },
          build: {
            "on-failure": "ABORT",
            commands: [
              "cd $CODEBUILD_SRC_DIR/web && npm run build",
              "cd $CODEBUILD_SRC_DIR/server && npm run build",
            ],
          },
        },
        artifacts: {
          "base-directory": ".",
          files: ["**/*"],
        },
        cache: {
          paths: [
            "web/node_modules/**/*",
            "server/node_modules/**/*",
            "infra/node_modules/**/*",
          ],
        },
      }),
    });

    // Add the CodeBuild deployment policy to the build project's role.
    buildProject.addToRolePolicy(codeBuildDeployPolicy);

    // Create the CodeBuild project for deploying the application.
    const deployProject = new acbd.PipelineProject(this, "DeployProject", {
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
            commands: [
              "npm install -g aws-cdk",
              "cd $CODEBUILD_SRC_DIR/infra && npm install",
            ],
          },
          build: {
            commands: [
              "cd $CODEBUILD_SRC_DIR/infra && npx cdk deploy InfraStack --require-approval never",
            ],
          },
        },
        artifacts: {
          files: ["**/*"],
        },
      }),
    });

    // Add the CodeBuild deployment policy to the deploy project's role.
    deployProject.addToRolePolicy(codeBuildDeployPolicy);

    // Create the pipeline.
    const pipeline = new cpln.Pipeline(this, "Pipeline", {});

    // Create the source artifact.
    const sourceArtifact = new cpln.Artifact("SourceArtifact");

    // Get the GitHub secret for authentication.
    const githubSecret = secm.Secret.fromSecretNameV2(
      this,
      "GitHubSecret",
      "github/token/jpnws-site",
    );

    // Add the source stage to the pipeline.
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

    // Create the build artifact.
    const buildArtifact = new cpln.Artifact("BuildArtifact");

    // Add the build stage to the pipeline.
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

    // Add the approval stage to the pipeline.
    pipeline.addStage({
      stageName: "Approve",
      actions: [
        new cpac.ManualApprovalAction({
          actionName: "Approve",
          runOrder: 1,
        }),
      ],
    });

    // Add the deploy stage to the pipeline.
    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new cpac.CodeBuildAction({
          actionName: "Deploy",
          project: deployProject,
          input: buildArtifact,
          runOrder: 1,
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
