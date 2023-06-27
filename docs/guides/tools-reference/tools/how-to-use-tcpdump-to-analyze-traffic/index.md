---
slug: how-to-use-tcpdump-to-analyze-traffic
description: "The tcpdump tool gives you powerful options for capturing and analyzing traffic on your network. Network sniffing tools like tcpdump are helpful for troubleshooting network issues and testing network security. Learn how to start using tcpdump in this tutorial, including everything from capturing and analyzing network packets to advanced options for filtering them."
keywords: ['tcpdump examples','tcpdump linux','tcpdump network traffic']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-28
modified: 2023-03-29
modified_by:
  name: Nathaniel Stickman
title: "Use tcpdump to Analyze Network Traffic"
title_meta: "How to Use tcpdump to Analyze Network Traffic"
external_resources:
- '[TCPDUMP & LIBPCAP](https://www.tcpdump.org/)'
- "[Julia Evans: Let's Learn tcpdump](https://jvns.ca/tcpdump-zine.pdf)"
- '[Geekflare: How to Capture and Analyze Network Traffic with tcpdump?](https://geekflare.com/tcpdump-examples/)'
- '[Linux Hint: A Guide to Network Traffic Analysis Utility: TCPDUMP](https://linuxhint.com/tcpdump-beginner-guide/)'
authors: ["Nathaniel Stickman"]
---

The *tcpdump* tool provides a powerful command line option for network sniffing. With *tcpdump*, you can effectively capture and analyze network traffic, whether to diagnose network issues or to test network security.

In this tutorial, learn how to get started sniffing network traffic with *tcpdump*. See how to install *tcpdump*, how to read its output, and how to use it to capture and filter network packets.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Update your system:

    ```command {title="Debian / Ubuntu"}
    sudo apt update && sudo apt upgrade
    ```

    ```command {title="AlmaLinux / CentOS Stream / Fedora / Rocky Linux"}
    sudo dnf upgrade
    ```

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install tcpdump

The most straightforward way to install *tcpdump* is via your Linux system's package manager. Fortunately, *tcpdump* is available by default on most Linux distributions.

```command {title="Debian / Ubuntu"}
sudo apt install tcpdump
```

```command {title="AlmaLinux / CentOS Stream / Fedora / Rocky Linux"}
sudo dnf install tcpdump
```

You can verify your installation using the command below:

```command
sudo tcpdump --version
```

The command's output may vary, but it should be similar to what you see here:

```output
tcpdump version 4.9.3
libpcap version 1.9.1 (with TPACKET_V3)
OpenSSL 1.1.1k  FIPS 25 Mar 2021
```

## How to Interpret tcpdump Output

Before getting started using *tcpdump*, it can be useful to familiarize yourself with how *tcpdump* displays packets. In *tcpdump*, each line corresponds to a single packet, displayed in distinct sections. Here is an example from later on in this tutorial:

```output
20:26:16.902555 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 2957537435:2957537583, ack 850702985, win 1432, options [nop,nop,TS val 1668387813 ecr 3505486606], length 148
```

Each packet's display breaks down like this, using the example above as a guide:

