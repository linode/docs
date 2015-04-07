---
author:
    name: Linode
    email: docs@linode.com
description: 'How to configure IPv6 networking natively on your Linode.'
keywords: 'ipv6, networking'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, February 6th, 2015
modified_by:
    name: Dave Russell
published: 'Tuesday, May 3rd, 2011'
title: Native IPv6 Networking
external_resources:
 - '[Understanding IP Addressing](http://www.ripe.net/internet-coordination/press-centre/understanding-ip-addressing)'
 - '[IPv6 Subnet Cheat Sheet](http://www.ipv6ve.info/project-definition/ipv6-subnet-cheat-sheet-and-ipv6-cheat-sheet-reference)'
---

Linode provides IPv6 support in all of our data centers, and all Linodes come with one IPv6 address at creation. By default, IPv6 is enabled on all Linodes and the IPv6 address is acquired via SLAAC. To determine your Linode's IPv6 address, click on the [Remote Access](/docs/networking/remote-access) tab of the Linode's dashboard.

It is important to note that Linode does not offer private IPv6 address allocations. We have designed our IPv6 accounting so that local IPv6 traffic does not count against your transfer quota and you can use them just like private IPv6 addresses. 

{: .note }
>
> The steps provided in this guide require root privileges. It is assumed that you will run these commands as the root superuser. If you are not logged in as `root` you will need to use `sudo`. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.

Setting up IPv6
---------------

The IPv6 address provided with your Linode will automatically assign itself to your Linode via SLAAC. Our system is set up to do this so that you will not need to statically configure your IPv6 address unless you have an IPv6 address pool.

To ensure that your IPv6 address has been correctly assigned to your Linode, you can use the following command: 

    ip -6 addr show

This will show a block of text similar to:

    3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qlen 1000
          inet6 2001:DB8:2000:aff0::/32 scope global
            valid_lft forever preferred_lft forever
          inet6 ff32:20:2001:db8::/96 scope link
            valid_lft forever preferred_lft forever

The second and fourth lines in the output above show your IPv6 address block. 

