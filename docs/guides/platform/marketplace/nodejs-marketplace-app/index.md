---
slug: nodejs-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy NodeJS on a Linode Compute Instance. This provides a JavaScript runtime to use with web applications."
keywords: ['nodejs','development','javascript']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-22
modified_by:
  name: Linode
title: "Deploying NodeJS through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
aliases: ['/guides/deploying-nodejs-marketplace-app/']
---

A lightweight development platform for building fast and scalable applications in Javascript. NodeJS can be utilized for real-time chat applications, data-intensive mobile apps, and much more.

## Deploying the NodeJS Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### NodeJS Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email for the server** | This email is require to generate the SSL certificates. *Required* |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your NodeJS instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the NodeJS App

1.  Open a browser and navigate to the domain you created in the beginning of your deployment. You can also use your Compute Instance's rDNS, which may look like `123-0-123-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing and setting the rDNS value.

Our NodeJS Marketplace application is running [Nginx](https://www.nginx.com/), [NodeJS](https://nodejs.org/en/), [NPM](https://www.npmjs.com/), and [PM2](https://pm2.keymetrics.io/). We serve the "Hello World" application on http://localhost:3000 with an Nginx reverse proxy to serve the application over port 443 with a [LetsEncrypt](https://letsencrypt.org/) SSL certificate configured automatically as part of the installation. The NodeJs "Hello World" application is in the '/opt/nodejs/' directory. 

{{< content "marketplace-update-note-shortguide">}}