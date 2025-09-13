import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { networkConfig, vpcCidr } from '../../lib/configs/network';
import { NetworkStack } from '../../lib/stacks/NetworkStack';

describe('NetworkStack', () => {
  let app: cdk.App;
  let stack: NetworkStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App({
      outdir: 'cdk.out'
    });
    stack = new NetworkStack(app, 'TestNetworkStack', networkConfig);
    template = Template.fromStack(stack);
  });

  describe('VPC Creation', () => {
    test('should create VPC with correct properties', () => {
      template.hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: vpcCidr,
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: 'default',
        Tags: Match.arrayWith([
          {
            Key: 'Name',
            Value: 'cluster-vpc'
          }
        ])
      });
    });
  });
});
