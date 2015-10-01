---
author:
  name: Linode
  email: docs@linode.com
description: 'Use OpenVPN to securely connect separate networks on an Ubuntu 12.04 (Precise) or Debian 7 Linux VPS.'
keywords: 'openvpn,vpn,debian,ubuntu,security'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Friday, September 11, 2015'
modified_by:
  name: Linode
published: 'Friday, September 11, 2015'
title: 'How to Tunnel Your Internet Trafic Through an OpenVPN Server on Debian 8'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
---

This gude will show you how to configure an OpenVPN server to forward out to the interent all traffic it recieves from client devices, then route the responses back appropriately. This will take place primarily over IPv4 but options for IPv6 are given.

A common use case for a VPN tunnel is to access the internet from behind it to evade censorship or geolocation while shielding your computer's public IP address to your ISP, and sites and services you connect to.

## Before you Begin

This guide is the second of a three part series to set up a hardened OpenVPN server and client devices. It assumes that you already have the OpenVPN server up and running so before moving further in this page, complete part one of the series: [Set Up a VPN Tunnel with Debian 8](/docs/networking/vpn/***). If you found this page but are looking for part three for client device configuration, see Part 3: [Configuring OpenVPN Client Devices](/docs/networking/vpn/***).

## OpenVPN Configuration

OpenVPN's server-side configuration file is `/etc/openvpn/server.conf` and it requires several edits.

1.  Tell OpenVPN that it should make all clients send internet traffic through it.

    {: .file-exceprt}
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

    Client-side DNS settings are ideal for preventing DNS leaks and will override those pushed by the OpenVPN server. Google DNS is what's provided by the OpenVPN client software and while this can be disabled, it can not be changed within the client if you prefer a different resolver. Desktop Linux*** is the only platform which allows specifying DNS IPs of your choice for VPN connections.

    If using the options below to push DNS resolvers to VPN clients, you can disable the Google DNS fallback on your clients (or leave it enabled as the fallback it was intended to be). [OpenDNS](https://www.opendns.com/) is provided by default but you can change this to whatever your preference.

    {: .file-exceprt}
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

3.  To route IPv6 traffic to OpenVPN in addition IPv4, add these lines to `server.conf`.

        tun-ipv6
        push tun-ipv6
        ifconfig-ipv6 2001:db8:0:123::1 2001:db8:0:123::2
        server-ipv6 2001:412:abcd:2::/64
        push "route-ipv6 2600::/3"

    {: .note }
    >
    >If you instead want to tunnel IPv6 traffic to IPv4 on the clients, or leave IPv6 entirely disabled, do not add these lines; 6 to 4 tunneling will be covered later.

## Append Networking Rules

In Part One,[***]() of this series, we set iptables rules so the OpenVPN server can only accept client connections, SSH and make system updates, but nothing more. Since now we want the server to forward traffic out to the internet from clients, accept the responses and route them back to client machines, we must adjust the rulesets.

{: .caution }
>
>The steps below will overwrite any custom firewall rules you may have!

### IPv4

1.  Remove the ruleset files for iptables which you created on the previous page.

        sudo rm /etc/iptables/{rules.v4,rules.v6}

2.  Create a new IPv4 rule file **using the ruleset below** The path `/etc/iptables/rules.v4` assumes Debian or Ubuntu with `iptables-persistent` installed.

    {: .file}
    /etc/iptables/rules.v4
    :   ~~~ conf

        *filter

        # Allow all loopback (lo0) traffic
        # and reject traffic to 127/8 that doesn't use lo0.
        -A INPUT -i lo -j ACCEPT
        -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT
        -A OUTPUT -o lo -j ACCEPT

        # Allow ping and traceroute.
        -A INPUT -p icmp --icmp-type 3 -j ACCEPT
        -A INPUT -p icmp --icmp-type 8 -j ACCEPT
        -A INPUT -p icmp --icmp-type 11 -j ACCEPT
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

        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 80 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 443 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 80 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 443 -j ACCEPT

        # Allow traffic on the TUN interface.
        -A INPUT -i tun+ -j ACCEPT
        -A FORWARD -i tun+ -j ACCEPT
        -A OUTPUT -o tun+ -j ACCEPT

        # Allow forwarding traffic only from the VPN
        -A FORWARD -s 10.8.0.0/24 -j ACCEPT
        -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

        # Log any packets which don't fit the rules above...
        # (optional but useful)
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 4
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 4
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_OUTPUT_denied: " --log-level 4

        # then reject them.
        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT

        COMMIT
        ~~~

3.  Import the new ruleset:

        sudo iptables-restore < /etc/iptables/ipv4

4.  Apply the routing rules so that traffic can leave the VPN. This must be done after `iptables-restore` because that command can't take a `-t` option.

        sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

5.  Then run `iptables-persistent` to save your IPv4 rules.

        sudo dpkg-reconfigure iptables-persistent

### IPv6

In Part One,[***](), the option was given to disable IPv6. If you choose to keep that setup, then these steps can be skipped.

{: .caution }
>
>IPv6 can leak your public IP address if improperly configured. Many commercial VPN providers stop this by disabling IPv6 altogether. If you choose to use IPv6 on your VPN, care must be taken with its setup.

1.  Create a new IPv6 rule file **using the ruleset below**. Again `iptables-persistent` is assumed to be present on either a Debian or Ubuntu system.

    {: .file}
    /etc/iptables/rules.v6
    :   ~~~ conf

        *filter

        #Allow loopback interface to only localhost.
        -A INPUT -s ::1 -j ACCEPT
        -A OUTPUT -s ::1 -j ACCEPT

        #Allow pings.
        -A INPUT -p icmpv6 -j ACCEPT
        -A OUTPUT -p icmpv6 -j ACCEPT

        # Allow DNS resolution.
        -A INPUT -i eth0 -p udp -m state --state ESTABLISHED --sport 53 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state NEW,ESTABLISHED --dport 53 -j ACCEPT

        #Allow UDP traffic on port 1194.
        -A INPUT -i eth0 -p udp -m state --state NEW --dport 1194 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state ESTABLISHED --sport 1194 -j ACCEPT

        #Allow traffic on the TUN interface.
        -A INPUT -i tun+ -j ACCEPT
        -A FORWARD -i tun+ -j ACCEPT
        -A OUTPUT -o tun+ -j ACCEPT

        # Allow forwarding traffic only from the VPN
        #-A FORWARD -m state --state NEW -i tun+ -o eth0 -s ROUTED/64 -j ACCEPT
        -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

        # Log any packets which don't fit the rules above...
        # (optional but useful)
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "ip6tables_INPUT_denied: " --log-level 4
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "ip6tables_FORWARD_denied: " --log-level 4
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "ip6tables_OUTPUT_denied: " --log-level 4

        # then reject them.
        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT
        ~~~


3.  Import the ruleset:

        sudo ip6tables-restore < /etc/iptables/ipv6

4.  Apply the routing rule.

        sudo ip6tables -t nat -A POSTROUTING -s ***/64 -o eth0 -j MASQUERADE

5.  Run `iptables-persistent` one last time.

        sudo dpkg-reconfigure iptables-persistent

### sysctl

The kernel must then be told it can forward incoming IPv4 and iPv6 traffic.

    echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.d/99-sysctl.conf
    echo 'net.ipv6.conf.all.forwarding=1' >> /etc/sysctl.d/99-sysctl.conf && sudo sysctl -p

Restart the OpenVPN daemon

    sudo systemctl restart openvpn

## Next Steps

Server-side configuration is complete but now the VPN clients need to be set up. Move on to [Part Three: Configuring OpenVPN Client Devices](/docs/networking/vpn/configure-openvpn-client-devices).