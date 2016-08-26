---
author:
  name: Florian Brandstetter
  email: me@florianb.space
description: 'Connect two servers securely using WireGuard as VPN'
keywords: 'networking,vpn, wireguard,debian,ubuntu'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Thursday, August 25th, 2016
modified_by:
  name: Floria Brandstetter
published: 'Thursday, August 25th, 2016'
title: 'Secure Communications with OpenVPN on Ubuntu 12.04 (Precise) and Debian 7'
external_resources:
 - '[WireGuard Website](https://www.wireguard.io/)'
---

WireGuard is an extremely simple and fast VPN that utilizes state-of-the-art cryptography for highest security. The aim of the project is to be faster, simpler and more useful than IPSec. Currently, WireGuard is still in heavy development, altough it might already be regarded as the most secure and simplest VPN solution in the industry. WireGuard is useful for you if you want to exchange data securely between two servers.

Before installing WireGuard, we assume that you have followed our [Getting Started Guide](/docs/getting-started/). If you're new to Linux server administration you may be interested in our [Introduction to Linux Concepts Guide](/docs/tools-reference/introduction-to-linux-concepts), [Beginner's Guide](/docs/beginners-guide/) and [Administration Basics Guide](/docs/using-linux/administration-basics). If you're concerned about securing on your Linode, you might be interested in our [Security Basics](/docs/security/basics) article as well.

## Requirements
This guide assumes that you're running the latest version of the Linux kernel, because WireGuard requires a kernel newer than 4.1 in order to function correctly.

## Installing WireGuard

Follow these steps in order to install WireGuard:

1.  Update your package repositories with the following command:

        apt-get update

2.  Upgrade your packages to the latest versions:

        apt-get upgrade

3.  Install the packages required to build WireGuard:

        apt-get install libmnl-dev linux-headers-$(uname -r) build-essential git

4. Download WireGuard from the git repository:

        git clone https://git.zx2c4.com/WireGuard

5. Compile the kernel module:

        cd WireGuard/src
        make

6. Install the compiled packages:

        make install

## Configure a tunnel

{: .note}
>
> You need to run these commands on both servers, with properly adjusted IP addresses and keys.

In this section, we'll configure the tunnel and try to reach the other host.

1. Create the tunnel interface:

        ip link add dev wg0 type wireguard

2. Create our key:

        cd ~
        umask 077
        wg genkey > private
        wg pubkey < private > public

3. Add an IP address to the tunnel interface ( .1 for the first server and .2 for the second one ):

        ip addr add 192.168.0.1/24 dev wg0

4. Read the public key

        cat public

## Span up a tunnel

After we have generated our keys now and created the tunnel interface properly. In the next command, we'll create the tunnel itself and set all required paramters. The parameter `allowed-ips` sets which IP addresses are allowed to communicate over the tunnel. In our case, 192.168.0.0/24 fits our needs perfectly. We can continue with spanning up the tunnel:

    wg set wg0 listen-port 2345 private-key ~/private peer OTHER_SERVER_PUBLIC_KEY allowed-ips 192.168.0.0/24 endpoint OTHER_SERVER_PUBLIC_IP:2345

## Testing

As of now, we have a tunnel configured on both servers and each server has it's own unique ip address assigned. You can verify whether your tunnel works or not by trying to ping the other server. From the first server, the command would look like this:

    ping 192.168.0.2

If you don't receive any reply from the other server and don't see any specific error(s) in your logfiles, check whether the IP addresses were assigned correctly, the keys were set correctly and if the server have different tunnel IP addresses.

## Conclusion

WireGuard is a new VPN solution which utilizes great encryption as well as blazing fast speed, for simple use-cases up to backbone connections. Happy Hacking!
