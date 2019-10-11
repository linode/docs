---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use One-Click Apps to deploy a LAMP stack on Linode'
keywords: ['LAMP', 'apache', 'web server', 'mysql', 'php']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-26
modified: 2019-03-26
modified_by:
  name: Linode
title: "Deploy a LAMP Stack with One-Click Apps"
contributor:
  name: Linode
external_resources:
- '[Apache Getting Started](http://httpd.apache.org/docs/current/getting-started.html)'
---

## LAMP Stack One-Click App

A LAMP (Linux, [Apache](https://www.apache.org), [MySQL](https://www.mysql.com), [PHP](https://www.php.net)) stack is a popular, free, and open-source web software bundle used for hosting websites on Linux. This software environment is a foundation for popular PHP application frameworks like WordPress, Drupal, and Laravel. After you deploy your LAMP One-Click App, you can upload your existing PHP application code to it or use a PHP framework to write a new application on your Linode.

### Deploy a LAMP Stack with One-Click Apps

{{< content "deploy-one-click-apps" >}}

The [LAMP Stack Options](#lamp-stack-options) section of this guide provides details on all available configuration options for this app.

### LAMP Stack Options

| **Field** | **Description** |
|:--------------|:------------|
| **MySQL Root Password** | The root password for your LAMP stack's MySQL database. This is not the same as your Linode's root password. *Required*. |

### Linode Options

After providing the app-specific options, enter configuration values for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by the LAMP One-Click App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). The Linode plan you deploy your LAMP stack on should account for the estimated workload. If you are standing up a simple web page, you can use a Nanode or 2GB Linode. If you are standing up a larger or more robust web app, then consider a plan with higher RAM and CPU allocations. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your LAMP Stack app will complete installation anywhere between 2-3 minutes after your Linode has finished provisioning.**

### Getting Started After Deployment

After your LAMP stack has finished deploying, you can:

- [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh). You will need your Linode's root password to proceed. Note that your Linode's web root will be located in the `/var/www/html` directory.

- [Navigate to the public IP address](/docs/getting-started/#find-your-linode-s-ip-address) of your Linode in a browser. You will see the PHP settings that are active for your Linode.

- Consult the following guides to learn more about working with the various components of the LAMP stack:

    - [Secure HTTP Traffic with Certbot](https://linode.com/docs/quick-answers/websites/secure-http-traffic-certbot/)
    - [Apache Configuration Basics](/docs/web-servers/apache-tips-and-tricks/apache-configuration-basics/)
    - [How to Optimize MySQL Performance Using MySQLTuner](/docs/databases/mysql/how-to-optimize-mysql-performance-using-mysqltuner/)

-   Upload files to your web root directory with an SFTP application like [FileZilla](/docs/tools-reference/file-transfer/filezilla/). Use the same root credentials that you would use for SSH.

-   Assign a domain name to your Linode's IP address. Review the [DNS Manager](/docs/platform/manager/dns-manager/) guide for instructions on setting up your DNS records in the Cloud Manager, and read through [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) for general information about how DNS works.

### Software Included

The LAMP Stack One-Click App will install the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Apache HTTP Server**](https://www.apache.org) | Web server that can be used to serve your site or web application.|
| [**MySQL Server**](https://www.mysql.com) | Relational database. |
| [**PHP 7**](https://www.php.net) | General purpose programming language. |
| [**UFW (Uncomplicated Firewall)**](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 will allow outgoing and incoming traffic. |
