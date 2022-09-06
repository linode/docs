---
slug: installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster
author:
  name: Linode Community
  email: docs@linode.com
description: "The Linode CCM uses Linode NodeBalancers to expose your cluster's services externally. Here's how to install it on an unmanaged Kubernetes cluster."
og_description: "This guide includes steps for installing the Linode Cloud Controller Manager (CCM) on an unmanaged Kubernetes cluster. The Linode CCM allows you to use Linode NodeBalancers to expose your cluster's services externally. The steps in this guide are only necessary for specific use cases."
keywords: ['kubernetes','cloud controller manager','load balancing','nodebalancers']
tags: ["docker","networking","kubernetes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-16
image: TutInstall_LinCCM_UnmanagedKubCluster.png
modified_by:
  name: Linode
title: "Install the Linode CCM on an Unmanaged Kubernetes Cluster"
h1_title: "Installing the Linode CCM on an Unmanaged Kubernetes Cluster"
enable_h1: true
contributor:
  name: Linode
aliases: ['/kubernetes/installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster/']
---

The [Linode Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager/) provides a way for Kubernetes clusters to access additional Linode services. Linode’s CCM provides access to Linode’s load balancing service, [Linode NodeBalancers](/docs/platform/nodebalancer/).

NodeBalancers provide your Kubernetes cluster with a reliable way of exposing resources to the public internet. The Linode CCM handles the creation and deletion of the NodeBalancer, and, along with other Master Plane components, correctly identifies the resources, and their networking, that the NodeBalancer will route traffic to. Whenever a Kubernetes Service of the `LoadBalancer` type is created, your Kubernetes cluster will create a Linode NodeBalancer service with the help of the Linode CCM.

{{< note >}}
This guide will show you how to manually install the Linode CCM on an unmanaged Kubernetes cluster. This guide exists to support special use cases. For example, if you would like to experiment with various elements of a Kubernetes control plane.

If you would like to use Kubernetes for production scenarios and make use of Linode NodeBalancers to expose your cluster's resources, it is recommended that you [use the Linode Kubernetes Engine to deploy your cluster](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/). An LKE cluster's control plane has the Linode CCM preinstalled and does not require any of the steps included in this guide.

Similarly, if you would like to deploy an unmanaged Kubernetes cluster on Linode, the best way to accomplish that is using [Terraform and the Linode K8s module](/docs/guides/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/). The Linode K8s module will also include the Linode CCM preinstalled on the Kubernetes master's control plane and does not require any of the steps included in this guide.

If you have used the Linode Kubernetes Engine (LKE) or the Linode Terraform K8s module to deploy your cluster, you should instead refer to the [Getting Started with Load Balancing on a Linode Kubernetes Engine (LKE) Cluster](/docs/kubernetes/getting-started-with-load-balancing-on-a-lke-cluster/) guide for steps on adding and configuring NodeBalancers on your Kubernetes cluster.
{{</ note >}}

## In this Guide

You will manually install the Linode CCM on your unmanaged Kubernetes cluster. This will include:

- [Updating your Kubernetes cluster's configuration](#update-your-cluster-configuration) to use the CCM for Node scheduling.
- [Using a helper script to create a manifest file](#install-the-linode-ccm) that will install the Linode CCM and supporting resources on your cluster.
- [Updating the Linode CCM](#updating-the-linode-ccm) running on your cluster with its latest upstream changes.

### Before You Begin

1. Deploy a new **unmanaged** Kubernetes cluster. You can deploy an unmanaged Kubernetes cluster on Linode by following the [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/guides/getting-started-with-kubernetes/)

    {{< note >}}
It is recommended that you install the Linode CCM on a new Kubernetes cluster, as there are a number of issues that prevent the CCM from running on Nodes that are in the "Ready" state.
    {{</ note >}}

1. Ensure you have [kubectl installed](/docs/guides/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/#install-kubectl) on your local computer and you can access your Kubernetes cluster with it.

1. [Install Git](/docs/guides/how-to-install-git-on-linux-mac-and-windows/) on your local computer.

1. Generate a [Linode APIv4 token](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token).

## Running the Linode Cloud Controller Manager

### Update Your Cluster Configuration
In order to run the Linode Cloud Controller Manager:

- You must start `kubelet` with the `--cloud-provider=external` flag.
- `kube-apiserver` and `kube-controller-manager` must NOT supply the `--cloud-provider` flag.

These configurations will change the behavior of your cluster and how it interacts with its Nodes. For more details, visit the [upstream Cloud Controller documentation](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/).

### Install the Linode CCM

The Linode CCM's GitHub repository provides a helper script that creates a Kubernetes manifest file that you can use to install the CCM on your cluster. These steps should be run on your local computer and were tested on a macOS.

{{< note >}}
You will need your [Linode APIv4](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) token to complete the steps in this section.
{{</ note >}}

1. Clone the [Linode CCM's GitHub repository](https://github.com/linode/linode-cloud-controller-manager).

        git clone git@github.com:linode/linode-cloud-controller-manager.git

1. Move into the CCM repository's `deploy` directory.

        cd linode-cloud-controller-manager/deploy/

1. Run the `generate-manifest.sh` script. Ensure you replace `$LINODE_API_TOKEN` with your own Linode APIv4 token and `us-east` with the Linode region where your cluster resides. To view a list of regions, you can use the [Linode CLI](/docs/products/tools/cli/get-started/), or you can view the [Regions API endpoint](https://api.linode.com/v4/regions).

        ./generate-manifest.sh $LINODE_API_TOKEN us-east

    After running the script, you should have a new manifest file in the repo's `deploy` directory, `ccm-linode.yaml`.

1. Apply the manifest file to your cluster in order to install the Linode CCM and the required supporting resources.

        kubectl create -f ccm-linode.yaml

    {{< note >}}
You can create your own `ccm-linode.yaml` manifest file by editing the contents of the `ccm-linode-template.yaml` file and changing the values of the `data.apiToken` and `data.region` fields with your own desired values. This template file is located in the `deploy` directory of the Linode CCM repository.
    {{</ note >}}

## Updating the Linode CCM

The easiest way to update the Linode CCM is to edit the DaemonSet that creates the Linode CCM Pod. To do so:

1. Run the `edit` command to make changes to the CCM Daemonset.

        kubectl edit ds -n kube-system ccm-linode

1. The CCM Daemonset manifest will appear in vim. Press `i` to enter insert mode. Navigate to `spec.template.spec.image` and change the field's value to the desired version tag. For instance, if you had the following image:

        image: linode/linode-cloud-controller-manager:v0.2.2

    You could update the image to `v0.2.3` by changing the image tag:

        image: linode/linode-cloud-controller-manager:v0.2.3

      For a complete list of CCM version tags, visit the [CCM DockerHub page](https://hub.docker.com/r/linode/linode-cloud-controller-manager/tags).

    {{< caution >}}
The CCM Daemonset manifest may list `latest` as the image version tag. This may or may not be pointed at the latest version. To ensure the latest version, it is recommended to first check the [CCM DockerHub page](https://hub.docker.com/r/linode/linode-cloud-controller-manager/tags), then use the most recent release.
    {{</ caution>}}

1. Press escape to exit insert mode, then type `:wq` and press enter to save your changes. A new Pod will be created with the new image, and the old Pod will be deleted.

## Next Steps

Now that you have the Linode CCM installed on your Kubernetes cluster, you can learn how to [add and configure Linode NodeBalancers on your cluster](/docs/kubernetes/getting-started-with-load-balancing-on-a-lke-cluster/#configuring-your-linode-nodebalancers-with-annotations).