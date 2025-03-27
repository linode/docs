---
title: "Deploy a MEAN Stack through the Linode Marketplace"
description: "Learn how to easily deploy MEAN (MongoDB, Express, Angular, Node.js) using Linode's Marketplace Apps."
published: 2020-03-17
modified: 2025-03-19
keywords: ['mongodb','mean','angular','express', 'web app', 'node']
tags: ["web server","database","cloud-manager","linode platform","web applications","marketplace"]
external_resources:
- '[MongoDB Getting Started](https://docs.mongodb.com/manual/tutorial/getting-started/)'
- '[Express Hello World Example](https://expressjs.com/en/starter/hello-world.html)'
- '[Angular Getting Started](https://angular.io/start)'
- '[Node.js Getting Started](https://nodejs.org/es/docs/guides/getting-started-guide/)'
- '[PM2 Getting Started](https://pm2.keymetrics.io/docs/usage/quick-start/)'
aliases: ['/products/tools/marketplace/guides/mean-stack/','/platform/marketplace/deploy-mean-with-marketplace-apps/', '/platform/one-click/deploy-mean-with-one-click-apps/', '/guides/deploy-mean-with-one-click-apps/','/guides/deploy-mean-with-marketplace-apps/','/guides/mean-stack-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 611895
marketplace_app_name: "MEAN"
---

A MEAN (MongoDB, Express, Angular, Node.js) stack is a free and open-source web software bundle used to build modern web applications:

- [MongoDB](https://www.mongodb.com/) is a document database used to persist your application's data.

- [Express](https://expressjs.com/) serves as the web application framework.

- [Angular](https://angular.io/) is used to build your application's user interfaces using JavaScript. Angular offers Web Workers and server-side rendering that helps your applications achieve the maximum speed possible on the Web Platform.

- [Node.js](https://nodejs.org/en/about/) serves as the run-time environment for your application.

MEAN is a full-stack JavaScript-based framework consisting of MongoDB database, ExpressJS, AngularJS, and NodeJS. You can build entire web applications on JavaScript, from client to server to database with this stack. Single-language programming makes it easier to develop working applications more quickly without sacrificing functionality and features.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** The MEAN stack should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** 1GB Shared Compute Instance or higher, depending on the number of sites and size of the sites you plan on hosting.

### MEAN Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

Once the app is deployed, you need to obtain the credentials from the server.

To obtain credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

Once deployed, a "Hello World" sample application should be running. The Express backend runs on port 5000, and Nginx serves the Angular frontend through your custom domain or rDNS domain over ports 80 and 443. Follow the instructions below to view or access it.

### Accessing the MEAN App through the Command Line

The MEAN stack components are organized as follows:
- Frontend (Angular): `/var/www/[domain]`
- Backend (Express): `/var/www/[domain]/backend`

To access these components within the command line, follow the instructions below.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Navigate to the backend directory:

        cd /var/www/[domain]/backend

1.  View the Express server file:

        cat server.js

1.  To view the Angular frontend files:

        cd /var/www/[domain]
        ls

### Viewing the MEAN App through a Web Browser

Open your web browser and navigate to `https://[domain]`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

## Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **MongoDB 8.0** | Document-based database |
| **Express** | Web application framework |
| **Angular** | JavaScript frontend framework with CLI |
| **Node.js 22.x** | Runtime environment |
| **NGINX** | Web server |
| **UFW (UncomplicatedFirewall)** | Firewall utility. Ports 22, 80, and 443 for IPv4 and IPv6 are set to allow traffic. All other ports have the following firewall rules: deny (incoming), allow (outgoing). |

{{% content "marketplace-update-note-shortguide" %}}
