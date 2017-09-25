---
author:
  name: Linode
  email: docs@linode.com
description: 'This quick answer guide shows how to find the IP address of your Linode either through the Linode Manager or while in an SSH session.'
keywords: 'ip address,IPV4,IPv6,SSH'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Monday, September 18th, 2017'
modified_by:
  name: Linode
published: 'Monday, September 18th, 2017'
title: How to Find Your Linode's IP Address
---
Because an internet protocol (IP) address was conceived long ago as the means to allow one computer (server or digital device) to communicate with another via the internet, it's a rather important scrap of digital information. Each respective IP address pinpoints and differentiates its associated device from the other billions of devices on the world wide web. Thus, knowing you server's IP address can be handy for several tasks you're seeking to perform with your Linode through the internet.

Fortunately, finding your Linode's IP address (or addresses) is easy and can be done in either of two different ways.

## Find the IP Address Using the Linode Manager

1.  Log in to the Linode Manager.

2.  From the **Linodes** tab of your account, select the Linode you want to work with.

3.  Click the **Remote Access** tab.

    - The Linode's public IP addresses (both IPv4 and IPv6) are under the **Public Network** section near the top of the Remote Access page.
    - Private addresses are under the **Private/LAN Network** section near the bottom of the page.

[![Public IPs.](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

The graphic above shows:

- One public IP address, `96.126.109.54` on a `255.255.255.0` [subnetwork](https://en.wikipedia.org/wiki/Subnetwork).
- One public IPv6 address, `2600:3c03::f03c:91ff:fe70:cabd` on a `/64` subnet.
- This Linode does not have a private IPv4 address.
- One private IPv6 address (*Link-Local IP*), `fe80::f03c:91ff:fe70:cabd`, also on a `/64` subnetwork.

## Find the IP Address Using an SSH Session

Use the command below to view your Linode's IP addresses:

    ip addr | grep inet

An example of the output:

    root@localhost:~# ip addr | grep inet
        inet 127.0.0.1/8 scope host lo
        inet6 ::1/128 scope host
        inet 45.56.99.254/24 brd 45.56.99.255 scope global eth0
        inet 97.107.134.191/24 scope global eth0:1
        inet 192.168.192.154/17 scope global eth0:2
        inet6 2600:3c03::f03c:91ff:fe26:7e8e/64 scope global mngtmpaddr dynamic
        inet6 fe80::f03c:91ff:fe26:7e8e/64 scope link

The output shows:

- Two public IPv4 addresses, `45.56.99.254` and `97.107.134.191`
- One private IPv4 address, `192.168.192.154`
- One public IPv6 address, `2600:3c03::f03c:91ff:fe26:7e8e`
- One private IPv6 address, `fe80::f03c:91ff:fe26:7e8e`

{:.note}
>
>DHCP will only recognize one IPv4 address. If you have more than one IPv4 address assigned to your Linode, you must either set those addresses statically or enable Network Helper. Otherwise, those addresses will not be usable to the system, nor will they display in `ip` commands. See the following guides for more information:
>
>[Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration)
>
>[Network Helper](/docs/platform/network-helper)
