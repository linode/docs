---
author:
  name: Linode
  email: docs@linode.com
description: "This guide shows you how to install Chevereto, a modern image sharing solution with drag-and-drop upload experience and more, using the Linode One-Click Marketplace."
keywords: ['photo storage','images','Marketplace']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified: 2022-05-17
modified_by:
  name: Linode
title: "Deploying Chevereto through the Linode Marketplace"
external_resources:
- '[Chevereto](https://chevereto.com/)'
- '[Chevereto Documentation](https://chevereto.com/docs)'
aliases: ['/guides/deploying-chevereto-marketplace-app/','/guides/chevereto-marketplace-app/']
---

[Chevereto](https://chevereto.com/) is a self-hosted image sharing solution. It can be used to create a myriad of applications or to empower existing systems. Chevereto's features include multi-user support, multi-server support, bulk importing, integration with social media, and more.

{{< note >}}
Chevereto requires a valid license to use the software. To purchase a license, visit [Chevereto's website](https://chevereto.com/pricing) and select a plan that fits your needs. Licenses are not available directly through Linode.
{{</ note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Chevereto should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Access your Chevereto App

1.  After Chevereto has finished installing,log into your Linode via SSH, replacing `192.0.2.0` with your [Linode's IP address](/docs/guides/find-your-linodes-ip-address/), and entering your Linode's root password when prompted:

        ssh root@192.0.2.0

1.  You should see the Chevereto welcome message when logging into the Linode. This includes instructions for accessing the Chevereto installation script in your web browser along with the location of the credentials to the application. Replace `192.0.2.0` with your Linode’s IP address.

    ![Chevereto Login Instruction](chevereto-login.png)

1.  You will then be able to proceed through the Chevereto Installer.

    ![Chevereto Installer](chevereto-installer.png)

1.  To utilize Chevereto, you need to obtain a license key. You can do so clicking the purchase button and entering the license key provided by Chevereto.

    ![Chevereto License](chevereto-license.png)

1.  Next, you will be presented with a page where you can enter your cPanel credentials. Since this Marketplace App does not include a cPanel installation, you can simply select skip.

    ![Chevereto cPanel](chevereto-cpanel.png)

1.  The next page allows you to input the database information for this application. It should be pre-filled with the user and password details.

    ![Chevereto Database](chevereto-database.png)

1.  You are then prompted to create the Administrator account. This will be the credentials used to access your Chevereto dashboard.

    ![Chevereto Administrator](chevereto-adminstrator.png)

1.  The next prompt will ask you for the email addresses that will be used for this service.

    ![Chevereto Email](chevereto-emails.png)

1.  You are now ready to complete the Chevereto installation. Click the **Install Chevereto** button.

    ![Chevereto Final Install](chevereto-final_install.png)

Now that you’ve accessed your dashboard, checkout [the official Chevereto documentation](https://v3-docs.chevereto.com/) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}