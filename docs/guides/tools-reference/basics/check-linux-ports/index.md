---
slug: check-linux-ports
author:
  name: Martin Heller
  email: martin.heller@gmail.com
description: 'It’s valuable to know which Linux ports are active, primarily for security purposes. This tutorial shows you how to find the information.'
og_description: 'Need to know ports are active on a Linux system? This tutorial shows you three ways to find the information.'
keywords: ['linux ports in use']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-09
modified_by:
  name: Linode
title: "Check which ports are in use on your Linux system"
h1_title: "Check which ports are in use on your Linux system"
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
external_resources:
- '[Inspecting Network Information with netstat](https://www.linode.com/docs/guides/inspecting-network-information-with-netstat/)'
---

One step in securing a Linux computer system is identifying which ports are active.  Was your system hacked? Is your database exposed to the internet? Is there malware hiding on your system stealing information? When you need to answer these questions, one step is to scan your Linux system’s ports to determine which are in use so you can identify both ends of active connections.

## What is a Port in Computer Networking?

Service names and port numbers are used to distinguish between different services that run over transport protocols. Common transport protocols are TCP, UDP, DCCP, and SCTP. These protocols enable communication between applications by establishing a connection and ensuring data is transmitted successfully.  Well-known port assignments, such as HTTP at port 80 over TCP and UDP, are listed at the [IANA Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml). These port assignments help distinguish different types of network traffic across the same connection.

## Which Linux System Ports Are in Use?

Three tools to help you check ports in use on a Linux system are:
- *netstat*: This tool shows your server's network status.
-  *ss*: You can view socket statistics with the ss tool. For example, ss allows you to monitor TCP, UDP, and UNIX sockets.
- *lsof*: This Linux utility lists open files. Since everything on a Linux system can be considered a file, lsof provides a lot of information on your entire system.

Since all three tools are widely-available and similar, which tool you use depends on your preference and familiarity with each.

### Using netstat

This tool is great for inspecting the following areas of your Linux system:

- Unix sockets and network connections
- Routing tables
- Network interfaces
- Network protocols
- Multicast group membership

Running `netstat` without any options displays all open sockets and network connections, which can generate a *lot* of output. You can control the output using netstat's command-line options. For example, to view the PID and program name for a system’s listening TCP connections, run netstat with the following command-line options:

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

