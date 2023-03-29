---
slug: relational-database-overview
description: "An overview of relational databases, including relational database management systems and how they different from NoSQL databases."
keywords: ['what is mysql', 'sql vs mysql','mysql overview']
tags: ['mysql', 'nosql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-06
modified_by:
  name: Linode
title: "Introduction to Relational Databases and RDBMSs"
authors: ["Jeff Novotny"]
---

Many programs need to save or store data for later use and read data that is recorded. Although there are many ways to do this, the most common approach is to use a *Relational Database Management System* (RDBMS). [MySQL](https://www.mysql.com/), [PostgreSQL](https://www.postgresql.org/), and [SQLite](https://www.sqlite.org/index.html) are a few industry-standard open-source RDBMSs that have been widely adopted by software development projects. This guide provides an overview of relational databases and RDBMS concepts.

## What is a Relational Database?

A database is an application for storing and retrieving data. Although the mechanisms differ, most databases provide an API allowing users to add, delete, access, search, and manage their data. As an alternative to using a database, data can be stored in text files or hash tables. However, this technique is not as fast or as convenient as using a database and is rarely used in modern systems.

Early database applications evolved into the modern *relational database*, which allows users to store massive amounts of data. A *relational database management system* (RDBMS) is a software application that creates and maintains relational databases. An RDBMS no longer forces users to store data in one big table. It provides more structured ways of partitioning the data and is designed for more efficient access. RDBMS applications are optimized for fast reads and writes and bulk transfer of information.

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

### SQL vs. NoSQL

NoSQL systems are an alternative to traditional SQL-based RDBMS applications. As the name implies, they use a non-relational model to handle data. They are typically less structured and more flexible than an RDBMS. NoSQL systems are not standardized and can take a variety of formats. However, they are typically key-value, graph, or document-based, not table-based. Some NoSQL applications can use structured domain-specific languages or even accept SQL queries in parallel. A few examples of NoSQL applications include Redis and [MongoDB](/docs/guides/install-mongodb-on-centos-7/). For more information on NoSQL systems, consult the Linode guide for a [comparison between SQL and NoSQL databases](/docs/guides/what-is-nosql/#what-makes-nosql-different-from-sql).