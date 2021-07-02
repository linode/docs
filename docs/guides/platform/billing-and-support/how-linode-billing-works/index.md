---
slug: how-linode-billing-works
author:
  name: Linode
  email: docs@linode.com
description: Linode uses an hourly billing system. Use this guide to learn about how our hourly billing works, when invoices are issued, which payment methods are accepted, and other key billing information.
og_description: Linode uses an hourly billing system. Use this guide to learn about how our hourly billing works, when invoices are issued, which payment methods are accepted, and other key billing information.
keywords: ["billing", "payments"]
aliases: ['/platform/billing-and-support/prepaid-billing-and-payments-legacy/','/platform/billing-and-support/how-linode-billing-works/','/platform/billing-and-support/upgrade-to-hourly-billing/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-07-02
modified_by:
  name: Linode
published: 2019-10-25
title: How Linode Billing Works
h1_title: Billing and Payments
enable_h1: true
tags: ["linode platform"]
---

We've done our best to create straightforward billing and payment policies. Still have questions? Use this guide to learn how our hourly billing works. To learn how to manage your billing in the Cloud Manager see the [Manage Billing in Cloud Manager](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/) guide. If you have a question that isn't answered in either guide, please feel free to [contact Support](/docs/platform/billing-and-support/support/).

## Understanding Billing

Linode uses a hybrid hourly billing model that is simple and flexible. It enables you to continuously add, modify, and remove services throughout the month. After the month is over, you receive an invoice for *the hourly usage of each service **up to the monthly cap***. Here are some important billing considerations:

- Every paid service offered by Linode has a predicable monthly rate (also called the monthly cap) in addition to a flexible hourly rate.

- When a service is added, charges accrue on the account at the hourly rate up to the monthly cap. These *accrued charges* are displayed on the **Billing Info** tab within the Account page of the Cloud Manager\*. Usage is always rounded up to the nearest hour.

- Linode uses a monthly billing cycle. An invoice is automatically generated on the first day of each month and includes the previous month's usage.

If your services stay the same month over month, your bill remains predictable. You are never billed more than the monthly rate for each service, excluding [network transfer overages](/docs/guides/network-transfer-quota/). If you use a service for just part of the month, hourly billing enables you to only be charged for the time the service is active on the account.

\*Review the [Viewing Current Balance](/docs/guides/manage-billing-in-cloud-manager/#viewing-current-balance) section of the Manage Billing in Cloud Manager guide to monitor your account balance and accrued charges throughout the month.

### Example Billing Scenarios

Here are a few examples of common billing scenarios you might encounter. For these examples, we will assume the month is 30 days (720 hours). We will also be using a 4GB Linode Compute Instance, which has an hourly rate of $0.03/hour and a monthly rate/cap of $20.

#### A Service is Active for the *Entire* Month

You create a 4GB Compute Instance prior to the start of the month and it remains on your account for the entire month. Calculating the service fees at the hourly rate for 720 hours (again, assuming a 30 day month), the total would have come to $21.60. Since this exceeds the monthly cap for this service, you are instead charged the predictable $20 monthly rate.

#### A Service is Active for *Almost* the Entire Month

You create a 4GB Compute Instance on the second day of the month, half-way through the day. It remains on your account for the remainder of the month and, in total, was active for 684 hours. Calculating the service fees at the hourly rate, the total would have come to $20.52. Since this still exceeds the monthly cap for this service, you are instead charged the predictable $20 monthly rate.

#### A Service is Active for *Just Some* of the Month

You created a 4GB Compute Instance mid-way through the month and deleted it exactly 5 days later. In total, it was active for 120 hours. Calculating the service fees at the hourly rate, the total is $3.60. Since this is less than the monthly cap, you are indeed billed at the hourly rate and charged $3.60 for your usage.

### Mid-Month Billing

You may receive a mid-month bill from Linode if you reach a certain threshold of Linode services used within a single month. For many users, this amount will initially be **$50.00**. That amount can be adjusted over time by accruing a positive account history. In general, a history of on-time payments to Linode will increase the threshold amount.

### Will I Be Billed For Powered Off or Unused Services?

**Charges will accrue for any active service, even if it is powered off or otherwise not in use.**  This includes Linode Compute Instances that have been powered off as well as any service you might have added to the account but are not using. When a Compute Instance is on your account, the data is still maintained and resources (such as RAM and network capacity) are still reserved. To avoid additional charges for a service you no longer need, [remove the service]((/docs/guides/manage-billing-in-cloud-manager/#removing-services)) from your account.

## Payments

When an invoice is generated on the first of the month (or mid-month), Linode automatically attempts to charge the account's default credit card on file. In addition to these automatic payment attempts, you can make manual payments to add funds to your account, which will then be used to pay future invoices.

### Payment Methods

- **Credit cards:** Visa, MasterCard, Discover, and American Express credit (and debit) cards are accepted. They can be used to both automatically pay your invoice and to manually add funds to the account. Review the [Updating Credit Card Information](/docs/guides/manage-billing-in-cloud-manager/#updating-credit-card-information) section to update your credit card on file.

- **PayPal:** PayPal can be used to manually add funds to your account. At this time, it cannot be used as the account's default payment method to automatically pay monthly invoices. If you wish to pay your balance with PayPal, you'll need to log into [Cloud Manager](http://cloud.linode.com) and submit a manual payment.

- **Checks, ACH, and wire transfers:** Please [contact Support](/docs/guides/support/) if you wish to pay through one of these methods.

The address affiliated with a payment method should match the [Billing Contact Information](/docs/guides/accounts-and-passwords/#updating-billing-contact-information) on the account.

{{< note >}}
Maintaining a valid credit card on file with your account is a requirement of our [Master Services Agreement](https://www.linode.com/legal-msa/).
{{< /note >}}

### Manual Payments

At any time, you can make a manual payment to add funds to your account. This is used to pay a past-due balance or to *pre-pay* for services, which adds a positive account balance that will be used towards future invoices. Review the [Making a Payment](/docs/guides/manage-billing-in-cloud-manager/#making-a-payment) section of the Manage Billing in Cloud Manager guide for instructions when submitting a manual payment.

### Refunds

If you are unsatisfied with your service for any reason, you can [cancel your account](/docs/guides/manage-billing-in-cloud-manager/#cancelling-your-account) within the first seven days and request a full refund. You are entitled to receive a refund of any positive account balance not added through promotional credits. To request this refund, simply add a note to the cancellation form. When cancelling an account after the first seven days, there is a $5 processing fee. Only payments made within the last 180 days are eligible.

## Tax Information

Review our [Tax Information](/docs/guides/tax-information/) guide for information about which taxes Linode may charge.

## Referral Program

When you refer a new user to Linode through our referral program, both you and the new user can receive a promotional credit. Here are the program details:

-  **A new user receives a $100 60-day credit** when they sign up through a referral link. Before the credit is applied, they must add a valid payment method to their account.

-  **The referrer receives a $25 non-expiring credit** once the new user has been active for 90-days and spends $25 or more on services (after their promotional credit has been used or has expired).

To learn more about this program, visit the [Referral Program](https://www.linode.com/referral-program/) page on our website.

### Find Your Referral Link

To activate the referral program and obtain a referral link, you must spend at least $25 with Linode, not including any promotional credits added to your account. Once activated, your referral link (including your unique referral code) can be viewed within the Cloud Manager.

1.  Log in to the [Linode Cloud Manager](http://cloud.linode.com).
1.  Select the **My Profile** link by clicking on your username at the top of the page.
1.  Select the **Referrals** tab.
1.  The referral code and URL are listed within this section.

You can provide the referral link to friends and colleagues as well as post it to your website and social media.