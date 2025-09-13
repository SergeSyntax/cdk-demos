#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import { clusterName } from '../lib/configs';
import { networkConfig } from '../lib/configs/network';
import { EksStack } from '../lib/EksStack';
import { NetworkStack } from '../lib/stacks/NetworkStack';

const app = new cdk.App();

const networkStack = new NetworkStack(app, 'NetworkStack', networkConfig);

const eksStack = new EksStack(app, 'EksStack', {
  vpc: networkStack.vpc,
  clusterName,
  nodes: {
    general: {
      desiredSize: 2,
      minSize: 1,
      maxSize: 4,
      instanceTypes: [new ec2.InstanceType('t3.medium')],
      capacityType: eks.CapacityType.SPOT,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      labels: { spot: 'true' }
    }
  }
});
