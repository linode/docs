---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to store data redundantly and be safe against silent errors that may corrupt it in the long term'
keywords: 'zfs, file system, volume manager, redundant, silent corruption, mirror, raid, pool'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00st, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: 'How to Use ZFS on Ubuntu 16.04'
contributor:
  name: Alexandru Andrei
  link: 
  external_resources:
- '[Ubuntu's Short Article About ZFS](https://wiki.ubuntu.com/Kernel/Reference/ZFS)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

## Introduction

1.  Because storage devices have become so reliable, few people realize they are still vulnerable to failures, bad sectors or what is called *silent data corruption*, the worst problem, because it's hidden. A controller fault, a firmware bug, a microscopic flaw in the design of magnetic or flash memory might cause the drive to write incorrect data but report a successful operation. And one day, when you open a file you stored a few years ago, you find that it's corrupt. Maybe you backed up religiously but since no errors have been reported by your filesystem, the backups contain the same corrupted file, so now there is no way you can recover.

    ZFS' "killer feature" is the protection it offers against silent data corruption. Instead of "trusting" the storage device, it checksums the data it sends to it and stores it in separate blocks from the data itself. It also organizes these hashes in *Merkle Trees*, which makes it impossible to change the hash in one node without changing the whole chain leading to that node in the tree. Without going any further into the complex design, what this means for the user is that he can be certain that when he is reading a file, ZFS will deliver exactly what has been written years ago. And if data has been corrupted, this will be reported and even automatically fixed, if the storage pool has been setup with redundancy.

    Of course, ZFS packs other features too. Here are a few of them:

*   A volume manager allows you to combine your physical storage devices into pools. This makes it possible to dynamically increase the pool size, without worrying about partitioning and expanding the filesystem.
*   Most of the operations can be done online, for example: *scrubbing* the pool, an operation that checks for errors (and corrects them if redundant information is available), adding new devices to the pool, replacing failed devices, resilvering, etc.
*   Devices can be grouped in RAID-Z arrays, similar to RAID 5, but much improved. More than three parity disks are supported.
*   You can take snapshots of your filesystems and rollback to them in case of need. Combined with another feature that allows you to send and receive these to another machine, you can create a very fast and automated incremental backup scheme (efficient because only the differences are sent).
*   Clones can be created from snapshots. If later on, the clone proves more useful than the main filesystem, you can promote the clone to take over.
*   *Adaptive Replacement Cache (ARC)* is an improved cache mechanism that is much better at keeping useful data in RAM than the *Least Recently Used (LRU)* cache used by default on Ubuntu/Debian.
*   Compression and deduplication can be turned on to save disk space. Compression also improves read and write speeds, sometimes considerably if the information is very compressible (e.g. text files). Deduplication has some costs, for example, considerable amounts of RAM are required.
*   Data is striped across different devices and if the pools are designed correctly, you can see performance increases (depending on the structure, data can be read and written in parallel)

## The Structure of ZFS Pools

1.  A ZFS pool is made up of one or more groups of *virtual devices* or *vdevs*. The vdevs themselves are made up of block devices. The block devices can be backed by partitions or whole disks/drives. Files can also be used to build vdevs but their purpose is to test things out so never use them in production systems. You'll get the most advantages by using whole disks/devices to build vdevs. A virtual device can be comprised of just one drive or a bunch of drives (we're ignoring partitions and files from now on).

    Here's an example of a pool:

        root@zfsbox:~# zpool status
          pool: testpool
         state: ONLINE
          scan: none requested
        config:
        
                NAME            STATE     READ WRITE CKSUM
                testpool        ONLINE       0     0     0
                  mirror-0      ONLINE       0     0     0
                    sdb         ONLINE       0     0     0
                    sdc         ONLINE       0     0     0
                  mirror-1      ONLINE       0     0     0
                    sdd         ONLINE       0     0     0
                    sde         ONLINE       0     0     0
        
        errors: No known data errors

    **sdb** and **sdc** are the block devices (backed by whole disks). These make up the vdev called **mirror-0**. The second vdev, **mirror-1**, is made up as well of two disks. And these two vdevs make up the pool called **testpool**.

2.  Once the pool is created, it can store *datasets*. These datasets can be: filesystems, snapshots, clones or volumes. The last are a kind of virtual block devices. For example, you could combine two physical disks into a pool and then create a volume that spans on both of the physical devices. This way you can create a very large, virtual disk, and format it with the filesystem of your choice.

### One Disk vdevs

1.  You can create a vdev out of a single disk. If you group multiple such vdevs together, you get a structure similar to RAID-0, where data is striped dynamically across all the physical devices. For example, if you group three 1TB drives, you will have 3TB of total storage space. When you write a 300MB file, ZFS will stripe aproximately 100MB across each drive.

