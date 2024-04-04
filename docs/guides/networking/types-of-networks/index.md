---
slug: types-of-networks
title: "Different Types of Computer Networks, Explained"
description: "What are the different types of networks and what do they do? This guide discusses the main types of computer networks and what they’re used for."
keywords: ['types of networks', 'networking type', 'network connection types', 'what type of network is the internet', 'type of computer networks']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributors: ["David Robert Newman"]
published: 2023-09-26
modified_by:
  name: Linode
---

Networks vary widely in size and scope. Some are simple and highly localized. Others span the globe – and beyond, even going into space. Picking the right network depends on what and where you want to connect. Your type of application also matters in some cases; for example, there are special networks optimized just for storage devices.This guide describes 10 major network types and where each network might, or might not, make sense.

## Internet

When you say “the Internet,” you probably mean the massive network that goes everywhere on Earth and beyond, now extending to the International Space Station and even to Mars. But there’s also a generic term "internet" with a lowercase "i", that refers to any network of networks.

This is a good place to start because the designs used to tie networks together also apply within a single network. Most networks adhere to one of three fundamental designs: Point-to-point, hub-and-spoke, or meshed.

- **Point-to-point connection**: This represents a direct link between two networks or computers.

- **Hub-and-spoke design**: This configuration connects multiple end-stations (computers, printers, IoT devices) to a central server; for example, multiple PCs utilizing a single server for file storage.

- **Meshed networks**: These networks come in two variations, partial and full. In a fully meshed design, all nodes (servers, routers, switches) connect to all other nodes. This provides the greatest amount of redundancy in case of link or node failures, but also the greatest cost if you’re paying for each link. In a partial mesh, only some nodes are interconnected. The global Internet is a partially meshed network.

The basic building block of the Internet, as well as many other internets, is the TCP/IP protocol suite, a set of open standards that allow all manufacturers’ devices to interoperate.

**Suitable for**: Connectivity between any set of devices, regardless of manufacturer

**Not suitable for**: Very old legacy computers that use proprietary communications protocols

## Personal-Area Network (PAN)

One of the simplest network types is the PAN, which wirelessly connects a few devices close to you. Devices might include your laptop, phone, tablet, and perhaps earbuds or smart speakers.
Bluetooth is the most common protocol for PAN devices. Without obstacles (people, walls, metal, and so on), Bluetooth has a range of about 10 meters (33 feet). The central concept with PANs is that they’re personal, connecting devices for you and you alone.

A variant of the PAN is the Car Area Network (CAN), which uses Bluetooth or WLAN (covered below) to link devices within a car. CANs then bridge traffic to a cellular connection to the global Internet.

**Suitable for**:

- Tying together personal devices
- Devices in close proximity

**Not suitable for**:

- Connecting multiple users’ devices
- Connecting one user’s devices over any significant distance

## Local-Area Network (LAN)

When LANs first appeared years ago, they consisted of a few PCs and printers in close proximity, always in an office setting, and always communicating either with a locally attached server or directly with one another. This was a revolutionary departure from previous network designs, where all intelligence lived on a central mainframe or minicomputer, and end-stations were essentially just dumb terminals.

Today the meaning of LAN is much broader. You may have a wired LAN in your office or at home. You may connect a much broader range of devices to LANs, including surveillance cameras, Internet of Things (IoT) devices, and even solar power controllers in home networks.

In office settings, it’s common to segment networks into many LANs, with one or more for each workgroup (accounting, engineering, sales, etc.) or each physical area (such as floors in office buildings).

The key building block for LANs is the Ethernet switch, which ties together devices in each area and provides a common broadcast domain for attached devices.

Enterprise-grade switches also support virtual LANs (VLANs), which provide multiple segments on the same switch. For example, you might configure two VLANs on a switch, allocating separate groups of ports for users in your accounting and engineering teams. Each VLAN forms its own broadcast domain, meaning neither team can see the other team's traffic.

**Suitable for**:

- Wired connection of computers, servers, and printers
- Data sharing among users in a home or office

