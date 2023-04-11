---
slug: linux-ping-command
description: "The ping command is ubiquitous for its convenience and simplicity when it comes to testing network responses. But while the basics are straightforward, ping has plenty of options that can greatly enhance your network tests. Learn all about them in this guide."
keywords: ['linux ping command', 'linux ping port', 'linux ping options']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-20
modified_by:
  name: Nathaniel Stickman
title: "The Linux ping Command"
title_meta: "Introduction to the Linux ping Command"
external_resources:
- '[phoenixNAP: Linux Ping Command Tutorial with Examples](https://phoenixnap.com/kb/linux-ping-command-examples)'
- '[Linuxize: Linux Ping Command Tutorial with Examples](https://linuxize.com/post/linux-ping-command/)'
- '[GeeksforGeeks: PING Command in Linux with Examples](https://www.geeksforgeeks.org/ping-command-in-linux-with-examples/)'
authors: ["Nathaniel Stickman"]
---

One of the most commonly-used commands on Linux is the *ping* command, used most often to test network connections and troubleshoot connectivity issues. It comes by default on most Linux distributions, making it accessible.

You may even have used *ping* or seen it used, supplying the command with a hostname or IP address and seeing it go to work.

But *ping* has numerous options, giving it a wide range of capabilities and testing and troubleshooting scenarios to cover.

This guide introduces you to *ping* in all its variety. In this guide, you can learn everything from the basics of the *ping* command to options that give you fine-grained control of network tests.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

        ```command
        sudo apt update && sudo apt upgrade
        ```

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

        ```command
        sudo dnf upgrade
        ```

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Reading the Results of the ping Command

Before starting in on how to use *ping*, it can be helpful to know how *ping* displays results. To get your footing with that, look into an example *ping* command that sends one packet to the `localhost` as follows:

```command
ping -c 1 localhost
```

```output
PING localhost(localhost (::1)) 56 data bytes
64 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.113 ms

--- localhost ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.113/0.113/0.113/0.000 ms
```

The line beginning `64 bytes` indicates a packet. There may be several of these depending on the command parameters, and these lines can give you the most insights on the *ping* instance.

Here, that line is broken down to show the role each part plays. You can use the explanation as a basis to effectively interpret similar lines for your *ping* commands.

- `64 bytes` shows the number of bytes in the packet. The default is 56 (seen in the first line of output), which translates to 64 bytes for the ICMP protocol used by *ping*.

- `from localhost (::1)` shows the destination host. You can see that this also resolves the given hostname (`localhost`) into its IP address.

- `icmp_seq=1` shows the ICMP sequence number for each packet. This starts at `1` and increases by one for each packet sent in a *ping* instance. So, if this example had sent four packets instead of one, you could expect `icmp_seq=1`, `icmp_seq=2`, `icmp_seq=3`, and `icmp_seq=4`.

- `ttl=64` indicates the "time to live" for the packet, which is the number of network "hops" the packet can make before it expires.

- `time=0.113 ms` shows the amount of time the ping action took. This is often the most important piece of information, as it helps you determine how the efficiency of the packet communication.

At the end of each *ping* instance, you receive a set of summary statistics, beginning with `localhost ping statistics` in the example above. These statistics indicate packet transmission and loss as well as round-trip time (`rtt`) statistics for the sent packets. The summaries can be especially useful when you want overall impressions from *ping* instances that have numerous packets.

## Basics of the ping Command

In the next several sections, you can learn how to conduct basic *ping* operations, from pinging a host to fine-tuning how your pings work. This section also answers your questions on how *ping* handles ports and how to use *ping* for resolving hostnames to IP addresses.

### Ping a Hostname

The *ping* command at its simplest just takes a hostname or a host IP address as an argument. It then details if the host is reachable from your computer or server.

To get a ping of the `localhost`, you can use the hostname:

```command
ping localhost
```

