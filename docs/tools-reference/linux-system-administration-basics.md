---
author:
  name: Linode
  email: docs@linode.com
description: 'Troubleshooting tips, basic Linux commands, and software usage suggestions for beginner Linux system administrators.'
keywords: ["linux tips", "linux beginners", "systems administration", "admin", "linux", "mail", "http", "troubleshooting"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['using-linux/administration-basics/']
modified: 2016-10-05
modified_by:
  name: Linode
published: 2009-12-13
title: Linux System Administration Basics
---

This guide presents a collection of common issues and useful tips for Linux system administration. Whether you're new to system administration or have been maintaining systems for some time, we hope this collection of basic Linux commands will help you manage your system from the command line.

![Linux System Administration Basics](/docs/assets/linux-system-administration-basics.png)

## Basic Configuration

These tips cover some of the basic steps and issues encountered during the beginning of system configuration. We provide a general [Getting Started guide](/docs/getting-started) for your convenience if you're new to Linode and basic Linux system administration. Additionally, you may find our [Introduction to Linux Concepts guide](/docs/tools-reference/introduction-to-linux-concepts) useful.

### Set the Hostname

Please follow our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). You can use the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

### Set the Time Zone

When setting the time zone of your server, it may be best to use the time zone of the majority of your users. If you're not sure which time zone would be best, consider using Universal Coordinated Time or UTC (i.e., Greenwich Mean Time).

By default, Linodes are set to UTC. Many operating systems provide built-in, interactive methods for changing time zones:

#### Set the Time Zone in Debian or Ubuntu

Issue the following command and answer the questions as prompted on the screen:

    dpkg-reconfigure tzdata

#### Set the Time Zone in CentOS 7 or Arch Linux

1. View the list of available time zones:

        timedatectl list-timezones

    Use the `Up`, `Down`, `Page Up` and `Page Down` keys to navigate to the correct zone. Remember it, write it down or copy it as a mouse selection. Then press **q** to exit the list.

2. Set the time zone (change `America/New_York` to the correct zone):

        timedatectl set-timezone 'America/New_York'

#### Set the Time Zone Manually on a Linux System

Find the appropriate zone file in `/usr/share/zoneinfo/` and link that file to `/etc/localtime`. See the examples below for possibilities:

Universal Coordinated Time:

    ln -sf /usr/share/zoneinfo/UTC /etc/localtime

Eastern Standard Time:

    ln -sf /usr/share/zoneinfo/EST /etc/localtime

American Central Time (including Daylight Savings Time):

    ln -sf /usr/share/zoneinfo/US/Central /etc/localtime

American Eastern Time (including Daylight Savings Time):

    ln -sf /usr/share/zoneinfo/US/Eastern /etc/localtime

### Configure the /etc/hosts File

The `/etc/hosts` file provides a list of IP addresses with corresponding hostnames. This allows you to specify hostnames for an IP address in one place on the local machine, and then have multiple applications connect to external resources via their hostnames. The system of host files precedes [DNS](/docs/networking/dns/dns-records-an-introduction/), and hosts files are *always* checked before DNS is queried. As a result, `/etc/hosts` can be useful for maintaining small "internal" networks, for development purposes, and for managing clusters.

Some applications require that the machine properly identify itself in the `/etc/hosts` file. As a result, we recommend configuring the `/etc/hosts` file shortly after deployment. Here is an example file:

{{< file-excerpt "/etc/hosts" >}}
127.0.0.1   localhost.localdomain   localhost
103.0.113.12    username.example.com   username

{{< /file-excerpt >}}


You can specify a number of hostnames on each line separated by spaces. Every line must begin with one and only one IP address. In the above example, replace `103.0.113.12` with your machine's IP address. Consider a few additional `/etc/hosts` entries:

{{< file-excerpt "/etc/hosts" >}}
198.51.100.30   example.com
192.168.1.1     stick.example.com

{{< /file-excerpt >}}


In this example, all requests for the `example.com` hostname or domain will resolve to the IP address `198.51.100.30`, which bypasses the DNS records for `example.com` and returns an alternate website.

The second entry tells the system to look to `192.168.1.1` for the domain `stick.example.com`. These kinds of host entries are useful for using "private" or "back channel" networks to access other servers in a cluster without needing to send traffic on the public network.

## Network Diagnostics

In this section, we'll review some basic Linux commands that will help you assess and diagnose network problems. If you suspect connectivity issues, adding the output from the relevant commands to your [support ticket](/docs/platform/support) can help our staff diagnose your issue. This is particularly helpful in cases where networking issues are intermittent.

### The ping Command

The `ping` command tests the connection between the local machine and a remote address or machine. The following commands "ping" `google.com` and `216.58.217.110`:

    ping google.com
    ping 216.58.217.110

These commands send a small amount of data (an ICMP packet) to the remote host and wait for a response. If the system is able to make a connection, it will report on the "round trip time" for every packet. Here is the sample output of four pings to google.com:

    PING google.com (216.58.217.110): 56 data bytes
    64 bytes from 216.58.217.110: icmp_seq=0 ttl=54 time=14.852 ms
    64 bytes from 216.58.217.110: icmp_seq=1 ttl=54 time=16.574 ms
    64 bytes from 216.58.217.110: icmp_seq=2 ttl=54 time=16.558 ms
    64 bytes from 216.58.217.110: icmp_seq=3 ttl=54 time=18.695 ms
    64 bytes from 216.58.217.110: icmp_seq=4 ttl=54 time=25.885 ms

