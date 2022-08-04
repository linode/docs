---
slug: set-up-wireguard-vpn-on-ubuntu
author:
  name: Linode Community
  email: docs@linode.com
description: 'Wireguard encrypts your traffic quickly and safely, this guide will show you how to set up WireGuard VPN server and clients.'
og_description: 'This guide will show you how to install WireGuard, a fast and secure VPN, on Linode.'
keywords: ['wireguard','vpn', 'ubuntu']
bundles: ['network-security']
tags: ["ubuntu","networking","security","vpn"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-14
modified: 2019-01-22
modified_by:
  name: Linode
title: "Set Up WireGuard VPN on Ubuntu"
contributor:
  name: Sunit Nandi
relations:
    platform:
        key: setup-wireguard-vpn
        keywords:
            - distribution: Ubuntu 18.04
aliases: ['/networking/vpn/set-up-wireguard-vpn-on-ubuntu/']
---

[WireGuard](https://www.wireguard.com)&#174; is a simple, fast, and secure VPN that utilizes state-of-the-art cryptography. With a small source code footprint, it aims to be faster and leaner than other VPN protocols such as OpenVPN and IPSec. WireGuard is still under development, but even in its unoptimized state it is faster than the popular OpenVPN protocol.

The WireGuard configuration is as simple as setting up SSH. A connection is established by an exchange of public keys between server and client. Only a client that has its public key in its corresponding server configuration file is allowed to connect. WireGuard sets up standard network interfaces (such as `wg0` and `wg1`), which behave much like the commonly found `eth0` interface. This makes it possible to configure and manage WireGuard interfaces using standard tools such as `ifconfig` and `ip`.

This guide will configure a simple peer connection between a Linode running Ubuntu 18.04, and a client. The client can be either your local computer or another Linode.

{{< caution >}}
Do not use WireGuard for critical applications. The project is still undergoing security testing and is likely to receive frequent critical updates in the future.
{{< /caution >}}

## Before You Begin

- You will need root access to your Linode, or a user account with `sudo` privilege.
- Set your system's [hostname](/docs/guides/set-up-and-secure/#configure-a-custom-hostname).

{{< note >}}
The `GRUB 2` kernel is required for this guide. All distributions for all new Linodes now boot with the `GRUB 2` kernel by default. However, if you are running an older distribution, you will need to check to see which kernel you are running. You can use the [Update Kernel Guide](/docs/guides/managing-the-kernel-on-a-linode/) to check your kernel version and change it using the Cloud Manager. Select `GRUB 2` from the *Boot Settings: Select a Kernel* dropdown menu in Step 4 of [Update Your Linode Kernel with Linode's Cloud Manager](/docs/guides/managing-the-kernel-on-a-linode/#update-your-linode-kernel-with-linode-s-cloud-manager).
{{< /note >}}

## Install WireGuard

1.  Add the Wireguard repository to your sources list. Apt will then automatically update the package cache.

        echo "deb http://deb.debian.org/debian/ unstable main" > /etc/apt/sources.list.d/unstable-wireguard.list
        printf 'Package: *\nPin: release a=unstable\nPin-Priority: 150\n' > /etc/apt/preferences.d/limit-unstable

1.  Ubuntu 18.04 ships with Linux kernel 4.15, so you need to install the hardware-enablement kernel first (HWE), which installs kernel 5.4 on your system.

       sudo apt update
       sudo apt install linux-generic-hwe-18.04-edge

1.  Restart the Ubuntu server and install WireGuard. Update the packages and install WireGuard and WireGuard tools. DKMS (Dynamic Kernel Module Support) will build the WireGuard kernel module.

        sudo shutdown -r now
        sudo apt install wireguard-dkms wireguard-tools


    DKMS will then build the Wireguard kernel module. If successful, you'll see the following output:

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
If the installation completes but the output does not appear, your kernel is most likely not configured correctly. To double check, issue the `lsmod | grep wireguard` command. Its output should not be blank. Refer to the previous section to troubleshoot.
{{< /note >}}

## Configure WireGuard Server

1.  Generate a private and public key pair for the WireGuard server:

        umask 077
        wg genkey | tee privatekey | wg pubkey > publickey

    This will save both the private and public keys to your home directory; they can be viewed with `cat privatekey` and `cat publickey` respectively.

1. Create the file `/etc/wireguard/wg0.conf` and add the contents indicated below. You'll need to enter your server's private key in the `PrivateKey` field, and its IP addresses in the `Address` field.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Private Key>
Address = 10.0.0.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file >}}

    - **Address** defines the private IPv4 and IPv6 addresses for the WireGuard server. Each peer in the VPN network should have a unique value for this field.

    - **ListenPort** specifies which port WireGuard will use for incoming connections.

    - **PostUp** and **PostDown** defines steps to be run after the interface is turned on or off, respectively. In this case, `iptables` is used to set Linux IP masquerade rules to allow all the clients to share the server's IPv4 and IPv6 address. The rules will then be cleared once the tunnel is down.

    - **SaveConfig** tells the configuration file to automatically update whenever a new peer is added while the service is running.

## Set Up Firewall Rules

1.  Allow SSH connections and WireGuard's VPN port:

        sudo ufw allow 22/tcp
        sudo ufw allow 51820/udp
        sudo ufw enable

1.  Verify the settings:

        sudo ufw status verbose

## Start the Wireguard Service

1. Start Wireguard:

        wg-quick up wg0

    {{< note >}}
`wg-quick` is a convenient wrapper for many of the common functions in `wg`. You can turn off the wg0 interface with `wg-quick down wg0`
{{< /note >}}

1. Enable the Wireguard service to automatically restart on boot:

        sudo systemctl enable wg-quick@wg0

1.  Check if the VPN tunnel is running with the following two commands:

        sudo wg show

    You should see a similar output:

      {{< output >}}
user@ubuntu:~$ sudo wg show
interface: wg0
  public key: vD2blmqeKsV0OU0GCsGk7NmVth/+FLhLD1xdMX5Yu0I=
  private key: (hidden)
  listening port: 51820
{{< /output >}}

        ifconfig wg0

    Your output should resemble the following:

    {{< output >}}
user@ubuntu:~$ ifconfig wg0
wg0: flags=209<UP,POINTOPOINT,RUNNING,NOARP>  mtu 1420
        inet 10.0.0.1 netmask 255.255.255.0  destination 10.0.0.1
        inet6 fd86:ea04:1115::1  prefixlen 64  scopeid 0x0<global>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
{{< /output >}}


## Wireguard Client

The process for setting up a client is similar to setting up the server. When using Ubuntu as your client's operating system, the only difference between the client and the server is the contents of the configuration file. If your client uses Ubuntu, follow the steps provided in the above sections and in this section. For installation instructions on other operating systems, see the [WireGuard docs](https://www.wireguard.com/install/).

{{< note >}}
You also need to install the `openresolv` package on the client to configure DNS server `sudo apt install openresolv`.
{{< /note >}}


1.  Generate a key pair for the client if you have not already:

        umask 077
        wg genkey | tee privatekey | wg pubkey > publickey

1.  The main difference between the client and the server's configuration file, `wg0.conf`, is it must contain *its own* IP addresses and does not contain the `ListenPort`, `PostUP`, `PostDown`, and `SaveConfig` values.

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Interface]
PrivateKey = <Output of privatekey file that contains your private key>
Address = 10.0.0.2/24, fd86:ea04:1115::5/64
{{< /file >}}

