---
author:
  name: Linode
  email: bolow@linode.com
description: 'How to configure IPv6 natively on your Linode.'
keywords: 'ipv6,networking'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/ipv6/']
modified: Thursday, March 13th, 2014
modified_by:
  name: Linode
published: 'Tuesday, May 3rd, 2011'
title: Native IPv6 Networking
---

Native IPv6 support is provided in all of our datacenters. IPv6 is enabled by default as well as IPv4. To check your Linode's public IP addresses click on the **Remote Access** tab.

 {: .note }
>
> The steps required in this guide require root privileges. Run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](https://library.linode.com/using-linux/users-and-groups) guide.

Setting up IPv6
---------------

IPv6 is automatically configured on your Linode. To view the network configuration of your Linode, run the `ifconfig` command. The output should look similar to the following:

    [root@europa ~]# ifconfig eth0
              eth0      Link encap:Ethernet  HWaddr F2:3C:91:DB:26:B7
              inet addr:xx.xx.xx.xx  Bcast:xx.xx.xx.xx  Mask:255.255.255.0
              inet6 addr: 2600:3c03::f03c:91ff:fedb:26b7/64 Scope:Global
              inet6 addr: fe80::f03c:91ff:fedb:26b7/64 Scope:Link
              UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
              RX packets:26002 errors:0 dropped:0 overruns:0 frame:0
              TX packets:20325 errors:0 dropped:0 overruns:0 carrier:0
              collisions:0 txqueuelen:1000
              RX bytes:2585353 (2.4 MiB)  TX bytes:3245741 (3.0 MiB)

Alternately, the output for the network configuration using the `ip addr` command will look similar to the example below:

    [root@europa ~]# ip addr show dev eth0
    3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
       link/ether f2:3c:91:db:26:b7 brd ff:ff:ff:ff:ff:ff
       inet xx.xxx.xx.x/24 brd xx.xxx.xx.xxx scope global eth0
          valid_lft forever preferred_lft forever
       inet6 2600:3c03::f03c:91ff:fedb:26b7/64 scope global dynamic
          valid_lft 2591986sec preferred_lft 604786sec
       inet6 fe80::f03c:91ff:fedb:26b7/64 scope link
          valid_lft forever preferred_lft forever

In the examples above, the IPv6 address associated with this Linode is `2600:3c03::f03c:91ff:fedb:26b7`," which is denoted by the "`Scope:Global` declaration that follows it. The `/64` at the end of the addresses is part of the "CIDR" notation, which refers to the subnet that you are on. The `Scope:Link` declaration after the `fe80::f03c:91ff:fedb:26b7/64` IP indicates a local link address.

To test the connection, you can use the `ping6` utility:

    [root@europa ~]# ping6 ipv6.google.com -c 3
    PING ipv6.google.com(lga15s42-in-x05.1e100.net) 56 data bytes
    64 bytes from lga15s42-in-x05.1e100.net: icmp_seq=1 ttl=55 time=7.89 ms
    64 bytes from lga15s42-in-x05.1e100.net: icmp_seq=2 ttl=55 time=8.12 ms
    64 bytes from lga15s42-in-x05.1e100.net: icmp_seq=3 ttl=55 time=8.06 ms

    --- ipv6.google.com ping statistics ---
    3 packets transmitted, 3 received, 0% packet loss, time 2011ms
    rtt min/avg/max/mdev = 7.893/8.027/8.127/0.098 ms

The **c** option is for count, and the 3 is for the number of packets sent.

Note: For Linodes prior to the year 2012, you need to click the **Enable IPv6** link from the **Remote Access** tab in the Linode Manager. A manual reboot will be required to enable IPv6.

Firewall
--------

If you have already implemented a firewall for IPv6, please ensure the following rules are in place. This will ensure that IPv6 address properly allocate without manual intervention or static networking. We want to ensure that neighbor solicitation is able to pass through your Linodes firewall.

    ip6tables -A INPUT -p icmpv6 --icmpv6-type router-advertisement -m hl --hl-eq 255 -j ACCEPT
    ip6tables -A INPUT -p icmpv6 --icmpv6-type neighbor-solicitation -m hl --hl-eq 255 -j ACCEPT
    ip6tables -A INPUT -p icmpv6 --icmpv6-type neighbor-advertisement -m hl --hl-eq 255 -j ACCEPT
    ip6tables -A INPUT -p icmpv6 --icmpv6-type redirect -m hl --hl-eq 255 -j ACCEPT

IPv6 Address Pools
------------------

Additional blocks of IPv6 addresses may be requested at no charge. Addresses in these pools can be used on any of your Linodes that reside in the same facility. For example, if you have four Linodes in Newark, you could assign each of them addresses from your Newark address pool. Open a support ticket to request your IPv6 pool.

Your pool will be visible under the "Remote Access Tab" of the Linode Manager in a manner similar to the following:

    Public IP Pools  2600:3c03:e000:0084::/64 

### Adding IPv6 Addresses

To attach an IP to your interface, issue the following command, be sure to replace the example IP with one of the addresses from your pool:

    ip -6 addr add 2600:3c03:e000:0084::/64 dev eth0

You may verify that the IP has been brought up by issuing the `ip -6 addr show eth0` command:

    [root@europa ~]# ip -6 addr show eth0
    3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qlen 1000
        inet6 2600:3c03:e000:84::/64 scope global
           valid_lft forever preferred_lft forever
        inet6 2600:3c03::f03c:91ff:fedb:26b7/64 scope global dynamic
           valid_lft 2591982sec preferred_lft 604782sec
        inet6 fe80::f03c:91ff:fedb:26b7/64 scope link
           valid_lft forever preferred_lft forever

If you need to configure more than 16 IPv6 address, add a line to `/etc/sysctl.conf` that resembles the following:

{: .file-excerpt }
/etc/sysctl.conf
:   ~~~ bash
    net.ipv6.conf.eth0.max_addresses=32
    ~~~

If at any time you wish to see IPv6 addresses that are brought up on your Linode, issue the following command:

    ip -6 addr show

Additionally, you can use the following command to see information about your network route:

    ip -6 route show

### Private and Floating IPs

Since addresses in your pool can be used on any of your Linodes in the same facility, you will not need to configure failover through the Linode Manager for any of your IPv6 addresses. However, you will still need to configure software on your Linode to handle the failover process.

IPv6 traffic to and from Linodes within the same facility is not counted towards your monthly transfer, so there is no need to request private IPv6 IPs.

Adding IPv6 Addresses
---------------------

This section will provide instructions on how to configure your IPv6 addresses for a specific Linux distribution. In the examples below, we used the following pool with a /64 subnet: `2600:3c03:e000:0084:: - 2600:3c03:e000:84:ffff:ffff:ffff:ffff:`. Remember to replace the sample addresses with the ones you have been assigned.

### Ubuntu / Debian

On Debian and Ubuntu distributions, you can edit your `/etc/network/interfaces` file. In this example, we will use the `ip` command to add the address.

{: .note }
>
> You should only add IPv6 addresses within the `eth0` section, and not an interface label section such as `eth0:0` or `eth0:1`.

{: .file }
/etc/network/interfaces
:   ~~~
    auto eth0
    iface eth0 inet dhcp
        up /sbin/ip -6 addr add 2600:3c03:e000:84::0/64 dev eth0
        up /sbin/ip -6 addr add 2600:3c03:e000:84::1/64 dev eth0
        up /sbin/ip -6 addr add 2600:3c03:e000:84::2/64 dev eth0
    ~~~

You will then need to restart networking by using the following command:

    ifdown -a && ifup -a

### CentOS / Fedora

In CentOS and Fedora you will need to add an `IPV6ADDR_SECONDARIES` line to your `/etc/sysconfig/network-scripts/ifcfg-eth0` file. This line is a space separated list of the IPv6 addresses and the subnet you want brought up at boot. Below is an example of the configuration file.

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~
    DEVICE="eth0"
    BOOTPROTO="dhcp"
    IPV6INIT="yes"
    IPV6_AUTOCONF="yes"
    ONBOOT="yes"
    TYPE="Ethernet"
    IPV6ADDR_SECONDARIES="2600:3c03:e000:84::0/64 2600:3c03:e000:84::1/64 2600:3c03:e000:84::2/64"
    ~~~

### Arch Linux

In Arch Linux, if you have a single fixed wired network connection, DHCP is already enabled by default. However, to manually configure IP addresses you will need to do the following:

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
            Address=('xx.xx.xx.xx/24' 'xxx.xxx.xxx.xxx/17')
            Gateway='xxx.xxxx.xx.x'

            ## For IPv6 autoconfiguration
            #IP6=stateless

            ## For IPv6 static address configuration
            IP6=static
            Address6=('2600:3c03:e000:00084::/64')
            Gateway6='fe80::1'

            ## DNS resolvers
            DNS=('xx.xx.xx.x' 'xx.xx.xx.x' 'xx.xx.xx.x')
        ~~~
	
5.  Enable your new network profile:

        netctl enable ethernet-static

### Gentoo

The configuration of additional IPv6 addresses in Gentoo is simple. Append the IPv6 addresses and netmask you want to the `config_eth0` line in `/etc/conf.d/net`. The list itself is a space separated list.

{: .file }
/etc/conf.d/net
:   ~~~
    # This blank configuration will automatically use DHCP for any net.*
    # scripts in /etc/init.d.  To create a more complete configuration,
    # please review /usr/share/doc/openrc*/net.example* and save your configuration
    # in /etc/conf.d/net (this file :]!).
    config_eth0="dhcp 2600:3c03:e000:84::0/64 2600:3c03:e000:84::1/64 2600:3c03:e000:84::2/64"
    ~~~

IPv6 Pools
----------

When dealing with IPv6, pool sizes can get very large, very fast. Linode offers three different sizes of IPv6 pools (/56, /64, and /116), with the default size being /64. The table below breaks down the number of available addresses per pool.

{: .table .table-striped }
| Subnet | No. of IPS                    |
|:-------|:------------------------------|
| /56    | 4,722,366,482,869,645,213,696 |
| /64    | 18,446,744,073,709,551,616    |
| /116   | 4,096                         |
|--------|-------------------------------|

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Understanding IP Addressing](http://www.ripe.net/internet-coordination/press-centre/understanding-ip-addressing)
- [IPv6 Subnet Cheat Sheet](http://www.ipv6ve.info/project-definition/ipv6-subnet-cheat-sheet-and-ipv6-cheat-sheet-reference)



