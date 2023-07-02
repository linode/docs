---
description: "This tutorial will show you how to install and configure the free and open-source server app, aaPanel, using the Linode One-Click Marketplace on CentOS 7."
keywords: ['control panel', 'web hosting']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-08-13
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy aaPanel through the Linode Marketplace"
aliases: ['/guides/deploying-aapanel-marketplace-app/','/guides/aapanel-marketplace-app/']
external_resources:
- '[aaPanel](https://www.aapanel.com/)'
- '[aaPanel Documentation](https://doc.aapanel.com/web)'
authors: ["Linode"]
---

[aaPanel](https://www.aapanel.com/) is a free and open source web hosting control panel. It allows you to manage the server's web server, websites, databases, FTP, and more through a simple web-based interface. Through aaPanel, you can quickly install a LEMP (NGINX) or LAMP (Apache) stack on your server and start hosting your websites.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** aaPanel should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS 7
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Access your aaPanel App

1.  Log in to your instance through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

2.  Run the following command to obtain your login information for your aaPanel dashboard:

        cat /root/.aapanel_info

    ![aaPanel Login Details](aaPanel-login-info.png)

3.  Once you visit the URL and enter the login credentials you will be prompted to choose which One-Click services (LAMP/LNMP) you would like to install:

    ![aaPanel One-Click](aaPanel-one-click.png)

Now that you’ve accessed your dashboard, checkout [the official aaPanel documentation](https://doc.aapanel.com/) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}