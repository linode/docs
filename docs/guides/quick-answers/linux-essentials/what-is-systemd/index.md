---
slug: what-is-systemd
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides you with an introduction to systemd, a Linux initialization system and service monitor daemon, as well as systemd unit files.'
keywords: ['systemd','linux', 'init', 'unit files']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-09-12
modified: 2018-09-12
modified_by:
  name: Linode
title: "What is systemd?"
contributor:
  name: Linode
external_resources:
- '[systemd Wiki](https://www.freedesktop.org/wiki/Software/systemd/)'
- '[systemd GitHub](https://github.com/systemd/systemd)'
tags: ["linux"]
aliases: ['/quick-answers/linux-essentials/what-is-systemd/']
---

systemd is a Linux initialization system and service manager that includes features like on-demand starting of daemons, mount and automount point maintenance, snapshot support, and processes tracking using Linux control groups. systemd provides a logging daemon and other tools and utilities to help with common system administration tasks.

[Lennart Poettering](http://0pointer.de/blog/projects/systemd.html) and [Kay Sievers](https://en.wikipedia.org/wiki/Kay_Sievers) wrote systemd, inspired by macOS's [launchd](https://en.wikipedia.org/wiki/Launchd) and [Upstart](http://upstart.ubuntu.com/), with the goal of creating a modern and dynamic system. Notably, systemd provides aggressive parallelization capabilities and dependency-based service control logic, allowing for services to start in parallel and leading to a quicker boot time. These two aspects were present in Upstart, but improved upon by systemd.

systemd is the default init system for the major Linux distributions but is backwards compatible with SysV init scripts. SysVinit is an initialization system which predates systemd and uses a simplified approach to service startup. systemd not only manages system initialization, but also provides alternatives for other well known utilities, like cron and syslog. Because systemd does several things within the Linux user space, many have criticized it for violating [the Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), which emphasizes simplicity and modularity.

This guide provides an introduction to systemd by taking a closer look at systemd units. The [Mount Units](/docs/quick-answers/linux-essentials/what-is-systemd/#mount-units) section will analyze a unit file that is shipped by default with systemd on an Ubuntu 18.04 system, while the [Timer Units](/docs/quick-answers/linux-essentials/what-is-systemd/#timer-units) section will create a custom unit file on the same system.

{{< note >}}
All examples in this guide were created with a Linode running Ubuntu 18.04.
{{</ note >}}

## The Linux Boot Process and systemd

To better understand what is meant by an initialization system, this section provides a high-level overview of the Linux boot process.

Linux requires an initialization system during its boot and startup process. At the end of the [boot process](https://en.wikipedia.org/wiki/Linux_startup_process), the Linux kernel loads systemd and passes control over to it and the startup process begins. During this step, the kernel initializes the first [user space](https://en.wikipedia.org/wiki/User_space) process, the systemd init process with process ID 1, and then goes idle unless called again. systemd prepares the [user space](https://en.wikipedia.org/wiki/User_space) and brings the Linux host into an operational state by starting all other processes on the system.

Below is a simplified overview of the entire Linux boot and startup process:

1. The system powers up.
   The BIOS does minimal hardware initialization and hands over control to the boot loader.
1. The boot loader calls the kernel.
1. The kernel loads an initial RAM disk that loads the system drives and then looks for the root file system.
1. Once the kernel is set up, it begins the systemd initialization system.
1. systemd takes over and continues to mount the host's file systems and start services.

## systemd Units

systemd introduces the concept of *systemd units* and there are several types, such as a *service unit*, *mount unit*, *socket unit* and *slice unit*. Units are defined in unit configuration files, which include information about the unit type and its behavior.

Expand the note below for a comprehensive list of all available systemd unit types.

{{< disclosure-note "systemd Unit Types">}}

| Unit Type | File Extension | Description |
| --------- | -------------- | ----------- |
| Service unit | `.service` | A system service. |
| Target unit | `.target` | A group of systemd units. |
| Automount unit | `.automount` | A file system automount point. |
| Device unit | `.device` |	A device file recognized by the kernel. |
| Mount unit |`.mount` | A file system mount point. |
| Path unit | `.path` |	A file or directory in a file system. |
| Scope unit | `.scope`	| An externally created process. |
| Slice unit | `.slice`	| A group of hierarchically organized units that manage system processes. |
| Snapshot unit | `.snapshot`| A saved state of the systemd manager. |
| Socket unit |	`.socket` | An inter-process communication socket. |
| Swap unit | `.swap` |	A swap device or a swap file. |
| Timer unit | `.timer` | A systemd timer. |

{{</ disclosure-note >}}

For most distributions using systemd, unit files are stored in the following directories:

- The `/usr/lib/systemd/user/` directory is the default location where unit files are installed by packages. Unit files in the default directory should not be altered.
- The `/run/systemd/system/` directory is the runtime location for unit files.
- The `/etc/systemd/system/` directory stores unit files that extend a service. This directory will take precedence over unit files located anywhere else in the system.

### Mount Units

This section will take a closer look at a mount unit configuration file to provide a better understanding of the structure of systemd unit files. You will also use systemd utilities to discover information about the running Linode mount units.

A mount unit configuration file contains information about a file system mount point that is controlled and supervised by systemd. To find the existing mount units on your Linode, use the `systemctl` tool to view a complete list:

    systemctl list-units --type=mount

Your output will display each mount unit that is currently active:

    UNIT                          LOAD   ACTIVE SUB     DESCRIPTION
    -.mount                       loaded active mounted Root Mount
    dev-hugepages.mount           loaded active mounted Huge Pages File System
    dev-mqueue.mount              loaded active mounted POSIX Message Queue File System
    proc-sys-fs-binfmt_misc.mount loaded active mounted Arbitrary Executable File Formats File S
    run-user-1000.mount           loaded active mounted /run/user/1000
    sys-fs-fuse-connections.mount loaded active mounted FUSE Control File System
    sys-kernel-config.mount       loaded active mounted Kernel Configuration File System
    sys-kernel-debug.mount        loaded active mounted Kernel Debug File System
    var-lib-lxcfs.mount           loaded active mounted /var/lib/lxcfs

    LOAD   = Reflects whether the unit definition was properly loaded.
    ACTIVE = The high-level unit activation state, i.e. generalization of SUB.
    SUB    = The low-level unit activation state, values depend on unit type.

    9 loaded units listed. Pass --all to see loaded but inactive units, too.
    To show all installed unit files use 'systemctl list-unit-files'.

To view information about a specific mount unit, use the `systemctl status` command with the unit's name:

    systemctl status sys-fs-fuse-connections.mount


`Systemctl` will provide information that resembles the example output. This example displays a single entry for the FUSE Control File System mount point:

    ● sys-fs-fuse-connections.mount - FUSE Control File System
    Loaded: loaded (/lib/systemd/system/sys-fs-fuse-connections.mount; static; vendor preset: enabled)
    Active: active (mounted) since Wed 2018-08-29 18:34:43 UTC; 21h ago
        Where: /sys/fs/fuse/connections
        What: fusectl
        Docs: https://www.kernel.org/doc/Documentation/filesystems/fuse.txt
            https://www.freedesktop.org/wiki/Software/systemd/APIFileSystems
        Tasks: 0 (limit: 2320)
    CGroup: /system.slice/sys-fs-fuse-connections.mount


The `systemctl` output provides the location of the mount unit configuration file, along with information on the state of the mount, location of the mount, links to documentation, running tasks, and its corresponding CGroup. Many of these details are defined in the mount unit's configuration file.

[FUSE](http://libfuse.github.io/doxygen/) is a file system framework that provides an interface for user space programs to export a virtual file system to the Linux kernel. It can also be used to provide data access with a file system directory structure and file operations to any object.

Inspect the contents of the FUSE control file system's mount unit configuration file with systemctl:

    systemctl cat sys-fs-fuse-connections.mount

You will see a similar output:

    [Unit]
    Description=FUSE Control File System
    Documentation=https://www.kernel.org/doc/Documentation/filesystems/fuse.txt
    Documentation=https://www.freedesktop.org/wiki/Software/systemd/APIFileSystems
    DefaultDependencies=no
    ConditionPathExists=/sys/fs/fuse/connections
    ConditionCapability=CAP_SYS_ADMIN
    ConditionVirtualization=!private-users
    After=systemd-modules-load.service
    Before=sysinit.target

    [Mount]
    What=fusectl
    Where=/sys/fs/fuse/connections
    Type=fusectl


All unit files must contain a `[Unit]` section that outlines generalized options, dependencies and conditions for the unit. The example mount unit file contains some of the following options:

- There are no service dependencies for this mount unit, indicated by `DefaultDependencies=no`. However, `ConditionPathExists` denotes that the directory `/sys/fs/fuse/connections` must exist before the mount unit is started. This condition is necessary, since under the FUSE control file system each connection will have it's own directory in this location.
- The name of a mount unit file must correspond to the mount point directories it controls, which is why this particular mount unit configuration file is named `sys-fs-fuse-connections.mount`.

A mount unit file must contain a `[Mount]` section. The example mount unit file has the following options:

- The `What` option, which can be a partition name, path or UUID to mount.
- The `Where` option declares an absolute path to a mount point. If the mount point does not exist, it will be created.
- The `Type` option denotes the file system type.

{{< note >}}
The official systemd manual notes that configuring mount points through `/etc/fstab` is the recommended approach. systemd has a `system-fstab-generator` that translates the information in the fstab file into systemd mount and swap units at runtime.
{{</ note >}}

There are many other unit file types available in systemd. Read the [Use systemd to Start a Linux Service at Boot](/docs/guides/start-service-at-boot/) guide to become more familiar with the service unit type.

### Timer Units

You can use systemd timer unit files to automate tasks, similarly to how [cron jobs](/docs/guides/schedule-tasks-with-cron/) are used. However, with timer units you will also have access to systemd's powerful logging capabilities.

To better understand systemd timer units, this section will outline how a timer unit can be used to create periodic backups for a mysql database.

You will need three separate files:

- A script that will execute and create a backup for a MySQL database located in the `/usr/local/bin/` directory.
- A service unit file, that will handle running the script.
- A timer unit file, which will define when and how often the service will initialize.

{{< note >}}
Your script, service unit file, and timer unit file should all have `644` read and write permissions.
{{</ note >}}

Below is the script that creates a backup `.sql` file named for a database named `testdb`. The script will append a date and timestamp to the file name:

{{< file "/usr/local/bin/my-db-backup.sh" bash >}}
#!/bin/sh

stamp=$(date "+%y-%m-%d-%H-%M")
/usr/bin/mysqldump testdb > ~/backups/my-db-backup-${stamp}.sql
{{</ file >}}

To bypass being prompted for a MySQL username and password, create a `.my.cnf` file in your home directory with your MySQL credentials.

{{< file "~/.my.cnf">}}
[mysqldump]
user=mysqluser
password=mypassword
{{</ file >}}

The service unit file is located in the `/etc/systemd/system/` directory and contains the following information:

{{< file "/etc/systemd/system/my-db-backup.service">}}
[Unit]
Description=A script to backup mysql database named testdb

[Service]
# The location of the mysql backup script
ExecStart=/usr/local/bin/my-db-backup.sh
{{</ file >}}

The timer unit file is located in the same directory as the service unit file with the same name, but with the `.timer` extension instead. The unit file contains the following options:

{{< file "/etc/systemd/system/my-db-backup.timer">}}
[Unit]
Description=Runs my-db-backup.sh every hour

[Timer]
# Amount of time to wait after booting before the service runs for the first time
OnBootSec=10min
# The time between running each consecutive timer
OnUnitActiveSec=1h
# Name of the service file that will be called
Unit=my-db-backup.service

[Install]
# Defines which service triggers the custom service on boot
WantedBy=multi-user.target
{{</ file >}}

When creating unit files, you can verify the correctness of the file with the following systemd command:

    systemd-analyze verify /etc/systemd/system/my-db-backup.timer

systemd's `system-analyze` command provide several other useful analyze and debug options. View the [official documentation](https://www.freedesktop.org/software/systemd/man/systemd-analyze.html) for more options.

When you enable the timer, systemd will hook the timer unit into the specified places and ensure it starts on boot. Enable the timer unit with following command:

    systemctl enable my-db-backup.timer

When you start the timer unit, systemd will start it right away. To do this, issue the following command:

    systemctl start my-db-backup.timer

## systemd Tools

systemd makes common system administration tasks easier to manage with its `systemctl` and `journalctl` commands. `systemctl` can be used to gather detailed information about the overall state of your server and any individual unit type. It can stop and start the server and modify the system state. In the Timer Unit Files section `systemctl` is used to enable and start an individual timer unit. systemd can be used in a similar way for any unit.

Read our *[Introduction to systemctl](/docs/guides/introduction-to-systemctl/)* guide for a deeper dive into this systemd tool.

systemd's `journalctl` tool provides a centralized process and system logging tool. This command allows you to query the systemd journal, which creates and maintains indexed journals from logging information that is pooled from different areas within the system; areas like standard output and standard error of service units, log messages via syslog, and kernel log messages. In this way, system administrators can use a single tool to monitor and debug a server.

To learn some commonly used `journalctl` commands, see our guide *[Use journalctl to View Your System's Logs](/docs/guides/how-to-use-journalctl/)*.
