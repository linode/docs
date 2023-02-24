---
author:
  name: Linode
  email: docs@linode.com
title: High Availability
description: "How to Enable High Availability for Linode Kubernetes Engine (LKE)"
---

{{< note type="alert" >}}
While upgrading to an HA cluster is always possible, **downgrading your cluster is not currently supported**. Enabling HA is an **irreversible** change for your cluster.

Additionally, Enabling HA will result in the following changes:

- All nodes will be deleted and new nodes will be created to replace them.
- Any local storage (such as `hostPath` volumes) will be erased.
- The upgrade process may take several minutes to complete, as nodes will be replaced on a rolling basis.
{{< /note >}}

### Enabling HA During Cluster Creation

High Availability can be enabled during [cluster creation](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#create-an-lke-cluster) from the **Create a Kubernetes Cluster** page at any time.

1. From the **Create a Kubernetes Cluster** page, navigate to the **Cluster Summary** section.

1. Check the box next to the **Enable HA Control Plane option**.

1. Create additional configuration options as desired for your configuration. When you are satisfied with the configuration of your cluster, click the **Create Cluster** button in the *Cluster Summary* section.

Your cluster’s detail page will appear on the following page where you will see your Node Pools listed. From this page, you can edit your existing Node Pools, access your Kubeconfig file, and view an overview of your cluster’s resource details.

### Enabling HA on Existing Clusters

High Availability can be added to pre-existing clusters at any given time through the cluster's **Summary Page**.

1. To reach the summary page for the cluster, navigate first to the [Kubernetes section of the Cloud Manager](https://cloud.linode.com/kubernetes/clusters).

1. Select the Cluster by label that you would like to enable HA for. The summary page for the cluster appears.

1. To enable HA, select the **Upgrade to HA** button at the top of the page.

1. A new window appears, asking you to confirm all of the changes that come with High Availability. Read through the message and select the **Enable HA Control Plane** checkbox to confirm that you agree to the changes. Then click the **Upgrade to HA** button.

All clusters that have HA enabled will have an HA Cluster watermark on their summary page.