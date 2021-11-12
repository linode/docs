---
slug: warpspeed-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy WarpSpeed on a Linode Compute Instance. This provides you with one of the fastest, easiest to use, and most secure VPN gateway software."
keywords: ['vpn','security','tunnel']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-12
modified_by:
  name: Linode
title: "Deploying WarpSpeed VPN through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[WarpSpeed VPN](https://bunker.services/products/warpspeed)'
noindex: true
_build:
  list: false
---

WarpSpeed makes it easy for developers to access cloud infrastructure via the powerful WireGuard® VPN protocol. It can also be used to enable remote workers to access the internet securely while on public WiFi.

## Deploying the WarpSpeed VPN Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### WarpSpeed VPN Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email** | This is the admin user email to login to your WarpSpeed instance. |
| **Admin Password** | This is the admin user password to login to your WarpSpeed instance. |
| **DNS name** | This is the domain you will be using for your WarpSpeed instance. |
| **Data Directory** | This is the directory that your WarpSpeed data will be stored in, default will be `/wirespeed`. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 18.04 LTS, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the WarpSpeed VPN App

1.  Configure your custom domain to point towards the IPv4 (and IPv6) address of the newly created Compute Instance. Review the [DNS Manager](/docs/guides/dns-manager/) guide for instructions on setting up your DNS records in the Cloud Manager and read through [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/) for general information about how DNS works.

1.  Once your domain has been configured and has finished propagating, enter the domain within a web browser to access the login page.

1.  Enter the *Admin Email* and *Admin Password* you defined during the initial deployment of this Compute Instance.

Now that you’ve accessed your WarpSpeed VPN instance, check out [the official WarpSpeed VPN documentation](https://bunker.services/products/warpspeed/install-linode) to learn how to further configure your WarpSpeed VPN instance.

{{< content "marketplace-update-note-shortguide">}}