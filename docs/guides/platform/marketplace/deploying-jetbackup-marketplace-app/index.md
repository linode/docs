---
slug: deploying-jetbackup-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "JetBackup is a backup solution designed for the web hosting industry. This tutorial walks you through deploying JetBackup using the Linode Marketplace."
og_description: "JetBackup is a backup solution designed for the web hosting industry. This tutorial walks you through deploying JetBackup using the Linode Marketplace."
keywords: ['backups','cpanel', 'backup']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified: 2021-08-13
modified_by:
  name: Linode
title: "How to Deploy JetBackup through the Linode Marketplace"
h1_title: "Deploying JetBackup through the Linode Marketplace"
enable_h1: true
external_resources:
- '[JetBackup](https://www.jetbackup.com/)'
---

JetBackup is a backup solution that can integrate with cPanel or be used as a standalone software within supported Linux distributions. It offers flexible backup management options, including the ability to perform off-site backups through S3-compatible storage (like Linode's [Object Storage](https://www.linode.com/products/object-storage/)). See the [JetBackup 5 product page](https://www.jetbackup.com/jetbackup-5/) for more details.

## Deploying the JetBackup Marketplace App

{{< content "deploy-marketplace-apps">}}

### JetBackup Configuration Options

You can configure your JetBackup App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Control Panel** | Choose a Control Panel to use with JetBackup 5. Select either cPanel/WHM or Linux (No Control Panel). *Required*. |
| **Release Tier** | Choose a JetBackup Release Tier. Select either stable (recommended), beta, or edge. *Required*. |

### Linode Configuration Options

After providing the App-specific options, provide configurations for your Linode server:
<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | CentOS 7, CentOS 8, AlmaLinux 8 are currently the only images supported by the JetBackup Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). JetBackup can be supported on any size Linode, but we suggest you deploy your JetBackup App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

After providing all required Linode Options, click on the **Create** button. **Your JetBackup App will complete installation anywhere between 5-10 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

### Access your JetBackup App

#### cPanel/WHM

To access JetBackup 5 in cPanel/WHM after installation, navigate to WHM Home > Plugins > JetBackup 5.

#### Standalone App

To access your JetBackup instance, Open a browser and navigate to your Linode rDNS domain `http://li1234-555.members.linode.com:3035/`. Replace `http://li1234-555.members.linode.com` with your [Linode's RDNS domain](/docs/guides/remote-access/#resetting-reverse-dns). This will bring you to a login page, where you can use the root credentials to the server to enter the JetBackup dashboard.

Now that you’ve accessed your dashboard, checkout [the official JetBackup documentation](https://docs.jetbackup.com/v5.1/adminpanel/gettingStarted.html#gettingstarted) to learn how to further configure your instance.

{{< content "marketplace-update-note">}}