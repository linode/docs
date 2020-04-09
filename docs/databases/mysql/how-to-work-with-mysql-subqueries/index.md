---
author:
  name: Francis Ndungu
  email: francisndungu83@gmail.com
description: 'In this tutorial, we will take you through the steps of creating and implementing different subqueries in MySQL database.'
keywords: ['MySQL', 'database', 'subqueries']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-08
modified_by:
  name: Linode
title: "How to Work with MySQL Subqueries"
contributor:
  name: Francis Ndungu
  link: https://twitter.com/francisndungu83
external_resources:
- '[MySQL Subqueries](https://dev.mysql.com/doc/refman/8.0/en/subqueries.html)'
---

A **subquery** is an SQL(Structured Query Language) statement that is nested within another SQL command referred to as the parent query. Subqueries are used to pre-process data that is used in the main outer query and can be applied in `SELECT`, `INSERT`, `UPDATE` and `DELETE` operations.

When nested queries are executed, the inner query is processed first before the outer query. When building MySQL applications, using subqueries offers several advantages:

- They break the SQL statements into simple logical units for easy understanding and maintenance. In other words, isolating complex parts of queries.
- They eliminate the need for using complex `UNION` and `JOIN` statements.
- They are used to enforce referential integrity in a scenario where foreign keys are not implemented.
- They offer greater flexibility by allowing developers to code some business logic into the MySQL queries.

This guide focuses on:

