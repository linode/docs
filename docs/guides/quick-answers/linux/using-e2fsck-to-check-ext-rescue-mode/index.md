---
slug: using-e2fsck-to-fix-ext-disk-issues
author:
  name: Linode
  email: docs@linode.com
description: "Having issues with your Linux installation? Using e2fsck might be able to help. This guide will walk you through the entire process involved in checking the inegitry and repairing issues with ext filesystems using e2fsck."
og_description: "e2fsck is the Linux ext file system consistency check utility. This guide shows how to use e2fsck to check a system for corrupt files and bad disk sectors, then attempt to repair any errors it finds."
keywords: ["e2fsck", "file system", "disk repair", "troubleshoot"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-05
modified: 2022-04-05
modified_by:
  name: Linode
title: "How to Use e2fsck to Check and Repair Disk Errors On ext File Systems"
h1_title: "Using e2fsck to Find and Repair Disk Errors On ext File Systems"
enable_h1: true
external_resources:
- '[e2fsck on man7.org](https://man7.org/linux/man-pages/man8/e2fsck.8.html)'
tags: ["linux"]
aliases: ['/quick-answers/linux/using-e2fsck-to-fix-ext-disk-issues/']
---


## What is e2fsck?

**e2fsck** is a utility that examines `ext2`, `ext3`, and `ext4` filesystems for errors, and attempts to repair them if possible. It is the backend tool that the popular [fsck](/docs/guides/how-to-use-fsck-to-fix-disk-problems/) frontend utility calls for a combination of tasks related to `ext` filesystems.

On some systems, e2fsck runs automatically after an unclean shutdown or after a certain number of reboots.

{{< note >}}
When booting into rescue mode on the Linode Platform, the `e2fsck` tool will be installed as the default disk repair utility. For instructions specific to performing a filesystem check on the Linode platform, see our [Troubleshooting Guide: Booting into Rescue Mode](/docs/guides/rescue-and-rebuild/#booting-into-rescue-mode) for guidance.
{{</ note >}}

## When to Use e2fsck

You can use fsck to check your file system if your system fails to boot, if files on a specific disk become corrupt, or if an attached drive does not act as expected.
Unmount the disks you intend to work on before attempting to check or repair them.

{{< caution >}}
Unmount the target disk first. You risk corrupting your file system and losing data if you run fsck on an active disk.
{{< /caution >}}

## e2fsck Options and Arguments

| Option | Action |
| ------:|:------------------ |
| `-a`   | Automatically repair ("preen") the file system. This option is provided for backwards compatibility purposes only, and it is recommended that the `-p` option is used instead wherever possible. |
| `-b superblock`   | Uses an alternative superblock, replacing `superblock` as noted in the option. |
| `-B blocksize`   | Allows you to define a block size when performing e2fsck, instead of having e2fsck attempt multiple block sizes to find the correct one. Replace `blocksize` with the block size you would like to attempt a repair with.  |
| `-c`   | Uses the [badblocks](https://man7.org/linux/man-pages/man8/badblocks.8.html#) program to perform a read-only scan to find any bad blocks, and then add any back blocks to the inode to prevent them from being allocated. |
| `-C fd`   | Ensures that e2fsck writes completion information to a specified file descriptor to track the progress of the file system check. Replace `fd` with the file descriptor you would like to use. |
| `-d`   | Prints debugging output |
| `-D`   | Ensures the e2fsck attempts to optimize all directories by re-indexing them or by sorting and compressing directories for smaller directories, or traditional linear directories.  |
| `-E extended_options`   | Sets extended options for e2fsck. These are generally more advanced options. For more information, see the [official man page for e2fsck.](https://linux.die.net/man/8/badblocks) |
| `-f`   | Force filesystem checking even if the file system appears clean.  |
| `-F`   | Flushes the file system device's buffer caches before beginning. This is generally only useful for benchmarking purposes. |
| `-j external-journal`   | Sets the path name where the external-journal for the defined file system can be found. Replace `external-journal` with the path you will be using. |
| `-k` | Used in combination with the `-c` option, uses the [badblocks](https://man7.org/linux/man-pages/man8/badblocks.8.html#) program, ensures that any existing bad blocks are preserved, and any new bad blocks found are added to the bad blocks list. |
| `-l filename` | Adds block numbers listed in the file specified by `filename` to the list of bad blocks. |
| `-L filename` | Same as the `l` option, however clears the bad blocks list before the blocks listed in the file are added. |
| `-n` | Opens the filesystem as `read-only` and assumes an answer of `no` to any prompts. This option may not be specified at the same time as the -p or -y options. |
| `-p` | Entered to automatically repair ("preen") the file system. Automatically attempts to fix any filesystem issues without human intervention. |
| `-t` | Prints statistics for `e2fsck` related to timing. |
| `-v` | Enables verbose output. |
| `-V` | Prints the version information for  `e2fsck` without performing any scan. |
| `-y` | Automatically selects the `yes` option to any prompts when performing `e2fsck` tasks. This option may not be specified at the same time as the `-n` or `-p` options. |


## Unmount the Disk

### Boot into Rescue Mode

If you are using e2fsck on a Linode, the easiest and safest way to unmount your disk is to use Rescue Mode. Visit our [Rescue and Rebuild](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode) guide for instructions on how to boot your Linode into Rescue Mode. If you're working on a local machine, consider using the distribution's recovery mode or a live distribution to avoid working on a mounted disk. e2fsck should be run only as a user with root permissions.

### View Mounted Disks and Verify Disk Location

1.  Run `df` to view a list of currently mounted disks. If you are using Rescue Mode, the disk you want to check should not be listed:

        df -h

2.  Use `fdisk` to view disk locations:

        fdisk -l

    Copy the location of the target disk to use with the fsck command.

### Configuration Profile

If you are working on a Linode but do not wish to use Rescue Mode, shut down the Linode from the Linode Manager. Unmount the disk from the [Configuration Profile](/docs/guides/linode-configuration-profiles). Apply the changes and reboot the Linode.

### Manual Unmount

If you are working on a local machine, unmount the disk manually.

1.  Use `umount` to unmount the disk location copied in the [previous step](#view-mounted-disks-and-verify-disk-location):

        umount /dev/sdb

2.  If the disk is declared in `/etc/fstab`, change the `mount point` to `none` there as well.

## How to Check for Errors on a Disk

Run fsck on the target disk, using the desired options. This example forces a file system check and attempts to fix any issues without human intervention (`-fp`) on `/dev/sda`:

    e2fsck -pf /dev/sda

### Understand fsck Error Codes

The error codes that fsck returns can be understood with the following table from [man7.org](http://man7.org/linux/man-pages/man8/fsck.8.html):

| Code | Error Code Meaning |
| ----:|:------------------ |
|   0 | No errors  |
|   1 | Filesystem errors corrected  |
|   2 | System should be rebooted  |
|   4 | Filesystem errors left uncorrected  |
|   8 | Operational error  |
|  16 | Usage or syntax error  |
|  32 | Checking canceled by user request  |
| 128 | Shared-library error  |
