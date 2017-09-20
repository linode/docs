---
author:
  name: Linode
  email: docs@linode.com
description: 'How to set up a manual kill switch on OpenVPN clients'
keywords: 'vpn, security'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Monday, September 11, 2017'
modified_by:
  name: Linode
published: 'Friday, September 8, 2017'
title: VPN Firewall
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

A *VPN firewall* can be defined as a set of firewall rules designed to prevent unencrypted Internet access or to exclusively allow Internet access via a VPN server or gateway only. Thereby preventing any sort of leaks that might occur owing to abrupt disconnection of VPN even when you are not actively monitoring your system or using it.

Commercial VPN providers usually include client software with settings to manage the firewall function for you. There are some issues involved. For starters most custom VPN software are not well maintained and not using production ready stable OpenVPN releases, you could be using a vulnerable or defective OpenVPN version which is the very core of VPN tunnelling.

A guide on how to setup a secure, hardened vanilla OpenVPN server on Debian, Ubuntu and more is already available for you.

Now the question is how to setup a VPN kill switch or firewall for OpenVPN clients who would be connecting to our own OpenVPN server?

The idea is to block or drop every connection but connection to the VPN server at a particular port using a specific protocol. And allowing all connections exclusively via VPN tunnel. Such that in case VPN connection breaks or disconnects for any reason, the system is in a state where the only thing that would work is connection to the a specific VPN server at a particular port using a specific protocol.

Set up a VPN firewall for GNU/Linux, macOS or OS X & Windows to prevent any leaks including but not limited to DNS leaks outside VPN network at all hence completely denying Internet access on a given system without an active encrypted VPN connection.

{: .note }
>
> Note: Some people might suggest you to allow DNS queries via your default gateway but I don’t. If you wish to allow it, you are at liberty to do so.)

## Before You Begin

1.	IP address or VPN gateway you wish to setup for VPN kill switch. (Public IP of your Linode Linux Server where you have your OpenVPN server setup).

2.	Name of the network interface connected to your default gateway or Internet and subnet of your local network.

For the purpose of this guide I am going to use ***wlp6s0*** as network interface and *192.168.0.0/24* as the subnet of local network and **x.x.x.x** as the IP of OpenVPN server hosted by me.

In order to find out both the details we use route command. Keep in mind it requires root or sudo access. Syntax for route command would be:

    # route

![route-command-output](https://technofaq.org/wp-content/uploads/2017/08/Screenshot_20170806_182215.png)


 As you can see in the picture above Iface value in the table gives you your network interface name and the last line gives you the subnet of your local network.

C.	Changes in *client.ovpn* configuration file as follows:

i. Set the tun device to tun0 in client configuration file, if not set already. (Optional but recommended):

    dev tun0

ii. Change host names to IPs for –remote option in client configuration file (Note: This step is not required for those who allowed DNS nameservers in the VPN firewall via default gateway).

Your client configuration file for OpenVPN must have IP(s) in –remote instead of host names as follows:

    remote x.x.x.x 1194

Replace x.x.x.x above with Public IP address of your Linux server where your OpenVPN server is setup.

D. Root/sudo/Admin access on client systems where you wish to deploy VPN firewall or kill switch.

GNU/Linux users:

Majority of GNU/Linux users either use iptables or ufw to manage their firewall. We have written separate sections for both tools below for your convenience.

## VPN firewall using iptables**

(Note: You are advised to backup your current iptables ruleset with *iptables-save*)

*iptables* ruleset is already written for you.  Here take a look:

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
    iptables -A OUTPUT -j ACCEPT -d x.x.x.x/32 -o wlp6s0 -p udp -m udp --dport 1194
    iptables -A INPUT -j ACCEPT -s x.x.x.x/32 -i wlp6s0 -p udp -m udp --sport 1194
    iptables -A INPUT -j ACCEPT -i tun0
    iptables -A OUTPUT -j ACCEPT -o tun0


Above iptable rule set expunges every pre-exiting rule set in iptables and outrightly drops every outgoing connection other than the local traffic, local network's subnet and my OpenVPN server's IP that to at a particular port (port 1194) using a specific protocol (udp). Also all incoming and outgoing connections are allowed over virtual network interface *tun0*.

You can copy *iptables* rule set  from above and save it as **iptables-ks.sh** for your convenience to edit/execute them.

Optional ip6tables rule set to be added in **iptables-ks.sh** for your IPv6 OpenVPN setup:

    ip6tables --flush
    ip6tables --delete-chain
    ip6tables -t nat --flush
    ip6tables -t nat --delete-chain
    ip6tables -P OUTPUT DROP
    ip6tables -A INPUT -j ACCEPT -i tun0
    ip6tables -A OUTPUT -j ACCEPT -o tun0

In order to active *iptables* rule set in *iptables-ks.sh* for deploying a Kill switch, open a terminal with root/sudo rights and do as follows:

    # chmod +x iptables-ks.sh
    # ./iptables-ks.sh

Congrats! Your VPN kill switch or firewall is active

These settings are temporary and would be wiped upon reboot. In order to prevent it you might need to install “**iptables-persistent**” package for your distribution.

Or set it to run on boot by adding this line to the end of /etc/crontab:

    @reboot root /path/iptables-ks.sh


    **b. Hello “ufw” users.**
    (Note: We recommend you to backup your current firewall ruleset.)

    I already wrote ufw ruleset for you.  Here take a look:

        ufw --force reset
        ufw default deny incoming
        ufw default deny outgoing
        ufw allow in on tun0
        ufw allow out on tun0
        ufw allow in on wlp6s0 from 192.168.0.0/24
        ufw allow out on wlp6s0 to 192.168.0.0/24
        ufw allow out on wlp6s0 to x.x.x.x port 1194  proto udp
        ufw allow in on wlp6s0 from x.x.x.x port 1194 proto udp
        ufw enable

    You can copy the ufw rules from above and save it as ufw-ks.sh for your convenience to edit/execute them.

    Open a terminal and gain sudo access or root access and do as follows:

        # chmod +x ufw-ks.sh
        # ./ufw-ks.sh

    Congrats! Your VPN kill switch or firewall is active.

    Mac OS X users:

    In order to setup kill switch or VPN firewall on OS X, we are going to use a command line tool called pf.

    Let us begin by editing the configuration file of pf at /etc/pf.conf in a terminal window as follows:

        # nano /etc/pf.conf

    In order to block all the connections other than to netblock or IP of VPN server(s) at a port using a particular protocol, we we would append /etc/pf.conf and add the following lines:

        block drop all
        pass on lo0
        pass on utun0
        pass out proto udp from any to x.x.x.x port 1194

    Save and exit.

    Once you are done editing the file. Let us import the newly added rules as follows:

        # pfctl -f /etc/pf.conf

    Lets turn on the firewall which is not ON by default as follows:

        # pfctl -e

    Once the pf is enabled, your VPN firewall is active.

    Note: In recent version of OS X or macOS with Tunnelblick OpenVPN client, you might have unused *utun* interfaces which can be check from a terminal as follows:

        # ifconfig

    So in case you already have an unused ***utun0*** for example then change **pass on utun0** in pf.conf to as follows:

        pass on utun1

    Or else you might get connected but won't be able to connect anywhere.
