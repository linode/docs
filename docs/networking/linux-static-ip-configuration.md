---
author:
  name: Linode
  email: docs@linode.com
description: 'Computer networks frequently use DHCP to assign IP addresses, routing and DNS information to systems which join the network. Additional IPs can be assigned to virtual network interfaces for a fully static IP address configuration, including multiple static addresses.'
keywords: 'multiple ip addresses,linux static ip,DHCP,change ip address,network configuration'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/configuring-static-ip-interfaces/']
modified: Tuesday, December 8th, 2015
modified_by:
  name: Linode
published: 'Thursday, July 20th, 2014'
title: Linux Static IP Configuration
---

Computer networks frequently use [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) to provide IP addresses, routing and DNS information to systems which join the network. Linodes use this protocol as well, however, DHCP can only assign one IP address per DHCP lease request.

Additional IPs for your Linode can be assigned using either [Network Helper](/docs/platform/network-helper) to automatically create a static network, or manual configuration by following this guide. Be aware that errors in network configurations may disconnect SSH sessions, so it is advised that you use the [Linode Shell (LISH)](/docs/networking/using-the-linode-shell-lish) when making such changes.


## General Network Configuration

You'll first need some information from the [Linode Manager](https://manager.linode.com/). Log in and go to the **Remote Access** tab. There you'll find your Linode's **IPv4 and IPv6 addresses** (both public and private, if you assigned a private IP), **default gateways**, **netmasks** and **DNS resolvers**.

