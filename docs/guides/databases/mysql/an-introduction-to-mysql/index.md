---
slug: an-overview-of-mysql
author:
  name: Jeff Novotny
description: 'Learn what MySQL is, how it’s commonly used, and how it compares to other databases.'
keywords: ['what is mysql', 'sql vs mysql','mysql overview']
tags: ['mysql', 'nosql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-07
modified: 2022-06-06
modified_by:
  name: Linode
title: "An Overview of MySQL"
h1_title: "What Is MySQL: An Overview"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: https://github.com/JeffreyNovotny/
external_resources:
- '[Official MySQL documentation](https://dev.mysql.com/doc/)'
---

## What is the MySQL Database?

MySQL is an [relational database management system (RDBMS)](/docs/guides/relational-database-overview/) that implements SQL. It was originally designed for use with small-to-medium-sized databases, but it can now handle even very large amounts of stored data. MySQL is written in C/C++ and is mostly compliant with the SQL standard. However, it adds many extensions and emphasizes speed and reliability over perfect compliance. A more detailed discussion about MySQL and SQL compliance can be found in the [MySQL documentation on Compliance Standards](https://dev.mysql.com/doc/refman/8.0/en/compatibility.html).

The basic version of MySQL is distributed by the Oracle Corporation and is available for free under an open-source license. The current release of MySQL is 8.0. MySQL can be used on any Linux distribution and on most other platforms. It is an important component of the open-source [*LAMP stack*](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-20-04/), along with Linux, Apache, and the PHP programming language. The LAMP stack is the cornerstone of open-source web application development on Linux. MySQL can be used as part of a client/server system or as part of an embedded system.

Like all RDBMS applications, MySQL is a relational database. Administrators and users define relationships within and between the tables in the database. Different columns can be marked as either required or optional and can serve as a primary key or as a pointer to another table. MySQL is stable, reliable, and easy to use. Here are some specific advantages of MySQL:

- MySQL is a mature, popular, and well-established product. It has more community support than other open-source databases, and better reference material and documentation.
- MySQL can be configured to be *ACID-compliant* when used with the InnoDB storage system. The acronym ACID stands for Atomicity, Consistency, Isolation, and Durability. This means it can guarantee data validity in spite of any errors, failures, or outages.
- It is known for its high performance, due to features such as optimized class libraries, compression, memory allocation, and hash tables. It supports multi-threaded kernel threads for more efficient operation on systems with multiple CPUs.
- It supports very large databases, storing up to hundreds of millions of records and up to 64 indexes per table.
- MySQL provides enhanced security mechanisms, including encryption of all passwords.
- It allows for data replication and redundancy for enhanced reliability.
- MySQL provides support for aliases on tables and columns, and full support for many different character sets.
- MySQL works well with PHP, which is widely used in web development.
- It works with many different compilers and on many different platforms, and is designed to be portable between systems. Client programs can be written in many languages. MySQL provides APIs for C/C++, PHP, Java, Python, Ruby, and Perl.
- MySQL is available as a library that can be embedded into stand-alone applications.
- MySQL is packaged with several convenient client utilities, including `mysqldump` and `mysqladmin`. Users can verify, optimize, and repair tables using the `mysqlcheck` program.
- The MySQL open source license allows developers to customize MySQL and modify the source code to meet their requirements.

MySQL is also available in a more fully-featured Enterprise Edition, with full customer support. For information on installing MySQL on Ubuntu or other Linux platforms, consult the Linode guide on [Installing and Configuring MySQL on Ubuntu 20.04](/docs/guides/installing-and-configuring-mysql-on-ubuntu-2004/).

## What are the MySQL Client and Server?

The MySQL client and MySQL server are two different components that work together in a networked architecture. There is usually one central server and one or more clients. The MySQL database server application is installed on a host, often as part of the LAMP stack. This server stores the database configuration and data, and responds to queries from clients. It also enforces security and any access control system and replicates and archives data as required. The same server can host multiple databases for different clients.

The MySQL client enables users to connect with a MySQL server, either on the same system or on a different host. The client sends SQL queries to the server to read from, or write to a database. The MySQL client also administers, maintains, and secures the client. A stand-alone client is recommended for users who only want to connect to a remote database to run queries. Administrators who want to host a database on the server must install the full MySQL server package. The server installation includes a client to create and administer the database.

The standard MySQL command line client utility is named `mysql`. It can be installed without the server component using the command `yum install mysql` or `apt-get install mysql-client`. To access the MySQL client, use the command `mysql <database_name>`. The username, password, and server IP address can be specified using additional parameters.

When the user successfully logs in, the client displays the MySQL prompt `mysql>`. The user can then run SQL commands. For more information about installing and using MySQL, consult the Linode guide on [How to Connect to a MySQL or MariaDB Database](/docs/guides/mysql-command-line-client/).

## What is MySQL Used For?

MySQL is a versatile RDBMS for use with a data set of any size. It can be considered any time an application must store and retrieve data. MySQL was originally developed for small to medium-size single-server configurations. But with recent performance and scalability improvements, it can be used virtually anywhere in an application of any size. Even large companies including Uber, Airbnb, and Shopify use MySQL.

Users must install MySQL to configure WordPress. WordPress uses MySQL to store all its data and configuration files, and dynamically interacts with MySQL to display and create web pages. Users do not necessarily have to understand SQL to use WordPress. However, it can come in handy when performing advanced customizations. On Linux, WordPress is often installed as a package along with MySQL and the rest of the LAMP stack. For more information on how to configure MySQL and WordPress, see the Linode guide on [Installing WordPress on Ubuntu 20.04](/docs/guides/how-to-install-wordpress-ubuntu-2004/).

Other common applications for MySQL include data warehousing, transaction processing, reservation systems, e-commerce, and web databases. For example, a MySQL database can maintain the product list and inventory for an online store.

## Conclusion

This guide answers the commonly-asked question, "What is a MySQL database?" MySQL is a relational database that organizes data based on the relationships between tables and fields. It is a type of Relational DataBase Management System (RDBMS), which stores entries as rows within tables. Each row consists of a number of columns, which represent the different attributes of the data record. The database-specific SQL programming language is used to store and retrieve data from MySQL. SQL uses a series of discrete statements and is intended to work with RDBMS systems.

MySQL is known for its ability to store large tables and vast amounts of data, as well as for its speed and reliability. It provides APIs for many common programming languages and is packaged with several useful utilities. The MySQL server stores data and response to requests from MySQL clients. The client is always packaged with the server, but it can be used as a stand-alone application to communicate with remote databases. MySQL is used in many widely-known companies and is essential for those who want to use WordPress. However, it is also used in web databases and data warehousing. For more information on MySQL, see the [MySQL documentation](https://dev.mysql.com/doc/). If you are writing your first MySQL-based application, review our guide [SQL Injection Attack: What It Is and How to Prevent It](/docs/guides/sql-injection-attack/) to learn more about this security vulnerability.
