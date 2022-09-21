---
slug: beginners-guide-to-kubernetes-part-5-conclusion
author:
  name: Andy Stevens
  email: docs@linode.com
description: 'This is part five, the conclusion, of a beginners guide to Kubernetes where you were introduced to several concepts relating to Kubernetes technology.'
keywords: ['kubernetes','k8s','beginner','architecture']
tags: ["networking","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-29
modified_by:
  name: Linode
title: "Beginner's Guide to Kubernetes (Part 5): Conclusion"
h1_title: "A Beginner's Guide to Kubernetes (Part 5): Conclusion"
enable_h1: true
contributor:
  name: Linode
concentrations: ["Kubernetes"]
external_resources:
- '[Kubernetes API Documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/)'
- '[Kubernetes Concepts Documentation](https://kubernetes.io/docs/concepts/)'
aliases: ['/applications/containers/kubernetes/beginners-guide-to-kubernetes-part-5-conclusion/','/applications/containers/kubernetes/beginners-guide-to-kubernetes-conclusion/','/kubernetes/beginners-guide-to-kubernetes-part-5-conclusion/']
---

![A Beginner's Guide to Kubernetes](beginners-guide-to-kubernetes.png "A Beginner's Guide to Kubernetes")

{{< note >}}
This is the fifth guide in the [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes) series that explains the major parts and concepts of Kubernetes.
{{< /note >}}

In this guide you will learn about [networking](#networking) in Kubernetes and about [advanced Kubernetes topics](#advanced-topics).

## Networking

Networking in Kubernetes was designed to make it simple to port existing apps from VMs to containers, and subsequently, Pods. The basic requirements of the Kubernetes networking model are:

1.  Pods can communicate with each other across Nodes without the use of [NAT](https://whatismyipaddress.com/nat)
2.  Agents on a Node, like kubelet, can communicate with all of a Node's Pods
3.  In the case of Linux, Pods in a Node's host network can communicate to all other Pods without NAT.

Though the rules of the Kubernetes networking model are simple, the implementation of those rules is an advanced topic. Because Kubernetes does not come with its own implementation, it is up to the user to provide a networking model.

Two of the most popular options are [Flannel](https://github.com/coreos/flannel#flannel) and [Calico](https://docs.projectcalico.org/v2.0/getting-started/kubernetes/).

 - **Flannel** is a networking overlay that meets the functionality of the Kubernetes networking model by supplying a layer 3 network fabric, and is relatively easy to set up.

 - **Calico** enables networking, and networking policy through the [NetworkPolicy API](https://kubernetes.io/docs/concepts/services-networking/network-policies/) to provide simple virtual networking.

For more information on the Kubernetes networking model, and ways to implement it, consult the [cluster networking documentation](https://kubernetes.io/docs/concepts/cluster-administration/networking/).

## Advanced Topics

There are a number of advanced topics in Kubernetes. Below are a few you might find useful as you progress in Kubernetes:

  - [StatefulSets](https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/) can be used when creating stateful applications.
  - [DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) can be used to ensure each Node is running a certain Pod. This is useful for log collection, monitoring, and cluster storage.
  - [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) can automatically scale your deployments based on CPU usage.
  - [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) can schedule [Jobs](#jobs) to run at certain times.
  - [ResourceQuotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) are helpful when working with larger groups where there is a concern that some teams might take up too many resources.

## Next Steps

Now that you are familiar with Kubernetes concepts and components, you can follow the [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/guides/getting-started-with-kubernetes/) guide. This guide provides a hands-on activity to continue learning about Kubernetes.

If you would like to deploy a Kubernetes cluster on Linode for production use, we recommend using one of the following methods instead. These methods are also a much faster way to get a cluster running, and they will also integrate your cluster with some useful Linode plugins:

  - [How to Deploy Kubernetes on Linode with Rancher](/docs/guides/how-to-deploy-kubernetes-on-linode-with-rancher-2-x/)
  - [Use the Linode Terraform Provider](https://www.terraform.io/docs/providers/linode/index.html)
  - [Try the Linode Kubernetes Engine](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/)
