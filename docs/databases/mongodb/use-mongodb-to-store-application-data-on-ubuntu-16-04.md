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
---

MongoDB is a database engine that provides access to non-relational, document-oriented databases. It is part of the growing NoSQL movement, which seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON output and specialized language specific bindings that make it particularly attractive for use in custom application development. MongoDB has been used in a number of large scale [production deployments](https://www.mongodb.org/community/deployments) and is currently one of the most popular database engines across all systems.

## Before You Begin

- Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

- Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

- Update your system:

      sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install MongoDB

Install MongoDB from the Ubuntu repository:

    sudo apt-get install mongodb-server

This package includes version 2.6.10, while the most current version available is 3.2.5. As of this writing, MongoDB has not released an official package for Ubuntu 16.04. If you are comfortable manually installing software and monitoring for updates, you can find newer versions on MongoDB's [download page](https://www.mongodb.org/downloads). However, this method is not supported.

## Configure MongoDB Server

The configuration file for MongoDB Server is located at `/etc/mongodb.conf`. Most of the settings are well-commented, but we've outlined some of the more important options below.

- `dbpath` indicates where the database files will be stored (`/var/lib/mongodb` by default). 
- `logpath` indicates where MongoDB's logs will be located (`/var/log/mongodb/mongodb.log` by default).
- `logappend` indicates whether or not new entries will be appended to the end of the log rather than overwriting existing log entries after each time MongoDB restarts.
- `bind_ip` option specifies which IP address(es) MongoDB should listen on. It is generally recommended to leave this at the default setting of 127.0.0.1 (localhost) unless you have a specific reason to host this to the public internet. Specifying `0.0.0.0` here will cause MongoDB to listen on *all* network interfaces.
- `port` specifies the default network port of 27017, but can be uncommented and modified.

It is recommended that you uncomment and set the `auth` option to `true` in order to take advantage of MongoDB's internal authentication capabilities. If you need to test the database without authentication, you can set the `auth` option to "false" or simply comment it out as authentication is disabled when not explicitly defined.

{: .note}
>You may notice a `noauth` option in the configuration file in addition to `auth`. This option is left over from previous MongoDB versions and exists for future compatibility. The `auth` option should be used instead for clarity and consistency.

After making any changes to the MongoDB configuration file, you'll need to restart the service for the changes to take effect.

## Start and Stop the MongoDB Server

To start, restart, or stop MongoDB, issue the appropriate command from the following:

    sudo systemctl start mongodb
    sudo systemctl restart mongodb
    sudo systemctl stop mongodb 

## Create a User

If you enabled authentication above, your first step will be to create a user administrator and credentials for use on the database. 

1.  From the command line, run the `mongo` command to open the shell.

2.  By default, you will be connected to a database called `test`. Before adding any users, we will create a database to store user data for authentication:

        use admin

3.  The following command will create a user called `mongo-admin` with a password of `password`, with the ability to create other users on any database:

        db.createUser({user: "mongo-admin", pwd: "password", roles:[{role: "userAdminAnyDatabase", db: "admin"}]})

    Be sure to change `password` to something secure, and keep it in a safe place for future reference. 

4.  Run the `quit()` function to exit the Mongo shell.

5.  Test your connection to MongoDB with the credentials specified above, using the `admin` database for authentication:

        mongo -u mongo-admin -p --authenticationDatabase admin

    Note that authentication is not forced, even when the `auth` option is enabled within the configuration file. However, access to other databases will be restricted to users that have been added to the `admin` database with the proper permissions.

The `mongo-admin` user is purely administrative. You may use it to create additional users and define privileges on any database, but you will not have privileges on those databases unless it is granted. If you are using multiple applications with MongoDB, it is recommended to set up different users with custom permissions.

For more information on access control and user management, as well as other tips on securing your databases, refer to the [MongoDB Security Documentation](https://docs.mongodb.org/v2.6/core/security-introduction/).

## Basic MongoDB Functions

Much of MongoDB's popularity comes from its ease of integration. Interactions with databases are done via JavaScript functions, although [drivers for other languages](http://docs.mongodb.org/ecosystem/drivers/) are available. This section will demonstrate a few basic features, but we encourage you to do further research based on your specific use case.

1.  Open the MongoDB shell using `mongo`, without any credentials. Make sure you are not using the shell as `mongo-admin` for this example, as that user does not have any privileges on the new database we are going to create.

2.  Create a new database called `newdb`:

        use newdb

    To show the name of the current working database, run the `db` command. To show a list of all databases, run `show dbs`.

3.  Create sample data for entry into the test database. MongoDB accepts input as *documents* in the form of JSON objects such as those below. The `a` and `b` variables are used to simplify entry; objects can be inserted directly via functions as well.

        var a = { name : "John Doe" }
        var b = { age : 30 }

4.  Insert the data into a *collection* called `example`, using the `insert` function. If you're not familiar with MongoDB terminology, you can think of a collection as analogous to a table in a relational database management system.

        db.example.insert(a)
        db.example.insert(b)

5.  Confirm that the `example` collection was properly created:

        show collections

    The output will list all collections containing data within the current working database.

6.  View all data in the `example` collection using the `find` function. This function can also be used to search for a specific field by entering a search term parameter rather than leaving it empty:

        db.example.find()

    The output will resemble the following:

        { "_id" : ObjectId("571a3e7507d0fcd78baef08f"), "name" : "John Doe" }
        { "_id" : ObjectId("571a3e8707d0fcd78baef090"), "age" : 30 }

    You may notice the objects we entered are preceded by `_id` fields and `ObjectId` values. These are unique indexes generated by MongoDB when an `_id` value is not explicitly defined. `ObjectId` values can be used as primary keys when entering queries, although for ease of use, you may wish to create a custom index as you would with any other database system.

## Additional MongoDB Functionality

As noted above, MongoDB has language-specific drivers available that can be used to interact with your databases from within non-JavaScript applications. One advantage these drivers provide is the ability to allow applications written in different languages to use the same database without the strict need for an object data mapper (ODM). If you do want to use an ODM, however, there are many well-supported ones available.

MongoDB also includes several other built-in tools such as `mongodump` and `mongorestore` for creating and restoring backups and snapshots, as well as `mongoimport` and `mongoexport` for importing and exporting content from extended JSON, or supported CSV or TSV files.

To view the available options or how to use a particular function, append `.help()` to the end of the function. For example, to see a list of options for the `find` function we used above:

    db.example.find().help()

For more information, refer to the official [MongoDB Documentation](https://docs.mongodb.org/v2.6/).

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MongoDB Project](http://www.mongodb.org/)
- [MongoDB Documentation](http://docs.mongodb.org/v2.6/)
- [Language-Specific MongoDB Drivers](http://docs.mongodb.org/ecosystem/drivers/)

