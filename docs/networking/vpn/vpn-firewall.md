---
author:
  name: Linode
  email: docs@linode.com
description: 'How to set up a VPN firewall on OpenVPN clients'
keywords: 'vpn, security'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Monday, September 11, 2017'
modified_by:
  name: Linode
published: 'Friday, September 8, 2017'
title: Setting Up a Firewall for Your VPN Client
external_resources:
- '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation.html)'
- '[Ubuntu Help Page for iptables](https://help.ubuntu.com/community/IptablesHowTo)'
---

VPNs are often used to evade censorship, surveillance, or geolocation by routing internet traffic through a secure, encrypted tunnel. However, when using a VPN in this way, there is always a risk that the VPN connection will unexpectedly drop, which can result in the release of personal information over the public internet.

For this reason, VPNs are often used in conjunction with a firewall to ensure that no internet traffic is allowed except through the VPN gateway. By creating a specific set of firewall rules designed to prevent unencrypted internet access, it is possible to protect your true IP address or other personal information from being exposed in the event of a sudden disconnection from the VPN server. This functionality is sometimes referred to as a VPN "kill switch," because it has the effect of instantly blocking all connections to the internet if the VPN connection should fail.

## Before You Begin

This guide assumes that you already have a secure OpenVPN server running on your Linode, and have at least one client configured to connect to the server. If you don't have these set up yet, or are unsure how to properly secure your OpenVPN connection, please see our three-part series on setting up a hardened OpenVPN environment:

1.	[Set Up a Hardened OpenVPN Server with Debian 8](/docs/networking/vpn/set-up-a-hardened-openvpn-server)

2. [Tunnel Your Internet Traffic Through an OpenVPN Server](/docs/assets/tunnel-traffic-through-openvpn.png "Tunnel Your Internet Traffic Through an OpenVPN Server")

3. [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices)

You will also need to know the name of the network interface connected to your default gateway or Internet and subnet of your local network. You can find this information by running the `route` command on your client. Keep in mind that this requires root or sudo access:

![route-command-output](https://technofaq.org/wp-content/uploads/2017/08/Screenshot_20170806_182215.png)

 The Iface column in the table above gives you your network interface name and the last line gives you the subnet of your local network.

 {: .note}
 >
 >Throughout this guide, replace `wlp6s0` and `198.168.0.1/24` with the interface and IP address/subnet found by running `route` on your client. Replace `198.51.100.0` with the IP address of your OpenVPN server.

## Configure client.ovpn

On your client, change the `client.ovpn` configuration file as follows:

1. Set the tun device to tun0, if not set already. (Optional but recommended):

    {:.file-excerpt}
    client.ovpn
    :   ~~~
        dev tun0
        ~~~

2. Make sure your remote is an IP address instead of a hostname as follows:

    {:.file-excerpt}
    client.ovpn
    :   ~~~
        remote 198.51.100.0 1194
        ~~~

## GNU/Linux Clients:

The majority of GNU/Linux users use either `iptables` or `ufw` to manage their firewall. This guide will cover configuration for both of these options.

### VPN firewall using iptables

{: .caution}
>
> You may want to back up your current iptables ruleset with `iptables-save`.

1. Create a shell script with the following `iptables` ruleset:

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

2. Save the script as `iptables-vpn.sh`, then set the permissions using `chmod` and execute the script:

        chmod +x iptables-vpn.sh
        ./iptables-vpn.sh

This rule set expunges the pre-exiting rule set in iptables and instructs the firewall to drop every outgoing connection other than local traffic, the local network's subnet and your OpenVPN server's IP at a particular port (port 1194) using a specific protocol (udp). In addition, all incoming and outgoing connections are allowed over the virtual network interface `tun0`.

Your VPN firewall is now active.

These settings are temporary and will be cleared when you reboot your Linode. In order to make the firewall permanent, you can install the `iptables-persistent` package for your Linux distribution.

Alternatively, you can set the `iptables-vpn.sh` to run on boot by adding this line to the end of `/etc/crontab`:

{: .file-excerpt}
/etc/crontab
:   ~~~
    @reboot root /path/iptables-ks.sh
    ~~~

### VPN Firewall with ufw

{: .caution}
>
> You may want to back up your current firewall ruleset.

1. Create a new shell script containing the following commands:

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

2. Save the script as `ufw-vpn.sh`, then set the permissions using `chmod` and execute the script:

        chmod +x ufw-ks.sh
        ./ufw-ks.sh

Your VPN firewall is now active. Use `ufw disable` if you want to disable the firewall.

## Mac OS Clients:

In order to setup a VPN firewall on Mac OS, you will use a command line tool called `pf`.

1. Edit the `pf` configuration file:

    {:.file-excerpt}
    /etc/pf.conf
    :   ~~~
        block drop all
        pass on lo0
        pass on utun0
        pass out proto udp from any to 198.51.100.0 port 1194
        ~~~

2. Import the newly added rules as follows:

        pfctl -f /etc/pf.conf

3. Turn on the firewall:

        pfctl -e

Once `pf` is enabled, your VPN firewall is active. Use `pfctl -d` if you need to deactivate the firewall.

In recent versions of OS X or macOS with the Tunnelblick OpenVPN client, you might have an unused `utun` interface, in which case you will not be able to connect to the VPN server. You can check for unused interfaces with `ifconfig`.

If you have an unused `utun0`, for example, then change `pass on utun0` in pf.conf:

    pass on utun1
