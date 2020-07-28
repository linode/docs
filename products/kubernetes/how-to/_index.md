---
title: How-To
description: "The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and simple pricing with the infrastructure efficiency of Kubernetes. When you deploy an LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), NodeBalancers (load balancers), and Block Storage Volumes. Your LKE cluster’s Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers."
tab_group_main:
    weight: 30
---

## Building Blocks

These introductory guides to the Linode Kubernetes Engine (LKE) will get you up and running and consider some common use cases.

### Kubernetes Basics

#### Clusters

-  [Install kubectl](/docs/products/kubernetes/how-to/install-kubectl): Before you create a cluster with LKE, you’ll need to install kubectl on your local machine.
-  [Create an LKE Cluster](/docs/products/kubernetes/how-to/create-lke-cluster): Quickly and easily create an LKE cluster from the Cloud Manager with a just a few clicks.
-  [Download Your kubeconfg](/docs/products/kubernetes/how-to/download-kubeconfig): Download the kubeconfig file so you can interact with your cluster with kubectl from the command line.
-  [Delete an LKE Cluster](/docs/products/kubernetes/how-to/delete-cluster): You can delete an entire cluster from the Cloud Manager.

#### Node Pools

-  [Add a Node Pool](/docs/products/kubernetes/how-to/add-node-pool): You can add a Node Pool to your cluster from the Cloud Manager.
-  [Edit or Remove Node Pools](/docs/products/kubernetes/how-to/edit-remove-node-pools): You can easily edit or remove existing Node Pools from the Cloud Manager.

For more information on deploying your first cluster with Linode Kubernetes Engine, see the full guide, [Deploy and Manage a Cluster with Linode Kubernetes Engine - A Tutorial](https://www.linode.com/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) (this link takes you to the `Guides` section of the website).
