---
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up networking for multiple IP addresses.'
keywords: 'static ip,linux networking,ifconfig,configure network,linux network,multiple ip,static'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/configuring-static-ip-interfaces/']
modified: Saturday, December 27th, 2014
modified_by:
  name: Dave Russell
published: 'Thursday, July 20th, 2014'
title: Linux Static IP Configuration
---

By default, Linodes use DHCP to acquire their IP address, routing and DNS information. However, DHCP will only assign one IP to your Linode, so if you have multiple IPs, you'll need to use a static configuration. You can use [Network Helper](/docs/platform/network-helper) to to create static a networking configuration for you automatically, or follow the steps below.

{:.note}
> As errors in network configurations may cause SSH connections to be disconnected, it is advised that you use the Linode Shell (LISH) when making network configuration changes. See [Using the Linode Shell (LISH)](/docs/networking/using-the-linode-shell-lish) for more information. 


Some distributions will determine the netmask based on the block of the IP address. The blocks of each type of IP address are:

  - Public IPv4 - /24
  - Private IPv4 - /17
  - IPv6 - /64 (unless you have another pool assigned to you, you can see this from the "Remote Access" tab of the Linode Manager)


Obtain Network Configuration
----------------------------

Before you edit any files, you'll need to obtain some information. Log into the [Linode Manager](https://manager.linode.com/) and click the "Remote Access" tab. You'll find your IP addresses (both public and private, if you have a private IP assigned), gateways, netmasks and DNS resolvers.

Keep this information handy, because you'll need to refer to it as you configure your Linode's network settings. Since Linodes only have one virtual ethernet interface (**eth0**), you'll need to assign additional IPs to aliases on that interface. This means you'll append a colon and a number to the interface name. For these examples, the aliases are numbered in the order they were given, but most outbound connections will originate from the IP assigned to the **eth0** interface. If you need server daemons to bind to a particular IP address, you'll need to specify the correct IP in their configuration files.

Please note that although your VPS may have multiple IP addresses assigned to it, you should only specify a default gateway for one IP. This gateway should be the one that corresponds to the IP address you are setting it on. For example, if you are setting the default gateway for "198.51.100.5" you should use "198.51.100.1" for the gateway.

A default gateway should not be specified for private IP addresses. Additionally, the subnet mask for private IP addresses should be set to "255.255.128.0" (**not** "255.255.255.0").


Hostname and FQDN Settings
--------------------------

If you haven't already done so, set your system's hostname and FQDN (fully qualified domain name). Your hostname should be something unique; some people name their systems after planets, others after philosophers, etc. Please note that the system's hostname has no relationship to websites or email services hosted on it, aside from providing a name for the system itself. Thus, your hostname should not be "www" or anything else too generic.

### Debian and Ubuntu


Issue the following commands to set the hostname, replacing "hostname" with the hostname of your choice: 

    echo "hostname" > /etc/hostname
    hostname -F /etc/hostname

If it exists, edit the file /etc/default/dhcpd to comment out the "SET_HOSTNAME" directive:

{: .file-excerpt } 
/etc/default/dhcpcd
: ~~~
  #SET_HOSTNAME='yes'
  ~~~

Proceed to the section entitled "Update /etc/hosts" to continue.

### CentOS/Fedora

Issue the following commands to set the hostname, replacing "hostname" with the hostname of your choice:

    echo "HOSTNAME=hostname" >> /etc/sysconfig/network
    hostname "hostname"

Proceed to the section entitled "Update /etc/hosts" to continue.

### Slackware


Issue the following commands to set the hostname, replacing "hostname" with the hostname of your choice:

    echo "hostname" > /etc/HOSTNAME
    hostname -F /etc/HOSTNAME

Proceed to the section entitled "Update /etc/hosts" to continue.

### Gentoo


Issue the following commands to set the hostname, replacing "hostname" with the hostname of your choice:

    echo "HOSTNAME=\"hostname\"" > /etc/conf.d/hostname
    /etc/init.d/hostname restart


Proceed to the section entitled "Update /etc/hosts" to continue.

### Arch Linux


Issue the following commands to set the hostname, replacing "hostname" with the hostname of your choice:

    echo "hostname" > /etc/hostname
    hostname -F /etc/hostname

Proceed to the section entitled "Update /etc/hosts" to continue.

### Update /etc/hosts


