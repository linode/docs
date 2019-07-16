---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to lsof.'
keywords: ["UNIX", "lsof", "TCP/IP", "network", "utility"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-16
modified_by:
  name: Linode
title: 'Learning to use lsof at its full potential'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[lsof](https://en.wikipedia.org/wiki/Lsof)'
---

## Before You Begin

{{< note >}}
Most of the times running `lsof` without using the `sudo` utility will result in getting
different results. Practically, this means that running `lsof` without root privileges will show
the results available to the current user only. If you are not familiar with the `sudo` command,
see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Introduction

Lsof was created by [Victor A. Abell](https://people.freebsd.org/~abe/) and is a utility that
lists open files. However, `lsof` can do much more than just listing open files because everything
in UNIX is a file. This means that `lsof` can also deal with network interfaces and display
information about network connections. You can install `lsof` on your Linux system using your
favorite package manager.

This article will present various practical `lsof` usages with the confidence that they will
help you during systems and network troubleshooting.

The two main drawbacks of `lsof` are that it can only display information about the local
machine (`localhost`) and that it needs administrative privileges to get all data. Usually,
you do not execute `lsof` without any command line parameters because you will find its output
crowded and difficult to read. This happens because in this case `lsof` will list all open files
belonging to all active processes – the output of `wc(1)` shows that the list is pretty long:

    lsof | wc
{{< output >}}
    7332   68337 1058393
{{< /output >}}

## Command Line Options

The `lsof(8)` binary supports a plethora of command line options, including the following:

- `-h` and `-?`: Both options present a help screen. Please note that you will need to properly escape the `?` character for `-?` to work.
- `-a`: This option tells `lsof` to logically AND all provided options.
- `-b`: This option tells `lsof` to avoid kernel functions that might block and is a pretty specialized option.
- `-l`: If converting a user ID to a login name is working improperly or slowly, you can disable it using the `-l` parameter.
- `–P`: The `-P` option inhibits the conversion of port numbers to port names for network files.
- `-u list`: The `-u` option allows to define a list of login names or user ID numbers. The `-u` option supports the `^` character for excluding
    the matches from the output.
- `-c list`: The `-c` option selects the listing of files for processes executing the commands that begin with the characters in the `list`
    and also supports regular expressions. The `-c` option also supports the `^` character for excluding the matches from the output.
- `-p list`: The `-p` option allows you to select the files for the processes whose process IDs are in the `list`.
    The `-p` option supports the `^` character for excluding the matches from the output.
- `-g`: The `-g` option allows you to select the files for the processes whose optional process group IDs are in the `list`.
    The `-g` option supports the `^` character for excluding the matches from the output.
- `-s`: The `-s` option allows you to select the network protocols and states that interest you.
    The `-s` option supports the `^` character for excluding the matches from the output.
- `+d s`: The `+d` option option tells `lsof` to search for all open instances of directory `s` and the files and directories
    it contains at its top level.
- `+D directory`: The `+D` option tells `lsof` to search for all open instances of directory `directory` and all the files
    and directories it contains to its complete depth.
- `-d s`: The `-d` option specifies the list of file descriptors to include or exclude from the output. `-d 1,^2` means include
    file descriptor `1` and exclude file descriptor `2`.
- `-i4`: This option is used for displaying IPv4 data only.
- `-i6`: This option is used for displaying IPv6 data only.
- `-i`: The `-i` option without any values tells `lsof` to display network connections only.
- `-i ADDRESS`: The `-i` option with a value will limit the displayed information to match that value. Some example values are
    `TCP:25` for displaying TCP data that listens to port number 25, `@google.com` for displaying information related to `google.com`,
	`:25` for displaying information related to port number `25`, `:POP3` for displaying information related to the port number that is
	associated to `POP3` in the `/etc/services` file, etc. You can also combine hostnames and IP Addresses with port numbers and
	protocols.
- `-t`: The `-t` option tells `lsof` to display process identifiers without a header line. This is particularly useful for
    feeding the output of `lsof` to the `kill(1)` command or to a script. Notice that `-t` automatically selects the `-w` option.
- `-w`: The `-w` option disables the suppression of warning messages.
- `+w`: The `+w` option enables the suppression of warning messages.

{{< note >}}
By default, the output of `lsof` will include the output of each one of its command line options,
like a big logical expression with multiple OR logical operators between all the command line
options. However, this default behavior can change with the use of the `-a` option.
{{< /note >}}

{{< note >}}
For the full list of command line options supported by `lsof` and a more detailed
explanation of the presented command line options, you should visit its manual page.
{{< /note >}}

## The Output of lsof

The output of `lsof` has various columns. The `COMMAND` column contains the first nine
characters of the name of the UNIX command associated with the process. The `PID` column
shows the process ID of the command whereas the `USER` column displays the name of the
user that owns the process. The `TID` column shows the task ID. A blank `TID` indicates a
process. The `FD` column stands for file descriptor. Its values can be cwd, txt, mem and
mmap. The `TYPE` column displays the type of the file: regular file, directory, socket, etc.
The `DEVICE` column contains the device numbers separated by commas. The value of the `SIZE/OFF`
column is the size of the file or the file offset in bytes. The value of the `NODE` column
is the node number of a local file. Last, the `NAME` column shows the name of the mount point
and file system the file is located or the Internet address.

## Show all open UDP files

The following command will display all open UDP files/connections:

    lsof
{{< output >}}
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
rpcbind   660  root    6u  IPv4  20296      0t0  UDP *:sunrpc
rpcbind   660  root    7u  IPv4  20298      0t0  UDP *:836
rpcbind   660  root    9u  IPv6  20300      0t0  UDP *:sunrpc
rpcbind   660  root   10u  IPv6  20301      0t0  UDP *:836
avahi-dae 669 avahi   12u  IPv4  20732      0t0  UDP *:mdns
avahi-dae 669 avahi   13u  IPv6  20733      0t0  UDP *:mdns
avahi-dae 669 avahi   14u  IPv4  20734      0t0  UDP *:54087
avahi-dae 669 avahi   15u  IPv6  20735      0t0  UDP *:48582
rsyslogd  675  root    6u  IPv4  20973      0t0  UDP li10-121.members.linode.com:syslog
dhclient  797  root    6u  IPv4  21828      0t0  UDP *:bootpc
ntpd      848   ntp   16u  IPv6  22807      0t0  UDP *:ntp
ntpd      848   ntp   17u  IPv4  22810      0t0  UDP *:ntp
ntpd      848   ntp   18u  IPv4  22814      0t0  UDP localhost:ntp
ntpd      848   ntp   19u  IPv4  22816      0t0  UDP li10-121.members.linode.com:ntp
ntpd      848   ntp   20u  IPv6  22818      0t0  UDP localhost:ntp
ntpd      848   ntp   24u  IPv6  24916      0t0  UDP [2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd      848   ntp   25u  IPv6  24918      0t0  UDP [fe80::f03c:91ff:fe69:1381]:ntp
{{< /output >}}

## The repeat mode

Running `lsof` with the `–r` option puts `lsof` in repeat mode which means that it
might run forever and that you should kill `lsof` manually in order to terminate it.

The `+r` option will also put `lsof` in repeat mode – its difference is that it will
automatically terminate `lsof` when a circle has no new output to print. When `lsof`
is in repeat mode, it prints new output every `t` seconds (*a circle*); the default value
of `t` is 15 seconds, which you can change by typing an integer value after `-r` or `+r`.

The following command tells `lsof` to display all UDP connections every 100 seconds:

    lsof -r 100 -i UDP

## Show all open TCP files

The following command will display all open TCP files/connections:

    lsof -i TCP
{{< output >}}
COMMAND   PID     USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
sshd      812     root    3u  IPv4   23674      0t0  TCP *:ssh (LISTEN)
sshd      812     root    4u  IPv6   23686      0t0  TCP *:ssh (LISTEN)
mysqld   1003    mysql   17u  IPv4   24217      0t0  TCP localhost:mysql (LISTEN)
master   1245     root   13u  IPv4   24480      0t0  TCP *:smtp (LISTEN)
sshd    22352     root    3u  IPv4 8613370      0t0  TCP li10-121.members.linode.com:ssh->ppp-2-8-23-19.home.otenet.gr:60032 (ESTABLISHED)
sshd    22361   mtsouk    3u  IPv4 8613370      0t0  TCP li10-121.members.linode.com:ssh->ppp-2-8-23-19.home.otenet.gr:60032 (ESTABLISHED)
apache2 24565     root    4u  IPv6 8626153      0t0  TCP *:http (LISTEN)
apache2 24565     root    6u  IPv6 8626157      0t0  TCP *:https (LISTEN)
apache2 24567 www-data    4u  IPv6 8626153      0t0  TCP *:http (LISTEN)
apache2 24567 www-data    6u  IPv6 8626157      0t0  TCP *:https (LISTEN)
apache2 24568 www-data    4u  IPv6 8626153      0t0  TCP *:http (LISTEN)
apache2 24568 www-data    6u  IPv6 8626157      0t0  TCP *:https (LISTEN)
apache2 24569 www-data    4u  IPv6 8626153      0t0  TCP *:http (LISTEN)
apache2 24569 www-data    6u  IPv6 8626157      0t0  TCP *:https (LISTEN)
apache2 24570 www-data    4u  IPv6 8626153      0t0  TCP *:http (LISTEN)
apache2 24570 www-data    6u  IPv6 8626157      0t0  TCP *:https (LISTEN)
apache2 24571 www-data    4u  IPv6 8626153      0t0  TCP *:http (LISTEN)
apache2 24571 www-data    6u  IPv6 8626157      0t0  TCP *:https (LISTEN)
{{< /output >}}

## Listing all ESTABLISHED Internet Connections:

If you process the output of `lsof` with some traditional UNIX command line tools
you can list all active network connections:

    lsof -i -n -P | grep ESTABLISHED | awk '{print $1, $9}' | sort -u
{{< output >}}
sshd 109.74.193.253:22->2.86.23.29:60032
{{< /output >}}

{{< note >}}
The `lsof -i -n -P` command can be also written as `lsof -i -nP` or alternatively as
`lsof -nPi` – writing it as `lsof -inP` would generate a syntax error because `lsof`
thinks that `np` is a parameter to `-i`.
{{< /note >}}

## Find all established SSH Connections

The following command finds all established SSH connections to the local machine:

    lsof | grep sshd | grep ESTABLISHED
{{< output >}}
253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
sshd      22361           mtsouk    3u     IPv4            8613370       0t0        TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

The following slightly improved version will do the same but much quicker because the `-i TCP`
option makes `lsof` to print less information, which mean that `grep` will have less data
to process:

    lsof -i TCP | grep ssh | grep ESTABLISHED

Alternatively, you can execute the following command to find all established SSH
connections:

    lsof -nP -iTCP -sTCP:ESTABLISHED | grep SSH

## Which program Listens to a TCP port

This section presents one of the most frequent uses of `lsof`. The presented `lsof`
command will allow you to find which program listens to a given TCP port by listing
all TCP processes that are in `LISTEN` state:

    lsof -nP -iTCP -sTCP:LISTEN
{{< output >}}
COMMAND   PID     USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
sshd      812     root    3u  IPv4   23674      0t0  TCP *:22 (LISTEN)
sshd      812     root    4u  IPv6   23686      0t0  TCP *:22 (LISTEN)
mysqld   1003    mysql   17u  IPv4   24217      0t0  TCP 127.0.0.1:3306 (LISTEN)
master   1245     root   13u  IPv4   24480      0t0  TCP *:25 (LISTEN)
apache2 24565     root    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24565     root    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24567 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24567 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24568 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24568 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24569 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24569 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24570 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24570 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24571 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24571 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24585 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24585 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
{{< /output >}}

Other possible states of a TCP connection are CLOSED, SYN-SENT, SYN-RECEIVED,
ESTABLISHED, CLOSE-WAIT, LAST-ACK, FIN-WAIT-1, FIN-WAIT-2, CLOSING and TIME-WAIT.

## Choosing between IPv4 and IPv6

`lsof` lists both IPv4 and IPv6 connections by default but you can choose the kind
of connections you want to display. The following command displays IPv4 connections
only:

    lsof -i4

Therefore, the next command will display all TCP connections of the IPv4 protocol:

    lsof -i4 | grep TCP

An equivalent command to the `lsof -i4 | grep TCP` command is the following:

    lsof -i4 -a -i TCP

On the other hand the following command will display IPv6 connections only:

    lsof -i6

Therefore, the next command will display all UDP connections of the IPv6 protocol:

    lsof -i6 | grep UDP
{{< output >}}
avahi-dae   669    avahi   13u  IPv6   20733      0t0  UDP *:mdns
avahi-dae   669    avahi   15u  IPv6   20735      0t0  UDP *:48582
ntpd        848      ntp   16u  IPv6   22807      0t0  UDP *:ntp
ntpd        848      ntp   20u  IPv6   22818      0t0  UDP localhost:ntp
ntpd        848      ntp   24u  IPv6   24916      0t0  UDP [2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd        848      ntp   25u  IPv6   24918      0t0  UDP [fe80::f03c:91ff:fe69:1381]:ntp
{{< /output >}}

## Which processes are accessing a Given File

You can find the processes that are accessing a given file, which is this case is
`/usr/bin/lsof`, by running the next command:

    lsof `which lsof`
{{< output >}}
lsof    25079 root txt    REG    8,0   163136 5693 /usr/bin/lsof
lsof    25080 root txt    REG    8,0   163136 5693 /usr/bin/lsof
{{< /output >}}

The two lines of output make perfect sense because `/usr/bin/lsof` is accessed by
both `which(1)` and `lsof`!

If you are only interested in the process ID of the processes that are accessing
a file, you can use the `-t` option:

    lsof -t `which lsof`
{{< output >}}
25157
25158
{{< /output >}}

A process ID can be used for easily killing a process using the `kill(1)` command,
which is something that should be executed with great care.

## List open files under a Given Directory

The given `lsof` command will display all open files under a given directory,
which is this case is `/etc`, as well as the name of the process that keeps a
file or a directory open:

    lsof +D /etc
{{< output >}}
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF   NODE NAME
avahi-dae 669 avahi  cwd    DIR    8,0     4096 745751 /etc/avahi
avahi-dae 669 avahi  rtd    DIR    8,0     4096 745751 /etc/avahi
{{< /output >}}

## Finding information on a Given Protocol

The next `lsof` command shows open UDP files that use the ntp (Network Time Protocol) port only:

    lsof -i UDP:ntp
{{< output >}}
COMMAND PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
ntpd    848  ntp   16u  IPv6  22807      0t0  UDP *:ntp
ntpd    848  ntp   17u  IPv4  22810      0t0  UDP *:ntp
ntpd    848  ntp   18u  IPv4  22814      0t0  UDP localhost:ntp
ntpd    848  ntp   19u  IPv4  22816      0t0  UDP li140-253.members.linode.com:ntp
ntpd    848  ntp   20u  IPv6  22818      0t0  UDP localhost:ntp
ntpd    848  ntp   24u  IPv6  24916      0t0  UDP [2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd    848  ntp   25u  IPv6  24918      0t0  UDP [fe80::f03c:91ff:fe69:1381]:ntp
{{< /output >}}

The output displays connections that use either IPv4 or IPv6. If you want to display
the connections that use IPv4 only, you can run the following command:

    lsof -i4 -a -i UDP:ntp
{{< output >}}
COMMAND PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
ntpd    848  ntp   17u  IPv4  22810      0t0  UDP *:ntp
ntpd    848  ntp   18u  IPv4  22814      0t0  UDP localhost:ntp
ntpd    848  ntp   19u  IPv4  22816      0t0  UDP li140-253.members.linode.com:ntp
{{< /output >}}

## Logically ADD all options

In this section of the guide you will learn how to logically AND the existing options
using the `-a` flag. This will allow you to filter your output and find out what you
are really looking for without searching into too much information.

The following command finds all open sockets belonging to the `www-data` user:

    lsof -Pni -a -u www-data
{{< output >}}
COMMAND   PID     USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
apache2  6385 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2  6385 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2  6386 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2  6386 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2  6387 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2  6387 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24567 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24567 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24570 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24570 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 24585 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 24585 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 25431 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 25431 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 27827 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 27827 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 27828 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 27828 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
apache2 27829 www-data    4u  IPv6 8626153      0t0  TCP *:80 (LISTEN)
apache2 27829 www-data    6u  IPv6 8626157      0t0  TCP *:443 (LISTEN)
{{< /output >}}

{{< note >}}
You are allowed to place the `-a` option wherever you like is an `lsof` command as it
will still cause the ANDing of all selection options.
{{< /note >}}

## Finding network connections From or To an External Host

The following command finds all network connections coming from or going to ppp-2-86-23-29.home.otenet.gr:

    lsof -i @ppp-2-86-23-29.home.otenet.gr
{{< output >}}
sshd    22352   root    3u  IPv4 8613370      0t0  TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
sshd    22361 mtsouk    3u  IPv4 8613370      0t0  TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

You can also specify the range of ports that interest you as follows:

    lsof -i @ppp-2-86-23-29.home.otenet.gr:200-250

## List files that are Opened by a Specific User

This is a very practical option because it allows you to locate the files opened by
any user including the web and database users.

The following command lists all open files opened by the `www-data` user:

    lsof -u www-data
{{< output >}}
COMMAND    PID     USER   FD      TYPE             DEVICE SIZE/OFF    NODE NAME
php5-fpm  1066 www-data  cwd       DIR                8,0     4096       2 /
php5-fpm  1066 www-data  rtd       DIR                8,0     4096       2 /
.
.
.
{{< /output >}}

The next variation finds all `ESTABLISHED` connections owned by the `www-data` user:

    lsof -u www-data | grep -i ESTABLISHED
{{< output >}}
apache2  24571 www-data   29u     IPv6            8675584      0t0     TCP li140-253.members.linode.com:https->ppp-2-86-23-29.home.otenet.gr:61383 (ESTABLISHED)
apache2  24585 www-data   29u     IPv6            8675583      0t0     TCP li140-253.members.linode.com:https->ppp-2-86-23-29.home.otenet.gr:61381 (ESTABLISHED)
apache2  27827 www-data   29u     IPv6            8675582      0t0     TCP li140-253.members.linode.com:https->ppp-2-86-23-29.home.otenet.gr:61382 (ESTABLISHED)
{{< /output >}}

Last, the next command will find all processes except the ones owned by `www-data`:

    lsof -u ^www-data
{{< output >}}
COMMAND     PID   TID       USER   FD      TYPE             DEVICE  SIZE/OFF       NODE NAME
systemd       1             root  cwd       DIR                8,0      4096          2 /
systemd       1             root  rtd       DIR                8,0      4096          2 /
systemd       1             root  txt       REG                8,0   1120992    1097764 /lib/systemd/systemd
.
.
.
{{< /output >}}

If the user name you are trying to use does not exist, you will get an error message
similar to the following:

    lsof -u doesNotExist
{{< output >}}
lsof: can't get UID for doesNotExist
lsof 4.89
 latest revision: ftp://lsof.itap.purdue.edu/pub/tools/unix/lsof/
 latest FAQ: ftp://lsof.itap.purdue.edu/pub/tools/unix/lsof/FAQ
 latest man page: ftp://lsof.itap.purdue.edu/pub/tools/unix/lsof/lsof_man
 usage: [-?abhKlnNoOPRtUvVX] [+|-c c] [+|-d s] [+D D] [+|-E] [+|-e s] [+|-f[gG]]
 [-F [f]] [-g [s]] [-i [i]] [+|-L [l]] [+m [m]] [+|-M] [-o [o]] [-p s]
 [+|-r [t]] [-s [p:s]] [-S [t]] [-T [t]] [-u s] [+|-w] [-x [fl]] [--] [names]
Use the ``-h'' option to get more help information.
{{< /output >}}

## Showing processes that are listening to a particular port

The following command shows all network connections that listen to port number `22`
(ssh) using either UDP or TCP:

    lsof -i :22
{{< output >}}
COMMAND   PID   USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
sshd      812   root    3u  IPv4   23674      0t0  TCP *:ssh (LISTEN)
sshd      812   root    4u  IPv6   23686      0t0  TCP *:ssh (LISTEN)
sshd    22352   root    3u  IPv4 8613370      0t0  TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
sshd    22361 mtsouk    3u  IPv4 8613370      0t0  TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

## Killing All processes owned by a user

The following command *brutally* kills all processes owned by the `www-data` user:

    kill -9 `lsof -t -u www-data`

Please be careful when combining `lsof` with the `kill(1)` command! Do not try to
test similar commands on a live server – use a Docker image of something similar.

## Finding all network activity from a given user:

The following command lists all network activity by a user named  `mtsouk`:

    lsof -a -u mtsouk -i
{{< output >}}
COMMAND   PID   USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
sshd    22361 mtsouk    3u  IPv4 8613370      0t0  TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

On the other hand, the following command lists all network activity from processes not owned by
the `root` or the `www-data` user:

    lsof -a -u ^root -i -u ^www-data
{{< output >}}
avahi-dae   669  avahi   12u  IPv4   20732      0t0  UDP *:mdns
avahi-dae   669  avahi   13u  IPv6   20733      0t0  UDP *:mdns
avahi-dae   669  avahi   14u  IPv4   20734      0t0  UDP *:54087
avahi-dae   669  avahi   15u  IPv6   20735      0t0  UDP *:48582
ntpd        848    ntp   16u  IPv6   22807      0t0  UDP *:ntp
ntpd        848    ntp   17u  IPv4   22810      0t0  UDP *:ntp
ntpd        848    ntp   18u  IPv4   22814      0t0  UDP localhost:ntp
ntpd        848    ntp   19u  IPv4   22816      0t0  UDP li140-253.members.linode.com:ntp
ntpd        848    ntp   20u  IPv6   22818      0t0  UDP localhost:ntp
ntpd        848    ntp   24u  IPv6   24916      0t0  UDP [2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd        848    ntp   25u  IPv6   24918      0t0  UDP [fe80::f03c:91ff:fe69:1381]:ntp
mysqld     1003  mysql   17u  IPv4   24217      0t0  TCP localhost:mysql (LISTEN)
sshd      22361 mtsouk    3u  IPv4 8613370      0t0  TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

## Disabling DNS and port number resolving

`lsof` uses the data found in the `/etc/services` file to map a port number to a
service. You can disable this functionality by using the `–P` switch as follows:

    lsof -P -i UDP:ntp -a -i4
{{< output >}}
COMMAND PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
ntpd    848  ntp   17u  IPv4  22810      0t0  UDP *:123
ntpd    848  ntp   18u  IPv4  22814      0t0  UDP localhost:123
ntpd    848  ntp   19u  IPv4  22816      0t0  UDP li140-253.members.linode.com:123
{{< /output >}}

In a similar way, you can disable DNS resolving using the `-n` option:

    lsof -P -i UDP:ntp -a -i4 -n
{{< output >}}
COMMAND PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
ntpd    848  ntp   17u  IPv4  22810      0t0  UDP *:123
ntpd    848  ntp   18u  IPv4  22814      0t0  UDP 127.0.0.1:123
ntpd    848  ntp   19u  IPv4  22816      0t0  UDP 109.74.193.253:123
{{< /output >}}

The `-n` option can be particularly useful when you have a problem with your DNS
servers or when you are interested in the actual IP address.

## Using Regular Expressions

`lsof` has support for regular expressions. Regular expressions begin and end with a
slash (`/`) character. The `^` character denotes the beginning of a line whereas `$`
denotes the end of the line. Each dot (`.`) character represents a single character in
the output.

The following `lsof` command will find all commands that have precisely five characters:

    lsof -c /^.....$/
{{< output >}}
COMMAND PID USER   FD      TYPE DEVICE SIZE/OFF NODE NAME
netns    18 root  cwd       DIR    8,0     4096    2 /
netns    18 root  rtd       DIR    8,0     4096    2 /
netns    18 root  txt   unknown                      /proc/18/exe
jfsIO   210 root  cwd       DIR    8,0     4096    2 /
jfsIO   210 root  rtd       DIR    8,0     4096    2 /
jfsIO   210 root  txt   unknown                      /proc/210/exe
kstrp   461 root  cwd       DIR    8,0     4096    2 /
kstrp   461 root  rtd       DIR    8,0     4096    2 /
kstrp   461 root  txt   unknown                      /proc/461/exe
{{< /output >}}

## Find the total number of TCP and UDP connection

If you process the output of `lsof` with some traditional UNIX command line tools
you can calculate the total number of TCP and UDP connections:

    lsof -i | awk '{print $8}' | sort | uniq -c | grep 'TCP\|UDP'
{{< output >}}
     28 TCP
     13 UDP
{{< /output >}}

The `lsof –i` command lists all Internet connections whereas `awk` extracts the 8th
field, which is the value of the `NODE` column and `sort` sorts the output. Then, the
`uniq –c` command counts how many times each line exists. Last, the `grep –v 'TCP\|UDP'`
command displays the lines that contain the `TCP` or the `UDP` word in them.

## Output For Other Programs

Using the `-F` option, `lsof` generates output that is suitable for processing by scripts
written in programming languages such as `awk`, `perl` and `python`.

The following command will display each field of the `lsof` output in a separate line:

    lsof -n -i4 -a -i TCP:ssh -F
{{< output >}}
p812
g812
R1
csshd
u0
Lroot
f3
au
l
tIPv4
.
.
.
{{< /output >}}

Using various arguments to the `-F` option you can generate less output – notice that the process ID
and the file descriptor are always printed in the output. As an example, the following command
will only print the process ID, which is preceded by the `p` character, the file descriptor, which
is preceded by the `f` character, and the protocol name of each entry, which is preceded by
the `P` character:

    lsof -n -i4 -a -i TCP:ssh -FP
{{< output >}}
p812
f3
PTCP
p22352
f3
PTCP
p22361
f3
PTCP
{{< /output >}}

{{< note >}}
For the full list of options supported by `-F`, you should visit the manual page of `lsof`.
{{< /note >}}

## Summary

`lsof` can do many more things than the ones presented here because there exist
a large number of ways that you can combine its command line options. All you have
to do is experiment and you will soon be able to solve many of your networking
problems using `lsof`.
