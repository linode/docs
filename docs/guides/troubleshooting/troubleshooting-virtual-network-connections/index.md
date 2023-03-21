---
slug: troubleshooting-virtual-network-connections
description: 'It is important to monitor all the network connections that are critical to your business. In this guide, you learn how to troubleshoot Virtual Network Connections for different operating systems.'
keywords: ['troubleshoot vnc', 'troubleshoot linx', 'troubleshoot macOS', 'vnc encryption support']
tags: ['vpn']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-20
modified_by:
  name: Linode
title: "Troubleshooting Virtual Network Connections"
title_meta: "How to Troubleshoot Virtual Network Connections"
authors: ["Tom Henderson"]
---

Troubleshooting Virtual Network Connections (VNC) is a progression of tasks from checking network connections, VNC version compatibility, option tweaks interoperability, and encryption matches.

VNC software serves remote GUI connection needs. It connects hosts that support VNC, regardless of operating system, hardware, or network connection speed. VNC, similar to Microsoft’s Remote Desktop Protocol, is also found to be compatible with Apple’s Remote Desktop Protocol, and many desktops, servers, and IoT devices.

Whether RealVNC, TigerVNC, or another version, the basic screen, keyboard, and mouse sharing principles are the same. VNC server and/or client are downloaded and installed, then configuration files are added. The Ubuntu installation process is a reminder that every installation needs a secure network transportation layer, and many use SSH tunnels.

VNC internals attempt to resolve differing screen geometry. Some VNC software permits shrinking a remote system’s screen to fit, while others permit a larger remote screen to be scrolled vertically and horizontally to fit the viewer’s screen.

Trouble with VNC usually surrounds one of five problems:

- Circuits between server and client
- Mismatched configuration
- Interoperability issues or feature implementation issues
- Encryption compatibility issues
- Finding and Searching Logs


## Troubleshoot VNC Circuits on Windows

VNC requires a clear network path between hosts on the ports chosen, which default to `5901`, and perhaps the range `5900`-`5904`. Both the server and client hosts must have these ports open between hosts.

In Windows, on either a server or client host, this port must be open on both hosts. Linode always recommends using a secure transport, even behind a firewall or other systems security barrier. When using SSH as a transport between VNC Server and Client, refer to the [Connect To A Remote Server](/docs/guides/connect-to-server-over-ssh/) guide to initially setup and troubleshoot the SSH circuit.

Once the VNC SSH circuit is installed and successfully tested between the proposed VNC server and client hosts, the VNC server must be started in one host, and the client in the other. The VNC server offers and connects its screen information and receives input from both systems keyboards and mice, unless this feature is disabled by configuration on either end.

VNC connections using VPNs follow similar constraints because the VNC Server and client must have a working connection (circuit path) installed and tested for VNC software to connect server and client hosts. VNC doesn’t work until the communication path between a VNC server and its client are resolved.

The `ping` command is used to ensure that the host is reachable in both directions. Failure to achieve a ping in either direction means that there is a blockage, often a firewall or security perimeter wall that must be breached, to permit communications. From a command prompt, run the following `ping` command:

```command
ping myhost.yournetwork.com:5901
```

The host, whether client or server, gets a response from its partner host. You can also substitute an IP address for a DNS name as follows:

```command
ping 10.0.34.127
```

Successful messages are returned from each host indicating that the circuit portion responds, and each VNC host has a responding VNC app running. Keyboard and mouse input (and other features like sound, storage, USB connections) can be locked at either end, depending on the options chosen when installed, or by user/administrator control.


## Troubleshoot macOS VNC

Similar to Windows VNC, a Mac connection must have a valid circuit connection between the VNC server and its client host. A Mac connection can use either use Apple’s Remote Desktop Software (RDS) or another VNC app like RealVNC or TigerVNC. Mac hosts also use the `ping` command to test the connection between their hosts.

```commmand
ping myhost.mynetwork.com:5901
```

Returned successful messages from each host indicate that the circuit portion responds, and each VNC host has a responding VNC app running.

## Troubleshoot Linux VNC

Similarly to Windows and Mac, Linux hosts must have a clear path and responding VNC instance for communications between VNC server and client to work. The Linux `ping` command works similar to that of Macs.

```command
ping myhost.mynetwork.com:5901
```

The host, whether client or server, gets a response from its partner host. You can also substitute an IP address for a DNS name as follows:

```command
ping 10.0.34.127
```

The result of the above `ping` command returns a successful messages from each host. It indicates that the circuit portion responds, and each VNC host has a responding VNC app running. A successful `ping` command returns only the apps that can connect via a valid circuit to each other.

## Troubleshoot Mismatched Configuration

When both VNC apps, server and client, are correctly connected, VNC may not respond correctly in key areas. This includes not showing the server’s screen, understanding its keyboard and mouse signals, or more advanced VNC features like the ability to manipulate local storage.

The first, and largest, post-connectivity success issue occurs with screen geometry, and color mismatches between viewer and client and the host server. Each VNC server has the ability to specify the specific raster geometry (X pixels by Y pixels) to be offered. The server configuration size may be a raster larger than the viewer’s monitor. It requires the viewer to scroll the overly-large raster of the server host, on their monitor.

