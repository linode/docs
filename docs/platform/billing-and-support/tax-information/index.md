---
author:
  name: Linode
  email: docs@linode.com
description: "Describes which taxes Linode collects and how to add a tax identification number to your account."
keywords: ["accounts", "vat", "linode manager", "linode cloud manager", "manager", "tax", "taxes", "tax information", "usd", "vat id", "eu", "european union", "value added tax", "gst", "goods and services tax", "gst id", "tax id"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2019-04-09
title: Tax Information
aliases: ['platform/billing-and-support/european-union-vat-linode/']
classic_manager_link: platform/billing-and-support/tax-information-classic-manager/
---

##  Which Taxes are Collected by Linode?

Linode collects the European Union's Value Added Tax (VAT) for customers that are subject to it. Starting on October 1st, 2019, Linode will also collect Australia and India's Goods and Services Tax (GST) for customers in those countries.

The taxes that Linode collects will appear on your invoices, and you can [review these charges](#review-your-charges) by navigating to the **Account** page in the [Linode Cloud Manager](https://cloud.linode.com).

{{< note >}}
Information about your EU VAT rate can be found [here](https://ec.europa.eu/taxation_customs/business/vat_en). Please note, Linode’s [pricing plans](/docs/platform/billing-and-support/billing-and-payments/#linode-cloud-hosting-and-backups) do **NOT** include EU VAT charges.
{{< /note >}}

## What Should I Do If My Services are Non-Taxable?

If you are a registered business, you may choose to provide Linode with a valid VAT identification number (*VAT ID*) or GST identification number (*GST ID*, also referred to as an *ABN* in Australia and a *GSTIN* in India). Such customers will not be charged with VAT or GST in subsequent invoices once their VAT or GST ID is verified.

{{< note >}}
For the remainder of this guide, your VAT ID, GST ID, ABN, or GSTIN will be referred to as your *tax ID*.
{{< /note >}}

You can [update your contact information](#add-a-tax-id-to-your-linode-account) at any time to apply your tax ID to your Linode account. You can also specify a tax ID in our account signup form when you first create your Linode account.

{{< note >}}
If you have documents which state that your organization's services with Linode should not be taxed, please [contact Linode Support](/docs/platform/billing-and-support/support/#contacting-linode-support).
{{< /note >}}

## Add a Tax ID to your Linode Account

Your tax ID may be added to your account via the [Linode Cloud Manager](https://cloud.linode.com) or the [Linode CLI](https://github.com/linode/linode-cli).

{{< note >}}
If you are using the Linode Classic Manager, review the [classic manager version of this guide](/docs/platform/billing-and-support/tax-information-classic-manager/#add-a-tax-id-to-your-linode-account) for alternative instructions.
{{< /note >}}

**Linode Cloud Manager**

To add or update your account with a tax ID:

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).

1. Navigate to the **Account** link in the sidebar.

1. Expand the **Update Contact Information** panel under the **Billing Info** tab.

1. Enter your tax ID in the **Tax ID** field.

1. Click on the **Save** button at the bottom of the **Update Contact Information** panel.

**Linode CLI**

Install the Linode CLI to your local computer and generate a Personal Access Token before using the Linode CLI. See [Using the Linode CLI](/docs/platform/api/using-the-linode-cli/) for more information.

1. Add or update your account with a valid tax ID:

        linode-cli account update --tax_id FRXX999999999

    Replace `FRXX999999999` with your tax ID.

1. Verify that the account was updated:

        linode-cli account view --format 'tax_id'

## Review your Charges

You can check your invoice charges by visiting the billing page in the [Linode Cloud Manager](https://cloud.linode.com) or with the [Linode CLI](https://github.com/linode/linode-cli).

{{< note >}}
See the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for more information.

If you are using the Linode Classic Manager, review the [classic manager version of this guide](/docs/platform/billing-and-support/tax-information-classic-manager/#review-your-charges) for alternative instructions.
{{< /note >}}

**Linode Cloud Manager**

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).

1. Navigate to the **Account** link in the sidebar.

1. Expand the **Recent Invoices** panel under the **Billing Info** tab.

1. Find the invoice you'd like to view and click on the corresponding row to view a full list of services for that invoice.

1. Click on the corresponding **Download PDF** button to download a PDF version of the invoice.

**Linode CLI**

Install the Linode CLI to your local computer and generate a Personal Access Token before using the Linode CLI. See [Using the Linode CLI](/docs/platform/api/using-the-linode-cli/) for more information.

1. View a list of your invoices:

        linode-cli account invoices-list

1. The Linode CLI's output will resemble the following:

        ┌──────────┬─────────────────────┬───────────────────┬───────┐
        │ id_______| date________________│ label_____________│ total │
        ├──────────┼─────────────────────┼───────────────────┼───────┤
        │ 10876642 │ 2018-06-01T04:16:26 │ Invoice #10876642 │ 10.00 │
        │ 11170325 │ 2018-07-01T05:22:53 │ Invoice #11170325 │ 10.00 │
        │ 11332537 │ 2018-08-01T04:10:34 │ Invoice #11332537 │ 10.00 │
        └──────────┴─────────────────────┴───────────────────┴───────┘

1. Find the `id` for the specific invoice you would like to view and replace `10876642` with your invoice's `id`:

        linode-cli account invoice-items 10876642

## FAQ

-   **What is Linode's EU VAT number?**

    Linode's EU VAT number is `EU372008859`.

-   **How is my tax location determined?**

    Your tax location is determined by the contact information you provided during sign up or under the **Account** page in the [Linode Cloud Manager](https://cloud.linode.com).

-   **How can I change my tax location?**

    You may update your tax location by navigating to the **Account** page in the [Linode Cloud Manager](https://cloud.linode.com) and then expanding the **Update Contact Information** panel.

-   **Why is my invoice in USD? Can I get an invoice in another currency?**

    To keep our pricing stable and consistent, rather than fluctuating with exchange rates, we do not bill in local currency. Similarly, we do not invoice in local currency. All invoices are in USD.
