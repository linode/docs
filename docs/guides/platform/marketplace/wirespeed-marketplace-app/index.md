---
slug: wirespeed-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "the fastest, easiest to use, and most secure VPN gateway software."
keywords: ['vpn','security','tunnel']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-01
modified_by:
  name: Linode
title: "Deploying WireSpeed VPN through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[WireSpeed VPN](https://bunker.services/)'
---

WireSpeed makes it easy for developers to access cloud infrastructure via the powerful WireGuard VPN protocol. It can also be used to enable remote workers to access the internet securely while on public WiFi.

## Deploying the WireSpeed VPN Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### WireSpeed VPN Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email** | This is the admin user email to login to your WireSpeed instance. |
| **Admin Password** | This is the admin user password to login to your WireSpeed instance. |
| **DNS name** | This is the domain you will be using for your WireSpeed instance. |
| **Data Directory** | This is the directory that your WireSpeed data will be stored in, default will be `/wirespeed`. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 18.04 LTS, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the WireSpeed VPN App

Once your WireSpeed app has finished its installation, you will want to ensure that you have assigned the domain to your Linode. Once your domain has been assigned and has finished progating, you will be able to visit the login dashboard by entering the domain in your browser. Example: `https://vpn.example.com`

       {{< note >}}
    For more documentation on how to assign a domain to your Linode, please review the [DNS Manager](/docs/guides/dns-manager/) guide for instructions on setting up your DNS records in the Cloud Manager, and read through [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/) for general information about how DNS works.
       {{</ note >}}

From here, you will be able to login with the Admin Email & Admin Password you entered during the initial deployment of the Linode.

Now that you’ve accessed your WireSpeed VPN instance, checkout [the official WireSpeed VPN documentation](https://bunker.services/products/warpspeed/install-linode) to learn how to further configure your WireSpeed VPN instance.

{{< content "marketplace-update-note-shortguide">}}