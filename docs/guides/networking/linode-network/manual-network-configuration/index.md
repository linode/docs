---
slug: manual-network-configuration
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to manually edit your distribution-specific network configuration files to set static IPs, routes and DNS resolvers."
keywords: ["static", "ip address", "addresses"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-19
modified_by:
  name: Linode
title: "Manual Network Configuration on a Compute Instance"
tags: ["networking","linode platform"]
---

Every Compute Instance is assigned several IP addresses, including a pubic IPv4 address and a public IPv6 [SLAAC](https://en.wikipedia.org/wiki/IPv6#Stateless_address_autoconfiguration_.28SLAAC.29) address. By default, a utility called [Network Helper](/docs/guides/network-helper/) automatically configures these IP addresses within the network configuration files on the Compute Instance. While this is preferred in most cases, there are some situations which may require you to manually configure networking yourself. These situations include:

- Installing a custom distribution on a Compute Instance
- Configuring failover (see [Configuring Failover on a Compute Instance](/docs/guides/ip-failover/))
- Assigning addresses from an IPv6 routed range
- Using other DNS resolvers (not Linode’s)
- Other advanced use cases where custom network configuration is required

The guides in this series walk you through how to manually configure your networking in most common Linux distributions. To learn more about the types of IP addresses available on a Compute Instance, review the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#types-of-ip-addresses) guide. Additional public IPv4 addresses, private IPv4 addresses, and IPv6 routed ranges (/64 or /56) can be added manually or by opening a [support ticket](/docs/guides/support/) and detailing your requirements.

## Network Configuration Software in Linux

All Linux distributions have pre-installed software whose purpose is to manage the internal networking on the system. In most cases, using this default software is preferred. That said, advanced users may wish to install their own preferred tool.

### Default Network Configuration Software by Distribution

The following table contains a list of each Linux distribution offered by Linode. Alongside each distribution is the default network software that it uses and a link to a guide for help with configuring that software.

| Distribution | Network Manager |
| -- | -- |
| AlmaLinux 8 and 9 | [NetworkManager](/docs/guides/networkmanager/) |
| Alpine | [ifupdown-ng](/docs/guides/ifupdown/) |
| Arch | [systemd-networkd](/docs/guides/systemd-networkd/) |
| CentOS 7 and 8 | [NetworkManager](/docs/guides/networkmanager/) |
| CentOS Stream 8 and 9 | [NetworkManager](/docs/guides/networkmanager/) |
| Debian 9-11 | [ifupdown](/docs/guides/ifupdown/) |
| Fedora 34-36 | [NetworkManager](/docs/guides/networkmanager/) |
| Gentoo | netifrc |
| Rocky Linux 8 and 9 | [NetworkManager](/docs/guides/networkmanager/) |
| Slackware | netconfig |
| OpenSUSE Leap | wicked |
| Ubuntu 16.04 | [ifupdown](/docs/guides/ifupdown/) |
| Ubuntu 18.04 - 22.04 | [systemd-networkd](/docs/guides/systemd-networkd/) and Netplan |

To manually configure networking, follow the associated guide and/or the official manual for the networking software and Linux distribution you are using.

## Static vs Dynamic Addressing

IP addresses can be statically configured or dynamically configured through DHCP (for public IPv4 addresses) and SLAAC (for primary IPv6 addresses).

- **Static** configuration means explicitly defining the IP address within your system's network configuration. IPv4 addresses are configured this way through Network Helper and static configuration of IPv4 and IPv6 routed ranges is typically recommended when manually configuring your networking.

- **DHCP** (Dynamic Host Configuration Protocol) can be used to automatically configure a single IPv4 address on a Compute Instance. If multiple IPv4 addresses are on the system, the first IP address (sorted alpha-numerically) is used. DHCP does not configure private IPv4 addresses or any IPv6 addresses. If you intend on adding or removing public IPv4 addresses after you initially configure networking, using DHCP is not recommended as it may configure a different public IPv4 address after you make those changes.

    {{< note >}}
If you do enable DHCP and are using a firewall (such as Cloud Firewalls), you must configure the firewall to allow communication with our DHCP servers. See the [DHCP IP Address Reference](/docs/guides/dhcp-ip-address-reference/) guide for a list of IP addresses to allow.
{{</ note >}}

- **SLAAC** (Stateless address autoconfiguration) can *and should* be used to automatically configure the main IPv6 address on a Compute Instance. It does not configure any IPv6 routed ranges (/64 or /56) that may also be assigned to that instance. For SLAAC to function, the Compute Instance needs to accept router advertisements. This is accomplished by enabling router advertisements and disabling IPv6 privacy extensions within your system's networking configuration files. These settings are properly configured by default in our supported distributions.

Static and dynamic addressing can be used together within a single configuration file. As an example, you can use DHCP to configure the public IPv4 address on your system, use SLAAC to configure your IPv6 address, and statically configure any remaining addresses (such as private IPv4 address or addresses from an IPv6 routed range).

## Networking Terms

- **IP address:** A unique and structured combination of numbers (and letters, for IPv6 address) used to identify a device over a network. Every Linode Compute Instance is assigned a public IPv4 address and a public IPv6 address. Additional IP addresses, including private IPv4 addresses and IPv6 routed ranges, are available. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/) for information on viewing your IP addresses.

- **Interface:** A real or virtual device that is responsible for facilitating a connection to a network. Each Compute Instance has one public interface for connecting to the internet: *eth0*. If a VLAN is configured, an additional interface for that VLAN is available. In that case, you may assign the public interface to *eth0* or *eth1* if desired. See [Managing Configuration Profiles](/docs/guides/linode-configuration-profiles/) for instructions on viewing the interfaces configured on your Compute Instance.

- **Gateway:** Provides access to a larger network, such as the internet. When configuring a Compute Instance, you only need to specify a gateway for one interface. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/) for details on finding the gateway IP address that corresponds with the primary IPv4 address you wish to use.

- **DNS resolver:** A server responsible for matching domain names to IP addresses. Linode provides DNS resolvers for each data center, though you are free to use others if you choose. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/#viewing-the-dns-resolvers-ip-addresses) for instructions on viewing the DNS resolvers.
