---
slug: mount-file-system-on-linux
description: "Do you need to learn how to mount a file system on Linux? Read our guide to learn Linux file system basics. ✓ Click here!"
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-15
modified_by:
  name: Linode
title: "Mount a File System on Linux"
title_meta: "How to Mount a File System on Linux"
external_resources:
- '[An introduction to Linux filesystems](https://opensource.com/life/16/10/introduction-linux-filesystems)'
- '[RHEL 8: Chapter 28. Mounting file systems](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_file_systems/assembly_mounting-file-systems_managing-file-systems)'
authors: ["Martin Heller"]
---

Mounting or unmounting a file system on Linux is usually straightforward, except when it isn’t. This article teaches you how to mount and unmount file systems, as well as list available and currently mounted file systems. It also explains how to handle the case where file systems won’t unmount because they are in use.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## File Systems Available for Linux

1.  On a Linux system, you can list the currently available file system types from the command line with:

        cat /proc/filesystems

    The result looks something like this list, which is from an Ubuntu 22.04 LTS Linode:

    {{< output >}}
nodev	sysfs
nodev	tmpfs
nodev	bdev
nodev	proc
nodev	cgroup
nodev	cgroup2
nodev	cpuset
nodev	devtmpfs
nodev	configfs
nodev	debugfs
nodev	tracefs
nodev	securityfs
nodev	sockfs
nodev	bpf
nodev	pipefs
nodev	ramfs
nodev	hugetlbfs
nodev	devpts
       ext3
       ext2
       ext4
       squashfs
       vfat
nodev	ecryptfs
       fuseblk
nodev	fuse
nodev	fusectl
nodev	mqueue
nodev	pstore
       nambtrfs
nodev	autofs
{{< /output >}}

2.  You can also list the documented file systems using `man filesystems`:

    {{< output >}}
FILESYSTEMS(5)         Linux Programmer's Manual               FILESYSTEMS(5)
NAME
filesystems - Linux filesystem types: ext, ext2, ext3, ext4, hpfs, iso9660, JFS, minix, msdos, ncpfs nfs, ntfs, proc, Reiserfs, smb, sysv, umsdos, vfat, XFS, xiafs

DESCRIPTION
When, as is customary, the proc filesystem is mounted on /proc, you can find in the file /proc/filesystems  which filesystems…
{{< /output >}}

    Later on in the man page there is a short summary of each file system. It includes notes about when each was added to, and possibly removed from, the Linux kernel. For example, the minix file system was superseded by ext. It in turn was superseded by ext2. ext3 adds journaling to ext2. ext4 is a set of upgrades to ext3 including substantial performance and reliability enhancements, plus large increases in volume, file, and directory size limits.

3.  Press **Q** to exit `man filesystems`.

## How to List Currently Mounted File Systems on Linux

1.  You can list the currently mounted file systems from a Linux command line with a simple `mount` command:

        mount

    The following is on an Ubuntu 22.04 LTS Linode, logged in as root:

    {{< output >}}
sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
udev on /dev type devtmpfs (rw,nosuid,relatime,size=441300k,nr_inodes=110325,mode=755,inode64)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,nodev,noexec,relatime,size=99448k,mode=755,inode64)
/dev/sda on / type ext4 (rw,relatime,errors=remount-ro)
securityfs on /sys/kernel/security type securityfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev,inode64)
tmpfs on /run/lock type tmpfs (rw,nosuid,nodev,noexec,relatime,size=5120k,inode64)
cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
bpf on /sys/fs/bpf type bpf (rw,nosuid,nodev,noexec,relatime,mode=700)
systemd-1 on /proc/sys/fs/binfmt_misc type autofs (rw,relatime,fd=29,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=18031)
hugetlbfs on /dev/hugepages type hugetlbfs (rw,relatime,pagesize=2M)
mqueue on /dev/mqueue type mqueue (rw,nosuid,nodev,noexec,relatime)
debugfs on /sys/kernel/debug type debugfs (rw,nosuid,nodev,noexec,relatime)
tracefs on /sys/kernel/tracing type tracefs (rw,nosuid,nodev,noexec,relatime)
fusectl on /sys/fs/fuse/connections type fusectl (rw,nosuid,nodev,noexec,relatime)
configfs on /sys/kernel/config type configfs (rw,nosuid,nodev,noexec,relatime)
none on /run/credentials/systemd-sysusers.service type ramfs (ro,nosuid,nodev,noexec,relatime,mode=700)
tmpfs on /run/user/0 type tmpfs (rw,nosuid,nodev,relatime,size=99444k,nr_inodes=24861,mode=700,inode64)
{{< /output >}}

