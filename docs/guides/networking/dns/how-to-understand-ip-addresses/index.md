---
slug: how-to-understand-ip-addresses
description: "This guide will help you understand the Internet Protocol (IP) which underpins the entire Internet, as well as IP addresses, and how to describe and use them."
keywords: ['IPv4','IPv6','IP address','Internet Protocol', 'what is ip address']
tags: ['networking']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-30
modified: 2022-09-23
modified_by:
  name: Linode
title: "Understand and Use IP Addresses"
title_meta: "How to Understand and Use IP Addresses"
external_resources:
- '[RFC 791 for IP](https://datatracker.ietf.org/doc/html/rfc791)'
- '[Wikipedia IPv4 Packet Description Page](https://en.wikipedia.org/wiki/IPv4#Packet_structure)'
- '[RFC 2460 for IPv6](https://datatracker.ietf.org/doc/html/rfc2460)'
- '[Subnet Calculator](http://www.csgnetwork.com/ipaddconv.html)'
authors: ["Jeff Novotny"]
tags: ["saas"]
---

The *Internet Protocol* (IP), as described in [RFC 791](https://datatracker.ietf.org/doc/html/rfc791), is the framework that underlies the behavior of the entire internet. The Internet Protocol Version 4 (IPv4) and Version 6 (IPv6) address systems are used to identify interfaces and locate hosts on the network. This allows hosts and routers to determine the path to another networking device and send packets to it. This guide outlines how to understand IP addresses, and how to describe and use them.

## The Internet Protocol and Basic Networking

Network communications are conceptualized in the *Internet Protocol Suite*, which is also known as the *TCP/IP Model*. The Internet Protocol Suite model consists of the following four layers:

- **Link Layer:** The lowest level that guides the physical transmission of packets.
- **Internet Layer:** The layer right above the *Link layer* that establishes inter-networking and defines the network routing mechanisms and the address space.
- **Transport Layer:** The third layer that establishes connectivity between hosts and handles task-specific data exchanges.
- **Application Layer:** The top layer that provides services to the user using data from the network.

{{< note respectIndent=false >}}
The networking layers are sometimes modeled by the seven-layer *Open Systems Interconnection Model* (OSI). The OSI model is very useful for network engineers but does not map as closely to today's internet.
{{< /note >}}

In the OSI model, the IP protocol implements the internet layer. IP is responsible for transmitting packets to the destination, based on the destination IP address and other information in the IP packet header. Transport layer protocols, such as the Transmission Control Protocol (TCP) and User Datagram Protocol (UDP), rely on IP to transmit the actual data. The IP protocol is also used in conjunction with routing protocols such as [OSPF](https://en.wikipedia.org/wiki/Open_Shortest_Path_First) and [BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol) to route packets across the network. This standardization of the networking layers into specific protocols, such as IP, TCP, and UDP, allows all internet devices to communicate.

Each device must have an addressable interface to access the network. This interface can be either physical or virtual. An IP Address uniquely defines an interface on its network. Some IP addresses are public and others are private. Private addresses are used within a *Local Area Network* (LAN) and are not directly connected to the internet. An example might be the different devices in a manufacturing lab. These addresses only have to be unique within their private network. In contrast, an interface that is connected to the internet has a public address. This public address is unique across the wider internet. A private network frequently uses a public interface and address to access the internet. Traffic flowing in and out of the network uses this gateway. All other routers ignore packets transmitted to or from private addresses.

To prevent duplication, the Internet Assigned Numbers Authority (IANA) allocates all addresses. Internet Service Providers (ISP) or Cloud Network Providers, such as Linode, are responsible for allocating IP addresses. These addresses are assigned to individual devices, such as servers and home computers. An IP address can be either static or dynamic. Static addresses remain the same until they are deliberately changed. Because a consistent address is necessary for routing purposes, web servers and other shared resources use static addresses. Dynamic addresses might change each time the device is used. They are typically drawn from a pool of addresses owned by the service provider. The same device might use a different IP address at different times, for example, a mobile phone using different wi-fi networks. Dynamic addresses are often assigned through the Dynamic Host Configuration Protocol (DHCP).

An interface must use an address that is unique within the network. This applies to both public and private networks. Otherwise, a *broadcast storm* can occur, rendering both addresses unusable.

## What is an Internet Protocol?

There are two main versions of the IP protocol. IPv4 was the first widely-used version, and it is still the main protocol used today. IPv6 was added to increase the number of available IP addresses, and both versions are currently used side-by-side. IPv4 is connectionless and provides the best effort service. It is up to higher network layers (such as TCP) to retransmit packets and provide reliable delivery. IP packets can be fragmented, based on the *Maximum Transmission Unit* (MTU) size of the physical connection.

The format of the IPv4 packet is defined in [RFC 791](https://datatracker.ietf.org/doc/html/rfc791). Each packet consists of a header section and a data section. An explanation and diagram of the packet structure can be found on the [Wikipedia IPv4 page](https://en.wikipedia.org/wiki/IPv4#Packet_structure). The most important fields in the header are as follows:

- **Version:** For IPv4, this is always `4`.
- **Internet Header Length**: The number of 32-bit words in the header. The minimum value is `5`.
- **Total Length:** The size of the entire packet, including the header and data, in bytes.
- **Time to Live:** The number of network connections a packet is allowed to pass through before it must be dropped. This attribute is used to prevent routing loops.
- **Source IP Address:** The IP address that the packet originates from.
- **Destination IP Address:** The IP address where the packet should be delivered.

## The IPv4 Address Format

RFC 791 defines the IP protocol's address system. This format is used for both the source and destination addresses inside the IP packet header. Each IP address is 32 bits long, or four bytes. An IP address is expressed as four decimal numbers, each representing an eight-bit octet that can range in value between 0 and 255. A period separates each number in the address, resulting in an address format of `a.b.c.d`, for example, `198.51.100.25`. This convention is known as *dot-decimal notation*. IP addresses can also be expressed in binary or hexadecimal format, although this is typically only used for programming and network engineering purposes.

A server can offer different services at the same address based on the port number of the packet. To use a port number with an IP address, append a colon and the port number to the address. For example, to access the Remote Procedure Call agent at port `530`, use the address `198.51.100.25:530`. Different websites can be hosted on the same server using the same address. The web server delivers the appropriate page based on the domain name and the configuration of the virtual hosts.

The Domain Name System (DNS) eliminates the need for users to know the IP address of the system they want to access. DNS servers translate the domain name to the associated IP address. This process is known as *resolving* the domain.

{{< note respectIndent=false >}}
IP addresses beginning with the octets `198.51.100` are reserved for testing and documentation. The example used in this section is taken from this address space.
{{< /note >}}

## The Use of Networks, Hosts, and Subnets in IPv4

Each IP address can be broken down into two sections, the network component, and the host component. However, the exact position where the network portion ends and the host begins is not the same for every address.

The length of the network portion is somewhat related to a historical concept called the *class* of the address. There were originally five classes, lettered from A to E. They were distinguished by the first four bits of their address spaces. The breakdown of the classes is as follows:

- **Class A:** These addresses start with a `0` as the first bit. The first octet can be between `0` and `127`, leading to an address range between `0.0.0.0` and `127.255.255.255`.
- **Class B:** Addresses in this class begin with the two bits `10`, providing an address space extending from `128.0.0.0` to `191.255.255.255`.
- **Class C:** These addresses start with `110`, leading to an even smaller range. This address space begins with `192.0.0.0` and ends with `223.255.255.255`.
- **Class D:** These addresses start with the four bits `1110`. This class contains the addresses between `224.0.0.0` and `239.255.255.255`. Class D addresses are used for multicast addresses, which allow a sender to transmit a packet to a group of hosts at the same time.
- **Class E:**: Addresses in this class start with `1111`, and include all addresses that are not in any of the other classes.

At one time, there was a connection between the address classes and the length of their network portion versus their host component. In Class A addresses, the first octet traditionally defined the network, and the last three octets defined the host. Class A addresses were used for the largest networks, such as those managed by the major telecommunications companies. This is because they allowed for a large number of hosts. Class B uses the first two octets to define the network, while the last two octets indicate the host. In Class C addresses, the first three octets define the network. This space allows for many small networks, each with only 128 hosts.

IP addresses and network allocations have long since broken away from this system. Most notably, Class A addresses are usually broken down into smaller networks. By convention, many networks still use networks that map to one of the original classes. For example, the Class C address `198.51.100.25` has a network portion of `198.51.100` and a host component of `25`. IPv6 addresses have the network and host components as well.

The *netmask* of an IP address is used to indicate its network component. If a bit in the netmask is set to `1`, it is part of the network. A `0` means the bit is part of the host. For the Class C `198.51.100.25` address, the netmask is `1111 1111 1111 1111 1111 1111 0000 0000`. The network portion of an IP address can be calculated from a bit-wise `AND` operation on the netmask and the full address.

A *subnet* is a portion of a larger network. For instance, all addresses on the `198.51.100` network might be part of one subnet, while addresses starting with `198.51.101` might be on another. Subnets are used to further divide and compartmentalize the network, perhaps between business units or individual offices. Sometimes a network might have only one subnet, which contains all of the addresses in the network. Subnets can have any size and do not have to follow the format of any of the traditional classes. However, they do have to represent a contiguous range.

The first address within a subnet is frequently used to identify the subnet itself. The final address in the space is used for the broadcast address. Typically, this is an address ending with the octet `255`, such as `198.51.100.255`. The broadcast address might be different in a small subnet that does not contain an address ending with the `255` octet.

{{< note respectIndent=false >}}
At times, the term subnet is used to refer to the entire network, even if it is further subdivided into smaller networks. As well, the portion of an IP address describing the host is occasionally referred to as the *rest field*.
{{< /note >}}

## CIDR Notation for IP Addresses

*Classless Inter-Domain Routing* (CIDR) notation is used to concisely represent an IP address along with its network. CIDR can be used to either represent a specific address or a block of addresses in a network. To convert an individual IP address into CIDR format, add a `/` symbol, and then append the length of the network's netmask. To indicate the address block of an entire network, first perform a bit-wise `AND` operation on the netmask and the address. This masks out all the bits used for the host and leaves the network portion of the address. After the address, append the `/` symbol and the length of the netmask.

For the `198.51.100.25` address, `198.51.100` is the network section and the netmask is 24 bits. The CIDR version of this address is, therefore, `198.51.100.25/24`. To determine the CIDR address for the network block, use the bit-wise `AND` operation to convert `198.51.100.25` into `198.51.100.0`. Because there are 24 bits in the network address, append the string `/24` to the end of the address. The CIDR address for the address block is `198.51.100.0/24`. To convert between IP addresses and subnets and between different address formats, try the [IP Subnet Calculator](http://www.csgnetwork.com/ipaddconv.html).

CIDR networks do not have to follow the octet breaks of the old A to E address classes. It is possible to have a netmask that is 23 bits. The CIDR address `192.168.2.0/23` includes both the `192.128.2.0/24` and `192.168.3.0/24` networks. Therefore, CIDR can more intuitively describe the precise scope of an individual network than the older classes ever could. A network with a `/31` network in CIDR notation is used for no more than two hosts. This is typically the endpoints of a Point-to-Point Protocol (PPP) link.

## Reserved IPv4 Addresses and Address Ranges

Certain IPv4 addresses and address ranges have a special meaning and cannot be used for general address assignments. The list below includes some of these addresses:

- **0.0.0.0/8:** When used as a source address, this address indicates the current network.
- **127.0.0.1:** This address is reserved for the localhost interface, also known as the loopback address (commonly called *lo* or *lo0*). This address does not require a hardware interface and is not connected to any network. It is often used for local testing.
- **127.0.0.0/24:** This entire network is reserved for loopback addresses.
- **169.254.0.0/16:** This network is used for link-local addresses. These addresses are only valid on the link they are used on and are not routable. They are often used on Point-to-Point Protocol(PPP) or Multilink Point-to-Point Protocol (MLPPP) interfaces for link identification.
- **224.0.0.0/4:** This range of addresses can only be used for multicast communications. This address range corresponds to the original Class D address space.
- **255.255.255.255:** This address is used for network broadcasts. It sends a packet to all addresses on the local network.
- **192.0.2.0/24, 198.51.100.0/24, and 203.0.113.0/24:** These ranges are "dummy" addresses. They can be used for documentation or testing.
- **10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16:** These addresses are reserved for local communications and private addresses on private networks. Any interface that is not connected to the internet can use these addresses.

A full list of reserved IPv4 addresses can be found on [Wikipedia](https://en.wikipedia.org/wiki/Reserved_IP_addresses).

## IPv6 Addresses

IP version 6 (IPv6) is a redesign of IPv4. The details of the protocol are specified in [RFC 2460](https://datatracker.ietf.org/doc/html/rfc2460). IPv6 was developed because the world was running out of IPv4 addresses and a larger address space was required. IPv6 has 128-bit addresses instead of the 32-bit addresses of IPv4, allowing for 3.4×10^38 unique entries. Both IPv4 and IPv6 are currently used in tandem, although IPv6 is increasingly more common, and many interfaces are assigned an address from each protocol.

Aside from the longer addresses, IPv6 follows most of the same design principles as IPv4. It is not interoperable with IPv4, but all modern networking gear handles both formats. The differences are mostly transparent to the majority of higher-layer applications. The list below includes some of the major differences between IPv4 and IPv6.

- The IPv6 header is simpler than the IPv4 header, but it still includes a version, packet length, hop limit, traffic class, source address, and destination address.
- IPv6 allows for more efficient aggregation of subnets and routing prefixes, which helps route protocols. It allows for updates to the routing prefix in the event the address or router policies change.
- IPv6 multicast capabilities are expanded and simplified.
- IPv6 features enhanced security courtesy of the Internet Protocol Security (IPSec) feature.
- IPv6 does not permit packet fragmentation. Hosts use a feature named Path MTU Discovery to ensure the packets are small enough to pass through the network intact.

The 128-bit IPv6 addresses are written as a series of eight four-digit hexadecimal numbers, which represent 16 bits. Each hexadecimal number can range between 0 to 16. In hexadecimal notation, the letters `a` through `f` represent the numbers 10 to 15, so the range of each digit is 0 to f. Each four-digit hexadecimal number is separated with a colon. A typical example of an IPv6 address is `2001:0db8:ffff:ffff:ffff:ffff:ffff:ffff`.

Because these longer IPv6 addresses can be unwieldy to read and write, a more compact notation has emerged. It allows for the removal of any leading zeros inside a four-digit hexadecimal field. For example, the hexadecimal number `001f` can be written as `1f`. As well, a double colon `::` replaces the longest contiguous string of zero hexadecimal values. Only the longest string of zeros can be replaced because the address would be ambiguous otherwise. For example, the address `2001:0db8:ffff:0000:0000:ffff:000f:ffff` can be simplified and shortened to `2001:db8:ffff::ffff:f:ffff`. To use an IPv6 address in the address bar of a browser, surround the address in square brackets, as in `http://[2001:db8:ffff::ffff:f:ffff]/index.html`.

IPv6 does not have the same historical classes IPv4 does. The most significant 64 bits of the address, or the first four hexadecimal numbers, serve as the routing prefix. The final 64 bits are known as the *interface identifier*. They communicate the host portion of the address. However, IPv6 networks can still be divided into further subnets using CIDR notation. If the `2001:db8:ffff:ffff:ffff:ffff:ffff:ffff` address uses a 64-bit routing prefix, it can be written as `2001:db8:ffff:ffff:ffff:ffff:ffff:ffff/64` in CIDR. The address block of the network is described using the address `2001:db8:ffff:ffff::/64`.

Like IPv4, IPv6 has some reserved addresses. However, the larger address space allows for larger blocks to be allocated and eliminates the need for private addresses.

- In IPv6, the `::1/128` address is used for the loopback interface.
- The `fe80::/8` network represents link-local addresses. The system automatically generates these addresses for IPv6. These addresses provide instant communication across a link without any further configuration.
- The `f00::/8` address block is reserved for multicast addresses.
- Addresses inside the `2001:db8::/32` block can be safely used for testing and documentation.

A variety of inter-operability approaches between IPv4 and IPv6 are sometimes used. IPv6 addresses can be encapsulated inside IPv4 packets. More commonly, IPv4 addresses are mapped to IPv6 addresses. The first 80 bits of these IPv6 addresses are set to `0`, with the next 16 bits set to `1`. The final 32 bits contain the original IPv4 address. An example of an address with this structure is `::ffff:c6:33:64:19/96`. However, most networks use parallel networks and routing stacks for IPv4 and IPv6.

## Finding Your IP Addresses via the Linux Command Line

{{< note respectIndent=false >}}
If you are trying to find the IP addresses of a Linode Compute Instance, you can do so from the Cloud Manager. See [Managing IP Addresses on a Compute Instance](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses).
{{< /note >}}

1.  On Ubuntu and most Linux systems, the `ip addr show` command displays all networking information. The IPv4 address of the system is shown in the `inet` field, while the IPv6 address is referred to as the `inet6` address.

        ip addr show

    {{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:00:5e:00:53:00 brd ff:ff:ff:ff:ff:ff
    inet 198.51.100.25/24 brd 198.51.100.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 2001:db8::32/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 2591998sec preferred_lft 604798sec
    {{< /output >}}

1.  Use the following command to see the addresses without any interface information.

        hostname -I

    {{< output >}}
198.51.100.25 2001:db8::32
    {{< /output >}}

1. On a Mac system, select **System Preferences** from the Apple menu, and then click on the **Network** icon. Select the active connection to see the IP address currently in use.

1. On all systems with a browser, the local IP address can be found using Google Search. Type `what is my IP address` in the search bar. Google Search displays the public IP address in the results.

    {{< note respectIndent=false >}}
The actual IP address could be masked in certain circumstances, resulting in a different public IP address. With a proxy server, only the address of the proxy is shown. VPNs also hide the system address. Keeping your IP address hidden increases the security of your connection and computer.
    {{< /note >}}

{{< note respectIndent=false >}}
The old `ifconfig` Linux command is now deprecated. It can still be used on Ubuntu by using `apt` to install `net-tools`, but this is not recommended.
{{< /note >}}
