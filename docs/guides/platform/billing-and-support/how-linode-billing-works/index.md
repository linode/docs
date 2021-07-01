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
modified: 2021-07-01
modified_by:
  name: Linode
published: 2019-10-25
title: How Linode Billing Works
tags: ["linode platform"]
---

We've done our best to create straightforward billing and payment policies. Still have questions? Use this guide to learn how our hourly billing works. To learn how to manage your billing in the Cloud Manager see the [Manage Billing in Cloud Manager](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/) guide. If you have a question that isn't answered in either guide, please feel free to [contact Support](/docs/platform/billing-and-support/support/).

## Understanding Hourly Billing

Linode uses a hybrid hourly billing system that is simple and flexible. It enables you to continuously add, modify, and remove services throughout the month. After the month is over, you receive an invoice for *the hourly usage of each service **up to the monthly cap***. Here are some important billing considerations:

- Every paid service offered by Linode has a predicable monthly rate (also called the monthly cap) in addition to a flexible hourly rate.

- When a service is active, charges accrue on the account at the hourly rate up to the monthly cap. These *accrued charges\** are displayed on the **Billing Info** tab within the Account page of the Cloud Manager. Service fees are always rounded up to the nearest hour.

- Linode uses a monthly billing cycle. An invoice is automatically generated on the first day of each month and includes the previous month's usage.

If your services stay the same month over month, your bill remains predictable. You are never billed more than the monthly rate for each service, excluding [network transfer overages](/docs/platform/billing-and-support/network-transfer-quota/#how-overages-work). If you use a service for just part of the month, hourly billing enables you to only be charged for the time the service is active on the account.

{{< note >}}
\* Review the [Viewing Current Balance](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#viewing-current-balance) section of the Manage Billing in Cloud Manager guide to monitor your balance throughout the month.
{{< /note >}}

## Example Billing Scenarios

Here are a few examples of common billing scenarios you might encounter. For these examples, we will assume the month is 30 days (720 hours). We will also be using a 4GB Linode Compute Instance, which has an hourly rate of $0.03/hour and a monthly rate/cap of $20.

### A Service is Active for the *Entire* Month

You create a 4GB Compute Instance prior to the start of the month and it remains on your account for the entire month. Calculating the service fees at the hourly rate for 720 hours (again, assuming a 30 day month), the total would have come to $21.60. Since you've reached the monthly cap for this service, you are instead charged the predictable $20 monthly rate.

### A Service is Active for *Almost* the Entire Month

You create a 4GB Compute Instance on the second day of the month, half-way through the day. It remains on your account for the remainder of the month and, in total, was active for 684 hours. Calculating the service fees at the hourly rate, the total would have come to $20.52. Since you've reached the monthly cap for this service, you are instead charged the predictable $20 monthly rate.

### A Service is Active for *Just Some* of the Month

You created a 4GB Compute Instance mid-way through the month and deleted it exactly 5 days later. In total, it was active for 120 hours. Calculating the service fees at the hourly rate, the total is $3.60. Since this is less than the monthly cap, you are indeed billed at the hourly rate and charged $3.60 for your usage.

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
