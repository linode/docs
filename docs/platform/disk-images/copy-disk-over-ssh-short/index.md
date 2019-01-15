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
headless: true
---

## Boot into Rescue Mode

1.  Prepare the receiving computer by verifying that SSH is installed. Most Linux/Unix-like systems include OpenSSH in their package base by default. If the receiving system is Microsoft Windows, there are multiple SSH solutions available such as [Cygwin and PuTTY](/docs/networking/ssh/using-ssh-on-windows).

1.  Reboot Your Linode into [rescue mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode) and connect to it using [Lish](/docs/platform/manager/remote-access/#console-access).

1.  Set a root password for the rescue system and start the SSH server:

        passwd
        service ssh start

## Copy and Download the Disk

1.  Copy the disk over SSH from the Linode to the receiving machine. Replace `192.0.2.9` with the Linode's IP address and `/home/archive/linode.img` with the path where you want to store the disk.

        ssh root@192.0.2.9 "dd if=/dev/sda " | dd of=/home/archive/linode.img

    {{< note >}}
The device `/dev/sda` is used for Linodes running on KVM. If your Linode is still using XEN, then use `/dev/xvda` throughout this guide instead.
{{< /note >}}

1.  The receiving machine will connect to the Linode. Verify the SSH key fingerprints. If valid, type `yes` and press **Enter** to continue:

        The authenticity of host '192.0.2.9 (192.0.2.9)' can't be established.
        RSA key fingerprint is 39:6b:eb:05:f1:28:95:f0:da:63:17:9e:6b:6b:11:4a.
        Are you sure you want to continue connecting (yes/no)? yes

1.  Enter the root password you created above for the rescue system:

        Warning: Permanently added '192.0.2.9' (RSA) to the list of known hosts.
        root@192.0.2.9's password:

    When the transfer completes, you'll see a summary output similar to below:

    {{< output >}}
        4096000+0 records in
        4096000+0 records out
        2097152000 bytes (2.1 GB) copied, 371.632 seconds, 5.6 MB/s
    {{</ output >}}

    Copying your disk can take a while. If you have a slow internet connection, add the `-C` option to the SSH command to enable gzip compression of the disk image. If you receive a `Write failed: Broken pipe` error, repeat this process.

## Verify the Disk

Once the copy has completed, verify it by mounting the image on the receiving machine.

1.  Switch users to `root` on receiving machine:

        su

1.  Make a directory to mount the disk as:

        mkdir linode

1.  Mount the disk. Replace `linode.img` with the name of the of your Linode's disk.

        mount -o loop linode.img linode

1.  List the directories on the disk to indicate if everything has transferred. Your output of `ls` is similar to below:

        ls linode

    {{< output >}}
        bin   dev  home  lost+found  mnt  proc  sbin     srv  tmp  var
        boot  etc  lib   media       opt  root  selinux  sys  usr
{{< /output >}}