2.  Advantages of this setup:

*   Using close to 100% of the total storage space available
*   Fastest write and read speeds
*   Easily increase pool capacity by adding more drives

3.  Disadvantages:

*   If one disk fails, your entire pool fails
*   No redundancy means there is no way to recover original data in case of read/checksum errors; ZFS will report them but there's nothing more it can do

4.  While such setups might be used by gamers to improve loading times, you should never use this structure to store important data that you cannot rebuild easily.

### Mirror vdevs

1.  Another way to create a vdev is by mirroring devices. You can mirror two or more devices and you can later add another mirror to the same virtual device, increasing redundancy, or you can create a new vdev that includes a new set of mirrored drives (this gets you something similar to RAID-10). With the last method, you can expand your pool. While you can also expand the pool with other types of vdevs, it's generally recommended you stick to the same kind of structures in each pool. So you can have a pool with a couple of mirrors and another pool made up of raidz vdevs but it's not the best idea to mix them in the same pool.

2.  Use devices of the same size. If you couple a 1TB disk with a 2TB disk, the usable space will be cut to 1TB. This is because that is the maximum information that can be mirrored in such a setup.

3.  Advantages of mirrors:

*   Fast read speeds, slightly better than what you get with raidz, slightly worse than the previous non-redundant setup
*   Fast resilvering (replacing a failed device and mirroring data back)
*   As long as you have at least one functional device in a mirror vdev, you can replace the failed drives and recover
*   Redundancy can be increased later on, if desired

4.  Disadvantages:

*   Gives you the least amount of storage space available; if you have 4 disks in a mirror vdev, the capacity that you can use to store data is the capacity of the smallest disk in that structure
*   Weakest write performance (basically the same you would get with a single disk)

### Raid-Z vdevs

1.  These vdevs can be configured with single, double or triple parity (and even more in recent versions of ZFS). The parity number coincides with how many drive failures you can withstand and still recover data. So in a setup with double parity, if two disks fail in that vdev, you can still access your information and also rebuild the array by replacing the faulty devices. This is done through a process called *resilvering* which redistributes redundant data.

2.  Parity information is spread across all physical devices in the vdev. The space you can use to store data is, roughly, total storage capacity minus parity information. As an example, if you use a structure with double parity, and the raidz2 vdev contains 9 disks of 1TB, then you can store approximately 7TB of information (9TB total - 2TB for parity)

3.  Advantages:

*   Good compromise between usable space and redundancy
*   Good read/write speeds (the more parity you add though, the more they go down)

4.  Disadvantages:

*   You cannot add disks later to a raidz vdev, the structure is fixed
*   Resilvering can be more time-consuming and intensive than in the case of mirrors

    Other types of virtual devices like cache and log can be used when dealing with mechanical hard-drives. Spare vdevs can be set up to automatically replace failed devices.

## Recommendations

1. When compression is turned on and raidz arrays are large or are set up with more than two parity devices, it can help a lot to use a Linode with multiple virtual CPUs (usually in intense write situations).

2.  If you're creating a storage server that is intensively read by other servers/services, it helps to choose a Linode with plenty of RAM so that data is cached and rapidly delivered when requested.

    The above recommendations are for best performance but ZFS will work on any Linode. There is a myth caused by misunderstanding how Adaptive Replacement Cache works (discussed at the end of this tutorial), making some people believe ZFS eats up a lot of RAM. That is true only if deduplication is enabled.

3.  Use the same size for all physical devices in a vdev. There's almost never a reason to mix them up and performance is almost always degraded or usable space is lost if you mix devices with different storage space. For example let's say you have a 1TB disk and a 4TB disk in a non-redundant striped array, and you write 5GB of data. ZFS will try to balance writes so that drives are filled up at the same rate. This means approximately 1GB will be sent to the first disk and 4GB to the second. If these have the same throughput, the second device will need more time to finish the job. If they would have been the same size, the write could have been more balanced and would have finished faster.

    In the case of mirrors or raidz, usable size will be capped to the smallest storage device in a vdev.

4.  It's better to design it right, from the start, rather than start low and then add vdevs to your pool when you need more space. An empty vdev will get more writes than one which is half full. This will lead your pool to suffer from a similar performance degradation as the one mentioned in the paragraph above.

    If you need to add more space to your setup, it's preferable to create a secondary pool rather than add virtual devices to the old one. Or, since this is the cloud, you can create a new Linode, create a larger pool and import data from your old Linode.

5.  Even with all the measures against data corruption, it's still good practice to backup off-site.

## Before You Begin

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

NOTE TO EDITORS: I know that currently block storage is in beta and only available in Fremont and Newark (for me at least) but I'm not sure what the future plans are so you'll know better about what to tell users here: where to put their Linodes now, where block storage will be available next.