As displayed above, you will have inet6 blocks even if you only have one IPv6 address:

 * The first, ending in `global`, is the global IPv6 address which everyone can connect to. 

 * The second, ending in `link`, is your link-local address. An IPv6 link-local address is a unicast address that can be automatically configured on any interface. The link-local is usually in the FE80::/10 range, however to comply with [RFC 3849](https://tools.ietf.org/html/rfc3849), the link-local for the documentation address is in the FF32::/10 range.

If your Linode does not have the correct IPv6 address or an IPv6 address at all, you should verify that you have router advertisements enabled and you have disabled privacy extensions. In order to use Linode's SLAAC, your Linode will need to accept router advertisements. These settings are properly set in our distribution templates by default.

Additional IPv6 Addresses
-------------------------

You can request additional IPv6 addresses at any time by opening a [support ticket](/docs/platform/support). Additional addresses are allotted in pools. Each pool has a different amount of IPv6 addresses. The IPv6 pool sizes Linode provides and their respective quantity of IPv6 addresses are below.

{: .table .table-striped }
| Pool   | No. of IPS                    |
|:-------|:------------------------------|
| /56    | 4,722,366,482,869,645,213,696 |
| /64    | 18,446,744,073,709,551,616    |
| /116   | 4,096                         |
|--------|-------------------------------|


### IPv6 Neighbor Discovery

Each /56 or /64 IPv6 address pool is routed to a specific Linode. If you want to use that same address pool across multiple Linodes, you can using neighbor discovery. In order to take advantage of neighbor discovery you must configure your Linode to be a router using `net.ipv6.conf.default.forwarding`. 

{: .caution}
>This will create a single point of failure for your infrastructure. If that Linode were to crash, lose networking, or have another disruption in service, your entire IPv6 network would also go down.

Unlike the other pools available, /116 IPv6 address pools route to all of the Linodes on your account within the same data center as the Linode the pool is assigned to. This means there is no single point of failure.

Adding IPv6 Addresses
---------------------

While default IPv6 addresses are configured automatically, you will need to statically configure each IPv6 address in the pool you request. 

{: .note}
>If SLAAC is not obtaining your IPv6 address, even after verifying that privacy extensions are disabled and your Linode is accepting router advertisements, you may need to statically configure your default IPv6 address as well.

### Debian/Ubuntu

1.  On Debian and Ubuntu, edit `/etc/network/interfaces` to set up statically configured IPv6:

    {: .file }
    /etc/network/interfaces
    : ~~~
      # This file describes the network interfaces available on your system
      # and how to activate them. For more information, see interfaces(5).

      # The loopback network interface
      auto lo
      iface lo inet loopback

      # The primary network interface (IPv4)
      auto eth0
      iface eth0 inet dhcp

      # IPv6 Address Blocks
      # You should add an additional block for each IPv6 address you need configured.
      # You do not need to configure a block for your default IPv6 address, it will be brought up via SLAAC
      iface eth0 inet6 static
        address 2001:DB8:2000:aff0::1/64

      iface eth0 inet6 static
        address 2001:DB8:2000:aff0::2/64
      ~~~

2.  Restart networking. As this will break an SSH connection, this command should be performed in [LISH](/docs/networking/using-the-linode-shell-lish)

        ifdown -a && ifup -a

### CentOS/Fedora

On CentOS or Fedora, edit `/etc/sysconfig/network-scripts/ifcfg-eth0` to set up statically configured IPv6. You should configure [Static IP Networking](/docs/networking/linux-static-ip-configuration) for IPv4 as well.

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0
: ~~~
  # Configuration for eth0
  DEVICE=eth0
  BOOTPROTO=none
  ONBOOT=yes

  # Adding a public IP address.
  # The netmask is taken from the PREFIX (where 24 is Public IP, 17 is Private IP)
  IPADDR0=198.51.100.5
  PREFIX0=24

  # Specifying the gateway
  GATEWAY0=198.51.100.1

  # Adding a second public IP address.
  IPADDR1=198.51.100.6
  PREFIX1=24

  # Adding a private IP address.
  IPADDR2=192.168.133.234
  PREFIX2=17

  IPV6INIT = yes
  # Adding IPv6 addresses from pool.
  IPV6ADDR_SECONDARIES="2001:DB8:2000:aff0::1/32 2001:DB8:2000:aff0::2/32 2001:DB8:2000:aff0::3/32"
  ~~~

If you are using CentOS 6.5 or lower, restart networking:

    service network restart
    
If you are using CentOS 7, you will need to reload your configuration using `nmcli`, and bring your static interface down and back up:

    nmcli reload
    nmcli con down "System eth0"
    nmcli con up "System eth0"

### Arch Linux (netctl)

If you are still using `netctl` in Arch Linux, you can statically configure your IPv6 pools by editing the `/etc/netctl/examples/ethernet-static` file and copying it to `/etc/netctl`.

1.  Navigate to examples directory:

        cd /etc/netctl/examples

2.  Copy and rename one of the sample network profiles to the `netctl` directory:

        cp /etc/netctl/examples/ethernet-dhcp /etc/netctl/ethernet-static

3.  Edit your newly copied file using a text editor:

        nano ethernet-static

4.  Enter your IPv6 networking information (i.e. IP address, subnet, etc.). Save and exit your profile.

    {: .file }
    /etc/netctl/ethernet-static
    :   ~~~
        Description='A basic static ethernet connection'
            Interface=eth0
            Connection=ethernet

            ## IPv4 Static Configuration
            IP=static
            Address=('198.51.100.2/24' '192.168.133.234/17')
            Gateway='198.51.100.1'

            ## For IPv6 autoconfiguration
            #IP6=stateless

            ## For IPv6 static address configuration
            IP6=static
            Address6=('2001:DB8:2000:aff0::1/32')
            Gateway6='fe80::1'

            ## DNS resolvers
            DNS=('198.51.100.6' '198.51.100.7' '198.51.100.8')
        ~~~
  
5.  Enable your new network profile:

        netctl enable ethernet-static

### Arch Linux/Fedora 21 (systemd-networkd)

If you are using `systemd-networkd` on Arch Linux or Fedora 21, you can statically configure IPv6 pools by editing `/etc/systemd/network/50-static.network`.

1.  Set up [Static IP Networking](/docs/networking/linux-static-ip-configuration/#arch-linux--fedora-21) for your IPv4 address.

2.  Edit your current static IP networking configuration to allow for your IPv6 addresses. You will need to include your default IPv6 address as well.

    {: .file }
    /etc/systemd/network/50-static.network
    :   ~~~
        [Match]
        Name=eth0

        [Network]
        Address=198.51.100.2/24
        Address=192.168.133.234/17
        Gateway=198.51.100.1
        Address=2001:DB8:2000:aff0::/32
        Address=2001:DB8:2000:aff0::1/32
        Address=2001:DB8:2000:aff0::2/32
        ~~~

3.  Restart `systemd-networkd`

        systemctl restart systemd-networkd

### Gentoo

The configuration of additional IPv6 addresses in Gentoo is simple. Append the IPv6 addresses and netmask you want to the `config_eth0` line in `/etc/conf.d/net`. The list itself is a space separated list.

{: .file }
/etc/conf.d/net
:   ~~~
    # This blank configuration will automatically use DHCP for any net.*
    # scripts in /etc/init.d.  To create a more complete configuration,
    # please review /usr/share/doc/openrc*/net.example* and save your configuration
    # in /etc/conf.d/net (this file :]!).
    config_eth0="dhcp 2001:DB8:2000:aff0::1/32 2001:DB8:2000:aff0::2/32 2001:DB8:2000:aff0::3/32"
    ~~~
    
