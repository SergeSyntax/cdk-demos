export const clusterName = process.env.CLUSTER_NAME || 'demo';

export const k8sTags = {
  [`kubernetes.io/cluster/${clusterName}`]: 'owned'
};
