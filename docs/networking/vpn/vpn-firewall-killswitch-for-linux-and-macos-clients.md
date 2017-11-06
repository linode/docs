---
author:
  name: Linode
  email: docs@linode.com
description: 'How to set up a VPN firewall on OpenVPN clients'
og_description: 'This guide will show you how to set up a VPN Killswitch with iptables on OpenVPN clients.'
keywords: 'vpn, security'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Friday, September 29th, 2017'
modified_by:
  name: Linode
published: 'Friday, September 29th, 2017'
title: iptables Configuration for VPN Killswitch
external_resources:
- '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation.html)'
- '[Ubuntu Help Page for iptables](https://help.ubuntu.com/community/IptablesHowTo)'
---

A virtual private network is often used to evade censorship, surveillance, or geolocation by routing internet traffic from your local device to the remote VPN server through an encrypted tunnel. In this scenario, the VPN server is the internet gateway for all connected client devices, and it forwards traffic from clients out to the interent, then receives and routes the traffic back to the client devices. However, there is always a risk that the VPN connection will unexpectedly drop, which can result in your traffic being communicated over the public internet instead of through the encrypted VPN connection.

For this reason, VPN clients often use firewall rules to ensure that internet traffic is allowed only to the VPN gateway. This protects the client's traffic from being compromised in the event of a sudden disconnection from the VPN server. This functionality is sometimes referred to as a VPN "kill switch," because it has the effect of instantly blocking all connections to the internet if the VPN connection should fail.

## Before You Begin

This guide assumes that you already have an OpenVPN server running on your Linode, and have at least one client configured to connect to it. If you need help doing this, see our three-part series on setting up an OpenVPN environment:

1.  [Set Up a Hardened OpenVPN Server with Debian](/docs/networking/vpn/set-up-a-hardened-openvpn-server)

2.  [Tunnel Your Internet Traffic Through an OpenVPN Server](/docs/assets/tunnel-traffic-through-openvpn.png)

3.  [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices)


## Gather Client Device Information
Before configuring a client device, you will need to know:

-  The device's network interface name.
-  The client's local network's subnet.

You can find this information by running the `route` command on your Linux client. Keep in mind that this requires root or sudo access.

![route-command-output](https://technofaq.org/wp-content/uploads/2017/08/Screenshot_20170806_182215.png)

 The table shows the network interface name under the *Iface* column (wlp6s0), and the LAN's subnet under the *Genmask* (255.255.255.0). These values will be used throughout the remainder of this guide, so be sure to replace `wlp6s0` and `198.168.0.1/24` with the interface and IP address/subnet found by running `route` on your client.

For macOS, the commands `networksetup -listallhardwareports` and `ifconfig` will show all your possible network interfaces and associated network information. From that list, you can find your ethernet and WiFi device names and their local subnet.

## Configure client.ovpn

On your client, change the `client.ovpn` configuration file as follows:

1.  You should already have the setting  *dev tun* to specify the virtual network adapter. Change it to tun0 so it can be referred to in firewall rules:

    {:.file-excerpt}
    client.ovpn
    :   ~~~
        dev tun0
        ~~~

2.  Make sure your VPN server is listed by its IP address instead of a hostname. For example:

    {:.file-excerpt}
    client.ovpn
    :   ~~~
        remote 198.51.100.0 1194
        ~~~

## GNU/Linux Clients

The majority of GNU/Linux users use either `iptables` or `ufw` to manage their firewall. This guide will cover configuration for both of these options.

### VPN firewall using iptables

{: .caution}
>
> You may want to back up your current iptables ruleset with `iptables-save`.

1.  Create a shell script with the following `iptables` ruleset:

    {:.file}
    iptables-vpn.sh
    :   ~~~

        #!/bin/bash
        iptables --flush
        iptables --delete-chain
        iptables -t nat --flush
        iptables -t nat --delete-chain
        iptables -P OUTPUT DROP
        iptables -A INPUT -j ACCEPT -i lo
        iptables -A OUTPUT -j ACCEPT -o lo
        iptables -A INPUT --src 192.168.0.0/24 -j ACCEPT -i wlp6s0
        iptables -A OUTPUT -d 192.168.0.0/24 -j ACCEPT -o wlp6s0
        iptables -A OUTPUT -j ACCEPT -d 198.51.100.0 -o wlp6s0 -p udp -m udp --dport 1194
        iptables -A INPUT -j ACCEPT -s 198.51.100.0 -i wlp6s0 -p udp -m udp --sport 1194
        iptables -A INPUT -j ACCEPT -i tun0
        iptables -A OUTPUT -j ACCEPT -o tun0
        ~~~

2.  Save the script as `iptables-vpn.sh`, then set the permissions using `chmod` and execute the script:

        chmod +x iptables-vpn.sh
        ./iptables-vpn.sh

This ruleset replaces the pre-exiting iptables rules and instructs the firewall to drop every outgoing connection other than loopback traffic, the local network's subnet and UDP traffic to and from your OpenVPN server's IP on port 1194. In addition, all incoming and outgoing connections are allowed over the virtual network interface `tun0`.

Your VPN firewall is now active, but this ruleset is only temporary and will be cleared when you reboot your Linode. To make the firewall permanent, you can install the `iptables-persistent` package for Debian or Ubuntu-based distributions, or you can see our [iptables](/docs/security/firewalls/control-network-traffic-with-iptables#deploy-your-iptables-rulesets) or [Firewalld](/docs/security/firewalls/introduction-to-firewalld-on-centos#constructing-a-ruleset-with-firewalld) guides to create permanent rulesets and/or profiles.

### VPN Firewall using ufw

{: .caution}
>
> You may want to back up your current firewall ruleset.

1.  Create a new shell script containing the following commands:

    {:.file}
    ufw-vpn.sh
    :   ~~~
        ufw --force reset
        ufw default deny incoming
        ufw default deny outgoing
        ufw allow in on tun0
        ufw allow out on tun0
        ufw allow in on wlp6s0 from 192.168.0.0/24
        ufw allow out on wlp6s0 to 192.168.0.0/24
        ufw allow out on wlp6s0 to 198.51.100.0 port 1194  proto udp
        ufw allow in on wlp6s0 from 198.51.100.0 port 1194 proto udp
        ufw enable
        ~~~

2.  Save the script as `ufw-vpn.sh`, then set the permissions using `chmod` and execute the script:

        chmod +x ufw-ks.sh
        ./ufw-ks.sh

Your VPN firewall is now active. Use `ufw disable` if you want to disable the firewall.

## Apple OS X / macOS

[Pf](https://en.wikipedia.org/wiki/PF_(firewall)) is the firewall application used by newer versions of OS X and macOS.

1.  Edit the `pf` configuration file:

    {:.file-excerpt}
    /etc/pf.conf
    :   ~~~
        block drop all
        pass on lo0
        pass on utun0
        pass out proto udp from any to 198.51.100.0 port 1194
        ~~~

2.  Import the newly added rules as follows:

        pfctl -f /etc/pf.conf

3.  Turn on the firewall:

        pfctl -e

Once `pf` is enabled, your VPN firewall is active. Use `pfctl -d` if you need to deactivate the firewall.

In recent versions of OS X or macOS with the Tunnelblick OpenVPN client, you might have an unused `utun` interface, in which case you will not be able to connect to the VPN server. You can check for unused interfaces with `ifconfig`.

If you have an unused `utun0`, for example, then change `pass on utun0` in pf.conf:

    pass on utun1
