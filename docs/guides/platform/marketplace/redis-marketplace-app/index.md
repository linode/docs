---
slug: redis-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how you can install Redis database, a open-source, in-memory, data structure store, with optional write and persistence of data on a disk."
keywords: ['redis','data store','cluster','database']
tags: ["linode platform","database","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-13
modified: 2022-03-01
modified_by:
  name: Linode
title: "Deploying Redis through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Introduction to Redis Data Types](https://redis.io/topics/data-types-intro)'
- '[Redis Replication](https://redis.io/topics/replication)'
aliases: ['/platform/marketplace/how-to-deploy-redis-with-marketplace-apps/','/platform/one-click/how-to-deploy-redis-with-one-click-apps/','/guides/how-to-deploy-redis-with-one-click-apps/','/guides/how-to-deploy-redis-with-marketplace-apps/']
---

[Redis](https://redis.io/) is an open-source, in-memory, data-structure store, with the optional ability to write and persist data to a disk, which can be used as a key-value database, cache, and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets, and others.

## Deploying the Redis Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

### Redis Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email for the server** | The start of authority (SOA) email address for this server. This email address will be added to the SOA record for the domain. This is a required field if you want the installer to create DNS records. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your BeEF instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

## Configuration Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/). Some options may be limited or have recommended values based on this Marketplace App:

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though consider using a [High Memory Compute Instance](https://www.linode.com/products/high-memory/) for larger databases in a production environment.

## Getting Started after Deployment

### Access the Redis CLI

1.  Log in to your new Compute Instance through [Lish](/docs/guides/using-the-lish-console/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using either the `root` user or limited user and the associated password you entered when creating the instance.

1.  To use the redis-cli, run either of the commands below:

    - `redis-cli`: This opens the interactive mode where you can type in whichever commands you wish.
    - `redis-cli [argument]`, where *[argument]* is the argument or command you wish to run. For instance, running `redis-cli ping` should result in the output of `PONG` if redis is configured properly.

For more information about the redis-cli and the commands you have available, see [redis-cli, the Redis command line interface](https://redis.io/topics/rediscli).

### Determining How to Use Redis

There are several types of Redis configurations you can use. For example, you can configure Redis as a standalone Redis installation or a Redis cluster with a primary (master) and two replicas. As a next step, you should determine which type of deployment you require for your use case by reviewing the resources provided below.

-  Learn about Redis Clusters by going through their related [tutorial](https://redis.io/topics/cluster-tutorial).
- Redis Sentinel is another deployment configuration focused on high availability. See the [Redis Sentinel](https://redis.io/topics/sentinel) documentation for more details.
- Read the [Redis Quickstart](https://redis.io/topics/quickstart) to learn about securing Redis and installing client libraries to use Redis with your applications.
- Refer to the [Redis configuration documentation](https://redis.io/topics/config) to learn about the Redis configuration file.

{{< content "marketplace-update-note-shortguide">}}
