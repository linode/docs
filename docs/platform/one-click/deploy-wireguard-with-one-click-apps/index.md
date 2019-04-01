---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a WireGuard Server on Linode with One-Click Apps.'
keywords: ['vpn','wireguard','tunnel']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-28
modified: 2019-03-28
modified_by:
  name: Linode
title: "Deploy WireGuard with One-Click Apps"
contributor:
  name: Linode
external_resources:
- '[WireGuard Quick Start](https://www.wireguard.com/quickstart/)'
---
## WireGuard One-Click App

WireGuard is a simple, fast, and modern virtual private network (VPN) which utilizes state-of-the-art cryptography. It aims to be faster and leaner than other VPN protocols such as OpenVPN and IPSec, with its much smaller source code footprint.

Configuring WireGuard is as simple as configuring SSH. A connection is established by an exchange of public keys between server and client, and only a client whose public key is present in the server's configuration file is considered authorized. WireGuard sets up standard network interfaces which behave similarly to other common network interfaces, like `eth0`. This makes it possible to configure and manage WireGuard interfaces using standard networking tools such as ifconfig and ip.

## Deploy WireGuard with One-Click Apps

{{< content deploy-one-click-apps >}}

### WireGuard Options

{{< note >}}
We recommend that you have your WireGuard client's public key available before deploying a WireGuard server. If you deploy a WireGuard server without your client's public key, you will need to [connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh) and manually update and enable the `wg0.conf` file. For details on manually configuring your WireGuard server's configuration file, see the [Configure Wiregard Server](/docs/networking/vpn/set-up-wireguard-vpn-on-ubuntu/#configure-wireguard-server) section of our WireGuard guide.
{{</ note >}}

| **Field** | **Description** |
|:--------------|:------------|
| **SSH Key** | Your SSH public key. *Advanced Configuration*. |
| **Port** | Set your WireGuard server's listening port number. The default is: `51820`. *Advanced Configuration*. |
| **Private IP** | Your WireGuard server's private IP address and subnet in CIDR notation. The default is: `192.0.2.0/24`. *Advanced Configuration*. |
| **Public Key (Client)** | Your WireGuard client's public key. *Advanced Configuration* |
| **Private IP (Client)** | Your WireGuard client's private IP address and subnet in CIDR notation. The default is: `192.0.2.1/24`. *Advanced Configuration* |

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by WireGuard One-Click Apps, and it is pre-selected on the Linode creation page.. *Required* |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*.* |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). You can use any size Linode for your WireGuard App. The Linode plan that you select should be appropriate for the amount of data transfer, users, and other stress that may affect the performance of your VPN. You can create your VPN on a Nanode 1GB or a Linode 2GB with low risk for performance hits, unless you expect intensive data transfer to happen on your VPN. *Required* |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required* |

When you've provided all required Linode Options, click on the **Create** button. **Your WireGuard app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

### Getting Started After Deployment

#### Test Your WireGuard Client's Connection

This test should be performed once you have configured a WireGuard client and updated your WireGuard server to include the client's peer information. See the [WireGuard client](/docs/networking/vpn/set-up-wireguard-vpn-on-ubuntu/#wireguard-client) section of our WireGuard guide for more information on setting up a client.

1. Access your WireGuard client and ping the WireGuard server. Replace `192.0.2.0` with your WireGuard server's public IP address:

        ping 192.0.2.0

1. Use the WireGuard utility to verify your client's latest handshake:

        wg show

    The last two lines of the output from running the wg command should be similar to:

    {{< output >}}
latest handshake: 1 minute, 17 seconds ago
transfer: 98.86 KiB received, 43.08 KiB sent
    {{</ output >}}

#### Update the WireGuard Server's Configuration File

The location of your WireGuard configuration file is `/etc/wireguard/wg0.conf`. To update the values in this file:

1. [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh).

1. Bring down the `wg0` interface:

        wg-quick down wg0

1. Open the `/etc/wireguard/wg0.conf` file and update as needed. Save your changes when done.

1. Bring the `wg0` interface back up:

        wg-quick up wg0

    {{< note >}}
  `wg-quick` is a convenient wrapper for many of the common functions in `wg`. To learn more about all the available commands for each utility, issue the `wg --help` and `wg-quick --help` commands from your Linode's command line.
    {{</ note >}}


### Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **WireGuard** | VPN software |
| **UFW (UncomplicatedFireWall** | Firewall utility. The Port assigned during the [WireGuard Options](#wireguard-options) step of the deployment will allow outgoing and incoming traffic. |
