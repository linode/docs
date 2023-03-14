---
slug: ss
description: 'An introduction to the ss utility.'
keywords: ["UNIX", "shell", "AWK", "ss", "TCP/IP", "network", "socket"]
tags: ["networking","statistics","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-28
modified: 2020-12-03
modified_by:
  name: Linode
title: 'Learning to Use the ss Tool to its Full Potential'
external_resources:
  - '[iproute2](https://en.wikipedia.org/wiki/Iproute2)'
aliases: ['/networking/diagnostics/ss/']
authors: ["Mihalis Tsoukalos"]
---

## Introduction

The study of socket connections is important for every UNIX and network administrator because it allows you to better understand your Linux system's status. Written by Alexey Kuznetosv to replace the famous `netstat` utility , the more capable `ss` (socket statistics) utility allows you to monitor TCP, UDP, and UNIX sockets. The purpose of this guide is to help you learn the `ss` utility and to use it as productively as possible.

{{< note respectIndent=false >}}
Running `ss` without using the `sudo` utility results in different output. Practically, this means that running `ss` without root privileges displays the results available to the current user only. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Command Line Options

The `ss(8)` binary supports many command line options, including the following:

| **Option** | **Definition** |
| ---------- | -------------- |
| `-h` | The `-h` option shows a summary of all options. |
| `-V` | The `-V` option displays the version of `ss` |
| `-H`| The `-H` option tells `ss` to suppress the header line – this is useful when you want to process the generated output using a scripting language. |
| `-t` | The `-t` parameter tells `ss` to show TCP connections only. |
| `-u` | The `–u` parameter tells `ss` to show UDP connections only. |
| `-d` | The `–d` parameter tells `ss` to show DCCP sockets only. |
| `-S` | The `–S` parameter tells `ss` to show SCTP sockets only. |
| `-a` | The `-a` option tells `ss` to display both listening and non-listening sockets of every kind. |
| `-l` | The `-l` parameter tells `ss` to display listening sockets, which are omitted by default. |
| `-e` | The `-e` option tells `ss` to display detailed socket information. |
| `-x` | The `-x` parameter tells `ss` to display UNIX domain sockets only. |
| `-A` | The `-A` option allows you to select the socket types that you want to see. The `-A` option accepts the following set of identifiers that can be combined and separated by commas: `all`, `inet`, `tcp`, `udp`, `raw`, `unix`, `packet`, `netlink`, `unix_dgram`, `unix_stream`, `unix_seqpacket`, `packet_raw` and `packet_dgram`. |
| `-4` | The `-4` command line option tells `ss` to display IPv4 connections only. |
| `-6` | The `-6` command line option tells `ss` to display IPv6 connections only. |
| `-f FAMILY` | The `-f` tells `ss` to display sockets of type `FAMILY`. The supported values are `unix`, `inet`, `inet6` and `netlink`. |
| `-s` | The `-s` option displays useful statistics about the current connections. |
| `-o` | The `-o` option displays timer information. There are five types of timers: `on`, which is either a TCP retrans timer, a TCP early retrans timer, or a tail loss probe timer; `keepalive`, which is the TCP keep alive timer; `timewait`, which is the timewait stage timer; `persist`, which is the zero window probe timer; and `unknown`, which is a timer that is none of the other timers. |
| `-n` | The `-n` option tells `ss` to disable the resolving of service names. |
| `-r` | The `-r` option tells `ss` to enable DNS resolving in the output, which is turned off by default. |
| `-m` | The `-m` parameter tells `ss` to display socket memory usage information. |
| `-p` | The `-p` parameter tells `ss` to display the process that is using a socket. |
| `-D FILE` | The `-D` parameter tells `ss` to save the output in the `FILE` file. |

{{< note respectIndent=false >}}
The `-A tcp` option is equivalent to `-t`, the `-A udp` option is equivalent to `-u` and the ` –A unix`
option is equivalent to `-x`.
{{< /note >}}

## Installing ss

The `ss` tool is part of the [IPROUTE2 Utility Suite](https://en.wikipedia.org/wiki/Iproute2). Since the `ss` command line tool is usually installed by default, you do not need to install it yourself. On a Debian Linux system, you can find the `ss` executable inside `/bin`.

If for some reason `ss` is not installed on your Linux system, you should install the `iproute2` package using your favorite package manager.

## Examples

### Basic Usage

The simplest way to use `ss` is without any command line parameters. When `ss` is used without any command line arguments, it prints all TCP, UDP, and socket connections. The list might get big on busy machines, which means that it can become more difficult to parse. The output of `wc(1)`, (a word count utility), shows that the list is long yet manageable:

    ss | wc

{{< output >}}
     94     750    7926
{{< /output >}}

If you also use the `-a` parameter to show all listening and non-listening sockets, the output is much higher:

    ss -a | wc

{{< output >}}
    224    1682   19562
{{< /output >}}

### Listing Sockets

### TCP

The following command displays all listening and non-listening (`-a`) TCP (`-t`) sockets:

    ss -t -a

{{< output >}}
State    Recv-Q  Send-Q  Local Address:Port   Peer Address:Port
LISTEN   0       80      127.0.0.1:mysql      *:*
LISTEN   0       128     *:ssh                *:*
LISTEN   0       100     *:smtp               *:*
ESTAB    0       204     109.74.193.253:ssh   2.86.7.61:55137
LISTEN   0       128     :::http              :::*
LISTEN   0       128     :::ssh               :::*
LISTEN   0       128     :::https             :::*
{{</ output >}}

The output is separated into columns. The first column, `state`, shows the state of the TCP connection. As the example is using the `-a` option, both listening and non-listening states are included in the output.
The second and the third columns, `Recv-Q` and `Send-Q`, show the amount of data queued for receive and
transmit operations. The `Local Address:Port` column shows the IP address the process listens to as well as the port number that is used - you can connect the name of the service with a numeric value by looking at the `/etc/services` file. The last column, `Peer Address:Port`, is useful when there is an active connection because it shows the address and port number of the client machine, though here it is without any real values for TCP connections that are in the `LISTEN` state. As the `-r` option is not used, you only see IP addresses in the output.

Running `ss -t` without `–a` displays established TCP connections only:

    ss -t

{{< output >}}
State  Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
ESTAB  0       204     109.74.193.253:ssh  2.86.7.61:55137
{{< /output >}}

### UDP

The following command displays all UDP (`-u`) sockets:

    ss -u -a

{{< output >}}
State    Recv-Q  Send-Q  Local Address:Port                  Peer Address:Port
UNCONN   0       0       *:mdns                              *:*
UNCONN   1536    0       109.74.193.253:syslog               *:*
UNCONN   0       0       *:54087                             *:*
UNCONN   0       0       *:bootpc                            *:*
UNCONN   0       0       109.74.193.253:ntp                  *:*
UNCONN   0       0       127.0.0.1:ntp                       *:*
UNCONN   0       0       *:ntp                               *:*
UNCONN   0       0       :::mdns                             :::*
UNCONN   0       0       :::48582                            :::*
UNCONN   0       0       fe80::f03c:91ff:fe69:1381%eth0:ntp  :::*
UNCONN   0       0       2a01:7e00::f03c:91ff:fe69:1381:ntp  :::*
UNCONN   0       0       ::1:ntp                             :::*
UNCONN   0       0       :::ntp                              :::*
{{< /output >}}

Running `ss -u` without `–a` displays established UDP connections only. In this case there are no established UDP connections:

    ss -u

{{< output >}}
Recv-Q Send-Q  Local Address:Port  Peer Address:Port
{{< /output >}}

### Display Statistics

You can display statistics about the current connections using the `-s` option:

    ss -s

{{< output >}}
Total: 199 (kernel 228)
TCP:   9 (estab 1, closed 2, orphaned 0, synrecv 0, timewait 0/0), ports 0

Transport  Total  IP  IPv6
*          228    -   -
RAW        0      0   0
UDP        13     7   6
TCP        7      4   3
INET       20     11  9
FRAG       0      0   0
{{< /output >}}

### Filter by TCP State

`ss` allows you to filter its output by state using the `state` and `exclude` keywords followed by a state identifier. The `state` keyword displays output that matches the provided `identifier`, whereas the `exclude` keyword displays everything except the output that matches the `identifier`.

The use of `state` is illustrated in the next example:

    ss -t4 state established

{{< output >}}
Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
0       0       109.74.193.253:ssh  2.86.7.61:55137
{{< /output >}}

The use of `exclude` is illustrated in the next example:

    ss -t4 exclude established

{{< output >}}
State      Recv-Q  Send-Q  Local Address:Port   Peer Address:Port
LISTEN     0       80      127.0.0.1:mysql      *:*
LISTEN     0       128     *:ssh                *:*
LISTEN     0       100     *:smtp               *:*
TIME-WAIT  0       0       109.74.193.253:smtp  103.89.91.73:55668
{{< /output >}}

The `-t4` command option returns IPv4 TCP connections.

### Filter Output by IP Address and Port Number

The more you filter the output of `ss`, the more accurate and relevant information you receive. There exist two `ss` options that allow you to include connections from certain IP addresses and port numbers.

The following command shows traffic *from* a given IP address only, using the `dst` keyword:

    ss -nt dst 2.86.7.61

{{< output >}}
State        Recv-Q  Send-Q  Local Address:Port         Peer Address:Port
ESTAB        0       0       109.74.193.253:22          2.86.7.61:55137
FIN-WAIT-1   0       32      ::ffff:109.74.193.253:443  ::ffff:2.86.7.61:56075
ESTAB        0       0       ::ffff:109.74.193.253:443  ::ffff:2.86.7.61:56077
ESTAB        0       0       ::ffff:109.74.193.253:443  ::ffff:2.86.7.61:56074
ESTAB        0       0       ::ffff:109.74.193.253:443  ::ffff:2.86.7.61:56078
{{< /output >}}

If you want to display traffic from an entire network, you can replace the IP address with a network address such as `2.86.7/24`.

The following command displays information about the HTTP and the HTTPS protocols, which are associated with port numbers 80 and 443 as defined in `/etc/services`:

    ss -at '( dport = :http or dport = :https or sport = :http or sport = :https )'

{{< output >}}
State      Recv-Q  Send-Q  Local Address:Port           Peer Address:Port
LISTEN     0       128     :::http                      :::*
LISTEN     0       128     :::https                     :::*
ESTAB      0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:56046
ESTAB      0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:56055
ESTAB      0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:56047
ESTAB      0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:56054
ESTAB      0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:56056
ESTAB      0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:56057
TIME-WAIT  0       0       ::ffff:109.74.193.253:http   ::ffff:54.39.151.52:59854
{{< /output >}}

`dport` means destination port and `sport` means source port.

The following command is equivalent to the previous command:

    ss -at '( dport = :80 or dport = :443 or sport = :80 or sport = :443 )'

### Display Timer Information

The `-o` option displays timer information:

    ss -nt dst 2.86.7.61 -o

{{< output >}}
State  Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
ESTAB  0       0       109.74.193.253:22   2.86.7.61:55137     timer:(keepalive,72min,0)
{{< /output >}}

### Enable IP Address Resolving

The `-r` parameter enables IP address resolving, which returns the domain names of the IP addresses:

    ss -r -t

{{< output >}}
State  Recv-Q  Send-Q    Local Address:Port                  Peer Address:Port
ESTAB  0       168       203-0-113-0.ip.linodeusercontent.com:ssh    ppp-2-86-7-61.home.otenet.gr:50939
ESTAB  0       0         203-0-113-0.ip.linodeusercontent.com:https  ::ffff:216.244.66.228:37668
{{< /output >}}

{{< note respectIndent=false >}}
A side effect of the `-r` command line option is that it slows the execution of the `ss` command due to the DNS lookups that need to be performed.
{{< /note >}}

### Display Detailed Socket Information

The `-e` option tells `ss` to display detailed socket information. The `-e` option is illustrated in the following example:

    ss -t -e

{{< output >}}
State  Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
ESTAB  0       0       109.74.193.253:ssh  2.86.7.61:62897    timer:(keepalive,54min,0) ino:10195329 sk:11e <->
{{< /output >}}

### Show a Connection's UNIX Process

The `-p` option displays the process ID(s) and the process name of a connection:

    ss -t -p

{{< output >}}
State  Recv-Q  Send-Q  Local Address:Port           Peer Address:Port
ESTAB  0       204     109.74.193.253:ssh           2.86.7.61:55137            users:(("sshd",pid=3964,fd=3),("sshd",pid=3951,fd=3))
ESTAB  0       51      ::ffff:109.74.193.253:https  ::ffff:176.9.146.74:57536  users:(("apache2",pid=30871,fd=29))
{{< /output >}}

### Find Related Processes

The following command shows SSH-related processes on the current machine:

    ss -t -p -a | grep ssh

{{< output >}}
LISTEN  0  128  *:ssh               *:*                    users:(("sshd",pid=812,fd=3))
ESTAB   0  36   109.74.193.253:ssh  2.86.7.61:55137        users:(("sshd",pid=3964,fd=3),("sshd",pid=3951,fd=3))
ESTAB   0  0    109.74.193.253:ssh  138.197.140.194:41992  users:(("sshd",pid=8538,fd=3),("sshd",pid=8537,fd=3))
LISTEN  0  128  :::ssh              :::*                   users:(("sshd",pid=812,fd=4))
{{< /output >}}

### Find Which Process is Using a Given Port Number

With the help of `ss` and `grep(1)`, you can discover which process is using a given port number:

    ss -tunap | grep :80

{{< output >}}
tcp  LISTEN  0  128  :::80 :::*  users:(("apache2",pid=8772,fd=4),("apache2",pid=8717,fd=4),("apache2",pid=8715,fd=4),("apache2",pid=8714,fd=4),("apache2",pid=8713,fd=4),("apache2",pid=8712,fd=4),("apache2",pid=8711,fd=4),("apache2",pid=8709,fd=4))
{{< /output >}}

As Apache uses multiple child processes, you receive a list of processes for port number `80`.

The next command does exactly the same thing without using `grep(1)`:

    ss -tup -a sport = :80

{{< output >}}
Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
tcp    LISTEN  0       128     :::http             :::*               users:(("apache2",pid=8715,fd=4),("apache2",pid=8714,fd=4),("apache2",pid=8713,fd=4),("apache2",pid=8712,fd=4),("apache2",pid=8711,fd=4),("apache2",pid=8709,fd=4))
{{< /output >}}

### Find Open Ports Above Port Number 1024

`ss` supports ranges when working with port numbers. This feature is illustrated in the following example that finds open port above port number 1024:

    ss -t -a sport \> :1024

{{< output >}}
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
LISTEN  0       80      127.0.0.1:mysql     *:*
{{< /output >}}

{{< note respectIndent=false >}}
The `ss -t -a sport \> :1024` command can be also written as `ss -t -a sport '> :1024'`.
{{< /note >}}

### Search for Specific TCP Characteristics

The following command shows all TCP connections that use IPv4 that are in listening state, as well as the name of the process using the socket without resolving the IP addresses and the port number:

    ss -t -4nlp

{{< output >}}
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
LISTEN  0       80      127.0.0.1:3306      *:*                users:(("mysqld",pid=1003,fd=17))
LISTEN  0       128     *:22                *:*                users:(("sshd",pid=812,fd=3))
LISTEN  0       100     *:25                *:*                users:(("smtpd",pid=9011,fd=6),("master",pid=1245,fd=13))
{{< /output >}}

### Show All TCP Connections Related to SSH

The following command shows all SSH related connections and sockets:

    ss -at '( dport = :ssh or sport = :ssh )'

{{< output >}}
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
LISTEN  0       128     *:ssh               *:*
ESTAB   0       0       109.74.193.253:ssh  2.86.7.61:64363
LISTEN  0       128     :::ssh              :::*
{{< /output >}}

### Show Sockets in a Listening State

The following command shows TCP sockets in listening (`-l`) state:

    ss -l -t

{{< output >}}
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
LISTEN  0       80      127.0.0.1:mysql     *:*
LISTEN  0       128     \*:ssh              *:*
LISTEN  0       100     *:smtp              *:*
LISTEN  0       128     :::http             :::*
LISTEN  0       128     :::ssh              :::*
LISTEN  0       128     :::https            :::*
{{< /output >}}

The following command shows IPv4 UDP sockets in listening state:

    ss -l -u -4

{{< output >}}
State   Recv-Q  Send-Q  Local Address:Port      Peer Address:Port
UNCONN  0       0        *:mdns                 *:*
UNCONN  1536    0        109.74.193.253:syslog  *:*
UNCONN  0       0        *:54087                *:*
UNCONN  0       0        *:bootpc               *:*
UNCONN  0       0        109.74.193.253:ntp     *:*
UNCONN  0       0        127.0.0.1:ntp          *:*
UNCONN  0       0        *:ntp                  *:*
{{< /output >}}

### Advanced Filtering with ss

The following `ss` command lists all TCP sockets that are in the ESTABLISHED state, use HTTP or HTTPS on the local machine, belong to the 2.86.7/24 network, and display their timers:

    ss -o state established '( sport = :http or sport = :https )' dst 2.86.7/24

{{< output >}}
Netid  Recv-Q  Send-Q  Local Address:Port           Peer Address:Port
tcp    0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:63057  timer:(keepalive,119min,0)
tcp    0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:63053  timer:(keepalive,119min,0)
tcp    0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:63055  timer:(keepalive,119min,0)
tcp    0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:63054  timer:(keepalive,119min,0)
tcp    0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:63052  timer:(keepalive,119min,0)
tcp    0       0       ::ffff:109.74.193.253:https  ::ffff:2.86.7.61:63056  timer:(keepalive,119min,0)
{{< /output >}}

Apart from the [standard TCP state names](https://tools.ietf.org/rfc/rfc793.txt) (`established`,
`syn-sent`, `syn-recv`, `fin-wait-1`, `fin-wait-2`, `time-wait`, `closed`, `close-wait`, `last-ack`,
`listen` and `closing`), you can also use the following states:

- `all`: For all the states.
- `bucket`: For TCP minisockets (TIME-WAIT|SYN-RECV) states.
- `big`: For all states except for minisockets - this is the opposite of `bucket`.
- `connected`: For the not closed and not listening states.
- `synchronized`: For connected and not SYN-SENT states.

### Using AWK to Process ss Output

The following command displays a summary of all sockets based on their state:

    ss -t -u -a | awk '{print $1}' | grep -v State | sort | uniq -c | sort -nr

{{< output >}}
13 udp
 7 tcp
 1 Netid
{{< /output >}}

The following command displays a summary of all sockets based on their protocol:

    ss -a | awk '{print $1}' | grep -v State | sort | uniq -c | sort -nr

{{< output >}}
133 u_str
 37 u_dgr
 34 nl
 13 udp
  8 tcp
  1 u_seq
  1 p_raw
  1 Netid
{{< /output >}}

The last command creates a summary of all IPv6 TCP connections that are in the `CONNECTED` state:

    ss -t6 state connected | awk '{print $1}' | grep -v State | sort | uniq -c | sort -nr
