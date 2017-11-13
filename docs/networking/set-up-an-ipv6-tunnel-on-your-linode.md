---
author:
  name: Linode
  email: docs@linode.com
description: 'How to set up an IPv6 tunnel on your Linode.'
keywords: ["ipv6", "tunnel", "broker", "networking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/ipv6-tunnels/']
modified: 2016-07-07
modified_by:
  name: Phil Zona
published: 2011-04-29
title: Set Up an IPv6 Tunnel on Your Linode
---

As IPv4 address exhaustion nears, many people are making the switch to IPv6. Linode offers [native IPv6](/docs/networking/native-ipv6-networking) addresses in all locations.

An IPv6 tunnel lets a system reach an IPv6 network using existing IPv4 connectivity. Follow this guide if you:

 - Have a tunnel that you are migrating to your Linode;
 - Want to increase your IPv6 footprint for redundancy and failover in case of routing issues;
 - Don't have IPv6 from your ISP, and want to interact with your Linode through its IPv6 address. By configuring the tunnel to a local computer instead of your Linode, you can connect to your Linode via the IPv6 address.

## Before You Begin

You should have already signed up for an IPv6 tunnel through a tunnel broker. [Wikipedia contains a list of tunnel brokers by region](http://en.wikipedia.org/wiki/List_of_IPv6_tunnel_brokers), and we encourage you to research each before you decide which to use. The steps outlined in this guide were performed using tunnels from Hurricane Electric (HE).

## General Setup

Once you have signed up for a tunnel, you will need to issue a few commands on your Linode. Arch and Gentoo Linux users may need to install the `iproute2` package before continuing.

{{< note >}}
Configuration of an IP tunnel using this method will not be persistent after reboot and will need to be reconfigured after restarting your Linode.
{{< /note >}}

1.  Because some of these steps will temporarily disable networking on the Linode, begin by logging in using either the [Lish](/docs/networking/using-the-linode-shell-lish) or [Glish](/docs/networking/use-the-graphic-shell-glish) interface.

2.  Use the `ip` tool to add the tunnel device. Ours is called `he-ipv6` to match the device described in Hurricane Electric's examples. Replace `203.0.113.10` with the endpoint of your tunnel, and `198.51.100.5` with your Linode's IP address. The information for the endpoint can be found in your tunnel broker's web interface, and your Linode's IP address can be found under the [Remote Access](/docs/networking/remote-access) tab of the Linode Manager:

        ip tunnel add he-ipv6 mode sit remote 203.0.113.10 local 198.51.100.5 ttl 255
        ip link set he-ipv6 up

    For more information on how the `ip` tool configures tunnels, see the [ip-tunnel documentation](http://man7.org/linux/man-pages/man8/ip-tunnel.8.html).

3.  Assign IPv6 address and routing information to your new tunnel device. Replace `2001:db8:1234:5678::2/64` with the IPv6 address assigned to you. This information should be provided to you by your tunnel broker as your "Client IPv6 Address":

    {{< caution >}}
The `ifdown` command **will halt all network traffic to your Linode**. This step is included to avoid an error when adding the IPv6 route. It may not be required on all Linux distributions.

On Arch Linux, replace the `ifdown` and `ifup` commands with `ip link set eth0 down` and `ip link set eth0 up`
{{< /caution >}}

        ip addr add 2001:db8:1234:5678::2/64 dev he-ipv6
        ifdown eth0
        ip route add ::/0 dev he-ipv6
        ifup eth0
        ip -f inet6 addr

    The final command in Line 5 will show all devices with IPv6 addresses, and should have a block similar to this:

        13: he-ipv6@NONE: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1480 state UNKNOWN qlen 1
            inet6 2001:db8:1234:5678::2/64 scope global
               valid_lft forever preferred_lft forever
            inet6 fe80::0000:0000/64 scope link
               valid_lft forever preferred_lft forever

4.  Test the tunnel. Replace `he-ipv6` with the name of your tunnel:

        ping6 -I he-ipv6 irc6.oftc.net

    {{< note >}}
On Arch Linux and other distributions without `ping6`, use `ping -6` instead.
{{< /note >}}

If everything is working, you should see ping replies. If not, go back and make sure that you haven't made any errors.

## Manual Configuration

The instructions in this section will allow you to manually configure your IPv6 tunnel. This can permanently affect your connectivity across reboots. Read the IPv6 documentation for your distribution before proceeding.

{{< caution >}}
When manually modifying your network configuration, always disable [Network Helper](/docs/platform/network-helper#turn-network-helper-on-for-individual-configuration-profiles) first to avoid having your changes overwritten on reboot.
{{< /caution >}}

### Debian and Ubuntu

Debian and Ubuntu users (versions before Ubuntu 16.04 are not covered here) can perform the following steps to set up a tunnel on their Linode.

1.  In the following excerpt, replace the:

    * `address` value with the "Client IPv6 address."
    * `gateway` value with the "Server IPv6 address."
    * `endpoint` value with the endpoint, or "Server IPv4 Address," that your tunnel broker provides you. Generally this endpoint is in a geographical location that is close to your Linode.
    * `local` value with your Linode's IP address. If you have multiple IPs, make sure that this IP is set to the same address as the one you used to sign up for the tunnel.

    Insert the following into your `/etc/network/interfaces` file:

    {{< file-excerpt "/etc/network/interfaces" >}}
auto he-ipv6
iface he-ipv6 inet6 v4tunnel
    address 2001:db8:1234:5678::2
    netmask 64
    endpoint 203.0.113.10
    local 198.51.100.5
    ttl 255
    gateway 2001:db8:1234:5678::1

{{< /file-excerpt >}}


2.  Restart networking services and test the tunnel. Replace `he-ipv6` with the name of your tunnel:

        systemctl restart networking.service
        ping6 -I he-ipv6 irc6.oftc.net

    If configuration was successful, you will receive ping replies. If not, check your network configuration for errors.

### CentOS 7 and Fedora 22+

1.  Create a file at `/etc/sysconfig/network-scripts/ifcfg-he-ipv6` that contains the following:

    {{< file "/etc/sysconfig/network-scripts/ifcfg-he-ipv6" >}}
NAME="he-ipv6"
DEVICE=he-ipv6
ONBOOT=yes
USERCTL=yes
BOOTPROTO=none
PEERDNS=no

IPV6INIT=yes
IPV6_AUTOTUNNEL=yes
IPV6ADDR="2001:db8:1234:5678::2/64"
IPV6_ROUTER=yes
IPV6_AUTOCONF=no

IPV6_CONTROL_RADVD=yes
IPV6TUNNELIPV4=203.0.113.10
IPV6TUNNELIPV4LOCAL=45.79.171.199

PHYSDEV=eth0
TYPE=sit
DEVICETYPE=sit
NM_CONTROLLED=no

IPV6_DEFAULTGW=2001:db8:1234:5678::1
IPV6_DEFAULTDEV=he-ipv6

{{< /file >}}


      In the above, replace the:

      * `IPV6ADDR` value with your "Client IPV6 Address."
      * `IPV6TUNNELIPV4` value with your "Server IPV4 Address."
      * `IPV6TUNNELIPV4LOCAL` value with your "Client IPV4 Address."
      * `IPV6_DEFAULTGW` value with your "Server IPV6 Address."

2.  Start the `he-ipv6` interface:

        ifup he-ipv6

3.  Test the tunnel. Replace `he-ipv6` with the name of your tunnel:

        ping6 -I he-ipv6 irc6.oftc.net

    If configuration was successful, you will receive ping replies. If not, check your network configuration for errors.

### CentOS 6

1.  Add the following lines to your `/etc/sysconfig/network` file:

    {{< file-excerpt "/etc/sysconfig/network" >}}
NETWORKING_IPV6=yes
IPV6_DEFAULTDEV=he-ipv6

{{< /file-excerpt >}}


2.  Create a file at `/etc/sysconfig/network-scripts/ifcfg-he-ipv6` that contains the following:

    {{< file-excerpt "/etc/sysconfig/network-scripts/ifcfg-he-ipv6" >}}
DEVICE=he-ipv6
BOOTPROTO=none
ONBOOT=yes
IPV6INIT=yes
IPV6TUNNELIPV4=203.0.113.10
IPV6ADDR=2001:db8:1234:5678::2/64

{{< /file-excerpt >}}


    Replace the `IPV6TUNNELIPV4` value with your remote tunnel endpoint and the `IPV6ADDR` value with the "Client IPv6" address provided to you by your tunnel broker.

3.  Start the `he-ipv6` interface:

        ifup he-ipv6

4.  Test the tunnel. Replace `he-ipv6` with the name of your tunnel:

        ping6 -I he-ipv6 irc6.oftc.net

    If configuration was successful, you will receive ping replies. If not, check your network configuration for errors.

### Arch Linux

Refer to the [Arch Linux Wiki](https://wiki.archlinux.org/index.php/IPv6_tunnel_broker_setup) for more information.

### Gentoo Linux

Refer to the [Gentoo Linux Wiki](https://wiki.gentoo.org/wiki/IPv6_router_guide) for more information.
