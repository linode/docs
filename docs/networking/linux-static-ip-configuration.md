---
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up networking for multiple IP addresses.'
keywords: 'static ip,linux networking,ifconfig,configure network,linux network,multiple ip'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/configuring-static-ip-interfaces/']
modified: Thursday, February 27th, 2014
modified_by:
  name: Alex Fornuto
published: 'Thursday, July 16th, 2009'
title: Linux Static IP Configuration
---

By default, Linodes use DHCP to acquire their IP address, routing and DNS information. However, DHCP will only assign one IP to your Linode, so if you have multiple IPs, you'll need to use a static configuration. Even if you only have one IP, you can still do a static assignment, but it's not required in most cases.

Obtain Networking Info
----------------------

Before you edit any files, you'll need to obtain some information. Log into the [Linode Manager](https://manager.linode.com) and click the "Remote Access" tab. You'll find your IP addresses (both public and private, if you have a private IP assigned), gateways, netmasks and DNS resolvers.

Keep this information handy, because you'll need to refer to it as you configure your Linode's network settings. Since Linodes only have one virtual ethernet interface (`eth0`), you'll need to assign additional IPs to aliases on that interface. This means you'll append a colon and a number to the interface name. For these examples, the aliases are numbered in the order they were given, but most outbound connections will originate from the IP assigned to the `eth0` interface. If you need server daemons to bind to a particular IP address, you'll need to specify the correct IP in their configuration files.

Please note that although your VPS may have multiple IP addresses assigned to it, you should only specify a default gateway for one IP. This gateway should be the one that corresponds to the IP address you are setting it on. For example, if you are setting the default gateway for "12.34.56.78" you should use "12.34.56.1" for the gateway.

A default gateway should not be specified for private IP addresses. Additionally, the subnet mask for private IP addresses should be set to "255.255.128.0" (**not** "255.255.255.0").

Hostname and FQDN Settings
--------------------------

If you haven't already done so, set your system's hostname and FQDN (fully qualified domain name). Your hostname should be something unique; some people name their systems after planets, others after philosophers, etc. Please note that the system's hostname has no relationship to websites or email services hosted on it, aside from providing a name for the system itself. Thus, your hostname should *not* be "www" or anything else too generic.

### Debian and Ubuntu

Issue the following commands to set the hostname, replacing "plato" with the hostname of your choice:

    echo "plato" > /etc/hostname
    hostname -F /etc/hostname

If it exists, edit the file `/etc/default/dhcpcd` to comment out the "SET\_HOSTNAME" directive:

{: .file-excerpt }
/etc/default/dhcpcd
:   ~~~
    #SET_HOSTNAME='yes'
    ~~~

Proceed to the section entitled "Update /etc/hosts" to continue.

### CentOS/Fedora

Issue the following commands to set the hostname, replacing "plato" with the hostname of your choice:

    echo "HOSTNAME=plato" >> /etc/sysconfig/network
    hostname "plato"

Proceed to the section entitled "Update /etc/hosts" to continue.

### Slackware

Issue the following commands to set the hostname, replacing "plato" with the hostname of your choice:

    echo "plato" > /etc/HOSTNAME
    hostname -F /etc/HOSTNAME

Proceed to the section entitled "Update /etc/hosts" to continue.

### Gentoo

Issue the following commands to set the hostname, replacing "plato" with the hostname of your choice:

    echo "HOSTNAME=\"plato\"" > /etc/conf.d/hostname
    /etc/init.d/hostname restart

Proceed to the section entitled "Update /etc/hosts" to continue.

### Arch Linux

Issue the following commands to set the hostname, replacing "plato" with the hostname of your choice:

    echo "plato" > /etc/hostname
    hostname -F /etc/hostname

Proceed to the section entitled "Update /etc/hosts" to continue.

### Update /etc/hosts

Next, edit your `/etc/hosts` file to resemble the following example, replacing "plato" with your chosen hostname, "example.com" with your system's domain name, and "12.34.56.78" with your system's IP address. As with the hostname, the domain name part of your FQDN does not necesarily need to have any relationship to websites or other services hosted on the server (although it may if you wish). As an example, you might host "www.something.com" on your server, but the system's FQDN might be "mars.somethingelse.com."

{: .file }
/etc/hosts
:   ~~~
    127.0.0.1 localhost.localdomain localhost 12.34.56.78 plato.example.com plato
    ~~~

