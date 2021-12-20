---
slug: using-redis-lists-sets
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to use lists and sets for managing data in your Redis databases."
og_description: "Learn how to use lists and sets for managing data in your Redis databases."
keywords: ['redis lists tutorial','redis lists vs sets','redis sets example']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-20
modified_by:
  name: Nathaniel Stickman
title: "How to Use Lists and Sets in Redis Databases"
h1_title: "How to Use Lists and Sets in Redis Databases"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Redis: An Introduction to Redis Data Types and Abstractions](https://redis.io/topics/data-types-intro)'
- '[Redis: Data Types](https://redis.io/topics/data-types)'
- '[Redis in Action: What Redis Data Structures Look Like](https://redis.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/)'
---

Redis, the open-source NoSQL database, provides exceptionally effective storage for caching, messaging, and other contexts where quick, low-latency storage is at a premium.

Redis has multiple data types for dealing with collections, the most commonly useful of which are **lists** and **sets**. This tutorial explains what lists and sets are in Redis and illustrates how to use them.

Be sure to check out our other guides in this series, including our previous guide on **Connecting to Redis and Using Redis Databases** and upcoming guides on other Redis data types.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

1. Follow the instructions in our [How to Install and Configure Redis](/docs/guides/install-redis-ubuntu/) guide to install a Redis server and command-line interface (CLI). Be sure to use the drop down menu at the top of that page to select your Linux distribution and get the appropriate steps.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Are Lists and Sets in Redis?

Redis's list and set data types each manage collections of string values. Each has its own approach, advantages, and disadvantages. Below, you can see an exploration of these data types.

### Redis Lists

In Redis, lists are collections of strings ordered by insertion position. They operate like linked lists in other programming contexts.

Lists are useful precisely because of their ordering methodology. Their ordering is consistent and can be controlled by how you insert new elements.

### Redis Sets

Redis's sets are unordered collections of unique strings. Because sets only include unique values, they can be useful in contexts where you want to avoid duplicates automatically.

### Differences Between Lists and Sets

Lists are, as observed above, ordered based on insertion. Sets are, by contrast, unordered.

But sets also have a particular advantage when it comes to performance. Lists perform well when it comes to fetch the beginning and ending of the collection, no matter the collection's size. However, they lag when it comes to fetching values from somewhere in the middle of large collections.

With sets, on the other hand, you can fetch elements from the middle of a collection much more quickly. This is useful when you frequently need to check whether a certain value exists in a large collection, or when you need to fetch arbitrary elements.

### Sorted Sets in Redis

Redis has another related data type: sorted sets. These are sets that include a scoring system, allowing you to order a set by element scores.

Because of this, sorted sets in Redis actually work like a cross between lists, because of their ordering, and hashes, because of their labeling of values.

Sorted sets have an array of commands and ways that you can work with their collections. Enough that we have covered them in their own guide, [How to Use Sorted Sets in Redis](/docs/guides/using-redis-sorted-sets/). Take a look there to learn more about how sorted sets work and how you can start using them.

## How to Use Lists in Redis

The following sections introduce you to some of the most useful operations and commands for lists, getting you started creating, viewing, and modifying them.

### Adding Elements

You can add elements to the beginning and ending of a list in Redis with `LPUSH` and `RPUSH` respectively. These commands each also create a new list if the named list does not already exist.

For instance:

    LPUSH example_list "This is a test."
    RPUSH example_list 2 4 6 8

As you can see from the `RPUSH` example above, you the commands support adding multiple elements at the same time.

(Numbers are converted to strings automatically, though Redis has some special commands for handling strings that contain numbers.)

The list created above should look like:

- "This is a test."
- "2"
- "4"
- "6"
- "8"

In the next section, you can see how to retrieve the contents of a list to verify this.

### Selecting Elements

You have a few options when it comes to fetching elements from a list in Redis.

- Use the `LINDEX` command to get a single element based on its index. This example fetches the middle element of the list created in the previous section:

        LINDEX example_list 2

    {{< output >}}
"4"
    {{< /output >}}

- Use `LRANGE` to get a range of elements or to get all elements in a list. Here, the command fetches the whole of the list:

        LRANGE example_list 0 -1

    {{< output >}}
1) "This is a test."
2) "2"
3) "4"
4) "6"
5) "8"    {{< /output >}}

    Negative numbers start at the end of the list, so this example fetches all elements from the first (index `0`) to the last (index `-1`).

    Here is another example that fetches only the middle three elements:

        LRANGE example_list 1 -2

    {{< output >}}
