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
modified: 2021-12-13
modified_by:
  name: Linode
title: "Deploying OpenVPN through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[OpenVPN Community Resources](https://openvpn.net/community-resources/)'
aliases: ['/platform/marketplace/marketplace-openvpn/', '/platform/one-click/one-click-openvpn/','/guides/one-click-openvpn/','/guides/marketplace-openvpn/','/guides/deploying-openvpn-marketplace-app/']
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
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your Wazuh instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Your email address** | This email address is added to the SOA record for the domain if you add one.

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though consider the amount of traffic needed for the VPN and select a plan with enough *Outbound Network Transfer* to handle the expected traffic.

## Getting Started After Deployment

### Access Details

**OpenVPN Admin Interface:**

- **URL:** `https://192.0.2.2:943/admin/`, where `192.0.2.2` represents the IPv4 address of your new Compute Instance. For assistance locating the IP address, see [Managing IP Addresses](/docs/guides/managing-ip-addresses/#viewing-ip-addresses).
- **Username:** `openvpn`
- **Password:** See [Obtaining the Admin Password](#obtaining-the-admin-password) below.

For more details on logging in to the OpenVPN admin interface for the first time (as well as changing the initial password), see the [Access Server Admin Web UI First Login](https://openvpn.net/access-server-manual/access-server-web-admin-ui-first-login/) article within OpenVPN's docs.

**OpenVPN Client Interface:**

- **URL:** `https://192.0.2.2:943/`, where your Linode's IPv4 address should take the place of the `192.0.2.2` example address. The client interface includes links to download the OpenVPN client software for your computer.

    {{< note >}}
The OpenVPN Access Server does not come with an HTTP (insecure) web server daemon. Hence, it is important that you use `https` in the address. If you use `http` in the address, the server does not respond.
{{< /note >}}

### Obtaining the Admin Password

The password for the main administrator account was automatically generated during the initial install process. To find this password, log in to your Compute Instance through the [LISH Console](/docs/guides/using-the-lish-console/#through-the-cloud-manager-weblish). Your credentials should appear towards the end of the installation script.

{{<output>}}
Access Server Web UIs are available here:
Admin  UI: https://192.0.2.0:943/admin
Client UI: https://192.0.2.0:943/
Login as "openvpn" with "password" to continue
(password can be changed on Admin UI)
+++++++++++++++++++++++++++++++++++++++++++++++
{{</output>}}

You can also obtain your password by running the following command:

    cat /usr/local/openvpn_as/tmp/initial_ovpn_pass

### Open a Connection to your VPN

To open a connection to your OpenVPN server from your computer, you'll need to install the OpenVPN client software. Follow the instructions in the [Client Software Installation](/docs/networking/vpn/install-openvpn-access-server-on-linux/#client-software-installation) section of our [OpenVPN](/docs/networking/vpn/install-openvpn-access-server-on-linux/#client-software-installation) guide for a detailed explanation of how to install and use this software.

{{< content "marketplace-update-note-shortguide">}}
