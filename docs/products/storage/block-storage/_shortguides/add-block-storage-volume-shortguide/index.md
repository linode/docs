---
# Shortguide: Sescribes how to create a new Block Storage Volume, attach it to your Linode, create a filesystem, and mount your Volume.

headless: true
show_on_rss_feed: false
---

Follow these steps to create a new Block Storage Volume, attach it to your Linode, create a filesystem, and mount your Volume:

1.  Click on the **Linodes** link in the sidebar.

1.  Select the Linode to which you want to attach a Block Storage Volume. The detail page for the Linode will appear.

1.  Navigate to the **Storage** tab and then click the **Add a Volume** button (within the *Volumes* section).

1.  Complete the **Create a Volume** form.

    - Select **Create and Attach Volume** to create a new Volume. Otherwise select **Attach Existing Volume** to attach a Volume that's already on your account and in the same data center as the Linode.
    - **Label:** A string up to 32 characters long and consisting only of ASCII characters `a-z; 0-9.-_`.
    - **Size:** The desired size for the new Volume. See the [Limitations and Considerations](#limitations-and-considerations) section for the minimum and maximum size.
    - **Config:** If the Linode has multiple Configuration Profiles, select which one the Block Storage Volume should be assigned to.
    - **Tags:** Optionally add or assign tags to help lalbel and organize your services.

1.  When finished, click *Create Volume*. Once created, the Volume is listed under *Volumes* table.

1.  You'll need to create a filesystem in your new Volume. If your Linode is not already running, boot then SSH into your Linode and execute the following command, where `FILE_SYSTEM_PATH` is your Volume's file system path:

        mkfs.ext4 FILE_SYSTEM_PATH

    {{< caution >}}
If a new filesystem is created on a Block Storage Volume that is already using a filesystem, the above command will result in data loss. You can safely check for the filesystem of an unmounted volume with the following command:

    blkid FILE_SYSTEM_PATH

If you do not receive output, there is currently no filesystem on this volume.
{{< /caution >}}

1.  Once the Volume has a filesystem, you can create a mountpoint for it:

        mkdir /mnt/BlockStorage1

1.  You can then mount the new Volume:

        mount FILE_SYSTEM_PATH /mnt/BlockStorage1

1.  If you want to mount the new Volume automatically every time your Linode boots, you'll want to add the following line to your **/etc/fstab** file:

        FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults 0 2

    {{< note >}}
If you plan on detaching the volume regularly or moving it between other Linodes, you may want to consider adding the flags `noatime` and `nofail` to the **/etc/fstab** entry.

* `noatime` - This will save space and time by preventing writes made to the filesystem for data being read on the volume.
*  `nofail`  - If the volume is not attached, this will allow your server to boot/reboot normally without hanging at dependency failures if the volume is not attached.

Example:

    FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults,noatime,nofail 0 2

    {{</ note >}}
