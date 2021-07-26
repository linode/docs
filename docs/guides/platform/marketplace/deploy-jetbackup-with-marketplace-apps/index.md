---
slug: deploy-jetbackup-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'The Leading backup solution for the web hosting industry.'
og_description: 'The Leading backup solution for the web hosting industry.'
keywords: ['backups','cpanel',and 'backup']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-22
modified_by:
  name: Linode
title: "Deploy JetBackup With Marketplace Apps"
h1_title: "How to Deploy JetBackup With Marketplace Apps"
enable_h1: true
external_resources:
- '[JetBackup](https://www.jetbackup.com/)'
---

## JetBackup Marketplace App

JetBackup 5 is our fastest, most secure, versatile, and reliable version yet! Now with even more highly requested destinations supporting incremental backups to choose from! See our [JetBackup 5 product page](https://www.jetbackup.com/jetbackup-5/) for more details.

### Deploy a JetBackup Marketplace App

{{< content "deploy-marketplace-apps">}}

### JetBackup Options
<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
You can configure your JetBackup App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Control Panel** | Choose a Control Panel to use with JetBackup 5. cPanel/WHM or Linux (No Control Panel). *Required*. |
| **Release Tier** | Choose a JetBackup Release Tier.(stable,beta,edge) *Required*. |

### Linode Options

After providing the App-specific options, provide configurations for your Linode server:
<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | CentOS 7, CentOS 8, AlmaLinux 8 are currently the only images supported by the JetBackup Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). JetBackup can be supported on any size Linode, but we suggest you deploy your JetBackup App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

<!-- the following disclaimer lets the user know how long it will take
     to deploy the app -->
After providing all required Linode Options, click on the **Create** button. **Your JetBackup App will complete installation anywhere between 5-10 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

### Access your JetBackup App

#### cPanel/WHM:

To access JetBackup 5 in cPanel/WHM after installation, navigate to WHM Home > Plugins > JetBackup 5.

#### Linux:

To access your JetBackup instance, Open a browser and navigate to your Linode rDNS domain `http://li1234-555.members.linode.com:3035/`. Replace `http://li1234-555.members.linode.com` with your [Linode's RDNS domain](docs/guides/remote-access/#resetting-reverse-dns). This will bring you to a login page, where you can use the root credentials to the server to enter the JetBackup dashboard.

Now that you’ve accessed your dashboard, checkout [the official JetBackup documentation](https://docs.jetbackup.com/v5.1/adminpanel/gettingStarted.html#gettingstarted) to learn how to further configure your instance.

{{< content "marketplace-update-note">}}