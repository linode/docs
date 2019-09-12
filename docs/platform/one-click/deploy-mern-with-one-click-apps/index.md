---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy the MERN stack on Linode with One-Click Apps.'
keywords: ['mongodb','mern','react','express', 'web app']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-02
modified: 2019-04-02
modified_by:
  name: Linode
title: "Deploy MERN with One-Click Apps"
contributor:
  name: Linode
external_resources:
- '[MongoDB Getting Started](https://docs.mongodb.com/manual/tutorial/getting-started/)'
- '[Express Hello World Example](https://expressjs.com/en/starter/hello-world.html)'
- '[React Getting Started](https://reactjs.org/docs/getting-started.html)'
- '[Node.js Getting Started](https://nodejs.org/es/docs/guides/getting-started-guide/)'
---

## MERN One-Click App

A MERN (MongoDB, Express, React, Node.js) stack is a free and open-source web software bundle used to build modern web applications:

- [MongoDB](https://www.mongodb.com/) is a document database used to persist your application's data.

- [Express](https://expressjs.com/) serves as the web application framework.

- [React](https://reactjs.org/) is used to build your application's user interfaces using JavaScript. React offers a server-side rendering function which makes it easier for search engines to crawl your web application.

- [Node.js](https://nodejs.org/en/about/) serves as the run-time environment for your application.

All of these technologies are well-established, offer robust feature sets, and are well-supported by their maintaining organizations. These characteristics make them a great choice for your applications. Upload your existing MERN website code to your new Linode, or use MERN's scaffolding tool to start writing new web applications on the Linode.

### Deploy a MERN One-Click App

{{< content deploy-one-click-apps>}}

### MERN Options

| **Field** | **Description** |
|:--------------|:------------|
| **MongoDB Admin Password** | The administrative password for your MongoDB database. *Required*. |

### Linode Options

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by the MERN One-Click App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). The Linode plan you deploy your MERN stack on should account for the estimated workload. If you are standing up a simple web page, you can use a Nanode or 2GB Linode. If you will deploy a more robust web app, then consider a plan with higher RAM and CPU allocations. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |


### Getting Started After Deployment

After your MERN One-click App has finished installing, you can:

- [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh). You will need your Linode's root password to proceed.

- Consult the following guides to learn more about working with the various components of the MERN stack:

    - [Build Database Clusters with MongoDB](/docs/databases/mongodb/build-database-clusters-with-mongodb/)
    - [Deploy a React Application on Linode](/docs/development/javascript/deploy-a-react-app-on-linode/)


### Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **MongoDB** | Document-based database |
| **Express** | Web application framework |
| **React** | JavaScript library |
| **Node JS** | Runtime environment |
| **UFW (UncomplicatedFirewall)** | Firewall utility. Ports 22/tcp for IPv4 and IPv6 will allow incoming traffic. All other ports will have the following firewall rules: deny (incoming), allow (outgoing). |
