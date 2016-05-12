---
author:
  name: Linode
  email: docs@linode.com
description: 'Install MongoDB for use in application development on Ubuntu 16.04 (Xenial).'
keywords: 'nosql,database,mongodb,key store'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, April 28th, 2016
modified_by:
  name: Phil Zona
published: 'Thursday, April 28th, 2016'
title: 'MongoDB on Ubuntu 16.04 (Xenial)'
external_resources:
 - '[Official MongoDB Documentation](https://docs.mongodb.org/v2.6/)'
 - '[MongoDB Project](http://www.mongodb.org/)'
 - '[MongoDB Documentation](http://docs.mongodb.org/v2.6/)'
 - '[Language-Specific MongoDB Drivers](http://docs.mongodb.org/ecosystem/drivers/)'
---

MongoDB is a database engine that provides access to non-relational, document-oriented databases. It is part of the growing NoSQL movement, which seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON output and specialized language specific bindings that make it particularly attractive for use in custom application development. MongoDB has been used in a number of large scale [production deployments](https://www.mongodb.org/community/deployments) and is currently one of the most popular database engines across all systems.

## Before You Begin

- Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

- Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

- MongoDB requires at least 3.4GB of free disk space for its journal files. To account for this and other MongoDB files, make sure you have at least 4GB  of free disk space before using this guide. If you plan on building a large database, you will need to increase this as your dataset grows.

- Update your system:

      sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install MongoDB

Install MongoDB from the Ubuntu repository:

    sudo apt-get install mongodb-server

This package from the Ubuntu repository includes version 2.6.10. While the most current version available is 3.2.5, as of this writing, MongoDB has not released an official package for Ubuntu 16.04. If you are comfortable manually installing software and monitoring for updates, you can find newer versions on [MongoDB's download page](https://www.mongodb.org/downloads). However, neither manual installation nor newer versions is supported by this guide.

## Configure MongoDB Server

The configuration file for MongoDB Server is located at `/etc/mongodb.conf`. Most of the settings are well-commented within the file, and we've outlined some of the more important options below:

- `dbpath` indicates where the database files will be stored (`/var/lib/mongodb` by default)
- `logpath` indicates where MongoDB's logs will be located (`/var/log/mongodb/mongodb.log` by default)
- `logappend` indicates whether or not new entries will be appended to the end of the log rather than overwriting existing log entries after each time MongoDB restarts
- `bind_ip` specifies which IP address(es) MongoDB should listen on. It is generally recommended to leave this at the default setting of 127.0.0.1 (localhost) unless you have a specific reason to host this to the public internet. Specifying `0.0.0.0` here will cause MongoDB to listen on *all* network interfaces.
- `port` specifies the default network port of 27017, but can be uncommented and modified

By default, authentication is disabled when `auth` is commented out or not explicitly defined. To take advantage of MongoDB's internal authentication capabilities, uncomment the `auth` option by removing the `#` at the beginning of the line and set the value to `true`.

{: .note}
>In addition to `auth`, `/etc/mongodb.conf` contains a `noauth` option. This option is left over from previous MongoDB versions and exists for future compatibility. Use the `auth` option by itself for clarity and consistency.

After making changes to the MongoDB configuration file, restart the service as shown in the following section.

## Start and Stop the MongoDB Server

To start, restart, or stop MongoDB, issue the appropriate command from the following:

    sudo systemctl start mongodb
    sudo systemctl restart mongodb
    sudo systemctl stop mongodb

## Create Database Users

If you enabled authentication in the [Configure MongoDB Server](#configure-mongodb-server) section, create a user administrator with credentials for use on the database: 

1.  Run the `mongo` command to open the shell:

        mongo

2.  By default, MongoDB connects to a database called `test`. Before adding any users, create a database to store user data for authentication:

        use admin

3.  Use the following command to create an administrative user with the ability to create other users on any database. For security, change `mongo-admin` and `password` to something secure:

        db.createUser({user: "mongo-admin", pwd: "password", roles:[{role: "userAdminAnyDatabase", db: "admin"}]})

    Keep these credentials in a safe place for future reference. 
    The output will display all the information written to the database except the password:

        Successfully added user: {
            "user" : "mongo-admin",
            "roles" : [
                    {
                        "role" : "userAdminAnyDatabase",
                        "db" : "admin"
                    }
            ]
        }

4.  Exit the mongo shell:

        quit()

5.  Test your connection to MongoDB with the credentials created in Step 3, using the `admin` database for authentication:

        mongo -u mongo-admin -p --authenticationDatabase admin

    The `-u` and `-p --authenticationDatabase` options in the above command are required in order to authenticate connections to the shell. Without authentication, the MongoDB shell can be accessed, but it will not allow connections to databases.

    The `mongo-admin` user created in Step 3 is purely administrative based on the roles specified. It is defined as a user administrator for all databases, but does not have any database permissions itself. You may use it to create additional users and define their roles. If you are using multiple applications with MongoDB, set up different users with custom permissions for their corresponding databases.

6.  As the `mongo-admin` user, create a new database to store regular user data for authentication. The following example calls it `user-data`:

        use user-data

    Permissions for different databases are handled in separate `roles` objects. The example in Step 7 creates the user, `example-user`, with read-only permissions for the `user-data` database and has read and write permissions for the `example-db` database we'll create in the [Basic MongoDB Functions](#basic-mongodb-functions) section below.

7.  Create a new, non-administrative user to enter test data. Change both `example-user` and `password` to something relevant and secure:
       
        db.createUser({user: "example-user", pwd: "password", roles:[{role: "read", db: "user-data"}, {role:"readWrite", db: "example-db"}]})

To create additional users, repeat Steps 6 and 7 as the administrative user, creating new usernames, passwords and roles by substituing the appropriate values.

For more information on access control and user management, as well as other tips on securing your databases, refer to the [MongoDB Security Documentation](https://docs.mongodb.org/v2.6/core/security-introduction/).

## Basic MongoDB Functions

Much of MongoDB's popularity comes from its ease of integration. Interactions with databases are done via JavaScript functions, and [drivers for other languages](http://docs.mongodb.org/ecosystem/drivers/) are available. This section will demonstrate a few basic features, but we encourage you to do further research based on your specific use case.

1.  Open the MongoDB shell using the `example-user` we created above:

        mongo -u example-user -p --authenticationDatabase user-data

2.  Create a new database. This example calls it `example-db`:

        use example-db

    Make sure that this database name corresponds with the one for which the user has read and write permissions.   

    To show the name of the current working database, run the `db` command.

3.  Create sample data for entry into the test database. MongoDB accepts input as *documents* in the form of JSON objects such as those below. The `a` and `b` variables are used to simplify entry; objects can be inserted directly via functions as well.

        var a = { name : "John Doe" }
        var b = { age : 30 }

4.  Insert the data into a *collection* called `example`, using the `insert` function. If you're not familiar with MongoDB terminology, you can think of a collection as analogous to a table in a relational database management system.

        db.example.insert(a)
        db.example.insert(b)

    The output for each of these operations will show the number of objects successfully written to the current working database:

        WriteResult({ "nInserted" : 1 })

5.  Confirm that the `example` collection was properly created:

        show collections

    The output will list all collections containing data within the current working database:

        example
        system.indexes

    In this case, `example` is the collection we created, and `system.indexes` is a collection of indexes created automatically for internal use by MongoDB.

6.  View all data in the `example` collection using the `find` function. This function can also be used to search for a specific field by entering a search term parameter rather than leaving it empty:

        db.example.find()

    The output will resemble the following:

        { "_id" : ObjectId("571a3e7507d0fcd78baef08f"), "name" : "John Doe" }
        { "_id" : ObjectId("571a3e8707d0fcd78baef090"), "age" : 30 }

    You may notice the objects we entered are preceded by `_id` fields and `ObjectId` values. These are unique indexes generated by MongoDB when an `_id` value is not explicitly defined. `ObjectId` values can be used as primary keys when entering queries, although for ease of use, you may wish to create your own index as you would with any other database system.

## Additional MongoDB Functionality

As noted above, MongoDB has an available collection of language-specific drivers that can be used to interact with your databases from within non-JavaScript applications. One advantage these drivers provide is the ability to allow applications written in different languages to use the same database without the strict need for an object data mapper (ODM). If you do want to use an object data mapper, however, there are many well-supported ODMs available.

MongoDB also includes several other built-in tools such as `mongodump` and `mongorestore` for creating and restoring backups and snapshots, as well as `mongoimport` and `mongoexport` for importing and exporting content from extended JSON, or supported CSV or TSV files.

To view the available options or how to use a particular function, append `.help()` to the end of the function. For example, to see a list of options for the `find` function in Step 6 of [Basic MongoDB Functions](#basic-mongodb-functions):

    db.example.find().help()