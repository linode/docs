---
slug: akaunting-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy Akaunting on a Linode Compute Instance. This provides you a a free, open source accounting software designed for small businesses and freelancers."
keywords: ['akaunting','accounting','productivity']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-12
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

Akaunting is a free, open source and online accounting software designed for small businesses and freelancers. It is built with modern technologies such as Laravel, VueJS, Bootstrap 4, RESTful API etc. Thanks to its modular structure, Akaunting provides an awesome App Store for users and developers.

Akaunting is universal accounting software that can help you run your small business more efficiently. You can track expenses, generate reports, manage your books, and many more. It comes with a set of features that can help you run your business from a single dashboard, manage your employees, handle your invoices/bills, and so.

{{< content "deploy-marketplace-apps-shortguide">}}

### Akaunting Options

You can configure your Akaunting App by providing values for the following fields:

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

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS Debian 11
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the Akaunting App

1.  Open a browser and navigate to your [Instance's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/).

1.  The Akaunting login page will appear. The username for this instance will be `Admin Email` and the Password will be the `Admin Password` that were created in the beginning of your deployment.

Now that you’ve accessed your dashboard, check out [the official Akaunting documentation](https://akaunting.com/docs) to learn how to further utilize your Akaunting instance.

{{< content "marketplace-update-note-shortguide">}}