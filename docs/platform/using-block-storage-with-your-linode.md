---
author:
  name: Linode
  email: docs@linode.com
description: Using block storage devices with your Linode
keywords: 'block storage, volume, media'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Tuesday, May 23rd, 2017
modified_by:
  name: Linode
published: 'Tuesday, May 23rd, 2017'
title: How to Use Block Storage with Your Linode
---

Linode's block storage service allows you to attach additional storage volumes to your linode ranging from 1 to 1024 gigabytes in size. They can be partitioned however you like and can accommodate any filesystem type you choose. Up to four volumes can be attached to a single linode, be it new or currently-existing, so you do not need to recreate your server to add a block storage volume.

Block storage pricing is *****

![Block storage title graphic](/docs/assets/block-storage-title-graphic.png)

{: .note}
> The Linode backup service does not cover block storage volumes. You should back up this data to your own local storage.


## How to Attach a Block Storage Volume to Your Linode

This guide will use a linode with the root disk mounted as */dev/sda*, and swap space mounted as */dev/sdb*. In this scenario, the block storage volume will be available to the operating system as */dev/sdc*.

1.  Go to your account in the Linode Manager and select **Manage Volumes**.

    [![Linode Manager manage volumes](/docs/assets/bs-manager-manage-volumes-small.png)](/docs/assets/bs-manager-manage-volumes.png)

2.  Assign the block storage volume a size and label. The label can be up to 32 characters long and consist only of ASCII characters 'a-z0-9.-_'. The maximum volume size is 1024 GB (1 terabyte). When finished, click *Add this Volume!*

    [![Linode Manager add volume](/docs/assets/bs-add-a-volume-small.png)](/docs/assets/bs-add-a-volume.png)

3.  You'll then be taken to a volume list which will show all the block storage volumes on your account. The volume you just added will show as *detached*.

    [![Linode Manager add volume](/docs/assets/bs-volume-created-but-detached-small.png)](/docs/assets/bs-volume-created-but-detached.png)

   Click **Settings**. This will take you to the Block Storage Volume Settings. The *Attachment* dropdown will say *Detached*. From that dropdown, select the label of the linode you want to attach this volume to. Then click **Save Changes**. This will return you to the volume list from the previous step.

    [![Linode Manager add volume](/docs/assets/bs-volume-created-but-detached-small.png)](/docs/assets/bs-volume-created-but-detached.png)

4.  Under the *Status* heading, you'll see the volume is listed as *attaching*. To complete the attachment, the linode must be booted (or rebooted if already running). Click the linode's label under *Attached To* to be taken to its dashboard. Then boot or reboot as normal.

    [![Linode Manager add volume](/docs/assets/bs-volume-attaching-small.png)](/docs/assets/bs-volume-attaching.png)


## Partitioning Your Linode's Block Storage Volume

With your new block storage volume created and attached to your booted linode, you now have a raw disk device which needs to be partitioned as you choose and filesystems created.

1.  Log into your linode via SSH or Lish.

2.  Identify the device name of the block storage volume. In the case of this example walkthrough, it's */dev/sdc*. It may be different for you depending on the amount of disks you've configured your linode with.

        lsblk

    The output is shown below in the screenshot. The 100 GB storage volume created above is */dev/sdc* and it doesn't have a mount point yet.

    ![lsblk for block storage volumes](/docs/assets/bs-lsblk-output.png)

