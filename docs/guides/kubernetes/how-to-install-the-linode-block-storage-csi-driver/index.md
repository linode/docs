---
slug: how-to-install-the-linode-block-storage-csi-driver
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to Install the Linode Block Storage CSI Driver.'
og_description: 'How to Install the Linode Block Storage CSI Driver.'
keywords: ['container','kubernetes','block','storage','volume','csi','interface','driver']
tags: ["linode platform","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-29
modified: 2020-12-02
modified_by:
  name: Linode
title: "How to Install the Linode Block Storage CSI Driver"
h1_title: "Installing the Linode Block Storage CSI Driver"
external_resources:
- '[Kubernetes PersistentVolumeClaims Documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)'
- '[Container Storage Interface (CSI) Spec](https://github.com/container-storage-interface/spec/blob/master/spec.md)'
aliases: ['/kubernetes/how-to-install-the-linode-block-storage-csi-driver/']
---

## What is the Linode Block Storage CSI Driver?

The [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) defines a standard that storage providers can use to expose block and file storage systems to container orchestration systems. Linode's Block Storage CSI driver follows this specification to allow container orchestration systems, like Kubernetes, to use [Block Storage Volumes](/docs/products/storage/block-storage/) to persist data despite a Pod's lifecycle. A Block Storage Volume can be attached to any Linode to provide additional storage.

## Before You Begin

This guide assumes you have a working Kubernetes cluster running on Linode. If you have already created a Kubernetes cluster managed with [LKE](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/), then the Block Storage CSI driver and the `linode` secret token will already be pre-installed on your cluster. See the [Deploying Persistent Volume Claims with the Linode Block Storage CSI Driver](/docs/guides/deploy-volumes-with-the-linode-block-storage-csi-driver) guide for the next steps for working with Persistent Volume Claims.

If you are not using LKE or the [Kubernetes Terraform installer](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2), the Kubernetes cluster will require the Block Storage CSI driver to be installed on the cluster in order to use Linode's Block Storage. If you need to set up an unmanaged Kubernetes cluster, you can follow the [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/guides/getting-started-with-kubernetes/) guide to do this.

The Linode Block Storage CSI driver **absolutely requires** that the Linode Cloud Controller Manager (CCM) is pre-installed and running on your cluster in order for the CSI to be installed. Follow the steps in our [CCM installation guide](/docs/guides/installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster/) before proceeding.

{{< note >}}
The Block Storage CSI supports Kubernetes version 1.13 or higher. To check the version of Kubernetes you are running, you can issue the following command:

    kubectl version
{{</ note >}}

## Installing the CSI Driver
### Create a Kubernetes Secret

A secret in Kubernetes is any token, password, or credential that you want Kubernetes to store for you. In the case of the Block Storage CSI, you want to store an API token, and for convenience, the region you would like your Block Storage Volume to be placed in.

{{< note >}}
Your Block Storage Volume must be in the same data center as your Kubernetes cluster.
{{</ note >}}

To create an API token:

1.  Log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Navigate to your account profile by clicking on your username at the top of the page and selecting **My Profile**. On mobile screen resolutions, this link is in the sidebar navigation.

1.  Click on the **API Tokens** tab.

1.  Click on **Add a Personal Access Token**. The *Add Personal Access Token* menu appears.

1.  Provide a label for the token. This is how you reference your token within the Cloud Manager.

1.  Set an expiration date for the token with the **Expiry** dropdown.

1.  Set your permissions for the token. You need Read/Write access for Volumes, and Read/Write access for Linodes.

1.  Click **Submit**.

Your access token appears on the screen. Copy this down somewhere safe, as once you click **OK** you can not retrieve the token again. If you lose it, forget it, or you think it may have become compromised, you need to create a new one.

Once you have your API token, it's time to create your secret.

1.  Run the following command to enter your token into memory:

        read -s -p "Linode API Access Token: " LINODE_TOKEN

    Press enter, and then paste in your API token.

1.  Run the following command to enter your region into memory:

        read -p "Linode Region of Cluster: " LINODE_REGION

    You can retrieve a full list of regions by using the [Linode CLI](/docs/products/tools/cli/get-started/):

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

    kubectl apply -f https://raw.githubusercontent.com/linode/linode-blockstorage-csi-driver/master/pkg/linode-bs/deploy/releases/linode-blockstorage-csi-driver.yaml

The above file concatenates a few files needed to run the Block Storage CSI driver, including the volume attachment, driver registration, and provisioning sidecars. To see these files individually, visit the project's [GitHub repository](https://github.com/linode/linode-blockstorage-csi-driver/tree/master/pkg/linode-bs/deploy/releases/).

### Next Steps

Once you have the Block Storage CSI driver installed, you are ready to [provision a Persistent Volume Claim](/docs/guides/deploy-volumes-with-the-linode-block-storage-csi-driver).
