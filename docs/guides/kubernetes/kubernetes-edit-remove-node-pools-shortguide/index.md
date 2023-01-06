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

1. On your [cluster's details page](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-cluster-s-details-page), click the **Resize Pool** option at the top-right of each entry in the **Node Pools** section.

    ![Access your cluster's resize page](access-clusters-resize-page.png "Access your cluster's resize page")

    Using the sidebar that appears to the right of the page, you can now remove `-` or add `+` Linodes to the pool, and the total cost of your new resources will be displayed. To accept these changes, select the `Save Changes` button to continue.

    {{< note type="alert" respectIndent=false >}}
Shrinking a node pool will result in deletion of Linodes. Any local storage on deleted Linodes (such as "hostPath" and "emptyDir" volumes, or "local" PersistentVolumes) will be erased.
{{< /note >}}

    ![Edit your cluster's node pool](edit-your-node-pool.png "Edit your cluster's node pool")

1. To remove a node pool from the [cluster's details page](#access-your-cluster-s-details-page), click the **Delete Pool** option at the top-right of each entry in the **Node Pools** section. A pop-up message will then appear confirming that you're sure you'd like to proceed with deletion. Select the `Delete` option, and your Node Pool will proceed to be deleted.

    ![Delete your cluster's node pool](delete-node-pool.png "Delete your cluster's node pool")

    {{< note respectIndent=false >}}
Your cluster must always have at least one active node pool.
    {{< /note >}}
