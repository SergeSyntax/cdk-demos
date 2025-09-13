import * as cdk from 'aws-cdk-lib';

export interface Addon {
  constructId: string;
  addonName: cdk.aws_eks.CfnAddon['addonName'];
  resolveConflicts: cdk.aws_eks.CfnAddon['resolveConflicts'];
  addonVersion: cdk.aws_eks.CfnAddon['addonVersion'];
}

export const defaultAddons: Addon[] = [
  {
    constructId: 'VpcCniAddon',
    addonName: 'vpc-cni',
    resolveConflicts: 'OVERWRITE',
    addonVersion: 'v1.20.1-eksbuild.3'
  },
  {
    constructId: 'CoreDnsAddon',
    addonName: 'coredns',
    resolveConflicts: 'OVERWRITE',
    addonVersion: 'v1.11.4-eksbuild.22'
  },
  {
    constructId: 'KubeProxyAddon',
    addonName: 'kube-proxy',
    resolveConflicts: 'OVERWRITE',
    addonVersion: 'v1.31.10-eksbuild.8'
  },
  {
    constructId: 'EbsCsiAddon',
    addonName: 'aws-ebs-csi-driver',
    resolveConflicts: 'OVERWRITE',
    addonVersion: 'v1.48.0-eksbuild.2'
  },
  {
    constructId: 'PodIdentityAddon',
    addonName: 'eks-pod-identity-agent',
    resolveConflicts: 'PRESERVE',
    addonVersion: 'v1.3.8-eksbuild.2'
  }
];

export const publicLbTags = {
  'kubernetes.io/role/elb': '1'
};

export const privateDefaultTags = {
  'kubernetes.io/role/internal-elb': '1'
};
