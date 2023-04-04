---
slug: troubleshooting-network-issues
description: 'Learn the basic differences between IPv4 & IPv6, and how to map IPv4 troubleshooting skills to IPv6 with the addition of IPv4-IPv6 example translation.'
keywords: ['networking','troubleshooting','ipv4','ipv6']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-09
modified_by:
  name: Linode
title: "Troubleshooting Network Issues - IPv4 and IPv6"
authors: ["Tom Henderson"]
---

A successful internet circuit from host-to-host usually involves many components: from an application in one host, to an application in the desired target host. This tutorial covers troubleshooting connectivity between apps, and their hosts, whether over IPv4, IPv6, or an IPv6 tunnel over IPv4.

Applications are usually chained to the network stack and capabilities of the host, therefore troubleshooting communications requires troubleshooting through the layers of the ISO OSI stack: through the host network communications layers, through the network interface card, then along the network path, through gateways, routers, and switches, until it meets the target host.

It involves a working electrical circuit, correct host protocol information, correctly supplied information from local hosts, and verification that the local host’s network stack works. Proxies can make troubleshooting more complex because you must use application-specific techniques, so this is not covered in detail.

The differences between troubleshooting IPv4 versus IPv6 stacks is simpler now than it used to be. Major operating systems treat them equally, often as parallel stacks. Troubleshooting IPv4 and/or IPv6 involves testing parallel stacks using parallel and common tools.

Modern operating systems come with a handful of useful basic commands for the network communications software stack. Windows, macOS, and Linux already have common Unix-like network troubleshooting commands built-in, and other cross-platform testing tools are available to download.

## Troubleshooting Stack Configuration

To start, you need to ensure you have power. Verify your electrical connection to the first router/switch/gateway leading to the rest of your network or internet.

### Wired Ethernet

Wired Ethernet connections are generally on the back of the host and router/switch/gateway. Working cable connections are indicated by illuminated LEDs on the Ethernet jacks. For gigabit speeds, both LEDs on the cable jack should be lit, while a single lit LED indicates a 100mbp/s connection. The jack on the connected router/switch must also be lit. If the LEDs are not lit, you have no connection and the circuit is broken. This results from bad cables, bad jacks, wrong or incorrectly wired cables, and electrically dead jacks or routers.

### WiFi

Where a WiFi connection is used, examine the local host to verify the status of the cable or WiFi connection. The connection must be alive and working according to the host desiring connection. Working WiFi supplicant verification is made either in the host in question, or through the WiFi router administration software.

Once the electrical circuit and/or WiFi connections are verified, the host software stack becomes the second step in the troubleshooting procedure.

## Network Software Stack

Next, check host protocol adherence. The basic IPv4 and IPv6 addressing scheme must match the needs of the next downstream device (router/gateway/switch/hub). At minimum, there must be a routable address, a correct network mask, and a gateway address (next hop of a router/gateway/switch that can forward packets). Most network stacks require a reachable DNS IP address or a DNS Fully Qualified Domain Name (FQDN) whose IPv4 and/or IPv6 address can be reached from the host.

The boot process requires one of three types of suppliers of compliant address information. The first is a user/administrator-supplied static address that is permanent for the host (for fixed installations). The second supplier can be through proxy software, such as Mobile Device Management (MDM) like Microsoft’s Intune or IBM’s Maas360, or other proxy software that automates control of the host IP address. The third and most common supplier of addresses comes from the Dynamic Host Configuration Protocol (DHCP).

### DHCP Troubleshooting

DHCP clients are configured to receive their IPv4/IPv6-compliant address through the DHCP protocol from a downstream host. If the DHCP address server is offline, a usable address for the host network stack is not available until the working DHCP server is re-contacted by the DHCP client.

The DHCP address must be delivered within an IPv4/IPv6 range that permits the host address to be routed through the next gateway/switch/router to other downstream gateways, then on to the Internet (or the target host if on a local or private network). Many hosts substitute an IPv4 address if they fail to procure a DHCP address in the `169.XXX.XXX.XXX` range, which is a point-to-point protocol for machine-to-machine connections not involving gateways.

{{< note respectIndent=false >}}
A DHCP server may also consult a RADIUS server for information, but become unusable if the RADIUS server cannot be found. DHCP and RADIUS servers can be combined in the same device, and serve as combined proxy authentication (RADIUS) and supplicant provider (DHCP) when confirming network addresses and credentials.
{{< /note >}}

