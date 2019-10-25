---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to Linode Billing.
keywords: ["billing", "payments"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2019-10-25
title: How Linode Billing Works
---

We've done our best to create straightforward billing and payment policies. Still have questions? Use this guide to learn how our hourly billing works. To learn how to manage your billing in the Cloud Manager see the [Manage Billing in Cloud Manager](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/) guide. If you have a question that isn't answered in either guide, please feel free to [contact Support](/docs/platform/billing-and-support/support/).

## How Hourly Billing Works

All services are billed automatically at the end of the month. If you used a service for the entirety of the past month, you'll be billed the **monthly cap** amount for that service. If you used a service for only part of the past month, you'll be billed at the **hourly** rate for that service. If your usage during any given month hits the monthly cap for the service, hourly billing stops. You'll never be billed more than the monthly cap for any service, excluding network [transfer overages](/docs/platform/billing-and-support/network-transfer-quota/#how-overages-work). In other words, if you've used a service for the entire month, you'll have a predictable amount on your bill.

{{< note >}}
Review the [Viewing Current Balance](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#viewing-current-balance) section of the Manage Billing in Cloud Manager guide to monitor your balance throughout the month.
{{< /note >}}

## Mid-Month Billing

You may receive a mid-month bill from Linode if you reach a certain threshold of Linode services used within a single month. For many users, this amount will be **$50.00**, although your account history with Linode can adjust that amount. In general, a history of on-time payments to Linode will increase the threshold amount.

What does a mid-month bill mean? Your existing active services will stay active. However, you must pay the mid-month bill before you can activate additional Linode services. Once your payment is processed, you may continue adding new services.

## Payment Methods

We accept Visa, MasterCard, Discover, and American Express. We also accept PayPal, as well as checks and money orders (which *must* be in USD) made out to "Linode, LLC" and sent to our [office](http://www.linode.com/contact). Please [contact Support](/docs/platform/billing-and-support/support/) before paying with check or money order. Note that we do not accept bank/wire transfers.

PayPal payments can only be made **after** an account is opened with an initial payment from a credit or debit card. PayPal cannot be used for automatic monthly payments. If you wish to pay your balance with PayPal, you'll need to log into [Cloud Manager](http://cloud.linode.com) and submit a manual payment.

{{< note >}}
Review the [Making a Payment](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#making-a-payment) section of the Manage Billing in Cloud Manager guide for instructions when submitting a manual payment. Review the [Updating Credit Card Information](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#updating-credit-card-information) section to update your credit card on file.
{{< /note >}}

If you overpay, credit will be applied to your account; this allows you to prepay if desired. Service credit is always used before charging the credit card on file for ongoing service.

## Linode Cloud Hosting and Backups

Full specs of each plan can be found on our [pricing page](https://www.linode.com/pricing)

A large base amount of network transfer is included with all Linode plans, but exceeding that amount can result in a [transfer overage](/docs/platform/billing-and-support/network-transfer-quota/#how-overages-work) charge beyond the monthly cap.s

Due to the [impending exhaustion of the IPv4 address space](http://en.wikipedia.org/wiki/IPv4_address_exhaustion), Linode requires users to provide technical justification in order to add extra public IPv4 addresses to an instance. If you need access to additional IPv4 addresses, please [contact Support](/docs/platform/billing-and-support/support/) with your justification.

## Object Storage

Review our [Object Storage Pricing and Limitations](/docs/platform/object-storage/pricing-and-limitations/) guide for information on Object Storage pricing and how Object Storage interacts with your account's network transfer pool.

## Network Transfer

Review our [Network Transfer Quota](/docs/platform/billing-and-support/network-transfer-quota/) guide for complete information and examples of how Linode bills for network transfer.

## If My Linode is Powered Off, Will I Be Billed?

**If your Linode is powered off you will still be billed for it.** Linode maintains your saved data and reserves your ability to use other resources like RAM and network capacity, even when your Linode is powered off. You will also be billed for any other active Linode service, such as Longview Pro or extra IP addresses.

If you want to stop being billed for a particular Linode service, you need to [remove](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#removing-services) it from your account entirely.

## Referral Credits

You can receive service credit by referring new users to Linode. When you refer someone who maintains at least one active Linode for 90 days, your account will be issued a $20 service credit. Here's how to find your account referral code and URL:

1.  Log in to the [Linode Cloud Manager](http://cloud.linode.com).
1.  Select the **My Profile** link by clicking on your username at the top of the page.
1.  Select the **Referrals** tab.
1.  The referral code and URL are listed under the **Referrals** section. You can provide the code to friends and use the URL on your website to generate referrals.

Referral service credits must be used to purchase Linode services, and cannot be refunded as cash.

## Tax Information

Review our [Tax Information](/docs/platform/billing-and-support/tax-information/) guide for information about which taxes Linode may charge.
