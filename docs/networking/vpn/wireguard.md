---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-14T17:32:04-05:00
modified: 2017-11-14T17:32:04-05:00
modified_by:
  name: Linode
title: "How to Set Up WireGuard VPN on Ubuntu"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

[WireGuard](https://www.wireguard.com) is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster, simpler, leaner, and more useful than other VPN protocols such as OpenVPN and IPSec. WireGuard is still under development, but even in its unoptimized state it is up to four times faster than popular OpenVPN protocol and delivers much lower ping time in comparison.

WireGuard aims to be as simple to configure as SSH. A connection is established by an exchange of public keys between server and client just like SSH keys and only a client with its public key present in server configuration file would be authorized.

## Update Kernel

Wireguard requires a more recent kernel than is used in Linode's distribution. You will need to configure your Linode before installing Wireguard. Follow these steps after creating your Linode:

1.  In the Linode Manager, open the configuration profile for your Linode and find the **Boot Settings** section. Select **GRUB 2** as your kernel.

  ![Configuration Profile](/docs/assets/wireguard/wireguard-configuration-profile.png)

2.  Boot your Linode from the Linode Manager. Log in to your Linode using ssh and complete the standard setup procedure in our [Getting Started](/docs/getting-started) guide.

3.  Update your system:

        sudo apt update && sudo apt upgrade

4.  Update the kernel:

        sudo apt install linux-image-virtual grub2

5.  Reboot your system from the Linode Manager.


6.  Install kernel headers:

        sudo apt install linux-headers-$(uname -r)


## Install WireGuard

1.  Install `software-properties-common`:

        sudo apt install software-properties-common

2.  Add the Wireguard repository to your sources list:

        sudo add-apt-repository ppa:wireguard/wireguard

3.  Install Wireguard and its dependencies:

        sudo apt update
        sudo apt install wireguard-dkms wireguard-tools

  If the steps in the previous section were completed successfully, after the installation you will see the following console output:

        wireguard:
        Running module version sanity check.
        - Original module
        - No original module exists within this kernel
        - Installation
        - Installing to /lib/modules/4.4.0-98-generic/updates/dkms/

        depmod....

        DKMS: install completed.
        Setting up wireguard-tools (0.0.20171111-wg1~xenial) ...
        Processing triggers for libc-bin (2.23-0ubuntu9) ...

## Configure WireGuard Server

1.  Generate a private key for the WireGuard server:

        wg genkey

2. Open `/etc/wireguard/wg0.conf` in a text editor and add the following content:

  {{< file "/etc/wireguard/wg0.conf" aconf >}}
[Interface]
PrivateKey = MELpgc0wVUTJGgmCVePjIg12KRm9IbqW5E37kLgY+Wo=
Address = 10.0.0.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file >}}

  This file specifies the following configuration options:

  {{< file-excerpt  "/etc/wireguard/wg0.conf" aconf >}}
[Interface]
PrivateKey = MELpgc0wVUTJGgmCVePjIg12KRm9IbqW5E37kLgY+Wo=
{{< /file-excerpt}}


  These lines define the tunnel interface and specifies the WireGuard server's private key (replace with the private key generated above).

  {{< file-excerpt  "/etc/wireguard/wg0.conf" aconf >}}
Address = 10.0.0.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
{{< /file-excerpt}}

  **Address** sets private IPv4 and IPv6 addresses for WireGuard server to be setup behind public IP of your Linode. **ListenPort** specifies UDP port the VPN server will use to listen for connections.

  {{< file-excerpt  "/etc/wireguard/wg0.conf" aconf >}}
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file-excerpt >}}

*PostUp* and *PostDown* set Linux IP Masquerade rules respectively to allow all the clients to share Linux server's Internet IPv4 and IPv6 address and clear the rules once the tunnel is down, keeping the tables neat and tidy. *SaveConfig* saves anything added while the tunnel is up and running like a newly added client to server configuration file.

## Set Up Packet Forwarding and Firewall Rules

### Packet Forwarding

