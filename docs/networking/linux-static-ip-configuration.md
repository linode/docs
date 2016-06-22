---
author:
  name: Linode
  email: docs@linode.com
description: 'Computer networks frequently use DHCP to assign IP addresses, routing and DNS information to systems which join the network. Additional IPs can be assigned to virtual network interfaces for a fully static IP address configuration, including multiple static addresses.'
keywords: 'multiple ip addresses,linux static ip,DHCP,change ip address,network configuration,dns,gateway,routing'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/configuring-static-ip-interfaces/']
modified: Wednesday, June 1st, 2016
modified_by:
  name: Linode
published: 'Thursday, July 20th, 2014'
title: Linux Static IP Configuration
---

Network configurations are generally assigned to a networked device in one of two methods, either by [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) or static assignments. These terms (and others) are often used when discussing IP addresses, but along with IPs, a basic network interface configuration usually needs DNS resolvers and routing as well.

Upon a Linode's creation, an IPv4 address is selected from a pool of available addresses from the datacenter your Linode is hosted in. Our [Network Helper](https://www.linode.com/docs/platform/network-helper) is *enabled* by default for new Linodes, meaning that when you deploy a Linux distribution to your Linode and boot it, the host system detects which distro was selected and modifies the [network configuration files](/docs/platform/network-helper#what-files-are-affected) in the disk image to statically configure the Linode's IPv4 addresses, routing and DNS. Network Helper does not work with IPv6, so v6 addresses are assigned via SLAAC during deployment.

If Network Helper is *disabled* (or if your Linode was created before Network Helper became default), a Linode will be assigned its IPv4 network configuration by DHCP from the datacenter's networking hardware. One limitation of DHCP is that it can only assign one IP address per DHCP lease request. If you want additonal IPs for your Linode, static addressing must be used.