1.  Familiarize yourself with the [Getting Started](/docs/getting-started) guide, deploy an Ubuntu 16.04 image and complete the steps for setting your Linode's hostname and timezone.

2.  Update your system:

        apt-get update && apt-get upgrade

    You may be asked what to do about a configuration change in GRUB's config file. Select **keep the local version currently installed**.

3.  Install a metapackage that will automatically pull in the latest Ubuntu provided kernel, geared towards virtual machines.

        apt-get install linux-image-virtual

4.  You'll activate booting with GRUB later on, which has a default timeout of 10 seconds, waiting for user input. It is unnecessary in this case so change it to 0 and rebuild GRUB configuration files:

        sed -i.bak 's/GRUB_TIMEOUT.*/GRUB_TIMEOUT=0/' /etc/default/grub; update-grub

5.  After you've decided about how you're going to structure your ZFS build, follow the steps in this guide to [create new volumes and attach them to your Linode](/docs/platform/how-to-use-block-storage-with-your-linode). Ignore the steps about creating a filesystem, mounting, editing `fstab`. ZFS will take care of that.

6.  Linode's kernels, booted by default, don't include the ZFS module you'll need so you have to switch to the kernel provided by Ubuntu. In your Linode's dashboard, click **Edit** to make changes to your Ubuntu configuration profile. Under **Boot settings**, change the **Kernel** to **GRUB 2**.

![Changing Boot Settings](/docs/assets/zfs-ubuntu-changing-boot-settings.png)

7.  Reboot your Linode.

## Install ZFS and Create a Pool

1.  Install the ZFS utilities:

        apt-get install zfsutils-linux

2.  Find out how the symbolic links to your volumes are named:

        ls /dev/disk/by-id/

    Here is an example output:

        root@localhost:~# ls /dev/disk/by-id/
        scsi-0Linode_Volume_d1  scsi-0Linode_Volume_d4
        scsi-0Linode_Volume_d2  scsi-0QEMU_QEMU_HARDDISK_drive-scsi-disk-0
        scsi-0Linode_Volume_d3  scsi-0QEMU_QEMU_HARDDISK_drive-scsi-disk-1

    These depend on how you named your volumes when you have created them. Naming them `d1`, standing for device 1, resulted in the id `scsi-0Linode_Volume_d1`. Remember to replace each instance you'll see in the following example commands with your own identifiers.

### Non-redundant pools

1.  Adding two disks in a striped, non-redundant configuration is done with:

        zpool create -f testpool /dev/disk/by-id/scsi-0Linode_Volume_d1 /dev/disk/by-id/scsi-0Linode_Volume_d2

    -f stands for "force". Under normal circumstances, you wouldn't use this switch so you get warnings about possible mistakes. But it is used here since the devices are empty and zpool refuses to use them in their current state, without the -f switch.

    `testpool` is the name of the pool. This will be automatically mounted in `/testpool`. You can choose a different mountpoint with the -m switch: `zpool create -f -m /othermountpoint testpool /dev/disk/by-id/scsi-0Linode_Volume_d1`.

3.  If you want to change this mountpoint later you can do it with:

        zfs set mountpoint=/somewhereelse testpool

4.  If you want to add more disks to the array:

        zpool add -f testpool /dev/disk/by-id/scsi-0Linode_Volume_d4

5.  Destroy your test pool so you can proceed through the next examples:

        zpool destroy testpool

### Mirror pools

1.  Create a pool by mirroring two devices:

        zpool create -f testpool mirror /dev/disk/by-id/scsi-0Linode_Volume_d1 /dev/disk/by-id/scsi-0Linode_Volume_d2

2.  Redundancy can be further increased by adding another device and creating a three-way mirror:

        zpool attach -f testpool /dev/disk/by-id/scsi-0Linode_Volume_d2 /dev/disk/by-id/scsi-0Linode_Volume_d3

3.  We can inspect the pool with:

        zpool status

    The **READ WRITE** and **CKSUM** columns show how many errors have been encountered when trying to read, write and verify checksums. If these are different than 0, it's time to replace the respective device.

4.  Destroy the pool:

        zpool destroy testpool

    And let's create another type of array:

        zpool create -f testpool mirror /dev/disk/by-id/scsi-0Linode_Volume_d1 /dev/disk/by-id/scsi-0Linode_Volume_d2 mirror /dev/disk/by-id/scsi-0Linode_Volume_d3 /dev/disk/by-id/scsi-0Linode_Volume_d4

    With `zpool status` you will see that now you have two mirrors. This combines the benefits of redundancy with the benefits of distributing writes across two vdevs, for increased performance. It's also a way to increase storage space in your pool.

    Destroy the pool so you can also experiment with raid-z.

### Raid-Z pools

