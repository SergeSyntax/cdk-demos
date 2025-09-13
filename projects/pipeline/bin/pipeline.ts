#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/PipelineStack';

const app = new cdk.App();

const pipelineStack = new PipelineStack(app, 'PipelineStack', {});

app.synth();
