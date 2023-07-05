---
slug: install-mongodb-on-ubuntu-16-04
description: 'Install MongoDB for document-oriented data storage on Ubuntu 16.04 (Xenial).'
keywords: ["nosql", "database", "mongodb", "key store", "ubuntu", "mongodb tutorial"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2016-05-20
title: 'Installing MongoDB on Ubuntu 16.04 (Xenial)'
title_meta: 'How To Install MongoDB on Ubuntu 16.04 (Xenial)'
external_resources:
 - '[Official MongoDB Documentation](https://docs.mongodb.com/manual/)'
 - '[MongoDB Project](http://www.mongodb.org/)'
 - '[Language-Specific MongoDB Drivers](https://docs.mongodb.com/ecosystem/drivers/)'
relations:
    platform:
        key: how-to-install-mongodb
        keywords:
            - distribution: Ubuntu 16.04
tags: ["ubuntu","database","nosql"]
aliases: ['/databases/mongodb/install-mongodb-on-ubuntu-16-04/']
authors: ["Linode"]
---

In this MongoDB tutorial, we explain how to install the database on Ubuntu 16.04, and then provide a short guide on some basic features and functions.

![Install MongoDB on Ubuntu 16.04](install-mongodb-ubuntu-16-04-title.png "Install MongoDB on Ubuntu 16.04")

MongoDB is a database engine that provides access to non-relational, document-oriented databases. It is part of the growing [NoSQL](https://en.wikipedia.org/wiki/NoSQL) movement, along with databases like Redis and Cassandra (although there are vast differences among the many non-relational databases).

MongoDB seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON output and specialized, language-specific bindings that make it particularly attractive for use in custom application development and rapid prototyping. MongoDB has been used in a number of large scale [production deployments](https://www.mongodb.com/community/deployments) and is currently one of the most popular database engines across all systems.

Since MongoDB can require a significant amount of RAM, we recommend using a [High Memory Linode](https://www.linode.com/pricing/) with this guide.

## Before You Begin

- Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

- Complete the sections of our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services.

- Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Add the MongoDB Repository

The `mongodb-server` package from the Ubuntu repository includes version 2.6. However, this version reached end of life in October 2016, so it should not be used in production environments. The most current version available is 4.0 and, as of this writing, the default Ubuntu repositories do not contain an updated package.

Because the Ubuntu repositories don't contain a current version, we'll need to use the MongoDB repository.

1.  Import the MongoDB public GPG key for package signing:

        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

2.  Add the MongoDB repository to your `sources.list.d` directory:

        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list

3.  Update your repositories. This allows `apt` to read from the newly added MongoDB repo:

        sudo apt-get update

## Install MongoDB

Now that the MongoDB repository has been added, we're ready to install the latest stable version of MongoDB:

    sudo apt-get install mongodb-org

This command installs `mongodb-org`, a meta-package that includes the following:

-   `mongodb-org-server` - The standard MongoDB daemon, and relevant init scripts and configurations
-   `mongodb-org-mongos` - The MongoDB Shard daemon
-   `mongodb-org-shell` - The MongoDB shell, used to interact with MongoDB via the command line
-   `mongodb-org-tools` - Contains a few basic tools to restore, import, and export data, as well as a variety of other functions.

These packages provide a good base that will serve most use cases, and we recommend installing them all. However, if you want a more minimal installation, you can selectively install packages from the above list rather than using the `mongodb-org` metapackage.

For more information on the installation process and options, refer to the [official MongoDB installation tutorial](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/).

## Configure MongoDB

The configuration file for MongoDB is located at `/etc/mongod.conf`, and is written in YAML format. Most of the settings are well commented within the file. We've outlined the default options below:

- `dbPath` indicates where the database files will be stored (`/var/lib/mongodb` by default)
- `systemLog` specifies the various logging options, explained below:
    - `destination` tells MongoDB whether to store the log output as a file or syslog
    - `logAppend` specifies whether to append new entries to the end of an existing log when the daemon restarts (as opposed to creating a backup and starting a new log upon restarting)
    - `path` tells the daemon where to send its logging information (`/var/log/mongodb/mongod.log` by default)
- `net` specifies the various network options, explained below:
    - `port` is the port on which the MongoDB daemon will run
    - `bindIP` specifies the IP addresses MongoDB to which binds, so it can listen for connections from other applications

These are only a few basic configuration options that are set by default.

We **strongly** recommend uncommenting the `security` section and adding the following:

{{< file "/etc/mongod.conf" conf >}}
security:
  authorization: enabled

{{< /file >}}


The `authorization` option enables [role-based access control](https://docs.mongodb.com/manual/core/authorization/) for your databases. If no value is specified, any user will have the ability to modify any database. We'll explain how to create database users and set their permissions later in this guide.

For more information on how to customize these and other values in your configuration file, refer to the [official MongoDB configuration tutorial](https://docs.mongodb.com/manual/reference/configuration-options/).

After making changes to the MongoDB configuration file, restart the service as shown in the following section.

## Start and Stop MongoDB

To start, restart, or stop the MongoDB service, issue the appropriate command from the following:

    sudo systemctl start mongod
    sudo systemctl restart mongod
    sudo systemctl stop mongod

You can also enable MongoDB to start on boot:

    sudo systemctl enable mongod

## Create Database Users

If you enabled role-based access control in the [Configure MongoDB](#configure-mongodb) section, create a user administrator with credentials for use on the database:

1.  Open the `mongo` shell:

        mongo

2.  By default, MongoDB connects to a database called `test`. Before adding any users, create a database to store user data for authentication:

        use admin

3.  Use the following command to create an administrative user with the ability to create other users on any database. For better security, change the values `mongo-admin` and `password`:

        db.createUser({user: "mongo-admin", pwd: "password", roles:[{role: "userAdminAnyDatabase", db: "admin"}]})

    Keep these credentials in a safe place for future reference. The output will display all the information written to the database except the password:

    {{< output >}}
Successfully added user: {
    "user" : "mongo-admin",
    "roles" : [
            {
                "role" : "userAdminAnyDatabase",
                "db" : "admin"
            }
    ]
}
{{< /output >}}

4.  Exit the mongo shell:

        quit()

5.  Test your connection to MongoDB with the credentials created in Step 3, using the `admin` database for authentication:

        mongo -u mongo-admin -p --authenticationDatabase admin

    The `-u`, `-p`, and `--authenticationDatabase` options in the above command are required in order to authenticate connections to the shell. Without authentication, the MongoDB shell can be accessed but will not allow connections to databases.

    The `mongo-admin` user created in Step 3 is purely administrative based on the roles specified. It is defined as an administrator of users for all databases, but does not have any database permissions itself. You may use it to create additional users and define their roles. If you are using multiple applications with MongoDB, set up different users with custom permissions for their corresponding databases.

6.  As the `mongo-admin` user, create a new database to store regular user data for authentication. The following example calls this database `user-data`:

        use user-data

7.  Permissions for different databases are handled in separate `roles` objects. This example creates the user, `example-user`, with read-only permissions for the `user-data` database and has read and write permissions for the `exampleDB` database that we'll create in the [Manage Data and Collections](#manage-data-and-collections) section below.

    Create a new, non-administrative user to enter test data. Change both `example-user` and `password` to something relevant and secure:

        db.createUser({user: "example-user", pwd: "password", roles:[{role: "read", db: "user-data"}, {role:"readWrite", db: "exampleDB"}]})

    To create additional users, repeat Steps 6 and 7 as the administrative user, creating new usernames, passwords and roles by substituting the appropriate values.

8.  Exit the mongo shell:

        quit()

For more information on access control and user management, as well as other tips on securing your databases, refer to the [MongoDB Security Documentation](https://docs.mongodb.com/manual/security).

## Manage Data and Collections

{{< content "mongodb-example-shortguide" >}}

## Additional MongoDB Functionality

As noted above, MongoDB has an available collection of language-specific drivers that can be used to interact with your databases from within non-JavaScript applications. One advantage these drivers provide is the ability to allow applications written in different languages to use the same database without the strict need for an object data mapper (ODM). If you do want to use an object data mapper, however, many well-supported ODMs are available.

The `mongodb-org-tools` package we installed also includes several other tools such as `mongodump` and `mongorestore` for creating and restoring backups and snapshots, as well as `mongoimport` and `mongoexport` for importing and exporting content from extended JSON, or supported CSV or TSV files.

To view the available options or how to use a particular method, append `.help()` to the end of your commands. For example, to see a list of options for the `find` method in Step 6 of [Manage Data and Collections](#manage-data-and-collections):

    db.exampleCollection.find().help()
