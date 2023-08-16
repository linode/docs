---
description: "Deploy the open source message broker RabbitMQ to manage sending and receiving data using Marketplace Apps."
keywords: ['rabbitmq', 'message broker', 'scheduling']
tags: ["debian", "marketplace", "web applications", "linode platform", "cloud manager"]
published: 2020-09-28
modified: 2023-05-31
modified_by:
  name: Linode
title: "Deploy RabbitMQ through the Linode Marketplace"
external_resources:
- '[RabbitMQ](https://www.rabbitmq.com/)'
aliases: ['/platform/marketplace/deploy-rabbitmq-with-marketplace-apps/', '/platform/marketplace/deploy-rabbitmq-with-one-click-apps/','/guides/deploy-rabbitmq-with-one-click-apps/','/guides/deploy-rabbitmq-server-with-marketplace-apps/','/guides/deploy-rabbitmq-with-marketplace-apps/','/guides/rabbitmq-marketplace-app/']
authors: ["Linode"]
---

RabbitMQ is a popular open source **message broker**, or a tool that enables and empowers components of a system to communicate from a centralized source or application. By "translating" data from a number of different sources into a unified language, RabbitMQ allows component services to interact with each other through a centralized method.

The RabbitMQ Marketplace App installs a RabbitMQ server and a basic default configuration to assist with messaging tasks. By accessing The RabbitMQ Management console, you can further configure RabbitMQ and view important analytics at any time.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** RabbitMQ should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used.

### RabbitMQ Options

- **RabbitMQ Username** *(required)*: The username for accessing the rabbitMQ management console.
- **RabbitMQ Password** *(required)*: The user password for SSH access to the Linode.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started After Deployment

1.  Open your web browser and navigate to the following URL, replacing *[ip-address]* with your Compute Instance's IPv4 address or default rDNS domain. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses.

    ```command
    http://[ip-address]:15672
    ```

1.  In the login form that appears, enter the username and password you created during the deployment. Then, click the **Login** button.

    ![Screenshot of the RabbitMQ Login page](rabbitmq-login.png)

1.  After you login successfully, you have full access to the RabbitMQ Management Console. From you, you can start configuring your application. To learn more about using RabbitMQ, visit the official [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html) page.

    ![Screenshot of the RabbitMQ Management Console](rabbitmq-dashboard.png)

{{< content "marketplace-update-note-shortguide">}}