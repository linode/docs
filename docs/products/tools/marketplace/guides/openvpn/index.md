---
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows you how to configure and deploy your own private and secure OpenVPN Server on a Linude using the One-Click Marketplace Application."
keywords: ['vpn','openvpn','tunnel','marketplace app']
tags: ["ssl","cloud-manager","linode platform","security","marketplace","vpn"]
bundles: ['network-security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-05
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying OpenVPN through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[OpenVPN Community Resources](https://openvpn.net/community-resources/)'
aliases: ['/platform/marketplace/marketplace-openvpn/', '/platform/one-click/one-click-openvpn/','/guides/one-click-openvpn/','/guides/marketplace-openvpn/','/guides/deploying-openvpn-marketplace-app/','/guides/openvpn-marketplace-app/']
---

OpenVPN is a widely trusted, free, and open-source VPN (virtual private network) application that creates encrypted tunnels for secure data transfer between computers that are not on the same local network. Your traffic is encrypted by OpenVPN using [OpenSSL](https://www.openssl.org/). You can use OpenVPN to:

- Connect your computer to the public Internet through a dedicated OpenVPN server. By encrypting your traffic and routing it through an OpenVPN server that you control, you can protect yourself from network attacks when using public Wi-Fi.

- Connect your computer to services that you don't want to expose to the public Internet. Keep your sensitive applications isolated on your servers' private networking and use OpenVPN to access them remotely.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** OpenVPN should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though consider the amount of traffic needed for the VPN and select a plan with enough *Outbound Network Transfer* to handle the expected traffic.

### OpenVPN Options

{{<note>}}
The admin password for the OpenVPN application is no longer manually entered when creating the Compute Instance. Instead, this password is now automatically generated. See [Obtaining the Admin Password](#obtaining-the-admin-password) for instructions on viewing the admin password after deployment.
{{</note>}}

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

## Getting Started After Deployment

### Access Details

{{< caution >}}
OpenVPN Access Server is only accessible over an *HTTPS* connection (not *HTTP*). When accessing both the admin and client dashboards, your browser may warn you that the connection is not private, is not secure, or that there is a potential security risk. You must accept this risk to continue.
{{< /caution >}}

**OpenVPN Admin Interface:**

- **URL:** `https://192.0.2.1:943/admin/`, where `192.0.2.1` represents the IPv4 address of your new Compute Instance. For assistance locating the IP address, see [Managing IP Addresses](/docs/guides/managing-ip-addresses/#viewing-ip-addresses).
- **Username:** `openvpn`
- **Password:** See [Obtaining the Admin Password](#obtaining-the-admin-password) below.

For more details on logging in to the OpenVPN admin interface for the first time (as well as changing the initial password), see the [Access Server Admin Web UI First Login](https://openvpn.net/access-server-manual/access-server-web-admin-ui-first-login/) article within OpenVPN's docs.

**OpenVPN Client Interface:**

- **URL:** `https://192.0.2.1:943/`, where your Linode's IPv4 address should take the place of the `192.0.2.1` example address. The client interface includes links to download the OpenVPN client software for your computer.

### Obtaining the Admin Password

The password for the main administrator account was automatically generated during the initial install process. To find this password, log in to your Compute Instance through the [LISH Console](/docs/guides/using-the-lish-console/#through-the-cloud-manager-weblish). Your credentials should appear towards the end of the installation script.

{{<output>}}
Access Server Web UIs are available here:
Admin  UI: https://192.0.2.1:943/admin
Client UI: https://192.0.2.1:943/
Login as "openvpn" with "password" to continue
(password can be changed on Admin UI)
+++++++++++++++++++++++++++++++++++++++++++++++
{{</output>}}

You can also obtain your password by running the following command:

    cat /usr/local/openvpn_as/init.log | grep 'To login'

### Open a Connection to your VPN

To open a connection to your OpenVPN server from your computer, you'll need to install the OpenVPN client software. Follow the instructions in the [Client Software Installation](/docs/networking/vpn/install-openvpn-access-server-on-linux/#client-software-installation) section of our [OpenVPN](/docs/networking/vpn/install-openvpn-access-server-on-linux/#client-software-installation) guide for a detailed explanation of how to install and use this software.

{{< content "marketplace-update-note-shortguide">}}
