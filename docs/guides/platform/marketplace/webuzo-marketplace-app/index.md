---
slug: webuzo-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows you how to deploy Webuzo from Softaculous, a LAMP stack control panel that allows you to deploy a growing number of applications and scripts."
keywords: ['webuzo','control panel','dashboard','marketplace']
tags: ["ubuntu","marketplace", "web applications","linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-12-02
modified: 2022-02-21
modified_by:
  name: Linode
title: "Deploying Webuzo through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Webuzo Documentation](http://www.webuzo.com/docs)'
- '[Softaculous Support](https://softaculous.deskuss.com)'
aliases: ['/platform/marketplace/how-to-deploy-webuzo-with-marketplace-apps/', '/platform/one-click/how-to-deploy-webuzo-with-one-click-apps/','/guides/how-to-deploy-webuzo-with-one-click-apps/','/guides/deploy-webuzo-with-marketplace-apps/']
---

Softaculous [Webuzo](https://www.webuzo.com) is a single user LAMP stack control panel that allows you to deploy a growing number of applications and scripts on your server with a single click.

## Deploying the Webuzo Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 15-20 minutes after the Linode has finished provisioning. During this time, the Compute Instance is rebooted. This time frame depends on a variety of factors, including which data center has been selected.**

## Configuration Options

### Webuzo Options

The Webuzo Marketplace form includes advanced fields to setup your Webuzo server's limited user account and DNS records. These are optional configurations and are not required for installation.

| **Field** | **Description** |
|-----------|-----------------|
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](https://www.linode.com/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started after Deployment

After the deployment process has finished and your Compute Instance has rebooted, you need to complete the initial setup for Webuzo. This includes adding a user, setting the domain (or IP), and optionally including a license key.

1.  Access the Webuzo Initial Setup page by opening a web browser and navigating to the following URL: `http://[ip-address]:2004`, replacing *[ip-address]* with the IPv4 address assigned to your new Compute Instance. If you do not see the initial setup screen (shown below), the deployment process may not yet be complete.

    ![Webuzo Setup Screen](webuzo-setup-screen.png "Webuzo Setup Screen")

1.  At the setup screen, fill in the fields and click the **Install** button. The installation may take a few minutes to fully complete.

1.  Once installation is completed, Webuzo displays the following confirmation screen:

    ![Webuzo Post-Setup Wizard](webuzo-post-setup-wizard.png "Webuzo Post-Setup Wizard")

## Accessing the Dashboards

Once Webuzo is fully installed, you can start using it by accessing both the Admin dashboard and Enduser dashboard. Both require you to login using the username and password you just created on the setup screen.

- **Admin Dashboard** (`http://[ip-address]:2004`): Modify the core configuration and manage the apps that are able to be installed.

    ![Webuzo Admin Panel](webuzo-admin-panel.png "Webuzo Admin Panel")

- **Enduser Dashboard** (`http://[ip-address]:2002`): Install individual applications and manage domains, emails, databases, and more.

    ![Webuzo Enduser Panel](webuzo-enduser-panel.png "Webuzo EnduserPanel")

{{< content "marketplace-update-note-shortguide">}}
