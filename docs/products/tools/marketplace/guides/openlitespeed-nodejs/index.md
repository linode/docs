---
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy OpenLiteSpeed Node.js on a Linode Compute Instance. This provides you with a high performance web server to manage your Node.js application."
keywords: ['web server','nodejs','openlitespeed']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-12
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy OpenLiteSpeed Node.js through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Node.js OpenLiteSpeed](https://docs.litespeedtech.com/cloud/images/nodejs/)'
aliases: ['/guides/deploying-openlitespeed-nodejs-marketplace-app/','/guides/openlitespeed-nodejs-marketplace-app/']
---

The OpenLiteSpeed Node.js One-Click app automatically installs the performance web server OpenLiteSpeed and Node.js. This tends to be more than 4 times faster than Node.js with Nginx. OpenLiteSpeed features easy setup for SSL and RewriteRules. It is flexible and also supports Python and Ruby apps, as well as CMS software like WordPress.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** OpenLiteSpeed Node.js should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS 7, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the OpenLiteSpeed Node.js App

1.  Log in to your Compute Instance over SSH. See [Connecting to a Remote Server Over SSH
](/docs/guides/connect-to-server-over-ssh/) for assistance. You should see output similar to the following:

    ![OpenLiteSpeed Nose.js setup information](setupinfo-nodejs.png)

1.  You are then prompted to enter the domain you'd like to use for this instance. You can optionally use a custom domain provided you've already configured the *A Records* to point to this server's IPv4 and IPv6 addresses. Otherwise, you can skip this by pressing *CTRL+C* which will use the IP address or default RDNS of the Compute Instance.

    {{< note >}}
    For more documentation on how to assign a domain to your Linode, please review the [DNS Manager](/docs/products/networking/dns-manager/) guide for instructions on setting up your DNS records in the Cloud Manager, and read through [DNS Records: An Introduction](/docs/guides/dns-overview/) for general information about how DNS works.
    {{< /note >}}

Now that you’ve accessed your OpenLiteSpeed Node.js instance, check out [the official OpenLiteSpeed Node.js documentation](https://docs.litespeedtech.com/cloud/images/nodejs/) to learn how to further configure your OpenLiteSpeed Node.js instance.

{{< content "marketplace-update-note-shortguide">}}