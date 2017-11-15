---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: Configure a MongoDB ReplSet
keywords: ["mongodb", "nosql", "clusters", "replset", "databases"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mongodb/centos-6/']
modified: 2014-04-09
modified_by:
  name: Linode
published: 2014-04-09
title: 'Creating a MongoDB Replication Set on CentOS 6.4'
external_resources:
 - '[MongoDB](http://www.mongodb.org/)'
 - '[db.collection.insert()](http://docs.mongodb.org/manual/reference/method/db.collection.insert/)'
 - '[Getting Started with the mongo Shell](http://docs.mongodb.org/manual/tutorial/getting-started-with-the-mongo-shell/)'
 - '[Replication Introduction](http://docs.mongodb.org/manual/core/replication-introduction/)'
---

MongoDB is an open-source non-SQL database engine. MongoDB is scalable and an alternative to the standard relational database management system (RDBMS). A replication set is used for redundancy and to provide access to your data in the event of a node failure.

Before installing MongoDB, it is assumed that you have followed our getting started guide. If you are new to Linux server administration, you may want to consult our using Linux document series including the [Introduction to Linux Concepts guide](/docs/tools-reference/introduction-to-linux-concepts) and [Administration Basics guide](/docs/using-linux/administration-basics).

This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, you can review our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Installing MongoDB

1.  Make sure the hostname is set on every member of the replication set by editing the hostname file:

        nano /etc/hostname

    Replace the name in brackets <> with your own hostname. This example uses the Nano text editor. However, you can use the text editor you prefer.

    {{< file-excerpt "/etc/hostname" >}}
europa

{{< /file-excerpt >}}


2.  Create a file to hold the configuration information for the MongoDB repository:

        sudo touch /etc/yum.repos.d/mongodb.repo

3.  If you are running a 64-bit system, use the following configuration:

        [mongodb]
        name=MongoDB Repository
        baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
        gpgcheck=0
        enabled=1

    For a 32-bit system, use the following configuration:

        [mongodb]
        name=MongoDB Repository
        baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/i686/
        gpgcheck=0
        enabled=1

    {{< note >}}
A 32-bit system is not recommended for production deployments.
{{< /note >}}

4.  Install MongoDB using the command:

        sudo yum install mongo-10gen-server

## Configuring Networking

It is imperative that the networking configurations are set and working properly, or you will not be able to add members to the replication set. This section will provide in detail how to configure three (3) Linodes as a MongoDB replication set.

Before you begin, you will need to obtain all the private IP addresses for each of your Linodes. This information can be found by logging into the Linode Manager. Under the **Remote Access** tab there is a section called, "Private/LAN Network". Click on the "Add a Private IP" link to assign a private IP address to your Linode. This is the address you will use to configure your `hosts` file. Again, we are working with a three member replication set so you will need to acquire this information for each member.

[![Finding your private IP address.](/docs/assets/1716-private_ip-v2.png)](/docs/assets/1716-private_ip-v2.png)

### Setting the Hosts File

Once you have all your private IPs, you can add them to the `hosts` file. Use your favorite text editor and add the addresses.

{{< file-excerpt "/etc/hosts" >}}
192.168.160.1 mongo1
192.168.170.1 mongo2
192.168.180.1 mongo3

{{< /file-excerpt >}}


Use your own IP addresses in place of the addresses in the above example. The names of the members in the replication set are also variables, so you may name them what you choose. However, it would be prudent to have some numerical or alphabetic notation as this will make it easier to identify when connecting to the different replication set members.

{{< note >}}
Replication set member names and the actual server name are different. In this instance, the server name is **europa**, and the replication set members are **mongo1**, **mongo2**, and **mongo3** respectively.
{{< /note >}}

### Set the Network Interfaces

1.  Edit your `ifcfg-eth0` file to include the public IP address information.

    {{< file-excerpt "/etc/sysconfig/network-scripts/ifcfg-eth0" >}}
DEVICE=eth0
BOOTPROTO=none
ONBOOT=yes
TYPE=Ethernet

# This line ensures that the interface will be brought up during boot.
ONBOOT=yes

# eth0 - This is the main IP address that will be used for most outbound connections.
# The address, netmask and gateway are all necessary.
IPADDR=xxx.xx.xxx.xx
NETMASK=xxx.xxx.xxx.x
GATEWAY=xxx.xx.xx.x

{{< /file-excerpt >}}


    Replace the sample addresses with your own IP information.

2.  Next you will need to create a file for your private IP information. You can do this by copying the eth0 file with the name **ifcfg-eth0:1**:

        cp ifcfg-eth0 ifcfg-eth0:1

3.  Now edit your newly created `eth0:1` file to reflect your private IP information:

    {{< file-excerpt "/etc/sysconfig/network-scripts/ifcfg-eth0:1" >}}
# Configuration for eth0:1
DEVICE=eth0:1
BOOTPROTO=none

# This line ensures that the interface will be brought up during boot.
ONBOOT=yes

# eth0:1 - Private IPs have no gateway (they are not publicly routable)
# specify the address and netmask.
IPADDR=xxx.xxx.xxx.xxx
NETMASK=xxx.xxx.xxx.x

{{< /file-excerpt >}}


    Again you will replace the sample addresses with your own IP information.

4.  Restart the networking service to ensure your interface changes have taken effect. Use the command:

        sudo service network restart

### Edit the Mongo Conf File

1.  Edit the `mongod.conf` file to add the IP address and port number.

    {{< file-excerpt "/etc/mongod.conf" >}}
# fork and run in background
fork = true

bind_ip = 192.168.135.24
port = 27017

{{< /file-excerpt >}}


    Enter the private IP address of the server you are logged onto in the bind ip section. If bind_ip is not present, you will need to add it. Leave the default port number of **27017**, and uncomment the line `fork = true`.

2.  While still in the `mongodb.conf` file scroll to the bottom and add the replica set information:

    {{< file-excerpt "/etc/mongod.conf" >}}
replSet = rs1

{{< /file-excerpt >}}


    In this example, the sample replication set is **rs1**, however, you may change the name as you choose.

## Replication Sets

A replication set will allow your data to be "copied over" or propagated to all other members in the set. It provides redundancy in the event of system failure. It is recommended that an odd number of members be used in a set since it will make elections easier.

Elections are to select which set member will become the primary. Elections take place after the replication set is initiated and when the primary is not available. The primary member is the only one that can accept write operations. In the event the primary is not available, elections take place to select a new primary. This election action allows the set to resume normal operations without manual intervention.

### Creating a Replication Set

A `mongod.conf` file was created during the installation. You will use this configuration file to start the daemon on **every** member of the replication set.

1.  The command is as follows:

        mongod --config /etc/mongod.conf

    Your output should look similar once the daemon has started.

         [user@europa mongo]# mongod --config /etc/mongod.conf
         about to fork child process, waiting until server is ready for connections.
         forked process: 20955
         all output going to: /var/log/mongo/mongod.log
         child process started successfully, parent exiting

2.  Start MongoDB client on **only one** member of the replication set with the command:

        mongo --host <mongo0>

    The variable is the name of replication set member you are working on, in this example **mongo0**.

3.  At the MongoDB prompt, switch to admin with the command:

        use admin

    You should see the message `switched to db admin`.

4.  Run the `rs.initiate()` command which will begin creating the replication set with the current member. The output should look similar to the following:

        > rs.initiate()
        {
            "info2" : "no configuration explicitly specified -- making one",
            "me" : "192.168.160.1:27017",
            "info" : "Config now saved locally.  Should come online in about a minute.",
            "ok" : 1

5.  To see the current configuration run the command:

        rs.conf()

    The output should look similar to the following:

        rs.conf()
        {
            "_id" : "rs1",
            "version" : 8,
            "members" : [
                {
                    "_id" : 0,
                    "host" : "192.168.160.1:27017"
                }
            ]
        }

6.  To add a member to your replication set use the command:

        rs.add("mongo1:27017")

    Below is output for the command rs.add:

        rs1:PRIMARY> rs.add("mongo2:27017")
        { "ok" : 1 }

6.  To verify that the members have been added correctly run the `rs.conf()` command again. The output should look similar to the following:

        rs1:PRIMARY> rs.conf()
            {
                "_id" : "rs0",
                "version" : 8,
                "members" : [
                {
                    "_id" : 0,
                    "host" : "192.168.160.1:27017"
                },
                {
                    "_id" : 1,
                    "host" : "mongo1:27017"
                },
                {
                    "_id" : 2,
                    "host" : "mongo2:27017"
                }
            ]
            }

### Verifying Replication

The best way to verify that replication is working and the members are all communicating is to create a new test database. By default, the existing **test** database is used when you connect to MongoDB. In order to save the new database, data will need to be added. The process for creating and inserting data is as follows:

1.  Create a database with the command:

        use <products>

Replace the variable **products** with any name you like.

2.  Add some data:

        db.products.insert( {item: "paint", qty: 10 } )

    If you are not on the primary member in the set, you will receive the message `not master`. Switch to the primary member and run the commands again. Now use the command:

        show dbs

    A list of databases will be displayed. Your new **\<products\>** database should appear in the list. Connect to one of the other members of the set and see if the newly created database has propagated.

### Adding New Members to an Existing ReplSet

Before you add a new member, its data directory must be empty. Once the new member is added it will copy over all the data from an existing member in the replication set.

Members can be added to the replication set at any time. In order to re-add a removed member or to add a totally new member, you must be connected to the primary member of the replication set. Before you issue the "add" command, you must switch to admin. At the MongoDB prompt issue the command:

    use admin

Then use the following command to add a member:

    rs.add("mongodb3:27017")

For this replset configuration, only the hostname was required to add a new member.

An example of the add member process is included for your reference. Make sure to change names and port numbers to reflect your particular configuration.

[![Add a member to a replication set.](/docs/assets/1686-add-node.png)](/docs/assets/1686-add-node.png)

Use the `rs.conf()` command to check if the new member is present in the configuration file. In addition, any database should propagate almost immediately (depending on its size) over to the new member.

## Database Concepts and Commands

MongoDB is different from SQL in its classification of data as well as its commands. The following sections will provide some basic commands and data descriptions.

### Data Classifications

To clarify how data is stored it is important to understand how MongoDB classifies data. The data is classified as follows:

-   A database is the container for collections
-   A collection is a group of documents, it is synonymous with tables
-   A document contains basic units of data
-   Fields are analogous to columns
-   A key is a name (string)
-   A value is basic type such as a string or an array of values

### Basic MongoDB Commands

|--------------------|------------------------------------------------------------------------|
| Command            | Description                                                            |
|--------------------|------------------------------------------------------------------------|
| `help`             | displays a short list of help commands                                 |
| `show dbs`         | displays a list of all the databases                                   |
| `use <db>`         | sets the current database                                              |
| `show collections` | displays the collections for the current database                      |
| `show users`       | displays the users in the current database                             |
| `rs.status`        | displays detailed status of each member of the replication set         |
| `rs.conf`          | displays the members of the replication set                            |
| `db.help`          | displays help for database methods                                     |
| `insert()`         | inserts a new document into a collection                               |
| `update()`         | updates an existing document in a collection                           |
| `save`             | updates an existing document in a collection or inserts a new document |
| `remove`           | deletes a document from a collection                                   |
| `drop`             | removes a collection completely                                        |
|--------------------|------------------------------------------------------------------------|

It is important to note that MongoDB uses parentheses () at the end of several commands, comparable to the semicolon in SQL.

## MongoDB Server Service

In the event you need to restart, stop or check the status of the MongoDB service, use the following commands:

    sudo service mongod --config /etc/mongod.conf
    sudo service mongodb stop
    sudo service mongodb restart
    sudo service mongodb status

## Other Considerations

A replication set can only have seven (7) voting members maximum. In order to add another member to a set with seven voting members, the eighth member will have to be added as either a non-voting member or an existing voting member will need to be removed.
