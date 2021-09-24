---
slug: lamp-stack-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Use Marketplace Apps to deploy a LAMP stack on Linode"
keywords: ['LAMP', 'apache', 'web server', 'mysql', 'php']
tags: ["apache","lamp","cloud-manager","linode platform","php","mysql","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-26
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying a LAMP Stack through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Apache Getting Started](http://httpd.apache.org/docs/current/getting-started.html)'
aliases: ['/platform/marketplace/deploy-lamp-stack-with-marketplace-apps/', '/platform/marketplace/deploy-lamp-stack-with-one-click-apps/','/guides/deploy-lamp-stack-with-marketplace-apps/']
---

A LAMP (Linux, [Apache](https://www.apache.org), [MySQL](https://www.mysql.com), [PHP](https://www.php.net)) stack is a popular, free, and open-source web software bundle used for hosting websites on Linux. This software environment is a foundation for popular PHP application frameworks like WordPress, Drupal, and Laravel. After you deploy your LAMP Marketplace App, you can upload your existing PHP application code to it or use a PHP framework to write a new application on your Linode.

## Deploying the LAMP Stack Marketplace App

{{< content "deploy-marketplace-apps-shortguide" >}}

**Software installation should complete within 2-3 minutes after the Linode has finished provisioning.**

## Configuration Options

### LAMP Stack Options

You can configure your LAMP Stack App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **MySQL Root Password** | The root password for your LAMP stack's MySQL database. This is not the same as your Linode's root password. *Required*. |
| **E-Mail Address** | E-Mail address for Let's Encrypt SSL certificate. This is also used as the SOA email address if you also enter a domain. *Required*. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your website. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10, Debian 11, Ubuntu 20.04 LTS
- **Recommended plan:** The Linode plan you deploy your LAMP stack on should account for the estimated workload. If you are standing up a simple web page, you can use a 1GB Linode (Nanode) or 2GB Linode. If you are standing up a larger or more robust web app, then consider a plan with higher RAM and CPU allocations.

## Getting Started After Deployment

After your LAMP stack has finished deploying, you can:

- [Connect to your Linode via SSH](/docs/guides/getting-started/#connect-to-your-linode-via-ssh). You will need your Linode's root password to proceed. Note that your Linode's web root will be located in the `/var/www/html` directory.

- [Navigate to the public IP address or domain entered during creation](/docs/guides/getting-started/#find-your-linode-s-ip-address) of your Linode in a browser. You will see the default Apache webpage.

- Consult the following guides to learn more about working with the various components of the LAMP stack:

    - [Secure HTTP Traffic with Certbot](/docs/guides/secure-http-traffic-certbot/)
    - [Apache Configuration Basics](/docs/guides/apache-configuration-basics/)
    - [How to Optimize MySQL Performance Using MySQLTuner](/docs/guides/how-to-optimize-mysql-performance-using-mysqltuner/)

-   Upload files to your web root directory with an SFTP application like [FileZilla](/docs/guides/filezilla/). Use the same root credentials that you would use for SSH.

-   Assign a domain name to your Linode's IP address. Review the [DNS Manager](/docs/guides/dns-manager/) guide for instructions on setting up your DNS records in the Cloud Manager, and read through [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/) for general information about how DNS works.

## Software Included

The LAMP Stack Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Apache HTTP Server**](https://www.apache.org) | Web server that can be used to serve your site or web application.|
| [**MySQL Server**](https://www.mysql.com) | Relational database. |
| [**PHP 7**](https://www.php.net) | General purpose programming language. |
| [**UFW (Uncomplicated Firewall)**](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 will allow outgoing and incoming traffic. |

{{< content "marketplace-update-note-shortguide">}}
