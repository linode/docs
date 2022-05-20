---
slug: linux-static-ip-configuration
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to manually edit your distribution-specific network configuration files to set static IPs, routes and DNS."
keywords: ["static", "ip address", "addresses"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/networking/linux-static-ip-configuration/','/networking/configuring-static-ip-interfaces/','/networking/linode-network/linux-static-ip-configuration/']
modified: 2022-05-17
modified_by:
  name: Linode
published: 2014-07-20
title: "Manual Network Configuration on a Compute Instance"
h1_title: "Manually Configuring the Network on a Compute Instance"
enable_h1: true
tags: ["networking","linode platform"]
image: linux-static-ip-configuration.png
---

Every Compute Instance is assigned several IP addresses, including a pubic IPv4 address and a public IPv6 [SLAAC](https://en.wikipedia.org/wiki/IPv6#Stateless_address_autoconfiguration_.28SLAAC.29) address. By default, a utility called [Network Helper](/docs/guides/network-helper/) automatically configures these IP addresses within the network configuration files on the Compute Instance. While this is preferred in most cases, there are some situations which may require you to manually configure networking yourself. These situations include:

- Installing a custom distribution on a Compute Instance
- Configuring failover (see [Configuring Failover on a Compute Instance](/docs/guides/ip-failover/))
- Assigning addresses from an IPv6 routed range
- Using other DNS resolvers (not Linode’s)
- Other advanced use cases where custom network configuration is required

This guide walks you through how to manually configure your networking in most common Linux distributions. To learn more about the types of IP addresses available on a Compute Instance, review the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#types-of-ip-addresses) guide. Additional public IPv4 addresses, private IPv4 addresses, and IPv6 routed ranges (/64 or /56) can be added manually or by opening a [support ticket](/docs/guides/support/) and detailing your requirements.

## Static vs Dynamic Addressing

IP addresses can be statically configured or dynamically configured. Static configuration means explicitly defining the IP address within your system's network configuration. IPv4 addresses are configured this way through Network Helper and static configuration is typically recommended when manually configuring your networking as well. Dynamic configuration on the Linode platform is facilitated through DHCP (for public IPv4 addresses) and SLAAC (for IPv6 addresses).

- **DHCP** (Dynamic Host Configuration Protocol) can be used to automatically configure a single IPv4 address on a Compute Instance. If multiple IPv4 addresses are on the system, the first IP address (sorted alpha-numerically) is used. DHCP does not configure private IPv4 addresses or any IPv6 addresses. If you intend on adding or removing public IPv4 addresses after you initially configure networking, using DHCP is not recommended as it may configure a different public IPv4 address after you make those changes.

    {{< note >}}
If you do enable DHCP and are using a firewall (such as Cloud Firewalls), you must configure the firewall to allow communication with our DHCP servers. See the [DHCP IP Address Reference](/docs/guides/dhcp-ip-address-reference/) guide for a list of IP addresses to allow.
{{</ note >}}

- **SLAAC** (Stateless address autoconfiguration) can be used to automatically configure the main IPv6 address on a Compute Instance. It does not configure any IPv6 routed ranges (/64 or /56) that may also be assigned to that instance. For SLAAC to function, the Compute Instance needs to accept router advertisements. This is accomplished by enabling router advertisements and disabling IPv6 privacy extensions within your system's networking configuration files. These settings are properly configured by default in our supported distributions.

Static and dynamic addressing can be used together within a single configuration file. As an example, you can use DHCP to configure the public IPv4 address on your system, use SLAAC to configure your IPv6 address, and statically configure any remaining addresses (such as private IPv4 address or addresses from an IPv6 routed range).

## Network Configuration Software in Linux

All Linux distributions have pre-installed software whose purpose is to manage the internal networking on the system. In most cases, using this default software is preferred. That said, advanced users may wish to install their own preferred tool.

### Default Network Configuration Software by Distribution

The following table contains a list of each Linux distribution offered by Linode. Alongside each distribution is the default network software that it uses and a link to a guide for help with configuring that software.

| Distribution | Network Manager |
| -- | -- |
| AlmaLinux 8 | [NetworkManager](/docs/guides/networkmanager/) |
| Alpine | [ifupdown-ng](/docs/guides/ifupdown/) |
| Arch | [systemd-networkd](/docs/guides/systemd-networkd/) |
| CentOS 7 and 8 | [NetworkManager](/docs/guides/networkmanager/) |
| CentOS Stream 8 and 9 | [NetworkManager](/docs/guides/networkmanager/) |
| Debian 9-11 | [ifupdown](/docs/guides/ifupdown/) |
| Fedora 34-36 | [NetworkManager](/docs/guides/networkmanager/) |
| Gentoo | netifrc |
| Rocky Linux 8 | [NetworkManager](/docs/guides/networkmanager/) |
| Slackware | netconfig |
| OpenSUSE Leap | wicked |
| Ubuntu 16.04 | [ifupdown](/docs/guides/ifupdown/) |
| Ubuntu 18.04 - 22.04 | [systemd-networkd](/docs/guides/systemd-networkd/) and Netplan |


## Networking Components and Terminology

### Interfaces

Each Linode has only one virtual network interface, `eth0`, but depending on your distribution, additional IPs can be assigned to interface aliases (ex: `eth0:1`, `eth0:2`, etc.). Most outbound connections will originate from the IP assigned to `eth0`, but if you need server daemons to bind to a particular IP address or interface, you'll need to specify that in the appropriate configuration files.

### Addressing

The IP blocks available to your Linode are shown below. Additionally, the subnet mask for private IPs should be `255.255.128.0`, not `255.255.255.0`.

*   Public IPv4 - /24
*   Private IPv4 - /17
*   IPv6 - /64

### Gateway

Although your Linode may have multiple IP addresses assigned, and additionally may be using virtual interfaces and aliases, you should only specify a gateway for *one* interface. That gateway should be on the same network as the desired IP address.

For example, if the address `198.51.100.5` is assigned to the interface `eth0:3`, you should use `198.51.100.1` as the gateway. A gateway should not be specified for private IP addresses.

The gateway in this instance works similarly to a router, and provides access to the wider internet and other Linode services. This must always be configured on your Linode in order to have network access.

### DNS Resolution

Your DNS resolver addresses are listed under the [**Networking**](/docs/guides/managing-ip-addresses/) tab of the Linode detail page in the [Cloud Manager](https://cloud.linode.com/dashboard), though of course you are free to use any resolvers you choose.

However, unless you have a specific reason for doing so, you should *not* change your Linode's nameservers by editing `/etc/resolv.conf`. Depending on your distribution, `resolv.conf` may be overwritten by a networking service such as NetworkManager or systemd-resolved. Resolver options are usually set in the network interface's configuration file.

## Configuring IP Addresses Manually

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and review your Compute Instance's IP addresses. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/). Make a note of the following pieces of information or keep this page accessible so you can reference it later.

    - Public IPv4 address(es) and the associated IPv4 gateway
    - Private IPv4 address (if one has been added)
    - IPv6 SLAAC address and the associated IPv6 gateway
    - IPv6 /64 or /56 routed range (if one has been added)
    - DNS resolvers (if you want to use Linode's resolvers)

1. Disable Network Helper on the Compute Instance so that it doesn't overwrite any of your changes on the next system reboot. For instructions, see the [Network Helper](/docs/guides/network-helper/#single-per-linode) guide. This guide covers disabling Network Helper *globally* (for all Compute Instances on your account) or just for a single instance.

1. Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/). You may want to consider using Lish to avoid getting locked out in the case of a configuration error.

1. Perform any necessary configuration steps as outlined in the workflows below.

## Configuration Examples

Below are example configurations for the given Linux distribution. Edit the example files substituting the example IP addresses with those of your Linode, gateway and DNS nameservers. Depending on the amount of addresses you want to configure, not all lines will be necessary.

{{< note >}}
 All additional `/64` IPv6 ranges are routed through the original IPv6 SLAAC address for a Linode. When configuring both a SLAAC address and a routed range, additional configuration changes should be made.
{{< /note >}}

### Arch, CoreOS Container Linux

Networking in these distributions is managed entirely by *systemd*. See `man systemd-networkd` and `man systemd-resolved` for more information.

{{< file "/etc/systemd/network/05-eth0.network" >}}
[Match]
Name=eth0

[Network]
DHCP=no
Domains=203-0-113-0.ip.linodeusercontent.com
IPv6PrivacyExtensions=false

# DNS resolvers (safe to mix IPv4 and IPv6)
DNS=203.0.113.1 2001:db8:0:123::1 203.0.113.2

# IPv4 gateway and primary public IPv4 address.
Gateway=198.51.100.1
Address=198.51.100.2/24

# Add a second public IPv4 address.
Address=198.51.100.3/24

# Add a private address:
Address=192.168.133.234/17

# Add a second IPv6 address.
Address=2001:db8:2000:aff0::3/64
{{< /file >}}

{{< note >}}
On Container Linux, you need to rename or remove the original cloud config data so it doesn't take precedence on reboots over the eth0 configuration above. Do this with `sudo mv /var/lib/coreos-install/user_data /var/lib/coreos-install/user_data.bak`.
{{< /note >}}

### CentOS 7, Fedora

Networking in CentOS 7 and Fedora is managed by *systemd* and *NetworkManager*. See `man systemd-networkd` and `man networkmanager` for more information. Note that NetworkManger in CentOS 7 and Fedora includes the tools `nmtui` and `nmcli` to modify network configurations. Those are additional options to set static addressing if you would prefer to not directly edit the network interface's configuration file. See `man nmtui` and `man nmcli` for more info.

{{< file "/etc/sysconfig/network-scripts/ifcfg-eth0" >}}
# Edit this line from "dhcp" to "none":
BOOTPROTO=none

# If present, edit from "yes" to "no":
PEERDNS=no

# Edit from "yes" to "no".
...

# Add the following lines:
DOMAIN=203-0-113-0.ip.linodeusercontent.com

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

# Add a private IPv4 address.
IPADDR2=192.0.2.6
PREFIX2=17

# Additional IPv6 address. The SLAAC address is configured automatically.
IPV6ADDR=2001:db8:2000:aff0::2/128

# Add additional IPv6 addresses, separated by a space.
IPV6ADDR_SECONDARIES="2001:db8:2000:aff0::3/64 2001:db8:2000:aff0::4/64"
{{< /file >}}

### CentOS 6

Networking CentOS 6 is managed by *dhclient*. NetworkManager is not installed by default, however a static configuration for CentOS 6 differs only slightly from CentOS 7 and Fedora. See the [RHEL 6 Deployment Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/ch-Network_Interfaces.html) for more information.

{{< file "/etc/sysconfig/network-scripts/ifcfg-eth0" >}}
# Edit this line from "dhcp" to "none":
BOOTPROTO=none

# If present, edit from "yes" to "no":
PEERDNS=no

# If present, edit from "yes" to "no":
IPV6_AUTOCONF=no

...

# Add the following lines:
DOMAIN=203-0-113-0.ip.linodeusercontent.com

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

# Add a private IPv4 address.
IPADDR2=192.0.2.6
PREFIX2=17

# Your primary IPv6 SLAAC address (specifying gateway not necessary).
IPV6ADDR=2001:db8:2000:aff0::2/64

# Add additional IPv6 addresses, separated by a space.
IPV6ADDR_SECONDARIES="2001:db8:2000:aff0::3/64 2001:db8:2000:aff0::4/64"
{{< /file >}}


### Debian

Debian 7 and above all use *ifup* and *ifdown* to manage networking. In that configuration, Debian is one distribution where it's safe to directly edit `/etc/resolv.conf` because nothing will overwrite your changes if you reboot or restart networking services.

Though systemd-networkd and systemd-resolved are both present in Debian 8 and 9, they're not enabled. If you decide to enable these systemd services to manage networking, you can not set static addresses in the file `/etc/network/interfaces` as shown below. You'll need to use the section further above for [Arch and Container Linux](/docs/guides/linux-static-ip-configuration/#arch-coreos-container-linux). For more information, see `man ifup`, `man ifdown`, `man interfaces 5`, `man systemd-networkd` and `man systemd-resolved`.

1.  Edit your configuration file to add the appropriate information:

    {{< file "/etc/network/interfaces" >}}
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

# Additional IPv6 address and configuration options for additonal IP addresses when using SLAAC address
iface eth0 inet6 static
    address 2001:db8:2000:aff0::1/64
    address 2001:db8:2000:aff0::2/64
    address 2001:db8:2000:aff0::3/64
    autoconf 1
    acccept_ra 2
{{< /file >}}

1.  Populate `resolv.conf` with DNS resolver addresses and resolv.conf options ([see man 5 resolv.conf](https://linux.die.net/man/5/resolv.conf)). Be aware that resolv.conf can only use up to three `nameserver` entries. The *domain* and *options* lines aren't necessary, but useful to have.

    {{< file "/etc/resolv.conf" >}}
nameserver 203.0.113.1
nameserver 2001:db8:0:123::3
nameserver 203.0.113.3
domain 203-0-113-0.ip.linodeusercontent.com
options rotate
{{< /file >}}


### Gentoo

Networking in Gentoo is managed by *netifrc*. See the [Gentoo Wiki](https://wiki.gentoo.org/wiki/Netifrc) and [Gentoo handbook](https://wiki.gentoo.org/wiki/Handbook:X86/Full/Networking) for more information.

{{< file "/etc/conf.d/net" >}}
# IPv4 gateway. Not necessary to specify IPv6 gateway.
routes_eth0="default via 198.51.100.1"

# IPv4 addresses, private and public.
config_eth0="198.51.100.5/24
198.51.100.10/24
192.0.2.6/17"

# IPv6 Addresses
config_eth0="2001:db8:2000:aff0::1/64
2001:db8:2000:aff0::2/64
2001:db8:2000:aff0::3/64"

# DNS resolvers. Can mix IPv4 and IPv6.
dns_servers_eth0="203.0.113.1
2001:db8:0:123::2
203.0.113.3"
{{< /file >}}


### OpenSUSE

Networking in OpenSUSE is managed by *wicked* and *netconfig*. In addition to directly editing the network configuration files shown below, you can also use [YaST](https://en.opensuse.org/Portal:YaST). See OpenSUSE's [networking documentation](https://doc.opensuse.org/documentation/leap/reference/html/book.opensuse.reference/cha.network.html) for more information.

1.  Modify the interface's config file:

    {{< file "/etc/sysconfig/network/ifcfg-eth0" >}}
BOOTPROTO=dhcp
STARTMODE=auto

IPV6_AUTOCONF=yes

NAME=eth0

# Your primary public IP address and gateway.
IPADDR=198.51.100.5/24
GATEWAY=198.51.100.1

# Add a second IPv4 address:
IPADDR1=198.51.100.10/24

# Primary IPv6 SLAAC address and gateway.
IPV6ADDR=2001:db8:2000:aff0::2/128
IPV6_DEFAULTGW=fe80::1

# Add additional IPv6 addresses, separated by a space.
IPV6ADDR_SECONDARIES=2001:db8:2000:aff0::3/64 2001:db8:2000:aff0::4/64
{{< /file >}}

1.  Then add your IPv4 gateway to the network routes file:

    {{< file "/etc/sysconfig/network/routes" >}}
# Destination   Gateway                 Netmask                 Device
default         198.51.100.1            -                       eth0
{{< /file >}}

1.  Last, set your DNS resolvers and options for netconfig, which then uses this info to modify `resolv.conf`:

    {{< file "/etc/sysconfig/network/config" >}}
. . .
NETCONFIG_DNS_STATIC_SERVERS="203.0.113.1 2001:db8:0:123::2 203.0.113.3"
. . .
NETCONFIG_DNS_STATIC_SEARCHLIST="203-0-113-0.ip.linodeusercontent.com"
. . .
NETCONFIG_DNS_RESOLVER_OPTIONS="rotate"
{{< /file >}}

### Ubuntu 18.04 and 20.04

[Netplan](https://netplan.io/) is used to configure networking in Ubuntu 18.04 and later. Ubuntu Server is packaged with `systemd-networkd` as the [backend](https://netplan.io/design#design-overview) for Netplan, while NetworkManager is used as the Netplan backend in Ubuntu Desktop. The `ifupdown` package has been deprecated, and `/etc/network/interfaces` is no longer used, but it's still possible to configure static networking with `/etc/systemd/network/*.network` files.

{{< note >}}
If you have upgraded to Ubuntu 18.04 or later from an earlier version, you may need to enable `systemd-networkd`:

    systemctl enable systemd-networkd
{{< /note >}}

1.  Remove default configuration files that may interfere with static addressing:

        sudo rm /etc/systemd/network/05-eth0.network
        sudo rm /etc/netplan/01-netcfg.yaml

1.  Create the configuration file for Netplan:

    {{< file "/etc/netplan/01-eth0.yaml" >}}
# This file describes the network interfaces available on your system
# For more information, see netplan(5).
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      dhcp6: no
      addresses:
        - 198.51.100.5/24                         # Your Linode's public IPv4 address.
        - 192.168.1.2/17                          # Private IPv4 address.
        - "2001:db8:2000:aff0::2/64"              # Primary IPv6 SLAAC address.
      gateway4: 198.51.100.1                      # Primary IPv4 gateway.
      gateway6: "fe80::1"                         # Primary IPv6 gateway.
      nameservers:
        search: [203-0-113-0.ip.linodeusercontent.com]              # Search domain.
        addresses: [203.0.113.20,203.0.113.21]    # DNS Server IP addresses.
{{< /file >}}

1.  Apply the changes and reboot:

        sudo netplan apply

### Ubuntu 14.04 and 16.04

Ubuntu 14.04 and 16.04 include [resolvconf](http://packages.ubuntu.com/xenial/resolvconf) in their base installation. This is an application which manages the contents of `/etc/resolv.conf`, so do not edit `resolv.conf` directly. Instead, add DNS resolver addresses and options to the network interface file as shown.

Like with Debian, systemd-networkd and systemd-resolved are both present but not enabled in Ubuntu 16.04. If you decide to enable these services to manage networking, you can not set static addresses in the file `/etc/network/interfaces` as shown below. You'll need to use the section further above for [Arch and Container Linux](/docs/guides/linux-static-ip-configuration/#arch-coreos-container-linux). For more information, see `man ifup`, `man ifdown`, `man interfaces 5`, `man systemd-networkd` and `man systemd-resolved`.

{{< file "/etc/network/interfaces" >}}
. . .

# IPv4 gateway and primary address. The netmask
# is taken from the PREFIX (where 24 is a
# public IP, 17 is a private IP)
iface eth0 inet static
  address 198.51.100.5/24
  gateway 198.51.100.1

# Add DNS resolvers for resolvconf. Can mix IPv4 and IPv6.
  dns-nameservers 203.0.113.1 2001:db8:0:123::2 203.0.113.3
  dns-search 203-0-113-0.ip.linodeusercontent.com
  dns-options rotate

# Add a second public IPv4 address.
iface eth0 inet static
  address 198.51.100.10/24

# IPv6 gateway and primary IPv6 SLAAC address.
iface eth0 inet6 static
  address 2001:db8:2000:aff0::1/64
  gateway fe80::1

# Add a second IPv6 address.
iface eth0 inet6 static
  address 2001:db8:2000:aff0::2/64
{{< /file >}}

## Apply Your Changes

To apply your changes, reboot from the Linode Manager's dashboard. Rebooting ensures that the new settings take effect without issues and that the all networking services reliably start again.

If for whatever reason you prefer not to reboot, you should be able to bring your networking online using the following series of commands with most major Distributions:

    sudo ip addr flush dev eth0
    ip link set eth0 up
    ip addr add 198.51.100.5/24 broadcast 198.51.100.255 dev eth0
    ip route add default via 198.51.100.1

## Test Connectivity

1.  Log into your Linode via SSH.

1.  Use the `ip` tool to be sure the addresses you set above were applied:

        root@localhost:~# ip addr | grep inet
        inet 127.0.0.1/8 scope host lo
        inet6 ::1/128 scope host
        inet 198.51.100.5/24 brd 198.51.100.255 scope global eth0
        inet6 2600:3c02::f03c:91ff:fe24:3a2f/64 scope global
        inet6 fe80::f03c:91ff:fe24:3a2f/64 scope link

1.  Confirm that your `/etc/resolv.conf` exists and is correct. Its contents will differ according to the Linux distribution.

        root@localhost:~# cat /etc/resolv.conf
        nameserver 8.8.8.8
        nameserver 2001:4860:4860::8888
        domain 203-0-113-0.ip.linodeusercontent.com
        options rotate

1.  Try pinging something to confirm you have full connectivity, both over IPv4 and IPv6.

        ping -c 3 google.com
        ping6 -c 3 ipv6.google.com
