---
slug: moodle-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Moodle is the leading open source learning management system. This tutorial walks you through deploying Moodle using the Linode Marketplace."
keywords: ['learning','educator','management', and 'school']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying Moodle through the Linode Marketplace"
aliases: ['/guides/deploying-moodle-marketplace-app/']
external_resources:
- '[Moodle](https://moodle.org/)'
---

Moodle is the most widely used open source learning management system. It is aimed to provide learners, educators, and administrators with a single robust, secure, and integrated solution to develop customized learning environments.

## Deploying the Moodle Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

## Configuration Options

### Moodle Options

You can configure your Moodle App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Password** | Moodle Admin Password. *Required*. |
| **Admin Email** | Moodle Admin email. *Required*. |
| **MySQL Root Password** | MySQL Root Password. *Required*. |
| **MySQL Password** | MySQL Moodle Database Password. *Required*.|
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your Moodle site. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started After Deployment

### Access Your Moodle App

To access your Moodle instance, Open a browser and navigate to your Linode rDNS domain `https://li1234-555.members.linode.com`. Replace `https://li1234-555.members.linode.com` with your [Linode's RDNS domain](/docs/guides/remote-access/#resetting-reverse-dns).

From there, you can login by clicking the box on the top right of the page. Once you see the login page, you can enter `moodle` as the *username* and the *password* that was entered during the creation of the Linode.

Now that you’ve accessed your dashboard, checkout [the official Moodle documentation](https://docs.moodle.org/311/en/Main_page) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}