**Not suitable for**:

- Computers across town or the world
- Settings where cable installation isn’t feasible

## Wireless LAN (WLAN)

Connections to a wireless LAN work over the air, using radio waves. Most people think "Wi-Fi" when it comes to LAN connections without wires. Wi-Fi is a marketing term coined by an equipment makers’ consortium; the IEEE’s 802.11 working group defines the actual Wi-Fi technical standards.

In a typical Wi-Fi setup, your laptop, phone, and tablet all connect to a local access point, which then bridges traffic between wireless and wired networks. You can also set up a peer-to-peer WLAN connecting two devices; this is handy in places where there isn’t any other network connectivity (for example, aboard a plane).

Performance tends to be lower on wireless networks than on wired ones. That’s because the airwaves are a shared-access medium, accessible by only one device at a time.

In practical terms, this usually means when one station receives or sends traffic, all other connected stations need to remain quiet. There is a Wi-Fi technology called multiple-in, multiple-out (MIMO) where multiple stations can transmit and receive at the same time. MIMO has been implemented on many consumer and enterprise-grade WLAN devices.

Security can be a concern with WLANs, even though it’s possible to secure them at least as well as wired networks. In general, you never want to connect to an open access point at public places such as cafes or airports without also using a virtual private network (VPN, covered below).

**Suitable for**:

- Over-the-air connectivity for computers, phones, tablets, and printers
- Settings where cable installation isn’t feasible

**Not suitable for**:

- Computers across town or the world
- Applications where high performance is critical

## Virtual Private Network (VPN)

Most networks carry traffic using the TCP/IP protocol suite – but as originally designed, TCP/IP does nothing to secure traffic against spoofing or interception. VPNs add security by creating a private network overlay atop any public network.

There are many VPN types, but all provide the key functions of authentication and encryption. Authentication simply means each side verifies its identity, typically using certificates or other digital keys. This is an important first step since you don’t want just anyone connecting to your secure site. Encryption is the means of encoding and decoding data in a way that’s unreadable by attackers.

VPNs use authentication to set up a secure tunnel across a public network, and then send encrypted traffic through that tunnel. The tunnel endpoints could be anywhere: You could set up a site-to-site VPN, where you connect two office locations, or a road-warrior VPN, where one endpoint is your laptop and the other is your office location or a server in your cloud deployment. One potential drawback is that VPNs add overhead, degrading performance.

**Suitable for**:

- Protection of data in flight, even across unsecured networks
- Remote access from hotels, airports, and cafes
- Remote access to sensitive internal networks and servers

**Not suitable for**:

- Applications where maximum performance is important

## Storage Area Network (SAN)

As your server count grows, it’s often more efficient to provide pools of shared storage rather than equipping each new server with extensive local storage. That’s where SANs come in. They provide a dedicated high-speed network connecting servers with shared storage pools.

SANs differ from network-attached storage (NAS) devices, where all disks reside within a single chassis. In contrast, SANs allow shared storage pools made up of many storage arrays. SANs also use specialized storage protocols such as Fibre Channel or iSCSI optimized to speed input/output. Networks running Fibre Channel often use SAN switches to tie together servers and storage pools.

**Suitable for**:

- High-speed access to shared storage pools
- Organizations in need of highly scalable data storage

**Not suitable for**:

- General-purpose network connectivity

## Passive Optical Network (PON)

Although most LANs use copper cabling, fiber-optic cabling not only has far higher bandwidth capacity but also can carry different users' traffic over much longer distances. Fiber's unique characteristics enable PONs, which use optical splitters to divide and combine user traffic. Telecom providers and ISPs typically provision PONs.

In a PON design, an optical line terminal (OLT) serves as a central concentrator, connecting the network to the rest of the world. Optical splitters connected to an OLT then divide and combine user traffic respectively headed downstream and upstream. At the network edge, an optical network termination (ONT) device terminates the upstream fiber connection and bridges traffic to and from local devices, such as computers and phones, connected via copper patch cables.

