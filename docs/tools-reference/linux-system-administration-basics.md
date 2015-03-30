---
author:
  name: Linode
  email: docs@linode.com
description: 'Tips, troubleshooting pointers, and software usage suggestions for Linux beginners.'
keywords: 'linux tips,linux beginners,systems administration,admin,linux,mail,http,troubleshooting'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['using-linux/administration-basics/']
modified: Wednesday, February 18, 2015
modified_by:
  name: Dave Russell
published: 'Sunday, December 13th, 2009'
title: Linux System Administration Basics
---

This document presents a collection of common issues and useful tips for Linux system administration. Whether you're new to system administration or have been maintaining systems for some time, we hope these tips are helpful regardless of your background or choice in Linux distributions.

Basic Configuration
-------------------

These tips cover some of the basic steps and issues encountered during the beginning of system configuration. We provide a general [getting started guide](/docs/getting-started) for your convenience if you're new to Linode and basic Linux system administration. Additionally, you may find some of our [Introduction to Linux Concepts guide](/docs/tools-reference/introduction-to-linux-concepts) useful.

### Set the Hostname

Please follow our instructions for [setting your hostname](/docs/getting-started#sph_set-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

### Set the Timezone

When setting the timezone of your server, it may be best to set it to the timezone of the bulk of your users. If you're unsure which timezone would be best, consider using universal coordinated time or UTC (i.e. Greenwich Mean Time).

By default, Linode base installs are set to Eastern Standard Time. The following process will set the timezone manually, though many operating systems provide a more elegant method for changing timezones. To change the time zone manually, you must find the proper zone file in `/usr/share/zoneinfo/` and link that file to `/etc/localtime`. See the example below for common possibilities. Please note that all contents following the double hashes (eg. `##`) are comments and should not be copied into your terminal.

    ln -sf /usr/share/zoneinfo/UTC /etc/localtime ## for Universal Coordinated Time 

    ln -sf /usr/share/zoneinfo/EST /etc/localtime ## for Eastern Standard Time 

    ln -sf /usr/share/zoneinfo/US/Central /etc/localtime ## for American Central time (including DST)

    ln -sf /usr/share/zoneinfo/US/Eastern /etc/localtime ## for American Eastern (including DST)

To change the time zone in Debian and Ubuntu systems, issue the following command and answer the questions as prompted by the utility:

    dpkg-reconfigure tzdata

In Arch Linux, set the timezone in the `/etc/rc.conf` file by configuring the `TIMEZONE=` setting in the "Localization" section. This line will resemble the following:

{: .file-excerpt }
/etc/rc.conf

> TIMEZONE="America/New\_York"

Note that the string specified in `TIMEZONE` refers to the "zoneinfo" file located in or below the `/usr/share/zoneinfo/` directory.

### Use the /etc/hosts File

The `/etc/hosts` file provides a list of IP addresses with corresponding hostnames. This allows you to specify hostnames for an IP address once on the local machine, and then have multiple applications connect to external resources via their hostnames. The system of host files predates [DNS](/docs/dns-guides/introduction-to-dns), and hosts files are *always* checked before DNS is queried. As a result, `/etc/hosts` can be useful for maintaining small "internal" networks, for development purposes, and for managing clusters.

Some applications require that the machine properly identify itself in the `/etc/hosts` file. As a result, we recommend configuring the `/etc/hosts` file shortly after deployment. Here is an example file:

{: .file-excerpt }
/etc/hosts

> 127.0.0.1 localhost.localdomain localhost 12.34.56.78 squire.example.com squire

You can specify a number of hostnames on each line separated by spaces. Every line must begin with one and only one IP address. In this case, replace `12.34.56.78` with your machine's IP address. Let us consider a few additional `/etc/hosts` entries:

{: .file-excerpt }
/etc/hosts

> 74.125.67.100 test.com 192.168.1.1 stick.example.com

In this example, all requests for the test.com" hostname or domain will resolve to the IP address `74.125.67.100`, which bypasses the DNS records for `test.com` and returns an alternate website.

The second entry tells the system to look to `192.168.1.1` for the domain `stick.example.com`. These kinds of host entries are useful for using "private" or "back channel" networks to access other servers in a cluster without needing to access the public network.

Network Diagnostics
-------------------

The following tips address the basic usage and functionality of a number of tools that you can use to assess and diagnose network problems. If you suspect connectivity issues, including output of the relevant commands in your [support ticket](/docs/platform/support) can help our staff diagnose your issue. This is particularly helpful in cases where networking issues are intermittent.

### Using the Ping Command

The `ping` command tests the connection between the local machine and a remote address or machine. The following command "pings" `google.com` and `74.125.67.100`:

    ping google.com ping 74.125.67.100

These commands send a bit of data (i.e. an ICMP packet) to the remote host, and wait for a response. If the system is able to make a connection, for every packet it will report on the "round trip time." Here is the output of four pings of google.com:

    64 bytes from yx-in-f100.1e100.net (74.125.45.100): icmp_seq=1 ttl=50 time=33.8 ms
    64 bytes from yx-in-f100.1e100.net (74.125.45.100): icmp_seq=2 ttl=50 time=53.2 ms
    64 bytes from yx-in-f100.1e100.net (74.125.45.100): icmp_seq=3 ttl=50 time=35.9 ms
    64 bytes from yx-in-f100.1e100.net (74.125.45.100): icmp_seq=4 ttl=50 time=37.5 ms

In this case `yx-in-f100.1e100.net` is the reverse DNS for this IP address. The `time` field specifies in milliseconds that the round trip takes for an individual packet. When you've gathered the amount of information you need, send `Control+C` to interrupt the process. At this juncture, you'll be presented with some statistics. This will resemble:

    --- google.com ping statistics ---
    4 packets transmitted, 4 received, 0% packet loss, time 3007ms 
    rtt min/avg/max/mdev = 33.890/40.175/53.280/7.679 ms

There are several important data points to notice. They are:

-   *Packet Loss*, or the discrepancy between the number of packets sent and the number of packets that return successfully.
-   *Round Trip Time* statistics on the final line report important information about all the ping responses. For this ping we see that the fastest packet round trip took 33.89 milliseconds. The longest packet took 53.28 milliseconds. The average round trip took 40.175 milliseconds. A single standard deviation unit for these four packets is 7.67 milliseconds.

Use the ping tool to contact a server and ensure that you are able to make a connection. Furthermore, ping is useful as an informal diagnostic tool to measure point-to-point network latency, and as a network connection testing tool.

### Using the traceroute Command

The `traceroute` command expands on the functionality of the [ping](#using_the_ping_command) command. `traceroute` provides a report on the path that the packets take to get from the local machine to the remote machine. Route information is useful when troubleshooting a networking issue: if there is packet loss in one of the first few "hops" the problem is often related to the user's local area network (LAN) or Internet service provider (ISP). By contrast, if there is packet loss near the end of the route, the problem may be caused by an issue with the server's connection.

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

Often the hostnames and IP addresses on either side of a failed jump are useful in determining who operates the machine where the routing error occurs. Failed jumps are designated by line with three asterisks (e.g. `* * *`).

Furthermore, including `traceroute` information in tickets to [Linode support](/docs/platform/support/) is sometimes useful when trying to diagnose network issues. You may also want to forward `traceroute` information to your Internet Service Provider (ISP) if you suspect that the connectivity issue is with your ISP's network. Recording `traceroute` information is particularly useful if you are experiencing an intermittent issue.

### Using the mtr Command

The "mtr" command, like the [traceroute](#using_the_traceroute_command) tool, provides information about the route that Internet traffic takes between the local system and a remote host. However, `mtr` provides additional information about the round trip time for the packet. In a way, you can think of `mtr` as a combination of traceroute and ping.

Here is the example output of an `mtr` command:

    HOST: squire.example.com  Loss%   Snt   Last   Avg  Best  Wrst StDev
        1.  256.129.75.4 0.0% 10 0.4 0.4 0.3 0.6 0.1
        2.  vlan804.tbr2.mmu.nac.net 0.0% 10 0.3 0.4 0.3 0.7 0.1
        3.  0.e1-1.tbr2.tl9.nac.net 0.0% 10 4.3 4.4 1.3 11.4 4.1
        4.  core1-0-2-0.lga.net.google.c 0.0% 10 64.9 11.7 1.5 64.9 21.2
        5.  209.85.255.68 0.0% 10 1.7 4.5 1.7 29.3 8.7
        6.  209.85.251.9 0.0% 10 23.1 35.9 22.6 95.2 27.6
        7.  72.14.239.127 0.0% 10 24.2 24.8 23.7 26.1 1.0
        8.  209.85.255.190 0.0% 10 27.0 27.3 23.9 37.9 4.2
        9.  gw-in-f100.1e100.net 0.0% 10 24.1 24.4 24.0 26.5 0.7

Used without the `--report` flag, `mtr` tracks the speed of the connection in real time until you exit the program. Additionally, be aware that `mtr` will pause for a few moments before generating output. For more information regarding `mtr` consider our [guide to diagnosing network issues with mtr](/docs/linux-tools/mtr).

System Diagnostics
------------------

If you're having an issue with your Linode that is neither related to [networking](#network_diagnostics), nor another easily diagnosable application issue, it is worthwhile to rule out "hardware" and operating system level issues. Use the following tools to better diagnose and resolve these kinds of issues.

If you determine that you have a problem with memory usage, please reference our document regarding [resolving memory usage issues](/docs/troubleshooting/memory-networking). Use the following tools and approaches to determine the specific cause of your troubles.

### Check Current Memory Usage

If you need to see how much memory your system is using at the current moment issue the following command:

    free -m

On a moderately utilized Linode 1GB, this command will generate output that resembles the following:

        total       used       free     shared    buffers     cached
    Mem: 1002        956         46          0        171        357 
    -/+ buffers/cache: 427      575 
    Swap: 127         39         88

This output takes a little bit of careful reading to interpret correctly. Out of a total 1002 megabytes of memory (RAM), the system is using 956 megabytes, and has 46 megabytes free. **However**, the system also has 427 megabytes of "stale" data buffered and stored in cache. The operating system will "drop" the caches when and if it needs the space, but retains the cache if there is no other need for the space. It is totally normal for a Linux system to leave old data in RAM until the space is needed, and you should not be alarmed if only a small amount of memory is actually "free."

In the above example, there are 575 megabytes of memory that are actually *free*. This means 575 megabytes are available to your system when you start an additional process or a running application needs more memory.

### Monitor IO Usage with vmstat

The `vmstat` tool provides information about memory, swap utilization, IO wait, and system activity. It is particularly useful for diagnosing I/O-related issues.

If you think you're having an I/O issue then run the following command:

    vmstat 1 20

This runs a vmstat every second, twenty times. We find this gives a pretty good sample of the current state of the system. The output generated resembles the following:

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

The memory and swap columns provide the same kind of information provided by the "[free -m](#check_current_memory_usage)" command, albeit in a slightly more difficult to comprehend format. The most salient information produced by this command is the `wa` column, which is the final column in most implementations. This field displays the amount of time the CPU spends waiting for IO operations to complete.

If this number is consistently and considerably higher than 0, you might consider taking measures to address your IO usage. However, if the `vmstat` output resembles the above, you can be sure in the knowledge that you're not experiencing an IO-related issues.

If you are experiencing an intermittent issue, you will need to run `vmstat` *when* you experience the issue in order to properly diagnose or rule out an IO issue. `vmsat` output can sometimes help [support](/docs/platform/support/) diagnose problems.

### Monitor Processes, Memory, and CPU Usage with htop

If you want a more organized and real-time view of the current state of your system, we recommend a tool called `htop`. This is not installed by default on most systems. To install `htop`, issue one of the following commands, depending on which distribution you use:

    apt-get install htop
    yum install htop
    pacman -S htop
    emerge sys-process/htop

Now, at a command line, issue the following command:

    htop

You can quit at any time by pressing the `F10` or `Q` keys. There are a couple of `htop` behaviors that may not be initially intuitive. Take note of the following:

-   The memory utilization graph displays used memory, buffered memory, and cached memory. The numbers displayed at the end of this graph reflect the total amount of memory available and the total amount memory on the system as reported by the kernel.
-   The default configuration of `htop` presents all application threads as independent processes, which is non-intuitive. You can disable this by selecting the "setup" option with `F2`, then "Display Options," and then toggling the "Hide userland threads" option.
-   You can toggle a "Tree" view with the `F5` key that usefully displays the processes in a hierarchy and shows which processes were spawned by which other processes. This is helpful in diagnosing a problem when you're having trouble figuring out what processes are what.

File System Management
----------------------

Historically, web developers and editors have used the FTP protocol to transfer and manage files on a remote system. FTP, however, is very insecure and inefficient for managing the files on a system when you have SSH access.

If you're new to administering systems and the Linux world, you might consider our "[Tools & Reference](/docs/tools-reference/)" section and articles including: "[installing and using WinSCP](/docs/networking/file-transfer/transfer-files-winscp)" [using rsync to synchronize files](/docs/linux-tools/utilities/rsync) and "[using SSH and the terminal](/docs/using-linux/using-the-terminal)."

As always, if you are giving other users access to upload files to your server, it would be wise to consider the [security implications](/docs/security/basics) of all additional access that you grant to third parties seriously.

### How to Upload files to a Remote Server

If you're used to using an FTP client, OpenSSH (which is included and active with all of the Linode provided installation templates) allows you to use an FTP-like interface over the SSH protocol. Known as "SFTP," many clients support this protocol, including: "[WinSCP](/docs/networking/file-transfer/transfer-files-winscp)" for Windows, "[Cyberduck](/docs/networking/file-transfer/transfer-files-cyberduck)" for Mac OS X, and "[Filezilla](/docs/networking/file-transfer/transfer-files-filezilla-ubuntu-9.10)" for Linux, OS X, and Windows desktops.

If you are accustomed to FTP, SFTP is great option. Do note that by default, whatever access a user has to a file system at the command line, they will also have over SFTP. Consider [file permissions](/docs/using-linux/users-and-groups) very carefully.

Conversely, you can use Unix utilities including `scp` and [rsync](/docs/linux-tools/utilities/rsync) to securely transfer files to your Linode. On local machine, a command to copy `team-info.tar.gz` would look like:

    scp team-info.tar.gz squire@lollipop.example.com:/home/squire/backups/

The command, `scp`, is followed by the name of the file on the local file system to be transferred. Next is the username and hostname of the remote machine, separated by an "at" sign (e.g. `@`). Following the hostname, there is a colon (e.g. `:`) and the path on the remote server where the file should be uploaded to. Taken another way, this command would be:

    scp [/path/to/local/file] [remote-username]@[remote-hostname]:[/path/to/remote/file]

This command is available by default on OS X and Linux machines. You can use it to copy files to a Linode, as well as between remote servers. If you have SSH keys deployed, you can use the `scp` command without entering a password for every transfer.

The syntax of `scp` follows the form `scp [source] [destination]`. You can copy files from a remote host to the local machine by reversing the order of the paths in the above example.

### How to Protect Files on a Remote Server

Because Linode servers are network accessible and often have a number of distinct users, maintaining the security of files is often an important concern. We recommend you familiarize yourself with our [basic security guide](/docs/security/basics). Furthermore, our documentation of [access control with user accounts and permissions](/docs/using-linux/users-and-groups) may provide additional insight.

Additionally, we suggest the following best practices for maintaining security:

-   Only give users the permission to do what they need to. This includes application specific users.
-   Only run services on public interfaces that you are actively using. One common source of security vulnerabilities are in daemons that are left running and unused. This includes database servers, HTTP development servers, and FTP servers.
-   Use SSH connections whenever possible to secure and encrypt the transfer of sensitive information.

### Understanding and Using Sym Linking

"Symbolic Linking," colloquially "sym linking," allows you to create an object in your filesystem that points to another object on your filesystem. This is useful when you need to provide users and applications access to specific files and directories without reorganizing your folders. This way you can provide restricted users access to your web-accessible directories without moving your `DocumentRoot` into their home directories.

To create a symbolic link, issue a command in the following format:

    ln -s /home/squire/config-git/etc-hosts /etc/hosts

This creates a link of the file `etc-hosts` at the location of the system's `/etc/hosts` file. More generically. this command would read:

    ln -s [/path/to/target/file] [/path/to/location/of/sym/link]

Note the following features of the link command:

-   The final term, the location of the link, is optional. If you opt to omit the link destination, a link will be created in the current directory with the same name as the file you're linking to.
-   When specifying the location of the link, ensure that path does not have a final trailing slash. You can create a sym link that *targets* a directory, but sym links cannot terminate with slashes.
-   You may remove a symbolic link without affecting the target file.
-   You can use relative or absolute paths when creating a link.

### How to Manage and Manipulate Files on a Linux System

If you're new to using Linux and manipulating files on the terminal interface we encourage you to consider our [using the terminal](/docs/using-linux/using-the-terminal) document. This tip provides an overview of basic file management operations.

To **copy** files, issue the following command:

> cp /home/squire/todo.txt /home/squire/archive/todo.01.txt

This copies `todo.txt` to an archive folder, and adds a number to the file name. If you want to recursively copy all of the files and subdirectories in a directory to another directory, use the `-R` option. This command looks like:

    cp -R /home/squire/archive/ /srv/backup/squire.01/

If you need to **move** a file or directory, use the following command:

    mv /home/squire/archive/ /srv/backup/squire.02/

You can also use the `mv` command to rename a file.

To **delete** a file, issue a command in the following form:

    rm scratch.txt

This will delete the `scratch.txt` file from the current directory.

For more information about file system navigation and manipulation, please consider our documentation of [file system navigation](/docs/using-linux/using-the-terminal#file_system_navigation) in the [using the terminal](/docs/using-linux/using-the-terminal) document.

Package Management
------------------

Contemporary Linux systems use package management tools to facilitate the installation and maintenance of all software on your system. For more in-depth coverage of this topic, please reference our [package management](/docs/using-linux/package-management) guide.

While package management provides a number of powerful features, it is easy to obviate the benefits of package management. If you install software manually without package management tools, it becomes very difficult to keep your system up to date and to manage complex dependencies. For these reasons, we recommend installing all software through package management tools unless other means are absolutely necessary. The following tips outline a couple of basic package management tasks.

### How to Know What Packages are Installed on Your System

Because packages are so easy to install, and often pull in a number of dependencies, it can be easy to lose track of what software is installed on your system. The following commands provide a list of installed packages on your system.

**For Debian and Ubuntu systems**, issue the following command:

    dpkg -l

The following example presents the first few lines of the output of this command on a production Debian Lenny system.

    ||/ Name             Version              Description
    +++-============================-============================-===============================
    ii  adduser          3.110                add and remove users and groups
    ii  apache2-mpm-itk      2.2.6-02-1+lenny2        multiuser MPM for Apache 2.2
    ii  apache2-utils        2.2.9-10+lenny4          utility programs for webservers
    ii  apache2.2-common         2.2.9-10+lenny4          Apache HTTP Server common files
    ii  apt              0.7.20.2+lenny1          Advanced front-end for dpkg
    ii  apt-utils            0.7.20.2+lenny1          APT utility programs
    ii  bash             3.2-4                The GNU Bourne Again SHell

**For CentOS and Fedora systems**, issue the following command:

    yum list installed

The following example presents a few relevant lines of the output of this command:

    MAKEDEV.i386                 3.23-1.2              installed
    SysVinit.i386                2.86-15.el5               installed

CentOS and Fedora systems provide the name of the package (e.g. `SysVinit`), the architecture it was compiled for (e.g. `i386`), and the version of the build installed on the system (e.g. `2.86-15.el5`).

**For Arch Linux systems**, issue the following command:

    pacman -Q

This command provides a total list of all packages installed on the system. Arch also allows you to filter these results to display only packages that were explicitly installed (with the `-Qe` option) or that were installed as dependencies (with the `-Qd` option). The above command is thus the union of the output of the following commands:

    pacman -Qe
    pacman -Qd

The following is a sample of the format of this output:

    perl-www-mechanize 1.60-
    perl-yaml 0.70-1
    pkgconfig 0.23-1
    procmail 3.22-2
    python 2.6.4-1
    rsync 3.0.6-1

**For Gentoo Linux systems**, issue the following command:

    emerge -evp --deep world

The following is a sample of the format of this output:

    These are the packages that would be merged, in order:

       Calculating dependencies... done!
       [ebuild   R   ] sys-libs/ncurses-5.6-r2  USE="unicode -debug -doc -gpm -minimal -nocxx -profile -trace" 0 kB
       [ebuild   R   ] virtual/libintl-0  0 kB
       [ebuild   R   ] sys-libs/zlib-1.2.3-r1  0 kB

Because there are often a large number of packages installed on any given system, the output of these commands is often quite large. As a result, it is often useful to use tools like [grep](#how_to_search_for_a_string_in_files_with_grep) and `less` to make these results more useful. For example, the command :

    dpkg -l | grep "python"

will return a list of all packages with the word python in their name or description. Similarly, the following command:

    dpkg -l | less

will return the same list as the plain "`dpkg -l`; however, the results will appear in the `less` pager, which allows you to search and scroll more easily.

You can append `| grep "[string]"` to these commands to filter package list results, or `| less` to display the results in a pager, regardless of distribution.

### How to Discover Package Names and Information

Sometimes the name of a package doesn't correspond to the name that you may associate with a given piece of software. As a result, most package management tools make provide an interface to search the package database. These search tools may be helpful if you're looking for a specific piece of software but don't know what it's called.

**For Debian and Ubuntu systems**, issue the following command:

    apt-cache search [package-name]

This will search the local package database for a given term and generate a list with brief descriptions. An excerpt of the output for `apt-cache search python` follows:

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

Note that `apt-cache search` queries the full records for all of the packages, and not simply the titles and the descriptions displayed here, hence the inclusion of `vim-nox` and `groovy` which both mention python in their descriptions. To see the full record on a package issue the following command:

    apt-cache show [package-name]

This provides information regarding the maintainer, the dependencies, the size, the homepage of the upstream project, and a description of the software. This command can be used to provide additional information about a package from the command line.

**For CentOS and Fedora systems**, issue the following command:

    yum search [package-name]

This generates a list of all packages available in the package database that match the given term. See the following excerpt for an example of the output of `yum search wget`:

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

**For Arch Linux systems**, issue the following command:

    pacman -Ss [package-name]

This will perform a search of the local copy of the package database. Here is an excerpt of results for a search for "python:

    extra/twisted 8.2.0-1
        Asynchronous networking framework written in Python.
    community/emacs-python-mode 5.1.0-1
        Python mode for Emacs

The terms "extra" and "community" refer to which repository the software is located in. This level of specificity is unnecessary when specifying packages to install or display more information about. To request more information about a specific package issue a command in the following form:

    pacman -Si [package-name]

Running `pacman` with the `-Si` option generates the package's record from the database. This record includes information about dependencies, optional dependencies, package size, and a brief description.

**For Gentoo Linux systems**, issue one of the following commands:

    emerge --search [package-name]
    emerge --searchdoc [package-name]

The first command only searches the database for package names. The second command searches through the database for package names and descriptions. These commands will allow you to search your local package tree (i.e. portage) for the specific package name or term. The output of either command is similar to the excerpt presented bellow.

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

Because the output provided by the `emerge --search` command is rather verbose, there is no "show more information" tool, unlike other distributions' tools. The `emerge --search` command accepts input in the form of a regular expression if you need to narrow results even further.

Since there are often a large number of results for package searches, these commands output a great quantity of text. As a result it is often useful to use tools like [grep](#how_to_search_for_a_string_in_files_with_grep) and `less` to make these results easier to scroll. For example, the command :

    apt-cache search python | grep "xml"

will return the subset of the list of packages which matched for the search term "python," and that mention xml in their name or short description. Similarly, the following command:

    apt-cache search python | less

will return the same list as the plain `apt-cache search python` but the results will appear in the `less` pager. This allows you to search and scroll more conveniently.

You can append `| grep "[string]"` to any of these commands to filter package search results, or `| less` to display the results in the `less` pager, regardless of distribution.

Text Manipulation
-----------------

Among Linux and UNIX-like systems, nearly all system configuration information is stored and manipulated in plain text form. These tips provide some basic information regarding the manipulation of text files on your system.

### How to Search for a String in Files with grep

The `grep` tool allows you to search a stream of text, such as a file or the output of a command, for a term or pattern matching a regular expression.

To use the `grep` tool, issue a command in the following format:

    grep "^Subject:.*HELP.*" /home/squire/mbox

This will search the mail spool for subject lines (i.e. begins with the word "Subject:"), beginning with any number of characters, containing the word "help" in upper case, and followed by any number of additional characters. `grep` would then print these results on the terminal.

`grep` provides a number of additional options that, if specified, force the program to output the context for each match (e.g. with `-C 2` for two lines of context). With `-n`, `grep` outputs the line number of the match. With `-H`, `grep` prints the file name for each match, which is useful when you "grep" a group of files or "grep" recursively through a file system (e.g. with `-r`). Consider the output of `grep --help` for more options.

To grep a group of files, you can specify the file with a wildcard, as in the following example:

    grep -i "morris" ~/org/*.txt

This will find and match against every occurrence of the word "morris," while ignoring case (because of the option for `-i`). `grep` will search all files in the `~/org/` directory with a .txt extension.

You can use `grep` to filter the results of another command that sends output to standard out (e.g. `stdout`). This is accomplished by "piping" the output of one command "into `grep`." For instance:

    ls /home/squire/data | grep "1257"

In this example, we assume that the `/home/squire/data` directory contains a large number of files that have a UNIX time stamp in their file name. The above command will filter the output to only display those tiles that have the four digits "1257" in their file name. Note, in these cases `grep` only filters the output of `ls` and does not look into file contents. For more information regarding `grep` consider the full documentation of the [grep command](/docs/tools-reference/search-and-filter-text-with-grep).

### How to Search and Replace Across a Group of Files

While the [grep](#how_to_search_for_a_string_in_files_with_grep) tool is quite powerful for filtering text on the basis of regular expressions, if you need to edit a file or otherwise manipulate the text you may use the `sed` tool. `sed`, or the Stream EDitor, allows you search for a regular expression pattern and replace it with another string.

`sed` is extremely powerful, and we recommend that you back up your files and test your `sed` commands thoroughly before running them, particularly if you're new to using `sed`. Here is a very simple `sed` one-liner, intended to illustrate its syntax.

    sed -i `s/^good/BAD/` morning-star.txt

This replaces occurrences of the word "good" occurring at the beginning of a line (as noted by the `^`) with the string "BAD" in the file `morning-star.txt`. The option `-i` tells `sed` to perform the replacements "in place." `sed` can make backups of the files it edits if you specify a suffix after the `-i` option, as in `-iBAK`. In the above command this option would save the original file as `morning-star.txt.BAK` before making changes.

We can surmise that the format of a `sed` statement is:

    's/[regex]/[replacement]/'

To match literal slashes (e.g. `/`), you must escape them with a backslash (e.g. `\`). As a result, to match a `/` character you would use `\/` in the `sed` expression. If you are searching for a string that has a number of slashes, you can replace the slashes which another character. For instance:

    's|r/e/g/e/x|regex|'

This would strip the slashes from the string `r/e/g/e/x` so that this string would be `regex` after running the `sed` command on the file that contains the string.

The following example, from our [migrating a server to your Linode](/docs/migrate-to-linode/disk-images/migrating-a-server-to-your-linode) document, searches and replaces one IP address with another. In this case `98.76.54.32` is replaced with `12.34.56.78`:

    sed -i 's/98\.76\.54\.32/12\.34\.56\.78/'

In the above example, period characters are escaped as `\.`. In regular expressions the full-stop (period) character matches to any character.

Once again, `sed` is a very powerful and useful tool; however, if you are unfamiliar with it, we strongly recommend testing your search and replace patterns before making any edit of consequence. For more information about `sed` consider the full documentation of [text manipulation with sed](/docs/tools-reference/tools/manipulate-text-from-the-command-line-with-sed).

### How to Edit Text Interactively

In many Linode Library documents, you may be instructed to edit the contents of a file. To do this, you need to use a text editor. Most of the distribution templates that Linode provides come with an implementation of the vi/vim text editor and the nano text editor. These are small, lightweight, and very powerful text editors that allow you manipulate the text of a file from the terminal environment.

There are other options for text editors, notably emacs and "zile." Feel free to install these programs using your operating system's package manager. Make sure you [search your package database](#how_to_discover_package_names_and_information) so that you can install a version compiled without GUI components (i.e. X11).

To open a file, simply issue a command beginning with the name of the editor you wish to run followed by the name of the file you wish to edit. Here are a number of example commands that open the `/etc/hosts` file:

    nano /etc/hosts
    vi /etc/hosts
    emacs /etc/hosts
    zile /etc/hosts 

When you've made edits to a file, you can save and exit the editor to return to the prompt. This procedure varies between different editors. In emacs and zile, the key sequence is the same: depress control and type x and s to save. This operation is typically notated "C-x C-s" and then "C-x C-c" to close the editor. In nano, press Control-O (notated \^O) and confirm the file name to write the file, and type \^X to exit from the program.

Since vi and vim are modal editors, their operation is a bit more complex. After opening a file in vi, you can enter "insert" mode by pressing the "i" key; this will let you edit text in the conventional manner. To save the file, you must exit into "normal" mode by pressing the escape key (`Control-[` also sends escape), and then type `:wq` to write the file and quit the program.

This provides only the most basic outline of how to use these text editors, and there are numerous external resources which will provide a more thorough introduction for more advanced use of this software.

Web Servers and HTTP Issues
---------------------------

Linodes do not come with any particular web server installed by default. You have the choice and power to install and configure your web server as you see fit. This allows you to deploy a configuration in a way that makes sense for your application and desired use case. The [Linode Library](/) contains a number of documents regarding the installation and maintenance of various [web servers](/docs/web-servers/).

The following tips cover a number of basic web serving tasks and functions, as well as some guidance for users new to the world of web servers.

### How to Serve Websites

Web servers work by listening on a TCP port, typically port 80 for "http" and port 443 for "https." When a visitor makes a request for content, the servers respond by delivering the resource requested. Typically resources are specified with a URL that contains the protocol, `http` or `https`; a colon and two slashes, `://`; hostname or domain, `www.example.com` or `squire.example.com`; and the path to a file, `/images/avatar.jpg,` or `index.html`. Thus a full URL would resemble: `http://www.example.com/images/avatar.jpg`.

In order to provide these resources to connected users, your Linode needs to be running a web server. There are multiple different HTTP servers and countless configurations to provide support for various web development frameworks. The three most popular general use web servers are the [Apache HTTP](/docs/web-servers/apache) server, [Lighttpd server](/docs/web-servers/lighttpd) ("Lighty"), and [nginx server](/docs/web-servers/) ("Engine X"). Each server has its strengths and weaknesses, and your choice depends largely on your experience and the nature of your needs.

Once you've chosen a web server, you need to decide what (if any) scripting support you need to install. Scripting support allows you to run dynamic content with your web server and program server side scripts in languages such as Python, PHP, Ruby, and Perl.

If you need a full web application stack, we encourage you to consider one of our more full-featured [LAMP stack guides](/docs/lamp-guides/). If you need support for a specific web development framework, consult our tutorials for installing and using specific [web development frameworks](/docs/frameworks/).

### How to Choose a Web Server

In most situations, end users are completely oblivious to which web server you use. As a result, choosing a web server is often a highly personal decision based on the comfort of the administrator and the requirements of the deployment in question. This can be a challenge for the new systems administrator. This tip attempts to offer some guidance by providing some background and information which might be helpful during this process.

The [Apache HTTP Server](/docs/web-servers/apache/) is considered by many to be the *de facto* standard web server. It is the most widely deployed open source web server, its configuration interface has been stable for many years, and its modular architecture allows it to function in many different types of deployments. Apache forms the foundation of the [LAMP stack](/docs/lamp-guides), and contains superb support for integrating dynamic server-side applications into the web server.

By contrast, web servers like [Lighttpd](/docs/web-servers/lighttpd) and [nginx](/docs/web-servers/nginx/) are highly optimized for serving static content in an efficient manner. If you have a deployment where server resources are limited and are facing a great deal of demand, consider one of these servers. They are very functional and run very well with minimal systems resources. Lighttpd and nginx can be more complex to set up than Apache, and can be difficult to configure with regards to integration with dynamic content interpreters. Furthermore, as these servers are more directed at niche use cases, there are more situations and applications which remain undocumented.

Finally the [Cherokee web server](/docs/web-servers/cherokee/) provides a general purpose web server with an easy to configure interface. Cherokee might be a good option for some basic deployments.

Remember that the choice of web servers is often contextually determined. Specific choices depend on factors like: the type of content you want to serve, the demand for that content, and your comfort with that software as an administrator.

### Reading Apache Logs

Often, when there is something wrong with an [Apache web sever](/docs/web-servers/apache) configuration or site, it is difficult to determine what the cause of the error is from the behavior of the web server. There are a number of common issues with which you might begin your [troubleshooting efforts](/docs/web-servers/apache/troubleshooting/). However, when more complex issues arise it is important to review the Apache error logs.

By default, error logs are located in the /var/log/apache2/error.log file. You can track or "tail" this log with the following command:

    tail -F /var/log/apache2/error.log

In the default virtual host configurations suggested in our [Apache installation](/docs/web-servers/apache/) and [LAMP guides](/docs/lamp-guides), we suggest the following error logging setup:

{: .file-excerpt }
Apache Virtual Host Configuration

> ErrorLog /srv/www/example.com/logs/error.log CustomLog /srv/www/example.com/logs/access.log combined

Where `bucknell.net` represents the name of your virtual host, and the location of relevant files. These configuration directives make Apache create two log files that contain logging information specific to that virtual host. This allows you to easily troubleshoot errors on specific virtual hosts. To track or tail the error log, issue the following command:

    tail -F /srv/www/example.com/logs/error.log

This will allow you to see new error messages as they appear. Often problems can be diagnosed by using specific parts of an error message from an Apache log as a term in Web search (e.g. Google.) Common errors to look for include:

-   Missing files, or errors in file names.
-   Permissions errors.
-   Configuration errors.
-   Dynamic code execution or interpretation errors.

DNS Servers and Domain Names
----------------------------

The *Domain Name System*, or DNS, is the service that the Internet uses to associate the hard to remember and manage IP addresses with more human-usable domain names. These tips address several specific DNS related tasks. To learn more about DNS consider our [overview of the domain name system](/docs/dns-guides/introduction-to-dns). If you are familiar with DNS and just need to figure out how to set up your DNS server, consider our documentation of the [Linode DNS manager](/docs/dns-guides/configuring-dns-with-the-linode-manager).

### Using CNAMEs to Redirect DNS Queries

[CNAME DNS records](/docs/dns-guides/introduction-to-dns#cname_records) make it possible to redirect requests for one hostname or domain to another hostname or domain. This is useful in situations where you want to direct requests for one domain to another, but don't want to set up the web-server to handle requests.

CNAMEs are **only** valid when pointing from one domain to another. If you need to redirect a full URL, you will need to set up a web server and [configure redirection](/docs/web-servers/apache/configuration/redirecting-urls) and/or virtual hosting on the server level. CNAMEs will allow you to redirect subdomains, such as `team.example.com`, to other subdomains or domains, such as `jack.example.org`. CNAMEs must point a valid a domain that has a valid A Record, or to another CNAME.

Although limited in their capabilities, CNAMEs can be quite useful in some situations. In particular, if you need to change the hostname of a machine, CNAMEs are quite useful. To learn how to set up CNAME records with the [Linode Manager](http://manager.linode.com//), consult our documentation of the [Linode DNS Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager).

### How to Set Up Subdomains

When [reading domain names](/docs/dns-guides/introduction-to-dns#anatomy_of_a_domain_name), we commonly refer to parts before the main or first-level domain as "sub-domains." For example, in the domain `team.example.com`, `team` is a sub-domain for the root domain `example.com`.

If you want to [create and host a sub-domain](/docs/dns-guides/introduction-to-dns#configuring_subdomains), consider the following process:

First we need to create an [A Record](/docs/dns-guides/introduction-to-dns#a_aaaa_records)

in the DNS zone for the domain. This is easily accomplished when using the [Linode DNS Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager). As always, you may host the DNS for your domain with any provider you choose.

In order for your server to respond to requests for this domain, you must set up a server to respond to these requests. For web servers like [Apache](/docs/web-servers/apache/) this requires [configuring a new virtual host](/docs/web-servers/apache/installation/debian-5-lenny#configure_apache_for_named_based_virtual_hosting). For XMPP Servers you must [configure an additional host](/docs/applications/messaging/instant-messaging-services-with-ejabberd-on-ubuntu-12-04-precise-pangolin#hostnames_and_virtual_hosting) to receive the requests for this host. For more information, consult the documentation for the specific server you wish to deploy.

Once configured, subdomains function identically to first-level domains on your server in almost all respects. If you need to, you can set up HTTP redirection for the new sub domain.

SMTP Servers and Email Issues
-----------------------------

We provide a number of guides that cover [email-related issues](/docs/email/). The following tips attempt to further demystify email management.

### Choosing an Email Solution

There are two major components of the email stack that are typically required for basic email functionality. The most important part of the tool chain is the SMTP server or "Mail Transfer Agent." The MTA, as it is often called, sends mail from one server to another. The second crucial part of an email system is a server that permits users to access and download that mail from the server to their own machine. Typically these server use a protocol such as POP3 or IMAP to provide remote access to the mailbox.

There are additional components in the email server tool chain. These components may or may not be optional depending on the requirements of your deployment. They include filtering and delivery tools like [procmail](http://www.procmail.org/), anti-virus filters like [ClamAV](http://www.clamav.net/), mailing list managers like [MailMan](http://www.gnu.org/software/mailman/index.html), and spam filters like [SpamAssassin](http://spamassassin.apache.org/). These components function independently of which MTA and remote mailbox accessing server you chose to deploy.

The most prevalent SMTP servers or MTAs in the UNIX-like world are [Postfix](http://www.postfix.org/), [Exim](http://www.exim.org/), and [Sendmail](http://www.sendmail.org/). Sendmail has the longest history and many systems administrators have extensive experience with it. Postfix is robust and modern, and is compatible with many different deployment types. Exim is the default MTA in Debian systems, and many consider it to be easier to use for basic tasks. For remote mailbox access, servers like [Courier](/docs/email/postfix/courier-mysql-debian-5-lenny) and [Dovecot](http://www.dovecot.org/) are widely deployed to provide remote access to mailboxes.

If you are in need of an integrated and easy to install email solution we encourage you to consider the [Citadel groupware server](/docs/email/citadel/). Citadel provides an integrated "turnkey" solution that includes an SMTP server, remote mailbox access, real time collaboration tools including XMPP, and a shared calendar interface. Along similar lines, we also provide documentation for the installation of the [Zimbra groupware server](/docs/email/zimbra).

If, by contrast, you want a more simple and modular email stack, we urge you to consider one of our guides built around the [Postfix SMTP server](/docs/email/postfix/).

Finally, it's possible to outsource email service to a third party provider, such as [Google Apps](/docs/email/google-mail/) or [FastMail.fm](http://www.fastmail.fm). This allows you to send and receive mail from your domain, without hosting email services on your Linode. Consult our documentation for setting up [Google Apps for your domain](/docs/email/google-mail/).

### Sending Email From Your Server

In many cases, administrators have no need for a complete email stack like those documented in our [email guides](/docs/email/). However, applications running on that server still need to be able to send mail for notifications and other routine purposes.

The configuration of applications to send notifications and alerts is beyond the scope of this tip, most applications rely on a simple "sendmail" interface. Nevertheless, the modern MTAs Postfix provides a sendmail-compatible interfaces located at `/usr/sbin/sendmail`.

You can install postfix on Debian and Ubuntu systems with the following command:

    apt-get install postfix

On CentOS and Fedora systems you can install postfix by issuing the following command:

    yum install postfix

Once Postfix is installed, your applications should be able to access the sendmail interface, located at `/usr/sbin/sendmail`. Most applications running on your Linode should be able to send mail normally with this configuration.

If you simply want to use your server to send email through an external SMTP server, you may want to consider a more simple tool like `msmtp`. Since `msmtp` is packaged in most distributions you can install using the command appropriate to your distribution:

    apt-get install msmtp
    yum install msmtp
    pacman -S msmtp

Use the command `type msmtp`, to find the location of `msmtp` on your system. Typically the program is located at `/usr/bin/msmtp`. You can specify authentication credentials with command line arguments or by declaring SMTP credentials in a configuration file. Here is an example `.msmtprc` file.

{: .file-excerpt }
.msmtprc example

> account default host smtp.example.com from <squire@example.com> auth on user squire password s3cr37 tls on tls\_certcheck off port 587

The `.msmptrc` file needs to be set to mode 600, and owned by the user account that will be sending mail. If the configuration file is located at `/srv/smtp/msmtprc`, you can call mstmp with the following command:

    /usr/bin/msmtp --file=/srv/smtp/msmtprc



