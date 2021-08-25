---
# Shortguide: How to detach a Block Storage Volume from a Linode to prepare it to move to a different Linode.

headless: true
show_on_rss_feed: false
---

Follow these steps to safely detach a Block Storage Volume from a Linode. A Volume should be detached before it is reattached to a different Linode.

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes) and click on the **Linodes** link in the sidebar.

1.  Select the Linode that the Volume is currently attached to.

1.  It's recommended to power off the Linode. To do this, click **Power Off** on the top right of the Linode details page.

    {{< caution >}}
If a volume is currently mounted, detaching it while the Linode is powered on could cause data loss or an unexpected reboot. You can unmount the volume for safe live-detaching using the `umount` command:

    umount /dev/disk/by-id/scsi-0Linode_Volume_BlockStorage1

To avoid additional issues with your Linode, remove the detached volume's line from your `/etc/fstab/` configuration:

`FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults 0 2`
{{< /caution >}}

1.  Navigate to the **Storage** tab.

1.  Locate the Volume you wish to detach within the *Volumes* list, click the **more options ellipsis** dropdown menu, and select **Detach**.

1.  A confirmation screen appears and explains that the Volume will be detached from the Linode. Click **Detach** to confirm.

After detaching it from a Linode, the Volume will still exist on your account. It can be viewed within the **Volumes** listing page in the Cloud Manager.
