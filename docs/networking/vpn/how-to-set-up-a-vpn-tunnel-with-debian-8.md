---
author:
  name: Linode
  email: docs@linode.com
description: 'Use OpenVPN to securely connect separate networks on an Ubuntu 12.04 (Precise) or Debian 7 Linux VPS.'
keywords: 'openvpn,vpn,debian 7,debian 8,debian jessie,debian wheezy'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Friday, September 11, 2015'
modified_by:
  name: Linode
published: 'Friday, September 11, 2015'
title: 'How to Tunnel Your Internet Trafic Through an OpenVPN Server on Debian 8'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
 - '[Tunnelblick OS X OpenVPN Client](http://code.google.com/p/tunnelblick/)'
 - '[OpenVPN GUI for Windows](https://tunnelblick.net/)'
 - '[Network Manager GNOME Configuration Management Tool](https://wiki.gnome.org/Projects/NetworkManager)'
---

This gude will show you how to configure an OpenVPN server to forward out to the interent all traffic it recieves from client devices, then route the responses back appropriately.

A common use case for a VPN tunnel is to access the internet from behind it to evade censorship or geolocation while masking your computer's public IP address to your ISP, and sites and services you connect to. Another common use is to access restricted areas of corporate networks which are not accessible outside of the company LAN. Businesses often make VPN access available to their employees for this reason.

## Before you Begin

This guide is the second of a three part series to configure a hardened OpenVPN server and client devices. Before moving further in this page, you *must* have completed part one of this series: [How to Set Up a VPN Tunnel with Debian 8](/docs/networking/vpn/***). If you found this page but are looking for part three for client device configuration, see ***

## OpenVPN Configuration

OpenVPN's server-side configuration file is `/etc/openvpn/server.conf` and it requires several edits.

1.  Tell OpenVPN that it should make all clients send internet traffic through it.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ ini
        # If enabled, this directive will configure
        # all clients to redirect their default
        # network gateway through the VPN, causing
        # all IP traffic such as web browsing and
        # and DNS lookups to go through the VPN
        # (The OpenVPN server machine may need to NAT
        # or bridge the TUN/TAP interface to the internet
        # in order for this to work properly).
        push "redirect-gateway def1 bypass-dhcp"
        ~~~

2.  Push DNS resolvers to client devices. [OpenDNS](https://www.opendns.com/) is used by default but any DNS service can be used.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ ini
        # Certain Windows-specific network settings
        # can be pushed to clients, such as DNS
        # or WINS server addresses.  CAVEAT:
        # http://openvpn.net/faq.html#dhcpcaveats
        # The addresses below refer to the public
        # DNS servers provided by opendns.com.
        push "dhcp-option DNS 208.67.222.222"
        push "dhcp-option DNS 208.67.220.220"
        ~~~

    {: .note }
    >
    >Specifying DNS resolver IP addresses in the client's operating system will override this setting.

## Append Networking Rules

In part one, we set iptables rules so the OpenVPN server can accept client connections, SSH and make system updates, but nothing more. Since now we want the server to forward traffic out to the internet from clients, accept the responses and forward them back to client machines, we must adjust the ruleset.

{: .caution }
>
>For purposes of this guide, it will be assumed you have *only* the iptables rules from the Setting Up Your Hardened OpenVPN Server guide. Because of the enormous variation in possible firewall rules, it's out of the scope of this guide to give further examples. By adding these rules, they will overwrite any custom entries you may have added yourself.

Run this command to see the current iptables rules.

    sudo iptables -L

According to the previous guide, you should see what's below:

    ***

### IPv4

***


Import the new rules:

    sudo iptables-restore < /tmp/myiptables


### IPv6

In [***](), the option was given to disable IPv6.


{:. caution }
>
>IPv6 can leak your public IP address. Many commercial VPN providers stop this by disabling IPv6 altogether.

IPv6 will also be enabled so traffic

    sudo iptables-restore < /tmp/myiptables


4.  Issue the following set of commands, one line at a time, to configure `iptables` to properly forward traffic through the VPN:

        iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
        iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
        iptables -A FORWARD -j REJECT
        iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
        iptables -A INPUT -i tun+ -j ACCEPT
        iptables -A FORWARD -i tun+ -j ACCEPT
        iptables -A INPUT -i tap+ -j ACCEPT
        iptables -A FORWARD -i tap+ -j ACCEPT


{: .note}
>
>Remember that we disable IPv6 and made no rules for the protocol.



### sysctl

The kernel must also be told it can forward incoming traffic.

    echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.d/99-sysctl.conf

Enable the change immediately.

    sudo sysctl -p

## Next Steps

At this point, you should have a operational*** OpenVPN server and a set of certificat/key pairs for your intended client devices. If you want your client devices to have internet access from behind the VPN, see part two of this series.

If you only intend to use your OpenVPN server as an extension of your local network, move on to part three to get the client credentials uploaded and software installed.