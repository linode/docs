---
slug: using-sorted-sets-in-redis-database
description: "Learn how to use Sorted Sets in your Redis databases, a powerful additional data type for ordered values. You also learn common commands needed to manage Sorted Sets."
keywords: ['redis sorted set example','redis sorted set commands','how do redis sorted sets work']
tags: ['redis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-21
modified_by:
  name: Nathaniel Stickman
title: "Use Sorted Sets in Redis Databases"
title_meta: "How to Use Sorted Sets in Redis Databases"
external_resources:
- '[Redis: An Introduction to Redis Data Types and Abstractions](https://redis.io/topics/data-types-intro)'
authors: ["Nathaniel Stickman"]
---

Redis, the open-source, in-memory database, is a popular option for its quick, low-latency storage. Redis's *Sorted Set* data type captures the advantages of both Lists and Sets, giving you a useful tool for ordered collections of unique values. This tutorial dives into what Sorted Sets are and introduces you to commands you can use to manage them.

Be sure to check out our other guides in this series, including our previous guide on [Connecting to Redis and Using Redis Databases](/docs/guides/redis-getting-started/).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Follow the instructions in our [How to Install and Configure Redis](/docs/guides/install-redis-ubuntu/) guide to installing a Redis server and command-line interface (CLI). Be sure to use the drop-down menu at the top of that page to select your Linux distribution and get the appropriate steps.

{{< note respectIndent=false >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Are Sorted Sets in Redis?

Redis's Sorted Set data type consists of a collection of unique string values. Each string value is scored with a numeric value, which becomes the primary sorting criteria for ordering the Sorted Set.

In Redis, Sets are also collections of unique string values. But Sets themselves are unordered. With Sorted Sets, Redis provides a data type with the advantages of sets while forgoing the limitation of being unordered.

Redis's Sorted Sets can actually be thought of as a cross between Lists and Hashes. Lists, because they are ordered, and Hashes, because the scores act like keys for each value.

To learn more about Lists and Sets in Redis, read our [How to Use Lists and Sets in Redis Databases](/docs/guides/using-lists-and-sets-in-redis-database/) guide.

### Sorted Sets and Scoring

Each value in a Sorted Set is assigned a score. Scores then act as the primary means for ordering and navigating Sorted Sets. Sorted Sets also have a secondary sorting method. Any values with matching scores are sorted lexically based on the values themselves. This can be very convenient when, for instance, you want a Set that can be organized alphabetically.

## How to Use Sorted Sets in Redis

You may be familiar with how to use Redis Sets, but Sorted Sets come with their own commands. In fact, Sorted Sets operate more like Lists and Hashes in Redis.

The following sections introduce you to some of the most useful operations and commands for Sorted Sets. By the end, you should be ready to start working with this data type in your Redis databases.

### Add Elements to a Sorted Set

Use the `ZADD` command to add elements to a Sorted Set. When the given Set does not already exist, this command creates the Set, like in the example below:

    ZADD example_sorted_set 10 "A test value"

The `ZADD` command can also add multiple elements at a time. Just continue adding score-value pairs to the command as shown in the example below:

    ZADD example_sorted_set 9 "B test value" 8 "C test value" 7 "D test value" 6 "E test value"

### Fetch Elements from a Sorted Set

Sorted Sets, because they are ordered, give you ready tools for fetching elements based on that ordering. But Sorted Sets also come with the ability to sort and retrieve items lexically.

Below, see how to get items from your Redis Sorted Sets using both of these sorting methods.

#### By Order

Fetching items from a Sorted Set works more like doing so from a List than from a Set.

- Use the `ZRANGE` command to fetch values based on an index range. The elements are sorted from lowest score to highest. This example fetches the entire Sorted Set created in the previous section:

        ZRANGE example_sorted_set 0 -1

    {{< output >}}
1) "E test value"
2) "D test value"
3) "C test value"
4) "B test value"
5) "A test value"
    {{< /output >}}

    Redis indices start at `0`, while negative indices begin at the end of a collection. The example above fetches all items from the first (`0`) to the last (`-1`) item. Using `-2` refers to the next-to-last item in the Sorted Set, and so on.

    You can reverse the order using the `ZREVRANGE` command instead. The example below does so and fetches only the first three items in the Sorted Set:

        ZREVRANGE example_sorted_set 0 2

    {{< output >}}
1) "A test value"
2) "B test value"
3) "C test value"
    {{< /output >}}

- Use the `ZPOPMIN` and `ZPOPMAX` commands to fetch one or more values, with their corresponding scores, from the beginning, or end of a Sorted Set, respectively. The fetched values are then removed from the Sorted Set:

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

    The scores in the command are inclusive by default. Precede the score in the command with a `(` (as in `(1 (8`) to make the search exclusive.

#### By Lexical Order

By default, Redis's Sorted Sets order items with the same scores lexically based on the items' values. So, "A test value" comes before "B test value" if both have matching scores.

To make an alphabetical Sorted Set, you just apply the same score to all values in the Set, as in:

    ZADD example_sorted_set_three 0 "E test value" 0 "D test value" 0 "C test value" 0 "B test value" 0 "A test value"
    ZRANGE example_sorted_set_three 0 -1

{{< output >}}
1) "A test value"
2) "B test value"
3) "C test value"
4) "D test value"
5) "E test value"
{{< /output >}}

When you want to fetch a range based on its lexical sorting, you can use the `BYLEX` option with the `ZRANGE` command. Precede the beginning and ending strings (`B` and `D`, respectively, in this next example) with either `(` for exclusive search or `[` for inclusive search.

    ZRANGE example_sorted_set_three [B [D BYLEX

{{< output >}}
1) "B test value"
2) "C test value"
{{< /output >}}

Notice that the `D test value` is excluded from the range above. This is because the ending search string is `D`, which comes before `D test value` lexically. You can include this value as shown in the command below:

    ZRANGE example_sorted_set_three [B [Dz BYLEX

{{< output >}}
1) "B test value"
2) "C test value"
3) "D test value"
{{< /output >}}

### Modify Elements in a Sorted Set

You can update an element's score in a Sorted Set using the `ZADD` command again. Recall that Sets and Sorted Sets are collections of *unique* values. So, when you use the `ZADD` command for a value already in a Sorted Set, only the value's score is changed. No new entry gets added.

    ZADD example_sorted_set 2 "A test value"
    ZRANGE example_sorted_set 0 -1

{{< output >}}
1) "A test value"
2) "E test value"
3) "D test value"
4) "C test value"
5) "B test value"
{{< /output >}}

### Remove Elements from a Sorted Set

The `ZPOPMIN` and `ZPOPMAX` commands covered in [Fetch Elements from a Sorted Set](/docs/guides/using-sorted-sets-in-redis-database/#by-order) removes the lowest scored and highest scored elements, respectively.

Sorted Sets also have access to the `ZREM` command, which lets you remove an element based on its value.

    ZREM example_sorted_set "A test value"
    ZRANGE example_sorted_set 0 -1

{{< output >}}
1) "E test value"
2) "D test value"
3) "C test value"
4) "B test value"
{{< /output >}}

Redis additionally has a dedicated set of commands for removing ranges of elements based on where they are ordered. You can see an example of these commands below.

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

This guide provides you the basis for beginning to work with Sorted Sets. You have the tools for creating, viewing, and modifying them, and should be ready to put them to use in your Redis database.
