---
deprecated: true
author:
  name: Linode
  email: skleinman@linode.com
description: 'Configure MongoDB for use in clustered environments.'
keywords: 'mongodb,nosql,clusters,databases'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/mongodb/clusters/']
modified: Friday, April 29th, 2011
modified_by:
  name: Linode
published: 'Thursday, September 30th, 2010'
title: Build Database Clusters with MongoDB
---

MongoDB is a leading non-relational database systems and a prominent member of the "NoSQL" movement. MongoDB provides a data storage system with an interface that allows developers to organize and access structured data efficiently without imposing the restrictions of the traditional relational database model. This kind of system allows developers increased flexibility and appropriate tooling for scaling databases in response to demand. This document addresses various strategies for deploying clusters of MongoDB instances that allow your data store to respond to demand beyond the abilities of a single node.

Before following this introduction to clustering MongoDB data systems, please be sure to review our [getting started guide](/docs/getting-started/). Furthermore, this document does not cover how to install MongoDB; however, see the guides for [installing MongoDB](/docs/databases/mongodb/) and deploy instances of MongoDB on multiple Linodes to take full advantage of this guide.

Approaches to Clustering
------------------------

There are a number of options to consider when building clusters with MongoDB. The ideal configuration for your deployment is *highly* dependent upon the needs of your application and the kind of data access profile you expect. Consider these demands and the various strengths of each feature before deploying a cluster.

### Redundant Systems

MongoDB contains robust support for creating master and slave database servers. This makes it possible to always have a secondary database instance ready in case the primary server fails. However, in these configurations, fail-over is entirely the responsibility of the application developer. Master-slave configurations only create a second or series of secondary databases that are identical to the master node. Master/slave replication is the most stable clustering technology used in MongoDB and is the most well tested.

Master-slave replication provides redundancy for a failing master node; however, master-slave replication does not eliminate a single point of failure. When the master node fails, administrators must reorganize the cluster using one of the slave instances of the database as the master. In conventional deployments this procedure is not auto-negotiated.

Slave databases are fully functional MongoDB instances: if your application is able to split read and write operations between two databases, you may use this kind of approach to decrease the load on the master node. However, it is possible that slave instances can be *slightly* out of synchronization with the master node depending on configuration and load. Slave instances are "eventually consistent" with the master node.

Master-slave replication provides redundancy *only* by creating a good "live" backup system. While you may use this kind of "cluster" to improve performance by splitting read and write operations between the slaves and master node, the utility of these functions may limited in some situations. MongoDB also contains support for automatically managed replication, by way of its "Replica Sets".

### Distributed Systems

Since version 1.6.0, MongoDB has included native support for database clusters called "Replica Sets". Moving beyond master-slave replication, these sets allow a group of MongoDB instances to automatically negotiate which instances are "master" and "slaves". Replica sets are also able to renegotiate the master or slave status of the nodes in the cluster in response to the status of individual nodes. All members of Replica Sets are eventually consistent with each other. Replica sets support clusters of up to seven MongoDB instances.

Configure Master-Slave Replication
----------------------------------

To configure master-slave replication, deploy MongoDB
\</databases/mongodb/\> instances on two servers. You'll need to modify the `/opt/config/mongodb` files as follows:

### Master Node Configuration

{: .file }
/opt/config/mongodb
:   ~~~ ini
    # Configuration Options for MongoDB
    # 
    # For More Information, Consider:
    # - Configuration Parameters: http://www.mongodb.org/display/DOCS/Command+Line+Parameters
    # - File Based Configuration: http://www.mongodb.org/display/DOCS/File+Based+Configuration

    dbpath = /srv/db/mongodb
    logpath = /srv/db/mongodb.log
    logappend = true

    bind_ip = 192.168.1.2
    port = 27017
    fork = true

    auth = true
    # noauth = true

    master = true
    ~~~

Modify the value of `bind_ip` to reflect the address over which you would like to access MongoDB.

### Slave Node Configuration

{: .file }
/opt/config/mongodb
:   ~~~ ini
    # Configuration Options for MongoDB
    # 
    # For More Information, Consider:
    # - Configuration Parameters: http://www.mongodb.org/display/DOCS/Command+Line+Parameters
    # - File Based Configuration: http://www.mongodb.org/display/DOCS/File+Based+Configuration

    dbpath = /srv/db/mongodb
    logpath = /srv/db/mongodb.log
    logappend = true

    bind_ip = 192.168.1.3
    port = 27017
    fork = true

    auth = true
    # noauth = true

    slave = true 
    source = 192.168.1.2:27017
    # slavedelay = 7200
    autoresync = true 
    ~~~

Modify the value of `bind_ip` to reflect the address over which you would like to access MongoDB. You may connect multiple slave nodes to a single master node.

The `slavedelay` option, disabled in this configuration, allows administratos to force a specific slave to intentionally "lag" behind the master by the specified number of seconds. This makes it possible to more easily revert to an older instance of the database if something happens to the current version. The `slavedelay` value is in seconds.

The `autoresync` option forces the slave database to automatically resynchronize itself with the master in case the slave should become out of sync. When the master does fall out of sync, the `autoresync` option will not attempt to synchronize more than once in any ten minute period.

### Replication Considerations

Beyond the simple configuration of slave and master nodes in the configuration above, there are a couple of additional features and requirements of which administrators responsible for MongoDB clusters should be aware.

