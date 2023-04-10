---
slug: using-lists-and-sets-in-redis-database
description: "Redis is a NoSQL database that is known for it support of various data types. This guide shows you how to use Lists and Sets for managing data in your Redis databases."
keywords: ['redis lists tutorial','redis lists vs sets','redis sets example']
tags: ['redis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-21
modified_by:
  name: Nathaniel Stickman
title: "Use Lists and Sets in Redis Database"
title_meta: "How to Use  Lists and Sets in Redis Database"
external_resources:
- '[Redis: An Introduction to Redis Data Types and Abstractions](https://redis.io/topics/data-types-intro)'
authors: ["Nathaniel Stickman"]
---

Redis is an open-source NoSQL database that provides performant storage for caching, messaging, and other contexts where speed and low latency are needed.

Redis has multiple data types for working with collections. The most common are **Lists** and **Sets**. This tutorial explains what Redis's lists and sets are and illustrates how to use them.

Also, check out our other guides in this series, including our previous guide on [Connecting to Redis and Using Redis Databases](/docs/guides/redis-getting-started/).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Follow the instructions in our [How to Install and Configure Redis](/docs/guides/install-redis-ubuntu/) guide to installing a Redis server and command-line interface (CLI). Be sure to use the drop-down menu at the top of that page to select your Linux distribution and get the appropriate steps.

{{< note respectIndent=false >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Are Lists and Sets in Redis?

Redis Lists and Sets each manage collections of string values. Each has its own approach, advantages, and disadvantages. The sections below discuss each data type in more detail.

### Redis Lists

In Redis, Lists are collections of strings kept in the order they were inserted. They operate like Linked Lists in other programming contexts.

Lists are useful precisely because of their ordering methodology. Their ordering is consistent and can be controlled by the way in which you insert new elements.

### Redis Sets

Redis Sets are unordered collections of unique strings. Because Sets only include unique values, they can be useful in contexts where you need to avoid duplicates.

Sets are unordered, so values are either fetched randomly or managed by the content of the values themselves.

### Differences Between Lists and Sets

Lists are, as observed above, ordered based on insertion. Sets, by contrast, are unordered. Use Lists when you need to consistently access elements based on their positions in the collection.

But Sets also have a particular advantage when it comes to performance. Lists perform well when it comes to fetching elements from the beginning and end of the collection, no matter the collection's size. However, they lag when it comes to fetching values from somewhere in the middle of large collections.

With Sets, on the other hand, you can fetch elements from the middle of a collection much more quickly. This is useful when you frequently need to check whether a certain value exists in a large collection. It is also useful when you need to efficiently fetch a random value from a collection, as you can do with Sets.

### Sorted Sets in Redis

Redis has another related data type: *Sorted Sets*. These are Sets that include a scoring system, allowing you to order a Set by element scores.

Because of ordering, hashes, and labeling of values, Sorted Sets in Redis actually work as a cross between Lists.

Sorted Sets have an array of commands and ways that you can work with their collections. To learn more about how Sorted Sets work and how you can start using them, take a look at our [How to Use Sorted Sets in Redis](/docs/guides/using-sorted-sets-in-redis-database/) guide.

## How to Use Lists in Redis

The following sections introduce you to some of the most useful operations and commands for Lists, and how you can create, view, and modify them.

### Adding Elements to a Redis List

You can add elements to the beginning and ending of Lists in Redis with the `LPUSH` and `RPUSH` commands, respectively. These commands each also create a new List if the named List does not already exist.

For instance:

    LPUSH example_list "This is a test."
    RPUSH example_list 2 4 6 8

As you can see from the `RPUSH` example above, the commands support adding multiple elements to a List at the same time.

{{< note respectIndent=false >}}
In Redis, numbers are automatically converted to strings, though Redis also has a few special commands for handling strings that contain numbers. Like `INCR`, which increments the integer held in a string by one.
{{< /note >}}

In the next section, you learn how to retrieve the contents of a List.

### Selecting Elements from a Redis List

You have a few options when it comes to fetching elements from a List in Redis.

- Use the `LINDEX` command to get a single element based on its index (Redis's index begins at `0`). The example below fetches the third element of the `example_list` created in the previous section.

        LINDEX example_list 2

    {{< output >}}
"4"
    {{</ output >}}

- Use `LRANGE` to get a range of elements or to get all elements in a List based on their indices. The example below fetches all the elements from the `example_list`.

        LRANGE example_list 0 -1

    {{< output >}}
1) "This is a test."
2) "2"
3) "4"
4) "6"
5) "8"
    {{</ output >}}

    Negative indices start at the end of the list, so the example above fetches all elements from the first (index `0`) to the last (index `-1`).

    Here is another example that fetches only the middle three elements:

        LRANGE example_list 1 -2

    {{< output >}}
