---
slug: rabbitmq-marketplace-app
author:
  name: Ryan Syracuse
  email: docs@linode.com
description: "Deploy the open source message broker RabbitMQ to manage sending and receiving data using Marketplace Apps."
keywords: ['rabbitmq', 'message broker', 'scheduling']
tags: ["debian", "marketplace", "web applications", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-28
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying RabbitMQ through the Linode Marketplace"
external_resources:
- '[RabbitMQ](https://www.rabbitmq.com/)'
aliases: ['/platform/marketplace/deploy-rabbitmq-with-marketplace-apps/', '/platform/marketplace/deploy-rabbitmq-with-one-click-apps/','/guides/deploy-rabbitmq-server-with-marketplace-apps/']
---

## RabbitMQ Marketplace App

RabbitMQ is a popular open source **message broker**, or a tool that enables and empowers components of a system to communicate from a centralized source or application. By "translating" data from a number of different sources into a unified language, RabbitMQ allows component services to interact with each other through a centralized method.

The RabbitMQ Marketplace App installs a RabbitMQ server and a basic default configuration to assist with messaging tasks. By accessing The RabbitMQ Management console, you can further configure RabbitMQ and view important analytics at any time.

### Deploy a RabbitMQ Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

### RabbitMQ Marketplace App Options

The following configuration options create a secure [Limited User](/docs/security/basics/securing-your-server/#add-a-limited-user-account) to run the RabbitMQ Media Server.


| **Configuration** | **Description** |
|--------------|------------|
| **RabbitMQ Username** | The [username](/docs/security/basics/securing-your-server/#add-a-limited-user-account) for accessing the rabbitMQ management console. *Required*. |
| **RabbitMQ Password** | The user password for SSH access to the Linode. *Required*. |


### Linode Options

The following configuration options are possible for the Linode server:

| **Configuration** | **Description** |
|--------------|------------|
| **Select an Image** | Debian 10 is currently the only image supported by the RabbitMQ Marketplace App. *Required*. |
| **Region** | The region where you would like the Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a data center, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of the data centers. *Required*. |
| **Linode Plan** | The Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). RabbitMQ can be supported by any Linode plan, though larger plans are recommended if you want to run additional applications. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for the Linode, which must be unique between all of the Linodes on your account. This name helps you identify the server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for the Linode instance. This password must be provided when you access the root user. The password must meet complexity strength validation requirements for a strong password. The root password can be used to perform any action on the server, so make it long, complex, and unique. *Required*. |

When you have provided all required Linode Options, select on the **Create** button. **The Rabbit app completes installation anywhere between 1-3 minutes after the Linode has finished provisioning**.

### Software Included

The RabbitMQ Marketplace App installs the following required software on the Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**RabbitMQ Server**](https://www.rabbitmq.com/download.html) | The RabbitMQ server software is an Open Source Message broker, used to assist component services to communicate. |

{{< content "marketplace-update-note-shortguide">}}

## Getting Started After Deployment

After the RabbitMQ Server has been deployed, you can access the management console by entering the [public IPv4 address](/docs/guides/find-your-linodes-ip-address/) of the Linode followed by port `15672`:

        https://203.0.113.0:15672

The following login page appears:

![RabbitMQ Login](rabbitmq-login.png "RabbitMQ Login.")

To log in, enter the `RabbitMQ username` and `RabbitMQ Password` set as a [configuration option](#RabbitMQ-Marketplace-App-Options) before you created the server. After you login successfully, you have full access to the RabbitMQ Management Console.

![RabbitMQ Management Console](rabbitmq-management.png "RabbitMQ Management Console.")