2.  You can list the static file system information by displaying /etc/fstab:

        cat /etc/fstab

    The two static file systems for this instance are the root disk and the swap disk:

    {{< output >}}
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
/dev/sda        /               ext4    errors=remount-ro 0     1
/dev/sdb        none            swap    sw                0     0
{{< /output >}}

3.  You can also list and search for file systems using the `findmnt` command:

        findmnt

    The basic output shows the file system tree:

    {{< output >}}
TARGET                                SOURCE     FSTYPE     OPTIONS
/                                     /dev/sda   ext4       rw,relatime,errors=remount-ro
├─/sys                                sysfs      sysfs      rw,nosuid,nodev,noexec,relatime
│ ├─/sys/kernel/security              securityfs securityfs rw,nosuid,nodev,noexec,relatime
│ ├─/sys/fs/cgroup                    cgroup2    cgroup2    rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot
│ ├─/sys/fs/pstore                    pstore     pstore     rw,nosuid,nodev,noexec,relatime
│ ├─/sys/fs/bpf                       bpf        bpf        rw,nosuid,nodev,noexec,relatime,mode=700
│ ├─/sys/kernel/debug                 debugfs    debugfs    rw,nosuid,nodev,noexec,relatime
│ ├─/sys/kernel/tracing               tracefs    tracefs    rw,nosuid,nodev,noexec,relatime
│ ├─/sys/fs/fuse/connections          fusectl    fusectl    rw,nosuid,nodev,noexec,relatime
│ └─/sys/kernel/config                configfs   configfs   rw,nosuid,nodev,noexec,relatime
├─/proc                               proc       proc       rw,nosuid,nodev,noexec,relatime
│ └─/proc/sys/fs/binfmt_misc          systemd-1  autofs     rw,relatime,fd=29,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=18031
├─/dev                                udev       devtmpfs   rw,nosuid,relatime,size=441300k,nr_inodes=110325,mode=755,inode64
│ ├─/dev/pts                          devpts     devpts     rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000
│ ├─/dev/shm                          tmpfs      tmpfs      rw,nosuid,nodev,inode64
│ ├─/dev/hugepages                    hugetlbfs  hugetlbfs  rw,relatime,pagesize=2M
│ └─/dev/mqueue                       mqueue     mqueue     rw,nosuid,nodev,noexec,relatime
└─/run                                tmpfs      tmpfs      rw,nosuid,nodev,noexec,relatime,size=99448k,mode=755,inode64
  ├─/run/lock                         tmpfs      tmpfs      rw,nosuid,nodev,noexec,relatime,size=5120k,inode64
  ├─/run/credentials/systemd-sysusers.service
  │                                   none       ramfs      ro,nosuid,nodev,noexec,relatime,mode=700
  └─/run/user/0                       tmpfs      tmpfs      rw,nosuid,nodev,relatime,size=99444k,nr_inodes=24861,mode=700,inode64
{{< /output >}}

4.  You can restrict the output various ways, as described in `man findmnt`, to show only specific devices, mount points, or file system types, such as:

        findmnt -t ext4

    This lists only ext4 file systems:

    {{< output >}}
TARGET SOURCE   FSTYPE OPTIONS
/      /dev/sda ext4   rw,relatime,errors=remount-ro
{{< /output >}}

5.  If you’re only interested in block devices, you can list them with `lsblk`:

        lsblk

    Once again, this only lists our Linode's root and swap disks:

    {{< output >}}
NAME MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda    8:0    0 24.5G  0 disk /
sdb    8:16   0  512M  0 disk [SWAP]{{< /output >}}

## How to Mount File Systems on Linux

You can mount file systems for a single session using the `mount` command, and permanently by editing **/etc/fstab**. Mounting needs to be done by an administrator, either by logging in as **root** or by using the `sudo` command. There are some cases where mounting is done automatically, like when you insert a USB flash drive. Here are a few examples using the `mount` command, plus the preparatory `mkdir` command to create the mount point.

### Mount a Windows Floppy Disk

1.  This command is only necessary if the **/mnt/floppy** directory doesn’t already exist:

        mkdir /mnt/floppy

