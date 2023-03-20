---
slug: how-to-work-with-mysql-subqueries
description: 'A subquery is an SQL query that is nested within another query. This guide shows how to use correlated subqueries, as well as subqueries as derived tables.'
keywords: ['MySQL', 'database', 'subqueries']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-04
modified_by:
  name: Linode
title: Working with MySQL Subqueries"
title_meta: "How to Work with MySQL Subqueries"
external_resources:
- '[MySQL Subqueries](https://dev.mysql.com/doc/refman/8.0/en/subqueries.html)'
authors: ["Francis Ndungu"]
---

A **subquery** is an SQL (Structured Query Language) query that is nested within another SQL query. The command that the subquery is nested in is referred to as the parent query. Subqueries are used to pre-process data that is used in the parent query. Subqueries can be applied in `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations.

When subqueries are executed, the subquery is processed first before the parent query. When building MySQL applications, using subqueries offers several advantages:

- They break the SQL statements into simple logical units, which can make them easier to understand and maintain. In other words, subqueries help isolate complex parts of queries.
- They eliminate the need for using complex [`UNION` statements](https://dev.mysql.com/doc/refman/8.0/en/union.html) and [`JOIN` statements](https://dev.mysql.com/doc/refman/8.0/en/join.html).
- They are used to enforce [referential integrity](https://en.wikipedia.org/wiki/Referential_integrity) in a scenario where foreign keys are not implemented.
- They help developers code business logic into the MySQL queries.

In this guide you will learn:

- How to [use a correlated subquery](#how-to-use-a-correlated-subquery)
- How to [use a correlated subquery in a comparison operator](#how-to-use-a-correlated-subquery-in-a-comparison-operator)
- How to [use a subquery as a derived table](#how-to-use-a-subquery-as-a-derived-table)

## Before You Begin

To follow along with this guide, make sure you have the following:

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  The MySQL server software (or MariaDB) installed on your Linode. Please refer to the [MySQL section](/docs/guides/databases/mysql/), which contains guides that describe how to install MySQL on several Linux distributions.

## Setting up the Database

To understand how subqueries work, create a sample database first. This sample database is used to run the different example queries in this guide:

1. `SSH` to your server and log in to MySQL as root:

        mysql -u root -p

    When prompted, enter the root password of your MySQL server and hit **Enter** to continue. Note that your MySQL server's root password is not the same as the root password for your Linode.

    {{< note respectIndent=false >}}
If your password is not accepted, you may need to run the previous command with `sudo`:

    sudo mysql -u root -p
{{< /note >}}

1.  If your password is accepted, you should see the MySQL prompt:

    {{< output >}}
mysql >
{{< /output >}}

    {{< note respectIndent=false >}}
If you are using MariaDB, you may see a prompt like the following instead:

    {{< output >}}
MariaDB [(none)]>
{{< /output >}}
{{< /note >}}

1.  To create a sample database named `test_db`, run:

        CREATE DATABASE test_db;

    You should see this output, which confirms that the database was created successfully:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Switch to the `test_db` database:

        USE test_db;

    You should see this output:

    {{< output >}}
Database changed
{{< /output >}}

1. You have created the `test_db` and selected it. Next, create a table named `customers`:

        CREATE TABLE customers
        (
        customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_name VARCHAR(50)
        ) ENGINE = InnoDB;

    You should see this output:

    {{< output >}}
Query OK, 0 rows affected (0.03 sec)
{{< /output >}}

1.  Add some records to the `customers` table. Run the below `INSERT` commands one by one:

        INSERT INTO customers(customer_name) VALUES ('JOHN PAUL');
        INSERT INTO customers(customer_name) VALUES ('PETER DOE');
        INSERT INTO customers(customer_name) VALUES ('MARY DOE');
        INSERT INTO customers(customer_name) VALUES ('CHRISTINE JAMES');
        INSERT INTO customers(customer_name) VALUES ('MARK WELL');
        INSERT INTO customers(customer_name) VALUES ('FRANK BRIAN');

    This output is shown after each record is inserted:

    {{< output >}}
Query OK, 1 row affected (0.00 sec)
...
{{< /output >}}

1.  Verify that the customers' information was inserted into the database. Execute this `SELECT` command:

        SELECT * FROM customers;

    You should see this list of customers:

    {{< output >}}
+-------------+-----------------+
| customer_id | customer_name   |
+-------------+-----------------+
|           1 | JOHN PAUL       |
|           2 | PETER DOE       |
|           3 | MARY DOE        |
|           4 | CHRISTINE JAMES |
|           5 | MARK WELL       |
|           6 | FRANK BRIAN     |
+-------------+-----------------+
6 rows in set (0.00 sec)
{{< /output >}}

1.  Create a `sales` table. This table uses the column `customer_id` to reference the `customers` table:

        CREATE TABLE sales
        (
        order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_id BIGINT,
        sales_amount DECIMAL(17,2)
        ) ENGINE = InnoDB;

    This output appears:

    {{< output >}}
Query OK, 0 rows affected (0.03 sec)
{{< /output >}}

1.  Next, populate the `sales` table with some records. Run the below `INSERT` commands one by one:

        INSERT INTO sales (customer_id, sales_amount) VALUES ('1','25.75');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('2','85.25');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('5','3.25');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('4','200.75');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('5','88.10');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('1','100.00');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('2','45.00');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('4','15.80');

    This output is shown after each record is inserted:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
...
{{< /output >}}

1.  Verify the data in the `sales` table. Execute this `SELECT` command:

        SELECT * FROM sales;

    This list of sales data should now be shown:

    {{< output >}}
+----------+-------------+--------------+
| order_id | customer_id | sales_amount |
+----------+-------------+--------------+
|        1 |           1 |        25.75 |
|        2 |           2 |        85.25 |
|        3 |           5 |         3.25 |
|        4 |           4 |       200.75 |
|        5 |           5 |        88.10 |
|        6 |           1 |       100.00 |
|        7 |           2 |        45.00 |
|        8 |           4 |        15.80 |
+----------+-------------+--------------+
8 rows in set (0.00 sec)
{{< /output >}}

After setting up the database and the related tables, you can now implement the different subqueries in MySQL.

## How to Use a Correlated Subquery

A correlated subquery is a type of nested query that uses the values from a parent query. These kinds of queries reference the parent query with a column. The nested query is executed once for each row in the parent query.

The example below presents a query that selects all customers. Inside the query, there is a correlated subquery that fetches the total sales amount for each customer from the `sales` table.

1.  Run the example query:

        SELECT
        customer_id,
        customer_name,
        (SELECT SUM(sales_amount)
        FROM sales WHERE customer_id = customers.customer_id) as total_sales_amount
        FROM
        customers;

    In this example, the subquery is `SELECT SUM(sales_amount) FROM sales WHERE customer_id = customers.customer_id`, which appears in parentheses.

    A list of the total sales made by customers appears:

    {{< output >}}
+-------------+-----------------+--------------------+
| customer_id | customer_name   | total_sales_amount |
+-------------+-----------------+--------------------+
|           1 | JOHN PAUL       |             125.75 |
|           2 | PETER DOE       |             130.25 |
|           3 | MARY DOE        |               NULL |
|           4 | CHRISTINE JAMES |             216.55 |
|           5 | MARK WELL       |              91.35 |
|           6 | FRANK BRIAN     |               NULL |
+-------------+-----------------+--------------------+
6 rows in set (0.00 sec)
{{< /output >}}

    The output above from the correlated subquery is able to give you a summarized list of the customers' orders. Please note, since `customer_id`s `3` and `6` do not have any associated records in the sales table, their `total_sales_amount` is `NULL`.

1. A more elegant way to present this list is to return `0` instead of `NULL` for the customers with zero sales. To do this, enclose the output generated by the subquery with an `IFNULL(expression, 0)` statement. Run this updated command:

        SELECT
        customer_id,
        customer_name,
        IFNULL((SELECT SUM(sales_amount)
        FROM sales WHERE customer_id = customers.customer_id), 0) as total_sales_amount
        FROM
        customers;

    The following output appears. MySQL returns 0.00 for all rows that would have otherwise returned `NULL` values.

    {{< output >}}
+-------------+-----------------+--------------------+
| customer_id | customer_name   | total_sales_amount |
+-------------+-----------------+--------------------+
|           1 | JOHN PAUL       |             125.75 |
|           2 | PETER DOE       |             130.25 |
|           3 | MARY DOE        |               0.00 |
|           4 | CHRISTINE JAMES |             216.55 |
|           5 | MARK WELL       |              91.35 |
|           6 | FRANK BRIAN     |               0.00 |
+-------------+-----------------+--------------------+
6 rows in set (0.00 sec)
{{< /output >}}

    This approach helps ensure that the output doesn't harm any further calculations on the records.

## How to Use a Correlated Subquery in a Comparison Operator

Subqueries are useful for moving business logic into the database query level. The following business use-cases feature correlated subqueries placed inside the WHERE clause of a parent query:

- Consider a scenario where you would like to get a list of all customers registered in the database that don't have associated sales. You can use a subquery together with the MySQL comparison operator `NOT IN` and retrieve these customers:

        SELECT
        customer_id,
        customer_name
        FROM
        customers
        WHERE customer_id NOT IN (SELECT customer_id FROM sales);

    In this example, the subquery is `SELECT customer_id FROM sales`, which appears in parentheses. The SQL command above outputs a list of two customers that are not found in the sales table:

    {{< output >}}
+-------------+---------------+
| customer_id | customer_name |
+-------------+---------------+
|           3 | MARY DOE      |
|           6 | FRANK BRIAN   |
+-------------+---------------+
2 rows in set (0.00 sec)
{{< /output >}}

    In a production environment, you can use this kind of recordset to make better business decisions. For instance, you can create a script using another language like PHP or Python to email these customers and enquire if they have a problem placing an order.

- Another use-case is in data clean-up. For example, you can use a subquery to delete customers that have never placed an order:

        DELETE
        FROM
        customers
        WHERE customer_id NOT IN (SELECT customer_id FROM sales);

    The SQL command above deletes the two customers and outputs the following:

    {{< output >}}
Query OK, 2 rows affected (0.01 sec)
{{< /output >}}

    If you execute a command to list all customers again, these customers should no longer appear in the table:

        SELECT *
        FROM
        customers;

    The output below confirms that the customers without associated orders were deleted:

    {{< output >}}
+-------------+-----------------+
| customer_id | customer_name   |
+-------------+-----------------+
|           1 | JOHN PAUL       |
|           2 | PETER DOE       |
|           4 | CHRISTINE JAMES |
|           5 | MARK WELL       |
+-------------+-----------------+
4 rows in set (0.00 sec)
{{< /output >}}

## How to Use a Subquery as a Derived Table

When subqueries are used in the `FROM` clause of a parent query, they are referred to as *derived tables*. They are very important when implementing complex queries that would otherwise require a MySQL `VIEW`, `JOIN`, or `UNION` clause. A derived table exists in the query that created it and is not permanently saved into the database.

When subqueries are used as derived tables, they isolate the different parts of the SQL statement. In other words, the subquery provides a simplified expression of a table that can be used within the scope of the parent query.

{{< note >}}
Remember, every derived table must be aliased.
{{< /note >}}

Run the command below to create a derived table subquery that is aliased as `order_summary`:

    SELECT customer_id
    FROM
        (
        SELECT
        customer_id,
        count(order_id) as total_orders
        FROM sales
        group by customer_id
        ) as order_summary
    WHERE order_summary.total_orders > 1;

{{< note >}}
In this command, the subquery appears in parentheses as:

    SELECT
    customer_id,
    count(order_id) as total_orders
    FROM sales
    group by customer_id
{{< /note >}}

The above command queries the sales table to determine customers with more than 1 order. When you run the query, this output appears:

{{< output >}}
+-------------+
| customer_id |
+-------------+
|           1 |
|           2 |
|           5 |
|           4 |
+-------------+
4 rows in set (0.00 sec)
{{< /output >}}

The above list shows four `customer_id`s that have more than one order. As an example business use-case, you can use such a query in a script that rewards customers with a bonus on their next purchase.