No matter the client operating system, changes in the VNC viewer and client configurations may be necessary to optimize the viewer’s screen geometry. Some vendors also allow the limitation of color spectrum by default.

A very large color spectrum on a server used in graphics work (gaming, CAD, GIS, etc.) may create a high amount of traffic to manage the changing screen output to the client. The large amount of change may increase both CPU in the server, and also network traffic, causing latency between server and client. The reaction may appear on the client with general slow reactions, screen tearing, incorrect mouse position, and other signs of latency.

Although network congestion from other sources may slow VNC responsiveness, the primary step in increasing responsiveness is to choose the minimum usable screen geometry with the lowest amount of color in the VNC server’s configuration. This is especially useful over slow lines, dial-up and ISDN connections, satellite links, and other high-latency, or congested network circuit connections.


## VNC Interoperability Issues

VNC basic features are remote screen, keyboard, and mouse and pointer sharing between a VNC server host, and a viewer/client host. There is no standard between VNC application vendors. Each maker may, or may not, support additional functionality.

Functionality even between one VNC application on differing hosts can be limited by the same maker’s VNC app on a different operating system. RealVNC, TigerVNC, and others, support many types of hosts, and a common number of features on hosts when they’re connected to products they make or specifically support.

Apple’s RDS supports a large number of Apple RDS-specific features, which are available only to other Apple RDS users, despite the fact that Apple RDS supports other VNC basic features in other VNC products. The same is true of other VNC packages, and support between especially older and newer versions of VNC products may add or eliminate feature support between other VNC product editions and versions.

Other limitations imposed may include raster size, color mix support, mouse resolution as a function of raster size (mouse/cursor accuracy), and may need tweaks for non Windows versions of Linux, including Wayland, SUSE Linux users.

## VNC Encryption Support

Connections between VNC servers and its viewers and clients are often connected by the circuit they’re using, such as tunnel via SSH between hosts, or a virtual private network/VPN session between networks. This encrypts traffic until the traffic is inside the host. It does not encrypt the circuit between the application and its host network interface. This may provide the protection that most users desire, but is not 100% of the circuit between VNC server and its viewers and clients, because malware can monitor traffic in the host. If the traffic is encrypted between the applications and the network communications circuit (by SSH, a VPN, etc.) then it’s 100% encrypted.

Some vendors, such as RealVNC, offer VNC server-to-viewer encryption using TLS. Malware must somehow invade the application to be party to communications that can be stolen. This is unlikely, but not impossible. Interoperability between VNC package makers, however, is different.

## Certificates and Pre-Shared Keys

Certificates are keys using the PKI model to encrypt keys. TigerVNC and UltraVNC, with a plugin, can use public and private key encryption based on X.509 certificates. TigerVNC understands Mac and Linux certificates installed by OpenSSL, but requires OpenSSL to change a certificate generated from Windows.

The use of pre-shared keys is possible between differing hosts using different VNC packages. A pre-shared key is a long string of characters that the server and client know. It is used to encrypt, or hash, the communications stream between them. Using strong communications is recommended, although it may slow down small devices, like Raspberry Pi, and IoT devices. This is because their processors have no native encryption support and use CPU to encrypt and decrypt, along with other tasks.

Certificates are designed to expire, and an expired certificate exchange between a VNC server and its viewers/clients stops communications cold. When certificates are managed elsewhere in an organization, care should be made to ensure that the VNC certificates are correctly changed prior to their expiration.

## Finding Diagnostic Data

Data for troubleshooting exists in the system logs of the host that are having trouble. Often the logs from both hosts must be examined.

Windows Event Viewer can be filtered to show “log” and “VNC” and “vnc”. Many VNC apps keep an ongoing log in their Windows program file sub-directories.

Communications errors causing connection problems may be found via logs associated with the communications transport layer connecting a VNC server and host. These network-specific errors coincides with the time of the connection failure. Windows Event Viewer reveals these, as do program logs in Windows. The macOS errors may be in the system logs or auth logs, and the same is true for Linux and xBSD versions.

Syslog parsers are used to find aggregate errors for multiple installations of VNC servers and viewers/clients. It’s important to monitor log files, because they fill quickly when a VNC server is attacked in a dictionary attack, in an attempt to break into the server.

The error messages provide clues, or you can check the VNC server or client’s website for details on the error message to understand and troubleshoot its nature.

## Conclusion

The VNC connection system is robust when using the basics, provided the network circuit is tested to ensure both sides, server and viewer/client, can “talk” to each other. Extra features are often supported within a VNC’s operating system platform offerings, but interoperability of extra features between differing VNC platform vendors may be problematic.

Expectations can be higher when fewer features beyond the basic screen, keyboard, and mouse support are used. Perceived slowness can be caused by mismatches in screen geometry/raster size and color support, especially in highly graphical applications like gaming.

Troubleshooting specific failures requires looking at both the VNC server and client logs, and the VNC vendor’s website to perform detective work.
