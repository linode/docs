---
slug: sql-joins
author:
  name: Doug Hayman for NanoHertz Solutions Inc.
  email: docs@linode.com
description: 'In this guide, you learn about the different types of SQL Joins and how to implement them with examples.'
og_description: 'In this guide, you learn about the different types of SQL Joins and how to implement them with examples.'
keywords: ['SQL Joins', 'Cross Joins', 'Left Join', 'Right Join', 'Full Join']
tags: ['mysql', 'postgresql', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-09
modified_by:
  name: Linode
title: "SQL Joins"
h1_title: "Introduction to SQL Joins"
enable_h1: true
contributor:
  name: Doug Hayman
  link: http://nhzsolutions.com/

---

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started on the Linode Platform](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

In a traditional approach, you pull data from two or more tables using a `WHERE` clause in a query. But in a relational database system, this can be achieved using a single `SELECT` query. This is the true power of relational database systems. In this article, you learn about SQL Joins, a powerful way to compare, select rows, and tables.

## What is SQL Joins

In SQL, a `join` clause is a clause that extends the capability of comparing and selecting rows from tables. It uses an algebraic process of combining rows from two or more tables in a specific manner based on a related column in those tables. By the ANSI-standard SQL definition, there are five types of Joins–**Cross Joins**, **Inner Joins**, **Left (Outer) Joins**, **Right(Outer) Joins**, and **FullOuter Joins**. These Joins are implemented across all relational database systems and are covered in this article.

{{< note >}}
Joins can be performed on any number of tables in a given query. For brevity and clarity, this guide discusses on Joins applied to two tables.
{{< /note >}}

This guide uses the following two example tables-`Employees` and `Address` as a base for demonstrating the different Joins. Assume that each of these tables has the following column definitions and data:

Following is the `Employees` table:

| EmployeeId | EmployeeName |
|:-:|:-:|:-:|:-:|
| 1 | John |
| 2 | Mary |
| 3 | Robert |

Following is the `Address` table:

| Id | State |
|:-:|:-:|:-:|:-:|
| 1 | New York |
| 2 | New Jersey |
| 3 | Idaho |
| 4 | Hawaii |

{{< note >}}
Unless mentioned otherwise, all the database commands or syntax demonstrated in this guide works well on both **MySQL** and **PostgreSQL**.
{{< /note >}}

### Cross Joins

Also known as *Cartesian Join*, occurs when you specify multiple tables as a source for your `SELECT` column list. Here you leave out the `WHERE` clause join expression to match rows on. The result set contains a row for every combination of rows between the tables. In a two-table scenario, every row in one table is paired with every row of the other table. The resulting product is known as the *Cartesian Product* of the two tables which can be represented as:

    (# Rows in Table A) TIMES (# of Rows in Table B)

{{< note >}}
In a set theory, the Cartesian Product is a multiplication operation that generates all ordered pairs of the given sets. For example, if `A` is a set and its elements are `{a,b}` and `B` is another set with its elements `{1,2,3}`. The Cartesian Product of `A` and `B` is denoted `AxB` and the result is like the following:

    AxB ={(a,1), (a,2), (a,3), (b,1), (b,2), (b,3)}
{{< /note >}}

A Cross Join can be graphically represented as follows:

    <placeholder--cross join art here>

The SQL syntax for Cross Join is as follows:

    SELECT ColumnName_1,
           ColumnName_2,
           ColumnName_N
    FROM [Table_1]
         CROSS JOIN [Table_2]

From the above syntax, `Column_1`, `Column_2`, `Column_N` represents the columns in a table, and the `CROSS JOIN` clause serves to combine the two tables, `Table_1` and `Table_2`. From the example tables above, if you need to perform cross join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    CROSS JOIN Address

The output of the above SQL code would look like the following:

{{< output >}}
+--------------+--------------+
| EmployeeName | State        |
+---------------+-------------+
| John         |   New York   |
| John         |   New Jersey |
| John         |   Idaho      |
| John         |   Hawaii     |
| John         |   New York   |
| Mary         |   New York   |
| Mary         |   New Jersey |
| Mary         |   Idaho      |
| Mary         |   Hawaii     |
| Robert       |   New York   |
| Robert       |   New Jersey |
| Robert       |   Idaho      |
| Robert       |   Hawaii     |
+------------+----------------+

{{< /output >}}

### Inner Join

An Inner Join returns rows that have matching values in both tables. If there are no matching records, then no rows are returned in the results. This is described graphically as follows:

    <placeholder--inner join art here>

The SQL syntax for Inner Join is as follows:

    SELECT ColumnName_1,
           ColumnName_2,
           ColumnName_N
    FROM Table_1
    INNER JOIN Table_2
    ON Table_1.key = Table_2.key;

From the above syntax, `key` is the respective key of the tables. From the example tables above, if you need to perform an inner join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    INNER JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code would look like the following:

{{< output >}}
+--------------+--------------+
| EmployeeName | State        |
+---------------+-------------+
| John         |   New York   |
| Mary         |   New Jersey |
+------------+----------------+

{{< /output >}}

### Left (Outer) Join

A Left Join (also known as a Left Outer Join) returns a complete set of rows from the left table (table1) along with the matching rows from the right table (table2). If there are no matching records, then `NULL` values are returned from table2, for the affected rows in table1.

{{< note >}}
Some relational database implementations use the keywords “Left Outer Join”, as opposed to “Left Join”, but they are functionally equivalent.
{{< /note >}}

A Left (Outer) Join can be graphically represented as follows:

    <placeholder--Left (Outer) Join art here>

The SQL syntax for Left Join is as follows:

    SELECT * FROM Table_1
    LEFT JOIN Table_2
    ON Table_1.key = Table_2.key

From the above syntax, `key` is the respective key of the tables. From the example tables above, if you need to perform a left join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    LEFT JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code would look like the following:

{{< output >}}
+--------------+--------------+
| EmployeeName | State        |
+---------------+-------------+
| John         |   New York   |
| Mary         |   New Jersey |
| Robert       |   NULL       |
+------------+----------------+

{{< /output >}}

### Right (Outer) Join

A Right Join (also known as a Right Outer Join) returns a complete set of rows from the right table (table2) and the matching rows from the left table (table1). If there are no matching records, then `NULL` values are returned from table1, for the affected rows in table2.

{{< note >}}
Some relational database implementations use the keywords Right Outer Join”, as opposed to Right Join”, but they are functionally equivalent.
{{< /note >}}

A Right (Outer) Join can be graphically represented as follows:

    <placeholder--Right (Outer) Join art here>

The SQL syntax for Right Join is as follows:

    SELECT * FROM Table_1
    RIGHT JOIN Table_2
    ON Table_1.key = Table_2.key

From the above syntax, `key` is the respective key of the tables. From the example tables above, if you need to perform a right join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    RIGHT JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code would look like the following:

{{< output >}}
+--------------+--------------+
| EmployeeName | State        |
+---------------+-------------+
| John         |   New York   |
| Mary         |   New Jersey |
| NULL         |   Idaho      |
| NULL         |   Hawaii     |
+------------+----------------+

{{< /output >}}

### Full (Outer) Join

A Full Join (also known as a Full Outer Join) returns all rows from the left table (table1), all rows from the right table (table2). It also returns all matching records from both tables where available. If there are no matching records, then `NULL` values are returned from table1, for the affected rows in table2. It also returns `NULL` values from table2, for the affected rows in table1.

{{< note >}}
Some relational database implementations use the keywords Full Outer Join”, as opposed to Full Join”, but they are functionally equivalent.
{{< /note >}}

A Full (Outer) Join can be graphically represented as follows:

    <placeholder--Full (Outer) Join art here>

The SQL syntax for Full Join is as follows:

    SELECT * FROM Table1
    FULL JOIN Table2
    ON Table1.key = Table2.key

From the above syntax, `key` is the respective key of the tables. From the example tables above, if you need to perform a full join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    FULL JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code would look like the following:

{{< output >}}
+--------------+--------------+
| EmployeeName | State        |
+---------------+-------------+
| John         |   New York   |
| Mary         |   New Jersey |
| Robert       |   NULL       |
| NULL         |   Idaho      |
| NULL         |   Hawaii     |
+------------+----------------+

{{< /output >}}

{{< note >}}
During Join calculations, if you compare table data with `NULL` values, they do not match one another. Hence, `NULL` values are only returned as part of Join results and are ignored during Join calculations.
{{< /note >}}

## Performance Comparison of Joins

Considering the above example tables, the Inner Join is typically the fastest of the five Join clauses in terms of database performance. The Left Join and
the Right Join are the next fastest depending on the size of the two tables. The Full Join is typically slower than the Left Join or Right Join. The Cross Join, reliant on the Cartesian product of the two tables, is typically the slowest in terms of database performance.

The performance hierarchy specified above may differ depending on the table column length, column datatype, and key definitions.


## Conclusion

The use of SQL Joins extends the functionality of being able to compare table rows, over traditional `WHERE` clause queries. This is a valuable mechanism to apply algebraic logic to two or more tables.