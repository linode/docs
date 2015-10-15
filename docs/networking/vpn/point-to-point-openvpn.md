---
author:
    name: Linode Community
    email: docs@linode.com
description: Configuring OpenVPN in point-to-point mode
keywords: 'openvpn,vpn,point-to-point'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Friday, October 17th, 2015'
modified: 'Friday, October 17th, 2015'
modified_by:
    name: Michał Zieliński
title: 'Point-to-Point OpenVPN on Ubuntu 14.04 and Debian 8'
contributor:
    name: Michał Zieliński
    link: https://zielmicha.com
---

# Point-to-Point OpenVPN on Ubuntu 14.04 and Debian 8

## Introduction

Ever wanted to set up a persistent encrypted connection between two hosts? Standard OpenVPN configuration requires you to create certificate authority and sign certificates, which (even when scripted) can be quite complex. Fortunately OpenVPN includes simple **point-to-point mode**. In this mode connection is encrypted using single static shared key.

Point-to-point mode can be used to securely connect two servers or your laptop to a server.
If you want to connect multiple computers to a single Linode, you may either setup several Point-to-Point VPNs or follow [the guide on setting up OpenVPN with Certificate Authority](https://www.linode.com/docs/networking/vpn/secure-communications-with-openvpn-on-ubuntu-12-04-precise-and-debian-7).
If you just want to create simple tunnel for secure browsing, you may follow [the guide on setting up SSH tunnel](https://www.linode.com/docs/networking/ssh/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing).


## Prerequisites

* a Ubuntu 14.04 or Debian 8 Linode
* other computer with OpenVPN -- this computer can also be a Linode

Let's call the first Linode "server" and the other computer "client".

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install OpenVPN on server


1. Update your package repositories:

        apt-get update

2. Install the OpenVPN:

        apt-get install openvpn

## Configure OpenVPN on the server

{: .note}
>
>In this guide `tutorial` will be used as a configuration file name. Substitute your own name.

We'll store the configuration in the standard `/etc/openvpn` directory. First, we need to generate key which will be used to secure communication.
Run this command on server Linode as root:

    openvpn --genkey --secret /etc/openvpn/tutorial.key

The generated key will look like this:

{: .file-excerpt}
/etc/openvpn/tutorial.key
:   ~~~
    #
    # 2048 bit OpenVPN static key
    #
    -----BEGIN OpenVPN Static key V1-----
    9ad432734c5272e7587c685df7074dd8
    .... snip ....
    57d6c506c33893a5afcfd90187297485
    -----END OpenVPN Static key V1-----

Now we need to create configuration file for server's OpenVPN. Open the configuration file (as root):

    nano /etc/openvpn/tutorial.conf

Paste this example config into the editor. If you want, you can edit the options as described in comments.

{: .file}
/etc/openvpn/tutorial.conf
:   ~~~ conf
    # The server will listen on this port - you can use any port number, provided that it will be
    # the same as client uses (we'll configure client later).
    port 7501
    # Protocol used by the OpenVPN. You can also specify 'tcp-server', but it will be less efficient.
    proto udp
    # OpenVPN will generate virtual network device with this name.
    dev tuntutorial
    # We use OpenVPN in routed (TUN) mode.
    dev-type tun

    # IP addresses used by the OpenVPN. The first one is used by the server, the second by the client.
    # You can use any addresses here, as far as it comes from private range (10.x.x.x or 192.168.x.x).
    ifconfig 10.1.50.1 10.1.50.2

    # Path to the secret key.
    secret tutorial.key
    ~~~

OpenVPN will load all configuraion files in `/etc/openvpn`, so we just need to restart it:

    service openvpn restart

## Configure the client

OpenVPN configuration is different on different systems. Follow the correct section depending on the system on your client.

### Windows OpenVPN installation

Download and install OpenVPN from [openvpn.net download site](https://openvpn.net/index.php/open-source/downloads.html).
Save the configuration file (see the "Configuration file" section) and the secret key to the configuration folder (by default `c:\Program Files\OpenVPN\config`) with `.ovpn` extension. Start OpenVPN-GUI as administrator using shortcut created on your desktop. Double click on the OpenVPN-GUI icon in tray to start the client.

### Ubuntu/Debian OpenVPN installation

Save the configuration file (see the "Configuration file" section) and the secret key to `/etc/openvpn` and restart the OpenVPN daemon:

```
service openvpn restart
```

### Configuration file

OpenVPN on all operating systems requires a configuration file. If you made changes to the server settings, you should also make them here.

{: .file}
tutorial.conf
:   ~~~ conf

    # Replace 1.2.3.4 with the IP address of the server. 7501 is a port number - it should match the
    # port number in the server config file.
    remote 1.2.3.4 7501
    # Protocol used by the OpenVPN. It should match the protocol used by server (`udp` or `tcp-client`).
    proto udp
    # OpenVPN will generate virtual network device with this name.
    dev tuntutorial
    # We use OpenVPN in routed (TUN) mode.
    dev-type tun

    # IP addresses used by the OpenVPN. Here the second one is used by the server, the first by the client.
    # Use the same addresses as in the server config, but swapped.
    ifconfig 10.1.50.2 10.1.50.1

    # Path to the secret key (the same key as on the server).
    secret tutorial.key
    ~~~

## Test the connection

Now you should be able to access the other machine using IP assigned by you. You can test the connection by pinging the other one:

    ping 10.1.50.1 # from the client
    ping 10.1.50.2 # from the server

## Add routes

So far we have only configurated the link between two machines. While this is useful, one common use of VPN is routing all or parts of client traffic via a VPN server.

### Enable forwading on the server

First you should enable packet forwarding on the server Linode - uncomment corresponding line in the `sysctl.conf` config file:

{: .file-excerpt}
/etc/sysctl.conf
:   ~~~
    # Uncomment the next line to enable packet forwarding for IPv4
    net.ipv4.ip_forward=1
    ~~~

and reload the configuration:

    sysctl -p

You also need to configure your firewall (`iptables`) to rewrite packets source address (_NAT_): 

    apt-get install iptables-persistent
    iptables -t nat -A POSTROUTING -s 10.1.50.2/32 -o eth0 -j MASQUERADE
    service netfilter-persistent save 

### Modify the configuration file

Append this to your client configuration file to route all traffic via the server Linode:

{: .file-excerpt}
tutorial.conf
:   ~~~ conf
    # route all your traffic via the server Linode (except for the OpenVPN connection itself)
    redirect-gateway local
    # use the Google DNS
    dhcp-option DNS 8.8.8.8
    ~~~

Or append this to your client configuration to only route a specific subnet:

{: .file-excerpt}
tutorial.conf
:   ~~~ conf
    # route traffic to 10.5.x.x via the server Linode
    route 10.5.0.0 255.255.0.0
    ~~~
