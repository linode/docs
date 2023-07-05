---
description: "Create a disk image using dd and download it to another machine over SSH."
keywords: ["copy", "disk", "ssh", "dd"]
tags: ["linode platform","ssh"]
modified: 2020-12-04
modified_by:
  name: Linode
published: 2012-06-04
title: "Copy a Disk Over SSH"
image: copying_a_disk_over_ssh_smg.png
aliases: ['/migration/ssh-copy/','/migrate-to-linode/disk-images/copying-a-disk-image-over-ssh/','/platform/disk-images/copying-a-disk-image-over-ssh/','/guides/copying-a-disk-image-over-ssh/']
authors: ["Linode"]
---

Piping SSH commands to utilities such as `dd`, `gzip`, or `rsync` is an easy way to copy a Compute Instance's data into a single file for later extraction. This can effectively back up your Compute Instance's disk or migrate your installed system to other instances.

This guide demonstrates how to download a `.img` file to your computer over SSH containing a block-level copy of your Compute Instance's disk device created with `dd`.

{{< note >}}
If the amount of data on your disk is much less than the size of the disk, then downloading a copy with `dd` can take longer than just downloading your files. If you're interested in downloading individual files or directories, review the options listed in our [Download Files from Your Compute Instance](/docs/guides/download-files-from-your-linode/) and [Backing Up Your Data](/docs/guides/backing-up-your-data/) guides.
{{< /note >}}

## Download a Disk over SSH

This guide shows you how to download a Compute Instance's disk image over SSH to a separate receiving system, like a personal computer or another Compute Instance. This is done by executing commands on both the **origin** system (the Compute Instance where your disk is stored) and the **destination** system which will receive a copy of this image.

While this guide has been written to accommodate computers running Linux as their operating system, if the receiving system is instead running Microsoft Windows, there are multiple SSH solutions available such as [Cygwin and PuTTY](/docs/guides/connect-to-server-over-ssh-on-windows/) which can alternatively be used to complete this process.

### Boot into Rescue Mode

