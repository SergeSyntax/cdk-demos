import { privateDefaultTags, publicLbTags } from '../consts/k8s';
import { NetworkStackProps } from '../stacks/NetworkStack';
import { k8sTags } from './k8s';

export const vpcCidr = process.env.VPC_CIDR || '10.0.0.0/16';
export const vpcMaxAzs = parseInt(process.env.MAX_AZS || '2');
export const publicSubnetCidrMask = parseInt(process.env.PUBLIC_SUBNET_CIDR_MASK || '26');
export const privateSubnetCidrMask = parseInt(process.env.PRIVATE_SUBNET_CIDR_MASK || '19');
export const databaseSubnetCidrMask = parseInt(process.env.DATABASE_SUBNET_CIDR_MASK || '26');

export const networkConfig: NetworkStackProps = {
  vpcCidr: vpcCidr,
  maxAzs: vpcMaxAzs,
  publicSubnetConfig: {
    cidrMask: publicSubnetCidrMask,
    tags: {
      ...k8sTags,
      ...publicLbTags
    }
  },
  privateSubnetConfig: {
    cidrMask: privateSubnetCidrMask,
    tags: {
      ...k8sTags,
      ...privateDefaultTags
      // # required for k8s to discover subnets where private load balancer will be created
      // # eks cluster name : "demo" whith the value owned which means it only used for k8s, it can be "shared" if you share it with other services or other EKS clusters
    }
  },
  databaseSubnetConfig: {
    cidrMask: databaseSubnetCidrMask,
    tags: {}
  }
};
