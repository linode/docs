---
slug: install-iperf-to-diagnose-network-speed-in-linux
description: 'This tutorial will teach you how to install iPerf, and use its common commands and basic configuration to diagnose your network speed.'
keywords: ["diagnostics", "iperf"]
aliases: ['/networking/diagnostics/diagnosing-network-speed-with-iperf/','/networking/diagnostics/install-iperf-to-diagnose-network-speed-in-linux/']
tags: ["monitoring","resolving","networking","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-10
modified_by:
  name: Linode
published: 2015-01-12
title: Network Throughput Testing with iPerf
authors: ["Dave R."]
---

![Install iPerf to Diagnose Network Speed in Linux](diagnosing-network-speed-with-iperf.png "Install iPerf to Diagnose Network Speed in Linux")

[iPerf](https://iperf.fr) is a command-line tool used in diagnosing network speed issues by measuring the maximum network throughput a server can handle. It is particularly useful when experiencing network speed issues, as you can use iPerf to determine which server is unable to reach maximum throughput.

## Before You Begin

- You will need root access to your Linode, or a user account with `sudo` privilege.
- Update your system.

## Install iPerf

The `iperf` package is included in most Linux distribution's repositories.

### Debian and Ubuntu

    apt-get install iperf

### CentOS

CentOS repositories do not have iPerf. Use the [EPEL](https://fedoraproject.org/wiki/EPEL) repository, which is a repository used to install third-party software packages on RedHat systems such as RHEL and CentOS:

    yum install epel-release
    yum update
    yum install iperf

### Arch Linux

    pacman -S iperf

### openSUSE

    zypper install iperf

### Gentoo

    emerge iperf

If you have not yet run `emaint --sync` you may need to do so before it will allow you to install the iPerf testing package. Additionally, by default you will need to substitute each `iperf` command with `/usr/bin/iperf3`. This path may differ dependent on your iPerf version.

## How to Use iPerf

iPerf must be installed on the computers at both ends of the connection you're testing. If you are using a Unix or Linux-based operating system on your personal computer, you can install iPerf on your local machine for iperf speed test.

If you are testing the throughput of your Linode, however, it's better to use another server as the end point, as your local ISP may impose network restrictions that can affect the results of your test.

### TCP Clients & Servers

iPerf requires two systems because one system must act as a server, while the other acts as a client. The client connects to the server you're testing the speed of.

1.  On the Linode you plan to test, launch iPerf in server mode:

        iperf -s

    You should see output similar to:
    {{< output >}}
 ------------------------------------------------------------
 Server listening on TCP port 5001
 TCP window size: 85.3 KByte (default)
 ------------------------------------------------------------
{{< /output >}}

2.  On your second Linode, connect to the first. Replace `198.51.100.5` with the first Linode's IP address.

        iperf -c 198.51.100.5

    {{< output >}}
------------------------------------------------------------
Client connecting to 198.51.100.5, TCP port 5001
TCP window size: 45.0 KByte (default)
------------------------------------------------------------
[  3] local 198.51.100.6 port 50616 connected with 198.51.100.5 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.1 sec  1.27 GBytes  1.08 Gbits/sec
  {{< /output >}}

3.  You will also see the connection and results on your iPerf server:

    {{< output >}}
        ------------------------------------------------------------
        Server listening on TCP port 5001
        TCP window size: 85.3 KByte (default)
        ------------------------------------------------------------
        [  4] local 198.51.100.5 port 5001 connected with 198.51.100.6 port 50616
        [ ID] Interval       Transfer     Bandwidth
        [  4]  0.0-10.1 sec  1.27 GBytes  1.08 Gbits/sec
{{< /output >}}

4.  To stop the iPerf server process, press `CTRL + c`.

### UDP Clients & Servers

Using iPerf, you can also test the maximum throughput achieved via UDP connections.

1.  Start a UDP iPerf server:

        iperf -s -u

    {{< output >}}
------------------------------------------------------------
Server listening on UDP port 5001
Receiving 1470 byte datagrams
UDP buffer size:  208 KByte (default)
------------------------------------------------------------
{{< /output >}}

2.  Connect your client to your iPerf UDP server. Replace `198.51.100.5` with your IP address:

        iperf -c 198.51.100.5 -u

    {{< output >}}
------------------------------------------------------------
Client connecting to 198.51.100.5, UDP port 5001
Sending 1470 byte datagrams
UDP buffer size:  208 KByte (default)
------------------------------------------------------------
[  3] local 198.51.100.6 port 58070 connected with 198.51.100.5 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  1.25 MBytes  1.05 Mbits/sec
[  3] Sent 893 datagrams
[  3] Server Report:
[  3]  0.0-10.0 sec  1.25 MBytes  1.05 Mbits/sec   0.084 ms    0/  893 (0%)
{{< /output >}}

    1.05 Mbits/sec is considerably less than what was observed on the TCP tests. It is also considerably less than the maximum outbound bandwidth cap provided by the 1GB Linode. This is because iPerf limits the bandwidth for UDP clients to 1 Mbit per second by default.

4.  You can change this with the `-b` flag in the iperf command, replacing the number after with the maximum bandwidth rate you wish to test against. If you are testing for network speed, set this number above the maximum bandwidth cap provided by Linode:

        iperf -c 198.51.100.5 -u -b 1000m

    This tells the client that we want to achieve a maximum of 1000 Mbits of data per second if possible. The `-b` flag only works when using UDP connections, since iPerf does not set a bandwidth limit on the TCP clients.

    {{< output >}}
  ------------------------------------------------------------
  Client connecting to 198.51.100.5, UDP port 5001
  Sending 1470 byte datagrams
  UDP buffer size:  208 KByte (default)
  ------------------------------------------------------------
  [  3] local 198.51.100.5 port 52308 connected with 198.51.100.5 port 5001
  [ ID] Interval       Transfer     Bandwidth
  [  3]  0.0-10.0 sec   966 MBytes   810 Mbits/sec
  [  3] Sent 688897 datagrams
  [  3] Server Report:
  [  3]  0.0-10.0 sec   966 MBytes   810 Mbits/sec   0.001 ms    0/688896 (0%)
  [  3]  0.0-10.0 sec  1 datagrams received out-of-order
{{< /output >}}

    This time the results are considerably higher.

### Bidirectional Tests

In some cases, you may want to test both servers for the maximum amount of throughput. This can easily be done using the built-in bidirectional testing feature iPerf offers.

To test both connection streams, run the following command from the client side:

    iperf -c 198.51.100.5 -d

The result is that iPerf will start a server and a client connection on the client server (198.51.100.6). Once this has been done, iPerf will connect the iPerf server to the client connection, which is now acting as both a server connection and a client connection.

{{< output >}}
------------------------------------------------------------
Server listening on TCP port 5001
TCP window size: 85.3 KByte (default)
------------------------------------------------------------
------------------------------------------------------------
Client connecting to 198.51.100.5, TCP port 5001
TCP window size:  351 KByte (default)
------------------------------------------------------------
[  3] local 198.51.100.6 port 50618 connected with 198.51.100.5 port 5001
[  5] local 198.51.100.6 port 5001 connected with 198.51.100.5 port 58650
[ ID] Interval       Transfer     Bandwidth
[  5]  0.0-10.1 sec  1.27 GBytes  1.08 Gbits/sec
[  3]  0.0-10.2 sec  1.28 GBytes  1.08 Gbits/sec
{{< /output >}}

On the server, you will see:

{{< output >}}
------------------------------------------------------------
Client connecting to 198.51.100.6, TCP port 5001
TCP window size:  153 KByte (default)
------------------------------------------------------------
[  6] local 198.51.100.5 port 58650 connected with 198.51.100.6 port 5001
[  6]  0.0-10.1 sec  1.27 GBytes  1.08 Gbits/sec
[  5]  0.0-10.2 sec  1.28 GBytes  1.08 Gbits/sec
{{< /output >}}

### Options

| Option                             | Description                                                                               |
|:-----------------------------------|:------------------------------------------------------------------------------------------|
| -f                             | Change the format in which multiple tests are running. For example, you can use `-f k` to get results in Kbits per second instead of Mbits per second. Valid options include `m` (Mbits, default), `k` (Kbits), `K` (KBytes), and `M` (MBytes). |
| -V                         | Forces iPerf to use IPv6 rather than IPv4.                                |
| -i                             | Changes the interval between periodic bandwidth tests. For example, `-i 60` makes a new bandwidth report every 60 seconds. The default is zero, which performs a single bandwidth test.                                                    |
| -p                                 | Changes the port. When not specified, the default port is 5001. You must use this flag on both the client and server.                                                               |
| -B                         | Binds iPerf to a specific interface or address. If passed through the server command, the incoming interface is set. If passed through the client command, the outgoing interface is set.           |
