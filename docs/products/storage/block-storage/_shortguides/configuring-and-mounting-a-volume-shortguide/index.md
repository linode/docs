---
# Shortguide: How to configure and mount a Block Storage volume

headless: true
show_on_rss_feed: false
---

Once a Block Storage Volume has been attached to a Linode, you'll need to perform a few steps before you can start using it. These steps include creating a file system (if you're configuring a new Volume) and mounting the Volume to your Linode's system. To make configuration easier, all the necessary commands can be viewed directly in the Cloud Manager.

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes) and click on the **Volumes** link in the sidebar.

1.  Locate the desired Volume within the list and click the **Show Config** link, which may appear within the **more options ellipsis** dropdown menu.

1.  The **Volume Configuration** panel will appear containing the commands needed to fully configure the Volume with your Linode.

1.  Login to your Linode using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-linode-shell-lish/).

1.  Enter each command that's shown in the **Volume Configuration** panel, modifying them if needed. These configuration steps are also listed below:

    1.  Create an ext4 file system by running the following command, where `FILE_SYSTEM_PATH` is your Volume's file system path:

            mkfs.ext4 FILE_SYSTEM_PATH

        {{< caution >}}
If a new filesystem is created on a Block Storage Volume that is already using a filesystem, the above command will result in data loss. You can safely check for the filesystem of an unmounted volume with the following command:

    blkid FILE_SYSTEM_PATH

If you do not receive output, there is currently no filesystem on this volume.
    {{< /caution >}}

    1.  Create a mount point

            mkdir /mnt/BlockStorage1

    1.  Mount the Volume to that mount point.

            mount FILE_SYSTEM_PATH /mnt/BlockStorage1

    1.  If you want to mount the new Volume automatically every time your Linode boots, add the following line to your **/etc/fstab** file:

            FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults 0 2

        {{< note >}}
If you plan on detaching the volume regularly or moving it between other Linodes, you may want to consider adding the flags `noatime` and `nofail` to the **/etc/fstab** entry.

* `noatime` - This will save space and time by preventing writes made to the filesystem for data being read on the volume.
*  `nofail`  - If the volume is not attached, this will allow your server to boot/reboot normally without hanging at dependency failures if the volume is not attached.

Example:

    FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults,noatime,nofail 0 2
{{</ note >}}