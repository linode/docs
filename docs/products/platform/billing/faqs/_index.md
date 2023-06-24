---
title: "FAQs"
title_meta: "FAQs for Billing and Payments on the Linode Platform"
description: "Find quick answers to some of the most commonly asked billing questions."
tab_group_main:
    weight: 60
published: 2022-10-28
aliases: ['/products/tools/billing/faqs/']
---

## I’m not using my services but I’m still being charged. How do I stop this?

You are charged for any service present on an account, even if it is powered off or otherwise not actively being used. To stop additional charges from accruing for a service, that service must be deleted. Keep in mind that your next invoice will include any fees for this service that have accrued during the billing cycle. See [Billing Overview](/docs/products/platform/billing/) for more details.

## My bill is higher than expected. How can I get more information about these charges?

Each bill, including mid-month bills, is available to view as an itemized invoice. These invoices contain a detailed breakdown of your charges. Each service that was present on the account at any point during the billing cycle is listed on the invoice, alongside the amount of time the service was active, the hourly rate, and the total charge for that service.

All invoices are listed in the Billing & Payment History section of the Cloud Manager. See [Viewing Invoices and Payments](/docs/products/platform/billing/guides/view-history/) for instructions. A copy of each invoice is also emailed to all users on the account with read and write billing access.

## I deleted a service earlier this month. Why was I just charged for it now?

Invoices are generated at the beginning of every month and include fees for services used during the previous month. See [Billing Overview](/docs/products/platform/billing/). On your invoice, you can view the dates each service was on the account.

## Where can I view amount of credit available on my account?

Promotional credits from a promo code are visible on the [Billing Info](https://cloud.linode.com/account/billing) page of the Cloud Manager. This credit is listed under the **Promotions** section that is only visible *if a promo code has been applied to your account*. Other types of account credits are displayed on the same page under the **Account Balance section**. A balance that is green indicates the amount of credit on the account. A balance that is red indicates the amount currently past due.

## Will my current credit cover my next invoice?

Any credits on your account, including promotional credits and other account credits, are automatically applied to your next invoice. You can verify if your available credits meet your current expenditure by reviewing your [currently accrued charges](/docs/products/platform/billing/guides/access-billing/) and calculating your usage for the remainder of the billing cycle. See the [Pricing](https://www.linode.com/pricing/) page for a detailed list of all service fees.

## When will I receive my first bill?

Invoices are generated on the first day of each month. For instance, if you joined on September 15th, you will receive your first bill on October 1st for any services used during the month of September. An exception to this is if your service fees have exceeded your account's billing threshold, in which case you will receive a bill at that time. See [Mid-Month Billing](/docs/products/platform/billing/#mid-month-billing).

## Can I change my billing date?

Invoices are automatically generated on the first day of each month. While this cannot be changed, you may contact [Support](https://www.linode.com/support/) if you would like to be billed more frequently or in smaller increments.

## Why did I receive more than one invoice this month?

If your account exceeds its billing threshold (also called the *credit limit*), you will receive a bill for the currently accrued charges at that time. For new accounts, this threshold begins at $50 and it automatically adjusted as you continue to use Linode services. If you would like this to be adjusted, contact [Support](https://www.linode.com/support/). See [Mid-Month Billing](/docs/products/platform/billing/#mid-month-billing).

## Can I make a payment in advance?

Yes. At any time, you can make a payment on your account. If the payment is greater than any past due amount, it gets stored as a positive account balance. This balance is automatically applied to future invoices. You can estimate your end of month costs using our [Pricing](https://www.linode.com/pricing/) page and view your account balance from the Billing Info page of the Cloud Manager. See [Making a One-Time Payment](/docs/products/platform/billing/guides/make-a-payment/).

## What are Linode’s currently accepted payment methods?

Linode accepts all major credit cards, Google Pay, PayPal, and other forms of payment. To view a complete list of all accepted payment methods, see [Payment Methods](/docs/products/platform/billing/guides/payment-methods/).

## Why did my card get declined?

A card can be declined for many different reasons. Banks often do not pass along details for declined charges to vendors, like Linode. To investigate why your card was declined, contact your bank.

## How do I remove a credit card from my account?

You can manage your payment methods, including credit cards, from the Cloud Manager. To learn how to remove a credit card, see [Remove a Payment Method](/docs/products/platform/billing/guides/payment-methods/#remove-a-payment-method). Keep in mind you must have at least one valid payment method on file. If you are attempting to delete your only payment method, you must add a new payment method first.

## Can I make a payment in another currency?

We only accept payments in USD. If you wish to pay in another currency, you must use a credit card or other form of payment that can process the currency exchange on your behalf.

## Can more than one person receive the invoice each month?

Yes, any user on an account with the appropriate billing permissions (read and write billing access) will receive a copy of invoices. See [Setting User Permissions](/docs/products/platform/accounts/guides/user-permissions/) for more details and see [Adding a User](/docs/products/platform/accounts/guides/manage-users/#adding-a-user) for instructions on creating another user for your account.

## How do I adjust the name or company on my invoice?

Your billing contact information is used on each invoice. To adjust the name, company, address, or tax ID that appears on the invoice, you must adjust the corresponding billing contact field. See [Update Billing Contact Information](/docs/products/platform/billing/guides/update-billing-contact-info/).