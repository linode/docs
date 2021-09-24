---
slug: phpmyadmin-marketplace-app
author:
  name: Ben Bigger
  email: docs@linode.com
description: "Deploy phpMyAdmin on Linode using Marketplace Apps to administer your MySQL database with a convenient and powerful GUI web application."
keywords: ['php', 'phpmyadmin', 'mysql', 'mariadb', 'database', 'GUI']
tags: ["debian","php","mysql","database","marketplace","ssl", "web applications","linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-28
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying phpMyAdmin through the Linode Marketplace"
external_resources:
- '[phpMyAdmin Documentation](https://docs.phpmyadmin.net/en/latest/)'
- '[MariaDB Documentation](https://mariadb.org/documentation/)'
aliases: ['/platform/marketplace/deploy-phpmyadmin-with-marketplace-apps/', '/platform/one-click/deploy-phpmyadmin-with-one-click-apps/', '/guides/deploy-phpmyadmin-with-marketplace-apps/']
---

[phpMyAdmin](https://www.phpmyadmin.net/) is an open source web application that provides a GUI for MySQL database administration, giving you a convenient and powerful alternative to using the MySQL command line client. The phpMyAdmin Marketplace App deploys a Linode with phpMyAdmin installed and ready for you to begin managing a MySQL database.

## Deploying the phpMyAdmin Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 1-5 minutes after the Linode has finished provisioning.**

## Configuration Options

### phpMyAdmin Options

| **Configuration** | **Description** |
|--------------|------------|
| **phpMyAdmin/MySQL Admin User** | The admin username for accessing your phpMyAdmin dashboard. *Required*. |
| **phpMyAdmin/MySQL Admin Password** | The admin user password for accessing your phpMyAdmin dashboard. *Required*. |
| **MySQL root Password** | The root user password for your MySQL database. *Required*. |

{{< note >}}
phpMyAdmin doesn't handle user management itself, but passes all user information onto MySQL. The Admin User you create here is created in MySQL.
{{< /note >}}

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 9
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started After Deployment

After installation is complete, the phpMyAdmin dashboard is accessible at your Linode's IP address followed by `/phpmyadmin` for example:

    http://your.linode.ip.address/phpmyadmin

However, entering your phpMyAdmin credentials through an HTTP connection is insecure. The next section provides instructions on how to enable HTTPS access to the phpMyAdmin dashboard from your domain by using [Certbot](https://certbot.eff.org/) to issue a free Let's Encrypt SSL Certificate so that you can access your phpMyAdmin deployment securely.

### Configure Your Domain with DNS Manager

The following sections require that you own a domain that has been configured for your use with your phpMyAdmin Linode. Following the instructions in the Linode [DNS Manager](/docs/guides/dns-manager/) guide, configure your domain's [name servers](/docs/guides/dns-manager/#use-linodes-name-servers-with-your-domain) and add a [DNS record](/docs/guides/dns-manager/#add-dns-records) so that your domain is pointing to your phpMyAdmin Linode.

### Enable HTTPS with Certbot

1.  [Connect to Your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh).

1.  Install Certbot for authentication with Python and Apache:

        sudo apt-get install certbot python-certbot-apache

1.  Run the Certbot script for Apache:

        sudo certbot --apache

1.  Complete the prompts from the Certbot script to create and deploy SSL certificates for your domain.

1.  Update your Linode's firewall to allow HTTPS access:

        sudo ufw allow https

### Access the phpMyAdmin dashboard

1.  In your browser, navigate to the following address, replacing `www.example.com` with the address of your domain:

        https://www.example.com/phpmyadmin

1.  At the login screen enter the **phpMyAdmin/MySQL Admin User** and **phpMyAdmin/MySQL Admin Password** you chose when you deployed the phpMyAdmin Marketplace App.

    ![phpMyAdmin Login Page](phpmyadmin-login.png "The phpMyAdmin Login Page.")

1.  You can now access the phpMyAdmin dashboard and begin managing your MySQL database.

    ![phpMyAdmin Dashboard](phpmyadmin-dashboard.png "The phpMyAdmin Dashboard.")

## Software Included

The phpMyAdmin Marketplace App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**phpMyAdmin**](https://docs.phpmyadmin.net/en/latest/) | phpMyAdmin is a free software tool written in PHP that is intended to handle the administration of a MySQL or MariaDB database server.  |
| [**MariaDB**](https://mariadb.org/documentation/) | MariaDB is a fork of the popular cross-platform MySQL database management system and is considered a full [drop-in replacement](https://mariadb.com/kb/en/mariadb-vs-mysql-features/) for MySQL. |

{{< content "marketplace-update-note-shortguide">}}