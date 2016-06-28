---
author:
  name: Amanda Folson
  email: docs@linode.com
description: 'How to set up an IPv6 tunnel on your Linode.'
keywords: 'ipv6,tunnel,broker,networking'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/ipv6-tunnels/']
modified: Wednesday, June 21st, 2016
modified_by:
  name: Phil Zona
published: 'Friday, April 29th, 2011'
title: Set Up an IPv6 Tunnel on Your Linode
---

As IPv4 exhaustion nears, many people are making the switch to IPv6. Linode offers [native IPv6](/docs/networking/native-ipv6-networking) addresses in all locations.

An IPv6 tunnel lets a system reach an IPv6 network using existing IPv4 connectivity. You may want to follow this guide if you:

 - Have a tunnel, which you are migrating to your Linode,
 - Want to increase your IPv6 footprint for redundancy and failover in case of routing issues,
 - Don't have IPv6 from your ISP at home, and want to interact with your Linode through it's IPv6 address. By configuring the tunnel to a local computer instead of your Linode, you can connect to your Linode via the IPv6 address.

Before beginning this guide, you should have already signed up for an IPv6 tunnel through a tunnel broker. [Wikipedia contains a list of tunnel brokers by region](http://en.wikipedia.org/wiki/List_of_IPv6_tunnel_brokers), and we encourage you to research each one before you decide which one to use. The steps outlined in this guide were performed using tunnels from Hurricane Electric (HE).

## General Setup

Once you have signed up for a tunnel, you will need to issue a few commands on your Linode. Arch and Gentoo Linux users will need to install packages before continuing. Please see the instructions at the end of this section.

1.  Because these steps will temporarily disable networking on the Linode, begin by logging in to through either the [Lish](/using-the-linode-shell-lish) or [Glish](/docs/networking/use-the-graphic-shell-glish) interface.

2.  Use the `ip` tool to add the tunnel device. Ours is called `he-ipv6`, to match the device described in Hurricane Electric's examples. Make sure to replace `203.0.113.10` with the endpoint of your tunnel, and `198.51.100.5` with your Linode's IP address. The information for the endpoint can be found in your tunnel broker's web interface, and your Linode's IP address can be found under the [Remote Access](/docs/networking/remote-access) tab of the Linode Manager:

        ip tunnel add he-ipv6 mode sit remote 203.0.113.10 local 198.51.100.5 ttl 255
        ip link set he-ipv6 up

3.  Assign IPv6 address and routing information to your new tunnel device. Make sure to replace `2001:DB8:1234:5678::2/64` with the IPv6 address assigned to you. This information should be provided to you by your tunnel broker:

        ip addr add 2001:DB8:1234:5678::2/64 dev he-ipv6
        ifdown eth0
        ip route add ::/0 dev he-ipv6
        ifup eth0
        ip -f inet6 addr

    {: .note}
    > The `ifdown` command **will** halt all network traffic to your Linode. This step is included to avoid an error when adding the IPv6 route. It may not be required on all Linux distributions.
    >
    > on Arch Linux, replace the `ifdown` and `ifup` commands with `ip link set eth0 down` and `ip link set eth0 up`

    The final command will show all devices with IPv6 addresses, and should have a block similar to the one below:

        13: he-ipv6@NONE: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1480 state UNKNOWN qlen 1
            inet6 2001:DB8:1234:5678::2/64 scope global
               valid_lft forever preferred_lft forever
            inet6 fe80::0000:0000/64 scope link
               valid_lft forever preferred_lft forever

4.  Test the tunnel:

        ping6 -I he-ipv6 irc6.oftc.net

    {: .note }
    > On Arch Linux and other distributions without `ping6`, use `ping -6` instead.

If everything is working, you should see ping replies. If not, go back and make sure that you haven't made any errors. Note that configuration of an IP tunnel using this method will not be persistent across reboots, and will need to be configured upon restarting your Linode.


## Manual Configuration

The following instructions will allow you to manually configure your IPv6 tunnel. Please note that in many cases, this is not the preferred method. Read the documentation for your distribution regarding IPv6 before proceeding.

{: .caution }
> When manually modifying your network configuration, always disable [Network Helper](/docs/platform/network-helper#turn-network-helper-on-for-individual-configuration-profiles) first to avoid having your changes overwritten on reboot.

### Debian and Ubuntu

Debian and Ubuntu users (versions before 16.04 are not covered here) can perform the following steps to set up a tunnel on their Linode.

1.  Insert the following into your `/etc/network/interfaces` file:

        auto he-ipv6
        iface he-ipv6 inet6 v4tunnel
            address 2001:DB8:1234:5678::2
            netmask 64
            endpoint 203.0.113.10
            local 198.51.100.5
            ttl 255
            gateway 2001:470:1f0e:520::1

    Replace the `address` value with the "Client IPv6 address". Replace the `gateway` value with the "Server IPv6 address". Replace `203.0.113.10` with the endpoint that your tunnel broker provides you. Generally this endpoint is in a geographical location that is close to your Linode. Replace `198.51.100.5` with your Linode's IP address. If you have multiple IPs, make sure that this IP is set to the same address as the one you used to sign up for the tunnel.

2.  Restart networking services and test the tunnel:

        systemctl restart networking.service
        ping6 -I he-ipv6 irc6.oftc.net


    If everything is working, you should see ping replies. If not, go back and double check your network configuration for errors.

### CentOS and Fedora

Add the following lines to your `/etc/sysconfig/network` file:

    NETWORKING_IPV6=yes
    IPV6_DEFAULTDEV=sit1

Next, create a file at `/etc/sysconfig/network-scripts/ifcfg-sit1`. Insert the following directives into it, replacing the addresses:

    DEVICE=sit1
    BOOTPROTO=none
    ONBOOT=yes
    IPV6INIT=yes
    IPV6TUNNELIPV4=203.0.113.10
    IPV6ADDR=2001:DB8:1234:5678::2/64

Issue the following command to start the interface:

    ifup sit1

Once you have completed these steps, issue the following command to test the tunnel:

    ping6 -I sit1 irc6.oftc.net

If everything is working, you should see ping replies. If not, go back and double check your network configuration for errors.

### Arch Linux

Refer to the [Arch Linux Wiki](https://wiki.archlinux.org/index.php/IPv6_tunnel_broker_setup) for more information.

### Gentoo Linux

Refer to the [Gentoo Linux Wiki](https://wiki.gentoo.org/wiki/IPv6_router_guide) for more information.