If a Linode host requests a DHCP address, it receives an IPv4 and IPv6 address from a pool depending on where the host node is located. If a network host receives DHCP host addresses in the `169.XXX.XXX.XXX` range, this indicates that the DHCP server did not supply an address correctly, and communications to the needed DHCP must be tested.

When an IPv4/IPv6-compliant address is delivered to a requesting host, this address is not considered static. Most DHCP addresses are automatically renewed every 90 days, so dependencies on that IP address by applications are at risk when the address is renewed. If a host has been unavailable with a leased address and is re-introduced to the network, the DHCP server delivers the next available list in its pool, which may be different from previous address.

DHCP servers test an address before leasing it to a DHCP client. However, users on the same local network may have been assigned a static address within the DHCP range. This causes a conflict because each address must be unique. Duplicate IP addresses cause each host with the same address to receive errors. To fix this, flush the Address Resolution Protocol (ARP) cache on each host assigned a duplicate address, as well as the cache on the DHCP server.

DHCP servers delivered information can overwrite default settings, and overwrite settings of a default/preferred DNS server. Errors ensue if the default/preferred DNS server contains unique information needed by the requesting host (itself supplied with the wrong DNS server). Users have the ability to name a DNS server in a home environment that may conflict, or not be able to resolve within a local network. Administrative procedures must ensure that local organizational DNS servers take priority, or be listed as the first nameserver/DNS host.

## Host Network Stacks

Even when the electrical circuit is verified, and the host has an IPv4/IPv6 client address, gateway/router/switch address, and DNS, other trouble may exist in the local host network software stack. Numerous shims can be placed in the stack that perform different steps, such as a VPN, authentication, proxies, unique or settings-specific protocols, and other services that impact network use.

The host network stack is the currently defined and configured list of settings required to make the host a member of a network. These settings include:

*   Valid network address within the range that can be routed by the next downstream device with a correct network mask, which enables the downstream device to correctly address it.
*   Media Access Control (MAC) address that is unique for that subnet.
*   Gateway address for the downstream device to be a target of packets for routing.
*   DNS address, either user/administrator-controlled or delivered from the DHCP protocol, if not defined locally.

There may be several software drivers in the stack. For example those needed for VPNs, special protocols, network card driver, and others.

Troubleshooting the stack may require removing all but the base network address information and hardware driver. This minimal stack must work before other components are added. To verify the integrity of the stack, add services back one-at-a-time and test each new component until a culprit is found. Troubleshooting network stacks requires revealing stack settings for the network hardware in use. Keep in mind there are multiple hardware items in a host, and each has a network stack that controls it.

All hosts display their stack when administratively accessed settings are chosen. This includes third-party network stack software insertions.

### Revealing The Stack In Windows

**GUI:** Right-click the network/WiFi icon on the taskbar.

**CLI:** `ipconfig`

### Revealing The Stack In macOS

**GUI:** Click the network/WiFi icon and choose **Settings**, or go to **Apple** -> **System Preferences** -> **Network**.

**CLI:** `ifconfig`

### Revealing The Stack In Linux

**GUI:** Open **Network-Manager**, or right click the network/WiFi icon

**CLI:** `ifconfig`, `if`, `systemd -network-configuration`

If a Linux instance hosted in Linode needs its network stack revealed, the `systemd` commands are used.

## Circuit Trace Tools

Windows, macOS, and Linux hosts all contain the `ping` command, which uses ICMP messaging, a different protocol than TCP or UDP. Pinging a host reveals if a circuit is complete, indicated by a reply to the ping. A few missing replies means there is latency, jitter, congestion, and/or other intermittent connection characteristics.

The usual syntax of the ping command line tool is:

    ping <hostname or IP>

If a route to a DNS server, resolver, or local hosts file isn’t present, ping fails where a fully qualified hostname has been used. If ping can find the hostname through a resolver, then it uses the IP address as its target. If no hostname resolution is found, the IP address of the host is preferable. If there is a reply from the host by IP address only, name resolution has failed, which is a DNS problem. If it’s successful, then the circuit path is good. Ping can show intermediate response slowdowns. The Windows version only shows four replies, but other versions show replies until the program is forced to stop with **CTRL-C**. Vast differences in response times point to network congestion between the hosts, router latencies, jitter, and/or other circuit problems

