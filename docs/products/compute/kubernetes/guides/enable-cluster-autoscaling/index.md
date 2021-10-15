---
author:
  name: Linode
  email: docs@linode.com
title: Cluster Autoscaling
description: "How to Use Cluster Autoscaling for Linode Kubernetes Engine (LKE)"
---

### Configure Cluster Autoscaling

1. To Enable cluster autoscaling, access the [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-clusters-details-page).

1. Click the **Autoscale Pool** option at the top-left of each entry in the **Node Pools** section. The Autoscaling menu will appear.

1. If the Autoscaler is currently disabled, select the autoscaler switch to turn the feature on.

1. Once the Autoscaler is enabled, the **Minimum** `Min` and **Maximum** `Max` fields can be set. Both the Minimum and Maximum field can be any number between `1` and `99`. Each number represents a set of Nodes in the node pool. A minimum of `10` for example, will allow for no less than ten nodes in the node pool, while a maximum of `10` will allow for no more than ten nodes in the node pool.

1. Select the `Save Changes` button to complete the process, and officially activate the autoscaling feature.

{{< note >}}
The LKE Autoscaler will not automatically increase or decrease the size of the node pool if the current node pool is either below the minimum of the autoscaler, or above the maximum. This behavior can be further described by following examples:

- If the Node pool has 3 nodes in the current node pool and a minimum of 5, the autoscaler will not automatically scale the current node pool up to meet the minimum. It will only scale up if pods are unschedulable otherwise.

- If the Node Pool has 10 nodes in the current node pool and a maximum of 7, the autoscaler will not automatically scale the current node pool down to meet the maximum. It can only scale down when the maximum is at or above the current number of nodes in the node pool. This is an intentional design choice to prevent the disruption of existing workloads.
{{< /note >}}