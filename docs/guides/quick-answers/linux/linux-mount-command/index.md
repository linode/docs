---
slug: linux-mount-command
description: 'In Linux, mount command attaches file systems and disks at a point in the directory tree. Learn the basics of mounting and how to mount in Linux.'
keywords: ['linux mount command', 'linux unmount', 'linux mounted drives', 'mount disk in linux']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-10
modified_by:
  name: Linode
title_meta: "Linux Mount Command: Mounting File Systems & Disks"
title: "Quick Guide to the Linux Mount Command"
authors: ["John Mueller"]
---

This guide demonstrates how to use the Linux mount command to make data storage resources available from a single access point. This is made possible with mount points, a way to attach a disk resource (which isn’t necessarily a physical disk) to make it act as part of the current directory tree. The Linux mount command is designed to work with a number of file systems to make the file system itself transparent to the end user.

## What are the Linux Mount and Umount Commands?

In Linux, the term "drive" may not actually refer to a physical drive; a drive might be a special kind of file or a file system designed to look like a drive. For this reason, drives of any type are referred to as devices. When using the `mount` command, you mount a device to a mount point. When mounted to a mount point, Linux treats physical, virtual, and software drives as a physical extension to the host drive’s directory tree. In this way, the specifics of drive access are mostly abstracted away from the user.

### Linux Mount Command Syntax

The Linux `mount` command takes several different forms at the command prompt. The following are the most common forms:

```command
mount [-h|-V]
mount [-l] [-t fstype]
mount -a [-fFnrsvw] [-t fstype] [-O optlist]
mount [-fnrsvw] [-o options] device | mountpoint
mount [-fnrsvw] [-t fstype] [-o options] device mountpoint
```

