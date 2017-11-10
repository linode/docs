---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy Redis on Ubuntu 14.04 LTS, Ubuntu 16.04 LTS, or Debian 8. This Tutorial Guides You Through Installation and Best Practices of Redis, an Open-Source, In-Line Memory Data-Structure Store.'
keywords: ["redis", "redis ubuntu 14.04", "redis server", "redis ubuntu 16.04", "debian 8", "redis cluster"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/redis/deploy-redis-on-ubuntu-or-debian/']
modified: 2017-09-13
modified_by:
  name: Edward Angert
published: 2016-04-20
title: 'How to Install a Redis Server on Ubuntu or Debian 8'
og_description: 'This tutorial guides you through installation and best practices of Redis on Ubuntu 14.04 LTS, Ubuntu 16.04 LTS, or Debian 8'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
 - '[Redis Project Home Page](http://redis.io/)'
 - '[Redis Configuration](http://redis.io/topics/config)'
 - '[Redis Persistence](http://redis.io/topics/persistence)'
 - '[Redis Security](http://redis.io/security)'
---

*This is a Linode Community guide. [Write for us](/docs/linode-writers-guide/) and earn $250 per published guide.*
<hr>

![Redis Server on Ubuntu or Debian](/docs/assets/how-to-install-a-redis-server-on-ubuntu-or-debian/How_to_Install_a_Redis_Server_smg.jpg)

Redis is an open-source, in-memory, data-structure store with optional disk writes for persistence, which can be used as key-value database, cache and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets and others. Redis can be made highly available with Redis Sentinel and supports automatic partitioning with Redis Cluster. This document provides both instructions for deploying the Redis server and an overview of best practices for maintaining Redis instances.

Since Redis serves all data from memory, we recommend using a [high memory Linode](https://www.linode.com/pricing#high-memory) with this guide.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4.  Install the `software-properties-common` package:

        sudo apt-get install software-properties-common

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

To utilize the replication steps in the second half of this guide, you will need at least two Linodes.
{{< /note >}}

## Install Redis

### Ubuntu

The Redis package in the Ubuntu repositories is outdated and lacks several security patches; consequently, we'll use a third-party PPA for installation.

Add the Redis PPA repository to install the latest version:

    sudo add-apt-repository ppa:chris-lea/redis-server


### Debian

[Dotdeb](https://www.dotdeb.org) is a popular, third-party repository for Debian users looking for newer versions of the LAMP stack and related software than what's been provided by Debian.

1.  Review the [list of mirrors](https://www.dotdeb.org/mirrors/) Dotdeb provides and select the one closest to your Linode.

2.  Create the file `/etc/apt/sources.list.d/dotdeb.list` and copy the appropriate mirror information to it:

    {{< file "/etc/apt/sources.list.d/dotdeb.list" >}}
deb http://ftp.utexas.edu/dotdeb/ stable all
deb-src http://ftp.utexas.edu/dotdeb/ stable all

{{< /file >}}


3.  Download and install the GPG key, as documented in the [Dotdeb instructions](https://www.dotdeb.org/instructions/):

        wget https://www.dotdeb.org/dotdeb.gpg
        sudo apt-key add dotdeb.gpg


### Update and Install

Update packages and install `redis-server` package:

    sudo apt-get update
    sudo apt-get install redis-server

### Verify the Installation

Verify Redis is up by running `redis-cli`:

    redis-cli

Your prompt will change to `127.0.0.1:6379>`. Run the command `ping`, which should return a `PONG`:

    127.0.0.1:6379>ping
    PONG

Enter `exit` or press **Ctrl-C** to exit from the `redis-cli` prompt.


## Configure Redis

### Configure Persistence Options

Redis provides two options for disk persistence:

* Point-in-time snapshots of the dataset, made at specified intervals (RDB)
* Append-only logs of all the write operations performed by the server (AOF).

Each option has its own pros and cons, which are detailed in Redis documentation. For the greatest level of data safety, consider running both persistence methods.

Because the point-in-time snapshot persistence is enabled by default, you only need to setup AOF persistence.

1.  Make sure that the following values are set for `appendonly` and `appendfsync` settings in `redis.conf`:

    {{< file-excerpt "/etc/redis/redis.conf" >}}
appendonly yes
appendfsync everysec

{{< /file-excerpt >}}


2.  Restart Redis with:

        sudo service redis-server restart


### Basic System Tuning

To improve Redis performance, make the following adjustment to the Linux system settings.

1.  Set the Linux kernel overcommit memory setting to 1:

        sudo sysctl vm.overcommit_memory=1

2.  This immediately changes the overcommit memory setting. To make the change permanent, add  `vm.overcommit_memory = 1` to `/etc/sysctl.conf`:

    {{< file-excerpt "/etc/sysctl.conf" >}}
vm.overcommit_memory = 1

{{< /file-excerpt >}}


## Distributed Redis

Redis provides several options for setting up distributed data stores. The simplest option, covered below, is the *master/slave replication*, which creates a real-time copy (or multiple copies) of master/server data. It will also allow distribution of reads among groups of slave copies as long as all write operations are handled by the master server.

The master/slave setup described above can be made highly available with *Redis Sentinel*. Sentinel can be configured to monitor both master and slave instances, and will perform automatic failover if the master node is not working as expected. That means that one of the slave nodes will be elected master and all other slave nodes will be configured to use a new master.

Starting with Redis version 3.0, you can use *Redis Cluster* - a data sharding solution, that automatically manages replication and failover. With Redis Cluster you are able to automatically split your dataset among multiple nodes, which is useful when your dataset is larger than a single server's RAM. It also gives you the ability to continue operations when a subset of the nodes are experiencing failures or are unable to communicate with the rest of the cluster.

The following steps will guide you through master/slave replication, with the slaves set to read-only.


## Set Up Master/Slave Replication

###  Prepare Two Linodes and Configure the Master Linode

For this section of the guide, you will use two Linodes, respectively named `master` and `slave`.

1.  Set up both Linodes with a Redis instance, using **Redis Installation** and **Redis Configuration** steps from this guide. You can also copy your initially configured disk to another Linode using the [Clone](/docs/platform/disk-images/disk-images-and-configuration-profiles/#cloning-disks-and-configuration-profiles) option in the Linode Manager.

2.  Configure [Private IP Addresses](/docs/networking/remote-access#adding-private-ip-addresses) on both Linodes, and make sure you can access the `master` Linode's private IP address from `slave`. You will use only private addresses for replication traffic for security reasons.

3.  Configure the `master` Redis instance to listen on a private IP address by updating the `bind` configuration option in `redis.conf`. Replace `192.0.2.100` with the `master` Linode's private IP address

    {{< file-excerpt "/etc/redis/redis.conf" >}}
bind 127.0.0.1 192.0.2.100

{{< /file-excerpt >}}


        Restart `redis-server` to apply the changes:

            sudo service redis-server restart

### Configure the Slave Linode

1.  Configure a slave instance by adding the `slaveof` directive into `redis.conf` to setup the replication. Again replace `192.0.2.100` with the `master` Linode's private IP address:

    {{< file-excerpt "/etc/redis/redis.conf" >}}
slaveof 192.0.2.100 6379

{{< /file-excerpt >}}


    The `slaveof` directive takes two arguments: the first is the IP address of the master node; the second is the Redis port specified in the master's configuration.

2.  Restart the slave Redis instance:

        sudo service redis-server restart

After restart, the `slave` Linode will attempt to synchronize its data set to `master` and then propagate the changes.

### Confirm Replication

Test that the replication works. On master Linode, run `redis-cli` and execute command `set 'a' 1`

    redis-cli
    127.0.0.1:6379> set 'a' 1
    OK

Type `exit` or press **Ctrl-C** to exit from `redis-cli` prompt.
Then, run `redis-cli` on `slave` and execute `get 'a'`, which should return the same value as that on `master`:

	redis-cli
	127.0.0.1:6379> get 'a'
	"1"

Your master/slave replication setup is working properly.

## Secure the Redis Installation

Since Redis is designed to work in trusted environments and with trusted clients, you should take care of controlling access to the Redis instance. Security methods include:

- Setting up a firewall using [iptables](/docs/security/firewalls/iptables).

- Encrypting Redis traffic, using an SSH tunnel or the methods described in the [Redis Security documentation](http://redis.io/topics/security).

Additionally, to ensure that no outside traffic accesses your Redis instance, we suggest that you only listen for connections on the localhost interface or your Linode's private IP.