Use [**ss**](https://www.linode.com/docs/guides/ss/) to monitor TCP, UDP, and UNIX sockets. To view all system sockets, elevate the utility’s privileges with `sudo`, unless you are already running as the `root user.

Running `ss` with no options displays TCP, UDP, and UNIX sockets. To restrict the output, use one or more options.

| **Option** | **Definition** |
| :----- | :----- |
| \-h | The -h option shows a summary of all options. |
| \-V | The -V option displays the ss version. |
| \-H | The -H option tells ss to suppress the header line. This is useful when you process the generated output using a scripting language. |
| \-t | The -t parameter tells ss to show TCP connections only. |
| \-u | The -u parameter tells ss to show UDP connections only. |
| \-d | The -d parameter tells ss to show DCCP sockets only. |
| \-S | The -S parameter tells ss to show SCTP sockets only. |
| \-a | The -a option tells ss to display both listening and non-listening sockets of every kind. |
| \-l | The -l parameter tells ss to display listening sockets (they are omitted by default). |
| \-e | The -e option tells ss to display detailed socket information. |
| \-x | The -x parameter tells ss to display UNIX domain sockets only. |
| \-A | The -A option allows you to select the socket types that ss should show. The `-A` option accepts the following set of identifiers that can be combined and separated by commas: `all`, `inet`, `tcp`, `udp`, `raw`, `unix`, `packet`, `netlink`, `unix\_dgram`, `unix\_stream`, `unix\_seqpacket`, `packet\_raw`, and `packet\_dgram`. |
| \-4 | The -4 command line option tells ss to display IPv4 connections only. |
| \-6 | The -6 command line option tells ss to display IPv6 connections only. |
| \-f FAMILY | The -f tells ss to display sockets of type FAMILY. The supported values are `unix`, `inet`, `inet6`, and `netlink`. |
| \-s | The -s option displays useful statistics about current connections. |
| \-o | The -o option displays timer information. There are five types of timers: `on` (a TCP retrans timer, a TCP early retrans timer, or a tail loss probe timer); `keepalive` (the TCP keep alive timer); `timewait` (the timewait stage timer); persist (the zero window probe timer); and `unknown` (a timer that doesn’t fit into the other categories). |
| \-n | The -n option tells ss to disable the resolving of service names. |
| \-r | The -r option tells ss to enable DNS resolving in the output, which is turned off by default. |
| \-m | The -m parameter tells ss to display socket memory usage information. |
| \-p | The -p parameter tells ss to display the process that is using a socket. |
| \-D FILE | The -D parameter tells ss to save the output to the FILE file. |

### Using lsof

[**lsof**](https://www.linode.com/docs/guides/lsof/) lists open files. However, *everything* is a file in Linux, which means `lsof` can report open network interfaces and network connections. To view all system sockets, elevate the utility’s privileges with `sudo`, unless you are already running as the root user.

To restrict the output to your area of interest, use the appropriate options.

| **Option** | **Description** |
| :----- | :----- |
| \-h and -? | Both options present a help screen. Note that you need to properly escape the `?` character for `-?` to work. |
| \-a | This option tells lsof to logically ADD all provided options. |
| \-b | This option tells lsof to avoid kernel functions that might block the returning of results. This is a very specialized option. |
| \-l | If converting a user ID to a login name is working improperly or slowly, you can disable it using the -l parameter. |
| --P | The -P option prevents the conversion of port numbers to port names for network files. |
| \-u list | You can define a list of login names or user ID numbers whose files are returned using the -u option. The -u option supports the `^` character for excluding the matches from the output. |
| \-c list | Use the -c option to limit the display of files for processes executing the commands that begin with the characters in the list. This supports regular expressions, and also supports the `^` character for excluding the matches from the output. |
| \-p list | The -p option selects the files for processes whose process IDs are in the list. The -p option supports the `^` character for excluding the matches from the output. |
| \-g list | Use the -g option to select the files for the processes whose optional process group IDs are in the list. The -g option supports the `^` character for excluding the matches from the output. |
| \-s | The -s option allows you to select the network protocols and states that interest you. The -s option supports the `^` character for excluding the matches from the output. The correct form is `PROTOCOL:STATE`. Possible protocols are `UDP` and `TCP`. Among the possible TCP states are: `CLOSED`, `SYN-SENT`, `SYN-RECEIVED`, `ESTABLISHED`, `CLOSE-WAIT`, `LAST-ACK`, `FIN-WAIT-1`, `FIN-WAIT-2`, `CLOSING`, and `TIME-WAIT`. Possible UDP states are `Unbound` and `Idle`. |
| \+d s | The +d option instructs lsof to search for all open instances of directory `s` and the files and directories it contains at its top level. |
| \+D directory | The +D option tells lsof to search for all open instances of directory `directory` and all the files and directories it contains to its complete depth. |
| \-d list | The -d option specifies the list of file descriptors to include or exclude from the output. `-d 1,\^2` means include file descriptor 1 and exclude file descriptor 2. |
| \-i4 | Use this option to display IPv4 data only. |
| \-i6 | Use this option to display IPv6 data only. |
| \-i | The -i option without any values tells lsof to display network connections only. |
| \-i address | The -i option with a value limits the displayed information to match that value. Some example values are `TCP:25` for displaying TCP data that listens to port number 25, `@google.com` for displaying information related to google.com, `:25` for displaying information related to port number 25, `:POP3` for displaying information related to the port number that is associated to POP3 in the `/etc/services` file, etc. You can also combine hostnames and IP addresses with port numbers and protocols. |
| \-t | The -t option tells lsof to display process identifiers without a header line. This is particularly useful for feeding the output of lsof to the `kill(1)` command or to a script. Notice that `-t` automatically selects the `-w` option. |
| \-w | The -w option disables the suppression of warning messages. |
| \+w | The +w option enables the suppression of warning messages. |
| \-r TIME | The -r option causes the lsof command to repeat every `TIME` seconds until the command is manually terminated with an interrupt. |
| \+r TIME | The +r command, with the `+` prefix, acts the same as the -r command, but exits its loop when it fails to find any open files. |
| \-n | The -n option prevents network numbers from being converted to host names. |
| \-F CHARACTER | The -F command instructs lsof to produce output that is suitable as input for other programs. For a complete explanation, consult the lsof manual entry. |
