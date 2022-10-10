---
slug: netcat
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'This guide provides an introduction to Netcat, a simple UNIX utility that reads and writes data across connections, using either the TCP or UDP protocols.'
keywords: ["UNIX", "TCP", "UDP", "netcat", "nc", "network"]
tags: ["linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-28
modified_by:
  name: Linode
title: 'Learning to Use netcat to its Full Potential'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[netcat](https://en.wikipedia.org/wiki/Netcat)'
aliases: ['/networking/diagnostics/netcat/']
---

Netcat is a simple but handy UNIX utility that reads and writes data across network connections, using either TCP or UDP. The purpose of this guide is to help you learn the `netcat` command line utility and use it productively.

## Before You Begin

Some of the commands in this guide will require the use of two terminal windows running `netcat`, one acting as a server and the other as the client. These can be separate machines, or you can connect to the same `localhost`.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.

Port numbers 0-1024 are restricted and can only be used with root privileges, which means that you should use the `sudo` command for creating TCP/IP *servers* that use port numbers 0-1024.
This rule does not apply to TCP/IP *clients* that use port numbers 0-1024.
{{< /note >}}

## Introduction

As `netcat` is not installed by default, you will most likely need to install `netcat` on
your Linux machine using your favourite package manager.

{{< note >}}
The `netcat` binary usually has an alias named `nc`, which is what will be used
in this guide because it is shorter. Usually both commands point to the same binary file.
{{< /note >}}

If you execute `apt-cache search netcat` on a Debian machine, you will see the following output:

    apt-cache search netcat

{{< output >}}
netcat - TCP/IP swiss army knife -- transitional package
netcat-traditional - TCP/IP swiss army knife
netcat-openbsd - TCP/IP swiss army knife
{{< /output >}}

Notice that `netcat` is a dummy package and its purpose is to ease upgrades. The
differences between the other two packages are not big, but you will need to visit
their package descriptions and their man pages in order to get a detailed description
of their capabilities.

The OpenBSD version of `netcat` supports IPv6, proxies and UNIX sockets, which are not
supported by the `netcat-traditional` variant. On the other hand, `netcat-traditional` includes
support for the `-e` option that allows you to execute a program from a remote shell, which is
not offered by `netcat-openbsd`. However, if you do not need any of these features, you will
not notice any real difference between these two versions of `netcat`.

This guide will be using the `netcat` binary that comes with the `netcat-traditional` package.
This version of `netcat` was written by a person known as *Hobbit*.

## Command Line Options

`netcat` commands have the `netcat [options] host port` generic form. The `nc` binary
supports the following command line options:

| **Option** | **Usage** |
| --------- | ----- |
| `-u` | The `-u` option tells `nc` to work in UDP mode. If `-u` is not present, `nc` will be using TCP.|
| `-l` | The `-l` option tells `nc` to listen for incoming connections, which makes it a server process. |
| `-h` | The `-h` option displays a help screen. |
| `-e filename`| The `-e` option tells `nc` to execute the a file named with the `filename` parameter after a client connection.|
| `-c string` | The `-c` option tells `nc` to pass the contents of `string` to `/bin/sh -c` for execution after a client connection. |
| `-i seconds` | The `-i` option defines the delay interval used by `nc` when sending lines or scanning ports. |
| `-q seconds` | The `-q` option tells `nc` to wait the specified number of seconds before quitting after getting an EOF in standard input. If the value is negative, `nc` will wait forever. |
| `-v` | The `-v` option tells `nc` to produce verbose output. |
| `-vv` | The `-vv` option tells `nc` to produce even more verbose output than the `-v` option. |
| `-z` | The `-z` option tells `nc` to use zero-I/O mode, which is used when performing port scanning. |
| `-r` | The `-r` option tells `nc` to use random local and remote ports, which might be good for testing. |
| `-o file` | The `-o` option tells `nc` to save the hex dump of network traffic to `file`, which might be handy for debugging. |
| `-n` | The `-n` option tells `nc` to use IP addresses (numeric) only. |
| `-p port` | The `-p` option tells `nc` which port number to use. |
| `-b` | The `-b` option tells `nc` to allow UDP broadcasts. |
| `-C` | The `-C` option tells `nc` to send CRLF as line-ending. |
| `-T type` | The `-T` option allows `nc` to set the type of the [TOS](https://en.wikipedia.org/wiki/Type_of_service) (*Type Of Service*) flag. |
| `-g gateway` | The `-g` option allows you to specify the route that the packets will take through the network. You can learn more about Source Routing [here](https://tools.ietf.org/html/rfc791). |
| `-G number` | The value of the `-G` option allows you to specify the value of the source routing pointer.  You can learn more about the Source Routing pointer [here](https://tools.ietf.org/html/rfc791). |
| `-s address` | The `-s` option allows you to specify the local source address that will be used in the `nc` command. |
| `-t` | The `-t` option is used for enabling telnet negotiation. |


The remainder of this guide will demonstrate the most important of these commands. That being said, `netcat` is a versatile tool, and there's a large opportunity for experimenting on your own.

## Using netcat as a Client

The most common use of `netcat` is to act as a client for a server process. This is mostly
used for troubleshooting network servers and network connections because you can see the raw data
of the interaction. So, providing `nc` with just a hostname or IP address and a port number
will make `netcat` act as the `telnet` utility:

    nc localhost 22

{{< output >}}
SSH-2.0-OpenSSH_7.9p1 Debian-10
{{< /output >}}

In the given example, `nc` tries to connect to TCP port number 22 of the `localhost` - notice
that TCP port number 22 is used by SSH, which is what triggers the provided output.

Also notice that as the `-u` option is not used, `nc` will use the TCP protocol by default.

## Using netcat as a Server

`nc` will accept connections at a given port and act as a server when you execute
it with the `-l` option:

    nc -l -p 1234

In another terminal window, connect a client to the server with `nc`:

    nc 127.0.01 1234

You can now send messages between the two machines with `nc`.

{{< output >}}
This is a client!
Hello from the server!
{{< /output >}}

The previous command tells `netcat` to listen on TCP port number 1234 for incoming
connections - you can also see that `netcat` automatically reads data from the client
and that you can send your response to the TCP client just by typing it.

Once again, as the `-u` option is not used, `nc` will use the TCP protocol.

## Getting Verbose Output

There are times where you cannot connect to the remote machine or the answer you get is
not the expected one. In such cases, it is good to use either `-v` or `-vv` in order to
get more information from the `nc` connection.

    nc -v localhost 1234

{{< output >}}
localhost [127.0.0.1] 1234 (?) : Connection refused
{{< /output >}}

The output you get shows that the reason you cannot connect to `localhost`
using TCP port number 1234 is that your connection was refused by the server.
Executing `nc localhost 1234` will return no output, which offers no help.

Using `-vv` instead of `-v` will generate the following kind of output:

    nc -vv localhost 1234

{{< output >}}
localhost [127.0.0.1] 1234 (?) : Connection refused
 sent 0, rcvd 0
{{< /output >}}

If the TCP connection was successful, you would have gotten the following kind of
output on the client side:

    nc -vv localhost 1234

{{< output >}}
localhost [127.0.0.1] 1234 (?) open
{{< /output >}}

Both `-v` and `-vv` are very valuable when things do not work as expected.

## Using the UDP Protocol

In order to use the UDP protocol instead of the TCP protocol, you should include
the `-u` option in your `nc` commands. Therefore, the following command will
use the UDP protocol:

    nc –vv –u 8.8.8.8 53

{{< output >}}
dns.google [8.8.8.8] 53 (domain) open
{{< /output >}}

As we are trying to connect to a (public) DNS server, we will have to use port number `53`.

## Examples

In this section you will find a number of use cases and examples for `nc`.

### Using netcat for Port Scanning

Netcat can be used for port scanning as a naive version of [nmap](https://nmap.org/) with the `-z` option. The command that follows scans the `localhost`, which has an IP address of `127.0.0.1`, using a range of port numbers from 1 to 30 (`1-30`):

    netcat -z -vv -n 127.0.0.1 1-30
{{< output >}}
(UNKNOWN) [127.0.0.1] 30 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 29 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 28 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 27 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 26 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 25 (smtp) open
(UNKNOWN) [127.0.0.1] 24 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 23 (telnet) : Connection refused
(UNKNOWN) [127.0.0.1] 22 (ssh) open
(UNKNOWN) [127.0.0.1] 21 (ftp) : Connection refused
(UNKNOWN) [127.0.0.1] 20 (ftp-data) : Connection refused
(UNKNOWN) [127.0.0.1] 19 (chargen) : Connection refused
(UNKNOWN) [127.0.0.1] 18 (msp) : Connection refused
(UNKNOWN) [127.0.0.1] 17 (qotd) : Connection refused
(UNKNOWN) [127.0.0.1] 16 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 15 (netstat) : Connection refused
(UNKNOWN) [127.0.0.1] 14 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 13 (daytime) : Connection refused
(UNKNOWN) [127.0.0.1] 12 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 11 (systat) : Connection refused
(UNKNOWN) [127.0.0.1] 10 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 9 (discard) : Connection refused
(UNKNOWN) [127.0.0.1] 8 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 7 (echo) : Connection refused
(UNKNOWN) [127.0.0.1] 6 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 5 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 4 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 3 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 2 (?) : Connection refused
(UNKNOWN) [127.0.0.1] 1 (tcpmux) : Connection refused
 sent 0, rcvd 0
{{< /output >}}

Notice that as we are using the `-n` option, the server should be specified by its
IP address. Additionally, if you omit the `-vv` option, you will get a much shorter
output, which is verified by the following output:

    nc -z -v -n 127.0.0.1 1-30
{{< output >}}
(UNKNOWN) [127.0.0.1] 25 (smtp) open
(UNKNOWN) [127.0.0.1] 22 (ssh) open
{{< /output >}}

Therefore, the use of `-v` makes `nc` to display open TCP ports only.

If you do not use `-v` or `-vv`, the previous command will return no output:

    nc -z -n 127.0.0.1 1-30
{{< output >}}
{{< /output >}}

### Using netcat for Transferring Files

One of the features of `netcat` is that it is capable of transferring files:

    cat access.log | nc -vv -l -p 4567
{{< output >}}
listening on [any] 4567 ...
connect to [127.0.0.1] from localhost [127.0.0.1] 53952
{{< /output >}}

When a client connects to TCP port number `4567`, `nc` will send the contents of the
`access.log` file to it. The correct way to execute a `nc` client in order to get that
file is the following. Open a new terminal window and enter this command:

    nc -vv localhost 4567 > fileToGet
{{< output >}}
localhost [127.0.0.1] 4567 (?) open
^C sent 0, rcvd 362148
{{< /output >}}

You will need to press `Control+C` for the TCP connection to close.

### Using netcat for Making any Process a Server

Netcat allows you to make any process a server process with the help of the `–e` parameter:

    nc -vv -l -p 12345 -e /bin/bash

{{< output >}}
listening on [any] 12345 ...
connect to [127.0.0.1] from localhost [127.0.0.1] 46930
bash: line 2: asd: command not found
{{< /output >}}

Here you tell `nc` to accept incoming TCP connections on TCP port number `12345`. When
a connection is accepted, `nc` will execute `/bin/bash`, which means that it will give
you shell access on the machine. After a client successfully connects, every input line
will be executed as a shell command using `/bin/bash`. If the command cannot be found,
the client will get no output and an error message will be generated on the server side.
Otherwise, the output of the command will be sent to the client. To test this functionality, in another terminal window create a `nc` client and type in the following command:

    nc localhost 12345

{{< caution >}}
This capability of `netcat` can introduce security threats on your Linux machine
when used improperly. It is advised that you exercise caution if using this feature.
{{< /caution  >}}

### Executing a Command After Connecting

If you want to execute a given command each time a client connects to a server that is
implemented using `nc`, then you should use the `-c` option followed by that command.
The example that follows executes `ls -l` and sends the output to the client:

    nc -vv -c "ls -l" -l 127.0.0.1 -p 1234

{{< output >}}
listening on [any] 1234 ...
connect to [127.0.0.1] from localhost [127.0.0.1] 33788
{{< /output >}}

Try executing `nc 127.0.0.1 1234` on another terminal on your local machine to get the
output of `ls -l`.

{{< caution >}}
This capability of `netcat` can introduce security threats on your Linux machine
when used improperly. It is advised that you exercise caution if using this feature.
{{< /caution >}}

### Using netcat as a Simple Web Server

Let us say that you want to serve a simple HTML page, which in this case will be called
`index.html`, from your Linux machine but you have no real web server available. You can
use `netcat` to serve that simple HTML page on clients from your local machine as follows:

    nc -vv -l 127.0.0.1 -p 4567 < index.html

Using `wget` to get that page will generate the following output in the `nc` part:

{{< output >}}
listening on [any] 4567 ...
connect to [127.0.0.1] from localhost [127.0.0.1] 53980
GET / HTTP/1.1
User-Agent: Wget/1.18 (linux-gnu)
Accept: */*
Accept-Encoding: identity
Host: localhost:4567
Connection: Keep-Alive
{{< /output >}}

Additionally, when using `wget`, we will receive the following output, which reflects the contents
of the `index.html` page:

    wget -qO- http://localhost:4567/

{{< output >}}
&lt;title&gt;Page Under Construction&lt;/title&gt;
&lt;META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8"&gt;
&lt;style type="text/css"&gt;
body {
  background-color:#000;
}
.img {
  margin:180px 50px 75px 450px;
}
&lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;H1&gt;Under Construction&lt;/H1&gt;
&lt;/body&gt;
&lt;/html&gt;
{{< /output >}}

### Using netcat for Getting Data from Web Servers

The HTTP service is just a TCP service; therefore `nc` can be used for getting data from
a web server or for testing web servers. The following command will connect to the
`www.linode.com` machine using port number `80`, which corresponds to the HTTP protocol:

    nc www.linode.com 80

You should type the first line (`GET / HTTP/1.1`) and press the enter key two times
in order to get a response from the web server.

{{< output >}}
GET / HTTP/1.1

HTTP/1.1 400 Bad Request
Server: nginx
Date: Wed, 10 Jul 2019 20:02:47 GMT
Content-Type: text/html
Content-Length: 166
Connection: close

&lt;html&gt;
&lt;head&gt;&lt;title&gt;400 Bad Request&lt;/title&gt;&lt;/head&gt;
&lt;body bgcolor="white"&gt;
&lt;center&gt;&lt;h1&gt;400 Bad Request&lt;/h1&gt;&lt;/center&gt;
&lt;hr&gt;&lt;center&gt;nginx&lt;/center&gt;
&lt;/body&gt;
&lt;/html&gt;
{{< /output >}}

A better way to execute this command is the following:

    echo -en "GET / HTTP/1.0\n\n\n" | netcat www.linode.com 80

{{< output >}}
HTTP/1.1 301 Moved Permanently
Server: nginx
Date: Wed, 10 Jul 2019 20:04:10 GMT
Content-Type: text/html
Content-Length: 178
Connection: close
Location: https:///

&lt;html&gt;
&lt;head&gt;&lt;title&gt;301 Moved Permanently&lt;/title&gt;&lt;/head&gt;
&lt;body bgcolor="white"&gt;
&lt;center&gt;&lt;h1&gt;301 Moved Permanently&lt;/h1&gt;&lt;/center&gt;
&lt;hr&gt;&lt;center&gt;nginx&lt;/center&gt;
&lt;/body&gt;
&lt;/html&gt;
{{< /output >}}

This used to be a very popular way of testing web servers when every web server
was using the HTTP protocol. Nowadays, the use of HTTPS makes difficult to test
a web server using tools such as `netcat` and `telnet` because the web traffic is
encrypted.

### Using netcat for Creating a Chat Server

Creating a basic chat server with `nc` for two machines to communicate with each other is completed in two commands. One of the machines will function as the server and the other machine will be the client. On the server you will need to execute the following:

    nc -vv -l 127.0.0.1 -p 1234

{{< output >}}
listening on [any] 1234 ...
connect to [127.0.0.1] from localhost [127.0.0.1] 60608
Hello!
{{< /output >}}

And on the client:

    nc -vv 127.0.0.1 1234

{{< output >}}
Hello!
{{< /output >}}

If both people that want to talk are on the same Linux machine, then using `127.0.0.1` is
safer and quicker. Otherwise, you should use the IP address of the server in both commands.

### Transferring Entire Directories Using netcat

 This section will explain how to transfer entire directories using `netcat`. Imagine that you wish to transfer the `var` directory that resides under
your home directory. You can do that as follows:

    tar -cvf - ~/var | nc -vv -l 127.0.0.1 -p 1234

{{< output >}}
listening on [any] 1234 ...
tar: Removing leading `/' from member names
/home/username/var/
/home/username/var/slide.tar.ORG
{{< /output >}}

This creates a TCP server that listens on TCP port number 1234
on the host with the `127.0.0.1` IP address. Generally speaking, using `127.0.0.1`
as the server IP address is more secure than using one of the real IP addresses of
your Linux machine provided that both the server and the client are on the same
Linux machine.

After that you will need to execute the following command on the client side:

    cd /tmp
    nc 127.0.0.1 1234 | tar -xvf -

{{< output >}}
home/username/var/
home/username/var/slide.tar.ORG
home/username/var/after.tshark
home/username/var/test.pcap
home/username/var/sys09725827.php
home/username/var/test.php
home/username/var/u5EJqp.php
home/username/var/http.pcap
home/username/var/sketch.zip
{{< /output >}}

When the client connects, the `nc` server will also print the following output:

{{< output >}}
listening on [any] 1234 ...
tar: Removing leading `/' from member names
/home/username/var/
/home/username/var/slide.tar.ORG
connect to [127.0.0.1] from localhost [127.0.0.1] 60632
/home/username/var/after.tshark
/home/username/var/test.pcap
/home/username/var/sys09725827.php
/home/username/var/test.php
/home/username/var/u5EJqp.php
/home/username/var/http.pcap
/home/username/var/sketch.zip
 sent 3645440, rcvd 0
{{< /output >}}

You will need to press `Control+C` for the TCP connection to close.

### Testing the Network Speed Using netcat

This section will explain how to test the connection speed between
two machines using `nc`. You will need two hosts. On the server machine use the following command:

    time nc -vv -n -l -p 2222 >/dev/null

{{< output >}}
listening on [any] 2222 ...
connect to [127.0.0.1] from (UNKNOWN) [127.0.0.1] 42286
 sent 0, rcvd 2090934272

real	0m21.438s
user	0m0.230s
sys	0m1.190s
{{< /output >}}

On the client machine, you should execute the following command and press `Control+C`
after the desired amount of time to end the connection:

    time yes | nc.traditional -vv -n 127.0.0.1 2222 >/dev/null

{{< output >}}
(UNKNOWN) [127.0.0.1] 2222 (?) open
^C sent 2090926080, rcvd 0


real	0m5.482s
user	0m0.456s
sys	0m3.109s
{{< /output >}}

Now that you know it took 5.482s to transfer 2090926080 bytes, you can calculate the network speed. As the `nc` server starts first, you should use the numbers found in the `nc` client.
