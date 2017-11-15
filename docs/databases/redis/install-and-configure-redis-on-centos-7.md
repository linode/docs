---
author:
  name: Linode
  email: docs@linode.com
description: 'A step-by-step guide to install and configure a Redis server and set up distributed data stores using master/slave replication on CentOS 7.'
keywords: ["redis", " centos 7", " redis cluster", " centos"]
aliases: ['databases/redis/deploy-redis-on-centos-7/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-02-20
modified_by:
  name: Nick Brewer
published: 2016-04-20
title: 'Install and Configure Redis on CentOS 7'
external_resources:
 - '[Redis Project Home Page](http://redis.io/)'
 - '[Redis Configuration](http://redis.io/topics/config)'
 - '[Redis Persistence](http://redis.io/topics/persistence)'
 - '[Redis Security](http://redis.io/topics/security)'
---

Redis is an open-source, in-memory, data structure store with optional disk writes for persistence. It can be used as a key-value database, or as a cache and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets, and others. Redis can be made highly available with Redis Sentinel and supports automatic partitioning with Redis Cluster.

This document provides both instructions for deploying the Redis server, and an overview of best practices for maintaining Redis instances on CentOS 7. Since Redis serves all data from memory, we recommend using a [high memory Linode](https://www.linode.com/pricing#high_memory) with this guide.

![Deploy Redis on CentOS 7](/docs/assets/deploy-redis-on-centos-7.png "Deploy Redis on CentOS 7")

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo yum update

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

To utilize the [replication](/docs/databases/redis/install-and-configure-redis-on-centos-7#prepare-your-linodes) steps in this guide, you will need at least two Linodes.
{{< /note >}}

## Install Redis

In this section you'll add the [EPEL](https://fedoraproject.org/wiki/EPEL) repository, and then use it to install Redis.

1.  Add the EPEL repository, and update YUM to confirm your change:

        sudo yum install epel-release
        sudo yum update

2.  Install Redis:

        sudo yum install redis

3.  Start Redis:

        sudo systemctl start redis

    **Optional**: To automatically start Redis on boot:

        sudo systemctl enable redis

### Verify the Installation

Verify that Redis is running with `redis-cli`:

    redis-cli ping

If Redis is running, it will return:

    PONG

## Configure Redis

In this section, you'll configure some basic persistence and tuning options for Redis.

### Persistence Options

Redis provides two options for disk persistence:

* Point-in-time snapshots of the dataset, made at specified intervals (RDB).
* Append-only logs of all the write operations performed by the server (AOF).

Each option has its own pros and cons which are detailed in the Redis documentation. For the greatest level of data safety, consider running both persistence methods.

Because the Point-in-time snapshot persistence is enabled by default, you only need to set up AOF persistence:

1.  Make sure that the following values are set for the `appendonly` and `appendfsync` settings in `redis.conf`:

    {{< file-excerpt "/etc/redis.conf" >}}
appendonly yes
appendfsync everysec

{{< /file-excerpt >}}


2.  Restart Redis:

        sudo systemctl restart redis


### Basic System Tuning

To improve Redis performance, set the Linux kernel overcommit memory setting to 1:

    sudo sysctl vm.overcommit_memory=1

This immediately changes the overcommit memory setting, but the change will not persist across reboots. To make it permanent, add `vm.overcommit_memory = 1` to `/etc/sysctl.conf`:

{{< file-excerpt "/etc/sysctl.conf" >}}
vm.overcommit_memory = 1

{{< /file-excerpt >}}


### Additional Swap

Depending upon your usage, you may find it necessary to add extra swap disk space. You can add swap by [resizing your disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk) in the Linode Manager. The [Redis documentation](https://redis.io/topics/admin) recommends the size of your swap disk match the amount of memory available to your system.

## Distributed Redis

Redis provides several options for setting up distributed data stores. The simplest option, covered below, is *master/slave replication*, which creates copies of data. It will also allow distribution of reads among groups of slave copies as long as all write operations are handled by the master server.

The master/slave setup described above can be made highly available with [Redis Sentinel](https://redis.io/topics/sentinel). Sentinel can be configured to monitor both master and slave instances, and will perform automatic failover if the master node is not working as expected. That means that one of the slave nodes will be elected master and all other slave nodes will be configured to use the new master.

With Redis version 3.0 and above, you can use [Redis Cluster](https://redis.io/topics/cluster-tutorial), a data sharding solution that automatically manages replication and failover. With Redis Cluster, you are able to automatically split your dataset among multiple nodes, which is useful when your dataset is larger than a single server's RAM. It also gives you the ability to continue operations when a subset of the nodes are experiencing failures or are unable to communicate with the rest of the cluster.

The following steps will guide you through master/slave replication, with the slaves set to read-only mode.

## Set Up Redis Master/Slave Replication

For this section, you will use two Linodes, a master and a slave.

{{< note >}}
To communicate over the private network, your master and slave Linodes must reside in the same datacenter.
{{< /note >}}

###  Prepare Your Linodes

1.  Set up both Linodes with a Redis instance, using the [Installation](#install-redis) and [Configuration](#configure-redis) steps from this guide. You can also copy your initially configured disk to another Linode using the [Clone](/docs/platform/disk-images/disk-images-and-configuration-profiles#cloning-disks-and-configuration-profiles) option in the Linode Manager.

2.  Configure [Private IP Addresses](/docs/networking/remote-access#adding-private-ip-addresses) on both Linodes, and make sure you can access the master Linode's private IP address from  the slave. You will use only private addresses for replication traffic for security reasons.

### Configure the Master Linode

1.  Configure the master Redis instance to listen on a private IP address by updating the `bind` configuration option in `redis.conf`. Replace `192.0.2.100` with the master Linode's private IP address:

    {{< file-excerpt "/etc/redis.conf" >}}
bind 127.0.0.1 192.0.2.100

{{< /file-excerpt >}}


2.  Restart Redis to apply the changes:

        sudo systemctl restart redis

### Configure the Slave Linode

1.  Configure a slave instance by adding the `slaveof` directive into `redis.conf` to setup the replication. Again replace `192.0.2.100` with the master Linode's private IP address:

    {{< file-excerpt "/etc/redis.conf" >}}
slaveof 192.0.2.100 6379

{{< /file-excerpt >}}


    The `slaveof` directive takes two arguments: the first is the IP address of the master node; the second is the Redis port specified in the master's configuration.

2.  Restart the slave Redis instance:

        sudo systemctl restart redis

    After restarting, the slave Linode will attempt to synchronize its data set to master and then propagate the changes.

### Confirm Replication

Test that the replication works. On your master Linode, run `redis-cli` and execute command `set 'a' 1`

    redis-cli
    127.0.0.1:6379> set 'a' 1
    OK

Type `exit` or press **Ctrl-C** to exit from `redis-cli` prompt.

Next, run `redis-cli` on the slave Linode and execute `get 'a'`, which should return the same value as that on the master:

	redis-cli
	127.0.0.1:6379> get 'a'
	"1"

Your master/slave replication setup is working properly.

## Secure the Redis Installation

Since Redis is designed to work in trusted environments and with trusted clients, you should control access to the Redis instance. Some recommended security steps include:

- Set up a firewall using [iptables](/docs/security/firewalls/iptables).

- Encrypt Redis traffic using an SSH tunnel, or the methods described in the [Redis Security documentation](http://redis.io/topics/security).

Additionally, to ensure that no outside traffic accesses your Redis instance, we suggest that you only listen for connections on the localhost interface or your Linode's private IP address.

### Use Password Authentication

For an added layer of security, use password authentication to secure the connection between your master and slave Linodes.

1.  On your master Linode, uncomment the `requirepass` line in your Redis configuration and replace `master_password` with a secure password:

    {{< file-excerpt "/etc/redis.conf" >}}
requirepass master_password

{{< /file-excerpt >}}


2.  Save your changes, and apply them by restarting Redis on the master Linode:

        sudo systemctl restart redis

3.  On your slave Linode, add the master password to your Redis configuration under `masterpass`, and then create a unique password for the slave Linode with `requirepass`:

    {{< file-excerpt "/etc/redis.conf" >}}
masterpass  master_password
requirepass slave_password

{{< /file-excerpt >}}


    Replace `master_password` with the password you configured on your master, and replace `slave_password` with the password to use for your slave Linode.

4.  Save your changes, and restart Redis on your slave Linode:

        sudo systemctl restart redis

5.  Connect to `redis-cli` on your master Linode, and use `AUTH` to authenticate with your master password:

        redis-cli
        127.0.0.1:6379> AUTH master_password

6.  Once you've authenticated, you can view details about your Redis configuration by running `INFO`. This provides a lot of information, so you can specifically request the "Replication" section in your command:

        127.0.0.1:6379> INFO replication

    Output should be similar to the following:

        # Replication
        role:master
        connected_slaves:1
        slave0:ip=192.0.2.105,port=6379,state=online,offset=1093,lag=1

    It should confirm the master role of your Linode, as well as how many slave Linodes are connected to it.

7.  From your slave Linode, connect to `redis-cli` and authenticate using your slave password:

        redis-cli
        127.0.0.1:6379> AUTH slave_password

3.  Once you've authenticated, use `INFO` to confirm your slave Linode's role, and its connection to the master server:

        127.0.0.1:6379> INFO replication
        # Replication
        role:slave
        master_host:192.0.2.100
        master_port:6379
        master_link_status:up
