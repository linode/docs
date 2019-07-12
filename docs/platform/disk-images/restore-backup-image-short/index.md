---
author:
  name: Linode
  email: docs@linode.com
description: "Shortguide for restoring a backup to a new or existing Linode."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
modified: 2018-08-10
modified_by:
  name: Linode
title: "How to Restore a Backup Shortguide"
published: 2018-08-10
headless: true
---

## Restore from a Backup

This section shows how to restore a backup to a [new](#restore-to-a-new-linode) Linode, or to an [existing](#restore-to-an-existing-linode) Linode.

Restoring a backup will create a new [configuration profile](/docs/platform/disk-images/disk-images-and-configuration-profiles/#configuration-profiles) and a new set of [disks](/docs/platform/disk-images/disk-images-and-configuration-profiles/#disks) on your Linode. The restore process does not restore single files or directories automatically. Restoring particular files can be done by completing a normal restore, copying the files off of the new disks, and then removing the disks afterward.

{{< note >}}
The size of the disk(s) created by the restore process will only be slightly larger than the total size of the files restored. This means that the disk(s) created will be 'full'.

Some applications, like databases, need some amount of free unused space inside the disk in order to run. As a result, you may want to [increase your disk(s) size](/docs/quick-answers/linode-platform/resize-a-linode-disk-classic-manager/) after the restore process is completed.
{{< /note >}}

### Restore to a New Linode

You can restore a backup to any Linode located in the same data center, even if the target does not have the Backup Service enabled. This section covers how to restore a backup to a new Linode that does not have any disks deployed to it. If you wish to restore your backup to an existing Linode, see the [next section](#restore-to-an-existing-linode).

1.  From the Dashboard of the Linode whose backups you intend to restore, click on the **Backups** tab. Select the **Restore to...** link beneath the backup version that you want to restore.

1.  Under the *Select* column, click the **Restore to this Linode** link next to your new Linode.

    The backup disks and configuration profiles will be restored to the Linode you selected. Watch the *Host Job Queue* to monitor the progress. Restoring from a backup can take several minutes depending on the size of your Linode and the amount of data you have stored on it.

### Restore to an Existing Linode

To restore a backup to an existing Linode, you will need to make sure that you have enough storage space that is not currently assigned to disk images.

{{< note >}}
If you are attempting to restore a disk to the same Linode the backup was created from, the restoration process will not delete the original disk for you. You can manually delete the original disk if you prefer to, but this is not strictly required.
{{< /note >}}

1.  Start by confirming the size of the backup that you wish to restore. From the **Backups** tab in your Linode's Dashboard, click the **Restore to...** link beneath your desired backup version.

1.  Check the **Total size required** field to confirm the size of your backup.

    As an example, if the total size of the backup comes to 3107MB, this means you would need at least that much free space to restore the backup to your Linode.

1.  Next, you'll confirm the total space assigned to disk images on your Linode, via the **Storage** indicator on your Linode's Dashboard.

1.  If the amount of space available is greater than the size of the backup, you can proceed with restoring. If the amount of unallocated space is less than the size of the backup, you can [shrink your existing disks](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk) to make room for it.

    {{< note >}}
In some cases, you will not be able to shrink your disks enough to fit the restored backup. Other alternatives for restoring to your existing Linode include:

-   [Changing your Linode's plan](/docs/platform/disk-images/resizing-a-linode/) to a higher tier that offers more disk space.
-   [Removing other disks](/docs/platform/disk-images/disk-images-and-configuration-profiles/#removing-a-disk) from your Linode.
{{< /note >}}

1.  Once the disk resize has completed, check the storage indicator on your Linode's Dashboard to confirm that you've freed up enough space for your backup.

1.  From the **Backups** tab, click the **Restore to this Linode** link next to your Linode.

    Your backup will begin restoring to your Linode, and you can monitor its progress from the *Host Job Queue* in your Linode's Dashboard tab. Note that the time it takes to restore your backup will vary depending upon the restore size, and the number of files being restored.

    {{< note >}}
In order to access the files from your restored disks, **you will need to [reboot your Linode](/docs/platform/disk-images/disk-images-and-configuration-profiles/#selecting-and-using-a-configuration-profile) under the new configuration profile that was created by the restore process**. The restored disks are assigned to the new profile, and your backed up data will be accessible when you boot from that profile.
{{< /note >}}
