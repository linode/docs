---
slug: basic-linux-commands
author:
  name: Tom Henderson
description: 'What are the basic linux commands you should know? Use our Linux commands cheat sheet to learn beneficial commands, including useful commands that go beyond the basics.'
keywords: ['linux commands cheat sheet','linux commands list','linux basic commands','important linux commands']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-08
modified_by:
  name: Linode
title: "A List of the Most Common Linux Commands"
h1_title: "Basic Linux Commands: A Beginner’s Guide "
enable_h1: true
contributor:
  name: Tom Henderson
---

Both beginners and advanced users of Linux can benefit from a Linux command cheat sheet. If you need to use a command that isn't part of your daily toolchain, or if you are coming from a non-Linux based operating system, a Linux command reference is what you need. These commands work on most Linux distributions released since 2012. Although different versions of these commands exist, each Linux distribution has *man pages*. The man pages are an authoritative for the version of the command found on your specific Linux distribution.

## Use the Man Pages For Specific Instructions

The *manual* (man) page for a command is a reliable resource to learn about any Linux command's syntax and options. Most Linux distributions keep the man pages updated with a command's latest available options. Although some man pages explanations are terse, they are authoritative. To access the man pages for any command use the following:

    man <command>

To exit the man page you are viewing type **ctrl-q**.

To access more succinct information about a specific command view your Linux system's built-in help information:

    <command> --help

## Obtain Needed Permission To Execute A Command

Many commands require specific permissions to execute. Some require a non-privileged user to be a member of the group sudo or sudoers. When a command fails to execute and delivers an error message, if you have permissions as a sudo-er or root equivalent user, use this syntax:

    sudo <command options arguments>

and offer a valid `sudo` password. In a session, the password may not be required to be used for a second and subsequent use of the sudo permissions request. Successful use of a sudo permission elevation requires that a user be either the root user, or a member of the sudo or sudoers group.


Many Linux versions support elevation of a user to root, although this is risky from a security perspective. The sudo command, used for root or sudo-group permissions as su or superuser, can be made temporary until the then permissions-elevated shell session exits:

    sudo su

When executed, the shell that was created by this command is the root user of the system. To return from a root shell that has been invoked by sudo, type:

    exit

## User And Group Administration

The most common commands are user and group administration, making users and groups, managing their memberships, changing passwords, and general people management for the host.

### Add A User

Adding a user requires a username, and the username has differing data added via additional questions. Answers can be blank, answered with a <return> if not needed. The password question must be answered, twice.

    adduser <username>

Most versions of this command ask other questions about user details, including a password question.

### Add User To A Group

Groups are most commonly used to share common file permissions, printing services, and/or applications resources.

    adduser -a -G <groupname> <username>

### Add A Group

Groups are invented by name and contain alpha-numeric characters.

    groupadd <name>

### Delete A Group

    groupdel <name>

### List Groups For The Current User

Users and administrators sometimes forget the names of the groups associated with a username. The id command reveals them.

    id

### List Groups For Root User

User root is not automatically added to all groups, and the root user’s association can be revealed by calling a root-user response:

    sudo id

### Display User’s Supplemental Groups

The `groups` command shows the current user’s supplemental group membership:

    groups

### Which Users Are Logged Into A Host?

To determine the active users on a host use the who command:

    who

Or,  a common shorthand of the who command available on most Linux distros:

    w

### What User Am I?

Administrators occasionally need to remember the context of which user is the currently logged user, performed with the whoami command.

    whoami

### Info About The Active User `<gid, pid, groups>`

The `id` command lists the active user’s settings.

    id

### Change Active Or Selected User Configuration

Once the `id` command is used, the usermod command can change the user’s system account files for many characteristics, the long list of them described in the `man` pages.

    usermod

## Disk and Media Management Commands

Storage and storage configuration tasks aren’t frequently used, but when needed, are critical. Understanding settings and subsequently modifying them are common Linux administration tasks, especially during initial setup.

### Find System Block Devices

Linux uses block/blk devices for storage, except RAM disks. To find currently connected block devices, the `lsblk` (list block) device command is used:

    lsblk <optional specific device, where known>

### List And/Or Manipulate File System Partitions

When resizing, deleting, creating, and/or moving is required, *parted* is used. To list known partition information, use the lower-case L option:

    parted -l

### Mounting Or Listing Filesystem Mount Points

The `mount` command lists filesystem mounting points, and/or allows filesystems to be mounted under the / or root filing system for a host. To list currently known mounting points, use:

    mount

Or

    mount -l

Filesystem mounts are located traditionally in `/etc/fstab` or `/etc/mtab`; until listed in the `/etc/fstab` or `/etc/mtab` (system dependent), all filesystem mounts are ephemeral.

Mounting a filesystem can be performed with this command:

    mount -t <filesystem type> <device name> <directory to mount filesystem, ex: /tmp>

The `findmnt` command draws a tree of the current filesystem mounting points for discernibility:

    findmt <options>

### Examine Or Change Disk Partitions

Like parted, the fdisk command can change partitions, but also format them, too.

    fdisk <device name>

### Determine Disk Space And Partitions

Rapid space reports for space on file systems, noting their mount points, can be discovered using the `df` command with:

    df -h

### Unmount A Filesystem

Removing a quiescent filesystem from the file hierarchy is performed by the `umount` command:

    umount <filesystem>

## File Compression And Movement Commands

### Synchronize Files Locally

The `rsync` command synchronizes single files through entire filesystems to local or remote destinations. The syntax is:

    rsync <options> <source files> <destination directory>

