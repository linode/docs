---
slug: redis-getting-started
description: "Learn how to start using Redis databases, connecting to a Redis server and working with data on it."
keywords: ['connecting to redis server', 'how to create redis database', 'getting started with redis']
tags: ['redis', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-14
modified_by:
  name: Nathaniel Stickman
title: "Connect to Redis and Use The Redis Database"
title_meta: "How to Connect to Redis and Use The Redis Database"
external_resources:
- '[Redis: Commands](https://redis.io/commands)'
aliases: ['/guides/how-to-connect-to-redis/']
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

Redis is an open-source NoSQL database used for in-memory storage of data structures. It works exceptionally well for caching, messaging, and other data storage contexts where quick, and low-latency storage is needed.

This tutorial gets you started using Redis. It explains how to connect to a Redis server that is located locally or remotely. The guide then goes into details on creating, populating, and saving a Redis database.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Follow the instructions in our [How to Install and Configure Redis on Ubuntu 20.04](/docs/guides/install-redis-ubuntu/) guide to install a Redis server and command-line interface (CLI). Be sure to use the drop down menu at the top of that page to select your Linux distribution and get the appropriate steps.

1. Replace `/etc/redis/redis.conf` throughout this guide with the actual location of your Redis server's configuration file.

    Generally, on **Debian** and **Ubuntu**, the location defaults to the above. On **AlmaLinux**, **CentOS**, and **Fedora**, the default location is usually `/etc/redis.conf`.

{{< note respectIndent=false >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see our [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Connect to Your Redis Server

You can use the Redis CLI tool to connect to a Redis server that is located locally and remotely. The steps in the following sections show you how to do both.

The examples that follow assume that you have created a user on the Redis server and have set up restricted access using the `requirepass` configuration directive. For these examples, the Redis authentication and user configuration is shown below:

{{< file "/etc/redis/redis.conf" >}}
# [...]
requirepass admin-password
# [...]
user example-user +@all allkeys on >password
# [...]
{{< /file >}}

### Connect to a Local Redis Server

The Redis CLI automatically connects to a local Redis server when you run the `redis-cli` command. From there, you need to authenticate your connection to be able to view and modify the Redis database on the server.

Redis gives you the following two ways of authenticating your connection:

- **Using command-line options**: In this case, you provide the username and password of your Redis user as part of the command to start the Redis CLI. Use the `--user` flag to provide a username and the `--pass` flag to provide a password as shown below:

        redis-cli --user example-user --pass password

- **Using the CLI interface**: The CLI has an `AUTH` command which authenticates a connection given a username and password. The command is used as follows:

        AUTH example-user password

    If the password provided via `AUTH` command matches the password in the `/etc/redis/redis.conf` configuration file, the server replies with the `OK` status code and starts accepting commands.

    {{< output >}}
    OK
    {{< /output >}}

Both options above also support password-only authentication.

- Use the `-a` flag to authenticate by password on the command line:

        redis-cli -a admin-password

- Use the `AUTH` command with only one argument to authenticate by password:

        AUTH admin-password

### Connect to a Remote Redis Server

To connect to your Redis server remotely, you first need to open the appropriate port in your firewall and bind Redis to an address.

1. Open port `6379` on your system's firewall.

    - On **Debian** and **Ubuntu**, you can do so using UFW. See our [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) guide for more information on using UFW. Typically, you can open the port using the following commands:

            sudo ufw allow 6379
            sudo ufw reload

    - On **CentOS** and **Fedora**, you can use FirewallD. Take a look at our guide [Introduction to FirewallD on CentOS](/docs/guides/introduction-to-firewalld-on-centos/) for more information on using FirewallD. You can usually open the port using the following commands:

            sudo firewall-cmd --zone=public --add-port=6379/tcp --permanent
            sudo firewall-cmd --reload

1. Open the `redis.conf` Redis configuration file, typically located at `/etc/redis/`. Then, modify or add a line for `bind`, indicating your server's IP address or domain name.

    The example below listens for both local and remote connections. Replace `192.0.2.0` with your server's IP address. You could, alternatively, replace this IP address with your server's domain name.

    {{< file "/etc/redis/redis.conf" >}}
# [...]
bind 127.0.0.1 192.0.2.0
# [...]
    {{< /file >}}

    Subsequent examples use this IP address for your server, so replace them as you go.

1. Once you have these configurations set up on the server, you can connect to Redis from a remote client.

    Install the Redis CLI on the machine you want to access the server from, then execute the following command:

        redis-cli -h 192.0.2.0 -p 6379

    You can then authenticate using the Redis CLI interface, as shown in the previous section. Although you can still authenticate using command-line flags, it is recommended that you use the CLI interface instead for added security.

### Verifying Connection

To verify your connection to the Redis server, you can execute the `PING` Redis command:

    PING

The server responds with the output below, verifying that you are connected and authenticated.

{{< output >}}
PONG
{{< /output >}}

## How to Manage Redis Databases

Once you are connected to the Redis server, you can start working with the databases and keys that are stored. The following sections explain some of the most useful actions and commands you can use for managing your Redis databases.

### Create a Redis Database

Redis does not have *database creation* in the same way you might see with SQL databases, like MySQL. By default, Redis creates 16 databases, indexed 0–15. You can see how to select between those databases in the next section.

You can alter the number of databases via the Redis configuration file. The example below demonstrates what the default configuration looks like:

{{< file "/etc/redis/redis.conf" >}}
# [...]
databases 16
# [...]
{{< /file >}}

Redis does not give you a way to name or otherwise define a database beyond the databases' indices.

### Select a Database

You can choose which database you are currently viewing and operating on with the `SELECT` command. For instance, to start using the database at index `1`, you can use the command below:

    SELECT 1

For any database index except `0`, the Redis CLI indicates the current index in the command prompt, as shown below:

{{< output >}}
127.0.0.1:6379[1]>
{{< /output >}}

### Move Redis Databases and Data

The Redis CLI gives you two options for moving data between Redis databases.

- You can move data wholesale from one database to another using the `SWAPDB` command. Here is an example that moves the keys in database `1` to database `0`; conversely, database `0` gets the keys from database `1`:

        SWAPDB 0 1

- You can migrate keys from a database on one Redis server to another using the `MIGRATE` command. It takes the address of the destination server, its port number, the key name, and a number of milliseconds for a timeout.

    Migration requires that you set up the remote server for remote access, as described in the [Connect to a Remote Redis Server](/docs/guides/redis-getting-started/#connect-to-a-remote-redis-server) section above.

    The example below migrates a key called `key_1` from the current database to a remote database at `192.0.2.0`:

        MIGRATE 192.0.2.0 6379 key_1 5000

    The command also has a feature to allow you to migrate multiple keys at once. Use an empty string for the key field, then end the command with the `KEYS` keyword followed by a list of key names. For instance:

        MIGRATE 192.0.2.0 6379 "" 5000 KEYS key_1 key_2 key_3

### Remove a Redis Database

Because there is no database creation as such in Redis, it also lacks database deletion.

However, you can clear out the data in a given database using the `FLUSHDB` command. This deletes all of the keys in the currently selected database.

    FLUSHDB

{{< note type="alert" respectIndent=false >}}
The effects of this command are immediate and cannot be undone unless you have backed up your database.
{{< /note >}}

## Working with Keys in Redis

Data in Redis databases are stored as key-value pairs. Each key can be as simple as a key name and a string value or as complicated as a hash object which itself contains numerous key-value pairs.

You can learn more about the data types Redis supports in our upcoming guides in this series. Each data type gets covered in depth in these guides, so be sure to check them out.

The following sections show you how to start working with keys, no matter their types. You can see how to set new keys, to "query" for a particular key, and how to modify keys.

### Setting and Getting Redis Keys

Create new entries — keys — in your database with the `SET` command. It takes the name of the key and its value as shown below:

    SET key_1 "Value 1"

The example above assigns a string `Value 1` as the key's value. But, as mentioned above, Redis supports several different data types, which you can learn about in our upcoming guides in this series.

Redis does not have a query language like SQL or many other NoSQL databases. It, instead, provides a simple, and straightforward key storage focused on speed, and availability.

To view a key's value in a Redis database, you use the `GET` command followed by the key name:

    GET key_1

{{< output >}}
"Value 1"
{{< /output >}}

### Modify and Move Redis Keys

To rename a key, you can use a command like the example below. The example renames the `key_1` key to `key_one`.

    RENAME key_1 key_one

There are two ways of deleting keys:

- The `DEL` command deletes a key synchronously and immediately. It is the best option for most key deletions.

        DEL key_2

- The `UNLINK` command is useful when you want to delete potentially large keys. It determines how long the deletion would take, and runs the deletion asynchronously if the estimate crosses a certain threshold. If the duration does not cross that threshold, the command works synchronously like `DEL`. This allows you to avoid tying up the database with heavy deletion tasks.

        UNLINK key_2

You can move a key as well. The command below moves the `key_3` key from the current database to database `7`.

    MOVE key_3 7

## How to Back Up Redis Databases

Redis databases operate in memory, which helps to make them fast and low-latency.

With Redis, persistence is handled via backups. When the server backs up a database depends on a combination of two factors:

- How much time has elapsed
- How many changes have been made

By default, the Redis server backs up databases for any of the following three conditions:

- An hour has passed and at least one change has occurred.
- Five minutes have passed and at least 100 changes have occurred.
- One minute has passed and at least 10,000 changes have occurred.

You can alter how Redis backs up databases via the configuration file's `save` directive. This directive takes a number of seconds and a number of changes. For example, following is the default configuration represented as a configuration:

{{< file "/etc/redis/redis.conf" >}}
# [...]
save 3600 1
save 300 100
save 60 10000
# [...]
{{< /file >}}

### Manually Save a Redis Database

You also have the option to manually save the content of your Redis instance.

    SAVE

This command immediately backs up the entirety of your Redis server's databases. However, this option is not often feasible in a production environment because it operates synchronously and, therefore, ties up the server.

Instead, you may want to use the following command for your production Redis instance.

    BGSAVE

It works like the `SAVE` command, but operates asynchronously, meaning that it does not tie up the server while the backup operation runs.

{{< note respectIndent=false >}}
Because it is asynchronous, additional changes can be made to the database while `BGSAVE` runs. However, `BGSAVE` only saves changes up to the point when the command was run.
{{< /note >}}

You can learn more about how Redis handles persistence in [Redis's documentation](https://redis.io/topics/persistence).

## Conclusion

You now have a foundation for starting to use Redis. With this guide, you should be able to connect to a Redis instance, manage your Redis databases, and start working with keys.

Be sure to follow our upcoming guides on the series as well. These take you further into Redis usage and concepts, exploring topics like data types and server-assisted client-side caching.
