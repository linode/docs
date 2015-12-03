---
author:
  name: Linode
  email: docs@linode.com
description: 'Computer networks frequently use DHCP to assign IP addresses, routing and DNS information to systems which join the network. Additional IPs can be assigned to virtual network interfaces for a fully static IP address configuration, including multiple static addresses.'
keywords: 'static ip,linux networking,ifconfig,configure network,linux network,multiple ip,static'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/configuring-static-ip-interfaces/ networking/linux-static-ip-configuration']
modified: Thursday, December 3rd, 2015
modified_by:
  name: Linode
published: 'Thursday, December 3rd, 2015'
title: Linux Static IP Configuration
---

Computer networks frequently use [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) to provide IP addresses, routing and DNS information to systems which join the network. Linodes use this protocol as well, however, DHCP can only assign one IP address per DHCP lease request.

Additional IPs for your Linode can be assigned either by using [Network Helper](/docs/platform/network-helper) to automatically create a static networking configuration, or by configuring manually using the steps in this guide. Be aware that errors in network configurations may disconnect SSH sessions, so it is advised that you use the [Linode Shell (LISH)](/docs/networking/using-the-linode-shell-lish) when making such changes.


## General Network Configuration

You'll first need some information from the [Linode Manager](https://manager.linode.com/). Log in and click the **Remote Access** tab. There you'll find your Linode's **IPv4 and IPv6 addresses** (both public and private, if you assigned a private IP), **default gateways**, **netmasks** and **DNS resolvers**.

[![Linode Manager / Remote Access](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

Keep this information handy, because you'll need it as you configure your Linode's network settings. Since Linodes only have one virtual ethernet interface (**eth0**), you'll need to assign additional IPs to aliases on that interface (or example, **eth0:1**, **etho0:2**, etc.).

TMost outbound connections will still originate from the IP assigned to the **eth0** interface but if you need server daemons to bind to a particular IP address, you'll need to specify the correct IP in their configuration files.


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
*   **nameserver**: The IPv4 or IPv6 address of those DNS resolvers from the Linode Manager you wish your system to use. You can specify as many nameservers as you like and use resolvers other than Linode's if you choose.
*   **options rotate**: The *rotate* option spreads DNS queries among the listed nameservers instead of always using the first available.

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

### CentOS 7 / Fedora 22

Edit the interface's config file:

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~ conf
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

### CentOS 6.5

CentOS 6.5 keeps the information for each interface in a separate file named `/etc/sysconfig/network-scripts/ifcfg-<interface_alias_name>` so you'll need to create one for eth0, *and* one for each alias (eth0:0, eth0:1, etc.).
 
{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0
:   ~~~ conf
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
:   ~~~ conf
    # Configuration for eth0:0
    DEVICE=eth0:0
    BOOTPROTO=none

    # This line ensures that the interface will be brought up during boot.
    ONBOOT=yes

    # eth0:0
    IPADDR=192.0.2.6
    NETMASK=255.255.255.0
    ~~~

### Debian / Ubuntu

Edit the interface's config file:

{: .file }
/etc/network/interfaces
:   ~~~ conf
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

### Gentoo

Networking in Gentoo utilizes the `netifrc` utility.

{: .file }
/etc/conf.d/net
:   ~~~ conf
    # Configuration for eth0 on multiple IP addresses
    # Each IP address is separated by a space
    config_eth0="198.51.100.5/24 192.0.2.6/24 192.168.133.234/17"
    routes_eth0="default gw 198.51.100.1"
    ~~~

### OpenSUSE

1.  Edit the interface's config file:

    {: .file }
    /etc/sysconfig/network/ifcfg-eth0
    : ~~~ conf
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

It's best to **reboot your Linode from the Dashboard of the Linode Manager** rather than using `ifconfig` or an init system to restart the interfaces or distro's network services. This ensures that the new settings take effect without issues and that the networking services reliably start in full from the boot-up.


## Test Connectivity

1.  Log back into your Linode over SSH.

2.  Confirm that your `/etc/resolv.conf` exists and is correct.

3.  Ping each default gateway listed on the **Remote Access** tab of the Linode Manager:

        ping 198.51.100.1