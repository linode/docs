---
slug: sql-indexes
description: 'SQL indexes are used to improve a database''s performance during query lookups. This guide discusses unique indexes, primary keys, and composite primary keys.'
keywords: ['database index', 'non-unique indexes', 'database performance']
tags: ['MySQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-25
modified_by:
  name: Linode
title: "An Introduction to SQL Indexes"
title_meta: "How to Use SQL Indexes"
authors: ["Doug Hayman for NanoHertz Solutions Inc."]
---

In relational database systems, a *database index* is an extremely powerful tool for data retrieval. In this guide, you learn about unique indexes, primary keys, and composite primary keys.

## What is a Database Index?

A *Database Index* is a data structure object associated with a database table. It is used to increase the speed of database queries (via the `SQL SELECT` command). In general, there are well-defined methods for deciding the types of indexes to create. This is largely governed by how tables in a database relate to one another and how data is retrieved.

### Why Use Indexes?

In general, queries (or lookups) in a table via the SQL `SELECT` command are sequential. Sequential lookup requires starting at the top of the table and reading every row of data until the desired data is retrieved. This is extremely inefficient and can be an expensive operation in terms of speed.

Indexes, on the other hand, utilize a hash function to compute an index value. It provides direct access to the affected row (key) in the index. Once that row (key) is located in the index, the index record has a pointer directly to the table row that is required in the query. These pointers are established during index creation and index maintenance. The speed of data retrieval when using indexes is increased by orders of magnitude.

## The Anatomy of a Unique Database Index

A database table can have one or more associated indexes. Indexes themselves hold row (key) values from one or more columns in a table. It also has a pointer that points to actual table rows containing these key values. The number of rows pointed to by a given key in an index is dependent on whether the index is a *unique index* or a *non-unique index*.

As the name implies, a unique index contains keys that point to only one data row in a given table. Unique indexes ensure that each row in the table contains unique values in the defined indexed table columns. Effectively, no two rows can have identical values in the indexed columns. Moreover, unique indexes are created on columns that are designated as a *primary key* for the table. Primary keys are defined as one or more columns that uniquely define a row in a database table.

The examples below demonstrate how primary keys and unique indexes are used in SQL. All the examples use a table named `Student`, in an example database named `exampledb`. To add the example data use the following command:

    INSERT INTO Student(SSNumber, LastName, FirstName)
      VALUES
    (111111111, Smith, John),
    (222222222, Jones, Mary),
    (333333333, Hansen, Robert);

View the data stored in the `Student` table:

    SELECT * FROM Student;

You should see the following output:

{{< output >}}
+-----------+----------+-----------+
| SSNumber  | LastName | FirstName |
+-----------+----------+-----------+
| 111111111 | Smith    | John      |
| 222222222 | Jones    | Mary      |
| 333333333 | Hansen   | Robert    |
+-----------+----------+-----------+
{{</ output >}}

{{< note respectIndent=false >}}
Unless mentioned otherwise, all the commands in this guide work well on both **MySQL** and **PostgreSQL** databases.
{{< /note >}}

### Single Column Primary Key and Index

As an example, assume that a school keeps track of its students in a table named `Student`. This table has associated columns named `Student`, `SSNumber`, `LastName`, and `FirstName`. From these columns, `Student` is the primary key column as it uniquely identifies each row of data in the `Student` table. Create a unique index (`SSIndex`) on the `SSNumber` column, to facilitate rapid retrieval of data from the table. The following SQL DDL command is used to perform this query:

CREATE TABLE Student (
  SSNumber CHAR(9) NOT NULL,
  LastName VARCHAR(30) NOT NULL,
  FirstName VARCHAR(20) NOT NULL,
  PRIMARY KEY (SSNumber)
);

    CREATE UNIQUE INDEX SSIndex ON Student (SSNumber);

{{< note respectIndent=false >}}
Both the SQL commands above are delimited by a semicolon (;), which is compatible with most relational database systems. `SSNumber` is specifically designated as the table’s primary key.
{{< /note >}}

`SSIndex` only contains information that uniquely identifies data in each row of the `Student` table. Each row of `SSIndex` has a pointer to its corresponding row in the `Student` table. This `SSIndex` index allows you to avoid a sequential search of data in the table that improves performance by minimizing the time needed for the query.

To find the associated information for `Robert Hansen` via their `SSNumber`, use the SQL command included below. The command not only eliminates the sequential search of `Student` table but also uses the `SSIndex` to provide direct access to the requisite data row. This is by virtue of using a hashing function and associated index pointer.

    SELECT * FROM Student WHERE SSNumber = 333333333;

The data returned should be the following:

{{< output >}}
+-----------+----------+-----------+
| SSNumber  | LastName | FirstName |
+-----------+----------+-----------+
| 333333333 | Hansen   | Robert    |
+-----------+----------+-----------+
{{< /output >}}

### Multi-Column Composite Primary Key and Index

This section's examples use three tables that store data related to a tennis league. The three tables are named `Player`, `League`, and `Membership`. A player can play in multiple leagues, and the membership table provides that association. The three tables have the following columns associated with them:

The columns of the `Player` table are displayed below with `PlayedID` as the primary key.

{{< output >}}
+----------+-----------+-----------+
| PlayedID | LastName  | FirstName |
+----------+-----------+-----------+
{{</ output >}}

The columns of the `League` table are displayed below with `LeagueId` as the primary key.

{{< output >}}
+----------+------------+------------+
| LeagueId | LeagueName | SkillLevel |
+----------+------------+------------+
{{</ output >}}

The columns of the `Membership` table are displayed below

{{< output >}}
+----------+-----------+
| PlayedID | LeagueId  |
+----------+-----------+
{{</ output >}}

The steps below show you how to create the `Player`, `League`, and `Membership` tables.

1. From the `Player` table, the `PlayedID` column uniquely identifies each row of data. Create the `Player` table followed by a unique index on the `PlayerId` column.

        CREATE TABLE Player (
          PlayedID INT NOT NULL,
          LastName VARCHAR(30) NOT NULL,
          FirstName VARCHAR(20) NOT NULL,
          PRIMARY KEY (PlayedID)
        );

        CREATE UNIQUE INDEX PlayerIndex ON Player (PlayedID);

1. From the `League` table, the `LeagueId` column uniquely identifies each row of data. Create the `League` table followed by a unique index on the
`LeagueId` column. Following is the SQL command to perform this operation:

        CREATE TABLE League (
          LeagueId INT NOT NULL,
          LeagueName VARCHAR(50) NOT NULL,
          SkilLevel VARCHAR(20) NOT NULL,
          PRIMARY KEY (LeagueId)
        );

        CREATE UNIQUE INDEX LeagueIndex ON League (LeagueId);

1. From the `Membership` table, both the `PlayedID` and `LeagueId` columns uniquely identify each row of data; which is the composite primary key. Create the `Membership` table followed by a unique composite index on the `PlayedID` and `LeagueId` columns.

        CREATE TABLE Membership (
          PlayerId INT NOT NULL,
          LeagueId INT NOT NULL,
          PRIMARY KEY(PlayerId, LeagueId)
        );

        CREATE UNIQUE INDEX MembershipIndex ON Membership (PlayerId, LeagueId);

The `MembershipIndex` is a hash-generated index consisting of the Composite Key(`PlayedId` and `LeagueId`). It has pointers to the data rows that it represents. The use of such an index facilitates rapid, direct-access data retrieval, as opposed to linear sequential data retrieval. For example, to determine all the players associated with “Men’s Doubles” from several records in each of the tables above, you can issue the following SQL command:

    SELECT Player.LastName, Player.Firstname
    FROM Player, Membership
    WHERE Membership.LeagueId = 2
    AND Membership.PlayerId = Player.PlayerId

The following data is returned:

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

A non-unique index contains entries that may point to one or more rows for any given key values. For example, to search by a person's name, it is necessary to create a non-unique composite index on a table for both `FirstName` and `LastName`. Since the combination of `FirstName` and `LastName` cannot be guaranteed to be unique, the resulting index created on those two columns effectively generates a non-unique index.

## Database Performance Degradation Issue Using Indexes

While indexes assist query execution speed, they need to be updated whenever indexed columns change or when table rows are added or deleted from the database. This can be detrimental to the database's performance. It's important to keep in mind the amount of inserting, deleting, and modification required of your indexes during transactional database usage. Consider what is important for you in the database application; the speed of query execution or the speed of data manipulation. The answer to that question lies in how the database application is used, how often it impacts the design of the database, and the number of indexes created.

## Conclusion

Creating and using database indexes generates rapid query retrieval responses and eliminates sequential row lookups from tables. However, index maintenance through data manipulation can have detrimental performance impacts on a database. Database designers need to be aware of the trade-offs involved when using database indexes and keep in mind optimization for overall database performance.