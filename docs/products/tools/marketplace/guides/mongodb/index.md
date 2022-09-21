---
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how you can deploy MongoDB, a database engine that provides access to non-relational, document-oriented databases, using the Linode Marketplace."
keywords: ['mongodb','marketplace', 'database']
tags: ["linode platform","database","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying MongoDB through the Linode Marketplace"
image: MongoDB_oneclickapps.png
contributor:
  name: Linode
external_resources:
 - '[Official MongoDB Documentation](https://docs.mongodb.com/manual/)'
 - '[MongoDB Project](http://www.mongodb.org/)'
 - '[Language-Specific MongoDB Drivers](https://docs.mongodb.com/ecosystem/drivers/)'
aliases: ['/platform/marketplace/deploying-mongodb-with-marketplace-apps/', '/platform/one-click/deploying-mongodb-with-one-click-apps/','/guides/deploying-mongodb-with-one-click-apps/','/guides/deploying-mongodb-with-marketplace-apps/','/guides/mongodb-marketplace-app/']
---

[MongoDB](https://www.mongodb.com/) is a database engine that provides access to non-relational, document-oriented databases. It is part of the growing [NoSQL](https://en.wikipedia.org/wiki/NoSQL) movement, along with databases like Redis and Cassandra (although there are vast differences among the many non-relational databases).

MongoDB seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON output and specialized, language-specific bindings that make it particularly attractive for use in custom application development and rapid prototyping. MongoDB has been used in a number of large scale [production deployments](https://www.mongodb.com/community/deployments) and is currently one of the most popular database engines across all systems.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** MongoDB should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though consider using a [High Memory Compute Instance](https://www.linode.com/products/high-memory/) for larger databases in a production environment.

### MongoDB Options

- **MongoDB admin user password** *(required)*: The Mongo admin user password.
- **MongoDB Version** *(required)*: Select the verison of MongoDB you'd like to install.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Email address for soa record:** The start of authority (SOA) email address for this server. This email address will be added to the SOA record for the domain. This is a required field if you want the installer to create DNS records.

## Getting Started after Deployment

### Access the MongoDB Shell

After MongoDB has finished deploying, you can access and administer it directly from the console.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Launch the [mongo shell](https://docs.mongodb.com/v4.4/mongo/) by running the following command. When prompted, enter the admin user password you set when creating this instance.

        mongo -u admin -p --authenticationDatabase admin

    The `-u`, `-p`, and `--authenticationDatabase` options in the above command are required in order to authenticate connections to the shell. Without authentication, the MongoDB shell can be accessed but will not allow connections to databases.

    The `admin` user is purely administrative based on the roles specified. It is defined as an administrator of users for all databases, but does not have any database permissions itself. You may use it to create additional users and define their roles. If you are using multiple applications with MongoDB, set up different users with custom permissions for their corresponding databases.

### Create a User Table

1.  As the `admin` user, create a new database to store regular user data for authentication. The following example calls this database `user-data`:

        use user-data

1.  Permissions for different databases are handled in separate `roles` objects. This example creates the user, `example-user`, with read-only permissions for the `user-data` database and has read and write permissions for the `exampleDB` database that we'll create in the [Manage Data and Collections](#manage-data-and-collections) section below.

    Create a new, non-administrative user to enter test data. Change both `example-user` and `password` to something relevant and secure:

        db.createUser({user: "example-user", pwd: "password", roles:[{role: "read", db: "user-data"}, {role:"readWrite", db: "exampleDB"}]})

    To create additional users, repeat this step as the administrative user, creating new usernames, passwords and roles by substituting the appropriate values.

1.  Exit the mongo shell:

        quit()

For more information on access control and user management, as well as other tips on securing your databases, refer to the [MongoDB Security Documentation](https://docs.mongodb.com/manual/security).

### Manage Data and Collections

{{< content "mongodb-example-shortguide" >}}

## Next Steps

{{< content "marketplace-update-note-shortguide">}}

For more on MongoDB, checkout the following guides:

- [Creating a MongoDB Replica Set](/docs/guides/create-a-mongodb-replica-set/)
- [Building Database Clusters with MongoDB](/docs/guides/build-database-clusters-with-mongodb/)
