---
slug: what-is-virtual-network-computing
description: "This guide discusses how a VNC system works to share screen graphics, how they're configured, and how you can secure yours."
keywords: ['vnc', 'virtual network computing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-11
image: VNC.jpg
modified_by:
  name: Linode
title: "An Overview of VNC (Virtual Network Computing)"
tags: ['linux']
authors: ["Tom Henderson"]
---

## Cross-Platform Remote Graphical Access: the VNC Viewer and VNC Server

Virtual Network Computing (VNC) is a system that allows you to connect remotely from one computer to another computer's graphical desktop. Both computers must be a part of the same network. A client (also referred to as a viewer) sees and controls a GUI on another machine, called a VNC server. The VNC server is the computer whose environment can be seen and controlled by a remote keyboard and mouse. The VNC client, also referred to as the VNC viewer, is the application used to access the desired VNC server. VNC can be a fast, easily-implemented way to use another networked computer’s GUI-based resources.

## How Does VNC Work?

VNC works by grabbing and sending screen graphics frame buffers using the [remote framebuffer (RFB) protocol](https://en.wikipedia.org/wiki/RFB_protocol). RFB considers a viewed screen of GUI graphic rasters as a set of grids dividing the screen into smaller areas. When a grid changes, only the changed grid is sent. Each single change on a screen doesn't require the app to send the entire viewed screens as a full 100% new raster. This conserves bandwidth and transmission when communicating changes from the VNC server screen to the VNC viewer. The least common denominator between VNC packages is that they support RFB, and keyboard and mouse use.

Multiple concurrent VNC server GUIs can be viewed by a single client, port access and application permitting. For this reason, some VNC clients are used for multiple server GUI viewing as low-grade and cost-management consoles. VNC is also used to control IoT devices, where the IoT device supports a real window manager rather than terminal or text-based graphics.

VNC controls keyboards, video, and mouse movement only. USB, sound/audio, and connected devices are typically not controllable; such resources cannot usually be redirected across the same network circuit. For this reason, VNC is used more as tech support or remote control tool rather than a network resource re-director, or virtualization. VNC is typically used over networks, and requires proxies to work through IP network address translation (NAT).

Today, there are many variants of VNC that all attempt to do a similar task; accessing networked windows, desktop UIs, and application graphics. VNC and its variants are largely open source, and available for a very wide variety of Windows variants (XP through 10 and server versions), macOS, Linux, BSD varieties, Android varieties and more. A clear network path must exist between the two hosts in a VNC conversation. Ports `5900` and `5901` are typically used. For security purposes, some VNC products easily permit changing port numbers to ones that are not commonly used for VNC. Whatever ports are chosen, the ports must match between VNC server and client.

### VNC Forks and Interoperability

Although there is a high degree of interoperability between VNC versions, it’s not always guaranteed that all VNC versions will completely work with other variants and forks. Original VNC open source code has been forked and improved in various ways over two decades. Assured interoperability between forks and families of VNC code must be tested, but within a fork or family of the code, interoperability is usually assured.

### VNC Security

A GUI viewed on a server can be accessed as view-only, or interactively with the current session on the VNC server. VNC is password controlled between VNC server and client. Many additions offer authentication between sites, or use operating system directory services such as Open Lightweight Directory Access Protocol (OpenLDAP). Additional access authorization and authentication may be layered by an operating system or firewall on top of the username and password control. Some VNC variants offer additional authentication and authorization mechanisms for security. You should always use the highest common denominator security between hosts and sites.

Generally, VNC is considered as not being encrypted, and therefore is insecure unless otherwise specified or configured to be secure. Some versions of VNC are natively encrypted, meaning the end-to-end connections are fully encrypted. Other VNC versions also have encrypted transports where their networking protocol offer encryption from subnet to subnet. While others combine these two approaches using end-to-end encryption over SSH or HTTPS protocols, or via proxies that encrypt part of the network transport.

## Pros and Cons of VNC
### Pros

- High degree of interoperability can be expected among differing VNC family versions

- VNC server and client apps are available for many diverse operating systems

- Differing screen resolutions can be accommodated automatically among many VNC versions

- VNC can be easily installed, and uses few resources when not actively in use

- Fast VNC screen refreshes are typical across comparatively slow networks

- Some versions will transport audio devices and can use other VNC server-attached devices and storage

### Cons

- Generally, VNC is not a secure application and requires additional encryption and authentication to meet best-practices standards, especially when using the Internet

- Some versions are not maintained, while others have frequent updates/patches/fixes offered

- Generally, VNC uses weak username and password authentication with unenforced difficulty

- Audio and other devices may not be supported or work poorly if network latency is poor

- Very high resolution VNC server screens may be difficult to translate to smaller resolution VNC viewers; this also impacts mouse precision

- Requires a network IP port to be open, unless transported via a proxy protocol such as SSH or HTTPS

- VNC requires a proxy to work across network address translation; some versions include proxy and encryption and authentication as part of a product, typically with a commercial subscription

- Keyboard languages must generally match between hosts. UTF-8 character sets may require adaptation between hosts so that data entry matches between VNC client and server character sets

VNC has been around since 2000, and has its roots in free open source software. VNC is well-known, and its interoperability can be high. It’s biggest weaknesses are a lack of security (some versions do provide transport layer, authentication, and content encryption). Nonetheless, VNC is popular for cross-platform screen sharing that works from Linux servers to Raspberry Pis, Android, and iOS. See the [Remote Desktop](/docs/guides/applications/remote-desktop/) section of our documentation library to learn how to install a VNC client and server.