Next, edit your `/etc/hosts` file to resemble the following example, replacing "hostname" with your chosen hostname, "example.com" with your system's domain name, and "198.51.100.5" with your system's IP address. As with the hostname, the domain name part of your FQDN does not necessarily need to have any relationship to websites or other services hosted on the server (although it may if you wish). As an example, you might host "www.something.com" on your server, but the system's FQDN might be "mars.something.com."

{: .file }
/etc/hosts
: ~~~
  127.0.0.1 localhost.localdomain localhost 
  198.51.100.5 hostname.example.com hostname
  ~~~

The value you assign as your system's FQDN should have an "A" record in DNS pointing to your Linode's IP address.
For more information on configuring DNS, please see our guide on [configuring DNS with the Linode Manager](/library/dns-guides/configuring-dns-with-the-linode-manager).

DNS Resolver Settings
---------------------

If you've migrated to a new location, you may need to edit your `/etc/resolv.conf` file so that your Linode can resolve DNS queries. Your nameservers are listed under the "Remote Access" tab. The `search` and `domain` lines are optional, but you should definitely include the `options rotate` line.

In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.

{: .file-excerpt }
/etc/resolv.conf
: ~~~
  domain members.linode.com
  search members.linode.com
  nameserver 203.0.113.9
  nameserver 203.0.113.10
  options rotate
  ~~~

Static IP Configuration
-----------------------

### Debian & Ubuntu

Since Ubuntu is based on Debian, their configuration is the same. The relevant file to edit is `/etc/network/interfaces` - the file syntax is fairly straightforward, but you can read the comments in the file for more details about what each line does.

In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.

{: .file }
/etc/network/interfaces
:   ~~~
    # The loopback interface
    auto lo
    iface lo inet loopback

    # Configuration for eth0
    # We no longer need to use aliases (eg. eth0:0 eth0:1 eth0:2)
    # This line ensures that the interface will be brought up during boot
    auto eth0
    allow-hotplug eth0

    # The address and gateway are necessary.
    # The netmask is taken automatically from the block.
    # Example: /24 is considered to be a public IP address: netmask 255.255.255.0
    iface eth0 inet static
        address 198.51.100.5/24
        gateway 198.51.100.1

    # This is a second public IP address
    iface eth0 inet static
        address 192.0.2.6/24

    # This is a private IP address. Private IPs do not have a gateway (they are not publicly routable).
    # All you need to specify is the address and the block. The netmask is taken from the block.
    # Example: /17 is considered to be a private IP address: netmask 255.255.128.0
    iface eth0 inet static
    address 192.168.133.234/17
    ~~~

Restart networking:

    ifdown -a && ifup -a

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 198.51.100.1
    ping 192.0.2.1

### CentOS 7 & Fedora 22


Note: CentOS 7/Fedora 22 no longer uses the `network` service. Instead, use the `nmcli` utility. The Network Manager in CentOS 7 also allows you to have each IP address defined in one interface file. 

In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.

You must create the `/etc/sysconfig/network-scripts/ifcfg-eth0` file.

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0
: ~~~
  # Configuration for eth0
  DEVICE=eth0
  BOOTPROTO=none
  ONBOOT=yes

  # Adding a public IP address.
  # The netmask is taken from the PREFIX (where 24 is Public IP, 17 is Private IP)
  IPADDR0=198.51.100.5
  PREFIX0=24

  # Specifying the gateway
  GATEWAY0=198.51.100.1

  # Adding a second public IP address.
  IPADDR1=192.0.2.6
  PREFIX1=24

  # Adding a private IP address.
  IPADDR2=192.168.133.234
  PREFIX2=17
  ~~~

Reload NetworkManager:

    nmcli con reload

Put the DHCP network configuration offline:

    nmcli con down "Wired connection 1"

Bring the static network configuration we just created online:

    nmcli con up "System eth0"

Any changes you make to the configuration will require you to reload and down/up the interface.

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 198.51.100.1
    ping 192.0.2.1

### CentOS 6.5

CentOS 6.5 keeps the information for each interface in a separate file named `/etc/sysconfig/network-scripts/ifcfg-<interface_alias_name>` so you'll need to create one for `eth0` and one for each alias.

In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.
 
{: .file } 
/etc/sysconfig/network-scripts/ifcfg-eth0
: ~~~
  # Configuration for eth0
  DEVICE=eth0
  BOOTPROTO=none

  # This line ensures that the interface will be brought up during boot.
  ONBOOT=yes
  # eth0 - This is the main IP address that will be used for most outbound connections.
  # The address, netmask, and gateway are all necessary.
  IPADDR=198.51.100.5
  NETMASK=255.255.255.0
  GATEWAY=198.51.100.1
  ~~~

