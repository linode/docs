---
slug: sql-triggers-sql-server-overview
description: This guide explains SQL trigger statements, special database objects, and how to enforce referential integrity for primary/foreign key relationships with them.
keywords:
  - referential integrity
  - primary foreign keys
  - special database objects
  - trigger statements
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)"
published: 2023-01-17
modified_by:
  name: Linode
title_meta: An Introduction to SQL Triggers in SQL Server
title: "SQL Triggers in SQL Server: An Overview"
authors: ["Doug Hayman for NanoHertz Solutions Inc."]
---

## What are Triggers?

*SQL triggers* are a special type of stored procedure that are executed when a data change takes place on a table. When they are declared, triggers are associated with a specific table and with a SQL data modification operation such as `INSERT`, `UPDATE`, or `DELETE`. Triggers can be implemented for different use cases, including:

- logging

- data validation

- calculating derived data

- enforcing referential integrity

For example, the basic syntax for creating a trigger that runs after a `DELETE` operation on a table is as follows:

```file
CREATE TRIGGER AfterTriggerName
ON TableName
AFTER DELETE
AS
BEGIN
    /* Series SQL code statements */
END;
```

This guide shows how to work with [triggers in SQL Server](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-trigger-transact-sql?view=sql-server-ver16). There are some syntax differences for MySQL (and other database systems) when creating triggers, but the concepts are similar. Please consult the [MySQL reference manual](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html) if working with MySQL triggers.

## In this Guide

Before showing how to use triggers in SQL Server, the first sections of this guide describe some basic database concepts that are needed to explain triggers:

