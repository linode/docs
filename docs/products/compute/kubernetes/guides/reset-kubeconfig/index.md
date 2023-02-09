---
author:
  name: Linode
  email: docs@linode.com
title: Reset Kubeconfig
description: "How to reset the kubeconfig for Linode Kubernetes Engine (LKE) clusters."
2023-02-09
published: 2022-03-10
modified: 2023-02-09
---

### Reset Cluster Kubeconfig

In cases where access to a cluster using a current kubeconfig must be revoked, LKE provides the ability to **Reset** a cluster kubeconfig. This will effectively remove the current kubeconfig, and create a new one for cluster administrators to use.

1. To reset the cluster kubeconfig access the [cluster's details page](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-your-clusters-details-page).

1. Select the **Reset** button under the **kubeconfig** sub-category.

![Cluster Kubeconfig Reset](reset-kubeconfig.png "Cluster Node Reset.")

1. A confirmation message will appear confirming the Kubeconfig reset. Select the **Reset kubeconfig** button to proceed.

A new kubeconfig will now be created. Once this process is completed, the new kubeconfig can be [Accessed and Downloaded](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-and-download-your-kubeconfig) as usual.