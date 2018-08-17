---
author:
  name: Linode
  email: docs@linode.com
description: "Shortguide for copying a disk over SSH."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
modified: 2018-08-10
modified_by:
  name: Linode
title: "Copy Disk Over SSH Shortguide"
published: 2018-08-10
shortguide: true
---

## Download a Disk over SSH

Downloading your disk will copy a `.img` file to your computer that encapulates all of the data that is on your Linode's disk.

### Prepare the Receiving Computer

Verify that the receiving computer has SSH installed. (Most Linux/Unix-like systems have it installed by default.) If you're running Windows locally, you may wish to set up the [Cygwin](http://www.cygwin.com/) compatibility layer to provide a reasonably complete Unix-like environment. Instructions on setting up Cygwin are located [here](/docs/platform/disk-images/copying-a-disk-image-over-ssh/#windows-cygwin-instructions).

### Start Your Linode in Rescue Mode

Before you initiate the transfer, start the source Linode in *Rescue Mode* and start SSH by following these guides:

1.  [Start your Linode in Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode).
1.  [Connecting to a Linode Running in Rescue Mode via LISH](/docs/troubleshooting/rescue-and-rebuild/#connecting-to-a-linode-running-in-rescue-mode).
1.  [Start the SSH server on your Linode](/docs/troubleshooting/rescue-and-rebuild/#starting-ssh).

### Copy the Disk

Now that the Linode is running in Rescue Mode, you can transfer the disk from the Linode to the receiving machine over SSH:

1.  Enter the following command on the receiving machine. Replace `123.45.67.89` with the Linode's IP address and `/home/archive/linode.img` with the path where you want to store the disk:

        ssh root@123.45.67.89 "dd if=/dev/sda " | dd of=/home/archive/linode.img

    {{< note >}}
The device `/dev/sda` is used for Linodes running on top of KVM. If your Linode is still using XEN, then throughout this guide you must use `/dev/xvda` instead.
{{< /note >}}

1.  The receiving machine will connect to the Linode. Type `yes` and press **Enter** to continue connecting:

        The authenticity of host '123.45.67.89 (123.45.67.89)' can't be established.
        RSA key fingerprint is 39:6b:eb:05:f1:28:95:f0:da:63:17:9e:6b:6b:11:4a.
        Are you sure you want to continue connecting (yes/no)? yes

1.  Enter the root password for the Linode:

        Warning: Permanently added '123.45.67.89' (RSA) to the list of known hosts.
        root@123.45.67.89's password:

    The transfer starts, and you'll see output similar to the following:

    {{< output >}}
        4096000+0 records in
        4096000+0 records out
        2097152000 bytes (2.1 GB) copied, 371.632 seconds, 5.6 MB/s
        4096000+0 records in
        4096000+0 records out
        2097152000 bytes (2.1 GB) copied, 364.002 s, 5.8 MB/s
    {{</ output >}}

    {{< note >}}
Copying your disk can take a while. Please be patient. If you have a slow internet connection, add the `-C` option to the SSH command; this enables gzip compression for data transfer. If you receive a `Write failed: Broken pipe` error, repeat this process.
{{< /note >}}

### Verify the Disk

Once the copy has completed, you can verify it by mounting the image on the receiving machine.

1.  Log in to the receiving machine as `root` by entering the following command and entering the `root` user's password:

        su

1.  Make a directory on the receiving machine by entering the following command:

        mkdir linode

1.  Mount the disk by entering the following command, replacing `linode.img` with the name of the disk:

        mount -o loop linode.img linode

1.  View the directories stored on the disk by entering the following command:

        ls linode/

    You should see the directories on the disks, similar to the ones shown below, indicating that everything has transferred:

        bin   dev  home  lost+found  mnt  proc  sbin     srv  tmp  var
        boot  etc  lib   media       opt  root  selinux  sys  usr
