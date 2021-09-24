---
slug: mistio-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Deploy a Mist.io Server on Linode using Marketplace Apps."
keywords: [ 'mist.io', 'marketplace', 'server']
tags: ["cloud-manager", "linode platform", "marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-18
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying Mist.io through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Mist.io Official](https://mist.io/)'
aliases: ['/platform/marketplace/deploy-mistio-with-marketplace-apps/', '/platform/one-click/deploy-mistio-with-one-click-apps/','/guides/deploy-mistio-with-marketplace-apps/']
---

[Mist.io](https://mist.io/) is an open source, multi-cloud management platform. Mist supports all popular infrastructure technologies including public clouds, private clouds, hypervisors, containers, and bare metal servers. It provides a unified interface for performing common management tasks like provisioning, orchestration, monitoring, automation, and cost analysis. It also comes with a RESTful API so you can easily integrate it in your existing workflows.

## Deploying the Mist.io Marketplace App

{{< content deploy-marketplace-apps-shortguide >}}

**Software installation should complete within 5-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### Mist.io Options

| **Field** | **Description** |
|:--------------|:------------|
| **Mist admin user's email** | The e-mail address of the administrator. Used as a log-in credential similar to a username. *Required* |
| **Mist admin user's password** | The password of the Mist.io administrator account. *Required* |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 9 and Debian 10
- **Recommended plan:** 8GB Compute Instance

## Getting Started After Deployment

Once the Mist.io server is successfully created, a few additional steps must be completed to be able to begin using the application.

### Log In to Mist.io

1. In a web browser, enter your Linode's [IP address](/docs/guides/find-your-linodes-ip-address/) or the [Domain](/docs/guides/dns-manager/) associated with it to access your Mist.io App's login screen.

1. Click on the **Sign in** button at the top right of the page.

    ![Mist.io get started](get-started-mist.png)

1. Enter your Mist admin `Email Address` and `Password` in their respective fields to complete the log-in process.

    ![Mist.io Account Creation](account-creation-mist.png)

### Next Steps

After creating your account, create a name for your organization, [Add Clouds](https://docs.mist.io/category/75-adding-clouds-bare-metal-and-containers) to manage, as well as any separate [virtual machines, containers,](https://docs.mist.io/category/158-machines) and more.

For more information and guidance for getting the most out of your Mist.io App, check out the following:

* [Mist User Documentation](https://docs.mist.io) for quick start and other informative articles.
* [Mist API Documentation](https://mist.io/swagger) for integration with your existing workflows.
* [Mist Community Edition Github Repo](https://github.com/mistio/mist-ce/blob/master/README.md) for additional configuration and maintenance instructions.

## Software Included

The Mist.io Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Docker Compose**](https://docs.docker.com/compose/) | Tool for defining and running multi-container Docker applications.|
| [**Mist Community Edition v4.3.8**](https://github.com/mistio/mist-ce) | An open source Mult-Cloud Management Platform.|

{{< content "marketplace-update-note-shortguide">}}
