---
slug: network-transfer
author:
  name: Linode
  email: docs@linode.com
description: "Learn how your Linode account's network transfer pool is calculated and billed."
keywords: ["network","billing","account","transfer", "overage"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-21
modified: 2021-10-13
modified_by:
  name: Linode
title: "Network Transfer Usage and Costs"
contributor:
  name: Linode
tags: ["linode platform"]
aliases: ['/platform/billing-and-support/network-transfer-quota/', '/guides/network-transfer-quota']
---

## Overview

**Network transfer** is the exchange of data between two computers over the public internet or a private network. Other providers and publications may refer to this as data transfer, ingress/egress, and bandwidth, among many other terms. This traffic is broken down into inbound and outbound network transfer. *Inbound network transfer* is data sent *to* your service (such as a file upload). *Outbound network transfer* is data sent *from* your service (such as a web page and its images, stylesheets, and JavaScript files).

## Pricing

Costs associated with network transfer can often be unexpected or confusing in a cloud hosting environment. Linode keeps these costs simple and transparent so that you can easily anticipate your monthly charges.

**Free unmetered network transfer:**

- All inbound network transfer is provided free of charge. This means there are no transfer costs associated with sending data to a Linode service.

- Inbound and outbound network transfer between two Compute Instances (and NodeBalancers) is free as well, provided they are within the same data center and traffic occurs over an IPv6 address, a private VLAN network, or on the private IPv4 address of those services.

**Free metered network transfer:**

- Outbound transfer occurring over the public internet, up to the account's monthly network transfer pool for the billing period.

**Paid metered network transfer:**

- Outbound transfer over the public internet that exceeds the account's monthly network transfer pool. Any additional transfer costs $0.01/GB (which comes to $10/TB) and is charged at the end of the billing period.

## Monthly Network Transfer Pool

Some Linode services, specifically Compute Instances and Object Storage, include a set amount of outbound network transfer per month. The amount of transfer is displayed on Linode's [pricing page](https://www.linode.com/pricing). If the service is not active for the entire month, this amount of network transfer is prorated based on the number of hours the service was active. The transfer included with all services is then added to an account-wide **monthly network transfer pool**.

Any metered usage (outbound network transfer over the public internet) on each individual service is then counted towards the entire pool.

{{< note >}}
You are only billed for additional network transfer if your usage exceeds the monthly network transfer pool during a billing period. If traffic for an individual service exceeds the network transfer amount specified by its plan, but the total transfer used between all of your services is still less than your monthly network transfer pool, then you are *not* charged additional fees.
{{</ note >}}

### Viewing the Monthly Network Transfer Pool and Usage

Linode recommends that you monitor your network transfer usage throughout the month. You can check your network usage for your current billing cycle via the Cloud Manager or the Linode CLI.

#### Cloud Manager

1. Log in to the [Cloud Manager](https://cloud.linode.com).

1. Under the list of the Linode Compute Instances, NodeBalancers, or Object Storage Buckets, a short notice is displayed with the percentage of monthly network transfer pool that has been used.

    ![Screenshot of Monthly Network Transfer Pool Percentage Used](cloud-manager-network-transfer-notice.png)

1. Click the *Monthly Network Transfer Pool* link to display a modal pop-up with more details, including the amount of transfer used, the size of the pool, and when the network transfer usage will reset.

    ![Screenshot of Monthly Network Transfer Pool Overview](cloud-manager-monthly-network-transfer-pool.png)

1. Lastly, you can view more details regarding a Compute Instance's network transfer usage (including historical charts) directly on the Instance's page. To do so, click **Linodes** on the left navigation menu, select the Compute Instance from the list, and navigate to the **Network** tab.

    ![Screenshot of a Compute Instance's Monthly Network Transfer Usage](cloud-manage-compute-network-transfer-usage.png)

    The **Monthly Network Transfer** section includes usage details for the current billing period. The **Network Transfer History** section shows a chart with usage details over the selected period.

#### Linode CLI

To view your network utilization (in GB) for the current month, issue the following command:

    linode-cli account transfer

{{< note >}}
You need to generate a Personal Access Token and install the Linode CLI before being able to use the CLI. See the [Linode CLI](/docs/guides/linode-cli/) guide for more information.
{{</ note >}}

## More Information

Read the [Billing and Payments](/docs/guides/billing-and-payments/) guide for an overview of Linode billing.