The value you assign as your system's FQDN should have an "A" record in DNS pointing to your Linode's IP address. For more information on configuring DNS, please see our guide on [configuring DNS with the Linode Manager](/docs/networking/dns/dns-manager).

DNS Resolver Settings
---------------------

If you've migrated to a new location, you may need to edit your `/etc/resolv.conf` file so that your Linode can resolve DNS queries. Your nameservers are listed under the "Remote Access" tab. The `search` and `domain` lines are optional, but you should definitely include the `options rotate` line.

In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.

{: .file }
/etc/resolv.conf
:   ~~~
    domain members.linode.com
    nameserver 203.0.113.1
    nameserver 203.0.113.2
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
    iface lo 
    inet loopback
    
    # Configuration for eth0 and aliases
    
    # This line ensures that the interface will be brought up during boot. 
    auto eth0 eth0:0 eth0:1
    
    # eth0 - This is the main IP address that will be used for most outbound connections. 
    # The address, netmask and gateway are all necessary. 
    iface eth0 inet static 
        address 12.34.56.78 
        netmask 255.255.255.0 
        gateway 12.34.56.1
    
    # eth0:0 
    # This is a second public IP address. 
    iface eth0:0 inet static 
        address 34.56.78.90 
        netmask 255.255.255.0
    
    # eth0:1 - Private IPs have no gateway (they are not publicly routable) so all you need to
    # specify is the address and netmask. 
    iface eth0:1 inet static 
        address 192.168.133.234 
        netmask 255.255.128.0
    ~~~

Restart networking:

    /etc/init.d/networking restart

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 12.34.56.1
    ping 98.76.54.1

Once you have confirmed that your networking settings have been correctly configured, issue the following command to uninstall the DHCP client, as it is no longer required.

    apt-get remove isc-dhcp-client dhcp3-client dhcpcd

### CentOS & Fedora

