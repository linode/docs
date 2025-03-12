---
title: "Deploy aaPanel through the Linode Marketplace"
description: "This tutorial will show you how to install and configure the free and open-source server app, aaPanel, using the Linode One-Click Marketplace on CentOS 7."
published: 2021-08-13
modified: 2022-03-08
keywords: ['control panel', 'web hosting']
tags: ["marketplace", "linode platform", "cloud manager"]
aliases: ['/products/tools/marketplace/guides/aapanel/','/guides/deploying-aapanel-marketplace-app/','/guides/aapanel-marketplace-app/']
external_resources:
- '[aaPanel](https://www.aapanel.com/)'
- '[aaPanel Documentation](https://doc.aapanel.com/web)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 869129
marketplace_app_name: "aaPanel"
---

[aaPanel](https://www.aapanel.com/) is a free and open source web hosting control panel. It lets you manage the server's web server, websites, databases, FTP, and more through a simple web-based interface. Through aaPanel, you can quickly install a LEMP (NGINX) or LAMP (Apache) stack on your server and start hosting your websites.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** aaPanel should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## aaPanel Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates as well as configuring the server and DNS records.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain the credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Getting Started after Deployment

### Access your aaPanel App

1.  Log in to your instance through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). Once you've login via SSH you will see the message of the day (MOTD) which includes the login URL for this instance.

2.  Once you visit the URL and enter the login credentials you will be prompted to choose which One-Click services (LAMP/LNMP) you would like to install:

    ![aaPanel One-Click](aaPanel-one-click.png)

Now that you’ve accessed your dashboard, checkout [the official aaPanel documentation](https://doc.aapanel.com/) to learn how to further configure your instance.

{{% content "marketplace-update-note-shortguide" %}}