---
title: Get Started
description: "Use the Linode Cloud Manager to create a VLAN and attach a Compute Instance to it. When a Compute Instance is attached to a VLAN and configured, it has access to the VLAN's secure and private network."
keywords: ['networking','vlan','private network']
tags: ["security", "networking", "linode platform"]
tab_group_main:
    weight: 20
published: 2021-04-28
modified: 2022-08-23
aliases: ['/guides/getting-started-with-vlans/']
---

VLANs (Virtual Local Area Network) are a completely free solution available to Linode services used for enabling private networking in the cloud. Here are a few key features of VLANs:

- **Privacy and Security.** Compute Instances on the same account and in the same region can be added to the same VLAN, allowing for private and secure communications between those instances. The public internet can also be disabled on a Compute Instance to provide even more security.

    {{< note >}}
VLANs are separate from [Private IP Addresses](/docs/guides/managing-ip-addresses/#types-of-ip-addresses). Private IPs are accessible to all Compute Instances in that same data center and can only be further restricted by firewall rules or additional internal configuration.
{{< /note >}}

- **Performance.** A VLAN is configured as a Layer 2 networking device and provides low latency for latency-sensitive applications.

- **No additional charges.** VLANs are available at no cost and network transfer over a VLAN does not count towards monthly transfer quotas.

## Configuring VLANs

VLANs are relatively simple to manage and do not require much configuration beyond attaching (or detaching) a VLAN to a Compute Instance. VLANs can be configured when creating new instances or by modifying the network interfaces on the [Configuration Profile](/docs/guides/linode-configuration-profiles/) of an existing instance.

- [Attach a VLAN to a Compute Instance](/docs/products/networking/vlans/guides/attach-to-compute-instance/)

- [Remove a Compute Instance from a VLAN](/docs/products/networking/vlans/guides/remove-a-compute-instance/)

### Configuring the Network Interface

VLANs are managed within the Configuration Profile of a Compute Instance. Each instance has 3 configurable network interfaces, which are referred to as *eth0*, *eth1*, and *eth2*. The purpose of a network interface is to provide access to either the public internet or a VLAN:

- **Public Internet:** Configuring a network interface for the **Public Internet** enables the public (and private) IP address(es) for that Compute Instance. If no network interface is configured as **Public Internet**, the instance will not be able to access the internet or other instances within the data center's main private network.

- **VLAN:** Configuring a network interface for a VLAN enables the Compute Instance to communicate over a specified VLAN.

- **None:** Selecting **None** will deactivate that network interface.

{{< caution >}}
The Public Internet must always be set to use the network interface `eth0`.
{{< /caution >}}

### Selecting a VLAN

When configuring a network interface, a VLAN can be selected by entering its **Label**. VLANs that already exist on an account can be quickly selected through a drop down list. If the label doesn't correspond with an existing VLAN, a new VLAN is created.

### Assigning an IPAM Address

IPAM (IP Address Management) is the system that allows users to assign and manage IP addresses for each VLAN configured on a Compute Instance. When attaching a VLAN, an **IPAM Address** can be specified in address/netmask format. This should be a unique IPv4 address that doesn't already exist within the VLAN or on the public internet. It is common to use chose a /24 network within the 10.0.0.0/8 range (10.0.0.0 – 10.255.255.255). For example, if a user wishes to use the subnet 10.0.0.0/24 on a VLAN, they can assign any unique address in the range 10.0.0.0 - 10.0.0.255. Here are valid IPAM addresses for two Compute Instances connected to that VLAN:

- Instance 1: `10.0.0.1/24`
- Instance 2: `10.0.0.2/24`

Just like public and private IP addresses, IP addresses for a VLAN are automatically configured on a Linode through [Network Helper](/docs/guides/network-helper/). If Network Helper is disabled or if no IPAM address is provided, the Compute Instance will not automatically be able to communicate over the VLAN. In some cases, advanced users may disable Network Helper or refrain from providing an IPAM address. When doing so, the instance's internal network configuration files must be manually adjusted with the desired settings. See [Manually configuring a VLAN on a Compute Instance](/docs/products/networking/vlans/guides/manually-configuring-a-vlan/) for instructions.

{{< note >}}
The Compute Instance must be rebooted for any changes within its network interfaces to take effect. This reboot allows Network Helper to run so it can automatically adjust the necessary network configuration files.
{{< /note >}}