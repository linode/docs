---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to copying a disk over SSH
keywords: 'copy,disk,ssh'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['migration/ssh-copy/']
modified: Tuesday, June 5th, 2012
modified_by:
  name: Linode
published: 'Monday, June 4th, 2012'
title: Copying a Disk Over SSH
---

You can use SSH to copy a Linode's disk to a system that resides on a different network. This is an effective way to back up your Linode's disks to a personal computer or another server. In this guide, you'll learn how to use SSH to copy a Linode's disk to a local system.

Preparing the Receiving Computer
--------------------------------

Verify that the receiving computer has SSH installed. (Most Linux/Unix-like systems have it installed by default.) If you're running Windows locally, you may wish to set up the [Cygwin](http://www.cygwin.com/) compatibility layer to provide a reasonably complete Unix-like environment.

Starting Your Linode in Rescue Mode
-----------------------------------

Before you initiate the transfer, start your Linode in Rescue Mode and start SSH. Here's how:

1.  Start your Linode in Rescue Mode. For instructions, see [Booting into Rescue Mode](/docs/rescue-and-rebuild#sph_booting-into-rescue-mode).
2.  After the Linode has booted, connect to it via LISH. For instructions, see [Connecting to a Linode Running in Rescue Mode](/docs/rescue-and-rebuild#sph_connecting-to-a-linode-running-in-rescue-mode).
3.  Start the SSH server on your Linode. For instructions, see [Starting SSH](/docs/rescue-and-rebuild#sph_starting-ssh).

Copying the Disk
----------------------

Now that the Linode is running in Rescue Mode, you can transfer the disk from the Linode to the receiving machine. Here's how to copy a disk over SSH:

1.  Enter the following command on the receiving machine. Replace `123.45.67.89` with the Linode's IP address and `/home/archive/linode.img` with the path where you want to store the disk:

        ssh root@123.45.67.89 "dd if=/dev/xvda " | dd of=/home/archive/linode.img

2.  The receiving machine will connect to the Linode. Type `yes` and press Enter to continue connecting:

        The authenticity of host '123.45.67.89 (123.45.67.89)' can't be established.
        RSA key fingerprint is 39:6b:eb:05:f1:28:95:f0:da:63:17:9e:6b:6b:11:4a.
        Are you sure you want to continue connecting (yes/no)? yes

3.  Enter the root password for the Linode, as shown below :

        Warning: Permanently added '123.45.67.89' (RSA) to the list of known hosts.
        root@123.45.67.89's password:

4.  The transfer starts. You'll see output similar to the following.

        4096000+0 records in
        4096000+0 records out
        2097152000 bytes (2.1 GB) copied, 371.632 seconds, 5.6 MB/s
        4096000+0 records in
        4096000+0 records out
        2097152000 bytes (2.1 GB) copied, 364.002 s, 5.8 MB/s

Note that copying your disk can take a while. Be patient!

Verifying the Disk
------------------------

Once the copy has completed, you can verify it by mounting the image on the receiving machine. Here's how:

1.  Log in to the receiving machine as `root` by entering the following command and entering the `root` user's password:

        su

2.  Make a directory on the receiving machine by entering the following command:

        mkdir linode

3.  Mount the disk by entering the following command, replacing `linode.img` with the name of the disk:

        mount -o loop linode.img linode

4.  View the directories stored on the disk by entering the following command:

        ls linode/

5.  You should see the directories on the disks, similar to the ones shown below:

        bin   dev  home  lost+found  mnt  proc  sbin     srv  tmp  var
        boot  etc  lib   media       opt  root  selinux  sys  usr

You have successfully transferred your Linode's disk to another host using SSH.



