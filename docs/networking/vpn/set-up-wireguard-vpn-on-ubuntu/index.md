---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Wireguard encrypts your traffic quickly and safely, this guide will show you how to set up WireGuard VPN server and clients.'
og_description: 'This guide will show you how to install WireGuard, a fast and secure VPN, on Linode.'
keywords: ['wireguard','vpn']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-14
modified: 2019-01-22
modified_by:
  name: Linode
title: "Set Up WireGuard VPN on Ubuntu"
contributor:
  name: Sunit Nandi
  link:
---

![Set Up WireGuard VPN on Ubuntu](wireguard-vpn-ubuntu-title.jpg "Set Up WireGuard VPN on Ubuntu")

[WireGuard](https://www.wireguard.com) is a simple, fast, and modern VPN which utilizes state-of-the-art cryptography. It aims to be faster and leaner than other VPN protocols such as OpenVPN and IPSec, and has a much smaller source code footprint. WireGuard is still under development, but even in its unoptimized state it is faster than the popular OpenVPN protocol.

The WireGuard configuration is as simple to configure as SSH. A connection is established by an exchange of public keys between server and client, and only a client with its public key present in its server configuration file is allowed to connect. WireGuard sets up standard network interfaces (such as `wg0` and `wg1`), which behave much like the commonly found `eth0` interface. This makes it possible to configure and manage WireGuard interfaces using standard tools such as `ifconfig` and `ip`.

Currently, WireGuard is only available on Linux. This guide will configure a simple peer connection between a Linode running Ubuntu 18.04, and a client. The client can be either your local computer or another Linode.

{{< caution >}}
Do not use WireGuard for critical applications. The project is still undergoing security testing and is likely to receive frequent critical updates in the future.
{{< /caution >}}


## Before You Begin

- You will need root access to your Linode, or a user account with `sudo` privilege.
- Set your system's [hostname](/docs/getting-started/#setting-the-hostname).


## Install WireGuard

1.  Add the Wireguard repository to your sources list. Apt will then automatically update the package cache.

        sudo add-apt-repository ppa:wireguard/wireguard

1.  Install Wireguard. The `wireguard` package will install all necessary dependencies.

        sudo apt install wireguard

    DKMS will then build the Wireguard kernel module and if successful, you'll see the following output:

    {{< output >}}
wireguard:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/4.15.0-43-generic/updates/dkms/

depmod...................

DKMS: install completed.
Setting up wireguard (0.0.20181218-wg1~bionic) ...
Processing triggers for libc-bin (2.27-3ubuntu1) ...
{{< /output >}}

    {{< note >}}
If the installation completes but this output does not appear, your kernel is most likely not configured correctly (to double check, the output of `lsmod | grep wireguard` should not be blank). Refer to the previous section to troubleshoot.
{{< /note >}}

## Configure WireGuard Server

1.  Generate a private and public key pair for the WireGuard server:

        umask 077
        wg genkey | tee privatekey | wg pubkey > publickey

    This will save both the private and public keys to your home directory; they can be viewed with `cat privatekey` and `cat publickey` respectively.

1. Create the file `/etc/wireguard/wg0.conf` and add the following contents. You'll need to enter your server's private key in the `PrivateKey` field, and its IP addresses in the `Address` field.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Private Key>
Address = 203.0.113.5/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file >}}

    **Address** defines the private IPv4 and IPv6 addresses for the WireGuard server. Each peer in the VPN network should have a unique value for this field.

    **ListenPort** specifies which port WireGuard will use for incoming connections.

    **PostUp** and **PostDown** set steps which are run after the interface is turned on or off, respectively. In this case, `iptables` is used to set Linux IP masquerade rules to allow all the clients to share the server's IPv4 and IPv6 address, and clear the rules once the tunnel is down.

    **SaveConfig** tells the configuration file to automatically update whenever a new peer is added while the service is running.

## Set Up Firewall Rules

1.  Allow SSH connections and WireGuard's VPN port:

        sudo ufw allow 22/tcp
        sudo ufw allow 51820/udp
        sudo ufw enable

1.  Verify the settings:

        sudo ufw status verbose

