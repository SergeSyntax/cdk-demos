import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { defaultAddons } from './consts';
// import { defaultAddons } from './consts/default-addons';

export interface EksNode extends cdk.aws_eks.NodegroupOptions {}

export interface EksStackProps extends cdk.StackProps {
  clusterName: string;
  vpc: ec2.Vpc;
  nodes: Record<string, EksNode>;
}

export class EksStack extends cdk.Stack {
  public readonly cluster: eks.Cluster;

  constructor(scope: Construct, id: string, props: EksStackProps) {
    super(scope, id);

    const clusterRole = new iam.Role(this, 'EksClusterRole', {
      roleName: `${props.clusterName}-eks-cluster`,
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy')]
    });

    const nodeRole = new iam.Role(this, 'EksNodeRole', {
      roleName: `${props.clusterName}-eks-nodes`,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore') // to connect directly to the node
      ]
    });

    this.cluster = new eks.Cluster(this, 'EksCluster', {
      clusterName: props.clusterName,
      vpc: props.vpc,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
      version: eks.KubernetesVersion.V1_31,
      defaultCapacity: 0,
      role: clusterRole,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      kubectlLayer: new KubectlV31Layer(this, 'KubectlLayer') as any,
      authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
      bootstrapClusterCreatorAdminPermissions: true,
      bootstrapSelfManagedAddons: false
      // clusterLogging: [
      //   eks.ClusterLoggingTypes.API,
      //   eks.ClusterLoggingTypes.AUTHENTICATOR,
      //   eks.ClusterLoggingTypes.AUDIT
      // ]
    });

    for (const [nodeGroupName, nodeGroupConfig] of Object.entries(props.nodes))
      this.cluster.addNodegroupCapacity(nodeGroupName, {
        ...nodeGroupConfig,
        nodeRole
      });

    for (const { constructId, ...addonConfig } of defaultAddons) {
      new eks.CfnAddon(this, constructId, {
        clusterName: this.cluster.clusterName,
        ...addonConfig
      });
    }
  }
}
