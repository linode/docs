---
slug: how-to-deploy-redis-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: "Redis is an open-source, in-memory, data-structure store, with the optional ability to write and persist data to a disk, which can be used as a key-value database, cache, and message broker. Deploy a Redis instance using Linode's Marketplace Apps"
og_description: "Redis is an open-source, in-memory, data-structure store, with the optional ability to write and persist data to a disk, which can be used as a key-value database, cache, and message broker. Deploy a Redis instance using Linode's Marketplace Apps"
keywords: ['redis','data store','cluster','database']
tags: ["linode platform","database","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-13
modified_by:
  name: Linode
title: "How to Deploy Redis with Marketplace Apps"
h1_title: "Deploying Redis with Marketplace Apps"
contributor:
  name: Linode
external_resources:
- '[Introduction to Redis Data Types](https://redis.io/topics/data-types-intro)'
- '[Redis Replication](https://redis.io/topics/replication)'
aliases: ['/platform/marketplace/how-to-deploy-redis-with-marketplace-apps/','/platform/one-click/how-to-deploy-redis-with-one-click-apps/']
---

[Redis](https://redis.io/) is an open-source, in-memory, data-structure store, with the optional ability to write and persist data to a disk, which can be used as a key-value database, cache, and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets, and others.

### Linode Options

Provide configurations for your Linode server that will run your Redis installation:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by Redis Marketplace Apps, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Redis serves all data from memory, we recommend using a [High Memory Linode plan](https://www.linode.com/products/high-memory/). Depending on the type of environment (development or production) that you plan to use, your system resources may vary. See [Redis' Hardware Requirements](https://docs.redislabs.com/latest/rs/administering/designing-production/hardware-requirements/) for a detailed overview. You can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan later if you feel you need to increase or decrease your system resources. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Add Tags** | A tag to help organize and group your Linode resources. [Tags](/docs/quick-answers/linode-platform/tags-and-groups/) can be applied to Linodes, Block Storage Volumes, NodeBalancers, and Domains. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your Redis app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

There are several types of Redis deployments you can use, for example, a standalone Redis installation or a Redis cluster with a master and two replicas. As a next step, you should determine which type of deployment you will need for your use case by reviewing the resources provided below.

-  Learn about Redis Clusters by going through their related [tutorial](https://redis.io/topics/cluster-tutorial).
- Redis Sentinel is another deployment configuration focused on high availability. See the [Redis Sentinel](https://redis.io/topics/sentinel) documentation for more details.
- Read the [Redis Quickstart](https://redis.io/topics/quickstart) to learn about securing Redis and installing client libraries to use Redis with your applications.
- Refer to the [Redis configuration documentation](https://redis.io/topics/config) to learn about the Redis configuration file.

Once you have determined how you would like to configure your Redis deployment, connect to your [Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh) to complete your configuration.

{{< content "marketplace-update-note">}}
