---
slug: sql-joins
description: 'SQL Joins are used to compare and select rows from tables. This guide discusses Cross Joins, Inner Joins, Left Joins, Right Joins, and Full Joins and provides examples for each SQL Join.'
keywords: ['SQL Joins', 'Cross Joins', 'Left Join', 'Right Join', 'Full Join']
tags: ['mysql', 'postgresql', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-11
modified_by:
  name: Linode
title: "Introduction to SQL Joins"
title_meta: "SQL Joins"

authors: ["Doug Hayman for NanoHertz Solutions Inc."]
---

Traditionally, you pull data from two or more tables using a `WHERE` clause in a query. But in a relational database system (RDBMS), this can be achieved using a single `SELECT` query. This is the true power of relational database systems. In this guide, you learn about SQL Joins, a powerful way to compare and select rows and tables.

## What is a SQL Join?

In SQL, a `join` clause extends the capability of comparing and selecting rows from tables. It uses an algebraic process of combining rows from two or more tables based on a related column in those tables. By the ANSI-standard SQL definition, there are five types of Joins –**Cross Joins**, **Inner Joins**, **Left (Outer) Joins**, **Right(Outer) Joins**, and **Full (Outer) Joins**. These Joins are implemented across all relational database systems and are covered in the sections below.

{{< note respectIndent=false >}}
Joins can be performed on any number of tables in a given query. For brevity and clarity, this guide discusses Joins applied to two tables.
{{< /note >}}

This guide uses two tables, `Employees` and `Address`, respectively, to demonstrate SQL Joins. Each of these tables contain the following column definitions and data:

- **Employees Table**

    | EmployeeId | EmployeeName |
    |:-:|:-:|:-:|:-:|
    | 1 | John |
    | 2 | Mary |
    | 3 | Robert |

- **Address Table**

    | Id | State |
    |:-:|:-:|:-:|:-:|
    | 1 | New York |
    | 2 | New Jersey |
    | 3 | Idaho |
    | 4 | Hawaii |

{{< note respectIndent=false >}}
Unless mentioned otherwise, all the commands in this guide work well on both **MySQL** and **PostgreSQL** databases.
{{< /note >}}

### SQL Cross Joins

Also known as a *Cartesian Join*, Cross Joins occur when you specify multiple tables as a source for your `SELECT` column list. In this case, you leave out the `WHERE` clause join expression to match rows on. The result set contains a row for every combination of rows between the tables. In a two-table scenario, every row in one table is paired with every row of the other table. The resulting product is known as the *Cartesian Product* of the two tables. The syntax for a Cross Join is the following:

    (# Rows in Table A) TIMES (# of Rows in Table B)

{{< note respectIndent=false >}}
In set theory, the Cartesian Product is a multiplication operation that generates all ordered pairs of the given sets. For example, consider set `A` with elements `{a,b}` and set `B` with elements `{1,2,3}`. The Cartesian Product of `A` and `B` is denoted by `AxB` and the result is the following:

    AxB ={(a,1), (a,2), (a,3), (b,1), (b,2), (b,3)}
{{< /note >}}

The SQL syntax for a Cross Join is as follows:

    SELECT ColumnName_1,
           ColumnName_2,
           ColumnName_N
    FROM [Table_1]
         CROSS JOIN [Table_2]

From the above syntax, `Column_1`, `Column_2`, `Column_N` represent the columns in a table, and the `CROSS JOIN` clause serves to combine the two tables, `Table_1` and `Table_2`. From the example tables above, if you need to perform a Cross Join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    CROSS JOIN Address

The output of the above SQL code resembles the following:

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

### SQL Inner Join

An Inner Join returns rows that have matching values in both tables. If there are no matching records, then no rows are returned in the results.

The SQL syntax for Inner Join is as follows:

    SELECT ColumnName_1,
           ColumnName_2,
           ColumnName_N
    FROM Table_1
    INNER JOIN Table_2
    ON Table_1.key = Table_2.key;

In the example above, `key` is the respective key of the tables. If you need to perform an inner join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    INNER JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code resembles the following:

{{< output >}}
+--------------+--------------+
| EmployeeName | State        |
+---------------+-------------+
| John         |   New York   |
| Mary         |   New Jersey |
+------------+----------------+

{{< /output >}}

### SQL Left (Outer) Join

A Left Join returns a complete set of rows from the left table along with the matching rows from the right table. If there are no matching records, then `NULL` values are returned from the right table.

{{< note respectIndent=false >}}
Some relational database implementations use the keywords “Left Outer Join”, as opposed to “Left Join”, but they are functionally equivalent.
{{< /note >}}

The SQL syntax for Left Join is as follows:

    SELECT * FROM Table_1
    LEFT JOIN Table_2
    ON Table_1.key = Table_2.key

In the example above, `key` is the respective key of the tables. If you need to perform a left join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    LEFT JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code is as follows:

{{< output >}}
+--------------+--------------+
| EmployeeName | State        |
+---------------+-------------+
| John         |   New York   |
| Mary         |   New Jersey |
| Robert       |   NULL       |
+------------+----------------+

{{< /output >}}

### SQL Right (Outer) Join

A Right Join returns a complete set of rows from the right table and the matching rows from the left table. This is also known as a Right Outer Join. If there are no matching records, then `NULL` values are returned from the right table, for the affected rows in the left table.

{{< note respectIndent=false >}}
Some relational database implementations use the keywords "Right Outer Join”, as opposed to "Right Join”, but they are functionally equivalent.
{{< /note >}}

The SQL syntax for a Right Join is as follows:

    SELECT * FROM Table_1
    RIGHT JOIN Table_2
    ON Table_1.key = Table_2.key

From the above code, `key` is the respective key of the tables. If you need to perform a right join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    RIGHT JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code is the following:

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

### SQL Full (Outer) Join

A Full Join returns all rows from the left table, all rows from the right table. This is also known as also known as a Full Outer Join. A Full Join also returns all matching records from both tables where available. If there are no matching records, then `NULL` values are returned from the left table. It also returns `NULL` values from the right table.

{{< note respectIndent=false >}}
Some relational database implementations use the keywords "Full Outer Join”, as opposed to "Full Join”, but they are functionally equivalent.
{{< /note >}}

The SQL syntax for Full Join is as follows:

    SELECT * FROM Table1
    FULL JOIN Table2
    ON Table1.key = Table2.key

In the above code, `key` is the respective key of the tables. If you need to perform a full join on `Employees` and `Address` tables, use the following SQL code:

    SELECT EmployeeName, State
    FROM Employees
    FULL JOIN Address
    ON Employees.EmployeeId = Address.Id

The output of the above SQL code is the following:

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

{{< note respectIndent=false >}}
During Join calculations, if you compare table data with `NULL` values, they do not match one another. Hence, `NULL` values are only returned as part of Join results and are ignored during Join calculations.
{{< /note >}}

## Performance Comparison of SQL Joins

Considering the above example tables, the Inner Join is typically the fastest of the five Join clauses in terms of database performance. The Left Join and the Right Join are the next fastest depending on the size of the two tables. The Full Join is typically slower than the Left Join or the Right Join. The Cross Join, reliant on the Cartesian product of the two tables, is typically the slowest in terms of database performance. The specified performance hierarchy may differ depending on the table column length, column datatype, and key definitions.

## Conclusion

The use of SQL Joins extends the functionality of being able to compare table rows, over traditional `WHERE` clause queries. Joins are a valuable mechanism to apply algebraic logic to two or more tables.

To learn more about SQL, see our guides on [SQL data types](/docs/guides/sql-data-types/), [grouping and totaling](/docs/guides/sql-grouping-and-totaling/), and [SQL user management security](/docs/guides/sql-security/).