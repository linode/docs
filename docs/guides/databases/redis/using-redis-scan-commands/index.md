---
slug: using-redis-scan-commands
description: "Looking to more efficiently fetch keys from your Redis database, especially when you have large amounts of data? Follow along in this guide to learn how to use Redis’s SCAN commands. These commands incrementally iterate over keys, preventing server blockages for large data sets and providing several features to improve the process of fetching keys."
keywords: ['how to use redis scan', 'redis scan command', 'redis scan keys']
tags: ['redis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-14
modified_by:
  name: Nathaniel Stickman
title: "Using the Scan Commands in Redis"
title_meta: "How to Use the Scan Commands in Redis"
external_resources:
- '[Redis: SCAN](https://redis.io/commands/scan/)'
- '[Linux Hint: How to Use Redis Scan](https://linuxhint.com/redis-scan/)'
- '[ObjectRocket: SCAN Redis Command Examples](https://kb.objectrocket.com/redis/scan-redis-command-examples-509)'
authors: ["Nathaniel Stickman"]
---

Redis is a NoSQL database, exceptional for storing data structures in memory. Between that and its low-latency performance, Redis has become a go-to tool for web applications needing efficient caching and messaging storage.

This guide covers Redis's SCAN commands, which provide a cursor-based method for incremental iterations through data collection. Here, get everything you need to start using these commands in your Redis instance — from an overview of the basics to advanced options.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

            sudo dnf upgrade

1. Follow the instructions in our [How to Install a Redis Server](/docs/guides/how-to-install-a-redis-server-on-ubuntu-or-debian8/) guide to install a Redis server and command-line interface (CLI). Be sure to use the drop-down menu at the top of that page to select your Linux distribution and get the appropriate steps.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is the SCAN Command?

Redis's SCAN commands each iterate incrementally over a given kind of collection, using a cursor-based approach.

When you call a SCAN command, you provide a cursor location, usually starting at the beginning of a collection. With each call, the command returns a limited set of data from the collection and a new cursor location, continuing further into the collection. Thus, each subsequent call can take the previously returned cursor location as input, advancing the cursor through the collection with each iteration.

The SCAN commands are especially useful when it comes to working with large and/or more complicated data sets. They only fetch the immediate entry or entries at the cursor, minimizing the time the server is tied up. Compare that to the effect of tying up the server when fetching the entirety of a large collection.

### Types of SCAN Commands

Redis has four SCAN commands, each one dealing with a different type of collection.

Following are the four commands, each accompanied by a description of the kind of collection it covers:

- `SCAN` iterates over all the keys in the current database.

- `SSCAN` iterates over the elements in a given set.

- `ZSCAN` iterates over the elements and corresponding scores in a given sorted set.

- `HSCAN` iterates over the elements in a given hash.

Generally, these commands all operate similarly. The main difference is that all of these commands except for the `SCAN` command itself take a key as an argument. This is required for `SSCAN`, `ZSCAN`, and `HSCAN` to identify the objects they need to iterate over.

The instructions in this guide, while usually giving examples with the `SCAN` command, are designed to work for all four commands. Where this is not possible or where there are differences, the guide clearly notes that.

## How to Use the SCAN Commands

These next two sections walk you through how to use Redis's SCAN commands, starting from the basics and progressing to more advanced options. Along the way, you can find examples of the commands' usage to apply the concepts.

The examples all use data that you can load into your Redis instance using the following series of commands:

    MSET key_1 "Value 1" key_2 "Value 2" key_3 "Value 3" key_4 "Value 4" key_5 "Value 5" key_6 "Value 6" key_7 "Value 7" key_8 "Value 8" key_9 "Value 9" key_10 "Value 10" key_11 "Value 11" key_12 "Value 12" key_13 "Value 13" key_14 "Value 14" key_15 "Value 15" key_16 "Value 16"
    SADD example_set 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31
    ZADD example_sorted_set 2 "Element 1" 4 "Element 2" 6 "Element 3" 8 "Element 4" 10 "Element 5" 12 "Element 6" 14 "Element 7" 16 "Element 8" 18 "Element 9" 20 "Element 10" 22 "Element 11" 24 "Element 12" 26 "Element 13" 28 "Element 14" 30 "Element 15" 32 "Element 16"
    HSET example_hash field_1 "Field 1" field_2 "Field 2" field_3 "Field 3" field_4 "Field 4" field_5 "Field 5" field_6 "Field 6" field_7 "Field 7" field_8 "Field 8" field_9 "Field 9" field_10 "Field 10" field_11 "Field 11" field_12 "Field 12" field_13 "Field 13" field_14 "Field 14" field_15 "Field 15" field_16 "Field 16"

Some of this data is not used directly in the examples that follow. However, the data set covers all of the types of collections the SCAN commands can be used on. So you can feel free, as the guide progresses, to substitute different variants of the SCAN command, and see the effects.

### Basic Usage of the SCAN Commands

The `SCAN` command takes one argument, the starting cursor position. Generally, you want to start with `0` as the cursor position, as it identifies the start of the collection.

The command then returns an array of two values:

- First, the new cursor position to use in your next call of the command.

- Second, an array of values retrieved from the collection.

Following is the demonstration of the `SCAN` command:

    SCAN 0

{{< output >}}
1) "14"
2)  1) "key_14"
    2) "key_12"
    3) "key_15"
    4) "key_8"
    5) "key_3"
    6) "key_13"
    7) "key_4"
    8) "key_16"
    9) "key_10"
   10) "key_11"
{{< /output >}}

