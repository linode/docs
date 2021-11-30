---
slug: network-infrastructure-upgrades
author:
  name: Linode
  email: docs@linode.com
description: "An overview of changes and actions that may be required in advance of upgrades to Linode's networking infrastructure."
keywords: ['networking']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-30
modified_by:
  name: Linode
title: "Upcoming Changes Related to Network Infrastructure Upgrades"
noindex: true
_build:
  list: false
---

Over the next year, we’ll be rolling our networking infrastructure upgrades to all of our existing data centers. These upgrades increase the stability and resiliency of our already reliable network. It also enables us to bring features, such as VLAN and IP Sharing, to every data center.

For most customers, these upgrades are performed seamlessly behind the scenes. For customers that use certain features, such as IP Sharing and /116 IPv6 pools, there may be some changes that impact your current configuration. This document will outline what is changing, what data centers are impacted, and what, if anything, you may need to do in order to prepare for these upcoming changes.

## What's New?

- **IP failover for IPv6 routed ranges:** IPv6 routed ranges can be configured for IP failover (IP Sharing) immediately after your data center has been upgraded. See our [] guide to learn more about configuring IP failover.

- **VLAN and Cloud Firewall availability:** These upgrades allow data centers that do not yet have these products to launch them soon after the network upgrades have occurred.

## What's Changing?

The following is a list of breaking changes and any action that may be required if you are impacted by that change:

- **Deprecation of IPv6 /116 pools:** /116 pools will no longer be provided to Compute Instances within data center that have received the upgrades. Existing /116 pools will be removed from Compute Instances at that time.

    *Action:* If you were using /116 for IPv6 failover, consider using an IPv6 /64 instead.

- **IP failover through bgp:** IP failover (IP Sharing) for public IPv4 addresses will be facilitated through bgp instead of [keepalived](/docs/guides/ip-failover-keepalived/) immediately after the upgrades have occurred.

    *Action:* If you have configured IP failover for a public IPv4 address, review the [] guide to learn more about configuring IP failover using bgp. You can configure bgp ahead of time, but will not be able to test or use the configuration until after the network upgrades.

## Which Data Centers Have Been Upgraded?

Review the table below to learn which data centers have been upgraded with the latest network enhancements.

| Data center | Upgrade Status |
| -- | -- |
| Atlanta (Georgia, USA) | *Coming soon* |
| Dallas (Texas, USA) | *Coming soon* |
| Frankfurt (Germany) | *Coming soon* |
| Fremont (California, USA) | *Coming soon* |
| London (United Kingdom) | *Coming soon* |
| Mumbai (India) | *Coming soon* |
| Newark (New Jersey, USA) | *Coming soon* |
| Singapore | *Coming soon* |
| Sydney (Australia) | *Coming soon* |
| Tokyo (Japan) | *Coming soon* |
| Toronto (Canada) | *Coming soon* |

## What Action is Required?

- **Migtration of Compute Instances:** Once a data center has started the network infrastructure upgrades, live migrations will be scheduled for all Compute Instances that do not reside on upgraded hardware. This live migration will occur while your Compute Instance is powered on and operating normally. After the migration has been successfully completed, there may be a brief period of downtime while the Compute Instance is rebooted.

- **Update IP failover configuration:** If you have configured IP failover for a public IPv4 address, review the [] guide to learn more about configuring IP failover using bgp. If you were using a now deprecated IPv6 /116 pool for IP failover, consider using an IPv6 /64 range instead. You can configure bgp ahead of time, but will not be able to test or use the configuration until after the network upgrades.