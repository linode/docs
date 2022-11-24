---
slug: list-of-databases
author:
  name: Jack Wallen
description: 'Searching for a list of the most popular databases? Our article covers what to look for in a database and top options for data storage.'
keywords: ['database',database lists'','best database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-25
modified_by:
  name: Linode
title: "List of Databases - Most Popular"
h1_title: "The 8 Most Popular Databases"
enable_h1: true
contributor:
  name: Jack Wallen
---

Databases power nearly every digital platform on the planet: From websites, to blogs, to social media, to streaming services. Most end-users know databases such as MySQL as a tool to store data. That's a pretty accurate, although fundamental, description of what a database is. However, they are much more than that.

## The Different Types of Databases

The general term *database* often confounds two separate and distinct components: the database and the Database Management System (DBMS). The database stores the data and the DBMS is the tool, or set of tools, you use to manage the data. The DBMS is addressed here, because it comprises the tools that allow database administrators to communicate with the database so they can fully manage and govern it.

Database Management Systems are broken down into three layers:

- **Client**: Makes requests via the command line or a GUI screen using valid SQL queries.
- **Server**: Responsible for all logical functionality of the server.
- **Storage**: Handles data storage.

Within those layers are tools such as a thread handler, a query language, a parser, an optimizer, a query cache, a buffer, table metadata cache, and a key cache. These pieces come together to make up a powerful system for admins, users, and software to use to store and retrieve data.

One crucial aspect of the DBMS is the query language. This is the special language used to interact with a database. It's a very particular language and must be used according to the specifications set by the DBMS. Some DBMS' have their own, proprietary, query languages, but the most popular are:

- **SQL** - Structured Query Language is one of the most widely used query languages on the market and is used by MS SQL and MySQL.
- **XQuery** - Uses the XML file format to extract and manipulate data.
- **OQL** - Object Query Language is the default language for object-oriented databases which are often used in Big Data use cases.
- **SQL/XML** - A combination of SQL and XQuery and supports SQL statements on XML data.
- **GraphQL** - An open-source language capable of working with APIs and also a runtime that can be used for queries against existing data.
- **LINQ** - Language Integrated Query extracts and processes data from various sources, such as XML documents and relational databases.

## Relational and Non-Relational Databases

DBMS’ use two primary types of database: Relational and Non-Relational. The distinction between these two is important, as they help define the best use case for a database.

A relational database is one that stores information in tables containing related data. What gives a relational database its name is that relationships can be made between two or more tables. The relationships correlate rows belonging to two different tables into a third table. Relational databases are best used when the data they contain doesn't often change and when the accuracy of the data is crucial.

Non-relational databases (also called [NoSQL Databases](/docs/guides/what-is-nosql/)) store their information in a non-tabular form. Instead, non-relational databases store data in data models, of which the four most common types are:

- **Document-oriented** - data is stored as JSON documents.
- **Key-value** - data is stored in key pairs.
- **Graph** - data is stored in a node-edge-node structure.
- **Wide-column** - data is stored in a tabular format with flexible columns that can vary from row to row.

Because they store data this way, non-relational databases are much more flexible. They can store a wide variety of different types of data. This makes them ideal when it's necessary to store massive amounts of complex data, like when working with Big Data applications.

## What to Look for in a Database

The first question to ask is, "Should I use a relational or non-relational database?" A relational database is best used for instances that require *ACID* (Atomicity, Consistency, Isolation, Durability) compliance, data accuracy, normalization, and simplicity, but do not require scalability, flexibility, and high performance. A good example of a relational database use case is a dynamic, database-driven web site such as WordPress.

On the other hand, a non-relational database is best used when data flexibility, speed, and scalability is crucial. A good example of a non-relational database use case is a cloud-based app that depends on massive scaling.

## Eight Popular Databases

This list of the eight most popular databases is divided into 4 relational and 4 non-relational databases.

### Relational Databases

The following are the most popular relational databases on the market today.

#### Oracle

Oracle database was originally developed in 1977, which makes it the oldest database on the list. As of [January 2022](https://www.statista.com/statistics/809750/worldwide-popularity-ranking-database-management-systems/), Oracle holds the top spot as the most widely-used relational database management system in the world (with a Statista ranking score of 1266.89).

Oracle Database comes in five editions:

- **Enterprise** - includes all of the DBMS features as well as the Oracle Real Application Clusters option for high availability.
- **Personal** - includes all features, minus the Oracle Real Application Clusters option.
- **Standard** - includes base functionality.
- **Express** - lightweight and free limited version for both Windows and Linux.
- **Oracle Lite** - for mobile device use cases.

The primary reason why Oracle Database holds the top market share spot is that it is one of the most scalable of the relational databases. It achieves this by splitting its architecture between the logical and physical. By doing this, the data location becomes irrelevant and transparent, which allows for a more modular structure that can be modified without affecting the database itself. By building Oracle Database this way, it's possible to share resources to achieve a much more flexible data network.

Some of the stand-out features of Oracle Database include:

- [Real Application Clustering](https://www.oracle.com/database/real-application-clusters/) (RAC) and portability that makes it possible to scale without losing performance and data consistency.
- Efficient memory caching.
- Highly performant partitioning, which makes it possible to break larger tables into numerous pieces.
- Hot, cold, and incremental backups by way of the [Recovery Manager](https://www.oracle.com/database/technologies/high-availability/rman.html) tool.
- Tools for controlling data access and usage.

The advantages of Oracle Database include:

- Uses the SQL query language.
- High performance.
- Portable (can run on nearly 20 networking protocols and numerous hardware platforms).
- Instance Caging makes it possible to run multiple database management from a single server.
- Numerous editions to best fit your business and/or use case.
- Clustering for scalability, load balancing, redundancy, and performance.
- Failure recovery via the RMAN (Recovery Manager) tool.
- PL/SQL support.

The disadvantages of Oracle Database include:

- **Proprietary** - Oracle isn't open-source.
- **Complexity** - It's one of the more complex relational databases on the market.
- **Cost** - Oracle Database can be up to 10 times more costly than MS SQL.

Find out how to [use Oracle Database Express Edition with Linode](/docs/guides/databases/oracle/).

#### MySQL

MySQL is one of the most popular open-source relational databases on the market. According to [DB-Engines](https://db-engines.com/en/), MySQL is ranked #2, behind Oracle Database, in their most-used databases on the market.

Released in May, 1995, MySQL is mature and reliable. It is one of the most relied-upon options available. Written in C and C++, MySQL runs on Linux, Solaris, macOS, Windows, and FreeBSD, and is licensed under the GPLv2.

MySQL is a relational database and does not scale to the extent of a non-relational database, but it does support multi-threading, which makes it possible to scale it such that it can handle up to 50 million-plus rows with a default file size limit of 4GB, with a theoretical limit of 8 TB.

Some of the standout features of MySQL include:

**Security** - Uses a solid data security layer to protect sensitive data and all passwords are encrypted.
**Roll-Back** - Allows transactions to be rolled back.
**Memory Efficient** - Has very low memory leakage.
**Productive** - Uses Triggers, Stored Procedures, and Views for higher productivity.
**Partitioning** - Supports partitioning to improve the performance of very large databases.
**GUIs** - MySQL Workbench GUI manages the database.

The Advantages of using MySQL include:

- **Free** - this is a free, open-source database that can be installed on as many server instances as you need.
- **Familiarity** - MySQL uses the SQL query language, so db admins familiar with the language are up to speed in no time with this DBMS. MySQL also follows the typical client/structure architecture.
- **Speed** - Is one of the fastest relational databases, thanks to a unique storage engine.
- **Integration** - MySQL enjoys integration into thousands of third-party applications, such as blogging systems, CRMs, HRMs, ERPs, and many other types of applications.

Learn [how to install a MySQL instance on a Linode server](/docs/guides/installing-and-configuring-mysql-on-ubuntu-2004/).

#### Microsoft SQL Server

Microsoft SQL Server is the DBMS developed by Microsoft. This database is a proprietary solution, but it can be installed on both Linux and Windows. MS SQL Server was first released on April 24, 1989, and is now offered as five different editions:

- **Standard** - Core functionality required for most applications.
- **Web** - Low-cost option that differs from the standard edition in terms of maximum memory allowed for the buffer pool and maximum compute capacity.
- **Enterprise** - Supports a wide array of data warehouse features and includes advanced features such as data compression, enhanced security, and support for larger data size.
- **Developer** - Designed for developers and includes the ability to create stored procedures, functions, and views.
- **Express** - Limited to individuals or small organizations and doesn't include any of the advanced functionality.

MS SQL Server works with the SQL query language and uses the SQL Server Operating System (SQLOS), which manages memory and I/O resources, jobs, and data processing.

The advantages of Microsoft SQL Server include:

- **Native support for Visual Studio** - Support for data programming is built into Visual Studio, so DB admins can create, view, and edit database schemas.
- **Full-text search service** - Allows for searches of word-based queries.
- **Multiple version support** - Allows installation of multiple versions of MS SQL Server on one machine.
- **Easy installation** - Can be installed with a single click.
- **Data Restoration and Recovery** - Built-in tools for data recovery.
- **Support** - MS SQL Server has a massive community of users with plenty of help and support available from various sources.

The disadvantages of MS SQL are few but should be considered by anyone thinking about adopting this database platform. Those disadvantages include:

- Costly and confusing pricing.
- Poor user interface.
- Only grants partial control over databases.

#### PostgreSQL

[PostgreSQL](https://www.postgresql.org/) (also called Postgres) is another free and open-source database management system that originally served as the successor to the Ingres database. PostgreSQL calls itself, "The world's most advanced open-source relational database," and currently holds a [14.70% market share for relational databases](https://www.slintel.com/tech/relational-databases/postgresql-market-share).

Released in 1996, PostgreSQL enjoys a very active development cycle and a large support community. What sets PostgreSQL apart from other open-source relational databases is that it's an object-relational database management system, which means it's similar to a relational database, but it uses an object-oriented database model.

PostgreSQL is catalog-driven, so it lets users define data types, index types, and functional languages, making it more extensible than other relational databases.

Some of the stand-out features of PostgreSQL include:

- ACID compliance.
- Highly concurrent.
- Includes NoSQL support
- Schema and query language support for objects, classes, inheritance, and function overloading.
- Common Table Expression (the temporary results of a query which is used within the context of a larger query).
- Declarative partitioning (which reduces that amount of work required to partition data).
- Full-text search.
- Geographic Information System/Spatial Reference System support (for capturing, storing, checking, and displaying data related to positions on Earth's surface).
- JSON support.
- Logical replication (which is a method of replicating data objects based on a primary key).

The advantages of PostgreSQL are:

- Ideal for complex, high-volume data operations.
- Highly customizable by way of plugins and the use of custom functions written in C, C++, and Java.
- Multi-version concurrency control (an advanced technique for improving database performance in a multi-user environment).
- Reading locks aren't necessary, so it offers greater scalability than other relational databases.
- Cross-platform (available for BSD, Linux, macOS, Solaris, and Windows).

As far as disadvantages, PostgreSQL suffers a few, such as:

- More complicated than MySQL.
- Slower than MySQL.
- No easy way to migrate data from other RDBMSes.
- Poor data compression.
- Complicated horizontal scaling.
- Poor clustering support.
- No built-in support for machine learning.

Check out our guide on [how to install PostgreSQL on an Ubuntu 20.04 server](/docs/guides/how-to-install-use-postgresql-ubuntu-20-04/) for more information.

### Non-Relational Databases

The following sections cover the most popular non-relational databases on the market today.

#### Redis

Redis is an in-memory data structure store that is used as a distributed, key-value NoSQL database. Redis stands for *Remote Dictionary Server* and uses an advanced key-value store that includes optional durability. Redis is often referred to as a data structure server because keys can contain strings, hashes, lists, sets, and sorted sets.

Redis is a volatile, in-memory database, which makes it a good option for systems with a large amount of hot data. Redis stores data in cache, which makes read/writes faster and data always highly available.

The features that make Redis outstanding include:

- Minimum complexity compared to other NoSQL databases.
- Lightweight and requires no external dependencies.
- Works in all POSIX environments.
- Support for synchronous, non-blocking, master/slave replication for high availability.
- Mapped key-value-based caching system, which is comparable to memcached.
- No strict rules for defining schemas or tables.
- Support for multiple data models or types.
- Sharding support.
- Can be used in conjunction with other databases to reduce load and increase performance.

The advantages of using Redis include:

- Allows storing key-value pairs as large as 512 MB.
- Uses its own hashing mechanism.
- Thanks to data replication, Redis cache withstands failures and still provides uninterrupted service.
- All the popular programming languages support it.
- Supports the insertion of huge amounts of data into its cache.
- Because of its small footprint, it can be installed on Raspberry Pi and ARM hardware.

The disadvantages of using Redis include the following:

- All of your data must fit in memory and you cannot manage more data than you have memory.
- There is no query language or support for relational algebra.
- Only offers two options for persistency (snapshots and append-only files).
- Basic security features.
- Only runs on one CPU core in single-threaded mode, so scalability requires several instances of Redis.

Check out our guide on [how to install and configure Redis on an Ubuntu 20.04 server](/docs/guides/install-redis-ubuntu/) for more information.

#### MongoDB

MongoDB is an open-source, document-oriented NoSQL database, focused on high volume data storage. MongoDB is considered schema-less, so it does not enforce a particular structure on documents contained in a collection. Originally released in 2009, this NoSQL database uses JSON-like documents with optional schemas and can be installed on-premise or fully managed in the cloud. MongoDB is considered a very good candidate for big data, and can be used by organizations of all sizes.

The features that make MongoDB stand out include:

- Supports field, range query, and regex searches.
- Achieves high availability with replica sets.
- Supports sharding.
- Can be used as a file system (called GridFS).
- Supports pipeline, map-reduce function, and single-purpose aggregation methods.
- JavaScript supported within queries.
- Supports fixed-sized collections, called capped collections.
- Indexes can be created to improve search performance.
- Allows operations to be performed on grouped data for either a single result or computed result.

The advantages of the MongoDB database include:

- Supports an expressive query language.
- Not necessary to spend time designing a database schema because it's schemaless.
- Flexible and performant.
- Supports geospatial efficiency.
- Supports multiple document ACID transitions.
- Does not require SQL injection.
- Can be quickly integrated with Hadoop.
- Open-source and free to use.

The disadvantages of the MongoDB database include:

- Requires a large amount of memory, especially when scaling.
- 16 MB data document storage limit.
- 100 level limit of data nesting.
- Doesn't support transactions.
- Joining documents is complicated.
- Can be slow if indexes aren't used correctly.
- Because relationships aren't defined well, they can lead to duplicated data.

Check out our guide on [MongoDB use cases](/docs/guides/mongodb-and-its-use-cases/) for more information.

#### Apache Cassandra

Apache Cassandra is an open-source, distributed, NoSQL database management system. It is designed to handle very large amounts of data across commodity servers. Cassandra was originally developed within Facebook to power the platform's index search feature. In July 2008, Facebook open-sourced Cassandra via Google Code, and in March 2009 it officially became an Apache Incubator project.

The features that make Cassandra stand out include:

- Distributed nodes all have the same role, so there's no single point of failure.
- Supports both replication and multi-data center replication.
- Read/write throughput increases linearly as machines are added to achieve high scalability.
- Data replicates automatically to multiple distributed nodes.
- Availability and partition tolerance is more important than consistency, thereby classifying it as an AP System (within the CAP theorem).
- Supports Hadoop integration with MapReduce support.
- Includes its own query language, Cassandra Query Language.

Apache Cassandra’s advantages include:

- Elastic scalability makes it possible to scale Cassandra up and down as needed without downtime.
- Follows a peer-to-peer architecture, so failure is rare compared to master-slave configurations.
- Four key methods of data analytics, including Solr-based integration, batch analysis (with Hadoop integration), external analysis (with the help of Hadoop and Cloudera/Hortonworks).
- Near real-time analytics.
- Multi-data center and hybrid cloud support.
- Data can be stored as either structured, semi-structured, or unstructured data.

The disadvantages of Apache Cassandra include:

- Limited ACID support.
- Latency can be an issue because of the large amount of I/O.
- Data is modeled around queries, instead of structure, which can result in duplicate information stored numerous times.
- No join or subquery support.
- Although writes are fast, reads can be slow.
- Limited official documentation.

Checkout our guides on [Apache Cassandra](/docs/guides/databases/cassandra/) to learn more.

#### CouchDB

CouchDB is our final open-source, document-oriented NoSQL database. This particular tool stores data in JSON documents and uses JavaScript as its query language with the help of MapReduce. CouchDB embraces the web by accessing documents via HTTP. Once accessed, those documents can be queried, combined, and transformed with JavaScript. This NoSQL database is perfectly suited for both web and mobile applications, thanks to on-the-fly document transformations and real-time change notifications.

The features that make CouchDB stand out include:

- Database replication across multiple server instances.
- Fast indexing and retrieval.
- REST-like interface.
- Multiple libraries make it easy to use your language of choice.
- Browser-based GUI manages data, permissions, and configurations.
- Support for replication.
- Follows all features of ACID properties.
- Authentication and session support.
- Database-level security.
- Built-in support for Map/reduce (model for processing and generating big data sets with a parallel, distributed algorithm).

Advantages of using CouchDB include:

- Ability to store the same document in multiple database instances.
- Serialized objects can be stored as unstructured data in JSON documents.
- Redundant data storage. Can replicate and sync with browsers, via PouchDB.
- Sharding and clustering support.
- Master-to-Master replication allows for continuous backup.

The disadvantages of CouchDB include:

- Slower than some NoSQL databases.
- Requires a lot of overhead.
- Arbitrary queries are expensive.
- Temporary views on massive datasets are slow.
- No support for transactions.
- Large database replication is unreliable.

Check out our guide on [Using CouchDB 2.0 on Ubuntu 20.04](/docs/guides/use-couchdb-2-0-on-ubuntu-20-04/) for more information.

## Conclusion

No matter the project you're working on, there's a database that perfectly suits your needs. Whether you're developing a small dynamic website that depends on high levels of data consistency, where you'd use a relational database, or an app that will scale to massive proportions, where you'd use a non-relational database, you have options. With Linode, you can work with any of these databases to effectively store your data and interact with your applications. It is important, however, to know exactly what your app needs from a database before you select which one. Make the wrong choice and it could be costly to retool.