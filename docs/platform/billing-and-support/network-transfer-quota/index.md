---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Details on how your Linode account's network transfer pool quota is calculated and billed.'
keywords: ['network','billing','account','transfer', 'overage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-21
modified: 2018-08-21
modified_by:
  name: Linode
title: "Network Transfer Pool Quota"
contributor:
  name: Linode
---

Every Linode plan includes a network transfer limit. The network transfer limit for all of your Linodes are combined to determine your monthly *network transfer pool* quota.

- The network transfer pool can be used by any Linode on your account. It does not matter if your Linodes are in separate data centers.

- Network bandwidth usage only counts transfers on the public address.

- All inbound traffic is free and will not count against your quota.

- Transfer over the private network does not count towards your monthly quota.

- Your transfer quota is reset every month.

- If you use all available bandwidth in your network transfer pool, you can continue to use your Linodes normally, but you'll be **charged $0.02 for each additional GB** at the end of your billing cycle.

Full specs of each plan can be found on our [pricing page](https://www.linode.com/pricing).

## Transfer Proration

Your Linode’s transfer quota is prorated based on its creation date. This means that a Linode you create mid-month will have a lower transfer quota than what’s listed on our pricing page, depending on how much time remains in the month.

The prorated transfer quota is reset at the beginning of the following month.

## Mitigate Overages

In order to mitigate going over your Network Transfer quota, you can:

1. [Increase the size](https://linode.com/docs/platform/disk-images/resizing-a-linode/) of an existing Linode to access more monthly transfer bandwidth.

1. Purchase (an) additional Linode(s) with the specific purpose of increasing your Network Transfer Pool quota to avoid the overage.

The initial month's network transfer total cost is prorated when you add a new Linode to your account or increase an existing Linode's size.

## View Network Pool Usage

We recommend monitoring your network pool usage to avoid overages. You can check your network usage for your current billing cycle via the Linode Manager or the Linode CLI.

**Linode Manager**

1. Log in to the Linode Manager and view your Linode Dashboard.

1. Under the "This Month's Network Transfer Pool" heading, you will see your network utilization in GB of your total transfer pool.

**Linode CLI**

- To view your network utilization, in GB, for the current month, issue the following command:

        linode-account show --api-key your-api-key

    {{< note >}}
You will need to generate a Personal Access Token and install the Linode CLI before being able to use the CLI. See the [Linode CLI](/docs/platform/api/using-the-linode-cli/) guide for more information.
    {{</ note >}}

## More Information

Read the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for more information on various billing topics.