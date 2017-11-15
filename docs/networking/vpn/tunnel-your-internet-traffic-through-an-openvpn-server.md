---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'A common use case for a VPN tunnel is to access the internet from behind it to evade censorship or geolocation and protect your connection from untrusted internet service providers, WiFi hotspots, and sites and services you connect to.'
keywords: ["openvpn", "vpn", "vpn tunnel", "openssl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-27
modified_by:
  name: Linode
published: 2015-12-09
title: 'Tunnel Your Internet Traffic Through an OpenVPN Server'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
---

This guide will show you how to configure an OpenVPN server to forward incoming traffic to the internet, then route the responses back to the client.

![Tunnel Your Internet Traffic Through an OpenVPN Server](/docs/assets/tunnel-traffic-through-openvpn.png "Tunnel Your Internet Traffic Through an OpenVPN Server")

Commonly, a VPN tunnel is used to privately access the internet, evading censorship or geolocation by shielding your computer's web traffic when connecting through untrusted hotspots, or connections.

## Before You Begin

This guide is the second-part  of a three-part series on setting up a  hardened OpenVPN environment. The guide assumes that you already have an OpenVPN server running. If you do not: complete part one of the series: [Set Up a Hardened OpenVPN Server with Debian](/docs/networking/vpn/set-up-a-hardened-openvpn-server). If you found this page looking for information about VPN client device configuration, see Part Three: [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices).

## OpenVPN Configuration

OpenVPN's server-side configuration file is: `/etc/openvpn/server.conf`, and requires editing to optimize its efficiency.

1.  Switch from your standard user account to the `root` user:

        sudo su - root

2.  Set OpenVPN to push a gateway configuration, so all clients send internet traffic through it.

        cat >> /etc/openvpn/server.conf << END

        # Clients are to use this server as a network gateway.
        push "redirect-gateway def1 bypass-dhcp"
        END

3.  Push DNS resolvers to client devices. [OpenDNS](https://www.opendns.com/) is provided by OpenVPN's `client.ovpn` template file.

        cat >> /etc/openvpn/server.conf << END

        # Push these DNS addresses to clients.
        push "dhcp-option DNS 208.67.222.222"
        push "dhcp-option DNS 208.67.220.220"
        END


## Append Networking Rules

In [Part One](/docs/networking/vpn/set-up-a-hardened-openvpn-server) of this series, we set iptables rules so the OpenVPN server could only accept client connections, SSH, and make system updates, all over IPv4. [IPv6 was disabled](/docs/networking/vpn/set-up-a-hardened-openvpn-server#disable-ipv6) since OpenVPN doesn't support using both transport layers simultaneously. Leaving IPv6 disabled here prevents leaking v6 traffic which would otherwise be sent separately from your VPN's v4 tunnel.



{{< caution >}}
The steps below will overwrite any custom IPv4 firewall rules you may have.
{{< /caution >}}

1.  Blank the v4 ruleset that you created in part one of this series.

        true > /etc/iptables/rules.v4

2.  Create a new IPv4 rule file using the ruleset below. The path `/etc/iptables/rules.v4` assumes Debian or Ubuntu with `iptables-persistent` installed.

    {{< file "/etc/iptables/rules.v4" aconf >}}
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
-A FORWARD -i tun0 -o eth0 -s 10.89.0.0/24 -j ACCEPT
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

{{< /file >}}


3.  Import the new ruleset:

        iptables-restore < /etc/iptables/rules.v4

4.  Apply the routing rule so that traffic can leave the VPN. This must be done after `iptables-restore` because that directive doesn't  take a table option:

        iptables -t nat -A POSTROUTING -s 10.89.0.0/24 -o eth0 -j MASQUERADE

5.  Save the currently loaded rules with `iptables-persistent`:

        dpkg-reconfigure iptables-persistent

6.  The kernel must then be told it can forward incoming IPv4 traffic:

        echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.d/99-sysctl.conf

7.  Activate the sysctl change:

        sysctl -p

8.  Restart OpenVPN and exit the `root` user account:

        systemctl restart openvpn*
        exit

## Next Steps

Server-side configuration is complete but now the VPN clients need to be set up. Move on to part three: [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices).
