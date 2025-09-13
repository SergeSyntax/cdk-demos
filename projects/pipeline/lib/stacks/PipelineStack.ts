import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from '../pipelines/PipelineStage';

export interface PipelineStackProps extends cdk.StackProps {}

export class PipelineStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id);

    const pipeline = new pipelines.CodePipeline(this, 'AwesomePipeline', {
      pipelineName: 'AwesomePipeline',
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('SergeSyntax/cdk-demos', 'master'),
        commands: ['npm install', 'cd projects/pipeline', 'npx cdk synth'],
        primaryOutputDirectory: 'projects/pipeline/cdk.out'
      })
    });
    // test

    const testStage = pipeline.addStage(
      new PipelineStage(scope, 'PipelineTestStage', {
        stageName: 'Test'
      })
    );

    testStage.addPre(
      new pipelines.CodeBuildStep('unit-testts', {
        commands: ['npm i', 'cd projects/pipeline', 'npm test']
      })
    );
  }
}
