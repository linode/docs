---
slug: use-nmap-for-network-scanning
author:
  name: Linode Community
  email: docs@linode.com
description: "Nmap is a highly flexible, open-source tool for network scanning. It allows you to monitor hosts and ports on a network, whether to help you keep tabs on your network's usage or to catch potential security threats. This guide shows you how to install Nmap to scan your network."
keywords: ['nmap','network scanning','port scanning','network discovery','security audit','network scan tutorial','port scan example']
tags: ['networking']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-04
modified_by:
  name: Nathaniel Stickman
title: "How to Use Nmap for Network Scanning"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Official Guide to Installing Nmap](https://nmap.org/book/install.html)'
- '[Nmap’s Guide for Installing From Source](https://nmap.org/book/inst-source.html)'
- '[Official Nmap Project Guide to Network Discovery and Security Scanning](https://nmap.org/book/toc.html)'

---

[*Nmap*](https://nmap.org/) is an open-source network scanning tool, one of the most popular around. It has built up a wide array of scanning options and capabilities over the years to make it highly efficient and adaptable to your scanning needs. Nmap helps system administers keep tabs on your network's host and port usage, and helps security auditors catch potential vulnerabilities.

In this guide, learn how to get started using Nmap for your network.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, use the following command:

            sudo apt update && sudo apt upgrade

    - On CentOS, use:

            sudo yum update

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Install Nmap

1. Install Nmap using your system's package manager.

    - On Debian and Ubuntu, use the following command:

            sudo apt install nmap

    - On AlmaLinux and CentOS, use the following command:

            sudo yum install nmap

    To install Nmap for another distribution or on Mac or Windows, take a look at Nmap's [official guide to installing Nmap](https://nmap.org/book/install.html).

    If you want to install Nmap from source code, you can follow the steps in Nmap's [guide for installing from source](https://nmap.org/book/inst-source.html). This may be useful if your Linux distribution's package manager only provides a much older version of Nmap. (This is generally not the case with distributions like AlmaLinux, CentOS, Debian, and Ubuntu).

1. Verify your installation.

        nmap

    {{< output >}}
Nmap 7.80 ( https://nmap.org )
[...]
    {{< /output >}}

## Using Nmap

This section provides some explanation of the fundamental scanning features of Nmap and gives you practical examples of how to use them.

### What Is Host Scanning?

Host scanning is the process of identifying hosts and their current statuses. One of the most useful hosts scanning procedures is identifying an IP range for hosts and scanning that range to see what hosts are there. This kind of host scanning can help you keep track of hosts' statuses and help you catch unauthorized hosts on your network.

The steps in this section show you an example of how you might run a host scan on your network.

1. Identify the IP range to scan. You may already have an IP range in mind — for instance, if your network has a range of permanent public IP addresses.

    If not, though, you can use your network's subnet mask.

        ifconfig

    {{< output >}}
[...]
inet 10.0.0.90  netmask 255.255.255.0  broadcast 10.0.0.255
[...]
    {{< /output >}}

    In this example, the `netmask` tells us that in the network's IP addresses the first three numbers (`10.0.0`) identify the network, while the last number varies for each host.

1. Conduct a ping scan against all of the IP addresses in your network's range to see what hosts are running.

        sudo nmap -sn 10.0.0.0/24

    The `-sn` option tells Nmap to conduct a ping scan only, without scanning the hosts' ports. The `/24` have Nmap scan the full range of the last number in the IP address (i.e., 0–255). See the next section for more information on scanning IP address ranges.

    Nmap's output provides the hostname and IP address for each active host. Nmap also provides a MAC address and an educated guess at the operating system.

    {{< output >}}
Starting Nmap 7.80 ( https://nmap.org ) at 2021-06-30 12:00 UTC
Nmap scan report for example-hostname (10.0.0.1)
Host is up (0.0085s latency).
Nmap scan report for 10.0.0.32
Host is up (0.0086s latency).
    {{< /output >}}

1. Often, you may want more details on a particular host or range of hosts. At this point, you would likely want to run a port scan on each of those hosts, and you can find the steps for doing so in the next section.

### What Is Port Scanning?

Port scanning, Nmap's core feature, gives you information about the states of ports on a given host(s). This can help you evaluate what ports are listening for traffic on a host and also gives you more details about the host itself.

Nmap evaluates each port as being in one of the following six states:

- **Open**: has an application or service actively accepting connections
- **Closed**: accessible but without an application or service actively listening
- **Filtered**: usage cannot be determined because packets are filtered
- **Unfiltered**: accessible but cannot be determined as either open or closed
- **Open|filtered**: either open or filtered but cannot determine for sure
- **Closed|filtered**: either closed or filtered but cannot determine for sure

In addition, Nmap can attempt to give you more detailed information about what is running on the host. You can have Nmap, for instance, attempt to determine the host's operating system. You can even have Nmap try to determine what service is listening on an open port.

### Basic Port Scan

Conducting a port scan with Nmap is very simple. Replace `192.0.2.0` in the following command — and in subsequent examples — with an actual IP address you would like to scan.

    sudo nmap 192.0.2.0

{{< output >}}
Starting Nmap 7.80 ( https://nmap.org ) at 2021-06-30 12:00 UTC
Nmap scan report for example-hostname (192.0.2.0)
Host is up (0.000052s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds
{{< /output >}}

Here, Nmap shows that port `22` is accessible and has a service — SSH — actively listening for connections.

You can also scan a range of IP addresses. Following are some of the ways to do that.

- `192.0.2.0-128`: scans hosts on the specified range — in this case, IP addresses ending between 0 and 128, inclusive.
- `192.0.2.0/24`: scans hosts for all IP endings, 0–255.
- `192.0.0.0/16`: similar to `/24` but also scans the range of the third number in the IP address, i.e., scans all hosts between `192.0.0.0` and `192.0.255.255`.

### Advanced Port Scan

Nmap provides a host of options to get more out of your scans and to fine-tune them to your needs. You can get a full list of options simply by running the `nmap` command without specifying addresses or options.

To help you get started, below is a list of some of the most commonly used options. Further on, you can find an example of how to use a few of these together for a more in-depth port scan.

- `-p0-`: causes Nmap to scan every possible TCP port (the default scan includes the 1,000 most commonly used ports).
- `-F`: causes Nmap to use a "fast" scan, scanning only the top 100 most commonly used ports.
- `-T4`: adjusts timing parameters; can range from `-T0`, the slowest option, to `-T5`, the fastest and most aggressive option.
- `-A`: includes "aggressive" tests with the scan, such as OS and service detection.
- `-v`: makes Nmap's output verbose.

Often, Nmap scans can take a long time to complete. While a scan is running, you can press the up arrow key to get a status update.

{{< output >}}
Service scan Timing: About 50.00% done; ETC: 12:00 (0:00:25 remaining)
{{< /output >}}

Here is an example of a useful Nmap command to get an in-depth view of a particular host:

        sudo nmap -p0- -A 192.0.2.0

This commands scans all ports on `192.0.2.0` and tries to gather additional details on the host and the ports' services.

{{< output >}}
Starting Nmap 7.80 ( https://nmap.org ) at 2021-06-30 12:00 UTC
Nmap scan report for example-hostname (192.0.2.0)
Host is up (0.000020s latency).
Not shown: 65535 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6.32
OS details: Linux 2.6.32
Network Distance: 0 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.48 seconds
{{< /output >}}

Here, Nmap not only reports on the accessible port it found, but, it also gives its evaluation of what service is likely running on that port (OpenSSH), as well as the OS that the service is running on. Nmap's report ends with a further evaluation of the OS running on the host.

## Conclusion

You have now started using Nmap to monitor your network. With the information above, you should be fully equipped to use Nmap for the most common network scanning needs.

You can also check out [Official Nmap Project Guide to Network Discovery and Security Scanning](https://nmap.org/book/toc.html). You can purchase a full-length version of the book, digital or print, from the Nmap website. However, the link above provides Nmap's online edition of the book, with a wealth of concepts, command options, and scanning tutorials to deepen your Nmap skills.
