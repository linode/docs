---
author:
  name: Linode
  email: docs@linode.com
description: 'Set static IP, routes and DNS in Linux.'
keywords: ["static", "ip address", "addresses"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/configuring-static-ip-interfaces/']
modified: 2017-11-02
modified_by:
  name: Linode
published: 2014-07-20
title: Linux Static IP Configuration
---

All Linodes are created with one IPv4 address and one for IPv6. An IPv4 address is assigned by our infrastructure from a pool of unused addresses when you create your Linode, and [Stateless Address Autoconfiguration](https://en.wikipedia.org/wiki/IPv6#Stateless_address_autoconfiguration_.28SLAAC.29) (SLAAC) is used for IPv6 assignment. Additional IPv4 or IPv6 addresses can be requested by opening a [support ticket](/docs/platform/support) and detailing your requirements.

![Linux Static IP Configuration](/docs/assets/linux-static-ip-configuration.png)

If you want to manually configure static addressing in your Linode's operating system, this guide shows you how to do that. You will want to make these changes using [Lish](/docs/networking/using-the-linode-shell-lish), so if a configuration error disconnects your SSH session, you won't be locked out of a system that has no network access.


## General Information

**Interfaces**

Each Linode has only one virtual network interface, `eth0`, but depending on your distribution, additional IPs can be assigned to interface aliases (ex: `eth0:1`, `eth0:2`, etc.). Most outbound connections will originate from the IP assigned to `eth0`, but if you need server daemons to bind to a particular IP address or interface, you'll need to specify that in the appropriate configuration files.

**Addressing**

The IP blocks available to your Linode are shown below. Additionally, the subnet mask for private IPs should be `255.255.128.0`, not `255.255.255.0`.

*   Public IPv4 - /24
*   Private IPv4 - /17
*   IPv6 - /64

**Gateway**

Although your Linode may have multiple IP addresses assigned, and additionally may be using virtual interfaces and aliases, you should only specify a gateway for *one* interface. That gateway should be on the same network as the desired IP address.

For example, if the address `198.51.100.5` is assigned to the interface `eth0:3`, you should use `198.51.100.1` as the gateway. A gateway should not be specified for private IP addresses.

**DNS Resolution**

Your DNS resolver addresses are listed under the **Remote Access** tab of the Linode Manager (see the [screenshot](#general-network-configuration) above), though of course you are free to use any resolvers you choose.

However, unless you have a specific reason for doing so, you should *not* change your Linode's nameservers by editing `/etc/resolv.conf`. Depending on your distribution, `resolv.conf` may be overwritten by a networking service such as NetworkManager or systemd-resolved. Resolver options are usually set in the network interface's configuration file.


## Disable Network Helper

Our [Network Helper](/docs/platform/network-helper) tool is enabled by default for new Linodes. It automatically configures static IPv4 addresses, routing, and DNS on each bootup of your Linode. When manually setting static addressing, Network Helper must be *disabled* so it doesn't overwrite your changes on the next reboot.

1.  From the Linode Manager's **Dashboard**, choose **Edit** for the desired configuration profile.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/linode-dashboard-hilighted_small.png)](/docs/assets/linode-dashboard-hilighted.png)

2.  Under **Filesystem/Boot Helpers**  at the bottom of the page,  set **Auto-configure Networking** to **No**. Then click **Save Changes**.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/network-helper-hilighted_small.png)](/docs/assets/network-helper-hilighted.png)


## Configure Static Addressing

On the **Remote Access** tab of the Linode Manager, you'll see the following information for your Linode. Use this information to configure your Linode's network settings as shown below.

*   IPv4 and IPv6 addresses (both private and public)
*   IPv4 gateway
*   IPv6 gateway
*   DNS resolvers (if you want to use Linode's)

[![Linode Manager / Remote Access](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

Below are example configurations for the given Linux distribution. Edit the example files substituting the example IP addresses with those of your Linode, gateway and DNS nameservers. Depending on the amount of addresses you want to configure, not all lines will be necessary.


### Arch, CoreOS Container Linux, Ubuntu 17.10

Networking in these distributions is managed entirely by *systemd*. See `man systemd-networkd` and `man systemd-resolved` for more information.

{{< file-excerpt "/etc/systemd/network/05-eth0.network" >}}
[Match]
Name=eth0

[Network]
DHCP=no
Domains=members.linode.com
IPv6PrivacyExtensions=false

# DNS resolvers (safe to mix IPv4 and IPv6)
DNS=203.0.113.1 2001:db8:0:123::1 203.0.113.2

# IPv4 gateway and primary address.
Gateway=198.51.100.1
Address=198.51.100.2/24

# Add a second public IPv4 address.
Address=198.51.100.3/24

# Add a private address:
Address=192.168.133.234/17

# IPv6 gateway and primary address.
Gateway=fe80::1
Address=2001:db8:2000:aff0::2/64

# Add a second IPv6 address.
Address=2001:db8:2000:aff0::3/32
{{< /file-excerpt >}}


### CentOS 7, Fedora

Networking in CentOS 7 and Fedora is managed by *systemd* and *NetworkManager*. See `man systemd-networkd` and `man networkmanager` for more information. Note that NetworkManger in CentOS 7 and Fedora includes the tools `nmtui` and `nmcli` to modify network configurations. Those are additional options to set static addressing if you would prefer to not directly edit the network interface's configuration file. See `man nmtui` and `man nmcli` for more info.

{{< file-excerpt "/etc/sysconfig/network-scripts/ifcfg-eth0" >}}
# Edit this line from "dhcp" to "none":
BOOTPROTO=none

# If present, edit from "yes" to "no":
PEERDNS=no

# Edit from "yes" to "no".
IPV6_AUTOCONF=no

...

# Add the following lines:
DOMAIN=members.linode.com

# We specifically want GATEWAY0 here, not
# GATEWAY without an integer following it.
GATEWAY0=198.51.100.1

# DNS resolvers (safe to mix IPv4 and IPv6)
DNS1=203.0.113.1
DNS2=2001:db8:0:123::1 203.0.113.2

# Your primary IPv4 address. The netmask
# is taken from the PREFIX (where 24 is a
# public IP, 17 is a private IP)
IPADDR0=198.51.100.5
PREFIX0=24

# Add a second public IPv4 address.
IPADDR1=198.51.100.10
PREFIX1=24

# Add a private IPv6 address.
IPADDR2=192.0.2.6
PREFIX2=17

# IPv6 gateway and primary address.
IPV6_DEFAULTGW=fe80::1
IPV6ADDR=2001:db8:2000:aff0::2/128

# Add additional IPv6 addresses, separated by a space.
IPV6ADDR_SECONDARIES=2001:db8:2000:aff0::3/64 2001:db8:2000:aff0::4/64
{{< /file-excerpt >}}

### CentOS 6

Networking CentOS 6 is managed by *dhclient*. NetworkManager is not installed by default, however a static configuration for CentOS 6 differs only slightly from CentOS 7 and Fedora. See the [RHEL 6 Deployment Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/ch-Network_Interfaces.html) for more information.

{{< file-excerpt "/etc/sysconfig/network-scripts/ifcfg-eth0" >}}
# Edit this line from "dhcp" to "none":
BOOTPROTO=none

# If present, edit from "yes" to "no":
PEERDNS=no

# If present, edit from "yes" to "no":
IPV6_AUTOCONF=no

...

# Add the following lines:
DOMAIN=members.linode.com

# We specifically want GATEWAY0 here, not
# GATEWAY without an integer following it.
GATEWAY=198.51.100.1

# DNS resolvers (safe to mix IPv4 and IPv6)
DNS1=203.0.113.1
DNS2=2001:db8:0:123::1

# Your primary IPv4 address. The netmask
# is taken from the PREFIX (where 24 is a
# public IP, 17 is a private IP)
IPADDR0=198.51.100.5
PREFIX0=24

# Add a second public IPv4 address.
IPADDR1=198.51.100.10
PREFIX1=24

# Add a private IPv6 address.
IPADDR2=192.0.2.6
PREFIX2=17

# Your primary IPv6 address (specifying gateway not necessary).
IPV6ADDR=2001:db8:2000:aff0::2/64

# Add additional IPv6 addresses, separated by a space.
IPV6ADDR_SECONDARIES=2001:db8:2000:aff0::3/64 2001:db8:2000:aff0::4/64
{{< /file-excerpt >}}


### Debian

Debian 7 through 9 all use *ifup* and *ifdown* to manage networking. In that configuration, Debian is one distribution where it's safe to directly edit `/etc/resolve.conf` because nothing will overwrite your changes if you reboot or restart networking services.

Though systemd-networkd and systemd-resolved are both present in Debian 8 and 9, they're not enabled. If you decide to enable these systemd services to manage networking, you can not set static addresses in the file `/etc/network/interfaces` as shown below. You'll need to use the section further above for [Arch, Container Linux and Ubuntu 17.10](/docs/networking/linux-static-ip-configuration#arch--coreos-container-linux--ubuntu-1710_). For more information, see `man ifup`, `man ifdown`, `man interfaces 5`, `man systemd-networkd` and `man systemd-resolved`.

1.  Edit your configuration file to add the appropriate information:

    {{< file-excerpt "/etc/network/interfaces" >}}
. . .

# IPv4 gateway and primary address. The netmask
# is taken from the PREFIX (where 24 is a
# public IP, 17 is a private IP)
iface eth0 inet static
  address 198.51.100.5/24
  gateway 198.51.100.1

# Add a second public IPv4 address.
iface eth0 inet static
  address 198.51.100.10/24

# IPv6 gateway and primary address.
iface eth0 inet6 static
  address 2001:db8:2000:aff0::1/64
  gateway fe80::1

# Add a second IPv6 address.
iface eth0 inet6 static
  address 2001:db8:2000:aff0::2/32 
{{< /file-excerpt >}}

2.  Populate `resolv.conf` with DNS resolver addresses and resolv.conf options ([see man 5 resolv.conf](https://linux.die.net/man/5/resolv.conf)). Be aware that resolv.conf can only use up to three `nameserver` entries. The *domain* and *options* lines aren't necessary, but useful to have.

    {{< file "/etc/resolv.conf" >}}
nameserver 203.0.113.1
nameserver 2001:db8:0:123::3
nameserver 203.0.113.3
domain members.linode.com
options rotate
{{< /file >}}


### Gentoo

Networking in Gentoo is managed by *netifrc*. See the [Gentoo Wiki](https://wiki.gentoo.org/wiki/Netifrc) and [Gentoo handbook](https://wiki.gentoo.org/wiki/Handbook:X86/Full/Networking) for more information.

{{< file-excerpt "/etc/conf.d/net" >}}
# IPv4 gateway. Not necessary to specify IPv6 gateway.
routes_eth0="default via 198.51.100.1"

# IPv4 addresses, private and public.
config_eth0="198.51.100.5/24
198.51.100.10/24
192.0.2.6/17"

# IPv6 Addresses
config_eth0="2001:db8:2000:aff0::1/64
2001:db8:2000:aff0::2/32
2001:db8:2000:aff0::3/32"

# DNS resolvers. Can mix IPv4 and IPv6.
dns_servers_eth0="203.0.113.1
2001:db8:0:123::2
203.0.113.3"
{{< /file-excerpt >}}


### OpenSUSE

Networking in OpenSUSE is managed by *wicked* and *netconfig*. In addition to directly editing the network configuration files shown below, you can also use [YaST](https://en.opensuse.org/Portal:YaST). See OpenSUSE's [networking documentation](https://doc.opensuse.org/documentation/leap/reference/html/book.opensuse.reference/cha.basicnet.html) for more information.

1.  Modify the interface's config file:

    {{< file-excerpt "/etc/sysconfig/network/ifcfg-eth0" >}}
BOOTPROTO=static
NAME=eth0

# Your primary public IP address and gateway.
IPADDR=198.51.100.5/24
GATEWAY=198.51.100.1

# Add a second IPv4 address:
IPADDR1=198.51.100.10/24

# Primary IPv6 address and gateway.
IPV6ADDR=2001:db8:2000:aff0::2/128
IPV6_DEFAULTGW=fe80::1

# Add additional IPv6 addresses, separated by a space.
IPV6ADDR_SECONDARIES=2001:db8:2000:aff0::3/64 2001:db8:2000:aff0::4/64
{{< /file-excerpt >}}

2.  Then add your IPv4 gateway to the network routes file:

    {{< file "/etc/sysconfig/network/routes" >}}
# Destination   Gateway                 Netmask                 Device
default         198.51.100.1            -                       eth0
{{< /file-excerpt >}}

3.  Last, set your DNS resolvers and options for netconfig, which then uses this info to modify `resolv.conf`:

    {{< file-excerpt "/etc/sysconfig/network/config" >}}
. . .
NETCONFIG_DNS_STATIC_SERVERS="203.0.113.1 2001:db8:0:123::2 203.0.113.3"
. . .
NETCONFIG_DNS_STATIC_SEARCHLIST="members.linode.com"
. . .
NETCONFIG_DNS_RESOLVER_OPTIONS="rotate"
{{< /file-excerpt >}}


### Ubuntu

The configuration below applies to 14.04 and 16.04. See above for 17.10. Ubuntu 14.04 and 16.04 include [resolvconf](http://packages.ubuntu.com/xenial/resolvconf) in their base installation. This is an application which manages the contents of `/etc/resolv.conf`, so do not edit `resolv.conf` directly. Instead, add DNS resolver addresses and options to the network interface file as shown.

Like with Debian, systemd-networkd and systemd-resolved are both present but not enabled in Ubuntu 16.04. If you decide to enable these services to manage networking, you can not set static addresses in the file `/etc/network/interfaces` as shown below. You'll need to use the section further above for [Arch, Container Linux and Ubuntu 17.10](/docs/networking/linux-static-ip-configuration#arch--coreos-container-linux--ubuntu-1710_). For more information, see `man ifup`, `man ifdown`, `man interfaces 5`, `man systemd-networkd` and `man systemd-resolved`.

{{< file-excerpt "/etc/network/interfaces" >}}
. . .

# IPv4 gateway and primary address. The netmask
# is taken from the PREFIX (where 24 is a
# public IP, 17 is a private IP)
iface eth0 inet static
  address 198.51.100.5/24
  gateway 198.51.100.1

# Add DNS resolvers for resolvconf. Can mix IPv4 and IPv6.
  dns-nameservers 203.0.113.1 2001:db8:0:123::2 203.0.113.3
  dns-search members.linode.com
  dns-options rotate

# Add a second public IPv4 address.
iface eth0 inet static
  address 198.51.100.10/24

# IPv6 gateway and primary address.
iface eth0 inet6 static
  address 2001:db8:2000:aff0::1/64
  gateway fe80::1

# Add a second IPv6 address.
iface eth0 inet6 static
  address 2001:db8:2000:aff0::2/32 
{{< /file-excerpt >}}


## Apply Your Changes

To apply your changes, reboot from the Linode Manager's dashboard. Rebooting ensures that the new settings take effect without issues and that the all networking services reliably start again.

## Test Connectivity

1.  Log into your Linode via SSH.

2.  Use the `ip` tool to be sure the addresses you set above were applied:

        root@localhost:~# ip addr | grep inet
        inet 127.0.0.1/8 scope host lo
        inet6 ::1/128 scope host
        inet 74.207.231.122/24 brd 74.207.231.255 scope global eth0
        inet6 2600:3c02::f03c:91ff:fe24:3a2f/64 scope global
        inet6 fe80::f03c:91ff:fe24:3a2f/64 scope link

3.  Confirm that your `/etc/resolv.conf` exists and is correct. Its contents will differ according to the Linux distribution.

        root@localhost:~# cat /etc/resolv.conf
        nameserver 8.8.8.8
        nameserver 2001:4860:4860::8888
        domain members.linode.com
        options rotate

4.  Try pinging something to confirm you have full connectivity, both over IPv4 and IPv6.

        ping -c 3 google.com
        ping6 -c 3 ipv6.google.com

