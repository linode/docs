---
slug: introduction-to-osi-networking-model
description: 'This guide introduces and explains the levels of the OSI networking model and how to interact with the network architecture.'
keywords: ['OSI network model','OSI networking','OSI levels','networking model']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-11-01
modified_by:
  name: Linode
title: "An Introduction to the OSI Networking Model"
external_resources:
- '[OSI Model on Wikipedia](https://en.wikipedia.org/wiki/OSI_model)'
- '[Internet Protocol](https://en.wikipedia.org/wiki/Internet_protocol_suite)'
- '[Transmission Control Protocol](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)'
- '[User Datagram Protocol](https://en.wikipedia.org/wiki/User_Datagram_Protocol)'
- '[ITU series of X.200 recommendations](https://www.itu.int/rec/T-REC-X/en)'
- '[Ubuntu ip man page](https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html)'
- '[Ubuntu nast man page](https://manpages.ubuntu.com/manpages/jammy/man8/nast.8.html)'
- '[Ubuntu tcptrack man page](https://manpages.ubuntu.com/manpages/jammy/man1/tcptrack.1.html)'
- '[Ubuntu tcpdump man page](https://manpages.ubuntu.com/manpages/jammy/man8/tcpdump.8.html)'
- '[Wikipedia List of IEEE 802 family of standards](https://en.wikipedia.org/wiki/IEEE_802)'
- '[FileZilla](https://filezilla-project.org/)'
authors: ["Jeff Novotny"]
---

