---
slug: lke-network-firewall-information-shortguide
description: 'Language that describes the options for creating workloads on Linode Kubernetes Engine that are accessible from the Internet, and directions for creating firewall rules for your nodes.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-06
modified: 2022-11-22
modified_by:
  name: Linode
title: "Network and Filewall Information for Linode Kubernetes Engine Clusters"
headless: true
show_on_rss_feed: false
tags: ["kubernetes"]
aliases: ['/kubernetes/lke-network-firewall-information-shortguide/']
authors: ["Linode"]
---

In an LKE cluster, some entities and services are only accessible from within that cluster while others are publicly accessible (reachable from the internet).

**Private (accessible only within the cluster)**

- Pod IPs, which use a per-cluster virtual network in the range 10.2.0.0/16
- ClusterIP Services, which use a per-cluster virtual network in the range 10.128.0.0/16

**Public (accessible over the internet)**

- NodePort Services, which listen on all Nodes with ports in the range 30000-32768.
- LoadBalancer Services, which automatically deploy and configure a NodeBalancer.
- Any manifest which uses hostNetwork: true and specifies a port.
- Most manifests which use hostPort and specify a port.

Exposing workloads to the public internet through the above methods can be convenient, but this can also carry a security risk. You may wish to manually install firewall rules on your cluster nodes. The following policies are needed to allow communication between the node pools and the control plane and block unwanted traffic:

- **Allow kubelet health checks:** TCP port 10250 from 192.168.128.0/17 Accept
- **Allow Wireguard tunneling for kubectl proxy:** UDP port 51820 from 192.168.128.0/17 Accept
- **Allow Calico BGP traffic:** TCP port 179 from 192.168.128.0/17 Accept
- **Allow NodePorts for workload services:** TCP/UDP port 30000 - 32767 192.168.128.0/17 Accept
- **Block all other TCP traffic:** TCP All Ports All IPv4/All IPv6 Drop
- **Block all other UDP traffic:** UDP All Ports All IPv4/All IPv6 Drop
- **Block all ICMP traffic:** ICMP All Ports All IPv4/All IPv6 Drop
- IPENCAP for IP ranges 192.168.128.0/17 for internal communication between node pools and control plane.

For additional information, [please see this community post](https://www.linode.com/community/questions/19155/securing-k8s-cluster). Future LKE release may allow greater flexibility for the network endpoints of these types of workloads.

Please note, at this time, nodes should be removed from the Cloud Firewall configuration before removing/recycling of node pools within the Kubernetes configuration. Also, when adding node pools to the Kubernetes cluster, Cloud Firewall must be updated with the new node pool(s). Failure to add the new nodes creates a security risk.

{{< note >}}
All new LKE clusters create a service named `Kubernetes` in the `default` namespace designed to ease interactions with the control plane. This is a standard service for LKE clusters.
{{< /note >}}