Due to the limited availablilty of IPv4 addresses, additional v4 addresses for your Linode must be requested by [contacting support](/docs/support) with a technical justification. Once approved, they can be added through the Remote Access tab of the Linode Manager. [Additional IPv6 addresses](/docs/networking/native-ipv6-networking#additional-ipv6-addresses) are also available by submitting a support ticket.

An alternative to using the Linode Manager for static addressing is to manually configure within your Linux distribution, and it's this method that will be the focus of this guide. **Be aware that errors in network configurations can disconnect SSH sessions**, so it is advised that you use the [Linode Shell (Lish)](/docs/networking/using-the-linode-shell-lish) when making the changes below.

## General Network Configuration

Log in to the [Linode Manager](https://manager.linode.com/) and go to the **Remote Access** tab. From there you will see your Linode's:

*   IPv4 and IPv6 addresses (both private and public)
*   [Netmask](https://en.wikipedia.org/wiki/Subnetwork)
*   Default IPv4 gateway
*   DNS resolvers

Keep this information handy, because you'll need it as you configure your Linode's network settings.

[![Linode Manager / Remote Access](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

{: .note}
>
>Each Linode has only one virtual ethernet interface, *eth0*. Most outbound connections will still originate from the IP assigned to *eth0*, but if you need server daemons to bind to a particular IP address, you'll need to specify the correct IP in their configuration files.

## Static Network Configuration

**Addressing**

The different IP blocks available to your Linode are:

*   Public IPv4 - /24
*   Private IPv4 - /17
*   IPv6 - /64

{: .note}
>
>Some Linux distributions determine their [netmask](https://en.wikipedia.org/wiki/Subnetwork) based on the assigned IP address block.

**Gateway**

Although your Linode may have multiple IP addresses assigned using virtual interfaces, you should only specify a default gateway for *one* interface. The gateway should be on the same network as the desired IP address. For example, if you have the interface `eth0:3` assigned to the address `198.51.100.5`, you should use `198.51.100.1` as the gateway.

A default gateway should not be specified for private IP addresses. Additionally, the subnet mask for private IPs should be set to `255.255.128.0`, *not* `255.255.255.0`.

**DNS Resolution**

Your DNS nameservers are listed under the **Remote Access** tab of the Linode Manager (see [the screenshot above](#general-network-configuration)). With exception to specific situations, you should not change your Linode's nameservers by editing `/etc/resolv.conf`. Depending on your distribution, `resolv.conf` may be overwritten frequently so permanent DNS and resolver configuration options are usually intended to be set elsewhere.

For more info on `resolv.conf`, see [its manual page](http://linux.die.net/man/5/resolv.conf).

{: .caution}
>
>Using the examples below, be sure the IP addresses you enter reflect those shown under the **Remote Access** tab of the Linode Manager.

### Arch

Add the following addressing to the interface's configuration.

{: .file-excerpt }
/etc/systemd/network/05-eth0.network
:   ~~~ conf
    [Match]
    Name=eth0

    [Network]
    Gateway=198.51.100.1

    # Your primary public IP address
    Address=198.51.100.2/24

    # To add a second public IP address:
    Address=198.51.100.3/24

    #To add a private IP address:
    Address=192.168.133.234/17
    ~~~

There are multiple ways to configure static IP addresses in Arch. See the [Static IP Address](https://wiki.archlinux.org/index.php/Network_Configuration#Static_IP_address) section of Arch's Network Configuration Wiki page for other options such as using Netctl. There are also several ways to [configure DNS](https://wiki.archlinux.org/index.php/Resolv.conf#Preserve_DNS_settings) without modifying `resolv.conf`.

### CentOS 7 / Fedora 22+

The default ethernet interface file is located at `/etc/sysconfig/network-scripts/ifcfg-eth0`. You can configure a static IP address by adding or editing the following lines, substituting your own Linode's IP addresses, gateways, and DNS resolvers:

{: .file-excerpt }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~ conf
    DEVICE="eth0"
    BOOTPROTO="static"
    ONBOOT="yes"
    IPV6INIT="yes"
    IPV6_AUTOCONF="yes"
    NM_CONTROLLED="no"
    PEERDNS="no"

    GATEWAY=198.51.100.1
    
    # Your primary public IP address
    # The netmask is taken from the PREFIX (where 24 is a public IP, 17 is a private IP)
    IPADDR0=198.51.100.5
    PREFIX0="24"

    # To add a second public IP address:
    IPADDR1=198.51.100.10
    PREFIX1="24"
    
    # To add a private IP address:
    IPADDR2=192.0.2.6
    PREFIX2="17"

    DOMAIN=members.linode.com
    
    DNS1=203.0.113.1
    DNS2=203.0.113.2
    DNS3=203.0.113.3
    ~~~

To load your changes, restart the network service:

    sudo systemctl restart network

{: .note}
> CentOS 7 and recent versions of Fedora also include NetworkManager, which uses tools such as `nmtui` and `nmcli` to modify and create network configuration files. The above method, however, is a more straightforward way of making the necessary modifications. 

### CentOS 6

Like in CentOS 7, simply edit the ethernet interface file to configure a static IP address:

{: .file-excerpt }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~ conf
    BOOTPROTO=none
    PEERDNS=no
    
    # Your primary static public IP address.
    IPADDR0=198.51.100.5
    PREFIX0=24
    GATEWAY=198.51.100.1
    DOMAIN=members.linode.com
    DNS1=203.0.113.1
    DNS2=203.0.113.2
    DNS3=203.0.113.3
    ~~~

To add the resolv.conf option to rotate DNS providers, create a dhclient script:

{: .file }
/etc/dhcp/dhclient.d/rotate.sh
:   ~~~ conf
    rotate_config() {
        echo "options rotate" >> /etc/resolv.conf
    }

    rotate_restore() {
        :
    }
    ~~~

For multiple static IP addresses, additional IPs are assigned to an alias you create for *eth0*. To achieve this, an additional file must be created for the alias. For example, an `eth0:1` file must be created for the *eth0:1* interface alias, `eth0:2` for *eth0:2*, etc. 

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0:1
:   ~~~ conf
    # Add a second static public IP address.
    DEVICE=eth0:1
    IPADDR1=198.51.100.10
    ~~~

To put any changes into effect, restart your networking service:

    sudo service network restart

For more information on the options available to interface files, see `man ifcfg` and [Fedora's documentation](https://docs.fedoraproject.org/en-US/Fedora/23/html/Networking_Guide/sec-Using_the_Command_Line_Interface.html) and the file `/usr/share/doc/initscripts-*/sysconfig.txt` on CentOS and Fedora installations.

### Debian / Ubuntu

Add the following to the interface's configuration file:

{: .file-excerpt }
/etc/network/interfaces
:   ~~~ conf
    . . .

    # Your primary public IP address.
    auto eth0
    iface eth0 inet static
        address 198.51.100.5/24
        gateway 198.51.100.1
        dns-nameservers 203.0.113.1 203.0.113.2 203.0.113.3
        dns-search members.linode.com
        dns-options rotate

    # To add a second public IP address:
    iface eth0 inet static
        address 198.51.100.10/24

    # To add a private IP address:
    iface eth0 inet static
        address 192.0.2.6/17
    ~~~

Note that static and dynamic addressing cannot be combined in Debian and Ubuntu systems. In order to statically configure additional IP addresses, you must also statically configure your default IP address.

### Gentoo

Networking in Gentoo utilizes the `netifrc` utility. Addresses are specified in the `config_eth0` line and separated by spaces. The gateway is defined in the `routes_eth0` line.

{: .file-excerpt }
/etc/conf.d/net
:   ~~~ conf
    config_eth0="198.51.100.5/24 198.51.100.10/24 192.0.2.6/17"
    routes_eth0="default via 198.51.100.1"
    . . .
    ~~~

### OpenSUSE

1.  Edit the interface's config file with:

    {: .file-excerpt }
    /etc/sysconfig/network/ifcfg-eth0
    : ~~~ conf
      BOOTPROTO=static
      
      . . .

      # Your primary public IP address.
      IPADDR=198.51.100.5/24
      GATEWAY=198.51.100.1

      # Add a second public IP address:
      IPADDR1=198.51.100.10/24
      LABEL1=1

      # Add a private IP address:
      IPADDR2=192.0.2.6/17
      LABEL2=2
      ~~~

2.  You will also need to add your gateway to the network routes file:

    {: .file }
    /etc/sysconfig/network/routes
    : ~~~
      # Destination   Gateway                 Netmask                 Device
      default         198.51.100.1            -                       eth0
      ~~~

3.  Edit each line to add DNS and domain info for netconfig. Netconfig uses this info to modify `resolv.conf`:

    {: .file-excerpt }
    /etc/sysconfig/network/config
    : ~~~
    . . .
    NETCONFIG_DNS_STATIC_SERVERS="203.0.113.1 203.0.113.2 203.0.113.3"
    . . .
    NETCONFIG_DNS_STATIC_SEARCHLIST="members.linode.com"
    . . .
    NETCONFIG_DNS_RESOLVER_OPTIONS="rotate"
      ~~~

## Disable Network Helper

When statically configuring IP addresses, [Network Helper](/docs/platform/network-helper) should be disabled to avoid it overwriting your interface's configuration file in the future.

1.  From the Linode Manager's **Dashboard**, choose **Edit** for the desired configuration profile.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/linode-dashboard-hilighted_small.png)](/docs/assets/linode-dashboard-hilighted.png)

2.  Scroll to the **Filesystem/Boot Helpers** section at the bottom of the page. The radio button for **Auto-configure Networking** should be set to **Yes** to indicate Network Helper is enabled. To disable it, select **No** and click **Save Changes**.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/network-helper-hilighted_small.png)](/docs/assets/network-helper-hilighted.png)


## Reboot Your Linode

It's best to reboot your Linode from the Dashboard of the Linode Manager rather than use `ifconfig` or an init system to restart the interfaces or distro's network services. This ensures that the new settings take effect without issues and that the networking services reliably start in full from the boot-up.

## Test Connectivity

1.  Log back into your Linode through SSH.

2.  Confirm that your `/etc/resolv.conf` exists and is correct.

3.  Ping each default IPv4 gateway listed on the **Remote Access** tab of the Linode Manager and ping a domain to confirm DNS resolution works:

        ping -c 3 198.51.100.1
        ping -c 3 *some_domain*.com