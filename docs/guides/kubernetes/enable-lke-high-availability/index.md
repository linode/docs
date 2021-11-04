---
slug: enable-lke-high-availability
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to enable High Availability on Linode Kubernetes Engine.'
og_description: 'Enable High Availability on Linode Kubernetes Engine'
keywords: ['kubernetes', 'lke', 'high availability', 'ha']
tags: ["networking","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-04
modified_by:
  name: Linode
title: "How to Enable High Availability for LKE Clusters"
h1_title: "Enabling High Availability for LKE Clusters"
enable_h1: true
_build:
  list: false
noindex: true
---

In LKE, enabling HA ([High Availability](/docs/guides/introduction-to-high-availability/)) will create additional replicas of your [control plane components](/docs/guides/beginners-guide-to-kubernetes-part-2-master-nodes-control-plane/), adding an additional layer of redundancy to your Kubernetes Cluster and decreasing the chance of any potential downtime. HA is an optional feature recommended for production workloads that must be enabled manually either when creating a new cluster or by editing a pre-existing cluster.

Unlike other LKE configuration options, High Availability is an **optional billable service** that will increase the overall operating cost of your cluster. For more information see our [pricing page](https://www.linode.com/pricing/).

{{< caution >}}
While upgrading to an HA cluster is always possible, **downgrading your cluster is not currently supported**. Enabling HA is an **irreversible** change for your cluster.
{{< /caution >}}

## Enabling HA During Cluster Creation

High Availability can be enabled during [cluster creation](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#create-an-lke-cluster) from the **Create a Kubernetes Cluster** page at any time.

1. From the **Create a Kubernetes Cluster** page, navigate to the **Cluster Summary** section.

   ![LKE HA cluster enable](cluster-summary-ha-lke.png "Kubernetes HA upgrade enable.")

1. Check the box next to the **Enable HA Control Plane option**.

1. Create additional configuration options as desired for your configuration. When you are satisfied with the configuration of your cluster, click the **Create Cluster** button in the *Cluster Summary* section.

   ![LKE HA cluster creation](create-cluster-ha.png "Kubernetes HA upgrade on Cluster Creation.")

Your cluster’s detail page will appear on the following page where you will see your Node Pools listed. From this page, you can edit your existing Node Pools, access your Kubeconfig file, and view an overview of your cluster’s resource details.

## Enabling HA on Existing Clusters

High Availability can be added to pre-existing clusters at any given time through the cluster's **Summary Page**.

1. To reach the summary page for the cluster, navigate first to the [Kubernetes section of the Cloud Manager](https://cloud.linode.com/kubernetes/clusters).

1. Select the Cluster by label that you would like to enable HA for. The summary page for the cluster appears.

1. To enable HA, select the **Upgrade to HA** button at the top of the page.

   ![LKE HA cluster upgrade](upgrade-to-ha.png "Kubernetes HA upgrade.")

1. A new window appears, asking you to confirm all of the changes that come with High Availability. Read through the message and select the **Enable HA Control Plane** checkbox to confirm that you agree to the changes. Then click the **Upgrade to HA** button.

   ![LKE HA cluster enable](cluster-ha-enable.png "Kubernetes HA Cluster Enable.")

All clusters that have HA enabled will have an HA Cluster watermark on their summary page.

   ![LKE HA cluster watermark](ha-cluster-watermark.png "LKE HA cluster watermark.")