{: .file } 
/etc/sysconfig/network-scripts/ifcfg-eth0:0
: ~~~
  # Configuration for eth0:0
  DEVICE=eth0:0
  BOOTPROTO=none

  # This line ensures that the interface will be brought up during boot.
  ONBOOT=yes

  # eth0:0
  IPADDR=192.0.2.6
  NETMASK=255.255.255.0
  ~~~

{: .file } 
/etc/sysconfig/network-scripts/ifcfg-eth0:1
: ~~~
  # Configuration for eth0:1
  DEVICE=eth0:1
  BOOTPROTO=none

  # This line ensures that the interface will be brought up during boot.
  ONBOOT=yes

  # eth0:1
  # This is a private IP address. Private IPs do not have a gateway (they are not publicly routable).
  # All you need to specify is the address and netmask
  IPADDR=192.168.133.234
  NETMASK=255.255.128.0
  ~~~

Restart networking:

    service network restart

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 198.51.100.1
    ping 192.0.2.1

### Gentoo


Networking in Gentoo utilizes the `netifrc` utility. 

You will need to edit the `/etc/conf.d/net` file so that it resembles the example below. However, you should change the IP addresses in the example to match the IP addresses from the "Remote Access" tab of the Linode Manager.

{: .file }
/etc/conf.d/net
: ~~~
  # Configuration for eth0 on multiple IP addresses
  # Each IP address is separated by a space
  config_eth0="198.51.100.5/24 192.0.2.6/24 192.168.133.234/17"
  routes_eth0="default gw 198.51.100.1"
  ~~~

Restart networking interface:

    /etc/init.d/net.eth0 restart

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 198.51.100.1
    ping 192.0.2.1

### Arch Linux & Fedora 21


Networking on Arch Linux and Fedora 21 is configured using the `systemd-networkd` service.

The configuration file for systemd-networkd should be created in `/etc/systemd/network`. 

**Note:** The systemd version may be outdated, and you may need to run `pacman -Syu` before continuing. You can check the version by running `systemctl --version`.

1. Prior to creating the configuration file, you will need to use [LISH](/docs/networking/using-the-linode-shell-lish) to disable the DHCP connection that we provide by default. To do so, on LISH, use the following command:

    ln -s /dev/null /etc/systemd/network/10-dhcp.network

2. Create the `/etc/systemd/network/50-static.network` file so that it resembles the example below. Be sure to change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.

    {: .file }
    /etc/systemd/network/50-static.network
    : ~~~
      [Match]
      Name=eth0

      [Network]
      Address=198.51.100.5/24
      Address=192.0.2.6/24
      Address=192.168.133.234/17
      Gateway=198.51.100.1
      ~~~

3. Restart `systemd-networkd`. To do so, run this command:

    systemctl restart systemd-networkd

Once you have made these changes, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 198.51.100.1
    ping 192.0.2.1


### OpenSUSE


In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.

{: .file }
/etc/sysconfig/network/ifcfg-eth0
: ~~~
  # Configuration for eth0
  BOOTPROTO='static'

  # This line ensures that the interface will be brought up during boot.
  STARTMODE='onboot'

  # eth0 - This is the main IP address that will be used for most outbound connections
  # The address, netmask and gateway are all necessary. The metric is not necessary, but
  # ensures you always talk to the same gateway if you have multiple public IPs from
  # different subnets.
  IPADDR='198.51.100.5'
  NETMASK='255.255.255.0'

  # eth0:0
  # This is a second public IP address.
  IPADDR1='192.0.2.6'
  NETMASK1='255.255.255.0'
  LABEL1='0'

  # eth0:1 - Private IP
  # Private IP addresses do not have a gateway.
  IPADDR2='192.168.133.234'
  NETMASK2='255.255.128.0'
  LABEL2='1'
  ~~~

Create the following file if necessary. You will need to change the gateway (198.51.100.1) to your gateway found in the "Remote Access" tab of the Linode Manager: 

{: .file } 
/etc/sysconfig/network/routes
: ~~~
  # Destination   Gateway                 Netmask                 Device
  default        198.51.100.1                 255.255.255.0           eth0
  ~~~

Double-check that your `/etc/resolv.conf` exists and is correct.

Restart networking:

    systemctl reload network

From the Linode, `ping` each of the default gateways listed in the "Remote Access" tab of the Linode Manager. ::

    ping 198.51.100.1
    ping 192.0.2.1
