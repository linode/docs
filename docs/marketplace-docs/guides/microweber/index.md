---
title: "Deploy Microweber through the Linode Marketplace"
description: "Deploy Microweber, an open-source, drag and drop website builder and CMS on a Linode Compute Instance."
published: 2022-09-06
keywords: ['Microweber','website builder','cms']
tags: ["marketplace", "linode platform", "cloud manager"]
aliases: ['/products/tools/marketplace/guides/microweber/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1051714
marketplace_app_name: "Microweber"
---

[Microweber](https://microweber.org/) is an open-source, drag and drop website builder and CMS based on the Laravel PHP Framework. It includes features for e-commerce, live editing, file management, design customization, and has plugins for both cPanel and Plesk.

{{< note >}}
When self-hosting Microweber, you are responsible for the security of your server. Follow best practices for securing, updating, and backing up the software on your Compute Instance. See [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/).
{{< /note >}}

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Microweber should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04
- **Recommended plan:** All plan types can be used.

## Getting Started after Deployment

### Accessing the Microweber Application

1. Open your web browser and navigate to `http://[ip-address]`, where *[ip-address]* can be replaced with your Compute Instance's IP address or rDNS domain. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

1. Complete the initial setup for that appears. This includes setting the database settings, selecting the preferred website design, setting the default language, and more.

    ![Screenshot of the Microweber installation GUI](Microweber-install.jpg)

1. Within that same screen, also enter the Admin user credentials and email address you wish to use. Click the **Install** button to continue with the Microweber installation.

    ![Screenshot of the Microweber admin credentials](Microweber-admin.jpg)

1. After the installation is complete, you are redirected to the Microweber dashboard. From here, you can start designing and building your new website. For more information on using Microweber for development, see the [Microweber tutorials](https://microweber.org/academy#322001230).

    ![Screenshot of the Microweber dashboard](Microweber-dashboard.jpg)

{{% content "marketplace-update-note-shortguide" %}}