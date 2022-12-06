---
slug: check-and-clean-linux-disk-space
author:
  name: Nathaniel Stickman
description: 'This guide will show you how to check the used space and free up additional disk space on your system by using the Linux command line and the df and du commands.'
keywords: ['linux disk space','linux check disk space','linux free disk space']
tags: ['linux', 'debian', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
image: HowtoCheckandCleanaLinuxSystemsDiskSpace.jpg
modified_by:
  name: Nathaniel Stickman
title: "Check and Clean a Linux System's Disk Space"
h1_title: "How to Check and Clean a Linux System's Disk Space"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

Linux provides several built-in commands for analyzing and cleaning up your system's disk space. This guide shows you how to use those commands to get a closer look at your disk usage and start freeing up space.

## How Do I Check Disk Space on Linux?

Linux systems have two commands readily available for checking your disk space. These commands provide a high-level view of your whole system's available disk space and the disk usage within particular directories.

### How to Check Linux Disk Space with the df Command

Use the `df` command to view your system's available disk space for each drive.

    sudo df

{{< output >}}
Filesystem     1K-blocks    Used Available Use% Mounted on
udev             4031204       0   4031204   0% /dev
tmpfs             815276     952    814324   1% /run
/dev/sda       164619468 3091188 153149572   2% /
tmpfs            4076368       0   4076368   0% /dev/shm
tmpfs               5120       0      5120   0% /run/lock
tmpfs            4076368       0   4076368   0% /sys/fs/cgroup
tmpfs             815272       0    815272   0% /run/user/1000
{{< /output >}}

The `df` command (short for "disk free") shows each drive's disk size, space used, and free space. Each "block" in the above output represents one kilobyte.

To make the output from `df` easier to read, you can add the `-h` option. This option displays disk space in kilobytes (K), megabytes (M), and gigabytes (G).

    sudo df -h

{{< output >}}
Filesystem      Size  Used Avail Use% Mounted on
udev            3.9G     0  3.9G   0% /dev
tmpfs           797M  952K  796M   1% /run
/dev/sda        157G  3.0G  147G   2% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           3.9G     0  3.9G   0% /sys/fs/cgroup
tmpfs           797M     0  797M   0% /run/user/1000
{{< /output >}}

You can also use the `df` command to target a specific drive, using either its "Filesystem" or "Mounted on" description from the columns above.

    sudo df -h /dev/sda

{{< output >}}
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda        157G  3.0G  147G   2% /
{{< /output >}}

The above command is equivalent to `sudo df -h /`.

### How to Check Linux Disk Space with the du Command

Use the `du` command to analyze disk space at a more granular level. This command summarizes the space usage for a specified directory or the current directory if none is specified.

    sudo du /etc/systemd

{{< output >}}
4 /etc/systemd/system/sockets.target.wants
4 /etc/systemd/system/sysinit.target.wants
4 /etc/systemd/system/timers.target.wants
4 /etc/systemd/system/multi-user.target.wants
100 /etc/systemd/system
16 /etc/systemd/network
4 /etc/systemd/user/sockets.target.wants
8 /etc/systemd/user
164 /etc/systemd
{{< /output >}}

The `du` command lists all of the files and directories in the target directory and displays their disk usage in kilobytes.

The last entry in the list is always the target directory itself, giving you a summary of the directory's disk usage. You can isolate disk space information for the target directory by using the `-s` option. This is a useful option for directories with many files and subdirectories.

    sudo du -s /

{{< output >}}
4129183 /
{{< /output >}}

As with the `df` command, you can make the output easier to read with the `-h` option. This causes the disk space to be displayed in kilobytes (K), megabytes (M), and gigabytes (G). In the example below, the `-h` option is used in combination with the `-s` option.

    sudo du -sh /etc

{{< output >}}
5.2M /etc
{{< /output >}}

## How Do I Clean Disk Space on Linux?

You may need to clean your disk space on Linux because you need space to install additional software. Another reason may be that you received a warning that your system's disk space is critically low. It is likely that at some point you may need to free up disk space on your Linux system.

The best place to start is usually with your Linux package manager. Each package manager offers options to quickly and easily clear out space from unused or unnecessary packages and related data.

### How to Remove Unnecessary Packages

Most major package managers include an `autoremove` command. This command automatically removes packages that are no longer in use. These packages are typically ones that were originally installed as dependencies for other packages.

With Debian and Ubuntu distributions, you can use APT's version of the command:

    sudo apt autoremove

Likewise, on AlmaLinux and CentOS, you can use the command with `yum`:

    sudo yum autoremove

And the same applies to Fedora's DNF package manager:

    sudo dnf autoremove

### How to Clear the Package Cache

Linux package managers generally also include a `clean` command. This command clears the cache used by the package manager. It can also be a helpful command if you are having package errors due to corrupted metadata.

For Debian and Ubuntu, use the command below.

    sudo apt clean

APT also has an `autoclean` command. This command clears the cache for outdated packages that can no longer be downloaded from APT's repositories.

    sudo apt autoclean

Both YUM and DNF require you to specify what you want to be cleared from the cache. The most helpful options are `metadata`, `packages`, and `all`. As an example, here is the YUM command for clearing all of the cached data.

    sudo yum clean all

### How to List and Remove Unwanted Packages

If you still need space, you may want to look at your installed packages and start deciding which ones you no longer need.

1. List the packages you have installed.

    - For Debian and Ubuntu, use the `apt` command below:

            sudo apt list --installed

    - For AlmaLinux and CentOS, use the below `yum` command:

            sudo yum list installed

    - On Fedora, the command is similar to the YUM command; simply replace `yum` with `dnf`.

1. Uninstall each package that you no longer need or want on your system. In the following examples, replace `nginx` with the name of the package to be removed.

    - Uninstall a package with the `apt` command:

            sudo apt remove nginx

    - Uninstall a package with the `yum` command:

            sudo yum remove nginx

    - Uninstall a package with the `dnf` command:

            sudo dnf remove nginx

    {{< note >}}
Before removing packages, ensure that they are not required by the system. Usually, you can safely remove packages that you installed, but be cautious of removing packages that you do not recognize.
    {{< /note >}}

## Next Steps

Still looking for more disk space? You may want to think about getting additional space for your Linux system. You can follow our [Resizing a Linode](/docs/guides/resizing-a-linode/) guide to learn how to increase your Linode's plan size.
