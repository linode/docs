---
slug: centos-wireguard-installation-and-configuration
description: 'This guide provides you with step-by-step instructions on how to install and configure the WireGuard Virtual Private Network services on CentOS 8.'
keywords: ['centos', 'wireguard', 'vpn']
tags: ['wireguard', 'centos', 'vpn']
bundles: ['network-security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
image: WireGuard.jpg
modified_by:
  name: Linode
title: "Installing and Configuring WireGuard on CentOS 8"
title_meta: "How to Install and Configure WireGuard on CentOS 8"
external_resources:
- '[WireGuard](https://www.wireguard.com/)'
- '[WireGuard was merged into the Linux kernel 5.6](https://www.zdnet.com/article/linuxs-wireguard-vpn-is-here-and-ready-to-protect-you/)'
- '[OpenVPN](https://openvpn.net/)'
- '[Noise protocol](http://www.noiseprotocol.org/)'
- '[Curve25519](http://cr.yp.to/ecdh.html)'
- '[ChaCha20](http://cr.yp.to/chacha.html)'
- '[Poly1305](http://cr.yp.to/mac.html)'
- '[BLAKE2](https://blake2.net/)'
- '[SipHash24](https://131002.net/siphash/)'
- '[HKD](https://eprint.iacr.org/2010/264)'
- '[Linuxs built-in cryptographic subsystem](https://lwn.net/Articles/761939/)'
- '[the fastest VPN protocol](https://restoreprivacy.com/vpn/fastest/)'
- '[NordVPN](https://nordvpn.com/)'
- '[SurfShark](https://surfshark.com/)'
- '[Private Internet Access](https://www.privateinternetaccess.com/)'
- '[wg(8)](https://git.zx2c4.com/wireguard-tools/about/src/man/wg.8)'
- '[Red Hat Enterprise Linux (RHEL)](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux)'
- '[CentOS](https://www.centos.org/)'
- '[wg-quick](https://manpages.debian.org/unstable/wireguard-tools/wg-quick.8.en.html)'
authors: ["Steven J. Vaughan-Nichols"]
---

## What is WireGuard?

[*WireGuard*](https://www.wireguard.com/)&#174; is a next-generation security-focused *Virtual Private Network (VPN)* which can easily be deployed on low-end devices, like Raspberry Pi, to high-end servers.

WireGuard was written by top Linux developer Jason A. Donenfeld as a new approach to VPNs. Beloved by Linux founder Linus Torvalds, [WireGuard was merged into the Linux kernel 5.6](https://www.zdnet.com/article/linuxs-wireguard-vpn-is-here-and-ready-to-protect-you/) in March 2020.

**Advantages:**

1. **Agility:** WireGuard can connect even when you are roaming across networks in situations where other VPN protocols fail.

1. **Security:** WireGuard can be managed with very few lines of code(about 4,000) and it is much easier to debug and more performant than its rivals, such as [*OpenVPN*](https://openvpn.net/) (which has over 100,000 lines of code). While simpler than its competition, it supports modern cryptography technologies such as:

   - [*Noise protocol*](http://www.noiseprotocol.org/) framework
   - [*Curve25519*](http://cr.yp.to/ecdh.html)
   - [*ChaCha20*](http://cr.yp.to/chacha.html)
   - [*Poly1305*](http://cr.yp.to/mac.html)
   - [*BLAKE2*](https://blake2.net/)
   - [*SipHash24*](https://131002.net/siphash/), and [*HKD*](https://eprint.iacr.org/2010/264).
   - It is also compatible with [Linux's built-in cryptographic subsystem](https://lwn.net/Articles/761939/).

1. **Speed:** WireGuard uses fast cryptography code. Tests show WireGuard is [the fastest VPN protocol](https://restoreprivacy.com/vpn/fastest/).

1. **Cross-platform use:** Many VPN services, such as [*NordVPN*](https://nordvpn.com/), [*SurfShark*](https://surfshark.com/), and [*Private Internet Access*](https://www.privateinternetaccess.com/) now support WireGuard. Native WireGuard VPN clients are also available on numerous operating systems including Android, iOS, FreeBSD, macOS, OpenBSD, and Windows.

**How Does Wireguard Work?**

WireGuard works by securely encapsulating IP packets over UDP. WireGuard adds a network interface, `lime eth0` or `wlan0` under the name `wg0` and so on. You configure these with your private key and your peers' public keys. This network interface can then be configured with the usual Linux networking utilities such as `ifconfig(8)`; `ip-address(8)`; `route(8)` and `ip-route(8)`. WireGuard specific aspects are configured using the [wg(8)](https://git.zx2c4.com/wireguard-tools/about/src/man/wg.8) tool. All key distribution and pushed configuration issues are out of WireGuard's scope.

Configuring WireGuard is as simple as [setting up SSH](/docs/guides/security). A connection is established by an exchange of public keys between server and client. Only a client that has its public key in its corresponding server configuration file is allowed to connect.

## Before You Begin

- [Deploy a Linode](/docs/products/compute/compute-instances/guides/create/) running CentOS 8.
- [Add a limited user account](/docs/products/compute/compute-instances/guides/set-up-and-secure/#add-a-limited-user-account) with `sudo` privileges to your Linode.
- Set your system's [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname).

## Install WireGuard

There are many ways to install WireGuard. The simplest way is to use the [*ELRepo*](http://elrepo.org/tiki/HomePage)'s pre-built module.
    {{< note respectIndent=false >}}
ELRepo is a community repository for [Red Hat Enterprise Linux (RHEL)](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) style distributions such as [CentOS](https://www.centos.org/). It focuses on hardware-related packages. All its packages are built against the RHEL kernel.
    {{< /note >}}

    sudo yum install elrepo-release epel-release

Install a signed WireGuard Linux kernel module and the WireGuard tools.

    sudo yum install kmod-wireguard wireguard-tools

## Configure WireGuard Server

1. Navigate to the `/etc/wireguard` directory and generate a private and public key pair for the WireGuard server.

       sudo umask 077
       sudo wg genkey | tee privatekey | wg pubkey > publickey

    This saves both the private and public keys, and they can be viewed with `cat privatekey` and `cat publickey`, respectively.

1. Create the file `/etc/wireguard/wg0.conf` with the following content. You need `PrivateKey` for the PrivateKey field and its private IP addresses in the `Address` field.

    {{< file "/etc/wireguard/wg0.conf" >}}
[Interface]
  PrivateKey = <Private Key>
  Address = 10.0.0.1/24, fd86:ea04:1115::1/64
  ListenPort = 51820
  PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
  PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
  SaveConfig = true
    {{< /file >}}

Here's an explanation of the above configuration file:

- **PrivateKey:** The server's private key.
- **Address:** Defines the private IPv4 and IPv6 addresses for the WireGuard server. Each peer in the VPN network should have a unique value. Typical values are `10.0.0.1/24`, `192.168.1.1/24`, or `192.168.2.1/24`. This is not the same as a private IP address that Linode can assign to your Linode instance.
- **ListenPort:** Specifies which port WireGuard uses for incoming connections. The default is `51820`.
    {{< note respectIndent=false >}}
The value you set in `ListenPort` is referenced in your firewall settings later.
{{< /note >}}
- **PostUp** and **PostDown** define steps to run after the interface is turned on or off, respectively. In this case, `iptables` sets Linux IP masquerade rules to allow all the clients to share the server's IPv4 and IPv6 addresses. The rules are cleared once the tunnel is down.
- **SaveConfig:** When set to `true`, the configuration file automatically updates whenever a new peer is added while the service is running.

## Set Up Firewall Rules

1. Install *Uncomplicated Firewall (UFW)* if you do not have a firewall already installed.

       sudo yum install ufw

1. Permit SSH connections and WireGuard's VPN port.

       sudo ufw allow 22/tcp
       sudo ufw allow 51820/udp
       sudo ufw enable

1. Verify the settings.

       sudo ufw status verbose

## Start the WireGuard Service

1. Start WireGuard with [wg-quick](https://manpages.debian.org/unstable/wireguard-tools/wg-quick.8.en.html) script. This is a convenient wrapper for many of WireGuard's common functions.

       sudo wg-quick up wg0
       sudo systemctl enable wg-quick@wg0

1. Check if the VPN tunnel is running.

       sudo wg show

1. The results should look like the following:
    {{< output >}}
interface: wg0
public key: Nrl2nVQxSwrKrvz6jQcrsziuVRPWT9N1Q8/yaQkAXUg=
private key: (hidden)
listening port: 51820
{{< /output >}}

1. Now, try to connect to your new WireGuard server with the WireGuard client of your choice. If it goes well, you now have a quick, secure private connection to your server.

“WireGuard” is a registered trademark of Jason A. Donenfeld.
