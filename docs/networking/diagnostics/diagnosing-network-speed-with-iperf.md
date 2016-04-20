---
author:
  name: Dave R.
  email: docs@linode.com
description: 'How to diagnose network speed issues using Iperf.'
keywords: 'networking,diagnostic,speed,iperf'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, January 12, 2015
modified_by:
  name: Linode
published: 'Monday, January 12, 2015'
title: Diagnosing Network Speed with Iperf
external_resources:
  - '[Iperf Official Website](https://iperf.fr)'
---

Linux systems administrators and network administrators often find diagnosing network speed degradation complicated, as there are very few tools available to diagnose these issues. Iperf is a command-line tool used in the diagnostics of network speed issues. 

Iperf measures the maximum network throughput a server can handle. It is particularly useful when experiencing network speed issues, as you can use Iperf to determine which server is unable to reach maximum throughput.

{:.note}
> 
> This guide assumes that you are the `root` user. If you are not using the super user, you will need to use `sudo` before each command.

## Installing Iperf

&nbsp;

### Debian and Ubuntu

You can use `apt-get` to install Iperf on Debian and Ubuntu:

	apt-get install iperf

### CentOS

CentOS repositories do not have Iperf by defaul. Use the RPMForge repository, which is a repository used to install third-party software packages on RedHat systems such as RHEL and CentOS.

The RPMForge repository is not produced or maintained by RedHat, but is designed to work with RedHat and supplies over 5,000 software packages in the RPM format.

#### CentOS 7

1.  Use `wget` and `rpm` to prepare your system for the installation:

        wget http://pkgs.repoforge.org/rpmforge-release/rpmforge-release-0.5.3-1.el7.rf.x86_64.rpm
        rpm -Uvh rpmforge-release-1.5.3-1.el7.rf.x86_64.rpm

2.  Use `yum` to install Iperf:

        yum update
        yum install iperf

#### CentOS 6

1.  Use `wget` and `rpm` to prepare your system for the installation:

        wget http://pkgs.repoforge.org/rpmforge-release/rpmforge-release-0.5.2-1.el6.rf.x86_64.rpm
        rpm -Uvh rpmforge-release-0.5.2-1.el6.rf.x86_64.rpm

2.  Use `yum` to install Iperf:

        yum update
        yum install iperf

### Fedora

To install Iperf on your Fedora instance run:

    yum update
    yum install iperf

### Arch Linux

To install Iperf on your Arch Linux instance run:

	pacman -S iperf

### Gentoo

Using Portage, install Iperf on your Gentoo instance:

	emerge iperf

If you have not yet run `emerge --sync` you may need to do so before it will allow you to install the Iperf package. Additionally, by default you will need to substitute each `iperf` command with `/usr/bin/iperf3`. This path may differ dependent on your Iperf version.


## Using Iperf

Iperf must be installed on both computers you are testing the connection between. If you are using a Unix or Linux-based operating system on your personal computer, you may be able to install Iperf on your local machine. If you are testing the throughput of your Linode, however, it's better to use another server as the end point, as your local ISP may impose network restrictions that can affect the results of your test.


### TCP Clients & Servers

Iperf requires two systems because one system must act as a server, while the other acts as a client. The client connects to the server you're testing the speed of. 

1.  On the Linode you wish to test, launch Iperf in server mode:

        iperf -s

    You should see output similar to:

         ------------------------------------------------------------
         Server listening on TCP port 5001
         TCP window size: 85.3 KByte (default)
         ------------------------------------------------------------

2.  On your second Linode, connect to the first. Replace `198.51.100.5` with the first Linode's IP address.

        iperf -c 198.51.100.5

    The output should be similar to:

        ------------------------------------------------------------
        Client connecting to 198.51.100.5, TCP port 5001
        TCP window size: 45.0 KByte (default)
        ------------------------------------------------------------
        [  3] local 198.51.100.6 port 50549 connected with 198.51.100.5 port 5001
        [ ID] Interval       Transfer     Bandwidth
        [  3]  0.0-10.0 sec   142 MBytes   119 Mbits/sec

3.  You will also see the connection and results on your Iperf server. This will look similar to:

        ------------------------------------------------------------
        Server listening on TCP port 5001
        TCP window size: 85.3 KByte (default)
        ------------------------------------------------------------
        [  4] local 198.51.100.5 port 5001 connected with 198.51.100.6 port 50549
        [ ID] Interval       Transfer     Bandwidth
        [  4]  0.0-10.2 sec   142 MBytes   117 Mbits/sec

4.  To stop the Iperf server process, press `CTRL + c`.

### UDP Clients & Servers

Using Iperf, you can also test the maximum throughput achieved via UDP connections.

1.  Start a UDP Iperf server:

        iperf -s -u

    The output will be similar to:

        ------------------------------------------------------------
        Server listening on UDP port 5001
        Receiving 1470 byte datagrams
        UDP buffer size:  208 KByte (default)
        ------------------------------------------------------------