The `time` field specifies in milliseconds the duration of the round trip for an individual packet. When you've gathered the amount of information you need, use **Control+C** to interrupt the process. You'll be presented with some statistics once the process is stopped. This will resemble:

    --- google.com ping statistics ---
    4 packets transmitted, 4 received, 0% packet loss, time 3007ms
    rtt min/avg/max/mdev = 33.890/40.175/53.280/7.679 ms

There are several important data points to notice:

-   *Packet Loss*, or the discrepancy between the number of packets sent and the number of packets that return successfully. This number shows the percentage of packets that are dropped.
-   *Round Trip Time* (rtt) statistics on the final line report information about all the ping responses. For this ping we see that the fastest packet round trip (min) took 33.89 milliseconds. The average round trip (avg) took 40.175 milliseconds. The longest packet (max) took 53.28 milliseconds. A single standard deviation unit (mdev) for these four packets is 7.67 milliseconds.

The ping command is useful as an informal diagnostic tool to measure point-to-point network latency, and as a tool to simply ensure you are able to make a connection to a remote server.

### The traceroute Command

The `traceroute` command expands on the functionality of the [ping](#the-ping-command) command. It provides a report on the path that the packets take to get from the local machine to the remote machine. Each step (intermediate server) in the path is called a *hop*. Route information is useful when troubleshooting a networking issue: if there is packet loss in one of the first few hops the problem is often related to the user's local area network (LAN) or Internet service provider (ISP). By contrast, if there is packet loss near the end of the route, the problem may be caused by an issue with the server's connection.

Here is an example of output from a `traceroute` command:

    traceroute to google.com (74.125.53.100), 30 hops max, 40 byte packets
    1 207.192.75.2 (207.192.75.2) 0.414 ms 0.428 ms 0.509 ms
    2 vlan804.tbr2.mmu.nac.net (209.123.10.13) 0.287 ms 0.324 ms 0.397 ms
    3 0.e1-1.tbr2.tl9.nac.net (209.123.10.78) 1.331 ms 1.402 ms 1.477 ms
    4 core1-0-2-0.lga.net.google.com (198.32.160.130) 1.514 ms 1.497 ms 1.519 ms
    5 209.85.255.68 (209.85.255.68) 1.702 ms 72.14.238.232 (72.14.238.232) 1.731 ms 21.031 ms
    6 209.85.251.233 (209.85.251.233) 26.111 ms 216.239.46.14 (216.239.46.14) 23.582 ms 23.468 ms
    7 216.239.43.80 (216.239.43.80) 123.668 ms 209.85.249.19 (209.85.249.19) 47.228 ms 47.250 ms
    8 209.85.241.211 (209.85.241.211) 76.733 ms 216.239.43.80 (216.239.43.80) 73.582 ms 73.570 ms
    9 209.85.250.144 (209.85.250.144) 86.025 ms 86.151 ms 86.136 ms
    10 64.233.174.131 (64.233.174.131) 80.877 ms 216.239.48.34 (216.239.48.34) 76.212 ms 64.233.174.131 (64.233.174.131) 80.884 ms
    11 216.239.48.32 (216.239.48.32) 81.267 ms 81.198 ms 81.186 ms
    12 216.239.48.137 (216.239.48.137) 77.478 ms pw-in-f100.1e100.net (74.125.53.100) 79.009 ms 216.239.48.137 (216.239.48.137) 77.437 ms

Often the hostnames and IP addresses on either side of a failed jump are useful in determining who operates the machine where the routing error occurs. Failed jumps are designated by lines with three asterisks (`* * *`).

Adding `traceroute` output to [Linode support](/docs/platform/support/) tickets is sometimes useful when trying to diagnose network issues. You may also want to forward `traceroute` information to your Internet Service Provider (ISP) if you suspect that the connectivity issue is with your ISP's network. Recording `traceroute` information is particularly useful if you are experiencing an intermittent issue.

### The mtr Command

The `mtr` command, like the [traceroute](#the-traceroute-command) tool, provides information about the route that internet traffic takes between the local system and a remote host. However, `mtr` provides additional information about the round trip time for the packet. In a way, you can think of `mtr` as a combination of traceroute and ping.

Here is an example of output from an `mtr` command:

    HOST: username.example.com              Loss%   Snt     Last    Avg     Best    Wrst    StDev
        1.  256.129.75.4                    0.0%    10      0.4     0.4     0.3     0.6     0.1
        2.  vlan804.tbr2.mmu.nac.net        0.0%    10      0.3     0.4     0.3     0.7     0.1
        3.  0.e1-1.tbr2.tl9.nac.net         0.0%    10      4.3     4.4     1.3     11.4    4.1
        4.  core1-0-2-0.lga.net.google.com  0.0%    10      64.9    11.7    1.5     64.9    21.2
        5.  209.85.255.68                   0.0%    10      1.7     4.5     1.7     29.3    8.7
        6.  209.85.251.9                    0.0%    10      23.1    35.9    22.6    95.2    27.6
        7.  72.14.239.127                   0.0%    10      24.2    24.8    23.7    26.1    1.0
        8.  209.85.255.190                  0.0%    10      27.0    27.3    23.9    37.9    4.2
        9.  gw-in-f100.1e100.net            0.0%    10      24.1    24.4    24.0    26.5    0.7

Like the `ping` command, `mtr` tracks the speed of the connection in real time until you exit the program with **CONTROL+C**. To have `mtr` stop automatically and generate a report after ten packets, use the `--report` flag:

    mtr --report

Be aware that `mtr` will pause for a few moments while generating output. For more information regarding `mtr` consider our [diagnosing network issues with mtr](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) guide.

## System Diagnostics

If you're having an issue with your Linode that is neither related to [networking](#network-diagnostics) nor another application issue, it may help to rule out "hardware" and operating system level issues. Use the following tools to better diagnose and resolve these.

If you determine that you have a problem with memory usage, refer to our guide on [resolving memory usage issues](/docs/troubleshooting/troubleshooting-memory-and-networking-issues/). Use the following tools and approaches to determine the specific cause of your troubles.

### Check Current Memory Usage

To see how much memory your system is currently using:

    free -m

On a Linode 2GB under moderate use, the output should resemble the following:

                 total       used       free     shared    buffers     cached
    Mem:          1999        954       1044        105         34        703
    -/+ buffers/cache:        216       1782
    Swap:          255          0        255

This output takes a bit of careful reading to interpret. Out of a total 1999 megabytes of memory (RAM), the system is using 954 megabytes and has 1044 megabytes free. *However*, the system also has 703 megabytes of "stale" data buffered and stored in cache. The operating system will "drop" the caches if it needs the space, but retains the cache if there is no other need for the space. It is normal for a Linux system to leave old data in RAM until the space is needed, so don't be alarmed if only a small amount of memory is "free."

In the above example, there are 1782 megabytes of memory that are actually *free*. This means 1782 megabytes are available to your system when you start an additional process or a running application needs more memory.

### Monitor I/O Usage with vmstat

The `vmstat` tool provides information about memory, swap utilization, I/O wait, and system activity. It is particularly useful for diagnosing I/O-related issues.

If you think you're having an I/O issue then run the following command:

    vmstat 1 20

This runs a vmstat every second, twenty times, giving a sample of the current state of the system. The output generated resembles the following:

    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
     r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
     0  0      4  32652  47888 110824    0    0 0     2   15   15  0  0 100  0
     0  0      4  32644  47888 110896    0    0 0     4  106  123  0  0 100  0
     0  0      4  32644  47888 110912    0    0 0     0   70  112  0  0 100  0
     0  0      4  32644  47888 110912    0    0 0     0   92  121  0  0 100  0
     0  0      4  32644  47888 110912    0    0 0    36   97  136  0  0 100  0
     0  0      4  32644  47888 110912    0    0 0     0   96  119  0  0 100  0
     0  0      4  32892  47888 110912    0    0 0     4   96  125  0  0 100  0
     0  0      4  32892  47888 110912    0    0 0     0   70  105  0  0 100  0
     0  0      4  32892  47888 110912    0    0 0     0   97  119  0  0 100  0
     0  0      4  32892  47888 110912    0    0 0    32   95  135  0  0 100  0
     0  0      4  33016  47888 110912    0    0 0     0   75  107  0  0 100  0
     0  0      4  33512  47888 110912    0    0 0    24  113  134  0  0 100  0
     0  0      4  33512  47888 110912    0    0 0     0  175  244  0  0 100  0
     0  0      4  33512  47888 110912    0    0 0     0   92  148  0  0 100  0
     0  0      4  33512  47888 110912    0    0 0     0  114  162  0  0 100  0
     0  0      4  33512  47888 110912    0    0 0    36  100  157  0  0 100  0
     0  0      4  33388  47888 110912    0    0 0     0  116  166  0  0 100  0
     0  0      4  33388  47888 110912    0    0 0     0   97  157  0  0 100  0
     0  0      4  33388  47888 110912    0    0 0     0   89  144  0  0 100  0
     0  0      4  33380  47888 110912    0    0 0     0  181  185  0  0 99  0

The memory and swap columns provide the same kind of information provided by the "[free -m](#check-current-memory-usage)" command, albeit in a slightly harder to understand format. The most relevant information produced by this command is the `wa` column, which is the final column in most implementations. This field displays the amount of time the CPU spends waiting for I/O operations to complete.

If this number is consistently and considerably higher than 0, you might consider taking measures to address your IO usage. However, if the `vmstat` output resembles the above, you can be sure in the knowledge that you're not experiencing an IO-related issues.

If you are experiencing an intermittent issue, you will need to run `vmstat` *when* you experience the issue in order to properly diagnose or rule out an I/O issue. `vmstat` output can sometimes help [support](/docs/platform/support/) diagnose problems.

### Monitor Processes, Memory, and CPU Usage with htop

If you want a more organized, real-time view of the current state of your system, we recommend a tool called `htop`. This is not installed by default on most systems. To install `htop`, issue one of the following commands, depending on which distribution you use:

    apt-get install htop
    yum install htop
    pacman -S htop
    emerge sys-process/htop

To start the program:

    htop

You can quit at any time by pressing the `F10` or `Q` keys. There are a couple of `htop` behaviors that may not be initially intuitive. Take note of the following:

-   The memory utilization graph displays used memory, buffered memory, and cached memory. The numbers displayed at the end of this graph reflect the total amount of memory available and the total amount memory on the system as reported by the kernel.
-   The default configuration of `htop` presents all application threads as independent processes, which may not be clear if you're not aware of it. You can disable this by selecting the "setup" option with `F2`, then "Display Options," and then toggling the "Hide userland threads" option.
-   You can toggle a "Tree" view with the `F5` key that displays the processes in a hierarchy and shows which processes were spawned by other processes in an organized format. This is helpful in diagnosing a problem when you're having trouble distinguishing among processes.

## File System Management

Web developers and editors often use the FTP protocol to transfer and manage files on a remote system. FTP, however, is very insecure and inefficient for managing the files on a system when you have SSH access.

If you're new to Linux systems administration, consider our "[Tools & Reference](/docs/tools-reference/)" section and articles including: [installing and using WinSCP](/docs/networking/file-transfer/transfer-files-winscp), [using rsync to synchronize files](/docs/linux-tools/utilities/rsync) and [using SSH and the terminal](/content/using-linux/using-the-terminal).

{{< caution >}}
If you are giving other users access to upload files to your server, consider the [security implications](/docs/security/basics) of all additional access that you grant to third parties.
{{< /caution >}}

### Upload Files to a Remote Server

If you're used to using an FTP client, OpenSSH (which is included and active with all of the Linode distribution images) allows you to use an FTP-like interface over the SSH protocol. Known as "SFTP," many clients support this protocol, including [WinSCP](/docs/networking/file-transfer/transfer-files-winscp) for Windows, [Cyberduck](/docs/networking/file-transfer/transfer-files-cyberduck) for Mac OS X, and [Filezilla](/docs/tools-reference/file-transfer/filezilla) for Linux, OS X, and Windows desktops.

If you are accustomed to FTP, SFTP will be very familiar to you. By default, whatever access a user has to a file system at the command line, that user will also have over SFTP. Consider the implications of [file permissions](/docs/tools-reference/linux-users-and-groups) when configuring user access.

You can also use Unix utilities including `scp` and [rsync](/docs/linux-tools/utilities/rsync) to securely transfer files to your Linode. On a local machine, a command to copy `team-info.tar.gz` would look like:

    scp team-info.tar.gz username@hostname.example.com:/home/username/backups/

The command, `scp`, is followed by the path of the file on the local file system to be transferred. Next, the username and hostname of the remote machine follow, separated by an "at" sign (`@`). Follow the hostname with a colon (`:`) and the path on the remote server to where the file should be uploaded. Using a more generalized example:

    scp [/path/to/local/file] [remote-username]@[remote-hostname]:[/path/to/remote/file]

This command is available by default on OS X and Linux machines. You can use it to copy files to a Linode, as well as between remote servers. If you use SSH keys, you can use the `scp` command without entering a password for every transfer.

The syntax of `scp` follows the form `scp [source] [destination]`. You can copy files from a remote host to the local machine by reversing the order of the paths in the above example.

### Protect Files on a Remote Server

Because Linode servers are network accessible and often have a number of distinct users, maintaining the security of files is often an important concern. We recommend you familiarize yourself with our [basic security guide](/docs/security/basics). Our guide on [access control with user accounts and permissions](/docs/tools-reference/linux-users-and-groups) may provide additional insight.

We suggest the following best practices for maintaining security:

-   Only give users the permission to do what they need to. This includes application-specific users.
-   Only run services on public interfaces that you are actively using. One common source of security vulnerabilities is in unused daemons that are left running. This includes database servers, HTTP development servers, and FTP servers.
-   Use SSH connections whenever possible to secure and encrypt the transfer of sensitive information.

### Symbolic Links

*Symbolic linking*, colloquially "symlinking", allows you to create an object in your filesystem that points to another object on your filesystem. This is useful when you need to provide users and applications access to specific files and directories without reorganizing your folders. This way you can provide restricted users access to your web-accessible directories without moving your `DocumentRoot` into their home directories.

To create a symbolic link, issue a command in the following format:

    ln -s /home/username/config-git/etc-hosts /etc/hosts

This creates a link of the file `etc-hosts` at the location of the system's `/etc/hosts` file. More generically:

    ln -s [/path/to/target/file] [/path/to/location/of/sym/link]

Note the following features of the link command:

-   The final term, the location of the link, is optional. If you omit the link destination, a link will be created in the current directory with the same name as the file you're linking to.
-   When specifying the location of the link, ensure that path does not have a final trailing slash. You can create a sym link that *targets* a directory, but sym links cannot terminate with slashes.
-   You may remove a symbolic link without affecting the target file.
-   You can use relative or absolute paths when creating a link.

### Manage Files on a Linux System

If you're new to using Linux and manipulating files on the terminal interface we encourage you to consider our guide on [using the terminal](/docs/using-linux/using-the-terminal). This section provides a list of basic commands to manage the contents of your filesystem.

To **copy** files:

    cp /home/username/todo.txt /home/username/archive/todo.01.txt

This copies `todo.txt` to an archive folder, and adds a number to the file name. If you want to recursively copy all of the files and subdirectories in a directory to another directory, use the `-R` option. This command looks like:

    cp -R /home/username/archive/ /srv/backup/username.01/

To **move** a file or directory:

    mv /home/username/archive/ /srv/backup/username.02/

You can also use the `mv` command to rename a file.

To **delete** a file:

    rm scratch.txt

This will delete the `scratch.txt` file from the current directory.

For more information about file system navigation and manipulation, please consider our documentation of [file system navigation](/docs/tools-reference/ssh/using-the-terminal/#file-system-navigation).

## Package Management

Most Linux systems use package management tools to facilitate the installation and maintenance of all software on your system. For more in-depth coverage of this topic, please reference our [package management](/docs/using-linux/package-management) guide.

While these tools provide a number of powerful features, it is easy to look past the benefits of package management. If you install software manually without package management tools, it becomes difficult to keep your system up to date and to manage dependencies. For these reasons, we recommend installing all software through package management tools unless other means are absolutely necessary. The following tips outline a couple of basic package management tasks.

### Find Packages Installed on Your System

Because packages are so easy to install, and often pull in a number of dependencies, it can be easy to lose track of what software is installed on your system. The following commands provide a list of installed packages on your system.

**For Debian and Ubuntu systems**:

    dpkg -l

The following example presents the first few lines of the output of this command on a production Debian Lenny system.

    ||/ Name                         Version                      Description
    +++-============================-============================-===============================
    ii  adduser                      3.110                        add and remove users and groups
    ii  apache2-mpm-itk              2.2.6-02-1+lenny2            multiuser MPM for Apache 2.2
    ii  apache2-utils                2.2.9-10+lenny4              utility programs for webservers
    ii  apache2.2-common             2.2.9-10+lenny4              Apache HTTP Server common files
    ii  apt                          0.7.20.2+lenny1              Advanced front-end for dpkg
    ii  apt-utils                    0.7.20.2+lenny1              APT utility programs
    ii  bash                         3.2-4                        The GNU Bourne Again SHell

**For CentOS and Fedora systems**:

    yum list installed

The following example shows a few lines of this command's output:

    MAKEDEV.i386                 3.23-1.2                  installed
    SysVinit.i386                2.86-15.el5               installed

CentOS and Fedora systems provide the name of the package (`SysVinit`), the architecture it was compiled for (`i386`), and the version of the build installed on the system (`2.86-15.el5`).

**For Arch Linux systems**:

    pacman -Q

This command provides a total list of all packages installed on the system. Arch also allows you to filter these results to display only packages that were explicitly installed (with the `-Qe` option) or that were automatically installed as dependencies (with the `-Qd` option). The above command is actually a combination of the output of two commands:

    pacman -Qe
    pacman -Qd

The following is an example of the output:

    perl-www-mechanize 1.60-
    perl-yaml 0.70-1
    pkgconfig 0.23-1
    procmail 3.22-2
    python 2.6.4-1
    rsync 3.0.6-1

**For Gentoo Linux systems**:

    emerge -evp --deep world

The following is a sample of this output:

    These are the packages that would be merged, in order:

       Calculating dependencies... done!
       [ebuild   R   ] sys-libs/ncurses-5.6-r2  USE="unicode -debug -doc -gpm -minimal -nocxx -profile -trace" 0 kB
       [ebuild   R   ] virtual/libintl-0  0 kB
       [ebuild   R   ] sys-libs/zlib-1.2.3-r1  0 kB

Because there are often a large number of packages installed on any given system, the output of these commands can be quite large. As a result, it is often useful to use tools like [grep](#search-for-a-string-in-files-with-grep) and `less` to make these results more useful. For example:

    dpkg -l | grep "python"

This will return a list of all packages with the word "python" in their name or description. Similarly, you can use `less`:

    dpkg -l | less

This will return the same list as the plain "`dpkg -l`; however, the results will appear in the `less` [pager](https://en.wikipedia.org/wiki/Terminal_pager), which allows you to search and scroll more easily.

You can append `| grep "[string]"` to these commands to filter package list results, or `| less` to display the results in a pager, regardless of distribution.

### Find Package Names and Information

Sometimes the name of a package isn't intuitive, based on the name of the software. As a result, most package management tools make provide an option to search the package database. These search tools may be helpful if you're looking for a specific piece of software but don't know what it's called.

**For Debian and Ubuntu systems**:

    apt-cache search [package-name]

This will search the local package database for a given term and generate a list with descriptions. An excerpt of the output for `apt-cache search python` follows:

    txt2regex - A Regular Expression "wizard", all written with bash2 builtins
    vim-nox - Vi IMproved - enhanced vi editor
    vim-python - Vi IMproved - enhanced vi editor (transitional package)
    vtk-examples - C++, Tcl and Python example programs/scripts for VTK
    zope-plone3 - content management system based on zope and cmf
    zorp - An advanced protocol analyzing firewall
    groovy - Agile dynamic language for the Java Virtual Machine
    python-django - A high-level Python Web framework
    python-pygresql-dbg - PostgreSQL module for Python (debug extension)
    python-samba - Python bindings that allow access to various aspects of Samba

Note that `apt-cache search` queries the full records for all of the packages and not simply the titles and the descriptions displayed here, hence the inclusion of `vim-nox` and `groovy` which both mention python in their descriptions. To see the full record on a specific package:

    apt-cache show [package-name]

This provides information regarding the maintainer, the dependencies, the size, the homepage of the upstream project, and a description of the software.

**For CentOS and Fedora systems**:

    yum search [package-name]

This generates a list of all packages available in the package database that match the given term. The following is an example of the output of `yum search wget`:

    Loaded plugins: fastestmirror
     Loading mirror speeds from cached hostfile
      * addons: centos.secsup.org
      * base: centos.secsup.org
      * extras: centos.secsup.org
      * updates: styx.biochem.wfubmc.edu
     ================================ Matched: wget =================================
     wget.i386 : A utility for retrieving files using the HTTP or FTP protocols.

You can use the package management tools to discover more information about a specific package. Use the following command to get a full record from the package database:

    yum info [package-name]

This output presents more in-depth information concerning the package, its dependencies, origins, and purpose.

**For Arch Linux systems**:

    pacman -Ss [package-name]

This will perform a search of the local package database. Here is an excerpt of results for a search for "python":

    extra/twisted 8.2.0-1
        Asynchronous networking framework written in Python.
    community/emacs-python-mode 5.1.0-1
        Python mode for Emacs

The terms "extra" and "community" refer to which repository the software is located in. To request more information about a specific package issue a command in the following form:

    pacman -Si [package-name]

Running `pacman` with the `-Si` option generates the package's record from the database. This record includes dependencies, package size, and a brief description.

**For Gentoo Linux systems**:

    emerge --search [package-name]
    emerge --searchdoc [package-name]

The first command only searches the database for package names. The second command searches through the database for package names and descriptions. These commands will allow you to search your local package tree (i.e., portage) for the specific package name or term. The output of either command is similar to the excerpt below.

    Searching...
     [ Results for search key : wget ]
     [ Applications found : 4 ]

     *  app-emacs/emacs-wget
           Latest version available: 0.5.0
           Latest version installed: [ Not Installed ]
           Size of files: 36 kB
           Homepage:      http://pop-club.hp.infoseek.co.jp/emacs/emacs-wget/
           Description:   Wget interface for Emacs
           License:       GPL-2

Because the output provided by the `emerge --search` command is verbose, there is no "show more information" tool, unlike other distributions' tools. The `emerge --search` command accepts input in the form of a regular expression if you need to narrow results even further.

Since there are often a large number of results for package searches, these commands output a great quantity of text. As a result it is often useful to use tools like [grep](#search-for-a-string-in-files-with-grep) and `less` to make these results easier to scroll through. For example:

    apt-cache search python | grep "xml"

This will return the subset of the list of packages which matched for the search term "python" and that mention xml in their name or short description. Similarly:

    apt-cache search python | less

This will return the same list as the plain `apt-cache search python` but the results will appear in the `less` pager. This allows you to search and scroll more conveniently.

You can append `| grep "[string]"` to any of these commands to filter package search results, or `| less` to display the results in the `less` pager, regardless of distribution.

## Text Manipulation

Among Linux and UNIX-like systems, nearly all system configuration information is stored and manipulated in plain text form. These following sections show a list of basic Linux commands and tools to manipulate text files.

### Search for a String in Files with grep

The `grep` tool allows you to search a stream of text, such as a file or the output of a command, for a term or regex pattern.

To use the `grep` tool, let's review an example:

    grep "^Subject:.*HELP.*" /home/username/mbox

This will search your mail spool for subject lines (i.e. begins with the word "Subject:"), beginning with any number of characters, containing the word "help" in upper case, and followed by any number of additional characters. It would then print these results in the terminal.

The `grep` tool provides additional options that, if specified, force the program to output the context for each match (e.g., with `-C 2` for two lines of context). With `-n`, `grep` outputs the line number of the match. With `-H`, `grep` prints the file name for each match, which is useful when you "grep" a group of files or "grep" recursively through a file system (using `-r`). Use `grep --help` for more options.

To grep a group of files, you can specify the file with a wildcard:

    grep -i "morris" ~/org/*.txt

This will find and match against every occurrence of the word "morris," while ignoring case (because of the option for `-i`). The `grep` tool will search all files in the `~/org/` directory with a .txt extension.

You can use `grep` to filter the results of another command that sends output to standard out (`stdout`). This is done by "piping" the output of one command into `grep`. For instance:

    ls /home/username/data | grep "1257"

In this example, we assume that the `/home/username/data` directory contains a large number of files that have a UNIX time stamp in their file names. The above command will filter the output to only display those tiles that have the four digits "1257" in their file names. In these cases, `grep` only filters the output of `ls` and does not look into file contents. For more information regarding `grep`, refer to our full documentation of the [grep command](/docs/tools-reference/search-and-filter-text-with-grep).

### Search and Replace Across a Group of Files

While the [grep](#search-for-a-string-in-files-with-grep) tool is quite powerful for filtering text on the basis of regular expressions, if you need to edit a file or otherwise manipulate the text, you can use `sed`. The `sed` tool, or the Stream EDitor, allows you search for a regex pattern and replace it with another string.

`sed` is extremely powerful, and we recommend that you back up your files and test your `sed` commands thoroughly before running them. Here is a very simple `sed` one-liner, intended to illustrate its syntax:

    sed -i `s/^good/BAD/` morning-star.txt

This replaces occurrences of the word "good" at the beginning of a line (noted by the `^`) with the string "BAD" in the file `morning-star.txt`. The option `-i` tells `sed` to perform the replacements "in place." The `sed` command can make backups of the files it edits if you specify a suffix after the `-i` option, as in `-iBAK`. In the above command this option would save the original file as `morning-star.txt.BAK` before making changes.

The general format of a `sed` statement is:

    's/[regex]/[replacement]/'

To match literal slashes (`/`), you must escape them with a backslash (`\`). As a result, to match a `/` character you would use `\/` in the `sed` expression. If you are searching for a string that has multiple slashes, you can replace the slashes which another character. For instance:

    's|r/e/g/e/x|regex|'

This would strip the slashes from the string `r/e/g/e/x` so that this string would be `regex` after running the `sed` command on the file that contains the string.

The following example, from our [migrating a server to your Linode](/docs/migrate-to-linode/disk-images/migrating-a-server-to-your-linode) document, searches and replaces one IP address with another. In this case `98.76.54.32` is replaced with `12.34.56.78`:

    sed -i 's/98\.76\.54\.32/12\.34\.56\.78/'

In the above example, period characters are escaped as `\.`. In regular expressions the full-stop (period) character matches to any character if it is not escaped.

For more information about `sed` refer to our full documentation of [text manipulation with sed](/docs/tools-reference/tools/manipulate-text-from-the-command-line-with-sed).

### Edit Text

In many Linode documents, you may be instructed to edit the contents of a file. To do this, you need to use a text editor. Most of the distribution templates that Linode provides come with an implementation of the vi/vim text editor and the nano text editor. These are small, lightweight and powerful text editors that allow you manipulate the text of a file from the terminal environment.

There are other options for text editors, notably emacs and "zile." Feel free to install these programs using your operating system's package manager. Make sure you [search your package database](#find-package-names-and-information) so you can install a version compiled without GUI components (i.e. X11).

To open a file, issue a command beginning with the name of the editor you wish to run followed by the name of the file you wish to edit. Here are a number of example commands that open the `/etc/hosts` file:

    nano /etc/hosts
    vi /etc/hosts
    emacs /etc/hosts
    zile /etc/hosts

When you've edited a file, you can save and exit the editor to return to the prompt. This procedure varies between different editors. In emacs and zile, the key sequence is the same: press control and type x and s to save. This operation is typically notated "C-x C-s" and then "C-x C-c" to close the editor. In nano, press Control-O (notated \^O) and confirm the file name to write the file, and use Control-X to exit from the program.

Since vi and vim are *modal* editors, their operation is a bit more complex. After opening a file in vi, you can enter "insert" mode by pressing the "i" key; this will let you edit text in the conventional way. To save the file, you must exit into "normal" mode by pressing the escape key (`Control-[` also sends escape), and then type `:wq` to write the file and quit the program.

This provides only the most basic outline of how to use these text editors, and there are numerous external resources which will provide instructions for more advanced use of this software.

## Web Servers and HTTP Issues

Linodes do not come with a web server installed by default. You must install and configure your web server. This allows you to configure your web server in a way that makes sense for your application or website. [Linode Guides & Tutorials](/docs) contains a number of documents regarding the installation and maintenance of various [web servers](/docs/websites/).

This section covers a number of basic web serving tasks and functions, as well as some guidance for users new to the world of web servers.

### Serve Websites

Web servers work by listening on a TCP port, typically port 80 for HTTP and port 443 for HTTPS. When a visitor makes a request for content, the servers respond by delivering the resource requested. Typically, resources are specified with a URL that contains the protocol, `http` or `https`; a colon and two slashes, `://`; hostname or domain, `www.example.com` or `username.example.com`; and the path to a file, `/images/avatar.jpg,` or `index.html`. A full URL would resemble `http://www.example.com/images/avatar.jpg`.

In order to provide these resources to users, your Linode needs to be running a web server. There are many different HTTP servers and countless configurations to provide support for various web development frameworks. The three most popular general use web servers are the [Apache HTTP](/docs/websites/apache) server, [Lighttpd](/docs/websites/lighttpd) ("Lighty"), and [nginx](/docs/websites/nginx) ("Engine X"). Each server has its strengths and weaknesses, and your choice depends largely on your experience and your needs.

Once you've chosen a web server, you need to decide what (if any) scripting support you need to install. Scripting support allows you to run dynamic content with your web server and program server side scripts in languages such as Python, PHP, Ruby, and Perl.

If you need a full web application stack, we encourage you to consider one of our more full-featured [LAMP stack guides](/docs/websites/lamp/). If you need support for a specific web development framework, consult our tutorials for installing and using specific [web application frameworks](/docs/development/frameworks/).

### How to Choose a Web Server

In most situations, end users are unaware of which web server you use. As a result, choosing a web server is often a personal decision based on the comfort of the administrator and the requirements of the deployment in question. This can be a challenge for the new systems administrator. This section offers some guidance by providing some background and information on the most popular web servers.

The [Apache HTTP Server](/docs/web-servers/apache/) is considered by some to be the *de facto* standard web server. It is the most widely deployed open-source web server, its configuration interface has been stable for many years, and its modular architecture allows it to function in many different types of deployments. Apache forms the foundation of the [LAMP stack](/docs/lamp-guides), and supports the integration of dynamic server-side applications into the web server.

By contrast, web servers like [Lighttpd](/docs/websites/lighttpd) and [nginx](/docs/websites/nginx/) are optimized for efficiently serving static content. If you have a deployment where server resources are limited and are facing a great deal of demand, consider one of these servers. They are functional and stable with minimal system resources. Lighttpd and nginx can be more difficult to configure when integrating dynamic content interpreters.

Your choice of web servers is based on your needs. Specific choices depend on factors like the type of content you want to serve, the demand for that content, and your comfort with that software as an administrator.

### Apache Logs

When there is something wrong with [Apache](/docs/websites/apache), it can be difficult to determine what the cause of the error is from the behavior of the web server. There are a number of common issues with which you might begin your [troubleshooting](/docs/troubleshooting/troubleshooting-common-apache-issues/) efforts. When more complex issues arise, you may need to review the Apache error logs.

By default, error logs are located in the `/var/log/apache2/error.log` file (on Debian-based distributions). You can track or "tail" this log with the following command:

    tail -F /var/log/apache2/error.log

In the default virtual host configurations suggested in our [Apache installation](/docs/websites/apache/) and [LAMP guides](/docs/websites/lamp), we suggest adding a custom log setting:

{{< file-excerpt "Apache Virtual Host Configuration" >}}
ErrorLog /var/www//html/example.com/logs/error.log CustomLog /var/www/html/example.com/logs/access.log combined

{{< /file-excerpt >}}


Where `example.com` represents the name of your virtual host and the location of its resources. These directives make Apache create two log files that contain logging information specific to that virtual host. This allows you to easily troubleshoot errors on specific virtual hosts. To track or tail the error log:

    tail -F /var/www/html/example.com/logs/error.log

This will allow you to see new error messages as they appear. Problems can be diagnosed by using specific parts of an error message from an Apache log as a term in web search. Common errors to look for include:

-   Missing files, or errors in file names
-   Permissions errors
-   Configuration errors
-   Dynamic code execution or interpretation errors

## DNS Servers and Domain Names

The *Domain Name System*, or DNS, is the service that the internet uses to associate the hard to remember and manage IP addresses with more human-usable domain names. This section will address several specific DNS-related tasks. To learn more about DNS, check out our [overview of the domain name system](/docs/networking/dns/dns-records-an-introduction). If you are familiar with DNS and just need to figure out how to configure your DNS server, see our guide for the [Linode DNS manager](/docs/networking/dns/dns-manager-overview).

### Redirect DNS Queries with CNAMEs

[CNAME DNS records](/docs/networking/dns/dns-records-an-introduction#cname) make it possible to redirect requests for one hostname or domain to another hostname or domain. This is useful in situations where you want to direct requests for one domain to another, but don't want to set up the web server to handle requests.

CNAMEs are *only* valid when pointing from one domain to another. If you need to redirect a full URL, you will need to set up a web server and [configure redirection](/docs/websites/apache-tips-and-tricks/redirect-urls-with-the-apache-web-server) and/or virtual hosting on the server level. CNAMEs will allow you to redirect subdomains, such as `team.example.com`, to other subdomains or domains, such as `jack.example.org`. CNAMEs must point to a valid domain that has a valid A Record, or to another CNAME.

Although limited in their capabilities, CNAMEs can be quite useful in some situations. In particular, if you need to change the hostname of a machine, CNAMEs are quite useful. To learn how to set up CNAME records with the [Linode Manager](https://manager.linode.com//), refer to our [DNS Manager Guide](/docs/networking/dns/dns-manager-overview).

### Set Up Subdomains

When [reading domain names](/docs/networking/dns/dns-records-an-introduction#domain-names), we refer to parts before the main or first-level domain as "subdomains." For example, in the domain `team.example.com`, `team` is a subdomain for the root domain `example.com`.

Follow these steps to [create and host a sub-domain](/docs/networking/dns/common-dns-configurations#configuring-subdomains):

1.  First, create an [A Record](/docs/networking/dns/dns-records-an-introduction#a-and-aaaa) in the DNS zone for the domain. You can do this using the [Linode DNS Manager](/docs/networking/dns/dns-manager-overview). You may host the DNS for your domain with any provider you choose.

2.  Set up a server to respond to requests sent to this domain. For web servers like [Apache](/docs/websites/apache/), this requires configuring a new virtual host. For XMPP servers you must configure an additional host to receive the requests for this host. For more information, consult the documentation for the specific server you wish to deploy.

3.  Once configured, subdomains function almost identically to root domains on your server. If you need to, you can set up HTTP redirection for the new subdomain.

## SMTP Servers and Email Issues

We provide a number of guides that cover [email-related topics](/docs/email/). In this section, we'll explain how to choose an email setup that fits your needs and how to configure your Linode to send email.

### Choose an Email Solution

There are two major components that are required for email functionality. The most important part is the SMTP server or "Mail Transfer Agent." The MTA, as it is often called, sends mail from one server to another. The second part of an email system is a server that permits users to access and download that mail from the server to their own machine. Typically these servers use a protocol such as POP3 or IMAP to provide remote access to the mailbox.

There may also be other components in the email server tool chain. These components may be optional depending on the requirements of your deployment. They include filtering and delivery tools like [procmail](http://www.procmail.org/), anti-virus filters like [ClamAV](https://www.clamav.net/), mailing list managers like [MailMan](https://www.gnu.org/software/mailman/index.html), and spam filters like [SpamAssassin](https://spamassassin.apache.org/). These components function independently of the MTA and remote mailbox server.

The most prevalent SMTP servers or MTAs in the UNIX-like world are [Postfix](http://www.postfix.org/), [Exim](https://www.exim.org/), and [Sendmail](http://www.sendmail.org/). Sendmail has the longest history and many system administrators have extensive experience with it. Postfix is robust and modern, and is compatible with many different configurations. Exim is the default MTA in Debian systems, and many consider it to be easier to use for basic tasks. For remote mailbox access, servers like [Courier](http://www.courier-mta.org/) and [Dovecot](https://www.dovecot.org/) are popular options.

If you need an easy-to-install email solution, consider the [Citadel groupware server](/docs/email/citadel/). Citadel provides an integrated "turnkey" solution that includes an SMTP server, remote mailbox access, real time collaboration tools including XMPP, and a shared calendar interface. Along similar lines, we also provide documentation for the installation of the [Zimbra groupware server](/docs/email/zimbra).

If, by contrast, you want a more simple and modular email stack, we urge you to consider one of our guides built around the [Postfix SMTP server](/docs/email/postfix/).

Finally, it's possible to outsource email service to a third-party provider, such as [Google Apps](/docs/email/using-google-apps-for-email) or [FastMail.fm](https://www.fastmail.fm). These services allows you to send and receive mail from your domain, without hosting email services on your Linode.

### Send Email From Your Server

For simple configurations, you may have no need for a complete email stack like some of those documented in our [email guides](/docs/email/). However, applications running on that server still need to be able to send mail for notifications and other routine purposes.

The configuration of applications to send notifications and alerts is beyond the scope of this guide. Most applications rely on a simple "sendmail" interface, which is accessible via several common SMTP servers including Postfix and msmtp.

To install Postfix on Debian and Ubuntu systems:

    apt-get install postfix

On CentOS and Fedora systems:

    yum install postfix

Once Postfix is installed, your applications should be able to access the sendmail interface, located at `/usr/sbin/sendmail`. Most applications running on your Linode should be able to send mail normally with this configuration.

If you want to use your server to send email through an external SMTP server, consider a more simple tool like `msmtp`. Since `msmtp` is packaged in most distributions, and you can install it using the appropriate command:

    apt-get install msmtp
    yum install msmtp
    pacman -S msmtp

Use the command `type msmtp` or `which msmtp`, to find the location of `msmtp` on your system. Typically the program is located at `/usr/bin/msmtp`. You can specify authentication credentials with command line arguments or by declaring SMTP credentials in a configuration file. Here is an example `.msmtprc` file.

{{< file-excerpt ".msmtprc example" >}}
account default host smtp.example.com from <username@example.com> auth on user username password s3cr37 tls on tls\_certcheck off port 587

{{< /file-excerpt >}}


The `.msmptrc` file needs to be set to mode 600 and owned by the user account that will be sending mail. For example, if the configuration file is located at `/srv/smtp/msmtprc`, you can call mstmp with the following command:

    /usr/bin/msmtp --file=/srv/smtp/msmtprc
