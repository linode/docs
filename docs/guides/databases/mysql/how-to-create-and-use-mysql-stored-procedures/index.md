---
slug: how-to-create-and-use-mysql-stored-procedures
description: 'This guide will show you how to use MySQL stored procedures, which are user-defined SQL statements that are stored in a MySQL database on Linux.'
keywords: ['mysql','stored procedures','database','database optimization']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-20
modified_by:
  name: Linode
title: "Creating and Using MySQL Stored Procedures"
title_meta: "Creating and Using MySQL Stored Procedures - A Tutorial"
image: L_MySQLStoredProc.png
external_resources:
- '[Working with MySQL stored procedures](https://dev.mysql.com/doc/connector-net/en/connector-net-tutorials-stored-procedures.html)'
tags: ["database","mysql"]
aliases: ['/databases/mysql/how-to-create-and-use-mysql-stored-procedures/']
authors: ["Francis Ndungu"]
---

Stored procedures are user-defined SQL statements that are stored in a MySQL database and executed on-demand to perform a specific database operation. These predefined subroutines help in moving the business logic to the database, which offers a few benefits:

- Round trips made to the database server by an application are minimized.
- Code maintainability is enhanced, since different applications can share the stored procedure.
- Database performance is improved, because stored procedures are compiled once and executed very quickly and efficiently.

In this guide, you will:

