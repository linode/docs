---
slug: how-to-use-fsck-qa
description: 'Learn about some of the frequently-used fsck commands to check a system for corrupt files and bad disk sectors and repair any errors it finds.'
keywords: ["fsck", "file system", "disk repair", "troubleshoot"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-04-30
modified: 2018-04-30
modified_by:
  name: Linode
title: 'How to use fsck - Quick Answer'
external_resources:
- '[fsck on man7.org](http://man7.org/linux/man-pages/man8/fsck.8.html)'
tags: ["linux"]
aliases: ['/quick-answers/linux/how-to-use-fsck-qa/']
authors: ["Edward Angert"]
---

## What is fsck?

fsck, short for file system consistency check, is a utility that examines the file system for errors and attempts to repair them if possible. It uses a combination of built-in tools to check the disk and generates a report of its findings.

On some systems, fsck runs automatically after an unclean shutdown or after a certain number of reboots.

## When to Use fsck

Use fsck to check your file system if your system fails to boot, if files on a specific disk become corrupt, or if an attached drive does not act as expected.

{{< note respectIndent=false >}}
To run this utility you will want to boot into rescue mode. Please see our [Troubleshooting Guide: Booting into Rescue Mode](/docs/products/compute/compute-instances/guides/rescue-and-rebuild/#booting-into-rescue-mode) for guidance.
{{< /note >}}

### Verify Disks are Unmounted

1.  Verify that the disks you wish to check are unmounted. You risk corrupting your file system and losing data if you run fsck on an active disk. To do this, enter the following command:

        df -h

1.  You will see a similar output:

    {{< output >}}
root@ttyS0:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           739M 1016K  738M   1% /media/ramdisk
/dev/sdh        160M  160M     0 100% /media/sdh
/dev/loop0      146M  146M     0 100% /media/compressed_root
unionfs         739M 1016K  738M   1% /
devtmpfs         10M     0   10M   0% /dev
{{< /output >}}

    Your primary disks should not appear in the list. As long as your device does not appear in the example output from the `df -h` command, you can run a filesystem check on it.

## How to Check for Errors on a Disk

{{< note type="alert" respectIndent=false >}}
Never run fsck on a mounted disk. Do not continue unless you’re sure that the target disk is unmounted. You risk corrupting your file system and losing data if you run fsck on an active disk.
{{< /note >}}

Run fsck on the target disk, using the desired options. This example checks all file systems (`-A`) on `/dev/sdb`:

    fsck -A /dev/sdb

### fsck Options and Arguments

| Option | Action |
| ------:|:------------------ |
| `-A`   | Check all disks listed in `/etc/fstab`.  |
| `-M`   | Skip mounted file systems.  |
| `-N`   | Test run. Describes what would happen without executing the check itself. |
| `-P`   | Use with the `-A` option to run multiple checks in parallel.  |
| `-R`   | If using the `-A` option, do not check the root filesystem.  |
| `-t`   | Check only a specific type of filesystem.  |
| `-y`   | Interactive repair mode.  |

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

## Use fsck to Repair File System Errors

Use the `-r` option to use the interactive repair option.

This example uses fsck to check all file systems except the root, and will attempt repair using the interactive feature:

    fsck -AR -y

To check and attempt to repair any errors on `/dev/sdb`, use this format:

    fsck -y /dev/sdb

## What if fsck Gets Interrupted?

If fsck gets interrupted, it will complete any checks in process, but will not attempt to repair any errors it finds.
