---
author:
  name: Linode
  email: docs@linode.com
title: Upgrade LKE Cluster
description: "How to upgrade an LKE Cluster"
---

### Upgrade a Cluster

1. To Upgrade a cluster access the [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page).

1. If an upgrade is available, a banner will appear that will display the next available Kubernetes version. Select the **Upgrade Version** button at the end of the banner to upgrade to the next available Kubernetes version.

1. Upgrading a cluster is a two step process which involves first setting the Cluster to use the next version when Nodes are Recycled, and then Recycling all of the Nodes within the Cluster.

1. For step 1, click on the **Upgrade Version** button to complete the upgrade process.

   {{< note >}}
If step one of the upgrade process is completed without the completion of step two, the nodes in the cluster will need to be recycled using the [Recycle all Nodes](##Recycle-a-Cluster-or-Nodes) button.
{{< /note >}}

1. For step 2, click on the **Recycle All Nodes** button to set all nodes to complete the upgrade process. Nodes will be recycled on a rolling basis so that only one node will be down at a time throughout the recycling process.