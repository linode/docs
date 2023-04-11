---
slug: basic-linux-commands
description: 'What are the basic linux commands you should know? Use our Linux commands cheat sheet to learn beneficial commands, including useful commands that go beyond the basics.'
keywords: ['linux commands cheat sheet','linux commands list','linux basic commands','important linux commands']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-23
modified_by:
  name: Linode
title: "Basic Linux Commands: A Beginner’s Guide "
title_meta: "A List of the Most Common Linux Commands"
authors: ["Tom Henderson"]
---

Both beginners and advanced users of Linux can benefit from a Linux command cheat sheet. If you need to use a command that isn't part of your daily toolchain, or if you are coming from a non-Linux based operating system, a Linux command reference is what you need. These commands work on most Linux distributions released since 2012.

## What Is The Linux Command Line?

The Linux Command Line is most frequently presented through a shell session. Some Linux versions use programs called terminal, term, xterm, bash, and more. When the command line is needed, a user interface, usually 80x25, is created. This terminal-like session is a session which may or may not have specific shell options programmability built into the session.

Linux traditionally opens a bash shell. Bash is an acronym and stands for the phrase, “Bourne Again SHell”. The bash shell keeps a history of commands that have been invoked by the currently logged user.

The person starting the Linux command-line session, is called the current user. The terminal executes commands with the permissions and rights of that user. The most common failing in the Linux command line is when you attempt to use a command where your user permissions aren’t sufficient to perform the work of the command. The command renders an error message which gives a description of the error, and how to correct the problem.

These Linux commands in this guide are common to most releases. Some of them have been upgraded, augmented, or modified to suit changing needs, times, or different syntax.

Like other Unix operating systems, Linux has the ability to chain commands together into shell scripts, which in turn, have rudimentary to intermediate programmability. [Shell scripting](/docs/guides/intro-bash-shell-scripting/), or the use of commands arranged to execute a series of Linux command line apps, is common. Variables can be passed, and jobs can also be programmed to execute a script at certain times.

This cheat sheet contains the most commonly-used Linux commands for remote servers, like a Linode. The GNU command-line apps are re-writes of Unix, BSD, Solaris, and other operating systems versions. These are updated, or even re-written to adapt to newer host technologies and infrastructure. Technologies like Bluetooth, Wireless Ethernet, USB, the PCI bus were only dreams when many of the early versions of these commands were written. Although different versions of these commands exist, by tradition, each Linux version has *man pages* which are authoritative for the version of the command found on the specific Linux distribution under consideration.

## Benefits of Using Basic Linux Commands

Day to day administration requires many different steps for administrators, advanced users, and developers. When you understand Linux commands, you enhance your ability to be rapidly productive in important areas. The commands listed in this Linux cheat sheet are grouped together by common tasks.

Most Linux commands are also known to macOS users, whose operating system is derived from the Darwin branch of BSD/Unix and often execute similarly. Microsoft Windows also has many commands that are either derived from Unix CP/M, and/or DOS, and have parallel functions in Linux. Microsoft’s Windows Powershell Commands and scripts also function in ways similar to Linux using Windows-specific context and syntax.

## View a Command's man pages for More Information

The *manual* (man) page for a command is a reliable resource to learn about any Linux command's syntax and options. Most Linux distributions keep the man pages updated with a command's latest available options. Although some explanations in the man pages are terse, they are authoritative. To access the man pages for any command use the following syntax:

    man <command>

To exit the man page you are viewing type **ctrl-q**.

To access more succinct information about a specific command view your Linux system's built-in help information:

    <command> --help

## Linux sudo Command: Obtain Elevated User Permissions

Many commands require specific permissions to execute. Some require a non-privileged user to be a member of the group `sudo`. When a command fails to execute and delivers an error message, if you have permissions as a `sudo` user or root equivalent user, use this syntax:

    sudo <command options arguments>

After using the `sudo` command, you are prompted to enter your user password.

