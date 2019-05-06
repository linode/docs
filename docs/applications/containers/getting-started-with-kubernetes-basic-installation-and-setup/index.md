---
author:
  name: Linode
description: 'Learn how to deploy a Kubernetes Cluster on Linode, including the Linode CSI and CCM.'
keywords: ["kubernetes","cluster","docker","container","deployment","csi","ccm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2019-02-25
title: 'Getting Started with Kubernetes - Basic Installation and Setup'
external_resources:
- '[Kubernetes](https://kubernetes.io/)'
- '[Linode Cloud Controller Manager on GitHub](https://github.com/linode/linode-cloud-controller-manager)'
- '[Linode Block Storage CSI Driver on GitHub](https://github.com/linode/linode-blockstorage-csi-driver)'
---

EDITOR's NOTE: The guide has users deploy an example service/application at three points:

- After setting up the basic cluster
- After installing the CSI
- After installing the CCM

If we can figure out a single example (that's not too complicated) that we can expand on in each of those sections, that would be great. The CSI expansion of the example would show off how a volume could benefit the application. The CCM expansion of the example would show off load balancing (via NodeBalancers) and External-DNS.

-------

Brief description of what Kubernetes is and what jobs it takes care of:

- Manages the lifecycles of applications running in containers
- Takes care of upgrades
- Takes care of high availability
- All that other good Kubernetes stuff

If we write a conceptual "A Beginner's Guide to Kubernetes", link to that here.

Description of the scope of this guide:

- This guide will explain how to set up a Kubernetes cluster "by hand": creating Linodes via the Manager, then installing Docker and the Kubernetes components. Similar to how Linux Academy does it.
- This guide will also show how to set up the Linode CSI and CCM.

For a quicker start with Kubernetes, go to the [Kubernetes Quick Start with Terraform and the Linode CLI]() guide.

EDITOR's NOTE: That guide doesn't exist yet. I think that we should write such a "quick start" guide that expand's on Marques's community site post: https://www.linode.com/community/questions/17611/the-linode-kubernetes-module-for-terraform

## Set Up your Kubernetes Cluster

### Create the Linodes

1. In the Linode Manager, create three Linodes: one for the master, one for two Nodes
2. Harden each node and created a limited user

### Install Docker

Install Docker on each Linode

### Install Kubernetes components

Install kubeadm/kubelet/kubectl
https://linuxacademy.com/cp/courses/lesson/course/3515/lesson/4/module/281

### Bootstrap the Cluster

Run `kubeadm init`, copy the config to the user home dir, and run the `kubeadm join` command
https://linuxacademy.com/cp/courses/lesson/course/3515/lesson/5/module/281

### Configure Cluster Networking

This other guide uses Calico:
https://linode.com/docs/applications/containers/how-to-deploy-nginx-on-a-kubernetes-cluster/

Linux Academy uses Flannel:
https://linuxacademy.com/cp/courses/lesson/course/3515/lesson/6/module/281

We'll need to choose one here.

### Deploy a Service

Create a deployment and a service of something simple a la Linux Academy:

https://linuxacademy.com/cp/courses/lesson/course/3517/lesson/1/module/281
https://linuxacademy.com/cp/courses/lesson/course/3517/lesson/2/module/281

They use NGINX.

## Set Up the Linode CSI

Section explaining what a Kubernetes CSI is and how it relates to Linode:

- A CSI is the Kubernetes way of setting up persistent storage
- The Linode CSI sets up Block Storage Volumes for this

### Deploy the CSI

Adapt instructions from GitHub and Community Site:
https://github.com/linode/linode-blockstorage-csi-driver#deployment
https://www.linode.com/community/questions/17538/linode-block-storage-csi-driver

### Example Usage of the CSI

Deploy a service/application which uses the CSI. Maybe use the example from GitHub/Community Site, or use another one:
https://github.com/linode/linode-blockstorage-csi-driver#example-usage

## Set Up the Linode CCM

Section explaining what a Kubernetes CCM is and how it relates to Linode:

- From Linode CCM README on GitHub:

    The Linode Cloud Controller Manager (CCM) creates a fully supported Kubernetes experience on Linode.

    Load balancers, Linode NodeBalancers, are automatically deployed when a Kubernetes Service of type "LoadBalancer" is deployed. This is the most reliable way to allow services running in your cluster to be reachable from the Internet.
    Linode hostnames and network addresses (private/public IPs) are automatically associated with their corresponding Kubernetes resources, forming the basis for a variety of Kubernetes features.
    Nodes resources are put into the correct state when Linodes are shut down, allowing pods to be appropriately rescheduled.
    Nodes are annotated with the Linode region, which is the basis for scheduling based on failure domains.

### Deploy the CCM

### Example Usage of the CCM

## Next Steps

Talk about how clusters can be set up in a number of different ways:

- Via the Terraform module and Linode-CLI. Link to potential quick start guide that explains these two options.
- Via Rancher. Link to Rancher guide (being drafted now)
- Anything else we should include? double-check with #kubernetes

Link to any other Kubernetes guides we write.