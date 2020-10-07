---
slug: detach-block-storage-volume-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to detach a Block Storage Volume from a Linode to prepare it to move to a different Linode.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: Detach a Block Storage Volume
keywords: ["block storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/block-storage/detach-block-storage-volume-shortguide/']
---

Follow these steps to safely detach a Block Storage Volume from a Linode. A Volume should be detached before it is reattached to a different Linode:

1.  Go to the detail page page of the Linode which the Volume is attached to. Shut down the Linode.

1.  When the Linode is powered off, click on the **Volumes** tab, click the **more options ellipsis** next to the Volume you would like to detach, then click **Detach**.

    ![Detach a Volume from a Linode from the Volume menu](bs-cloud-detach-volume.png "Detach a Volume from a Linode from the Volume menu")

1.  A confirmation screen appears and explains that the Volume will be detached from the Linode. Click **Detach** to confirm:

    ![Linode Cloud Manager detach Volume confirmation](bs-cloud-detach-volume-confirm.png "Linode Cloud Manager detach Volume confirmation")

    The Linode's dashboard does not show the Volume present anymore:

    ![The Linode's Volumes tab shows no attached Volumes](bs-cloud-add-volume-to-linode-small.png "The Linode's Volumes tab shows no attached Volumes")

    The Volume still exists on your account and you can see it if you view the **Volumes** page:

    ![Volume not attached, but still exists](bs-cloud-volume-detached-but-still-available.png "Volume not attached, but still exists")

{{< caution >}}
If a volume is currently mounted, detaching it while the Linode is powered on could cause data loss or an unexpected reboot. You can unmount the volume for safe live-detaching using the `umount` command:

    umount /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

To avoid additional issues with your Linode, remove the detached volume's line from your `/etc/fstab/` configuration:

`FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults 0 2`

{{< /caution >}}
