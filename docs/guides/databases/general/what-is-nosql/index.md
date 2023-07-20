---
slug: what-is-nosql
description: 'An explanation of what NoSQL is, the differences with SQL, what some of the popular types are, and links to examples of popular NoSQL databases.'
keywords: ['nosql','database','nosql database','non-sql','non-sql database']
tags: ["nosql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-09
modified_by:
  name: Linode
title: "What is NoSQL?"
external_resources:
- '[LIST OF NOSQL DATABASE MANAGEMENT SYSTEMS](https://hostingdata.co.uk/nosql-database/)'
authors: ["Linode"]
---

## What Makes NoSQL Different From SQL?

The term "NoSQL" or *"non-SQL"* describes a database management system with a non-relational data model, in contrast to the *Structured Query Language* (SQL). They are more flexible than relational databases. These database management systems are used to speed up website caching, like Redis, or to help with rapid iterative development practices, like MongoDB.

SQL was designed to manage a relational database management system, and are referred to as "SQL databases". For example, Microsoft SQL Server or MySQL are SQL databases. It has been used to manage structured data, which incorporates relations among entities and variables. NoSQL systems use other means to manage data. They are more flexible than relational databases. NoSQL can also mean "Not only SQL," where a NoSQL system may use a SQL-like language or work alongside a SQL database.

Keeping up with every NoSQL database is an overwhelming task. This article covers the basics and some of the most popular NoSQL databases and database types available. If you want an exhaustive listing, see the [List of NoSQL Database Management Systems on Hosting Data's website](https://hostingdata.co.uk/nosql-database/).

## What are the Types of NoSQL Databases?

There are at least ten types of NoSQL systems. However, when someone mentions "NoSQL," they are usually referring to four types: Columnar, Document-oriented, Graph, and Key-value. Some databases, such as the Amazon and IBM offerings, are cloud-based, and require working within their systems. Others, such as Redis and MongoDB, can be installed within a Linode or other system to work with as you see fit.

### Columnar Databases
Columnar databases, sometimes called wide-column stores, store their data in columns, each in its own file, or region in the system storage. On the surface, this seems similar to traditional relational SQL databases. Because they have no predefined keys, column names, and are free of schemas, all of which allow for high flexibility. Notable examples include [Apache Cassandra](https://cassandra.apache.org/), and [Apache Hadoop](http://hadoop.apache.org/).

### Document-oriented Databases
Document-oriented databases, or document stores, store data as documents, utilizing them as a key-value store. Each document has a key, which is a unique identifier, and the document itself is the value. These systems are designed for users who need to build fast and handle high demand, particularly on agile projects utilizing continuous integration and deployment. Notable examples include [Couchbase](https://www.couchbase.com/), [IBM Cloudant](https://www.ibm.com/cloud/cloudant), and [MongoDB](https://www.mongodb.com/).

### Graph Databases
Graph databases utilize graph structures for their semantic queries of highly related datasets, store data through nodes, edges, and properties. This allows the data to be linked together directly. These are used in the medium-term as you address the data store needs, or in cases where multiple data stores, and applications need to talk with each other. Notable examples include [Neo4j](https://neo4j.com/), and [RedisGraph](https://redislabs.com/).

### Key-value Databases
Key-value databases, or key-value stores or tuple stores, use associative arrays, also called "dictionary" or "hash table", with key-value pairs: A key is a unique identifier that retrieves its associated value. Simple integers or strings can be values, but JSON structures and other more complex objects can be values, too. These systems are used with large datasets that need scalable, distributed computing with high availability. Notable examples include [Redis](https://redis.io/), and [RocksDB](https://rocksdb.org/).

## Is Blockchain a NoSQL Database?

While blockchain is not a SQL database, Blockchain is also not a NoSQL database. Blockchain is a distributed database that allows non-trusting parties to access it via a record of truth, whereas a single entity administers both SQL and NoSQL databases. While it is possible to use NoSQL in conjunction with Blockchain ([Couchbase discusses one such a possibility](https://blog.couchbase.com/couchbase-blockchain-nosql-database-synergy/)), Blockchain is not a NoSQL database.

## Other Types of NoSQL Databases

There are innumerable examples of other NoSQL databases built for particular purposes:
- for Atomicity, Consistency, Isolation, Durability (ACID) transactions in a distributed database, such as with [FoundationDB](https://www.foundationdb.org/)
- to store and analyze high-frequency time-series data, such as with [Axibase](https://axibase.com/)
- to solve basic data science problems for users with no statistical background, such as with [BayesDB](http://probcomp.csail.mit.edu/software/bayesdb/))
It is likely that a database system exists that meets your needs.

## Further Reading

As mentioned above, NoSQL is an extensive topic. A great resource to find options is the [List of NoSQL Database Management Systems on Hosting Data's website](https://hostingdata.co.uk/nosql-database/), and [the NoSQL page on Wikipedia](https://en.wikipedia.org/wiki/NoSQL) links to many resources on the topic.