## Connect the Client and Server

There are two ways to add peer information to WireGuard; this guide demonstrates both methods.

{{< note >}}
Stop the interface with `sudo wg-quick down wg0` on both the client and the server.
{{< /note >}}

### Method 1

1.  The first method is to directly edit the client's `wg0.conf` file with the server's public key, public IP address, and port:

    {{< file "/etc/wireguard/wg0.conf" conf >}}
[Peer]
PublicKey = <Server Public key>
Endpoint = <Server Public IP>:51820
AllowedIPs = 10.0.0.2/24, fd86:ea04:1115::5/64
{{< /file >}}

1.  Enable the `wg` service on both the client and server:

        wg-quick up wg0
        systemctl enable wg-quick@wg0

### Method 2

1.  The second way of adding peer information is using the command line. This information will be added to the config file automatically because of the `SaveConfig` option specified in the Wireguard server's configuration file.

    Run the following command from the server. Replace the example IP addresses with those of the client:

        sudo wg set wg0 peer <Client Public Key> endpoint <Client IP address>:51820 allowed-ips 203.0.113.12/24,fd86:ea04:1115::5/64

1.  Verify the connection. This command can be run from the client or the server:

        sudo wg

    Regardless of which method you choose to add peer information to WireGuard, there should be a **Peer** section in the output of the `sudo wg` command if the setup was successful.

    {{< output >}}
user@localhost:~$ sudo wg
interface: wg0
  public key: vD2blmqeKsV0OU0GCsGk7NmVth/+FLhLD1xdMX5Yu0I=
  private key: (hidden)
  listening port: 51820

peer: iMT0RTu77sDVrX4RbXUgUBjaOqVeLYuQhwDSU+UI3G4=
  endpoint: 10.0.0.2:51820
  allowed ips: 10.0.0.2/24, fd86:ea04:1115::/64
{{< /output >}}

    This Peer section will be automatically added to `wg0.conf` when the service is restarted. If you would like to add this information immediately to the config file, you can run:

        wg-quick save wg0

    Additional clients can be added using the same procedure.

## Test the Connection

1. Return to the client and ping the server:

        ping 10.0.0.1
        sudo wg

    The last two lines of the output from running the `wg` command should be similar to:

      {{< output >}}
    latest handshake: 1 minute, 17 seconds ago
    transfer: 98.86 KiB received, 43.08 KiB sent
        {{</ output >}}

    This indicates that you now have a private connection between the server and client. You can also ping the client from the server to verify that the connection works both ways.


## Next steps

The process used in this guide can be extended to configure network topologies. As mentioned previously, Wireguard is an evolving technology. If you use WireGuard, you should monitor the [official documentation](https://www.wireguard.com/) and [todo list](https://www.wireguard.com/todo/) for critical updates and new/upcoming features.

"WireGuard" is a registered trademark of Jason A. Donenfeld.
