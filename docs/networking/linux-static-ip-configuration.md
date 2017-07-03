---
author:
  name: Linode
  email: docs@linode.com
description: 'Computer networks frequently use DHCP to assign IP addresses, routing and DNS information to systems which join the network. Additional IPs can be assigned to virtual network interfaces for a fully static IP address configuration, including multiple static addresses.'
keywords: 'multiple ip addresses,linux static ip,change ip address,network configuration,dns,DHCP'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/configuring-static-ip-interfaces/']
modified: Thursday, June 8th, 2017
modified_by:
  name: Linode
published: 'Thursday, July 20th, 2014'
title: Linux Static IP Configuration
---

Network configurations are generally assigned to a networked device in one of two methods, either by [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) or static assignment. These terms (and others) are often used when discussing IP addresses. In addition to IP addresses, a basic static configuration usually needs DNS resolvers and routing, too.

![Linux Static IP Configuration](/docs/assets/linux-static-ip-configuration.png)

Upon a Linode's creation, an IPv4 address is selected from a pool of available addresses from the datacenter in which your Linode is hosted. Our [Network Helper](/docs/platform/network-helper) is *enabled* by default for new Linodes. This means that when you deploy a Linux distribution to your Linode and boot it, the host system detects which distro was selected and modifies the [network configuration files](/docs/platform/network-helper#what-files-are-affected) in the disk image to statically configure the Linode's IPv4 addresses, routing, and DNS. Your Linode's default IPv6 address will be assigned via [SLAAC](https://en.wikipedia.org/wiki/IPv6_address#Stateless_address_autoconfiguration), but additional IPv6 addresses can be added [manually](/docs/networking/native-ipv6-networking).

If Network Helper is *disabled* (or if your Linode was created before Network Helper became default), your Linode will be assigned its IPv4 network configuration by DHCP from the datacenter's networking hardware. One limitation of DHCP is that it can only assign one IP address per DHCP lease request. If you want additional IPs for your Linode, you must use static addressing.

