---
author:
  name: Sergey Pariev
  email: spariev@gmail.com
description: 'Deploy applications that depend on the high performance key-value store Redis.'
keywords: 'redis ubuntu 14.04,redis trusty tahr,nosql,database,key-value store'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, January 11th, 2016
modified_by:
  name: Sergey Pariev
published: 'Monday, January 11th, 2016'
title: 'Redis on Ubuntu 14.04 LTS (Trusty Tahr)'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
 - '[Redis Project Home Page](http://redis.io/)'
 - '[Redis Configuration](http://redis.io/topics/config)'
 - '[Redis Persistence](http://redis.io/topics/persistence)'
 - '[Redis Security](http://redis.io/security)'
---

Redis is an open source in-memory data structure store, with optional disk writes for persistence, which can be used as key-value database, cache and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets and others. Redis can be made highly available with Redis Sentinel and supports automatic partitioning with Redis Cluster. This document provides both instructions for deploying the Redis server and an overview of best practices for maintaining Redis instances.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system.

		sudo apt-get update && sudo apt-get upgrade


{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Redis Installation

Redis package in Ubuntu 14.04 repository is outdated and misses several security patches, so in this case it is better to use third-party PPA.

1.  Add Redis PPA repository to install the latest version -

		sudo add-apt-repository ppa:chris-lea/redis-server

2.  Update packages and install `redis-server` package

		sudo apt-get update
		sudo apt-get install redis-server

3.  Verify Redis is up by running `redis-cli` and executing `ping` command

		redis-cli
		127.0.0.1:6379> ping
		PONG

Press **Ctrl-C** to exit from `redis-cli` prompt.


## Redis Configuration

### Configure Persistence Options

Redis provides two options for disk persistence:

* Point-in-time snapshots of the dataset, made at specified intervals (RDB)
* Append only logs of all the write operations performed by the server (AOF).

Each option has it's own pros and cons, which are described in great detail in Redis documentation. For most possible data safety it is advised to use both persistence methods.

As the point-in-time snapshot persistence is enabled by default, the only thing you will need to do is to setup AOF persistence.
For this, add the following lines to `redis.conf` file:

{: .file-excerpt }
/etc/redis/redis.conf
:   ~~~
    appendonly yes
    appendfsync everysec
    ~~~

After this, restart Redis with

	    sudo service redis-server restart


### Basic System Tuning

To improve Redis performance, make the following adjustments to the Linux system settings.

1.  Set the Linux kernel overcommit memory setting to 1. Run command

		sudo sysctl vm.overcommit_memory=1

to change overcommit memory setting immediately. To make the change permanent, add line `vm.overcommit_memory = 1` to `/etc/sysctl.conf` -

{: .file-excerpt }
/etc/sysctl.conf
:   ~~~
    vm.overcommit_memory = 1
    ~~~

2.  Disable Linux kernel feature transparent huge pages, as this feature will affect Redis performance in a negative way. Run

		sudo echo never > /sys/kernel/mm/transparent_hugepage/enabled

to disable it immediately. To make this a permanent change add the following lines to `/etc/rc.local` before `exit 0` line:

{: .file-excerpt }
/etc/rc.local
:   ~~~
	if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
		echo never > /sys/kernel/mm/transparent_hugepage/enabled
	fi
    ~~~


You can confirm that it worked with command

		cat /sys/kernel/mm/transparent_hugepage/enabled

which should output `always madvise [never]`.

## Distributed Redis

Redis provides several options for setting up distributed data stores. The simplest one is the *master-slave replication*, which allows you to have a real-time copy (or multiple copies) of master server data. It will also allow to distribute reads among group of slave copies, as long as all write operations are handled by master server.

Master-slave setup described above can be made highly available with *Redis Sentinel*. Sentinel will monitor both master and slave instances, and will perform automatic failover if master node is not working as expected. That means that one of the slave nodes will be elected master and all other slave nodes will be configured to use a new master.

Starting from version 3.0, there is also a *Redis Cluster*, which is a data sharding solution with automatic management, handling failover and replication. With Redis Cluster you are able to automatically split your dataset among multiple nodes, which is useful when your dataset is larger than a single server RAM. It also gives you an ability to continue operations when a subset of the nodes are experiencing failures or are unable to communicate with the rest of the cluster.

In this guide you will set up master slave replication as it is the simplest option.


## Setting Up Master Slave Replication

1.  Setup Linode with slave Redis instance using **Redis Installation** and **Redis Configuration** steps from this guide.

2.  Configure [Private IP Addresses](/docs/networking/remote-access#adding-private-ip-addresses) on both Linodes, and make sure you can access master Linode's private IP address from slave. You will use only private addresses for replication traffic for security reasons.

3.  Configure master Redis instance to listen on private IP address by updating `bind` configuration option in `redis.conf`

{: .file-excerpt }
/etc/redis/redis.conf
:   ~~~
    bind 127.0.0.1 <master_private_ip>
    ~~~


Restart `redis-server` to apply the changes:

	    sudo service redis-server restart

4.  Configure slave instance by adding `slaveof` directive into `redis.conf` to setup the replication -

{: .file-excerpt }
/etc/redis/redis.conf
:   ~~~
    slaveof <master_private_ip> 6379
    ~~~

The `slaveof` directive takes two arguments: the first is the IP address of the master node; the second is the Redis port specified in the master's configuration.

Restart the slave Redis instance:

	    sudo service redis-server restart

After restart slave instance will attempt to synchronize its data set to the master and then propagate the changes.

5.  Test that the replication works. On master Linode, run `redis-cli` and execute command `set 'a' 1`

		$ redis-cli
		127.0.0.1:6379> set 'a' 1
		OK

Press **Ctrl-C** to exit from `redis-cli` prompt.
Then run `redis-cli` on slave Linode, and execute `get 'a'` which should return the same value as on master

	    $ redis-cli
		127.0.0.1:6379> get 'a'
		"1"

Your master-slave replication setup is working properly.

## Securing Redis Installation

Since Redis is designed to work in trusted environments and with trusted clients, you should take care of controlling access to the Redis instance. The preferred method for doing this is to set up firewall using [iptables](/docs/security/firewalls/iptables) and possibly some sort of encryption such as an SSH tunnel to ensure that traffic is secure. Also, to make sure that nobody from outside can access your Redis instance, it is advised to only listen for connections on localhost interface or on your Linode's private IP.
