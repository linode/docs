---
slug: use-of-sql-indexes
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide, you learn about database indexes and ways to improve the database performance using SQL indexes.'
keywords: ['database index', 'non-unique indexes', 'database performance']
tags: ['MySQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-16
modified_by:
  name: Linode
title: "Use of SQL Indexes"
h1_title: "Introduction to SQL Indexes"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/

---

In relational database systems, a *Database Index* is an extremely powerful tool for data retrieval. In this guide, you see how the database index can improve database performance.

## What is a Database Index?

In simplest terms, a *Database Index* is a data structure object associated with a database table. It is used to increase the speed of database queries (via the SQL SELECT command). In general, there are well-defined methods for deciding the types of indexes to create. This is largely governed by how tables in a database relate to one another and how the database is used for retrieval purposes.

### Why Use Indexes?

In general, queries (or lookups) in a table via the SQL `SELECT` command are sequential. Sequential lookup requires starting at the top of the table and reading every row of data until the desired data is retrieved. This is extremely inefficient and can be an expensive operation in terms of speed.

Indexes, on the other hand, utilize a hash function to compute an index value. It provides direct access to the affected row (key) in the index. Once that row (key) is located in the index, the index record has a pointer directly to the table row that is required in the query. These pointers are established during index creation and index maintenance. In short, the speed of data retrieval when using indexes is increased by orders of magnitude.

## The Anatomy of a Unique Database Index

To enhance the retrieval of data from a database table, a database table can have one or more associated indexes. Indexes themselves hold row (key) values from one or more columns in a table. It also has a pointer that points to actual table rows containing these key values. The number of rows pointed to by a given key in an index is dependent on whether the index is a *Unique index* or a *Non-Unique index*.

As the name implies, a unique index contains keys that point to only one data row in a given table. Unique indexes ensure that each row in the table contains unique values in the defined indexed table columns. Effectively, no two rows can have identical values in the indexed columns. Moreover, unique indexes are created on columns that are designated as a primary key for the table. Primary keys are defined as one or more columns that uniquely define a row in a database table.

The guide uses different examples below to demonstrate the understanding of primary keys and the use of SQL unique indexes.

{{< note >}}
Unless mentioned otherwise, all the commands in this guide work well on both **MySQL** and **PostgreSQL** databases.
{{< /note >}}

**Example 1:** Single Column Primary Key and Index

As an example, assume that a school keeps track of its students in `Student` table. This table has the following columns–`Student`, `SSNumber`, `LastName`, and `FirstName` associated with it. From these columns, `Student` is the primary key column as it uniquely identifies each row of data in the `Student` table. Create a unique index (`SSIndex`) on the `SSNumber` column, to facilitate rapid retrieval of data from the table. The following SQL DDL command is used to perform this query on a CLI (Command Line Interface):

    CREATE TABLE Student (
      SSNumber CHAR(9) NOT NULL,
      LastName VARCHAR(30) NOT NULL,
      FirstName VARCHAR(20) NOT NULL,
      PRIMARY KEY (SSNumber)
    );

    CREATE UNIQUE INDEX SSIndex ON Student (SSNumber);

{{< note >}}
Both the SQL commands above are delimited by a semicolon (;), which is compatible with most relational database systems. `SSNumber` is specifically designated as the table’s primary key.
{{< /note >}}

Consider that the `Student` table has three rows of data. After executing the above SQL commands, the `Student` table and its unique `SSIndex` that is created can be graphically represented as follows:

>**Student table and SSIndex table art here**

From the above representation, `SSIndex` only contains information that uniquely identifies data in each row of the `Student` table. And, each row of `SSIndex` has a pointer to its corresponding row in the `Student` table. This `SSIndex` index allows you to avoid a sequential search of data in the table that improves performance by minimizing the time needed for the query.

To find the associated information for Robert Hansen via his Social Security Number, use the following SQL command. The command not only eliminates the sequential search of `Student` table but also uses the `SSIndex` to provide direct access to the requisite data row. This is by virtue of using a hashing function and associated index pointer.

    SELECT * FROM Student WHERE SSNumber = ‘333333333’;

**Output:**
{{< output >}}

+----------+-----------+
| LastName | FirstName |
+----------+-----------+
| Hansen   | Robert    |
+-----------+----------+

{{< /output >}}


**Example 2:** Multi-Column Composite Primary Key and Index

As an example, assume the three tables– `Player`, `League`, and `Membership` for a tennis league. A player can play in multiple leagues, and the membership table provides that association. These three tables have the following columns associated with them:

Columns of the `Player` table are as follows with `PlayedID` as the primary key.

    +----------+-----------+-----------+
    | PlayedID | LastName  | FirstName |
    +----------+-----------+-----------+

Columns of the `League` table are as follows with `LeagueId` as the primary key.

    +----------+------------+------------+
    | LeagueId | LeagueName | SkillLevel |
    +----------+------------+------------+

Columns of the `Membership` table are as follows:

    +----------+-----------+
    | PlayedID | LeagueId  |
    +----------+-----------+

The following steps demonstrate the creation of the above three tables using the SQL command via a CLI.

1. From the `Player` table, the `PlayedID` column uniquely identifies each row of data. Create the `Player` table followed by a Unique index on the `PlayerId` column. Following is the SQL command to perform this operation:

        CREATE TABLE Player (
          PlayedID INT NOT NULL,
          LastName VARCHAR(30) NOT NULL,
          FirstName VARCHAR(20) NOT NULL,
          PRIMARY KEY (PlayedID)
        );

        CREATE UNIQUE INDEX PlayerIndex ON Player (PlayedID);


1. From the `League` table, the `LeagueId` column uniquely identifies each row of data. Create the `League` table followed by a Unique index on the
`LeagueId` column. Following is the SQL command to perform this operation:

        CREATE TABLE League (
          LeagueId INT NOT NULL,
          LeagueName VARCHAR(50) NOT NULL,
          SkilLevel VARCHAR(20) NOT NULL,
          PRIMARY KEY (LeagueId)
        );

        CREATE UNIQUE INDEX LeagueIndex ON League (LeagueId);

1. From the `Membership` table, both the `PlayedID` and `LeagueId` columns uniquely identify each row of data; which is the Composite Primary Key. Create the `Membership` table followed by a Unique Composite index on the `PlayedID` and `LeagueId` columns. Following is the SQL command to perform this operation:

        CREATE TABLE Membership (
          PlayerId INT NOT NULL,
          LeagueId INT NOT NULL,
          PRIMARY KEY(PlayerId, LeagueId)
        );

        CREATE UNIQUE INDEX MembershipIndex ON Membership (PlayerId, LeagueId);

Consider there are four players in the `Player` and `League` tables. Every player participates in both a Singles and Doubles league (`Membership` Table). Graphically, the `Player` and `League` tables along with the `MembershipIndex` might be represented as follows:

{{< note >}}
From the graphical representation below:
1. The `Membership` table, `PlayerIndex` and `LeagueIndex` are not displayed for simplicity.
1. The index pointers pertaining to only John Smith’s (`PlayerId` of `1`) membership are displayed to illustrate the principle of a Composite Key.
{{< /note >}}

>**Membership table art here**

The `MembershipIndex` is a hash-generated index consisting of the Composite Key(`PlayedId` and `LeagueId`). It has pointers to the data rows that it represents. The use of such an index facilitates rapid, direct-access data retrieval, as opposed to linear sequential data retrieval. For example, to determine all the players associated with “Men’s Doubles” from several records in each of the tables above, you can issue the following SQL command:

    SELECT Player.LastName, Player.Firstname
    FROM Player, Membership
    WHERE Membership.LeagueId = 2
    AND Membership.PlayerId = Player.PlayerId

**Output:**
{{< output >}}

+----------+-----------+
| LastName | FirstName |
+----------+-----------+
| Smith    | John      |
| Hansen   | Robert    |
+-----------+----------+

{{< /output >}}

Without the use of the `MembershipIndex` and `PlayerIndex`, the query above would execute significantly slower.

## Non-Unique Indexes

A Non-Unique index contains entries that may point to one or more rows for any given key values. For example, to search by a person's name, it is necessary to create a non-unique composite index on a table for both `FirstName` and `LastName`. Since the combination of `FirstName` and `LastName` cannot be guaranteed to be unique, the resultant index created on those two columns effectively generates a non-unique index.

## Database Performance Degradation Issue Using Indexes

While indexes assist query execution speed, they need to be updated whenever indexed columns changes or when table rows are added or deleted from the database. This can be detrimental to the database's performance. It depends on the amount of insertion, deletion, or modification of indexes in transactional database usage. Consider what is important for you in the database application; the speed of query execution or the speed of data manipulation. The answer to that question lies in how the database application is used, how often it impacts the design of the database, and the number of indexes created.

## Conclusion

Database index creation and usage fosters rapid query retrieval responses and eliminates sequential row lookups from tables. However, index maintenance through data manipulation can have detrimental performance impacts on a database. Database designers need to be aware of the trade-offs involved in index creation to optimize overall database performance.