Due to the limited availability of IPv4 addresses, additional public IPv4 addresses for your Linode must be requested by [contacting support](/docs/support) with a technical justification. Once approved, IPv4 addresses can be added through the Remote Access tab of the Linode Manager. [Additional IPv6 addresses](/docs/networking/native-ipv6-networking#additional-ipv6-addresses) are also available by submitting a support ticket.

Instead of using [Network Helper](/docs/platform/network-helper) for static addressing, you can manually configure it within your Linux distribution. This alternative method will be the focus of this guide. **Be aware that errors in network configurations can disconnect SSH sessions**, so we recommend you use the [Linode Shell (Lish)](/docs/networking/using-the-linode-shell-lish) when making the changes below.

## General Network Configuration

Log in to the [Linode Manager](https://manager.linode.com/) and go to the **Remote Access** tab. From there, you will see your Linode's:

*   IPv4 and IPv6 addresses (both private and public)
*   [Netmask](https://en.wikipedia.org/wiki/Subnetwork)
*   Default IPv4 gateway
*   DNS resolvers

Keep this information handy because you'll need it as you configure your Linode's network settings.

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

Your DNS nameservers are listed under the **Remote Access** tab of the Linode Manager (see [the screenshot above](#general-network-configuration)). Unless you have a specific reason for doing so, you should not change your Linode's nameservers by editing `/etc/resolv.conf`. Depending on your distribution, `resolv.conf` may be overwritten by a networking tool like Network Manager or `dhclient`. Permanent DNS and resolver configuration options are usually set elsewhere.

For more info on `resolv.conf`, see [its manual page](http://linux.die.net/man/5/resolv.conf).

{: .caution}
>
>Using the examples below, be sure the IP addresses you enter reflect those shown under the **Remote Access** tab of the Linode Manager.

### Arch / CoreOS Container Linux

Add the following addressing to the interface's configuration:

{: .file-excerpt }
/etc/systemd/network/05-eth0.network
:   ~~~ conf
    [Match]
    Name=eth0

    [Network]
    DHCP=no
    DNS= 203.0.113.1 203.0.113.2 203.0.113.3
    Domains=members.linode.com
    IPv6PrivacyExtensions=false

    Gateway=198.51.100.1

    # Your primary public IP address
    Address=198.51.100.2/24

    # To add a second public IP address:
    Address=198.51.100.3/24

    #To add a private IP address:
    Address=192.168.133.234/17
    ~~~

{: .note}
>
>Static IP addresses can be configured in several ways in Arch. Linode's Arch deployments use [*systemd-networkd* and *systemd-resolved*](https://wiki.archlinux.org/index.php/Systemd-networkd#Required_services_and_setup) for both DHCP and static addressing, including with Network Helper.

### CentOS 7 / Fedora

The default ethernet interface file is located at `/etc/sysconfig/network-scripts/ifcfg-eth0`. You can configure a static IP address by editing the following lines, substituting your own Linode's IP addresses, gateways, and DNS resolvers:

{: .file-excerpt }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~ conf

    # Edit this line from "dhcp" to "none":
    BOOTPROTO=none

    # Edit from "yes" to "no":
    PEERDNS=no

    ...

    # Add the following lines:
    DOMAIN=members.linode.com

    # We specifically want GATEWAY0 here, not
    # GATEWAY without an interger following it.
    GATEWAY0=198.51.100.1

    DNS1=203.0.113.1
    DNS2=203.0.113.2
    DNS3=203.0.113.3

    # Your primary public IP address. The netmask
    # is taken from the PREFIX (where 24 is a
    # public IP, 17 is a private IP)
    IPADDR0=198.51.100.5
    PREFIX0=24

    # To add a second public IP address:
    IPADDR1=198.51.100.10
    PREFIX1=24

    # To add a private IP address:
    IPADDR2=192.0.2.6
    PREFIX2=17
    ~~~

To load your changes, restart the network service:

    sudo systemctl restart network

{: .note}
> CentOS 7 and recent versions of Fedora include NetworkManager, which uses tools such as `nmtui` and `nmcli` to modify and create network configuration files. These are additional options to set static addressing if you would prefer to not manually edit the network interface's configuration file.

### CentOS 6

Like in CentOS 7, you can simply edit the ethernet interface file to configure a static IP address:

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

To add the option to rotate DNS providers, create a `dhclient` script:

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

For multiple static IP addresses, additional IPs are assigned to an alias you create for *eth0*. To use this alias, an additional file must be created. For example, an `eth0:1` file must be created for the *eth0:1* interface alias, `eth0:2` for *eth0:2*, etc.

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0:1
:   ~~~ conf
    # Add a second static public IP address.
    DEVICE=eth0:1
    IPADDR=198.51.100.10
    ~~~

To put these changes into effect, restart your networking service:

    sudo service network restart

For more information on the options available to interface files, see `man ifcfg` and [Fedora's documentation](https://docs.fedoraproject.org/en-US/Fedora/23/html/Networking_Guide/sec-Using_the_Command_Line_Interface.html) and the file `/usr/share/doc/initscripts-*/sysconfig.txt` on CentOS and Fedora installations.

### Debian

Add the following to the interface configuration file:

{: .file-excerpt }
/etc/network/interfaces
:   ~~~ conf
    . . .

    # Your primary public IP address.
    auto eth0
    iface eth0 inet static
        address 198.51.100.5/24
        gateway 198.51.100.1

    # To add a second public IP address:
    iface eth0 inet static
        address 198.51.100.10/24

    # To add a private IP address:
    iface eth0 inet static
        address 192.0.2.6/17
    ~~~

To enable name resolution, populate `resolv.conf` with your DNS IP addresses and resolv.conf options ([see man 5 resolv.conf](https://linux.die.net/man/5/resolv.conf)). The `domain`, `search` and `options` lines aren't necessary, but useful to have.

{: .file }
/etc/resolv.conf
:   ~~~ conf

    nameserver 203.0.113.1
    nameserver 203.0.113.2
    nameserver 203.0.113.3
    domain members.linode.com
    search members.linode.com
    options rotate
    ~~~

By default, Debian doesn't include Network Manager or resolvconf to manage `/etc/resolv.conf`. In this situation, it's all right to edit `resolv.conf` because nothing will overwrite your changes on a reboot or restart of networking services. Also be aware that resolv.conf can only use up to three `nameserver` entries.

### Gentoo

Networking in Gentoo uses the `netifrc` utility. Addresses are specified in the `config_eth0` line and separated by spaces. The gateway is defined in the `routes_eth0` line.

{: .file-excerpt }
/etc/conf.d/net
:   ~~~ conf
    config_eth0="198.51.100.5/24 198.51.100.10/24 192.0.2.6/17"
    routes_eth0="default via 198.51.100.1"
    . . .
    ~~~

### OpenSUSE

1.  Modify the interface's config file:

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

3.  Edit each line to add DNS and domain information for netconfig. Netconfig uses this info to modify `resolv.conf`:

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

### Ubuntu

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

Ubuntu includes [resolvconf](http://packages.ubuntu.com/xenial/resolvconf) in its base installation, a small application that manages the content of `/etc/resolv.conf`. Therefore, you should not edit `resolv.conf` directly. Instead, the DNS IP addresses and resolv.conf options need to be added to the interfaces file as shown above.

If you've previously used [Network Helper](/docs/platform/network-helper) to manage your static configuration, you will need to reactivate resolvconf's dynamic update feature to use the setup provided here. You can do so by running:

    dpkg-reconfigure resolvconf

Select **OK** and then **Yes** to apply the change.

## Disable Network Helper

When you're manually configuring static IP addresses, [Network Helper](/docs/platform/network-helper) should be disabled to keep it from overwriting your interface's configuration file in the future.

1.  From the Linode Manager's **Dashboard**, choose **Edit** for the desired configuration profile.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/linode-dashboard-hilighted_small.png)](/docs/assets/linode-dashboard-hilighted.png)

2.  Scroll to the **Filesystem/Boot Helpers** section at the bottom of the page. The radio button for **Auto-configure Networking** should be set to **Yes** to indicate Network Helper is enabled. To disable it, select **No** and click **Save Changes**.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/network-helper-hilighted_small.png)](/docs/assets/network-helper-hilighted.png)

## Reboot Your Linode

It's best to reboot your Linode from the dashboard of the Linode Manager, rather than using `ifconfig` or an init system to restart the interfaces or a distro's network services. Rebooting ensures that the new settings take effect without issues and that the networking services reliably start in full on boot.

## Test Connectivity

1.  Log into your Linode via SSH.

2.  Confirm that your `/etc/resolv.conf` exists and its correct.

3.  Ping each default IPv4 gateway listed on the **Remote Access** tab of the Linode Manager and ping a domain to confirm that DNS resolution works:

        ping -c 3 198.51.100.1
        ping -c 3 google.com

    You can subsitute any domain name for `google.com` in the second command.
