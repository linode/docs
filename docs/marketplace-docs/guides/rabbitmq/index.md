---
title: "Deploy RabbitMQ through the Linode Marketplace"
description: "Deploy the open source message broker RabbitMQ to manage sending and receiving data using Marketplace Apps."
published: 2020-09-28
modified: 2023-05-31
keywords: ['rabbitmq', 'message broker', 'scheduling']
tags: ["debian", "marketplace", "web applications", "linode platform", "cloud manager"]
external_resources:
- '[RabbitMQ](https://www.rabbitmq.com/)'
aliases: ['/products/tools/marketplace/guides/rabbitmq/','/platform/marketplace/deploy-rabbitmq-with-marketplace-apps/', '/platform/marketplace/deploy-rabbitmq-with-one-click-apps/','/guides/deploy-rabbitmq-with-one-click-apps/','/guides/deploy-rabbitmq-server-with-marketplace-apps/','/guides/deploy-rabbitmq-with-marketplace-apps/','/guides/rabbitmq-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

RabbitMQ is a popular open source **message broker**, or a tool that enables and empowers components of a system to communicate from a centralized source or application. By "translating" data from a number of different sources into a unified language, RabbitMQ allows component services to interact with each other through a centralized method.

The RabbitMQ Marketplace App installs a RabbitMQ server and a basic default configuration to assist with messaging tasks. By accessing The RabbitMQ Management console, you can further configure RabbitMQ and view important analytics at any time.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** RabbitMQ should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### RabbitMQ Options

- **Email address** *(required)*: Email address to use for generating the SSL certificates and configuring the server and DNS records.
- **Allowed IPs** *(required)*: IP addresses allowed to access the Management UI.
- **The version of RabbitMQ you'd like installed** *(required)*: RabbitMQ version to be installed during the setup.
- **RabbitMQ Admin Username** *(required)*: RabbitMQ admin username.
- **RabbitMQ Username** *(required)*: RabbitMQ limited AMQP user. Make sure to use a username different from the **RabbitMQ Admin Username**.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

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

## Getting Started After Deployment

To get started:

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you didn't enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). To learn more on viewing the rDNS value, see [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/). Make sure to use the `https` prefix in the URL to access the website securely.

1. Log in with your username and password found in your /home/$USERNAME/.credentials file.

    ![Screenshot of the RabbitMQ Login page](rabbitmq-login.png)

Now, you have full access to the RabbitMQ Management Console and you can start configuring your application. To learn more on RabbitMQ, see [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html).

    ![Screenshot of the RabbitMQ Management Console](rabbitmq-dashboard.png)

{{% content "marketplace-update-note-shortguide" %}}