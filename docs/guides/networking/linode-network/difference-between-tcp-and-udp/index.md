---
slug: difference-between-tcp-and-udp
description: 'What is the difference between TCP and UDP? This guide explains how each works, the key differences between these two internet protocols. Learn more here.'
keywords: ['difference between tcp and udp','what is tcp and udp','tcp vs udp','tcp/udp']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-25
modified_by:
  name: Linode
title: "What is the Difference Between TCP and UDP? "
title_meta: "The Difference Between TCP and UDP Explained | Linode"
external_resources:
- '[IETF TCP RFC 793](https://datatracker.ietf.org/doc/html/rfc793)'
- '[IETF UDP RFC 768](https://datatracker.ietf.org/doc/html/rfc768)'
authors: ["Jeff Novotny"]
---

Many users might not understand the network protocols they are using, but networking is a critical topic for application programmers and architects. In particular, the choice between the *Transmission Control Protocol* (TCP) or the *User Datagram Protocol* (UDP) can drastically alter how an application behaves. This guide introduces both transport protocols and explains the difference between TCP and UDP. It also discusses the advantages of both protocols and when they should be used.

## An Introduction to the TCP and UDP Networking Protocols

A set of standards known as the *Internet Protocol* (IP) suite governs the end-to-end transmission of network traffic across the Internet. This set of protocols is sometimes referred to as the *TCP/IP* suite, reflecting the centrality of TCP in the network. The TCP/IP suite thoroughly describes the procedures used for transmitting and routing network data. It outlines the IP addressing scheme, and explains how traffic should be encapsulated into packets. These widely-accepted standards allow for full interoperability between routers and clients.

The TCP/IP suite divides the communication channel between the source and the destination into different layers. Each layer is modular and has a particular scope within the networking stack. Protocols at different layers typically communicate with each other through a well-defined interface. From the highest to lowest level, these layers are:

- **Application Layer**: Users directly interact with the networking stack only at the application layer. Applications collect and assemble the data to transmit. Each application chooses the transport protocol that best meets its requirements. Applications such as HTTP and FTP are part of this layer.
- **Transport Layer**: This layer establishes a channel for host-to-host communications. The destination can reside either on the local network or on a remote network anywhere in the world. Transport protocols can be either connection oriented or connectionless. A communication port is associated with each application using the transport layer. The main transport protocols are TCP and UDP.
- **Internet Layer**: The internet layer contains the core functionality associated with the modern internet. The Internet Protocol handles implementation of this layer. It constructs IP packets, complete with source and destination *IP addresses*, and transmits them across the network. This layer also handles the routing of packets across the network from source to destination. To learn more about the internet Layer, see our guide [How to Understand and Use IP Addresses](/docs/guides/how-to-understand-ip-addresses/).
- **Link Layer**: This layer handles the low-level transmission of packets across the physical layer without the use of routers. An example of a link-layer technology is Ethernet and the *media access control* (MAC) addressing system. The TCP/IP suite is hardware independent and less concerned with the specifics of packet transmission.