## Start Wireguard Service

1. Start Wireguard:

        wg-quick up wg0

    {{< note >}}
`wg-quick` is a convenient wrapper around many of the common functions in `wg`. You can turn off the wg0 interface with `wg-quick down wg0`
{{< /note >}}

1. Enable the Wireguard service to automatically restart on boot:

        sudo systemctl enable wg-quick@wg0

1.  Check if the VPN tunnel is running using:

        sudo wg show
        ifconfig wg0

    Their outputs should look similar to below:

    {{< output >}}
user@ubuntu:~$ sudo wg show
interface: wg0
  public key: vD2blmqeKsV0OU0GCsGk7NmVth/+FLhLD1xdMX5Yu0I=
  private key: (hidden)
  listening port: 51820
{{< /output >}}

    {{< output >}}
user@ubuntu:~$ ifconfig wg0
wg0: flags=209<UP,POINTOPOINT,RUNNING,NOARP>  mtu 1420
        inet 203.0.113.5  netmask 255.255.255.0  destination 203.0.113.5
        inet6 fd86:ea04:1115::1  prefixlen 64  scopeid 0x0<global>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
{{< /output >}}


## Wireguard Client

The process for setting up a client is essentially the same as the server. If your client uses Ubuntu, follow the instructions above. See the [WireGuard docs](https://www.wireguard.com/install/) for instructions for other operating systems.

1.  Generate a key pair for the client if you have not already:

        umask 077
        wg genkey | tee privatekey | wg pubkey > publickey

1.  The only difference between the client and server is the contents of the configuration file--the client's `wg0.conf` must contain *its own* IP addresses.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Output of privatekey file that contains your private key>
Address = 203.0.123.12/24, fd86:ea04:1115::5/64
{{< /file >}}

## Connect the Client and Server

There are two ways to add peer information to WireGuard; this guide will demonstrate both methods.

1.  The first method is to directly edit the client's `wg0.conf` file with the server's public key, public IP address, and port:

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Peer]
PublicKey = <Server Public key>
Endpoint = <Server Public IP>:51820
AllowedIPs = 203.0.123.12/24, fd86:ea04:1115::5/64
{{< /file >}}

1.  Enable the `wg` service:

        wg-quick up wg0
        systemctl enable wg-quick@wg0

The second way of adding peer information is by the command line. This information will be added to the config file automatically because of the SaveConfig option specified earlier.

1.  Run the following command from the server. Replace the example IP addresses with those of the client:

        sudo wg set wg0 peer <Client Public Key> endpoint <Client IP address>:51820 allowed-ips 203.0.123.12/24,fd86:ea04:1115::5/64

1.  Verify the connection:

        sudo wg

    Regardless of which method you choose, there will be a **Peer** section in the output of this command if the setup was successful.

    {{< output >}}
user@localhost:~$ sudo wg
interface: wg0
  public key: vD2blmqeKsV0OU0GCsGk7NmVth/+FLhLD1xdMX5Yu0I=
  private key: (hidden)
  listening port: 51820

peer: iMT0RTu77sDVrX4RbXUgUBjaOqVeLYuQhwDSU+UI3G4=
  endpoint: 203.0.123.12:51820
  allowed ips: 203.0.123.12/24, fd86:ea04:1115::/64
{{< /output >}}

    This Peer section will be automatically added to `wg0.conf` when the service is restarted. If you would like to add this information immediately to the config file, you can run:

        wg-quick save wg0

    Additional clients can be added using the same procedure.

## Test the Connection

Return to the client and ping the server:

    ping 192.168.2.1
    sudo wg

The last two lines of the output of `wg` should be similar to:

    latest handshake: 1 minute, 17 seconds ago
    transfer: 98.86 KiB received, 43.08 KiB sent

This indicates that you now have a private connection between the server and client. You can also ping the client from the server to verify that the connection works both ways.


## Next steps

The process used in this guide can be extended to configure network topologies. As mentioned previously, Wireguard is an evolving technology. If you use WireGuard, you should monitor the [official documentation](https://www.wireguard.com/) and [todo list](https://www.wireguard.com/todo/) for critical updates and new/upcoming features.
