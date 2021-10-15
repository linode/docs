---
slug: shadowsocks-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy a Shadowsocks Server on Linode using Marketplace Apps."
keywords: ['shadowsocks','marketplace', 'server']
tags: ["proxy","cloud-manager","linode platform","security","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-18
modified: 2021-09-16
image: DeployShadowsocksServer_oneclickapps.png
modified_by:
  name: Linode
title: "Deploying Shadowsocks through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Shadowsocks Official](https://shadowsocks.org)'
- '[Shadowsocks-libev Github](https://github.com/shadowsocks/shadowsocks-libev)'
image: 'How_to_Deploy_a_Shadowsocks_Server_with_OneClick_Apps_1200x631.png'
aliases: ['/platform/marketplace/deploy-shadowsocks-with-marketplace-apps/', '/platform/one-click/deploy-shadowsocks-with-one-click-apps/','/guides/deploy-shadowsocks-with-marketplace-apps/']
---

Shadowsocks is a lightweight SOCKS5 web proxy tool primarily utilized to bypass network censorship and blocking on certain websites and web protocols. A full setup requires a Linode server to host the Shadowsocks daemon, and a client installed on PC, Mac, Linux, or a mobile device. Unlike other proxy software, Shadowsocks traffic is designed to be both indiscernible from other traffic to third-party monitoring tools, and also able to disguise itself as a normal direct connection. Data passing through Shadowsocks is encrypted for additional security and privacy.

## Deploying the Shadowsocks Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 1-3 minutes after the Linode has finished provisioning.**

## Configuration Options

### Shadowsocks Options

The Shadowsocks proxy requires a separate `Shadowsocks Password` to authenticate to the service from your client. Enter a unique password into `Shadowsock Password` field to be used in a later step.

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 9
- **Recommended minimum plan:** All plan types and sizes can be used, though consider the amount of traffic needed for the VPN and select a plan with enough *Outbound Network Transfer* to handle the expected traffic.

## Getting Started after Deployment

Once the Shadowsocks server is up and running, you must install the [Shadowsocks Client](https://shadowsocks.org/en/download/clients.html) on any device or devices that you'd like to have connect to the service. There are currently client services available for [Windows](https://github.com/shadowsocks/shadowsocks-windows/releases), [Mac OS X](https://github.com/Jigsaw-Code/outline-client/), [Linux](https://github.com/Jigsaw-Code/outline-client/), [Android](https://play.google.com/store/apps/details?id=com.github.shadowsocks), and [iOS](http://apt.thebigboss.org/onepackage.php?bundleid=com.linusyang.shadowsocks).

For a full set of instructions on how to install Shadowsocks on Windows and Mac OS X, see the [Install a Shadowsocks Client](/docs/networking/vpn/create-a-socks5-proxy-server-with-shadowsocks-on-ubuntu-and-centos7/#install-a-shadowsocks-client) section of our guide for [Creating a Shadowsocks Server Manually](/docs/networking/vpn/create-a-socks5-proxy-server-with-shadowsocks-on-ubuntu-and-centos7/).

When the client has completed the installation process, ensure that you're setting up your client to connect using the following unique information:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Address** | Your linodes IPv4 address. Can be found in the `Linodes` section of the [Cloud Manager](https://cloud.linode.com/linodes).
| **Port** | The Shadowsocks Marketplace App connects through port `8000` by default. |
| **Encryption** | Set to use the `aes-256-gcm` encryption mode. |
| **Password** | This is the `Shadowsocks Password` field you created when initially deploying your app. |

After configuration, your `Server Preferences` should be similar to the following image:

![shadowsocks-marketplace.png](shadowsocks-marketplace.png)

{{< content "marketplace-update-note-shortguide">}}
