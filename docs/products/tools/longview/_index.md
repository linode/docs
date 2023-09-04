---
title: Longview
title_meta: "Longview Product Documentation"
description: "Longview is Linode’s system data graphing service. It tracks metrics for CPU, memory, and network bandwidth on both an aggregate and per-process basis."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    product_description: "View real-time system metrics and resource utilization to gain insight into your Linux-based cloud workloads."
published: 2023-05-24
aliases: ['/platform/longview/pricing/','/guides/linode-longview-pricing-and-plans/','/platform/longview/','/guides/platform/monitoring/']
---

Longview is Linode’s system data graphing service. It tracks metrics for CPU, memory, and network bandwidth on both an aggregate and per-process basis. It also provides real-time graphs that can help expose performance problems.

## Platform-agnoistic

The Longview client is [open source](https://github.com/linode/longview) and provides an agent that can be installed on any Linux distribution – including systems not hosted on the Linode platform.

## Pro Plan

Longview is free for all customers for up to ten clients. You also have the option to purchase **Longview Pro** which includes additional analytics for an added cost. Longview's free version updates every 5 minutes and provides 12 hours of data history. Longview Pro gives you data resolution at 60 second intervals, and you can view a complete history of your Linode’s data instead of only the previous 12 hours.

## Availability

Longview can be installed on Compute Instances across [all regions](https://www.linode.com/global-infrastructure/).

## Pricing

There are four different Longview Pro plan tiers you can choose from. Each plan varies in the amount of clients that can be monitored by Longview.

| Plan | Number of Clients | Price |
| -- | -- | -- |
| Longview Free | 10 | Free |
| Longview Pro 3 Pack | 3 | $20/mo ($0.03/hr) |
| Longview Pro 10 Pack | 10 | $40/mo ($0.06/hr) |
| Longview Pro 40 Pack | 40 | $100/mo ($0.15/hr) |
| Longview Pro 100 Pack | 100 | $200/mo ($0.30/hr) |

## Technical Specifications

- Compatible with most Linux systems, even those not on the Linode platform. Official support for **CentOS**, **Debian**, and **Ubuntu**.
- **Data retention:** Unlimited for Longview Pro, 12 hours for Longview Free.
- **Data resolution:** 1 minute for Longview Pro, 5 minutes for Longview Free.