import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface SubnetConfig extends Pick<ec2.SubnetConfiguration, 'cidrMask'> {
  tags: Record<string, string>;
}

export interface NetworkStackProps extends cdk.StackProps {
  publicSubnetConfig: SubnetConfig;
  privateSubnetConfig: SubnetConfig;
  databaseSubnetConfig: SubnetConfig;
  maxAzs: number;
  vpcCidr: string;
}

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'ClusterVPC', {
      vpcName: 'cluster-vpc',
      ipAddresses: ec2.IpAddresses.cidr(props.vpcCidr),
      maxAzs: props.maxAzs,

      subnetConfiguration: [
        {
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
          ...props.publicSubnetConfig
        },
        {
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          ...props.privateSubnetConfig
        },
        {
          name: 'DatabaseSubnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          ...props.databaseSubnetConfig
        }
      ],
      natGateways: 1,
      natGatewayProvider: ec2.NatGatewayProvider.gateway()
    });

    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3
    });

    const setSubnetTags = (subnets: cdk.aws_ec2.ISubnet[], tags: Record<string, string>): void => {
      for (let subnet of subnets) {
        for (let [tagKey, tagValue] of Object.entries(tags)) {
          cdk.Tags.of(subnet).add(tagKey, tagValue);
        }
      }
    };

    setSubnetTags(this.vpc.publicSubnets, props.publicSubnetConfig.tags);
    setSubnetTags(this.vpc.privateSubnets, props.privateSubnetConfig.tags);
    setSubnetTags(this.vpc.isolatedSubnets, props.databaseSubnetConfig.tags);
  }
}
