---
slug: ip-failover
author:
  name: Linode
  email: docs@linode.com
description: "This guide discusses how to enable IP failover on a Linode Compute Instance through using our IP Sharing feature with software such as keepalived or FRR."
keywords: ['IP failover','IP sharing','elastic IP']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-14
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

## IP Sharing

Within Linode's platform, IP failover is configured by enabling [IP Sharing](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) and manually installing and configuring software on both the primary and secondary Compute Instances. Linode's IP Sharing feature has traditionally been implemented using keepalived and was available in limited data centers. New [planned network infrastructure upgrades](/docs/guides/network-infrastructure-upgrades/) drop keepalived supported in favor of BGP routing using software like FRR. Review the list below to learn which data centers support IP Sharing.

| Data Center | IP Sharing Availability | Software |
| -- | -- | -- |
| Atlanta (Georgia, USA) | *Not supported* | - |
| Dallas (Texas, USA) | Supported, IPv4 only | keepalived |
| Frankfurt (Germany)* | Partially supported, IPv4 only | keepalived |
| Fremont (California, USA) | Supported, IPv4 only | keepalived |
| London (United Kingdom) | Supported, IPv4 only | keepalived |
| Mumbai (India) |  *Not supported* | - |
| Newark (New Jersey, USA) | Supported, IPv4 only | keepalived |
| Singapore | Supported, IPv4 only | keepalived |
| Sydney (Australia) |  *Not supported* | - |
| Tokyo (Japan) | Supported, IPv4 only | keepalived |
| Toronto (Canada) |  *Not supported* | - |

\* The Frankfurt data center is currently undergoing network infrastructure upgrades. During this time, a Compute Instance may be located on hardware that does not yet support IP Sharing. Once the upgrades are complete, IP Sharing will be configurable through BGP routing software like FRR instead of keepalived.

{{<note>}}
IP failover for VLAN IP addresses is supported within every data center where VLANs are available. This feature does not depend on Linode's IP Sharing feature and is configurable through keepalived.
{{</note>}}

## Configuring IP Failover

To configure IP failover, follow the instructions for the software implementation method supported by your data center:

- [Configuring IP Failover using keepalived](/docs/guides/ip-failover-keepalived/)
- [Configuring IP Failover over BPG using FRR](/docs/guides/ip-failover-bgp-frr/)