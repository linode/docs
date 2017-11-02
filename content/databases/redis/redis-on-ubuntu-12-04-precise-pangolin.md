---
deprecated: true
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Deploy applications that depend on the high performance key-value store Redis.'
keywords: ["redis ubuntu 12.04", "redis precise pangolin", "nosql", "database", "key-value store"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/redis/ubuntu-12-04-precise-pangolin/']
modified: 2012-10-25
modified_by:
  name: Linode
published: 2012-10-25
title: 'Redis on Ubuntu 12.04 (Precise Pangolin)'
external_resources:
 - '[Redis Project Home Page](http://redis.io/)'
 - '[Redis Configuration](http://redis.io/topics/config)'
 - '[Redis Persistence](http://redis.io/topics/persistence)'
 - '[Redis Command Reference](http://redis.io/commands)'
---

Redis is a high performance persistent key-value store and is intended as a datastore solution for applications where performance and flexibility are more critical than persistence and absolute data integrity. As such, Redis may be considered a participant in the "NoSQL" movement and is an attractive tool for developers of some kinds of applications. This document provides both instructions for deploying the Redis server and an overview of best practices for maintaining Redis instances.

Prior to beginning this guide for installing Redis, we assume that you have completed the steps outlined in our [getting started guide](/docs/getting-started/). If you're new to Linux systems administration, we recommend that you read the [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts) and the [administration basics guide](/docs/using-linux/administration-basics).

## Install Redis

### Prepare System for Redis

Issue the following commands to update your system's package repositories and ensure that all installed packages are up to date:

    apt-get update
    apt-get upgrade

### Download and Install Redis

Install Redis from the Ubuntu repositories:

    apt-get install redis-server

### Redis Configuration

All Redis configuration options can be specified in the `redis.conf` file located at `/etc/redis/redis.conf`. You may wish to make a copy of this file before editing it, to retain default values in case of a problem down the line:

    cp /etc/redis/redis.conf /etc/redis/redis.conf.default

Consider the following configuration:

{{< file "redis.conf" >}}
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

appendonly no

{{< /file >}}


The values in this configuration mirror the default Redis configuration Ubuntu provides. However, this configuration configures Redis to run in daemon mode bound only to the local network interface. You may want to change these values depending on the needs of your application.

## Managing Redis Instances

### Running a Redis Datastore

In the default configuration, Redis runs in an interactive mode after being invoked at the command line. To start Redis in this manner, issue the following command:

    redis-server /etc/redis/redis.conf

You may now interact with Redis using any of the language-specific bindings or use the built-in command line interface to interact with the Redis instance. Simply prefix any [Redis command](http://redis.io/commands) with the following string:

    redis-cli

While running the Redis instance in this configuration is useful for testing and initial deployment, production deployments may have better results by creating a dedicated and unprivileged system user for the Redis instance and controlling Redis using an "init" script. This section covers the creation of an init script and strategies for managing production Redis instances.

## Managing Datastore Persistence

Redis is not necessarily intended to provide a completely consistent and fault-tolerant data storage layer, and in the default configuration there are some conditions that may cause your data store to lose up to 60 seconds of the most recent data. Make sure you understand the risks associated and the potential impact that this kind of data loss may have on your application before deploying Redis.

If persistence is a major issue for your application, it is possible to use Redis in a transaction-ournaling mode that provides greater data resilience at the expense of some performance.

To use this mode, ensure that the following values are set in `redis.conf`:

{{< file-excerpt "redis.conf" >}}
appendonly yes
appendfsync everysec

{{< /file-excerpt >}}


The first directive enables the journaled "append only file" mode, while the second directive forces Redis to write the journal to the disk every second. The `appendfsync` directive also accepts the argument `always` to force writes after every operation, which provides maximum durability, or `never` which allows the operating system to control when data is written to disk, which is less reliable. By default, Redis in Ubuntu has `appendfsync` already set to `everysec`.

After applying these configuration changes, restart Redis:

    service redis-server restart

All modifications to the data store will be logged. Every time Redis restarts, it will "replay" all transactions and ensure that your data store matches the log. However, in some conditions this may render the data-store unusable while the database restores. To avoid this condition, issue the following command to the Redis command line:

    redis-cli bgrewriteaof

This command should return `Background append only file rewriting started`.

You may wish to issue this command regularly, perhaps in a [cron job](/docs/linux-tools/utilities/cron), to ensure that the transaction journal doesn't expand exponentially. bgrewriteaof\ is non-destructive and can fail gracefully.

## Distributed Data Stores with Master Slave Replication

Redis contains limited support for master-slave replication which allows you to create a second database that provides a direct, real-time copy of the data collection on a second system. In addition to providing a "hot spare" or multiple spares for your Redis instance, master-slave systems also allow you to distribute load among a group of servers. As long as all write options are applied to the master node, read operations can be distributed to as many slave nodes as required.

To configure master-slave operation, ensure that the following configuration options are applied to the *slave* instance:

{{< file-excerpt "redis.conf" >}}
slaveof 192.168.10.101 6379

{{< /file-excerpt >}}


The `slaveof` directive takes two arguments: the first is the IP address of the master node; the second is the Redis port specified in the master's configuration.

When you restart the slave Redis instance, it will attempt to synchronize its data set to the master and then propagate the changes. Slave Redis instances can accept slave connections, which allows administrators to distribute the slave-replication load in multi-slave architectures. It's also possible to use a master with less stringent data-persistence policies with a slave that keeps a more persistent copy. Master/slave replication creates a number of powerful architectural possibilities that may suit the needs of your application.

The traffic between slave instances and the master instance is not encrypted and does not require authentication in the default configuration. Authentication is available and can be configured according to the documentation in the `/etc/redis/redis.conf` file; however, this is not the default method for securing Redis instances.

The preferred method for controlling access to Redis instances involves using [iptables](/docs/security/firewalls/iptables) and possibly some sort of encryption such as an SSH tunnel to ensure that traffic is secure. Slaves will automatically attempt to re-establish a connection to the master node if the link fails in a number of situations. However, clusters cannot automatically promote members from slave status to master status; cluster management of this order must occur within your application.
