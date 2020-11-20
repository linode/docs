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
modified_by:
  name: Linode
published: 2019-10-25
title: How Linode Billing Works
tags: ["linode platform"]
---

We've done our best to create straightforward billing and payment policies. Still have questions? Use this guide to learn how our hourly billing works. To learn how to manage your billing in the Cloud Manager see the [Manage Billing in Cloud Manager](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/) guide. If you have a question that isn't answered in either guide, please feel free to [contact Support](/docs/platform/billing-and-support/support/).

## How Hourly Billing Works

All services are invoiced automatically on the first day of the month for usage from the previous month.

  - If you use a service for the entirety of the previous month, you're sure to hit the **monthly cap** and your bill will only be for the monthly cap for that service. See [Example: Monthly Cap Met](#example-monthly-cap-met).
  - If you use a service for only part of the past month, you're billed at the **hourly** rate for that service. See [Example: Hourly Billing](#example-hourly-billing)
  - If your usage during any given month hits the monthly cap for the service, regardless of when you start or stop the service, hourly billing stops and you are charged the monthly cap. See [Example: Monthly Cap Met](#example-monthly-cap-met)
  - You'll never be billed more than the monthly cap for any service, excluding network [transfer overages](/docs/platform/billing-and-support/network-transfer-quota/#how-overages-work). In other words, if you've used a service for the entire month, you'll have a predictable amount on your bill.

### Example: Monthly Cap Met

- You start a Linode 1 GB server before the 1st of the month. It's hourly rate is $.0075/hour. After 30 days, at the end of the month, it would normally be billed at 30 full 24 hour days, or 720 hours &times; $.0075 = $5.40. However, because of the monthly cap, you will only be billed $5.00.

- You start a High Memory Linode 48 GB server on the 2nd of the month. It's hourly rate is $.18/hour. After running it for 672 hours (28 full 24 hour days), you delete it. At the hourly rate you would be billed at 672 &times; $.18 = $120.96. However, because of the monthly cap, you will only be billed $120.00.

### Example: Hourly Billing

You start a Linode 1GB server on the 20th of the month. It's hourly rate is $.0075. After 10 days, at the end of the month, it is billed at 10 days &times; 24 hours &times; $.0075 = $1.80.

### Example: Cancelled or Removed Services

Billing happens at the end of the month following service, even if you cancel or remove services. For example, if you start a Linode 1GB server on the 5th of the month, then remove it on the 10th. At the end of the month, you will be billed for the 5 days the Linode was running.

{{< note >}}
Review the [Viewing Current Balance](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#viewing-current-balance) section of the Manage Billing in Cloud Manager guide to monitor your balance throughout the month.
{{< /note >}}

## Mid-Month Billing

You may receive a mid-month bill from Linode if you reach a certain threshold of Linode services used within a single month. For many users, this amount will initially be **$50.00**. That amount can be adjusted over time by accruing a positive account history. In general, a history of on-time payments to Linode will increase the threshold amount.

What does a mid-month bill mean? Your existing active services will stay active. However, you must pay the mid-month bill before you can activate additional Linode services. Once your payment is processed, you may continue adding new services.

## Payment Methods

We accept Visa, MasterCard, Discover, and American Express and require that the address affiliated with a card matches the [Contact Information](/docs/guides/accounts-and-passwords/#updating-contact-information) active on this account. We also accept PayPal, as well as checks and money orders. Please [contact Support](/docs/platform/billing-and-support/support/) before paying with check or money order. Note that we do not accept bank/wire transfers.

PayPal payments can only be made **after** an account is opened with an initial payment from a credit or debit card. PayPal cannot be used for automatic monthly payments. If you wish to pay your balance with PayPal, you'll need to log into [Cloud Manager](http://cloud.linode.com) and submit a manual payment.

{{< note >}}
Review the [Making a Payment](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#making-a-payment) section of the Manage Billing in Cloud Manager guide for instructions when submitting a manual payment. Review the [Updating Credit Card Information](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#updating-credit-card-information) section to update your credit card on file.
{{< /note >}}

If you overpay, credit will be applied to your account; this allows you to prepay if desired. Service credit is always used before charging the credit card on file for ongoing service.

{{< note >}}
Maintaining a valid credit card on file with your account is a requirement of our [Master Services Agreement](https://www.linode.com/legal-msa/).
{{< /note >}}

## Linode Cloud Hosting and Backups

Full specs of each plan can be found on our [pricing page](https://www.linode.com/pricing)

A large base amount of network transfer is included with all Linode plans, but exceeding that amount can result in a [transfer overage](/docs/platform/billing-and-support/network-transfer-quota/#how-overages-work) charge beyond the monthly cap.

Due to the [impending exhaustion of the IPv4 address space](http://en.wikipedia.org/wiki/IPv4_address_exhaustion), Linode requires users to provide technical justification in order to add extra public IPv4 addresses to an instance. If you need access to additional IPv4 addresses, please [contact Support](/docs/platform/billing-and-support/support/) with your justification.

## Object Storage

Review our [Object Storage Pricing and Limitations](/docs/platform/object-storage/pricing-and-limitations/) guide for information on Object Storage pricing and how Object Storage interacts with your account's network transfer pool.

## Network Transfer

Review our [Network Transfer Quota](/docs/platform/billing-and-support/network-transfer-quota/) guide for complete information and examples of how Linode bills for network transfer.

## If My Linode is Powered Off, Will I Be Billed?

**If your Linode is powered off you will still be billed for it.** Linode maintains your saved data and reserves your ability to use other resources like RAM and network capacity, even when your Linode is powered off. You will also be billed for any other active Linode service, such as Longview Pro or extra IP addresses.

If you want to stop being billed for a particular Linode service, you need to [remove](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#removing-services) it from your account entirely.

### Back Up Your Data

Consider backing up your Linode's data in order to remove your Linode from your account. It can then be restored at a later time. Linode offers several [backup options](/docs/security/backups/backing-up-your-data/) including our own [Backup Service](https://www.linode.com/backups/).

## Referral Credits

You can receive service credit by referring new users to Linode. When you refer someone who maintains at least one active Linode for 90 days, your account will be issued a $20 service credit. Here's how to find your account referral code and URL:

1.  Log in to the [Linode Cloud Manager](http://cloud.linode.com).
1.  Select the **My Profile** link by clicking on your username at the top of the page.
1.  Select the **Referrals** tab.
1.  The referral code and URL are listed under the **Referrals** section. You can provide the code to friends and use the URL on your website to generate referrals.

Referral service credits must be used to purchase Linode services, and cannot be refunded as cash.

## Tax Information

Review our [Tax Information](/docs/platform/billing-and-support/tax-information/) guide for information about which taxes Linode may charge.

## Refunds

If you are unsatisfied with your service for any reason, you can [cancel your account](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#cancelling-your-account) within the first seven days and request a full refund, no questions asked.

If you have a credit on your account at the time of cancellation, and this credit is from an overpayment you have made to the account, you are entitled to a refund, minus a $5 processing fee. To request a refund, enter a note in the text field. Note that credits from sources other than prepaying cannot be refunded. Only payments made within 180 days of a properly submitted cancellation form shall be eligible for a refund.
