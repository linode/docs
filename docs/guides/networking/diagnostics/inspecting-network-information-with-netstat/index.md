---
slug: inspecting-network-information-with-netstat
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'A practical introduction to the netstat utility on Linux, including examples of the different options available.'
keywords: ["UNIX", "shell", "netstat", "TCP/IP", "UDP", "network", "sockets", "unix sockets", "network connections", "network statistics"]
tags: ["monitoring","networking","statistics","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-02
modified_by:
  name: Linode
title: 'Inspecting Network Information with netstat'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[netstat](http://netstat.net/)'
aliases: ['/networking/diagnostics/inspecting-network-connections-with-netstat/','/networking/diagnostics/inspecting-network-information-with-netstat/']
---

The `netstat` command line utility shows information about the network status of a workstation or server. `netstat` is available on Unix-like and Windows operating systems, with some differences in its usage between these systems.

`netstat` is an older utility, and some components of its functionality have been superseded by newer tools, like the [`ss` command](/docs/guides/ss/). A primary benefit of using `netstat` is that it is frequently pre-installed on Linux systems, while other tools might not be. As well, many (but not all) of the command line options for `netstat` can be run without root privileges, so it can still be useful on a system where you do not have root or `sudo` privileges.

{{< disclosure-note "Assumptions" >}}
This guide assumes some basic knowledge of networking in Linux, including network interfaces, routing tables, and network connections and sockets.
{{< /disclosure-note >}}

## In This Guide

This guide will explore the options available when running `netstat` on Linux. `netstat` can be used to inspect:

- [Unix sockets and network connections](#sockets-network-connections)
- [Routing tables](#routing-tables)
- [Network interfaces](#network-interfaces)
- [Network protocols](#network-protocols)
- [Multicast group membership](#multicast-group-membership)

A list of the [command line options](#command-line-options) can be found below, and some [advanced examples of using netstat with the AWK command](#using-awk-to-process-netstat-output) will be introduced at the end of the guide.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to properly execute. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Basic Usage

### Installing netstat

If `netstat` is not present on your Linux server or workstation, it can be added by installing the `net-tools` package:

    sudo apt install net-tools # Debian-based systems
    sudo yum install net-tools # CentOS and RHEL systems

### Running netstat without Any Options

If you execute `netstat` without any command line arguments and options, the utility will display all open sockets and network connections, formatted in two tables. This will most likely be a relatively long list:

    netstat

{{< output >}}
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 li140-253.members.l:ssh 185.232.67.121:43556    TIME_WAIT
tcp        0      0 li140-253.members.:smtp 37.252.14.141:64553     SYN_RECV
tcp        0      0 li140-253.members.l:ssh 37.252.14.141:43860     SYN_RECV
tcp        0      0 li140-253.members.:smtp 37.252.14.141:44909     SYN_RECV
tcp        0      0 li140-253.members.l:ssh ppp-2-86-7-61.hom:54757 ESTABLISHED
tcp        0      0 li140-253.members.l:ssh 37.252.14.141:62736     SYN_RECV
tcp6       0      0 li140-253.members.:http 37.252.14.141:63805     SYN_RECV

Active UNIX domain sockets (w/o servers)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ]         DGRAM                    20972    /var/spool/postfix/dev/log
unix  3      [ ]         DGRAM                    18134    /run/systemd/notify
unix  3      [ ]         STREAM     CONNECTED     24059
unix  2      [ ]         DGRAM                    22790
unix  2      [ ACC ]     STREAM     LISTENING     24523    public/showq
unix  2      [ ACC ]     STREAM     LISTENING     24526    private/error
{{< /output >}}

The first table displays network connections, and the columns of this table are interpreted as follows:

| Column | Description |
|--------|-------------|
| Proto | The protocol of the connection: TCP, UDP, or raw. |
| Recv-Q | When in reference to a TCP connection, this column shows the number of bytes received by the local network interface but not read by the connected process. |
| Send-Q | When in reference to a TCP connection, this column shows the number of bytes sent to the other side of the connection but not acknowledged by the remote host. |
| Local Address | The local address and port for the connection. By default, this will display the host name for the address, if it can be resolved. The service name for the port (e.g. SSH for port 22) will also be displayed by default. |
| Foreign Address | The address and port number for the connected host. The host name and service name will be displayed by default, similar to the behavior for the Local Address column. |
| State | The state of the connection. Because raw and UDP connections will generally not have state information, this column will usually be blank for those connection types. For TCP connections, the State column will have a value that matches [one of the states specified by TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol#Protocol_operation): `SYN_RECV`, `SYN_SENT`, `ESTABLISHED`, etc. By default, connections in the `LISTEN` state will not be displayed. |

The second table displays [Unix sockets](https://en.wikipedia.org/wiki/Unix_domain_socket), and the columns of this table are interpreted as follows:

| Column | Description |
|--------|-------------|
| Proto | The protocol of the socket (`unix`). |
| RefCnt | The reference count, which is the number of attached processes connected via this socket. |
| Flags | Any flags associated with the socket. This will most often display `ACC`, short for SO_ACCEPTON, which is shown for unconnected sockets whose processes are waiting for connection requests. |
| Type | The type of the socket: datagram/connectionless (`SOCK_DGRAM`), stream/connection (`SOCK_STREAM`), raw (`SOCK_RAW`), reliably-delivered messages (`SOCK_RDM`), sequential packet (`SOCK_SEQPACKET`), or the obsolete `SOCK_PACKET`. |
| State | The state of the socket: `FREE` for unallocated sockets, `LISTENING` for sockets listening for connections, `CONNECTING` for sockets that are about to be connected, `CONNECTED` for connected sockets, and `DISCONNECTING` for disconnecting sockets. If the state is empty, the socket is not connected. Sockets in the `LISTENING` state will not be displayed by default. |
| I-Node | The filesystem [inode](https://en.wikipedia.org/wiki/Inode) of the socket. |
| Path | The filesystem path of the socket. |

## Command Line Options

Some important and frequently-used command line options of `netstat` are as follows:

| Option | Definition |
|--------|------------|
| `-v` | Shows verbose output. |
| `-r` | Displays the kernel routing tables. |
| `-e` | Displays extended information for network connections. |
| `-i` | Displays a table of all network interfaces. When used with `-a`, the output also includes interfaces that are not up. |
| `-s` | Displays summary statistics for each protocol. |
| `-W` | Avoids truncating IP addresses and provides as much screen space as needed to display them. |
| `-n` | Displays numerical (IP) addresses, instead of resolving them to hostnames. |
| `-A` | Allows you to specify the protocol family. Valid values are `inet`, `inet6`, `unix`, `ipx`, `ax25`, `netrom`, `econet`, `ddp` and `bluetooth`. |
| `-t` | Displays TCP data only. |
| `-u` | Displays UDP data only. |
| `-4` | Displays IPv4 connections only. |
| `-6` | Displays IPv6 connections only. |
| `-c` | Displays information continuously (every second). |
| `-p` | Displays the process ID and the name of the program that owns the socket. It requires root privileges for this. |
| `-o` | Displays timer information. |
| `-a` | Shows both listening and non-listening network connections and Unix sockets. |
| `-l` | Displays listening network connections and Unix sockets, which are not shown by default. |
| `-C` | Displays routing information from the route cache. |
| `-g` | Displays multicast group membership information for IPv4 and IPv6. |

The rest of this guide will put the most important of these command line options to work in order to help you learn their usage. However, nothing can replace experimenting with `netstat` on your own.

## Sockets/Network Connections

### Include the LISTENING State

Run netstat with the `-a` option to show both listening and non-listening network connections and sockets:

    netstat -a

{{< output >}}
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN
tcp        0    316 li1076-154.members.:ssh 192.0.2.4:51109       ESTABLISHED
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN
Active UNIX domain sockets (servers and established)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ACC ]     STREAM     LISTENING     15668    /run/systemd/private
unix  6      [ ]         DGRAM                    9340     /run/systemd/journal/dev-log
unix  3      [ ]         DGRAM                    9096     /run/systemd/notify
unix  2      [ ]         DGRAM                    9098     /run/systemd/cgroups-agent
unix  2      [ ACC ]     STREAM     LISTENING     9107     /run/systemd/fsck.progress
unix  2      [ ACC ]     SEQPACKET  LISTENING     9117     /run/udev/control
unix  2      [ ]         DGRAM                    9119     /run/systemd/journal/syslog
unix  2      [ ]         DGRAM                    50340    /run/user/1000/systemd/notify
unix  2      [ ACC ]     STREAM     LISTENING     50344    /run/user/1000/systemd/private
...
{{< /output >}}

### Only Show the LISTENING State

Run netstat with the `-l` option to only show listening network connections and sockets:

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN
Active UNIX domain sockets (only servers)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ACC ]     STREAM     LISTENING     15668    /run/systemd/private
unix  2      [ ACC ]     STREAM     LISTENING     9107     /run/systemd/fsck.progress
unix  2      [ ACC ]     SEQPACKET  LISTENING     9117     /run/udev/control
unix  2      [ ACC ]     STREAM     LISTENING     50344    /run/user/1000/systemd/private
unix  2      [ ACC ]     STREAM     LISTENING     50349    /run/user/1000/gnupg/S.gpg-agent.ssh
unix  2      [ ACC ]     STREAM     LISTENING     50352    /run/user/1000/gnupg/S.gpg-agent.extra
unix  2      [ ACC ]     STREAM     LISTENING     50354    /run/user/1000/gnupg/S.gpg-agent.browser
unix  2      [ ACC ]     STREAM     LISTENING     50356    /run/user/1000/gnupg/S.gpg-agent
unix  2      [ ACC ]     STREAM     LISTENING     9210     /run/systemd/journal/stdout
unix  2      [ ACC ]     STREAM     LISTENING     11261    /var/run/dbus/system_bus_socket
{{< /output >}}

### Show IPv4 Connections Only

The `-A inet`, `--inet` and `-4` command line options will all tell `netstat` to show IPv4 connections (both TCP and UDP) only. Because listening connections are not shown by default, this command displays connections that are in a non-listening state:

    netstat -4

{{< output >}}
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        1      0 li140-253.members.:smtp 193.32.160.143:41356    CLOSE_WAIT
tcp        0    300 li140-253.members.l:ssh athedsl-405473.ho:64917 ESTABLISHED
tcp        1      0 li140-253.members.:smtp 193.32.160.136:37752    CLOSE_WAIT
tcp        1      0 li140-253.members.:smtp 193.32.160.136:49900    CLOSE_WAIT
tcp        1      0 li140-253.members.:smtp 193.32.160.136:49900    CLOSE_WAIT
{{< /output >}}

{{< note >}}
If you want to display IPv4 connections that are in both listening and non-listening state, add the `-a` command line option:

    netstat -4a
{{< /note >}}

### Show IPv6 Connections Only

The `-A inet6`, `--inet6` and `-6` command line options will all tell `netstat` to show IPv6 connections (both TCP and UDP) only. Because listening connections are not shown by default, this command displays connections that are in a non-listening state:

    netstat -6

{{< output >}}
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
udp6       0      0 [::]:mdns               [::]:*
udp6       0      0 [::]:58949              [::]:*
udp6       0      0 fe80::f03c:91ff:fe6:ntp [::]:*
udp6       0      0 2a01:7e00::f03c:91f:ntp [::]:*
udp6       0      0 localhost:ntp           [::]:*
udp6       0      0 [::]:ntp                [::]:*
{{< /output >}}

{{< note >}}
If you want to display IPv4 connections that are in both listening and non-listening state, add the `-a` command line option:

    netstat -6a
{{< /note >}}

### Show Listening UNIX Sockets

The `-x` option limits `netstat` to showing Unix sockets. If you want to only display listening UNIX sockets, use the following command:

    netstat -lx

{{< output >}}
Active UNIX domain sockets (only servers)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ACC ]     STREAM     LISTENING     21569793 /run/user/1000/gnupg/S.gpg-agent.extra
unix  2      [ ACC ]     STREAM     LISTENING     21569796 /run/user/1000/gnupg/S.gpg-agent.ssh
unix  2      [ ACC ]     STREAM     LISTENING     21569798 /run/user/1000/gnupg/S.gpg-agent.browser
unix  2      [ ACC ]     STREAM     LISTENING     21569800 /run/user/1000/gnupg/S.dirmngr
unix  2      [ ACC ]     STREAM     LISTENING     21569802 /run/user/1000/gnupg/S.gpg-agent
unix  2      [ ACC ]     STREAM     LISTENING     24485    public/cleanup
unix  2      [ ACC ]     STREAM     LISTENING     20306    /var/run/dbus/system_bus_socket
unix  2      [ ACC ]     STREAM     LISTENING     24490    private/tlsmgr
unix  2      [ ACC ]     STREAM     LISTENING     24493    private/rewrite
unix  2      [ ACC ]     STREAM     LISTENING     24496    private/bounce
unix  2      [ ACC ]     STREAM     LISTENING     24499    private/defer
unix  2      [ ACC ]     STREAM     LISTENING     24502    private/trace
unix  2      [ ACC ]     STREAM     LISTENING     24505    private/verify
unix  2      [ ACC ]     STREAM     LISTENING     20319    /var/run/avahi-daemon/socket
...
{{< /output >}}

### Show TCP Connections Only

The `-t` option limits `netstat` to showing TCP network connections. Because listening connections are not shown by default, the following command displays connections that are in a non-listening state:

    netstat -nt

{{< output >}}
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        1      0 109.74.193.253:25       193.32.160.143:41356    CLOSE_WAIT
tcp        0      0 109.74.193.253:22       79.131.135.223:64917    ESTABLISHED
tcp        1      0 109.74.193.253:25       193.32.160.136:37752    CLOSE_WAIT
tcp        1      0 109.74.193.253:25       193.32.160.136:49900    CLOSE_WAIT
tcp6       0      0 109.74.193.253:80       104.18.40.175:26111     SYN_RECV
tcp6       0      0 109.74.193.253:80       104.18.40.175:47427     SYN_RECV
tcp6       0      0 109.74.193.253:80       104.18.41.175:24763     SYN_RECV
tcp6       0      0 109.74.193.253:80       104.18.41.175:32295     SYN_RECV
tcp6       0      0 109.74.193.253:80       104.18.41.175:53268     SYN_RECV
tcp6       0      0 109.74.193.253:80       104.18.40.175:4436      SYN_RECV
tcp6       0      0 109.74.193.253:80       104.18.40.175:17099     SYN_RECV
tcp6       0      0 109.74.193.253:80       104.18.41.175:12892     SYN_RECV
{{< /output >}}

{{< note >}}
The `-n` option in the previous command tells `netstat` to not resolve IP addresses to hostnames.
{{< /note >}}

{{< note >}}
If you want to display both listening and non-listening TCP connections, add the `-a` command line option:

    netstat -ta
{{< /note >}}

### Show IPv4 TCP Connections Only

If you are only interested in IPv4 TCP connections, use the -t and -4 options together. Because listening connections are not shown by default, the following command displays connections that are in a non-listening state:

    netstat -nt4

{{< output >}}
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        1      0 109.74.193.253:25       193.32.160.143:41356    CLOSE_WAIT
tcp        0      0 109.74.193.253:22       79.131.135.223:64917    ESTABLISHED
tcp        1      0 109.74.193.253:25       193.32.160.136:37752    CLOSE_WAIT
tcp        1      0 109.74.193.253:25       193.32.160.136:49900    CLOSE_WAIT
{{< /output >}}

{{< note >}}
If you want to display both listening and non-listening IPv4 TCP connections, add the `-a` command line option:

    netstat -t4a
{{< /note >}}

### Show Listening TCP Connections Only

If you want to display listening TCP connections only, combine `-l` and `-t`:

    netstat -lt

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 localhost:mysql         0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN
tcp      101      0 0.0.0.0:smtp            0.0.0.0:*               LISTEN
tcp6       0      0 [::]:http               [::]:*                  LISTEN
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN
tcp6       0      0 [::]:https              [::]:*                  LISTEN
{{< /output >}}

### Show UDP Connections Only

If you are only interested in seeing UDP connections, use the `-u` option:

    netstat  -u

{{< output >}}
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
udp        0      0 0.0.0.0:mdns            0.0.0.0:*
udp        0      0 li140-253.member:syslog 0.0.0.0:*
udp        0      0 0.0.0.0:60397           0.0.0.0:*
udp        0      0 0.0.0.0:bootpc          0.0.0.0:*
udp        0      0 li140-253.members.l:ntp 0.0.0.0:*
udp        0      0 localhost:ntp           0.0.0.0:*
udp        0      0 0.0.0.0:ntp             0.0.0.0:*
udp6       0      0 [::]:mdns               [::]:*
udp6       0      0 [::]:58949              [::]:*
udp6       0      0 fe80::f03c:91ff:fe6:ntp [::]:*
udp6       0      0 2a01:7e00::f03c:91f:ntp [::]:*
udp6       0      0 localhost:ntp           [::]:*
udp6       0      0 [::]:ntp                [::]:*
{{< /output >}}

{{< note >}}
To show only IPv4 or IPv6 UDP connections, combine `-u` with `-4` or `-6`:

    netstat -u4
    netstat -u6

{{< /note >}}

### Show Extended Output

The `-e` command line parameter tells `netstat` to show extended output, which will add the `User` and `Inode` columns to the displayed table (but only for network connections, not Unix sockets). For example, this command will show extended output for a system's listening TCP connections:

    netstat -lte

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       User       Inode
tcp        0      0 localhost:mysql         0.0.0.0:*               LISTEN      mysql      35862475
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN      root       35572959
tcp      101      0 0.0.0.0:smtp            0.0.0.0:*               LISTEN      root       35544149
tcp6       0      0 [::]:http               [::]:*                  LISTEN      root       35577141
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN      root       35572961
tcp6       0      0 [::]:https              [::]:*                  LISTEN      root       35577145
{{< /output >}}

### Show the PID and Program Name

The `-p` option displays the process ID and program name that corresponds to a network connection or Unix socket.

{{< note >}}
`netstat` requires root privileges to show the PID and program name of processes that are not owned by your user.
{{< /note >}}

This command will display the PID and program name for a system's listening TCP connections:

    sudo netstat -ltp

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 localhost:mysql         0.0.0.0:*               LISTEN      24555/mysqld
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN      1008/sshd
tcp      101      0 0.0.0.0:smtp            0.0.0.0:*               LISTEN      8576/master
tcp6       0      0 [::]:http               [::]:*                  LISTEN      1808/apache2
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN      1008/sshd
tcp6       0      0 [::]:https              [::]:*                  LISTEN      1808/apache2
{{< /output >}}

{{< note >}}
In particular, the previous example's command is a fast way to learn about which networked services are running on your system.
{{< /note >}}

### Combining `-p` and `-e`

Combining `-p` with `-e` while having root privileges will simultaneously reveal the user, inode, and PID/program name of your network connections. The following example command will show all of this information for a system's listening TCP connections:

    sudo netstat -ltpe

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       User       Inode      PID/Program name
tcp        0      0 localhost:mysql         0.0.0.0:*               LISTEN      mysql      35862475   24555/mysqld
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN      root       35572959   1008/sshd
tcp      101      0 0.0.0.0:smtp            0.0.0.0:*               LISTEN      root       35544149   8576/master
tcp6       0      0 [::]:http               [::]:*                  LISTEN      root       35577141   1808/apache2
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN      root       35572961   1008/sshd
tcp6       0      0 [::]:https              [::]:*                  LISTEN      root       35577145   1808/apache2
{{< /output >}}

## Routing Tables

One of the most frequent uses of `netstat` is for showing the [routing table](https://en.wikipedia.org/wiki/Routing_table) of a machine:

    netstat -nr

{{< output >}}
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         109.74.193.1    0.0.0.0         UG        0 0          0 eth0
109.74.193.0    0.0.0.0         255.255.255.0   U         0 0          0 eth0
{{< /output >}}

In this output, the `U` flag means that the route is in use and the `G` flag denotes the default gateway. The `H` flag, which is not displayed here, would mean that the route is to a host and not to a network.

## Network Interfaces

The `-i` option shows network statistics on a per-interface basis:

    netstat -i

{{< output >}}
Kernel Interface table
Iface      MTU    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
eth0      1500  7075525      0      0 0       6830902      0      0      0 BMRU
lo       65536   573817      0      0 0        573817      0      0      0 LRU
{{< /output >}}

| Column | Description |
|--------|-------------|
| Iface | The name of the interface. |
| MTU | The value of the Maximum Transmission Unit. |
| RX-OK | The number of error free packets received. |
| RX-ERR | The number of packets received with errors. |
| RX-DRP | The number of dropped packets when receiving. |
| RX-OVR | The number of packets lost due to the overflow when receiving. |
| TX-OK | The number of error-free packets transmitted. |
| RX-ERR | The number of transmitted packets with errors. |
| TX-DRP | The number of dropped packets when transmitting. |
| TX-OVR | The number of packets lost due to the overflow when transmitting. |
| Flag | Flag values for the interface. |

If you combine `-a` with `-i`, `netstat` will also display interfaces that are not up:

    netstat -ia

{{< output >}}
Kernel Interface table
Iface      MTU    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
dummy0    1500        0      0      0 0             0      0      0      0 BO
erspan0   1450        0      0      0 0             0      0      0      0 BM
eth0      1500 13128358      0      0 0      15677694      0      0      0 BMRU
gre0      1476        0      0      0 0             0      0      0      0 O
gretap0   1462        0      0      0 0             0      0      0      0 BM
ip6_vti0  1364        0      0      0 0             0      0      0      0 O
ip6gre0   1448        0      0      0 0             0      0      0      0 O
ip6tnl0   1452        0      0      0 0             0      0      0      0 O
ip_vti0   1480        0      0      0 0             0      0      0      0 O
lo       65536   846097      0      0 0        846097      0      0      0 LRU
sit0      1480        0      0      0 0             0      0      0      0 O
teql0     1500        0      0      0 0             0      0      0      0 O
tunl0     1480        0      0      0 0             0      0      0      0 O
{{< /output >}}

## Network Protocols

Use the `-s` option to see network statistics on a per-protocol basis:

    netstat -s

{{< output >}}
Ip:
    Forwarding: 2
    6775334 total packets received
    11 with invalid addresses
    0 forwarded
    0 incoming packets discarded
    6775323 incoming packets delivered
    7339283 requests sent out
Icmp:
    10531 ICMP messages received
    4415 input ICMP message failed
    InCsumErrors: 3
    ICMP input histogram:
        destination unreachable: 6035
        timeout in transit: 93
        redirects: 1
        echo requests: 4379
        timestamp request: 20
    16939 ICMP messages sent
    0 ICMP messages failed
    ICMP output histogram:
        destination unreachable: 12540
        echo replies: 4379
        timestamp replies: 20
IcmpMsg:
        InType3: 6035
        InType5: 1
        InType8: 4379
        InType11: 93
        InType13: 20
        OutType0: 4379
        OutType3: 12540
        OutType14: 20
Tcp:
    38781 active connection openings
    330301 passive connection openings
    10683 failed connection attempts
    26722 connection resets received
    1 connections established
    6580191 segments received
    10797407 segments sent out
    654603 segments retransmitted
    748 bad segments received
    408640 resets sent
    InCsumErrors: 747
Udp:
    212303 packets received
    13230 packets to unknown port received
    126 packet receive errors
    213173 packets sent
    0 receive buffer errors
    0 send buffer errors
    InCsumErrors: 126
UdpLite:
TcpExt:
    10451 resets received for embryonic SYN_RECV sockets
    9 ICMP packets dropped because they were out-of-window
    41710 TCP sockets finished time wait in fast timer
    294 packetes rejected in established connections because of timestamp
    161285 delayed acks sent
    22 delayed acks further delayed because of locked socket
    Quick ack mode was activated 20984 times
    43 SYNs to LISTEN sockets dropped
    1199311 packet headers predicted
    1851531 acknowledgments not containing data payload received
    919487 predicted acknowledgments
    114 times recovered from packet loss due to fast retransmit
    TCPSackRecovery: 5474
    TCPSACKReneging: 2
    Detected reordering 8235 times using SACK
    Detected reordering 21 times using reno fast retransmit
    Detected reordering 219 times using time stamp
    154 congestion windows fully recovered without slow start
    80 congestion windows partially recovered using Hoe heuristic
    TCPDSACKUndo: 142
    1009 congestion windows recovered without slow start after partial ack
    TCPLostRetransmit: 33008
    68 timeouts after reno fast retransmit
    TCPSackFailures: 302
    599 timeouts in loss state
    57605 fast retransmits
    2647 retransmits in slow start
    TCPTimeouts: 618841
    TCPLossProbes: 35168
    TCPLossProbeRecovery: 12069
    TCPRenoRecoveryFail: 60
    TCPSackRecoveryFail: 668
    TCPBacklogCoalesce: 54624
    TCPDSACKOldSent: 20866
    TCPDSACKOfoSent: 56
    TCPDSACKRecv: 5136
    TCPDSACKOfoRecv: 76
    20881 connections reset due to unexpected data
    1466 connections reset due to early user close
    3960 connections aborted due to timeout
    TCPSACKDiscard: 54
    TCPDSACKIgnoredOld: 28
    TCPDSACKIgnoredNoUndo: 2114
    TCPSpuriousRTOs: 23
    TCPSackShifted: 33515
    TCPSackMerged: 56742
    TCPSackShiftFallback: 24412
    TCPDeferAcceptDrop: 127813
    TCPRcvCoalesce: 258864
    TCPOFOQueue: 24749
    TCPOFOMerge: 56
    TCPChallengeACK: 238
    TCPSYNChallenge: 3
    TCPFastOpenCookieReqd: 6
    TCPFromZeroWindowAdv: 32
    TCPToZeroWindowAdv: 32
    TCPWantZeroWindowAdv: 187
    TCPSynRetrans: 517978
    TCPOrigDataSent: 7250401
    TCPHystartTrainDetect: 102
    TCPHystartTrainCwnd: 15000
    TCPHystartDelayDetect: 1533
    TCPHystartDelayCwnd: 101578
    TCPACKSkippedSynRecv: 16
    TCPACKSkippedPAWS: 160
    TCPACKSkippedSeq: 54
    TCPACKSkippedTimeWait: 140
    TCPACKSkippedChallenge: 91
    TCPWinProbe: 1552
    TCPDelivered: 7093769
    TCPAckCompressed: 12241
    TCPWqueueTooBig: 222
IpExt:
    InMcastPkts: 104
    OutMcastPkts: 106
    InOctets: 3072954621
    OutOctets: 10300134722
    InMcastOctets: 8757
    OutMcastOctets: 8837
    InNoECTPkts: 6759736
    InECT1Pkts: 312
    InECT0Pkts: 54355
    InCEPkts: 8644
Sctp:
    0 Current Associations
    0 Active Associations
    0 Passive Associations
    0 Number of Aborteds
    0 Number of Graceful Terminations
    14 Number of Out of Blue packets
    0 Number of Packets with invalid Checksum
    14 Number of control chunks sent
    0 Number of ordered chunks sent
    0 Number of Unordered chunks sent
    14 Number of control chunks received
    0 Number of ordered chunks received
    0 Number of Unordered chunks received
    0 Number of messages fragmented
    0 Number of messages reassembled
    14 Number of SCTP packets sent
    14 Number of SCTP packets received
    SctpInPktSoftirq: 14
    SctpInPktDiscards: 14
{{< /output >}}

Including the `-w` option will tell `netstat` to display raw network statistics:

    sudo netstat -sw

{{< output >}}
Ip:
    Forwarding: 2
    6775954 total packets received
    11 with invalid addresses
    0 forwarded
    0 incoming packets discarded
    6775943 incoming packets delivered
    7339740 requests sent out
Icmp:
    10531 ICMP messages received
    4415 input ICMP message failed
    InCsumErrors: 3
    ICMP input histogram:
        destination unreachable: 6035
        timeout in transit: 93
        redirects: 1
        echo requests: 4379
        timestamp request: 20
    16942 ICMP messages sent
    0 ICMP messages failed
    ICMP output histogram:
        destination unreachable: 12543
        echo replies: 4379
        timestamp replies: 20
IcmpMsg:
        InType3: 6035
        InType5: 1
        InType8: 4379
        InType11: 93
        InType13: 20
        OutType0: 4379
        OutType3: 12543
        OutType14: 20
UdpLite:
IpExt:
    InMcastPkts: 104
    OutMcastPkts: 106
    InOctets: 3072998471
    OutOctets: 10300305693
    InMcastOctets: 8757
    OutMcastOctets: 8837
    InNoECTPkts: 6760354
    InECT1Pkts: 312
    InECT0Pkts: 54357
    InCEPkts: 8644
{{< /output >}}

## Multicast Group Membership

The `netstat -g` command displays [multicast group membership](https://en.wikipedia.org/wiki/IP_multicast) information:

    netstat -g

{{< output >}}
IPv6/IPv4 Group Memberships
Interface       RefCnt Group
--------------- ------ ---------------------
lo              1      all-systems.mcast.net
eth0            1      224.0.0.251
eth0            1      all-systems.mcast.net
lo              1      ip6-allnodes
lo              1      ff01::1
dummy0          1      ip6-allnodes
dummy0          1      ff01::1
eth0            1      ff02::202
eth0            1      ff02::fb
...
{{< /output >}}

{{< note >}}
The default output of `netstat -g` displays both IPv4 and IPv6 data.
{{< /note >}}

## Using AWK to process netstat output

The AWK programming language can help you process `netstat` output and generate handy reports.

### Showing the Number of Listening Processes Per Username

The following command calculates the total number of listening processes per username:

    sudo netstat -lte | awk '{print $7}' | grep -v Address | grep -v "^$" | sort | uniq -c | awk '{print $2 ": " $1}'

{{< output >}}
mysql: 1
root: 5
{{< /output >}}

- The `netstat` command collects the listening TCP connections and includes the users for the connections' processes in the output.
- The first `awk` command limits the output to the column that displays the user.
- The first `grep` command deletes the line with the header information generated by `netstat`.
- The second `grep` command deletes empty lines from the output.
- The `sort` command sorts the users alphabetically.
- After that, the `uniq` command counts line occurrences while omitting repeated output.
- Lastly, the second `awk` command reverses the two columns of the `uniq` command's output and prints the data on screen.

### HTTP Connections

The following command, which needs root privileges to run, extracts the IP address from all established Apache connections and calculates the number of connections per IP address:

    sudo netstat -anpt | grep apache2 | grep ESTABLISHED | awk -F "[ :]*" '{print $4}' | uniq -c

{{< output >}}
      4 109.74.193.253
{{< /output >}}

### TCP Connections

The following command calculates the number of TCP connections per IP address, sorted by the number of connections:

    netstat -nt | awk '/^tcp/ {print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr

{{< output >}}
      2 193.32.160.136
      1 79.131.135.223
      1 193.32.160.143
      1 106.13.205.251
{{< /output >}}

### Counting TCP States

The next command counts the various types of TCP states:

    netstat -ant | awk '{print $6}' | grep -v established\) | grep -v Foreign | sort | uniq -c | sort -n

{{< output >}}
      2 ESTABLISHED
      3 CLOSE_WAIT
      6 LISTEN
{{< /output >}}

## Summary

Even if there exists other more modern tools that can replace `netstat`, `netstat` remains a handy tool that will definitely help you if you ever have networking problems on your Linux machine. However, never forget to check your log files for errors or warnings related to your network problem before troubleshooting.
