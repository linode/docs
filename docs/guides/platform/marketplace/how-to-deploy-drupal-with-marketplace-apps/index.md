---
slug: how-to-deploy-drupal-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use the Drupal Marketplace App to easily install the popular open source content management system. You can use Drupal to build websites for a variety of applications. The Drupal community is very active and provides many contributed modules to help you expand on Drupal''s core functionality.'
og_description: 'Use the Drupal Marketplace App to easily install the popular open source content management system. You can use Drupal to build websites for a variety of applications. The Drupal community is very active and provides many contributed modules to help you expand on Drupal''s core functionality.'
keywords: ['drupal','marketplace', 'cms']
tags: ["cloud-manager","linode platform","drupal","cms","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-25
modified: 2019-03-25
modified_by:
  name: Linode
title: "How to Deploy Drupal with Marketplace Apps"
h1_title: "Deploying Drupal with Marketplace Apps"
aliases: ['/platform/marketplace/deploying-drupal-with-marketplace-apps/','/platform/marketplace/how-to-deploy-drupal-with-marketplace-apps/', '/platform/one-click/deploying-drupal-with-one-click-apps/', '/platform/one-click/how-to-deploy-drupal-with-one-click-apps/']
contributor:
  name: Linode
external_resources:
 - '[Drupal 9 Official Documentation](https://www.drupal.org/docs/understanding-drupal)'
---

## Drupal Marketplace App

Drupal is a content management system (CMS) designed for building custom websites for personal and business use. Built for high performance and scalability, Drupal provides the necessary tools to create rich, interactive "community" websites with forums, user blogs, and private messaging. Drupal also has support for personal publishing projects and can power podcasts, blogs, and knowledge-based systems, all within a single, unified platform.

In addition to the core infrastructure, there are a number of freely available Drupal modules that allow administrators of Drupal sites to provide additional functionality, and a robust API makes it easy to enable these features. Furthermore, Drupal has an advanced theming engine that allows for a great amount of flexibility for displaying content.

### Deploy a Drupal Marketplace App

{{< content "deploy-marketplace-apps">}}

The [Drupal Options](#drupal-options) section of this guide provides details on all available configuration options for this app.

### Drupal Options

You can configure your Drupal App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Database Root Password** | Password for your Drupal site's MariaDB database `root` user. *Required*. |
| **Database User Password** | Password for your Drupal site's MariaDB database `drupal` user. *Required*. |

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 10 is currently the only image supported by Drupal Marketplace Apps, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Drupal is an extremely flexible CMS that can be supported on any size Linode, but we suggest you deploy your Drupal app on a Linode plan that reflects how much content you plan on featuring as well as how much traffic you expect for your site. For small websites, a 1GB Linode (Nanode) is sufficient. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your Drupal app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

### Access your Drupal Site

After Drupal has finished installing, you will be able to access your Drupal site over `http://` with your Linode's IPv4 address.

1. To find your Linode's IPv4 address, click on the **Linodes** link in the Cloud Manager sidebar. You will see a list of all your Linodes.

1. Find the Linode you just created. Under the **IP Address** column, copy the IPv4 address.

1. Navigate to the **Networking** tab.

1. Paste the IPv4 address into a browser window, for example, `http://192.0.2.0`. You will be brought to the Drupal installation page.

    ![View the Drupal installation page.](drupal-installation-page.png)

1. Follow the prompts for the **Choose language**, **Choose profile**, and **Verify requirements** screens and select the appropriate configuration values for your Drupal site.

1. In the **Database configuration** screen, fill in the form with the values in the table below. Click on **Save and Continue** when you are done.

    | **Database Configuration** | **Description** |
    |:--------:|:---------:|
    | Database name | The Marketplace App will create a database named `drupaldb`. Provide this value in the form. |
    | Database username | The Marketplace App will create a database user named `drupal`. Provide this value in the form. |
    | Database password | When you deployed the Marketplace app, in the [Drupal Options](##drupal-options) section, you provided a *Database User Password*. Provide this value in the form. |

1. Continue to follow the prompts for the **Configure site** screen and select the appropriate configuration values for your Drupal site. When complete, you will be brought to your Drupal site's admin panel where you can begin [building your Drupal site](https://www.drupal.org/documentation/build).

    ![You will be brought to your Drupal site's admin panel where you can begin building your Drupal site.](drupal-admin-panel.png)

### Software Included

The Drupal Marketplace App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**MariaDB Server**](https://mariadb.org/) | Relational database. |
| [**PHP 7**](https://www.php.net) | Drupal is written in PHP and requires PHP to operate. |
| [**Apache HTTP Server**](https://httpd.apache.org) | Web Server used to serve the Drupal site. |
| [**Drupal 9**](https://www.drupal.org/about/9) | Content management system. |

{{< content "marketplace-update-note">}}

## Next Steps

- Register a domain name and [create a DNS record](/docs/platform/manager/dns-manager/) for it using the Linode Cloud Manager.
- [Configure your Apache HTTP Server](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-debian-10/#configure-name-based-virtual-hosts) to point to your domain name.