- How to [use a correlated subquery](/docs/databases/mysql/how-to-create-and-use-mysql_views/#how-to-use-a-correlated-subquery)
- How to [use a subquery in a comparison operator](/docs/databases/mysql/how-to-create-and-use-mysql_views/#how-to-use-a-subqueries-with-a-comparison-operator)
- How to [use a subquery as a derived table](/docs/databases/mysql/how-to-create-and-use-mysql_views/#how-to-use-a-subquery-as-derived-table)

## Before You Begin

To follow along with this guide, make sure you have the following:

1.  A fully provisioned Linode server. Please refer to the [Getting Started with Linode](/docs/getting-started/) guide to setup a Linode server.

1.  MySQL database server. You can follow the [MySQL section](/docs/databases/mysql/) to install and configure a MySQL server depending on your Linux distribution.

## Setting up the Database

To understand how subqueries work, you will set up a sample database and use it to run different queries. To do this:

1. `SSH` to your server and log in to MySQL as root:

        mysql -u root -p

    Enter your MySQL password(don't confuse this with the root password of your Linode server) when prompted and hit **Enter** to proceed.

1.  Ensure the MySQL prompt shown below is displayed before you start typing the SQL commands:

    {{< output >}}
mysql >
{{< /output >}}

1.  Then, to create a working database named `test_db`, run the command below:

        CREATE DATABASE test_db;

    You should get the below output to confirm that the database was created successfully.

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Next,  switch to the `test_db` database:

        USE test_db;

    Once the database is selected, MySQL server should display the output below:

    {{< output >}}
Database changed
{{< /output >}}

1. You have created the `test_db` and selected it. Next, create the first table named `customers`:

        CREATE TABLE customers
        (
        customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_name VARCHAR(50)
        ) ENGINE = InnoDB;

    Ensure the following output is displayed to confirm the table was created:

    {{< output >}}
Query OK, 0 rows affected (0.03 sec)
{{< /output >}}

1.  Next, add some records to the `customers` table by running the commands below:

        INSERT INTO customers(customer_name) VALUES ('JOHN PAUL');
        INSERT INTO customers(customer_name) VALUES ('PETER DOE');
        INSERT INTO customers(customer_name) VALUES ('MARY DOE');
        INSERT INTO customers(customer_name) VALUES ('CHRISTINE JAMES');
        INSERT INTO customers(customer_name) VALUES ('MARK WELL'); 
        INSERT INTO customers(customer_name) VALUES ('FRANK BRIAN');     

1.  After each record is inserted, you will see the following output:

    {{< output >}}
Query OK, 1 row affected (0.00 sec)
...
{{< /output >}}


1.  To verify if the customers' information was inserted into the database, execute the `SELECT` command below:

        SELECT * FROM customers;

1.  You should see a list of customers as shown below:

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

1.  The next step is creating a `sales` table. This table will use the column `customer_id` to reference to the `customers` table:

        CREATE TABLE sales
        (
        order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_id BIGINT,
        sales_amount DECIMAL(17,2)
        ) ENGINE = InnoDB;

1.  Once the command above is executed, ensure you get the output below:

        {{< output >}}
Query OK, 0 rows affected (0.03 sec)
{{< /output >}}

1.  Next, populate the `sales` table with some records by running the SQL statements below :

        INSERT INTO sales (customer_id, sales_amount) VALUES ('1','25.75');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('2','85.25');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('5','3.25');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('4','200.75');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('5','88.10');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('1','100.00');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('2','45.00');
        INSERT INTO sales (customer_id, sales_amount) VALUES ('4','15.80');     

1.  After the records are inserted to the `sales` table, you will see the below output:

        {{< output >}}
Query OK, 1 row affected (0.01 sec)
...
{{< /output >}}

1.  Verify the data in the `sales` table by running the command below:

        SELECT * FROM sales;

1.  The list of sales data should now be listed as shown below:

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

1.  After setting up the database and the related tables, you'll now implement the different subqueries in MySQL. 

## How to use a Correlated Subquery

1.  A correlated subquery is a type of nested query that uses the values from the outer query. These kinds of queries reference the parent query with a column. This means that the inner query is executed once for each row in the main query. 

1.  In the example below, you will run an outer query that selects all customers. Inside the query, there is a correlated subquery that fetches the total sales amount for each customer from the `sales` table.

1.  To run the correlated subquery, type the command below:

        SELECT
        customer_id,
        customer_name,
        (SELECT SUM(sales_amount)
        FROM sales WHERE customer_id = customers.customer_id) as total_sales_amount
        FROM
        customers;

1.  You should get the output below that lists the total sales made by customers:

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

1.  The output above from the correlated subquery is able to give you a summarized list of the customers' orders. Please note, since customer_id `3` and `6` do not have any associated records in the sales table, their `total_sales_amount` is `NULL`.

1. A more elegant way re-write the code and return `0` instead of `NULL` values for the customers with zero sales is to enclose the output generated by the subquery with an `IFNULL(expression, 0)` statement as shown below. 

1. Run the code one more time by typing the command below:

        SELECT
        customer_id,
        customer_name,
        IFNULL((SELECT SUM(sales_amount)
        FROM sales WHERE customer_id = customers.customer_id), 0) as total_sales_amount
        FROM
        customers;

1. As you can see below, MySQL returns 0.00 for all rows that would have otherwise returned `NULL` values. This approach ensures that the output doesn't harm your calculation if you are processing the records further:

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

1. You have seen how a correlated subquery works. Next, you will learn how to implement subqueries with comparison operators.  
## How to Use a Subquery in a Comparison Operator

1. As mentioned earlier in this guide, subqueries are great when it comes to moving some business logic into the database query level. For instance, consider a scenario where you would like to get a list of all customers registered in the database that don't have associated sales.

1. In such a case, you can use a subquery together with the MySQL comparison operator `NOT IN` and retrieve these customers.

1. To do this, run the command below:

        SELECT
        customer_id,
        customer_name    
        FROM
        customers
        WHERE customer_id NOT IN (SELECT customer_id FROM sales);

1. The output below list two customers that are not found in the sales table:

        {{< output >}}
+-------------+---------------+
| customer_id | customer_name |
+-------------+---------------+
|           3 | MARY DOE      |
|           6 | FRANK BRIAN   |
+-------------+---------------+
2 rows in set (0.00 sec)
{{< /output >}}

1. In a production environment, you can use this kind of recordset to make solid business decisions. For instance, you can create a script using another language like PHP or Python to email these customers and enquire if they have a problem placing an order.

1. Another use-case is in data clean-up. You can use such a subquery to delete customers that have never placed an order. 

1. You can try this example by running the command below:

        DELETE
        FROM
        customers
        WHERE customer_id NOT IN (SELECT customer_id FROM sales);

1. The SQL command above deletes the two customers and outputs the following:

        {{< output >}}
Query OK, 2 rows affected (0.01 sec)
{{< /output >}}

1. If you execute a command to list all customers again, these customers should no longer appear in the table:

        SELECT *  
        FROM
        customers;

1. The output below confirms that the customers without associated orders were deleted:

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

1. This section has shown you how to use subqueries with MySQL comparison operators. Next, you'll  use subqueries as derived tables to make some business logic with the SQL commands.

## How to Use a Subquery as a Derived Table

1.  When subqueries are used in the `FROM` clause, they are referred to as derived tables. They are very important when implementing complex queries that would otherwise require a MySQL `VIEW`, `JOIN` or a `UNION` clause. A derived table exists in the query that created it and is not permanently saved into the database.

1.  When subqueries are used as derived tables, they isolate the different parts of the SQL statement. In other words, when a subquery is used as a derived table, it provides a simplified expression of a table that can be used within the scope of the main query.

1.  Remember, every derived table must be aliased. 

1.  Run the command below to create a derived table subquery aliased  as`order_summary`:

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

1.  The above command queries the sales table to determine customers with more than 1 order. Once you run the query, you will get the output below:

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

1.  The above list shows 4 `customer_id's` that have more than 1 order and it's working as expected. You can use such a query in a script that rewards customers with a bonus next time when they make a purchase.
