---
slug: nodejs-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Node.js on a Linode Compute Instance. This provides a JavaScript runtime to use with web applications."
keywords: ['nodejs','development','javascript']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-22
modified_by:
  name: Linode
title: "Deploying Node.js through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
---

[Node.js](https://nodejs.org/en/) is a lightweight development platform for building fast and scalable applications using Javascript. Since it's based on Javascript, it's relatively easy to learn and has a large community with lots of resources. Node.js can be used for almost any time of web application, including websites, but its asynchronous nature shines when used to develop real-time data-intensive applications

## Deploying the Node.js Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### Node.js Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email for the server** | This email is require to generate the SSL certificates. *Required* |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your Node.js instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

The Node.js Marketplace App is running [Nginx](https://www.nginx.com/), [Node.js](https://nodejs.org/en/), [NPM](https://www.npmjs.com/), and [PM2](https://pm2.keymetrics.io/). Once deployed, a "Hello World" sample application should be running on `http://localhost:3000`. An Nginx reverse proxy then serves the application through your custom domain or rDNS domain over ports 80 and 443

### Accessing the Node.js App through the Command Line

The Node.js sample application is stored in the `hello.js` file within `/opt/nodejs/`. To access it within the command line, follow the instructions below.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Navigate to the directory in which the application is stored:

        cd /opt/nodejs/

1.  Open the sample application with your preferred command line text editor, such as [nano](/docs/guides/use-nano-to-edit-files-in-linux/) or [vim](/docs/guides/what-is-vi/).

        nano hello.js

### Viewing the Node.js App through a Web Browser

Open your web browser and navigate to `http://[domain]/`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing rDNS.

![Screenshot of Node.js sample application](nodejs-site.png)

{{< content "marketplace-update-note-shortguide">}}