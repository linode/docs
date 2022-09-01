---
title: VLANs
linkTitle: VLANs
description: "Linode VLANs enable secure and private communication across Linodes within the same data center region. This free service is a great way to keep your cloud workloads secure. VLANs are easy to create using the Linode Cloud Manager, API, and CLI."
bundles: ['network-security']
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-10-22
    product_description: "Fully isolated virtual local area networks that enable private communication between cloud-based resources"
modified: 2022-08-23
aliases: ['/guides/platform/vlan/']
---

**VLANs** are private *virtual local area networks* that are available at no additional cost to Linode users in select data centers. They operate on [layer 2](https://en.wikipedia.org/wiki/OSI_model#Layer_2:_Data_Link_Layer) of the OSI networking model and are entirely isolated from other networks. VLANs are a key part of enabling private and secure communication between Compute Instances on Linode's cloud platform. They function like a virtual network switch, which effectively means all Compute Instances connected to the same VLAN can communicate with each other like they were directly connected to the same physical Ethernet network. Devices outside the network cannot see any traffic within the private network.

## Features

### Private Communication Between Compute Instances

A VLAN creates a truly private network and communication is isolated to just the Compute Instances belonging to the same VLAN. No other Compute Instances on other VLANs or within the same data center can see this private traffic. This goes beyond Linode's [Private IP](/docs/guides/managing-ip-addresses/#types-of-ip-addresses) feature, which can be accessed by any resource in the same data center.

### Simple Configuration

Use the Cloud Manager to create a VLAN and assign Compute Instances. Create up to 10 VLANs per data center and assign each Compute Instance to up to 3 VLANs.

### Reduce Network Transfer Costs

Private network transfer is free. Any communication between Compute Instances over a VLAN does not count against the account's monthly [network transfer allowance](/docs/guides/network-transfer/).

### Part of a Flexible Custom VPC Solution

Since VLANs operate on layer 2 of the OSI networking stack, you can use is as part of a custom VPC solution, which typically operates on layer 3. VLAN users can implement their own firewall policies, routing, and security systems to build out their VPC.

## Availability

| Data center | Status |
| -- | -- |
| **Atlanta (Georgia, USA)** | **Available** |
| Dallas (Texas, USA) | Not yet available |
| Frankfurt (Germany) | *Coming soon* |
| Fremont (California, USA) | Not yet available |
| **London (United Kingdom)** | **Available** |
| **Mumbai (India)** | **Available** |
| Newark (New Jersey, USA) | Not yet available |
| Singapore | Not yet available |
| **Sydney (Australia)** | **Available** |
| Tokyo (Japan) | Not yet available |
| **Toronto (Canada)** | **Available** |

## Pricing

VLANs are free to use. Communication across your private network does not count against your [monthly network transfer usage](/docs/guides/network-transfer/).

## Technical Specifications

- Fully isolated private networking for Cloud-based resources
- Operates on [Layer 2](https://en.wikipedia.org/wiki/OSI_model#Layer_2:_Data_link_layer) of the OSI model (the data link layer) and, as such, can be more flexible than Layer 3 based VPC (Virtual Private Cloud) solutions
- Supports all logical Ethernet features, such as L2 broadcast and L2 multicast
- Supports any [Layer 3](https://en.wikipedia.org/wiki/OSI_model#Layer_3:_Network_layer) protocol, including IP (Internet Protocol)
- User assignable IPv4 addresses
- Each account can maintain up to 10 VLANs per region
- Each Compute Instance can belong to up to 3 VLANs
- Network transfer over a VLAN does not count towards your account's [network transfer allowance](/docs/guides/network-transfer/)

## Additional Limits and Considerations

- **VLANs are region-specific.**  Once created, a VLAN can only be attached to other Linodes within the same data center.

- **VLANs cannot be manually renamed by the user.** If a VLAN's label must be changed, a new VLAN can be created and all required Linodes can be attached to that new VLAN.

- **VLANs cannot be manually deleted by the user.** There is no need to manually delete a VLAN. If a VLAN is no longer needed, simply detach it from all Linodes. After this, it will automatically be deleted within a short timeframe.

- **Network Helper is required for automatic configuration.** If [Network Helper](/docs/guides/network-helper/) has been disabled, the Linode will not *automatically* be able to communicate over the VLAN’s private network. In this case, advanced users can manually adjust their Linode’s internal network configuration files with the appropriate settings for their VLAN. See [Manually configuring a VLAN on a Linode](/docs/products/networking/vlans/guides/manually-configuring-a-vlan/) for instructions.

- **The Public Internet must always use the eth0 network interface.** While VLANs themselves can function without issue on the `eth0` interface, the public internet on Linode will not be networked correctly on other interfaces.