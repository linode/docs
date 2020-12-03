---
slug: network-transfer-quota
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how your Linode account's network transfer pool is calculated and billed."
keywords: ["network","billing","account","transfer", "overage"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-21
modified: 2020-12-03
modified_by:
  name: Linode
title: "Network Transfer Quota"
contributor:
  name: Linode
tags: ["linode platform"]
aliases: ['/platform/billing-and-support/network-transfer-quota/']
---

Your *network transfer quota* represents the total monthly amount of traffic your services can use as part of your Linode plans' basic pricing. Each Linode plan includes a specified amount of transfer. Transfer amounts are listed for each plan on the Linode [pricing page](https://www.linode.com/pricing).

## Network Transfer Pool

Your monthly network transfer quota for your services is for your entire account, not for any individual Linode. The transfer amounts provided by all of your Linodes' plans are added together, and your account's monthly quota is equal to the total. This is also referred to as your *network transfer pool*. Each of your Linodes is able to use bandwidth from this pool.

If an individual Linode's traffic exceeds the network transfer amount specified by its plan, but the total transfer used between all of your Linodes is still less than your pool total, then you are *not* charged overages.

Linodes from different data centers all use the same transfer pool.

### Network Transfer Pool Example

If you have two Linodes:

- Linode A, which comes with 1TB transfer
- Linode B, which comes with 2TB transfer

Your monthly pool total, or your account's quota, would be 3TB. If Linode A uses 1.5TB of traffic during the month, and Linode B uses 1TB of traffic, then the total used between them is 2.5TB. The 1.5TB used by Linode A is greater than the 1TB of transfer specified by its plan, but the 2.5TB total is less than the account quota, so no overages are billed.

## Which Traffic Applies to the Transfer Quota

The transfer quota only considers traffic on your Linodes' public addresses. Traffic over the private network does not count against your monthly quota.

All inbound traffic to your Linodes is free and will not count against your quota--only traffic that your Linodes emit on their public addresses is counted.

{{< note >}}
Linode does not offer private IPv6 address allocations. Our IPv6 accounting was designed so that local IPv6 traffic does not count against your transfer quota, so you can use your default IPv6 address as if it were a private IP address.
{{</ note >}}

## Transfer Resets, Proration, and Overages

Your transfer quota is reset at the beginning of each month at midnight EST/EDT.

### Why is My Linode's Network Transfer less than My Plan's Transfer?

**Your account's transfer quota is prorated** based on your Linodes' creation and deletion dates.

A Linode you create mid-month will include a lower transfer amount than what’s listed on the pricing page, depending on how much time remains in the month.

For example, if you create a Linode half-way through the month, it comes with half of the transfer listed for your Linode's plan. Because your transfer quota is reset at the beginning of the next month, and you see the full transfer amount at that time.

If you remove a Linode before the end of the month, then the transfer it contributes to your pool is also reduced according to the date the Linode was deleted.

For example, if you create a Linode on the first of the month, then your pool initially includes the full transfer amount for that Linode's plan. If you remove that Linode half-way through the month, then your pool total is updated and reduced by half the Linode plan's transfer.

### How Overages Work

If you use all available bandwidth in your network transfer pool, you can continue to use your Linodes normally, **but you are charged $0.01 for each additional GB** at the end of your billing cycle.

### How to Mitigate Overages

If you have gone over your quota, or you think you may before the end of the month, you can consider one of the following options to raise your pool total and avoid overages:

1. [Increase the size](/docs/guides/resizing-a-linode/) of an existing Linode to access more monthly transfer bandwidth.

1. Purchase (an) additional Linode(s) with the specific purpose of increasing your pool total. You may want to delete any Linodes created for this purpose at the end of the month if you don't anticipate needing a higher pool total in the future.

When taking one of these actions, keep in mind that the quota amount that is added is [prorated](#why-is-my-linodes-network-transfer-less-than-my-plans-transfer) according to the current date.

## View Network Pool Usage

Linode recommends that you monitor your network pool usage throughout the month. You can check your network usage for your current billing cycle via the Linode Manager or the Linode CLI.

**Linode Manager**

1. Log in to the Linode Manager and view your Linode Dashboard.

1. Under the **This Month's Network Transfer Pool** heading, a graphic displays (in GB) the transfer used, the unused pool amount remaining, and your account's quota for the month.

**Linode CLI**

- To view your network utilization (in GB) for the current month, issue the following command:

        linode-cli account transfer

    {{< note >}}
You need to generate a Personal Access Token and install the Linode CLI before being able to use the CLI. See the [Linode CLI](/docs/guides/linode-cli/) guide for more information.
{{</ note >}}

## More Information

Read the [Billing and Payments](/docs/guides/billing-and-payments/) guide for an overview of Linode billing.