There are other, less used, combinations that the [mount command supports](https://man7.org/linux/man-pages/man8/mount.8.html). This guide uses the term "operation" to indicate a task that the `mount` command performs and the term "option" to indicate how the `mount` command performs the task.

When looking at the command line syntax, [`-fnrsvw`] represents a list of operations you can perform. However, you can perform only one at a time. Of the options shown, `-f` (fake) allows you to perform a dry run of the operation to ensure it works before you perform the actual operation. The `-t` option (which stands for the type of file system, or how the mount command creates the connection) is discussed in the [A Quick Overview of File Systems](/docs/guides/linux-mount-command/#a-quick-overview-of-file-systems) section.

The `mount` command also comes with a number of options that don’t deal with the file system type. You use the `-o` switch to specify one or more options, with each option comma-separated. Not all options work with all operations, as explained later. The following are the most commonly used options:

- `async`: Performs tasks asynchronously, such as when you need to establish a remote connection through a network, rather than use a local drive.

- `sync`: Performs tasks synchronously to ensure one task is complete before starting another.

- `atime`: Updates the [index node (inode)](https://www.bluematador.com/blog/what-is-an-inode-and-what-are-they-used-for) access time (`atime`) for each access of the target device.

- `noatime`: Doesn’t update the inode access time for the target device.

- `auto`: Allows mounting with the `-a` switch.

- `noauto`: Forces an explicit mount of the drive.

- `defaults`: Uses the default options to perform the task, which include: `rw`, `suid`, `dev`, `exec`, `auto`, `nouser`, and `async`.

- `dev`: Allows the system to interpret the requirements for accessing character (where data is written in streams) or block (where data is written in standard-sized blocks) devices on a file system using [device nodes](https://wiki.debian.org/device_node). Device nodes are the special mount entries that begin with `/dev`.

- `nodev`: Disallows the creation and accessing of device nodes for the target device.

- `exec`: Permits the execution of binary files.

- `noexec`: Disallows the execution of binary files.

- `suid`: Allows the setting of the [set-user-identifier or the set-group-identifier](https://www.computerhope.com/jargon/s/setuid.htm) bits.

- `nosuid`: Disallows the setting of the set-user-identifier or the set-group-identifier bits.

- `user`: Allows a non-root user to mount the file system. This option also implies the `noexec`, `nosuid`, and `nodev` options.

- `nouser`: Forbids a non-root user from mounting the drive.

- `remount`: Attempts to remount a file system that is already mounted. This option is commonly used to change the mount system flags, such as making a read-only drive writable.

- `ro`: Mounts the drive as a read-only drive.

- `rw`: Mounts the drive as a read-write drive.

### Linux Umount Command Syntax

The `umount` command is less demanding than the `mount` command because the server already knows about the device and its mount point when you use `umount`. All you need to do to unmount an existing resource is to provide its name. However, the `umount` command does offer these forms of command syntax.

```command
umount -a [-dflnrv] [-t fstype] [-O option...]
umount [-dflnrv] {directory|device}
umount -h|-V
```

When looking at the command line syntax, [`-dflnrv`] represents a list of operations you can perform. However, you can perform only one at a time. Of the options shown, `-f` (fake) allows you to perform a dry run of the operation to ensure it works before you do it for real. As with the mount command, you can specify a particular file system using the `-t` option. Since the server already knows about the special file system, you use this option less often than when working with the mount command.

The main concern when using `umount` is ensuring the device you want to unmount is in a stable state with no users connected to it. The following is a list of operations you can perform with `umount` and options to modify `umount` behavior. Some of the operations are covered in more detail in the [How to Use the Linux Umount Command](/docs/guides/linux-mount-command/#how-to-use-the-linux-umount-command) section. The operations are case-sensitive so that `-a` is different from `-A`:

- `-a`, `--all`: Unmounts all of the file systems described in the `/proc/self/mountinfo` file except file systems of type `proc`, `devfs`, `devpts`, `sysfs`, `rpc_pipefs`, and `nfsd`. As an alternative, you can use the `-t` option to specify particular file system types.

- `-A`, `--all-targets`: Unmounts all mount points in the current mount namespace for the specified file system. The file system is specified through the mount point or the device name. It’s possible to combine this operation with the `--recursive` operation to unmount nested mounts recursively.

- `-c`, `--no-canonicalize`: Specifies that `umount` does not canonicalize the path by making the path an absolute, unique path that doesn’t contain links or shortcuts. Canonicalization relies on the use of the `stat()` and `readlink()` system calls that sometimes hang for certain file systems. For example, if you want to unmount an NFS drive and there is no NFS server available, the process may hang. This option is ignored for non-root users.

- `-d`, `--detach-loop`: After unmounting a device that is a [loop device](https://man7.org/linux/man-pages/man4/loop.4.html), this option also frees the underlying loop device. The functionality is enabled by default through the `autoclear` flag found in the `/dev/loop0` file when a device is mounted using the `mount` command. Use the `losetup` command to list loop devices on your system.

- `--fake`: Performs all the required tasks for an unmount except for the actual unmounting process. This option allows you to see what happens when you run the command without using the `--fake` switch.

- `-f`, `--force`: Forces an unmount to occur. Using this option can cause umount to hang. The [Performing a Forced Unmount](/docs/guides/linux-mount-command/#performing-a-forced-unmount) section covers this operation in more detail.

- `-i`, `--internal-only`: Doesn’t call the `umount.<file system>` helper code found in the `/sbin` directory, even if it exists. If you perform a directory command on the `/sbin` directory you may see files such as `mount.cifs` and `umount.udisks2` that are helpers. The mount or umount part of the helper filename references the command, while the `cifs` and `udisks2` part of the filename reference the file system. This option can be helpful when an unprivileged help hangs when attempting to unmount a drive.

- `-l`, `--lazy`: Unmounts the file system from the file hierarchy immediately, but cleans up the references later to allow the umount command to return earlier so the system isn't blocked. The[ Performing a Lazy Unmount](/docs/guides/linux-mount-command/#performing-a-lazy-unmount) section provides more details on this operation.

- `-N`, `--namespace ns`: Unmounts the [mount namespace](https://man7.org/linux/man-pages/man7/mount_namespaces.7.html) specified by `ns`, where `ns` is either a Process ID (PID) running in the [target namespace](https://www.redhat.com/sysadmin/mount-namespaces), or it’s a special file representing the namespace. The umount command switches to the target namespace to read from `/etc/fstab`, write to `/etc/mtab` or `/run/mount`, or perform the umount system call. Otherwise, it uses the original namespace so that the target namespace doesn’t have to contain any special libraries.

- `-n`, `--no-mtab`: Performs the unmounting process without writing to `/etc/mtab`.

- `-O`, `--test-opts option`: Unmounts only the file systems that have the specified option(s) set in the `/etc/fstab` file. The options appear in a comma-separated list.

- `-q`, `--quiet`: Suppresses the "not mounted" error messages.

- `-R`, `--recursive`: Unmounts nested mounts in the specified directory in a recursive manner. A *nested mount point* is one in which one mount resides within another mount. For example `/mymount` may be the parent mount, while `/mymount/testdata` may be the nested mount. Nesting is different from overmounting, where multiple file systems share the same mount point, in that each file system has its own mount point. The unmounting process stops if any unmount operation in the recursion chain fails. The nested mount points are located in the `/proc/self/mountinfo` file.

- `-r`, `--read-only`: If an unmount processes fails, try to remount the target file system as a read-only mount.

- `-t`, `--types type...`: Specifies one or more target file systems to perform an action on. Multiple file systems can appear in a comma-separated list. The type names come from the `/proc/mounts` file, rather than `/etc/fstab`, which means that some file system names may differ, such as `nfs4` versus `nfs`. Use the file system names from the `/proc/mounts` file.

- `-v`,` --verbose`: Display additional information while unmounting the drives.

- `-V`,` --version`: Display the umount executable version.

- `-h`, `--help`: Display umount help information.

### A Quick Overview of File Systems

A *file system* provides an organized way to structure and maintain data on a drive or other device used for data storage. The file system provides support for Create, Read, Update, and Delete (CRUD) operations, maintains data security and keeps data safe through techniques like Cyclic Redundancy Code (CRC) checks. File systems can be physical (on an actual disk drive), virtual (such as in memory), or software (such as an ISO image file). There are many different file system types, but the following list provides you with some common file system types. Not all versions of Linux support the same file systems, but you can often install the required support, such as with the *Common Internet File System*, CIFS:

- `btrfs`
- `cramfs`
- `ext2`, `ext3`, and `ext4`
- `fat`
- `gfs2`
- `hfsplus`
- `minix`
- `msdos`
- `ntfs`
- `reiserfs`
- `vfat`
- `xfs`

## How to Use the Linux Mount Command

The `mount` command helps you maintain your file systems in a variety of ways. The following sections demonstrate how to perform some essential tasks that are common to Linux administrators.

### Listing Mounted File Systems

It’s a good idea to know what partitions you have mounted on a file system. To do this is, issue the `mount` command in a terminal. The outputted list contains all of the currently mounted partitions in a form similar to this:

```output
sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
```

In this case, you see the device (`sysfs`), the mounting point (`/sys`), the file system type (`sysfs`), and the options for the mount (`rw`,`nosuid`,`nodev`,`noexec`,`relatime`).

If you also want to see the labels for each partition ([assuming that you have set the labels](https://www.tecmint.com/change-modify-linux-disk-partition-label-names/)), enter the `mount` command with the `-l` switch:

```command
mount -l
```

For example, the root node on a Linode usually has a label like [`linode-root`]. The label is in square brackets, rather than the parentheses used for options. If you just need to view which partitions have labels, then you can use a utility like [blkid](https://linuxconfig.org/how-to-label-hard-drive-partition-under-linux) instead.

When you need to know which partitions use a particular file system, add the `-t` switch to the `mount` command:

```command
mount -l -t cifs
```

This example displays all of the entries using the CIFS file system. However, you may not see a mount option that answers your needs, in which case you can combine it with the `grep` command. For example:

```command
mount -l | grep noexec
```

This command displays all of the partitions and disallows the execution of binary files.

### Mounting a File System

At its minimum, mounting a file system consists of providing a device name and the mount point. To begin this process, create a mount point (a directory on the host system), using the `mkdir` command. Use the `-p` command line switch to automatically create any required parent directories. For example, the following command creates the mount point, `media`, and the parent directory, `mnt`, if necessary.

```command
mkdir -p /mnt/media
```

Next, you perform the mounting process. You need to know which devices are available, which you can do by using the `lsblk` command, among others. The following command mounts the device `sbd1` to the `/mnt/media` directory.

```command
mount sdb1 /mnt/media
```

When you work with a remote connection, you need to know the method for attaching to the remote location and the correct file system type to use. The mount point location you choose should make sense to anyone who wants to access the data the device contains.

When mounting a file system, the mount command uses the defaults option unless you specify other options. The default options include: `rw`, `suid`, `dev`, `exec`, `auto`, `nouser`, and `async`.

### Automatically Mounting a File System with /etc/fstab

You can set your server to automatically remount a share every time you restart using the following steps. Make sure that the share is currently unmounted:

1. Using your favorite text editor, open the `/etc/fstab` file, which contains the configuration that the server uses on reboot to reconnect to shares. There are columns for the file system, `mount point`, `type`, and `options`.

1. Enter the required information in each of the columns. One of the most common needs is to provide a `credentials=` setting in the `<options>` column when working with drives that need special permissions, such as the CIFS type. The `<dump>` column is normally set to 0, which means that it doesn’t need to be *dumped* (backed up), but it’s possible to set another value to indicate a dumping level. The `<pass>` column determines the order in which file system checks are conducted. A value of 0 indicates that no special file system checks need to be done. Some drives, such as NFS, shouldn’t be checked due to the nature of their construction. Following is an example:

    ```command
    <file system>: <File System Location>
    <mount point>: <Mount Point on Host Drive>
    <type>: <Drive Type, such as CIFS>
    <options>: defaults
    <dump>: 0
    <pass>: 0
    ```

3. Save the file. The share is available the next time you reboot the server.

4. By entering the following command, you can see that the share is correctly mounted using just the `<Mount Point>` as an identifier because the `mount` is reading the `/etc/fstab` file.

    ```command
    mount <Mount Point>
    ```

When a device and mount point appear in the `/etc/fstab` file, you can also perform a manual mount by using the `mount <device>` or `mount <mount point>` commands. The `mount` command looks up the additional information it needs in the `/etc/fstab` file, including any required options.

### Manually Mounting a Universal Serial Bus (USB) Drive

A [Universal Serial Bus (USB)](https://www.educba.com/usb-flash-drive/) drive relies on a special serial connection with the server that usually appears externally, but can also appear internally. The USB specification can connect many types of devices to computer systems, not just disk drives.

Before attempting to perform a manual mount of a USB drive, verify that Linux hasn’t automatically mounted it for you by issuing the `mount` command. You can use grep to reduce the time required to find the USB drive. Because the most common file system type on Linux is ext, you can typically find your USB drive by running:

```command
mount | grep ext
```

*Automounting* is the default process on newer versions of Linux. Otherwise, you can use the same process for mounting other devices manually.

### Manually Mounting an ISO Image File

An ISO image file is generally a file representation of everything that used to appear on optical drives and follows the [ISO 9660](https://en.wikipedia.org/wiki/ISO_9660) file format. An ISO image file normally has a .iso file extension. [Most ISO image files are read-only](https://www.unixmen.com/edit-iso-files-using-mkisofs-in-linux/), meaning you can’t modify them. The precise characteristics of an ISO image file depend on [how you create them](https://trendoceans.com/create-iso-image-linux/).

You mount an ISO image file as a loop device, After creating a mount point, enter the following:

```command
mount -o loop <ISO image file path> <mount point>
```

Linux should automatically place the ISO image file in read-only state. However, if you experience problems in this regard, add the `ro` option to the command, such as:

```command
mount -o loop, ro <ISO image file path> <mount point>
```

### Manually Mounting a Network File System (NFS)

The [Network File System (NFS)](https://www.weka.io/learn/what-is-network-file-system/) was originally developed by Sun Microsystems in 1984 to replicate the experience of accessing local files using devices across a network. It builds on the [Open Network Computing Remote Procedure Call (ONC RPC)](https://www.ibm.com/docs/en/cics-ts/5.5?topic=rpc-onc-concepts) system. Don’t confuse it with [Microsoft’s New Technology File System (NTFS)](https://www.datto.com/blog/what-is-ntfs-and-how-does-it-work). The following steps get you started.

1. Install NFS support:

```command
sudo apt -y install nfs-common
```

You see a number of messages as the NFS client is installed.

1. Using your favorite text editor, open the `/etc/fstab` file.

1. Add a new entry consistent with using an NFS drive.

    ```command
    <file system>: <Remote Server:/dir>
    <mount point>: <Mount Point on Host Drive>
    <type>: nfs
    <options>: defaults
    <dump>: 0
    <pass>: 0
    ```
1. Mount the NFS drive:

```command
mount <mount point>
```

## How to Use the Linux Umount Command

Shutting Linux down automatically unmounts all of the drives in an orderly and safe manner. Unless a mount appears in `/etc/fstab`, the drive isn’t remounted the next time you boot the system. However, you do need to use umount if you want to do something like remove an external drive before shutting the system down. Failure to unmount an external drive, such as a USB drive, before you remove it can cause damage to the devices data.

### Installing the `psmisc` Package

The `psmisc` package contains a number of miscellaneous utilities that rely on the [/proc File System](https://www.kernel.org/doc/html/latest/filesystems/proc.html) and are used in [various file management tasks](https://packages.debian.org/stretch/psmisc). Installing support for a non-supported file system such as CIFS can also install the `psmisc` package, but you may see an error message stating that `fuser` is missing. This means that you need to install `fuser` separately. [How you install fuser package](https://command-not-found.com/fuser) depends on your platform. You need this package to gain access to the `fuser` command, which shows you which users are using the various mounts on your server. You cannot unmount a share if someone is using it. The following steps show how to install the `psmisc` package on Ubuntu.

1. Install `psmisc`:
  ```command
  sudo apt -y install psmisc
  ```

  You either see a series of installation steps or the installation command verifies that the latest version of psmisc is installed.

1. Test `fuser` by entering `fuser`. You see a list of the various fuser command line switches.

### Performing a Standard Unmount

You must ensure that no one is using a device before you unmount it. Unmounting the device could result in errors because Linux checks the device status when unmounting. To check the status of a mount, enter:

```command
fuser -m -u <mount point>
```

If the command returns without displaying any information, then the mount point isn’t in use and you can safely unmount it. Adding the `-u` command line switch displays the name of the user who is using the mount point.

To perform a standard unmount, provide the device or mount point:

```command
umount <device>
```

or

```command
umount <mount point>
```

The default behavior of the `unmount` command on a file system is to unmount the device and free the resources immediately. This may take a while with certain devices, especially with NFS drives that have lost their connection. If there is any doubt about the unmounting process completion, use a lazy unmount as described in the next section.

When working with a loop device, such as an ISO image file, you need to ensure that you free the underlying loop device using the `-d` command line switch:

```command
umount -d <mount point>
```

Using the mount point to unmount the file system is usually easier than using the actual loop device location.

### Performing a Lazy Unmount

A lazy unmount doesn’t wait for the unmounting process to complete before returning. The system simply waits until the device isn’t busy anymore. The most common use case for a lazy unmount is when you think that an NFS or other remote drive has hung or become disconnected. When using this option, you can’t remount the device without rebooting the server first. To perform a lazy unmount, enter:

```command
umount -l <device>
```

or

```command
umount -l <mount point>
```

### Performing Umount Troubleshooting

When working with `umount`, you may see an error message stating that the device is busy, which means you can’t unmount it. Often, someone simply has a file open within the directory and needs to close it. However, you may also see the effect of a disconnected drive, a remote server that is down, or any of a number of other conditions. If the `fuser` command is unrevealing, use the `ps -u` command to locate processes that may be using the resource. Performing a lazy unmount is the best option in this case.

Sometimes an unmounting process fails because the device is already unmounted. In this case, the error message is "not mounted." Looking for this error when working with scripts saves you a lot of troubleshooting time later.

If you’re having trouble with a particular device unmounting, then add the `-v` (verbose) option to `umount` to obtain more detailed information. Don’t confuse this option with the `-V` (uppercase) option.

In some cases, you can use the umount `-r` command line switch to remount a drive as read-only. In some cases, this makes it possible to reestablish a connection. Don’t confuse this option with the `-R` (uppercase) command line switch.


### Performing a Forced Unmount

If at all possible, do not force an unmount. You can damage the drive or its data. Make sure you perform any required troubleshooting before you force an unmount and then perform a file system check using the fsck command (if possible, some drives shouldn’t have `fsck` used on them like NFS) after mounting the drive again.

One situation that requires a forced unmount is when the drive becomes unreachable, such as a failed network connection to a remote drive. To perform a forced unmount, use:

```command
umount -f <Directory>
```

## Summary

This guide introduces you to the `mount` and `umount` commands used to manage drive systems by adding drive resources to its tree structure. The goal is to provide the user with access to all of the resources required to perform tasks, without requiring the user to navigate multiple drive systems. You must always unmount an external drive, such as a USB drive, before removing the physical device from the system. As part of working with drive systems, it’s also important to know about working with the `dump` command to make backups and the `fsck` command to check for drive errors when the drive experiences an error or is unmounted incorrectly.