2.  Use `mount` with the `-t` flag (short for "type") to specify MSDOS as the file system:

        mount -t msdos /dev/fd0 /mnt/floppy

    The contents of the floppy disk in **/dev/fd0/** should now be accessible from **/mnt/floppy**.

### Mount a CD-ROM

1. Once again, the first command is only necessary if the /mnt/cdrom directory doesn’t already exist.

        mkdir /mnt/cdrom

2.  Although not harmful, specifying `-t iso9660` may be unnecessary, as Linux can usually identify the file system type of a CD-ROM automatically.

        mount -t iso9660 /dev/cdrom /mnt/cdrom

    The contents of the compact disc in **/dev/cdrom/** should now be accessible from **/mnt/cdrom**.

### Mount a Disk Drive Permanently

1.  Open /etc/fstab with `nano` or another text editor (as root or using sudo).

        sudo nano /etc/fstab

2.  Add a line at the bottom describing the new disk and its mount point. Follow the "**device** **location** **type** **options** **dump** **pass**" format, like so:

        /dev/sdc /mnt/disk-drive ext4 defaults 0 0

3.  Press **CTRL + X**, then **Y** and **Enter** to exit and save the file.

4.  Before rebooting your system, issue a `mount` command and make sure that it succeeds (meaning that it picked up the omitted parameters from /etc/fstab):

    {{< output >}}
...
/dev/sdc on /mnt/disk-drive type ext4 (rw,relatime)
...
{{< /output >}}

### Mount a USB Drive

Most modern distros automatically mount USB drives when you insert them.

1.  If that doesn’t happen, create a mount point if it doesn’t already exist:

        mkdir -p /media/usb

2.  This example assumes the USB drive is on sdd1:

        mount /dev/sdd1 /media/usb

    The contents of the USB drive in **/dev/sdd1/** should now be accessible from **/media/usb**.

{{< note respectIndent=false >}}
If the USB drive uses the exFAT file system, you may need to install the FUSE [exFAT module and tools](https://linuxize.com/post/how-to-mount-an-exfat-drive-on-ubuntu/).
{{< /note >}}

### Mount an ISO File

1.  The example below assumes that the ISO file is in the /root directory and that you are logged in as root:

        mkdir /media/iso

2.  You can mount ISO image files using the `loop` device, specified as an option to the `mount` command:

        mount ~/my_image.iso /media/iso -o loop

    The contents of the ISO file in your root directory should now be accessible from **/media/iso**.

### Mount a Remote File System

The network file system (NFS) supports mounting remote file systems as shares for local access.

1.  If you don’t already have an NFS client, you need to install it:

    **Ubuntu or Debian:**

        apt install nfs-common

    **RHEL, Fedora, or CentOS:**

        yum install nfs-utils

2.  Once you have an NFS client installed, you’ll need to create a mount point:

        mkdir /media/nfs

3.  Now edit **/etc/fstab** as discussed above. The new line in should look something like the following:

        123.45.67.8:/my_share /media/nfs  nfs defaults  0 0

4.  Then you can use a partial `mount` command, which completes from /etc/fstab.

        mount /media/nfs

{{< note respectIndent=false >}}
Instead of using NFS to mount a remote file system, you can instead use [SSHFS](https://www.redhat.com/sysadmin/sshfs). It’s not as stable as NFS, but has fewer dependencies. SSHFS is part of FUSE, and is available for most Linux distros, macOS, and Windows.
{{< /note >}}

## Unmounting File Systems

1.  You can unmount a file system using the `umount` command. Either the device name or the mount point is sufficient to specify what you wish to unmount:

        umount /media/nfs
        umount /media/iso
        umount /media/usb
        umount /dev/cdrom
        umount /dev/fd0

2.  If the file system is in use, you get an error message indicating that the target is busy. To determine what processes are using the mounted file system, use the `fuser -m` command, for example:

        fuser -m /media/usb

You can add the `-l` (lazy) switch to `umount` to instruct the system to unmount the device when it’s free. Alternatively, the `-f` (force) switch makes the system unmount the device right away, at the possible risk of corrupting the file system. The `-f` switch is primarily intended to unmount unreachable NFS shares.

## Conclusion

Mounting a file system on Linux is generally a straightforward two-step process: create a mount point directory, and use the `mount` command to mount the device at the mount point. Unless the file system is in use, unmounting is even simpler, requiring only the `umount` command. File system mounting and unmounting requires you to be logged in as **root**, or use the `sudo` prefix to temporarily take on root privileges.