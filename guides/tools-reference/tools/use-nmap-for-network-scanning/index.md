---
slug: use-nmap-for-network-scanning
title: "How to Use Nmap for Network Scanning"
title_meta: "How to Use Nmap for Network Scanning"
description: "Nmap is a highly flexible, open source tool for network scanning. Find step-by-step instructions on how to install Nmap in this guide."
authors: ["Nathaniel Stickman"]
contributors: ["Nathaniel Stickman"]
published: 2023-03-07
keywords: ['nmap','network scanning','port scanning','network discovery','security audit','network scan tutorial','port scan example']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Official Guide to Installing Nmap](https://nmap.org/book/install.html)'
- '[Nmap’s Guide for Installing From Source](https://nmap.org/book/inst-source.html)'
- '[Official Nmap Project Guide to Network Discovery and Security Scanning](https://nmap.org/book/toc.html)'
---

[*Nmap*](https://nmap.org/) is a popular, open source network scanning tool. It has a wide array of scanning options and capabilities, making it highly efficient and adaptable. Nmap helps system administers monitor a network's host and port usage, and helps security auditors catch potential vulnerabilities. In this guide, learn how to get started using Nmap for your network.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Nmap

1.  Install Nmap using your system's package manager:

    {{< tabs >}}
    {{< tab "Debian and Ubuntu" >}}
    ```command
    sudo apt install nmap
    ```
    {{< /tab >}}
    {{< tab "AlmaLinux, CentOS Stream, and Rocky Linux" >}}
    ```command
    sudo dnf install nmap
    ```
    {{< /tab >}}
    {{< /tabs >}}

    {{< note >}}
    To install Nmap for another distribution or on Mac or Windows, take a look at Nmap's [official guide to installing Nmap](https://nmap.org/book/install.html).

    If you want to install Nmap from source code, you can follow the steps in Nmap's [guide for installing from source](https://nmap.org/book/inst-source.html). This may be useful if your Linux distribution's package manager only provides a much older version of Nmap. However, this is generally not the case with distributions like Alma Linux, CentOS Stream, Debian, Fedora, Rocky Linux, and Ubuntu.
    {{< /note >}}

1.  Verify your installation:

    ```command
    nmap
    ```

    ```output
    Nmap 7.80 ( https://nmap.org )
    ...
    ```

## Using Nmap

This section provides some explanation of the fundamental scanning features of Nmap and gives practical examples of how to use them.

### What Is Host Scanning?

Host scanning is the process of identifying hosts and their current statuses. One of the most useful host scanning procedures is identifying an IP range and scanning that range to see what hosts are there. This kind of host scanning can help keep track of host status and help catch unauthorized hosts on the network.

The steps in this section provide an example of how to run a host scan on a network.

1.  First, identify the IP range to scan. You may already have an IP range in mind, for instance, if your network has a range of permanent public IP addresses. If not, you can use your network's subnet mask:

    ```command
    ip a
    ```

    ```output
    ...
        inet 192.0.2.0/24 brd 192.0.2.255 scope global eth0
    ...
    ```

    Identify the `inet` line in the output. In this example, the `netmask` is shown in CIDR notation. The `/24` at the end of the IP address translates to `255.255.255.0`. This means that the first three sets of numbers in the IP address (`192.0.2`) identify the network. The last set of numbers (`.0`) varies for each host.

1.  Conduct a ping scan against all of the IP addresses in your network's range to see what hosts are running:

    ```command
    sudo nmap -sn 192.0.2.0/24
    ```

    The `-sn` option tells Nmap to conduct a ping scan only, without scanning the hosts' ports. The `/24` has Nmap scan the full range of the last number in the IP address (i.e. `0`–`255`). See the next section for more information on scanning IP address ranges.

    Nmap's output provides the hostname and IP address for each active host. Nmap also provides a MAC address and an educated guess at the operating system:

    ```output
    Starting Nmap 7.80 ( https://nmap.org ) at 2023-09-01 13:15 EDT
    Nmap scan report for 192.0.2.0
    Host is up (0.42s latency).
    MAC Address: XX:XX:XX:XX:XX:XX (Icann, Iana Department)
    Nmap scan report for EXAMPLE_HOSTNAME (192.0.2.1)
    Host is up (0.0045s latency).
    MAC Address: YY:YY:YY:YY:YY:YY (Icann, Iana Department)
    ...
    Nmap scan report for 192.0.2.255
    Host is up (0.43s latency).
    MAC Address: ZZ:ZZ:ZZ:ZZ:ZZ:ZZ (Icann, Iana Department)
    Nmap scan report for EXAMPLE_HOSTNAME (192.0.2.0)
    Host is up.
    Nmap done: 256 IP addresses (256 hosts up) scanned in 6.36 seconds
    ```

1.  Often, you may want more details on a particular host or range of hosts. At this point, you would likely want to run a port scan on each of those hosts. Find the steps for doing so in the next section.

### What Is Port Scanning?

Port scanning is Nmap's core feature. It provides information about the state of ports on a given host or range of hosts. This can help evaluate what ports are listening for traffic on a host and provide more details about the host itself.

Nmap evaluates each port as being in one of the following six states:

-   **Open**: Has an application or service actively accepting connections.
-   **Closed**: Accessible, but without an application or service actively listening.
-   **Filtered**: Usage cannot be determined because packets are filtered.
-   **Unfiltered**: Accessible, but cannot be determined as either open or closed.
-   **Open|Filtered**: Either open or filtered, but cannot determine for sure.
-   **Closed|Filtered**: Either closed or filtered, but cannot determine for sure.

In addition, Nmap can attempt to provide more detailed information about what is running on the host. For instance, Nmap can attempt to determine the host's operating system, or what service is listening on an open port.

### Basic Port Scan

Conducting a port scan with Nmap is very simple. Replace {{< placeholder "192.0.2.58" >}} in the following command (and all subsequent examples) with the actual IP address you want to scan:

```command
sudo nmap {{< placeholder "192.0.2.58" >}}
```

```output
Starting Nmap 7.80 ( https://nmap.org ) at 2023-09-01 13:05 EDT
Nmap scan report for EXAMPLE_HOSTNAME (192.0.2.58)
Host is up (0.0000060s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 0.11 seconds
```

Here, Nmap shows that port `22` is accessible and has a service (SSH) actively listening for connections.

You can also scan a range of IP addresses. Here are some of the ways to do that, using the example IP address above:

-   `192.0.2.0-128`: Scans hosts on the specified range. In this case, IP addresses ending between 0 and 128.
-   `192.0.2.0/24`: Scans hosts for all IP address endings (`0`–`255`).
-   `192.0.0.0/16`: Similar to `/24` but also scans the range of the third number in the IP address (i.e. scans all hosts between `192.0.0.0` and `192.0.255.255`).

### Advanced Port Scan

Nmap provides a ton of options to fine-tune scans. Get a full list of options simply by running the `nmap` command without specifying addresses or options.

To help you get started, here is a list of some of the most commonly used options:

-   `-p0-`: Causes Nmap to scan every possible TCP port (the default scan includes the 1,000 most commonly used ports).
-   `-F`: Causes Nmap to use a "fast" scan, scanning only the top 100 most commonly used ports.
-   `-T4`: Adjusts timing parameters (can range from `-T0`, the slowest option, to `-T5`, the fastest and most aggressive option).
-   `-A`: Includes "aggressive" tests with the scan, such as OS and service detection.
-   `-v`: Makes Nmap's output verbose.

Further on, find an example of how to use a few of these together for a more in-depth port scan.

Nmap scans can often take a long time to complete. While a scan is running, you can press the up arrow key to get a status update:

```output
Service scan Timing: About 50.00% done; ETC: 12:00 (0:00:25 remaining)
```

Here is an example of a useful Nmap command to get an in-depth view of a particular host:

```command
sudo nmap -p0- -A {{< placeholder "192.0.2.58" >}}
```

This commands scans all ports on {{< placeholder "192.0.2.58" >}} and tries to gather additional details on the host and the ports' services.

```output
Starting Nmap 7.80 ( https://nmap.org ) at 2023-09-01 13:07 EDT
Nmap scan report for EXAMPLE_HOSTNAME (192.0.2.58)
Host is up (0.00010s latency).
Not shown: 65535 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.3 (Ubuntu Linux; protocol 2.0)
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6.32
OS details: Linux 2.6.32
Network Distance: 0 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 4.22 seconds
```

Here, Nmap reports on the accessible port it found. It evaluates what service is likely running on that port (OpenSSH) and what OS that the service is running on (Ubuntu Linux). Nmap's report ends with a further evaluation of the OS running on the host.

## Conclusion

You have now started using Nmap to monitor your network. With the information above, you should be fully equipped to use Nmap for the most common network scanning needs.

Also check out the [Official Nmap Project Guide to Network Discovery and Security Scanning](https://nmap.org/book/toc.html). It contains a wealth of concepts, command options, and scanning tutorials to deepen your Nmap skills. You can purchase a full-length version of the book (digital or print) from the Nmap website. The link above provides Nmap's online edition of the book.