---
author:
  name: Linode
  email: docs@linode.com
title: Recycle Nodes
description: "How to recycle nodes on LKE"
---

Nodes can be recycled by selected the recycle option for an individual node, in a node pool or, or for all nodes in the cluster. All recycle options are found in the [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page)

- To recycle all Nodes on all Node Pools in a cluster, select the **Recycle All Nodes** option to the right of the **Node Pools** section.

- To recycle a node pool from the [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page), click the **Recycle Nodes** option at the top-right of each entry in the **Node Pools** section.

- To recycle an individual Node, find the **Node Pools** section on the [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page), find the individual node that will be recycled, and click on the **Recycle** button to the right of the respective entry.

When selecting any recycle option a pop-up message will appear confirming that the node or nodes will be recycled. Select the `Recycle` option, and your Node or Node Pool will proceed to recycle its nodes. If the **Recycle all Nodes** or **Recycle Nodes** option are selected, then nodes will be upgraded on a rolling basis so that only one node will be down at a time throughout the recycling process.