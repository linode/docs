---
slug: download-backups-locally
author:
  name: Edward Angert
  email: docs@linode.com
description: "This guide provides you with step-by-step instructions for downloading backup images of your Linodes by using the Backup feature in Cloud Manager."
keywords: ["backup", "backups", "rsync", "restore", "local"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-01-15
modified_by:
  name: Linode
published: 2018-08-08
title: Download a Local Copy of your Linode Backup
tags: ["security"]
aliases: ['/security/data-portability/download-backups-locally/']
image: download-a-local-copy-of-your-linode-backup.png
---

The [Linode Backups](/docs/products/storage/backups/) service can create automatic and manual snapshots of your Linode. A completed backup can be directly restored to the origin Linode or to a new Linode in the same data center. These workflows make it easy to revert to a working configuration if you run into any unexpected issues with your software.

Linode's backups are stored in a way that is only directly readable by the Linode Backups service. A common question for the service is how you can download the content from your Linode Backups to another storage location, like your home computer. This can be accomplished in two phases:

1. [Restore a backup](#restore-from-a-backup) to a new or existing Linode.
2. Download either [specific files](#download-specific-files-or-directories-over-ssh) or the [entire disk image](#download-a-disk-over-ssh) from that Linode, as needed.

## Before You Begin

### Account Permissions and Billing

Several of the steps in this guide involve adding services to or removing services from a Linode account. Visit our guide on [Users and Permissions](/docs/platform/manager/accounts-and-passwords/#users-and-permissions) for more information about restricted Linode users.

Note that the cost of adding Backups service and adding a Linode to your account is billed, prorated per hour. If the backups service is only enabled for a few hours, you will only be charged for a few hours of the service. See the [Backups pricing details](/docs/products/storage/backups/#pricing) for more information. Likewise, when you create a Linode, you will be billed per hour that the Linode exists, whether it is powered on or not.

The steps in this guide have been designed to minimize the potential costs associated with this process. Additionally, keep the following in mind:

- Removing a Linode from your account also cancels the associated Backup service for that Linode.
- A Linode's backups are deleted when a Linode is deleted.
- If you choose to leave the Backups service enabled, or if you do not remove the additional Linode from your account, you will be automatically billed. If you only power the Linode off, [you will still be billed for it](/docs/platform/billing-and-support/billing-and-payments/#if-my-linode-is-powered-off-will-i-be-billed).

### Enable Backups and Take a Snapshot

These steps are the minimum required for the scope of this guide. Visit our [Backups guide](/docs/products/storage/backups/) for information about how to implement regular backups of your Linode.

1.  Go to your Linode's dashboard, click **Backups**, click **Enable backups for this Linode »** and confirm the additional cost per month.

1.  This guide focuses on saving a snapshot or specific backup. Click **Take a New Snapshot Now**.

    - The snapshot appears in the *Backup History* at the bottom of the page.

{{< content "restore-backup-image-short" >}}

{{< content "download-files-from-your-linode-shortguide" >}}


## Clean Up after Your Download

After you've finished downloading your files or disks, you can optionally [delete the restored disks](/docs/guides/disks-and-storage/#deleting-a-disk). If you created a new Linode to perform the restore, consider [deleting the Linode](/docs/platform/billing-and-support/billing-and-payments/#removing-services). As a reminder, billing for that Linode will continue automatically if you do not remove it. If you only power the Linode off, [you will still be billed for it](/docs/platform/billing-and-support/billing-and-payments/#if-my-linode-is-powered-off-will-i-be-billed).
