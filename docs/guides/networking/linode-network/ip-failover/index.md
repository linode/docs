---
slug: ip-failover
author:
  name: Linode
  email: docs@linode.com
description: "This guide discusses how to enable IP failover on a Linode Compute Instance through using our IP Sharing feature with software such as keepalived or FRR."
keywords: ['IP failover','IP sharing','elastic IP']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-17
modified_by:
  name: Linode
title: "Configuring IP Failover on a Compute Instance"
contributor:
  name: Linode
---

There's always a small possibility that your Compute Instance may be powered off or become inaccessible, perhaps due to your own internal configuration issues or due to planned (or unplanned) maintenance. When this happens, any websites or services hosted on that Instance might also stop working. To configure services as highly available (and prevent them from going down), there are a few options you can consider:

- **IP failover:** Routes an IP addresses's traffic to a secondary Compute Instance in the event the original Instance goes down.
- **Load balancing:** Load balancing solutions, such as Linode's [NodeBalancers](/docs/products/networking/nodebalancers/) or [HAProxy](https://www.linode.com/docs/guides/how-to-use-haproxy-for-load-balancing/), can route incoming requests to preconfigured backend Compute Instances. This provides quite a lot of flexibility for your own unique highly available setup.

This guide covers configuring IP failover to enable high availability. IP failover allows two Linode Compute Instances to share a single IP address, one serving as the *primary* and one serving as the *secondary*. If the primary Compute Instance becomes unavailable, the IP address will seamlessly failover to the secondary Compute Instance. Once the primary instance is back online, the IP address will fallback to that instance.

## IP Failover Support

Within Linode's platform, IP failover is configured by enabling [IP Sharing](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) in the Cloud Manager, Linode CLI, or Linode API and then and then configuring software on any affected Compute Instances.

- **New IP Sharing Method (BGP):** Supports IPv4 failover. This is currently being rolled out across our fleet in conjunction with our [planned network infrastructure upgrades](/docs/guides/network-infrastructure-upgrades/). Since it is implemented using BGP routing, customers can configure it on their Compute Instances using the Linode provided lelastic tool or FRR.
- **Legacy IP Sharing Method (ARP):** Supports IPv4 failover within limited data centers. Since it is arp-based, customers can configure it on their Compute Instances using keepalived.

Review the list below to learn which data centers support IP Sharing.

| Data Center | IP Sharing Support | Software | ID |
| -- | -- | -- | -- |
| Atlanta (Georgia, USA) | *Not supported* | - | 4 |
| Dallas (Texas, USA) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 2 |
| **Frankfurt (Germany)** | **New method (BGP)** | **lelastic** | 10 |
| Fremont (California, USA) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 3 |
| London (United Kingdom) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 7 |
| Mumbai (India) |  *Not supported* | - | 14 |
| Newark (New Jersey, USA) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 6 |
| Singapore | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 9 |
| Sydney (Australia) |  *Not supported* | - | 16 |
| Tokyo (Japan) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 11 |
| Toronto (Canada) |  *Not supported* | - | 15 |

{{<note>}}
IP failover for VLAN IP addresses is supported within every data center where VLANs are available. This feature does not depend on Linode's IP Sharing feature and is configurable through keepalived.
{{</note>}}

## Configure IP Failover

The instructions within this guide enable you to configure IP failover using the [lelastic](https://github.com/linode/lelastic) tool, a Linode provided tool based on GoBGP that automates much of the configuration. If you prefer to manually configure IP failover, follow the [Configuring IP Failover over BPG using FRR](/docs/guides/ip-failover-bgp-frr/) guide or use any BGP client that you wish.

{{<note>}}
If you are configuring IP failover through the legacy method (in supported data centers), use the [Configuring IP Failover using keepalived](/docs/guides/ip-failover-keepalived/) guide instead. This should also be used when setting up IP failover for VLAN IP addresses.
{{</note>}}

1. Log in to the Cloud Manager.

1. Determine which Compute Instances you wish to use with a shared IP address. They both must be located in the same data center. If you need to, create those Compute Instances now and allow them to boot up.

1. Disable Network Helper on both Compute Instances. For instructions, see the [Network Helper](/docs/guides/network-helper/#single-per-linode) guide.

1. Add an IPv4 address to one of the Compute Instances. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#adding-an-ip-address) guide for instructions. Make a note of the new address that is assigned as this will be used as the shared IP address.

1. On the other Compute Instance, configure the *IP Sharing* feature to use the IPv4 address that was just added to the other instance. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) for instructions on configuring IP sharing.

1. Configure IP failover on the internal system of *both* Compute Instances.

    1.  Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

    1.  Review the networking configuration to ensure that the shared IP address is not listed.

            ip addr

        If the IP address *does* appear, remove it first with the following command:

            ip addr del [shared-ip]/32 dev eth0

        {{<caution>}}
After the IP address has been removed, it is no longer accessible until BGP routing has been configured. Use caution if enabling IP Sharing on IPv4 addresses that are a part of a production workload as downtime is likely to occur.
{{</caution>}}

    1.  Add the shared ip address to the loopback interface:

            ip addr add [shared-ip]/32 dev lo

    1.  Download and install the [lelastic](https://github.com/linode/lelastic) utility from GitHub by running the following commands:

            curl -LO https://github.com/linode/lelastic/releases/download/v0.0.3/lelastic.gz
            gunzip lelastic.gz
            chmod 755 lelastic
            mv lelastic /usr/local/bin/

    1.  Run the following command to configure BGP routing through lelastic, replacing *[id]* with the ID corresponding to your data center in the [table above](/docs/guides/ip-failover/#ip-failover-support) and *[role]* with either `primary` or `secondary`.

            lelastic -dcid [id] -[role] &

        Once configured, the shared IP address is routed to the primary system. If that system is inaccessible, it fails over to the secondary system *until* the primary system becomes available again. If both systems are configured as the same role (both primary or both secondary), then the behavior is slightly different. It still fails over to the other system should the original system become inaccessible, but then it remains routed to the other system, even if the original system comes back online.

    1.  Repeat these steps for the other Compute Instance.

### Install and Configure Lelastic

1.  Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Download and install the [lelastic](https://github.com/linode/lelastic) utility from GitHub by running the following commands:

        curl -LO https://github.com/linode/lelastic/releases/download/v0.0.3/lelastic.gz
        gunzip lelastic.gz
        chmod 755 lelastic
        mv lelastic /usr/local/bin/

1.  Run the following command to configure lelastic, replacing *[id]* with the ID corresponding to your data center in the [table above](/docs/guides/ip-failover/#ip-failover-support) and *[role]* with either `primary` if you are configuring the primary instance or `secondary` if you are configuring the secondary instance.

        lelastic -dcid [id] -[role] &

1.  Repeat these steps for *each* Compute Instance within your IP failover setup.

## Test IP Failover

Once all Compute Instances have been configured, you can test the IP failover functionality using the steps below.

1.  Power off the *primary* Compute Instance.

1.  Using your local machine, ping the IP address enabled for IP Sharing / IP failover.

        ping 192.0.2.1

    If IP failover is successfully configured, the output should be similar to the following (once the primary Compute Instance has fully powered off):

    {{< output >}}
64 bytes from 192.0.2.1: icmp_seq=3310 ttl=64 time=0.373 ms
{{</  output >}}

    If you are instead receiving output telling you that the host is unreachable, IP failover likely hasn't been successfully configured.

    {{< output >}}
From 192.0.2.1 icmp_seq=3293 Destination Host Unreachable
{{</  output >}}