When creating a new slave node from an existing database, you can run `mongod` with the `--fastsync` option. This quickly copies the contents of the master repository over to the new slave. According to the Linode Library configuration of MongoDB, place this option in your `/opt/bin/mongodb-start` file. When the operation completes, as logged in the `/srv/db/log/mongodb.log` file, remove the `--fastsync` option and restart the server normally.

Furthermore, it is also possible to run multiple instances of MongoDB on a single system. Some administrators will find this useful for backups, particularly with the ability to offset the slave from the present with the `slavedelay` option. Simply create multiple configuration files in `/opt/config/`, specifying the proper slaving related arguments correctly and binding each instance to its own port. Modify the start/stop and init scripts accordingly.

MongoDB instances can be both slaves *and* masters at the same time. For instance, it is possible to create one slave which is an identical and current mirror of the master database. A set of sub-slaves connect to this slave to maintain copies of the database at various points in recent time. The only limitation is that *write* operations are only possible for the top-most master.

When MongoDB's authentication mode is active, the slave database will use the `repl` user in the `local.system.users` collection to authenticate to the source (master) database. If the `repl` user is absent, MongoDB tries the first user record in the `local.system.users` collection. You may configure networking and firewall rules on a per-port basis to allow traffic only from the appropriate sources, or encrypt connections using VPNs or SSH tunnels as an alternative.

Configure Replica Sets
----------------------

In many cases, conventional master-slave architectures fulfill the needs of most applications and are easier to understand and administer. For deployments that require a true distributed data storage system, configure "Replica Sets".

Begin by deploying MongoDB \</databases/mongodb/\> instances on at least two servers. You'll need to modify their `/opt/config/mongodb` files as follows:

{: .file }
/opt/config/mongodb
:   ~~~ ini
    # Configuration Options for MongoDB
    # 
    # For More Information, Consider:
    # - Configuration Parameters: http://www.mongodb.org/display/DOCS/Command+Line+Parameters
    # - File Based Configuration: http://www.mongodb.org/display/DOCS/File+Based+Configuration

    dbpath = /srv/db/mongodb
    logpath = /srv/db/mongodb.log
    logappend = true

    port = 27017
    fork = true

    auth = true
    # noauth = true

    # Replication Configuration
    replSet = morris
    rest = true
    ~~~

This configuration does *not* include a `bind_ip`, as this option is currently incompatible with replica sets. You will need to use [IP tables](/docs/security/firewalls/iptables) to control access because MongoDB will listen for connections on *all* interfaces. When these configuration values are set you can now initialize the each of the set members in the replica set.

### Set Members

Configuration of the cluster must occur within the MongoDB shell (e.g. `mongo`) on the *current primary* node. Enter the shell by issuing the following commands:

    /opt/mongodb/bin/mongo

Initiate the cluster with the following command in the `mongo` shell:

~~~ js
rs.initiate();
~~~

Add members by issuing commands to the `mongo` shell in the following form:

~~~ js
rs.add("ducklington:27017");
~~~

This operation adds a MongoDB instance with the hostname "ducklington" running on the standard MongoDB port number `27017` to the cluster `morris` defined above. You may define nodes using either hostnames, if configured, or IP addresses. Consider the following example:

~~~ js
> rs.add("ducklington:27017");
{ "ok" : 1 }
> rs.add("ducklington:27018");
{ "ok" : 1 }
> rs.add("bucknell:27017");
{ "ok" : 1 }
> rs.add("brackley:27017");
{ "ok" : 1 }
~~~

This configuration will automatically propagate throughout the entire set, and is held in the MongoDB object `local.system.replset`. To check the status of the set, issue the following command at the `mongo` prompt:

~~~ js
rs.status();
~~~

You may also visit port `28017` of your primary node in your web browser for a web-based overview of your cluster's status.

### Using Replica Sets

The client drivers that interface applications with MongoDB data stores support replica sets. Provide the driver with a comma separated list of hostnames and port numbers in the `[hostname]:[port]` format. This creates a "seed pool" that the driver can use to discover other members of the cluster. This allows you to modify the cluster composition without modifying application code.

### Arbiter Node

MongoDB clusters can leverage an "Arbiter Node" to resolve conflicts by acting as a tie breaker in otherwise unresolvable elections conditions where members of the cluster fall out of synchronization. Arbiter nodes are fully functional MongoDB instances without a copy of the data set, and share identical configuration with members of replica sets. Once running the configuration differs slightly.

On the primary server use the `./opt/mongodb/bin/mongo` command to enter the `mongo` shell, and then issue the following command:

~~~ js
rs.addArb("ducklington:27019");
~~~

Modify this command with the proper IP address or hostname and port number for your arbiter node. The cluster can now use the Arbiter node to resolve conflicts as needed.

Arbiters will never have a complete working copy of the database and can never become primary or secondary node. They are not required for every deployment but are very helpful if connections between portions of your cluster are lost at some point. Arbiter nodes are also useful when a replica set only has two members.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MongoDB Documentation for Replica Sets](http://www.mongodb.org/display/DOCS/Replica+Set+Configuration)
- [MongoDB Documentation for Master-Slave Replication](http://www.mongodb.org/display/DOCS/Master+Slave)
- [MongoDB Documentation for Sharding](http://www.mongodb.org/display/DOCS/Sharding+Introduction)
- [MongoDB Documentation for Auto Sharding Configuration](http://www.mongodb.org/display/DOCS/Configuring+Sharding)



