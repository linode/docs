---
slug: how-to-choose-a-data-center
author:
  name: Linode
  email: docs@linode.com
description: 'How determine which Linode data centers is right for you.'
keywords: ["data center", "datacenter", "dc", "speed"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-11-05
modified_by:
  name: Linode
published: 2018-10-31
title: How to Choose a Data Center

tags: ["linode platform"]
aliases: ['/platform/how-to-choose-a-data-center/']
---
Deploying your Linode to a geographically advantageous data center can make a big difference in connection speeds to your server. Ideally, your site or application should be served from multiple points around the world, with requests sent to the appropriate region based on client geolocation. On a smaller scale, deploying a Linode in the data center nearest to you will make it easier to work with than one in a different region or continent.

There are many things can affect network congestion, connection speeds, and throughput, so you should never interpret one reading as the sole data point. Always perform tests in multiples of three or five for an average, and on both weekend and weekdays for the most accurate information.

This page is a quick guide for choosing and speed testing a data center (DC). Start by creating a Linode in the data center in or near your region, or several Linodes in multiple regions if you're close to more than one DC. From there, use Linode's [Facilities Speedtest](https://www.linode.com/speedtest) page for test domains to ping and files to download.

## Network Latency

The Linux [ping](https://linux.die.net/man/8/ping) tool sends IPv4 [ICMP echo requests](https://en.wikipedia.org/wiki/Ping_(networking_utility)#Echo_request) to a specified IP address or hostname. Pinging a server is often used to check whether the server is up and/or responding to ICMP. Because `ping` commands also return the time it takes a request's packet to reach the server, `ping` is commonly used to measure network [latency](https://en.wikipedia.org/wiki/Network_delay).

Ping a data center to test your connection's latency to that DC:

    ping -c 5 speedtest.dallas.linode.com

Use [ping6](https://linux.die.net/man/8/ping6) for IPv6:

    ping6 -c 5 speedtest.dallas.linode.com

{{< note >}}
Many internet connections still don't support IPv6 so don't be alarmed if `ping6` commands don't work *to* your Linode from your local machine. They will, work *from* your Linode to other IPv6-capable network connections (ex. between two Linodes in different data centers).
{{< /note >}}

## Download Speed

Download speed will be limited most heavily first by your internet service plan speed, and second from local congestion between you and your internet service provider. For example, if your plan is capped at 60 Mbps, you won't be able to download much faster than that from any server on the internet. There are multiple terminologies to discuss download speeds with so here are a few pointers to avoid confusion:

  -  Residential internet connection packages are sold in speeds of mega**bits** per second (abbreviated as Mbps, Mb/s, or Mbit/s).

  -  One mega**bit** per second (1 Mbps or 1 Mb/s) is 0.125 mega**bytes** per second (0.125 MB/s). Desktop applications (ex: web browsers, FTP managers, Torrent clients) often display download speeds in MB/s.

  -  **Mebibytes** per second is also sometimes used (MiB/s). One Mbps is also equal to 0.1192 MiB/s.

To test the download speed from your data center of choice, use the `cURL` or `wget` to download the `bin` file from a data center of your choice. You can find the URLs on our [Facilities Speedtest](https://www.linode.com/speedtest) page.

For example:

    curl -O http://speedtest.dallas.linode.com/100MB-dallas.bin
    wget http://speedtest.dallas.linode.com/100MB-dallas.bin

Below you can see that each time `cURL` is run, a different average download speed is reported and each takes a slightly different amount of time to complete. This is to be expected, and you should analyze multiple data sets to get a real feel for how fast a certain DC will behave for you.

```
root@debian:~# curl -O http://speedtest.dallas.linode.com/100MB-dallas.bin
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  100M  100  100M    0     0  11.4M      0  0:00:08  0:00:08 --:--:-- 12.0M
```

```
root@debian:~# curl -O http://speedtest.dallas.linode.com/100MB-dallas.bin
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  100M  100  100M    0     0  10.8M      0  0:00:09  0:00:09 --:--:--  9.9M
```

```
root@debian:~# curl -O http://speedtest.dallas.linode.com/100MB-dallas.bin
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  100M  100  100M    0     0  9189k      0  0:00:11  0:00:11 --:--:-- 10.0M
```
