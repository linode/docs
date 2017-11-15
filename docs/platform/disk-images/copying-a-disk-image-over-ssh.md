---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to copying a disk over SSH
keywords: ["copy", "disk", "ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['migration/ssh-copy/','migrate-to-linode/disk-images/copying-a-disk-image-over-ssh/']
modified: 2017-04-13
modified_by:
  name: Linode
published: 2012-06-04
title: Copying a Disk Over SSH
---

You can use SSH to copy a Linode's disk to a system that resides on a different network. This is an effective way to back up your Linode's disks to a personal computer or another server. In this guide, you'll learn how to use SSH to copy a Linode's disk to a local system.

![Our guide to copying a disk over SSH](/docs/assets/copying_a_disk_over_ssh_smg.png "Our guide to copying a disk over SSH")

## Preparing the Receiving Computer

Verify that the receiving computer has SSH installed. (Most Linux/Unix-like systems have it installed by default.) If you're running Windows locally, you may wish to set up the [Cygwin](http://www.cygwin.com/) compatibility layer to provide a reasonably complete Unix-like environment.

## Starting Your Linode in Rescue Mode

Before you initiate the transfer, start your Linode in *Rescue Mode* and start SSH by following these guides:

1.  [Start your Linode in Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode).
2.  [Connecting to a Linode Running in Rescue Mode via LISH](/docs/troubleshooting/rescue-and-rebuild/#connecting-to-a-linode-running-in-rescue-mode).
3.  [Start the SSH server on your Linode](/docs/troubleshooting/rescue-and-rebuild/#starting-ssh).

## Copying the Disk

Now that the Linode is running in Rescue Mode, you can transfer the disk from the Linode to the receiving machine over SSH:

1.  Enter the following command on the receiving machine. Replace `123.45.67.89` with the Linode's IP address and `/home/archive/linode.img` with the path where you want to store the disk:

        ssh root@123.45.67.89 "dd if=/dev/sda " | dd of=/home/archive/linode.img

    {{< note >}}
The device `/dev/sda` is used for Linodes running on top of KVM. If you Linode is still using XEN, then throughout this guide you must use `/dev/xvda` instead.
{{< /note >}}

2.  The receiving machine will connect to the Linode. Type `yes` and press Enter to continue connecting:

        The authenticity of host '123.45.67.89 (123.45.67.89)' can't be established.
        RSA key fingerprint is 39:6b:eb:05:f1:28:95:f0:da:63:17:9e:6b:6b:11:4a.
        Are you sure you want to continue connecting (yes/no)? yes

3.  Enter the root password for the Linode:

        Warning: Permanently added '123.45.67.89' (RSA) to the list of known hosts.
        root@123.45.67.89's password:

    The transfer starts, and you'll see output similar to the following:

        4096000+0 records in
        4096000+0 records out
        2097152000 bytes (2.1 GB) copied, 371.632 seconds, 5.6 MB/s
        4096000+0 records in
        4096000+0 records out
        2097152000 bytes (2.1 GB) copied, 364.002 s, 5.8 MB/s

    {{< note >}}
Copying your disk can take a while. Please be patient. If you receive a `Write failed: Broken pipe` error, repeat this step.
{{< /note >}}

## Verifying the Disk

Once the copy has completed, you can verify it by mounting the image on the receiving machine.

1.  Log in to the receiving machine as `root` by entering the following command and entering the `root` user's password:

        su

2.  Make a directory on the receiving machine by entering the following command:

        mkdir linode

3.  Mount the disk by entering the following command, replacing `linode.img` with the name of the disk:

        mount -o loop linode.img linode

4.  View the directories stored on the disk by entering the following command:

        ls linode/

    You should see the directories on the disks, similar to the ones shown below, indicating that everything has transferred:

        bin   dev  home  lost+found  mnt  proc  sbin     srv  tmp  var
        boot  etc  lib   media       opt  root  selinux  sys  usr

You have successfully transferred your Linode's disk to another host using SSH.

## Uploading the Disk

Once you have a copy of your Linode's disk you may want to upload that copy from your receiving machine to a *receiving Linode* in the future.

1.  Prepare your empty Linode by creating a new disk. Access your Linode through the Linode Manager and select **Create a new disk**:

    [![Create a new disk](/docs/assets/copydisk-create-disk.png)](/docs/assets/copydisk-create-disk-full.png)

2.  Enter a descriptive name in the **Label** field, and be sure the **Size** is large enough to hold the contents of the disk you are uploading. Click **Save Changes**.

3. [Boot the Linode in Rescue Mode and start SSH](#starting-your-linode-in-rescue-mode)

4. From your **receiving machine** issue the following command, replacing `/home/archive/linode.img/` with your disk image's path, and `123.45.67.89` with your Linode's IP.

        dd if=/home/archive/linode.img | ssh root@123.45.67.89 "dd of=/dev/sda"

    When the transfer is done, you will see an output similar to this:

        49807360+0 records in
        49807360+0 records out
        25501368320 bytes transferred in 9468.878375 secs (2693177 bytes/sec)
        49807360+0 records in
        49807360+0 records out
        25501368320 bytes (26 GB) copied, 9462.12 s, 2.7 MB/s

    {{< note >}}
Copying your disk can take a while. Please be patient. If you receive a `Write failed: Broken pipe` error, repeat this step.
{{< /note >}}

### Verifying the Disk

As above, you will want to verify the disk by mounting it on the receiving Linode. Log in to your Linode through SSH.

1.  Make a new directory for the disk:

        mkdir linode

2.  Mount the disk:

        mount /dev/sda linode

3.  View the directories in the disk:

        ls linode/

    The output should be similar to below:

        bin   dev  home  lib64       media  opt   root  sbin     srv  tmp  var
        boot  etc  lib   lost+found  mnt    proc  run   selinux  sys  usr

### Expanding the Filesystem

If the disk you created on the receiving Linode is larger than the source disk (for example you're transferring a disk from a smaller linode to a larger linode), you'll have to resize the filesystem in order to make use of the new space.

You can check if this is necessary by comparing the space reported by the filesystem:

    # df -h
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/sda         24G   19G  4.0G  83% /

To the space reported by the disk:

    # lsblk
    NAME  MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
    sda     8:0    0   30G  0 disk /

In the above example, the values in the **Size** column don't match. Although the disk is 30GB (the Linode Manager will also show the disk as 30GB), the filesystem can only see 24G. To use all available space on the new disk, execute the following from Rescue Mode:

    e2fsck -f /dev/sda
    resize2fs /dev/sda

### Create the Swap Disk

If your Linode still has enough space for a swap disk, simply [create](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-blank-disk) one from your Linode's Dashboard by selecting `swap` from the **Type** drop down menu. A swap disk is typically between 256MB and 512MB in size, but can be made larger or smaller depending upon your needs. If all of the free space on your Linode is assigned to the disk you created previously, [resize](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk) the disk to make enough room for the swap disk, and then follow the steps to [create](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-blank-disk) it.

### Booting from the Disk

You will now need to create a new configuration profile on the receiving Linode to boot from.

1.  From within your Linode Manager, select your Linode and select **Create a New Configuration Profile**.

    [![Selecting the configuration profile](/docs/assets/1065-migration6-small.png)](/docs/assets/1064-migration6.png)

2.  Enter the name for the configuration profile in the **Label** field, and in the **Block Device Assignment** section set the `/dev/sda` to the new disk you created earlier in this section of the guide. Set `/dev/sdb` to the swap image. Save changes.

3.  Return to the Linode's dashboard manager, and select the configuration profile that you just created. Click **Reboot** to start the Linode using the disk you just transferred.
