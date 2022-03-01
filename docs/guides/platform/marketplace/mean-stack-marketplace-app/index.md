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
modified: 2022-03-01
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

### MEAN Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email for the server** | This email is require to generate the SSL certificates. It is also used as the SOA email address if you add a custom domain. *Required* |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name you wish to use with your application. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/). Some options may be limited or have recommended values based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** The Linode plan you deploy your MEAN stack on should account for the estimated workload. If you are standing up a simple web page, you can use a 1GB Linode (Nanode) or 2GB Linode. If you are deploying a more robust web app, then consider a plan with higher RAM and CPU allocations.

## Getting Started After Deployment

Once deployed, a "Hello World" sample application should be running on `http://localhost:3000`. An Nginx reverse proxy then serves the application through your custom domain or rDNS domain over ports 80 and 443. Follow the instructions below to view or access it.

### Accessing the MEAN App through the Command Line

The MEAN sample application is stored in the `/opt/mean/` directory. To access it within the command line, follow the instructions below.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Navigate to the directory in which the application is stored:

        cd /opt/mean/

1.  Open the sample application with your preferred command line text editor, such as [nano](/docs/guides/use-nano-to-edit-files-in-linux/) or [vim](/docs/guides/what-is-vi/).

        nano server.js

### Viewing the MEAN App through a Web Browser

Open your web browser and navigate to `https://[domain]`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing rDNS.

## Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **MongoDB** | Document-based database |
| **Express** | Web application framework |
| **Angular** | JavaScript library |
| **Node JS** | Runtime environment |
| **NGINX** | Web server |
| **UFW (UncomplicatedFirewall)** | Firewall utility. Ports 22, 80, and 443 for IPv4 and IPv6 are set to allow traffic. All other ports have the following firewall rules: deny (incoming), allow (outgoing). |

{{< content "marketplace-update-note-shortguide">}}
