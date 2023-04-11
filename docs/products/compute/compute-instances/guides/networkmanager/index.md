---
description: "Learn how to configure networking using the NetworkManager utility on CentOS, CentOS Stream, Fedora, and other modern Linux distributions"
keywords: ["static", "ip address","NetworkManager"]
published: 2022-05-27
modified_by:
  name: Linode
title: "Network Configuration Using NetworkManager"
tags: ["networking","linode platform"]
external_resources:
  - '[NetworkManager documentation](https://networkmanager.dev/docs/api/latest/NetworkManager.conf.html)'
aliases: ['/guides/networkmanager/']
authors: ["Linode"]
---

[NetworkManager](https://networkmanager.dev/) is a very popular network configuration utility and is used by default on Fedora, CentOS Stream, CentOS, AlmaLinux 8, and Rocky Linux 8. It can also be easily installed on Arch, Ubuntu, and other distributions.

{{< note >}}
This guide serves as a supplement to the main [Manual Network Configuration on a Compute Instance](/docs/products/compute/compute-instances/guides/manual-network-configuration/) guide. Please review that guide before making any configuration changes to your Compute Instance.
{{< /note >}}

## Configuration Files

Most distributions that use NetworkManager enable the ifcfg-rh plugin be default, which allows NetworkManager to use the older *ifcfg* configuration file format. NetworkManager also supports its own native *keyfile* format. By default, [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/) uses the *ifcfg* format, so that is what this guide covers.

- **File location:** `/etc/sysconfig/network-scripts/`
- **Naming convention:** `ifcfg-[interface]`, replacing *[interface]* with the name of the interface you wish to configure.
- **Default configuration file:** `/etc/sysconfig/network-scripts/ifcfg-eth0`

## Starter Configuration

Here is an example of a typical configuration file for NetworkManager. It statically defines the IPv4 address and allows SLAAC to configure the IPv6 address.

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
DEVICE="eth0"
NAME="eth0"
ONBOOT="yes"

BOOTPROTO="none"

IPV6INIT="yes"
IPV6_ADDR_GEN_MODE="eui64"
IPV6_PRIVACY="no"

PEERDNS="no"

DOMAIN=ip.linodeusercontent.com

DNS1=203.0.113.1
DNS2=203.0.113.2
DNS3=203.0.113.3

GATEWAY0=192.0.2.1
IPADDR0=192.0.2.123
PREFIX0=24
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
    sudo nano /etc/sysconfig/network-scripts/ifcfg-eth0
    ```

1. Once you've edited the configuration file to fit your needs, you need to apply the changes or reboot the Compute Instance. To apply your changes with NetworkManager, run the following commands:

    ```command
    sudo nmcli connection reload
    sudo nmcli connection down eth0
    sudo nmcli connection up eth0
    ```

## Changing the Primary IPv4 Address

To change the main IPv4 address configured on the system, set the `GATEWAY0`, `ADDRESS0`, and `PREFIX0` parameters to match the new IP address and its corresponding gateway IP address.

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
...
GATEWAY0=192.0.2.1
IPADDR0=192.0.2.123
PREFIX0=24
```

## Configuring the Primary IPv4 Address through DHCP

DHCP can be used to automatically configure your primary IPv4 address. The primary IPv4 address is defined as the IPv4 address assigned to your system that is in the first position when sorted numerically. To enable DHCP, set the `BOOTPROTO` parameter to `"dhcp"` and remove (or comment out) the lines that define the `GATEWAY0`, `ADDRESS0`, and `PREFIX0` parameters.

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
...
BOOTPROTO="dhcp"
...
# GATEWAY0=192.0.2.1
# IPADDR0=192.0.2.123
# PREFIX0=24
```

{{< note type="alert" >}}
When using DHCP, the IPv4 address configured on your system may change if you add or remove IPv4 addresses on your Compute Instance. If this happens, any tool or system using the original IPv4 address will no longer be able to connect.
{{< /note >}}

To disable DHCP, set the `BOOTPROTO` parameter back to `"none"`.

## Configuring Additional IPv4 Addresses

Additional IPv4 addresses can be configured by adding the `IPADDRn` and `PREFIXn` parameters, where *n* is an incrementing number based on how many other IPv4 address you have configured (starting at `0` for the primary address). For instance, to add a second IPv4 address, use the parameters `IPADDR1` and `PREFIX1`. For a third address, use `IPADDR2` and `PREFIX2`.

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
...
IPADDR1=[ip-address]
PREFIX1=[prefix]
```

In the example above, make the following replacements:

- **[ip-address]**: The IPv4 address that you wish to statically configure.
- **[prefix]**: The prefix is based on the type of IP address you are adding. It should be `24` for public IPv4 addresses and `17` for private IPv4 addresses.

## Configuring the Primary IPv6 Address through SLAAC

SLAAC is used to automatically configure your primary IPv6 address. For this to work, your system must accept router advertisements. You also may need to disable IPv6 privacy extensions. Within NetworkManager, you can set `IPV6INIT` to `yes`, `IPV6_ADDR_GEN_MODE` to `eui64`, and `IPV6_PRIVACY` to `no`.

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
...
IPV6INIT="yes"
IPV6_ADDR_GEN_MODE="eui64"
```

If you wish to disable IPv6 SLAAC addressing and instead statically configure your IPv6 address (not recommended), you can explicitly set the `net.ipv6.conf.eth0.autoconf` kernel variable to `0` in the `/etc/sysctl.conf` file and then reboot your Compute Instance

```file {title="/etc/sysctl.conf"}
...
net.ipv6.conf.all.autoconf=0
```

Then modify the network configuration file to disable auto-configuration and statically set your IPv6 address (using the prefix of `/128`).

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
...
IPV6INIT="yes"
IPV6_AUTOCONF="no"
# IPV6_ADDR_GEN_MODE="eui64"
# IPV6_PRIVACY="no"

IPV6ADDR=[ip-address]/128
IPV6_DEFAULTGW=fe80::1
```

## Configuring Additional IPv6 Addresses

If you have an IPv6 range assigned to your Compute Instance, addresses from this range can be configured through the `IPV6ADDR_SECONDARIES` parameter. This accepts a list of space delimited IPv6 addresses.

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
...
IPV6ADDR_SECONDARIES="[ip-address]/[prefix]"
```

In the example above, make the following replacements:

- **[ip-address]**: The IPv6 address that you wish to statically configure. You can choose any address within your available range. For example, within the range *2001:db8:e001:1b8c::/64*, the address `2001:db8:e001:1b8c::1` can be used.
- **[prefix]**: The prefix should either be `64` or `56` (depending on the size of your IPv6 range)

## Changing the DNS Resolvers

DNS resolvers are the entities that resolve domain names to their corresponding IPv4 address. By default, the Compute Instance should be using the DNS resolvers for the data center in which it resides. You can change these by setting the `DNS` parameter to a space delimited list of the IP addresses for your preferred DNS resolvers.

```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
...
DNS1=203.0.113.1
DNS2=203.0.113.2
DNS3=203.0.113.3
```

In the above example, replace the IP addresses provided with the IP addresses of the DNS resolvers you wish to use. Both IPv4 and IPv6 addresses can be used together.