*Packing forwarding* is required to forward traffic from clients to the Internet.

1.  Open `/etc/sysctl.conf` in a text editor and uncomment the following lines:

    net.ipv4.ip_forward=1
    net.ipv6.conf.all.forwarding = 1

2.  Enable the changes:

    sysctl -p

### Firewall Rules

Configuring a firewall is a must to prevent unauthorized access to your VPS. I have used ufw, which is a popular and easy to use front-end for iptables.

1.  Allow connections to SSH and WireGuard VPN port:

      ufw allow 51820/udp
      ufw allow 22/tcp
      ufw enable

2.  Once enabled verify it with the following command:

      ufw status verbose

## Start Wireguard Service

1. Start Wireguard:

      wg-quick up wg0

2. Enable the Wireguard service to allow automatic restarts on boot:

      systemctl enable wg-quick@wg0

3.  Check if the VPN tunnel is running:

      wg show
      ifconfig wg0

{{< note >}}
`wg show` shows server's public key in the output. Record the key for use in the next section.
{{< /note >}}

## Wireguard Client

For other linux distributions please refer to, https://www.wireguard.com/install/.

1.  Generate a key pair for the client:

    wg genkey | tee privatekey | wg pubkey > publickey

  {{< file "/etc/wireguard/wg0.conf" aconf >}}
[Interface]
PrivateKey = <Output of privatekey file that contains your private key>
Address = 10.0.0.5/24, fd86:ea04:1115::5/64

[Peer]
PublicKey = <Server's public key from *wg show* command on server>
Endpoint = <Linux server's Public IP>:51820
AllowedIPs = 0.0.0.0/0, ::/0
{{< /file >}}

Save the above as *client.conf* in */etc/wireguard/* directory of your local machine after fixing the *PrivateKey* of client, *PublicKey* of server and *Endpoint IP* or Public IP of your Linux server.

**G. Adding WireGuard client(s) to VPN server on Linux server**

Next we add a client or peer on VPN server by executing the following *wg* command on Linux server:

    wg set wg0 peer <PUBLIC KEY OF CLIENT> allowed-ips 10.0.0.5,fd86:ea04:1115::5

A newly added client can be verified on Linux server by executing *wg show* command. Any number of clients with their respective public key can be added while tunnel or vpn server is up and running! *SaveConfig* entry added to server configuration above writes it to *wg0.conf* when the VPN server is brought down for any reason.

In order to save a client settings to server configuration file *wg0.conf* right away, just execute a save command as follows:

    wg-quick save wg0

More clients can be added to a live WireGuard server similarly:

     wg set wg0 peer <PUBLIC KEY OF CLIENT2> allowed-ips 10.0.0.10,fd86:ea04:1115::10
     wg-quick save wg0

**H. Connecting to WireGuard VPN server from a local machine**

Connect to your WireGuard VPN server on GNU/Linux client as follows to test your VPN setup for 1st time:

    $ sudo wg-quick up client

*wg-quick* command is a script that looks for *client.conf* in */etc/wireguard/* and use *wg* command to setup your VPN connection on local machine in seconds.

Verify the connection with wg command and by pinging server's Interface IP as follows:

    $ sudo wg
    $ ifconfig client
    $ ping 10.0.0.1

Upon successful connection last two lines of the output of above *sudo wg* should look as follows:

    latest handshake: 1 minute, 17 seconds ago
    transfer: 98.86 KiB received, 43.08 KiB sent

Kindly visit a website like https://duckduckgo.com/IP_Address or https://ipchicken.com to check your IP, if it is your Linux server's public IP then you did it! Also visit https://ipv6.google.com to ensure that you have IPv6 connectivity.

As of now, WireGuard is only supported on GNU/Linux because support on more platforms is expected. Although, current linux based embedded devices like routers can expect huge performance boost vs other prominent VPN protocols like OpenVPN.

Finally! We have successfully hosted a secure, modern and fast VPN server based on WireGuard VPN on a Linux server not just for you but even for your loved ones.
