---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'A common use case for a VPN tunnel is to access the internet from behind it to evade censorship or geolocation and protect your connection from untrusted internet service providers, WiFi hotspots, and sites and services you connect to.'
keywords: 'openvpn,vpn,vpn tunnel,openssl'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Monday, January 26th, 2016'
modified_by:
  name: Linode
published: 'Wednesday, December 9th, 2015'
title: 'Tunnel Your Internet Traffic Through an OpenVPN Server'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
---

This guide will show you how to configure an OpenVPN server to forward all traffic it receives out to the Internet, then route the responses back appropriately to client devices.

![Tunnel Your Internet Traffic Through an OpenVPN Server](/docs/assets/tunnel-traffic-through-openvpn.png "Tunnel Your Internet Traffic Through an OpenVPN Server")

A common use case for a VPN tunnel is to access the internet from behind it to evade censorship or geolocation, while shielding your computer's web traffic to internet service providers and untrusted WiFi or cellular hotspots.

## Before You Begin

This guide is the second of a three-part series to set up a hardened OpenVPN environment. It assumes that you already have a limited user account with `sudo` privileges, and the OpenVPN server running.

Before moving further in this page, complete Part One of the series: [Set Up a Hardened OpenVPN Server with Debian 8](/docs/networking/vpn/set-up-a-hardened-openvpn-server). If you found this page but are looking for information about VPN client device configuration, see Part Three: [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices).

## OpenVPN Configuration

OpenVPN's server-side configuration file is `/etc/openvpn/server.conf`, and it requires several edits.

1.  Set OpenVPN to push a gateway configuration so all clients send internet traffic through it.

    {: .file-excerpt}
    /etc/openvpn/server.conf
    :   ~~~ conf
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

2.  Push DNS resolvers to client devices.

    Client-side DNS settings are ideal for preventing DNS leaks and will override those pushed by the OpenVPN server in this step. Google DNS is provided by the OpenVPN client software for Android, iOS, OS X and Windows, and while this can be disabled, Desktop Linux and Windows are the only platforms which allow you to change this if you prefer a different resolver. 

    If using the options below to push DNS resolvers to VPN clients, you can disable the Google DNS fallback on your clients (or leave it enabled as the fallback it was intended to be). [OpenDNS](https://www.opendns.com/) is provided by default but you can change this to your preference.

    {: .file-excerpt}
    /etc/openvpn/server.conf
    :   ~~~ conf
        # Certain Windows-specific network settings
        # can be pushed to clients, such as DNS
        # or WINS server addresses.  CAVEAT:
        # http://openvpn.net/faq.html#dhcpcaveats
        # The addresses below refer to the public
        # DNS servers provided by opendns.com.
        push "dhcp-option DNS 208.67.222.222"
        push "dhcp-option DNS 208.67.220.220"
        ~~~

3.  Restart OpenVPN

        sudo systemctl restart openvpn.service

## Append Networking Rules

In [Part One](/docs/networking/vpn/set-up-a-hardened-openvpn-server) of this series, we set iptables rules so the OpenVPN server can only accept client connections, SSH and make system updates--all over IPv4, and [IPv6 was disabled](/docs/networking/vpn/set-up-a-hardened-openvpn-server#disable-ipv6) since OpenVPN does not support using both transport layers simultaneously. Leaving IPv6 disabled here prevents leaking v6 traffic which would otherwise be sent separately from your VPN's v4 tunnel.

Since now the server should forward traffic out to the internet from clients, accept the responses and route them back to client machines, the firewall rules must be adjusted.

{: .caution }
>
>The steps below will overwrite any custom IPv4 firewall rules you may have.

1.  Remove the v4 ruleset that you created in Part One of this series.

        sudo rm /etc/iptables/rules.v4

2.  Create a new IPv4 rule file using the ruleset below. The path `/etc/iptables/rules.v4` assumes Debian or Ubuntu with `iptables-persistent` installed.

    {: .file}
    /etc/iptables/rules.v4
    :   ~~~ conf
        *filter

        # Allow all loopback (lo) traffic and reject traffic
        # to localhost that does not originate from lo.
        -A INPUT -i lo -j ACCEPT
        -A INPUT ! -i lo -s 127.0.0.0/8 -j REJECT
        -A OUTPUT -o lo -j ACCEPT

        # Allow ping and ICMP error returns.
        -A INPUT -p icmp -m state --state NEW --icmp-type 8 -j ACCEPT
        -A INPUT -p icmp -m state --state ESTABLISHED,RELATED -j ACCEPT
        -A OUTPUT -p icmp -j ACCEPT

        # Allow SSH.
        -A INPUT -i eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 22 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state ESTABLISHED --sport 22 -j ACCEPT

        # Allow UDP traffic on port 1194.
        -A INPUT -i eth0 -p udp -m state --state NEW,ESTABLISHED --dport 1194 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state ESTABLISHED --sport 1194 -j ACCEPT

        # Allow DNS resolution and limited HTTP/S on eth0.
        # Necessary for updating the server and keeping time.
        -A INPUT -i eth0 -p udp -m state --state ESTABLISHED --sport 53 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state NEW,ESTABLISHED --dport 53 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 53 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 53 -j ACCEPT

        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 80 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 80 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 443 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 443 -j ACCEPT

        # Allow traffic on the TUN interface.
        -A INPUT -i tun0 -j ACCEPT
        -A FORWARD -i tun0 -j ACCEPT
        -A OUTPUT -o tun0 -j ACCEPT

        # Allow forwarding traffic only from the VPN.
        -A FORWARD -i tun0 -o eth0 -s 10.8.0.0/24 -j ACCEPT
        -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

        # Log any packets which don't fit the rules above...
        # (optional but useful)
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 4
        -A FORWARD -m limit --limit 3/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 4
        -A OUTPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_OUTPUT_denied: " --log-level 4

        # then reject them.
        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT

        COMMIT
        ~~~

3.  Import the new ruleset:

        sudo iptables-restore < /etc/iptables/rules.v4

4.  Apply the routing rule so that traffic can leave the VPN. This must be done after `iptables-restore` because that command can't take a table option:

        sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

5.  Save the currently loaded rules with `iptables-persistent`:

        sudo dpkg-reconfigure iptables-persistent

6.  The kernel must then be told it can forward incoming IPv4 traffic:

        echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.d/99-sysctl.conf

7.  Activate the sysctl change:

        sudo sysctl -p

8.  Restart OpenVPN:

        sudo systemctl restart openvpn.service

## Next Steps

Server-side configuration is complete but now the VPN clients need to be set up. Move on to part three: [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices).