2.  Connect your client to your Iperf UDP server. Replace `198.51.100.5` with your IP address:

        iperf -c 198.51.100.5 -u

    The `-u` option we've passed tells Iperf that we are connecting via UDP. This is important, because we want to see the maximum throughput achieved via UDP. The output should be similar to:

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

    Looking at the output we have received, `1.05 Mbits/sec` is considerably less than what we received on the TCP tests. It is also considerably less than the maximum outbound bandwidth cap provided by the 1 GB Linode. This is because Iperf limits the bandwidth for UDP clients to 1 Mbit per second by default.

4.  You can change this with the `-b` flag, replacing the number after with the maximum bandwidth rate you wish to test against. If you are testing for network speed, we recommend setting this number above the maximum bandwidth cap provided by Linode. For example, this test was run on a 1 GB Linode:

        iperf -c 198.51.100.5 -u -b 150m

    This tells the client that we want to achieve a maximum of 150 Mbits per second if possible. The `-b` flag only works when using UDP connections, since Iperf does not set a bandwidth limit on the TCP clients. 

    The output should be similar to:

        -----------------------------------------------------------
        Client connecting to 198.51.100.5, UDP port 5001
        Sending 1470 byte datagrams
        UDP buffer size:  208 KByte (default)
        ------------------------------------------------------------
        [  3] local 198.51.100.6 port 41083 connected with 198.51.100.5 port 5001
        [ ID] Interval       Transfer     Bandwidth
        [  3]  0.0-10.0 sec   145 MBytes   122 Mbits/sec
        [  3] Sent 103625 datagrams
        [  3] Server Report:
        [  3]  0.0-10.3 sec   136 MBytes   111 Mbits/sec  13.488 ms 6464/103623 (6.2%)

    Now that is considerably better than the 1.05 Mbits/sec we were seeing earlier!

### Bidirectional Tests

In some cases, you may want to test both servers for the maximum amount of throughput. This can easily be done using the built-in bidirectional testing feature Iperf offers.

Run the following command to test both connections:

	iperf -c 198.51.100.5 -d

The result is that Iperf will start a server and a client connection on the original client server (198.51.100.6). Once this has been done, Iperf will connect the original Iperf server to the client connection, which is now acting as both a server connection and a client connection. This will look similar to:

	------------------------------------------------------------
	Server listening on TCP port 5001
	TCP window size: 85.3 KByte (default)
	------------------------------------------------------------
	------------------------------------------------------------
	Client connecting to 198.51.100.5, TCP port 5001
	TCP window size: 45.0 KByte (default)
	------------------------------------------------------------
	[  3] local 198.51.100.6 port 50550 connected with 198.51.100.5 port 5001
	[  5] local 198.51.100.6 port 5001 connected with 198.51.100.5 port 36916
	[ ID] Interval       Transfer     Bandwidth
	[  3]  0.0-10.0 sec   142 MBytes   118 Mbits/sec
	[  5]  0.0-10.1 sec   198 MBytes   165 Mbits/sec

On the original Iperf server, you will see:

	------------------------------------------------------------
	Client connecting to 198.51.100.6, TCP port 5001
	TCP window size: 45.0 KByte (default)
	------------------------------------------------------------
	[  6] local 198.51.100.5 port 36916 connected with 198.51.100.6 port 5001
	[  6]  0.0-10.0 sec   198 MBytes   166 Mbits/sec
	[  5]  0.0-10.2 sec   142 MBytes   117 Mbits/sec

It is important to note the IDs next to the connection notices. These IDs will allow you to separate the speed results of each server. In this example, the original Iperf server (198.51.100.5) is a 2 GB Linode, whereas the original Iperf client connection (198.51.100.6) is a 1 GB Linode. This explains why we are seeing different maximum throughputs from the servers. 

### Options

{: .table .table-striped}
| Option                             | Description                                                                               |
|:-----------------------------------|:------------------------------------------------------------------------------------------|
| -f 		                     | Change the format in which the tests are run. For example, you can use `-f k` to get results in Kbits per second instead of Mbits per second. Valid options include `m` (Mbits, default), `k` (Kbits), `K` (KBytes), and `M` (MBytes). |
| -V            	 	     | Forces Iperf to use IPv6 rather than IPv4.								 |
| -i            	             | Changes the interval between periodic bandwidth tests. For example, `-i 60` will make a new bandwidth report every 60 seconds. The default is zero, which performs one bandwidth test.			                                         |
| -p                                 | Changes the port. When not specified, the default port is 5001. You must use this flag on both the client and server.  															   |
| -B 			             | Binds Iperf to a specific interface or address. If passed through the server command, the incoming interface will be set. If passed through the client command, the outgoing interface will be set.           |
|:-----------------------------------|:------------------------------------------------------------------------------------------|

