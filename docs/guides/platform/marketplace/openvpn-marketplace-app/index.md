---
slug: openvpn-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy an OpenVPN Server on Linode with Marketplace Apps."
keywords: ['vpn','openvpn','tunnel','marketplace app']
tags: ["ssl","cloud-manager","linode platform","security","marketplace","vpn"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-05
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying OpenVPN through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[OpenVPN Community Resources](https://openvpn.net/community-resources/)'
aliases: ['/platform/marketplace/marketplace-openvpn/', '/platform/one-click/one-click-openvpn/','/guides/marketplace-openvpn/','/guides/deploying-openvpn-marketplace-app/']
---

OpenVPN is a widely trusted, free, and open-source VPN (virtual private network) application that creates encrypted tunnels for secure data transfer between computers that are not on the same local network. Your traffic is encrypted by OpenVPN using [OpenSSL](https://www.openssl.org/). You can use OpenVPN to:

- Connect your computer to the public Internet through a dedicated OpenVPN server. By encrypting your traffic and routing it through an OpenVPN server that you control, you can protect yourself from network attacks when using public Wi-Fi.

- Connect your computer to services that you don't want to expose to the public Internet. Keep your sensitive applications isolated on your servers' private networking and use OpenVPN to access them remotely.

## Deploying the OpenVPN Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

### OpenVPN Options

| **Field** | **Description** |
|:--------------|:------------|
| **VPN Password** | The password you'll use when connecting to your VPN. *Required*. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used, though consider the amount of traffic needed for the VPN and select a plan with enough *Outbound Network Transfer* to handle the expected traffic.

## Getting Started After Deployment

Your VPN's administrative web interface will be available via a web browser at `https://192.0.2.2:943/admin/`, where `192.0.2.2` represents the IPv4 address of your new Linode instance. Your IPv4 address can be found under the **Networking** tab on your new Linode's detail page.

The client web interface for your VPN is located at `https://192.0.2.2:943/`, where your Linode's IP address should take the place of the `192.0.2.2` example address. The client interface includes links to download the OpenVPN client software for your computer.
{{< note >}}
The OpenVPN Access Server does not come with an HTTP (insecure) web server daemon. Hence, it is important that you use `https` in the address. If you use `http` in the address, the server does not respond.
{{< /note >}}

The username you should use to log in to your OpenVPN server is `openvpn`. The password for connecting to the VPN is the password you supplied in the Marketplace App creation form.

### Open a Connection to your VPN

To open a connection to your OpenVPN server from your computer, you'll need to install the OpenVPN client software. Follow the instructions in the [Client Software Installation](/docs/networking/vpn/install-openvpn-access-server-on-linux/#client-software-installation) section of our [OpenVPN](/docs/networking/vpn/install-openvpn-access-server-on-linux/#client-software-installation) guide for a detailed explanation of how to install and use this software.

## Software Included

| **Software** | **Description** |
|--------------|-----------------|
| [**OpenVPN Access Server**](https://openvpn.net/vpn-server/) | VPN server software. |

{{< content "marketplace-update-note-shortguide">}}
