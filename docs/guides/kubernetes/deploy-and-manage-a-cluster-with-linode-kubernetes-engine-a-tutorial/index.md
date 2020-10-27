---
slug: deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial
author:
  name: Linode
  email: docs@linode.com
contributor:
  name: Linode
  link: https://www.linode.com
description: "Learn how to deploy a cluster on Linode Kubernetes Engine (LKE) through the Linode Cloud Manager. The Cloud Manager provides interfaces for selecting hardware resources for your cluster's node pools, and you can modify these after cluster creation."
og_description: "Learn how to deploy a cluster on Linode Kubernetes Engine (LKE) through the Linode Cloud Manager. The Cloud Manager provides interfaces for selecting hardware resources for your cluster's node pools, and you can modify these after cluster creation."
keywords: ["kubernetes", "linode kubernetes engine", "managed kubernetes", "lke", "kubernetes cluster"]
tags: ["linode platform","kubernetes","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-11
modified_by:
  name: Linode
title: 'Deploy and Manage a Cluster with Linode Kubernetes Engine - A Tutorial'
h1_title: A Tutorial for Deploying and Managing a Cluster with Linode Kubernetes Engine
image: deploy-and-manage-cluster.png
external_resources:
 - '[Overview of kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)'
aliases: ['/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/','/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/','/applications/containers/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/']
---

## What is the Linode Kubernetes Engine (LKE)

{{< note >}}
This guide uses Linode Kubernetes Engine (LKE) to deploy a managed Kubernetes cluster. For more information on Kubernetes key concepts, see our [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/)
{{< /note >}}

The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and [simple pricing](https://www.linode.com/pricing/) with the infrastructure efficiency of Kubernetes. When you deploy an LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), [NodeBalancers](/docs/guides/getting-started-with-nodebalancers/) (load balancers), and [Block Storage Volumes](/docs/guides/how-to-use-block-storage-with-your-linode/). Your LKE cluster’s Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers.

{{< disclosure-note "Additional LKE features">}}
* **etcd Backups** : A snapshot of your cluster's metadata is backed up continuously, so your cluster is automatically restored in the event of a failure.
* **High Availability** : All of your control plane components are monitored and automatically recover if they fail.
{{</ disclosure-note>}}

### In this Guide

In this guide you will learn:

 - [How to create a Kubernetes cluster using the Linode Kubernetes Engine.](#create-an-lke-cluster)

 - [How to modify your cluster.](#modify-a-cluster-s-node-pools)

 - [How to delete your cluster.](#delete-a-cluster)

 - [Next Steps after deploying your cluster.](#next-steps)

{{< caution >}}
This guide's example instructions create several billable resources on your Linode account. If you do not want to keep using the example cluster that you create, be sure to [remove it](#delete-a-cluster) when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account.
{{< /caution >}}

## Before You Begin

### Install kubectl

You need to install the kubectl client to your computer before proceeding. Follow the steps corresponding to your computer's operating system.

{{< content "how-to-install-kubectl" >}}

## Create an LKE Cluster

{{< content "kubernetes-create-cluster-shortguide" >}}

## Connect to your LKE Cluster with kubectl

After you've created your LKE cluster using the Cloud Manager, you can begin interacting with and managing your cluster. You connect to it using the kubectl client on your computer. To configure kubectl, download your cluster's *kubeconfig* file.

### Access and Download your kubeconfig

{{< content "kubernetes-download-kubeconfig-shortguide" >}}

### Persist the Kubeconfig Context

If you create a new terminal window, it does not have access to the context that you specified using the previous instructions. This context information can be made persistent between new terminals by setting the [`KUBECONFIG` environment variable](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) in your shell's configuration file.

{{< note >}}
If you are using Windows, review the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) for how to persist your context.
{{< /note >}}

These instructions persist the context for users of the Bash terminal. They are similar for users of other terminals:

1.  Navigate to the `$HOME/.kube` directory:

        cd $HOME/.kube

1.  Create a directory called `configs` within `$HOME/.kube`. You can use this directory to store your kubeconfig files.

        mkdir configs

1. Copy your `kubeconfig.yaml` file to the `$HOME/.kube/configs` directory.

        cp ~/Downloads/kubeconfig.yaml $HOME/.kube/configs/kubeconfig.yaml

    {{< note >}}
Alter the above line with the location of the Downloads folder on your computer.

Optionally, you can give the copied file a different name to help distinguish it from other files in the `configs` directory.
{{< /note >}}

1.  Open up your Bash profile (e.g. `~/.bash_profile`) in the text editor of your choice and add your configuration file to the `$KUBECONFIG` PATH variable.

    If an `export KUBECONFIG` line is already present in the file, append to the end of this line as follows; if it is not present, add this line to the end of your file:

        export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config:$HOME/.kube/configs/kubeconfig.yaml

1.  Close your terminal window and open a new window to receive the changes to the `$KUBECONFIG` variable.

1.  Use the `config get-contexts` command for `kubectl` to view the available cluster contexts:

        kubectl config get-contexts

    You should see output similar to the following:

    {{< output >}}
CURRENT   NAME          CLUSTER   AUTHINFO        NAMESPACE
*         lke1234-ctx   lke1234   lke1234-admin   default
{{</ output >}}

1.  If your context is not already selected, (denoted by an asterisk in the `current` column), switch to this context using the `config use-context` command. Supply the full name of the cluster (including the authorized user and the cluster):

        kubectl config use-context lke1234-ctx

    You should see output like the following:

    {{< output >}}
Switched to context "lke1234-ctx".
{{</ output>}}

1.  You are now ready to interact with your cluster using `kubectl`. You can test the ability to interact with the cluster by retrieving a list of Pods. Use the `get pods` command with the `-A` flag to see all pods running across all namespaces:

        kubectl get pods -A

    You should see output like the following:

    {{< output >}}
NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-dc6cb64cb-4gqf4   1/1     Running   0          11d
kube-system   calico-node-bx2bj                         1/1     Running   0          11d
kube-system   calico-node-fg29m                         1/1     Running   0          11d
kube-system   calico-node-qvvxj                         1/1     Running   0          11d
kube-system   calico-node-xzvpr                         1/1     Running   0          11d
kube-system   coredns-6955765f44-r8b79                  1/1     Running   0          11d
kube-system   coredns-6955765f44-xr5wb                  1/1     Running   0          11d
kube-system   csi-linode-controller-0                   3/3     Running   0          11d
kube-system   csi-linode-node-75lts                     2/2     Running   0          11d
kube-system   csi-linode-node-9qbbh                     2/2     Running   0          11d
kube-system   csi-linode-node-d7bvc                     2/2     Running   0          11d
kube-system   csi-linode-node-h4r6b                     2/2     Running   0          11d
kube-system   kube-proxy-7nk8t                          1/1     Running   0          11d
kube-system   kube-proxy-cq6jk                          1/1     Running   0          11d
kube-system   kube-proxy-gz4dc                          1/1     Running   0          11d
kube-system   kube-proxy-qcjg9                          1/1     Running   0          11d
{{</ output >}}

## Modify a Cluster's Node Pools

You can use the Linode Cloud Manager to modify a cluster's existing node pools by adding or removing nodes. You can also recycle your node pools to replace all of their nodes with new ones that are upgraded to the most recent patch of your cluster's Kubernetes version, or remove entire node pools from your cluster. This section covers completing those tasks. For any other changes to your LKE cluster, you should use kubectl.

### Access your Cluster's Details Page

1.  Click the **Kubernetes** link in the sidebar. The Kubernetes listing page appears and you see all of your clusters listed.

    ![Kubernetes cluster listing page](kubernetes-listing-page.png "Kubernetes cluster listing page.")

1.  Click the cluster that you wish to modify. The Kubernetes cluster's details page appears.

    ![Kubernetes cluster's details page](cluster-details-page.png "Kubernetes cluster's details page.")

### Adding a Node Pool

{{< content "kubernetes-add-node-pool-shortguide" >}}

### Edit, Recycle, or Remove Existing Node Pools

{{< content "kubernetes-edit-remove-node-pools-shortguide" >}}

## Delete a Cluster

{{< content "kubernetes-delete-cluster-shortguide" >}}

## General Network and Firewall Information

{{< content "lke-network-firewall-information-shortguide" >}}

## Next Steps

Now that you have a running LKE cluster, you can start deploying workloads to it. Refer to our other guides to learn more:

 - [How to Deploy a Static Site on Linode Kubernetes Engine](/docs/guides/how-to-deploy-a-static-site-on-linode-kubernetes-engine/)
 - [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/guides/deploy-container-image-to-kubernetes/)
 - [Troubleshooting Kubernetes Guide](/docs/guides/troubleshooting-kubernetes/)
 - [See all our Kubernetes guides](/docs/guides/kubernetes/)
