---
slug: openlitespeed-rails
title: "Deploy OpenLiteSpeed Rails through the Linode Marketplace"
description: "Deploy OpenLiteSpeed Rails on a Linode Compute Instance. This provides you with a high performance web server to manage your Rails application."
published: 2021-11-12
modified: 2022-03-08
keywords: ['web server','Rails','openlitespeed']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[OpenLiteSpeed Rails](https://docs.litespeedtech.com/cloud/images/rails/)'
aliases: ['/products/tools/marketplace/guides/openlitespeed-rails/','/guides/deploying-openlitespeed-rails-marketplace-app/','/guides/openlitespeed-rails-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

The OpenLiteSpeed Rails app automatically installs the performance web server OpenLiteSpeed, Ruby, and Rails. OpenLiteSpeed features easy setup for SSL and RewriteRules. It is flexible and also supports Python and Node.js apps, as well as CMS software like WordPress.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** OpenLiteSpeed Rails should be fully installed within 20-25 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS 7, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the OpenLiteSpeed Rails App

1.  Log in to your Compute Instance over SSH. See [Connecting to a Remote Server Over SSH
](/docs/guides/connect-to-server-over-ssh/) for assistance. You should see output similar to the following:

    ![OpenLiteSpeed Rails setup information](setupinfo-rails.png)

1.  You are then prompted to enter the domain you'd like to use for this instance. You can optionally use a custom domain provided you've already configured the *A Records* to point to this server's IPv4 and IPv6 addresses. Otherwise, you can skip this by pressing *CTRL+C* which will use the IP address or default RDNS of the Compute Instance.

    {{< note >}}
    For more documentation on how to assign a domain to your Linode, please review the [DNS Manager](/docs/products/networking/dns-manager/) guide for instructions on setting up your DNS records in Cloud Manager, and read through [DNS Records: An Introduction](/docs/guides/dns-overview/) for general information about how DNS works.
    {{< /note >}}

Now that you’ve accessed your OpenLiteSpeed Rails instance, check out [the official OpenLiteSpeed Rails documentation](https://docs.litespeedtech.com/cloud/images/rails/) to learn how to further configure your OpenLiteSpeed Rails instance.

{{% content "marketplace-update-note-shortguide" %}}