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

Exposing workloads to the public Internet through the above methods can be convenient, but they can also carry a security risk. Due to this, additional security cosniderations can be added, including manually installing firewall rules on your cluster nodes, or using [Linode Cloud Firewalls](/docs/guides/getting-started-with-cloud-firewall/) to help remediate these risks.

When configuring security controls it is important to note that **all** LKE nodes have SSH enabled by default, configured with a randomly generated root password that meets password strength requirements tested by the Linode API. Users who wish to access their nodes manually via SSH can reset the password using the [Settings Tab in the Linode Cloud Manager](/docs/guides/reset-the-root-password-on-your-linode/). SSH is not required by LKE, though some users may benefit from access in some troubleshooting scenarios. For a higher level of security, port `22` can be safely closed.

In an LKE cluster, it is required that the following ports are left open in the firewall to ensure the functionality of the cluster:

- TCP port `10250` and `10256` inbound from `192.168.128.0/17`. These ports are used for Kubelet health checks.

- UDP port `51820` inbound from `192.168.128.0/17`. This is required so that Wireguard tunneling works for kubectl proxy.

- TCP port `179` inbound from `192.168.128.0/17`. This is used for Calico BGP traffic.

- (Recommended) TCP/UDP ports `30000` - `32767` from `All`. These ports are the NodePorts used for relaying inbound traffic from users on the internet to backend pods and services. While it is not strictly necessary to allow all traffic to all NodePorts, unless the behavior of the NodePorts are both clearly defined and static, selectively blocking NodePorts may cause issues.

Additional security considerations for an LKE cluster includes the addition of [RBAC (Role Based Access Control) and Service Accounts](/docs/guides/using-rbac-to-secure-an-lke-cluster/).