1) "2"
2) "4"
3) "6"
    {{</ output >}}

- Use `LPOP` and `RPOP` to get one or more elements from the beginning or end of a List and then remove those elements from the List. This can be useful, for instance, in the case of a Task List, where you want to remove an element as it is being worked on.

        LPOP example_list

    {{< output >}}
"This is a test."
    {{</ output >}}

        RPOP example_list 2

    {{< output >}}
"8"
"6"
    {{</ output >}}

    When you take a look at the list now, you get:

        LRANGE example_list 0 -1

    {{< output >}}
1) "2"
2) "4"
    {{< /output >}}

### Removing Elements from a Redis List

Similar to how you can remove elements from the List using the `LPOP` and `RPOP` commands, you can also remove elements using the `LREM` command. It removes one or more elements from a List based on the elements' values. For example:

    LPUSH new_example_list "this" "is" "a" "test" "and" "a" "test" "to" "test"
    LREM new_example_list -2 "test"
    LRANGE new_example_list 0 -1

{{< output >}}
1) "test"
2) "to"
3) "a"
4) "and"
5) "a"
6) "is"
7) "this"
{{< /output >}}

The `-2` in the command above has `LREM` remove the last two instances of `test` from the List. You could, alternatively, use a positive number to remove the first matching instances from the List.

Finally, using the `DEL` command allows you to delete a List entirely.

    DEL new_example_list

### Using Capped Lists

Redis allows you to use the `LTRIM` command to implement a *Capped List*, which is essentially a List limited to a certain length. This can be useful, for instance, when you only want a List to contain the newest *"X"* number of entries.

For example, assume that `long_example_list` contains at least 100 items and that new items are added to the end of the list with `RPUSH`. To only ever keep the newest 100 items, you run the `LTRIM` command every time you add a new item to the List:

    RPUSH long_example_list "New item"
    LTRIM long_example_list -100 -1

## How to Use Sets in Redis

The sections below show some of the most useful operations and commands for Sets, from creating to viewing, and modifying them.

### Adding Elements to a Redis Set

You can add elements to a Set using the `SADD` command. Like with Lists, this command also creates a new Set if one does not already exist.

    SADD example_set 1 3 5 7 9

{{< output >}}
(integer) 5
{{< /output >}}

Sets do not hold duplicate values. If you try to add a duplicate to the above `example_set`, there are no elements (`0`) added to the Set.

    SADD example_set 9

{{< output >}}
(integer) 0
{{< /output >}}

### Checking and Selecting Elements from Redis Sets

Redis provides two means of fetching elements from a Set.

- Use the `SMEMBERS` command to get all elements of a Set:

        SMEMBERS example_set

    {{< output >}}
1) "1"
2) "3"
3) "5"
4) "7"
5) "9"
    {{</ output >}}

- Use the `SPOP` command to get a random element from a Set; at the same time, the command removes the selected element from the Set:

        SPOP example_set

    {{< output >}}
"3"
    {{</ output >}}

        SMEMBERS example_set

    {{< output >}}
1) "1"
2) "5"
3) "7"
4) "9"
    {{</ output >}}

You can also check a Set to see whether an element with a certain value is a member, using the `SISMEMBER` command. It returns `1` for true and `0` for false:

    SISMEMBER example_set 7

{{< output >}}
(integer) 1
{{</ output >}}

### Removing Elements from Redis Sets

You have seen how the `SPOP` command returns and removes an element from a Set.

However, you can use the `SREM` command to remove an element from a Set based on its value. For instance:

    SADD new_example_set "test 1" "test 2" "test 3"
    SREM new_example_set "test 3"
    SMEMBERS new_example_set

{{< output >}}
1) "test 1"
2) "test 2"
{{< /output >}}

## Conclusion

You should now be ready to start working with Lists and Sets in Redis. You have the tools for creating, viewing, and modifying them, and should be ready to put them to use in your Redis database.
