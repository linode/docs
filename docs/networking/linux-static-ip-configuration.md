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

All Linodes are created with one IPv4 address and one for IPv6. An IPv4 address is assigned by our infrastructure from a pool of unused addresses when you create your Linode, and [Stateless Address Autoconfiguration](https://en.wikipedia.org/wiki/IPv6#Stateless_address_autoconfiguration_.28SLAAC.29) (SLAAC) is used for IPv6 assignment. Additional IPv4 or IPv6 addresses can be requested by opening a [support ticket](/content/platform/support) and detailing your requirements.

![Linux Static IP Configuration](/content/assets/linux-static-ip-configuration.png)

If you want to manually configure static addressing in your Linode's operating system, this guide shows you how to do that. You will want to make these changes using [Lish](/content/networking/using-the-linode-shell-lish), so if a configuration error disconnects your SSH session, you won't be locked out of a system that has no network access.

If Network Helper is *disabled* (or if your Linode was created before Network Helper became default), your Linode will be assigned its IPv4 network configuration by DHCP from the datacenter's networking hardware. One limitation of DHCP is that it can only assign one IP address per DHCP lease request. If you want additional IPs for your Linode, you must use static addressing.

Due to the limited availability of IPv4 addresses, additional public IPv4 addresses for your Linode must be requested by [contacting support](/docs/support) with a technical justification. Once approved, IPv4 addresses can be added through the Remote Access tab of the Linode Manager. [Additional IPv6 addresses](/docs/networking/how-to-enable-native-ipv6-on-linux/#additional-ipv6-addresses) are also available by submitting a support ticket.

Instead of using [Network Helper](/docs/platform/network-helper) for static addressing, you can manually configure it within your Linux distribution. This alternative method will be the focus of this guide. **Be aware that errors in network configurations can disconnect SSH sessions**, so we recommend you use the [Linode Shell (Lish)](/docs/networking/using-the-linode-shell-lish) when making the changes below.

## General Network Configuration

Log in to the [Linode Manager](https://manager.linode.com/) and go to the **Remote Access** tab. From there, you will see your Linode's:

*   IPv4 and IPv6 addresses (both private and public)
*   [Netmask](https://en.wikipedia.org/wiki/Subnetwork)
*   Default IPv4 gateway
*   DNS resolvers

Keep this information handy because you'll need it as you configure your Linode's network settings.

[![Linode Manager / Remote Access](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

{{< note >}}
Each Linode has only one virtual ethernet interface, *eth0*. Most outbound connections will still originate from the IP assigned to *eth0*, but if you need server daemons to bind to a particular IP address, you'll need to specify the correct IP in their configuration files.
{{< /note >}}

## Static Network Configuration

**Addressing**

The different IP blocks available to your Linode are:

*   Public IPv4 - /24
*   Private IPv4 - /17
*   IPv6 - /64

{{< note >}}
Some Linux distributions determine their [netmask](https://en.wikipedia.org/wiki/Subnetwork) based on the assigned IP address block.
{{< /note >}}

**Gateway**

Although your Linode may have multiple IP addresses assigned using virtual interfaces, you should only specify a default gateway for *one* interface. The gateway should be on the same network as the desired IP address. For example, if you have the interface `eth0:3` assigned to the address `198.51.100.5`, you should use `198.51.100.1` as the gateway.

A default gateway should not be specified for private IP addresses. Additionally, the subnet mask for private IPs should be set to `255.255.128.0`, *not* `255.255.255.0`.

**DNS Resolution**

Your DNS nameservers are listed under the **Remote Access** tab of the Linode Manager (see [the screenshot above](#general-network-configuration)). Unless you have a specific reason for doing so, you should not change your Linode's nameservers by editing `/etc/resolv.conf`. Depending on your distribution, `resolv.conf` may be overwritten by a networking tool like Network Manager or `dhclient`. Permanent DNS and resolver configuration options are usually set elsewhere.

For more info on `resolv.conf`, see [its manual page](http://linux.die.net/man/5/resolv.conf).

## Disable Network Helper

Our [Network Helper](/content/platform/network-helper) tool is enabled by default for new Linodes. It automatically configures static IPv4 addresses, routing, and DNS on each bootup of your Linode. When manually setting static addressing, Network Helper must be *disabled* so it doesn't overwrite your changes on the next reboot.

{{< file-excerpt "/etc/systemd/network/05-eth0.network" aconf >}}
[Match]
Name=eth0

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/content/assets/linode-dashboard-hilighted_small.png)](/content/assets/linode-dashboard-hilighted.png)

Gateway=198.51.100.1

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/content/assets/network-helper-hilighted_small.png)](/content/assets/network-helper-hilighted.png)

# To add a second public IP address:
Address=198.51.100.3/24

# To add a private IP address:
Address=192.168.133.234/17

{{< /file-excerpt >}}


[![Linode Manager / Remote Access](/content/assets/1711-remote_access_ips_small.png)](/content/assets/1710-remote_access_ips.png)

### CentOS 7 / Fedora

### Arch, CoreOS Container Linux, Ubuntu 17.10

# Edit from "yes" to "no":
PEERDNS=no

{{< file-excerpt "/etc/systemd/network/05-eth0.network" aconf >}}
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

To load your changes, restart the network service:

    sudo systemctl restart network

{{< file-excerpt "/etc/sysconfig/network-scripts/ifcfg-eth0" aconf >}}
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

{{< file "/etc/sysconfig/network-scripts/ifcfg-eth0:1" aconf >}}
# Add a second static public IP address.
DEVICE=eth0:1
IPADDR=198.51.100.10

{{< /file >}}

{{< file-excerpt "/etc/sysconfig/network-scripts/ifcfg-eth0" aconf >}}
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

{{< /file >}}


Though systemd-networkd and systemd-resolved are both present in Debian 8 and 9, they're not enabled. If you decide to enable these systemd services to manage networking, you can not set static addresses in the file `/etc/network/interfaces` as shown below. You'll need to use the section further above for [Arch, Container Linux and Ubuntu 17.10](/content/networking/linux-static-ip-configuration#arch--coreos-container-linux--ubuntu-1710_). For more information, see `man ifup`, `man ifdown`, `man interfaces 5`, `man systemd-networkd` and `man systemd-resolved`.

### Gentoo

    {{< file-excerpt "/etc/network/interfaces" aconf >}}
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

1.  Modify the interface's config file:

    {{< file "/etc/resolv.conf" aconf >}}
nameserver 203.0.113.1
nameserver 203.0.113.2
nameserver 203.0.113.3
domain members.linode.com
options rotate
{{< /file >}}

# Add a second public IP address:
IPADDR1=198.51.100.10/24
LABEL1=1

# Add a private IP address:
IPADDR2=192.0.2.6/17
LABEL2=2

    {{< file-excerpt "/etc/conf.d/net" aconf >}}
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


3.  Edit each line to add DNS and domain information for netconfig. Netconfig uses this info to modify `resolv.conf`:

    {{< file-excerpt "/etc/sysconfig/network/config" >}}
. . .
NETCONFIG_DNS_STATIC_SERVERS="203.0.113.1 203.0.113.2 203.0.113.3"
. . .
NETCONFIG_DNS_STATIC_SEARCHLIST="members.linode.com"
. . .
NETCONFIG_DNS_RESOLVER_OPTIONS="rotate"

    {{< file-excerpt "/etc/sysconfig/network/ifcfg-eth0" aconf >}}
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

# Your primary public IP address.
auto eth0
iface eth0 inet static
    address 198.51.100.5/24
    gateway 198.51.100.1
    dns-nameservers 203.0.113.1 203.0.113.2 203.0.113.3
    dns-search members.linode.com
    dns-options rotate

    {{< file "/etc/sysconfig/network/routes" >}}
# Destination   Gateway                 Netmask                 Device
default         198.51.100.1            -                       eth0

{{< /file >}}

3.  Last, set your DNS resolvers and options for netconfig, which then uses this info to modify `resolv.conf`:

    {{< file-excerpt "/etc/sysconfig/network/config" >}}
. . .
NETCONFIG_DNS_STATIC_SERVERS="203.0.113.1 2001:db8:0:123::2 203.0.113.3"
. . .
NETCONFIG_DNS_STATIC_SEARCHLIST="members.linode.com"
. . .
NETCONFIG_DNS_RESOLVER_OPTIONS="rotate"
{{< /file-excerpt >}}

Ubuntu includes [resolvconf](http://packages.ubuntu.com/xenial/resolvconf) in its base installation, a small application that manages the content of `/etc/resolv.conf`. Therefore, you should not edit `resolv.conf` directly. Instead, the DNS IP addresses and resolv.conf options need to be added to the interfaces file as shown above.

If you've previously used [Network Helper](/docs/platform/network-helper) to manage your static configuration, you will need to reactivate resolvconf's dynamic update feature to use the setup provided here. You can do so by running:

Like with Debian, systemd-networkd and systemd-resolved are both present but not enabled in Ubuntu 16.04. If you decide to enable these services to manage networking, you can not set static addresses in the file `/etc/network/interfaces` as shown below. You'll need to use the section further above for [Arch, Container Linux and Ubuntu 17.10](/content/networking/linux-static-ip-configuration#arch--coreos-container-linux--ubuntu-1710_). For more information, see `man ifup`, `man ifdown`, `man interfaces 5`, `man systemd-networkd` and `man systemd-resolved`.

    {{< file-excerpt "/etc/network/interfaces" aconf >}}
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

## Reboot Your Linode

It's best to reboot your Linode from the dashboard of the Linode Manager, rather than using `ifconfig` or an init system to restart the interfaces or a distro's network services. Rebooting ensures that the new settings take effect without issues and that the networking services reliably start in full on boot.

## Test Connectivity

1.  Log into your Linode via SSH.

2.  Confirm that your `/etc/resolv.conf` exists and its correct.

3.  Ping each default IPv4 gateway listed on the **Remote Access** tab of the Linode Manager and ping a domain to confirm that DNS resolution works:

        ping -c 3 198.51.100.1
        ping -c 3 google.com
        ping6 -c 3 ipv6.google.com
