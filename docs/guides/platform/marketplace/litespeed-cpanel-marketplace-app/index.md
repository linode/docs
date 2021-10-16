---
slug: {{ path.Base .File.Dir }}
author:
  name: Linode Community
  email: docs@linode.com
description: "An lightning fast web server that conserves resources without sacrificing performance, security, or compatibility."
keywords: ['web server','cpanel','litespeed']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: {{ now.Format "2006-01-02" }}
modified_by:
  name: Linode
title: "Deploying LiteSpeed through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[LiteSpeed](https://www.litespeedtech.com/)'
---

The LiteSpeed cPanel app automatically installs WHM/cPanel, performance LiteSpeed Web Server, and WHM LiteSpeed Plugin. 

LiteSpeed Web Server Features:
 - HTTP/2, QUIC, HTTP/3
 - Event Driven Architecture
 - Apache Drop-in Replacement
 - LSCache Engine with ESI
 - Server-Level reCAPTCHA
 - One-Click Cache Acceleration

WHM LiteSpeed Plugin Features:
 - Version management
 - One-click switch between Apache and LiteSpeed Web Server
 - Build PHP with LSAPI
 - Quick PHP suExec and LiteSpeed cache setups
 - License management

Auto configuration:
  - Enable PHP_SUEXEC
  - Enable EasyApache integration
  - Switch to LiteSpeed Web Server
  - Cache Root Setup
  - Disable Apache mod_ruid2
  - Apache port offset 0

### Deploying the LiteSpeed Marketplace App

<!-- shortguide used by every Marketplace app to describe how to deploy from the Cloud Manger -->

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7, CentOS 8, AlmaLinux 8
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment
<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->
### Accessing the LiteSpeed App

1. Once your cPanel app has finished its installation, open a browser and navigate to `http://192.0.2.0:2087/`. Replace `192.0.2.0` with your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/).

    This will bring you to the Web Hosting Manager (WHM) login page. Enter `root` as the username and the root password you created when deploying your app. Click the **Log In** button.

    ![Log into your Web Hosting Manager](log-into-whm.png)

2. You will be presented with cPanel and WHM's terms. Read through the terms and click on **Agree to All** if you agree and would like to continue.

    ![Agree to cPanel and WHM's terms](agree-to-terms.png)

3. You will be prompted to enter in an email address to receive status and error notifications. Enter in your preferred email address.

    You will also be prompted to provide nameserver's for your cPanel instance to use. By default, cPanel will fill in the values for you. Update the values with the nameservers you would like to use. If you are managing your own nameservers, enter them into the form or, if you will be using [Linode's DNS manager](/docs/guides/dns-manager/), enter in Linode's nameservers into the form. Click **Finish** to complete the initial login process.

    {{< note >}}
Linode's nameservers are the following:

    ns1.linode.com.
    ns2.linode.com.
    ns3.linode.com.
    ns4.linode.com.
    ns5.linode.com.

See our [How do I set up DNS on cPanel?](https://www.linode.com/community/questions/19216/how-do-i-set-up-dns-on-cpanel) community question and answer for details related to cPanel and Linode nameservers.
    {{</ note >}}

    ![Provide an email address and your Linode nameservers.](email-and-nameservers.png)

4. You will be brought to your WHM's home page where you can continue to configure your cPanel instance.

    ![cPanel home page](cpanel-home-page.png)

Now that you’ve accessed your LiteSpeed instance, checkout [the official LiteSpeed documentation](https://www.litespeedtech.com/support/wiki/doku.php/litespeed_wiki) to learn how to further utilize your LiteSpeed instance.

  {{< note >}}
Your LiteSpeed cPanel App installation will automatically receive a free 15-day trial license on both [LiteSpeed](https://docs.litespeedtech.com/licenses/trial/) and [cPanel](https://cpanel.net/products/trial/). You must purchase a new LiteSpeed and cPanel/WHM license before the end of this trial period. At the end of your trial period your license will expire.
  {{</ note >}}

<!-- the following shortcode informs the user that Linode does not provide automatic updates
     to the Marketplace app, and that the user is responsible for the security and longevity
     of the installation. -->
{{< content "marketplace-update-note-shortguide">}}