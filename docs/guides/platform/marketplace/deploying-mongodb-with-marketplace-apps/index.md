---
slug: deploying-mongodb-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy MongoDB on Linode using Marketplace Apps.'
og_description: 'Deploy MongoDB on Linode using Marketplace Apps.'
keywords: ['mongodb','marketplace', 'marketplace apps']
tags: ["linode platform","database","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2020-03-11
modified_by:
  name: Linode
title: "How to Deploy MongoDB with Marketplace Apps"
h1_title: "Deploying MongoDB with Marketplace Apps"
image: feature.png
contributor:
  name: Linode
external_resources:
 - '[Official MongoDB Documentation](https://docs.mongodb.com/manual/)'
 - '[MongoDB Project](http://www.mongodb.org/)'
 - '[Language-Specific MongoDB Drivers](https://docs.mongodb.com/ecosystem/drivers/)'
aliases: ['/platform/marketplace/deploying-mongodb-with-marketplace-apps/', '/platform/one-click/deploying-mongodb-with-one-click-apps/']
---

## MongoDB Marketplace App

MongoDB is a database engine that provides access to non-relational, document-oriented databases. It is part of the growing [NoSQL](https://en.wikipedia.org/wiki/NoSQL) movement, along with databases like Redis and Cassandra (although there are vast differences among the many non-relational databases).

MongoDB seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON output and specialized, language-specific bindings that make it particularly attractive for use in custom application development and rapid prototyping. MongoDB has been used in a number of large scale [production deployments](https://www.mongodb.com/community/deployments) and is currently one of the most popular database engines across all systems.

### Deploy a MongoDB Marketplace App

{{< content "deploy-marketplace-apps">}}

The [MongoDB Options](#mongodb-options) section of this guide provides details on all available configuration options for this app.

### MongoDB Options

You can configure your Drupal App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Mongo password** | Password for your MongoDB admin account. *Required*. |

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by MongoDB Marketplace Apps, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Since MongoDB can require a significant amount of RAM, we recommend using a [High Memory Linode](https://www.linode.com/pricing/). You can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan later if you feel you don't need you need these resources are needed. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your MongoDB app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

### Access MongoDB

After MongoDB has finished installing, you will be able to access MongoDB from the console via ssh with your Linode's IPv4 address:

1.  [SSH into your Linode](/docs/getting-started/#connect-to-your-linode-via-ssh) and [create a limited user account](/docs/security/securing-your-server/#add-a-limited-user-account).

1.  Log out and log back in as your limited user account.

1.  Update your server:

        sudo apt-get update && apt-get upgrade

1.  Access MongoDB with the admin account password you set when launching the Marketplace App:

        mongo -u admin -p --authenticationDatabase admin

    The `-u`, `-p`, and `--authenticationDatabase` options in the above command are required in order to authenticate connections to the shell. Without authentication, the MongoDB shell can be accessed but will not allow connections to databases.

    The `admin` user is purely administrative based on the roles specified. It is defined as an administrator of users for all databases, but does not have any database permissions itself. You may use it to create additional users and define their roles. If you are using multiple applications with MongoDB, set up different users with custom permissions for their corresponding databases.

1.  As the `admin` user, create a new database to store regular user data for authentication. The following example calls this database `user-data`:

        use user-data

1.  Permissions for different databases are handled in separate `roles` objects. This example creates the user, `example-user`, with read-only permissions for the `user-data` database and has read and write permissions for the `exampleDB` database that we'll create in the [Manage Data and Collections](#manage-data-and-collections) section below.

    Create a new, non-administrative user to enter test data. Change both `example-user` and `password` to something relevant and secure:

        db.createUser({user: "example-user", pwd: "password", roles:[{role: "read", db: "user-data"}, {role:"readWrite", db: "exampleDB"}]})

    To create additional users, repeat this step as the administrative user, creating new usernames, passwords and roles by substituting the appropriate values.

1.  Exit the mongo shell:

        quit()

For more information on access control and user management, as well as other tips on securing your databases, refer to the [MongoDB Security Documentation](https://docs.mongodb.com/manual/security).

## Manage Data and Collections

{{< content "mongodb-example-shortguide" >}}

## Next Steps

{{< content "marketplace-update-note">}}

For more on MongoDB, checkout the following guides:

- [Creating a MongoDB Replica Set](/docs/databases/mongodb/create-a-mongodb-replica-set/)
- [Building Database Clusters with MongoDB](/docs/databases/mongodb/build-database-clusters-with-mongodb/)
