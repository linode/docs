---
author:
  name: Linode
  email: docs@linode.com
title: "Configure and Mount a Volume"
description: "Learn how to create a file system on a Block Storage Volume and mount it to a Compute Instance."
modified: 2022-08-24
---

Once a Block Storage Volume has been attached to a Compute Instance, you need to perform a few additional steps before you can start using it. These steps include creating a file system (if you're configuring a new Volume) and mounting the Volume to your Compute Instance's system. To make configuration easier, all the necessary commands can be viewed directly in the Cloud Manager.

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes) and click on the **Volumes** link in the sidebar.

1.  Locate the desired Volume within the list and click the **Show Config** link, which may appear within the **more options ellipsis** dropdown menu.

1.  The **Volume Configuration** panel appears and contains the commands needed to fully configure the Volume with your Compute Instance.

1.  Login to your Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Enter each command that's shown in the **Volume Configuration** panel, modifying them if needed. These configuration steps are also listed below:

    1.  **Create a file system.** If your Volume *has not* been used before, create an ext4 file system on the Volume.

        {{< caution >}}
Skip this step if you wish to retain any data stored on an existing Volume. Creating a new file system will overwrite any existing data and result in data loss. You can view existing file systems on an unmounted volume with the following command:

    blkid FILE_SYSTEM_PATH

If you do not receive output, there is currently no file system on this volume.
    {{< /caution >}}

        You can create an ext4 file system by running the following command, where `FILE_SYSTEM_PATH` is your Volume's file system path:

            mkfs.ext4 FILE_SYSTEM_PATH

    1.  **Create a mount point.** This is the directory on your Linux system where the Block Storage files will be located.

            mkdir /mnt/BlockStorage1

    1.  **Mount the Volume manually.** Mount the Block Storage Volume to the directory you just created. After this is completed, you can access your files from that directory.

            mount FILE_SYSTEM_PATH /mnt/BlockStorage1

    1.  **Mount the Volume automatically.** If you want to mount the new Volume automatically every time your Compute Instance boots, add the following line to your **/etc/fstab** file:

            FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults 0 2

        {{< note >}}
If you plan on detaching the volume regularly or moving it between other Compute Instances, you may want to consider adding the flags `noatime` and `nofail` to the **/etc/fstab** entry.

* `noatime` - This will save space and time by preventing writes made to the file system for data being read on the volume.
*  `nofail`  - If the volume is not attached, this will allow your server to boot/reboot normally without hanging at dependency failures if the volume is not attached.

Example:

    FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults,noatime,nofail 0 2
{{</ note >}}