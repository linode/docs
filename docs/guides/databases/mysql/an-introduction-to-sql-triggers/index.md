---
slug: an-introduction-to-sql-triggers
author:
  name: Doug Hayman for NanoHertz Solutions Inc.
  email: docs@linode.com
description: 'In this guide you learn about SQL Triggers and special datbase objects associated with Triggers.'
keywords: ['referential integrity', 'primary foreign keys', 'special database objects', 'trigger statements']
tags: ['MySQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-18
modified_by:
  name: Linode
title: "An Introduction to SQL Triggers"
h1_title: "SQL Triggers: An Overview"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
---

One of the most important tools in SQL is *SQL Triggers*, which are a special type of stored procedure that can be associated with a table and a SQL data modification operation such as **Insert**, **Update**, or **Delete**. Triggers can be used to cause some action to occur whenever a data change takes place on a table. Additionally, a trigger can cause cascading changes from one table to another to enforce referential integrity, which is a key concept in database design.

In this guide, you understand SQL Triggers in detail and how they work.

## Referential Integrity

An important concept for SQL Triggers is *referential integrity*.

A referential integrity is a restriction or constraint in the database that enforces the relationship between two tables. It requires that the values in a foreign key column must either be present in the primary key, referenced by the foreign key or must be null.

By default, database servers ensures that you do not violate the referential integrity. Inherently, there are no provisions in most database server implementations for cascading key changes and deletion of child rows, when a parent row is removed from a table. This is where triggers can be defined to fill this void.

## Primary and Foreign Key

To understand referential integrity, it is important to understand the distinction between a primary and foreign key.

A primary key is a relational database table column (or combination of columns) designated to uniquely identify each table record. Primary keys must contain unique values, and cannot contain NULL values. A table cannot have more than one primary key.

A foreign key is the column (or combination of columns) whose values must match that of a primary key in some other table. They effectively act as a cross-reference between the tables.

## Primary/Foreign Key Example

To better understand this concept, consider a database that consists of `Customer`, `Order`, and `OrderItem` tables. An SQL Server example of a Primary Key (PK) and Foreign Key (FK) definitions are as follows:

    CREATE TABLE Customer (
      CustomerId INT NOT NULL PRIMARY KEY,
      LastName   VARCHAR(50) NOT NULL,
      FirstName  VARCHAR(30) NOT NULL
    );

    CREATE TABLE Order (
      OrderId INT NOT NULL PRIMARY KEY,
      CustomerId INT FOREIGN KEY REFERENCES Customer(CustomerId),
      OrderItemId NOT NULL FOREIGN KEY REFERENCES OrderItem(OrderItemId)
    );

    CREATE TABLE OrderItem (
      OrderItemId INT NOT NULL PRIMARY KEY,
      OrderItemDescription VARCHAR(255)
    );

The key associations between the three tables can be represented as shown described below:

| Customer        | Order           | OrderItem               |
| --------------- |-----------------| ------------------------|
| CustomerId (PK) | OrderId(PK)     | OrderItemId(PK)         |
| LastName        | CustomerId(FK)  | OrderItemDescription    |
| FirstName       | OrderItemId(FK) |

From the `Customer` table definition above, `CustomerId` is a unique value associated with each customer (row) in the `Customer` table. Hence, `CustomerId` is defined as a Primary Key for the `Customer` table.

In the `OrderItem` table, the `OrderItemId`, the primary key, is a unique value associated with each order item (row) in the `OrderItem` table.

Similarly, `OrderId`, the primary key, is a unique value associated with each order (row) in the `Order` table. `CustomerId` in the `Order` table is designated as a foreign key since its value directly maps to the primary key, `CustomerId` in the `Customer` table. `OrderItemId` in
`Order` table is also designated as a foreign key since its value directly maps to the primary key in the `OrderItem` table.

{{< note >}}
The syntax for defining primary keys and foreign keys is slightly different in MySQL but identical in concept. Please consult the [MySQL reference manual](https://dev.mysql.com/doc/refman/8.0/en/ansi-diff-foreign-keys.html) for the subtle syntactical differences.
{{</ note >}}

## What are Triggers?

To preserve the integrity of a database in terms of maintaining table relationships that have (key) associations, Triggers are utilized. A database Trigger takes the form of procedural code that is automatically executed in response to certain events on a particular table or view in a database. Again, the Trigger is almost exclusively used for maintaining the integrity of the information in the database.

Triggers can be defined to run instead of or after Data Manipulation Language (DML) actions such as Insert, Update, and Delete statements.

For example, in the three table model above, if a particular customer row (referenced by `CustomerId`) is deleted from the `Customer` table, any reference (row) to that `CustomerId` in the `Order` table would also have to be deleted as well. This maintains the integrity of the database. Failure removing the associated record (row) in the `Order` table would violate the integrity of the database. This is because the `CustomerId` would be referenced in the `Order` table without having a corresponding record in `Customer` table. This is referred to as a *dangling record*.

## Types of Triggers

Two types of Triggers are implemented in most commercial relational database systems:

1. **INSTEAD OF trigger (also known as Before Trigger):**

   *INSTEAD OF* trigger, as their name implies, allows you to skip the DML statements (typically, `Insert`, `Update`, or `Delete`) and execute other statements. Things to be cognizant of when using `Instead Of` triggers include:

   - An `Instead Of` trigger always overrides the triggering action. If an `Instead Of` trigger is defined to execute on an `INSERT` statement, then once the `INSERT` statement is executed, control is immediately passed to the `Instead Of` trigger. This effectively overrides the `Insert` statement.

   - At most, one `Instead Of` trigger can be defined per action for a given table.

1. **After Trigger:**

   The `After Trigger` is fired after the execution of the DML action. Following are some of the key features of the `After Trigger`:

   - The After triggers are executed after the DML statements (`Insert`, `Update`, and `Delete`) completes it execution, this trigger is fired.
   -  A database action cannot be canceled using an `After Trigger`. This is due to the action having already been completed.
   - One or more `After Triggers` per action can be defined on a table, but having more than one adds to the complexity of code maintenance.
   - After triggers cannot be defined on database Views.

## Special Database Objects Associated With Triggers

Triggers use two special database objects, `INSERTED` and `DELETED`, to access rows affected by the database actions. Within the scope of a trigger, the `INSERTED` and `DELETED` objects have the identical columns as the affected trigger’s table. These database objects can
be referenced as tables within the confines of the trigger code logic.

The `INSERTED` table contains all the new values; whereas, the `DELETED` table contains old, removed values. These special database objects can be used as follows:

1. An `Insert` trigger - The `INSERTED` table determines which rows were added to the affected table.
1. A `Delete` trigger - The `DELETED` table determines which rows were removed from the affected table.
1. An `Update` trigger - The `INSERTED` table is used to view the new or updated values of the affected table, and the `DELETED` table is used to view the values prior to the `Update`.

## Create Trigger Statement

The basic SQL Server syntax for creating an `Instead Of` (Before) trigger is as follows:

     CREATE TRIGGER <InsteadOfTriggerName>
     ON <TableName>
     INSTEAD OF {[INSERT],[UPDATE],[DELETE]}
     /* Either Insert, Update, or Delete specified */
     AS
     BEGIN
           <series sql code statements>
     END;

The basic SQL Server syntax for creating an `After Trigger` is as follows:

    CREATE TRIGGER <AfterTriggerName>
    ON <TableName>
    AFTER {[INSERT],[UPDATE],[DELETE]}
    /* Either Insert, Update, or Delete specified */
    AS
    BEGIN
         <series sql code statements>
    END;

{{< note >}}
There are some subtle syntax differences for MySQL (and other database systems) when creating triggers, but the concept is identical. Please consult the [MySQL reference manual](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html) for the subtle syntactical differences.
{{</ note >}}

## Trigger Examples

**Example #1:**

Using the three table example above, create an `After Delete` trigger on the `Customer` table. If a record is deleted from the `Customer` table, any `Order` table rows that contain that `CustomerId` is also deleted. This ensures that the database referential integrity is maintained and that you cannot have any extraneous rows (with non-existent customers) remaining in the `Order` table.

    CREATE TRIGGER AfterCustomerDeleteTrigger
    ON             Customer
    AFTER DELETE
    AS
    BEGIN
        DELETE FROM   Order
        WHERE DELETED.CustomerId = Order.CustomerId
    END;

{{< note >}}
The `After Trigger` is called when you delete one (or more) customers from the `Customer` table. The special database object `DELETED` is used to obtain the customer Id (or customer Id’s, if many customers are deleted), and to delete the requisite record(s) in the `Order` table, that contain the Customer Id (or Customer Id’s, in the case of many customers).
{{</ note >}}

**Example #2:**

Create an `Instead Of` Insert trigger on the `OrderItem` table, that checks to ensure that the `OrderItemDescription` is not already existing in the table. If it exists, roll back the `Insert` transaction and if not, insert a row into that table. Following is the definition and code for this example:


    CREATE TRIGGER InsteadOfOrderItemInsertTrigger
    ON OrderItem
    INSTEAD OF INSERT
    AS
    BEGIN
         DECLARE @OrderItemId INT,
                 @OrderItemDescription VARCHAR(255)

         SELECT @OrderItemId = INSERTED.OrderItemId,
                @OrderItemDescription = INSERTED.OrderItemDescription
         FROM INSERTED

         IF (EXISTS(SELECT  OrderItemDescription
                    FROM OrderItem
                    WHERE OrderItemDescription = @OrderItemDescription))
        BEGIN
             ROLLBACK
        END
        ELSE
            BEGIN
                INSERT INTO OrderItem
                VALUES (@OrderItemId, @OrderItemDescription)
            END
    END;

{{< note >}}
In this example, the `Instead Of` trigger is called whenever you attempt to insert a record into the `OrderItem` table. The special database object `INSERTED` is used to obtain the inserted `OrderItemId` and `OrderItemDescription`. If `OrderItemDescription` already exists in the `OrderItem` table, roll back the transaction (and refuse the insert); otherwise, insert the record, which was the actual intent before the `Instead Of` trigger was executed.
{{</ note >}}


## Conclusion

SQL triggers are valuable code segments that can be applied either before/after an `Insert`, `Update`, or `Delete` statement is executed on a given table to ensure that referential integrity is maintained in a database. Additionally, when triggers are employed, the use of the `INSERTED`
and `DELETED` special database objects can be used within the logic of the SQL trigger.
