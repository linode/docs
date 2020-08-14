---
author:
  name: Linode Community
  email: docs@linode.com
description: 'A VLAN is a private network. This means that devices on a VLAN can communicate only with each other and with devices which are on the physical network, but not with devices that are not part of the VLAN. This guide discusses common use cases for Linode VLAN.'
og_description: 'A VLAN is a private network. This means that devices on a VLAN can communicate only with each other and with devices which are on the physical network, but not with devices that are not part of the VLAN. This guide discusses common use cases for Linode VLAN.'
image:
keywords: ['vlan','virtual local area network','use case']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-08-12
modified_by:
  name: Linode
title: "Common Linode VLAN Use Cases"
h1_title: "Common Use Cases for Linode VLAN"
contributor:
  name: Linode
---

## What is VLAN?

Virtual Local Area Network (VLAN) is a network construct that makes it possible to group large networks logically, based on function, team, or application, and allows multiple workloads to coexist on the same physical device. When you create a virtual network from an existing physical network, it’s called a VLAN.

A VLAN is a private network. This means that devices on a VLAN can communicate only with each other and with devices which are on the physical network, but not with devices that are not part of the VLAN. In other words, broadcast, and multicast, packets sent from one entity in a VLAN only reach other entities that are present in the same VLAN on the same network. This enables you to implement access and security policies to a particular group of users.

### Benefits

VLAN helps you manage the network by segmenting the network, confining the broadcast domains, reducing network traffic, and enforcing security policies.

## Use Cases

Some of the most popular use cases for VLAN are as follows.

### Secure Data and Traffic

If you have sensitive data on your network, you can use a VLAN to help keep it secure. By isolating the devices in the network with privileged data, you decrease the possibility of confidential information breaches. For example, the devices in an organization can be segmented into VLANs such as management, sales, support, guests, and others. The devices in one VLAN cannot access the files in another VLAN.

Likewise, the traffic in the VLAN is secure. All packets sent over the network in the VLAN are private and protected from access by anyone outside of the network.

#### Example: Web Server and Secure Database

![Web Server to VLAN Secure Database Configuration](vlan-web-server-db-config.png "Web Server to VLAN Secure Database Configuration")

In the diagram above, Linode 1 is a web server and has access to the internet over the `eth0` interface. It also has access to Linode 2 and the VLAN over the `eth1` interface. Linode 2 on the VLAN is a secure database that houses sensitive data. Communication between Linode 1 and 2 is transmitted over `eth1` and is secure and private.

#### Example: Kubernetes Cluster

![Kubernetes Cluster with VLAN Configuration](vlan-kubernetes-cluster-config.png "Kubernetes Cluster VLAN Configuration")

In the diagram above, Linode 1 and 2 are both in a Kubernetes cluster. Both nodes have services exposed to the internet over the `eth0` interface and communication between Pods is kept private and secure on the VLAN over the `eth1` interface.

### Cost Effective Segmentation

VLANs reduce the cost of the networking by efficiently using the existing resources and bandwidth. You can build multiple VLANS within an existing network instead of building multiple networks. Segmenting a network into smaller VLANs costs less than creating separate routed networks with routers. Similarly, you can run a secure VLAN in the cloud that is protected from the rest of the internet without generating extra outbound network transfer costs since internal VLAN traffic is internal and private.

![Multiple VLAN Configuration](multi-vlan-config.png "Multiple VLAN Configuration")

In the diagram above, Linode 1 can communicate with both VLANs 1 and 2 over `eth1` interface connections as well as the internet over the `eth0` interface. The Linodes in VLAN 1 can communicate securely with each other. Likewise, the Linodes in VLAN 2 can communicate with each other. However, the Linodes in VLAN 1 and VLAN 2 cannot communicate with each other.

### Network Management

Grouping [Layer 2](https://en.wikipedia.org/wiki/OSI_model#Layer_2:_Data_Link_Layer) networks into multiple broadcast domains reduces unnecessary traffic on the network and increases network performance. Grouping users into virtual networks makes it easy to setup and enforce network policies at a group level.

#### Example: Add a NodeBalancer

![NodeBalancer with VLAN Configuration](nodebalancer-vlan-config.png "NodeBalancer with VLAN Configuration")

You can increase performance and stability by adding a [NodeBalancer](https://www.linode.com/products/nodebalancers/) while securing the communication between two dedicated servers. In the high availability system above, Linodes 1 and 2 both run the same web application. They both have a connection to the VLAN with the network interface `eth1` so they can communicate securely with each other. All communications made over `eth1` are private and secure. They are also connected to a NodeBalancer to manage the load over the `eth0` interface. The NodeBalancer directs traffic, maintains load balancing, and performs active health checks to make sure the system only directs traffic to healthy servers.

## Next Steps

If you're curious about how to setup and run your own VLAN on Linode, read the guide on [Building a Virtual Local Area Network (VLAN) on Linode](/docs/networking/vlan/how-to-build-a-vlan-on-linode).
