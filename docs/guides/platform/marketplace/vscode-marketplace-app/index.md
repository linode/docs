---
slug: vscode-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Run VS Code Server in the browser with the VS Code Marketplace App. Code Server uses the open source code from Microsoft''s VS Code to provide a web interface for VS Code."
keywords: ['vscode', 'marketplace', 'vscode web browser']
tags: ["debian","marketplace", "web applications","linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-12-02
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying VS Code through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Code Server FAQ](https://github.com/cdr/code-server/blob/v3.7.4/doc/FAQ.md)'
- '[Code Server Setup and Configuration Guide](https://github.com/cdr/code-server/blob/v3.7.4/doc/guide.md)'
aliases: ['/platform/marketplace/how-to-deploy-vscode-with-marketplace-apps/', '/platform/one-click/how-to-deploy-vscode-with-one-click-apps/','/guides/deploy-vscode-with-marketplace-apps/']
---

Run a [Visual Studio Code Server](https://github.com/cdr/code-server) in the browser with the Visual Studio (VS) Code Marketplace App. Code Server uses the open source code to provide a web interface for VS Code.

## Deploying the VS Code Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

### VS Code Options

The VS Code Marketplace app has the following required configuration fields.

| **Field&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;** | **Description** |
|-----------|-----------------|
| **The password to login to the VS Code Web UI** | This is the password you use to log into the VS Code web interface. The password must meet the complexity strength validation requirements for a strong password. **Required** |
| **Your email address** | This email address is used for VS Code configuration and is added to the SOA record for the domain if you add one. This field is also used to create DNS records, and is required to create an SSL certificate. |

### VS Code Advanced Options

The VS Code Marketplace form includes advanced fields to setup the limited user account and DNS records of the VS Code server. These are optional configurations and are not required for installation.

| **Field&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;** | **Description** |
|-----------|-----------------|
| **The version of VS Code Server you'd like installed** | This is the version of VS Code Server that is installed during setup. The default at the time that this guide was written is 3.10.2. This field is filled in and it is recommended that you use this value. If you do not fill in this field, the latest version is used. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on the server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/guides/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) before you proceed with the installation. |
| **Domain** | The domain name where you want to host your VS Code server. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Subdomain** | The subdomain you want the installer to create a DNS record for during setup. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Would you like to use a free Let's Encrypt SSL certificate?** | Select `Yes` if you want the install to create an SSL certificate for you, or `No` if you do not. If `No` is selected, the VS Code app triggers security warnings in most web browsers. If you create a certificate and do not create a domain, the installer uses the Linode rDNS assigned name for the certificate. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started after Deployment

VS Code is now installed and ready to use.

1.  Before you go to the app, if you filled out the optional VS Code configuration fields for domain:

    - In the Cloud Manager [DNS Manager](/docs/guides/dns-manager/#add-a-domain) there is now an entry for the domain with possible subdomain records pointing to the new server.
    - [Configure the rDNS](/docs/guides/configure-your-linode-for-reverse-dns/) on the Linode server.

1.  VS Code is accessed via the domain name if you entered one, or by the rDNS name if you did not. For example, `http://example.com` or `http://li1234-555.members.linode.com`, replacing the domain name or rDNS name with values for the server.

1.  At the login screen, login using the password you entered during installation.

    ![Code Server Login Screen](vscode-login-screen.png "Code Server Login Screen")

1.  After logging in, the VS Code Welcome screen appears in the browser and ready to code.

    ![VS Code Welcome Screen](vscode-welcome-screen.png "VS Code Welcome Screen")

## Software Included

The VS Code Marketplace App installs the following software on the Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Code Server**](https://github.com/cdr/code-server) | Code Server which hosts the open source web interface of VS Code.|
| [**NGINX**](https://www.nginx.com) | An open source web server. |
| [**ufw**](https://wiki.ubuntu.com/UncomplicatedFirewall) | ufw is the uncomplicated firewall, a frontend for iptables. |

{{< content "marketplace-update-note-shortguide">}}
