---
slug: set-up-wireguard-vpn-on-debian
author:
  name: Linode Community
  email: docs@linode.com
description: 'WireGuard encrypts your traffic quickly and safely. This guide will show you how to set up a Wireguard VPN server and client on Debian.'
og_description: 'This guide will show you how to install WireGuard, a fast and secure VPN, on Linode.'
keywords: ['wireguard','vpn','debian']
tags: ["networking","security","vpn","debian"]
bundles: ['network-security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-08
modified: 2021-10-15
modified_by:
  name: Linode
title: "Set Up WireGuard VPN on Debian"
contributor:
  name: Linode
relations:
    platform:
        key: setup-wireguard-vpn
        keywords:
            - distribution: Debian 9
aliases: ['/networking/vpn/set-up-wireguard-vpn-on-debian/']
---

## What is WireGuard?

[WireGuard](https://www.wireguard.com)&#174; is a simple, fast, and secure VPN that utilizes state-of-the-art cryptography. With a small source code footprint, it aims to be faster and leaner than other VPN protocols such as [OpenVPN](https://en.wikipedia.org/wiki/OpenVPN) and [IPSec](https://en.wikipedia.org/wiki/IPsec). WireGuard is still under development, but even in its unoptimized state it is faster than the popular OpenVPN protocol.

WireGuard sets up standard network interfaces (such as `wg0` and `wg1`), which behave much like the commonly found `eth0` interface. This makes it possible to configure and manage WireGuard interfaces using standard tools such as [`ifconfig`](https://en.wikipedia.org/wiki/Ifconfig) and `ip`. Currently, WireGuard is only available on Linux.

Configuring WireGuard is as simple as setting up SSH. A connection is established by an exchange of public keys between server and client. Only a client that has its public key in its corresponding server configuration file is allowed to connect. A WireGuard server's configuration file resembles the following example:

  {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Private Key>
Address = 10.0.0.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true

[Peer]
PublicKey = <Client Public Key>
AllowedIPs = 10.0.0.2/24, fd86:ea04:1115::0/64
  {{< /file >}}

In this guide you will learn how to:

* [Configure a WireGuard server](#configure-wireguard-server) on a Linode running Debian 9.
* [Configure a WireGuard client](#configure-wireguard-client) on your local computer or another Linode.
* [Establish a simple peer connection](#connect-the-client-and-server) between your WireGuard server and client.

{{< caution >}}
Do not use WireGuard for critical applications. The project is still undergoing security testing and is likely to receive frequent major updates in the future.
{{< /caution >}}

## Before You Begin

- [Deploy a Linode](/docs/guides/creating-a-compute-instance/) running Debian 9.
- [Add a limited user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account) with `sudo` privileges to your Linode.
- Set your system's [hostname](/docs/guides/set-up-and-secure/#configure-a-custom-hostname).

{{< note >}}
The `GRUB 2` kernel is required for this guide. All distributions for all new Linodes now boot with the `GRUB 2` kernel by default. However, if you are running an older distribution, you will need to check to see which kernel you are running. You can use the [Update Kernel Guide](/docs/guides/managing-the-kernel-on-a-linode/) to check your kernel version and change it using the Cloud Manager. Select `GRUB 2` from the *Boot Settings: Select a Kernel* dropdown menu in Step 4 of [Update Your Linode Kernel with Linode's Cloud Manager](/docs/guides/managing-the-kernel-on-a-linode/#update-your-linode-kernel-with-linode-s-cloud-manager).
{{< /note >}}

## Install WireGuard

1.  Add the WireGuard repository to your sources list. Apt will automatically update the package cache.

        echo "deb http://deb.debian.org/debian/ unstable main" > /etc/apt/sources.list.d/unstable-wireguard.list
        printf 'Package: *\nPin: release a=unstable\nPin-Priority: 150\n' > /etc/apt/preferences.d/limit-unstable

1.  Update your packages and install WireGuard and WireGuard tools. DKMS (Dynamic Kernel Module Support) will build the WireGuard kernel module.

        apt update
        apt install wireguard-dkms wireguard-tools

    If successful, you'll see the following output:

    {{< output >}}
wireguard:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/4.9.0-9-amd64/updates/dkms/

depmod...

DKMS: install completed.
Processing triggers for libc-bin (2.24-11+deb9u4) ...
{{< /output >}}

## Configure WireGuard Server

1.  Navigate to the `/etc/wireguard` directory and generate a private and public key pair for the WireGuard server:

        sudo umask 077
        sudo wg genkey | tee privatekey | wg pubkey > publickey

    This will save both the private and public keys; they can be viewed with `cat privatekey` and `cat publickey` respectively.

1.  Create the file `/etc/wireguard/wg0.conf` and add the contents indicated below. You'll need to enter your server's private key in the `PrivateKey` field, and its private IP addresses in the `Address` field. Refer to the list below the example for more details.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Private Key>
Address = 10.0.0.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file >}}

   - **PrivateKey** the server's private key generated in above.

   - **Address** defines the private IPv4 and IPv6 addresses for the WireGuard server. Each peer in the VPN network should have a unique value for this field. Typical values are `10.0.0.1/24`, `192.168.1.1/24`, or `192.168.2.1/24`. This is not the same as a private IP address that Linode can assign to your Linode instance.

   - **ListenPort** specifies which port WireGuard will use for incoming connections. The default is `51820`. What you set here you will need to reference in your firewall settings later.

   - **PostUp** and **PostDown** defines steps to be run after the interface is turned on or off, respectively. In this case, `iptables` is used to set Linux IP masquerade rules to allow all the clients to share the server's IPv4 and IPv6 address. The rules will then be cleared once the tunnel is down.

   - **SaveConfig** tells the configuration file to automatically update whenever a new peer is added while the service is running.

### Set Up Firewall Rules

1.  Install UFW:

        sudo apt-get install ufw

1.  Allow SSH connections and WireGuard's VPN port:

        sudo ufw allow 22/tcp
        sudo ufw allow 51820/udp
        sudo ufw enable

1.  Verify the settings:

        sudo ufw status verbose


### Start the WireGuard Service

1.  Start WireGuard:

        sudo wg-quick up wg0

    {{< note >}}
`wg-quick` is a convenient wrapper for many of the common functions in `wg`. You can turn off the wg0 interface with `wg-quick down wg0`
{{< /note >}}

1.  Enable the WireGuard service to automatically restart on boot:

        sudo systemctl enable wg-quick@wg0

1.  Check if the VPN tunnel is running with the following two commands:

        sudo wg show

    You should see a similar output:

    {{< output >}}
user@debian:/# wg show
interface: wg0
  public key: Nrl2nVQxSwrKrvz6jQcrsziuVRPWT9N1Q8/yaQkAXUg=
  private key: (hidden)
  listening port: 51820
{{< /output >}}

    You may need to install [net-tools](https://tracker.debian.org/pkg/net-tools) to run `ifconfig`. Use `sudo apt-get install net-tools` if needed.

        sudo ifconfig wg0

    Your output should resemble the following:

    {{< output >}}
user@debian:/# ifconfig wg0
wg0: flags=209<UP,POINTOPOINT,RUNNING,NOARP>  mtu 1420
        inet 10.0.0.1  netmask 255.255.255.0  destination 10.0.0.1
        inet6 fd86:ea04:1115::1  prefixlen 64  scopeid 0x0<global>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
{{< /output >}}


## Configure WireGuard Client

The process for setting up a client is similar to setting up the WireGuard server. When using Debian as your client's operating system, the only difference between the client and the server is the configuration file. In this section, you will configure a WireGuard client on Debian 9.

{{< note >}}
For installation instructions on other operating systems, see the [WireGuard docs](https://www.wireguard.com/install/).
{{</ note >}}

1. Follow the steps in the [Install WireGuard](#install-wireguard) section of the guide.

1. Once you have installed WireGuard, follow the steps in the [Configure WireGuard Server](#configure-wireguard-server) section. Replace the example configuration file with the example file below.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Client Private Key>
Address = 10.0.0.2/24, fd86:ea04:1115::5/64
    {{< /file >}}

    The difference between the client and the server's configuration file, `wg0.conf`, is it contains **its own** IP addresses and does not contain the `ListenPort`, `PostUP`, `PostDown`, or `SaveConfig` values.


1. [Set up Firewall rules](#set-up-firewall-rules) on your WireGuard client.

1. [Start the WireGuard Service](#start-the-wireguard-service).

## Connect the Client and Server

1.  Stop the interface with `sudo wg-quick down wg0` on both the client and the server.

1.  Edit the `wg0.conf` file on the client to add the server's public key, public IP address, port, and allowed IPs.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Peer]
PublicKey = <Server Public key>
Endpoint = <Server Public IP>:51820
AllowedIPs = 10.0.0.1/24, fd86:ea04:1115::1/64
{{< /file >}}

1.  Edit the `wg0.conf` file on the server to add the client's public key and allowed IPs.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Peer]
PublicKey = <Client Public Key>
AllowedIPs = 10.0.0.2/24, fd86:ea04:1115::5/64
{{< /file >}}

1.  Restart the `wg` service on both the server and the client:

        sudo wg-quick up wg0

1.  You can also add peers to the server from the command line. This information will be added to the config file automatically because of the `SaveConfig` option specified in the `wg0.conf` file.

    Run the following command from the server. Replace the example IP addresses with those of the client:

        sudo wg set wg0 peer <Client Public Key> allowed-ips 10.0.0.2/24,fd86:ea04:1115::5/64

1.  Verify the connection. The following command can be run from both the client or the server:

        sudo wg

    Regardless of which method you choose to add peer information to WireGuard, the **Peer** section appears in the output of the `sudo wg` command if the setup was successful.

    {{< output >}}
user@debian:/# sudo wg
interface: wg0
  public key: vD2blmqeKsV0OU0GCsGk7NmVth/+FLhLD1xdMX5Yu0I=
  private key: (hidden)
  listening port: 51820

peer: iMT0RTu77sDVrX4RbXUgUBjaOqVeLYuQhwDSU+UI3G4=
  endpoint: 10.0.0.2:51820
  allowed ips: 10.0.0.2/24, fd86:ea04:1115::/64
{{< /output >}}

    This Peer section will be automatically added to `wg0.conf` when the service is restarted. If you would like to add this information immediately to the config file, you can run:

        sudo wg-quick save wg0

    Additional clients can be added using the same procedure.

### Test the Connection

1.  Return to the client and ping the server:

        ping 10.0.0.1

1.  Once you've successfully established the ability to ping the server from the client, run the following command:

        sudo wg

    The last two lines of the output from running the `wg` command should be similar to:

      {{< output >}}
    latest handshake: 1 minute, 17 seconds ago
    transfer: 98.86 KiB received, 43.08 KiB sent
        {{</ output >}}

    This indicates that you now have a private connection between the server and client. If you did not successfully ping the server from the client you will not see these lines. You can also ping the client from the server to verify that the connection works both ways.


## Next steps

The process used in this guide can be extended to configure network topologies. As mentioned previously, WireGuard is an evolving technology. If you use WireGuard, you should monitor the [official documentation](https://www.wireguard.com/) and [todo list](https://www.wireguard.com/todo/) for critical updates and new/upcoming features.

"WireGuard" is a registered trademark of Jason A. Donenfeld.