The Windows native command line tool `tracert`, or `traceroute` in macOS and Linux, traces each host/gateway/router between two hosts. A better, downloadable cross-platform command line tool, `mtr` (the Windows Version is called **WinMTR**), performs an interactive traceroute that reveals jitter and latency between two hosts.

### Wireshark

The Wireshark application is a protocol analyzer that works on Windows, macOS, and Linux. Most commonly used in a GUI, Wireshark captures network traffic seen by a host’s port. The captured traffic is analyzed to determine problems between hosts, and measure traffic on the local routable network.

Wireshark requires hardware configurations to have full access to a desired network port on a host. Traffic can be viewed in real-time, or captured and analyzed for host pairing of conversations among hosts, and specific protocol analysis. It also permits decrypting IPsec and TLS.

### Firewalls and Other Network Traffic Controllers

Windows, macOS, and Linux each have stateful firewalls. With exceptions for several standard traffic types, by default, they block all inbound traffic unless an outbound connection has been established to an external host. Each of these operating systems can have optional applications installed as traffic controllers, acting as a secondary firewall. These applications can change firewall settings and increase the complexity of troubleshooting networks.

In Windows desktop and server editions, **Control Panel** -> **System and Security** -> **Windows Defender Firewall**, lets you examine blocked and permitted ports as well as settings for an Active Directory Domain, Private, and Public context.

The macOS Firewall is turned off by default, but can be turned on, and viewed through **Apple** -> **System Preferences** -> **Security and Privacy** -> **Firewall** -> **Firewall Options**.

Linux firewall primitives are in the Linux kernel, called `netfilter`. Netfilter control is provided by `iptables`, the ufw wrapper to iptables, or `firewalld`. Like Windows and macOS, Linux distros use a variety of added firewall products, which may or may not be chained to the default iptables (or its update, `nftables`).

Third party firewalls on Windows, macOS, and Linux may use different commands, and troubleshooting them is vendor/version-specific.

Additional network traffic control can be asserted to a host by third party software, typically a directory domain threading system such as Microsoft’s Active Directory, or MDM applications.

## Firewall Programming and Table Insertion

Firewalls admit or deny host traffic for its protection. Troubleshooting firewalls requires knowing the network traffic types, addresses, and protocols needed by the host, as all others should be denied.

Firewalls block or admit traffic into a host based on rules. A host usually has a default set of rules that can be user-modified, or inherited from proxy control or other tables of rules. Firewall rules tables must all be administratively protected.

Depending on the firewall’s rules and added proxy control employed, rules files may be imported into the firewall at when it loads from a local or proxy agent. These modified rules may permit the altering of packets, blocking, admitting, routing, and other movements of network traffic through the host’s network interface(s).

Once sure you have a working network electrical circuit and a correct client network stack, look for apparent blockages caused by firewall rule errors, rule overreach, and/or limitations imposed on one IP protocol but not the other. Both IPv4 and IPv6 rules should be comparable for the same communications path desired.

### Linux

Linux `iptables`/`nftables`, UFW, and `firewalld`, all permit the inclusion of runtime-loaded rules files, which are integrated into the settings directives the host firewall uses. This aids other apps that can form them by learning. An example of a learning firewall aid is `fail2ban`, which can ban IP addresses directly to the iptables rules as an included table. The `fail2ban` app regularly re-writes the iptables rules according to its configuration by examining traffic, matching offenders that fail rules, then blocking them specifically in the iptables rules. These rules re-load each time `iptables` loads - like when you restart or boot a system - and can prevent iptables from passing traffic until tables are loaded into the Linux kernel netfilter framework. This delay can simulate a network failure because traffic is blocked until the potentially large tables are loaded into the framework.

## Third Party and Proxy Network Control Troubleshooting

Proxy control of hosts requires application-specific techniques. Domain control, remote device management, MDM, and Cloud-Assisted Security Brokers can be inserted in most all modern operating systems as a proxy-authenticator, DNS controller, (site) Access Control List limiter, and general connection blocker. Network access to a specific host by domain, DNS resolution and/or IP address can be controlled by proxy. Proxies may prevent local troubleshooting, and by design, proxy control software operations may be masked at the local host from scrutiny.

