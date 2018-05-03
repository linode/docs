---
author:
  name: Edward Angert
  email: docs@linode.com
description: 'fsck is the Linux file system consistency check utility. This Quick Answer shows some of the often-used commands to use fsck to check a system for corrupt files and bad disk sectors, then attempt to repair any errors it finds.'
og_description: 'fsck is the Linux file system consistency check utility. This Quick Answer shows some of the often-used commands to use fsck to check a system for corrupt files and bad disk sectors, then attempt to repair any errors it finds.'
keywords: ["fsck", "file system", "disk repair", "troubleshoot"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-04-30
modified: 2018-04-30
modified_by:
  name: Linode
title: 'How to use fsck - Quick Answer'
external_resources:
- '[fsck on man7.org](http://man7.org/linux/man-pages/man8/fsck.8.html)'
---

## What is fsck?

fsck, short for file system consistency check, is a utility that examines the file system for errors and attempts to repair them if possible. It uses a combination of built-in tools to check the disk and generates a report of its findings.

On some systems, fsck runs automatically after an unclean shutdown or after a certain number of reboots.

## When to Use fsck

Use fsck to check your file system if your system fails to boot, if files on a specific disk become corrupt, or if an attached drive does not act as expected.
Unmount the disks you intend to work on before attempting to check or repair them.

{{< caution >}}
Unmount the target disk first. You risk corrupting your file system and losing data if you run fsck on an active disk.
{{< /caution >}}

## How to Check for Errors on a Disk

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

## What if fsck got interrupted?

If fsck gets interrupted, it will complete any checks in process, but will not attempt to repair any errors it finds.
