---
title: "Deploy Akaunting through the Linode Marketplace"
description: "Deploy Akaunting on a Linode Compute Instance. This provides you a free, open source accounting software designed for small businesses and freelancers."
published: 2022-01-25
modified: 2022-03-08
keywords: ['akaunting','accounting','productivity']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Akaunting](https://akaunting.com)'
aliases: ['/products/tools/marketplace/guides/akaunting/','/guides/deploying-akaunting-marketplace-app/','/guides/akaunting-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 923033
marketplace_app_name: "Akaunting"
---

[Akaunting](https://akaunting.com/) is a free open source online accounting software designed for small businesses and freelancers. This universal accounting software can help you run your small business more efficiently. It has an extensive feature set that aims to provide you with an simple all-in-one accounting solution. From its user-friendly dashboard, you can track expenses, generate reports, manage your books, manage your employees, handle your invoices/bills, and so much more.

It is built with modern technologies (such as Laravel and VueJS) and includes a RESTful API. Akaunting can also be extended through the many apps and integrations available via its [App Store](https://akaunting.com/apps). This modular platform and Marketplace is easy to use and developer friendly.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Akaunting should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Debian 11
- **Recommended plan:** All plan types and sizes can be used.

### Akaunting Options

- **Company Name** *(required)*: The name of your company.
- **Company Email** *(required)*: The email address for your company.
- **Admin Email** *(required)*: The email address you wish to use on your admin account.
- **Admin Password** *(required)*: Enter a *strong* password for your admin user.
- **Database Name** *(required)*: Enter a name for your database.
- **Database `root` Password** *(required)*: Enter a *strong* password you wish to use for the database root user.
- **Database User** *(required)*: The username you wish to use for the limited database user.
- **Database User Password** *(required)*: Enter a *strong* password you wish to use for the limited database user.

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the Akaunting App

1.  Open your web browser and navigate to `http://[ip-address]/`, replacing *[ip-address]* with your Compute Instance's IPv4 address. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing your IP address.

1.  The Akaunting login page appears. The username for this instance is the *Admin Email* and the password is the *Admin Password* that you set when you deployed this One-Click Marketplace App.

Now that you’ve accessed your dashboard, check out [the official Akaunting documentation](https://akaunting.com/docs) to learn how to further use your Akaunting instance.

{{% content "marketplace-update-note-shortguide" %}}