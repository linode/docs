---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to copying a disk to a different Linode account
keywords: ["disk", "migration", "moving to different accounts"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['migration/copy-disk-image-different-account/','linode-platform/manager/managing-disk-images/','migrate-to-linode/disk-images/copying-a-disk-image-to-a-different-account/']
modified: 2014-06-12
modified_by:
  name: Alex Fornuto
published: 2012-06-01
title: Copying a Disk to a Different Account
---

You can copy a Linode's disk from one Linode account to another. This is a great way to prepare a disk for another Linode customer and transfer it from your account to the other user's account. Or if you have multiple Linode accounts, you can use this guide to consolidate all of your disks in one account.

![Our guide to copying a disk to a different Linode account](/docs/assets/copying_a_disk_to_a_differnet_account_smg.png "Our guide to copying a disk to a different Linode account")

## Preparing the Source Linode

Before initiating the transfer, you'll need to prepare the *source* Linode that contains the disk you want to copy. Start the Linode in rescue mode to transfer files to the other account. Here's how:

1.  Boot your Linode into Rescue Mode. For instructions, see [Booting into Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode).
2.  After the Linode has booted, connect to it via LISH. For instructions, see [Connecting to a Linode Running in rescue mode](/docs/troubleshooting/rescue-and-rebuild/#connecting-to-a-linode-running-in-rescue-mode).

Your Linode is now ready to transfer files to the other account.

## Preparing the Receiving Linode

You'll also need to prepare the *receiving* Linode before initiating the transfer. First, create a new disk to hold the files from the other Linode. Then start the Linode in rescue mode to receive the files from the other account.

### Creating a New Disk

To hold the files that will be transferred from the other Linode, you should create a new disk. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com) with the account that will be receiving the disk.
2.  Click the **Linodes** tab.
3.  Select the Linode that will be receiving the disk. The Linode's dashboard appears.
4.  Create a disk to hold the files from the other account's disk. Select **Create a new disk**. The webpage shown below appears.

[![Creating a configuration profile](/docs/assets/1746-migration3-1_small.png)](/docs/assets/1747-migration3-1.png)

5.  Enter a descriptive name for the disk in the **Label** field.
6.  Enter a size for the disk in the **Size** field. You should make the disk large enough to hold the contents of the other disk.
7.  Click **Save Changes** to create the disk. You can monitor the disk creation process by watching the *Host Job Queue*.

You have successfully created a disk to hold the files from the other account's disk.

### Booting into Rescue Mode

Start the receiving Linode in rescue mode. Here's how:

1.  Boot your Linode into Rescue Mode. For instructions, see [Booting into Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode).
2.  After the Linode has booted, connect to it via LISH. For instructions, see [Connecting to a Linode in Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#connecting-to-a-linode-running-in-rescue-mode).
3.  Start SSH. For instructions, see [Start SSH](/docs/troubleshooting/rescue-and-rebuild/#starting-ssh).

Your Linode is now ready to receive the files from the other Linode account.

## Copying the Disk

Now it's time to start copying the files on the disk from one account to another. Here's how to initiate the file transfer:

1.  On the source Linode, enter the following command to start copying the disk, replacing `12.34.56.78` with your Linode's IP address.:

        dd if=/dev/sda | ssh -C 12.34.56.78 "dd of=/dev/sda"

2.  The following output appears. Enter `yes` to continue connecting:

        The authenticity of host '12.34.56.78 (12.34.56.78)' can't be established.
        RSA key fingerprint is 20:f4:de:4d:5c:6e:a9:c7:e6:1f:8a:ad:60:62:96:3f.
        Are you sure you want to continue connecting (yes/no)?

3.  You will be prompted for the `root` password. Enter the password you created in the last section when you started the SSH server:

        root@12.34.56.78's password:

4.  The file transfer will start, as shown below:

        2048000+0 records in
        2048000+0 records out
        1048576000 bytes (1.0 GB) copied, 391.504 seconds, 2.7 MB/s
        2048000+0 records in
        2048000+0 records out
        1048576000 bytes (1.0 GB) copied, 387.843 seconds, 2.7 MB/s

Wait for the transfer to complete. Note that this process can take a while, depending on the size of your disk.

## Verifying the Disk

After the file transfer has completed, you should verify the disk by mounting it on the receiving Linode. Here's how:

1.  Make a new directory for the disk by entering the following command:

        mkdir linode

2.  Mount the disk by entering the following command:

        mount /dev/sda linode

3.  View the directories in the disk by entering the following command:

        ls linode/

4.  The output should appear similar to what's shown below:

        bin   dev  home  lost+found  mnt  proc  sbin     srv  tmp  var
        boot  etc  lib   media       opt  root  selinux  sys  usr

Now that you've ready to boot from the disk.

## Booting from the Disk

Now it's time to boot from the disk. First, you'll create a configuration profile on the receiving Linode, and then you'll boot the receiving Linode with the disk you just transferred.

### Creating the Configuration Profile

The boot the receiving Linode from the transferred disk, you'll need to create a new configuration profile. Here's how:

1.  Click the **Linodes** tab.
2.  Select the Linode that received the disk. The Linode's dashboard appears.
3.  Select **Create a new Configuration Profile**. The webpage shown below appears.

[![Selecting the configuration profile](/docs/assets/1065-migration6-small.png)](/docs/assets/1064-migration6.png)

4.  Enter a name for the configuration profile in the **Label** field, such as *Received disk*.
5.  In the *Block Device Assignment* section, set `/dev/sda` to **Received disk**.
6.  Set `/dev/sdb` to a swap disk.
7.  Click **Save Changes**.

You have successfully created the configuration profile.

### Booting the Receiving Linode

Now to start the receiving Linode from the transferred disk, you'll need to select the configuration profile you just created. Here's how:

1.  From the Linode's dashboard, select the **Received disk** configuration profile you created in the last section, as shown below.

[![Selecting the configuration profile](/docs/assets/1060-migration4-small.png)](/docs/assets/1061-migration4.png)

2.  Click **Reboot** to restart the Linode from the transferred disk.

Your Linode will boot using the disk you transferred.
