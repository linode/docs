---
slug: pihole-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Pi-hole on a Linode Compute Instance. This app protects your devices from unwanted content, without needing to  install any client-side software."
keywords: ['pi-hole','adblocker','dns','sinkhole']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-21
modified_by:
  name: Linode
title: "Deploying Pi-hole through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[Pi-hole](https://pi-hole.net/)'
aliases: ['/guides/deploying-pihole-marketplace-app/']
---

[Pi-hole](https://pi-hole.net/) is a [DNS sinkhole](https://en.wikipedia.org/wikic/DNS_sinkhole) that filters out requests to ad-serving domains, blocking ads and improving network performance. With Pi-hole, you can actively monitor every DNS request made on your network and block requests as they come in.

## Deploying the Pi-hole Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

## Configuration Options

### Pi-hole Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Pi-hole user password** | This will be the password to get into the Pi-hole dashboard. *Required* |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your Focalboard instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Email for SOA Record** | This email is for the SOA DNS Record. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS, Debian 11
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the Pi-hole App

1.  Open your web browser and navigate to `http://[domain]/admin`, where *[domain]* can be replaced with the custom domain you entered during deployment, your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`), or your IPv4 address. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing IP addresses and rDNS.

    The Pi-Hole dashboard should now be displayed.

    ![Screenshot of the Pi-hole dashboard](pihole-dashboard.png)

1.  To log yourself in and access most of Pi-hole's features, click the **Login** link on the left menu. Enter the Pi-hole user password that you created when deploying the Compute Instance.

Now that you’ve accessed your dashboard, check out [the official Pi-hole documentation](https://docs.pi-hole.net/) to learn how to further utilize your Pi-hole instance.

{{< content "marketplace-update-note-shortguide">}}