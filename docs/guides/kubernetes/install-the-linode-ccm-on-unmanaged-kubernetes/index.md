---
slug: install-the-linode-ccm-on-unmanaged-kubernetes
title: "Install the Linode CCM on an Unmanaged Kubernetes Cluster"
description: "The Linode CCM uses Linode NodeBalancers to expose your cluster's services externally. Here's how to install it on an unmanaged Kubernetes cluster."
og_description: "This guide includes steps for installing the Linode Cloud Controller Manager (CCM) on an unmanaged Kubernetes cluster. The Linode CCM allows you to use Linode NodeBalancers to expose your cluster's services externally. The steps in this guide are only necessary for specific use cases."
authors: ["Linode"]
contributors: ["Linode"]
published: 2020-07-16
modified: 2024-12-05
keywords: ['kubernetes','cloud controller manager','load balancing','nodebalancers']
tags: ["docker","networking","kubernetes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
image: TutInstall_LinCCM_UnmanagedKubCluster.png
aliases: ['/kubernetes/installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster/','/guides/installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster/']
---

The [Linode Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager/) provides a way for Kubernetes clusters to access additional Linode services. Linode’s CCM provides access to Linode’s load balancing service, [Linode NodeBalancers](/docs/products/networking/nodebalancers/).

NodeBalancers provide your Kubernetes cluster with a reliable way of exposing resources to the public internet. The Linode CCM handles the creation and deletion of the NodeBalancer, and, along with other Master Plane components, correctly identifies the resources, and their networking, that the NodeBalancer will route traffic to. Whenever a Kubernetes Service of the `LoadBalancer` type is created, your Kubernetes cluster will create a Linode NodeBalancer service with the help of the Linode CCM.

{{< note >}}
This guide shows you how to manually install the Linode CCM on an **unmanaged** Kubernetes cluster. This guide exists to support special use cases. For example, if you would like to experiment with various elements of a Kubernetes control plane.

If you would like to use Kubernetes for production scenarios and make use of Linode NodeBalancers to expose your cluster's resources, it is recommended that you [use the Linode Kubernetes Engine to deploy your cluster](/docs/products/compute/kubernetes/). An LKE cluster's control plane has the Linode CCM preinstalled and does not require any of the steps included in this guide.

Another option for deploying Kubernetes clusters on Linode is to use [Cluster API Provider Linode (CAPL)](https://linode.github.io/cluster-api-provider-linode/). It provisions a management Kubernetes cluster which can then be used to provision and manage multiple other child Kubernetes clusters on Linode. It installs CCM by default and supports provisioning Kubernetes clusters using kubeadm, rke2 and k3s.

If you have used the Linode Kubernetes Engine (LKE) or Cluster API Provider Linode (CAPL) to deploy your cluster, you should refer to the [Getting Started with Load Balancing on a Linode Kubernetes Engine (LKE) Cluster](/docs/products/compute/kubernetes/guides/load-balancing/) guide for steps on adding and configuring NodeBalancers on your Kubernetes cluster.
{{< /note >}}

## In this Guide

Instructions are shown for manually installing the Linode CCM on your unmanaged Kubernetes cluster. This includes:

- [Updating your Kubernetes cluster's configuration](#update-your-cluster-configuration) to use the CCM for Node scheduling.

- Two options for installing the Linode CCM:

  - [Using a Helm chart](#install-linode-ccm-using-helm)

  - [Using a helper script to create a manifest file](#install-linode-ccm-using-generated-manifest)

- [Updating the Linode CCM](#updating-the-linode-ccm) running on your cluster with its latest upstream changes.

### Before You Begin

1. Deploy a new **unmanaged** Kubernetes cluster. You can deploy an unmanaged Kubernetes cluster on Linode by following the [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/guides/deploy-kubernetes-cluster-using-kubeadm/)

    {{< note >}}
    It is recommended that you install the Linode CCM on a new Kubernetes cluster, as there are a number of issues that prevent the CCM from running on Nodes that are in the "Ready" state.
    {{< /note >}}

1. Ensure you have [kubectl installed](/docs/guides/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/#install-kubectl) on your local computer and you can access your Kubernetes cluster with it.

1. Generate a [Linode APIv4 token](/docs/products/tools/api/get-started/#get-an-access-token). This is required for both methods of installing the Linode CCM in this guide.

1. [Install Helm](https://helm.sh/docs/intro/install/)

## Running the Linode Cloud Controller Manager

### Update Your Cluster Configuration

In order to run the Linode Cloud Controller Manager:

- You must start `kubelet` with the `--cloud-provider=external` flag.
- `kube-apiserver` and `kube-controller-manager` must NOT supply the `--cloud-provider` flag.

These configurations will change the behavior of your cluster and how it interacts with its Nodes. For more details, visit the [upstream Cloud Controller documentation](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/).

### Install Linode CCM using Helm

Installing the Linode CCM using Helm is the preferred method. Helm chart contents are available in [deploy/chart directory of the linode-cloud-controller-manager GitHub repository](https://github.com/linode/linode-cloud-controller-manager/tree/main/deploy/chart).

1. [Install Helm](https://helm.sh/docs/intro/install/)

1. Install the `ccm-linode` repo.

    ```command
    helm repo add ccm-linode https://linode.github.io/linode-cloud-controller-manager/
    helm repo update ccm-linode
    ```

1. Deploy the `ccm-linode` Helm chart.

    ```command
    export LINODE_API_TOKEN={{< placeholder "YOUR_LINODE_API_TOKEN" >}}
    export REGION={{< placeholder "YOUR_LINODE_REGION" >}}
    helm install ccm-linode --set apiToken=$LINODE_API_TOKEN,region=$REGION ccm-linode/ccm-linode
    ```

For advanced configuration, one can specify their own [values.yaml](https://github.com/linode/linode-cloud-controller-manager/blob/main/deploy/chart/values.yaml) file when installing the Helm chart.

### Install Linode CCM using Generated Manifest

The Linode CCM's GitHub repository provides a helper script that creates a Kubernetes manifest file that you can use to install the CCM on your cluster. These steps should be run on your local computer and were tested on a macOS workstation.

1. [Install Git](/docs/guides/how-to-install-git-on-linux-mac-and-windows/) on your local computer.

1. Clone the [Linode CCM's GitHub repository](https://github.com/linode/linode-cloud-controller-manager).

    ```command
    git clone git@github.com:linode/linode-cloud-controller-manager.git
    ```

1. Move into the CCM repository's `deploy` directory.

    ```command
    cd linode-cloud-controller-manager/deploy/
    ```

1. Run the `generate-manifest.sh` script. Ensure you replace `$LINODE_API_TOKEN` with your own Linode APIv4 token and `us-east` with the Linode region where your cluster resides. To view a list of regions, you can use the [Linode CLI](/docs/products/tools/cli/get-started/), or you can view the [Regions API endpoint](https://api.linode.com/v4/regions).

    ```command
    ./generate-manifest.sh $LINODE_API_TOKEN us-east
    ```

    After running the script, you should have a new manifest file in the repo's `deploy` directory, `ccm-linode.yaml`.

1. Apply the manifest file to your cluster in order to install the Linode CCM and the required supporting resources.

    ```command
    kubectl create -f ccm-linode.yaml
    ```

    {{< note >}}
    You can create your own `ccm-linode.yaml` manifest file by editing the contents of the `ccm-linode-template.yaml` file and changing the values of the `data.apiToken` and `data.region` fields with your own desired values. This template file is located in the `deploy` directory of the Linode CCM repository.
    {{< /note >}}

    {{< note >}}
    Helm can also be used to render the ccm-linode Helm chart and apply it manually.
    {{< /note >}}

    ```command
    cd linode-cloud-controller-manager/
    helm template --set apiToken=$LINODE_API_TOKEN,region=$REGION deploy/chart/
    ```

## Updating the Linode CCM

The easiest way to update the Linode CCM is to edit the DaemonSet that creates the Linode CCM Pod. To do so:

1. Run the `edit` command to make changes to the CCM Daemonset.

    ```command
    kubectl edit ds -n kube-system ccm-linode
    ```

1. The CCM Daemonset manifest will appear in vim. Press `i` to enter insert mode. Navigate to `spec.template.spec.image` and change the field's value to the desired version tag. For instance, if you had the following image:

    ```file
    image: linode/linode-cloud-controller-manager:v0.4.12
    ```

    You could update the image to `v0.4.20` by changing the image tag:

    ```file
    image: linode/linode-cloud-controller-manager:v0.4.20
    ```

    For a complete list of CCM version tags, visit the [CCM DockerHub page](https://hub.docker.com/r/linode/linode-cloud-controller-manager/tags).

    {{< note type="alert" >}}
    The CCM Daemonset manifest may list `latest` as the image version tag. This may or may not be pointed at the latest version. To ensure the latest version, it is recommended to first check the [CCM DockerHub page](https://hub.docker.com/r/linode/linode-cloud-controller-manager/tags), then use the most recent release.
    {{< /note >}}

1. Press escape to exit insert mode, then type `:wq` and press enter to save your changes. A new Pod will be created with the new image, and the old Pod will be deleted.

## Next Steps

Now that you have the Linode CCM installed on your Kubernetes cluster, you can learn how to [add and configure Linode NodeBalancers on your cluster](/docs/products/compute/kubernetes/guides/load-balancing/#configuring-your-linode-nodebalancers-with-annotations).