```output
PING localhost(localhost (::1)) 56 data bytes
64 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.117 ms
64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.079 ms
64 bytes from localhost (::1): icmp_seq=3 ttl=64 time=0.109 ms
64 bytes from localhost (::1): icmp_seq=4 ttl=64 time=0.135 ms
64 bytes from localhost (::1): icmp_seq=5 ttl=64 time=0.118 ms

--- localhost ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4077ms
rtt min/avg/max/mdev = 0.079/0.111/0.135/0.021 ms
```

The *ping* command keeps running until you manually stop it. You can manually stop it from sending packets using the *Ctrl* + *C* key combination. There are also a few options, covered further on, that designate endpoints for *ping*, causing it to automatically stop at predetermined points.

### Ping an IP Address

The same method can be used for IP addresses. Just replace the hostname with the host's IP address. For the example above, you could use `127.0.0.1` instead of `localhost`:

```command
ping 127.0.0.1
```

```output
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.127 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.136 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.127 ms
--- 127.0.0.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2042ms
rtt min/avg/max/mdev = 0.127/0.130/0.136/0.004 ms
```

### Ping a Specific Port

The *ping* command does not allow for the specification of a port to ping. And, further, *ping* does not even operate on a specific port.

This is because *ping* uses the ICMP protocol. Unlike the TCP and UDP protocols, ICMP does not regard ports.

### Resolve a Hostname

With the *ping* command, any input hostname is automatically resolved, rendering the associated IP address. You can see this in the first line of output from *ping* instances.

Take a look at this example. It pings the `google.com` hostname, and, in the first line of output, you can see that the hostname has been resolved to an IP address:

```command
ping google.com
```

```output
PING google.com(atl14s08-in-x0e.1e100.net (2607:f8b0:4002:818::200e)) 56 data bytes
[...]
```

The IP address above is IPv6, the default in *ping*. You can learn more about this option below, but *ping* also supports displaying IP addresses in the IPv4 format:

```command
ping -4 google.com
```

```output
PING google.com (142.250.177.14) 56(84) bytes of data.
[...]
```

### Options for Fine-tuning

