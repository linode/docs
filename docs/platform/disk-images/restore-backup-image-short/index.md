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
shortguide: true
---

## Restore from a Backup

This section shows how to restore a backup to a [new](#restore-to-a-new-linode) Linode, or to an [existing](#restore-to-an-existing-linode) Linode.

Restoring a backup will create a new [configuration profile](/docs/platform/disk-images/disk-images-and-configuration-profiles/#configuration-profiles) and a new set of [disks](/docs/platform/disk-images/disk-images-and-configuration-profiles/#disks) on your Linode. The restore process does not restore single files or directories directly. Restoring particular files can be done by completing a normal restore, copying the files off of the new disks, and then removing the disks afterward.

{{< note >}}
The size of the disk(s) created by the restore process will only be slightly larger than the total size of the files restored, and this means that the disk(s) created will be 'full'.

Some applications, like databases, need some amount of free unused space inside the disk in order to run. As a result, you may want to resize your disk(s) upwards in size after the restore process is completed.
{{< /note >}}

To restore a backup to a different data center, first restore to a Linode in the same data center, creating a new one if necessary. Once the restore is complete, use the [Clone](/docs/migrate-to-linode/disk-images/clone-your-linode/) tab to copy the disk(s) to a Linode in a different data center.

### Restore to a New Linode

You can restore a backup to any Linode located in the same data center, even if the target does not have the Backup Service enabled. This section covers how to restore a backup to a new Linode that does not have any disks deployed to it. If you wish to restore your backup to an existing Linode, see the [next section](#restore-to-an-existing-linode).

1.  From the Dashboard of the Linode whose backups you intend to restore, click on the **Backups** tab. Select the **Restore to...** link beneath the backup that want to restore:

    {{< image src="backup-service-restore-to-link.png" alt="Backup Service Tab" title="Backup Service Tab" >}}

1.  Click the **Restore to this Linode** link next to your new Linode:

    {{< image src="backup-service-restore-to-new.png" alt="Restore to a New Linode" title="Restore to a New Linode" >}}

    The backup disks and configuration profiles will be restored to the Linode you selected. Watch the *Host Job Queue* to monitor the progress. Restoring from a backup can take several minutes depending on the size of your Linode and the amount of data you have stored on it.

### Restore to an Existing Linode

To restore a backup to an existing Linode, you will need to make sure that you have enough storage space that is not currently assigned to disk images.

{{< note >}}
If you are attempting to restore a disk to the Linode the backup was created from, the restoration process will not delete the original disk for you. Manually delete the original disk to make room for the backup.
{{< /note >}}

1.  Start by confirming the size of the backup that you wish to restore. From the **Backups** tab in your Linode's Dashboard, click the **Restore to...** link beneath your desired backup:

    {{< image src="backup-service-restore-to-link.png" alt="Backup Service Tab" title="Backup Service Tab" >}}

1.  Check the **Total size required** field to confirm the size of your backup:

    {{< image src="backup-service-total-size-required.png" alt="Backup Service Tab" title="Backup Service Tab" >}}

    In this example, the total size of the backup comes to 3107MB, meaning you would need at least that much free space to restore this backup to your Linode.

1.  Next, you'll confirm the total space assigned to disk images on your Linode, via the **Storage** indicator on your Linode's Dashboard:

    {{< image src="backup-service-dashboard-storage-indicator.png" alt="Linode Dashboard Storage Indicator" title="Linode Dashboard Storage Indicator" >}}

    Here you can see that the Linode has a total of 30720MB of storage space available, but all of it is currently assigned to the Linode's two disks.

1.  If the amount of space available is greater than the size of the backup, you can proceed with restoring. If the amount of unallocated space is less than the size of the backup, you can [resize your existing disks](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk) to make room for it.

    {{< note >}}
In some cases, you will not be able to shrink your disks enough to fit the restored backup. As an alternative, you can [change your Linode's plan](/docs/platform/disk-images/resizing-a-linode/) to a higher tier that offers more disk space.
{{< /note >}}

1.  Once the disk resize has completed, check the storage indicator on your Linode's Dashboard to confirm that you've freed up enough space for your backup:

    {{< image src="backup-service-storage-indicator-resize.png" alt="Linode Dashboard Storage Indicator" title="Linode Dashboard Storage Indicator" >}}

1.  From the **Backups** tab, click the **Restore to this Linode** link next to your Linode:

    {{< image src="backup-service-restore-to-a-linode.png" alt="Linode Dashboard Storage Indicator" title="Linode Dashboard Storage Indicator" >}}

    Your backup will begin restoring to your Linode, and you can monitor its progress from the *Host Job Queue* in your Linode's Dashboard tab. Note that the time it takes to restore your backup will vary depending upon the restore size, and the number of files being restored.