Proxy control software requires testing when inappropriate blockage of site-to-site communications is a function of misdirected control by the proxy, or is the result of another site or service blockage problem.

Successful proxy control requires a working network path to the proxy controller, often located in the cloud, and proxy control problems likely can’t be performed until the proxy is reached.

Troubleshooting network control proxy software and its agent/linkage software requires the removal of proxy control. Test whether the proxy stack is delivering incorrect blocks or presenting problems to desired and permitted target sites. If the proxy can be removed, and communication is successful, then troubleshooting points to problems in the network control proxy software stack. Troubleshooting the network control proxy stack is usually performed by a trained administrator or network engineer familiar with the specific software stack.

{{< note respectIndent=false >}}
If a proxy control is in the network circuit/stack, standard troubleshooting methods may fail. Only the proxy control vendor’s troubleshooting methods are successful in this case because the proxy controls the network circuits in non-standard ways.
{{< /note >}}

## IPv4 and IPv6 Troubleshooting

The aforementioned recommended tools and techniques should work with both IPv4 and IPv6 seamlessly. Where separate tools are necessary, an equivalent IPv6-specific tool is often available on modern hosts. The `ping6` app, found in some operating systems, exclusively pings IPv6 hosts.

Depending on the operating system family and version, two separate-but-equal networking stacks (IPv4 and IPv6) share the same network adapter. One stack may pass IPv4 traffic but not IPv6 traffic, or the reverse. When a DHCP address is given for each protocol, a DNS resolver may be given on the IPv6 protocol that cannot be found by an app that can only inquire IPv4 resolvers, and vice versa. If DHCP delivers a mixture of IPv4 and IPv6, examine both protocols when troubleshooting to complete a network connection successfully.

In some operating systems, there are equivalent tools made exclusively for IPv6 traffic. For example, in Linux it’s common to see `ip6tables` as a separate netfilter component used to handle and route IPv6 traffic, because standard `iptables` does not. `nftables`, an `iptables` replacement, works with both IPv4 and IPv6.

Priorities must be set when two protocols compete for the same resources. For example, a network interface card connection in the host. By default, Microsoft Windows prioritizes IPv6 over IPv4, while Linux commonly does the reverse. A host stack may also have IPv6 turned off, which is not recommended in Windows, but is nevertheless common in all hosts. It’s often an attempt to remove unwanted traffic and network card contention in environments where IPv6 isn’t commonly used. Most network engineers recommend against this, because IPv6 resources are used more seamlessly today.

### IPv6 Tunneling

When IPv4 was running out of addresses, the large host and network address space rendered by IPv6 was seen as a huge necessary change, even though many routers were not IPv6-compatible. Network client protocol stacks were also not mature. However, any of these stacks may still be in use, and must be examined for version before troubleshooting. Several different methods of tunneling IPv6 over IPv4 were invented and may still be found in some network configurations today.

For example, IP6to4 is a useful protocol used when a downstream link cannot support IPv6 traffic, as many international ISPs still do not support IPv6. Sometimes users inadvertently leave IPv6 enabled, leaving accidental responders active within their hosts. The IP6to4 protocol encapsulates IPv6 packets into IPv4 packets, disassembling the IPv4 information, and transforming the packet into an IPv6 packet once again. This tunneling action is deprecated but must be used where IPv6 routing isn’t available in the desired routing path between hosts.

IP6to4 is a handicapped stack, and requires static routing, so that a target IPv6 host can be found. Because of this and other problems, Microsoft deprecated this method of packet tunneling, however IPv6 packet tunneling is still found on older hosts.

## Conclusion

Successful network communication is completed when there is an electrical circuit, the host network stack works, and downstream routers/gateways/switches can connect to a target host/site. The network stack resident in the host is bound by protocols and firewall rules. There are iterative steps involving tools that are available by default in most modern host operating systems.

Troubleshooting begins by examining the correct values in the host network stack, then the firewall rules. Proxy-controlled network stacks must be treated differently, because they may involve both business policy and specialized treatment germane to the stack proxy.

Although IPv6 integration is treated separately as a protocol, most modern stacks use a separate set of equivalent tools to IPv4 for troubleshooting. Older IPv6 implementations can be buggy, and require stack version-specific techniques to troubleshoot IPv6 connectivity or interference issues with IPv4.