- Learn the syntax for [creating stored procedures](#creating-a-stored-procedure), and declare your first procedure.

- [Execute the example procedure](#executing-a-stored-procedure) after you've declared it.

- Learn how to [delete a procedure](#deleting-stored-procedures) when you no longer need it.

## Before You Begin

Make sure you have the following:

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.	A MySQL server and client installed on the Linode server. Installation guides for MySQL are available for different distributions in our [MySQL section](/docs/databases/mysql/).

## Prepare the Database

You will start by creating a sample database, table, and user for accessing the database. You will also populate the table with sample data for testing purposes.

### Creating the Database, Table, and User

1. Log into the MySQL server:

        mysql -u root -p

    You will be prompted to enter the root password of your MySQL database. Then, hit **Enter** to continue.

1.  Next, you will see a MySQL prompt similar to the one shown below.

    {{< output >}}
mysql >
{{< /output >}}

1.  Enter the command below to create a `test_db` database:

        CREATE DATABASE test_db;

    Output:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Create a database user and grant full access to the `test_db` database. Replace `PASSWORD` with a complex and unique value that follows the [guidelines for MySQL passwords](https://dev.mysql.com/doc/mysql-security-excerpt/5.6/en/user-names.html):

        CREATE USER 'test_user'@'localhost' IDENTIFIED BY 'PASSWORD';

    Output:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Grant the `test_user` full privileges to the `test_db` database;

        GRANT ALL PRIVILEGES ON test_db.* TO 'test_user'@'localhost';

    Output:

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  Flush privileges:

        FLUSH PRIVILEGES;

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

### Populate the Database

1.  Next, switch to the test_db database:

        USE test_db;

    Output:

    {{< output >}}
Database changed
{{< /output >}}

1.  Create a `products` table to store sample records:

        CREATE TABLE products(product_id BIGINT PRIMARY KEY, product_name VARCHAR(50), category_name VARCHAR(50) ) ENGINE=INNODB;

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

1.  You can now add a few products to the products table by executing the commands below one by one:

        INSERT INTO products (product_id, product_name, category_name) VALUES ('1', 'GAMING KEYBOARD', 'COMPUTER ACCESSORIES');
        INSERT INTO products (product_id, product_name, category_name) VALUES ('2', 'OPTICAL MOUSE', 'COMPUTER ACCESSORIES');
        INSERT INTO products (product_id, product_name, category_name) VALUES ('3', 'MOUSE PAD', 'COMPUTER ACCESSORIES');
        INSERT INTO products (product_id, product_name, category_name) VALUES ('4', 'STEREO SYSTEM', 'ELECTRONICS');
        INSERT INTO products (product_id, product_name, category_name) VALUES ('5', '32 INCH TV', 'ELECTRONICS');
        INSERT INTO products (product_id, product_name, category_name) VALUES ('6', 'DVB-T2 RECEIVER', 'ELECTRONICS');

    You should get the below output after executing each `Insert` statement:

    {{< output >}}
Query OK, 1 row affected (0.00 sec)
{{< /output >}}

1.  Next. confirm if the sample products were inserted successfully to the database by running the `Select` command below:

        SELECT * FROM products;

    Your sample products should listed as shown below:

    {{< output >}}
+------------+-----------------+----------------------+
| product_id | product_name    | category_name        |
+------------+-----------------+----------------------+
|          1 | GAMING KEYBOARD | COMPUTER ACCESSORIES |
|          2 | OPTICAL MOUSE   | COMPUTER ACCESSORIES |
|          3 | MOUSE PAD       | COMPUTER ACCESSORIES |
|          4 | STEREO SYSTEM   | ELECTRONICS          |
|          5 | 32 INCH TV      | ELECTRONICS          |
|          6 | DVB-T2 RECEIVER | ELECTRONICS          |
+------------+-----------------+----------------------+
6 rows in set (0.00 sec)
{{< /output >}}

1.  Exit from MySQL server.

        QUIT;

    Output:

    {{< output >}}
Bye!
{{< /output >}}

1.  Once you have created a `test_db` database,  `products` table, a `test_user`, and added some sample products, you can now move on to creating the first stored procedure.

## Creating a Stored Procedure

### Stored Procedure Syntax

The basic syntax of creating a stored procedure in MySQL database is shown below:

    DELIMITER &&
    CREATE PROCEDURE PROCEDURE_NAME (PARAMETER_1, PARAMETER_2, PARAMETER_N...)
    BEGIN
    [SQL STATEMENT]
    END &&
    DELIMITER ;

- The `DELIMITER &&` line at the beginning tells MySQL server to treat the following SQL statements as a single statement, rather than executing them individually. Another `&&` is included on a later line to mark the end of this statement.

- `PROCEDURE_NAME` is where the name of your stored procedure is declared.

- The procedure name is followed by a set of parentheses, and these enclose the parameters to your procedure. Stored procedures support comma-separated parameters, and this feature makes them more flexible. See the [parameters](#stored-procedure-parameters) section for more details.

- The `BEGIN...END` commands enclose the SQL statement that you want to be executed by the stored procedure.

-  In the end, the statement `DELIMITER ;` is issued again to change the delimiter back to the default value of `;`

### Stored Procedure Parameters

Each parameter for a procedure has a type, name, and a data type, separated by spaces:

    PARAMETER_TYPE PARAMETER_NAME DATA_TYPE

For example, to create a parameter of type `IN`, named `category`, with the `VARCHAR` data type that has a length of **50** characters, use this syntax:

    IN category VARCHAR(50)

MySQL supports three types of parameters:

- `IN`: The value of the parameter must be specified by the calling client. *This value can not be changed by the stored procedure*.

    For example, if you pass a [MySQL session variable](https://dev.mysql.com/doc/refman/8.0/en/user-variables.html) as an `IN` parameter to a procedure, and the procedure modifies this value in its statements, your session variable will remain unmodified after the procedure exits.

- `OUT`: This type of parameter is also specified by the calling program, but its value can be changed by the stored procedure and retrieved by the calling program.

    Note that the stored procedure cannot access the initial value of a variable that is passed as an `OUT` parameter.

- `INOUT`: A parameter of this type combines the behaviors of `IN` and `OUT` parameters:

    - The stored procedure can read the initial value of the parameter.

    - The parameter can be changed during stored procedure execution.

    - The changed value can be returned back to the calling program, if the calling program passed a variable as the parameter.

### An Example Stored Procedure

After understanding the basic syntax, let's create a simple stored procedure to filter products by category name. The category name will be supplied as an `IN` parameter.

1. Log in to the MySQL server using the `test_user`'s credentials that you created when preparing the database:

        mysql -u test_user -p

1. Enter the password of the `test_user` and hit **Enter** to continue.

1. You will get a `mysql >` prompt. Proceed by selecting the `test_db`:

        USE test_db;

    Output:

    {{< output >}}
Database changed.
{{< /output >}}

1. Then, enter the SQL commands below to create a `filter_by_category` stored procedure:

        DELIMITER &&
        CREATE PROCEDURE filter_by_category (IN category VARCHAR(50))
        BEGIN
        SELECT * FROM products WHERE category_name=category;
        END &&

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.00 sec)
{{< /output >}}

1.  Change the `DELIMITER` back to `;`

        DELIMITER ;

1.  If the code for creating the stored procedure ran successfully, you can now move on to executing the stored procedure.

## Executing a Stored Procedure

In this step, we will call the stored procedure that we created above. We will follow this basic syntax:

    CALL PROCEDURE_NAME (COMMA-SEPARATED PARAMETER VALUES);

-   To execute the `filter_by_category` stored procedure that we created above, enter the command below:

        CALL filter_by_category('COMPUTER ACCESSORIES');

    The stored procedure should now output all products in the `COMPUTER ACCESSORIES` category because we have specified `COMPUTER ACCESSORIES` as a parameter:

    {{< output >}}
+------------+-----------------+----------------------+
| product_id | product_name    | category_name        |
+------------+-----------------+----------------------+
|          1 | GAMING KEYBOARD | COMPUTER ACCESSORIES |
|          2 | OPTICAL MOUSE   | COMPUTER ACCESSORIES |
|          3 | MOUSE PAD       | COMPUTER ACCESSORIES |
+------------+-----------------+----------------------+
3 rows in set (0.00 sec)

Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

-   Similarly, you can retrieve a list of all products from the `ELECTRONICS` category by executing the command below.

        CALL filter_by_category('ELECTRONICS') ;

    Output:

    {{< output >}}
+------------+-----------------+---------------+
| product_id | product_name    | category_name |
+------------+-----------------+---------------+
|          4 | STEREO SYSTEM   | ELECTRONICS   |
|          5 | 32 INCH TV      | ELECTRONICS   |
|          6 | DVB-T2 RECEIVER | ELECTRONICS   |
+------------+-----------------+---------------+
3 rows in set (0.00 sec)

Query OK, 0 rows affected (0.01 sec)
{{< /output >}}

Our stored procedure worked as we expected. Next, we will learn how to drop the stored procedures if we no longer want them to execute again.

## Deleting Stored Procedures

You can delete a MySQL stored procedure if you no longer want to use it or if you want to recreate it from scratch. The basic syntax of dropping the stored procedure is shown below:

    DROP PROCEDURE IF EXISTS PROCEDURE_NAME;

For instance, to delete our `filter_by_category` stored procedure, execute the MySQL command below:

    DROP PROCEDURE IF EXISTS filter_by_category;

If the stored procedure exists, you will get the output shown below:

{{< output >}}
Query OK, 0 rows affected (0.00 sec)
{{< /output >}}

That's all when it comes to creating, using and dropping MySQL stored procedures.
