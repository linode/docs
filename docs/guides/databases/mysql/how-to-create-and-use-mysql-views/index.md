---
slug: how-to-create-and-use-mysql-views
description: 'A view in MySQL is a named query that can be triggered to display data stored in other tables. This guide shows how to create, invoke, and delete views.'
keywords: ['mysql','database','views']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-01
modified_by:
  name: Linode
title: "Using Views in a MySQL Database"
title_meta: "How to Use Views in a MySQL Database"
external_resources:
- '[MySQL - Using Views](https://dev.mysql.com/doc/refman/8.0/en/views.html)'
authors: ["Francis Ndungu"]
---

A *view* in MySQL is a named query that can be triggered to display data stored in other tables. In other words, views are user-defined virtual tables. Views can be used to:

- **Enhance database security.** If your database contains sensitive information that needs to be secured, using a view helps you to isolate the data. A view can be created with a predefined result set, and you can grant users access only to that view, instead of the table that contains sensitive information.
- **Move complex business logic to the database server.** Instead of coding frequently used software logic in different clients, a developer can move the logic into the database level using a view. For example, a view can be created to display customer classifications depending on their total sales.
- **Reduce data distraction.** A view can combine results from different tables and only display the relevant columns when invoked.

In this guide you will learn:

- How the [syntax of a MySQL view](#the-mysql-view-syntax) is structured.
- How to [create a MySQL view](#creating-a-mysql-view).
- How to [invoke a MySQL view](#invoking-a-mysql-view).
- How to [drop a view in MySQL](#dropping-a-mysql-view).

## Before You Begin

To follow along with this guide, make sure you have the following:

1.  A Linode, which you run the MySQL software on. You can follow the [Getting Started with Linode](/docs/products/platform/get-started/) guide to provision a Linode.

1.  The MySQL server software (or MariaDB) installed on your Linode. Please refer to the [MySQL section](/docs/guides/databases/mysql/), which contains guides that describe how to install MySQL on several Linux distributions.

## Preparing the Database

Before you create your MySQL views, create a sample database, define a few tables, and populate them with some data first:

1.  [SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance) to your Linode. Then, enter this command to log in to MySQL as the root user:

        mysql -u root -p

    When prompted, enter the root password of your MySQL server and hit **Enter** to continue.

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

1.  Next, run this SQL command to create a sample database that's named `sample_database`:

        CREATE DATABASE sample_database;

    You should see this output, which confirms that the database was created successfully:

    {{< output >}}
Query OK, 1 row affected (0.02 sec)
{{< /output >}}

1.  Select the `sample_database` database:

        USE sample_database;

    You should see this output:

    {{< output >}}
Database changed
{{< /output >}}

1. Run this command to create a `customers` table:

        CREATE TABLE customers
        (
        customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_name VARCHAR(50)
        ) ENGINE = InnoDB;

    You should see this output:

    {{< output >}}
Query OK, 0 rows affected (0.07 sec)
{{< /output >}}

1.  Next, populate the `customers` table with three records. Run the below `INSERT` commands one by one:

        INSERT INTO customers (customer_name) VALUES ('Leslie');
        INSERT INTO customers (customer_name) VALUES ('Andy');
        INSERT INTO customers (customer_name) VALUES ('Ben');

    The output below is shown after each record is inserted:

    {{< output >}}
Query OK, 1 row affected (0.08 sec)
...
{{< /output >}}

1.  Ensure the sample records were inserted into the database by running this `SELECT` command:

        SELECT * FROM customers;

    This output appears, which confirms that the data was inserted successfully in the previous step:

    {{< output >}}
+-------------+---------------+
| customer_id | customer_name |
+-------------+---------------+
|           1 | Leslie        |
|           2 | Andy          |
|           3 | Ben           |
+-------------+---------------+
3 rows in set (0.01 sec)
{{< /output >}}

1. Next, create a `sales` table. Run this command:

        CREATE TABLE sales
        (
        customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        monthly_sales DECIMAL(17,2)
        ) ENGINE = InnoDB;

    This output appears:

    {{< output >}}
Query OK, 0 rows affected (0.07 sec)
{{< /output >}}

1.  Then, add some data to the `sales` table. Run these commands one by one:

        INSERT INTO sales (customer_id, monthly_sales) VALUES ('1','500.27');
        INSERT INTO sales (customer_id, monthly_sales) VALUES ('2','7600.32');
        INSERT INTO sales (customer_id, monthly_sales) VALUES ('3', '25879.63');

    After inserting each sales record, this output appears:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
...
{{< /output >}}


1.  Next, run a `SELECT` query to verify that the sales data was inserted into the table:

        SELECT * FROM sales;

    This output appears, which confirms that the sales data was inserted successfully in the previous step:

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

You have defined the database and the tables to work on. The next section describes the syntax of a MySQL view.

## The MySQL View Syntax

This is a simplified version of the MySQL view syntax:

        CREATE
        VIEW view_name
        AS select_statement

- `view_name`: The name of the MySQL view must be defined here. It is advisable to use a descriptive name so that you can remember the function of the view later.

- `select_statement`: This is the SQL query that is coupled with the defined view. When the view is invoked, MySQL runs this query to return a recordset.

## Creating a MySQL View

This section presents an example MySQL view. This view is used to classify customers from your sample database, depending on their number of monthly sales.

Ensure you are logged into your MySQL server. Then, run the command below to create a `customers_membership` view:

    CREATE
    VIEW customers_membership
    AS SELECT sales.customer_id,
    customer_name,
    (IF(sales.monthly_sales >= 5000, 'PREMIUM', 'BASIC')) as membership
    FROM sales
    LEFT JOIN customers
    ON sales.customer_id = customers.customer_id;

If the view is created successfully, you should see the output shown below:

{{< output >}}
Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

The above MySQL command creates a view named `customers_membership` that joins the `customers` and `sales` table with the `PRIMARY KEY` `customer_id`. The logical `IF(expression, value_if_true, value_if_false)` statement logic is used to determine the membership of the customer from their monthly sales:

- If a customer's sales are equal or above 5,000, the view classifies the customer as a `PREMIUM` member.

- Otherwise (if the sales are below `5,000`), the customer is classified as a `BASIC` member.

The `customers_membership` view is now saved to the database. The next section shows how to call a MySQL view and display a recordset without querying the base tables directly.

## Invoking a MySQL View

This section shows how to invoke the MySQL view you created above and confirm that it works as expected. Once a view is created, it is visible as a database object and it can be called using the `SELECT` statement.

1.  To invoke the `customers_membership` view, run:

        SELECT * FROM customers_membership;

    If the view is working as expected, you should now see a list of customers with their generated `membership` values based on their sales. Since `Leslie`'s sales were below 5000 (500.27), the view outputs the customer's membership as `BASIC`. `Andy` and `Ben`'s sales were 7600.32 and 25879.63 respectively and this makes them `PREMIUM` members:

    {{< output >}}
+-------------+---------------+------------+
| customer_id | customer_name | membership |
+-------------+---------------+------------+
|           1 | Leslie        | BASIC      |
|           2 | Andy          | PREMIUM    |
|           3 | Ben           | PREMIUM    |
+-------------+---------------+------------+
3 rows in set (0.00 sec)
{{< /output >}}

1.  Once a base table data is updated and you invoke a MySQL view again, you should see the latest information. Views pull information from their base tables, and they don't store the data. To demonstrate how a view pulls updated information from the base tables, add another customer named `Rajie` to the `customers` table:

        INSERT INTO customers (customer_name) VALUES ('Rajie');

    This output appears:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Then, add the customer's monthly sales information to the sales table:

        INSERT INTO sales (customer_id, monthly_sales) VALUES ('4', '147.41');

    This output appears:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Next, invoke the  `customers_membership` view again:

        SELECT * FROM customers_membership;

    The output below appears, which confirms that the view is able to pick-up changes and pull the new customers' information as expected:

    {{< output >}}
+-------------+---------------+------------+
| customer_id | customer_name | membership |
+-------------+---------------+------------+
|           1 | Leslie        | BASIC      |
|           2 | Andy          | PREMIUM    |
|           3 | Ben           | PREMIUM    |
|           4 | Rajie         | BASIC      |
+-------------+---------------+------------+
4 rows in set (0.00 sec)
{{< /output >}}

    As you can see in the view recordset above, you now have a new customer named `Rajie` with a `BASIC` membership.

## Dropping a MySQL View

Just like other database objects, you can delete views if you no longer need them. This is the basic syntax for dropping a MySQL view:

        DROP VIEW IF EXISTS view_name;

1.  Before dropping a MySQL view, first identify its name by running the command below:

        SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

    A list of all views in the currently selected database appears:

    {{< output >}}
+---------------------------+------------+
| Tables_in_sample_database | Table_type |
+---------------------------+------------+
| customers_membership      | VIEW       |
+---------------------------+------------+
1 row in set (0.01 sec)
{{< /output >}}

1.  In this case, the name of the view that you want to drop is `customers_membership`. So, to delete it, run:

        DROP VIEW IF EXISTS customers_membership;

    Ensure the output below is displayed after the view is deleted from the database:

    {{< output >}}
Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

    {{< note respectIndent=false >}}
Please note, if you attempt to delete a MySQL view that doesn't exist without using the `IF EXISTS` keyword, MySQL throws an error.
{{< /note >}}

1.  When the command from step 1 is run again, there should now be no results:

        SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

    {{< output >}}
Empty set (0.000 sec)
{{< /output >}}
