---
description: "Learn how to configure networking using the ifupdown utility on Debian and older Ubuntu distributions"
keywords: ["static", "ip address","ifupdown", "ifup", "ifdown"]
published: 2022-05-25
modified_by:
  name: Linode
title: "Network Configuration Using ifupdown"
tags: ["networking","linode platform",]
external_resources:
  - '[ifupdown documentation](https://manpages.debian.org/bullseye/ifupdown/interfaces.5.en.html)'
aliases: ['/guides/ifupdown/']
authors: ["Linode"]
---

The [ifupdown](https://manpages.debian.org/bullseye/ifupdown/ifup.8.en.html) package is an older network configuration software that's still used by Debian and older Ubuntu distributions (such as 16.04 LTS and earlier).

{{< note >}}
Newer Ubuntu releases use Netplan in conjunction with systemd-networkd (or NetworkManager). Newer Debian releases also include systemd-networkd, though ifupdown is still the default.
{{< /note >}}

{{< note >}}
This guide serves as a supplement to the main [Manual Network Configuration on a Compute Instance](/docs/products/compute/compute-instances/guides/manual-network-configuration/) guide. Please review that guide before making any configuration changes to your Compute Instance.
{{< /note >}}

## Configuration Files

Network configuration settings for ifupdown are managed inside of an [interfaces](https://manpages.debian.org/bullseye/ifupdown/interfaces.5.en.html) file or series of files. The main configuration is typically stored in `/etc/network/interfaces` and additional files are typically added within `/etc/network/interfaces.d/*`

- **Default configuration file:** `/etc/network/interfaces`

## Starter Configuration

Here is an example of a typical configuration file for ifupdown. It statically defines the IPv4 address and allows SLAAC to configure the IPv6 address.

```file {title="/etc/network/interfaces"}
auto lo
iface lo inet loopback

source /etc/network/interfaces.d/*

auto eth0

allow-hotplug eth0

iface eth0 inet6 auto
iface eth0 inet static
    address 192.0.2.123/24
    gateway 192.0.2.1
```

## Configuring IP Addresses Manually

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and review your Compute Instance's IP addresses. See [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/). Make a note of the following pieces of information or keep this page accessible so you can reference it later.

    - Public IPv4 address(es) and the associated IPv4 gateway
    - Private IPv4 address (if one has been added)
    - IPv6 SLAAC address and the associated IPv6 gateway
    - IPv6 /64 or /56 routed range (if one has been added)
    - DNS resolvers (if you want to use Linode's resolvers)

1. Disable Network Helper on the Compute Instance so that it doesn't overwrite any of your changes on the next system reboot. For instructions, see the [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/#single-per-linode) guide. This guide covers disabling Network Helper *globally* (for all Compute Instances on your account) or just for a single instance.

1. Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). You may want to consider using Lish to avoid getting locked out in the case of a configuration error.

1. Perform any necessary configuration steps as outlined in the workflows below. You can edit your network configuration file using a text editor like [nano](/docs/guides/use-nano-to-edit-files-in-linux/) or [vim](/docs/guides/what-is-vi/).

    ```command
    sudo nano /etc/network/interfaces
    ```

1.  Once you've edited the configuration file to fit your needs, you need to apply the changes or reboot the Compute Instance. To apply your changes with ifupdown, run the following commands:

    ```command
    sudo ifdown eth0 && sudo ip addr flush eth0 && sudo ifup eth0
    ```

## Changing the Primary IPv4 Address

To change the main IPv4 address configured on the system, set the `address` and `gateway` parameters under `iface eth0 inet static` to match the new IP address and its corresponding gateway IP address.

```file {title="/etc/network/interfaces"}
...
iface eth0 inet static
    address 192.0.2.123/24
    gateway 192.0.2.1
```

## Configuring the Primary IPv4 Address through DHCP

DHCP can be used to automatically configure your primary IPv4 address. The primary IPv4 address is defined as the IPv4 address assigned to your system that is in the first position when sorted numerically. To enable DHCP, modify or add an `iface` for your interface using `dhcp` instead of `static`.

```file {title="/etc/network/interfaces"}
...
iface eth0 inet dhcp
# iface eth0 inet static
#    address 192.0.2.123/24
#    gateway 192.0.2.1
```

{{< note type="alert" >}}
When using DHCP, the IPv4 address configured on your system may change if you add or remove IPv4 addresses on your Compute Instance. If this happens, any tool or system using the original IPv4 address will no longer be able to connect.
{{< /note >}}

To disable DHCP, switch `dhcp` back to `static` and manually add the relevant `address` and `gateway` lines.

## Configuring Additional IPv4 Addresses

Additional IP addresses can be configured by adding or modifying the `iface` group for the desired interface. Multiple `address` lines can be provided to configure more than one IP address.

```file {title="/etc/network/interfaces"}
...
iface eth0 inet static
    address [ip-address]/[prefix]
```

In the example above, make the following replacements:

- **[ip-address]**: The IPv4 address that you wish to statically configure.
- **[prefix]**: The prefix is based on the type of IP address you are adding. It should be `24` for public IPv4 addresses and `17` for private IPv4 addresses.

## Configuring the Primary IPv6 Address through SLAAC

SLAAC is used to automatically configure your primary IPv6 address. Within ifupdown, you can configure an IPv6 SLAAC address by adding or modifying the `iface` for your interface and the `inet6` protocol, making sure to set it to `auto` instead of `static`.

```file {title="/etc/network/interfaces"}
...
iface eth0 inet6 auto
    accept_ra 2
```

If you wish to disable IPv6 SLAAC addressing and instead statically configure your primary IPv6 address (not recommended), you can modify the `iface eth0 inet6` group by setting it to `static` and adding your primary IPv6 address within the `address` parameter (using the prefix of `/128`).

```file {title="/etc/network/interfaces"}
...
iface eth0 inet6 static
    address [ip-address]/128
    # accept_ra 2
```

## Configuring Additional IPv6 Addresses

If you have an IPv6 range assigned to your Compute Instance, addresses from this range can be configured within the `iface eth0 inet6` group, making sure it's set to `static` instead of `auto`. Multiple `address` lines can be provided to configure more than one IP address.

```file {title="/etc/network/interfaces"}
...
iface eth0 inet6 static
    address [ip-address]/[prefix]
    autoconf 1
    accept_ra 2
```

In the example above, make the following replacements:

- **[ip-address]**: The IPv6 address that you wish to statically configure. You can choose any address within your available range. For example, within the range *2001:db8:e001:1b8c::/64*, the address `2001:db8:e001:1b8c::1` can be used.
- **[prefix]**: The prefix should either be `64` or `56` (depending on the size of your IPv6 range).

The `autoconf` parameter (when set to `1`), allows the primary IPv6 address to be automatically configured through SLAAC, which is the preferred behavior for most cases.

## Changing the DNS Resolvers

DNS resolvers are the entities that resolve domain names to their corresponding IPv4 address. By default, the Compute Instance should be using the DNS resolvers for the data center in which it resides. You can change these through the `/etc/resolv.conf` file, setting the `nameserver` parameters to your preferred DNS resolvers.

```file {title="/etc/resolv.conf"}
domain ip.linodeusercontent.com
search ip.linodeusercontent.com
nameserver 203.0.113.1
nameserver 203.0.113.2
nameserver 203.0.113.3
...
```

In the above example, replace the IP addresses provided with the IP addresses of the DNS resolvers you wish to use.