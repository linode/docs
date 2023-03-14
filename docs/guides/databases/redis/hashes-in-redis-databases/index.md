---
slug: hashes-in-redis-databases
description: "Redis Hashes are maps of field and value pairs. In this guide, you learn how to use Redis hashes, maps of fields, and values frequently used for storing objects."
keywords: ['redis hashes example', 'accessing redis hashes', 'get redis hashes all key']
tags: ['redis server', 'redis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-04
modified_by:
  name: Nathaniel Stickman
title: "Use Hashes in Redis Databases"
title_meta: "How to Use Hashes in Redis Databases"
external_resources:
- '[Redis: An Introduction to Redis Data Types and Abstractions](https://redis.io/topics/data-types-intro)'
- '[Redis: Command Reference - Hashes](https://redis.io/commands#hash)'
- '[Redis in Action: Hashes in Redis](https://redis.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/1-2-4-hashes-in-redis/)'
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

Redis, the open-source NoSQL database, is frequently used for caching, messaging, and other storage needs where speed and low latency are required. Redis supports the hash data type which enables you to store field-value pairs of simple to highly complex data. This tutorial breakdown what Redis hashes are and walks you through examples of how to create, access, and modify hashes. This tutorial provides you with the tools to start using hashes in your Redis databases.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

            sudo dnf upgrade

1. Follow the instructions in our [How to Install and Configure Redis](/docs/guides/install-redis-ubuntu/) guide to installing a Redis server and command-line interface (CLI). Be sure to use the drop-down menu at the top of that page to select your Linux distribution and get the appropriate steps.

{{< note >}}
The steps in this guide is written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Are Hashes in Redis?

Redis Hashes are maps of field and value pairs. They're similar to what you would expect if you have worked with hashes in programming languages like [Python](/docs/guides/development/python/) and [Ruby](/docs/guides/development/ror/).

With hashes, you can have a single Redis entry (called a "key") with numerous field-value pairs. This essentially allows you to associate properties with a given item in Redis.

### Common Uses for Hashes

Hashes are especially useful for storing objects and similar values consisting of numerous properties. In fact, because of Redis's effectiveness for caching web applications, hashes are often used for storing data from JSON objects.

So, as an example, you might see hashes used for caching a user's web session. That can include everything from username to the user's current location in a document.

## How to Use Hashes in Redis

The following sections introduce you to using hashes in your Redis databases, highlighting some of the most useful commands. They include everything from creating hashes to accessing their values to modifying hash entries.

### Create and Modify Hash Entries

You can use the `HMSET` command to set field-value pairs on a hash. You can use this command to create a hash that does not yet exist.

    HMSET example_user_hash username example_user password example_password other_data example_other_data

In the command above, `example_user_hash` is the name of the hash. Following that is a series of paired field names and values: `username example_user`, `password example_password`, and `other_data example_other_data`.

The `HMSET` command can also be used to modify hash entries. Calling the command for one or more existing fields changes their values to the newly-provided ones.

#### Increment Hash Values

For fields with integer values, you can use the `HINCRBY` command to increase the value by a given amount, which can be a negative number. Below is a full example:

    HMSET example_hash first_field 10
    HINCRBY example_hash first_field 1

{{< output >}}
(integer) 11
{{< /output >}}

The same can be done for float values by using the `HINCRBYFLOAT` command:

    HMSET example_hash second_field 5.5
    HINCRBYFLOAT example_hash second_field -0.9

{{< output >}}
"4.6"
{{< /output >}}

### Fetch Hash Values

Use the `HMGET` command to fetch the values of fields in a hash. For instance, the following command gets the `username` and `other_data` fields' values from the `example_user_hash` that was created using the `HMSET` command in the section above.

    HMGET example_user_hash username other_data

{{< output >}}
1) "example_user"
2) "example_other_data"
{{< /output >}}

You can even use the `HRANDFIELD` to get one or more random field names from a hash. The command comes with a `WITHVALUES` option to view the returned fields with their values, or, alternatively, you can get the values using `HMGET`.

    HRANDFIELD example_user_hash 2 WITHVALUES

{{< output >}}
1) "other_data"
2) "example_other_data"
3) "password"
4) "example_password"
{{< /output >}}

#### Get All Fields and Values

Redis has several commands for listing all items in a hash, depending on what information you want about each item.

- Use the `HKEYS` command to get all of the fields in a Redis hash.

        HKEYS example_user_hash

    {{< output >}}
1) "username"
2) "password"
3) "other_data"
    {{< /output >}}

- Use the `HVALS` command to get all of the values for all of the fields in a hash.

        HVALS example_user_hash

    {{< output >}}
1) "example_user"
2) "example_password"
3) "example_other_data"
    {{< /output >}}

- Use the `HGETALL` command to list all of the field-value pairs. Field names are given with values on the following line (so field names are on odd numbers and values on even):

        HGETALL example_user_hash

    {{< output >}}
1) "username"
2) "example_user"
3) "password"
4) "example_password"
5) "other_data"
6) "example_other_data"
    {{< /output >}}

#### Check for Fields

To verify whether a field exists in a hash, you can use the `HEXISTS` command. Provide the command with a hash and a field name. The command returns `1` for true (the field exists in the hash) or `0` for false (the field does not exist in the hash).

    HEXISTS example_user_hash username

{{< output >}}
(integer) 1
{{< /output >}}

    HEXISTS example_user_hash test_field_name

{{< output >}}
(integer) 0
{{< /output >}}

### Delete Hash Values

Delete one or more specific fields from a hash using the `HDEL` command. The command takes the hash name followed by the names of the fields to be deleted.

    HDEL example_user_hash other_data password
    HGETALL example_user_hash

{{< output >}}
1) "username"
2) "example_user"
{{< /output >}}

You can also delete an entire hash using the `DEL` command.

    DEL example_user_hash

## Conclusion

With this tutorial, you should be prepared to start making use of hashes in your Redis databases. These can significantly improve many storage tasks, especially object storage for web application caching. Check out other [Redis guides and tutorials](/docs/guides/databases/redis/). They cover topics like, [Using Sorted Sets in Redis Databases](/docs/guides/using-sorted-sets-in-redis-database/) and [Using Lists and Sets in Redis Databases](/docs/guides/using-lists-and-sets-in-redis-database/).