[![Linode Manager / Remote Access](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

Keep this information handy, because you'll need it as you configure your Linode's network settings. Bear in mind that each Linode has only one virtual ethernet interface, *eth0*. Most outbound connections will still originate from the IP assigned to *eth0*, but if you need server daemons to bind to a particular IP address, you'll need to specify the correct IP in their configuration files.


## Hostname and FQDN Settings

If you haven't already done so, set your system's hostname and [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) (FQDN) using our [Getting Started](https://linode.com/docs/getting-started#setting-the-hostname) guide.

## DNS Resolver Settings

If you've migrated your Linode to a new datacenter, you may need to edit your `resolv.conf` file so that your Linode can resolve DNS queries. Your DNS nameservers are listed under the **Remote Access** tab of the Linode Manager (see [the screenshot above](#general-network-configuration)).

{: .file-excerpt }
/etc/resolv.conf
: ~~~ conf
  domain members.linode.com
  nameserver 203.0.113.9
  nameserver 203.0.113.10
  options rotate
  ~~~

*   **domain**: Sets the system's short hostname. The *search* domain also defaults to this domain as well since one is not explicity specified in the file.
*   **nameserver**: The IPv4 or IPv6 address of a DNS resolver from the Linode Manager you wish your system to use. You can specify as many nameservers as you like and use resolvers other than Linode's if you choose.
*   **options rotate**: The *rotate* option spreads DNS queries among the listed nameservers instead of always using the first available. This is useful in case any one DNS resolver experiences an outage.

For more info on `resolv.conf`, see [its manual page](http://linux.die.net/man/5/resolv.conf).


## Static IP Configuration

**Addressing**

The different IP blocks available to your Linode are:

*   Public IPv4 - /24
*   Private IPv4 - /17
*   IPv6 - /64

{: .note}
>
>Some Linux distributions determine their [netmask](https://en.wikipedia.org/wiki/Subnetwork) based on the assigned IP address block.

**Gateways**

Although your Linode may have multiple IP addresses assigned using virtual interfaces, you should only specify a default gateway for *one* interface. The gateway should be on the same network as the desired IP address. For example, if you have the interface `eth0:3` assigned to the address `198.51.100.5`, you should use `198.51.100.1` as the gateway.

A default gateway should not be specified for private IP addresses. Additionally, the subnet mask for private IPs should be set to `255.255.128.0`, *not* `255.255.255.0`.

{: .caution}
>
>Using the examples below, be sure the IP addresses you enter reflect those shown under the **Remote Access** tab of the Linode Manager.

### Arch

There are multiple ways to configure static IP addresses in Arch. See the [Static IP Address](https://wiki.archlinux.org/index.php/Network_Configuration#Static_IP_address) section of Arch's Network Configuration Wiki page.

### CentOS 7 / Fedora 22+

Edit the interface's config file:

{: .file-excerpt }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~ conf
    . . .

    GATEWAY=198.51.100.1

    # Your primary public IP address.
    # The netmask is taken from the PREFIX (where 24 is Public IP, 17 is Private IP).
    IPADDR0=198.51.100.5
    PREFIX0="24"

    # To add a second public IP address:
    IPADDR=198.51.100.10
    PREFIX1="24"

    # To add a private IP address:
    IPADDR2=192.0.2.6
    PREFIX2="17"
    ~~~

### CentOS 6

CentOS 6 needs interface aliases specified in its config files. This means that additional IPs are assigned to an alias you create for *eth0* (for example, *eth0:1*, *etho0:2*, etc.). CentOS 6 keeps each interface configuration in a separate file at `/etc/sysconfig/network-scripts/ifcfg-<interface_alias_name>` so you'll need to create one for *eth0*, **and** one for each alias you would like.
 
{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~ conf
    # eth0
    DEVICE=eth0
    BOOTPROTO=none
    ONBOOT=yes
    
    # Your primary public IP address.
    IPADDR=198.51.100.5
    NETMASK=255.255.255.0
    GATEWAY=198.51.100.1
    ~~~

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0:1
:   ~~~ conf
    # eth0:1
    DEVICE=eth0
    BOOTPROTO=none
    ONBOOT=yes

    # To add a second public IP address:
    IPADDR=198.51.100.10
    NETMASK=255.255.255.0
    ~~~

### Debian / Ubuntu

Edit the interface's config file:

{: .file-excerpt }
/etc/network/interfaces
:   ~~~ conf
    . . .

    # Your primary public IP address.
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

### Gentoo

Networking in Gentoo utilizes the `netifrc` utility. Addresses are specified in the `config_eth0` line and separated by spaces.

{: .file-excerpt }
/etc/conf.d/net
:   ~~~ conf
    config_eth0="198.51.100.5/24 198.51.100.10/24 192.0.2.6/17"
    routes_eth0="default gw 198.51.100.1"
    . . .
    ~~~

### OpenSUSE

1.  Edit the interface's config file:

    {: .file-excerpt }
    /etc/sysconfig/network/ifcfg-eth0
    : ~~~ conf
      . . .

      # Your primary public IP address.
      IPADDR='198.51.100.5'
      NETMASK='255.255.255.0'
      GATEWAY="198.51.100.1"

      # Add a second public IP address:
      IPADDR1='198.51.100.10'
      NETMASK1='255.255.255.0'
      LABEL1='1'

      # Add a private IP address:
      IPADDR2='192.0.2.6'
      NETMASK2='255.255.128.0'
      LABEL2='2'
      ~~~

2.  You will also need to add your gateway to the network routes file:

    {: .file }
    /etc/sysconfig/network/routes
    : ~~~
      # Destination   Gateway                 Netmask                 Device
      default         198.51.100.1            255.255.255.0           eth0
      ~~~


## Disable Network Helper

When assigning static IP addresses, [Network Helper](/docs/platform/network-helper) (not to be confused with [NetworkManager](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/ch-NetworkManager.html)) should be disabled to avoid it overwriting your `interfaces` file in the future.

1.  From the Linode Manager's **Dashboard**, choose **Edit** for the desired configuration profile.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/linode-dashboard-hilighted_small.png)](/docs/assets/linode-dashboard-hilighted.png)

2.  Scroll to the **Filesystem/Boot Helpers** section at the bottom of the page. The radio button for **Auto-configure Networking** should be set to **Yes** to indicate Network Helper is enabled. To disable it, select **No** and click **Save Changes**.

    [![Linode Manager: Dashboard > Configuration Profile > Edit](/docs/assets/network-helper-hilighted_small.png)](/docs/assets/network-helper-hilighted.png)


## Reboot your Linode

It's best to **reboot your Linode from the Dashboard of the Linode Manager** rather than use `ifconfig` or an init system to restart the interfaces or distro's network services. This ensures that the new settings take effect without issues and that the networking services reliably start in full from the boot-up.


## Test Connectivity

1.  Log back into your Linode through SSH.

2.  Confirm that your `/etc/resolv.conf` exists and is correct.

3.  Ping each default gateway listed on the **Remote Access** tab of the Linode Manager:

        ping 198.51.100.1