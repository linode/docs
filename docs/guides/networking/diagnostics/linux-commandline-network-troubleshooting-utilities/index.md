---
slug: linux-commandline-network-troubleshooting-utilities
title: "Linux Commandline Network Troubleshooting Utilities"
description: 'This guide provides comprehensive information and examples on essential command-line tools for diagnosing and resolving network-related issues, including network configuration, connectivity testing, service monitoring, and more.'
keywords: ['Linux network troubleshooting utilities', 'Linux Command-line utilities']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-06-21
modified_by:
  name: Linode
---

This Guide introduces popular Linux network troubleshooting command-line apps. Troubleshooting Linux network connectivity follows testing the individual links in the network chain. The apps are introduced in a sequence that follows the usual procedure that methodically finds and diagnoses network problems between hosts.

Networks are circuits and Linux offers many command-line utilities to troubleshoot connectivity problems in the network circuit path. Different Linux distributions include a baseline of utilities for troubleshooting, and these utilities can sometimes be missing, deprecated, or not within the Linux version payload. Depending on the Linux distribution, the utility may have to be installed via download or other media.

Of the utilities listed in this guide, curl, often listed as "cURL", is the most commonly downloaded utility.

## Troubleshooting Networks In The Local Host

Linode generates Linux hosts that are pre-configured. This guide suggests tools and remedies for common networking problems. Note that the IP and DNS address settings issued by Linode or provisioned in generating a Linode should not be changed. The Lish shell that manages a Linode can be used to restore settings if they’ve been changed. Linodes also come pre-configured for the ssh protocol, including the initial generation of ssh keys or you can supply your own ssh keys.

Start the Linux network troubleshooting process using command-line tools to determine the networking state of the local Linux host. The troubleshooting of the network circuit proceeds to target network hosts, and then to the services residing on target network hosts.

Network troubleshooting begins by making sure the local host is configured, connected to its hardware, and has an address. The combination of network hardware and software inside the local host is called the network interface. The Linux command-line network utility *ip*, *ipup*/*ipdown*/*ipquery*, and *ifconfig* are used to detect that the local host network configuration steps are ready. Each of these also indicates whether a static TCP/IP configuration exists, if the configuration includes the all-important subnet that the local host resides on, and if a gateway is specified.

Communications are not possible until the local Linux host network interface hardware adapter, typically Ethernet, cable is connected. Alternatively, a WiFi router and a correctly configured and active local Linux host WiFi adapter must be available. Whether hard-wired for Ethernet or configured for WiFi, the next hop to the local network must be available.

Local area networks (LANs) connect the hosts via wired or wireless circuits to a router or gateway; the rest of the circuit connects this LAN gear via the router to the other target host. The TCP/IP protocols are used, and the utilities in this guide are based on TCP/IP connectivity.

Using canonical names of resources rather than using an IP address requires a name resolver. A name resolver changes the name to an IP address. This allows the use of names like `linode.com` or `cloud.ai`, where DNS or a name resolver changes the name to its associated IP address.

Typically, [the name resolver in a Linux system is DNS](/docs/guides/advanced-troubleshooting-dns-problems/). Any resolver, in other words, a service that changes DNS or canonical names to an IP address, is required for most network use. Although the Linux `/etc/hosts` file can be used to resolve names to IP addresses, a DNS server is used by default.

Once local Linux hosts are connected to LAN circuitry, the ping command is used to test connectivity among LAN or other hosts to other networks, including the Internet.

After pings verify connectivity to the other parts of the LAN, its routers, and optionally the Internet, other tools can be used to communicate through Linux network troubleshooting command-line utilities.

The role of an external Dynamic Host Configuration Protocol DHCP server is important. When no default address is configured in a Linux host upon boot, and after available networking hardware is found, the Linux host attempts to reach a DHCP server on the LAN. The requested response from the DHCP server is the Linux host’s IP address, a LAN gateway IP address for traffic forwarding, and optionally, the address of a resolver/DNS server.

Otherwise, the IP address for the host to be networked is obtained either through a static manually pre-configured address or one assigned to it by another host via the DHCP. The DHCP protocol is usually set in the gateway device and serves an unallocated local network TCP/IP address to a requesting host. This is often done automatically, but the process can fail.

If a local Linux host to be networked is discovered to have an address in the `169.x.x.x` range, the host was set to use the DHCP address rendered by a DHCP server, and that server cannot be reached or has run out of addresses that can be allocated to the local Linux host. The reason it cannot be reached can be as simple as an unplugged Ethernet cable (no electrical connection between host and DHCP server) or the DHCP server has run out of addresses allocated to requesters.

## The ifup/ifdown/ifquery, ifconfig And ip Utilities