-   `20:26:16.902555` is the Unix timestamp, representing when the packet was sent. Refer to the [How to Use Advanced Display Options with tcpdump](#how-to-use-advanced-display-options-with-tcpdump) section further on to see how you can display more human-readable timestamps instead.

-   `IP` is the network protocol. In this case, the packet is a TCP packet, which show up under the `IP` designation. An ICMP packet, by contrast, would show `ICMP` here.

-   `example.hostname-one.com.ssh > example.hostname-two.com.64024` are the source and destination hostnames. The source is before the `>` symbol, and the destination is after.

    The last entry on each host above, `.ssh` for the source and `.64024` for the destination, is the port.

    Refer to the [How to Use Advanced Display Options with tcpdump](#how-to-use-advanced-display-options-with-tcpdump) section below to see how to display host IP addresses instead of hostnames.

-   The rest is query information.

    In the above, `Flag` indicates the TCP flag. The flags for TCP packets can be any combination of the following. Most often, the flag field contains a combination of one of these letter designations and the `.` symbol (like the `P.` in the example above):

    -   `S` for SYN
    -   `F` for FIN
    -   `P` for PUSH
    -   `R` for RST
    -   `U` for URG
    -   `W` for ECN CWR
    -   `E` for ECN-Echo
    -   `.` for ACK
    -   No flag, indicating that no flag is set for the packet

    Explanations of each flag can be found in the Wikipedia [page on TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_segment_structure).

    DNS queries, by contrast, replace the `Flag` portion with the DNS query ID, something like `44000+`.

## How to Start Reading Network Traffic with tcpdump

These next sections show you how to get started using *tcpdump* for capturing and analyzing network traffic.

The example commands and output in these sections use `example.hostname-one.com` (also as `192.0.2.0`) and `example.hostname-two.com` (also as `198.51.100.0`) for hosts throughout this tutorial. Replace these with your own relevant hostnames/IP addresses when reproducing these examples.

### Finding Interfaces

*tcpdump* can provide a list of available network interfaces on your Linux system. In the next sections, these can be used to determine where you want to listen for packets.

To get a list of available interfaces, use the *tcpdump* command with the `-D` option:

```command
sudo tcpdump -D
```

```output
1.eth0 [Up, Running]
2.lo [Up, Running, Loopback]
3.any (Pseudo-device that captures on all interfaces) [Up, Running]
4.bluetooth-monitor (Bluetooth Linux Monitor) [none]
5.nflog (Linux netfilter log (NFLOG) interface) [none]
6.nfqueue (Linux netfilter queue (NFQUEUE) interface) [none]
7.usbmon0 (Raw USB traffic, all USB buses) [none]
```

### Capturing Packets

You can begin capturing packets by simply executing the *tcpdump* command. By default, the command uses the lowest-numbered interface, which you can see from the command above would be `eth0`. However, it can be good practice to explicitly provide the interface, which you can accomplish with the `-i` option.

```command
sudo tcpdump -i eth0
```

```output
dropped privs to tcpdump
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
16:45:52.001714 IP example.hostname-one.com.ssh > example.hostname-two.com.49165: Flags [P.], seq 1317852016:1317852228, ack 2902976470, win 317, options [nop,nop,TS val 1605028389 ecr 2281811401], length 212
16:45:52.002503 IP example.hostname-one.com.47687 > resolver08.atlanta.linode.com.domain: 65233+ PTR? 173.174.209.73.in-addr.arpa. (45)
16:45:52.033269 IP example.hostname-two.com.49165 > example.hostname-one.com.ssh: Flags [.], ack 212, win 2044, options [nop,nop,TS val 2281811472 ecr 1605028389], length 0
16:45:52.118992 IP resolver08.atlanta.linode.com.domain > example.hostname-one.com.47687: 65233 2/0/0 PTR example.hostname-two.com., PTR example.hostname-two.com. (134)
16:45:52.119259 IP example.hostname-one.com.48245 > resolver08.atlanta.linode.com.domain: 43515+ PTR? 148.150.187.170.in-addr.arpa. (46)
[...]
```

You can stop capturing packets using the *Ctrl* + *C* key combination. And, as you may notice, the output from *tcpdump* can accumulate quickly. This is especially the case for broad, unfiltered searches like the one above.

You can make the output more manageable for the purposes of getting to know *tcpdump* by using the `-c` option. This option allows you to set a number of lines (packets) of output:

```command
sudo tcpdump -i eth0 -c 5
```

```output
dropped privs to tcpdump
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
19:45:50.085053 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 2957513879:2957513939, ack 850693945, win 1432, options [nop,nop,TS val 1665960996 ecr 3503059910], length 60
19:45:50.086314 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 60:176, ack 1, win 1432, options [nop,nop,TS val 1665960997 ecr 3503059910], length 116
19:45:50.086463 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 176:292, ack 1, win 1432, options [nop,nop,TS val 1665960997 ecr 3503059910], length 116
19:45:50.086859 IP example.hostname-one.com.53728 > resolver06.atlanta.linode.com.domain: 43700+ PTR? 173.174.209.73.in-addr.arpa. (45)
19:45:50.087197 IP resolver06.atlanta.linode.com.domain > example.hostname-one.com.53728: 43700 2/0/0 PTR example.hostname-two.com., PTR example.hostname-two.com. (134)
5 packets captured
12 packets received by filter
0 packets dropped by kernel
```

*tcpdump* also gives you the option of capturing packets on all available interfaces, by specifying `any` as the interface. Doing so lets you cast an even wider net when observing network traffic:

```command
sudo tcpdump -i any
```

### Applying Filters

By itself, *tcpdump* produces a lot of output. It can accumulate quickly, making it difficult to find what you are looking for. That is why, most of the time, you are likely to want to use *tcpdump* with specific filters. These allow you to limit the captured packets based on certain criteria, keeping out many of the results that you do not need.

Here, you can see the primary filtering options available in *tcpdump*. In the next section, you can also see how to combine filters and use negative filters, allowing you to even further refine your packet capturing.

-   Port filtering can be accomplished using the `port` option followed by a specific port you want to observe network traffic on:

    ```command
    sudo tcpdump -i eth0 -c 1 port 80
    ```

    ```output
    dropped privs to tcpdump
    tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
    listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
    20:12:53.530741 IP example.hostname-two.com.64251 > example.hostname-one.com.http: Flags [S], seq 3536229667, win 65535, options [mss 1460,nop,wscale 6,nop,nop,TS val 2559116808 ecr 0,sackOK,eol], length 0
    1 packet captured
    1 packet received by filter
    0 packets dropped by kernel
    ```

-   Host filtering can be accomplished using the `host` option followed by the IP address for a host you want to observe network traffic for:

    ```command
    sudo tcpdump -i eth0 -c 5 host 170.187.150.148
    ```

    ```output
    dropped privs to tcpdump
    tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
    listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
    20:20:18.850561 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 2957531627:2957531743, ack 850700453, win 1432, options [nop,nop,TS val 1668029761 ecr 3505128549], length 116
    20:20:18.850695 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 116:232, ack 1, win 1432, options [nop,nop,TS val 1668029761 ecr 3505128549], length 116
    20:20:18.851206 IP example.hostname-one.com.43356 > resolver06.atlanta.linode.com.domain: 55916+ PTR? 173.174.209.73.in-addr.arpa. (45)
    20:20:18.851759 IP resolver06.atlanta.linode.com.domain > example.hostname-one.com.43356: 55916 2/0/0 PTR example.hostname-two.com., PTR example.hostname-two.com. (134)
    20:20:18.852052 IP example.hostname-one.com.54556 > resolver06.atlanta.linode.com.domain: 9603+ PTR? 148.150.187.170.in-addr.arpa. (46)
    5 packets captured
    10 packets received by filter
    0 packets dropped by kernel
    ```

-   Protocol filtering can be used to narrow results to only a given protocol type. You can accomplish this by simply appending the protocol designation to the *tcpdump* command:

    ```command
    sudo tcpdump -i eth0 -c 5 icmp
    ```

    ```output
    dropped privs to tcpdump
    tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
    listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
    20:21:13.452381 IP example.hostname-one.com > zg-0421d-148.stretchoid.com: ICMP host example.hostname-one.com unreachable - admin prohibited filter, length 48
    20:21:18.979723 IP example.hostname-one.com > 45.155.204.63: ICMP host example.hostname-one.com unreachable - admin prohibited filter, length 48
    20:21:32.953615 IP example.hostname-one.com > 45.143.203.88: ICMP host example.hostname-one.com unreachable - admin prohibited filter, length 48
    20:21:36.452595 IP ec2-54-197-15-194.compute-1.amazonaws.com > example.hostname-one.com: ICMP echo request, id 6, seq 10080, length 16
    20:21:36.452732 IP example.hostname-one.com > ec2-54-197-15-194.compute-1.amazonaws.com: ICMP echo reply, id 6, seq 10080, length 16
    5 packets captured
    5 packets received by filter
    0 packets dropped by kernel
    ```

### Combining Filters

Filters can be made even more effective by combining them using the logical operators `and`, `or`, and `not`. Here's an example that combines the host and port options:

```command
sudo tcpdump -i eth0 -c 5 host 192.0.2.0 and port 80
```

The `not` operator can be used on its own as well:

```command
sudo tcpdump -i eth0 -c 5 not port 80
```

### Saving Results

Often, the results from *tcpdump* are extensive, and sometimes you may want to save the results for deeper analysis at a later time. For that, you can use the *tcpdump* feature for saving results to a file.

This uses the `-w` option followed by the name of the file to save the results to:

```command
sudo tcpdump -i eth0 -c 5 -w example-packet-dump.pcap
```

You can then read the results again right in *tcpdump*, using the `-r` option:

```command
sudo tcpdump -r example-packet-dump.pcap
```

```output
reading from file example-packet-dump.pcap, link-type EN10MB (Ethernet)
dropped privs to tcpdump
20:26:16.902555 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 2957537435:2957537583, ack 850702985, win 1432, options [nop,nop,TS val 1668387813 ecr 3505486606], length 148
20:26:16.923433 IP 107.189.4.117.51676 > example.hostname-one.com.personal-agent: Flags [S], seq 46350988, win 65535, options [mss 536], length 0
20:26:16.923532 IP example.hostname-one.com > 107.189.4.117: ICMP host example.hostname-one.com unreachable - admin prohibited filter, length 52
20:26:16.932689 IP example.hostname-two.com.64024 > example.hostname-one.com.ssh: Flags [.], ack 148, win 65532, options [nop,nop,TS val 3505486685 ecr 1668387813], length 0
20:26:17.357029 IP6 example.hostname-one.com > ff02::16: HBH ICMP6, multicast listener report v2, 1 group record(s), length 28
```

## How to Use Advanced Display Options with tcpdump

*tcpdump* provides a number of options to control how results display. These range from making output easier to read to providing additional information about packets.

-   Use `-v` for verbose results, providing additional information for each packet. You can make the results even more verbose with `-vv`:

    ```command
    sudo tcpdump -i eth0 -c 5 -vv
    ```

    ```output
    dropped privs to tcpdump
    tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
    20:27:34.957840 IP (tos 0x48, ttl 64, id 13252, offset 0, flags [DF], proto TCP (6), length 200)
        example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], cksum 0x3a89 (incorrect -> 0xebae), seq 2957544691:2957544839, ack 850706093, win 1432, options [nop,nop,TS val 1668465868 ecr 3505564654], length 148
    20:27:34.958582 IP (tos 0x0, ttl 64, id 59922, offset 0, flags [DF], proto UDP (17), length 73)
        example.hostname-one.com.47790 > resolver06.atlanta.linode.com.domain: [bad udp cksum 0xbf7f -> 0x3f97!] 6992+ PTR? 173.174.209.73.in-addr.arpa. (45)
    20:27:34.958655 IP (tos 0x48, ttl 64, id 13253, offset 0, flags [DF], proto TCP (6), length 184)
        example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], cksum 0x3a79 (incorrect -> 0xa704), seq 148:280, ack 1, win 1432, options [nop,nop,TS val 1668465869 ecr 3505564654], length 132
    20:27:34.960232 IP (tos 0x0, ttl 59, id 23535, offset 0, flags [none], proto UDP (17), length 162)
        resolver06.atlanta.linode.com.domain > example.hostname-one.com.47790: [udp sum ok] 6992 q: PTR? 173.174.209.73.in-addr.arpa. 2/0/0 173.174.209.73.in-addr.arpa. PTR example.hostname-two.com., 173.174.209.73.in-addr.arpa. PTR example.hostname-two.com. (134)
    20:27:34.960494 IP (tos 0x0, ttl 64, id 59923, offset 0, flags [DF], proto UDP (17), length 74)
        example.hostname-one.com.53590 > resolver06.atlanta.linode.com.domain: [bad udp cksum 0xbf80 -> 0x2e92!] 17994+ PTR? 148.150.187.170.in-addr.arpa. (46)
    5 packets captured
    9 packets received by filter
    0 packets dropped by kernel
    ```

-   Sometimes results are easier to interpret when hostnames are rendered as IP addresses. Alternatively, rendering hostnames as IP addresses may be essential when DNS resolution is unavailable. In these cases, you can use the `-n` option. This option shows hosts by their IP addresses:

    ```command
    sudo tcpdump -i eth0 -n -c 5
    ```

    ```output
    dropped privs to tcpdump
    tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
    listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
    20:15:28.908978 IP6 fe80::f03c:92ff:fe4d:2fb0 > ff02::16: HBH ICMP6, multicast listener report v2, 1 group record(s), length 28
    20:15:28.918797 IP 192.0.2.0.ssh > 198.51.100.0.64024: Flags [P.], seq 2957522283:2957522471, ack 850697205, win 1432, options [nop,nop,TS val 1667739829 ecr 3504838648], length 188
    20:15:28.918915 IP 192.0.2.0.ssh > 198.51.100.0.64024: Flags [P.], seq 188:352, ack 1, win 1432, options [nop,nop,TS val 1667739829 ecr 3504838648], length 164
    20:15:28.919162 IP 192.0.2.0.ssh > 198.51.100.0.64024: Flags [P.], seq 352:748, ack 1, win 1432, options [nop,nop,TS val 1667739830 ecr 3504838648], length 396
    20:15:28.919278 IP 192.0.2.0.ssh > 198.51.100.0.64024: Flags [P.], seq 748:952, ack 1, win 1432, options [nop,nop,TS val 1667739830 ecr 3504838648], length 204
    5 packets captured
    6 packets received by filter
    0 packets dropped by kernel
    ```

-   To get more human-readable timestamps, as opposed to the default Unix-formatted timestamps, you can use the `-tttt` option:

    ```command
    sudo tcpdump -i eth0 -c 5 -tttt
    ```

    ```output
    dropped privs to tcpdump
    tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
    listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
    2022-06-09 20:28:27.636762 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 2957547039:2957547099, ack 850706389, win 1432, options [nop,nop,TS val 1668518547 ecr 3505617361], length 60
    2022-06-09 20:28:27.636812 IP example.hostname-one.com.ssh > example.hostname-two.com.64024: Flags [P.], seq 60:248, ack 1, win 1432, options [nop,nop,TS val 1668518547 ecr 3505617361], length 188
    2022-06-09 20:28:27.637105 IP example.hostname-one.com.35506 > resolver06.atlanta.linode.com.domain: 17406+ PTR? 173.174.209.73.in-addr.arpa. (45)
    2022-06-09 20:28:27.638663 IP resolver06.atlanta.linode.com.domain > example.hostname-one.com.35506: 17406 2/0/0 PTR example.hostname-two.com., PTR example.hostname-two.com. (134)
    2022-06-09 20:28:27.638766 IP example.hostname-one.com.33127 > resolver06.atlanta.linode.com.domain: 13406+ PTR? 148.150.187.170.in-addr.arpa. (46)
    5 packets captured
    11 packets received by filter
    0 packets dropped by kernel
    ```

## Conclusion

With that, you have a basis to start using *tcpdump* to capture and analyze traffic on your system's network. Building on the examples shown in this tutorial, you can effectively monitor traffic for issues or sniff packets to verify security.

To further enhance your *tcpdump* usage, take a look at the official [*tcpdump* man pages](https://www.tcpdump.org/manpages/tcpdump.1.html) for a full account of the available command line options.