---
author:
  name: Linode
  email: docs@linode.com
description: 'Linodes use DHCP to acquire their IP address, routing and DNS information. However, if you need multiple IPs, you must use a static configuration.'
keywords: 'static ip,linux networking,ifconfig,configure network,linux network,multiple ip,static'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/configuring-static-ip-interfaces/ networking/linux-static-ip-configuration']
modified: Wednesday, November 25th, 2015
modified_by:
  name: Linode
published: 'Wednesday, November 25th, 2015'
title: Configure a Static IP Address
---

By default, Linodes use DHCP to acquire their IP address, routing and DNS information. However, DHCP will only assign one IP to your Linode, so if you need multiple IPs, you must use a static configuration. You can either use [Network Helper](/docs/platform/network-helper) to automatically create a static networking configuration, or configure manually using the steps below.

Some Linux distributions will determine the [netmask](https://en.wikipedia.org/wiki/Subnetwork) based on its IP address block. The different IP blocks available to your Linode are:

*   Public IPv4 - /24
*   Private IPv4 - /17
*   IPv6 - /64

{: .note}
>
>As errors in network configurations may disconnect SSH connections, it is advised that you use the [Linode Shell (LISH)](/docs/networking/using-the-linode-shell-lish) when making network configuration changes.


## General Network Configuration

Before making any changes, you'll first need some information from the [Linode Manager](https://manager.linode.com/). Log in and click the **Remote Access** tab. There you'll find your **IPv4 and IPv6 addresses** (both public and private, if you assigned a private IP), **default gateways**, **netmasks** and **DNS resolvers**.

[![Linode Manager / Remote Access](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

Keep this information handy, because you'll need it as you configure your Linode's network settings. Since Linodes only have one virtual ethernet interface (**eth0**), you'll need to assign additional IPs to aliases on that interface. For example, **eth0:0**, **etho0:1**, etc.

Aliases are numbered in the order they are given, but most outbound connections will originate from the IP assigned to the **eth0** interface. If you need server daemons to bind to a particular IP address, you'll need to specify the correct IP in their configuration files.


## Hostname and FQDN Settings

If you haven't already done so, set your system's hostname and [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) (FQDN) using our [Getting Started](https://linode.com/docs/getting-started#setting-the-hostname) guide.

## DNS Resolver Settings

If you've migrated your Linode to a new datacenter, you may need to edit your `resolv.conf` file so that your Linode can resolve DNS queries. Your DNS nameservers are listed under the **Remote Access** tab of the Linode Manager (see [the screenshot above](#general-network-configuration)).

{: .file-excerpt }
/etc/resolv.conf
: ~~~
  domain members.linode.com
  nameserver 203.0.113.9
  nameserver 203.0.113.10
  options rotate
  ~~~

*   **domain**: Sets the system's short hostname (*members*) to be used instead of the FQDN (*members.linode.com*).
*   **nameserver**: The IPv4 or IPv6 address of those DNS resolvers from the Linode Manager you wish your system to use. You can specify as many nameservers as you like and use resolvers other than Linode's if you choose.
*   **options rotate**: The *rotate* option spreads DNS queries among the listed nameservers instead of always using the first available.

For more info on `resolv.conf`, see [its man page](http://linux.die.net/man/5/resolv.conf).

## Static IP Configuration

Please note that although your Linode may have multiple IP addresses assigned using virtual interfaces, you should only specify a default gateway for one combination of IP/interface. The gateway should be on the same network as the desired IP address. For example, if you have the interface `eth0:3` at `198.51.100.5`, you should use `198.51.100.1` for the gateway.

A default gateway should not be specified for private IP addresses. Additionally, the subnet mask for private IP addresses should be set to `255.255.128.0`, *not* `255.255.255.0`.

{: .caution}
>
>In the examples below, be sure the IP addresses reflect those shown under the **Remote Access** tab of the Linode Manager.

### Arch Linux

There are multiple ways to configure static IP addresses in Arch. See the [Static IP Address](https://wiki.archlinux.org/index.php/Network_Configuration#Static_IP_address) section of Arch's Network Configuration Wiki page.


### CentOS 7 / Fedora 22

1.  Edit the interface's config file:

    {: .file }
    /etc/sysconfig/network-scripts/ifcfg-eth0
    :   ~~~
        # Configuration for eth0
        DEVICE=eth0
        BOOTPROTO=none
        ONBOOT=yes

        # Adding a public IP address.
        # The netmask is taken from the PREFIX (where 24 is Public IP, 17 is Private IP)
        IPADDR0=198.51.100.5
        PREFIX0=24

        # Specifying the gateway
        GATEWAY=198.51.100.1

        # Add a second public IP address.
        IPADDR1=192.0.2.6
        PREFIX1=24

        # Add a private IP address.
        IPADDR2=192.168.133.234
        PREFIX2=17
        ~~~

2.  Reload the networking service:

        systemctl restart network


### CentOS 6.5

1.  CentOS 6.5 keeps the information for each interface in a separate file named `/etc/sysconfig/network-scripts/ifcfg-<interface_alias_name>` so you'll need to create one for eth0, *and* one for each alias (eth0:0, eth0:1, etc.).
 
    {: .file }
    /etc/sysconfig/network-scripts/ifcfg-eth0
    : ~~~
      # Configuration for eth0
      DEVICE=eth0
      BOOTPROTO=none

      # This line ensures that the interface will be brought up during boot.
        ONBOOT=yes
      # eth0 - This is the main IP address that will be used for most outbound connections.
      IPADDR=198.51.100.5
      NETMASK=255.255.255.0
      GATEWAY=198.51.100.1
      ~~~

    {: .file }
    /etc/sysconfig/network-scripts/ifcfg-eth0:0
    : ~~~
      # Configuration for eth0:0
      DEVICE=eth0:0
      BOOTPROTO=none

      # This line ensures that the interface will be brought up during boot.
      ONBOOT=yes

      # eth0:0
      IPADDR=192.0.2.6
      NETMASK=255.255.255.0
      ~~~

2.  Restart networking:

        service network restart


### Debian / Ubuntu

1.  Edit the interface's config file:

    {: .file }
    /etc/network/interfaces
    :   ~~~
        # The loopback interface
        auto lo
        iface lo inet loopback

        
        # We no longer need to use aliases (eg. eth0:0 eth0:1 eth0:2)
        # This line ensures that the interface will be brought up during boot
        auto eth0
        allow-hotplug eth0

        # Your primary public IP address.
        iface eth0 inet static
            address 198.51.100.5
            netmask 255.255.255.0
            gateway 198.51.100.1

        # Add a second public IP address.
        iface eth0 inet static
            address 192.0.2.6
            netmask 255.255.255.0

        # Add a private IP address.
        iface eth0 inet static
            address 192.168.133.234
            netmask 255.255.128.0
        ~~~

2.  Flush all IP information for `eth0`. Then bring the interface down and back up to activate DHCP:

        ip addr flush dev eth0
        ifdown eth0 && ifup eth0


### Gentoo

1.  Networking in Gentoo utilizes the `netifrc` utility.

    {: .file }
    /etc/conf.d/net
    : ~~~
      # Configuration for eth0 on multiple IP addresses
      # Each IP address is separated by a space
      config_eth0="198.51.100.5/24 192.0.2.6/24 192.168.133.234/17"
      routes_eth0="default gw 198.51.100.1"
      ~~~

2.  Restart networking interface:

        /etc/init.d/net.eth0 restart


### OpenSUSE

1.  Edit the interface's config file:

    {: .file }
    /etc/sysconfig/network/ifcfg-eth0
    : ~~~
      BOOTPROTO='static'
      STARTMODE='onboot'

      # This is the main IP address that will be used for most outbound connections
      # The address, netmask and gateway are all necessary. The metric is not necessary, but
      # ensures you always talk to the same gateway if you have multiple public IPs from
      # different subnets.
      IPADDR='198.51.100.5'
      NETMASK='255.255.255.0'
      GATEWAY="198.51.100.1"

      # Add a second public IP address.
      IPADDR1='192.0.2.6'
      NETMASK1='255.255.255.0'
      LABEL1='0'

      # Add a private IP address.
      IPADDR2='192.168.133.234'
      NETMASK2='255.255.128.0'
      LABEL2='1'
      ~~~

2.  You will need to add your gateway to the network routes file:

    {: .file }
    /etc/sysconfig/network/routes
    : ~~~
      # Destination   Gateway                 Netmask                 Device
      default         198.51.100.1            255.255.255.0           eth0
      ~~~

3.  Restart networking:

        systemctl restart network


## Test Connectivity

1.  Double-check that your `/etc/resolv.conf` exists and is correct.

2.  From the Linode, ping each default gateway listed on the **Remote Access** tab of the Linode Manager:

        ping 198.51.100.1