The Linux `ifup`, `ifdown`, and `ipconfig` command line apps control internal local host internal network interfaces. Each of these is similar in use and can also reveal the operational state of internal local host network interfaces. These are still available, although they are deprecated in most recent Linux versions, replaced by the if command.

At boot time, most Linux distros probe resident host hardware, detecting known hardware devices, subsequently matching the hardware to software, and storing combinations of configurations. The combination of network hardware and software is known as a logical network interface, and each interface may share the same hardware. These Linux commands, `ifup`/`down`/`query` and/or `ifconfig` manually view the current configuration or change the state of the software controlling the network interface combination. From these commands, network interface hardware combinations can be started, stopped, and re-configured.

During the startup process after boot in a  Linux local host boot, configuration files are used to change the settings of the network interface. The settings can include many options, but the primary configuration is the establishment of a name for the network interface object, the network interface IP address, the designation of the local network, the local network’s gateway address, and the address of the network name resolver/DNS host.

If a network interface configuration is empty or at default values, the local Linux host boot procedure probes network hardware to seek a DHCP server. The responding DHCP server leases an address and communicates it to the local host, rendering the local network information, the LAN gateway, an IPv4 or IPv6 local host address, and optionally, the address of a desired DNS resolver.

A DNS resolver can be set by static configuration option, or be delivered through the DHCP process. The DNS resolver is required to change host names like `linode.com` into their IP addresses. Traditionally, Linux names are resolved through the use of the `/etc/hosts`.

The `ifup`/`ifdown`/`ifquery` utilities are older, deprecated, and similar to the `ifconfig` utility. These CLI utilities enumerate each logical network interface found in the host, their status, and their address. All use the same arguments found in the man pages because all three are actually the same utility using a different name for compatibility with older distributions and Unix.

1. The `ifup`/`ifdown`/`ifquery` utilities: These are used for managing network interfaces and follow the syntax below:

    ```command
    ifup/ifdown/ifquery <-options> -a <interface_name>
    ```

    These utilities provide the ability to bring up or down network interfaces and query their status. You can use various options to control the behavior of these commands.


1. The `ifconfig` utility: This is similar to the `ifup`/`ifdown`/`ifquery` utilities but offers additional options. However, its syntax differs from `ifup`/`ifdown`/`ifquery`:

    ```command
    ifconfig <-options> interface<specifications> | IP_address
    ```

    With `ifconfig`, you can configure network interfaces, assign IP addresses, enable or disable interfaces, and more. The utility allows you to specify options and provide interface specifications or IP addresses to perform the desired actions.

1. The `ip` command: It is a powerful utility that provides network interface queries and commands. However, it has its own unique syntax:

    ```command
    ip <options> object <command | help>
    ```

    The `ip` command operates by selecting different options and targeting specific objects, allowing you to execute commands that modify or observe the properties of the selected object through multiple iterations.

## The ping Command

Ping is a Linux network command-line/CLI utility that sends specific packets, expecting a `ping` in reply. [Ping tests network connectivity](/content/whats-a-ping-linux-ping-command-explained/) between a local host and other networked computers that should be able to respond.


Ping uses ICMP messaging, a part of the TCP/IP protocol that is neither TCP nor UDP. Hosts can be configured to ignore ICMP messaging. This makes ping unreliable or unusable if it’s targeted to a host whose ICMP messaging is turned off, or does not respond to ping requests. The syntax for using `ping` command is as follows:

```command
ping <hostname or IPv4 or IPv6 address>
```

With certain older Linux versions, a ping variant is used to use ping with IPv6 called *ping6*. The ping tool can also be used to detect other hosts in a subnet, called a *ping sweep*.

## The Netstat Command

The `netstat` command is a [useful troubleshooting tool when network connections already exist but are troublesome](/docs/guides/inspecting-network-information-with-netstat/). Troubleshooting with netstat reveals the relationship between the local host and already-established connections. Both local and target hosts reveal service ports at their IP addresses, and netstat attempts to characterize and list these connections.

Netstat is a utility that displays the connection relationships in tables and can help identify local host processes that may be causing excessive network traffic or utilizing system resources. By examining the results of a `netstat` query, high-traffic entries can be identified.

A typical output of the `netstat -l` command includes the following information:

```output
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 localhost:domain       0.0.0.0:*               LISTEN
tcp        0      0 user1:domain           0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:ssh            0.0.0.0:*               LISTEN
tcp        0      0 localhost:ipp          0.0.0.0:*               LISTEN
tcp6       0      0 [::]:ssh               [::]:*                  LISTEN
tcp6       0      0 ip6-localhost:ipp      [::]:*                  LISTEN
tcp6       0      0 [::]:9090              [::]:*                  LISTEN
udp        0      0 0.0.0.0:ipsec-nat-t    0.0.0.0:*
udp        0      0 224.0.0.251:mdns       0.0.0.0:*
udp        0      0 0.0.0.0:mdns           0.0.0.0:*
udp        0      0 localhost:domain       0.0.0.0:*
udp        0      0 user1:domain           0.0.0.0:*
udp        0      0 0.0.0.0:bootps         0.0.0.0:*
udp        0      0 0.0.0.0:isakmp         0.0.0.0:*
udp        0      0 0.0.0.0:631            0.0.0.0:*
udp6       0      0 [::]:34858             [::]:*
udp6       0      0 [::]:ipsec-nat-t       [::]:*
udp6       0      0 [::]:mdns              [::]:*
udp6       0      0 [::]:isakmp            [::]:*
Active UNIX domain sockets (only servers)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ACC ]     STREAM     LISTENING     51207    @/tmp/dbus-h2c4gvLX
unix  2      [ ACC ]     STREAM     LISTENING     49065    @/tmp/.ICE-unix/2535
unix  2      [ ACC ]     STREAM     LISTENING     2908660  /run/user/1001/speech-dispatcher/speechd.sock
unix  2      [ ACC ]     STREAM     LISTENING     54434    /tmp/.X11-unix/X0
unix  2      [ ACC ]     STREAM     LISTENING     59398    /run/user/1001/systemd/private
unix  2      [ ACC ]     STREAM     LISTENING     51511    /run/user/125/systemd/private
unix  2      [ ACC ]
```

## The nmap Command

*Nmap* is a command-line network troubleshooting tool available in Linux that is useful when there is a functioning connection between the local host and local network resources. It generates a network map of the target network, including IP addresses and various servers such as name resolvers or DNS hosts. Additionally, Nmap can scan the local host and other hosts to identify open ports and attempt to determine the associated services.

Following is an edited example output from a Nmap execution:

```output
nmap -v -sn 192.168.1.1/24
Starting Nmap 7.80 (https://nmap.org) at 2023-03-10 15:56 EST
Initiating ARP Ping Scan at 15:56
Scanning 255 hosts [1 port/host]
Completed ARP Ping Scan at 15:56, 3.25s elapsed (255 total hosts)
Initiating Parallel DNS resolution of 255 hosts at 15:56
Completed Parallel DNS resolution of 255 hosts at 15:56, 0.00s elapsed

Nmap scan report for 192.168.1.0 [host down]
Nmap scan report for cellspot.router (192.168.1.1)
Host is up (0.00031s latency).
MAC Address: AC:9E:17:A3:CE:50 (Asustek Computer)
Nmap scan report for 192.168.1.2 [host down]
...
Nmap scan report for 192.168.1.30 (Apple-TV.T-mobile.com)
Host is up (0.44s latency).
MAC Address: 5C:F9:38:B0:BE:BE (Apple)
Nmap scan report for 192.168.1.31 [host down]
Nmap scan report for 192.168.1.32 [host down]
...
Nmap scan report for 192.168.1.81 (EPSON4D84DE.T-mobile.com)
Host is up (0.27s latency).
MAC Address: B0:E8:92:4D:84:DE (Seiko Epson)
Nmap scan report for 192.168.1.82 [host down]
...
Nmap scan report for 192.168.1.122 (DESKTOP-G1N31TC.T-mobile.com)
Host is up (0.00027s latency).
MAC Address: 98:90:96:D3:6D:81 (Dell)
Nmap scan report for 192.168.1.123 [host down]
Nmap scan report for 192.168.1.124 [host down]
...
Nmap scan report for 192.168.1.156 (user2-desktop.T-mobile.com)
Host is up (0.00041s latency).
MAC Address: E8:40:F2:0B:CC:C7 (Pegatron)
Nmap scan report for 192.168.1.157 [host down]
Nmap scan report for 192.168.1.158 [host down]
...
Nmap scan report for 192.168.1.243 (LAPTOP-83TE3ITO.T-mobile.com)
Nmap scan report for 192.168.1.244 [host down]
Host is up (0.0092s latency).
MAC Address: D4:3B:04:EA:1B:09 (Intel Corporate)
...
Nmap scan report for 192.168.1.253 [host down]
Nmap scan report for 192.168.1.254 [host down]
Nmap scan report for 192.168.1.255 [host down]
Initiating Parallel
```

## The ncat Command

Evolved by the authors of nmap, *ncat* is a Linux CLI network communications tool for use between two hosts. The ncat app is used by a local Linux server as a general-purpose client to application services for other hosts. The services include mail servers, web servers, and services based on API formulas such as node.js,

