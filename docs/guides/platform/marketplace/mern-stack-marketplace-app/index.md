---
slug: mern-stack-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy the MERN stack on Linode with Marketplace Apps."
keywords: ['mongodb','mern','react','express', 'web app']
tags: ["web server","database","cloud-manager","linode platform","web applications","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-02
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying a MERN Stack through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[MongoDB Getting Started](https://docs.mongodb.com/manual/tutorial/getting-started/)'
- '[Express Hello World Example](https://expressjs.com/en/starter/hello-world.html)'
- '[React Getting Started](https://reactjs.org/docs/getting-started.html)'
- '[Node.js Getting Started](https://nodejs.org/es/docs/guides/getting-started-guide/)'
aliases: ['/platform/marketplace/deploy-mern-with-marketplace-apps/', '/platform/one-click/deploy-mern-with-one-click-apps/','/guides/deploy-mern-with-marketplace-apps/']
---

A MERN (MongoDB, Express, React, Node.js) stack is a free and open-source web software bundle used to build modern web applications:

- [MongoDB](https://www.mongodb.com/) is a document database used to persist your application's data.

- [Express](https://expressjs.com/) serves as the web application framework.

- [React](https://reactjs.org/) is used to build your application's user interfaces using JavaScript. React offers a server-side rendering function which makes it easier for search engines to crawl your web application.

- [Node.js](https://nodejs.org/en/about/) serves as the run-time environment for your application.

All of these technologies are well-established, offer robust feature sets, and are well-supported by their maintaining organizations. These characteristics make them a great choice for your applications. Upload your existing MERN website code to your new Linode, or use MERN's scaffolding tool to start writing new web applications on the Linode.

## Deploying the MERN Stack Marketplace App

{{< content deploy-marketplace-apps-shortguide>}}

**Software installation should complete within 2-3 minutes after the Linode has finished provisioning.**

## Configuration Options

### MERN Stack Options

| **Field** | **Description** |
|:--------------|:------------|
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your website. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10, Debian 11, and Ubuntu 20.04 LTS
- **Recommended plan:** The Linode plan you deploy your MERN stack on should account for the estimated workload. If you are standing up a simple web page, you can use a 1GB Linode (Nanode) or 2GB Linode. If you deploy a more robust web app, then consider a plan with higher RAM and CPU allocations.

## Getting Started After Deployment

After your MERN One-click App has finished installing, you can:

- [Connect to your Linode via SSH](/docs/guides/getting-started/#connect-to-your-linode-via-ssh). You need your Linode's root password to proceed.

- Consult the following guides to learn more about working with the various components of the MERN stack:

    - [Build Database Clusters with MongoDB](/docs/guides/build-database-clusters-with-mongodb/)
    - [Deploy a React Application on Linode](/docs/guides/how-to-deploy-a-react-app-on-debian-10/)

## Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **MongoDB** | Document-based database |
| **Express** | Web application framework |
| **React** | JavaScript library |
| **Node JS** | Runtime environment |
| **UFW (UncomplicatedFirewall)** | Firewall utility. Ports 22/tcp for IPv4 and IPv6 allows incoming traffic. All other ports have the following firewall rules: deny (incoming), allow (outgoing). |

{{< content "marketplace-update-note-shortguide">}}
