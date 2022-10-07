---
slug: network-infrastructure-upgrades
author:
  name: Linode
  email: docs@linode.com
description: "An overview of changes and actions that may be required in advance of upgrades to Linode's networking infrastructure."
keywords: ['networking']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-19
modified: 2022-09-01
modified_by:
  name: Linode
title: "Upcoming Changes Related to Network Infrastructure Upgrades"
noindex: true
_build:
  list: false
---

Throughout 2022, Linode is rolling out networking infrastructure upgrades to all of our existing data centers. These upgrades increase the stability and resiliency of our already reliable network. It also enables us to bring features, such as VLAN and IP Sharing, to every data center.

For most customers, these upgrades are performed seamlessly behind the scenes. For customers that use certain features, such as IP Sharing and /116 IPv6 pools, there may be some changes that impact your current configuration. This document outlines what is changing, what data centers are impacted, and what, if anything, you may need to do in order to prepare for these upcoming changes.

## What's New?

- **IP Sharing (IP failover) availability:** The IP Sharing feature, as it exists prior to these upgrades, enables IP failover for public IPv4 addresses in select data centers. After the upgrades have been completed, this feature will be expanded to all data centers and will also support IPv6 routed ranges (/64 and /56). See our [Configuring IP Failover on a Compute Instance](/docs/guides/ip-failover/) guide to learn more about configuring IP failover.

- **VLAN availability:** [VLANs](/docs/products/networking/vlans/), which enable private layer 2 networking, will be launched across all data centers soon after the network upgrades have occurred.

## What's Changing?

The following is a list of breaking changes and any action that may be required if you are impacted by that change:

- **Deprecation of IPv6 /116 pools:** /116 pools will no longer be provided to Compute Instances within data center that have received the upgrades. Existing /116 pools will be removed from Compute Instances at that time.

    *Action:* If you were using /116 for IPv6 failover, consider using an IPv6 /64 instead.

- **IP failover through BGP:** IP failover (IP Sharing) for public IPv4 addresses and IPv6 routed ranges will be facilitated through BGP instead of ARP (configured through [keepalived](/docs/guides/ip-failover-keepalived/)).

    *Action:* If you have previously configured IP failover for a public IPv4 address, review the [Configuring IP Failover on a Compute Instance](/docs/guides/ip-failover/) guide to learn more about configuring IP failover using BGP. You can configure BGP ahead of time, but will not be able to test or use the configuration until after the network upgrades have been completed.

## Which Data Centers Have Been Upgraded?

Review the table below to learn which data centers have been upgraded with the latest network enhancements.

| Data center | Upgrade Status |
| -- | -- |
| Atlanta (Georgia, USA) | *Coming soon* |
| Dallas (Texas, USA) | *Coming soon* |
| **Frankfurt (Germany)** | **Complete** |
| Fremont (California, USA) | *Coming soon* |
| **London (United Kingdom)** | **Complete** |
| **Mumbai (India)** | **Complete** |
| **Newark (New Jersey, USA)** | **Complete** |
| Singapore | *In progress* |
| Sydney (Australia) | *Coming soon* |
| Tokyo (Japan) | *Coming soon* |
| Toronto (Canada) | *Coming soon* |

A status of **complete** indicates that all new Compute Instances (and *most* existing instances) are located on fully upgraded hardware. Compute Instances using legacy features, such as ARP-based failover and /116 ranges, may still be located on hardware that hasn't yet been upgraded. These customers have been notified and a migration timeline has been shared.

## What Action is Required?

- **Migration of Compute Instances:** Once a data center has started the network infrastructure upgrades, live migrations will be scheduled for all Compute Instances that do not reside on upgraded hardware. This live migration will occur while your Compute Instance is powered on and operating normally. After the migration has been successfully completed, there may be a brief period of downtime while the Compute Instance is rebooted.

- **Update IP failover configuration:** If you have configured IP failover for a public IPv4 address, review the [Configuring IP Failover on a Compute Instance](/docs/guides/ip-failover/) guide to learn more about configuring IP failover using BGP. If you were using a now deprecated IPv6 /116 pool for IP failover, consider using an IPv6 /64 range instead. You can configure BGP ahead of time, but will not be able to test or use the configuration until after your Compute Instances are migrated to upgraded hardware.
