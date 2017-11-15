---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Install MongoDB for use in application development on Ubuntu 12.04 (Precise).'
keywords: ["nosql", "database", "mongodb", "key store"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mongodb/ubuntu-12-04-precise-pangolin/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2012-10-08
title: 'Use MongoDB to Store Application Data on Ubuntu 12.04 (Precise)'
---

MongoDB is a database engine that provides access to non-relational key-value databases. It is part of the growing NoSQL movement, which seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON-based output format and specialized language specific bindings that make it particularly attractive for use in custom application development. Although MongoDB is a relatively new project, the software has been used in a number of large scale [production deployments](http://www.mongodb.org/display/DOCS/Production+Deployments).

Before installing MongoDB, it is assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Installing MongoDB

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Enter the following command to install MongoDB server:

    apt-get install mongodb-server

# Configure MongoDB Server

By default, the configuration file for mongodb-server is located at `/etc/mongodb.conf`. Most of the settings are fairly self-explanatory and well-commented, but we've outlined some of the more important options below.

The `dbpath` option indicates where the database files will be stored (`/var/lib/mongodb` by default). The `logpath` directive indicates where MongoDB's logs will be located (`/var/log/mongodb/mongodb.log` by default). `logappend` indicates whether or not new entries will be appended to the end of the log rather than overwriting existing log entries after each time MongoDB restarts.

The `bind_ip` option specifies which IP address(es) MongoDB should listen on. It is generally recommended to leave this at the default setting of 127.0.0.1 (localhost) unless you have a specific reason to host this DB to the public internet. Specifying `0.0.0.0` here will cause MongoDB to listen on *all* network interfaces. The `port` option in this file specifies the default port, but can be modified depending on your needs.

To provide additional security, it is recommended that you set the `auth` option to `true` in order to take advantage of MongoDB's internal authentication capabilities. If you need to test the database without authentication, you can replace the `auth` option to `noauth`.

Please note that after making any changes to the MongoDB configuration file, you'll always need to restart the service for the changes to take effect (see below).

# Starting and Stopping the MongoDB Server

To start, restart, or stop MongoDB, issue the appropriate command from the following:

    service mongodb start
    service mongodb restart
    service mongodb stop

Congratulations, you now have a fully functional installation of the MongoDB system.

# Additional MongoDB Functionality

Now that MongoDB is running properly, you can begin to explore some of its features. Most interaction with MongoDB is done via the rich set of [language-specific drivers](http://www.mongodb.org/display/DOCS/Drivers). There are a number of tools that are installed by default that you might find useful for interacting with MongoDB databases. The `mongo` utility provides an interactive JavaScript shell for MongoDB including commands such as `mongodump` and `mongorestore` for creating and restoring backups and snapshots, as well as `mongoexport` and `mongoimportjson` for exporting individual collections in JSON format.

You can now fully enjoy application development with MongoDB!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MongoDB Project](http://www.mongodb.org/)
- [Language-Specific MongoDB Drivers](http://www.mongodb.org/display/DOCS/Drivers)
- [MongoDB Shell](http://mongo.kylebanker.com/)
- [MapReduce Paradigm and MongoDB](http://www.mongodb.org/display/DOCS/MapReduce)
- [MongoDB Sharding](http://www.mongodb.org/display/DOCS/Sharding)
- [Configuration Parameters](http://www.mongodb.org/display/DOCS/Command+Line+Parameters)
- [File Based Configuration](http://www.mongodb.org/display/DOCS/File+Based+Configuration)



