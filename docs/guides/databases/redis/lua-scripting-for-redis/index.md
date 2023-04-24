---
slug: lua-scripting-for-redis
description: "In this tutorial learn how to start writing and using Lua scripts to improve your Redis database experience."
keywords: ['redis lua scripts','redis lua script tutorial','redis lua examples']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-14
modified_by:
  name: Nathaniel Stickman
title: "Writing Lua Scripts for a Redis Server"
external_resources:
- '[Redis: Scripting with Lua](https://redis.io/docs/manual/programmability/eval-intro/)'
- '[Redis: EVAL](https://redis.io/commands/eval/)'
- '[freeCodeCamp: A Quick Guide to Redis Lua Scripting](https://www.freecodecamp.org/news/a-quick-guide-to-redis-lua-scripting/)'
authors: ["Nathaniel Stickman"]
---

Redis is an open source NoSQL database that offers low-latency in-memory storage of data structures. Web application developers find Redis a powerful ally for application caching, messaging, and many other operations.

Redis uses Lua for scripting, letting you consolidate more complicated tasks in an efficient way. Script logic gets executed on the database server, allowing them to be reused, and often increasing performance.

In this tutorial learn what Redis' Lua scripting has to offer and how you can start using it on your Redis database. The tutorial covers the pros and cons of Redis scripting, creating and deploying scripts, and managing cached scripts.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Follow the instructions in our [How to Install a Redis Server](/docs/guides/how-to-install-a-redis-server-on-ubuntu-or-debian8/) guide to install a Redis server and command line interface (CLI). Be sure to use the drop-down menu at the top of the page to select your Linux distribution and view the appropriate steps.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Why Use Lua Scripting on a Redis Server?

Scripting allows you to execute complex tasks within Redis. A Redis script allows you to use programming tools like control structures, while having access to almost all Redis commands.

So why would you use a Redis script over executing commands directly, or from your application itself? Because with scripts:

-   Tasks are executed directly on the database server, often increasing their performance substantially.

-   Logic lives directly on the database server, which can be useful for logic used across multiple applications.

-   Steps get executed atomically, meaning that the server prevents other actions while a script is still running.

Lua is the language for Redis scripting. The Lua language offers simplicity and conciseness, making it an effective language for scripting tasks.

However, scripts are not suited to all cases. Because the Redis server blocks other operations while a script is running, lengthy scripts may actually result in negative performance impacts.

Scripting also executes logic on the database. Doing so can lead to bad architectural and design practices when developers rely on it to implement application logic rather than data-level logic.

## How to Write Lua Scripts for a Redis Server

Basic Redis scripts can be executed using the `EVAL` command. The command executes scripts directly from the Redis CLI:

```command
EVAL "return 'Hello, world!'" 0
```

```output
"Hello, world!"
```

Redis' Lua implementation has access to the `redis.call` method, allowing you to execute most Redis commands from the Lua script. In this example, the Lua script executes the `SET` command:

```command
EVAL "redis.call('SET', KEYS[1], ARGV[1])" 1 example_key "Example Value"
```

The `EVAL` command has a minimum of two arguments, and more if the second argument is greater than zero.

-   The first argument is the *script* itself. The Lua code for the script is wrapped in quotation marks.

-   The second argument is the *number of keys*. This is `1` in the example above, indicating that one key-value pair is used in the script. That key is identified with `KEY[1]` in the script itself. Its corresponding value is indicated with `ARGV[1]`.

-   The third argument contains *key names*. This is `example_key` in the example above. When the number of keys is greater than one, you need to provide a number of keys here equal to the number of keys argument.

-   The fourth argument contains *values*. Above, this is `"Example Value"`. As with the key names argument, you need to provide an array of values equal to the number of keys.

A similar script with multiple keys and value could be:

```command
EVAL "redis.call('SET', KEYS[1], ARGV[1]); redis.call('SET', KEYS[2], ARGV[2])" 2 example_key_1 example_key_2 "Example Value 1" "Example Value 2"
```

You do not always need to provide a value. For example, when using a read command like `GET`:

```command
EVAL "return redis.call('GET', KEYS[1])" 1 example_key_1
```

```output
"Example Value 1"
```

More advanced usage leverages the capabilities of the Lua language. Here is a simple example to give you an idea:

