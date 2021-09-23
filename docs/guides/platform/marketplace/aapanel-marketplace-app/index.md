---
slug: aapanel-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "aaPanel is a simple but powerful control panel that includes a one-click LAMP/LNMP web server and a web-based dashboard. This tutorial walks you through deploying aaPanel using the Linode Marketplace."
keywords: ['control panel', 'web hosting']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying aaPanel through the Linode Marketplace"
aliases: ['/guides/deploying-aapanel-marketplace-app/']
external_resources:
- '[aaPanel](https://www.aapanel.com/)'
- '[aaPanel Documentation](https://doc.aapanel.com/web)'
---

aaPanel is a free and open source web hosting control panel. It allows you to manage the server's web server, websites, databases, FTP, and more through a simple web-based interface. Through aaPanel, you can quickly install a LEMP (NGINX) or LAMP (Apache) stack on your server and start hosting your websites.

## Deploying the aaPanel Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

## Configuration Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Access your aaPanel App

1.  After aaPanel has finished installing, log into your Linode via SSH, replacing `192.0.2.0` with your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/), and entering your Linode's root password when prompted:

        ssh root@192.0.2.0

2.  Once you login to the Linode, you will need to run the following command to obtain your login information for your aaPanel dashboard:

        cat /root/.aapanel_info

    ![aaPanel Login Details](aaPanel-login-info.png)

3.  Once you visit the URL and enter the login credentials you will be prompted to choose which One-Click services (LAMP/LNMP) you would like to install:

    ![aaPanel One-Click](aaPanel-one-click.png)

Now that you’ve accessed your dashboard, checkout [the official aaPanel documentation](https://doc.aapanel.com/) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}