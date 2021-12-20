---
slug: using-redis-sorted-sets
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to use sorted sets in your Redis databases, a powerful additional data type for ordered values."
og_description: "Learn how to use sorted sets in your Redis databases, a powerful additional data type for ordered values."
keywords: ['redis sorted set example','redis sorted set commands','how do redis sorted sets work']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-20
modified_by:
  name: Nathaniel Stickman
title: "How to Use Sorted Sets in Redis Databases"
h1_title: "How to Use Sorted Sets in Redis Databases"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Redis: An Introduction to Redis Data Types and Abstractions](https://redis.io/topics/data-types-intro)'
- '[Redis: Data Types](https://redis.io/topics/data-types)'
- '[Redis in Action: What Redis Data Structures Look Like](https://redis.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/)'
---

Redis, the open-source, in-memory database, is one of the most popular databases for caching, messaging, and other contexts where quick, low-latency storage is at a premium.

Redis's **sorted set** data type attempts to capture the advantages of both lists and sets, giving you a useful tool for ordered collections of unique values.

This tutorial tells you more about what sorted sets are and introduces you to commands you can use to manage them.

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

## What Are Sorted Sets in Redis?

Redis's sorted set data type consists of a collection of unique string values. Each string value is scored with a numeric value, which becomes the primary sorting criteria for ordering the sorted set.

Recall that, in Redis, sets are also collections of unique string values. But sets themselves are unordered.

With sorted sets, Redis provides a data type with the advantages of sets while forgoing the limitation of being unordered.

Redis's sorted sets can actually be thought of as a cross between lists and hashes. Lists, because they are ordered, and hashes, because the scores act like keys for each value.

### Sorted Sets and Scoring

As you can see in the example further on, each value in a sorted set is assigned a score. Scores then act as the primary means for ordering and navigating sorted sets.

But sorted sets also have a secondary sorting method. Any values with matching scores are sorted lexically based on the values themselves. This can be very convenient when, for instance, you want a set that can be organized alphabetically.

## How to Use Sorted Sets in Redis

You may be familiar with how to use Redis sets, but sorted sets come with their own array of commands. In fact, sorted sets operate more like lists and hashes in Redis.

These next sections introduce you to some of the most useful operations and commands for sorted sets. By the end, you should be ready to start working with this data type in your Redis databases.

### Adding Elements to a Sorted Set

Use the `ZADD` command to add elements to a sorted set. When the given set does not already exist, this command creates the set, like in this example:

    ZADD example_sorted_set 10 "A test value"

The `ZADD` command can also add multiple elements at a time. Just continue adding score-value pairs to the command, like this:

    ZADD example_sorted_set 9 "B test value" 8 "C test value" 7 "D test value" 6 "E test value"

### Fetching Elements from a Sorted Set

Sorted sets, because they are ordered, give you ready tools for fetching elements based on that ordering. But sorted sets also come with the ability to sort and retrieve items lexically.

Below, see how to get items from your Redis sorted sets using both of these sorting methods.

#### By Order

Fetching items from a sorted set works more like doing so from a list than from a set.

- Use the `ZRANGE` command to fetch values based on an index range. The elements are sorted from lowest score to highest. This example fetches the entire sorted set created in the previous section:

        ZRANGE example_sorted_set 0 -1

    {{< output >}}
1) "E test value"
2) "D test value"
3) "C test value"
4) "B test value"
5) "A test value"
    {{< /output >}}

    Redis indices start at `0`, while negative indices begin at the end of a collection. So the above fetches all items from the first (`0`) to the last (`-1`). Using `-2` would refer to the next-to-last item in the sorted set, and so on.`

    You can reverse the order using the `ZREVRANGE` command instead. This example does so and fetches only the first three items in the sorted set:

        ZREVRANGE example_sorted_set 0 2

    {{< output >}}
1) "A test value"
2) "B test value"
3) "C test value"
    {{< /output >}}

- Use the `ZPOPMIN` and `ZPOPMAX` commands to fetch one or more values from the beginning or ending of a sorted set, respectively. The fetched values are then removed from the sorted set:

        ZADD example_sorted_set_two 1 "H" 2 "G" 3 "F" 4 "E"

        ZPOPMIN example_sorted_set_two

    {{< output >}}
1) "H"
2) "1"
    {{< /output >}}

        ZPOPMAX example_sorted_set_two 2

    {{< output >}}
1) "E"
2) "4"
3) "F"
4) "3"
    {{< /output >}}

- Use the `BYSCORE` option with the `ZRANGE` command to fetch a range of values based on their scores. For many use cases, this is more practical than `ZRANGE`, as you are more likely to know the range of scores than the range of indices:

        ZRANGE example_sorted_set 1 8 BYSCORE

    {{< output >}}
1) "E test value"
2) "D test value"
3) "C test value"
    {{< /output >}}

    The scores in the command are inclusive by default. Precede the score number in the command with a `(` (as in `(1 (8`) to make the search exclusive.

#### By Lexical Order

By default, Redis's sorted sets order items with the same scores lexically by value. So, "A test value" comes before "B test value" if both have matching scores.

To make an alphabetical sorted set, you just apply the same score to all value in the set, as in:

    ZADD example_sorted_set_three 0 "E test value" 0 "D test value" 0 "C test value" 0 "B test value" 0 "A test value"
    ZRANGE example_sorted_set_three 0 -1

{{< output >}}
1) "A test value"
2) "B test value"
3) "C test value"
4) "D test value"
5) "E test value"
{{< /output >}}

When you want to fetch a range based on its lexical sorting, you can use the `BYLEX` option with the `ZRANGE` command. Precede the beginning and ending strings (`B` and `D`, respectively, in this next example) with either `(` for exclusive search or `[` for inclusive search:

    ZRANGE example_sorted_set_three [B [D BYLEX

{{< output >}}
1) "B test value"
2) "C test value"
{{< /output >}}

Notice that `D test value` is excluded from the range above. This is because the ending search string is `D`, which comes before `D test value` lexically. You can include this value using something like this next command instead:

    ZRANGE example_sorted_set_three [B [Dz BYLEX

{{< output >}}
1) "B test value"
2) "C test value"
3) "D test value"
{{< /output >}}

### Modifying Elements in a Sorted Set

You can update an element's score in a sorted set using the `ZADD` command again. Recall that sets and sorted sets are collections of *unique* values. So, when you use the `ZADD` command for a value already in a sorted set, only the value's score is changed. No new entry gets added:

    ZADD example_sorted_set 2 "A test value"
    ZRANGE example_sorted_set 0 -1

{{< output >}}
1) "A test value"
2) "E test value"
3) "D test value"
4) "C test value"
5) "B test value"
{{< /output >}}

### Removing Elements from a Sorted Set

The `ZPOPMIN` and `ZPOPMAX` commands covered above (in [Fetching Elements from a Sorted Set](/docs/guides/using-redis-sorted-sets/#by-order)) remove elements from lowest to highest and highest to lowest values, respectively.

Sorted sets also have access to the `ZREM` command, which lets you remove an element based on its value:

    ZREM example_sorted_set "A test value"
    ZRANGE example_sorted_set 0 -1

{{< output >}}
1) "E test value"
2) "D test value"
3) "C test value"
4) "B test value"
{{< /output >}}

Redis additionally has a dedicated set of commands for removing ranges of elements based on where they are ordered.

You can see these commands demonstrated below. They use the sorted sets created with:

    ZADD example_sorted_set_four 1 "F" 2 "E" 3 "D" 4 "C" 5 "B" 6 "A"
    ZADD example_sorted_set_five 0 "L" 0 "K" 0 "J" 0 "I" 0 "H" 0 "G"

- The `ZREMRANGEBYSCORE` command removes a range of elements based inclusively on given scores:

        ZREMRANGEBYSCORE example_sorted_set_four 3 5
        ZRANGE example_sorted_set_four 0 -1

    {{< output >}}
1) "F"
2) "E"
3) "A"
    {{< /output >}}

- The `ZREMRANGEBYRANK` command removes a range of elements on indices, again, inclusively:

        ZREMRANGEBYRANK example_sorted_set_four 2 -2
        ZRANGE example_sorted_set_four 0 -1

    {{< output >}}
1) "F"
2) "E"
3) "A"
    {{< /output >}}

- The `ZREMRANGEBYLEX` command removes a range of elements based on a lexical range, assuming all of the elements have the same score:

        ZREMRANGEBYLEX example_sorted_set_five [I (L
        ZRANGE example_sorted_set_five 0 -1

    {{< output >}}
1) "G"
2) "H"
3) "L"
    {{< /output >}}

## Conclusion

With this, you have a basis for beginning to work with sorted sets. You have the tools for creating, viewing, and modifying them, and should be ready to put them to use in your Redis database.

Take a look at our upcoming guides on the series as well. These take you further into Redis usage and concepts, exploring topics like data types and server-assisted client-side caching.
