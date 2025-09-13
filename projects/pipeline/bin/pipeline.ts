#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/PipelineStack';

const app = new cdk.App();

const pipelineStack = new PipelineStack(app, 'PipelineStack', {});

// The App class has an option called autoSynth which is set to true by default, so even if you omit app.synth() in your code, it will be executed automatically.
// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.AppProps.html#autosynth
// app.synth();
