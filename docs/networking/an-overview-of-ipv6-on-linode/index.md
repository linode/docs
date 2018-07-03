---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide is a brief overview of IPv6 resources and support afforded by and available with Linode.'
og_description: "This guide is a brief overview of IPv6 support on Linode, including how to find your Linode's IPv6 address, how to request additional addresses, and information about address pools and forwarding."
keywords: ["ipv6 networking", "IP configuration"]
aliases: ['networking/native-ipv6-networking/','networking/how-to-enable-native-ipv6-on-linux/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-17
modified_by:
  name: Linode
published: 2011-05-03
title: An Overview of IPv6 on Linode
external_resources:
 - '[Understanding IP Addressing](http://www.ripe.net/internet-coordination/press-centre/understanding-ip-addressing)'
 - '[IPv6 Subnet Cheat Sheet](http://www.ipv6ve.info/project-definition/ipv6-subnet-cheat-sheet-and-ipv6-cheat-sheet-reference)'
---

![An Overview of IPv6 on Linode](an-overview-of-ipv6-on-linode-title-graphic.jpg "An Overview of IPv6 on Linode")

## Default IPv6 Configuration

All Linodes are created with one IPv6 address, which is acquired by Stateless Address Autoconfiguration (SLAAC). IPv6 is fully enabled on all of Linode's supported operating systems and uses hardware-based addressing.

Linode does not offer private IPv6 address allocations. Our IPv6 accounting was designed so that local IPv6 traffic does not count against your transfer quota, so you can use your default IPv6 address as if it were a private IP address.

{{< note >}}
In order for your Linode to receive its SLAAC address, it must respond to IPv6's ping protocol.

Please be sure to allow ICMPv6 in your [firewall](/docs/security/securing-your-server#configure-a-firewall), for example in `iptables`:

`-A INPUT -p icmpv6 -j ACCEPT`
{{< /note >}}

## How to Find Your IPv6 Address

To find your Linode's IPv6 address, see the [Remote Access](/docs/networking/remote-access) tab of your Linode's dashboard or use the `ip` tool:

    root@localhost:~# ip -6 address
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN qlen 1
        inet6 ::1/128 scope host
           valid_lft forever preferred_lft forever
    3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
        inet6 2600:3c02::f03c:91ff:fe24:3a2f/64 scope global mngtmpaddr dynamic
           valid_lft 2591998sec preferred_lft 604798sec
        inet6 fe80::f03c:91ff:fe24:3a2f/64 scope link
           valid_lft forever preferred_lft forever

-  Line 3 shows the IPv6 loopback interface. This is used for IPv6 traffic within the system, similar to the 127.0.0.0/8 IPv4 address block.

-  Line 6 is the Linode's public IP address. You can see it's in a /64 pool.

-  Line 8 is the link-local IPv6 address. An IPv6 link-local address is a unicast address that is automatically configured on any interface.

If your Linode does not have the correct IPv6 address or any IPv6 address at all, you should verify that you have router advertisements enabled and IPv6 privacy extensions disabled. Your Linode will need to accept router advertisements for SLAAC to function. These settings are properly configured by default in our supported distributions.


## Additional IPv6 Addresses

You can request additional IPv6 addresses at any time by opening a [support ticket](/docs/platform/support). While default IPv6 addresses are configured automatically, you will need to statically configure each IPv6 address in the pool you request. See our [static IP guide](/docs/networking/linux-static-ip-configuration) for instructions on how to do this.


## IPv6 Pools

IPv6 addresses are allocated in *pools*. The IPv6 pool sizes Linode provides and their respective quantity of IPv6 addresses are below.

You will see where the pool is routed under *Public IP Pools* on the Linode Manager's Remote Access tab.

| Pool   | Number of addresses           |
|:------:|:-----------------------------:|
| /56    | 4,722,366,482,869,645,213,696 |
| /64    | 18,446,744,073,709,551,616    |
| /116   | 4,096                         |


## IPv6 Forwarding

For security reasons, IPv6 forwarding is not available on the Linode network. This is enforced by our network infrastructure.
