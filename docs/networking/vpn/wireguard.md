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

[WireGuard](https://www.wireguard.com) is a simple, fast and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster, leaner, and more useful than other VPN protocols such as OpenVPN and IPSec. WireGuard is still under development, but even in its unoptimized state it is up to four times faster than the popular OpenVPN protocol and delivers much lower ping times in comparison.

WireGuard aims to be as simple to configure as SSH. A connection is established by an exchange of public keys between server and client just like SSH keys and only a client with its public key present in its server configuration file is considered authorized.

Currently, WireGuard is only available on Linux. This guide will configure a simple peer connection between a server, which will be a Linode running Ubuntu 16.04, and a client. The client can be either your local computer or another Linode.


## Update Kernel

Wireguard requires a more recent kernel than is used by default in Linode's distributions. You will need to configure your Linode before installing Wireguard. Follow these steps after creating your Linode:

1.  In the Linode Manager, open the configuration profile for your Linode and find the **Boot Settings** section. Select **GRUB 2** as your kernel.

  ![Configuration Profile](/docs/assets/wireguard/wireguard-configuration-profile.png)

2.  Boot your Linode, then connect to it with ssh and complete the standard setup procedure in our [Getting Started](/docs/getting-started) guide.

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

1.  Generate a private and public key pair for the WireGuard server:

        umask 077
        wg genkey | tee privatekey | wg pubkey > publickey

    This will save both the private and public keys to your home directory; they can be viewed with `cat privatekey` and `cat publickey` respectively.

2. Open `/etc/wireguard/wg0.conf` in a text editor and add the following content, replacing `<Private Key>` with the generated private key:

  {{< file "/etc/wireguard/wg0.conf" aconf >}}
[Interface]
PrivateKey = <Private Key>
Address = 192.168.2.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file >}}

  **Address** defines the private IPv4 and IPv6 addresses for the WireGuard server. Each peer in the VPN network should have a unique value for this field. This guide will use the 192.168.2.0/24 address block for IPv4 and the fd86:ea04:1115::0/64 block for IPv6. **ListenPort** specifies the UDP port the server will use to listen for connections.

  **ListenPort** specifies the port that WireGuard will use for incoming connections.

  **PostUp** and **PostDown** set steps to be run after the interface is turned on or off, respectively. In this case, `iptables` is used to set Linux IP Masquerade rules to allow all the clients to share the server's Internet IPv4 and IPv6 address, and clear the rules once the tunnel is down.

  **SaveConfig** tells the config file to automatically update whenever a new peer is added while the service is running.

## Set Up Packet Forwarding and Firewall Rules

### Packet Forwarding

Packing forwarding is required to forward traffic from clients to the Internet.

1.  Open `/etc/sysctl.conf` in a text editor and uncomment the following lines:

      net.ipv4.ip_forward=1
      net.ipv6.conf.all.forwarding = 1

2.  Enable the changes:

      sysctl -p

### Configure Firewall Rules

1.  Allow connections to SSH and WireGuard VPN port:

      ufw allow 51820/udp
      ufw allow 22/tcp
      ufw enable

2.  Once enabled verify the settings with the following command:

      ufw status verbose

## Start Wireguard Service

1. Start Wireguard:

      wg-quick up wg0

    {{< note >}}
`wg-quick` is a convenient wrapper around many of the common functions in `wg`. You can turn off the wg0 interface with `wg-quick down wg0`
{{< /down >}}

2. Enable the Wireguard service to allow automatic restarts on boot:

      systemctl enable wg-quick@wg0

3.  Check if the VPN tunnel is running:

      wg show
      ifconfig wg0

## Wireguard Client

The process for setting up a client is essentially the same as the server. If your client uses Ubuntu, follow the instructions above. For other Linux distributions please refer to the [WireGuard docs](https://www.wireguard.com/install/) for installation instruction.

1.  Generate a key pair for the client if you have not already:

    umask 077
    wg genkey | tee privatekey | wg pubkey > publickey

2.  The only difference between the client and server is the contents of the configuration file:

  {{< file-excerpt "/etc/wireguard/wg0.conf" aconf >}}
[Interface]
PrivateKey = <Output of privatekey file that contains your private key>
Address = 192.168.2.2/24, fd86:ea04:1115::5/64
{{< /file-excerpt >}}

  Do not add

3. There are two ways to add peer information to WireGuard; this guide will demonstrate both methods. The first method is to directly edit the `wg0.conf` file with the server's information:

{{< file-excerpt "/etc/wireguard/wg0.conf" aconf >}}
[Peer]
PublicKey = <Server Public key>
Endpoint = <Server Public IP>:51820
AllowedIPs = 192.168.2.1/24, fd86:ea04:1115::1/64
{{< /file-excerpt >}}

  Use the server's public key, public IP address, and port.

3.  Enable the `wg` service:

      wg-quick up wg0
      systemctl enable wg-quick@wg0

## Connect the Client and Server

The second way of adding peer information is through the command line. This information will be added to the config file automatically (because of the SaveConfig option specified earlier).

1.  Run the following command from the server:

      wg set wg0 peer <Client Public Key> endpoint 45.79.84.214:51820 allowed-ips 192.168.2.2/24,fd86:ea04:1115::5/64

2.  Verify the connection:

      wg

3.  If the setup was successful, there will be a **Peer** section in the output of this command. This Peer section will be automatically added to `wg0.conf` when the service is restarted. If you would like to add this information to the config file immediately, you can run:

    wg-quick save wg0

4.  Additional clients can be added using the same procedure.

## Test the Connection

1. Return to the client and ping the server:

    ping 192.168.2.1
    wg

  The last two lines of the output of wg should be similar to:

    latest handshake: 1 minute, 17 seconds ago
    transfer: 98.86 KiB received, 43.08 KiB sent

2. Use the **ipify** service to check your external IP:

    curl 'https://api.ipify.org?format=json'

  The response from this `curl` request should match the public IP address of your server.


## Next steps

The set up process used in this guide can be extended to configure different network topologies.
