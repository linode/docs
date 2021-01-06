---
slug: deploy-phpmyadmin-with-marketplace-apps
author:
  name: Ben Bigger
  email: docs@linode.com
description: 'Deploy phpMyAdmin on Linode using Marketplace Apps to administer your MySQL database with a convenient and powerful GUI web application.'
og_description: 'Deploy phpMyAdmin on Linode using Marketplace Apps to administer your MySQL database with a convenient and powerful GUI web application.'
keywords: ['php', 'phpmyadmin', 'mysql', 'mariadb', 'database', 'GUI']
tags: ["debian","php","mysql","database","marketplace","ssl", "web applications","linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-28
modified_by:
  name: Linode
title: "How to Deploy phpMyAdmin with Marketplace Apps"
h1_title: "Deploying phpMyAdmin with Marketplace Apps"
external_resources:
- '[phpMyAdmin Documentation](https://docs.phpmyadmin.net/en/latest/)'
- '[MariaDB Documentation](https://mariadb.org/documentation/)'
aliases: ['/platform/marketplace/deploy-phpmyadmin-with-marketplace-apps/', '/platform/one-click/deploy-phpmyadmin-with-one-click-apps/']
---

## phpMyAdmin Marketplace App

[phpMyAdmin](https://www.phpmyadmin.net/) is an open source web application that provides a GUI for MySQL database administration, giving you a convenient and powerful alternative to using the MySQL command line client. The phpMyAdmin Marketplace App deploys a Linode with phpMyAdmin installed and ready for you to begin managing a MySQL database.

### Deploy a phpMyAdmin Marketplace App

{{< content "deploy-marketplace-apps">}}

### phpMyAdmin Options

| **Configuration** | **Description** |
|--------------|------------|
| **phpMyAdmin/MySQL Admin User** | The admin username for accessing your phpMyAdmin dashboard. *Required*. |
| **phpMyAdmin/MySQL Admin Password** | The admin user password for accessing your phpMyAdmin dashboard. *Required*. |
| **MySQL root Password** | The root user password for your MySQL database. *Required*. |

{{< note >}}
phpMyAdmin doesn't handle user management itself, but passes all user information onto MySQL. The Admin User you create here is created in MySQL.
{{< /note >}}

### Linode Options

The following configuration options are possible for your Linode server:

| **Configuration** | **Description** |
|--------------|------------|
| **Select an Image** | Debian 9 is currently the only image supported by the phpMyAdmin Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your phpMyAdmin app will complete installation anywhere between 1-5 minutes after your Linode has finished provisioning**.

### Software Included

The phpMyAdmin Marketplace App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**phpMyAdmin**](https://docs.phpmyadmin.net/en/latest/) | phpMyAdmin is a free software tool written in PHP that is intended to handle the administration of a MySQL or MariaDB database server.  |
| [**MariaDB**](https://mariadb.org/documentation/) | MariaDB is a fork of the popular cross-platform MySQL database management system and is considered a full [drop-in replacement](https://mariadb.com/kb/en/mariadb-vs-mysql-features/) for MySQL. |

{{< content "marketplace-update-note">}}

## Getting Started After Deployment

After installation is complete, the phpMyAdmin dashboard is accessible at your Linode's IP address followed by `/phpmyadmin` for example:

    http://your.linode.ip.address/phpmyadmin

However, entering your phpMyAdmin credentials through an HTTP connection is insecure. The next section provides instructions on how to enable HTTPS access to the phpMyAdmin dashboard from your domain by using [Certbot](https://certbot.eff.org/) to issue a free Let's Encrypt SSL Certificate so that you can access your phpMyAdmin deployment securely.

### Configure Your Domain with DNS Manager

The following sections require that you own a domain that has been configured for your use with your phpMyAdmin Linode. Following the instructions in the Linode [DNS Manager](/docs/platform/manager/dns-manager/) guide, configure your domain's [name servers](/docs/platform/manager/dns-manager/#use-linode-s-name-servers-with-your-domain) and add a [DNS record](/docs/platform/manager/dns-manager/#add-dns-records) so that your domain is pointing to your phpMyAdmin Linode.

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
