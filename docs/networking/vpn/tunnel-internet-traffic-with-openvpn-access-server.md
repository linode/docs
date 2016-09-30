---
author:
  name: Neal Sebastian
  email: yoneal@gmail.com
description: 'Easily tunnel web traffic through OpenVPN Access Server'
keywords: 'openvpn,networking,vpn,tunnel'
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
modified: Monday, October 3rd, 2016
modified_by:
  name: Neal Sebastian
  link: https://github.com/yoneal
published: 'Friday, April 1st, 2016'
title: 'Tunnel Internet Traffic with OpenVPN Access Server'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*

*VPN tunneling* is a method of forwarding internet traffic through your VPN connection. This is useful if you want to evade censorship, IP geolocation, or a firewall on your local network.

*OpenVPN* is a popular software for creating VPN tunnels. It has two versions, *Community Edition* and *Access Server*. The Access Server is full featured and has a free license for two concurrent users. This guide details the process for configuring [OpenVPN Access Server](https://openvpn.net/index.php/access-server/overview.html) to tunnel all of your internet traffic.

## Before You Begin

1. Familiarize yourself with the [Getting Started](/docs/getting-started) guide.

2. Follow the [Securing Your Server](/docs/security/securing-your-server) guide.  OpenVPN Access Server creates its own firewall rules, so the steps for [configuring a firewall](/docs/security/securing-your-server#configure-a-firewall) should be skipped for now. Once you've configured OpenVPN, you can apply additional firewall rules as needed.  

3. Install OpenVPN Access Server using the [Secure Communications with OpenVPN Access Server](docs/networking/vpn/openvpn-access-server) guide.

## Configure OpenVPN Access Server for Tunneling

To configure OpenVPN for tunneling, you'll first need to log in to the Access Server Admin UI, and navigate to the **VPN Settings** page.

1. In the **Routing** section, ensure that the option "Should client Internet traffic be routed through the VPN?" is set to **Yes**.

    ![OpenVPN Access Server Internet Routing.](/docs/assets/openvpn-access-server-routing.png)

    The option "Should VPN clients have access to private subnets (non-public networks on the server side)?" can be set to **No**, since we are using the VPN to mask internet traffic. If you wish to give VPN users access to services listening on your Linode's local network, set this option to **Yes**.

2. To avoid DNS leaking, we must modify the DNS resolver settings. Simply select **Have clients use the same DNS servers as the Access Server host** in **DNS Settings** to have the client use the same resolvers as your Linode.

    ![OpenVPN Access Server DNS Settings.](/docs/assets/openvpn-access-server-dns.png)

    Alternatively, you can manually set the DNS resolvers that will be used by your VPN client machines, under **Have clients use these DNS servers**. This will require that you add both a primary and secondary server. Some popular public DNS servers:

    * Open DNS (primary: 208.67.222.222, secondary: 208.67.222.220)
    * Google Public DNS (primary: 8.8.8.8, secondary: 8.8.4.4)

    Once you've applied your changes, press **Save Settings**. You will be prompted to **Update Running Server** to push your new configuration to the OpenVPN server.

## Enable IP Forwarding

IP Forwarding is necessary if you wish to connect additional private network devices behind your client machine, and have their traffic forwarded through the VPN. IP forwarding can be enabled by running these commands in order:

    echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.d/99-sysctl.conf
    sudo sysctl -p

The first command enables forwarding over IPv4 in your system configuration, and the second command applies this change.

Once forwarding is enabled, restart OpenVPN by hitting the **Stop the Server** and **Start the Server** buttons under the **Status Overview** section in the Access Server Admin UI:

![OpenVPN Access Server Restart](/docs/assets/openvpn-access-server-restart-resize.png)](/docs/assets/openvpn-access-server-restart.png)

### Disable IPv6

As OpenVPN does not support transfer over IPv4 and IPv6 simultaneously, you should follow our steps for [disabling IPv6](/docs/networking/vpn/set-up-a-hardened-openvpn-server#disable-ipv6) unless you have a specific reason not to do so.

## Test and Troubleshoot

Once you've [connected your client](/docs/networking/vpn/openvpn-access-server#client-software-installation), you can use a website such as [WhatsMyIP.org](https://www.whatsmyip.org/) to confirm that your traffic is routing through the VPN server's address. You can also use [DNSLeakTest.com](https://www.dnsleaktest.com/) to ensure that your VPN connection is using the resolvers specified by your OpenVPN server, to prevent leaking of your actual location via your ISP's resolvers.

### Compression

If you are connected to the VPN, but unable to browse the Internet, check the OpenVPN log located at `/var/log/openvpnas.log`. If you see entries similar to the following:

	2016-03-28 16:59:05+0800 [-] OVPN 11 OUT: 'Mon Mar 28 08:59:05 2016 guest/123.45.67.89:55385 Bad compression stub decompression header byte: 251'

This is likely an issue related to client compression. To resolve this, disable support for client compression from **Advanced VPN** section in the Admin UI, by unchecking **Support compression on client VPN connections**:

![OpenVPN Access Server Compression](/docs/assets/openvpn-access-compression.png)
