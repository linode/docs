---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: Our guide to billing and payments
keywords: ["prepaid", "billing", "payments", "credit", "referral", "invoice"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['prepaid-billing/']
modified: 2017-02-15
modified_by:
  name: Linode
published: 2012-04-05
title: 'Prepaid Billing and Payments (Legacy)'
---

Use this guide to learn how our prepaid billing system works and how to make payments, update your billing information, get referral credits, and remove services. If you have a question that isn't answered here, please feel free to [contact support](/docs/support).

This guide applies to customers using Linode's prepaid billing system. For current information, please see [the current billing guide](/docs/billing-and-payments).

{{< note >}}
To convert your prepaid account to Hourly billing, see [this guide](/docs/platform/upgrade-to-hourly-billing).
{{< /note >}}

## How Prepaid Billing Works

All services are billed automatically on the first of the month, and all fees billed to your account are prorated for the current billing cycle. This means that if you sign up or purchase extras in the middle of the billing cycle, you will be charged a prorated amount for the amount of time left in the cycle. At the beginning of the next billing cycle, your account will be billed the full cost of your Linode and any extra services.

 {{< note >}}
If you sign up after the 19th of the month, your account will be billed for the time left in the current month, plus the full amount of the next month.
{{< /note >}}

## Payment Methods

We accept Visa, MasterCard, Discover, and American Express. For payments of a year or more, we also accept checks or money orders (which *must* be in USD) made out to "Linode, LLC" and sent to our [office address](http://www.linode.com/about/). Please [contact support](/docs/support) before paying with check or money order. Note that we do not accept bank/wire transfers, and we have no plans to support PayPal at this time.

## Making a Payment

You can use the Linode Manager to pay an outstanding balance or prepay for Linode services. Here's how:

1.  Log in to the [Linode Manager](http://manager.linode.com).
2.  Click the **Account** tab.
3.  Click the **Make a Payment** tab.
4.  Enter the amount of money you would like to pay in the **Amount to Charge** field.
5.  Enter the CVV number on the back of you credit card in the **CVV** field.
6.  Click **Continue**. A verification prompt appears.
7.  Click **Charge Credit Card**.

The payment may take a few minutes to be applied to your account. Click the **Account** subtab to view your new account balance.

### Discounts for Prepayment

Linode provides a 10% discount for annual prepayment, and a 15% discount for biennial prepayment. To prepay for a year or more of service and receive your discount, please [contact support](/docs/support).

## Bandwidth Overages

If you exceed your monthly bandwidth quota, your account will be billed for \$0.02/GB at the end of the current month.

## Accessing Billing History

All of your billing history is stored in the Linode Manager. Here's how to access it:

1.  Log in to the [Linode Manager](http://manager.linode.com).
2.  Click the **Account** tab.
3.  Click the **Billing History** tab.

Select an invoice to view the charges for a particular month. You can also download invoices in PDF format.

## Referral Credits

You can receive service credit by referring new users to Linode. When you refer someone who maintains at least one active Linode for 90 days, your account will be issued a \$20 service credit. Here's how to find your account referral code and URL:

1.  Log in to the [Linode Manager](http://manager.linode.com).
2.  Select the **my profile** link.
3.  Select the **Referrals** tab.
4.  The referral code and URL are listed under the **Referrals** section. You can provide the code to friends and use the URL on your website to generate referrals.

Referral service credits must be used to purchase Linode services, and cannot be refunded as cash.

## Updating Credit Card Information

Keep your credit card information up to date to prevent service interruptions. Here's how:

1.  Log in to the [Linode Manager](http://manager.linode.com).
2.  Click the **Account** tab.
3.  Click the **Update Credit Card** tab.
4.  Enter your credit card number and the card's expiration date.
5.  Click **Update Credit Card**.

Your credit card information will be updated.

 {{< note >}}
If you have an outstanding balance, you will need to make a manual payment to bring your account up to date. See the [Making a Payment](#making-a-payment) section for more information.
{{< /note >}}

## Removing Services

Our services are provided without a contract, so you're free to remove services from your account at any time. Here's how:

1.  Log in to the [Linode Manager](http://manager.linode.com).
2.  To remove a Linode from your account, click the **Linodes** tab, and then select the **Remove** link next to the Linode you want to remove.
3.  To remove extras from your account, click the **Linodes** tab, select a Linode, click the **Extras** tab, and then select the **Remove** link.
4.  To remove a NodeBalancer from your account, click the **NodeBalancers** tab, and then select the **Remove** link next to the NodeBalancer you want to remove.
5.  To remove the Linode Backup Service, please [contact support](/docs/support).

If you remove services from your account, you will be issued a prorated service credit for the time left in the current billing period. This credit may be used to purchase additional Linode services in the future. Service credit is always used before charging the credit card on file for ongoing service.

## Canceling Your Account

You can cancel your account and receive a refund. Here's how:

1.  Log in to the [Linode Manager](http://manager.linode.com).
2.  Click the **Accounts** tab.
3.  At the bottom of the page, select the **Cancel this Account** link. The cancel account webpage appears.
4.  If your account has been active longer than 7 days, you are entitled to the prorated amount of the fees you've paid in the current billing cycle, minus a \$5 processing fee. To request a refund, enter a note in the text field.
5.  Select the confirmation checkbox.
6.  Click the **Cancel this Account Immediately** checkbox.

Your account will be canceled and all of your services will be deactivated.

 {{< note >}}
You do not have to cancel your account to prevent recurring charges. Instead, you can remove all Linodes and services from your account via the **Linodes** tab in the Linode Manager. This will allow you to retain your Linode account. If you use Longview with non-Linode services, or want to keep your account name and history, you may find this to be a useful option. See the [Removing Services](#removing-services) section for more information.
{{< /note >}}
