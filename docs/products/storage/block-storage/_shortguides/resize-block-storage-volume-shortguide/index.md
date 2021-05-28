---
slug: resize-block-storage-volume-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to resize your Block Storage Volume to make it smaller.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: Resize a Block Storage Volume
keywords: ["block storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/block-storage/resize-block-storage-volume-shortguide/']
---

Follow these steps to increase the size of a Block Storage Volume after it has been created:

{{< note >}}
Storage Volumes **cannot** be sized down, only up. Keep this in mind when sizing your Volumes.
{{< /note >}}

1.  Shut down your Linode.

1.  Click the **more options ellipsis** next to the Volume you would like to resize to bring up the Volume's menu.

1.  Click **Resize**.

    ![Select Resize from the Volume menu](bs-cloud-resize-volume.png "Select Resize from the Volume menu")

1.  Enter the new Volume size. The minimum size is 10 GiB and maximum is 10,000 GiB. Then click **Submit**.

    ![Resize Volume menu](bs-cloud-resize-volume-menu.png "Resize Volume menu")

1.  You'll be returned to the Volume list and the notification bell in the top right of the page will notify you when the resizing is complete.

    ![Notification bell shows the Volume has been resized](bs-cloud-volume-resized.png "Notification bell shows the Volume has been resized")

1.  Reboot your Linode.

1.  Once your Linode has restarted, make sure the Volume is unmounted for safety:

        umount /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

1.  Assuming you have an ext2, ext3, or ext4 partition,first run a file system check:

        e2fsck -f /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

1.  Then resize it to fill the new Volume size:

        resize2fs /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

1.  Mount your volume back onto the filesystem:

        mount /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1 /mnt/BlockStorage1