When rsync is used to move files between hosts, `ssh` is used:

    rsync <options> <source location> <username@IP_address>:/<destination directory>

Where the `username@ipaddress` has valid SSH credentials. Some hosts use special SSH port addresses for communications. This is an example:

    rsync <options> <-e “ssh -p [port#]”> <source location> <username@IP_address>:/<destination directory>

### Compress and Decompress Files

The `tar` command has numerous versatile options for file(s) compression or decompression, as tar is an archiving tool that’s descended from the TApe aRchive days:

    tar <options> <source> <destination>

## System And Resources Listing And Manipulation

### See Bootup Messages

Upon system startup, processes send status messages which may or may not be useful to understand system states or problems. The `dmesg` command displays the list:

    dmesg

### Quick Listing Of System Resources

The `top` command displays Linux system processes use and resources, and is updated every three seconds. Information about tasks, processes, and resources used is available in a single screen:

    top

Press the **c** key to sort by CPU utilization, and the **m** key to sort by memory utilization.

### List All Processes

Linux Processes are instantiated with a process identification number, called a PID. This number kills a process as well. This version of the `ps` command lists all processes:

    ps -ef

### Kill a Process

The `kill` command sends a signal to a process. Using the kill command requires understanding the process and its effect on the system, because killing certain processes renders the system inoperable for some or all users.

To find the types of messages available from kill to a process:

    kill -l

To use the default message `-15 (TERM)`, the most graceful process termination:

    kill <PID>

### Show IO Stats

The `vmstat` command reports statistics from either the system startup, or the last time the vmstat command was invoked. The statistics include processes, CPU utilization, memory swapped in from disk/block devices, I/O, and system interrupts:

    vmstat

### Show All Files In Use

The `lsof` command shows ALL files in use. As Linux, like all Unix derivatives, considers almost everything a file or inode, this can be a long list:

    lsof

It’s possible to see all files in use by a process ID/PID:

    lsof -p -<PID>

### List USB Services

Host-connected USB devices that are powered-on during connection are shown by the `lsusb` command:

    lsusb

### Enable Bluetooth

To turn on Bluetooth on systemctl (not init.d) versions of Linux:

    systemctl enable bluetooth

If enabled, `bluetoothctl` provides interactive control of devices. To find Bluetooth devices:

    bluetoothctl scan on

To enable host discoverability:

    bluetoothctl discoverable on

Turn off each after scanning or after the discoverability phase.

### Display Discovered PCI Devices

The `lspci` command displays characteristics of discovered PCI devices on any PCI buses discovered in the host. There may be more than one bus, and several devices possible in each bus:

    lspci

### Show BIOS Information

The `dmidecode` command displays information detected about BIOS settings and inventory:

    dmidecode

The `dmidecode` command cannot change BIOS settings.

## File Manipulation And Navigation

### List Files

The `ls` command lists files in the specified directory:

    ls <options><target>

The default is the current directory.

### Create an Empty File (Inode)

To make an empty file, use the `touch` command:

    touch <path/filename>

### Change Current Directory

To change to a different directory, use the `cd` command:

    cd <desired_directory_path>

### Move A File

The `mv` command moves a file to a different directory:

    mv <options> <source_path> <destination_path>

Using the `-r` option moves files recursively.

### Change File Permissions

The `chmod` command [changes the file permissions and executable/symbolic link mask](/docs/guides/modify-file-permissions-with-chmod/) of a file or files:

    chmod <executable_or_symbolic_file_option> <permissions_mask> <target_files_location(s)>

### Delete A File

The rm (ReMove) command deletes a file. Caution is advised:

    rm <option> <file path>

A commonly used option is `-r` which removes files recursively through the file path. Another option, `-rf` removes files forcibly.

### Determine a File Location Within the Directory Tree

The `locate` command files all instances of files matching a string argument:

    locate <string>

### Make A Directory

The `mkdir` command instantiates a directory at the current path or one specified:

    mkdir <path_and_name>

### Copy a File

Files are copied using the `cp` command:

    cp <option> <file_source> <file_destination>

The `-r` option recursively copies files.

### Create Symbolic Link to a File

A symbolic link permits a connection to a file from the current directory to the location of the actual file:

    ln -s <file_or_link_to_establish> <source>

## Communications Control and Status

### Known Interface Status

The `ifconfig` (INterface CONFIGuration) command shows known (established) interfaces and their status:

    ifconfig <optional_specific_interface>

Unless a specific interface is used as an argument, all established interfaces are displayed.

### Monitor Network Interface Status and Statistics

The `netstat` command displays established interfaces and protocol statistics:

    netstat <options> <arguments>

Some versions use the `ss` command, a direct replacement for `netstat`.

### Watch Live Network Conversations

The `tcpdump` command displays communications activity for the default, or a specific network interface device:

    tcpdump <options> <optional_specific_network_interface>

### Find Duplicate IP Addresses

The `arp` command (Address Resolution Protocol) finds IP-to-MAC (Media Access Control layer) address mappings, and duplicate IP addresses, which foul network communications:

    arp <options> <interface> <hostname>

### Determine If a Host Is Reachable

The `ping` command uses ICMP messaging to determine if a host is reachable. If a host cannot be found by DNS name, DNS may be unavailable. If an IP address cannot be reached, then a route is unavailable:

    ping <hostname_or_IP_address>

## Conclusion

These basic Linux commands work in any shell on any Linode Linux edition, no matter the distribution family. To learn more about Linux Basic Commands, Ubuntu/Debian derivatives can be found at [Canonical’s site](https://ubuntu.com/tutorials/command-line-for-beginners).