The *ping* command has numerous options to control how pings operate and how results display. You can see more of these in the [Advanced Options for the ping Command](#advanced-options-for-the-ping-command) and [Display Options for the ping Command](#display-options-for-the-ping-command) sections below.

The options covered in this section are ones that you may find more generally useful. They are options that you may find yourself more frequently using to make the *ping* command perform how you would like.

- IP formatting can be either IPv4 or IPv6. The *ping* command defaults to IPv6 on most Linux distributions. But you can explicitly indicate which format you want *ping* to use with the `-4` option for IPv4 and the `-6` option for IPv6:

    ```command
    ping -4 localhost
    ```

    ```output
    PING localhost (127.0.0.1) 56(84) bytes of data.
    64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.126 ms
    64 bytes from localhost (127.0.0.1): icmp_seq=2 ttl=64 time=0.123 ms
    64 bytes from localhost (127.0.0.1): icmp_seq=3 ttl=64 time=0.104 ms
    [...]
    ```

    {{< note >}}
On some Unix systems, *ping* does not include these options. Instead, *ping* may default to IPv4 and come with the *ping6* command installed alongside. The *ping6* command can then be used for IPv6 formatting.
    {{< /note >}}

- Set the number of packets to be sent by *ping* using the `-c` option. This option causes *ping* to automatically stop once it has sent the specified number of packets, rather than continuing until stopped manually with *Ctrl* + *C*:

    ```command
    ping -c 5 localhost
    ```

    ```output
    PING localhost(localhost (::1)) 56 data bytes
    64 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.083 ms
    64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.083 ms
    64 bytes from localhost (::1): icmp_seq=3 ttl=64 time=0.120 ms
    64 bytes from localhost (::1): icmp_seq=4 ttl=64 time=0.110 ms
    64 bytes from localhost (::1): icmp_seq=5 ttl=64 time=0.112 ms

    --- localhost ping statistics ---
    5 packets transmitted, 5 received, 0% packet loss, time 4091ms
    rtt min/avg/max/mdev = 0.083/0.101/0.120/0.019 ms
    ```

- Apply a time limit to the *ping* command using the `-w` option. This option takes a number of seconds as an argument. And, similar to the `-c` option, this option causes *ping* to automatically stop once the given amount of time has passed:

    ```command
    ping -w 5 localhost
    ```

    ```output
    PING localhost(localhost (::1)) 56 data bytes
    64 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.131 ms
    64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.117 ms
    64 bytes from localhost (::1): icmp_seq=3 ttl=64 time=0.134 ms
    64 bytes from localhost (::1): icmp_seq=4 ttl=64 time=0.122 ms
    64 bytes from localhost (::1): icmp_seq=5 ttl=64 time=0.120 ms

    --- localhost ping statistics ---
    5 packets transmitted, 5 received, 0% packet loss, time 4132ms
    rtt min/avg/max/mdev = 0.117/0.124/0.134/0.015 ms
    ```

    {{< note >}}
The `-w` option may not be available for *ping* on some Unix distributions.
    {{< /note >}}

## Advanced Options for the ping Command

The options for the *ping* command covered in this section fit more advanced use cases. They give you even finer-grained control of *ping* for when you need, for instance, to test a network under specific circumstances.

- Specify a network interface for *ping* to use via the `-I` option, which takes the interface name as an argument. By default, the *ping* command operates on your system's default network interface. This option allows you to explicitly specify an interface on systems that have multiple.

    This example assumes, for instance, that your system has a network interface called `em2` and causes *ping* to operate through that interface instead of the default:

    ```command
    ping -I em2 localhost
    ```

- Control the interval between pings using the `-i` option. The option takes a number of seconds, including fractions (via floating-point numbers). The *ping* command then sends packets at the designated intervals. By default, the interval is `1`, meaning that *ping* sends one packet per second:

    ```command
    ping -i 0.5 localhost
    ```

- Adjust the size of packets sent by *ping* using the `-s` option. The option takes a number of bytes as its argument. The *ping* command defaults packet size to 56 bytes, which translates to 64 bytes in the ICMP protocol:

    ```command
    ping -s 256 localhost
    ```

    ```outpout
    PING localhost(localhost (::1)) 256 data bytes
    264 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.119 ms
    [...]
    ```

- Flood a network with hundreds of ping requests using the `-f` option. This is a useful option for testing network performance under a heavy load. Be aware that this option requires you to run *ping* as the root user or use `sudo`:

    ```command
    sudo ping -f localhost
    ```

## Display Options for the ping Command

This section covers a few more useful options for the *ping* command. The options here are useful when you want to control the way that *ping* displays results rather than how it gets them.

- Limit the display to just the summary statistics by adding the `-q` option to the *ping* command. This option quiets the lines of packet information and just displays the lines of summary when the *ping* instance stops:

    ```command
    ping -q localhost
    ```

    ```output
    PING localhost(localhost (::1)) 56 data bytes

    --- localhost ping statistics ---
    3 packets transmitted, 3 received, 0% packet loss, time 2076ms
    rtt min/avg/max/mdev = 0.113/0.122/0.129/0.014 ms
    ```

    The `-q` option can be helpful when sending many packets and wanting only the statistics of their overall performance.

- Add timestamps to the beginning of each packet line by adding the `-D` option to your *ping* command. With this option, each line giving packet information begins with a Unix timestamp representing the time of the packet's complete transmission.

    ```command
    ping -D localhost
    ```

    ```output
    PING localhost(localhost (::1)) 56 data bytes
    [1655740627.544608] 64 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.146 ms
    [1655740628.593346] 64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.125 ms
    [1655740629.617371] 64 bytes from localhost (::1): icmp_seq=3 ttl=64 time=0.117 ms
    [...]
    ```

- Have *ping* deliver an audible ping effect when receiving a response from the host by using the `-a` option. More than just a preference, such an option can be useful when pinging hosts that are taking a long time to respond. The option allows you to look away and still be alerted when the host has been reached.

    ```command
    ping -a localhost
    ```

## Conclusion

This guide has given an in-depth look at the Linux *ping* command and some of the most useful options it has to offer. With this, you have the tools you need not only to start using the *ping* command on your Linux system. You also have tools to make the most of it, tools for tuning your network tests more precisely to your needs.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