The "passive" part of PON indicates that optical components don’t require power to drive signals, reducing power and heat. Another potential energy saving: The single-mode fiber cabling in PONs can carry signals much further than copper cabling, eliminating the need for powered repeaters. Depending on the transceivers used, a single run of single-mode fiber can carry traffic up to 40 kilometers. In contrast, the distance limit for the most common copper cabling is 100 meters.

Single-mode fiber tends to be more expensive than copper, mainly due to transceiver and fiber termination costs. While PONs can be an excellent option in new deployments, you need to factor in the cost of ripping out copper cabling when evaluating them as a replacement technology.

**Suitable for**:

- Connectivity over relatively long distances
- Networks with limited power and heat budgets

**Not suitable for**:

- Networks with significant investment in existing cabling

## Metropolitan-Area Network (MAN)

MANs connect networks and computers within a wider range than any LAN could. A single MAN could encompass one city, multiple cities and towns, or a large area within a city with multiple large buildings.

MANs usually employ fiber-optic cabling to connect LANs. It’s a common practice for telecom providers and ISPs to provision “dark fiber” (unused capacity) around a city, and then “light” the fiber as they connect customer networks. Sometimes cities build their own dark fiber networks, and then lease capacity to telecom providers, ISPs, and private companies. Metro Ethernet is an interesting connectivity choice; in recent years, the LAN technology has been extended to connect systems over distances as great as 100 km (about 62 miles).

MANs are a good option when you have multiple sites within a metropolitan region. You may be able to create a virtual overlay network using existing dark fiber.

**Suitable for**:

- Connectivity within a metropolitan area or large campus
- Connectivity that can be provisioned and managed by an ISP or telecom provider

**Not suitable for**:

- Smaller LANs or campuses

## Wide-area network (WAN)

While the global Internet is the best-known example of a WAN, the term generically refers to any network that connects devices or networks over long distances. Telecom providers and ISPs operate WANs and sell capacity to national and multinational customers to link various business sites.

Some large enterprises operate their own WANs, leasing private lines from telecom providers or even running their own cabling to directly connect locations. While private WANs were more common before the rise of the global Internet, they are still in use. Large organizations may want to avoid putting sensitive traffic on public networks, or may lease private lines to ensure performance is always predictable.

**Suitable for**:

- Connectivity across far-flung locations
- Connectivity of arbitrarily large numbers of devices

**Not suitable for**:

- Designs where all devices are in close proximity

## Software-Defined WAN (SD-WAN)

While many WANs carry TCP/IP traffic, they often aren’t TCP/IP networks themselves. Instead, WANs usually move traffic using lower-layer technologies such as multiprotocol label switching (MPLS), long-term evolution (LTE), and an alphabet soup of older link-layer technologies. WANs running TCP/IP can be difficult to configure and manage.

The variety and complexity of WAN technologies gave rise to software-defined networking, which treats the entire WAN as an abstraction. With SD-WAN, you don’t worry about the physical network; instead, you use centralized management software to set up and manage all flows.

This is a radical departure from decades of WAN management practice. Previously, if you designed a WAN using, say, a mix of MPLS and metropolitan Ethernet circuits, you’d have to think about how you’d interconnect the technologies, what type of devices resided within each network, and how you’d configure them.

SD-WAN software hides all that complexity. You configure the management software to move traffic between points without worrying about what’s between those points. SD-WANs automatically and continuously learn network topology, adapting in real-time to changes in the underlying network and routing traffic around outages.

Initial setup with SD-WANs is also much faster. Provisioning and configuring WANs often took weeks or months; SD-WAN can reduce that time to minutes, greatly improving agility.

**Suitable for**:

- Complex WAN designs
- New WAN overlays

**Not suitable for**:

- Simple LAN or MAN installations

## Conclusion

Since these network types greatly differ in terms of scope and technology, it's important to accurately assess which type makes sense for you. There are really just two questions: What kinds of devices are you looking to connect, and where are they? Armed with this networking knowledge, you can make an informed decision about which network types make the most sense for you.