Many Linux versions support elevating a user to be the root user, although this is risky from a security perspective. You can temporarily elevate a user be the root user using the `su` command, as follows:

    sudo su

When executed, the shell that was created by this command is the root user of the system. To return from a root shell that has been invoked use the following command:

    exit

## User and Group Administration

The most common commands are user and group administration commands. Typical user administration includes creating new users and groups, managing their permissions, and changing passwords. This section includes all of the most common user administration commands.

### Add a New User

To add a new user, issue the command below. Replace `<username>` with the desired username.

    adduser <username>

Most Linux systems will prompt you to add additional data about the new user. Provide the requested information or leave the answers blank by pressing the **return** key. You must, however, provide a password for the new user when prompted.

### Add User to a Group

Groups are most commonly used to share common file permissions, printing services, and applications resources. To add a user to an existing group use the command below. Ensure you replace `<groupname>` and `<username>` with your own values.

    adduser -a -G <groupname> <username>

### Add a New Group

To create a new group use the `groupadd` command with the desired name of the new group, as show below:

    groupadd <name>

### Delete a Group

The `groupdel` command is used to delete an existing Linux system group, as show below:

    groupdel [opyiond] <groupname>

### List Groups for the Current User

Users and administrators sometimes forget the names of the groups associated with a username. The `id` command reveals the groups that the current user belongs to.

    id

This command also displays information related to the active user's group id and user id.

### List Groups for a Different User

To list the groups that a different user is a member of, use the following command:

    groups <username>

### View Which Users Are Logged Into a Host

To determine the active users on a host use the who command:

    who

Or, a common shorthand of the who command available on most Linux distros:

    w

### What User Am I?

Administrators occasionally need to remember the context of which user is the currently logged in user. You can do so using the `whoami` command, as show below:

    whoami

### Modify a User Account

The `usermod` command is used to change a Linux user's settings. Any of these changes modifies the user's system account files. You can modify things like the groups a user belongs to, a user's home directory, and their default shell. The syntax for the `usermod` command is as follows:

    usermod [options] <username>

For example, to change a user's home directory, use the following command:

    sudo usermod -d /home/example-user-new-home example-user

