---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use cases for Linode VLAN'
image:
keywords: ['vlan','virtual local area network','use','case']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-08-12
modified_by:
  name: Linode
title: "Use Cases for Linode VLAN"
contributor:
  name: Linode
---


## What is VLAN?

Virtual Local Area Network (VLAN) is a network construct that makes it possible to group large networks logically, based on function, team, or application, and allows multiple workloads to coexist on the same physical device. When you create a virtual network from an existing physical network, it’s called a VLAN. Devices on a VLAN can only communicate with each other and devices which are on the physical network. However, the devices in a VLAN cannot communicate with devices that are not part of the VLAN.In other words, broadcast, and multicast packets sent from one entity in a VLAN only reaches other entities that are present in the same VLAN on the same network. Thus enables you to implement access and security policies to a particular group of users.


### Benefits

VLAN helps you manage the network by segmenting the network, confining the broadcast domains, reducing network traffic, and enforcing security policies.

## Use Cases

Some of the most popular use cases for VLAN are as follows:

### Security

It is important that the devices that contain sensitive data are separated from the rest of the network. The isolation of the devices in the network decreases the possibility of confidential information breaches. For example, the devices in an organization can be segmented into VLANs such as management, sales, support, guests, and others. The devices in one VLAN cannot access the files in another VLAN.

### Cost Effective

VLANs reduce the cost of the network by efficiently using the existing resources and bandwidth. Segmenting a network into smaller VLAN costs less than creating a routed network with routers.

### Flexibility

When a user on one VLAN moves to a new physical location but continues to perform the same job function, the devices of that user not need to be reconfigured. Similarly, if a user changes a job function, the user does need not have to change the device you can simply change the VLAN membership of the device to that of the new team.


### Network Management

Grouping the Layer 2 networks into multiple broadcast domains reduces unnecessary traffic on the network and increases network performance. Grouping of users into the virtual networks, makes it easy to set up and enforce network policies at a group level. Securing the communication between two dedicated server increases the performance. For example, you can add two Linodes that run a web application to a VLAN and these Linodes have two network interfaces — eth0 and eth1. The eth0 interface is attached to the Internet and the eth1 interface is attached to VLAN. All communications made over eth1 are totally private and secure. You can then add a NodeBalancer to manage the load over eth0 interface.


## Next Steps

If you're curious about how to use Object Storage, you can read our guide on [How to Build a Private Network]() for detailed instructions on creating buckets and uploading objects.
