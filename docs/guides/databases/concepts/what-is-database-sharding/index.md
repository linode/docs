---
slug: what-is-database-sharding
author:
  name: Linode Community
  email: docs@linode.com
description: "Database sharding can be a useful tool to help you scale your databases for growth and increased traffic. But what is sharding, and when should you use it? Find out in this tutorial, which walks you through what sharding is, the reasons to use it, and alternatives."
og_description: "Database sharding can be a useful tool to help you scale your databases for growth and increased traffic. But what is sharding, and when should you use it? Find out in this tutorial, which walks you through what sharding is, the reasons to use it, and alternatives."
keywords: ['database sharding','database sharding vs partitioning','what is database sharding']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-20
modified_by:
  name: Nathaniel Stickman
title: "What Is Database Sharding?"
h1_title: "What Is Database Sharding?"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[DigitalOcean: Understanding Database Sharding](https://www.digitalocean.com/community/tutorials/understanding-database-sharding)'
- '[MongoDB: Database Sharding — Concepts and Examples](https://www.mongodb.com/features/database-sharding-explained)'
- '[Educative: What Is Database Sharding?](https://www.educative.io/edpresso/what-is-database-sharding)'
- '[GeeksforGeeks: Database Sharding – System Design Interview Concept](https://www.geeksforgeeks.org/database-sharding-a-system-design-concept/)'
---

With growth come new challenges, and the need to choose an infrastructure that allows you to meet those challenges most effectively. Part of doing that is finding the right database architecture to support growing application size and traffic.

Database sharding is an architecture designed to help applications meet scaling needs through horizontal expansion. It gives you the ability to accommodate additional storage needs and more efficiently handle requests.

This tutorial explains what database sharding is and walks you through the pros and cons of it. The guide gives you examples of sharding approaches to consider, as well as alternatives to contrast sharding with.

## What Is Database Sharding?

Database sharding allows you to distribute a single data set across multiple databases. It is a *horizontal partitioning* database architecture, where databases share a schema but each holds different rows of data. Think less of database sharding vs partitioning, and more of sharding as a particular kind of partitioning, contrasted to vertical partitioning.

Doing so allows additional server nodes to share in the request load. This distribution of the load simultaneously increases servers' storage capabilities and the number of requests they can handle.

The diagram below shows you generally what sharding can look like. The initial database, `example_db`, get partitioned into two databases, `example_db_part_1` and `example_db_part_2`. Each partition, or shard, gets some rows from the initial database.

[![Example of horizontal database partitioning/sharding](database-sharding-partitioning_small.png)](database-sharding-partitioning.png)

## Pros and Cons of Database Sharding

Database sharding can accommodate application growth, expanding storage potential and making requests more efficient. However, it is not right for all situations, and it can have drawbacks.

Take a look at these next two sections to learn reasons to consider sharding for your application and reasons to look for alternatives.

### Reasons to Shard

Sharding fits into horizontal scaling models, also called *scaling out* models. These models have you increase the number of nodes to increase servers' abilities to handle increasing traffic and storage needs.

Consistent with these horizontal scaling models, database sharding offers performance benefits for growing applications:

- Increased storage capabilities. Single machines have practical storage limits, but horizontal scaling through sharding outmaneuvers these limits by increasing the number of machines doing the storing.

- Improved response time. Sharded databases often read and write on smaller database instances, which can reduce the time needed locate data and provide responses.

- Reinforced reliability. Because data in sharded databases are distributed, data services are not wiped out as easily. Outages affecting single shards do not automatically take down the entirety of your database.

### Reasons not to Shard

Database sharding fits particular needs, scaling out to improve storage capabilities and performance. But it is not a solution fit for all databases, and it comes with its own drawbacks that need to be considered.

Keep these potential reasons not to shard your database in mind when weighing the benefits of sharding:

- Added complexity. Sharding, by its nature, expands the number of nodes needed to support a database server. With the increase in nodes comes an increase in administration and maintenance efforts. Not only that, but the cost of the additional infrastructure itself has to be considered.

- Increased load per request. A sharded database needs to be managed by a router, which directs requests to the appropriate shards. That alone adds some overhead to requests. Then, any requests that require collation of data from multiple shards explode that burden, with routers having to query each implicated shard to fulfill these requests.

## Approaches to Database Sharding

A few options are available for structuring database shards. These determine where and how you divide data between the shards. Dividing data consistently is necessary to make your sharded database effective.

These are three of the most commonly used sharding architectures.

- **Key-based sharding**. Also known as *hash-based sharding*, this method takes one column, runs its values through a hash function, and sorts data into shards based on the results. The column used for hashing can be called the hash key, and its values can be used like primary keys for shards.

    This diagram shows a database where the `id` column gets hashed, represented by the `example_db_hash` table. The database then gets sharded based on the hash values:

    [![Diagrammed example of key-based sharding](database-key-based-sharding_small.png)](database-key-based-sharding.png)

    In actuality, the hashes are not stored in their own table. They are derived from a function used to add data to shards. The function is just displayed like a table in this example to help visualize the approach.

- **Range-based sharding**. This method divides shards based on value ranges in a specific column. For instance, a database sharded on a `date` column might place all data where `date < 2010-01-01` in one shard and all data where `date >= 2010-01-01` in another shard.

    Adding a `pub_year` column to the example used above works well for this. Here, the database gets sharded with `pub_year < 1900` in one shard and `pub_year >= 1900` in the other:

    [![Diagrammed example of range-based sharding](database-range-based-sharding_small.png)](database-range-based-sharding.png)

- **Directory-based sharding**. This approach employs a sharding lookup table to relate data to particular shards based on categories. Categories can be tracked in a particular column, and the sharding process can relate different possible values for that column to particular shards.

    In this example, the directory sharding is based on the `type` column, which has two possible values, `paperback` and `hardcover`. The lookup table gets used to assign entries with these types to the appropriate shards:

    [![Diagrammed example of directory-based sharding](database-directory-based-sharding_small.png)](database-directory-based-sharding.png)

## Alternatives to Database Sharding

Looking at the section above on sharding's pros and cons, you may decide that sharding is not the best option for your application. Or maybe you just want to know what some alternative solutions are to compare and contrast.

To help, here are a few options you can consider against database sharding. Each provides different features that can accommodate different scaling needs.

- Making use of vertical scaling. Sharding and other horizontal scaling solutions tend to be something to turn to when you have established that vertically expanding your infrastructure is not feasible. So, it is usually a good idea to first look into vertical scaling — things like directly expanding the storage capacity of your database server.

- Employing specialized services. For instance, if your database currently stores binary file data, move the storage of that data to a cloud-storage provider. Taking these kinds of measures aims to ensure you use the most efficient services for storing each kind of data.

- Implementing database replication. This option works for databases that expect plenty of read requests but not so many write requests. Replication creates copies of a database for read requests, and performance can be enhanced through things like load balancing.

## Conclusion

This tutorial has given you an overview of the concept of database sharding and why sharding may or may not be right for your application. With examples of different sharding methods and alternatives, you have what you need to work out the best solution for your application's needs.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