- [Primary and foreign keys](#primary-and-foreign-keys) are described, and [an example database schema](#primaryforeign-keys-example) is introduced to show how they can create associations between tables.

- [Referential integrity](#referential-integrity) is defined. This section describes why triggers are sometimes used to maintain referential integrity.

After introducing these concepts, the later sections of this guide show how to work with triggers:

- The different [types of triggers](#types-of-triggers) are described.

- The [special database objects](#special-database-objects-associated-with-triggers) `INSERTED` and `DELETED` are explained.

- The [`CREATE TRIGGER` syntax](#create-trigger-statements) is introduced.

- Examples of how to work with an [`INSTEAD OF` trigger](#instead-of-trigger-example) and an [`AFTER` trigger](#after-trigger-example) are shown.

## Primary and Foreign Keys

To understand the examples of triggers later in this guide, it is important to understand the distinction between primary and foreign keys:

- In a relational database, a *primary key* is a table column that uniquely identifies each record in a table. Primary keys must contain unique values. They cannot contain NULL values. A table cannot have more than one primary key.

- A *foreign key* is a column that associates a record in a table with another record in a different table. The value of the foreign key matches the value of the primary key of the associated record. Foreign keys act as a cross-reference between tables.

## Primary/Foreign Keys Example

Consider a database that consists of `Customer`, `Order`, and `OrderItem` tables. The primary keys in the table schemas are denoted with `PK`, and the foreign keys are denoted with `FK`:

| Customer        | Order            | OrderItem               |
|-----------------|------------------|-------------------------|
| CustomerId (PK) | OrderId (PK)     | OrderItemId (PK)        |
| LastName        | CustomerId (FK)  | OrderItemDescription    |
| FirstName       | OrderItemId (FK) |

- In this schema, a Customer may have multiple Orders associated with them. The `CustomerId` foreign key of an Order associates it with a record in the Customer table. An Order can only be associated with a single Customer.

- Similarly, each Order is associated with a single OrderItem, via the `OrderItemId` foreign key. An OrderItem can be appear in multiple Orders.

The SQL Server syntax for creating these tables is as follows:

```file
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
```

The primary key of each table is unique for each record in the table. This schema *does not* ensure that the values of other columns are unique. For example, there may be two different OrderItems with the same `OrderItemDescription`. If you want these values to be unique, you can use a trigger to enforce that condition. The [`INSTEAD OF` Trigger Example](#instead-of-trigger-example) section later in this guide shows how to implement this use case.

## Referential Integrity

Another use case for triggers is enforcing *referential integrity* in a database. An implementation of this use case is shown in the [`AFTER` Trigger Example](#after-trigger-example) section later in this guide.

Referential integrity refers to the integrity of the primary/foreign key relationships between tables. For example:

1.  In the [Primary/Foreign Key Example](#primaryforeign-keys-example) section, a Customer may be associated with one or more Orders.

1.  For each of a Customer's Orders, the `CustomerId` foreign key of the Order references the `CustomerId` primary key of the Customer.

1.  If a Customer is deleted, then the `CustomerId` foreign key for those Orders no longer references a record in the database. In this circumstance, referential integrity is violated.

For SQL Server databases, referential integrity can be ensured by setting a *constraint*. A constraint tells the database what to do when an update or delete operation would violate referential integrity. There are four possible constraints that can be set:

- `NO ACTION`: The database raises an error and does not complete the delete or update operation. This is the default constraint for SQL Server.

- `CASCADE`: When a record is deleted, records in another table that reference it via a foreign key are also deleted. If there are any records in a third table reference those cascade-deleted records in the second table, then the cascade is also propagated to that third table and those records are deleted. This cascade chain can continue in this manner.

- `SET NULL`: When a record is deleted, the foreign key of any other records that reference it is set to `NULL`.

- `SET DEFAULT`: When a record is deleted, the foreign key of any other records that reference it is set to the default value for the column.

Although constraints can be used to ensure referential integrity, it is sometimes useful to use a trigger to maintain integrity instead. In particular, a trigger can execute statements that work around limitations of the constraints listed above. For example:

- The `CASCADE` constraint is limited to cascading changes to a single referencing table.

- In other words, if there are two child tables that both directly reference the same parent table with a foreign key, then `CASCADE` cannot propagate changes to both children.

- In this scenario, a trigger can be used instead to update or delete records in the child tables when the parent table is changed.

## Types of Triggers

Two types of triggers are available for SQL Server:

-   `INSTEAD OF` trigger:

    The `INSTEAD OF` trigger allows you to bypass `INSERT`, `UPDATE`, or `DELETE` Data Manipulation Language (DML) statements and execute other statements instead. An `INSTEAD OF` trigger always overrides the triggering action. One `INSTEAD OF` trigger can be defined per `INSERT`, `UPDATE`, or `DELETE` action for a given table.

    {{< note >}}
    MySQL does not have an `INSTEAD OF` trigger. [The `BEFORE` trigger](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html) is available to execute similar (but not identical) logic for MySQL databases.
    {{< /note >}}

-   `AFTER` trigger:

    The `AFTER` trigger is fired after the execution of a DML action. An `AFTER` trigger is only run if the action that triggered it succeeds. `AFTER` triggers cannot be defined on database Views. One or more `AFTER` triggers per `INSERT`, `UPDATE`, or `DELETE` action can be defined on a table, but having more than one can increase your database code complexity.

## Special Database Objects Associated With Triggers

Triggers use two special database objects, `INSERTED` and `DELETED`, to access rows affected by database changes. These database objects can be referenced as tables within the scope of a trigger's code. The `INSERTED` and `DELETED` objects have the same columns as the affected table.

The `INSERTED` table contains all the new values from the action that caused the trigger to run. The `DELETED` table contains old, removed values from the action. The `INSERTED` and `DELETED` tables are available for different triggers as follows:

- Triggers for `INSERT` actions: The `INSERTED` table determines which rows were added to the affected table.

- Triggers for `DELETE` actions: The `DELETED` table determines which rows were removed from the affected table.

- Triggers for `UPDATE` actions: The `INSERTED` table is used to view the new or updated values of the affected table. The `DELETED` table is used to view the values prior to the `UPDATE` action.

## Create Trigger Statements

The basic SQL Server syntax for creating an `AFTER` trigger is as follows:

```file
CREATE TRIGGER <AfterTriggerName>
ON <TableName>
AFTER {[INSERT],[UPDATE],[DELETE]}
/* Either INSERT, UPDATE, or DELETE specified */
AS
BEGIN
    /* Series SQL code statements */
END;
```

The basic SQL Server syntax for creating an `INSTEAD OF` trigger is as follows:

```file
CREATE TRIGGER <InsteadOfTriggerName>
ON <TableName>
INSTEAD OF {[INSERT],[UPDATE],[DELETE]}
/* Either INSERT, UPDATE, or DELETE specified */
AS
BEGIN
    /* Series SQL code statements */
END;
```

## AFTER Trigger Example

This example shows how to maintain referential integrity for the tables defined in the [Primary/Foreign Keys Example](#primaryforeign-keys-example) section. In particular, the trigger code below deletes a Customer's Orders whenever a Customer record is deleted. This trigger is executed when one (or more) records are deleted from the `Customer` table:

```file
CREATE TRIGGER AfterCustomerDeleteTrigger
ON             Customer
AFTER DELETE
AS
BEGIN
    DELETE FROM   Order
    WHERE DELETED.CustomerId = Order.CustomerId
END;
```

- The name of the new trigger is defined on line 1 as `AfterCustomerDeleteTrigger`.

- Lines 2 and 3 associate the trigger with the `Customer` table and with the `AFTER DELETE` operation.

- Lines 6 and 7 delete the associated Order records. The special database object `DELETED` is used to obtain the `customerId` of the deleted Customer.

## INSTEAD OF Trigger Example

This example shows how to validate new records created for the tables defined in the [Primary/Foreign Keys Example](#primaryforeign-keys-example) section. In particular, the trigger code below ensures that every record in the `OrderItem` table has a unique `OrderItemDescription` value. This trigger is executed when one (or more) records are inserted into the `OrderItem` table:

```file
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
```

- The name of the new trigger is defined on line 1 as `InsteadOfOrderItemInsertTrigger`.

- Lines 2 and 3 associate the trigger with the `OrderItem` table and with the `INSTEAD OF INSERT` operation. Whenever an `INSERT` statement would be executed on the `OrderItem` table, this trigger is executed instead. The normal `INSERT` action is *not* executed.

- Lines 6-11 retrieve the new `OrderItemId` and `OrderItemDescription` values that would have been inserted by the `INSERT` action. The special database object `INSERTED` is used to obtain these values.

- Lines 13-15 check if the new `OrderItemDescription` value already exists for a record in the `OrderItem` table.

- Lines 16-18 prevent a change to the database if the new `OrderItemDescription` already exists.

- Lines 19-23 insert the new `OrderItemId` and `OrderItemDescription` into the `OrderItem` table if the `OrderItemDescription` does not exist in the table yet. These lines are needed because the original `INSERT` action that caused this `INSTEAD OF` trigger to run is not actually executed.

## Conclusion

In SQL Server, triggers are code segments that can be executed either **instead of** or **after** an `INSERT`, `UPDATE`, or `DELETE` statement. Triggers are associated with a table when they are defined. Within the scope of a trigger, the `INSERTED` and `DELETED` special database objects can be used to access the new or deleted database data. Triggers can be implemented for different use cases, including logging, data validation, calculating derived data, and enforcing referential integrity.
