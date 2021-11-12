---
slug: openlitespeed-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy OpenLiteSpeed on a Linode Compute Instance. This provides you with a high performance web server to manage your WordPress site."
keywords: [ 'openlitespeed','marketplace','hosting']
tags: ["cloud-manager","linode platform", "marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-15
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying OpenLiteSpeed through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[OpenLiteSpeed Quick Start guide](https://docs.litespeedtech.com/cloud/images/wordpress/#quick-start)'
- '[OpenLiteSpeed Knowledge Base](https://openlitespeed.org/kb/)'
- '[OpenLiteSpeed Forum](https://forum.openlitespeed.org/)'
aliases: ['/platform/marketplace/deploy-openlitespeed-with-marketplace-apps/', '/platform/one-click/deploy-openlitespeed-with-one-click-apps/','/guides/deploy-openlitespeed-with-marketplace-apps/']
---

[OpenLiteSpeed](https://openlitespeed.org/) is the Open Source edition of LiteSpeed cache for WordPress plugin that provides accelerated hosting platform for WordPress. OpenLiteSpeed combines speed, security, scalability, optimization, and simplicity in one friendly open-source package.

## Deploying the OpenLiteSpeed Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7, Debian 10, Ubuntu 18.04 LTS, and Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started After Deployment

1.  Log in to your Compute Instance over SSH. See [Connecting to a Remote Server Over SSH
](/docs/guides/connect-to-server-over-ssh/) for assistance. Once logged in, you should see output that contains links to your new site, phpmyadmin, and details about the software configuration (and location) on your server.

1. You are then prompted to enter the domain you'd like to use for this instance. You can optionally use a custom domain provided you've already configured the *A Records* to point to this server's IPv4 and IPv6 addresses. Otherwise, you can skip this by pressing *CTRL+C* which will use the IP address or default RDNS of the Compute Instance.

    {{< note >}}
For more documentation on how to assign a domain to your Linode, please review the [DNS Manager](/docs/guides/dns-manager/) guide for instructions on setting up your DNS records in the Cloud Manager, and read through [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/) for general information about how DNS works.
    {{</ note >}}

1.  Apply the Let's Encrypt SSL if your domain is pointed to the server already. Enter `y` and type your email address.

    A message that reads `Certificate has been successfully installed.....` appears. If you'd like to force HTTPS rewrites, enter `y` again at the prompt.

1.  Proceed through any remaining prompts, using whichever options you wish.

### Configure WordPress

1.  Open a web browser and navigate to your Compute Instance's IPv4 address or the custom domain you are using. The following page appears:

    ![WordPress language settings](wordpress_language_settings.png "WordPress language selection")

1.  Select your preferred language and click the **Continue** button.

1.  The next page should be the **Welcome** page. Type the required details to complete the installation, save the password in a secure location and click the **Install WordPress** button.

    ![WordPress Welcome Page ](wordpress_welcome_page.png "WordPress Welcome Page")

### Software Included

The WordPress Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**MariaDB Server**](https://www.mysql.com/) | Relational database. |
| [**PHP 7**](https://www.php.net/) | WordPress is written in PHP and requires PHP to operate. |
| [**Apache HTTP Server**](https://httpd.apache.org/) | Web server used to serve the WordPress site. |
| [**OpenLiteSpeed**](https://openlitespeed.org/) | Open source plugin for WordPress. |
| [**LiteSpeed Cache**](https://www.litespeedtech.com/) | The cache management for WordPress. |

{{< content "marketplace-update-note-shortguide">}}
