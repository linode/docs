---
slug: sharded-database
description: 'Database sharding divides data into smaller chunks and distributes it across different database nodes. Learn more about sharding practices and strategies.'
keywords: ['sharded database','db sharding','sharding strategy','database sharding examples']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-26
modified_by:
  name: Linode
title: "Database Sharding: Concepts, Examples, and Strategies"
external_resources:
- '[Wikipedia page on database sharding](https://en.wikipedia.org/wiki/Shard_(database_architecture))'
- '[MongoDB explanation of database sharding](https://www.mongodb.com/features/database-sharding-explained)'
authors: ["Jeff Novotny"]
tags: ["saas"]
---

Many software applications use a *relational database management system* (RDBMS) to store data. As the database grows, it becomes more time-and-storage intensive to store the data. One popular solution to this problem is [*database sharding*](https://en.wikipedia.org/wiki/Shard_(database_architecture)). A sharded database distributes the records in a database's tables across different databases on different computer systems. This guide explains how database sharding works and discusses some of the advantages and disadvantages of sharding. It also describes some of the main sharding strategies and provides some database sharding examples.

## What is Database Sharding?

As databases grow larger, they can be scaled in one of two ways. *Vertical scaling* involves upgrading the server hosting the database with more RAM, CPU ability, or disk space. This allows it to store more data and process a query more quickly and effectively. *Horizontal scaling*, which is also known as "scaling out", adds additional servers to distribute the workload.

Data sharding is a common way of implementing horizontal scaling. Database sharding divides the table records in a database into smaller portions. Each section is a *shard*, and is stored on a different server. The database can be divided into shards based on different methods. In a simple implementation, the individual tables can be assigned to different shards. More often, the rows in a single table are divided between the shards.

*Vertical partitioning* and *horizontal partitioning* are two different methods of partitioning tables into shards. Vertical partitioning assigns different columns within a table to different servers, but this technique is not widely used. In most cases, horizontal partitioning/sharding is used to implement sharding, and the two terms are often used interchangeably. Horizontal sharding divides the rows within a table amongst the different shards and keeps the individual table rows intact.

{{< note respectIndent=false >}}
Vertical partitioning and horizontal partitioning should not be confused with vertical and horizontal scaling.
{{< /note >}}

The shards are distributed across the different servers in the cluster. Each shard has the same database schema and table definitions. This maintains consistency across the shards. Sharding allocates each row to a shard based on a sharding key. This key is typically an index or primary key from the table. A good example is a user ID column. However, it is possible to generate a sharding key from any field, or from multiple table columns. The selection of the sharding key should be reasonable for the application and effectively distribute the rows among the shards. For example, a country code or zip code is a good choice to distribute the data to geographically dispersed shards. Sharding is particularly advantageous for databases that store large amounts of data in relatively few tables, and have a high volume of reads and writes.

Each shard can be accessed independently and does not necessarily require access to the other shards. Different tables can use different sharding techniques and not all tables necessarily have to be sharded. As an ideal, sharding strives towards a *shared-nothing* architecture, in which the shards do not share data and there is no data duplication. In practice, it is often advantageous to replicate certain data to each shard. This avoids the need to access multiple servers for a single query and can result in better performance.

The following example demonstrates how horizontal sharding works in practice. Before the database is sharded, the example `store` table is organized in the following way:

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 1001 | Detroit | MI | 48201 |
| 1350 | Chicago | IL | 60601 |
| 2101| Cleveland | OH | 44114 |
| 2250 | Pittsburgh | PA | 15222 |
| 2455 | Boston | MA | 02108 |
| 2459 | New York | NY | 10022 |

After sharding, one shard has half the rows from the table.

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 1001 | Detroit | MI | 48201 |
| 2101| Cleveland | OH | 44114 |
| 2455 | Boston | MA | 02108 |

The second shard contains the remainder of the rows.

| store_ID | city | state | zip_code  |
|:-:|:-:|:-:|:-:|
| 1350 | Chicago | IL | 60601 |
| 2250 | Pittsburgh | PA | 15222 |
| 2459 | New York | NY | 10022 |

Sharding does not necessarily make any backup copies of the data. Each record is still only stored on a single server. *Replication* is used to copy information to another server, resulting in primary and secondary copies of the data. Replication enhances reliability and robustness at the cost of additional complexity and resources. Sharded databases can be replicated, but the procedure for doing so can be very complex.

Replication and caching are both potential alternatives to sharding, particular in applications which mainly read data from a database. Replication spreads out the queries to multiple servers, while caching speeds up the requests. See our guide [How to Configure Source-Replica Replication in MySQL](/docs/guides/configure-source-replica-replication-in-mysql/) to learn more about  data replication.

## Pros and Cons of a Sharded Database

Generally, a horizontal scaling approach is more robust and effective than vertical scaling. Vertical scaling is much easier to implement, because it mainly consists of hardware upgrades. It might be the correct approach to take with a medium-sized database that is slowly reaching its limit. However, it is impossible to scale any system indefinitely, and ongoing growth rapidly becomes unmanageable. The limits of vertical scaling usually lead administrators to seek another alternative.

Horizontal scaling allows systems to achieve a much higher scaling rate. Additional servers can be added as required, permitting the database system to organically grow and access additional resources. It provides administrators with much more flexibility.

Database sharding is a horizontal scaling strategy, so it shares the advantages of this approach. However, it also offers several additional benefits, including the following:

- It improves performance and speeds up data retrieval. Based on the sharding key, the database system immediately knows which shard contains the data. It can quickly route the query to the right server. Because each shard only contains a subset of the rows, it is easier for the database server to find the correct entry.
- Additional computing capacity can be added with no downtime. Sharding increases the data storage capacity and the total resources available to the database.
- It can be more cost efficient to run multiple servers than one mega-server.
- Sharding can simplify upgrades, allowing one server to be upgraded at a time.
- A sharded approach is more resilient. If one of the servers is offline, the remaining shards are still accessible. Sharding can be combined with high availability techniques for even higher reliability.
- Many modern database systems provide some tools to assist with sharding, although they do not completely automate the process.

Unfortunately, sharding also has drawbacks. Some of the downsides include:

- Sharding greatly increases the complexity of a software development project. Additional logic is required to shard the database and properly direct queries to the correct shard. This increases development time and cost. A more elaborate network mesh is often necessary, which leads to an increase in lab and infrastructure costs.
- Latency can be higher than with a standard database design.
- [SQL join operations](/docs/guides/sql-joins/) affecting multiple shards are more difficult to execute and take longer to complete. Some operations might become too slow to be feasible. However, the right design can facilitate better performance on common queries.
- Sharding requires a lot of tuning and tweaking as the database grows. This sometimes requires a reconsideration of the entire sharding strategy and database design. Uneven shard distribution can happen even with proper planning, causing the distribution to unexpectedly become lopsided.
- It is not always obvious how many shards and servers to use, or how to choose the sharding key. Poor sharding keys can adversely affect performance or data distribution. This causes some shards to be overloaded while others are almost empty, leading to hotspots and inefficiencies.
- It is more challenging to change the database schema after sharding is implemented. It is also difficult to convert the database back to its pre-sharded state.
- Shard failures can cause cross-shard inconsistencies and other failures.
- Backup and replication tasks are more difficult with a sharded database.
- Although most RDBMS applications provide some sharding support, the tools are often not robust or complete. Most systems still do not fully support automatic sharding.

## Database Sharding Strategies: Common Architectures

Any sharding implementation must first decide on a db sharding strategy. Database designers must consider how many shards to use and how to distribute the data to the various servers. They must decide what queries to optimize, and how to handle joins and bulk data retrieval. A system in which the data frequently changes requires a different architecture than one that mainly handles read requests. Replication, reliability and a maintenance strategy are also important considerations.

The choice of a sharding architecture is a critical decision, because it affects many of the other considerations. Most sharded databases have one of the following four architectures:

- **Range Sharding**.
- **Hashed Sharding**.
- **Directory-Based Sharding**.
- **Geographic-Based Sharding**.

### Range Sharding

Range sharding examines the value of the sharding key and determines what range it falls into. Each range directly maps to a different shard. The sharding key should ideally be immutable. If the key changes, the shard must be recalculated and the record copied to the new shard. Otherwise, the mapping is destroyed and the location could be lost. Range sharding is also known as dynamic sharding.

As an example, if the `userID` field is the sharding key, then records having IDs between 1 to 10000 could be stored in one shard. IDs between 10001 and 20000 map to a second shard, and those between 20001 and 30000 to a third.

This approach is fairly easy to design and implement, and requires less programming time. The database application only has to compare the value of the sharding key to the predefined ranges using a lookup table. This scheme is also easier to redesign and maintain. Range sharding is a good choice if records with similar keys are frequently viewed together.

Range sharding works best if there are a large number of possible values that are fairly evenly distributed across the entire range. This design works poorly if most of the key values map to the same shard. Unfortunately, this architecture is prone to poor distribution of rows among the shards. A good design can still lead to an unbalanced distribution. For example, older accounts are more likely to have been deleted over the years, leaving the corresponding shard relatively empty. This leads to inefficiencies in the database. Choosing fairly large ranges can reduce, but not eliminate, this possibility.

The database sharding examples below demonstrate how range sharding might work using the data from the `store` database. In this case, the records for stores with store IDs under 2000 are placed in one shard. Stores possessing IDs of 2001 and greater go in the other.

The first shard contains the following rows:

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 1001 | Detroit | MI | 48201 |
| 1350 | Chicago | IL | 60601 |

The second shard has the following entries:

| store_ID | city | state | zip_code  |
|:-:|:-:|:-:|:-:|
| 2101| Cleveland | OH | 44114 |
| 2250 | Pittsburgh | PA | 15222 |
| 2455 | Boston | MA | 02108 |
| 2459 | New York | NY | 10022 |

This results in a slightly imbalanced distribution of records. However, as new stores are added, they might be assigned larger store IDs. This leads to a greater imbalance as time goes on.

To keep the database running efficiently, shards and ranges have to be regularly rebalanced. This might involve splitting the shards apart and reassigning the data, or merging several smaller shards. If the data is not regularly monitored, performance can steadily degrade.

### Hash Sharding (Key-Based)

Hash-based sharding, also known as key-based or algorithmic sharding, also uses the shard key to determine which shard a record is assigned to. However, instead of mapping the key directly to a shard, it applies a hash function to the shard key. A hash function transforms one or more data points to a new value that lies within a fixed-size range. In this case, the size of the range is equal to the number of shards. The database uses the output from the hash function to allocate the record to a shard. This typically results in a more even distribution of the records to the different shards.

This method allows multiple fields to be used as a compound shard key. This eliminates clumping and clustering, and is a better approach to use if several records can share the same key. Hash functions vary in complexity. A simple hash function calculates the remainder, or modulus, of the key divided by the number of shards. More complex hashing algorithms apply mathematically advanced equations to multiple inputs. However, it is important to use the same hash function on the same keys for each hashing operation. As with range sharding, the key value should be immutable. If it changes, the hash value must be recalculated and the database entry remapped.

Hash sharding is more efficient than range sharding because a lookup table is not required. The hash is calculated in real time for each query. However, it is impossible to group related records together, and there is no logical connection between the records on a given shard. This requires most bulk queries to read records from multiple shards. Hash sharding is more advantageous for applications that read or write one record at a time.

Hash sharding does not guarantee that the shards are destined to remain perfectly balanced. Patterns in the data still might lead to clustering, which can occur purely by chance. Hash sharding complicates the tasks of rebalancing and rebuilding the shards. To add more shards, it is usually necessary to re-merge all the data, recalculate the hashes, and reassign all the records.

The following database sharding example demonstrates a simple hash sharing operation. It uses the simple hash function `store_ID % 3` to assign the records in the `store` database to one of three shards. The first step is to calculate a hash result for each entry.

{{< note respectIndent=false >}}
The hash results are not actually stored inside the database. They are shown in the final column for clarity.
{{< /note >}}

| store_ID | city | state | zip_code  | hash result |
|:-:|:-:|:-:|:-:|:-:|
| 1001 | Detroit | MI | 48201 | 2
| 1350 | Chicago | IL | 60601 | 0
| 2101| Cleveland | OH | 44114 | 1
| 2250 | Pittsburgh | PA | 15222 | 0
| 2455 | Boston | MA | 02108 | 1
| 2459 | New York | NY | 10022 | 2

Rows having a hash result of `0` map to the first shard.

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 1350 | Chicago | IL | 60601 |
| 2250 | Pittsburgh | PA | 15222 |

Those that have a hash result of `1` are assigned to shard number two.

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 2101| Cleveland | OH | 44114 |
| 2459 | New York | NY | 10022 |

The remainder are stored in the third shard.

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 1001 | Detroit | MI | 48201 |
| 2459 | New York | NY | 10022 |

In this case, although the data set is quite small, the hash function still distributes the entries evenly. This is not always the case with every database. However, as records are added, the distribution is likely to remain reasonably balanced.

### Directory-Based Sharding

Directory-based sharding groups related items together on the same shard. This is also known as entity or relationship-based sharding. It typically uses the value contained in a certain field to decide what shard to use. Directory sharding is accomplished through the use of a static lookup table. The table contains a list of mappings between each possible value for the field and its designated shard. Each key can only map to one shard and must appear in the lookup table exactly once. However many keys can potentially be mapped to the same shard.

As an example, the records in a table of customers can be mapped to shards based on the customer's home state. The lookup table contains a list of all fifty states, which are the shard keys, and the shard it maps to. This allows for a system design where the records of all customers living in New England are stored on the first shard. Clients in the Mid-Atlantic are located on shard two. Clients residing in the Deep South are mapped to the third shard.

Directory-based sharding provides a high level of control and flexibility in determining how the data is stored. When intelligently designed, it speeds up common table joins and the bulk retrieval of related data. This architecture is very helpful if the shard key can only be assigned a small number of possible values. Unfortunately, it is highly prone to clustering and imbalanced tables, and the overhead of accessing the lookup table degrades performance. However, the benefits of this architecture often outweighs its drawbacks.

Directory-based sharding is a good choice for the `stores` database. The store entries can be distributed to the different shards based on their location. In this design, locations in New England and the mid-Atlantic are stored in the first shard, which serves as the North-East shard. Stores in the Midwest are written to the second shard.

The first shard contains the entries displayed below.

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 2250 | Pittsburgh | PA | 15222 |
| 2455 | Boston | MA | 02108 |
| 2459 | New York | NY | 10022 |

The second shard contains the remainder of the data.

| store_ID | city | state | zip_code |
|:-:|:-:|:-:|:-:|
| 1001 | Detroit | MI | 48201 |
| 1350 | Chicago | IL | 60601 |
| 2101| Cleveland | OH | 44114 |

Although these two shards are perfectly balanced, this is not the main goal of directory sharding. It instead seeks to generate useful and relevant shards of closely-related information, which this example also accomplishes.

### Geographic-Based Sharding

Geographic-based sharding, or *Geo-sharding*, is a specific type of directory-based sharding. Data is divided amongst the shards based on the location of the entry, which relates to the location of the server hosting the shard. The sharding key is typically a city, state, region, country, or continent. This groups geographically similar data on the same shard. It works the same way directory-based sharding does.

A good example of geo-sharding relates to geographically dispersed customer data. The customer's home state is used as a sharding key. The lookup table maps customers living in states in the same sales region to the same shard. Each shard is located on a server located in the same region as the customer data it contains. This makes it very quick and efficient for a regional sales team to access customer data.

## Is Sharding Right For Your Business?

Because sharding has both advantages and drawbacks, it is important to consider which type of database benefits the most from sharding. The first part of any sharding strategy is to decide whether to shard at all. To generalize, sharding makes the most sense for a high-volume database that stores a large amount of data in a few simple tables. Sharding is especially compelling if a company expects a large increase in the size of its database. Sharding is also useful for organizations that want to access or co-locate their data on a regional basis. For instance, a large social media company would want its users to access database servers in the same country or on the same continent. This requires the company to shard its data based on user location.

In other cases, the complexity and difficulty associated with sharding are greater than the benefits. A database with many small to medium-sized tables could use vertical scaling, increasing the storage and computing power on a single server. It could also use alternative strategies such as replication for greater resilience and read-only throughput.

## Conclusion

This guide answers the question, "What is database sharding?". Sharding is a method of distributing the data in a database table to several different shards based on the value of a sharding key. Each shard is stored on a different server. Ideally, the records in a sharded database are distributed amongst the shards in an equitable manner. The different shards share the same table definitions and schemas, but each record is only stored on a single shard.

Sharding allows a database to scale horizontally, taking advantage of the increased storage, memory, and processing power that only multiple servers can offer. It also increases resiliency and performance. Each query only has to search through a portion of the total records, which is much faster. As a drawback, sharding increases the complexity of a database and increases the difficulty of joins and schema changes.

Sharding can be accomplished using range sharding, hash sharding, or directory-based sharding. Range sharding is the easiest method, but is more likely to result in unequal shards. Hash sharding more effectively distributes the records, but is more difficult to implement. Directory-based sharding groups related items together on the same shard.

A sharded database can be implemented using multiple Linode servers. Linode allows you to configure a full web application on a powerful Linux operating system running the industry-standard LAMP stack. Choose from a high-performance [*Dedicated CPU*](https://www.linode.com/products/dedicated-cpu/) service, or a flexible and affordable [*Shared CPU*](https://www.linode.com/products/shared/) alternative. Similarly, you can also use [Linode's Managed Database service](/docs/products/databases/managed-databases/) to deploy a database cluster without the need to install and maintain the database infrastructure.