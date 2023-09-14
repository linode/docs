---
slug: diagnosing-network-issues-with-mtr
description: MTR is a network diagnostic tool similar to ping and traceroute. This guide shows how to create and interpret MTR reports on your Linode or home computer.
keywords: ["mtr", "traceroute", "latency", "loss"]
tags: ["monitoring","resolving","networking","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/networking/diagnostics/diagnosing-network-issues-with-mtr/','/linux-tools/mtr/','/networking/diagnosing-network-issues-with-mtr/','/troubleshooting/interpreting-mtr-reports/']
modified: 2018-05-10
modified_by:
  name: Linode
published: 2010-04-28
title: Diagnosing Network Issues with MTR
external_resources:
 - '[Understanding the Traceroute Command - Cisco Systems](http://www.cisco.com/en/US/products/sw/iosswrel/ps1831/products_tech_note09186a00800a6057.shtml#traceroute)'
 - '[Wikipedia article on traceroute](http://en.wikipedia.org/wiki/Trace_route)'
 - '[Traceroute by Exit109.com](http://www.exit109.com/~jeremy/news/providers/traceroute.html)'
authors: ["Brett Kaplan"]
---

![Diagnosing Network Issues with MTR](diagnosing-network-issues-with-mtr.png)

[MTR](http://www.bitwizard.nl/mtr/) is a powerful tool that enables administrators to diagnose and isolate networking errors and provide reports of network status to upstream providers. MTR represents an evolution of the `traceroute` command by providing a greater data sample as if augmenting `traceroute` with `ping` output. This document provides an in-depth overview of MTR, the data it generates, and how to interpret and draw conclusions based on the data provided by it.

For a basic overview of network diagnostic techniques, see our introduction to [network diagnostics](/docs/guides/linux-system-administration-basics/#network-diagnostics). If you are having general issues with your system, read our overview of general [system diagnostics](/docs/guides/linux-system-administration-basics/#system-diagnostics).

## Network Diagnostics Background

Networking diagnostic tools including `ping`, `traceroute`, and `mtr` use Internet Control Message Protocol (ICMP) packets to test contention and traffic between two points on the Internet. When a user pings a host on the Internet, a series of ICMP packets are sent to the host which in turn responds by sending reply packets. The user's client is then able to compute the round trip time between two points on the Internet.

In contrast, tools such as traceroute and MTR send ICMP packets with incrementally increasing TTLs in order to view the route or series of hops that the packet makes between the origin and its destination. The TTL, or time to live, controls how many hops a packet will make before "dying" and returning to the host. By sending a series of packets and causing them to return after one hop, then two, then three, MTR is able to assemble the route that traffic takes between hosts on the Internet.

Rather than provide a simple outline of the route that traffic takes across the Internet, MTR collects additional information regarding the state, connection, and responsiveness of the intermediate hosts. Because of this additional information, MTR can provide a complete overview of the connection between two hosts on the Internet. The following sections outline how to install the MTR software and how to interpret the results provided by this tool.

## Install MTR

### Linux

**Debian/Ubuntu**

    apt update && apt upgrade
    apt install mtr-tiny

**CentOS/RHEL/Fedora**

    yum update
    yum install mtr

### Windows

For Windows, there is a port of MTR called "WinMTR". You can download this application from the [WinMTR upstream](https://sourceforge.net/projects/winmtr/).

### macOS

Install MTR on macOS with either [Homebrew](http://brew.sh/) or [MacPorts](http://www.macports.org/). To install MTR with Homebrew, run:

    brew install mtr

To install MTR with MacPorts, run:

    port install mtr

## Generate an MTR Report

Because MTR provides an image of the route traffic takes from one host to another, it is essentially a directional tool. The route taken between two points on the Internet can vary a great deal based on location and the routers that are located upstream. For this reason, it is a good idea to collect MTR reports in both directions for all hosts that are experiencing connectivity issues.

Linode Customer Support will often request MTR reports both **to** and **from** your Linode if you are experiencing networking issues. This is because, from time to time, MTR reports will not detect errors from one direction when there is still packet loss from the opposite direction.

When referring to MTR reports, this document refers to the host running `mtr` as the **source host** and the host targeted by the query as the **destination host**.

### Use MTR on Unix-based Systems

Generate MTR reports using the following syntax:

    mtr -rw [destination_host]

For example, to test the route and connection quality of traffic to the destination host `example.com`:

    mtr -rw example.com

An MTR report to your Linode can be run from your local computer. Replace `192.0.2.0` with the IP address of your Linode:

    mtr -rw 192.0.2.0

SSH into your Linode and collect an MTR report from your Linode to your home network. Replace `198.51.100.0` with the IP address of your home network.

    mtr -rw 198.51.100.0

 If you don't know your home IP address, use [WhatIsMyIP.com](http://whatismyip.com/).

If no packet loss is detected, a support technician may ask you to run a faster interval:

    mtr -rwc 50 -rw 198.51.100.0

On some systems, using this flag may require administrative privileges:

    sudo mtr -rwc 50 -rw 198.51.100.0

{{< note respectIndent=false >}}
The `r` option flag generates the report (short for `--report`).

The `w` option flag uses the long-version of the hostname so our technicians and you can see the full hostname of each hop (short for `--report-wide`).

The `c` option flag sets how many packets are sent and recorded in the report. When not used, the default will generally be 10, but, for faster intervals, you may want to set it to 50 or 100. The report can take longer to finish when doing this.
{{< /note >}}

### Use MTR on Windows Systems

Running MTR on Windows uses a GUI. Open WinMTR, type the destination host in the box as prompted, and select the start option to begin generating report data. You'll need to use the Linux version of MTR as shown above to generate the MTR report from your Linode.

## Read MTR Reports

Because MTR reports contain a great deal of information, they can be difficult to interpret at first. The following example is a report from a local connection to `google.com`:

{{< output >}}
$ mtr --report google.com
HOST:  example                       Loss%    Snt   Last   Avg  Best  Wrst  StDev
    1. inner-cake                     0.0%    10    2.8   2.1   1.9   2.8   0.3
    2. outer-cake                     0.0%    10    3.2   2.6   2.4   3.2   0.3
    3. 68.85.118.13                   0.0%    10    9.8  12.2   8.7  18.2   3.0
    4. po-20-ar01.absecon.nj.panjde   0.0%    10   10.2  10.4   8.9  14.2   1.6
    5. be-30-crs01.audubon.nj.panjd   0.0%    10   10.8  12.2  10.1  16.6   1.7
    6. pos-0-12-0-0-ar01.plainfield   0.0%    10   13.4  14.6  12.6  21.6   2.6
    7. pos-0-6-0-0-cr01.newyork.ny.   0.0%    10   15.2  15.3  13.9  18.2   1.3
    8. pos-0-4-0-0-pe01.111eighthav   0.0%    10   16.5  16.2  14.5  19.3   1.3
    9. as15169-3.111eighthave.ny.ib   0.0%    10   16.0  17.1  14.2  27.7   3.9
   10. 72.14.238.232                  0.0%    10   19.1  22.0  13.9  43.3  11.1
   11. 209.85.241.148                 0.0%    10   15.1  16.2  14.8  20.2   1.6
   12. lga15s02-in-f104.1e100.net     0.0%    10   15.6  16.9  15.2  20.6   1.7
{{</ output >}}

The report was generated with `mtr --report google.com`. This uses the `report` option, which sends 10 packets to the host `google.com` and generates a report. Without the `--report` option, `mtr` will run continuously in an interactive environment. The interactive mode reflects current round trip times to each host. In most cases, the `--report` mode provides sufficient data in a useful format.

Each numbered line in the report represents a **hop**. Hops are the Internet nodes that packets pass through to get to their destination. The names for the hosts (e.g. "inner-cake" and "outer-cake" in the example) are determined by reverse DNS lookups. If you want to omit the rDNS lookups you can use the `--no-dns` option, which produces output similar to the following:

{{< output >}}
% mtr --no-dns --report google.com
HOST:  deleuze                       Loss%   Snt   Last  Avg  Best  Wrst   StDev
    1. 192.168.1.1                   0.0%    10    2.2   2.2   2.0   2.7   0.2
    2. 68.85.118.13                  0.0%    10    8.6  11.0   8.4  17.8   3.0
    3. 68.86.210.126                 0.0%    10    9.1  12.1   8.5  24.3   5.2
    4. 68.86.208.22                  0.0%    10   12.2  15.1  11.7  23.4   4.4
    5. 68.85.192.86                  0.0%    10   17.2  14.8  13.2  17.2   1.3
    6. 68.86.90.25                   0.0%    10   14.2  16.4  14.2  20.3   1.9
    7. 68.86.86.194                  0.0%    10   17.6  16.8  15.5  18.1   0.9
    8. 75.149.230.194                0.0%    10   15.0  20.1  15.0  33.8   5.6
    9. 72.14.238.232                 0.0%    10   15.6  18.7  14.1  32.8   5.9
   10. 209.85.241.148                0.0%    10   16.3  16.9  14.7  21.2   2.2
   11. 66.249.91.104                 0.0%    10   22.2  18.6  14.2  36.0   6.5
{{</ output >}}

Beyond simply seeing the path between servers that packets take to reach their host, MTR provides valuable statistics regarding the durability of that connection in the seven columns that follow. The `Loss%` column shows the percentage of packet loss at each hop. The `Snt` column counts the number of packets sent. The `--report` option will send 10 packets unless specified with `--report-cycles=[number-of-packets]`, where `[number-of-packets]` represents the total number of packets that you want to send to the remote host.

The next four columns `Last`, `Avg`, `Best`, and `Wrst` are all measurements of latency in milliseconds (e.g. `ms`). `Last` is the latency of the last packet sent, `Avg` is the average latency of all packets, while `Best` and `Wrst` display the best (shortest) and worst (longest) round trip time for a packet to this host. In most cases, the average (`Avg`) column should be the focus of your attention.

The final column, `StDev`, provides the standard deviation of the latencies to each host. The higher the standard deviation, the greater the difference is between measurements of latency. Standard deviation allows you to assess if the mean (average) provided represents the true center of the data set, or has been skewed by some sort of phenomena or measurement error. If the standard deviation is high, the latency measurements were inconsistent. After averaging the latencies of the 10 packets sent, the average looks normal but may in fact not represent the data very well. If the standard deviation is high, take a look at the best and worst latency measurements to make sure the average is a good representation of the actual latency and not the result of too much fluctuation.

In most circumstances, you may think of the MTR output in three major sections. Depending on configurations, the first 2 or 3 hops often represent the source host's ISP, while the last 2 or 3 hops represent the destination host's ISP. The hops in between are the routers the packet traverses to reach its destination.

For example, if MTR is run from your home PC to your Linode, the first 2 or 3 hops belong to your ISP. The last 3 hops belong to the data center where your Linode resides. Any hops in the middle are intermediate hops. When running MTR locally, if you see an abnormality in the first few hops near the source, contact your local service provider or investigate your local networking configuration. Conversely, if you see abnormalities near the destination you may want to contact the operator of the destination server or network support for that machine. Unfortunately, in cases where there are problems at the intermediate hops, both service providers will have limited ability to address the issue.

## Analyze MTR Reports

### Verify Packet Loss

When analyzing MTR output, you are looking for two things: loss and latency. If you see a percentage of loss at any particular hop, that may be an indication that there is a problem with that particular router. However, it is common practice among some service providers to rate limit the ICMP traffic that MTR uses. This can give the illusion of packet loss when there is in fact no loss. To determine if the loss you're seeing is real or due to rate limiting, take a look at the subsequent hop. If that hop shows a loss of 0.0%, then you are likely seeing ICMP rate limiting and not actual loss:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST: example                       Loss%   Snt   Last  Avg  Best  Wrst   StDev
   1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
   2. 63.247.64.157                50.0%    10    0.4   1.0   0.4   6.1   1.8
   3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
   4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
   5. 72.14.233.56                  0.0%    10    7.2   8.3   7.1  16.4   2.9
   6. 209.85.254.247                0.0%    10   39.1  39.4  39.1  39.7   0.2
   7. 64.233.174.46                 0.0%    10   39.6  40.4  39.4  46.9   2.3
   8. gw-in-f147.1e100.net          0.0%    10   39.6  40.5  39.5  46.7   2.2
{{</ output >}}

In this case, the loss reported between hops 1 and 2 is likely due to rate limiting on the second hop. Although traffic to the remaining eight hops all touch the second hop, there is no packet loss. If the loss continues for more than one hop, than it is possible that there is some packet loss or routing issues. Remember that rate limiting and loss can happen concurrently. In this case, take the lowest percentage of loss in a sequence as the actual loss:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST: localhost                      Loss%   Snt   Last  Avg  Best  Wrst   StDev
   1. 63.247.74.43                   0.0%    10    0.3   0.6   0.3   1.2   0.3
   2. 63.247.64.157                  0.0%    10    0.4   1.0   0.4   6.1   1.8
   3. 209.51.130.213                60.0%    10    0.8   2.7   0.8  19.0   5.7
   4. aix.pr1.atl.google.com        60.0%    10    6.7   6.8   6.7   6.9   0.1
   5. 72.14.233.56                  50.0%    10    7.2   8.3   7.1  16.4   2.9
   6. 209.85.254.247                40.0%    10   39.1  39.4  39.1  39.7   0.2
   7. 64.233.174.46                 40.0%    10   39.6  40.4  39.4  46.9   2.3
   8. gw-in-f147.1e100.net          40.0%    10   39.6  40.5  39.5  46.7   2.2
{{</ output >}}

In this case, there is 60% loss between hops 2 and 3 as well as between hops 3 and 4. You can assume that the third and fourth hop is likely losing some amount of traffic because no subsequent host reports zero loss. However, some of the loss is due to rate limiting as several of the final hops are only experiencing 40% loss. When different amounts of loss are reported, always trust the reports from later hops.

Some loss can also be explained by problems in the return route. Packets will reach their destination without error but have a hard time making the return trip. For this reason, it is often best to collect MTR reports in both directions when you're experiencing an issue.

Resist the temptation to investigate or report all incidences of packet loss in your connections. The Internet protocols are designed to be resilient to some network degradation, and the routes that data takes across the Internet can fluctuate in response to load, brief maintenance events, and other routing issues. If your MTR report shows small amounts of loss in the neighborhood of 10%, there is no cause for real concern as the application layer will compensate for the loss which is likely transient.

### Network Latency

In addition to helping you assess packet loss, MTR will also help assess the latency of a connection between your host and the target host. By virtue of physical constraints, latency always increases with the number of hops in a route. However, the increases should be consistent and linear. Unfortunately, latency is often relative and very dependent on the quality of both host's connections and their physical distance. When evaluating MTR reports for potentially problematic connections, consider earlier fully functional reports as context in addition to known connection speeds between other hosts in a given area.

The connection quality may also affect the amount of latency you experience for a particular route. Predictably, dial-up connections will have much higher latency than cable modem connections to the same destination. The following MTR report shows a high latency:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST: localhost                      Loss%   Snt   Last   Avg  Best  Wrst  StDev
    1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
    2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
    3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
    4. aix.pr1.atl.google.com        0.0%    10  388.0 360.4 342.1 396.7   0.2
    5. 72.14.233.56                  0.0%    10  390.6 360.4 342.1 396.7   0.2
    6. 209.85.254.247                0.0%    10  391.6 360.4 342.1 396.7   0.4
    7. 64.233.174.46                 0.0%    10  391.8 360.4 342.1 396.7   2.1
    8. gw-in-f147.1e100.net          0.0%    10  392.0 360.4 342.1 396.7   1.2
{{</ output >}}

The amount of latency jumps significantly between hops 3 and 4 and remains high. This may point to a network latency issue as round trip times remain high after the fourth hop. From this report, it is impossible to determine the cause although a saturated peering session, a poorly configured router, or a congested link are frequent causes.

Unfortunately, high latency does not always mean a problem with the current route. A report like the one above means that despite some sort of issue with the 4th hop, traffic is still reaching the destination host *and* returning to the source host. Latency could be caused by a problem with the return route as well. The return route will not be seen in your MTR report, and packets can take completely different routes to and from a particular destination.

In the above example, while there is a large jump in latency between hosts 3 and 4 the latency does not increase unusually in any subsequent hops. From this, it is logical to assume that there is some issue with the 4th router.

ICMP rate limiting can also create the appearance of latency, similar to the way that it can create the appearance of packet loss:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST:  localhost                     Loss%   Snt   Last  Avg  Best  Wrst   StDev
    1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
    2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
    3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
    4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
    5. 72.14.233.56                  0.0%    10  254.2 250.3 230.1 263.4   2.9
    6. 209.85.254.247                0.0%    10   39.1  39.4  39.1  39.7   0.2
    7. 64.233.174.46                 0.0%    10   39.6  40.4  39.4  46.9   2.3
    8. gw-in-f147.1e100.net          0.0%    10   39.6  40.5  39.5  46.7   2.2
{{</ output >}}

At first glance, the latency between hops 4 and 5 draws attention. However, after the fifth hop, the latency drops drastically. The actual latency measured here is about 40ms. In cases like this, MTR draws attention to an issue that does not affect the service. Consider the latency to the final hop when evaluating an MTR report.

## Common MTR Reports

Some networking issues are novel and require escalation to the operators of the upstream networks. However, there are a number of common MTR reports that describe common networking issues. If you're experiencing some sort of networking issue and want to diagnose your problem, consider the following examples.

### Destination Host Networking Improperly Configured

In the next example, it appears that there is 100% loss to the destination host because of an incorrectly configured router. At first glance, it appears that the packets are not reaching the host but this is not the case.

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST:  localhost                     Loss%   Snt   Last  Avg  Best  Wrst  StDev
    1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
    2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
    3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
    4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
    5. 72.14.233.56                  0.0%    10    7.2   8.3   7.1  16.4   2.9
    6. 209.85.254.247                0.0%    10   39.1  39.4  39.1  39.7   0.2
    7. 64.233.174.46                 0.0%    10   39.6  40.4  39.4  46.9   2.3
    8. gw-in-f147.1e100.net         100.0    10    0.0   0.0   0.0   0.0   0.0
{{</ output >}}

The traffic does reach the destination host. However, the MTR report shows loss because the destination host is not sending a reply. This may be the result of improperly configured networking or firewall (iptables) rules that cause the host to drop ICMP packets.

The way you can tell that the loss is due to a misconfigured host is to look at the hop which shows 100% loss. From previous reports, you see that this is the final hop and that MTR does not try additional hops. While it is difficult to isolate this issue without a baseline measurement, these kinds of errors are quite common.

### Residential or Business Router

Residential gateways sometimes cause misleading reports:

{{< output >}}
% mtr --no-dns --report google.com
HOST:  deleuze                       Loss%   Snt   Last  Avg  Best  Wrst  StDev
    1. 192.168.1.1                   0.0%    10    2.2   2.2   2.0   2.7   0.2
    2. ???                          100.0    10    8.6  11.0   8.4  17.8   3.0
    3. 68.86.210.126                 0.0%    10    9.1  12.1   8.5  24.3   5.2
    4. 68.86.208.22                  0.0%    10   12.2  15.1  11.7  23.4   4.4
    5. 68.85.192.86                  0.0%    10   17.2  14.8  13.2  17.2   1.3
    6. 68.86.90.25                   0.0%    10   14.2  16.4  14.2  20.3   1.9
    7. 68.86.86.194                  0.0%    10   17.6  16.8  15.5  18.1   0.9
    8. 75.149.230.194                0.0%    10   15.0  20.1  15.0  33.8   5.6
    9. 72.14.238.232                 0.0%    10   15.6  18.7  14.1  32.8   5.9
   10. 209.85.241.148                0.0%    10   16.3  16.9  14.7  21.2   2.2
   11. 66.249.91.104                 0.0%    10   22.2  18.6  14.2  36.0   6.5
{{</ output >}}

The 100% loss reported at the second hop does not indicate that there is a problem. You can see that there is no loss on subsequent hops.

### An ISP Router Is Not Configured Properly

Sometimes a router on the route your packet takes is incorrectly configured and your packets may never reach their destination:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST:  localhost                     Loss%   Snt   Last  Avg  Best  Wrst   StDev
    1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
    2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
    3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
    4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
    5. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
    6. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
    7. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
    8. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
    9. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
   10. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
{{</ output >}}

The question marks appear when there is no additional route information. Sometimes, a poorly configured router will send packets in a loop. You can see that in the following example:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST:  localhost                     Loss%   Snt   Last  Avg   Best  Wrst  StDev
    1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
    2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
    3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
    4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
    5. 12.34.56.79                   0.0%    10    0.0   0.0   0.0   0.0   0.0
    6. 12.34.56.78                   0.0%    10    0.0   0.0   0.0   0.0   0.0
    7. 12.34.56.79                   0.0%    10    0.0   0.0   0.0   0.0   0.0
    8. 12.34.56.78                   0.0%    10    0.0   0.0   0.0   0.0   0.0
    9. 12.34.56.79                   0.0%    10    0.0   0.0   0.0   0.0   0.0
   10. 12.34.56.78                   0.0%    10    0.0   0.0   0.0   0.0   0.0
   11. 12.34.56.79                   0.0%    10    0.0   0.0   0.0   0.0   0.0
   12. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
   13. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
   14. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
{{</ output >}}

These reports show that the router at hop 4 is not properly configured. When these situations occur, the only way to resolve the issue is to contact the network administrator's team of operators at the source host.

### ICMP Rate Limiting

ICMP rate limiting can cause apparent packet loss. When there is packet loss to one hop that doesn't persist to subsequent hops, the loss is caused by ICMP limiting. See the following example:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST:  localhost                     Loss%   Snt   Last  Avg  Best  Wrst   StDev
    1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
    2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
    3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
    4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
    5. 72.14.233.56                 60.0%    10   27.2  25.3  23.1  26.4   2.9
    6. 209.85.254.247                0.0%    10   39.1  39.4  39.1  39.7   0.2
    7. 64.233.174.46                 0.0%    10   39.6  40.4  39.4  46.9   2.3
    8. gw-in-f147.1e100.net          0.0%    10   39.6  40.5  39.5  46.7   2.2
{{</ output >}}

This report does not show a cause for concern. Rate limiting is a common practice and it reduces congestion to prioritize more important traffic.

### Timeouts

Timeouts can happen for various reasons. Some routers will discard ICMP and absent replies will be shown on the output as timeouts (`???`). Alternatively there may be a problem with the return route:

{{< output >}}
root@localhost:~# mtr --report www.google.com
HOST:  localhost                     Loss%   Snt   Last  Avg  Best  Wrst   StDev
    1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
    2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
    3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
    4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
    5. ???                           0.0%    10    7.2   8.3   7.1  16.4   2.9
    6. ???                           0.0%    10   39.1  39.4  39.1  39.7   0.2
    7. 64.233.174.46                 0.0%    10   39.6  40.4  39.4  46.9   2.3
    8. gw-in-f147.1e100.net          0.0%    10   39.6  40.5  39.5  46.7   2.2
{{</ output >}}

Timeouts are not necessarily an indication of packet loss. Packets still reach their destination without significant packet loss or latency. Timeouts may be attributable to routers dropping packets for QoS (quality of service) purposes or there may be some issue with return routes causing the timeouts. This is another false positive.

## Advanced MTR techniques

Newer versions of MTR are now capable of running in TCP mode on a specified TCP port, compared to the default use of the ICMP (ping) protocol. However, in most cases **this mode shouldn't be used** as TCP reports can be misleading in diagnosing inter-route issues. A TCP MTR will use SYN packets in place of ICMP pings, and most internet-level routers will not respond to these, erroneously indicating loss.

What a TCP test is useful for is determining whether firewall rules on a router somewhere are blocking a protocol or port, perhaps because port forwarding has not been configured properly. Running a TCP test over a certain port could more clearly reveal this whereas an ICMP test may not.

Running MTR in TCP mode will require super-user privileges on most machines:

    sudo mtr --tcp --port 80 --report --report-cycles 10 speedtest.dallas.linode.com
    sudo mtr --tcp --port 22 --report --report-cycles 10 50.116.25.154

## Resolve Routing and Networking Issues Identified in your MTR report

A majority of routing issues displayed by MTR reports are temporary. Most issues will clear up by themselves within 24 hours. In most cases, by the time you are able to notice a problem with a route, the Internet service provider's monitoring has already reported the problem and administrators are working to fix the issue. In cases where you are experiencing degraded service for an extended period of time, you may choose to alert a provider of the issues you're experiencing. When contacting a service provider, send MTR reports and any other relevant data you may have. Without usable data, providers have no way to verify or fix problems.

While routing errors and issues account for a percentage of network-related slowness, they are by no means the only cause of degraded performance. Network congestion, particularly over long distances during peak times, can become severe. Trans-Atlantic and trans-Pacific traffic can be quite variable and are subject to general network congestion. In these cases, it is recommended that you position hosts and resources as geographically close to their targeted audience as possible.

If you are experiencing connectivity issues and are unable to interpret your MTR report, open a support ticket. Include the output of your report in the "Support" tab of the Linode Manager and our technicians can help analyze your issue.
