---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use One-Click Apps to deploy a LEMP stack on Linode'
og_description: 'Use One-Click Apps to deploy a LEMP stack on Linode'
keywords: ['LEMP', 'nginx', 'web server', 'mysql', 'php']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2020-03-11
modified_by:
  name: Linode
title: "Deploy a LEMP Stack With One-Click Apps"
h1_title: "Deploying a LEMP Stack with One-Click Apps"
contributor:
  name: Linode
external_resources:
- '[NGINX Getting Started](https://www.nginx.com/resources/wiki/start/)'
---

## LEMP Stack One-Click App

A LEMP (Linux, [NGINX](https://www.nginx.com/), [MySQL](https://www.mysql.com/), [PHP](https://www.php.net/)) stack is a popular, free, and open-source web software bundle used for hosting websites on the Linux operating system. While similar to a [LAMP Stack](/docs/platform/one-click/deploy-lamp-stack-with-one-click-apps/), a LEMP stack uses the NGINX web server as opposed to [Apache](https://httpd.apache.org/). NGINX may be a preference for many reasons, however many will choose it due to it's speed and ability to perform under high load.

### Deploy a LEMP Stack with One-Click Apps

{{< content "deploy-one-click-apps" >}}

The [LEMP Stack Options](#lemp-stack-options) section of this guide provides details on all available configuration options for this app.

### LEMP Stack Options

| **Field** | **Description** |
|:--------------|:------------|
| **New User** | The username for a new non-root sudo user. *Required*.|
| **New User Password** | The Password for the new user. *Required*.|
| **MySQL Root Password** | The root password for your LEMP stack's MySQL database. This is not the same as your Linode's root password. *Required*. |

### Linode Options

After providing the app-specific options, enter configuration values for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by the LEMP One-Click App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). The Linode plan you deploy your LEMP stack on should account for the estimated workload. If you are standing up a simple web page, you can use a Nanode or 2GB Linode. If you are standing up a larger or more robust web app, then consider a plan with higher RAM and CPU allocations. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your LEMP Stack app will complete installation anywhere between 2-3 minutes after your Linode has finished provisioning.**

### Getting Started After Deployment

After your LEMP stack has finished deploying, you can:

- [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh) as your root or limited user. You will need your Linode's root and/or user password to proceed. Note that your Linode's web root will be located in the `/var/www/html` directory.

- [Navigate to the public IP address](/docs/getting-started/#find-your-linode-s-ip-address) of your Linode in a browser. You will see the PHP settings that are active for your Linode.

- Consult the following guides to learn more about working with the various components of the LEMP stack:

    - [Secure HTTP Traffic with Certbot](https://linode.com/docs/quick-answers/websites/secure-http-traffic-certbot/)
    - [How to Configure NGINX](/docs/web-servers/nginx/how-to-configure-nginx/)
    - [How to Optimize MySQL Performance Using MySQLTuner](/docs/databases/mysql/how-to-optimize-mysql-performance-using-mysqltuner/)

-   Upload files to your web root directory with an SFTP application like [FileZilla](/docs/tools-reference/file-transfer/filezilla/). Use the same root credentials that you would use for SSH.

-   Assign a domain name to your Linode's IP address. Review the [DNS Manager](/docs/platform/manager/dns-manager/) guide for instructions on setting up your DNS records in the Cloud Manager, and read through [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) for general information about how DNS works.

### Software Included

The LEMP Stack One-Click App will install the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**NGINX**](https://www.nginx.com/) | Web server that can be used to serve your site or web application.|
| [**MySQL Server**](https://www.mysql.com) | Relational database. |
| [**PHP 7**](https://www.php.net) | General purpose programming language. |
| [**UFW (Uncomplicated Firewall)**](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) | Firewall utility. Ports 22/tcp and 80/tcp for IPv4 and IPv6 will allow outgoing and incoming traffic. |

{{< content "one-click-update-note">}}
