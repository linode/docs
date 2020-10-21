---
slug: kubernetes-add-node-pool-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to add a Node Pool to your Linode Kubernetes Engine cluster.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Add a Node Pool to Your Linode Kubernetes Engine Cluster
keywords: ["kubernetes"]
headless: true
show_on_rss_feed: false
tags: ["kubernetes"]
aliases: ['/kubernetes/kubernetes-add-node-pool-shortguide/']
---

1. To add a new Node Pool to your cluster, navigate to the [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page) and select the add a node pool option to the right of the node pools section.

    ![Add a node pool to your cluster](add-node-pool-cluster.png "Add a node pool to your cluster")

1. In the new window that appears, select the [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions) that you'd like to add to your new Node Pool. To the right of each plan, select the plus `+` and minus `-` to add or remove a Linode to a node pool one at time. Once you're satisfied with the number of nodes in a node pool, select **Add Pool** to include it in your configuration. If you decide that you need more or fewer hardware resources after you deploy your cluster, you can always [edit your Node Pool](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#edit-or-remove-existing-node-pools).

    ![Add node pool window](view-add-pool-window.png "Add node pool window")