When the returned cursor position is `0`, Redis has iterated to the end of the collection.

The other SCAN commands add another required argument before the starting cursor position. This is the key for the collection to be iterated over:

    HSCAN example_hash 0

In the above example, `example_hash` should be the key for a value with a data type matching the SCAN command — in this case, a hash value.

The number of values returned by the SCAN commands varies. However, in the next section, you can see how to use the `COUNT` option to generally dictate how many results you want from the commands.

### Options for the SCAN Commands

The SCAN commands have three options that you can use to enhance or control the results. Each of these options is covered below, complete with examples showing how you can use them.

- The `COUNT` option can be added to a SCAN command to dictate how many results you would like from the SCAN command. Typically, a SCAN command comes back with about 10 entries per query. The `COUNT` option tells Redis to, instead, attempt to fetch a specified number of entries per query:

        SCAN 4 COUNT 2

    {{< output >}}
1) "12"
2) 1) "key_8"
   2) "key_3"
    {{< /output >}}

    The `COUNT` option is not a guarantee. There may be variances in the number of results, despite the use of this option. However, using the `COUNT` option generally does control the number of results.

- The `MATCH` option can be appended to a SCAN command to limit your query to only keys that match a given glob-style search pattern:

        SCAN 0 MATCH *_1* COUNT 20

    {{< output >}}
1) "0"
2) 1) "key_14"
   2) "key_12"
   3) "key_15"
   4) "key_13"
   5) "key_16"
   6) "key_10"
   7) "key_11"
   8) "key_1"`
    {{< /output >}}

    However, it is important to know that the `SCAN` command first fetches its results and then applies the `MATCH` pattern filter. So, some iterations of the `SCAN` command may show no results, even if there are matching results within the collection. Those results show on the command iteration covering the matching keys.

- The `TYPE` option can be used with the `SCAN` command to limit results to only keys matching a specified type.

        SCAN 0 TYPE hash COUNT 20

    Like the `MATCH` option, the `SCAN` command here fetches results first and then applies the `TYPE` filter. So, a given `SCAN` command may return no results when a `TYPE` filter is used even if there are keys of the specified type in the collection. Those keys show up on the command iteration that covers their locations in the collection.

    {{< note >}}
The `TYPE` option for the `SCAN` command is only supported in Redis 6 or later. Attempting to use this option in the earlier Redis version results in a syntax error.
    {{< /note >}}

## Conclusion

With that, you are ready to start making use of SCAN commands on your Redis instance. These commands can provide effective methods for dealing with large and complex data sets. And the tools discussed in this guide help you to make the most of these commands to efficiently handle your data.

Want to continue learning about Redis, and get the most effective use out of your server? Thankfully, we have plenty of [guides on using Redis](/docs/guides/databases/redis/) that can help you navigate Redis data types, configurations, and more.
