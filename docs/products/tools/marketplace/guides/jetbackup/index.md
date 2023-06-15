---
description: "JetBackup is a backup solution designed for the web hosting industry. This tutorial walks you through deploying JetBackup using the Linode Marketplace."
keywords: ['backups','cpanel', 'backup']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-08-13
modified: 2022-05-17
modified_by:
  name: Linode
title: "Deploy JetBackup through the Linode Marketplace"
aliases: ['/guides/deploying-jetbackup-marketplace-app/','/guides/jetbackup-marketplace-app/']
external_resources:
- '[JetBackup](https://www.jetbackup.com/)'
authors: ["Linode"]
---

[JetBackup](https://www.jetbackup.com/) is a backup solution that can integrate with cPanel or be used as a standalone software within supported Linux distributions. It offers flexible backup management options, including the ability to perform off-site backups through S3-compatible storage (like Linode's [Object Storage](https://www.linode.com/products/object-storage/)).

{{< note >}}
JetBackup requires a valid license to use the software beyond the available 10 day [free trial](https://cpanel.net/products/trial/) period. To purchase a license, visit [JetBackup's website](https://billing.jetapps.com/index.php?rp=/store/prorated-license) and select a plan that fits your needs. Licenses are not available directly through Linode.
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** JetBackup should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS 7, AlmaLinux 8
- **Recommended minimum plan:** All plan types and sizes can be used.

### JetBackup Options

- **Control Panel** *(Required)*: Choose a Control Panel to use with JetBackup 5. Select either cPanel/WHM or Linux (No Control Panel).
- **Release Tier** *(Required)*: Choose a JetBackup Release Tier. Select either stable (recommended), beta, or edge.

## Getting Started after Deployment

### Access your JetBackup App

#### cPanel/WHM

To access JetBackup 5 in cPanel/WHM after installation, navigate to WHM Home > Plugins > JetBackup 5.

#### Standalone App

To access your JetBackup instance, Open a browser and navigate to your Linode rDNS domain `http://203-0-113-0.ip.linodeusercontent.com:3035/`. Replace `http://203-0-113-0.ip.linodeusercontent.com` with your [Linode's RDNS domain](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses). This will bring you to a login page, where you can use the root credentials to the server to enter the JetBackup dashboard.

Now that you’ve accessed your dashboard, checkout [the official JetBackup documentation](https://docs.jetbackup.com/v5.1/adminpanel/gettingStarted.html#gettingstarted) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}