3.  Partition on the storage volume. This can be done in several ways but here we'll use fdisk.

        fdisk /dev/sdc

    ![partition block storage volume](/docs/assets/bs-fdisk-volume.png)

    Fdisk is now waiting for your input. Press *n* to create a new disk partition. This will start a prompt sequence. Some of the queries it asks for are self-explanatory, some not.

    **Partition type: primary or extended**

    A primary partition can not be extended or decreased in size like an extended partition which uses LVM but requires slightly more processing overhead. You can have up to 4 primary partitions but as many extended partitions as you like. If you're sure you won't need to add or resize partitions in the future, choose a primary partition. This is also the default.

        p

    **Partition number: 1-4**

    Choose the amount of partitions you want. If you chose to create a primary partition type in the previous prompt, you can have up to four primary partitions.

        1

    **First sector**

    Enter the disk sector you want the partition to begin on. The default is sector 2048, with 2 MB of free space ***

        <press Enter to use the default>

    **Last sector**

    Enter the disk sector you want the partition to end on. The default choice is to use the entire disk space, so up to the last sector of the disk.

        <press Enter to use the full disk size>

     Fdisk also accepts sizes you wish the partition to be. For example, to create a 5 GB partition beginning at the first sector of the disk, you would enter:

         +5G

    After you've created the partition(s), you still need to write the changes to the disk. To do that, press

        w

    That will complete the process and return you to the command line.


4.  Create a filesystem in the volume's disk partition. For example, we'll use ext4 but see *man mkfs* for other filesystem types and options.

        mkfs.ext4 /dev/sdc1

5.  You'll need to determine where you want to mount the storage volume and there are as many options for this as there are use cases. You can create a new mount point at any location, use an existing location or even use the block storage volume as a system user's /home directory. Here we'll mount it at /bsvolume, but since that directory doesn't exist, we'll first create it.

        mkdir /bsvolume

  Then add the volume to fstab so it's mounted on bootup.

    {: .file-excerpt}
    /etc/fstab
    :   ~~~ conf
        /dev/sdc1 /bsvolume ext4  defaults 0 0
        ~~~

6.  Confirm that the volume auto-mounts correctly by rebooting your Linode. When it comes back up, log back in and you should be able to change directory to the volume's location and begin working in it. So for example, our block storage volume was mounted at `/bsvolume` above. We would then:

        cd /bsvolume
        touch testfile
        ls

    The list command should then show the file in the volume:

        root@localhost:/bsvolume# ls
        lost+found  testfile


## How to Unattach a Block Storage Volume from a Linode

1.  Go back to your linode account in the Manager and click **Manage Volumes**.

    [![Linode Manager manage volumes](/docs/assets/bs-manager-manage-volumes-small.png)](/docs/assets/bs-manager-manage-volumes.png)

2.  In the volume list, the status of the volume you want to detach should show as *attached*. Click on the volume's label to go to the *Block Storage Volume Settings* screen.

    [![Linode Manager add volume](/docs/assets/bs-volume-attached-small.png)](/docs/assets/bs-volume-attached.png)

3.  The *Attachment* dropdown will show the label of the linode that the volume is attached to. From that dropdown, select *Detached* at the top of the menu. Then click **Save Changes**. This will return you to the volume list from the previous step.

4.  Under the *Status* heading, you'll see the volume is listed as *detaching*. Click the linode's label under *Attached To* to be taken to its dashboard.

    [![Linode Manager add volume](/docs/assets/bs-volume-detaching-small.png)](/docs/assets/bs-volume-detaching.png)

5.  Reboot the linode to complete the detachment process.

    [![Linode Manager add volume](/docs/assets/bs-volume-detached-small.png)](/docs/assets/bs-volume-detached.png)


## Where to go From Here?

Need ideas for what to do with space? We have several guides which walk you through installing software that would make a great pairing with large storage volumes:

  [Install Seafile with nginx on Ubuntu 16.04](/docs/applications/cloud-storage/install-seafile-with-nginx-on-ubuntu-1604)

  [Install Plex Media Server on Ubuntu 16.04](/docs/applications/media-servers/install-plex-media-server-on-ubuntu-16-04)

  [Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm](/docs/applications/big-data/big-data-in-the-linode-cloud-streaming-data-processing-with-apache-storm)

  [Using Subsonic to Stream Media From Your Linode](/docs/applications/media-servers/subsonic)
  
  [Install GitLab on Ubuntu 14.04](/docs/development/version-control/install-gitlab-on-ubuntu-14-04-trusty-tahr)