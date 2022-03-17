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

- **New IP Sharing Method (BGP):** Supports IPv4 failover as well as IPv6 failover (through `/64` and `/56` routed ranges). This is currently being rolled out across our fleet in conjunction with our [planned network infrastructure upgrades](/docs/guides/network-infrastructure-upgrades/). Since it is implemented using BGP routing, customers can configure it on their Compute Instances using the Linode provided lelastic tool or FRR.
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

In a typical setup with IP failover, there is one **primary** Instance and one or more **secondary** Instances.

- **Primary**: The primary Compute Instance is the one containing the IP address you'd like to configure for IP failover.
- **Secondary**: The secondary Compute Instances are then configured to use that IP address in the event the primary Instance stops responding.

Follow each of the sections below to configure IP failover:

1. [Configure IP Sharing](#configure-ip-sharing)
2. [Install and Configure Lelastic](#install-and-configure-lelastic)
3. [Test IP Failover](#test-ip-failover)

### Configure IP Sharing

1. Decide which IPv4 address you'd like to share. To share an IP address, it must be assigned to a Compute Instance with 2 or more IPv4 addresses. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#adding-an-ip-address) guide for instructions on adding an IP address to a Compute Instance.

1. Determine which Compute Instances the IP address should failover to and then *disable* Network Helper on each Compute Instance (including the instance to which the IP address is already assigned). For instructions, see the [Network Helper](/docs/guides/network-helper/#single-per-linode) guide.

1. Configure IP Sharing on each of the secondary Compute Instances. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) for instructions on configuring IP sharing.

{{<caution>}}
As soon as IP Sharing has been enabled for an IP address, that address is routed through BGP. The IP address will be inaccessible until BGP routing has been configured for it on your Compute Instances (through a tool like lelastic or FRR). Use caution if enabling IP Sharing on IPv4 addresses that are a part of a production workload as downtime is likely to occur.
{{</caution>}}

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
