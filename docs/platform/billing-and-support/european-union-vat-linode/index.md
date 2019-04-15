---
author:
  name: Linode
  email: docs@linode.com
description: "Explains the European Union value added tax (VAT) and how to add a registration number to your account."
keywords: ["accounts", "vat", "linode manager", "linode cloud manager", "manager", "taxes", "eu", "european union"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2019-04-09
title: Tax Information
classic_manager_link: platform/billing-and-support/european-union-vat-linode-classic-manager/
---

## Value Added Tax in the European Union

The European Union and its member states (EU) impose a value added tax (VAT) on the sale of certain electronically supplied goods and services within the European Economic Area. Linode customers who are subject to EU VAT can [review these charges](#review-your-charges) on their monthly invoices by navigating to the **Account** tab in the [Linode Cloud Manager](https://cloud.linode.com).

Customers that wish to provide Linode with a valid VAT identification number (VAT ID) may do so by [updating their contact information](#adding-an-eu-vat-id-to-your-linode-account). Such customers will not be charged with EU VAT in subsequent invoices once their VAT ID is verified.

VAT rates in the EU range from 5% to 27%. More information about your EU VAT rate can be found [here](https://ec.europa.eu/taxation_customs/business/vat_en).

{{< note >}}
Please note, Linode’s [pricing plans](/docs/platform/billing-and-support/billing-and-payments/#linode-cloud-hosting-and-backups) do **NOT** include EU VAT charges.
{{</ note >}}

## Adding an EU VAT ID to your Linode Account

Valid VAT IDs may be added to your account via the [Linode Cloud Manager](https://cloud.linode.com) or the [Linode CLI](https://github.com/linode/linode-cli).

{{< note >}}
If you are using the Linode Classic Manager, review the [classic manager version of this guide](/docs/platform/billing-and-support/european-union-vat-linode-classic-manager/#adding-an-eu-vat-id-to-your-linode-account) for alternative instructions.
{{< /note >}}

**Linode Cloud Manager**

To add or update your account with a VAT ID:

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).

1. Navigate to the **Account** link in the sidebar.

1. Expand the **Update Contact Information** panel under the **Billing Info** tab.

1. Enter your EU VAT ID in the **Tax ID** field.

1. Click on the **Save** button at the bottom of the **Update Contact Information** panel.

**Linode CLI**

Install the Linode CLI to your local computer and generate a Personal Access Token before using the Linode CLI. See [Using the Linode CLI](/docs/platform/api/using-the-linode-cli/) for more information.

1. Add or update your account with a valid VAT ID:

        linode-cli account update --tax_id FRXX999999999

    Replace `FRXX999999999` with your VAT ID.

1. Verify that the account was updated:

        linode-cli account view --format 'tax_id'

## Review your Charges

You can check your monthly invoice charges by visiting the billing page in the [Linode Cloud Manager](https://cloud.linode.com) or with the [Linode CLI](https://github.com/linode/linode-cli).

{{< note >}}
See the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for more information.

If you are using the Linode Classic Manager, review the [classic manager version of this guide](/docs/platform/billing-and-support/european-union-vat-linode-classic-manager/#review-your-charges) for alternative instructions.
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