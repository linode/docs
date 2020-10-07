---
slug: kubernetes-create-cluster-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to create a Linode Kubernetes Engine cluster.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Create a Linode Kubernetes Engine Cluster
keywords: ["kubernetes"]
headless: true
show_on_rss_feed: false
tags: ["kubernetes"]
aliases: ['/kubernetes/kubernetes-create-cluster-shortguide/']
---

1.  Log into your [Linode Cloud Manager](https://cloud.linode.com/) account.

1.  From the Linode dashboard, click the **Create** button in the top right-hand side of the screen and select **Kubernetes** from the dropdown menu.

    ![Create a Kubernetes Cluster Screen](create-lke-cluster.png "Create a Kubernetes Cluster Screen")

1. The **Create a Kubernetes Cluster** page will appear. At the top of the page, you'll be required to select the following options:

    - In the **Cluster Label** field, provide a name for your cluster. The name must be unique between all of the clusters on your account. This name will be how you identify your cluster in the Cloud Manager’s Dashboard.

    - From the **Region** dropdown menu, select the **Region** where you would like your cluster to reside.

    - From the **Version** dropdown menu, select a Kubernetes version to deploy to your cluster.

    ![Select your cluster's setting](cluster-options.png "Select your cluster's setting")


1. In the **Add Node Pools** section, select the [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions) for the Linode worker node(s) that make up your LKE cluster. To the right of each plan, select the plus `+` and minus `-` to add or remove a Linode to a node pool one at time. Once you're satisfied with the number of nodes in a node pool, select **Add** to include it in your configuration. If you decide that you need more or fewer hardware resources after you deploy your cluster, you can always [edit your Node Pool](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#edit-or-remove-existing-node-pools).

    {{< note >}}
Currently, the available plan types for LKE worker nodes are [Shared](/docs/platform/how-to-choose-a-linode-plan/#1-shared), [Dedicated CPU](/docs/platform/how-to-choose-a-linode-plan/#4-dedicated-cpu), and [High Memory](/docs/platform/how-to-choose-a-linode-plan/#3-high-memory) plans.
    {{< /note >}}

    ![Select your cluster's resources](select-your-cluster-resources.png "Select your cluster's resources")

1. Once a pool has been added to your configuration, you will see it listed in the **Cluster Summary** on the right-hand side of the Cloud Manager detailing your cluster's hardware resources and monthly cost. Additional pools can be added before finalizing the cluster creation process by repeating the previous step for each additional pool.

    ![Cluster-Summary](your-cluster-summary.png "Cluster-Summary")

1. When you are satisfied with the configuration of your cluster, click the **Create Cluster** button on the right hand side of the screen. Your cluster's detail page will appear on the following page where you will see your Node Pools listed. From this page, you can [edit your existing Node Pools](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#edit-or-remove-existing-node-pools), [access your Kubeconfig file](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-and-download-your-kubeconfig), and view an overview of your cluster's resource details.
