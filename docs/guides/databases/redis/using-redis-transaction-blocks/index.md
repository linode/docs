---
slug: using-redis-transaction-blocks
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn about Redis’s transaction blocks and how to use them to more effectively work with your Redis databases."
og_description: "Learn about Redis’s transaction blocks and how to use them to more effectively work with your Redis databases."
keywords: ['redis transactions','redis multi vs pipeline','redis multi exec']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-06
modified_by:
  name: Nathaniel Stickman
title: "How to Use Transaction Blocks in Redis"
h1_title: "How to Use Transaction Blocks in Redis"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Redis: Transactions](https://redis.io/topics/transactions)'
- '[Redis: Using Pipelining to Speedup Redis Queries](https://redis.io/topics/pipelining)'
---

Redis, an open-source in-memory database, can be an exceptional platform for caching, messaging, and other storage tasks benefiting from fast executions and low latency. It also comes with a high degree of control over parallel executions, allowing you to fine tune its performance.

This tutorial walks you through Redis's transaction blocks, which let you group commands and execute them as single units. Doing so guarantees uninterrupted sequential execution of each set of commands, securing command blocks even in highly parallel environments.

Wanting to learn more about using Redis? Take a look at our other guides in this series.

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

## What Are Redis Transactions?

Transactions in Redis are collections of commands that get executed collectively and sequentially. The benefits of executing commands as a transaction block in this way are:

- Guaranteeing that the sequence of commands are not interrupted, even by another Redis client
- Ensuring that the commands are executed as an atomic unit, with the entire transaction block being processed collectively

Transactions are, thus, especially useful in environments with numerous clients and where clients are making frequent transactions in parallel. Redis's transaction blocks ensure that a given set of commands executes as a unit and in a predetermined order.

### Transaction Blocks vs Pipelines

Redis provides another tool for optimizing command execution in a highly-parallel network: *pipelining*.

Pipelining in Redis allows clients to queue series of commands and send them to the server simultaneously, rather than in multiple round trips.

It may seem like the two — transaction blocks and pipelining — serve similar purposes. However, each has a distinct goal in mind and acts to optimize command execution in very different ways from the other:

- Pipelining is concerned primarily with network efficiency. It reduces the round-trip time for a series of commands by submitting them all in one request, rather than a series of requests each with its own response.

    Thus, pipelining is useful for reducing latency and increasing the feasible number of operations per second.

- Transactions are concerned with the integrity of a group of commands. They ensure that a designated group gets executed sequentially, in total, and without interruption, where pipelines may execute requests in alternation with requests sent from other clients.

    So, transaction blocks become useful when you need to guarantee a collection of commands is processed as a unit and the commands are executed sequentially.

## How to Run a Transaction Block

To start a transaction in Redis, use the following command in the Redis CLI:

    MULTI

This begins a new transaction block. Subsequent commands you enter are queued in sequence. The queuing ends and the queued commands are executed when you complete the block with this command:

    EXEC

Here is a full example. It starts with the `MULTI` command to initiate a transaction block. Then it creates a new key with a value of `10`, increments that key's value by one, resets the key to `8`, and again increments the value by one. Finally, the `EXEC` command completes the block and executes the transaction:

    MULTI
    SET the_key 10
    INCR the_key
    SET the_key 8
    INCR the_key
    GET the_key
    EXEC

Notice that, for each command within the block (between `MULTI` and `EXEC`), the client responds with `QUEUED`. Once you send the `EXEC` command, the server provides and appropriate response for each command within the transaction:

{{< output >}}
1) OK
2) (integer) 11
3) OK
4) (integer) 9
5) "9"
{{< /output >}}

## How to Handle Errors in a Transaction Block

You may encounter one of two kinds of errors when working with transaction blocks in Redis. The errors can be categorized based on when they occur:

- Errors before the `EXEC` command. These include errors related to syntax or related to server restrictions like maximum memory. Although you can continue queuing commands after receiving one of these errors, the transaction block subsequently fails when you run `EXEC`.

    For instance, here is a transaction with a typo for the `GET` command:

        MULTI
        SET new_key "alpha"
        GRT new_key

    {{< output >}}
(error) ERR unknown command `GRT`, with args beginning with: `new_key`,
    {{< /output >}}

    Disregarding the error and attempting to execute the transaction results in:

        EXEC

    {{< output >}}
(error) EXECABORT Transaction discarded because of previous errors.
    {{< /output >}}

    Thus, you likely want to cancel any transaction blocks that encounter errors during queuing. See the next section — [How to Cancel a Transaction Block](/docs/guides/using-redis-transaction-blocks/#how-to-cancel-a-transaction-block) — for instructions on how to do so.

- Errors after the `EXEC` command. These are errors returned by the server in response to individual commands in the transaction. You would receive such an error, for example, for mismatched types:

        MULTI
        SET new_key "beta"
        LPOP new_key
        EXEC

    {{< output >}}
1) OK
2) (error) WRONGTYPE Operation against a key holding the wrong kind of value
    {{< /output >}}

    Notice that the first command executed successfully, which you can further verify with:

        GET new_key

    {{< output >}}
"beta"
    {{< /output >}}

## How to Cancel a Transaction Block

A transaction can be canceled at any time before the `EXEC` command. To do so, use the `DISCARD` command.

This next example demonstrates, showing that the key (`another_key`) remains unchanged from its pre-transaction value:

    SET another_key "gamma"
    MULTI
    SET another_key 2
    INCR another_key
    DISCARD
    GET another_key

{{< output >}}
"gamma"
{{< /output >}}

As mentioned above, the ability to cancel an in-progress transaction becomes especially handy if you encounter an error while queuing commands for a transaction.

## Conclusion

With that, you should be ready to start using transaction blocks on your Redis server. This tutorial has walked you through the fundamentals of Redis transactions, how to create them, understanding errors, and canceling in-progress transactions.

You can learn more about Redis and how to get the most out of your Redis databases through our other guides in this series. These guides cover everything from connecting to a remote Redis server to working with the hash data type.
