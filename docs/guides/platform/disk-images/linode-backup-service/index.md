---
slug: linode-backup-service
author:
  name: Alex Fornuto
description: The Linode Backup Service automatically performs daily, weekly, and biweekly backups of your Linode. This guide explains how to enable and schedule your backups, make a manual backup snapshot, restore from a backup, and disable the Backup Service.
og_description: The Linode Backup Service automatically performs daily, weekly, and biweekly backups of your Linode. This guide explains how to enable and schedule your backups, make a manual backup snapshot, restore from a backup, and disable the Backup Service.
keywords: ["backup service", "linode platform", "linode backup service", "enable a backup", "manage a backup", "schedule a backup", "disable a backup", "restore from a backup", "boot from a backup"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/security/backups/linode-backup-service/','/platform/disk-images/linode-backup-service-classic-manager/','/platform/backup-service/','/platform/linode-backup-service/','/platform/disk-images/linode-backup-service/','/platform/disk-images/linode-backup-service-new-manager/','/backup-service/']
modified: 2018-12-20
modified_by:
  name: Linode
published: 2018-12-20
title: 'The Linode Backup Service'
---

![The Linode Backup Service](The_Linode_Backup_Service_smg.jpg)

The *Linode Backup Service* is a subscription service add-on that automatically performs daily, weekly, and biweekly backups of your Linode. It's affordable, easy to use, and provides peace of mind. This guide explains how to enable and schedule your backups, make a manual backup snapshot, restore from a backup, and disable the Backup Service.

## Pricing

Pricing is per Linode and varies depending upon your Linode's plan. See the options on [the pricing page](https://www.linode.com/pricing/#row--storage) under Backups.

## Enable the Backup Service

{{< content "backups-enable-shortguide" >}}

### Auto Enroll New Linodes in the Backup Service

You can automatically enroll all new Linodes in the Backup Service. To do so, click the **Account** link in the sidebar, then select the **Global Settings** tab.

In the **Backup Auto Enrollment** panel, click on the switch to enable backups on all new Linodes.

![Auto enroll all new Linodes in the Backup Service by navigating to the Global Settings tab in the Account settings and enabling Backups.](backups-auto-enroll.png)

{{< note >}}
Enabling this setting does not retroactively enroll any previously created Linodes in the Backup Service.
{{< /note >}}

## Manage Backups

{{< content "backups-manage-shortguide" >}}

## How Linode Backups Work

Backups are stored on a separate system in the same data center as your Linode. The space required to store the backups is *not* subtracted from your storage space. You can store four backups of your Linode, three of which are automatically generated and rotated:

-   **Daily backup:** Automatically initiated daily within the backup window you select. Less than 24 hours old.
-   **Current week's backup:** Automatically initiated weekly within the backup window, on the day you select. Less than 7 days old.
-   **Last week's backup:** Automatically initiated weekly within the backup window, on the day you select. Between 8 and 14 days old.
-   **Manual Snapshot:** A user-initiated snapshot that stays the same until another snapshot is initiated.

The daily and weekly backups are automatically erased when a new backup is performed. The Linode Backup Service does not keep automated backups older than 14 days.

## Schedule Backups

{{< content "backups-schedule-shortguide" >}}

## Take a Manual Snapshot

{{< content "backups-manual-snapshot-shortguide" >}}

## Restore from a Backup

This section shows how to restore a backup to a [new](/docs/guides/linode-backup-service/#restore-to-a-new-linode) Linode, or to an [existing](/docs/guides/linode-backup-service/#restore-to-an-existing-linode) Linode.

### Restore to a New Linode

{{< content "backups-restore-to-a-new-linode-shortguide" >}}

### Restore to an Existing Linode

{{< content "backups-restore-to-an-existing-linode-shortguide" >}}

## Boot from a Backup

{{< content "backups-boot-shortguide" >}}

## Cancel the Backup Service

You can cancel the Backup Service at any time. From your Linode's details page, choose the **Backups** tab and click the **Cancel Backups** link at the bottom of the page. Cancelling the service removes your saved backups from the Linode platform.

{{< caution >}}
Cancelling your Backup Service irretrievably deletes all of your Linode's Backups, including its manual Snapshot.

To preserve this data, you need to back up your data independently from the Backup Service before cancelling it. You may consult the suggestions in [Backing Up Your Data](/docs/guides/backing-up-your-data/) for more information on how to do this.
{{</ caution >}}

## Limitations

There are some limitations to what the Linode Backup Service can back up. Here are some things you should be aware of:

-   The Backup Service must be able to mount your disks. If you've created partitions, configured full disk encryption, or made other changes that prevent us from mounting the disk as a file system, you likely can not use the Linode Backup Service. The backup system operates at the file level, not at the block level.
-    Because the Backup Service is file-based, the number of files stored on disk impacts both the time it takes for backups and restores to complete, and your ability to successfully take and restore backups. Customers who need to permanently store a large number of files may want to archive bundles of smaller files into a single file, or consider other backup services.

{{< note >}}
The percentage of customers who may run into this limitation is low. If you are not sure if this limitation applies to you, please [contact Linode Support](/docs/guides/support/#contacting-linode-support).
{{< /note >}}

-   Backups taken of ext4 or ext3 filesystems are restored as ext4. Backups taken of other mountable file system types have their contents restored using ext4.
-   Files that have been modified but have the same size and modify time are not be considered "changed" during a subsequent backup. ACLs and extended attributes are *not* tracked.
-   The Backup Service uses a snapshot of your disks to take consistent backups while your Linode is running. This method is very reliable, but can fail to properly back up the data files for database services like MySQL. If the snapshot occurs during a transaction, the database's files may be backed up in an unclean state. We recommend scheduling routine dumps of your database to a file on the filesystem. The resulting file is then be backed up, allowing you to restore the contents of the database if you need to restore from a backup.
