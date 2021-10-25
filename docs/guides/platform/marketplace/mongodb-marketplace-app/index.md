---
slug: mongodb-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy MongoDB on Linode using Marketplace Apps."
keywords: ['mongodb','marketplace', 'marketplace apps']
tags: ["linode platform","database","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2021-09-16
modified_by:
  name: Linode
title: "How to Deploy MongoDB with Marketplace Apps"
h1_title: "Deploying MongoDB with Marketplace Apps"
image: MongoDB_oneclickapps.png
contributor:
  name: Linode
external_resources:
 - '[Official MongoDB Documentation](https://docs.mongodb.com/manual/)'
 - '[MongoDB Project](http://www.mongodb.org/)'
 - '[Language-Specific MongoDB Drivers](https://docs.mongodb.com/ecosystem/drivers/)'
aliases: ['/platform/marketplace/deploying-mongodb-with-marketplace-apps/', '/platform/one-click/deploying-mongodb-with-one-click-apps/','/guides/deploying-mongodb-with-marketplace-apps/']
---

MongoDB is a database engine that provides access to non-relational, document-oriented databases. It is part of the growing [NoSQL](https://en.wikipedia.org/wiki/NoSQL) movement, along with databases like Redis and Cassandra (although there are vast differences among the many non-relational databases).

MongoDB seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON output and specialized, language-specific bindings that make it particularly attractive for use in custom application development and rapid prototyping. MongoDB has been used in a number of large scale [production deployments](https://www.mongodb.com/community/deployments) and is currently one of the most popular database engines across all systems.

## Deploying the MongoDB Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

### MongoDB Options

Here are the additional options available for this Marketplace App:

- **Mongo password** *(required)*: Password for your MongoDB admin account.

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 9
- **Recommended minimum plan:** All plan types and sizes can be used, though consider using a [High Memory Compute Instance](https://www.linode.com/products/high-memory/) for larger databases in a production environment.

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

{{< content "marketplace-update-note-shortguide">}}

For more on MongoDB, checkout the following guides:

- [Creating a MongoDB Replica Set](/docs/databases/mongodb/create-a-mongodb-replica-set/)
- [Building Database Clusters with MongoDB](/docs/databases/mongodb/build-database-clusters-with-mongodb/)
