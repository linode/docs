---
slug: an-overview-of-mysql
author:
  name: Jeff Novotny
description: 'Learn what MySQL is, how it’s commonly used, and how it compares to other databases.'
keywords: ['what is mysql', 'sql vs mysql','mysql overview']
tags: ['mysql', 'nosql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-07
modified_by:
  name: Linode
title: "An Overview of MySQL"
h1_title: "What Is Mysql: An Overview"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: https://github.com/JeffreyNovotny/
external_resources:
- '[Official MySQL documentation](https://dev.mysql.com/doc/)'
---

Many programs need to save or store data for later use and read data the data that is recorded. Although there are many ways to do this, the most common approach is to use a *Relational DataBase Management System* (RDBMS). [MySQL](https://www.mysql.com/) is an industry-standard open-source RDBMS that has been widely adopted by software development projects. This guide provides an overview of MySQL and explains the main RDBMS concepts.

## What is a Relational Database (RDBMS)?

A database is an application for storing and retrieving data. Although the mechanisms differ, most databases provide an API allowing users to add, delete, access, search, and manage their data. As an alternative to using a database, data can be stored in text files or hash tables. However, this technique is not as fast or as convenient as using a database and is rarely used in modern systems.

Early database applications evolved into the modern *relational database*, which allows users to store massive amounts of data. An RDBMS no longer forces users to store data in one big table. It provides more structured ways of partitioning the data and is designed for more efficient access. RDBMS applications are optimized for fast reads and writes and bulk transfer of information.

Database designers conceptualize and organize the data in terms of *tables*, *columns*, and *rows*. A row is also referred to as a *record*, or tuple. Contemporary relational databases structure the data using the following concepts:

- Each database contains one or more tables.
- When the user creates a table, they specify the columns within the table at the same time.
- Each column represents a specific attribute, or field, within the record. A column is designed to hold data of a particular data type, for example, `VARCHAR`, which stands for a variable-length string.
- A table contains a cluster of rows.
- Each row within a table represents a unique database entry. Each column within the row contains an individual field in that entry.
- A database table is like a two-by-two matrix. Each square inside the matrix contains a piece of data.

An RDBMS is considered to be relational because it allows users to define relationships within and between the various tables using keys and indices. A relational database permits a user to provide or generate a *primary key* for each row. SQL can guarantee that this key is unique within the table. The fields in these tables might be related to one another based on their primary and foreign keys. These relationships help structure and organize the database and limit the amount of data duplication.

An RDBMS application always provides the capabilities listed below. Individual applications might offer more options.

- It allows for the creation, definition, modification, and removal of database tables, columns, rows, primary keys, and indices.
- It accepts SQL queries and stores or retrieves the relevant data, combining information from different database tables as necessary.
- It guarantees the integrity of the data and the references between the tables. For example, a foreign key always points to a valid row in another table.
- It automatically updates indices, timestamps, and other internally-generated attributes as required.

Relational databases use the *Structured Query Language* (SQL) to query and update the database. For example, an RDBMS client uses the SQL `INSERT` command to add a new row to one of the database tables. When a user adds a new row, they simultaneously specify a value for each column. Additional SQL commands are used to modify and delete rows, manage database items, and retrieve a list of records meeting specific criteria.

For example, consider a database for a school. This database has several tables, for teachers, students, courses, classrooms, and so forth. The definition of the `Students` table might contain columns for the student's first and last name, ID, grade, family, and more. Each row in this table symbolizes an individual student and serves to represent and collect all relevant information about that student. If the student's name is "John", the `first_name` column in this row contains `John`. The student ID can serve as the index and primary key and could be used to cross-reference the student in other tables.

For instance, a simplified `Students` table can be defined using the structure displayed below. The top row represents the names of the columns in the table. The table below currently has two rows of data, one for each student.

| first_name | last_name | grade | family_id | student_id |
|:-:|:-:|:-:|:-:|:-:|
| John | Doe | 4 | 1116 | 5005 |
| Jane | Student | 5 | 1224 | 5350 |

### What are Some Common RDBMS Terms?

The following terms are frequently used in relation to databases:

- **Column:** A set of values of the same data type, representing one attribute within a table. Columns are defined when a table is created.
- **Compound Key:** A key consisting of multiple columns. A compound key is used when a single column cannot reliably identify a row.
- **Database:** An organized group of data that is stored electronically. A database is usually organized into smaller clusters of information.
- **Foreign Key:** An index used to cross-link a table entry to a row in another table.
- **Index:** A method of more quickly accessing database entries. An index can be created using any combination of attributes, but implementation is application-specific. A database index is similar to an index in a book.
- **Primary Key:** A column serving as an index to uniquely identify a row inside a table. A primary key can either be auto-generated or defined in the table definition. A primary key can be used to locate a specific row within a table.
- **Referential Integrity:** An internal database property to ensure a foreign key always references a valid row in another table.
- **Relational DataBase Management System (RDBMS):** A type of database system based on relationships between tables and entries.
- **Row:** A structured entry within a table consisting of a set of related data. Each row in a table has the same structure, which corresponds to the column specifications in the table definition. A row is also referred to as a record or a tuple.
- **Structured Query Language (SQL):** A simplified domain-specific programming language used to manage data in an RDBMS.
- **Table:** A collection of database records, consisting of a series of rows and columns. A table can be thought of as a two-dimension matrix of information.

## SQL vs. MySQL

The terms *SQL* and *MySQL* are often mixed up or used interchangeably, but they are not the same. SQL is the standard programming language for querying RDBMS applications. It is used to write database queries and can be used with any database system that supports it. MySQL is a specific instance of an RDBMS that uses SQL. Database users send SQL commands to an RDBMS such as MySQL to read and write data, and to administer the database. There is no application named SQL, so it does not make sense to make a "SQL vs MySQL" comparison. However, the term *SQL database* is often used informally as a shorthand term for any relational database.

### The SQL Language

The SQL language is specified as a series of statements. It is not considered a general-purpose imperative programming language like Python, because it lacks a full range of data structures and control statements. It is instead a domain-specific language intended for a single purpose. SQL is designed for the querying, definition, and manipulation of data. It's also designed to provide data access control. One advantage of SQL is that it can access multiple records using only one command. It does not specify how the database should access an entry.

The SQL language consists of designated keywords, expressions, queries, statements, operators, and optional clauses. Object identifiers are used to refer to database entities, including tables and columns. SQL supports a large number of predefined data types, such as `CHAR`, for the character, and `INTEGER`. Some of the most important SQL operators include `=`, `<>`, `>`, `<`, `IN`, `LIKE`, `TRUE`, `FALSE`, and `NOT`. Recent releases of SQL now support a simple `CASE` statement. The MySQL documentation contains more information about the SQL [language structure](https://dev.mysql.com/doc/refman/8.0/en/language-structure.html), [data types](https://dev.mysql.com/doc/refman/8.0/en/data-types.html), and [statements](https://dev.mysql.com/doc/refman/8.0/en/sql-statements.html).

Some of the most widely-used SQL statements and clauses include the following:

- **ALTER:** Modifies the structure of a database object.
- **CREATE:** Creates a database object, such as a table or database.
- **DELETE:** Removes one or more existing rows from the database.
- **DROP:** Permanently deletes an object from the database.
- **FROM:** Indicates which table to use for the query.
- **GRANT:** Authorizes a database user to perform a particular action.
- **GROUP BY:** A clause to organize output from a `SELECT` statement.
- **INSERT:** Adds rows to the database.
- **JOIN:** A clause specifying how to combine and assemble data from multiple tables.
- **MERGE:** Combines data from multiple tables.
- **ORDER BY:** A clause for sorting the output from a query.
- **SELECT:** Retrieves data from one or more tables. This command does not alter the database or change any data.
- **UPDATE:** Modifies one or more existing rows.
- **WHERE:** A clause to identify the rows a query should operate on. It is typically used with a comparison operator.

The wildcard `*` operator is often used in conjunction with the `SELECT` command. This command instructs SQL to display all columns in the output.

Below are a couple of examples of SQL queries. The following SQL command displays the `name` of each class in the `Class` database for each row where the value of the `subject` column is `math`.

    SELECT name
        FROM Class
        WHERE subject='math';

The next SQL statement creates the `Class` table. The `CREATE` statement defines each column in the table, along with its data type, in sequential order. The `VARCHAR` data type is used to hold a variable-length string. The `SMALLINT` data type is used for small integer values from the signed range of `-32768` to `32767`.

    CREATE TABLE Class (
        classID smallint,
        name varchar(255),
        subject varchar(255),
        level smallint
    );

### What is the MySQL Database?

MySQL is an RDBMS that implements SQL. It was originally designed for use with small-to-medium-sized databases, but it can now handle even very large amounts of stored data. MySQL is written in C/C++ and is mostly compliant with the SQL standard. However, it adds many extensions and emphasizes speed and reliability over perfect compliance. A more detailed discussion about MySQL and SQL compliance can be found in the [MySQL documentation on Compliance Standards](https://dev.mysql.com/doc/refman/8.0/en/compatibility.html).

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

MySQL is also available in a more fully-featured Enterprise Edition, with full customer support. For information on installing MySQL on Ubuntu or other Linux platforms, consult the Linode guide on [Installing and Configuring MySQL on Ubuntu 20.04](https://www.linode.com/docs/guides/installing-and-configuring-mysql-on-ubuntu-2004/).

### SQL vs. NoSQL

NoSQL systems are an alternative to traditional SQL-based RDBMS applications. As the name implies, they use a non-relational model to handle data. They are typically less structured and more flexible than an RDBMS. NoSQL systems are not standardized and can take a variety of formats. However, they are typically key-value, graph, or document-based, not table-based. Some NoSQL applications can use structured domain-specific languages or even accept SQL queries in parallel. A few examples of NoSQL applications include Redis and [MongoDB](/docs/guides/install-mongodb-on-centos-7/). For more information on NoSQL systems, consult the Linode guide for a [comparison between SQL and NoSQL databases](https://www.linode.com/docs/guides/what-is-nosql/#what-makes-nosql-different-from-sql).

## What are the MySQL Client and Server?

The MySQL client and MySQL server are two different components that work together in a networked architecture. There is usually one central server and one or more clients. The MySQL database server application is installed on a host, often as part of the LAMP stack. This server stores the database configuration and data, and responds to queries from clients. It also enforces security and any access control system and replicates and archives data as required. The same server can host multiple databases for different clients.

The MySQL client enables users to connect with a MySQL server, either on the same system or on a different host. The client sends SQL queries to the server to read from, or write to a database. The MySQL client also administers, maintains, and secures the client. A stand-alone client is recommended for users who only want to connect to a remote database to run queries. Administrators who want to host a database on the server must install the full MySQL server package. The server installation includes a client to create and administer the database.

The standard MySQL command line client utility is named `mysql`. It can be installed without the server component using the command `yum install mysql` or `apt-get install mysql-client`. To access the MySQL client, use the command `mysql <database_name>`. The username, password, and server IP address can be specified using additional parameters.

When the user successfully logs in, the client displays the MySQL prompt `mysql>`. The user can then run SQL commands. For more information about installing and using MySQL, consult the Linode guide on [How to Connect to a MySQL or MariaDB Database](https://www.linode.com/docs/guides/connect-to-a-mysql-or-mariadb-database/).

## What is MySQL Used For?

MySQL is a versatile RDBMS for use with a data set of any size. It can be considered any time an application must store and retrieve data. MySQL was originally developed for small to medium-size single-server configurations. But with recent performance and scalability improvements, it can be used virtually anywhere in an application of any size. Even large companies including Uber, Airbnb, and Shopify use MySQL.

Users must install MySQL to configure WordPress. WordPress uses MySQL to store all its data and configuration files, and dynamically interacts with MySQL to display and create web pages. Users do not necessarily have to understand SQL to use WordPress. However, it can come in handy when performing advanced customizations. On Linux, WordPress is often installed as a package along with MySQL and the rest of the LAMP stack. For more information on how to configure MySQL and WordPress, see the Linode guide on [Installing WordPress on Ubuntu 20.04](https://www.linode.com/docs/guides/how-to-install-wordpress-ubuntu-2004/).

Other common applications for MySQL include data warehousing, transaction processing, reservation systems, e-commerce, and web databases. For example, a MySQL database can maintain the product list and inventory for an online store.

## Conclusion

This guide answers the commonly-asked question, "What is a MySQL database?" MySQL is a relational database that organizes data based on the relationships between tables and fields. It is a type of Relational DataBase Management System (RDBMS), which stores entries as rows within tables. Each row consists of a number of columns, which represent the different attributes of the data record. The database-specific SQL programming language is used to store and retrieve data from MySQL. SQL uses a series of discrete statements and is intended to work with RDBMS systems.

MySQL is known for its ability to store large tables and vast amounts of data, as well as for its speed and reliability. It provides APIs for many common programming languages and is packaged with several useful utilities. The MySQL server stores data and response to requests from MySQL clients. The client is always packaged with the server, but it can be used as a stand-alone application to communicate with remote databases. MySQL is used in many widely-known companies and is essential for those who want to use WordPress. However, it is also used in web databases and data warehousing. For more information on MySQL, see the [MySQL documentation](https://dev.mysql.com/doc/).
