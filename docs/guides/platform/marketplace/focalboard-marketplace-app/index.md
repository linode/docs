---
slug: focalboard-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Focalboard on a Linode Compute Instance. This provides you with an open source alternative to the popular project management tool Trello."
keywords: ['focalboard','project','productivity','kanban']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-14
modified_by:
  name: Linode
title: "Deploying Focalboard through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[Focalboard](https://www.focalboard.com/)'
---

[Focalboard](https://www.focalboard.com/) is an open source alternative to tools like Asana, Trello, and Notion. It helps teams, individuals, and developers stay aligned and organized on their everyday tasks. With Focalboard, you can reach milestones, keep track of project notes, and achieve goals.

## Deploying the Focalboard Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

## Configuration Options

### Focalboard Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email for the server** | This email is require to generate the SSL certificates. *Required* |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your Focalboard instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS Debian 11
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the Focalboard App

1.  Open a browser and navigate to the domain you created in the beginning of your deployment. You can also use your Compute Instance's rDNS, which may look like `123-0-123-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing and setting the rDNS value.

1.  On the Focalboard login page that appears, click the **Create an Account** button to create a username and password for your instance.

Now that you’ve accessed your dashboard, check out [the official Focalboard documentation](https://www.focalboard.com/guide/user/) to learn how to further utilize your Focalboard instance.

{{< content "marketplace-update-note-shortguide">}}