---
author:
  name: Francis Ndungu
  email: francisndungu83@gmail.com
description: 'In this guide, we will show you how to create, invoke and delete views in MySQL database.'
keywords: ['mysql','database','views']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-08
modified_by:
  name: Linode
title: "How to Use Views in MySQL Database"
contributor:
  name: Francis Ndungu
  link: https://twitter.com/francisndungu83
external_resources:
- '[MySQL - Using Views](https://dev.mysql.com/doc/refman/8.0/en/views.html)'
---

A *view* in MySQL is a named query that can be triggered to display data stored in other tables. In simple terms, views are user-defined virtual tables.

Since views are SQL definitions built on top of other tables, they are mainly used to:

- Enhance database security: If your database contains sensitive information that needs to be highly secure, using a view helps you to isolate the data by granting users access only to the view which has the predefined result set.
- Move some complex business logic to the database server: Instead of coding frequently used software logic in different clients, a developer can move the logic in the database level using a view(e.g. a view to display customer classifications depending on the total sales).
- Reducing data distraction: A view can combine results from different tables and only display the relevant columns when invoked.

So, if you are planning to simplify your complex queries and make your application logic consistent on top of having a tight layer of security, you should use MySQL views. 

In this guide, we will take you through:

- How the [syntax of a MySQL view](/docs/databases/mysql/how-to-create-and-use-mysql_views/#the-mysql-view-syntax) is structured
- How to [create a MySQL view](/docs/databases/mysql/how-to-create-and-use-mysql_views/#creating-a-mysql-view).
- How to [invoke a MySQL view](/docs/databases/mysql/how-to-create-and-use-mysql_views/#invoking-a-mysql-view).
- How to [drop a view in MySQL](/docs/databases/mysql/how-to-create-and-use-mysql_views/#dropping-a-mysql-view). 

## Before You Begin

Make sure you have set up the following:

1.  A Linode server. You can follow the [Getting Started with Linode](/docs/getting-started/) guide to configure a Linode server.

1.  A MySQL database server. Please refer to the [MySQL section](/docs/databases/mysql/) to set up a database depending with your distribution.

## Preparing the Database

For the basis of this guide, we will create a sample database, define a few tables and populate them with some data.

1.  First, `SSH` to your Linode server and type the command below to log in to MySQL as a root user:

        mysql -u root -p

    When prompted, enter the root password of your MySQL server and hit **Enter** to continue.

1.  You should get the MySQL prompt as shown below:

    {{< output >}}
mysql >
{{< /output >}}

1.  Next, run the SQL commands below to create  a `sample_database`:

        CREATE DATABASE sample_database;

1.  The output below should confirm that the database was created successfully.

    {{< output >}}
Query OK, 1 row affected (0.02 sec)
{{< /output >}}

1.  Select the `sample_database` database:

        USE sample_database;

1.  Ensure the database is switched by confirming the output below:

        {{< output >}}
Database changed
{{< /output >}}

1. Next, run the command below to create a `customers` table:

        CREATE TABLE customers
        (
        customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_name VARCHAR(50)
        ) ENGINE = InnoDB;

1. You should now see the output shown below:

        {{< output >}}
Query OK, 0 rows affected (0.07 sec)
{{< /output >}}

1.  Next, populate the `customers` table with three records by running the below `INSERT` commands one by one:

        INSERT INTO customers (customer_name) VALUES ('JOHN DOE');
        INSERT INTO customers (customer_name) VALUES ('MARY ROE');
        INSERT INTO customers (customer_name) VALUES ('RICHARD ROE');

1.  You will get the output shown below after each record is inserted:

        {{< output >}}
Query OK, 1 row affected (0.08 sec)
...
{{< /output >}}

1.  Ensure the sample records were inserted into the database by running the `SELECT` command below:

        SELECT * FROM customers;

1.  The customers' list below confirms that the data was inserted successfully:

        {{< output >}}
+-------------+---------------+
| customer_id | customer_name |
+-------------+---------------+
|           1 | JOHN DOE      |
|           2 | MARY ROE      |
|           3 | RICHARD ROE   |
+-------------+---------------+
3 rows in set (0.01 sec)
{{< /output >}}

1. Next, create a `sales` table:

        CREATE TABLE sales
        (
        customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        monthly_sales DECIMAL(17,2)
        ) ENGINE = InnoDB;

1. Ensure you get the below output:

        {{< output >}}
Query OK, 0 rows affected (0.07 sec)
{{< /output >}}

1.  Then, run the following commands to add some data to the `sales` table :

        INSERT INTO sales (customer_id, monthly_sales) VALUES ('1','500.27');
        INSERT INTO sales (customer_id, monthly_sales) VALUES ('2','7600.32');
        INSERT INTO sales (customer_id, monthly_sales) VALUES ('3', '25879.63');

1.  After inserting each sales record, you will get the following output:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
...
{{< /output >}}


1.  Next, run a `SELECT` query to verify if the sales data was inserted into the table:

        SELECT * FROM sales;

1.  The output below should confirm the sales data:

        {{< output >}}
+-------------+---------------+
| customer_id | monthly_sales |
+-------------+---------------+
|           1 |        500.27 |
|           2 |       7600.32 |
|           3 |      25879.63 |
+-------------+---------------+
3 rows in set (0.00 sec)
{{< /output >}}

1.  You have defined the database and the tables to work on. Next, you'll see the syntax of a MySQL view.

## The MySQL View Syntax

1.  Below is a simplified version of the MySQL view syntax:

        CREATE
        VIEW view_name
        AS select_statement

    - `view_name`: The name of the MySQL view must be defined here. It is advisable to use a descriptive name so that you can remember the function of the view later.
    - `select_statement`: This is the SQL query that is coupled with the defined view. When the view is invoked, MySQL will run this query to return a recordset.

1.  After looking at the general and simplified syntax of the MySQL view, the next step is creating the first view.

## Creating a MySQL View

1. In this section, you will create the first MySQL view. This view will be used to classify customers depending on the number of monthly sales. Ensure you are logged in to the MySQL server.

1.  Then, run the command below to create a `customers_membership` view:
   
        CREATE 
        VIEW customers_membership 
        AS SELECT sales.customer_id, 
        customer_name,
        (IF(sales.monthly_sales >= 5000, 'PREMIUM', 'BASIC')) as membership
        FROM sales
        LEFT JOIN customers
        ON sales.customer_id = customers.customer_id;  

1.  If the view is created successfully, you should get the output shown below:

        {{< output >}}
Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

1.  In the above MySQL command, you have created a view named `customers_membership` that joins the `customers` and `sales` table with the `PRIMARY KEY` `customer_id`. Then, you've used the logical `IF(expression, value_if_true, value_if_false)` statement logic to determine the membership of the customer depending on their monthly sales. 

1.  If a customer's sales are equal or above `5,000`, the view classifies the customer as a `PREMIUM` member, otherwise(if the sales are below `5,000`), the customer is ranked as a `BASIC` member. The `customers_membership` view is now saved to the database. Next, you will learn to call a MySQL view and display a recordset without querying the base tables directly.

## Invoking a MySQL View

1.  In this step, you will invoke the MySQL view you created above and see if it will work as expected. Once a view is created, it is visible as a database object and it can be called using the `SELECT` statement. 

1.  To invoke the `customers_membership` view, run the command below:

        SELECT * FROM customers_membership;

1.  If the view is working as expected, you should now get a list of customers together with the generated `membership` column based on their sales as shown below:

        {{< output >}}
+-------------+---------------+------------+
| customer_id | customer_name | membership |
+-------------+---------------+------------+
|           1 | JOHN DOE      | BASIC      |
|           2 | MARY ROE      | PREMIUM    |
|           3 | RICHARD ROE   | PREMIUM    |
+-------------+---------------+------------+
3 rows in set (0.00 sec)
{{< /output >}}

1.  As you can see above, the `customers_membership` has classified the customers as you expected. Since JOHN DOE's sales were below 5000 (500.27), the view outputs the customer's membership as `BASIC`.

1.  Next, `MARY ROE` AND `RICHARD ROE` sales were 7600.32 and 25879.63 respectively and this makes them `PREMIUM` members. 

1.  Once a base table data is updated and you invoke a MySQL view again, you should view the latest information since views pull information from the tables and they don't store the information.

1.  To demonstrate how a view pulls updated information from the base tables, add another customer named `BABY ROE` to the `customers` table:

        INSERT INTO customers (customer_name) VALUES ('BABY ROE');

1.  Ensure the row inserted by confirming the output below:

        {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Then, add the customer's monthly sales information to the sales table:

        INSERT INTO sales (customer_id, monthly_sales) VALUES ('4', '147.41');

1.  Ensure you get the below output:

        {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Next, invoke the  `customers_membership` view again:

        SELECT * FROM customers_membership;

1.  You will now get the output shown below which confirms that the view is able to pick-up changes and pull the new customers' information as expected:

        {{< output >}}
+-------------+---------------+------------+
| customer_id | customer_name | membership |
+-------------+---------------+------------+
|           1 | JOHN DOE      | BASIC      |
|           2 | MARY ROE      | PREMIUM    |
|           3 | RICHARD ROE   | PREMIUM    |
|           4 | BABY ROE      | BASIC      |
+-------------+---------------+------------+
4 rows in set (0.00 sec)
{{< /output >}}

1.  As you can see in the view recordset above, you now have a new customer named `BABY ROE` with a `BASIC` membership. After running a MySQL view, you'll now learn how to delete them.

## Dropping a MySQL View  

1.  Just like other database objects, you can delete views if you no longer need them. Below is the basic syntax for dropping a MySQL view. 

        DROP VIEW IF EXISTS view_name; 

1.  To drop a MySQL view, first identify its name by running the command below:

        SHOW FULL TABLES  WHERE TABLE_TYPE LIKE 'VIEW';

1.  You'll see a list of all views in the currently selected database:

        {{< output >}}
+---------------------------+------------+
| Tables_in_sample_database | Table_type |
+---------------------------+------------+
| customers_membership      | VIEW       |
+---------------------------+------------+
1 row in set (0.01 sec)
{{< /output >}}

1.  In this case, the name of the view that you want to drop is `customers_membership`. So, to delete it, run the command below:

        DROP VIEW IF EXISTS customers_membership;

1.  Ensure the output below is displayed after the view is deleted from the database:

        {{< output >}}
Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

    {{< note >}}
Please note, if you attempt to delete a MySQL view that doesn't exist without using the `IF EXISTS` keyword, MySQL will throw an error. 
{{< /note >}}
