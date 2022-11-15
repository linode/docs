---
slug: an-introduction-to-postgresql
author:
  name: Jeff Novotny
description: 'This guide introduces the PostgreSQL database, outlining how it is different from other SQL databases like MySQL, and describes its benefits along with possible use cases.'
keywords: ['postgresql vs mysql','what is postgresql?','difference between mysql and postgresql','postgres use cases']
tags: ['postgresql', 'mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-07
modified_by:
  name: Linode
title: "An Introduction to PostgreSQL"
h1_title: "What is PostgreSQL?"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: https://github.com/JeffreyNovotny/
external_resources:
- '[PostgreSQL website](https://www.postgresql.org/)'
---

[*PostgreSQL*](https://www.postgresql.org/) is an *object-relational database management system* (ORDBMS) that provides a powerful alternative to a traditional *relational database management system* (RDBMS). It combines relational and non-relational models to allow for more user flexibility and can handle more complex scenarios and unstructured data. This guide answers the question "What is PostgreSQL?" and outlines the differences between [MySQL](https://www.mysql.com/) and PostgreSQL. It also explains the different PostgreSQL use cases.

## What is PostgreSQL?

PostgreSQL is a free open source database that was originally known as Postgres. It is built and maintained by the volunteer-centered PostgreSQL Global Development Group. No licensing fee is required, and users can use and modify it according to their requirements. PostgreSQL has recently become more popular and is now the fourth most widely-used database engine. It is available for almost all Linux distributions and other operating systems including Windows and macOS. The latest major release is PostgreSQL 12.

PostgreSQL supports both relational queries delivered through the *Structured Query Language* (SQL) and non-relational JSON queries. This flexibility allows it to handle a wider range of data types than strings and numbers. For instance, PostgreSQL is well-adapted to store media such as images, audio, and video. When acting in the relational model, it stores data in tables, rows, and columns, like a regular RDBMS. This allows users to easily transition from another database system to an object-relational architecture. It also supports a form of inheritance, in which tables inherit properties from a parent table, along with encapsulation abilities. Users can define their own data types and functions without modifying the codebase.

PostgreSQL emphasizes extensibility to allow future growth, along with a high level of SQL compliance. It attempts to conform with the SQL standard as much as possible, except where this contradicts expected behavior or leads to negative side effects. PostgreSQL is planning further moves towards full compliance in the future.

{{< note >}}
All current RDBMS applications occasionally deviate from the SQL standard. In many cases, database applications must trade off strict conformance for better performance and usability. For more information about PostgreSQL SQL compliance, see [Appendix D in the PostgreSQL documentation](https://www.postgresql.org/docs/current/features.html).
{{< /note >}}

Despite having many more features than its competitors, PostgreSQL can still handle a high rate of transactions. Although it does not always match the performance of the top RDBMS applications, its speed and capacity have increased in recent releases. PostgreSQL is noted for its stability, and it is highly scalable. It can store a very large amount of data in a single database.

PostgreSQL implements concurrency using *Multi-Version Concurrency Control* (MVCC), which enables full *ACID compliance*. [ACID](https://en.wikipedia.org/wiki/ACID) is an acronym standing for "atomic, consistent, isolated, and durable". This set of properties guarantees a database and its contents remain intact and valid even in the presence of errors and failures. MVCC operates by taking a snapshot after each transaction that changes the database contents. It allows for three levels of transaction isolation, which are "Committed", "Repeatable Read", and "Serializable". PostgreSQL's MVCC implementation is considered one of its strongest selling points.

PostgreSQL offers a comprehensive replication feature. The primary database can transmit changes to its replicas either synchronously or asynchronously. Replication can be specified on a per-database, user, session, or transaction basis. If synchronous replication is configured, the primary waits until at least one node has written the data and sent a confirmation. However, this option can adversely affect performance. Replicas can be configured to handle read-only queries to enable load sharing. PostgreSQL also supports point-in-time recovery (PITR) for disaster recovery, along with the use of active standbys.

Some of PostgreSQL's other features include the following:

- It has support for a full range of data types, including composite and custom types.
- It allows for the creation of materialized views, triggers, and stored procedures.
- Users can define custom functions and can integrate code written in different languages, including Python, Java, Perl, .Net, Go, and C/C++. PostgreSQL also has its own procedural language *PL/pgSQL*, which allows users to write stored procedures and subroutines.
- PostgreSQL possesses extensive security management abilities, definable down to a per-role basis. A role can either be a user or a group. Security roles are granular to the column level.
- PostgreSQL supports several types of indexes and index access methods.
- It allows for optional schemas. These schemas function like namespaces and permit objects with the same name to co-exist.
- PostgreSQL supports international character sets, and case-insensitive, accent-insensitive, and full-text searches.
- It is bundled with the `psql` command-line program, which allows users to enter queries directly.

Because development and maintenance are community-driven, PostgreSQL has an active community that contributes bug fixes and helps users with their issues. Although it does not have a full GUI, the free open source `pgAdmin` tool permits remote GUI administration.

For more information on installing and using PostgreSQL, consult the Linode guide on [How to Install and Use PostgreSQL on Ubuntu 20.04](/docs/guides/how-to-install-use-postgresql-ubuntu-20-04/).

## Object-Relational Database (ORDBMS) vs. Relational Database (RDBMS)

### What is a Relational Database?

It is probably easiest to explain what an RDBMS is and then describe how an ORDBMS differs from it. MySQL and other RDBMS applications follow traditional database principles based on the relationships between tables and data.

- Data is stored in tables that consist of a series of columns.
- These columns represent the different attributes of the item being stored in the table.
- Each row in a table represents a distinct entry in the database and can be located using its own unique primary key.
- Tables are related to each other using foreign or compound keys.
- The industry-standard SQL programming language is used to read and write data.

An RDBMS is fast, reliable, and there are many resources available to learn how to use one. It is easy to understand how the tables are structured and how they are related. Tables can be extended flexibly after creation. Both database objects and the data itself can be easily created, modified, and deleted. Some of the more famous RDBMS programs include Microsoft SQL Server, MySQL, SQLite, and MariaDB.

RDBMS applications are designed to store traditional field-based data. This data is typically either numeric or string-based. They are not meant for massive and unwieldy data objects like images, audio, and video.

Another limitation of RDBMS applications is their close coupling with SQL. It can integrate with other languages, but not efficiently and seamlessly. Similarly, the relationships between tables and entries in an RDBMS are strictly defined by the keys and values. It is almost impossible for a relational database to break free of this model and use a less-structured format. The strict principles of a relational database considered one of its strengths, make it more difficult to use in other contexts.

### What is an Object-Relational Database?

An ORDBMS extends the relational database model through the use of a separate object-oriented mode. It can do everything a relational, SQL-based database can do, but it also adds non-relational features. Therefore, an object-relational database can support a broader range of applications. Organizations can continue using their existing models and schemas without major changes while they add non-relational features. PostgreSQL is the best-known example of an ORDBMS.

Object-relational databases are more flexible and support complex user-defined structures. They store data in tables of objects, rather than tables of rows. ORDBMS databases use catalogs that include information about the tables, columns, data types, functions, and access methods. This means users can more easily modify and extend the behavior of an ORDBMS. In comparison, traditional RDBMS systems can only be changed if new vendor modules are added or the source code is rewritten.

An ORDBMS is designed to work with object-oriented languages and makes use of several object-oriented concepts. Users can incorporate table inheritance, encapsulation, and function overloading into their database design. They can create user-defined objects and more complex data types.

ORDBMS applications possess capabilities most other SQL databases lack. They specialize in new types of data, including photographs, audio files, and video. An ORDBMS is also useful for dealing with complex objects and data which does not conform to a relational interface. They are particularly good at handling a high number of temporary transactions. ORDBMS applications understand a larger number of query languages and can be integrated into a large, complex system with many components.

As a downside, a new user can face challenges when initially designing, implementing, and optimizing an ORDBMS. The mix between models can be awkward and difficult to integrate. Non-relational databases are complex and are sometimes difficult to use and learn. With so many user-defined procedures, inconsistencies, redundancies, and inefficiencies can be accidentally introduced into the design.

To summarize, an RDBMS is advantageous for systems with a large number of simple SQL reads and that use strings and numbers. It is also the best choice when ease of use and a quick implementation or prototype is a priority. An ORDBMS such as PostgreSQL has an advantage in complex environments requiring complicated queries and large data objects. It also works well in an object-oriented design and with a larger range of programming languages.

## PostgreSQL vs. MySQL

Historically, PostgreSQL and MySQL had quite different feature matrices. Over the years, the two applications have converged, but some differences remain. Much of this is due to PostgreSQL adding features, but MySQL is also expanding. For example, it recently added MVCC support. Even as PostgreSQL and MySQL move towards feature parity, the two programs still have different philosophies and take different approaches.

MySQL is a very popular open-source RDBMS application. It is available for free under an open-source license and is part of the [*LAMP Stack*](/docs/guides/how-to-install-a-lamp-stack-on-centos-7/), along with Linux, Apache, and PHP. It was originally designed for small-to-medium-sized applications, but can now handle very large amounts of data. MySQL is packaged with many extensions and utilities. It emphasizes stability, speed, reliability, and ease of use over perfect compliance.

Like all RDBMS applications, MySQL uses a relational approach. It lacks any non-relational or object-oriented features. This means it contains tables consisting of rows and columns. It allows administrators to define relationships within and between the tables and columns in the database. MySQL uses the SQL programming language to store and retrieve data.

PostgreSQL is an ORDBMS, and can serve as a bridge between object-oriented and relational programming. It can function like a relational database and continues to allow users to send SQL commands to query and update the database. However, it also provides an object-relational layer. PostgreSQL allows users to define objects, and use encapsulation and inheritance. It also permits users to define their own data types and has added a few NoSQL features, including built-in JSON support. This extends its capabilities and makes it better for processing complex queries and storing non-traditional data.

Both PostgreSQL and MySQL handle core database tasks quickly and reliably. The majority of organizations could be successful using either one. But they have different strengths. Here are some of the other main differences between MySQL and PostgreSQL:

- **Relative Performance:** MySQL deals more quickly with read-only queries, while PostgreSQL does better with high rates of reads and complex writes. However, it is easier to optimize a MySQL server for better performance.
- **Storage Engines:** MySQL supports a large number of storage engines, while PostgreSQL enforces the use of its preferred data store. PostgreSQL is always ACID-compliant, but MySQL is only ACID-compliant when used with the default InnoDB storage facility. The other MySQL alternatives might not fully support ACID compliance or MVCC. However, even when InnoDB is used, MySQL database corruption can occasionally happen.
- **Complexity:** MySQL is simpler and easier to use, and is considered very lightweight and secure. It focuses on speed and reliability and does not have as many advanced features. It is relatively straightforward to configure and manage, and most users can start working with it immediately. PostgreSQL has many more options and is considered more challenging to administer and configure. It sometimes has to be combined with other databases. This increases complexity and system integration requirements.
- **Memory Requirements:** PostgreSQL is much more memory intensive. MySQL is a single-process application and maintains a single thread per connection.
- **Use Cases:** MySQL is better suited for websites and online transaction processing, along with straightforward data warehousing. It is preferred in situations where there is a high rate of simple queries and performance is important. PostgreSQL shines in more complicated scenarios where more analysis is required. It is also better suited to store massive data objects, such as video files, that are not easy to index using traditional methods. It is easier to integrate PostgreSQL with code written in other languages.
- **Documentation, Tools, and Support:** MySQL is a more mature product, and it has many more resources available, along with a large, well-established user base. The related database tools are also mature. PostgreSQL has an enthusiastic and helpful community, but it is smaller, and there is not as much information available about it.
- **Organizational Structure:** MySQL and PostgreSQL differ in how they are developed. MySQL is privately owned by the Oracle Corporation, although it is still available in a free, open-source version. PostgreSQL is mainly volunteer-driven. MySQL offers a commercial enterprise release with paid support. PostgreSQL lacks official support or any type of enterprise release. However, some third-party plans are available.
- **Popularity:** MySQL is part of the standard Linux LAMP stack and is widely available throughout the open-source ecosystem. Many content management systems, including WordPress and Drupal, enforce the use of MySQL. Several third-party tools and GUIs are available for MySQL. Conversely, not all open source applications support PostgreSQL. It is not as well known or as widely used. Organizations might find it difficult to find qualified and trained PostgreSQL experts.
- **Various Technical Details:** There are countless implementation differences between MySQL and PostgreSQL, even regarding how SQL statements are handled. For example, PostgreSQL is case sensitive, while MySQL is not. MySQL provides some clauses, including `IF` and `IFNULL`, that PostgreSQL lacks. But only PostgreSQL supports `INSTEAD OF`. Consult the [Official PostgreSQL documentation](https://www.postgresql.org/docs/) and [MySQL documentation](https://dev.mysql.com/doc/) for more information.

## Some Benefits of Using PostgreSQL

Due to its combination of object-relational functionality and advanced features, PostgreSQL is an excellent choice for certain situations. Here are some of its most significant benefits.

- It is a free, open-source program featuring good community support and effective documentation. It is rapidly growing in popularity and is increasingly well-accepted in large organizations.
- Most significantly, it implements object-oriented design principles including encapsulation and inheritance. It also permits users to define their own types and objects. This makes it a good choice to integrate with object-oriented languages including C++. It is an excellent choice for storing large and unstructured data such as audio, video, and photographs.
- It is far more flexible than a traditional RDBMS because it allows the user to modify the database behavior. It also permits users to integrate code written in a variety of other languages or its own `PL/pgSQL` language.
- PostgreSQL provides strong built-in support for JSON data and operations.
- It can function exclusively in relational mode, where it works much like MySQL or another RDBMS. It is competitive in terms of speed and performance and is particularly good for extra-large databases or complex queries.
- Due to the fact it supports both models, it allows organizations to seamlessly upgrade from a relational to a non-relational design.
- It has more advanced features than most RDBMS applications, including more robust views. It also supports materialized views, which are good for complex queries, and optional schemas.
- PostgreSQL features a robust ACID-compliance model using MVCC. This makes it a good choice when strong data integrity is critical. PostgreSQL is considered to have one of the best implementations of this feature.
- It is very strong in the area of replication and recovery and permits the use of active standbys. It is flexible in allowing asynchronous or synchronous replication.
- PostgreSQL is considered fairly secure, with a granular system of roles and permissions.
- Many users appreciate the philosophy behind PostgreSQL. It is not developed by a corporation, but instead relies on committed volunteers and developers. In this respect, it is more true to the open-source spirit than its competitors.

## What is PostgreSQL Used For?

PostgreSQL is a fast and reliable system, and can be used anyplace a traditional RDBMS application might be used. However, it is more common to encounter it in certain environments. Here are some of the major PostgreSQL use cases.

- It is often used when structured and unstructured data, including audio, video, and emails, must be stored together.
- PostgreSQL incorporates the PostGIS extension, so it works well together with geospatial databases. It is used for location-based services and with geographic information systems (GIS).
- It is used in conjunction with mathematical and statistical applications like Matlab and R.
- PostgreSQL forms part of the LAPP stack, standing for Linux, Apache, PostgreSQL, and PHP/Python, which is competitive with the original LAMP stack.
- Because it is easily combined with other data stores, it works well as a federated hub for different database systems.
- PostgreSQL is often used in demanding roles such as online transaction processing (OLTP), data warehousing, and scaled web applications.
- More specifically, it is used, at least in part, by Reddit, the Skype business unit, NOAA/NWS, and TripAdvisor.

## A Summary of PostgreSQL

PostgreSQL is an ORDBMS combining the features of a standard relational database with an object-relational model. It permits users to define their own data types and functions, and incorporates object-oriented techniques such as inheritance and encapsulation. PostgreSQL can accept SQL commands and store data in tables of rows. However, it can also store tables of objects. This makes it a good choice for photographs, audio, and video.

PostgreSQL contains many advanced features, including reliable ACID compliance and a flexible data replication model. Any decision on whether to deploy PostgreSQL versus MySQL depends on the nature of the data and the queries. There are many differences between MySQL and PostgreSQL in terms of their frameworks, the feature set, and the philosophy behind each application. However, MySQL is best for large amounts of straightforward reads and writes of simple data. PostgreSQL tends to be used in more complicated scenarios with non-traditional data. It also integrates well with geo-spatial and statistical packages, different programming languages, and other databases. For more information about PostgreSQL, see the [PostgreSQL documentation](https://www.postgresql.org/docs/) and the Linode guide on [How to Install and Use PostgreSQL on Ubuntu 20.04](/docs/guides/how-to-install-use-postgresql-ubuntu-20-04/).