---
slug: network-transfer
author:
  name: Linode
  email: docs@linode.com
description: "Learn how your Linode account's network transfer pool is calculated and billed."
keywords: ["network","billing","account","transfer", "overage"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-21
modified: 2022-06-17
modified_by:
  name: Linode
title: "Network Transfer Usage and Costs"
contributor:
  name: Linode
tags: ["linode platform"]
aliases: ['/platform/billing-and-support/network-transfer-quota/', '/guides/network-transfer-quota/']
---

## Overview

**Network transfer** is the exchange of data between two computers over the public internet or a private network. Other providers and publications may refer to this as data transfer, ingress/egress, and bandwidth, among many other terms. This traffic is broken down into inbound and outbound network transfer. *Inbound network transfer* is data sent *to* your service (such as a file upload). *Outbound network transfer* is data sent *from* your service (such as a web page and its images, stylesheets, and JavaScript files).

## Transfer Allowance

The following Linode services consume network transfer and, in most cases, include a set amount of outbound network transfer allowance per month. The amount of transfer is displayed along with the pricing and plan details for each service. See Linode's [pricing page](https://www.linode.com/pricing) for exact amounts.

- **Compute Instances:** Consume network transfer and include 1-20 TB of transfer allowance per month, depending on plan size

- **NodeBalancers:** Consume network transfer but do not include a monthly transfer allowance.

- **Object Storage:** Consumes network transfer and includes 1TB of transfer allowance per month, regardless of plan size

- **Managed Databases:** Does not consume network transfer or include a monthly transfer allowance.

The allowance included with each service on an account is added to an account-wide **monthly network transfer pool**. Whenever a service consumes network transfer, it is counted towards this account-wide pool and not the individual transfer allowance.

{{< note >}}
If the service is not active for the entire month, the amount of network transfer allowance is prorated based on the number of hours the service was active.
{{</ note >}}

## Usage Costs

Costs associated with network transfer can often be unexpected or confusing in a cloud hosting environment. Linode keeps these costs simple and transparent so that you can easily anticipate your monthly charges.

**Free unmetered network transfer:**

- All inbound network transfer

- Outbound network transfer sent from Compute Instances and NodeBalancers to any Linode service within the same data center, provided the traffic occurs over an IPv6 address, a private VLAN network, or on the private IPv4 address of those services. Public IPv4 addresses, due to the way traffic is routed, is not included in this.

**Metered network transfer:**

- Outbound transfer sent from Compute Instances and NodeBalancers to destinations outside of the origin data center (over both IPv6 and IPv4) and within the same data center if a public IPv4 address is used.

- Outbound transfer from Object Storage (over both public IPv6 and public IPv4), even to other Linode services within the same data center.

All metered network transfer consumed by a service is counted toward the account-wide **monthly network transfer pool**. Any additional transfer usage that exceeds this monthly allotment costs $0.01/GB (which comes to $10/TB) and is charged at the end of the billing period.

{{< note >}}
The combined monthly network transfer pool is typically enough to cover *most* common use cases for our services. You are only billed for additional network transfer if your usage exceeds this monthly pool during a billing period. If traffic for an individual service exceeds the network transfer amount specified by its plan, but the total transfer used between all of your services is still less than your monthly network transfer pool, then you are *not* charged additional fees.
{{</ note >}}

## Monitoring Network Transfer Usage

We recommend that you monitor your network transfer usage throughout the month to ensure that your services aren't consuming more network transfer than expected. You can check your network usage for your current billing cycle via the Cloud Manager or the Linode CLI.

### Cloud Manager

1. Log in to the [Cloud Manager](https://cloud.linode.com).

1. Under the list of the Linode Compute Instances, NodeBalancers, or Object Storage Buckets, a short notice is displayed with the percentage of monthly network transfer pool that has been used.

    ![Screenshot of Monthly Network Transfer Pool Percentage Used](cloud-manager-network-transfer-notice.png)

1. Click the *Monthly Network Transfer Pool* link to display a modal pop-up with more details, including the amount of transfer used, the size of the pool, and when the network transfer usage will reset.

    ![Screenshot of Monthly Network Transfer Pool Overview](cloud-manager-monthly-network-transfer-pool.png)

1. Lastly, you can view more details regarding a Compute Instance's network transfer usage (including historical charts) directly on the Instance's page. To do so, click **Linodes** on the left navigation menu, select the Compute Instance from the list, and navigate to the **Network** tab.

    ![Screenshot of a Compute Instance's Monthly Network Transfer Usage](cloud-manage-compute-network-transfer-usage.png)

    The **Monthly Network Transfer** section includes usage details for the current billing period. The **Network Transfer History** section shows a chart with usage details over the selected period.

### Linode CLI

To view your network utilization (in GB) for the current month, issue the following command:

    linode-cli account transfer

{{< note >}}
You need to generate a Personal Access Token and install the Linode CLI before being able to use the CLI. See the [Linode CLI](/docs/products/tools/cli/get-started/) guide for more information.
{{</ note >}}

### Email Alerts

Linode automatically sends an email notification to [your account's email address](/docs/guides/accounts-and-passwords/#email-addresses-and-contact-information) when you have used 80%, 90%, and 100% of your transfer pool size.

## More Information

Read the [Billing and Payments](/docs/guides/understanding-billing-and-payments/) guide for an overview of Linode billing.
