---
slug: a-primer-on-sql-transactions-new-location
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide, you see what SQL transactions are and its importance in the database integrity with examples.'
keywords: ['sql transactions', 'commit transaction', 'rollback transaction', 'SQL transaction delimiter']
tags: ['mysql', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-30
modified_by:
  name: Linode
title: "A Primer on SQL Transactions"
h1_title: "SQL Transactions: An Introduction"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
aliases: ['/docs/guide/a-primer-on-sql-transactions/']
---

test change

In SQL, transactions are essential for maintaining database integrity when dealing with multiple related operations as well as when multiple users are interacting with a database concurrently. In this guide, you learn the concept of SQL Transactions, what they are, and how to work with them.

## What are SQL Transactions?

SQL Transactions is a grouping of logical statements that can contain one or more SQL statements that interact within a database. A transaction in its entirety can *commit* to a database as a single logical unit or *rollback* (undone) as a single logical unit.

## Why are SQL Transactions Necessary?

In certain instances, a database application has to account for every possible failure scenario while writing and reading from a database. While ensuring that every aspect of database integrity is not violated, application code is extremely complex, convoluted, and expensive to develop, and maintain.

Using SQL Transactions, code/maintenance can be simplified. Using commit and rollback transactions as necessary, database integrity can easily be maintained.

### Understanding SQL Transactions With an Example

For example, consider a financial brokerage that maintains a database for its clients. The brokerage is required to generate a quarterly financial statement for each of its clients that reports on statement balance, current values of holdings, and any transactions that occurred during the quarter. Hypothetically, you may need to process the following steps:

1. Loop through each client’s transaction history account to ascertain and calculate each of the transactions that occurred during the quarter (both purchases and sales).
1. Calculate each client’s total portfolio’s return for the quarter, along with year-to-date returns.
1. Calculate each client’s taxable and non-taxable returns for the quarter.
1. Insert a record into the (say) `statements` table to record the prior three steps.
1. Update the current portfolio holdings values and investment totals for the quarter in a (say) `quarterly_values` table.
1. Update the statement balance in (say) the `accounts` table.

Obviously, many read and write operations are required for the above steps. What if a transaction that falls within a reported quarter is backed out or changed after calculations have already been made? What if one of the updates noted above fails after we have already inserted a record into the `statements` table? What if the total statement balance cannot be updated?

These are all valid concerns and scenarios that can occur in a database application. To have to account for every possible permutation of errors to occur in a database application would be a coding/maintenance nightmare.

The answer here is to make use of SQL Transactions. It can dramatically simplify coding, allow all statements in a transaction block to either succeed or fail and most importantly, ensure database integrity.

## SQL Transaction Delimiter Syntax

{{< note >}}
The implementation of transactions is very similar in concept across most database implementations, but the syntax can vary slightly.
{{< /note >}}

Typically, in a SQL Stored Procedure, the beginning of a transaction in a SQL Server command line is defined using the following command:

    BEGIN TRANSACTION NameOfTransaction;

In MySQL, the syntax is slightly different, but has the same meaning:

    START TRANSACTION;

## Commit Transactions

If a database application decides that all the processing of a block of change activity has succeeded, the application can use the **COMMIT TRANSACTION** statement at the end of the block to commit the requisite changes to the database. In SQL Server, the following command is used to commit the transaction:

    COMMIT TRANSACTION;

Alternatively, you can also use the below command. The following command can also be used in MySQL.

    COMMIT;

## Roll Back Transactions

If a database application decides that something in a change activity code block has failed, the application can use the **ROLLBACK** statement. This statement can effectively de-commit any statements that have already been executed since the beginning of the transaction. In SQL Server and MySQL, the following command is used to roll back a transaction:

    ROLLBACK;

## Database Transaction Examples

To demonstrate the mechanism behind transaction processing, consider the example of a simple database named `School`. One of the table in the database named `Course` is defined as follows:


|   COURSE   |
| :--------: |
| CourseId   |
| CourseName |

The `Course` table is created using the below SQL command:

    CREATE TABLE Course(
      CourseId   SMALLINT    NOT NULL;
      CourseName VARCHAR(40) NOT NULL
    );

The following examples provide different use cases of using the SQL Transactions from the command line.

**Example #1**: To commit a transaction

The example below obtains the largest `CourseId` value from table `Course` and adds `1` to it. It then inserts a row into the `Course` table and Commits the Transaction. Before Commit, if any part of the `CourseAdd` transaction fails to execute, then none of the transactions can be processed. That means if the `Select` or `Insert` statement fails in some capacity, the entire transaction is null and void.

    BEGIN TRANSACTION CourseAdd;

    DECLARE @CrsId SMALLINT;

    SELECT @CrsId = MAX(CourseId) + 1
    FROM Course;

    INSERT Course VALUES (@CrsId, 'Biology 101');

    COMMIT TRANSACTION;

 **Example #2**: Roll back a transaction

In the example below, although rows are manually inserted into the `Course` table, all the `Insert` statements are wrapped into a Transaction. That way, if a transaction fails to execute, you can roll back the entire transaction, using the following MySQL syntax:

    START TRANSACTION;
    INSERT Course VALUES (1, 'Biology 101');
    INSERT Course VALUES (2, 'Computer Science 101');
    ROLLBACK;

From the above MySQL syntax, you have ensured that the `Insert` statements have not committed (inserted) the data into the `Course` table until a `Commit` command is received. By issuing a `Rollback` statement, you have effectively undone the two prior `Insert` statements, and not Committed either of these two rows to the database.

 **Example #3**: Combining Commit and Rollback in a Transaction

The example below combines the ability to both Commit and Rollback transactions in the same transaction code block.

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

The MySQL code above inserts a row in the `Course` table with the next highest `CourseId`. Before committing the transaction, the code checks if there are more than one row where the `CourseName` is `Biology 101`. If yes, transaction is not committed to the database. At this point, the transaction rolls back and the code segment aborts from further processing. If it is the first instance of a `CourseName` of `Biology 101`, then the transaction proceeds, and eventually is committed to the database.

## More Benefits of Using Transactions

When should you use Transactions? Should you use all transactions all the time?

The simple answer is yes. This is especially true when you are dealing with multiple group of statements. It can be where all the statements in a sequence of statements must succeed for the associated data to be committed to the database. In this case, a failure of a component within the transaction necessitates a rollback.

Moreover, the use of transactions is extremely beneficial when you run the risk of things like power failures, server crashes, disk drive failure, database crashes, etc.

In the event of any of these failures, if transactions have not yet been committed, you are guaranteed to have maintained the integrity of the database. Without the use of transactions, any atomic statements that are applied to the database remain intact, regardless of whether associated statements have been executed, or not. This may result in a data integrity issue.

## Conclusion

SQL Transactional logic is a fundamental mechanism to ensure database integrity and minimize the amount of error control logic that is required in a multi-user database application. In short, the use of transactions in SQL environments guarantees accuracy and completeness.
