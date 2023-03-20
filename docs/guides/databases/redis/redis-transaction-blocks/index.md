---
slug: redis-transaction-blocks
description: "Redis transaction blocks group commands and execute them sequential, as a unit. This guide teaches you how to create, execute, and cancel Redis transaction blocks."
keywords: ['redis transactions','redis multi vs pipeline','redis multi exec']
tags: ['redis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-15
modified_by:
  name: Nathaniel Stickman
title: "Use Redis Transaction Blocks"
title_meta: "How to Use Redis Transaction Blocks"
external_resources:
- '[Redis: Transactions](https://redis.io/topics/transactions)'
- '[Redis: Using Pipelining to Speedup Redis Queries](https://redis.io/topics/pipelining)'
authors: ["Nathaniel Stickman"]
---

Redis is an open-source, in-memory database used for caching, messaging, and other storage tasks that benefit from fast execution and low latency. The Redis database supports a high degree of control over parallel executions that allow you to fine-tune its performance.

This guide walks you through using Redis's transaction blocks. Transaction blocks group Redis commands and execute them as single units. Doing so guarantees uninterrupted sequential execution of each set of commands. This ensures that all of the commands in a transaction block are executed, even in highly parallel environments.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    -   On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    -   On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

            sudo dnf upgrade

1. Follow the instructions in our [How to Install and Configure Redis](/docs/guides/install-redis-ubuntu/) guide to installing a Redis server and command-line interface (CLI). Be sure to use the drop-down menu at the top of that page to select your Linux distribution and get the appropriate steps.

{{< note respectIndent=false >}}
The steps written in this guide are for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Are Redis Transactions?

Redis Transactions are a group of commands that are executed collectively and sequentially. The benefits of executing commands as transaction blocks are to ensure the following:

- The sequence of commands is not interrupted, even by another Redis client
- The commands are executed as an atomic unit and the entire transaction block is processed collectively

Transactions are especially useful in environments with numerous clients, and where clients are making frequent transactions in parallel. Redis's transaction blocks ensure that a given set of commands executes as a unit and in a predetermined order.

### Transaction Blocks vs. Pipelines

Redis *pipelining* is another method used to optimize command execution in a highly parallel network. Pipelining in Redis allows clients to queue a series of commands and send them to the server simultaneously, rather than in multiple round trips.

It may seem like *transaction blocks* and *pipelining* serve similar purposes. However, each has a distinct goal and acts to optimize command execution in very different ways from the other. Some of the differences are:

- **Pipelining** is concerned primarily with network efficiency. It reduces the round-trip time for a series of commands by submitting them all in one request, rather than a series of requests each with its own response.

    *Pipelining is useful for reducing latency and increasing the feasible number of operations per second.*

- **Transactions** are concerned with the integrity of a group of commands. They ensure that the entirety of a designated group of commands gets executed sequentially and without interruption. This is in contrast to pipelines that may execute requests in alternation with requests sent from other clients.

    *Transaction blocks are useful when you need to guarantee a collection of commands is processed as a unit and the commands are executed sequentially.*

## How to Run a Transaction Block

To start a transaction in Redis, use the following command in the Redis CLI:

    MULTI

The `MULTI` command begins a new transaction block. Any subsequent commands you enter are queued in sequence. To end the queuing of commands and complete the transaction block, use the following command:

    EXEC

The commands displayed below include a complete example of creating a transaction block with the `MULTI` and `EXEC` commands. It starts with the `MULTI` command to initiate a transaction block. Then it creates a new key with a value of `10` and increments that key's value by one. The key is then reset to `8` and again increments the value by one. Finally, the `EXEC` command completes the block and executes the transaction.

    MULTI
    SET the_key 10
    INCR the_key
    SET the_key 8
    INCR the_key
    GET the_key
    EXEC

Notice that, for each command within the block (between `MULTI` and `EXEC`), the client responds with `QUEUED`. Once you send the `EXEC` command, the server provides an appropriate response for each command within the transaction.

{{< output >}}
1) OK
2) (integer) 11
3) OK
4) (integer) 9
5) "9"
{{< /output >}}

## How to Handle Errors in a Transaction Block

When working with Redis transaction blocks, there are two kinds of errors that you may encounter. Based on when they occur, the errors can be categorized as follows:

-   **Errors before the `EXEC` command**:

    These include errors related to syntax or related to server restrictions, like maximum memory. Although you can continue queuing commands after receiving one of these errors, the transaction block subsequently fails when you run `EXEC`.

    For example, the transaction below includes a typo for the `GET` command:

        MULTI
        SET new_key "alpha"
        GRT new_key

    {{< output >}}
(error) ERR unknown command `GRT`, with args beginning with: `new_key`,
    {{< /output >}}

    Disregarding the error and attempting to execute the transaction results in an error.

        EXEC

    {{< output >}}
(error) EXECABORT Transaction discarded because of previous errors.
    {{< /output >}}

    For this reason, you should cancel any transaction blocks that encounter errors during queuing. See the next section — [How to Cancel a Transaction Block](/docs/guides/redis-transaction-blocks/#how-to-cancel-a-transaction-block) — for instructions on how to do so.

-   **Errors after the `EXEC` command**:

     These are errors returned by the server in response to individual commands in the transaction. For example, you might receive such an error due to mismatched types:

        MULTI
        SET new_key "beta"
        LPOP new_key
        EXEC

    {{< output >}}
1) OK
2) (error) WRONGTYPE Operation against a key holding the wrong kind of value
    {{< /output >}}

    Notice that the first command was executed successfully, which you can further verify using the `GET` command:

        GET new_key

    {{< output >}}
"beta"
    {{< /output >}}

## How to Cancel a Transaction Block

A transaction can be canceled at any time before the `EXEC` command. To do so, use the `DISCARD` command.

The example below demonstrates that the key, `another_key` remains unchanged from its pre-transaction value:

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

Redis transaction execute a collection of commands and ensure that the command execution is not interrupted by another client. This guide covered creating transaction blocks, understanding common transaction errors, and canceling in-progress transactions.

You can learn more about Redis and how to get the most out of your Redis databases through our other guides in this series. These guides cover everything from [connecting to a remote Redis server](/docs/guides/redis-getting-started/) to working with the [hash data type](/docs/guides/hashes-in-redis-databases/).
