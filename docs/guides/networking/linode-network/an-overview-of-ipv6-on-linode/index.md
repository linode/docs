---
slug: an-overview-of-ipv6-on-linode
author:
  name: Linode
  email: docs@linode.com
description: 'This guide is a brief overview of IPv6 support on Linode, including how to find your IPv6 address, requesting additional IPs, and managing IPs via the Cloud Manager.'
keywords: ["ipv6 networking", "IP configuration"]
aliases: ['/networking/an-overview-of-ipv6-on-linode/','/networking/how-to-enable-native-ipv6-on-linux/','/networking/native-ipv6-networking/','/networking/linode-network/an-overview-of-ipv6-on-linode/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-11-15
modified_by:
  name: Linode
published: 2011-05-03
title: "An Overview of IPv6 on Linode"
external_resources:
 - '[Understanding IP Addressing](http://www.ripe.net/internet-coordination/press-centre/understanding-ip-addressing)'
 - '[IPv6 and IPv4 CIDR Chart (PDF)](https://www.ripe.net/about-us/press-centre/ipv6-chart_2015.pdf)'
tags: ["networking","linode platform"]
image: an-overview-of-ipv6-on-linode-title-graphic.jpg
---

![An Overview of IPv6 on Linode](an-overview-of-ipv6-on-linode-title-graphic.jpg "An Overview of IPv6 on Linode")

## Default IPv6 Configuration

All Linodes are created with one IPv6 address, which is acquired by [*Stateless Address Autoconfiguration*](https://en.wikipedia.org/wiki/IPv6#Stateless_address_autoconfiguration_(SLAAC)) (SLAAC). IPv6 is fully enabled on all of Linode's supported operating systems and uses hardware-based addressing.

Linode does not offer private IPv6 address allocations. Our IPv6 accounting was designed so that local IPv6 traffic does not count against your [network transfer quota](/docs/guides/network-transfer/), so you can use your default IPv6 address as if it were a private IP address.

{{< note >}}
In order for your Linode to receive its SLAAC address, it must respond to IPv6's ping protocol.

Please be sure to allow ICMPv6 in your [firewall](/docs/security/securing-your-server#configure-a-firewall). For example, in `iptables`, you can issue the following commands:

    ip6tables -A INPUT -p icmpv6 -j ACCEPT
    ip6tables -A FORWARD -p icmpv6 -j ACCEPT
{{< /note >}}

## How to Find Your IPv6 Address

You can find your Linode's IPv6 address using the Cloud Manager or the `ip` tool with the Linux Terminal.

### Using the Cloud Manager

See the [Viewing IP Addresses](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) section of the Managing IP Addresses guide.

### Linux Terminal

1. Using your terminal, SSH into the Linode whose IPv6 address you would like to find.

        ssh user@192.0.2.0

1. Use the `ip` tool to find your Linode's IPv6 address:

        root@localhost:~# ip -6 address
        1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN qlen 1
            inet6 ::1/128 scope host
              valid_lft forever preferred_lft forever
        3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
            inet6 2600:3c02::f03c:91ff:fe24:3a2f/64 scope global mngtmpaddr dynamic
              valid_lft 2591998sec preferred_lft 604798sec
            inet6 fe80::f03c:91ff:fe24:3a2f/64 scope link
              valid_lft forever preferred_lft forever

-  Line 3 shows the IPv6 loopback interface, `::1/128`. This is used for IPv6 traffic within the system, similar to the `127.0.0.0/8` IPv4 address block.

-  Line 6 is the Linode's public IP address, `2600:3c02::f03c:91ff:fe24:3a2f/64`. You can see it's in a `/64` range.

-  Line 8 is the link-local IPv6 address, `fe80::f03c:91ff:fe24:3a2f/64`. An IPv6 link-local address is a unicast address that is automatically configured on any interface.

If your Linode does not have the correct IPv6 address or any IPv6 address at all, you should verify that you have router advertisements enabled and IPv6 privacy extensions disabled. Your Linode will need to accept router advertisements for SLAAC to function. These settings are properly configured by default in our supported distributions.

## Additional IPv6 Addresses

If a single IPv6 address isn't sufficient for your application, additional IPv6 addresses are provided through large address blocks, also called routed ranges or pools. From these ranges, you can manually configure individual IPv6 addresses on your Linode. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#adding-an-ip-address) and [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration) guides for instructions on adding an IPv6 range and to learn how to configure it within your system.

The size of each block is identified through a prefix. These are indicated with a slash `/` followed by a number in base 10: the length of the network **prefix** in bits. This translates to the number of available addresses that are available in the range (or pool). For example, the prefix `/48` contains 2<sup>128-48</sup> = 2<sup>80</sup> = 1,208,925,819,614,629,174,706,176 addresses. For an address like `2001:db8:1234::/48` the block of addresses is `2001:db8:1234:0000:0000:0000:0000:0000` to `2001:db8:1234:ffff:ffff:ffff:ffff:ffff`.

The IPv6 prefixes and their respective quantity of IPv6 addresses that Linode provides are listed below.

### IPv6 Routed Ranges

An IPv6 routed range is assigned to a single Linode. Addresses from that range can only be configured on that Linode.

- `/64` **routed range** *(18,446,744,073,709,551,616 addresses)*: This is the most common range provided to our customers and sufficient for most applications that require additional IPv6 addresses.
- `/56` **routed range** *(4,722,366,482,869,645,213,696 addresses)*: These larger ranges are typically only required by specialized systems or networking applications. When requesting a `/56` range, please provided information regarding your use case.

### IPv6 Pools

An IPv6 pool is accessible from every Linode on your account within the assigned data center. Addresses from that pool can be configured on each Linode within that data center. This can enable features like IPv6 failover.

- `/116` **pool** *(4,096 addresses)*

{{< note >}}
The IPv6 `/116` prefix is not available in the Toronto, Atlanta, Sydney, or Mumbai data centers.
{{</ note >}}

## IPv6 Forwarding

For security reasons, IPv6 forwarding is not available on the Linode network. This is enforced by our network infrastructure.