1) "2"
2) "4"
3) "6"
    {{< /output >}}

- Use `LPOP` and `RPOP` to get one or more elements from the beginning or ending of a list and then remove those elements from the list. This can be useful, for instance, in the case of task lists, where you want to remove an element as it is being worked.

        LPOP example_list

    {{< output >}}
"This is a test."
    {{< /output >}}

        RPOP example_list 2

    {{< output >}}
"8"
"6"
    {{< /output >}}

    When you take a look at the list now, you get:

        LRANGE example_list 0 -1

    {{< output >}}
1) "2"
2) "4"
    {{< /output >}}

### Removing Elements

As shown above, you can remove elements via the `LPOP` and `RPOP` commands.

You can also remove elements using the `LREM` command. It removes one or more elements from a list based on the elements' values. For example:

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

The `-2` in the command above has `LREM` remove the last two instances of `test` from the list. You could, alternatively, use a positive number to remove the first matching instances from the list.

Finally, using the `DEL` command allows you to delete a list entirely:

    DEL new_example_list

### Using Capped Lists

Redis allows you to use the `LTRIM` command to implement a capped list, which is essentially a list limited to a certain length. This can be useful, for instance, when you only want a list to contain the newest *X* number of entries.

Here is an example. Assume that `long_example_list` contains at least 100 items and that new items are added to the end of the list with `RPUSH`. To only ever keep the newest 100 items, you run the `LTRIM` command below every time you add a new item to the list:

    RPUSH long_example_list "New item"
    LTRIM long_example_list -100 -1

## How to Use Sets in Redis

Below, learn about the most useful operations and commands for sets, with everything from creating to viewing to modifying them.

### Adding Elements

You can add elements to a set using the `SADD` command. Like with lists, this command also creates a new set if one does not already exist:

    SADD example_set 1 3 5 7 9

{{< output >}}
(integer) 5
{{< /output >}}

However, sets do not hold duplicate values. So, if you try to add a duplicate to the above set, you get a set of the same length as before (five elements):

    SADD example_set 9

{{< output >}}
(integer) 5
{{< /output >}}

### Checking for and Selecting Elements

Redis provides two means of fetching elements from a set.

- Use the `SMEMBERS` command to get all elements of a set:

        SMEMBERS example_set

    {{< output >}}
1) "1"
2) "3"
3) "5"
4) "7"
5) "9"
    {{< /output >}}

- Use the `SPOP` command to get a random element from a set; at the same time, the command removes the selected element from the set:

        SPOP example_set

    {{< output >}}
"3"
    {{< /output >}}

        SMEMBERS example_set

    {{< output >}}
1) "1"
2) "5"
3) "7"
4) "9"
    {{< /output >}}

You can also check a set to see whether an element with a certain value is a member, using the `SISMEMBER` command. It returns `1` for true and `0` for false:

    SISMEMBER example_set 7

{{< output >}}
(integer) 1
{{< /output >}}

### Removing Elements

Above, you can see that the `SPOP` command returns and removes an element from a set.

However, if you just want to remove an element, you can use the `SREM` command. This command lets you remove an item given the item's value. For instance:

    SADD new_example_set "test 1" "test 2" "test 3"
    SREM new_example_set "test 3"
    SMEMBERS new_example_set

{{< output >}}
1) "test 1"
2) "test 2"
{{< /output >}}

## Conclusion

You should now be ready to start working with lists and sets in Redis. You have the tools for creating, viewing, and modifying them, and should be ready to put them to use in your Redis database.

Take a look at our upcoming guides on the series as well. These take you further into Redis usage and concepts, exploring topics like data types and server-assisted client-side caching.
