---
slug: check-linux-ports-in-use
description: "Tools like netstat, ss, & lsof can help you find which ports are in use on your Linux system. Use this guide for an introduction to Linux tools. ✓ Read now!"
keywords: ['linux ports in use']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-25
modified: 2022-01-14
tags: ["networking","linux"]
modified_by:
  name: Linode
title: "Checking Open and Listening Ports on Linux Using netstat and ss"
title_meta: "Check Open and Listening Ports on Linux Using netstat and ss"
authors: ["Martin Heller"]
---

One step in securing a Linux computer system is identifying which ports are active. Your system's active ports give you information about which outside applications may be connected to your system. You can also discover if you are unintentionally exposing an application or service to the internet, like a MySQL database. There are several Linux tools that help you discover which ports are in use and identify both ends of active communications. This guide introduces three common tools you can use with links to guides that dive deeper into each tool.

## What is a Port in Computer Networking?

Service names and port numbers are used to distinguish between different services that run over transport protocols. Common transport protocols are TCP, UDP, DCCP, and SCTP. These protocols enable communication between applications by establishing a connection and ensuring data is transmitted successfully. Well-known port assignments, such as HTTP at port 80 over TCP and UDP, are listed at the [IANA Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml). These port assignments help distinguish different types of network traffic across the same connection.

## How to Check Which Linux Ports Are in Use?

Three tools to help you check ports in use on a Linux system are:

- *netstat*: This tool shows your server's network status.
-  *ss*: You can view socket statistics with the ss tool. For example, ss allows you to monitor TCP, UDP, and UNIX sockets.
- *lsof*: This Linux utility lists open files. Since everything on a Linux system can be considered a file, lsof provides a lot of information on your entire system.

While all three tools help you learn how to check if a port is open in Linux, each program has its own advantages and disadvantages. See the following examples to identify which tool is the best fit for your purpose.

### Using netstat

The netstat tool is great for inspecting the following areas of your Linux system:

- Unix sockets and network connections
- Routing tables
- Network interfaces
- Network protocols
- Multicast group membership

Running `netstat` without any options displays all open sockets and network connections. While this checks if a port is open in Linux, it can generate a *lot* of output. You can control the output using netstat's command-line options. For example, to view the PID and program name for a system’s listening TCP connections, run netstat with the following command-line options:

    netstat -ltp

The output resembles the following:

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:http-alt        0.0.0.0:*               LISTEN      381070/monitorix-ht
tcp        0      0 localhost:domain        0.0.0.0:*               LISTEN      553/systemd-resolve
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN      2145/sshd: /usr/sbi
tcp        0      0 localhost:33060         0.0.0.0:*               LISTEN      9638/mysqld
tcp        0      0 localhost:mysql         0.0.0.0:*               LISTEN      9638/mysqld
tcp6       0      0 [::]:http               [::]:*                  LISTEN      10997/apache2
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN      2145/sshd: /usr/sbi
{{</ output >}}

To learn how to install netstat, interpret its output, and view common command line options, see our [Inspecting Network Information with netstat](/docs/guides/inspecting-network-information-with-netstat/) guide.

### Using ss

Another way to have Linux check ports is via the [**ss**](/docs/guides/ss/) tool. `ss` was created to improve upon netstat and provides more functionality. It allows you to monitor TCP, UDP, and UNIX sockets. A socket enables programs to communicate with each other across a network and is comprised of an IP address and a port number.

Running the `ss` with no options displays TCP, UDP, and UNIX sockets. Similar to netstat, this unrestricted list can get quite big on busy machines, so it is useful to restrict the ss command's output by using command-line options. For example, to view all listening and non-listening TCP sockets issue the following command:

    ss -ta

The output resembles the following:

{{< output >}}
State         Recv-Q     Send-Q         Local Address:Port               Peer Address:Port     Process
LISTEN        0          4096                 0.0.0.0:http-alt                0.0.0.0:*
LISTEN        0          4096           127.0.0.53%lo:domain                  0.0.0.0:*
LISTEN        0          128                  0.0.0.0:ssh                     0.0.0.0:*
LISTEN        0          70                 127.0.0.1:33060                   0.0.0.0:*
LISTEN        0          151                127.0.0.1:mysql                   0.0.0.0:*
ESTAB         0          0              192.0.2.0:ssh               192.0.2.1:51617
TIME-WAIT     0          0              192.0.2.0:ssh              192.0.2.2:60630
TIME-WAIT     0          0              192.0.2.0:ssh               192.0.2.3:51312
TIME-WAIT     0          0                  127.0.0.1:http-alt              127.0.0.1:52456
TIME-WAIT     0          0              192.0.2.0:ssh               192.0.2.4:44364
ESTAB         0          0              192.0.2.0:ssh              192.0.2.5:51718
LISTEN        0          511                        *:http                          *:*
LISTEN        0          128                     [::]:ssh                        [::]:*
{{</ output >}}

Using just the `-l` parameter tells ss to list all Linux's listening ports, which are omitted by default, making it easier to check for listening ports in Linux.

To take a deeper dive into the ss tool, read our [Learning to Use the ss Tool to its Full Potential](/docs/guides/ss/) guide. This guide provides commands specific to each protocol, commands to view general statistics about a system's current connections, and ways to filter your output.

### Using lsof

Since everything on a Linux system can be considered a file, the **lsof** tool can report on many aspects of a system, including open network interfaces and network connections. By default, it will list open ports in Linux. The lsof tool is preinstalled on many Linux distributions, so you may consider using it before a tool you need to install.

While one of the most frequent uses of `lsof` is determining which program listens to a given TCP port, one unique feature of the lsof tool is *repeat mode**. This mode allows you to run the `lsof` command continuously on a timed interval. When inspecting your system to find information about which ports are in use, lsof can return information about which user and processes are using a specific port. For example, when working with a local development environment you may want to find which localhost ports are currently in use. Use the following command to retrieve this information:

    lsof -i@localhost

The output returns a similar response:

{{< output >}}
COMMAND     PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
Adobe\x20   932     jdoe   14u  IPv4 0x3dab8c45775e6b5b      0t0  TCP localhost:15292 (LISTEN)
Code\x20H 38254     jdoe   81u  IPv4 0x3dab8c45922118fb      0t0  TCP localhost:49336 (LISTEN)
VBoxHeadl 49798     jdoe   15u  IPv4 0x3dab8c45a01fcf1b      0t0  TCP localhost:rockwell-csp2 (LISTEN)
Google    55001     jdoe   37u  IPv4 0x3dab8c457579acbb      0t0  TCP localhost:51706->localhost:bmc_patroldb (ESTABLISHED)
hugo      57981     jdoe 8041u  IPv4 0x3dab8c45a423853b      0t0  TCP localhost:bmc_patroldb (LISTEN)
hugo      57981     jdoe 8042u  IPv4 0x3dab8c45a3a8e2db      0t0  TCP localhost:bmc_patroldb->localhost:51706 (ESTABLISHED)
{{</ output >}}

`lsof` is a powerful diagnostic tool capable of a significant number of ways that you can combine its command line options to troubleshoot various issues. To learn more about the `lsof` command read our [How to List Open Files with lsof](/docs/guides/lsof/) guide. This guide provides information about command-line options, the anatomy of the lsof output, and filtering your output with regular expressions.
