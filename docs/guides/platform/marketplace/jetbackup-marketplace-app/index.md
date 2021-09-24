---
slug: jetbackup-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "JetBackup is a backup solution designed for the web hosting industry. This tutorial walks you through deploying JetBackup using the Linode Marketplace."
keywords: ['backups','cpanel', 'backup']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying JetBackup through the Linode Marketplace"
aliases: ['/guides/deploying-jetbackup-marketplace-app/']
external_resources:
- '[JetBackup](https://www.jetbackup.com/)'
---

JetBackup is a backup solution that can integrate with cPanel or be used as a standalone software within supported Linux distributions. It offers flexible backup management options, including the ability to perform off-site backups through S3-compatible storage (like Linode's [Object Storage](https://www.linode.com/products/object-storage/)). See the [JetBackup 5 product page](https://www.jetbackup.com/jetbackup-5/) for more details.

## Deploying the JetBackup Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

## Configuration Options

### JetBackup Options

Here are the additional options available for this Marketplace App:

- **Control Panel** *(Required)*: Choose a Control Panel to use with JetBackup 5. Select either cPanel/WHM or Linux (No Control Panel).
- **Release Tier** *(Required)*: Choose a JetBackup Release Tier. Select either stable (recommended), beta, or edge.

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7, CentOS 8, and AlmaLinux 8
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Access your JetBackup App

#### cPanel/WHM

To access JetBackup 5 in cPanel/WHM after installation, navigate to WHM Home > Plugins > JetBackup 5.

#### Standalone App

To access your JetBackup instance, Open a browser and navigate to your Linode rDNS domain `http://li1234-555.members.linode.com:3035/`. Replace `http://li1234-555.members.linode.com` with your [Linode's RDNS domain](/docs/guides/remote-access/#resetting-reverse-dns). This will bring you to a login page, where you can use the root credentials to the server to enter the JetBackup dashboard.

Now that you’ve accessed your dashboard, checkout [the official JetBackup documentation](https://docs.jetbackup.com/v5.1/adminpanel/gettingStarted.html#gettingstarted) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}