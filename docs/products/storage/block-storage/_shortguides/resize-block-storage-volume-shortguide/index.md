---
# Shortguide: How to resize your Block Storage Volume to make it smaller.

headless: true
show_on_rss_feed: false
---

At any time after the Block Storage Volume has been created, it can be increased to a larger size.

{{< note >}}
At this time, the size of Volumes are only able to be increased (not decreased). To decrease the size of your Volume, you will need to create a new Volume at your preferred size, attach it to your Linode, copy over your data, and remove the original Volume.
{{< /note >}}

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes).

1.  If the Volume is attached to a Linode, power off that Linode.

1.  Click on the **Volumes** link in the sidebar.

1.  Locate the desired Volume within the list, click the **more options ellipsis** dropdown menu, and select **Resize**.

1.  Enter the new Volume size. The minimum size is the current size of the Volume and maximum is 10,000 GB. Then click **Submit**.

1.  Click **Resize Volume** to start the resize. Once clicked, the **Resizing Instructions** panel appears with the instructions and commands needed to resize the Volume's filesystem. Either save these commands or leave this panel open. The notification bell in the top right of the page will notify you when the resizing is complete.

1.  Reboot your Linode after the Volume is resized.

1.  Once your Linode has fully restarted, you need to run the previously mentioned commands to resize your Linode's Block Storage Volume

    1. Login to your Linode using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-linode-shell-lish/).

    1.  Unmount the Volume:

            umount /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

    1.  Assuming you have an ext2, ext3, or ext4 partition, run a file system check:

            e2fsck -f /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

    1.  Then resize it to fill the new Volume size:

            resize2fs /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

    1.  Mount your Volume back onto the filesystem:

            mount /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1 /mnt/BlockStorage1
