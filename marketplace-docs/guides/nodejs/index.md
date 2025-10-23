---
title: "Deploy Node.js through the Linode Marketplace"
description: "Deploy Node.js on a Linode Compute Instance. This provides a JavaScript runtime to use with web applications."
published: 2022-02-22
modified: 2022-04-09
keywords: ['nodejs','development','javascript']
tags: ["marketplace", "linode platform", "cloud manager"]
aliases: ['/products/tools/marketplace/guides/nodejs/','/guides/nodejs-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 970561
marketplace_app_name: "Node.js"
---

[Node.js](https://nodejs.org/en/) is a lightweight development platform for building fast and scalable applications using Javascript. Since it's based on Javascript, it's relatively easy to learn and has a large community with lots of resources. Node.js can be used for almost any time of web application, including websites, but its asynchronous nature shines when used to develop real-time data-intensive applications

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Node.js should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Node.js Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

The Node.js Marketplace App is running [Nginx](https://www.nginx.com/), [Node.js](https://nodejs.org/en/), and [NPM](https://www.npmjs.com/). Once deployed, a sample page should be running on your FQDN (if applicable) or the Compute Instance's Reverse DNS address.

### Accessing the Node.js App through the Command Line

The Node.js sample application is stored in the `app.js` file within `/var/www/[domain]/`.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Navigate to the directory in which the application is stored:

        cd /var/www/[domain]

1.  Open the sample application with your preferred command line text editor, such as [nano](/docs/guides/use-nano-to-edit-files-in-linux/) or [vim](/docs/guides/what-is-vi/).

        nano app.js

### Viewing the Node.js App through a Web Browser

Open your web browser and navigate to `https://[domain]/`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

## Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **Node.js** | JavaScript runtime environment |
| **NPM** | Node.js package manager |
| **NGINX** | Web server and reverse proxy |
| **UFW (Uncomplicated Firewall)** | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 are enabled with installation of this app. All other ports have the following firewall rules: deny (incoming), allow (outgoing). |

{{% content "marketplace-update-note-shortguide" %}}