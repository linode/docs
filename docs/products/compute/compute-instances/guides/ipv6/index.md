---
description: "This guide is a brief overview of IPv6 support on Linode, including how to find your IPv6 address, requesting additional IPs, and managing IPs via the Cloud Manager."
keywords: ["ipv6 networking", "IP configuration"]
aliases: ['/networking/an-overview-of-ipv6-on-linode/','/networking/how-to-enable-native-ipv6-on-linux/','/networking/native-ipv6-networking/','/networking/linode-network/an-overview-of-ipv6-on-linode/','/guides/an-overview-of-ipv6-on-linode/']
published: 2011-05-03
modified: 2022-11-29
modified_by:
  name: Linode
title: "An Overview of IPv6 on Linode"
external_resources:
 - '[Understanding IP Addressing](http://www.ripe.net/internet-coordination/press-centre/understanding-ip-addressing)'
 - '[IPv6 and IPv4 CIDR Chart (PDF)](https://www.ripe.net/about-us/press-centre/ipv6-chart_2015.pdf)'
tags: ["networking","linode platform"]
image: an-overview-of-ipv6-on-linode-title-graphic.jpg
authors: ["Linode"]
---

All Compute Instances are created with one IPv6 address, which is acquired by [*Stateless Address Autoconfiguration*](https://en.wikipedia.org/wiki/IPv6#Stateless_address_autoconfiguration_(SLAAC)) (SLAAC). IPv6 is fully enabled on all of Linode's supported operating systems and uses hardware-based addressing.

Linode does not offer private IPv6 address allocations. Our IPv6 accounting was designed so that local IPv6 traffic does not count against your [network transfer quota](/docs/products/platform/get-started/guides/network-transfer/), so you can use your default IPv6 address as if it were a private IP address.

{{< note >}}
In order for your Compute Instance to receive its SLAAC address, it must respond to IPv6's ping protocol.

Please be sure to allow ICMPv6 in your [firewall](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-firewall). For example, in `iptables`, you can issue the following commands:

```command
ip6tables -A INPUT -p icmpv6 -j ACCEPT
ip6tables -A FORWARD -p icmpv6 -j ACCEPT
```
{{< /note >}}

## How to Find Your IPv6 Address

You can find your Compute Instance's IPv6 address using the Cloud Manager or the `ip` tool with the Linux Terminal.

### Using the Cloud Manager

See the [Viewing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses) section of the Managing IP Addresses guide.

### Linux Terminal

1. Using your terminal, SSH into the Compute Instance whose IPv6 address you would like to find.

    ```command
    ssh user@192.0.2.0
    ```

1. Use the `ip` tool to find your Compute Instance's IPv6 address:

    ```command
    ip -6 address
    ```

    ```output
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN qlen 1
        inet6 ::1/128 scope host
          valid_lft forever preferred_lft forever
    3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
        inet6 2600:3c02::f03c:91ff:fe24:3a2f/64 scope global mngtmpaddr dynamic
          valid_lft 2591998sec preferred_lft 604798sec
        inet6 fe80::f03c:91ff:fe24:3a2f/64 scope link
          valid_lft forever preferred_lft forever
    ```

-  Line 3 shows the IPv6 loopback interface, `::1/128`. This is used for IPv6 traffic within the system, similar to the `127.0.0.0/8` IPv4 address block.

-  Line 6 is the Compute Instance's public IP address, `2600:3c02::f03c:91ff:fe24:3a2f/64`. You can see it's in a `/64` range.

-  Line 8 is the link-local IPv6 address, `fe80::f03c:91ff:fe24:3a2f/64`. An IPv6 link-local address is a unicast address that is automatically configured on any interface.

If your Compute Instance does not have the correct IPv6 address or any IPv6 address at all, you should verify that you have router advertisements enabled and IPv6 privacy extensions disabled. Your instance will need to accept router advertisements for SLAAC to function. These settings are properly configured by default in our supported distributions.

## Additional IPv6 Addresses

If a single IPv6 address isn't sufficient for your application, additional IPv6 addresses are provided through large address blocks, also called routed ranges or pools. From these ranges, you can manually configure individual IPv6 addresses on your Compute Instance. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#adding-an-ip-address) and [Manual Network Configuration on a Compute Instance](/docs/products/compute/compute-instances/guides/manual-network-configuration/) guides for instructions on adding an IPv6 range and to learn how to configure it within your system.

The size of each block is identified through a prefix. These are indicated with a slash `/` followed by a number in base 10: the length of the network **prefix** in bits. This translates to the number of available addresses that are available in the range (or pool). For example, the prefix `/48` contains 2<sup>128-48</sup> = 2<sup>80</sup> = 1,208,925,819,614,629,174,706,176 addresses. For an address like `2001:db8:1234::/48` the block of addresses is `2001:db8:1234:0000:0000:0000:0000:0000` to `2001:db8:1234:ffff:ffff:ffff:ffff:ffff`.

The IPv6 prefixes and their respective quantity of IPv6 addresses that Linode provides are listed below.

### IPv6 Routed Ranges

An IPv6 routed range is assigned to a single Compute Instance. Addresses from that range can only be configured on that instance.

{{< note >}}
Configuring a `/64` or `/56` routed range requires you to [disable Network Helper](/docs/products/compute/compute-instances/guides/network-helper/#enable-or-disable-network-helper) on your Compute Instance and manually configure its network settings. Please review the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#adding-an-ip-address) and [Manual Network Configuration on a Compute Instance](/docs/products/compute/compute-instances/guides/manual-network-configuration/) guides for details on this process.
{{< /note >}}

- `/64` **routed range** *(18,446,744,073,709,551,616 addresses)*: This is the most common range provided to our customers and sufficient for most applications that require additional IPv6 addresses.
- `/56` **routed range** *(4,722,366,482,869,645,213,696 addresses)*: These larger ranges are typically only required by specialized systems or networking applications. When requesting a `/56` range, please provided information regarding your use case.

### IPv6 Pools

An IPv6 pool is accessible from every Compute Instance on your account within the assigned data center. Addresses from that pool can be configured on each instance within that data center. This can enable features like IPv6 failover.

- `/116` **pool** *(4,096 addresses)*

{{< note type="alert" >}}
The IPv6 /116 prefix has been deprecated and is no longer available for new Compute Instances. If you have an existing Compute Instance with a /116 pool, please review the [Upcoming Changes Related to Network Infrastructure Upgrades](/docs/products/compute/compute-instances/guides/network-infrastructure-upgrades/) to learn about changes that may affect your services.
{{< /note >}}

## IPv6 Forwarding

If needed, IPv6 packets can be forwarded between two networks on Linode. By default, most Linux systems disable both IPv4 and IPv6 forwarding. To enable this functionality, see the [IP Forwarding](/docs/guides/linux-router-and-ip-forwarding/) guide.