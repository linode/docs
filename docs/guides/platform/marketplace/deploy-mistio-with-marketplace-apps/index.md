---
slug: deploy-mistio-with-marketplace-apps
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy a Mist.io Server on Linode using Marketplace Apps.'
og_description: 'Deploy a Mist.io Server on Linode using Marketplace Apps.'
keywords: [ 'mist.io', 'marketplace', 'server']
tags: ["cloud-manager", "linode platform", "marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-18
modified: 2020-03-18
modified_by:
  name: Linode
title: "How to Deploy a Mist.io Server with Marketplace Apps"
h1_title: "Deploying a Mist.io Server with Marketplace Apps"
contributor:
  name: Linode
external_resources:
- '[Mist.io Official](https://mist.io/)'
aliases: ['/platform/marketplace/deploy-mistio-with-marketplace-apps/', '/platform/one-click/deploy-mistio-with-one-click-apps/']
---

## Mist.io Marketplace App

[Mist.io](https://mist.io/) is an open source, multi-cloud management platform. Mist supports all popular infrastructure technologies including public clouds, private clouds, hypervisors, containers, and bare metal servers. It provides a unified interface for performing common management tasks like provisioning, orchestration, monitoring, automation, and cost analysis. It also comes with a RESTful API so you can easily integrate it in your existing workflows.

## Deploy Mist.io with Marketplace Apps

{{< content deploy-marketplace-apps >}}

### Mist.io Options

| **Field** | **Description** |
|:--------------|:------------|
| **Mist admin user's email** | The e-mail address of the administrator. Used as a log-in credential similar to a username. *Required* |
| **Mist admin user's password** | The password of the Mist.io administrator account. *Required* |

### Linode Options

After providing the app-specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Select an Image** | Debian 9 and Debian 10 are currently the only images supported by the Mist.io Marketplace App, and are pre-selected on the Linode creation page. *Required* |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). **An 8GB Linode is recommended for your Mist.io App.** The Linode plan that you select should be appropriate for the amount of data transfer, users, storage, and other stress that may affect the performance of server.  *Required* |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required* |

When you've provided all required Linode Options, click on the **Create** button. **Your Mist.io app will complete installation anywhere between 5-15 minutes after your Linode has finished provisioning**.

## Getting Started After Deployment

Once the Mist.io server is successfully created, a few additional steps must be completed to be able to begin using the application.

### Log In to Mist.io

1. In a web browser, enter your Linode's [IP address](docs/guides/find-your-linodes-ip-address/) or the [Domain](docs/guides/dns-manager/) associated with it to access your Mist.io App's login screen.

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

### Software Included

The Mist.io Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Docker Compose**](https://docs.docker.com/compose/) | Tool for defining and running multi-container Docker applications.|
| [**Mist Community Edition v4.3.8**](https://github.com/mistio/mist-ce) | An open source Mult-Cloud Management Platform.|

{{< content "marketplace-update-note">}}
