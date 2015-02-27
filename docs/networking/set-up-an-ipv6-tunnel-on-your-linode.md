---
author:
  name: Amanda Folson
  email: docs@linode.com
description: 'How to set up an IPv6 tunnel on your Linode.'
keywords: 'ipv6,tunnel,broker,networking'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/ipv6-tunnels/']
modified: Tuesday, February 28th, 2012
modified_by:
  name: Linode
published: 'Friday, April 29th, 2011'
title: Set Up an IPv6 Tunnel on Your Linode
---

As IPv4 exhaustion nears, many people are preparing to make the switch to IPv6. Linode offers native IPv6 addresses in all locations; please refer to our [native IPv6 guide](/docs/networking/native-ipv6-networking) for configuration instructions. Additionally, be sure to watch the [IPv6 status page](http://www.linode.com/IPv6/) for updates.

Before beginning this guide, you should have already signed up for an IPv6 tunnel through a tunnel broker. [Wikipedia contains a list of tunnel brokers by region](http://en.wikipedia.org/wiki/List_of_IPv6_tunnel_brokers), and we encourage you to research each one before you decide which one to use. The steps outlined in this guide were performed using tunnels from HE.

General Setup
-------------

Once you have signed up for a tunnel, you will need to issue a few commands. Users of Arch and Gentoo Linux will need to install packages before continuing. Please see the instructions at the end of this section.

Issue the following commands, making sure to replace `209.51.161.14` with the endpoint of your tunnel and `12.34.56.78` with your Linode's IP address. The information for the endpoint can be found in your tunnel broker's web interface, and your Linode's IP address can be found under the "Remote Access" tab of the Linode Manager:

    ip tunnel add he-ipv6 mode sit remote 209.51.161.14 local 12.34.56.78 ttl 255
    ip link set he-ipv6 up

Next, issue the following commands, making sure to replace `2001:470:1f0e:520::2/64` with the IP range assigned to you. This information should be provided to you by your tunnel broker:

    ip addr add 2001:470:1f0e:520::2/64 dev he-ipv6
    ip route add ::/0 dev he-ipv6
    ip -f inet6 addr

Once you have completed these steps, issue the following command to test the tunnel:

    ping6 irc6.oftc.net

If everything is working, you should see ping replies. If not, go back and make sure that you haven't made any errors.

### Arch

Arch Linux users will need to issue the following commands before continuing:

    pacman -S iproute2

### Gentoo

Gentoo users will need to issue the following commands before continuing:

    emerge --sync
    emerge sys-apps/iproute2

Manual Configuration
--------------------

The following instructions will allow you to manually configure your IPv6 tunnel. Please note that in many cases, this is not the preferred method. Read the documentation for your distribution regarding IPv6 before proceeding.

### Debian and Ubuntu

Debian and Ubuntu users (versions before 10.04 Lucid are not covered here) can perform the following steps to set up a tunnel on their Linode.

Insert the following into your `/etc/network/interfaces` file:

    auto tunnel
    iface tunnel inet6 v4tunnel
        address 2001:470:1f0e:520::2/64
        netmask 64
        ttl 64
        gateway 2001:470:1f0e:520::1/64
        endpoint 216.218.224.42
        local 12.34.56.78

Replace the `address` value with the "Client IPv6 address". Replace the `gateway` value with the "Server IPv6 address". Replace `endpoint` with the endpoint that your tunnel broker provides you. Generally this endpoint is in a geographical location that is close to your Linode. Replace `12.34.56.78` with your Linode's IP address. If you have multiple IPs, make sure that this IP is set to the same address as the one you used to sign up for the tunnel.

Once you have completed these steps, issue the following command to test the tunnel:

    ping6 irc6.oftc.net

If everything is working, you should see ping replies. If not, go back and double check your network configuration for errors.

### CentOS and Fedora

Add the following lines to your `/etc/sysconfig/network` file:

    NETWORKING_IPV6=yes
    IPV6_DEFAULTDEV=sit1

Next, create a file at `/etc/sysconfig/network-scripts/ifcfg-sit1`. Insert the following directives into it:

    DEVICE=sit1
    BOOTPROTO=none
    ONBOOT=yes
    IPV6INIT=yes
    IPV6TUNNELIPV4=HESupplied-ServerIPv4address
    IPV6ADDR=HESupplied-ClientIPv6address

Issue the following command to start the interface:

    ifup sit1

Once you have completed these steps, issue the following command to test the tunnel:

    ping6 irc6.oftc.net

If everything is working, you should see ping replies. If not, go back and double check your network configuration for errors.

### Gentoo Linux

Begin by issuing the following commands:

    emerge --sync
    emerge sys-apps/iproute2

Next, add the following lines to your `/etc/conf.d/net` file:

    modules_hetunnel=("iptunnel")
    depend_hetunnel() {
        need net.eth0
        }
    iptunnel_hetunnel="mode sit remote HESupplied-ServerIPv4address local local-IPv4address ttl 255"
    config_hetunnel=("HESupplied-ClientIPv6address")
    routes_hetunnel=("::/0 dev hetunnel")

Once you have completed these steps, issue the following command to test the tunnel:

    ping6 irc6.oftc.net

If everything is working, you should see ping replies. If not, go back and double check your network configuration for errors.

### Arch Linux

Issue the following command to install necessary tools:

    pacman -S iproute2

Create the following script at `/etc/rc.d/ipv6tunnel`:

{: .file-excerpt }
/etc/rc.d/ipv6tunnel
:   ~~~ bash
    #!/bin/bash
    ################################################################################
    #                                                                              #
    #     Taken from https://wiki.archlinux.org/index.php/IPv6_-_6in4_Tunnel       #
    #                                                                              #
    ################################################################################

    ### begin user configuration

    ##############################################
    #                                            #
    #  Stop this script before you reconfigure!  #
    #                                            #
    ##############################################

    # if_name     - interface name that is to be created for the 6in4 link
    if_name=6in4

    # server_ipv4 - ipv4 address of the server that is providing the 6in4 tunnel
    server_ipv4=127.0.0.1

    # client_ipv4 - ipv4 address of the client that is receiving the 6in4 tunnel
    client_ipv4=127.0.0.1

    # client_ipv6 - ipv6 address of the client 6in4 tunnel endpoint
    client_ipv6=2001:feed:face:beef::2/64

    # link_mtu    - set the mtu for the 6in4 link
    link_mtu=1480

    # tunnel_ttl  - set the ttl for the 6in4 tunnel
    tunnel_ttl=64

    ### end user configuration

    daemon_name=6in4-tunnel

    . /etc/rc.conf
    . /etc/rc.d/functions

    case "$1" in
      start)
        stat_busy "Starting $daemon_name daemon"

        ifconfig $if_name &>/dev/null
        if [ $? -eq 0 ]; then
          stat_busy "Interface $if_name already exists"
          stat_fail
          exit 1
        fi

        ip tunnel add $if_name mode sit remote $server_ipv4 local $client_ipv4 ttl $tunnel_ttl
        ip link set $if_name up mtu $link_mtu
        ip addr add $client_ipv6 dev $if_name
        ip route add ::/0 dev $if_name

        add_daemon $daemon_name
        stat_done
        ;;

      stop)
        stat_busy "Stopping $daemon_name daemon"

        ifconfig $if_name &>/dev/null
        if [ $? -ne 0 ]; then
          stat_busy "Interface $if_name does not exist"
          stat_fail
          exit 1
        fi

        ip link set $if_name down
        ip tunnel del $if_name

        rm_daemon $daemon_name
        stat_done
        ;;

      *)
        echo "usage: $0 {start|stop}"
    esac
    exit 0
    ~~~

Issue the following command to make the script executable:

    chmod +x /etc/rc.d/ipv6tunnel

Next, add the following line to your `/etc/rc.conf` file:

{: .file-excerpt }
/etc/rc.conf
:   ~~~ bash
    DAEMONS=( ipv6tunnel )
    ~~~

If at any time you wish to reconfigure your tunnel, you will need to stop the service:

    /etc/rc.d/ipv6tunnel stop

Once you have finished modifying the script, issue the following command to start the tunnel again:

    /etc/rc.d/ipv6tunnel start



