---
slug: rocketchat-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy Rocket.Chat on a Linode Compute Instance. This provides you with a self-hosted open source chat application (Slack alternative)."
keywords: ['rocketchat','chat','slack','communication']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-12
modified_by:
  name: Linode
title: "Deploying Rocket.Chat through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[Rocket.Chat](https://rocket.chat/)'
noindex: true
_build:
  list: false
---

Rocket.Chat is a self-hosted open source chat application that can be used as an alternative to Slack. Rocket.Chat has many key features that you or your business can utilize to improve productivity in the workplace such as video conferencing, group chats, and platform integrations with some of the most popular applications.

## Deploying the Rocket.Chat Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

### Rocket.Chat Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your Rocket.Chat instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Admin Email for the server** | The start of authority (SOA) email address for this server. This email address will be added to the SOA record for the domain. This is a required field if you want the installer to create DNS records. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the Rocket.Chat App

1.  Open a browser and navigate to the domain you created in the beginning of your deployment. You can also use your Compute Instance's rDNS, which may look like `li*.members.linode.com`. See the [Remote Access](/docs/guides/remote-access/) guide for information on viewing and setting the rDNS value.

1.  From there, Rocket.Chat prompts you to fill out multiple forms to get your instance created and ready to use:

    ![Rocket.Chat Step 1](rocketchat-setup.png)
    ![Rocket.Chat Step 2](rocketchat-setup2.png)
    ![Rocket.Chat Step 3](rocketchat-setup3.png)
    ![Rocket.Chat Step 4](rocketchat-setup4.png)

Now that you’ve gone through the setup and accessed your Rocket.Chat instance, check out [the official Rocket.Chat documentation](https://docs.rocket.chat/guides/user-guides) to learn how to further utilize your Rocket.Chat instance.

{{< content "marketplace-update-note-shortguide">}}