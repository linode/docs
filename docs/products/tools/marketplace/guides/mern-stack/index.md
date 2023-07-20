---
description: "This guide shows you how to install and configure a MERN (MongoDB, Express, React, Node.js) stack on a Linode using our One-Click Marketplace App."
keywords: ['mongodb','mern','react','express', 'web app']
tags: ["web server","database","cloud-manager","linode platform","web applications","marketplace"]
published: 2019-04-02
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy a MERN Stack through the Linode Marketplace"
external_resources:
- '[MongoDB Getting Started](https://docs.mongodb.com/manual/tutorial/getting-started/)'
- '[Express Hello World Example](https://expressjs.com/en/starter/hello-world.html)'
- '[React Getting Started](https://reactjs.org/docs/getting-started.html)'
- '[Node.js Getting Started](https://nodejs.org/es/docs/guides/getting-started-guide/)'
aliases: ['/platform/marketplace/deploy-mern-with-marketplace-apps/', '/platform/one-click/deploy-mern-with-one-click-apps/', '/guides/deploy-mern-with-one-click-apps/','/guides/deploy-mern-with-marketplace-apps/','/guides/mern-stack-marketplace-app/']
authors: ["Linode"]
---

A MERN (MongoDB, Express, React, Node.js) stack is a free and open-source web software bundle used to build modern web applications:

- [MongoDB](https://www.mongodb.com/) is a document database used to persist your application's data.

- [Express](https://expressjs.com/) serves as the web application framework.

- [React](https://reactjs.org/) is used to build your application's user interfaces using JavaScript. React offers a server-side rendering function which makes it easier for search engines to crawl your web application.

- [Node.js](https://nodejs.org/en/about/) serves as the run-time environment for your application.

All of these technologies are well-established, offer robust feature sets, and are well-supported by their maintaining organizations. These characteristics make them a great choice for your applications. Upload your existing MERN website code to your new Linode, or use MERN's scaffolding tool to start writing new web applications on the Linode.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The MERN stack should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 10, Debian 11, and Ubuntu 20.04 LTS
- **Recommended minimum plan:** 1GB Shared Compute Instance or higher, depending on the number of sites and size of the sites you plan on hosting.

### MERN Stack Options

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started After Deployment

After your MERN One-click App has finished installing, you can:

- [Connect to your Linode via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance). You need your Linode's root password to proceed.

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
