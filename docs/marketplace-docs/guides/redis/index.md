---
title: "Deploy Redis through the Linode Marketplace"
description: "This guide shows how you can install Redis database, a open-source, in-memory, data structure store, with optional write and persistence of data on a disk."
published: 2020-03-13
modified: 2025-04-03
keywords: ['redis','data store','cluster','database']
tags: ["linode platform","database","marketplace","cloud-manager"]
external_resources:
- '[Introduction to Redis Data Types](https://redis.io/topics/data-types-intro)'
- '[Redis Replication](https://redis.io/topics/replication)'
aliases: ['/products/tools/marketplace/guides/redis/','/platform/marketplace/how-to-deploy-redis-with-marketplace-apps/','/platform/one-click/how-to-deploy-redis-with-one-click-apps/','/guides/how-to-deploy-redis-witwh-one-click-apps/','/guides/how-to-deploy-redis-with-marketplace-apps/','/guides/redis-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 607488
marketplace_app_name: "Redis"
---

[Redis](https://redis.io/) is an open-source, in-memory, data-structure store, with the optional ability to write and persist data to a disk, which can be used as a key-value database, cache, and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets, and others.

The One-Click App for Redis installs Redis version 7.2.7.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Redis should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used, though consider using a [High Memory Compute Instance](https://www.linode.com/products/high-memory/) for larger databases in a production environment.

### Redis Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

### Self Signed SSL/TLS Options

- **Country or Region:** Enter the country or region for you or your organization.

- **State or Province:** Enter the state or province for you or your organization.

- **Locality:** Enter the town or other locality for you or your organization.

- **Organization:** Enter the name of your organization.

- **Email Address:** Enter the email address you wish to use for your certificate file.

- **CA Common Name:** The common name that will be shared as the authority for all SSL certificates. Example: "Redis CA"

- **Client Count:** Generate up to ten SSL certificates for external clients connecting to Redis. 

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

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


### Access the Redis CLI

1.  Once you have logged in and obtained the credentials, you can use the redis-cli. Redis is configured to require authentication for the default user, and a valid client SSL certificate. 

    - `redis-cli --tls --cacert /etc/redis/ssl/ca/ca.crt --cert /etc/redis/ssl/certs/client1.crt --key /etc/redis/ssl/keys/client1.key.pem -a $REDIS_DEFAULT_USER_PASSWORD`: This opens the interactive mode where you can type in whichever commands you wish. 

For more information about the redis-cli and the commands you have available, see [redis-cli, the Redis command line interface](https://redis.io/topics/rediscli).

### Determining How to Use Redis

There are several types of Redis configurations you can use. For example, you can configure Redis as a standalone Redis installation or a Redis cluster with a primary (master) and two replicas. As a next step, you should determine which type of deployment you require for your use case by reviewing the resources provided below.

- Learn about Redis Clusters by going through their related [tutorial](https://redis.io/topics/cluster-tutorial).
- Redis Sentinel is another deployment configuration focused on high availability. See the [Redis Sentinel](https://redis.io/topics/sentinel) documentation for more details.
- Read the [Redis Quickstart](https://redis.io/topics/quickstart) to learn about securing Redis and installing client libraries to use Redis with your applications.
- Refer to the [Redis configuration documentation](https://redis.io/topics/config) to learn about the Redis configuration file.

{{% content "marketplace-update-note-shortguide" %}}