1.  Create a raid-z pool with single parity:

        zpool create -f testpool raidz1 /dev/disk/by-id/scsi-0Linode_Volume_d1 /dev/disk/by-id/scsi-0Linode_Volume_d2 /dev/disk/by-id/scsi-0Linode_Volume_d3 /dev/disk/by-id/scsi-0Linode_Volume_d4

2.  Run this command:

        zpool list

    **SIZE** can be misleading if you don't understand what it means. Here, it stands for raw size (including parity data). To get the usable storage size:

        zfs list

    **AVAIL** shows the storage capacity that you can use for your files and directories.

3.  To create a double parity raid-z setup, destroy your pool and enter the following command:

        zpool create -f testpool raidz2 /dev/disk/by-id/scsi-0Linode_Volume_d1 /dev/disk/by-id/scsi-0Linode_Volume_d2 /dev/disk/by-id/scsi-0Linode_Volume_d3 /dev/disk/by-id/scsi-0Linode_Volume_d4

    Entering `zfs list` again will show you that now there's less space available since two devices are used for parity instead of one. Parity can be further increased by changing `raidz2` in the previous command with `raidz3`, `raidz4` or even more. The more parity you add though, the more performance is degraded. The same goes for raidz arrays that have too many disks. It's usually better to have two raidz2 arrays of eight disks each, rather than a single array of 16 disks.

## Datasets, snapshots and rollbacks

1.  In some cases, it can be useful to create multiple ZFS filesystems. These are mounted under `/testpool` in our example and look like ordinary directories. Create one now:

        zfs create testpool/data

    Here's an illustration where this might be useful: if you have one directory with code from a project you're working on and a directory with images, you can create two datasets and then turn compression on for the dataset containing code and compression off for the dataset with images. There are other properties you can change as well. You can see the value of the current properties with:

        zfs get all

    By keeping a logical separation of data in different filesystems you'll also be able to snapshot and rollback just the parts of interest, instead of doing it globally.

2.  Change directory to `/testpool/data` and create a few files:

        cd /testpool/data/; touch {a..z}

    Type `ls` to see them.

3.  Take a snapshot:

        zfs snapshot testpool/data@a-to-z

4.  Simulate a disaster by deleting a few files:

        rm /testpool/data/{a..l};ls /testpool/data/

5.  There's a hidden directory, `.zfs`, in each filesystem, that you can use to see the content of your snapshots:

        ls /testpool/data/.zfs/snapshot/a-to-z/

6.  Now rollback to that snapshot:

        zfs rollback testpool/data@a-to-z

7.  Now if you list the contents of your `data` filesystem, you'll see it's back to the way it was at the moment you took the snapshot:

        ls /testpool/data/

8.  When you no longer need a snapshot you can destroy it with:

        zfs destroy testpool/data@a-to-z

## Speed Up ZFS

1.  By default, compression is turned off. Turning this on will speed up writing and reading data, sometimes considerably (2x and more) when files are very compressible. It also saves storage space.

        zfs set compression=on testpool

    To turn on compression on a specific dataset:

        zfs set compression=on testpool/data

2.  The memory used by the Adaptive Replacement Cache shows up as used instead of cached in various utilities such as `free` or `htop`. This can look scary to newcomers, making it seem that the ARC is chewing up RAM, making less available for other utilities. However, the ARC does free up memory when other utilities need it. This allows you to run a ZFS filesystem even with modest RAM. But if you're going to use your Linode as a storage server, a high memory instance is better suited and dedicating more RAM to ZFS will make it much more responsive.

    By default, the ARC will use at most 75% of total memory. While this makes sense on a server with multiple purposes (e.g. also running database software), on a storage server it's a loss of approximately 20% (or more) RAM that could be put to good use. So follow these instructions only if you're not using your Linode to run other (memory hungry) applications.

The numbers in the next command represent bytes. 1GB is calculated by multiplying 2 to the power of 30 but you can use values such as 7000000000 to reserve approximately 7GB. As a rule of thumb, set zfs_arc_max to total memory available on your Linode minus 1GB.  zfs_arc_min can be set to 50% of total RAM (if more than 2GB is available, at least). Copy the lines in a text editor, change the numbers and then paste all lines at the same time:

        cat <<EOF > /etc/modprobe.d/zfs.conf
        options zfs zfs_arc_min=3221225472
        options zfs zfs_arc_max=6442450944
        EOF

    Observation: some documentations say that on systems with over 4GB of RAM, ARC will use more than 75% of total memory but this didn't prove to be true on a test system with 8GB of RAM.

    Don't forget to occasionally run `zpool status` and keep an eye on things. You can also `zpool scrub` if you want to but there's already a cron script that does that monthly, in `/etc/cron.d/zfsutils-linux`.