```command
EVAL "local key_name = 'example_key'; for iterated_value=0,4 do redis.call('hmset', KEYS[1], key_name .. tostring(iterated_value), iterated_value) end; return redis.call('hgetall', KEYS[1])" 1 example_hash
```

```output
 1) "example_key0"
 2) "0"
 3) "example_key1"
 4) "1"
 5) "example_key2"
 6) "2"
 7) "example_key3"
 8) "3"
 9) "example_key4"
10) "4"
```

## How to Store Lua Scripts on a Redis Server

Redis scripts can be pre-loaded into memory for later execution. This feature is useful especially for scripts that need to be executed numerous times. This feature still allows you to provide different parameters for each script execution.

Using the `SCRIPT LOAD` command stores a given script in Redis' cache. Notice that you do not provide the script with parameters at this time. Instead, you provide the parameters whenever you call the script, as you can see further on:

```command
SCRIPT LOAD "redis.call('set', KEYS[1], ARGV[1]); return redis.call('get', KEYS[1])"
```

```output
"5afd00504d9d21a8fc37cd1b4400872d2e69296a"
```

Redis provides you with an SHA1 identifier for the new script. You can use that identifier with the `EVALSHA` command to execute the script. The command takes the SHA1 identifier and the arguments for the script just as the `EVAL` command would:

```command
EVALSHA 5afd00504d9d21a8fc37cd1b4400872d2e69296a 1 example_key "Another example value"
```

```output
"Another example value"
```

The script cache is volatile and not persisted. Thus, after some time or certain server events, the `EVALSHA` command may return an error, indicating that the identified script has been purged from the cache:

```output
(error) NOSCRIPT No matching script. Please use EVAL.
```

## How to Use the Script Command to Manage Lua Scripts

Redis provides several `SCRIPT` commands that give you a degree of control over scripts stored in the cache, such as the `SCRIPT LOAD` command in the previous section.

The following list shows the other `SCRIPT` commands used to manage scripts in cache.

-   `SCRIPT EXISTS` lets you verify whether a script with a given SHA1 identifier exists. Above, you can see that the `EVALSHA` command inherently indicates whether a script exists or not. But you can achieve cleaner and clearer code in some cases by using the `SCRIPT EXISTS` command to explicitly check for a script:

    ```command
    SCRIPT EXISTS "5afd00504d9d21a8fc37cd1b4400872d2e69296a"
    ```

    ```output
    1) (integer) 1
    ```

    This response indicates that the script exists. A `0` response would indicate that the script does not exist in cache. Multiple SHA1 identifiers can be provided to the command, in which case the command returns multiple values of `1` and/or `0`, corresponding to each identifier.

-   `SCRIPT DEBUG` can be used to enable/disable debugging mode for Lua scripts. When debugging is enabled, `EVAL` commands use the Lua debugger built into Redis.

    The debugging mode comes with two options. It can be run *asynchronously* using `SCRIPT DEBUG YES`. This has debugging operate on a separate session where it does not block Redis operations. With this option, changes are rolled back when the script finishes. Alternatively, debugging mode can be run *synchronously* using `SCRIPT DEBUG SYNC`. The script in this case blocks other Redis operations and saves changes just like scripts in normal mode.

    Most often, asynchronous debugging is preferable, as it lets you run scripts without significant consequence.

    Redis recommends script debugging not be used in production environments. Using a testing or development server instead can prevent unforeseen consequences and performance impacts.

    ```command
    SCRIPT DEBUG YES
    EVAL "redis.call('set', KEYS[1], ARGV[1])" 1 another_example_key "A value"
    SCRIPT DEBUG NO
    ```

-   `SCRIPT KILL` provides the only way to interrupt a running script, other than restarting the server. The command is used to stop scripts that have run over the maximum execution time. However, this command only works for scripts that have not yet modified any data:

    ```command
    SCRIPT KILL
    ```

-   `SCRIPT FLUSH` clears Redis' script cache. This can be especially useful when working in a test environment, allowing you to clear out the cache for a new set of scripts to test:

    ```command
    SCRIPT FLUSH
    ```

## Conclusion

You are now prepared to step into the realm of Lua scripting on your Redis server. This tutorial covers everything you need to get started, from writing scripts to deploying and managing them.

Want to continue learning about Redis to get the most effective use out of your server? We have plenty of [guides on using Redis](/docs/guides/databases/redis/) that can help you navigate Redis data types, configurations, and more.