---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'A practical introduction to the netstat utility.'
keywords: ["UNIX", "shell", "netstat", "TCP/IP", "network"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-02
modified_by:
  name: Linode
title: 'Inspecting network connections using netstat'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[netstat](http://netstat.net/)'
---

## Introduction

The `netstat(8)` command line utility shows information about the network status of a UNIX machine. It is a very powerful tool that can work on the Socket, TCP, UDP, IP and Ethernet levels. Its main drawback is that it only works on the local machine. On the other hand, the main advantage of `netstat(8)` is that most of its command line options do not need root privileges to operate. Its other advantage is that it can be found on every Linux system as it is installed by default. 

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Netstat Command Line Options

The most important command line options of `netstat(8)` are the following:

| Option | Definition |
|--------|------------|
| `-v` | Shows verbose output. |
| `-r` | Displays the kernel routing tables, just like `-e`. |
| `-e` | Displays the kernel routing tables, just like `-r`. When used with other commands, it displays extended information. |
| `-i` | Displays a table of all network interfaces. When used with `-a`, the output also includes interfaces that are not up. |
| `-s` | Displays summary statistics for each protocol. |
| `-W` | Gives IP addresses as much screen space as needed. |
| `-n` | Displays numerical (IP) host addresses. |
| `-A` | Allows you to specify the protocol family. Valid values are `inet`, `inet6`, `unix`, `ipx`, `ax25`, `netrom`, `econet`, `ddp` and `bluetooth`.|
| `-t` | Displays TCP data only. |
| `-u` | Displays UDP data only. |
| `-4` | Displays IPv4 connections only. |
| `-6` | Displays IPv6 connections only. |
| `-c` | Displays information continuously (every second). |
| `-p` | Displays the process ID and the name of the program that owns the socket. It requires root privileges for this. |
| `-o` | Displays timer information. |
| `-a` | Shows both listening and non-listening sockets. |
| `-l` | Displays listening sockets, which are not displayed by default. |
| `-C` | Displays routing information from the route cache. |
| `-g` | Displays multicast group membership information for IPv4 and IPv6. |

The rest of this guide will put the most important of these command line options at work in order to help you learn their usage. However, nothing can replace experimenting with `netstat(8)` on your own.

## Running netstat without any options

If you execute `netstat` without any command line arguments and options, the utility will display all open sockets, which will most likely be a relatively big list:

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

The first column of the output is the protocol. However, depending on the kind of socket you have, the output will differ. When we are talking about TCP/IP, the `Recv-Q` column shows the number of bytes received by the network interface but not read by the process. Similarly, the `Send-Q` column shows the number of bytes sent to the other side of the TCP/IP connection but not acknowledged so far. The remaining columns of a TCP/IP connection are `Local Address`, `Foreign Address` and `State`.

If the protocol is `unix`, then we are dealing with a UNIX domain socket. The output in this case is different from the TCP/IP output. The `RefCnt` column is the reference count, which is the number of attached processes connected via this socket. The `Flags` column shows the flag type, the `Type` column shows the network socket type, the `State` column shows the state of the socket, the `I-Node` column shows the inode of the socket and the `Path` column shows the path of the socket on the local machine.

## Displaying the Routing Table

One of the most frequent uses of `netstat(8)` is for showing the routing table of a machine:

    netstat -nr
    {{< output >}}
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         109.74.193.1    0.0.0.0         UG        0 0          0 eth0
109.74.193.0    0.0.0.0         255.255.255.0   U         0 0          0 eth0
{{< /output >}}

In the `netstat -nr` output, the `U` flag means that the Route is in use, the `G` flag denotes the default gateway and the `H` flag, which is not displayed here, means that the Route is to a host and not to a network.

## Displaying statistics per network Interface

The `netstat -i` shows statistics on a per interface basis:

    netstat -i
    {{< output >}}
Kernel Interface table
Iface      MTU    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
eth0      1500  7075525      0      0 0       6830902      0      0      0 BMRU
lo       65536   573817      0      0 0        573817      0      0      0 LRU
{{< /output >}}

The `Iface` column is the interface name, the `MTU` is the value of the Maximum Transmission Unit, the `RX-OK` column is the number of error free packets received and the value of the `RX-ERR` column is the number of packets received with errors. The `RX-DRP` column holds the number of dropped packets when receiving and the `RX-OVR` holds the number of packets lost due to the overflow when receiving. The `TX-OK` column is the number of error free packets transmitted and the `RX-ERR` column is the number of transmitted packets with errors. The value of the `RX-DRP` column is the number of dropped packets when transmitting and the value of the `RX-OVR` column is the number of packets lost due to the overflow when transmitting. Last, the `Flg` column holds the flag values.

If you combine `-i` with `-a`, you will get a much richer output as `-a` tells `netstat(8)` to also display interfaces that are not up:

    netstat -i -a
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

## Getting Statistics for each protocol

You can get statistics on a per protocol basis as follows:

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

The following `netstat` version displays RAW network statistics:

    sudo netstat -s -w
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

## Displaying multicast group membership information

The `netstat -g` command displays multicast group membership related information:

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

The default output of `netstat -g` displays both IPv4 and IPv6 data.

## Showing IPv4 connections only

All `-A inet`, `--inet` and `-4` command line options tell `netstat(8)` to show IPv4 connections only. Therefore, the next command displays IPv4 connections that are in a non-listening state:

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

If you want to display IPv4 connections that are in both listening and non-listening state you should add the `-a` command line option.

## Showing IPv6 connections only

If you want to display both listening and non-listening IPv6 connections, you should execute `netstat -6 -a`:

    netstat -6 -a
    {{< output >}}
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp6       0      0 [::]:http               [::]:*                  LISTEN
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN
tcp6       0      0 [::]:https              [::]:*                  LISTEN
udp6       0      0 [::]:mdns               [::]:*
udp6       0      0 [::]:58949              [::]:*
udp6       0      0 fe80::f03c:91ff:fe6:ntp [::]:*
udp6       0      0 2a01:7e00::f03c:91f:ntp [::]:*
udp6       0      0 localhost:ntp           [::]:*
udp6       0      0 [::]:ntp                [::]:*
{{< /output >}}

If you want to display IPv6 connections that are in a non-listening state only, you should omit the `-a` command line option.

## Displaying listening UNIX Ports

If you just want to display listening UNIX ports, you should use the following command:

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

## Displaying TCP Connections only

If you are only interested in non-listening TCP connections, then you should use the `-t` option. The following command displays such connections using IP addresses:

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

If you are only interested in non-listening IPv4 TCP connections, you should execute the next command:

    netstat -nt -4
    {{< output >}}
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        1      0 109.74.193.253:25       193.32.160.143:41356    CLOSE_WAIT
tcp        0      0 109.74.193.253:22       79.131.135.223:64917    ESTABLISHED
tcp        1      0 109.74.193.253:25       193.32.160.136:37752    CLOSE_WAIT
tcp        1      0 109.74.193.253:25       193.32.160.136:49900    CLOSE_WAIT
{{< /output >}}

If you want to display both listening and non-listening TCP connections you should add the `-a` command line option in the previous command.

## Displaying UDP Connections only

If you are interested in non-listening UDP connections, you should execute `netstat(8)` with the `-u` option: `netstat -u`.

If you want to display both listening and non-listening UDP connections you should add the `-a` command line option.

    netstat -u -a
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

If you are only interested in non-listening IPv6 UDP connections, you should execute the `netstat -u -6` command.

## Displaying Listening TCP connections only

If you want to display listening TCP connections only, you should execute the next command:

    netstat -l -t
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

## Displaying More Output Than Usual

### Displaying extended output

The `-e` command line parameter tells `netstat(8)` to display extended output. Therefore, in order to get extended output on the listening TCP ports, you should execute the following command:

    netstat -lt -e
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

### Displaying the PID and the Owner of processes

The `-p` option displays the Process ID and the owner of a process. However, `netstat(8)` requires root privileges for this.

    netstat -lt -p
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

### Combining `-p` and `-e`

Combining `-p` with `-e` while having root privileges will generate the following kind of output:

    netstat -lt -p -e
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

The previous command displays extended information about the listening TCP processes of the current Linux machine.

## Using AWK to process netstat output

The AWK programming language can help you process `netstat(8)` output and generate handy reports.

### HTTP Connections

The following command, which needs root privileges to run, extracts the IP address from all established Apache connections and calculates the number of connections per IP address:

    netstat -anpt | grep apache2 | grep ESTABLISHED | awk -F "[ :]*" '{print $4}' | uniq -c
    {{< output >}}
      4 109.74.193.253
{{< /output >}}

### TCP connections

The following command calculates the number of TCP connections per IP address sorted by the number of connections:

    netstat -nt | awk '/^tcp/ {print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr
    {{< output >}}
      2 193.32.160.136
      1 79.131.135.223
      1 193.32.160.143
      1 106.13.205.251
{{< /output >}}

### Counting TCP States

The next command counts the various types of TCP states:

    netstat -ant | awk '{print $6}' | grep -v established\) | grep -v Foreign |sort|uniq -c | sort -n
    {{< output >}}
      2 ESTABLISHED
      3 CLOSE_WAIT
      6 LISTEN
{{< /output >}}

### Showing the Number of Listening Processes per Username

The following command calculates that total number of listening processes per username:

    netstat -ltpe | awk '{print $7}' | grep -v Address | grep -v "^$" | sort | uniq -c | awk '{print $2 ": " $1}'
    {{< output >}}
mysql: 1
root: 5
{{< /output >}}

The `netstat(8)` command collects the wanted information. The first `grep` command deletes the line with the header information generated by `netstat(8)` whereas the second `grep` command deletes empty lines from the output. The first `awk` command grubs the desired user information from the output of `netstat(8)` and the `sort` command sorts the output. After that the `uniq` command counts line occurrences while omitting repeated output. Last, the `awk` command reverses the two columns of the `uniq` output and prints the data on screen. Notice that in order to be able to see all processes, you must run the command with root privileges.

## Summary

Even if there exist other more modern tools that can replace `netstat(8)`, `netstat(8)` remains a handy tool that will definitely help you if you ever have networking problems on your Linux machine. However, never forget to check your log files for errors or warnings related to your network problem before troubleshooting.