Computer networking is a complicated subject, with many interconnected layers and interactions. To help developers and engineers understand how the various networking components work together, several conceptual models have been developed. The [*Open Systems Interconnection*](https://en.wikipedia.org/wiki/OSI_model) (OSI) Model is a popular model that divides the networking stack into seven layers. This guide explains the OSI Model and describes each layer. It also lists the tools available for each layer and contrasts the OSI Model with the competing [*Internet Protocol suite*](https://en.wikipedia.org/wiki/Internet_protocol_suite).

## What is the OSI Model?

The OSI Model provides a method for understanding how end-to-end internet communications work. It deconstructs the networking process into seven layers, each representing a different step of the transmission chain. Each layer has its own function and is responsible for well-defined tasks. Most user data passes through each layer upon both ingress and egress.

The OSI model was originally developed in the 1970s and 1980s under the oversight of the *International Organization for Standardization* (ISO). It is formalized in the ITU-T series of [X.200 recommendations](https://www.itu.int/rec/T-REC-X/en). The model is mainly conceptual in nature and models the network at a high level of abstraction. It is designed to encourage a shared consensus of network standards and interoperability. While it has never been fully applied, it has gained popularity as a good educational model.

The OSI Model originally included a number of network protocols to implement each of the different layers. However, these protocols were determined to be too complex and difficult to implement. They also involved too drastic of a change to established practices. Therefore, they were never adopted, and protocols from the Internet Protocol (IP) suite were used instead. The standard network protocols in use today show more complexity and do not perfectly align with the OSI model.

The seven layers are numbered from lowest to highest. The highest layer is closest to the user applications, while the lowest relates to physical transmission. User data passes sequentially from the highest layer down through the lower layers until the device transmits it externally.

The OSI model encourages a strict encapsulation model. Data from a higher level becomes part of the lower layer message. The data packet received from the higher layer is known as a *service data unit* (SDU). The lower layer prepends a header to the SDU. In some cases, it might also append a footer. The header and footer contain information intended for the peer layer of the receiving device. After the additional information is concatenated to the original packet from the higher layer, the message is called a *Protocol Data Unit* (PDU). The PDU is designed to be processed at the same layer on the destination node. This continues until the data reaches the physical layer. At this point, it is converted to a bitstream and physically transmitted to the receiver.

On the incoming side, the order is reversed. Traffic is first received at the physical layer. It then passes upward one layer at a time. At each layer, the receiving layer reviews the information in the header and removes the encapsulating material. If necessary, the packet is then passed to the higher layer. This process continues until the packet is completely consumed.

## The OSI Layer Architecture

The seven layers, from lowest to highest, are listed below. Each layer is described in a separate section later in this guide.

1.  **Physical Layer**
2.  **Data Link Layer**
3.  **Network Layer**
4.  **Transport Layer**
5.  **Session Layer**
6.  **Presentation Layer**
7.  **Application Layer**

The acronym "All People Seem To Need Data Processing" can be used to remember the layers from highest to lowest. Not all data flows begin at the application layer. Lower layers negotiate automatically after they are configured, even if they are not serving any higher-layer application. Additionally, packets might only be partially processed by intermediate devices. For example, a core router examines packets at the network layer. It then forwards the packet, sending it back to the data link and physical layers to be transmitted.

Each of the seven layers within the OSI is given its own set of responsibilities. The layers are numbered from the lowest layer, the physical layer, to the high-level application layer. Egress data passes from higher to lower layers. Ingress data is reversed and passes from the lowest layer to the upper layers.

## Layer 1: The Physical Layer

The lowest layer is responsible for transmitting data to another device using some type of physical medium. It handles characteristics of the physical connection between nodes. All networked devices, from high-end network routers, mobile phones, and laptops, down to simple repeaters, transmit packets using the physical layer. Therefore all devices must use physical layer technologies to communicate with other devices. The physical layer converts data packets into a signal representing a stream of bits.

This signal can be transmitted using a variety of techniques, including electrical, optical, and wireless encoding. Some examples of physical layer technologies include Wi-Fi, Ethernet, USB, and SONET/SDH. The implementation of this layer usually happens in hardware through a chip, rather than software. Physical layer standards usually include hardware specifications for the pin layout, cable attributes, and data encoding. However some attributes might be software controlled, including physical duplex and framing.

Physical layer protocols are responsible for implementing the following functionality:

-   Voltage levels
-   Physical data rates
-   Physical connector specifications
-   Maximum transmission length
-   Modulation or channel access
-   Framing and bit stuffing
-   Signal timing and frequency
-   Transmission mode/duplex
-   Auto-negotiation

Many transmission standards specify details for both the physical and data link layers. The Ethernet standard is a good example.

### Physical Layer Tools

In a lab environment, a multimeter or oscilloscope can verify quality and compliance. In a real world setting, there is no practical way to debug physical layer problems. A trial and error process of swapping out cables, connectors, and physical ports is often required. If a cable is flakey or defective, throw it out and use another.

## Layer 2: The Data Link Layer

The data link layer is responsible for transferring data between two nodes that are either directly connected or lie within the same network. To send data to a different network, network layer functionality is required. Layer two protocols can often correct physical layer errors using bit correction algorithms. At the data link layer, data is transported inside a *frame*. A network switch is an example of a data link layer device.

Layer two specifications explain how to establish a connection and transmit data to another node. The *Institute of Electrical and Electronics Engineers* (IEEE) organization defines many of the data link specifications under the [IEEE 802 family of standards](https://en.wikipedia.org/wiki/IEEE_802). Some of these standards include Ethernet, Wireless LAN, Bluetooth, and Radio, while non-802 standards include the Point-to-Point Protocol (PPP) and Frame Relay. Unlike IP addresses, layer two addresses occupy a flat addressing space. This means the addresses are not hierarchical or routable.

The IEEE 802 specifications can be further subdivided into two sub-layers, each with their own responsibilities.

-   **Logical Link Control (LLC)**: This is the higher of the two layers. It acts as an interface between the network layer and the MAC layer. It encapsulates higher-layer protocols, and handles flow control, multiplexing, and error detection. However, some of those functions might also be handled at higher layers.
-   **Medium Access Control (MAC)**: The MAC layer is closely entwined with the physical layer. The MAC layer controls network access, frame synchronization, byte/bit stuffing, and link addressing. It encapsulates data from the LLC layer into the appropriate format for the link layer protocol. It also adds and removes a frame checksum to help identify erroneous frames and implements collision detection.

### Data Link Layer Tools

For a complete analysis, a packet capture tool such as [Wireshark](https://www.wireshark.org/) can capture and analyze the frames. However, many Linux commands allow users to examine interface statistics for packet stats and errors. The `ip link` command displays information about the network interfaces on the server. The command output includes the state, MTU, and MAC address of the link. See the [Ubuntu ip command man page](https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html) for more information.

```command
ip link show
```

{{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether f2:3c:93:15:ce:03 brd ff:ff:ff:ff:ff:ff
{{< /output >}}

The `nast` utility is a packet sniffer for use in analyzing LAN traffic. It is not pre-installed, so users must install it using `apt`.

```command
sudo apt install nast
```

Run the command at the `sudo` level and terminate it using the **Ctrl+C** combination. Specify the interface to listen to using the `-i` option. The [Ubuntu nast man page](https://manpages.ubuntu.com/manpages/jammy/man8/nast.8.html) includes more details.

```command
sudo nast -i eth0
```

{{< output >}}
Sniffing on:

- Device:	eth0
- MAC address:	F2:3C:93:15:CE:03
- IP address:	192.0.2.161
- Netmask:	255.255.255.0
- Promisc mode:	Set
- Filter:	None
- Logging:	None

---[ TCP ]-----------------------------------------------------------
192.0.2.161:22(ssh) -> 192.0.2.208:50788(unknown)
TTL: 64 	Window: 501	Version: 4	Length: 112
FLAGS: ---PA--	SEQ: 855325394 - ACK: 3719741052
Packet Number: 1

---[ TCP ]-----------------------------------------------------------
192.0.2.161:22(ssh) -> 192.0.2.208:50788(unknown)
TTL: 64 	Window: 501	Version: 4	Length: 124
FLAGS: ---PA--	SEQ: 855325454 - ACK: 3719741052
Packet Number: 2

Packets Received:		35805
Packets Dropped by kernel:	14803
{{< /output >}}

To list the configuration and capabilities of each network interface, use the `ip netconf` command.

```command
ip netconf
```

{{< output >}}
inet lo forwarding off rp_filter off mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off
inet eth0 forwarding off rp_filter loose mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off
inet all forwarding off rp_filter loose mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off
inet default forwarding off rp_filter loose mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off

inet6 lo forwarding off mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off
inet6 eth0 forwarding off mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off
inet6 all forwarding off mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off
inet6 default forwarding off mc_forwarding off proxy_neigh off ignore_routes_with_linkdown off
{{< /output >}}

## Layer 3: The Network Layer

The network layer lies at the heart of the OSI network stack. It is responsible for addressing packets and routing them across the internet. Layer three data units are known as *packets*. The network layer allows packets to flow across non-adjacent networks. Most routers are network layer devices, although some also implement higher layer functions.

Layer three protocols use the packet destination address to determine the best egress interface for the data. Before reaching its destination, a packet might be routed through many nodes. A *path* consists of all the routers a packet must pass through to reach a specific destination. Each network device a packet transits through is known as a *hop*. At each hop, the network layer processes the packet. If the packet has reached its final destination, the data is sent to the transport layer. Otherwise, the packet receives a new header and footer and is sent back to the data link layer for forwarding to the next hop.

The network layer is responsible for breaking down packets that are too large for the lower layer links into smaller pieces. This process is called fragmentation. At the destination end, the network layer reassembles the fragments back into the original packet. Protocols at the network layer are not required to be reliable, although some protocols might report and retransmit missing packets. Network layer protocols are generally connectionless. Connections and sessions are managed by the higher layers.

Many well-known network protocols operate at the network layer, including the following:

-   The *Internet Protocol* (IP). This protocol specifies the addressing format for the internet.
-   Routing protocols including *Border Gateway Protocol* (BGP) and *Open Shortest Path First* (OSPF). These protocols are responsible for determining the best path to the final destination.
-   The *Multiprotocol Label Switching* (MPLS) protocol. In reality, MPLS is a multi-layer protocol. It includes functionality from both the network and transport layers.
-   The various *Internet Control Message Protocol* (ICMP) control messages, and related applications like `ping` and `traceroute`.
-   Multicast standards, including the *Internet Group Management Protocol* (IGMP).

### Network Layer Tools

The `ip` command is also quite useful for network layer problems. The `ip addr show` command displays the IP address associated with each interface.

```command
ip addr show
```

{{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether f2:3c:93:15:ce:03 brd ff:ff:ff:ff:ff:ff
    inet 192.0.2.161/24 brd 233.252.129.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 2a01:7e00::f03c:93ff:fe15:ce03/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 5316sec preferred_lft 1716sec
    inet6 fe80::f03c:93ff:fe15:ce03/64 scope link
       valid_lft forever preferred_lft forever
{{< /output >}}

The `ping` and `traceroute` commands can determine whether a destination is reachable and track the path the packet follows to reach it. These commands can be used with either the name of a router or an IP address. Terminate the command using the **Ctrl+C** key combination.

```command
ping wikipedia.org
```

{{< output >}}
PING wikipedia.org(text-lb.esams.wikimedia.org (2620:0:862:ed1a::1)) 56 data bytes
64 bytes from text-lb.esams.wikimedia.org (2620:0:862:ed1a::1): icmp_seq=1 ttl=55 time=6.45 ms
64 bytes from text-lb.esams.wikimedia.org (2620:0:862:ed1a::1): icmp_seq=2 ttl=55 time=6.41 ms
64 bytes from text-lb.esams.wikimedia.org (2620:0:862:ed1a::1): icmp_seq=3 ttl=55 time=6.41 ms
64 bytes from text-lb.esams.wikimedia.org (2620:0:862:ed1a::1): icmp_seq=4 ttl=55 time=6.55 ms
64 bytes from text-lb.esams.wikimedia.org (2620:0:862:ed1a::1): icmp_seq=5 ttl=55 time=6.40 ms
64 bytes from text-lb.esams.wikimedia.org (2620:0:862:ed1a::1): icmp_seq=6 ttl=55 time=6.68 ms

--- wikipedia.org ping statistics ---
6 packets transmitted, 6 received, 0% packet loss, time 5008ms
rtt min/avg/max/mdev = 6.398/6.483/6.678/0.101 ms
{{< /output >}}

To view the contents of the system routing table, use the `ip route show` command. The `ip neighbor show` and `ip nexthop show` commands are also often useful.

```command
ip route show
```

{{< output >}}
default via 192.0.2.1 dev eth0 proto static
192.0.2.0/24 dev eth0 proto kernel scope link src 192.0.2.161
{{< /output >}}

## Layer 4: The Transport Layer

The transport layer works in conjunction with the network layer to coordinate data transfer between the host and the destination. While the network layer is more concerned with addressing and routing, the transport layer is responsible for segmenting and ordering the data. It must collect and interleave packets from many different higher-level protocols. It must also associate these packets with the correct session. On the receiving side, the transport layer reassembles the packets and detects any missing segments. Some transport layer protocols also handle quality of service, congestion avoidance, reliability, and packet retransmission.

Transport layer protocols are either connection-oriented or connectionless. The two most important transport protocols are the [*Transmission Control Protocol*](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) (TCP) and the [*User Datagram Protocol*](https://en.wikipedia.org/wiki/User_Datagram_Protocol) (UDP). Transport layer data units are sent from, and received on, a specific port. The full destination address consists of both an IP number and a port. For ease of use, many protocols are associated with a specific, well-known port.

-   **Transmission Control Protocol**: TCP is a robust connection-oriented protocol. It implements reliability and error-checking and guarantees packets are delivered in order. It is used for applications that cannot tolerate corrupted or missing packets, such as file transfers and email. TCP segments data based on the *maximum transmission unit* (MTU) of the egress interface. Some portions of the TCP specification, including the graceful close technique, better align with the session layer of the OSI model.
-   **User Datagram Protocol**: UDP is a connectionless, lightweight protocol that is far less complex than TCP. Unlike TCP, UDP does not segment packets. It is not necessarily reliable and does not retransmit packets. It is a best effort option for performance-oriented applications that can tolerate missing or corrupted packets. UDP is a good choice for streaming video and applications using built-in buffering mechanisms.

The *Transport Layer Security* (TLS) protocol somewhat aligns with the OSI transport layer, but it also provides features from the higher layers.

### Transport Layer Tools

There is no generic transport layer monitoring tool for Linux. Instead, tools are available for specific protocols. For TCP, the `tcptrack` utility displays a list of current sessions. `tcptrack` does not come preinstalled, so install it using `apt`.`

```command
sudo apt install tcptrack
```

Use the `-i` option and the name of the interface to see all connections active on the interface. There is no corresponding UDP equivalent because UDP is connectionless. The [Ubuntu tcptrack man page](https://manpages.ubuntu.com/manpages/jammy/man1/tcptrack.1.html) provides full usage instructions. Terminate the command using the **Ctrl+C** key combination.

```command
sudo tcptrack -i eth0
```

{{< output >}}
 Client                Server                State        Idle A Speed
192.0.2.208:50788  192.0.2.161:22     ESTABLISHED  0s     10 KB/s
{{< /output >}}

`tcpdump` is a packet analyzer for monitoring outgoing and incoming packets on a specific interface. The `-i` attribute indicates the interface to listen to. The `eth0` interface is the default. It can also monitor UDP packets. `tcpdump` is also able to detect packets at lower layers than the transport layer, while another option allows users to view the Ethernet headers. Consult the [Ubuntu tcpdump man page](https://manpages.ubuntu.com/manpages/jammy/man8/tcpdump.8.html) for a list of options. Terminate the command using the **Ctrl+C** key combination.

```command
sudo tcpdump
```

{{< output >}}
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
18:52:14.806270 IP testworkstation.ssh > ti.bb.online.no.50788: Flags [P.], seq 866780550:866780658, ack 3719759268, win 501, options [nop,nop,TS val 3917578569 ecr 3770283712], length 108
{{< /output >}}

## Layer 5: The Session Layer

The session layer is relatively lightweight. It is used to establish and maintain ongoing sessions of longer duration between two systems. It handles the negotiation of the connection and closes it when no longer required. The session layer often manages user authentication during the establishment phase. Sometimes the session layer provides a way to suspend, restart, or resume a session. Network sockets operate at this layer, and protocols including FTP and DNS make substantial use of session layer functionality. It is also heavily used by streaming services, and web/video conferencing. For some services, session layer protocols use flow control for proper synchronization.

### Session Layer Tools

In many applications, the session layer is bundled together with the presentation and application layer. All layers are managed as a single unit. Therefore there are no generic tools for the session layer or any of the higher layers. Instead, users must employ the application tools. For instance, the [FileZilla](https://filezilla-project.org/) FTP application provides logs and a `debug` menu to help resolve FTP connectivity problems at the session level.

## Layer 6: The Presentation Layer

The presentation layer is responsible for translating content between the application layer and the lower layers. It handles data formatting and translation, including data compression/decompression, encoding, and encryption. For some higher layer applications, the presentation layer might also handle graphics and operating system specific tasks. In most modern applications, the presentation and application layers are tightly integrated.

A example of a protocol residing at the presentation layer is *Multipurpose Internet Mail Extensions* (MIME), for formatting email messages. The *Transport Layer Security* (TLS) encryption protocol is also a presentation layer application.

## Layer 7: The Application Layer

The application layer is the highest layer and the one that is closest to the end user of most software applications. There is a tendency to think of this layer as being equivalent to the application, but the user applications actually directly interact with this layer. Many application layer protocols tend to be closely bound to the client software. They manage tasks including message handling, printer access, and database access. Some examples of application layer protocols include the following:

-   *Hypertext Transfer Protocol* (HTTP)
-   *Simple Mail Transfer Protocol* (SMTP)
-   *Telnet*
-   *Secure Shell* (SSH)
-   *File Transfer Protocol* (FTP)
-   *Simple Network Management Protocol* (SNMP)
-   *Domain Name System* (DNS)

## End-to-End Processing Using the OSI Model

It is possible to use the OSI Model to explain how a user request passes from a client application down to the physical layer. For instance, depending on the web application, the following steps might occur when browsing the internet.

1.  The web browser client interacts with an application protocol at the application layer. The user request is translated to either an HTTP or HTTPS message. The DNS protocol is used to convert the domain name into an IP address.
2.  If HTTPS is used, the presentation layer encrypts the outgoing request using a TLS socket. If necessary, the data is encoded or translated to a different character set.
3.  At the session layer, a session is established to send and receive the HTTP/HTTPS messages. In most cases, the session layer opens a TCP session because web browsing requires reliable transmission. However, some streaming applications might opt for a UDP session.
4.  The transport layer TCP protocol initiates a connection to the destination server. When the session is operational, it transmits the packets in their original order and ensures all packets are sent and received. UDP sends all packets out in a best effort manner without a direct connection and does not wait for any acknowledgments. If necessary, the data packets are segmented into smaller packets. The transport protocol forwards all outgoing packets to the network layer.
5.  At the network layer, the routing protocols decide what egress interface to use based on the destination address. The data, including the address information, is encapsulated inside an IP packet. The packet is then forwarded to the data link layer.
6.  The data link layer converts the IP packets to frames, which might result in further fragmentation. It builds the frames based on the data link protocol being used.
7.  At the physical layer, the frames are converted to a stream of bits and transmitted onto the carrier media.

## Drawbacks of the OSI Model

The OSI Model is useful as a tool for understanding networks. However, it has a number of drawbacks.

-   OSI is very complex, with too many layers. Some of the layers are much more significant and important than others.
-   There are too many OSI standards documents and recommendations.
-   The model does not reflect the real world network structure. In many cases, actual network models span multiple layers and do not align with the boundaries of the OSI layers.
-   The OSI protocols were not widely implemented and the model does not map very well to the protocols in use today.

### A Comparison Between the OSI Model and the Internet Protocol Suite

The Internet Protocol suite is an alternative to the OSI model. The IP suite has four layers.

1.  **Application layer**: This maps to the OSI application and presentation layers and much of the session layer.
2.  **Transport Layer**: This includes some parts of the OSI session layer as well as the transport layer. The TCP and UDP protocols are part of this layer.
3.  **Internet Layer**: This layer closely matches the OSI network layer definition and includes the IP protocol.
4.  **Link Layer**: This encompasses both the physical and data link layers of the OSI model.

The IP suite is considered less prescriptive and more flexible, and better reflects actual usage. Protocols such as TCP/IP and the main routing protocols are derived from the IP suite. However, the IP suite is not as informative, conceptual, or comprehensive as the OSI model, and is not as widely-used as a teaching aid. To properly understand networking concepts, engineers should familiarize themselves with both models.

## Conclusion

The OSI Model is a framework for understanding network communications. It breaks the network stack down into seven layers. The layers range from the low-level physical layer up to the application layer residing closest to a computer user. At the heart of the model are the mid-level network and transport layers. The network layer addresses and routes packets, while the transport layer establishes and maintains a connection with a far-end device.

Although the OSI Model is a handy learning model, it is relatively abstract and does not always reflect real world behavior. The OSI-based protocols were never really implemented, and most commonly-used network protocols are more closely related to the IP suite. However, the OSI-model is integral to many networking methods, and many of the common networking tools still map to the different OSI layers.