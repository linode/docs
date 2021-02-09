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

# Check which ports are in use on yYour Linux system

One step in securing a Linux computer system is identifying which ports are active. This tutorial shows you how to check the ports in use.

Was your system hacked? Is your database exposed to the internet? Is there malware hiding on your system stealing information? When you need to answer these questions, one step is to scan your Linux system’s ports to determine which are in use so you can identify both ends of active connections.

**What are ports?** Service names and port numbers are used to distinguish between different services that run over transport protocols such as TCP, UDP, DCCP, and SCTP. Well-known port assignments, such as HTTP at port 80 over TCP and UDP, are listed at the [IANA Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml).

Three tools help you check ports in use on Linux systems: `netstat` (show network status), `ss` (socket statistics), and `lsof` (list open files). Here’s a short introduction to each, with links to more in-depth information.

In general, it doesn't matter which one you use, especially if all three are already installed. The tools’ functionality is largely redundant. For example, `ss` was written to replace `netstat`, but not every distro includes it because it's not that much of an improvement. Yet plenty of scripts reference `netstat`, so you can't leave it out. Asking which to use is like asking, "emacs or vi?"

## Using netstat

Use [**netstat**](https://www.linode.com/docs/guides/inspecting-network-information-with-netstat/) to inspect:

* Unix sockets and network connections
* Routing tables
* Network interfaces
* Network protocols, and
* Multicast group membership

Running `netstat` without any options displays all open sockets and network connections, which can generate a *lot* of output. You can control the output using command-line switches.

| **Option** | **Definition** |
| :----- | :----- |
| \-v | Shows verbose output. |
| \-r | Displays the kernel routing tables. |
| \-e | Displays extended information for network connections. |
| \-i | Displays a table of all network interfaces. When used with `-a`, the output also includes interfaces that are not up. |
| \-s | Displays summary statistics for each protocol. |
| \-W | Avoids truncating IP addresses and provides as much screen space as needed to display them. |
| \-n | Displays numerical (IP) addresses instead of resolving them to hostnames. |
| \-A | Allows you to specify the protocol family. Valid values are `inet`, `inet6`, `unix`, `ipx`, `ax25`, `netrom`, `econet`, `ddp`, and `bluetooth`. |
| \-t | Displays TCP data only. |
| \-u | Displays UDP data only. |
| \-4 | Displays IPv4 connections only. |
| \-6 | Displays IPv6 connections only. |
| \-c | Displays information continuously (every second). |
| \-p | Displays the process ID and the name of the program that owns the socket. Using this option requires root privileges. |
| \-o | Displays timer information. |
| \-a | Shows both listening and non-listening network connections and Unix sockets. |
| \-l | Displays listening network connections and Unix sockets, which are not shown by default. |
| \-C | Displays routing information from the route cache. |
| \-g | Displays multicast group membership information for IPv4 and IPv6. |

## Using ss

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

## Using lsof

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
