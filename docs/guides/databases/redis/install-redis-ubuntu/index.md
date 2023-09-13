---
slug: install-redis-ubuntu
description: 'This guide shows you how to install and configure the open-source database, cache, and message broker application Redis, on Ubuntu 20.04 Server.'
keywords: ['install redis ubuntu']
tags: ['ubuntu', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-02
image: REDIS.jpg
modified_by:
  name: Linode
title: "Install and Configure Redis on Ubuntu 20.04"
title_meta: "How to Install and Configure Redis on Ubuntu 20.04"
aliases: ['/databases/redis/ubuntu-12.04-precise-pangolin/']
external_resources:
- '[Redis](https://redis.io/)'
- '[Redis commands](https://redis.io/commands)'
relations:
    platform:
        key: how-to-install-redis
        keywords:
            - distribution: Ubuntu 20.04
authors: ["Jeff Novotny"]
---

This guide explains how to install and perform the basic configuration of [*Redis*](https://redis.io/) on Ubuntu version 20.04. Redis is an open-source in-memory data structure store. It can serve as a database cache and message broker and works well with web applications. Redis is an example of a key-value store database. A key is used to retrieve a stored value. A value can contain either a simple data type such as a string, or a complex data structure such as a list, set, or hash.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Redis Advantages and Disadvantages

Redis supports concurrency since all single-command operations in Redis are atomic. Redis contains a large [library of commands](https://redis.io/commands), but it does not have a query language or relational capabilities. Since Redis is an in-memory database, it runs quickly with low latency. However, you can only store as much data as memory allows. Redis provides persistence methods to either write the current database state to disk or record all transactions in a log.

Redis requires a robust, stable hosting environment to function properly. To store large amounts of data, we recommend hosting Redis on a [*High Memory Linode*](https://www.linode.com/products/high-memory/).

## A Summary of the Redis Installation and Configuration Process

A complete Redis installation, including basic configuration tasks, consists of the high-level steps outlined below. Each step is covered in detail in its own section.

1. Verify your System Parameters
1. Install Redis
1. Enable and Run Redis
1. Secure Redis
1. Configure Redis Persistence
1. Optimize Redis for Better Performance

## Verify your System Parameters

Ensure your Linode is running an up-to-date version of Ubuntu 20.04. If necessary, enable and configure the ufw firewall. Run the following commands to enable `ufw` and allow it to accept incoming SSH connections.

1. Configure `ufw` to allow SSH connections.

        ufw allow OpenSSH
1. Enable `ufw`.

        ufw enable
1. Run the `ufw status` command to confirm the configuration.

        ufw status
    The output now lists the OpenSSH protocols along with an action of `ALLOW`.

        To                         Action      From
        --                         ------      ----
        OpenSSH                    ALLOW       Anywhere
        OpenSSH (v6)               ALLOW       Anywhere (v6)

## Install Redis

You can install Redis either through the Ubuntu APT utility or from a TAR file. The latest stable version (as of January 2021) is Redis 6.0.9, but pre-release versions are also available on the [Redis downloads page](https://redis.io/download).

### Install Redis From a Package

To install Redis using the APT utility, follow the steps below:

1. Add the Redis repository to the Ubuntu source repositories.

        sudo add-apt-repository ppa:redislabs/redis
1. Update your Ubuntu packages.

        sudo apt update
1. Install Redis using the package installation program.

        sudo apt install redis-server

{{< note >}}
If the Redislabs repository is added, APT automatically installs the latest stable version. We do not recommend installing Redis through the Ubuntu default packages, as that might install an older version.
{{< /note >}}

### Install Redis From a Downloaded File

To install Redis from a downloaded `.gz` file, follow the steps below:

1. Download the latest stable version from the [Redis downloads page](https://redis.io/download) to your computer. Transfer the Redis file to your host via `scp`, `ftp`, or any other file transfer method. The following example shows a Redis 6.0.9 executable. Replace the filename with the actual name of the file you are transferring, and substitute your user name and host IP address.

        scp /localpath/redis-6.0.9.tar.gz user@yourhost:~/
1. Unzip the file using the tar utility.

        tar xzf redis-6.0.9.tar.gz
1. Change directory to the appropriate directory and install Redis. The actual directory name depends upon the exact Redis version.

        cd redis-6.0.9
        make

## Enable and Run Redis

[Redis-cli](https://redis.io/topics/rediscli) is the main command-line interface for Redis. Through this utility you can interactively store and retrieve data, and perform administrative tasks. You can configure Redis through the `redis.conf` file, which contains a list of directives. Each directive consists of a variable name, plus a value, such as `supervised systemd`.

1. Add a directive to allow Redis to start via the system control utility. Edit the `redis.conf` file at `/etc/redis/redis.conf`, and change the value of the `supervised` directive to `systemd`. This setting is found in the "General" section of the file.

    {{< file "/etc/redis/redis.conf" >}}
...
supervised systemd
...
{{< /file >}}
1. Use `systemctl` to start the Redis service.

        sudo systemctl restart redis.service
1. Enter the interactive Redis CLI.

        redis-cli
1. Perform a `ping` to test connectivity to the server.

        PING
    If Redis is running, it returns a `PONG` as a reply.
    {{< output >}}
    PONG
    {{< /output >}}
1. Use the `SET` command to create a key-value pairing. Redis returns an `OK` response upon a successful set operation.

        SET server:name "fido"
1. Retrieve the value of the key you previously set.

        GET server:name
    Redis returns `fido` as the result.
    {{< output >}}
    fido
    {{< /output >}}

{{< note >}}
The `redis.conf` file contains extensive documentation and many examples. A sample `redis.conf` file can be found on the [Redis Git Hub site](https://raw.githubusercontent.com/redis/redis/6.0/redis.conf).
{{< /note >}}

{{< note >}}
You can also use `redis-cli` as a function to run any command. Pass in the command and any associated variables as arguments. For example, you can perform a ping with `redis-cli ping`.
{{< /note >}}

## Secure Redis

### Configure a Password for Redis

Beginning with version 6, Redis maintains multi-user security through an *Access Control List* (ACL). Additionally, you can create a default user password. A default password might be sufficient for a single user. However, we highly recommend you use one or both of these methods.

1. Change the `requirepass` variable in the `redis.conf` file to set the default password. Uncomment the existing `requirepass` directive, and change the default password to a more secure password.
    {{< file "/etc/redis/redis.conf" >}}
...
requirepass yourpassword
...
{{< /file >}}
1. Restart Redis to force the changes to take effect.

        sudo systemctl restart redis.service
1. Enter `redis-cli` and set a key and value without authenticating.

        redis-cli
        SET server:name "fido2"
    Redis returns an authentication error since you have not logged in yet.
    {{< output >}}
    (error) NOAUTH Authentication required.
    {{< /output >}}
1. Login with the `auth` command, replacing "password" with the password you configured. Redis returns an `OK` response upon a successful login.

        AUTH "password"
1. Try the previous SET command again. Redis now returns an `OK` response.

        SET server:name "fido2"

### Configure an Access Control List (ACL) for Redis

In a multi-user environment, we highly recommend you configure an ACL. An ACL restricts privileges and potentially dangerous commands to a subset of the users. You can create additional users in the `redis.conf` file. Each user directive must contain a username, the keyword `on` or `off` to enable or disable the entry, a set of command permissions and restrictions, a set of key permissions, and the password (with a preceding `>` symbol). To indicate all commands, use `@all`. Use `allkeys` to reference all key-value pairs. Redis parses each user directive from left to right, so the order of permissions and restrictions is important.

This is only a brief introduction to this topic. Create users with memorable names, strong passwords, and appropriate permissions when building your own ACL. A complete explanation of all the ACL options is available on the [*Redis ACL page*](https://redis.io/topics/acl).

1. Display the current ACL configuration with the `ACL LIST` command. It currently shows only the default user and their privileges.

        redis-cli
        ACL LIST
1. Edit the `redis.conf` file and add user directives for two users. The first directive adds `user2` and assigns the password `user2pass`, along with access to all commands and keys. The second user directive, for `user3`, is similar except this user cannot run `SET` commands.
    {{< file "/etc/redis/redis.conf" >}}
user user2 +@all allkeys on >user2pass
user user3 +@all -SET allkeys on >user3pass
{{< /file >}}
1. Restart Redis to force the changes to take effect.

        sudo systemctl restart redis.service
1. Re-enter the Redis CLI and log in as `user2` (authenticate with the `AUTH` command). Execute a `SET` command. Redis now returns an `OK` response.

        redis-cli
        AUTH user2 user2pass
        SET server:name "fido2"
1. Exit and then re-enter the Redis CLI, authenticating as `user3`. Attempt to execute another `SET` to change the same key to a new value.

        redis-cli
        AUTH user3 user3pass
        SET server:name "fido3"
    This attempt fails and returns a permission error.
    {{< output >}}
    (error) NOPERM this user has no permissions to run the 'set' command or its subcommand
    {{< /output >}}
1. Attempt to retrieve the value of this same key with a `GET` command. Redis now returns the value.

        GET server:name

{{< note >}}
You can also create users through the `redis-cli` interface using the `ACL SET USER` command, or through a separate ACL file. See the [*Redis ACL page*](https://redis.io/topics/acl) for more information.

In earlier versions of Redis, administrators could rename and therefore hide powerful commands using `rename-command` directives in `redis.conf`. With the introduction of the ACL feature, this directive is no longer recommended. However, it is still available for backward compatibility.
{{< /note >}}

## Configure Redis Persistence

Redis stores all of its data in memory, so in the event of a crash or a system reboot everything is lost. If you want to permanently save your data, you must configure some form of data persistence. Redis supports two persistence options:

- *Redis Database File* (RDB) persistence takes snapshots of the database at intervals corresponding to the `save` directives in the `redis.conf` file. The `redis.conf` file contains three default intervals. RDB persistence generates a compact file for data recovery. However, any writes since the last snapshot is lost.

- *Append Only File* (AOF) persistence appends every write operation to a log. Redis replays these transactions at startup to restore the database state. You can configure AOF persistence in the `redis.conf` file with the `appendonly` and `appendfsync` directives. This method is more durable and results in less data loss. Redis frequently rewrites the file so it is more concise, but AOF persistence results in larger files, and it is typically slower than the RDB approach.

1. To change the RDB snapshot intervals, edit the `save` directives in `redis.conf`. A directive consisting of `save 30 100` means Redis continues to take a snapshot every 30 seconds provided at least 100 keys have changed. Multiple snapshot thresholds can be configured.

    {{< file "/etc/redis/redis.conf" >}}
save 900 1
save 300 10
save 60 10000
{{< /file >}}
1. To enable AOF persistence, edit `redis.conf` and change the value of the `appendonly` directive to `yes`. Then you can set the `appendfsync` directive to any one of the following of your choice.
   - `always` - sync upon every new command
   - `everysec` - sync one time per second
   - `no` - let Ubuntu manage the sync.

   The default of `everysec` is a good compromise for most implementations.
    {{< file "/etc/redis/redis.conf" >}}
appendonly yes
appendfsync everysec
{{< /file >}}
1. Restart the redis server after making any changes to the Redis persistence directives.

        sudo systemctl restart redis.service

{{< note >}}
Some of the AOF persistence settings are complicated. Consult the [*Redis Persistence Documentation*](https://redis.io/topics/persistence) for more advice about this option.
{{< /note >}}

## Optimize Redis for Better Performance

Redis recommends several additional optimizations for the best performance. In addition to the following advice, Redis makes several recommendations regarding persistence and replication. Consult the [*Redis Administration Information*](https://redis.io/topics/admin) for more information.

1. Set the overcommit memory setting to `1` in `sysctl.conf`. You must reboot the node for this setting to take effect.
    {{< file "/etc/sysctl.conf" >}}
vm.overcommit_memory = 1
{{< /file >}}
    {{< note respectIndent=false >}}
Enter the command `sysctl vm.overcommit_memory=1` to apply this setting immediately.
{{< /note >}}
1. Disable the transparent huge pages feature as this adversely affects Redis latency.

        echo never > /sys/kernel/mm/transparent_hugepage/enabled
1. Specify an explicit maximum memory value (in bytes) in `redis.conf`. This value must be at least somewhat less than your available system memory. Restart Redis after making this change.
    {{< file "/etc/redis/redis.conf" >}}
maxmemory 2147483648
{{< /file >}}
1. Create some swap space in the system to prevent Redis from crashing if it consumes too much memory. The following commands set up a 2GB swap file.

        sudo mkdir /swapdir/
        sudo dd if=/dev/zero of=/swapdir/swapfile bs=1MB count=2048
        sudo chmod 600 /swapdir/swapfile
        sudo mkswap /swapdir/swapfile
        sudo swapon /swapdir/swapfile
