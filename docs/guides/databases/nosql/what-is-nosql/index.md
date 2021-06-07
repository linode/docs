---
slug: what-is-nosql
author:
  name: Linode Community
  email: docs@linode.com
description: 'A short guide explaining what NoSQL is, the differences between NoSQL and SQL, what some of the popular NoSQL types are, and links to a few examples of each popular type of NoSQL database.'
og_description: 'A short guide explaining what NoSQL is, the differences between NoSQL and SQL, what some of the popular NoSQL types are.'
keywords: ['nosql','database','nosql database','non-sql','non-sql database']
tags: ["nosql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-30
modified_by:
  name: Linode
title: "What Is NoSQL?"
h1_title: "What is NoSQL?"
external_resources:
- '[LIST OF NOSQL DATABASE MANAGEMENT SYSTEMS](https://hostingdata.co.uk/nosql-database/)'
---

## What Makes NoSQL Different From SQL?

The term "NoSQL" (shortened from *"non-SQL"*) is used to describe a database management system with a non-relational data model, in opposition to the *Structured Query Language* (SQL). They are more flexible than relational databases. Some are used in ways a traditional database can't be, making them valuable tools for things like speeding up website caching (like Redis) or helping with rapid iterative development practices (like MongoDB).

SQL was designed for managing in a relational database management system, and those systems are usually referred to as "SQL databases" (Microsoft SQL Server or MySQL, for example). It has been used to manage structured data (which incorporates relations among entities and variables). NoSQL systems use other means to manage data. They are more flexible than relational databases (though NoSQL gives up consistency to achieve these gains), with some used in ways a traditional database can't be, making them valuable tools for speeding up website caching (like Redis), helping with rapid iterative development practices (like MongoDB). NoSQL can also mean "Not only SQL," where a NoSQL system may use a SQL-like language or work alongside a SQL database.

Keeping up with every NoSQL database is an overwhelming task, so this article covers the basics and some of the most popular NoSQL databases and database types available. If you want to see an exhaustive and (at the time of this writing) up-to-date listing, see the [List of NoSQL Database Management Systems on Hosting Data's website](https://hostingdata.co.uk/nosql-database/).

## What are the Types of NoSQL Databases?

There are at least ten types of NoSQL systems. However, when someone mentions "NoSQL," they are usually referring to four types (which also overlap with most other types): Columnar, Document-oriented, Graph, and Key-value. Some, such as the Amazon and IBM offerings, are cloud-based and require working within their systems. Others, such as Redis and MongoDB, can be installed within a Linode or other system for you to work with as you see fit.

### Columnar Databases
Columnar databases, sometimes called wide-column stores, store their data in columns (each in its own file or region in the system storage). On the surface, this seems similar to traditional relational SQL databases, but as they have no pre-defined keys, column names, and are free of schemas, all of which allow for high flexibility. Notable examples include [Amazon SimpleDB](https://aws.amazon.com/simpledb/) [Apache Cassandra](https://cassandra.apache.org/), and [Apache Hadoop](http://hadoop.apache.org/).

### Document-oriented Databases
Document-oriented databases (or document stores) store data as documents, utilizing them as a key-value store (each document has a key, which is a unique identifier, and the document itself is the value). These systems are designed for users who need to build fast and handle high demand (particularly on agile projects utilizing continuous integration and deployment). Notable examples include [Couchbase](https://www.couchbase.com/), [IBM Cloudant](https://www.ibm.com/cloud/cloudant), and [MongoDB](https://www.mongodb.com/).

### Graph Databases
Graph databases utilize graph structures for their semantic queries of highly related datasets, storing data via nodes, edges, and properties, which allows the data to be linked together directly. These are used in the medium-term as you address your data store needs or in cases where multiple data stores and applications need to be able to talk with one another. Notable examples include [Amazon Neptune](https://aws.amazon.com/neptune/), [Neo4j](https://neo4j.com/), and [RedisGraph](https://redislabs.com/).

### Key-value Databases
Key-value databases (or key-value stores or tuple stores) use associative arrays (also called "dictionary" or "hash table") with key-value pairs (a key is a unique identifier that retrieves its associated value). Simple integers or strings can be values, but JSON structures other more complex objects can, too. These systems are used with large datasets that need scalable, distributed computing with high availability. Notable examples include [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), [Redis](https://redis.io/), and [RocksDB](https://rocksdb.org/).

### Is Blockchain a NoSQL Database?

No, because while it's not a SQL database, Blockchain is also not a NoSQL database. Blockchain is a distributed database that allows non-trusting parties to access it via a record of truth, whereas a single entity administers both SQL and NoSQL databases. While it is possible to use NoSQL in conjunction with Blockchain (Couchbase discusses such a possibility [here](https://blog.couchbase.com/couchbase-blockchain-nosql-database-synergy/)), Blockchain is not a NoSQL database.

### Other Types of NoSQL Databases

There are innumerable examples of other NoSQL databases built for particular purposes. From using ACID (Atomicity, Consistency, Isolation, Durability) transactions in a distributed database (such as [FoundationDB](https://www.foundationdb.org/)) to storing and analyzing high-frequency time-series data (such as [Axibase](https://axibase.com/)) to solving basic data science problems for users with no statistical background (such as [BayesDB](http://probcomp.csail.mit.edu/software/bayesdb/)), it's likely a database system exists that meets your needs (however niche they may be).

## Further Reading

As mentioned above, NoSQL is an extensive topic. A great resource to find options (more than 225 at the time of this writing) is the [List of NoSQL Database Management Systems on Hosting Data's website](https://hostingdata.co.uk/nosql-database/), and [the NoSQL page on Wikipedia](https://en.wikipedia.org/wiki/NoSQL) links to many resources on the topic.

Oracle (which owns MySQL) has even started to pull NoSQL into MySQL with version 8. A white paper, ["Guide to MySQL and NoSQL - Delivering the Best of Both Worlds"](https://www.mysql.com/why-mysql/white-papers/guide-to-mysql-and-nosql-delivering-the-best-of-both-worlds/) goes into more details on how that works.