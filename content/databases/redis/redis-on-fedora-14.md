---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy applications that depend on the high performance key-value store Redis.'
keywords: ["redis fedora 14", "redis", "nosql", "database", "key-value store"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/redis/fedora-14/']
modified: 2013-09-24
modified_by:
  name: Linode
published: 2010-12-06
title: Redis on Fedora 14
---



Redis is a high performance persistent key-value store, and is intended as a datastore solution for applications where performance and flexibility are more critical than persistence and absolute data integrity. As such, Redis may be considered a participant in the "NoSQL" movement and is an attractive tool for developers of some kinds of applications. This document provides both instructions for deploying the Redis server and an overview of best practices for maintaining Redis instances.

Install Redis
-------------

### Prepare System for Redis

Issue the following command to update your system's package repositories and ensure that all installed packages are up to date:

    yum update

Install required prerequisites with the following command:

    yum install make gcc wget

This guide only provides instructions for installing and managing Redis itself. The application you deploy likely requires additional infrastructure, dependencies, and utilities.

### Download and Compile Software

Begin the installation process by issuing the following sequence of commands to download the software and prepare it for use:

    cd /opt/
    mkdir /opt/redis
    wget http://redis.googlecode.com/files/redis-2.2.2.tar.gz
    tar -zxvf /opt/redis-2.2.2.tar.gz
    cd /opt/redis-2.2.2/
    make

This will download and compile the 2.2.2 version of Redis. Check the [Redis upstream project source](http://redis.io/) to ensure that you are downloading the most up to date version of Redis. It is important to use the most up to date version of the software to avoid security flaws and bugs as well as to take advantage of the latest features. When you compile software manually, you are responsible for ensuring your system is running the most current version without the assistance of your system's package management tools.

Move all of the redis executable files to the `/opt` directory by issuing the following sequence of commands:

    cp /opt/redis-2.2.2/redis.conf /opt/redis/redis.conf.default
    cp /opt/redis-2.2.2/src/redis-benchmark /opt/redis/
    cp /opt/redis-2.2.2/src/redis-cli /opt/redis/
    cp /opt/redis-2.2.2/src/redis-server /opt/redis/
    cp /opt/redis-2.2.2/src/redis-check-aof /opt/redis/
    cp /opt/redis-2.2.2/src/redis-check-dump /opt/redis/

You will need to repeat these commands each time you upgrade Redis.

### Redis Configuration

All Redis configuration options can be specified in the `redis.conf` file located at `/opt/redis/redis.conf`. Issue the following command to create this file from the default configuration file:

    cp /opt/redis/redis.conf.default /opt/redis/redis.conf

Consider the following configuration:

{{< file "/opt/redis/redis.conf" >}}
daemonize yes
pidfile /var/run/redis.pid
logfile /var/log/redis.log

port 6379
bind 127.0.0.1
timeout 300

loglevel notice

## Default configuration options
databases 16

save 900 1
save 300 10
save 60 10000

rdbcompression yes
dbfilename dump.rdb

dir /opt/redis/
appendonly no

glueoutputbuf yes

{{< /file >}}


Most of the values in this configuration mirror the default Redis configuration. However, this configuration configures Redis to run in a daemon mode bound only to the local network interface. You may want to change these values depending on the needs of your application.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [Redis Project mailing lists](http://groups.google.com/group/redis-db) for updates to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing Redis and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.

Managing Redis Instances
------------------------

### Running a Redis Datastore

In the default configuration, Redis runs in an interactive mode after being invoked at the command line. To start Redis in this manner issue the following command:

    /opt/redis/redis-server /opt/redis/redis.conf.default

You may now interact with Redis using any of the language specific bindings or use the built-in command line interface to interact with the Redis instance. Simply prefix any [Redis command](http://redis.io/commands/) with the following string:

    /opt/redis/redis-cli

While running the Redis instance in this configuration is useful for testing and initial deployment, production deployments may have better results by creating a dedicated and unprivileged system user for the Redis instance and controlling Redis using an "init" script. This section covers the creation of an init script and strategies for managing production Redis instances.

### Deploy Init Script

Issue the following sequence of commands to download a basic init script, create a dedicated system user, mark this file as executable, and ensure that the Redis process will start following the next boot cycle:

    cd /opt
    wget -O init-rpm.sh http://www.linode.com/docs/assets/632-redis-init-rpm.sh
    useradd -M -r --home-dir /opt/redis redis
    mv /opt/init-rpm.sh /etc/init.d/redis
    chmod +x /etc/rc.d/init.d/redis /etc/init.d/redis
    chown -R redis:redis /opt/redis
    touch /var/log/redis.log
    chown redis:redis /var/log/redis.log
    chkconfig --add redis
    chkconfig redis on

You may use the following commands to start and stop the Redis instance:

    /etc/init.d/redis start
    /etc/init.d/redis stop

Managing Datastore Persistence
------------------------------

Redis is not necessarily intended to provide a completely consistent and fault tolerant data storage layer, and in the default configuration there are some conditions that may cause your data store to lose up to 60 seconds of the most recent data. Make sure you understand the risks associated and the potential impact that this kind of data loss may have on your application before deploying Redis.

If persistence is a major issue for your application, it is possible to use Redis in a transaction journaling mode that provides greater data resilience at the expense of some performance.

To use this mode, ensure that the following values are set in `redis.conf`:

{{< file-excerpt "/opt/redis/redis.conf" >}}
appendonly yes
appendfsync everysec

{{< /file-excerpt >}}


The first directive enables the journaled "append only file" mode, while the second directive forces Redis to write the journal to the disk every second. The `appendfsync` directive also accepts the argument `always` to force writes after every operation which provides maximum durability, or `never` which allows the operating system to control when data is written to disk which is less reliable.

After applying these configuration changes, restart Redis. All modifications to the data store will be logged. Every time Redis restarts it will "replay" all transactions and ensure that your data store matches the log. However, in some conditions this may render the data-store unusable while the database restores. To avoid this condition, issue the following command to the Redis command line:

    /opt/redis/redis-cli bgrewriteaof

You may wish to issue this command regularly, perhaps in a [cron job](/docs/linux-tools/utilities/cron), to ensure that the transaction journal doesn't expand exponentially. The `bgrewriteaof` is non-destructive and can fail gracefully.

Distributed Data Stores with Master Slave Replication
-----------------------------------------------------

Redis contains limited support for master-slave replication which allows you to create a second database that provides a direct real time copy of the data collection on a second system. In addition to providing a "hot spare" or multiple spares for your Redis instance, master-slave systems also allow you to distribute load amongst a group of servers. As long as all write options are applied to the master node, read operations can be distributed to as many slave nodes as required.

To configure master-slave operation, ensure that the following configuration options are applied to the *slave* instance:

{{< file-excerpt "redis.conf" >}}
slaveof 192.168.10.101 6379

{{< /file-excerpt >}}


The `slaveof` directive takes two arguments: the first is the IP address of the master node, and the second is the Redis port specified in the master's configuration.

When you restart the slave Redis instance, it will attempt to synchronize its data set to the master, and then propagate the changes. Slave Redis instances can accept slave connections, which allows administrators to distribute the slave-replication load in multi-slave architectures. It's also possible to use a master with less stringent data persistence policies with a slave that keeps a more persistent copy. Master/slave replication creates a number of powerful architectural possibilities that may suit the needs of your application.

The traffic between slave instances and the master instance is not encrypted and does not require authentication in the default configuration. Authentication is available, and can be configured according to the documentation in the `/opt/redis/redis.conf.default` file; however, this is not the default method for securing Redis instances.

The preferred method for controlling access to Redis instances involves using [iptables](/docs/security/firewalls/iptables) and possibly some sort of encryption such as an SSH tunnel to ensure that traffic is secure. Slaves will automatically attempt to reestablish a connection to the master node if the link fails in a number of situations. However, clusters cannot automatically promote members from slave status to master status; cluster management of this order must occur within your application.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Redis Project Home Page](http://redis.io/)
- [Redis Configuration](http://redis.io/topics/config)
- [Redis Data Durability](https://redis-docs.readthedocs.org/en/latest/AppendOnlyFileHowto.html)
- [Redis Command Reference](http://redis.io/commands)



