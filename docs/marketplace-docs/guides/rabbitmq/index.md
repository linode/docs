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

- **Supported distributions:** Ubuntu 24.04
- **Recommended minimum plan:** All plan types and sizes can be used.

### RabbitMQ Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates as well as configuring the server and DNS records.
- **Allowed IPs** *(required)*: IP addresses allowed to access the Management UI.
- **The version of RabbitMQ you'd like installed** *(required)*: This is the version of RabbitMQ that is installed during setup.
- **RabbitMQ Admin Username** *(required)*: RabbitMQ Admin Username.
- **RabbitMQ Username** *(required)*: RabbitMQ limited AMQP user (Please ensure the user is different then the Admin username).

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app has been *fully* deployed, you need to obtain the credentials from the server.

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console:** Within Cloud Manager, navigate to **Linodes** from the left menu, select the Compute Instance you just deployed, and click the **Launch LISH Console** button. Log in as the `root` user. See [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH:** Log in to your Compute Instance over SSH using the `root` user. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

1.  Once logged in, access the credentials file by running the following command:

    ```command
    cat /home/$USERNAME/.credentials
    ```

1.  This displays the passwords that were automatically generated when the instance was deployed. Once you save these passwords, you can safely delete this file.

## Getting Started After Deployment

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you did not enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing the rDNS value. Ensure that you are securely accessing the website by prefixing `https` to the URL.

1.  In the login form that appears, enter the username and password found in your /home/$USERNAME/.credentials file. Then, click the **Login** button.

    ![Screenshot of the RabbitMQ Login page](rabbitmq-login.png)

1.  After you login successfully, you have full access to the RabbitMQ Management Console. From you, you can start configuring your application. To learn more about using RabbitMQ, visit the official [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html) page.

    ![Screenshot of the RabbitMQ Management Console](rabbitmq-dashboard.png)

{{% content "marketplace-update-note-shortguide" %}}