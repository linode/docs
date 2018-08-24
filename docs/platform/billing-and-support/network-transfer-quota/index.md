---
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how your Linode account's network transfer pool is calculated and billed."
keywords: ["network","billing","account","transfer", "overage"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-21
modified: 2018-08-21
modified_by:
  name: Linode
title: "Network Transfer Quota"
contributor:
  name: Linode
---

Every Linode plan includes a network transfer quota. Transfer quotas represent the total amount of monthly traffic your services can use as part of your plans' basic pricing.

Transfer quota amounts are listed for each plan on the Linode [pricing page](https://www.linode.com/pricing).

## Network Transfer Pool

The transfer quota amounts for all of your Linodes are added together to create a *network transfer pool*. Each of your Linodes is able to use transfer from this pool.

If a specific Linode exceeds the transfer quota provided by its plan, but the total transfer used between all of your Linodes is still less than your pool total, then you will not be charged any overages.

Linodes from different datacenters all contribute to and use the same pool total.

### Network Transfer Pool Example

If you have two Linodes:

- Linode A, which comes with 1TB transfer
- Linode B, which comes with 2TB transfer

Your monthly pool total would be 3TB. If Linode A uses 1.5TB of traffic during the month, and Linode B uses 1TB of traffic, then the total used is 2.5TB. The 1.5TB used by Linode A is greater than its individual 1TB quota, but the 2.5TB total is less than the pool, so no overages are billed.

## Which Traffic Applies to the Transfer Quota

Transfer quota usage only considers traffic on your Linode's public address. Transfer over the private network does not count towards your monthly quota.

All inbound traffic to your Linode is free and will not count against your quota--only trafic that your Linode emits on the public address is counted.

## Transfer Resets, Proration, and Overages

Your transfer quota is reset every month.

### Why is My Linode's Quota less than My Plan's Quota?

Your Linode’s transfer quota is prorated based on the Linode's creation date. This means that a Linode you create mid-month will have a lower transfer quota than what’s listed on the pricing page, depending on how much time remains in the month. For example, if you create a Linode half-way through the month, it will come with half of the quota listed for your Linode's plan.

The transfer quota is reset at the beginning of the next month, and you will see the full quota amount listed at that time.

If you remove a Linode before the end of the month, then the quota it contributes to your pool will also be reduced, according to the date the Linode was deleted.

For example, if you create a Linode on the first of the month, then your pool will initially include the full quota for that Linode's plan. If you remove that Linode half-way through the month, then your pool total will be updated and reduced by half the Linode plan's quota.

### How Overages Work

If you use all available bandwidth in your network transfer pool, you can continue to use your Linodes normally, but you'll be **charged $0.02 for each additional GB** at the end of your billing cycle.

### How to Mitigate Overages

If you have gone over your quota, or you think you may before the end of the month, you can consider one of the following options to raise your pool total and avoid overages:

1. [Increase the size](/docs/platform/disk-images/resizing-a-linode/) of an existing Linode to access more monthly transfer bandwidth.

1. Purchase (an) additional Linode(s) with the specific purpose of increasing your pool total.

When taking one of these actions, keep in mind that the quota amount that will be added is [prorated](#why-is-my-linode-s-quota-less-than-my-plan-s-quota) according to the current date.

## View Network Pool Usage

Linode recommends that you monitor your network pool usage throughout the month. You can check your network usage for your current billing cycle via the Linode Manager or the Linode CLI.

**Linode Manager**

1. Log in to the Linode Manager and view your Linode Dashboard.

1. Under the **This Month's Network Transfer Pool** heading, a graphic displays (in GB) the transfer used, the unused pool amount remaining, and the pool total for the month.

**Linode CLI**

- To view your network utilization (in GB) for the current month, issue the following command:

        linode-cli account transfer

    {{< note >}}
You will need to generate a Personal Access Token and install the Linode CLI before being able to use the CLI. See the [Linode CLI](/docs/platform/api/using-the-linode-cli/) guide for more information.
{{</ note >}}

## More Information

Read the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for an overview of Linode billing.