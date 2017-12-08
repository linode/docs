---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Install MongoDB for use in application development on Debian 5 (Lenny).'
keywords: ["nosql", "database", "mognodb", "key store"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mongodb/debian-5-lenny/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-02-03
title: 'Use MongoDB to Store Application Data on Debian 5 (Lenny)'
---

MongoDB is a database engine that provides access to non-relational key-value databases. It is part of the growing NoSQL movement, which seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON-based output format and specialized language specific bindings that make it particularly attractive for use in custom application development. Although MongoDB is a relatively new project and has not yet been packaged by most major operating system distributions, the software has been used in a number of large scale [production deployments](http://www.mongodb.org/display/DOCS/Production+Deployments) such as "GitHub", "SourceForge", and "DISQUS".

Before installing MongoDB, it is assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Installing MongoDB

Download the latest binaries from the [upstream source](http://www.mongodb.org/display/DOCS/Downloads).; at the time of writing this is version 1.6.5. When downloading MongoDB, ensure that you download a version that is compiled for the proper system architecture. This document uses the 32-bit version; however, these steps will work for the 64-bit edition with a few modifications. Please note that the 32-bit version of MongoDB has a database size limit of 2 gigabytes. If you expect to store more than 2 gigabytes of data, ensure that you have deployed a 64-bit system and are using the 64-bit version of MongoDB.

    cd /opt/
    wget http://fastdl.mongodb.org/linux/mongodb-linux-i686-1.6.5.tgz
    tar zxvf mongodb-linux-i686-1.6.5.tgz
    mv mongodb-linux-i686-1.6.5 /opt/mongodb

MongoDB is now deployed in the `/opt/mongodb/` folder with the binaries located in the `/opt/mongodb/bin/` folder. In this example, it is assumed that all database files will be stored in the `/srv/db/mongodb` folder and that log files will be stored in the `/srv/db/mongodb.log` file. Issue the following commands to create this file and directory:

    mkdir -p /srv/db/mongodb
    touch /srv/db/mongodb.log

In this example the name of the database will be `mongodb`; however, you can modify this name with another name or naming scheme as needed.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the following MongoDB mailing lists for updates to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [MongoDB Developers List](http://groups.google.com/group/mongodb-dev)
-   [MongoDB Users List](http://groups.google.com/group/mongodb-user)

When upstream sources offer new releases, repeat the instructions for installing MongoDB and recompile your software when needed.

# Create Basic Control Scripts

In typical installations, the MongoDB server process is controlled using command line arguments to binaries located at `/opt/mongodb/bin/mongod`. In order to simplify commands, you can create control scripts named `mongodb-start` and `mongodb-stop` in the `/opt/bin/` directory. Issue the following commands to create the required directories:

    mkdir /opt/bin/
    mkdir /opt/config/

Issue the following sequence of commands to download the scripts and set the permissions on these files:

    cd /opt/bin/
    wget -O mongodb-start http://www.linode.com/docs/assets/607-mongodb-start.sh
    wget -O mongodb-stop http://www.linode.com/docs/assets/608-mongodb-stop.sh
    chmod +x *

Review the contents of the `mongodb-start` and `mongodb-stop` and modify these files if your deployment requires an alternate initialization procedure. From now on, issuing `/opt/bin/mongodb-start` or `/opt/bin/mongodb-stop` will start or stop the MongoDB process, respectively. The behavior of the `mongod` process is controlled by the values set in `/opt/config/mongodb`.

Create the `/opt/config/mongodb` and use the following example as a template:

{{< file "/opt/config/mongodb" ini >}}
# Configuration Options for MongoDB
#
# For More Information, Consider:
# - Configuration Parameters: http://www.mongodb.org/display/DOCS/Command+Line+Parameters
# - File Based Configuration: http://www.mongodb.org/display/DOCS/File+Based+Configuration

dbpath = /srv/db/mongodb
logpath = /srv/db/mongodb.log
logappend = true

bind_ip = 127.0.0.1
port = 27017
fork = true

auth = true
# noauth = true

{{< /file >}}


This specifies a number of important options that you may modify to control the functionality of `mongodb`. The `dbpath` option indicates that database files will be stored in `/srv/db/mongo`. The `logpath` directive indicates that MongoDB's logs will be located in the `/srv/db/log/mongodb.log` file, and that new log entries will be appended to the end of the log rather than overwriting existing log entries even after MongoDB restarts.

If the `bind_ip` option is not specified, MongoDB will bind to and listen for requests on all local IP addresses. In this case, MongoDB is configured to *only* listen for requests on the localhost interface. Modify this option to allow your MongoDB server to listen for requests on other IP addresses; however, consider the possible security implications of providing public access. The `port` option in this file specifies the default port, but can be modified depending on your needs.

Setting the `fork` option to equal `true` configures MongoDB to run as a daemon process in the background independently of the current user's session. Please note that MongoDB will run under the user that executes the `mongodb-start` script. We **strongly** recommend that this user *not* be root or another privileged user account. To provide additional security, it is recommended that you set the `auth` option to `true` in order to take advantage of MongoDB's internal authentication capabilities. If you need to test the database without authentication, you can replace the `auth` option to `noauth`.

# Using a Basic Init Script

We've also created a *very* basic "init script" as a wrapper around the `mongodb-start` and `mongo-stop` scripts described above. You will still need to modify and manage the configuration of your MongoDB server in the files above. This script only provides a means for ensuring that MongoDB will start at boot. Issue the following commands:

    wget -O init-deb.sh http://www.linode.com/docs/assets/609-mongodb-init-deb.sh
    mv init-deb.sh /etc/init.d/mongodb
    chmod +x /etc/init.d/mongodb
    /usr/sbin/update-rc.d -f mongodb defaults

You will also need to create a user and group for mongodb; issue the following command:

    adduser --system --no-create-home --disabled-login --disabled-password --group mongodb

Now issue the following command to ensure that the MongoDB user you just created will have access to all required files in the `/srv/db/` hierarchy:

    chown mongodb:mongodb -R /srv/db/

To start and stop MongoDB using the init script, issue the appropriate command from the following:

    /etc/init.d/mongodb start
    /etc/init.d/mongodb stop

Congratulations, you now have a fully functional installation of the MongoDB system.

# Additional MongoDB Functionality

Now that MongoDB is running properly, you can begin to explore some of its features. Most interaction with MongoDB is done via the rich set of [language-specific drivers](http://www.mongodb.org/display/DOCS/Drivers). There are also a number of tools in the `/opt/mongodb/bin/` directory that you might find useful for interacting with MongoDB databases. The `mongo` utility provides an interactive JavaScript shell for MongoDB including commands such as `mongodump` and `mongorestore` for creating and restoring backups and snapshots as well `mongoexport` and `mongoimportjson` for exporting individual collections in JSON format.

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



