---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to Install the Linode Block Storage CSI Driver.'
og_description: 'How to Install the Linode Block Storage CSI Driver.'
keywords: ['container','kubernetes','block','storage','volume','csi','interface','driver']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-29
modified: 2020-07-29
modified_by:
  name: Linode
title: "How to Install the Linode Block Storage CSI Driver"
h1_title: "Installing the Linode Block Storage CSI Driver"
external_resources:
- '[Kubernetes PersistentVolumeClaims Documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)'
- '[Container Storage Interface (CSI) Spec](https://github.com/container-storage-interface/spec/blob/master/spec.md)'
---

## What is the Linode Block Storage CSI Driver?

The [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) defines a standard that storage providers can use to expose block and file storage systems to container orchestration systems. Linode's Block Storage CSI driver follows this specification to allow container orchestration systems, like Kubernetes, to use [Block Storage Volumes](https://www.linode.com/docs/platform/block-storage/) to persist data despite a Pod's lifecycle. A Block Storage Volume can be attached to any Linode to provide additional storage.

## Before You Begin

This guide assumes you have a working Kubernetes cluster running on Linode. You can deploy a Kubernetes cluster on Linode in the following ways:

1. Use the [Linode Kubernetes Engine (LKE)](https://www.linode.com/products/kubernetes/) to deploy a cluster. LKE is Linode's managed Kubernetes service. You can deploy a Kubernetes cluster using:

    - The [Linode Cloud Manager](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).
    - [Linode's API v4](/docs/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/).
    - [Terraform](/docs/kubernetes/how-to-deploy-an-lke-cluster-using-terraform/), the popular infrastructure as code (IaC) tool.

1. Deploy an [unmanaged Kubernetes cluster using Terraform](/docs/applications/configuration-management/terraform/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/) and the [Kubernetes Terraform installer](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2).

1. Use kubeadm to manually deploy a Kubernetes cluster on Linode. You can follow the [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/kubernetes/getting-started-with-kubernetes/) guide to do this.

    {{< note >}}
The Block Storage CSI supports Kubernetes version 1.13 or higher. To check the version of Kubernetes you are running, you can issue the following command:

    kubectl version
    {{</ note >}}

Using either the Linode Kubernetes Engine or Terraform methods above will install both the Linode Block Storage CSI Driver and and the `linode` secret token described below as part of their deployment methods automatically. See the [Deploying Persistent Volume Claims with the Linode Block Storage CSI Driver](/docs/kubernetes/deploy-volumes-with-the-linode-block-storage-csi-driver) guide for the next steps for working with Persistent Volume Claims.

However, deploying a Kubernetes cluster with kubeadm will **not** install the CSI Driver, and you will want to follow the instructions below.

## Installing the CSI Driver
### Create a Kubernetes Secret

A secret in Kubernetes is any token, password, or credential that you want Kubernetes to store for you. In the case of the Block Storage CSI, you'll want to store an API token, and for convenience, the region you would like your Block Storage Volume to be placed in.

{{< note >}}
Your Block Storage Volume must be in the same data center as your Kubernetes cluster.
{{</ note >}}

To create an API token:

1.  Log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Navigate to your account profile by clicking on your username at the top of the page and selecting **My Profile**. On mobile screen resolutions, this link is in the sidebar navigation.

1.  Click on the **API Tokens** tab.

1.  Click on **Add a Personal Access Token**. The *Add Personal Access Token* menu appears.

1.  Provide a label for the token. This is how you will reference your token within the Cloud Manager.

1.  Set an expiration date for the token with the **Expiry** dropdown.

1.  Set your permissions for the token. You will need Read/Write access for Volumes, and Read/Write access for Linodes.

1.  Click **Submit**.

Your access token will appear on the screen. Copy this down somewhere safe, as once you click **OK** you will not be able to retrieve the token again, and will need to create a new one.

Once you have your API token, it's time to create your secret.

1.  Run the following command to enter your token into memory:

        read -s -p "Linode API Access Token: " LINODE_TOKEN

    Press enter, and then paste in your API token.

1.  Run the following command to enter your region into memory:

        read -p "Linode Region of Cluster: " LINODE_REGION

    You can retrieve a full list of regions by using the [Linode CLI](/docs/platform/api/using-the-linode-cli/):

        linode-cli regions list

    For example, if you want to use the Newark, NJ, USA data center, you would use `us-east` as your region.

1.  Create the secret by piping in the following secret manifest to the `kubectl create` command. Issue the following command:

        cat <<EOF | kubectl create -f -

1.  Now, paste in the following manifest and press enter:

        apiVersion: v1
        kind: Secret
        metadata:
          name: linode
          namespace: kube-system
        stringData:
          token: "$LINODE_TOKEN"
          region: "$LINODE_REGION"
        EOF

    You can check to see if the command was successful by running the `get secrets` command in the `kube-system` namespaces and looking for `linode` in the NAME column of the output:

        kubectl -n kube-system get secrets

    You should see output similar to the following:

        NAME                                             TYPE                                  DATA   AGE
        ...
        job-controller-token-6zzkw                       kubernetes.io/service-account-token   3      43h
        kube-proxy-token-td7k8                           kubernetes.io/service-account-token   3      43h
        linode                                           Opaque                                2      42h
        ...

    You are now ready to install the Block Storage CSI driver.

### Apply CSI Driver to your Cluster

To install the Block Storage CSI driver, use the `apply` command and specify the following URL:

    kubectl apply -f https://raw.githubusercontent.com/linode/linode-blockstorage-csi-driver/master/pkg/linode-bs/deploy/releases/linode-blockstorage-csi-driver-v0.1.6.yaml

The above file concatenates a few files needed to run the Block Storage CSI driver, including the volume attachment, driver registration, and provisioning sidecars. To see these files individually, visit the project's [GitHub repository](https://github.com/linode/linode-blockstorage-csi-driver/tree/master/pkg/linode-bs/deploy/kubernetes/).

### Next Steps

Once you have the Block Storage CSI driver installed, you are ready to [provision a Persistent Volume Claim](/docs/kubernetes/deploy-volumes-with-the-linode-block-storage-csi-driver).
