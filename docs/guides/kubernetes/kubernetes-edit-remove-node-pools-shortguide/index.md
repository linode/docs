---
slug: kubernetes-edit-remove-node-pools-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to edit or remove Node Pools in your Linode Kubernetes Engine cluster.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Edit, Recycle, or Remove Node Pools in Your Linode Kubernetes Engine Cluster
keywords: ["kubernetes"]
headless: true
show_on_rss_feed: false
tags: ["kubernetes"]
aliases: ['/kubernetes/kubernetes-edit-remove-node-pools-shortguide/']
---

1. On your [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page), click the **Resize Pool** option at the top-right of each entry in the **Node Pools** section.

    ![Access your cluster's resize page](access-clusters-resize-page.png "Access your cluster's resize page")

    Using the sidebar that appears to the right of the page, you can now remove `-` or add `+` Linodes to the pool, and the total cost of your new resources will be displayed. To accept these changes, select the `Save Changes` button to continue.

    {{< caution >}}
Shrinking a node pool will result in deletion of Linodes. Any local storage on deleted Linodes (such as "hostPath" and "emptyDir" volumes, or "local" PersistentVolumes) will be erased.
{{< /caution >}}

    ![Edit your cluster's node pool](edit-your-node-pool.png "Edit your cluster's node pool")

1. To recycle a node pool from the [cluster's details page](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page), click the **Recycle Nodes** option at the top-right of each entry in the **Node Pools** section. Recycling a node pool will update its nodes to the most recent patch of the cluster's Kubernetes version. A pop-up message will appear confirming that you're sure you'd like to proceed with recycling. Select the `Recycle all Nodes` option, and your Node Pool will proceed to recycle its nodes on a rolling basis so that only one node will be down at a time throughout the recycling process.

    {{< caution >}}
Recycling your node pool involves deleting each of the Linodes in the node pool and replacing them with new Linodes. Any local storage on deleted Linodes (such as "hostPath" and "emptyDir" volumes, or "local" PersistentVolumes) will be erased.
{{< /caution >}}

    ![Recycle your cluster's node pool](recycle-your-node-pool.png "Recycle your cluster's node pool")

1. To remove a node pool from the [cluster's details page](#access-your-cluster-s-details-page), click the **Delete Pool** option at the top-right of each entry in the **Node Pools** section. A pop-up message will then appear confirming that you're sure you'd like to proceed with deletion. Select the `Delete` option, and your Node Pool will proceed to be deleted.

    ![Delete your cluster's node pool](delete-node-pool.png "Delete your cluster's node pool")

    {{< note >}}
Your cluster must always have at least one active node pool.
    {{< /note >}}
