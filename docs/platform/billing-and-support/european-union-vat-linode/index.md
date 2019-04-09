---
author:
  name: Linode
  email: docs@linode.com
description: "Explains the European Union value-added tax (VAT) and how to add a registration number to your account."
keywords: ["accounts", "vat", "linode manager", "linode cloud manager", "manager", "taxes", "eu", "european union"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-06
modified_by:
  name: Linode
published: 2019-04-09
title: Value-Added Taxes and your Linode Account
---

## What is the European Union Value-Added Tax (EU VAT)?

Because of the European Union’s Sixth Directive, which regulates taxation on goods and services transacted within the borders of its member countries, Linode must levy on its non-business (i.e., private) EU customers a value-added tax (VAT) based on their monthly charges.

## Who Pays EU VAT?

The EU designates Linode as an [*Electronically Supplied Services*](https://ec.europa.eu/taxation_customs/individuals/buying-goods-services-online-personal-use/buying-services/electronically-supplied-services_en) (ESS) *simplified VAT registration regime*, and thus is compelled to collect the revenue from customers.

Our EU non-business customers can [review these charges](#review-your-charges) by visiting their billing page and checking their monthly invoice. All VAT taxes Linode collects will be forwarded to the EU’s tax authority of the respective country.

Businesses (i.e., not private individuals) registered with and within the EU can enter their VAT ID on the billing page. Once your VAT number has been verified, Linode will not apply VAT charges to subsequent monthly invoices.

Please note, however, that the EU may enjoin such registered businesses to manually account for this tax. If you are an EU resident and your Linode billing page doesn’t display a [VAT ID field](#add-eu-vat-registration-number-to-your-linode-account) for input, please open a [support ticket](/docs/platform/billing-and-support/support/#contacting-linode-support). We’ll help you as soon as possible.

Linode’s [pricing plans](/docs/platform/billing-and-support/billing-and-payments/#linode-cloud-hosting-and-backups) do **NOT** include EU VAT charges.

## What Will the EU Charge?

The table below lists the VAT rates as of January 1, 2015 for residents of respective countries.

| **Country** | **Value-Added Tax (VAT)** |
| ------- | ---------------------:|
| Austria | 20%                   |
| Belgium | 21%                   |
| Bulgaria | 20%                   |
| Croatia | 25%                   |
| Cyprus | 19%                   |
| Czech Republic | 21%                   |
| Denmark | 25%                   |
| Estonia | 20%                   |
| Finland | 24%                   |
| France & Monaco | 20%                   |
| Germany | 19%                   |
| Great Britain & Northern Ireland | 20%                   |
| Greece | 24%                   |
| Hungary | 27%                   |
| Ireland (Eire) | 23%                   |
| Italy | 22%                   |
| Latvia | 21%                   |
| Lithuania | 21%                   |
| Luxembourg | 17%                   |
| Malta | 18%                   |
| Netherlands | 21%                   |
| Poland | 23%                   |
| Portugal | 23%                   |
| Romania | 19%                   |
| Slovakia | 20%                   |
| Slovenia | 22%                   |
| Spain | 21%                   |
| Austria | 25%                   |

{{< note >}}
Linode’s [pricing plans](/docs/platform/billing-and-support/billing-and-payments/#linode-cloud-hosting-and-backups) do **NOT** include EU VAT charges.
{{</ note >}}

### Exclusions

- Andorra
- The Channel Islands (United Kingdom)
- Gibraltar
- Mount Athos
- San Marino
- Vatican City
- Ceuta, Melilla and the Canary Islands (Spain)
- The communes of Livigno, Campione d'Italia and the Italian waters of Lake Lugano (Italy)
- Büsingen and the Isle of Heligoland (Germany)
- Guadeloupe, Martinique, Réunion, St. Pierre and Miquelon, and French Guiana (France)
- Faroe Islands and Greenland (Denmark)
- Åland Islands (Finland)

## Add EU VAT Registration Number to your Linode Account

If your business has an EU VAT Registration Number, add it to your account via the [Linode CLI](https://github.com/linode/linode-cli) or the [Linode Cloud Manager](https://cloud.linode.com):

**Linode CLI**

Install the Linode CLI to your local computer and generate a Personal Access Token before using the Linode CLI. See [Using the Linode CLI](/docs/platform/api/using-the-linode-cli/) for more information.

1. Add or update your account with an EU VAT Registration Number:

        linode-cli account update --tax_id FRXX999999999

    Replace `FRXX999999999` with your VAT Registration Number.

1. Verify that the account was updated:

        linode-cli account view --format 'tax_id'

**Linode Cloud Manager**

To add or update your account with an EU VAT Registration Number:

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).

1. Navigate to the **Account** link in the sidebar.

1. Expand the **Update Contact Information** panel under the **Billing Info** tab.

1. Enter your EU VAT Registration Number in the **Tax ID** field.

1. Click on the **Save** button at the bottom of the **Update Contact Information** panel.

## Review your Charges

You can check your monthly invoice charges with the Linode CLI or by visiting the billing page in the Linode Cloud Manager.

{{< note >}}
See the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for more information.
{{< /note >}}

**Linode CLI**

1. View a list of your invoices:

        linode-cli account invoices-list

1. The Linode CLI's output will resemble the following:

    {{< output >}}
    ┌──────────┬─────────────────────┬───────────────────┬───────┐
    │ id_______| date________________│ label_____________│ total │
    ├──────────┼─────────────────────┼───────────────────┼───────┤
    │ 10876642 │ 2018-06-01T04:16:26 │ Invoice #10876642 │ 10.00 │
    │ 11170325 │ 2018-07-01T05:22:53 │ Invoice #11170325 │ 10.00 │
    │ 11332537 │ 2018-08-01T04:10:34 │ Invoice #11332537 │ 10.00 │
    └──────────┴─────────────────────┴───────────────────┴───────┘
    {{</ output >}}

1. Find the `id` for the specific invoice you would like to view and replace `10876642` with your invoice's `id`:

        linode-cli account invoice-items 10876642

**Linode Cloud Manager**

1. Log in to the Linode Cloud Manager.

1. Navigate to the **Account** link in the sidebar.

1. Expand the **Recent Invoices** panel under the **Billing Info** tab.

1. Find the invoice you'd like to view and click on the corresponding row to view a full list of services for that invoice.

1. Click on the corresponding **Download PDF** button to download a PDF version of the invoice.