Troubleshooting with ncat allows a command-line session to interact with external servers, but ncat can also serve as a TCP, UDP, or SSL server target. Whether client or server, the protocol set includes either IPv4 or IPv6 and can include traffic flow encryption.


[These features allow](https://nmap.org/ncat/guide/index.html) ncat to interact with services on other hosts running under a virtual machine, Docker, Kubernetes, node.js, react.js, and Serverless function, as well as interacting with serial-port-connected resources like industrial controllers, or IoT configurations.


## The ssh Command

The SecureSHell (ssh) command establishes an encrypted session from the local Linux host to a target server running the ssh server software. In basic use, ssh establishes a shell session on the ssh server host and is viewed as a terminal session on the local Linux host. [The ssh command is used extensively](/docs/guides/troubleshooting-ssh/) in Linux host networking and [has many configuration options](https://www.linode.com/docs/guides/networking/ssh/).


Both ssh and ssh servers require that encryption keys are generated before the session starts. Linode instances can use pre-generated keys, or keys generated manually to start an ssh session, client or server. Keys are pre-generated or are optional initial configuration inserts done on each Linode. For other Linux use cases, keys are usually generated upon the first use of the operating system instance.

The basic syntax for an ssh session is as follows:

```command
ssh user@hostname_or_IP_address
```

The ssh transportation layer is used by many Linux host-to-host communications circuits, including `sftp`, `scp`, `rsync`, and more. By default, the Linux `root` user is blocked in the ssh configuration file to prevent dictionary password-cracking attempts. [The configuration of ssh can use many options](/docs/guides/networking/ssh/).

## The Telnet Command

Telnet is a [host-to-host communications program](/docs/guides/troubleshooting-overview/#are-you-using-telnet-or-ftp) often used to program older industrial devices with computer communications capability. Telnet can also be used to troubleshoot remote email hosts.

Telnet use is not encrypted, and provides a terminal on the target host. Its functionality has been replaced by ssh, although it is used to troubleshoot email hosts or communicate with serial-port attached devices common in industrial systems and point-of-sale terminals. The telnet app must work on both hosts or at least one host must have a service that responds correctly to telnet communications.

## The Scp and SFTP Commands

The Linux [*scp*](/docs/guides/how-to-use-scp/) and [*sftp*](/docs/guides/sftp-linux/) Linux command-line apps move files and folders between the local Linux host, and another host where both hosts have ssh correctly configured. Generally, both hosts use the ssh protocol as a transport between the two systems. These two apps use the ssh "secure shell" communications system, which is described below.

The syntax for scp is listed below:

```command
scp user@domain_or_IP:/source_files /destination_folder
```

Both hosts must be active and using ssh for scp to work; options such as passwords, and altered port address, which is an ssh option, must be corrected on the command line. These options are found in the scp and ssh man pages of each host.


The FTP program comes in a secure version, `sftp`, and `sftp` is more commonly used because it’s encrypted. The FTP app is deprecated in some releases because of its age and vulnerabilities. The SFTP app requires that [ssh be initially configured](/docs/guides/linux-commandline-network-troubleshooting-utilities/#the-ssh-command).

## The Curl Tool

[Curl is an application and tool](/docs/guides/installing-and-using-the-curlie-command-on-linux/) that transfers data among and between hosts. Curl works with secure and insecure protocols against many of the services found in servers, ranging from industrial applications and IoT to posting and downloading data from web servers. It is a flexible tool and is often used in Linux command-line network troubleshooting, especially where network circuits require secure, encrypted, and authenticated traffic.

Curl includes telnet, and uses secure encryption methods including PKI, Kerberos, and SOCKS protocols to communicate. It can serve as a proxy and encompasses many of the protocols mentioned above, including SCP, various forms of (s)ftp, and other communications tools.

This [video from Linode](https://youtu.be/vDWY3PuHMX8) at 5:46 minutes in, shows the vast number of ways that curl is used. Curl can also be used to [communicate with Linode APIs](/docs/products/tools/api/guides/curl/).

The curl app is the most downloaded network communications tool for the Linux command line because of its versatility. Once learned, it removes the need to understand nearly all of the tools in this guide.


## Conclusion

Linux command-line network troubleshooting tools start at the local Linux host, troubleshooting and verifying operations until target hosts successfully communicate. Older tools are still found on older hosts, IoT devices that cannot be updated, or come with a slimmed-down distro.

The network troubleshooting starts by using Linux command-line network troubleshooting tools in the Linux local host, then moves to LAN resources, and finally to specific services located in target hosts. Each tool covers one section of this network circuit from host to host. Each troubleshooting attempt starts at the beginning, verifying the operation of each member along the troubleshooting path.

First, the local host is checked, the LAN verified, the gateway connected, and target hosts and their services finally complete the Linux network troubleshooting agenda.
