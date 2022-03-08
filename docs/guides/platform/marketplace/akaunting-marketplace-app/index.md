---
slug: akaunting-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Akaunting on a Linode Compute Instance. This provides you a a free, open source accounting software designed for small businesses and freelancers."
keywords: ['akaunting','accounting','productivity']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-25
modified_by:
  name: Linode
title: "Deploying Akaunting through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[Akaunting](https://akaunting.com)'
aliases: ['/guides/deploying-akaunting-marketplace-app/']
---

[Akaunting](https://akaunting.com/) is a free open source online accounting software designed for small businesses and freelancers. This universal accounting software can help you run your small business more efficiently. It has an extensive feature set that aims to provide you with an simple all-in-one accounting solution. From its user-friendly dashboard, you can track expenses, generate reports, manage your books, manage your employees, handle your invoices/bills, and so much more.

It is built with modern technologies (such as Laravel and VueJS) and includes a RESTful API. Akaunting can also be extended through the many apps and integrations available via its [App Store](https://akaunting.com/apps). This modular platform and Marketplace is easy to use and developer friendly.

## Deploying the Akaunting Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{<note>}}
**Deployment time:** The software should be fully installed and ready to use within 5-10 minutes.
{{</note>}}


## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Debian 11
- **Recommended plan:** All plan types and sizes can be used.

### Akaunting Options

| **Field** | **Description** |
|:--------------|:------------|
| **Company Name** | Your Company Name. *Required*. |
| **Company Email** | Your Company Email. *Required*. |
| **Admin Email** | Your Admin Email. *Required*. |
| **Admin Password** | Your Admin Password to login to your Akaunting instance. *Required*. |
| **Database Name** | Your Akaunting database name. *Required*. |
| **Database Root Password** | Your Akaunting database root password. *Required*. |
| **Database User** | Your Akaunting database user. *Required*. |
| **Database User Password** | Your Akaunting database user password. *Required*. |

## Getting Started after Deployment

### Verify Installation

{{< content "marketplace-verify-installation-shortguide">}}

### Accessing the Akaunting App

1.  Open your web browser and navigate to `http://[ip-address]/`, replacing *[ip-address]* with your Compute Instance's IPv4 address. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing your IP address.

1.  The Akaunting login page appears. The username for this instance is the *Admin Email* and the password is the *Admin Password* that you set when you deployed this One-Click Marketplace App.

Now that you’ve accessed your dashboard, check out [the official Akaunting documentation](https://akaunting.com/docs) to learn how to further utilize your Akaunting instance.

{{< content "marketplace-update-note-shortguide">}}