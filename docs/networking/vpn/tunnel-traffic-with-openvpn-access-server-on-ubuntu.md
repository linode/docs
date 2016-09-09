---
author:
  name: Neal Sebastian
  email: yoneal@gmail.com
description: 'Easily tunnel web traffic through your personal OpenVPN Access Server in Ubuntu 14.04'
keywords: 'openvpn,networking,vpn,ubuntu,ubuntu trusty,14.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, September 1st, 2016
modified_by:
  name: Neal Sebastian
  link: https://github.com/yoneal
published: 'Friday, April 1st, 2016'
title: 'Tunnel Traffic with OpenVPN Access Server on Ubuntu'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*


VPN tunneling is a method of creating an encrypted connection to a remote local area network (LAN) over the Internet. Consequently, you can use this connection to access the Internet from behind it. This is useful if you want to evade censorship, geolocation or company firewall.

OpenVPN is a popular software for creating VPN tunnels. It has two editions, *Community Edition* and *Access Server*. The Access Server is full featured and has a free license for two concurrent users. This guide will use [OpenVPN Access Server](https://openvpn.net/index.php/access-server/overview.html), because it is sufficent for personal use.

This guide will focus on configuring OpenVPN Access Server on Ubuntu 14.04 (Trusty) for tunneling Internet traffic and firewall setup via Uncomplicated Firewall (UFW).

## Before You Begin

1. Familiarize yourself with the [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2. Follow the [Securing Your Server](/docs/security/securing-your-server) guide to secure your server, but do not follow the *Configure a Firewall* section as we will use UFW instead of iptables.

3. Read [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw) to learn how to setup UFW.

4. Install OpenVPN Access Server using the [Secure Communications with OpenVPN Access Server](docs/networking/vpn/openvpn-access-server) guide.

## Configure OpenVPN Access Server

1. Go to the Admin UI, then click the *VPN Settings*. In the *Routing* section, ensure that the **Yes** option is selected in "Should client Internet traffic be routed through the VPN?".

	[![OpenVPN Access Server Internet Routing.](/docs/assets/openvpn-admin-web-resize.png)](/docs/assets/openvpn-access-server-routing.png)

For "Should VPN clients have access to private subnets (non-public networks on the server side)?", since we are just using this for VPN tunneling the Internet, we can just answer **No**.

{: .note}
>
> The default route of VPN clients will be set to the VPN server's virtual IP address. This means that all Internet traffic will go through the VPN tunnel.

2. To avoid DNS leaking, we must push DNS servers to clients. Simply select **Have clients use the same DNS servers as the Access Server host** in "DNS Settings" to have the client use the same DNS servers as your linode.

	[![OpenVPN Access Server DNS Settings.](/docs/assets/openvpn-admin-web-resize.png)](/docs/assets/openvpn-access-server-dns.png)

You can also select the DNS servers yourself by choosing *Have clients use these DNS servers:*. The following are popular DNS servers:

* Open DNS (primary: 208.67.222.222, secondary: 208.67.222.220)
* Google Public DNS (primary: 8.8.8.8, secondary: 8.8.4.4)

3. Press *Save Settings*, then you will be prompted to *Update Running Server*.

## Additional Firewall Rules
You need to enable IP Masquerading by enabling packet forwarding and configuring the nat table.

1. In `/etc/default/ufw` file, change *DEFAULT_FORWARD_POLICY* to *ACCEPT*.

	DEFAULT_FORWARD_POLICY="ACCEPT"

2. Edit `/etc/ufw/sysctl.conf` and uncomment the following:

{: .file }
/etc/ufw/sysctl.conf
:   ~~~ conf
    # Uncomment this to allow this host to route packets between interfaces
    net/ipv4/ip_forward=1
    net/ipv6/conf/default/forwarding=1
    net/ipv6/conf/all/forwarding=1
    ~~~

3. Find out the dynamic IP address network that vpn clients are assigned to, this will be needed for the next step. In the Admin UI, click *VPN Settings* and take note of the "Dynamic IP Address Network".

	[![OpenVPN Access Server Dynamic IP Address Network.](/docs/assets/openvpn-admin-web-resize.png)](/docs/assets/openvpn-access-dynamic-ip-network.png)

In the example above, the dynamic IP address network is **172.27.224.0/20**.

4. Add the following rules to the top of the `/etc/ufw/before.rules` file, just after the header comments:

{: .file }
/etc/ufw/before.rules
:   ~~~ conf
    # nat Table rules
    *nat
    :POSTROUTING ACCEPT [0:0]

    # Forward traffic from eth1 through eth0.
    -A POSTROUTING -s 172.27.224.0/20 -o eth0 -j MASQUERADE
    ~~~

- don't delete the 'COMMIT' line or these nat table rules won't be processed
	COMMIT

Replace `<dynamic ip address network>` with the one found in the previous step.

## Troubleshooting

### Open Firewall Ports
If you can't connect to the VPN nor access the web UI, make sure the required ports (943, 1194) are open:

	sudo ufw allow 943
	sudo ufw allow 1194

### Compression
If you are connected but not able to browse the Internet, check the log file at `/var/log/openvpnas.log`. If you see logs similar to the following:

	2016-03-28 16:59:05+0800 [-] OVPN 11 OUT: 'Mon Mar 28 08:59:05 2016 guest/122.55.96.237:55385 Bad compression stub decompression header byte: 251'

Then this might be a problem related to compression. To resolve this, just disable compression on your openvpn client.