Consult our [An Overview of the usermod Command and How It's Used](/docs/guides/what-is-usermod-and-how-to-use-it/) to learn more.

## Disk and Media Management Commands

This section provides a reference to common storage configuration commands. Understanding settings and how to modify them are common Linux administration tasks, especially during the initial setup of a system .

### Find System Block Devices

Linux uses block devices for storage. Block devices provide access to data stored in fixed-size blocks. To find currently connected block devices, the `lsblk` (list block) device command is used:

    lsblk <optional specific device>

Your output may resemble the following:

{{< output >}}
NAME MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda    8:0    0 49.5G  0 disk /
sdb    8:16   0  512M  0 disk [SWAP]
{{</ output >}}

### List and Manipulate File System Partitions

To resize, delete, create, and move your file system partitions, use the `parted` command. To list known partition information, use the `-l` option:

    sudo parted -l

{{< note respectIndent=false >}}
If the `parted` command is not available on your Linux system, use your distribution's package manager to install it. For example, to install `parted` on an Ubuntu system, use the following command:

    sudo apt-get install parted
{{< /note >}}

Your output displays similar information:

{{< output >}}
Model: QEMU QEMU HARDDISK (scsi)
Disk /dev/sda: 53.2GB
Sector size (logical/physical): 512B/512B
Partition Table: loop
Disk Flags:

Number  Start  End     Size    File system  Flags
 1      0.00B  53.2GB  53.2GB  ext4


Model: QEMU QEMU HARDDISK (scsi)
Disk /dev/sdb: 537MB
Sector size (logical/physical): 512B/512B
Partition Table: loop
Disk Flags:

Number  Start  End    Size   File system     Flags
 1      0.00B  537MB  537MB  linux-swap(v1)
{{</ output >}}

### Mounting and Listing File System Mount Points

The `mount` command lists file system mounting points, and allows file systems to be mounted under the root directory (`/`) on a Linux host. To list currently known mounting points, use the following command:

    mount

File system mounts are normally located in the `/etc/fstab` file or the `/etc/mtab` file. The file system mount is ephemeral, unless a file system mount is listed in the previously mentioned files.

Mounting a file system can be performed with the following command:

    mount -t <filesystem type> <device name> <directory to mount filesystem, ex: /tmp>

The `findmnt` command provides a tree of the current file system mounting points. This can be an easier way to read your system's mount point information.

    findmt <options>

### Manipulate your Linux Disk Partition Table

The `fdisk` command is used to create and manipulate your Linux system's disk partition table. Like the `parted` command, the `fdisk` command can change system partitions. However, it can also format your disks. The syntax for this command is as follows:

    fdisk [options] <device name>

To view all your system's disk partitions, use the following command:

    sudo fdisk -l /dev/sda

Your output resembles the following:

{{< output >}}
Disk /dev/sda: 49.5 GiB, 53150220288 bytes, 103809024 sectors
Disk model: QEMU HARDDISK
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
{{</ output >}}

### Determine Disk Space and Partitions

Use the `df` command to view your system's available disk space. This command provides disk space information based on system mount points. The `-h` option makes the output more readable.

    df -h

The command outputs the following information:

{{< output >}}
Filesystem      Size  Used Avail Use% Mounted on
udev            984M     0  984M   0% /dev
tmpfs           200M   21M  180M  11% /run
/dev/sda         49G  1.6G   45G   4% /
tmpfs           998M     0  998M   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           998M     0  998M   0% /sys/fs/cgroup
tmpfs           200M     0  200M   0% /run/user/1000
{{</ output >}}

### Unmount a Disk in Linux

To unmount file system or disk from your system use the `umount` command:

    umount <filesystem>

## File Synchronization and Compression

### Synchronize Files to Local or Remote Destinations

The `rsync` command synchronizes files and directories to local or remote destinations. The syntax for this command is the following:

    rsync <options> <source files> <destination directory>

When `rsync` is used to move files between hosts, `ssh` is used:

    rsync <options> <source location> <username@IP_address>:/<destination directory>

You are prompted to provide valid SSH credentials when synching files to a remote destination.

Some hosts use a SSH port number other than the default port `22`. To use a custom SSH port when connecting to a remote host, use the following command:

    rsync <options> <-e “ssh -p [port#]”> <source location> <username@IP_address>:/<destination directory>

### Archive, Compress, and Extract Files

The `tar` command has numerous versatile options to archive or decompress files. `tar` is an archiving tool that’s descended from the TApe aRchive days. The basic syntax for the `tar` command is as follows:

    tar <options> <source> <destination>

To archive a directory named `example_dir`, use the following command:

    tar -cvf example_dir.tar example_dir/

To extract a tarball, use the following command:

    tar -xzvf example_dir.tar.gz

To compress a file, use the `gzip` command:

    gzip example_dir.tar

## List and Manipulate Linux System Resources

### View System Startup Messages

Upon system startup, processes send status messages that may be useful to understand your system's state or any system problems. Use the `dmesg` command to display the list of system start-up messages:

    sudo dmesg

You may consider filtering the output of the `dmesg` command using the `grep` command. For example:

    sudo dmesg | grep "search term"

### List System Processes and Resources

The `top` command displays Linux system processes and resources. Its information is updated every three seconds. `top` allows you to view data about tasks, processes, and resources used in a single screen. Issue the following command to view your system processes:

    top

Press the **c** key to sort by CPU utilization, and the **m** key to sort by memory utilization. To exit, press the **q** key.

### List All Processes

Linux Processes are instantiated with a process identification number, called a *PID*. You can also use this number to kills a process. The `ps` command below lists **all processes** using standard syntax:

    ps -ef

### Kill a Process

The `kill` command is used to send a signal to an existing system process. Using the `kill` command requires understanding the process and its effect on the system. Killing certain processes can render a Linux system inoperable.

To find the types of signals available to send to a process use the following command:

    kill -l

To use the default message `-15 (TERM)`, which is the most graceful process termination, issue the `kill` command along with the process ID number:

    kill <PID>

### Show IO Stats

The `vmstat` command reports statistics from either the system startup, or the last time the vmstat command was invoked. The statistics include processes, CPU utilization, memory swapped in from disk/block devices, I/O, and system interrupts:

    vmstat

Its output resembles the following:

{{< output >}}
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 0  0      0 858072   7240 933536    0    0     0     3   22   16  0  0 100  0  0
{{</ output >}}

### Show All Files in Use

The `lsof` command shows all files currently in use by your system. Since Linux considers almost everything a file or inode, this can be a long list:

    lsof

You can view all files in use by a specific process ID (PID) with the following command:

    lsof -p -<PID>

### List USB Services

You can view a Linux system's connected USB devices using the `lsusb` command, as follows:

    lsusb

{{< note respectIndent=false >}}
If your system does not have the `lsusb` command installed, use your package manager to install it. For example, to install it on an Ubuntu 20.04 system, use the following command:

    sudo apt-get install usbutils
{{< /note >}}

### Enable Bluetooth

To turn on Bluetooth on a Linux system using systemctl use the following command:

    systemctl enable bluetooth

If enabled, `bluetoothctl` provides interactive control of devices. To find Bluetooth devices use the command below:

    bluetoothctl scan on

To enable host discoverability use the following command:

    bluetoothctl discoverable on

Ensure you use the `bluetoothctl` command to turn off Bluetooth scanning and discoverability.

### Display Discovered PCI Devices

The `lspci` command displays information about a system's PCI busses and devices. PCI stands for *peripheral component interconnect* and is used to add hardware components to a Linux system. There may be more than one bus, and several devices possible in each bus. You can issue the `lspci` command without any options:

    lspci

An example of this command's output is the following:

{{< output >}}
00:00.0 Host bridge: Intel Corporation 82G33/G31/P35/P31 Express DRAM Controller
00:01.0 VGA compatible controller: Device 1234:1111 (rev 02)
00:02.0 SCSI storage controller: Red Hat, Inc Virtio SCSI
00:03.0 SCSI storage controller: Red Hat, Inc Virtio SCSI
00:04.0 Ethernet controller: Red Hat, Inc Virtio network device
00:1f.0 ISA bridge: Intel Corporation 82801IB (ICH9) LPC Interface Controller (rev 02)
00:1f.2 SATA controller: Intel Corporation 82801IR/IO/IH (ICH9R/DO/DH) 6 port SATA Controller [AHCI mode] (rev 02)
00:1f.3 SMBus: Intel Corporation 82801I (ICH9 Family) SMBus Controller (rev 02)
{{</ output >}}

### Show BIOS Information

The `dmidecode` command displays information detected about BIOS settings and inventory:

    dmidecode

{{< note respectIndent=false >}}
The `dmidecode` command cannot change BIOS settings.
{{< /note >}}

## File Manipulation and Directory Navigation

### List Files

The `ls` command lists files in the specified directory. Its syntax is as follows:

    ls [options] <target directory>

If no directory is given, the default is the current directory.

### Create a New File

To create a new and empty file, use the `touch` command:

    touch </path/filename>

For example, to create a new file in your home directory, use the following command:

    touch ~/new_file.txt

### Change the Current Directory

To change to a different directory, use the `cd` command:

    cd <desired_directory_path>

To move up one directory in your file system hierarchy, use the `..` symbol. For example:

    cd ..

This moves you up to the current directory's parent directory.

### Move a File

The `mv` command moves a file to a different directory:

    mv [options] <source_path> <destination_path>

To learn more about the `mv` command see our guide [How to Navigate the Linux Terminal and File System](/docs/guides/linux-navigation-commands/).

### Change File Permissions

The `chmod` command changes the file permissions and executable and symbolic link mask of a file or files. Its basic syntax looks as follows:

    chmod [executable or symbolic file option] [permissions mask] <target_files_location(s)>

You can use both symbolic and octal notation with the `chmod` command. To learn more about the `chmod` command see our guide [Modify File Permissions with chmod](/docs/guides/modify-file-permissions-with-chmod/)

### Delete a File

The `rm` command deletes a file. You should use this command with caution, since you cannot retrieve a file once its removed. The `rm` command's syntax is the following:

    rm [option] <file path>

A commonly used option is `-r` which removes files recursively through the file path.

### Determine a File Location Within the Directory Tree

The `locate` command finds all instances of files matching the provided string argument. Its syntax is the following:

    locate <string>

### Create a Directory

The `mkdir` command creates a new directory in the current path or the one specified. The command looks as follows:

    mkdir <path_and_name>

### Copying a Files and Directories

Files are copied using the `cp` command. Use the following syntax to copy a file from one location to another:

    cp [option] <file_source> <file_destination>

To copy a directory and all of its contents use the `-r` option. For example:

    cp -r example_dir/ ~/backup_example_dir

### Create Symbolic Link to a File

A symbolic link contains a reference to the location of a target object. This allows a *link* to a file from the current directory to the location of the actual file. Its basic syntax resembles the following:

    ln -s <file_link> <source>

## Networking Commands

### View System Network Interfaces

The `ifconfig` command displays your system's network interfaces and their status. Its syntax is as follows:

    ifconfig [options] <interface>

Unless a specific interface is used as an argument, all established interfaces are displayed. Issuing the `ifconfig` command without any options gives you a similar result:

{{< output >}}
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 97.107.139.212  netmask 255.255.255.0  broadcast 97.107.139.255
        inet6 fe80::f03c:92ff:fe34:2eda  prefixlen 64  scopeid 0x20<link>
        inet6 2600:3c03::f03c:92ff:fe34:2eda  prefixlen 64  scopeid 0x0<global>
        ether f2:3c:92:34:2e:da  txqueuelen 1000  (Ethernet)
        RX packets 2396597  bytes 383419419 (365.6 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 201293  bytes 96268341 (91.8 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 5621  bytes 594800 (580.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 5621  bytes 594800 (580.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
{{</ output >}}

### View Network Information

The `netstat` command displays information about your system's network status. Its syntax looks as follows:

    netstat [options]

One common usage of the `netstat` command is to view all open ports on your Linux system.

    netstat -plntu

You see a similar output:

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      17183/mysqld
tcp        0      0 127.0.0.1:587           0.0.0.0:*               LISTEN      14728/sendmail: MTA
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      916/sshd
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      14728/sendmail: MTA
tcp6       0      0 :::80                   :::*                    LISTEN      17255/apache2
tcp6       0      0 :::21                   :::*                    LISTEN      7554/vsftpd
tcp6       0      0 :::22                   :::*                    LISTEN      916/sshd
udp        0      0 0.0.0.0:68              0.0.0.0:*                           390/dhclient
{{</ output >}}

The `netstat` command has many powerful options to view information about different areas of your network. For a deeper dive, view our [Inspecting Network Information with netstat](/docs/guides/inspecting-network-information-with-netstat/).

{{< note respectIndent=false >}}
Some Linux distributions use the `ss` command, a direct replacement for `netstat`.
{{< /note >}}

### Inspect Network Traffic

The `tcpdump` command displays network activity for the default, or a specific network interface device:

    sudo tcpdump [options] <optional_specific_network_interface>

The `tcpdump` command displays a continues output of all network packets unless you interrupt the command with **ctrl+c**.

### Determine if a Host Is Reachable

The `ping` command uses ICMP messaging to determine if a host is reachable. If a host cannot be found by DNS name, DNS may be unavailable. If an IP address cannot be reached, then a route is unavailable. The syntax for the `ping` command is as follows:

    ping <hostname_or_IP_address>

## Conclusion

These basic Linux commands work in any shell on any Linode Linux edition, no matter the distribution family. To reference more in-depth information about common Linux commands, browse our [documentation library](/docs/).
