---
slug: lemp-stack-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows you how to use the Linode Marketplace to deploy a LEMP (Linux, NGINX, MySQL, PHP) server stack on a Linode Compute Instance."
keywords: ['LEMP', 'nginx', 'web server', 'mysql', 'php']
tags: ["lemp","nginx","cloud-manager","linode platform","php","mysql","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2022-03-01
modified_by:
  name: Linode
title: "Deploying a LEMP Stack through the Linode Marketplace"
image: feature.png
contributor:
  name: Linode
external_resources:
- '[NGINX Getting Started](https://www.nginx.com/resources/wiki/start/)'
aliases: ['/platform/marketplace/deploy-lemp-stack-with-marketplace-apps/', '/platform/marketplace/deploy-lemp-stack-with-one-click-apps/', '/guides/deploy-lemp-stack-with-one-click-apps/','/guides/deploy-lemp-stack-with-marketplace-apps/' ]
---

The LEMP stack (Linux, [NGINX](https://www.nginx.com/), [MySQL](https://www.mysql.com/), [PHP](https://www.php.net/)) is a popular, free, and open-source web software bundle used for hosting websites on the Linux operating system. While similar to the [LAMP Stack](/docs/guides/deploy-lamp-stack-with-marketplace-apps/), a LEMP stack uses the NGINX web server instead of [Apache](https://httpd.apache.org/). NGINX is preferred by many users for a variety of reasons, including its flexibility, speed, and ability to perform under high load.

## Deploying the LEMP Stack Marketplace App

{{< content "deploy-marketplace-apps-shortguide" >}}

**Software installation should complete within 2-3 minutes after the Linode has finished provisioning.**

## Configuration Options

### LEMP Stack Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Database Root Password** | This is the root password for the database. *Required* |
| **Admin Email for the server** | This email is used to generate the Let's Encrypt SSL certificate. *Required* |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name you wish to use with your application. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/). Some options may be limited or have recommended values based on this Marketplace App:

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended plan:** The Linode plan you deploy your LEMP stack on should account for the estimated workload. If you are standing up a simple web page, you can use a 1GB Linode (Nanode) or 2GB Linode. If you are standing up a larger or more robust web app, then consider a plan with higher RAM and CPU allocations.

## Getting Started After Deployment

After your LEMP stack has finished deploying, you can view it and upload your own files using one of the methods below:

- Log in to your new Compute Instance through [Lish](/docs/guides/using-the-lish-console/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using either the `root` user or limited user and the associated password you entered when creating the instance. Your application's web files are located in the `/var/www/html` directory.

- Navigate to the domain entered during the creation of the Linode instance. If you did not enter a domain, you can also use your Compute Instance's rDNS, which may look like `123-0-123-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing and setting the rDNS value.

- Consult the following guides to learn more about working with the various components of the LEMP stack:

    - [Secure HTTP Traffic with Certbot](/docs/guides/secure-http-traffic-certbot/)
    - [How to Configure NGINX](/docs/guides/how-to-configure-nginx/)
    - [How to Optimize MySQL Performance Using MySQLTuner](/docs/guides/how-to-optimize-mysql-performance-using-mysqltuner/)

- Upload files to your web root directory with an SFTP application like [FileZilla](/docs/guides/filezilla/). Use the same root credentials that you would use for SSH.

## Software Included

The LEMP Stack Marketplace App installs the following software on your Compute Instance:

| **Software** | **Description** |
|:--------------|:------------|
| [**NGINX**](https://www.nginx.com/) | Web server that can be used to serve your site or web application.|
| [**MySQL Server**](https://www.mysql.com) | Relational database. |
| [**PHP 7.4**](https://www.php.net) | General purpose programming language. |
| [**UFW (Uncomplicated Firewall)**](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) | Firewall utility. Ports 22/tcp and 80/tcp for IPv4 and IPv6 will allow outgoing and incoming traffic. |

{{< content "marketplace-update-note-shortguide">}}
