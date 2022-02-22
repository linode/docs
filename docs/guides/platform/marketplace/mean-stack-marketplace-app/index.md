---
slug: mean-stack-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to easily deploy MEAN (MongoDB, Express, Angular, Node.js) using Linode's Marketplace Apps."
keywords: ['mongodb','mean','angular','express', 'web app', 'node']
tags: ["web server","database","cloud-manager","linode platform","web applications","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-17
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying a MEAN Stack through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[MongoDB Getting Started](https://docs.mongodb.com/manual/tutorial/getting-started/)'
- '[Express Hello World Example](https://expressjs.com/en/starter/hello-world.html)'
- '[Angular Getting Started](https://angular.io/start)'
- '[Node.js Getting Started](https://nodejs.org/es/docs/guides/getting-started-guide/)'
aliases: ['/platform/marketplace/deploy-mean-with-marketplace-apps/', '/platform/one-click/deploy-mean-with-one-click-apps/', '/guides/deploy-mean-with-one-click-apps/','/guides/deploy-mean-with-marketplace-apps/']
---

A MEAN (MongoDB, Express, Angular, Node.js) stack is a free and open-source web software bundle used to build modern web applications:

- [MongoDB](https://www.mongodb.com/) is a document database used to persist your application's data.

- [Express](https://expressjs.com/) serves as the web application framework.

- [Angular](https://angular.io/) is used to build your application's user interfaces using JavaScript. Angular offers Web Workers and server-side rendering that helps your applications achieve the maximum speed possible on the Web Platform.

- [Node.js](https://nodejs.org/en/about/) serves as the run-time environment for your application.

MEAN is a full-stack JavaScript-based framework consisting of MongoDB database, ExpressJS, AngularJS, and NodeJS. You can build entire web applications on JavaScript, from client to server to database with this stack. Single-language programming makes it easier to develop working applications more quickly without sacrificing functionality and features.

## Deploying the MEAN Stack Marketplace App

{{< content deploy-marketplace-apps-shortguide>}}

**Software installation should complete within 2-3 minutes after the Linode has finished provisioning.**

## Configuration Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** The Linode plan you deploy your MEAN stack on should account for the estimated workload. If you are standing up a simple web page, you can use a 1GB Linode (Nanode) or 2GB Linode. If you will deploy a more robust web app, then consider a plan with higher RAM and CPU allocations.

### MEAN Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email for the server** | The start of authority (SOA) email address for this server. This email address will be added to the SOA record for the domain. This is a required field if you want the installer to create DNS records. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your BeEF instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

## Getting Started After Deployment

After your MEAN app has finished installing, you can access the "Hello World" app with your Linode's IPv4 address. Copy your Linode’s IPv4 address from the [Linode Cloud Manager](https://cloud.linode.com), and then connect to the server in your browser using your Linode's IPv4 address and port `3000`(for example `192.0.2.0:3000`). The default "Hello World" app can be found the in '/opt/mean/' directory.

## Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **MongoDB** | Document-based database |
| **Express** | Web application framework |
| **Angular** | JavaScript library |
| **Node JS** | Runtime environment |
| **UFW (UncomplicatedFirewall)** | Firewall utility. Ports 22/tcp for IPv4 and IPv6 will allow incoming traffic. All other ports will have the following firewall rules: deny (incoming), allow (outgoing). |

{{< content "marketplace-update-note-shortguide">}}