During transmission, data is passed down from one layer to the next. At each layer, the data is encapsulated inside a new packet with header information for the layer. The application layer sends data to the transport layer, which forwards it to the internet layer. Finally, the link layer physically transmits the data. Upon reception, the order is reversed. Data is passed upward from the link layer until it arrives at the application. A full description and tutorial of the TCP/IP suite is available as an [IETF RFC](https://datatracker.ietf.org/doc/html/rfc1180).

TCP and UDP are both associated with the transport layer of the TCP/IP suite. They receive data from higher-level applications, encapsulate it, and forward it onto the IP layer. Their main task is to set up a connection to the destination server. Both protocols are defined in Internet Engineering Task Force (IETF) standards. TCP was defined in [RFC 793](https://datatracker.ietf.org/doc/html/rfc793) and UDP in [RFC 768](https://datatracker.ietf.org/doc/html/rfc768).

The name of the TCP/IP suite reflects the ongoing popularity of TCP over UDP. But both protocols are part of the suite, and applications can use either for their transport mechanism. The two protocols are often referred to collectively as TCP/UDP. Despite the fact they both operate at the same layer, TCP and UDP are very different protocols. They each have distinct advantages and disadvantages. TCP is more reliable and robust, but it is slower and more complex. UDP is fast and simple, yet less reliable.

Applications usually choose either TCP or UDP for their transport layer, but can choose a combination of the two. The choice of transport protocol is usually invisible to users and typically cannot be changed. Some applications allow the user to choose between reliability and speed. This might map to either TCP or UDP internally.

Each application registering with TCP or UDP is assigned a port. The TCP and UDP headers include 16-bit fields for the source and destination ports. TCP and UDP maintain completely independent port numbering systems. TCP port `2000` and UDP port `2000` are different and can both be used at the same time. Popular applications are often assigned an official port number. These are called *well-known ports*. For a list of official and unofficial port numbers, see the [Wikipedia list of TCP and UDP ports](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers).

## What is TCP?

As a transport layer protocol, TCP is responsible for establishing an end-to-end channel between two hosts. These hosts, which are typically a client and a server, might be on the same network, or in physically distinct locations somewhere on the internet.

TCP brings new capabilities to the architecture of the internet, including reliable delivery and packet ordering. The original IP design did not provide these features due to the excessive memory this would have required. This makes TCP attractive to any application which requires reliable packet delivery.

During regular operation, TCP receives packets from an application. It fragments the packets and forwards them in sequential order to the IP protocol. The IP process encapsulates each fragment in an IP header and adds all necessary information, such as the source and destination addresses. It then sends the packet to the link layer for physical transmission. At the destination, the TCP protocol receives the fragments, now stripped of their headers, from the IP layer. It reassembles the packets, and requests re-transmission of any missing fragments. When the packet is complete, TCP forwards it to the relevant application.

Due to its flexibility and usefulness, TCP is one of the most common network protocols. Here are some of its main features and advantages.

- It is connection oriented. TCP establishes a connection between the client and a server using a three-way handshake. It maintains this connection as long as it is required and closes it when communication is complete.
- The client and server must acknowledge the connection and synchronize certain details before transmitting any packets. This ensures the server is always ready to receive data.
- Over the course of the connection, TCP might maintain multiple bidirectional data sockets.
- It fragments its data into smaller packets for easier transmission. These packets are reassembled at the destination.
- It numbers each packet and transmits the packets in proper sequence. It also ensures packets are delivered to the remote application in the original order. Because IP packets are routed independently, packets might arrive in a different order. In this case, TCP must wait for outstanding packets.
- It prioritizes reliability and guarantees the delivery of packets. The TCP protocol requires the receiver to acknowledge the packets it has received. If the sender does not receive an acknowledgement in time, it retransmits the packet. It also allows the recipient to request retransmission of any missing packets by re-acknowledging the last successfully received packet.
- TCP guarantees data integrity. It uses a TCP checksum to ensure arriving data has not been corrupted.
- It implements some advanced features including exponential back-off and flow control. This helps detect and avoid congestion in the network.

TCP also has some drawbacks and they are included in the list below.

- It takes longer to set up a connection and is relatively slow. Due to its overhead, it is less efficient than UDP.
- It is relatively heavyweight and requires more server processing power and memory. The protocol is relatively complex.
- It does not support broadcasting.
- Although it is more secure than UDP, TCP has some security vulnerabilities. It is susceptible to denial of service attacks and connection hijacking.

TCP also does not encrypt packets and does not have encryption support. All encryption and decryption must occur at the application layer. The `tcpcrypt` extension has been proposed to add encryption at the transport layer, but it is not in widespread use.

Some of the applications that typically use TCP include the following:

- HTTP
- FTP
- SSH
- Telnet
- Simple Mail Transfer Protocol (SMTP)

## What is UDP?

UDP is, in many ways, the polar opposite of TCP. UDP is a very stripped down protocol that is designed to quickly transfer data. However, this comes at some cost. It does not guarantee delivery, retransmit packets, or that packets arrive in order. It is very much a best effort protocol, and higher level applications must deal with any irregularities. Nonetheless, it is the best choice for time-sensitive applications.

UDP interacts with the other layers much the same way TCP does. It receives data from the application layer packet, and forwards it to the IP protocol engine in the form of a *datagram*. The IP layer assembles and addresses the packets and the link layer transmits them. At the destination, the IP layer receives the packets and passes them up to UDP. UDP does not reassemble packets or provide any acknowledgements. It only forwards the data directly to the application.

Here are some of the advantages of UDP.

- It is very fast, using little overhead. It transmits a stream of packets with low delay and latency.
- UDP is connectionless. It can start transmitting packets immediately without waiting for a connection to be established.
- It is a very lightweight and simple protocol. It requires very little memory.
- It appends a simple checksum, which the recipient can optionally use to detect errors.

UDP also has some disadvantages.

- UDP transmission is not considered reliable. UDP does not acknowledge packets and does not retransmit any lost packets.
- UDP packets are unnumbered, so packet loss cannot be detected.
- UDP cannot guarantee packets are transmitted or delivered to the application layer in the proper sequence. The application might discard out-of-order packets if it is already processing new data.
- It does not provide any advanced features such as flow control or congestion avoidance and cannot be optimized.
- UDP is less secure. Because UDP is connectionless, an attacker can flood a host with UDP data, causing a DDoS attack.

UDP works well for applications that can tolerate some data loss but are sensitive to delay. It is highly suitable for modern applications based on streams and real-time interaction. Because of its small packet overhead, UDP is useful for transmitting small amounts of data, such as a DNS message. Here are some applications that frequently use UDP, although some use TCP for setup and session maintenance.

- Streaming services
- Voice over IP (VoIP)
- Online gaming
- Domain Name System (DNS) Lookups
- Sensor and monitoring information
- Dynamic Host Configuration Protocol (DHCP)

## What Is the Difference Between TCP and UDP?

Both TCP and UDP are transport protocols at the same level of the TCP/IP suite, and both use well-known ports. But TCP is strong in the areas where UDP is weak, and UDP is weak where TCP is strong. The list below includes some of the main differences between TCP and UDP.

- TCP is connection oriented, while UDP is connectionless. TCP establishes a connection and maintains it for the duration of the session. UDP is datagram oriented and does not require a connection.
- UDP begins transmitting packets immediately without any preamble. TCP must wait for the connection phase to complete before transmitting data.
- TCP is much more reliable than UDP. TCP supports acknowledgments and the retransmission of packets. TCP packets arrive in sequential order at their destination. UDP packets are sent on a best-effort basis and can be lost during transmission. They might not arrive in sequential order.
- UDP is much faster and more efficient than TCP. TCP must deal with the overhead of acknowledgements and retransmission and more extensive packet overhead.
- TCP delivers a byte stream, while UDP transmits a message stream.
- UDP is a lightweight protocol, while TCP is more heavyweight. The variable-length TCP header is much larger than the 8-byte fixed-size UDP header.
- TCP provides advanced features such as flow control and congestion avoidance. UDP is not tunable.

The apparent flaws of UDP regarding its lack of reliability and sequencing are not true flaws. They are a natural consequence of the design of the internet, which was never designed for high reliability. It is more accurate to say TCP provides additional capabilities at the cost of some efficiency.

TCP and UDP are useful in different situations. Although TCP is more common, it is not necessarily better. It is usually used in applications where reliability is more important than speed. TCP is the best choice when all fragments and packets must be received for the data to be usable. A good example is the HTTP protocol used by web browsers. The entire web page must be received. Otherwise the page cannot be displayed. TCP is also good for long-lived connections like a Telnet session, due to the durability of the channel.

UDP is the better choice when speed is critical and applications can tolerate some data loss. A great example is voice over IP. If there is too much delay, the connection becomes unusable. A few dropped packets might cause some static on the call, but this is acceptable for most conversations.

TCP has traditionally been the more common protocol. Most legacy applications and network services use TCP. However, UDP is now widely used in newer technologies including Voice over IP, online gaming, and streaming. It is also good for broadcast and multicast applications. Some applications use a mix of TCP and UDP services. For example, streaming services might use TCP for interface display and configuration and UDP to transmit the music files.

To decide whether to use TCP or UDP, application developers must determine what is most important to them. If guaranteed delivery is the key consideration, TCP is the best choice. If speed is critical and delays cannot be tolerated, UDP is probably better.

## A Summary of the Differences Between UDP and TCP

TCP and UDP are both part of the transport layer in the TCP/IP suite. They establish a communication channel between the source and destination, receiving data from user applications and forwarding it on to the Internet Protocol.

There are several differences between TCP and UDP. TCP is the more complex and heavyweight protocol. It provides reliable delivery and advanced features, but it has more overhead and is not designed for speed. UDP is simple and fast. However, it is not as reliable and does not number its data packets. The choice of UDP vs TCP depends on how an application is used and designed.
