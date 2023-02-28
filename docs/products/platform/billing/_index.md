---
title: Billing
description: "Learn how Linode makes billing simple and easy so you easily anticipate your cloud infrastructure costs"
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
keywords: ["billing", "payments"]
aliases: ['/products/tools/billing/','/platform/billing-and-support/prepaid-billing-and-payments-legacy/','/platform/billing-and-support/how-linode-billing-works/','/platform/billing-and-support/upgrade-to-hourly-billing/','/guides/how-linode-billing-works/','/billing-and-payments/','/platform/billing-and-support/billing-and-payments-classic-manager/','/platform/billing-and-support/billing-and-payments-new-manager/','/platform/billing-and-payments/','/platform/billing-and-support/billing-and-payments/',/guides/billing-and-payments/,'/guides/understanding-billing-and-payments/','/guides/platform/billing-and-support/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-10-25
modified: 2022-11-17
modified_by:
  name: Linode
tags: ["linode platform"]
---

Linode strives to provide transparent and uncomplicated pricing structures and billing policies. As a supplement to our [Pricing](https://www.linode.com/pricing/) page, read through this guide to understand how we bill for services and how you can pay for these services. For instructions on how to manage your billing in the Cloud Manager, see the [Manage Billing in Cloud Manager](/docs/products/platform/billing/guides/) guide. If you have a question that isn't answered in either of these guides, don't hesitate to [contact Support](https://www.linode.com/support/).

## Understand How Billing Works

Linode uses a hybrid hourly billing model that is simple and flexible. It enables you to continuously add, modify, and remove services throughout the month. After the month is over, you receive an invoice for *the hourly usage of each service **up to the monthly cap***. Here are some important billing considerations:

- Every paid service offered by Linode has a predicable monthly rate (also called the monthly cap) in addition to a flexible hourly rate.

- When a service is added, charges accrue on the account at the hourly rate up to the monthly cap. These *accrued charges* are displayed on the **Billing Info** tab within the Account page of the Cloud Manager\*. Usage is always rounded up to the nearest hour.

- Linode uses a monthly billing cycle. An invoice is automatically generated on the first day of each month and includes the previous month's usage.

If your services stay the same month over month, your bill remains predictable. You are never billed more than the monthly rate for each service, excluding [network transfer overages](/docs/guides/network-transfer/). If you use a service for just part of the month, hourly billing enables you to only be charged for the time the service is present on the account.

\*Review the [Viewing Current Balance](/docs/products/platform/billing/guides/access-billing/) section of the Manage Billing in Cloud Manager guide to monitor your account balance and accrued charges throughout the month.

### Example Billing Scenarios

Here are a few examples of common billing scenarios you might encounter. For these examples, we will assume the month is 30 days (720 hours). We will also be using a 4GB Linode Compute Instance, which has an hourly rate of $0.03/hour and a monthly rate/cap of $20.

#### A Service is Present on an Account for the *Entire* Month

You create a 4GB Compute Instance prior to the start of the month and it remains on your account for the entire month. Calculating the service fees at the hourly rate for 720 hours (again, assuming a 30 day month), the total would have come to $21.60. Since this exceeds the monthly cap for this service, you are instead charged the predictable $20 monthly rate.

#### A Service is Present on an Account for *Almost* the Entire Month

You create a 4GB Compute Instance on the second day of the month, half-way through the day. It remains on your account for the remainder of the month and, in total, was used for 684 hours. Calculating the service fees at the hourly rate, the total would have come to $20.52. Since this still exceeds the monthly cap for this service, you are instead charged the predictable $20 monthly rate.

#### A Service is Present on an Account for *Just Some* of the Month

You created a 4GB Compute Instance mid-way through the month and deleted it exactly 5 days later. In total, it was used for 120 hours. Calculating the service fees at the hourly rate, the total is $3.60. Since this is less than the monthly cap, you are indeed billed at the hourly rate and charged $3.60 for your usage.

### Mid-Month Billing

You may receive a mid-month bill from Linode if you reach a certain threshold of Linode services used within a single month. For many users, this amount will initially be **$50.00**. That amount can be adjusted over time by accruing a positive account history. In general, a history of on-time payments to Linode will increase the threshold amount.

### Will I Be Billed For Powered Off or Unused Services?

**Charges will accrue for any service present on an account, even if it is powered off or otherwise not actively being used.**  This includes Linode Compute Instances that have been powered off as the data is still maintained and resources (such as RAM and network capacity) are still reserved. To avoid additional charges for a service you no longer need, [remove the service](/docs/products/platform/billing/guides/stop-billing/) from your account.

## Payments

When an invoice is generated on the first of the month (or mid-month), Linode automatically attempts to charge the account's default payment method. In addition to these automatic recurring payments, you can make one-time payments to add funds to your account, which will then be used to pay future invoices.

### Manual Payments

At any time, you can make a manual one-time payment to add funds to your account. This is used to pay a past-due balance or to *pre-pay* for services, which adds a positive account balance that will be used towards future invoices. Review the [Making a One-Time Payment](/docs/products/platform/billing/guides/make-a-payment/) section of the Manage Billing in Cloud Manager guide for instructions when submitting a manual payment.

### Refunds

If you are unsatisfied with your service for any reason, you can [cancel your account](/docs/products/platform/accounts/guides/cancel-account/) within the first seven days and request a full refund. You are entitled to receive a refund of any positive account balance not added through promotional credits. To request this refund, simply add a note to the cancellation form. When cancelling an account after the first seven days, there is a $5 processing fee. Only payments made within the last 180 days are eligible.