Note: CentOS & Fedora may include two services to configure networking, and having the wrong one enabled may cause networking to not come up after making these changes. You can check your configuration using [these instructions](http://www.linode.com/wiki/index.php/NetworkManagerService).

CentOS keeps the information for each interface in a separate file named `/etc/sysconfig/network-scripts/ifcfg-<interface_alias_name>` so you'll need to create one for `eth0` and one for each alias.

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
    # The address, netmask and gateway are all necessary. 
    IPADDR=12.34.56.78 
    NETMASK=255.255.255.0 
    GATEWAY=12.34.56.1
~~~

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0:0
:   ~~~
    # Configuration for eth0:0 
    DEVICE=eth0:0 
    BOOTPROTO=none
    
    # This line ensures that the interface will be brought up during boot. 
    ONBOOT=yes
    
    # eth0:0 
    IPADDR=34.56.78.90
    NETMASK=255.255.255.0
    ~~~

{: .file }
/etc/sysconfig/network-scripts/ifcfg-eth0:1
:   ~~~
    # Configuration for eth0:1 
    DEVICE=eth0:1 
    BOOTPROTO=none

    # This line ensures that the interface will be brought up during boot. 
    ONBOOT=yes

    # eth0:1 - Private IPs have no gateway (they are not publicly routable) so all you need to 
    # specify is the address and netmask. 
    IPADDR=192.168.133.234 
    NETMASK=255.255.128.0
    ~~~

Restart networking:

    service network restart

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 12.34.56.1
    ping 98.76.54.1

### Arch Linux

Networking on Arch Linux is configured using the `netctl` utility. Ensure that you have `netctl` and `iproute2` installed by issuing the following command:

    pacman -Sy netctl iproute2

The configuration file for netctl is stored in `/etc/netctl/`. You'll want to copy the example configuration from the `/etc/netctl/examples/` directory by issuing the following command:

    cp /etc/netctl/examples/ethernet-static /etc/netctl/static

You will now need to edit the `/etc/netctl/static` file so that it resembles the example below. Be sure to change the IP addresses and gateway to reflect the values shown under the "Remote Access" tab of the Linode Manager. You will also need to set the DNS resolvers in the `DNS=()` portion of the configuration.

{: .file-excerpt }
/etc/netctl/static
:   ~~~
    Description='A basic static ethernet connection' Interface=eth0 Connection=ethernet
    
    #
    # IPv4 Static Configuration 
    IP=static 
    Address=('12.34.56.75/24' '192.168.134.241/17') Gateway='12.34.56.1'
    
    #
    # For IPv6 autoconfiguration #IP6=stateless
    
    #
    # For IPv6 static address configuration IP6=static Address6=('1234:5678:9abc:def::1/64') Gateway6='fe80::1'
    
    #
    # DNS resolvers DNS=('14.25.36.9' '41.52.63.8' '47.58.60.7')

For more information on configuring netctl, please see `man netctl.profile`.

You will also need to modify the services that systemd starts when your system boots. You can run the following commands on your Linode to disable DHCP and enable the `netctl` service:

    systemctl disable dhcpcd@eth0
    netctl enable static

You can check which networking services you have enabled with the following command:

    systemctl list-unit-files --type=service | grep 'net\|dhcp'

The netctl service can be started with the following command:

    netctl start static

If issuing the above command results in a failure, then use `journalctl -xn` and `netctl status static` in order to obtain a more in depth explanation of the failure.

Once you have made these changes `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager.

    ping 12.34.56.1
    ping 98.76.54.1

If you need to add IP addresses later on, you will need to edit your netctl profile in `/etc/netctl/static` and then restart networking with this command.

    netctl restart static

### Gentoo

In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager. You'll be setting up a static public IP on `eth0` and a static private IP on `eth0:1`. We recommend logging into [Lish](/docs/troubleshooting/using-lish-the-linode-shell), since you'll be restarting the network.

First, open `/etc/conf.d/net` and comment out any existing `config_ethX` and `routes_ethX` lines:

    #config_eth0="12.34.56.XXX netmask 255.255.255.0"
    #routes_eth0="default gw 12.34.56.1"

Using the comments in `/usr/share/doc/openrc-*/net.example.bz2` as your guide, create a new `config_eth0` entry that contains both of your addresses in CIDR notation:

    config_eth0="12.34.56.XXX/24 192.168.133.XXX/17"

**Tip**: You can use the free [whatmask](http://grox.net/utils/whatmask/) online tool to get the correct [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) entry for your netmask.

Now add a new `routes_eth0` entry:

    routes_eth0="default via 12.34.56.1"

Full example of working */etc/conf.d/net*:

    config_eth0="12.34.56.XXX/24 192.168.133.XXX/17"

    routes_eth0="default via 12.34.56.1"

    # Below is optional, and will erase any existing configuration in /etc/resolv.conf
    dns_servers="34.56.78.90 34.56.78.91 34.56.78.92"
    dns_search="example.com members.linode.com"
    dns_domain="example.com"

Restart networking:

    /etc/init.d/net.eth0 restart

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 12.34.56.1
    ping 98.76.54.1

### OpenSuse

In the example below, change the IP addresses to reflect the values shown under the "Remote Access" tab of the Linode Manager.

{: .file }
/etc/sysconfig/network/ifcfg-eth0

> \# Configuration for eth0 BOOTPROTO='static'
>
> \# This line ensures that the interface will be brought up during boot. STARTMODE='onboot'
>
> \# eth0 - This is the main IP address that will be used for most outbound connections. \# The address, netmask and gateway are all necessary. The metric is not necessary but \# ensures you always talk to the same gateway if you have multiple public IPs from \# different subnets. IPADDR='12.34.56.78' NETMASK='255.255.255.0'
>
> \# eth0:0 \# This is a second public IP address. IPADDR1='34.56.78.90' NETMASK1='255.255.255.0' LABEL1='0'
>
> \# eth0:1 - Private IP \# Private IP addresses do not have a gateway. IPADDR2='192.168.133.234' NETMASK2='255.255.128.0' LABEL2='1'

Create the following file if necessary:

**File**: */etc/sysconfig/network/routes* :

    # Destination   Gateway                 Netmask                 Device
    66.246.75.0     0.0.0.0                 255.255.255.0           eth0
    0.0.0.0         12.34.56.1              0.0.0.0                 eth0

Double-check that your `/etc/resolv.conf` exists and is correct.

Restart networking:

    /etc/init.d/network restart

From the Linode, `ping` each of the default gateways listed on the "Remote Access" tab of the Linode Manager:

    ping 12.34.56.1
    ping 98.76.54.1



