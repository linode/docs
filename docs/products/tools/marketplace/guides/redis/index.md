---
description: "This guide shows how you can install Redis database, a open-source, in-memory, data structure store, with optional write and persistence of data on a disk."
keywords: ['redis','data store','cluster','database']
tags: ["linode platform","database","marketplace","cloud-manager"]
published: 2020-03-13
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Redis through the Linode Marketplace"
external_resources:
- '[Introduction to Redis Data Types](https://redis.io/topics/data-types-intro)'
- '[Redis Replication](https://redis.io/topics/replication)'
aliases: ['/platform/marketplace/how-to-deploy-redis-with-marketplace-apps/','/platform/one-click/how-to-deploy-redis-with-one-click-apps/','/guides/how-to-deploy-redis-with-one-click-apps/','/guides/how-to-deploy-redis-with-marketplace-apps/','/guides/redis-marketplace-app/']
authors: ["Linode"]
---

[Redis](https://redis.io/) is an open-source, in-memory, data-structure store, with the optional ability to write and persist data to a disk, which can be used as a key-value database, cache, and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets, and others.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Redis should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though consider using a [High Memory Compute Instance](https://www.linode.com/products/high-memory/) for larger databases in a production environment.

### Redis Options

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Access the Redis CLI

1.  Log in to your new Compute Instance through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using either the `root` user or limited user and the associated password you entered when creating the instance.

1.  To use the redis-cli, run either of the commands below:

    - `redis-cli`: This opens the interactive mode where you can type in whichever commands you wish.
    - `redis-cli [argument]`, where *[argument]* is the argument or command you wish to run. For instance, running `redis-cli ping` should result in the output of `PONG` if redis is configured properly.

For more information about the redis-cli and the commands you have available, see [redis-cli, the Redis command line interface](https://redis.io/topics/rediscli).

### Determining How to Use Redis

There are several types of Redis configurations you can use. For example, you can configure Redis as a standalone Redis installation or a Redis cluster with a primary (master) and two replicas. As a next step, you should determine which type of deployment you require for your use case by reviewing the resources provided below.

- Learn about Redis Clusters by going through their related [tutorial](https://redis.io/topics/cluster-tutorial).
- Redis Sentinel is another deployment configuration focused on high availability. See the [Redis Sentinel](https://redis.io/topics/sentinel) documentation for more details.
- Read the [Redis Quickstart](https://redis.io/topics/quickstart) to learn about securing Redis and installing client libraries to use Redis with your applications.
- Refer to the [Redis configuration documentation](https://redis.io/topics/config) to learn about the Redis configuration file.

{{< content "marketplace-update-note-shortguide">}}