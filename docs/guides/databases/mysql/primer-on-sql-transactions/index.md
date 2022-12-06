---
slug: a-primer-on-sql-transactions
author:
  name: Linode Community
  email: docs@linode.com
description: 'SQL transactions help maintain database integrity. This guide outlines some transaction benefits and how to use the delimiter, commit, and rollback syntax.'
keywords: ['sql transactions', 'commit transaction', 'rollback transaction', 'SQL transaction delimiter']
tags: ['mysql', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-25
modified_by:
  name: Linode
title: "A Primer on SQL Transactions"
h1_title: "SQL Transactions: An Introduction"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
---

## What are SQL Transactions?

A SQL *transaction* is a grouping of one or more SQL statements that interact with a database. A transaction in its entirety can *commit* to a database as a single logical unit or *rollback* (become undone) as a single logical unit. In SQL, transactions are essential for maintaining database integrity. They are used to preserve integrity when multiple related operations are executed concurrently, or when multiple users interact with a database concurrently.

## In this Guide

This guide demonstrates:

- [Why SQL transactions are necessary](#why-are-sql-transactions-necessary)

- How to better understand SQL transactions through [an example use-case of a financial brokerage](#understanding-sql-transactions-with-an-example)

- The transaction [delimiter](#sql-transaction-delimiter-syntax), [commit](#commit-transaction-syntax), and [roll back](#roll-back-transaction-syntax) syntax

- How the delimiter, commit, and roll back syntax are used in [an example use-case for a school](#database-transaction-examples)

- Some further [benefits of using transactions](#more-benefits-of-using-transactions)

## Why are SQL Transactions Necessary?

A database application has to account for every possible failure scenario while writing and reading from a database. Without SQL transactions, application code that protects database integrity would be complex and expensive to develop and maintain. With SQL transactions, application code and database maintenance can be simplified.

## Understanding SQL Transactions with an Example

Consider a financial brokerage that maintains a database for its clients. The brokerage is required to generate a quarterly financial statement for each of its clients. The financial statement reports the statement balance, current values of holdings, and any transactions that occurred during the quarter. To generate the statement, you may need to process the following steps:

1. Loop through each client’s transaction history account to ascertain and calculate each of the transactions that occurred during the quarter (both purchases and sales).
1. Calculate each client portfolio’s total return for the quarter, along with year-to-date returns.
1. Calculate each client’s taxable and non-taxable returns for the quarter.
1. Insert a record into a `statements` table to record the prior three steps.
1. Update the current portfolio holdings' values and investment totals for the quarter in a `quarterly_values` table.
1. Update the statement balance in an `accounts` table.

Many read and write operations are required for the above steps. There are a number of scenarios where data integrity could be violated, including:

- A transaction that falls within a reported quarter is backed out or changed after calculations have already been made

- One of the updates noted above fails after we have already inserted a record into the `statements` table

- The total statement balance cannot be updated

Without SQL transactions, application code would need to account for every possible permutation of errors that could occur in the database. With SQL transactions, all of the above statements can be contained in a transaction block that either succeeds or fails.

## SQL Transaction Delimiter Syntax

{{< note >}}
The implementation of transactions is very similar in concept across most database implementations, but the syntax can vary slightly.
{{< /note >}}

Typically, the beginning of a transaction in a SQL Server command line is defined using the `BEGIN TRANSACTION` statement:

    BEGIN TRANSACTION NameOfTransaction;

In MySQL, the syntax is slightly different, but has the same meaning:

    START TRANSACTION;

## Commit Transaction Syntax

If a database application determines that all of the changes for a transaction have succeeded, the application can use the `COMMIT TRANSACTION` statement. This commits those changes to the database, and it is placed at the end of a block of statements. In SQL Server, the following command is used to commit the transaction:

    COMMIT TRANSACTION;

Alternatively, you can also use the below command. The following command can also be used in MySQL.

    COMMIT;

## Roll Back Transaction Syntax

If a database application determines that a change in a transaction has failed, the application can use the `ROLLBACK` statement. This statement can effectively de-commit any statements that have already been executed since the beginning of the transaction. In SQL Server and MySQL, the following command is used to roll back a transaction:

    ROLLBACK;

## Database Transaction Examples

To demonstrate the mechanism behind transaction processing, consider the example of a simple database named `School`. One of the tables in the database is named `Course` and is defined as follows:

|   `COURSE`   |
| :--------: |
| `CourseId`   |
| `CourseName` |

The `Course` table is created using the below SQL command:

    CREATE TABLE Course(
      CourseId   SMALLINT    NOT NULL;
      CourseName VARCHAR(40) NOT NULL
    );

The following examples demonstrate different ways to use SQL transactions from the command line.

### Example 1: Commit a Transaction

The example below obtains the largest `CourseId` value from table `Course` and adds `1` to it. It then inserts a row into the `Course` table and commits the transaction. Before committing, if any part of the `CourseAdd` transaction fails to execute, then none of the transactions can be processed. That means if the `Select` or `Insert` statement fails in some capacity, the entire transaction is null and void.

    BEGIN TRANSACTION CourseAdd;

    DECLARE @CrsId SMALLINT;

    SELECT @CrsId = MAX(CourseId) + 1
    FROM Course;

    INSERT Course VALUES (@CrsId, 'Biology 101');

    COMMIT TRANSACTION;

### Example 2: Roll Back a Transaction

In the example below, although rows are manually inserted into the `Course` table, all the `Insert` statements are wrapped into a transaction. That way, if a transaction fails to execute, you can roll back the entire transaction using the following MySQL syntax:

    START TRANSACTION;
    INSERT Course VALUES (1, 'Biology 101');
    INSERT Course VALUES (2, 'Computer Science 101');
    ROLLBACK;

From the above MySQL syntax, you have ensured that the `Insert` statements have not committed (inserted) the data into the `Course` table until a `Commit` command is received. By issuing a `Rollback` statement, you have effectively undone the two prior `Insert` statements, and not committed either of these two rows to the database.

 ### Example 3: Combining Commit and Rollback in a Transaction

The example below combines the ability to both commit and rollback transactions in the same transaction code block.

    BEGIN TRANSACTION InsertCourse;

    DECLARE @CrsId SMALLINT;

    SELECT @CrsId = MAX(CourseId) + 1
    FROM Course;

    INSERT Course VALUES (@CrsId, 'Biology 101');

    IF (SELECT COUNT(CourseName)
       FROM Course
       WHERE CourseName = 'Biology 101') > 1
       ROLLBACK;
    END IF;

    COMMIT TRANSACTION;

The MySQL code above inserts a row in the `Course` table with the next highest `CourseId`. Before committing the transaction, the code checks if there are more than one rows where the `CourseName` is `Biology 101`. If true, the transaction is not committed to the database. At this point, the transaction rolls back and the code segment aborts from further processing. Otherwise, if the new row is the first instance of a `CourseName` of `Biology 101`, then the transaction proceeds and is committed to the database.

## More Benefits of Using Transactions

When should you use transactions? Should you always use transactions?

The simple answer is yes. This is especially true when you are dealing with multiple groups of statements. In a transaction, all of the statements in a sequence of statements must succeed for the associated data to be committed to the database. A failure of a component within the transaction necessitates a rollback.

The use of transactions is also beneficial to protect against database failure conditions, including power failures, server crashes, disk drive failure, and database software crashes. In the event of one of these failures, if there are transactions that have not yet been committed, database integrity is maintained. Without transactions, any atomic statements that are applied to the database remain intact, regardless of whether associated statements have been executed. This may result in a data integrity issue.

## Conclusion

SQL transaction logic is a fundamental mechanism for ensuring database integrity and minimizing error handling logic that is required in a multi-user database application. The use of transactions in SQL environments guarantees accuracy and completeness.
