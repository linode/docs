---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Wireguard encrypts your traffic quickly and safely, this guide will show you how to set up WireGuard VPN server and clients.'
og_description: 'This guide will show you how to install WireGuard, a fast and secure VPN, on Linode.'
keywords: ['wireguard','vpn']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-14
modified: 2017-11-14
modified_by:
  name: Linode
title: "Set Up WireGuard VPN on Ubuntu"
contributor:
  name: Sunit Nandi
  link:
---


[WireGuard](https://www.wireguard.com) is a simple, fast, and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster and leaner than other VPN protocols such as OpenVPN and IPSec, and has a much smaller source code footprint. WireGuard is still under development, but even in its unoptimized state it is faster than the popular OpenVPN protocol and delivers lower ping times in comparison.

WireGuard aims to be as simple to configure as SSH. A connection is established by an exchange of public keys between server and client just like SSH keys and only a client with its public key present in its server configuration file is considered authorized. WireGuard sets up standard network interfaces (such as `wg0` and `wg1`), which behave much like the commonly found `eth0` interface. This makes it possible to configure and manage WireGuard interfaces using standard tools such as `ifconfig` and `ip`.

WireGuard is currently only available on Linux. This guide will configure a simple peer connection between a server, which will be a Linode running Ubuntu 16.04, and a client. The client can be either your local computer or another Linode.

{{< caution >}}
Do not use WireGuard for critical applications. The project is still undergoing security testing and is likely to receive frequent critical updates in the future.
{{< /caution >}}

## Update Kernel

Wireguard requires using Ubuntu's kernel rather than the Linode kernel. Follow these steps after creating your Linode:

1.  In the Linode Manager, open the configuration profile for your Linode and find the **Boot Settings** section. Select **GRUB 2** as your kernel.

    ![Configuration Profile](/docs/assets/wireguard/wireguard-config.png)

2.  Boot your Linode, then connect to it with SSH and complete the standard setup procedure in our [Getting Started](/docs/getting-started) guide.

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
  {{< note >}}
If the installation completes but this output does not appear, your kernel is most likely not configured correctly (to double check, the output of `lsmod | grep wireguard` should not be blank). Refer to the previous section to troubleshoot.
{{< /note >}}

## Configure WireGuard Server

1.  Generate a private and public key pair for the WireGuard server:

        umask 077
        wg genkey | tee privatekey | wg pubkey > publickey

    This will save both the private and public keys to your home directory; they can be viewed with `cat privatekey` and `cat publickey` respectively.

2. Open `/etc/wireguard/wg0.conf` in a text editor and add the following content, replacing `<Private Key>` with the generated private key:

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Private Key>
Address = 192.168.2.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file >}}

    **Address** defines the private IPv4 and IPv6 addresses for the WireGuard server. Each peer in the VPN network should have a unique value for this field. This guide will use the 192.168.2.0/24 address block for IPv4 and the fd86:ea04:1115::0/64 block for IPv6.

    **ListenPort** specifies the port that WireGuard will use for incoming connections.

    **PostUp** and **PostDown** set steps to be run after the interface is turned on or off, respectively. In this case, `iptables` is used to set Linux IP Masquerade rules to allow all the clients to share the server's Internet IPv4 and IPv6 address, and clear the rules once the tunnel is down.

    **SaveConfig** tells the config file to automatically update whenever a new peer is added while the service is running.

## Set Up Firewall Rules

1.  Allow SSH connections and WireGuard's VPN port:

        ufw allow 51820/udp
        ufw allow 22/tcp
        ufw enable

2.  Verify the settings:

        ufw status verbose

## Start Wireguard Service

1. Start Wireguard:

        wg-quick up wg0

    {{< note >}}
`wg-quick` is a convenient wrapper around many of the common functions in `wg`. You can turn off the wg0 interface with `wg-quick down wg0`
{{< /note >}}

2. Enable the Wireguard service to automatically restart on boot:

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

    {{< file-excerpt "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Output of privatekey file that contains your private key>
Address = 192.168.2.2/24, fd86:ea04:1115::5/64
{{< /file-excerpt >}}

## Connect the Client and Server

There are two ways to add peer information to WireGuard; this guide will demonstrate both methods.

1.  The first method is to directly edit the client's `wg0.conf` file with the server's information:

    {{< file-excerpt "/etc/wireguard/wg0.conf" conf >}}
[Peer]
PublicKey = <Server Public key>
Endpoint = <Server Public IP>:51820
AllowedIPs = 192.168.2.1/24, fd86:ea04:1115::1/64
{{< /file-excerpt >}}

    Use the server's public key, public IP address, and port.

3.  Enable the `wg` service:

        wg-quick up wg0
        systemctl enable wg-quick@wg0

The second way of adding peer information is through the command line. This information will be added to the config file automatically because of the SaveConfig option specified earlier.

1.  Run the following command from the server:

        wg set wg0 peer <Client Public Key> endpoint <Client IP address>:51820 allowed-ips 192.168.2.2/24,fd86:ea04:1115::5/64

2.  Verify the connection:

        wg

Regardless of which method above you chose, there will be a **Peer** section in the output of this command if the setup was successful. This Peer section will be automatically added to `wg0.conf` when the service is restarted. If you would like to add this information to the config file immediately, you can run:

    wg-quick save wg0

Additional clients can be added using the same procedure.

## Test the Connection

Return to the client and ping the server:

    ping 192.168.2.1
    wg

The last two lines of the output of wg should be similar to:

    latest handshake: 1 minute, 17 seconds ago
    transfer: 98.86 KiB received, 43.08 KiB sent

This indicates that you now have a private connection between the server and client. You can also ping the client from the server to verify that the connection works both ways.


## Next steps

The process used in this guide can be extended to configure network topologies. You can also use the link in the More Information section below to experiment with setting up port forwarding, so that all of your client traffic will be routed through the server.

As mentioned previously, Wireguard is an evolving technology. If you use WireGuard, you should monitor the [official documentation](https://www.wireguard.com/) and [todo list](https://www.wireguard.com/todo/) for critical updates and new/upcoming features.
