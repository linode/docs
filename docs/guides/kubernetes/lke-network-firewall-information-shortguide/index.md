---
slug: lke-network-firewall-information-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Language that describes the options for creating workloads on Linode Kubernetes Engine that are accessible from the Internet, and directions for creating firewall rules for your nodes.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-06
modified: 2020-04-06
modified_by:
  name: Linode
title: "Network and Filewall Information for Linode Kubernetes Engine Clusters"
headless: true
show_on_rss_feed: false
tags: ["kubernetes"]
aliases: ['/kubernetes/lke-network-firewall-information-shortguide/']
---

In an LKE cluster, both of the following types of workload endpoints *cannot* be reached from the Internet:

-   Pod IPs, which use a per-cluster virtual network in the range 10.2.0.0/16

-   ClusterIP Services, which use a per-cluster virtual network in the range 10.128.0.0/16

All of the following types of workloads *can* be reached from the Internet:

-   NodePort Services, which listen on all Nodes with ports in the range 30000-32768.

-   LoadBalancer Services, which automatically deploy and configure a NodeBalancer.

-   Any manifest which uses hostNetwork: true and specifies a port.

-   Most manifests which use hostPort and specify a port.

Exposing workloads to the public Internet through the above methods can be convenient, but they can also carry a security risk. You may wish to manually install firewall rules on your cluster nodes; to do so, [please see this community post](https://www.linode.com/community/questions/19155/securing-k8s-cluster). Linode is developing services which will allow for greater flexibility for the network endpoints of these types of workloads in the future.