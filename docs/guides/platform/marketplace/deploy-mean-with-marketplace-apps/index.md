---
slug: deploy-mean-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'A MEAN (MongoDB, Express, Angular, Node.js) stack is a free and open-source web software bundle used to build modern web applications. Easily deploy MEAN using Marketplace Apps.'
og_description: 'A MEAN (MongoDB, Express, Angular, Node.js) stack is a free and open-source web software bundle used to build modern web applications. Easily deploy MEAN using Marketplace Apps.'
keywords: ['mongodb','mean','angular','express', 'web app', 'node']
tags: ["web server","database","cloud-manager","linode platform","web applications","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-17
modified: 2019-03-17
modified_by:
  name: Linode
title: "How to Deploy MEAN with Marketplace Apps"
h1_title: "Deploying MEAN with Marketplace Apps"
contributor:
  name: Linode
external_resources:
- '[MongoDB Getting Started](https://docs.mongodb.com/manual/tutorial/getting-started/)'
- '[Express Hello World Example](https://expressjs.com/en/starter/hello-world.html)'
- '[Angular Getting Started](https://angular.io/start)'
- '[Node.js Getting Started](https://nodejs.org/es/docs/guides/getting-started-guide/)'
aliases: ['/platform/marketplace/deploy-mean-with-marketplace-apps/', '/platform/one-click/deploy-mean-with-one-click-apps/']
---

## MEAN Marketplace App

A MEAN (MongoDB, Express, Angular, Node.js) stack is a free and open-source web software bundle used to build modern web applications:

- [MongoDB](https://www.mongodb.com/) is a document database used to persist your application's data.

- [Express](https://expressjs.com/) serves as the web application framework.

- [Angular](https://angular.io/) is used to build your application's user interfaces using JavaScript. Angular offers Web Workers and server-side rendering that helps your applications achieve the maximum speed possible on the Web Platform.

- [Node.js](https://nodejs.org/en/about/) serves as the run-time environment for your application.

 MEAN is a full-stack JavaScript-based framework consisting of MongoDB database, ExpressJS, AngularJS, and NodeJS. You can build entire web applications on JavaScript, from client to server to database with this stack. Single-language programming makes it easier to develop working applications more quickly without sacrificing functionality and features.

### Deploy a MEAN Marketplace App

{{< content deploy-marketplace-apps>}}


### Linode Options

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by the MEAN Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). The Linode plan you deploy your MEAN stack on should account for the estimated workload. If you are standing up a simple web page, you can use a 1GB Linode (Nanode) or 2GB Linode. If you will deploy a more robust web app, then consider a plan with higher RAM and CPU allocations. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |


### Getting Started After Deployment

After your MEAN One-click App has finished installing, you can:

- [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh). You will need your Linode's root password to proceed.


### Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **MongoDB** | Document-based database |
| **Express** | Web application framework |
| **Angular** | JavaScript library |
| **Node JS** | Runtime environment |
| **UFW (UncomplicatedFirewall)** | Firewall utility. Ports 22/tcp for IPv4 and IPv6 will allow incoming traffic. All other ports will have the following firewall rules: deny (incoming), allow (outgoing). |

{{< content "marketplace-update-note">}}
