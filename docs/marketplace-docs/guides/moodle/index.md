---
title: "Deploy Moodle through the Linode Marketplace"
description: "Moodle is the leading open source learning management system. This tutorial walks you through deploying Moodle using the Linode Marketplace."
published: 2021-08-13
modified: 2023-04-11
keywords: ['learning','educator','management', and 'school']
tags: ["marketplace", "linode platform", "cloud manager"]
aliases: ['/products/tools/marketplace/guides/moodle/','/guides/deploying-moodle-marketplace-app/','/guides/moodle-marketplace-app/']
external_resources:
- '[Moodle](https://moodle.org/)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 869127
marketplace_app_name: "Moodle"
---

Moodle is the most widely used open source learning management system. It is aimed to provide learners, educators, and administrators with a single robust, secure, and integrated solution to develop customized learning environments.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Moodle should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Moodle Options

- **Email address** *(required)*: Enter the email address you want to use for generating the SSL certificates and configuring the server and DNS records.

- **Moodle Admin Username** *(required)*: Enter a Admin username for the Moodle admin account.

- **Moodle Database Username** *(required)*: Enter a Database username for the Moodle database admin.

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

## Getting Started After Deployment

### Access Your Moodle App

To access your Moodle instance, Open a browser and navigate to your Linode rDNS domain `https://203-0-113-0.ip.linodeusercontent.com`. Replace `https://203-0-113-0.ip.linodeusercontent.com` with your [Linode's RDNS domain](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses).

From there, you can login by clicking the box on the top right of the page. Once you see the login page, you can enter the admin username entered at deployment as the *username* and the *password* that can be obtained in the credentials file.

Now that you’ve accessed your dashboard, checkout [the official Moodle documentation](https://docs.moodle.org/311/en/Main_page) to learn how to further configure your instance.

## Software Included

The Moodle Marketplace App installs the following required software on your Linode:

| Software | Description |
| -- | -- |
| [**PHP**](https://www.php.net) | A popular general-purpose scripting language that is especially suited to web development. |
| [**MariaDB Server**](https://mariadb.org) | A relational database server. The root password is set, locking down access outside the system.|
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility that allows access only for SSH (port 22, rate limited), HTTP (port 80), and HTTPS (port 443). |
| [**Certbot**](https://certbot.eff.org) | Certbot is a fully-featured, easy-to-use, extensible client for the Let's Encrypt CA. |
| [**Apache2**](https://httpd.apache.org) | HTTP Server. |


{{% content "marketplace-update-note-shortguide" %}}
