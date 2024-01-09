---
title: Get Started
title_meta: "Getting Started with VPC"
description: ""
keywords: ['networking','vpc','private network']
tags: ["security", "networking", "linode platform"]
tab_group_main:
    weight: 20
published: 2023-10-24
---

## Determine Your Application's Networking Architecture

Consider your application's requirements and determine how your application should communicate both internally and over the public internet. As part of this, review the range of options available for private and public network connectivity on the Linode platform: VPCs, VLANs, Private IPv4 addresses, and Public IPv4/IPv6 addresses. When choosing VPC for private networking (the most common product), determine if segmenting the VPC into multiple subnets is needed. Consider the number of IP addresses you need now (and might need in the future) per subnet and decide on a CIDR range within the [RFC1918](https://datatracker.ietf.org/doc/html/rfc1918) that can accommodate that number. Your subnet must be within the following blocks:

  - 10.0.0.0/8
  - 172.16.0/12

## Create a VPC

Once you've determined that a VPC is needed, you can create it directly in the Cloud Manager using the Create VPC form or by deploying a new Compute Instance and entering a new VPC. During this process, you'll need to define the following parameters:

- **Region:** The data center where the VPC is deployed. Since VPCs are region-specific, only Compute Instances within that region can join the VPC.
- **Label:** A string to identify the VPC. This should be unique to your account.
- **Subnet Label:** A string to identify the subnet, which should be unique compared to other subnets on the same VPC.
- **Subnet CIDR range:** The range of IP addresses that can be used by Compute Instances assigned to this subnet.

While at least 1 subnet must be created, you can create up to 10 subnets per VPC.

Review the [Create a VPC](/docs/products/networking/vpc/guides/create/) guide for complete instructions.

## Assign Compute Instances

You can assign existing Compute Instances to a VPC or, more commonly, deploy a new Compute Instance to the VPC.

- **New Compute Instance:** When creating a Compute Instance, there is an option to add it to an existing VPC. The VPC must already be created in the same data center as selected for the Compute Instance. When assigning a new instance to a VPC, you must also select the subnet that the instance should belong to. By default, an IPv4 address from the subnet's CIDR range will be assigned to the instance, though you can opt to manually enter an IP address. Additionally, public IPv4 connectivity won't be configured by default, though an option is present to configure 1:1 NAT on the VPC interface.

- **Existing Compute Instance:** If you need to add an existing Compute Instance to a VPC, you can do so from the VPC page or by directly editing that instance's Configuration Profile. Advanced users may prefer directly editing their Configuration Profile to avoid causing downtime or interruptions.

For further instructions, review the [Assign (and Remove) Services](/docs/products/networking/vpc/guides/assign-services/) page.