1.  Boot the *origin* Compute Instance into [Rescue Mode](/docs/products/compute/compute-instances/guides/rescue-and-rebuild/#boot-linode-into-rescue-mode) and connect to it using [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Set a root password for the rescue system and start the SSH server:

    ```command
    passwd
    service ssh start
    ```

### Copy and Download the Disk

1.  Prepare the *destination* system to download the disk image by verifying that SSH is installed. Most Linux/Unix-like systems include OpenSSH in their package base by default.

1.  Copy the disk over SSH from the origin system to the destination system. Run the following command on the destination system, replacing `192.0.2.9` with the origin Compute Instance's IP address and `/home/archive/linode.img` with the path where you want to store the disk.

    ```command
    ssh root@192.0.2.9 "dd if=/dev/sda " | dd of=/home/archive/linode.img status=progress
    ```

1.  The destination system is now connected to the Compute Instance, prompting you to verify that the SSH key fingerprints are valid. If valid, type `yes` and press **Enter** to continue:

    ```output
    The authenticity of host '192.0.2.9 (192.0.2.9)' can't be established.
    RSA key fingerprint is 39:6b:eb:05:f1:28:95:f0:da:63:17:9e:6b:6b:11:4a.
    Are you sure you want to continue connecting (yes/no)?
    ```

1. The destination system is prompted to enter the root password you [created for the origin Compute Instance in rescue mode](#boot-linode-into-rescue-mode). Enter this password now:

    ```output
    Warning: Permanently added '192.0.2.9' (RSA) to the list of known hosts.
    root@192.0.2.9's password:
    ```

    When the transfer completes, you see a summary output similar to the output below:

    ```output
    4096000+0 records in
    4096000+0 records out
    2097152000 bytes (2.1 GB) copied, 371.632 seconds, 5.6 MB/s
    ```

    Copying your disk can take a while. If you have a slow internet connection, add the `-C` option to the SSH command to enable gzip compression of the disk image. If you receive a `Write failed: Broken pipe` error, repeat this process.

### Verify the Disk

Once the copy has completed, verify it by mounting the image on the receiving system with the following commands.

1.  Switch to the `root` user:

    ```command
    su
    ```

1.  Make a directory to mount the disk:

    ```command
    mkdir linode
    ```

1.  Mount the disk in the directory created in the previous step. Replace `linode.img` with the name of your Compute Instance's disk.

    ```command
    mount -o loop linode.img linode
    ```

1.  List the directories on the disk to indicate if everything has transferred. Your output of `ls` is similar to below:

    ```command
    ls linode
    ```

    ```output
    bin   dev  home  lost+found  mnt  proc  sbin     srv  tmp  var
    boot  etc  lib   media       opt  root  selinux  sys  usr
    ```

## Upload a Disk over SSH

In some cases, it is necessary to upload your disk image to a new server. For example, if you previously downloaded your Compute Instance's disk and deleted the instance to halt billing on it, you can create a new Compute Instance at a later date and upload the disk to resume your services. This section of the guide assumes that you are creating a new Compute Instance with the default primary and swap disk as outlined in the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide.

1.  Once you've created a Compute Instance with enough disk space available to accommodate your disk image, prepare the new instance to receive this image. This is completed by first deleting the primary disk created by default, and keeping the swap disk. A swap disk typically starts at 256 MB or 512 MB in size, but can be larger or smaller depending upon your needs.

1.  Access your Compute Instance through the Cloud Manager. Click the **Storage** tab to navigate to the *Disks* section.

1. On the following page in the **Disks** menu, select the ellipsis next to any primary disks you are replacing and select **Delete**.

1. Next, select **Add a Disk**.

1.  The **Add a Disk** panel appears. Select the **Create Empty Disk** option, enter a **Label** that you can use as a personal identifier, select the file system that matches the format of the disk that was downloaded over SSH, and enter a Size that is large enough to hold the contents of the disk you are uploading. Click **Save Changes**.

1. Reboot Your Compute Instance into [Rescue Mode](#boot-linode-into-rescue-mode) and start the secure SSH server using the following commands:

    ```command
    passwd
    service ssh start
    ```

1. Upload the disk image you have saved remotely over SSH to the new Compute Instance. Replace `192.0.2.9` with the Compute Instance's IP address and `/home/archive/linode.img` with the disk images's path.

    ```command
    dd if=/home/archive/linode.img | ssh root@192.0.2.9 "dd of=/dev/sda"
    ```

    When the transfer completes, you see a summary output similar to below:

    ```output
    49807360+0 records in
    49807360+0 records out
    25501368320 bytes (26 GB) copied, 9462.12 s, 2.7 MB/s
    ```

    Copying your disk can take a while. If you receive a `Write failed: Broken pipe` error, repeat this process.

### Expand the Filesystem

If the disk you created on the new server is larger than the source disk (for example you're transferring a disk from a smaller Compute Instance to a larger Compute Instance), you have to resize the file system to make use of the new space.

You can check if this is necessary by comparing the space of the file system to the space of the new disk:

```command
df -h
```

```output
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda         24G   19G  4.0G  83% /
```

```command
lsblk
```

```output
NAME  MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda     8:0    0   30G  0 disk /
```

In the above example, the values in the **Size** column don't match. Although the disk is 30 GB, the file system can only see 24 GB.

To use all available space on the new disk, execute the following from Rescue Mode. Replace `/dev/sdx` with your system disk's device identifier (/dev/sda, /dev/sdb, etc.).

```command
e2fsck -f /dev/sdx
resize2fs /dev/sdx
```

### Boot from the Disk

You now need to create a new configuration profile on the destination Compute Instance.

1.  Select your Compute Instance, click the **Configurations** tab, then select **Add a Configuration**.

1.  The **Add Configuration** panel appears.

    ![Selecting the configuration profile](1064-migration6.png "Selecting the configuration profile")

1.  Enter a name for the configuration profile in the **Label** field, and in the **Block Device Assignment** section set the `/dev/sda` to the new system disk you created earlier in this section of the guide. Set `/dev/sdb` to the swap image.

1.  The Compute Instance is now ready to reboot using the new system disk.