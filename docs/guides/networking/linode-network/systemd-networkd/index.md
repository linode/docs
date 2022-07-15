---
slug: systemd-networkd
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to configure networking using the systemd-networkd utility on Ubuntu, Arch, and other modern Linux distributions"
keywords: ["static", "ip address", "systemd-networkd"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-27
modified: 2022-06-17
modified_by:
  name: Linode
title: "Network Configuration Using systemd-networkd"
tags: ["networking","linode platform"]
---

The [systemd-networkd](https://wiki.archlinux.org/title/systemd-networkd) tool is a newer tool developed as part of systemd. Arch and modern versions of Ubuntu (17.10 and above) currently use systemd-networkd as their default network configuration software.

{{< note >}}
Ubuntu also has utility called Netplan that serves as a frontend for configuring either systemd-networkd or NetworkManager. By default, NetworkHelper manages networking in Ubuntu using systemd-networkd though you can decide which one works best for your needs.
{{</ note >}}

{{< note >}}
This guide serves as a supplement to the main [Manual Network Configuration on a Compute Instance](/docs/guides/manual-network-configuration/) guide. Please review that guide before making any configuration changes to your Compute Instance.
{{</ note >}}

## Configuration Files

Here are details regarding the network configuration files for systemd-networkd, including information on the default configuration file location.

- **File extension:** `.network`
- **File location:** `/etc/systemd/network/`
- **Naming convention:** `[priority]-[interface].network`, with *[priority]* being used to order the files (files are processed alpha-numerically\*) and *[interface]* providing a convenient way for a user to associate a file with a particular interface.
- **Default configuration file:** `/etc/systemd/network/05-eth0.network`.

\* *When systemd-networkd brings up the network interfaces, the configuration files are processed alpha-numerically. As such, you'll see that files are typically prepended with a 2-digit number to help order them. The default configuration file is prepended with `05`. If we wanted to create a configuration file for a different interface, we could prepend it with a number below `05` (to be processed before) or above (to be processed after).*

## Starter Configuration

Here is an example of a typical configuration file for systemd-networkd. It statically defines the IPv4 address and allows SLAAC to configure the IPv6 address.

{{< file "/etc/systemd/network/05-eth0.network" >}}
[Match]
Name=eth0

[Network]
DHCP=no
DNS=203.0.113.1 203.0.113.2 203.0.113.3
Domains=ip.linodeusercontent.com
IPv6PrivacyExtensions=false

Gateway=192.0.2.1
Address=192.0.2.123/24
{{</ file >}}

- [**Name**](https://www.freedesktop.org/software/systemd/man/systemd.network.html#Name=): `eth0`, the default interface configured for the public internet on most Compute Instances. When using a VLAN, the public internet interface may be configured differently.

- [**DHCP**](https://www.freedesktop.org/software/systemd/man/systemd.network.html#DHCP=): `no`, which disables DHCP and allows you to statically define the main IPv4 address in later fields.

- [**DNS**](https://www.freedesktop.org/software/systemd/man/systemd.network.html#DNS=): A list of IP addresses that map to Linode's DNS resolvers. The IP addresses provided in this example are placeholders and do not function.

- [**Domains**](https://www.freedesktop.org/software/systemd/man/systemd.network.html#Domains=): `ip.linodeusercontent.com`, which is defined as a "search domain". This is a quick way of converting single-label hostnames to FQDNs, but isn't often needed.

- [**IPv6PrivacyExtensions**](https://www.freedesktop.org/software/systemd/man/systemd.network.html#IPv6PrivacyExtensions=): `false`, which disables privacy extensions and helps to resolve any issues with automatically configuring your IPv6 SLAAC address.

- [**Gateway**](https://www.freedesktop.org/software/systemd/man/systemd.network.html#Gateway=): Statically configures the IPv4 gateway address.

- [**Address**](https://www.freedesktop.org/software/systemd/man/systemd.network.html#Gateway=): Statically configures the IPv4 address.

## Configuring IP Addresses Manually

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and review your Compute Instance's IP addresses. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/). Make a note of the following pieces of information or keep this page accessible so you can reference it later.

    - Public IPv4 address(es) and the associated IPv4 gateway
    - Private IPv4 address (if one has been added)
    - IPv6 SLAAC address and the associated IPv6 gateway
    - IPv6 /64 or /56 routed range (if one has been added)
    - DNS resolvers (if you want to use Linode's resolvers)

1. Disable Network Helper on the Compute Instance so that it doesn't overwrite any of your changes on the next system reboot. For instructions, see the [Network Helper](/docs/guides/network-helper/#single-per-linode) guide. This guide covers disabling Network Helper *globally* (for all Compute Instances on your account) or just for a single instance.

1. Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/). You may want to consider using Lish to avoid getting locked out in the case of a configuration error.

1. Perform any necessary configuration steps as outlined in the workflows below. You can edit your network configuration file using a text editor like [nano](/docs/guides/use-nano-to-edit-files-in-linux/) or [vim](/docs/guides/what-is-vi/).

        sudo nano /etc/systemd/network/05-eth0.network

1.  Once you've edited the configuration file to fit your needs, you need to apply the changes or reboot the Compute Instance. To apply your changes with systemd-networkd, restart the service:

        sudo systemctl restart systemd-networkd

## Changing the Primary IPv4 Address

To change the IPv4 address configured on the system, set the `Gateway` and `Address` parameters to match the new IP address and its corresponding gateway IP address.

{{< file "/etc/systemd/network/05-eth0.network" >}}
...
Gateway=192.0.2.1
Address=192.0.2.123/24
{{</ file >}}

## Configuring the Primary IPv4 Address through DHCP

DHCP can be used to automatically configure your primary IPv4 address. The primary IPv4 address is defined as the IPv4 address assigned to your system that is in the first position when sorted numerically. To enable DHCP, set the `DHCP` parameter to `yes` and remove (or comment out) the lines that define the `Gateway` and `Address` of the primary IPv4 address.

{{< file "/etc/systemd/network/05-eth0.network" >}}
...
[Network]
DHCP=yes
...
# Gateway=192.0.2.1
# Address=192.0.2.123/24
{{</ file >}}

{{< caution >}}
When using DHCP, the IPv4 address configured on your system may change if you add or remove IPv4 addresses on your Compute Instance. If this happens, any tool or system using the original IPv4 address will no longer be able to connect.
{{</ caution>}}

## Configuring the Primary IPv6 Address through SLAAC

SLAAC is used to automatically configure your primary IPv6 address. For this to work, your system must accept router advertisements. You also may need to disable IPv6 privacy extensions. Within systemd-networkd, this means setting `IPv6PrivacyExtensions` to `false` and `IPv6AcceptRA` to `true`.

{{< file "/etc/systemd/network/05-eth0.network" >}}
...
[Network]
...
IPv6PrivacyExtensions=false
IPv6AcceptRA=true
{{</ file >}}

{{< note >}}
The `IPv6AcceptRA` parameter isn't strictly required as long as running the `net.ipv6.conf.eth0.autoconf` kernel variable is set to `1` (not a `0`). You can determine the setting by running the following command.

    sysctl net.ipv6.conf.eth0.autoconf
{{</ note >}}

If you wish to disable IPv6 SLAAC addressing and instead statically configure your IPv6 address (not recommended), you can explicitly set the `IPv6AcceptRA` parameter to `false` and then add your primary IPv6 address (using the prefix of `/128`).

{{< file "/etc/systemd/network/05-eth0.network" >}}
...
IPv6AcceptRA=false
Address=[ip-address]/128
{{</ file >}}

## Configuring Additional IP Addresses

Additional IP addresses can be configured by adding another `Address` parameter within the `[Network]` section of the configuration file.

{{< file "/etc/systemd/network/05-eth0.network" >}}
...
Address=[ip-address]/[prefix]
{{</ file >}}

In the example above, make the following replacements:

- **[ip-address]**: The IP address that you wish to statically configure. If configuring an address from an IPv6 range, you can choose any address within that range. For example, within the range *2001:db8:e001:1b8c::/64*, the address `2001:db8:e001:1b8c::1` can be used.
- **[prefix]**: The prefix is based on the type of IP address you are adding:
    - Public IPv4 address: `/24`
    - Private IPv4 address: `/17`
    - IPv6 SLAAC address: `/128` (though it's recommended to configure this automatically through SLAAC)
    - IPv6 address from a range: `/64` or `/56` (depending on the size of the range)

## Changing the DNS Resolvers

DNS resolvers are the entities that resolve domain names to their corresponding IPv4 address. By default, the Compute Instance should be using the DNS resolvers for the data center in which it resides. You can change these by setting the `DNS` parameter to a space delimited list of the IP addresses for your preferred DNS resolvers.

{{< file "/etc/systemd/network/05-eth0.network" >}}
...
DNS=203.0.113.1 203.0.113.2 203.0.113.3
{{</ file >}}

In the above example, replace the IP addresses provided with the IP addresses of the DNS resolvers you wish to use. Both IPv4 and IPv6 addresses can be used together.