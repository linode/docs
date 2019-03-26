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

A LAMP (Linux, Apache, MySQL, PHP) stack is a common, free, and open-source web stack used for hosting web content in a Linux environment. This software environment is a foundation for popular PHP application frameworks like WordPress, Drupal, and Laravel. Upload your existing PHP application code to your new app or use a PHP framework to write a new application on your Linode.

### Deploy a LAMP Stack with One-Click Apps

<!-- content "deploy-one-click-apps" -->

The [LAMP Stack Options](#lamp-stack-options) section of this guide provides details on all available configuration options for this app.

### LAMP Stack Options

| **Field** | **Description** |
|:--------------|:------------|
| **MySQL root password** | Your LAMP stack's MySQL database password. *Required*. |

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by Drupal One-Click Apps. *Required* |
| **Region** | Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the route path between you and a data center in each specific region. *Required* |
| **Linode Plan** | Select a Linode plan. The Linode plan you deploy your LAMP stack on should account for the estimated workload. If you are standing up a simple web page, you can use a Nanode or 2GB Linode. If you are standing up a larger or more robust web app, then consider a plan with higher memory and RAM. *Required* |
| **Linode Label** | Give your Linode a label. This is a name to help you easily identify it within the Cloud Manager’s Dashboard. |
| **Root Password** | Create a root password for your Linode in the Root Password field. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. *Required* |

When you've provided all required Linode Options, click on the **Create** button. **Your LAMP Stack app will complete installation anywhere between 2-3 minutes after your Linode has finished provisioning.**

### Getting Started After Deployment

After your LAMP stack has finished deploying, you can:

- [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh). You will need your Linode's root password to proceed. Note that your Linode's web root will be located in the `/var/www/html` directory.

- [Navigate to the public IP address](/docs/getting-started/#find-your-linode-s-ip-address) of your Linode in a browser, and you will see the PHP settings that are active for your Linode.

- Consult the following guides to learn more about working with the various components of the LAMP stack:

    - [Secure HTTP Traffic with Certbot](https://linode.com/docs/quick-answers/websites/secure-http-traffic-certbot/)
    - [Apache Configuration Basics](/docs/web-servers/apache-tips-and-tricks/apache-configuration-basics/)
    - [How to Optimize MySQL Performance Using MySQLTuner](/docs/databases/mysql/how-to-optimize-mysql-performance-using-mysqltuner/)
    - [DNS Manager](/docs/platform/manager/dns-manager/)

### Software Included

The LAMP Stack One-Click App will install the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| **Apache HTTP Server** | Web Server that can be used to serve your site or web app.|
| **MySQL Server** | Database |
| **PHP 7** | General purpose programming language. |
| **UFW (UncomplicatedFirewall)** | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 will allow outgoing and incoming traffic. |