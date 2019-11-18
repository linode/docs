---
author:
  name: Francis Ndungu
  email: francisndungu83@gmail.com
description: 'The goal of this guide is to walk you through the procedure of creating, using and deleting stored procedures in your MySQL database.'
keywords: ['mysql','stored procedures','database','database optimization']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-18
modified_by:
  name: Linode
title: "How to Create and Use MySQL Stored Procedures"
contributor:
  name: Francis Ndungu
  link: https://twitter.com/francisndungu83
external_resources:
- '[Working with MySQL stored procedures](https://dev.mysql.com/doc/connector-net/en/connector-net-tutorials-stored-procedures.html)'
---


### Introduction

Stored procedures are user-defined SQL statements that are stored in a MySQL database and executed on-demand to perform a specific database operation.

These predefined subroutines help in moving the business logic to the database hence minimizing the round trips made to the database server by an application. This enhances code maintainability since different applications can share the stored procedure.

Stored procedures improve the database performance because they are compiled once and executed very quickly and efficiently. 

The goal of this guide is to walk you through the procedure of creating, using and deleting stored procedures in your MySQL database.

## Before you Begin

Make sure you have the following:

1.	A configured Linode server. You can learn how to create and setup a Linode server by reading our [Getting Started with Linode](/docs/getting-started/) guide.
2.	A MySQL server and client installed on the Linode server. Ensure have followed the guide on [How to Install MySQL server](/docs/databases/mysql/install-mysql-on-ubuntu-14-04/)
3.	Root access to your MySQL server

## Step 1 - Creating a Database, User and Inserting Sample Data

You will start by creating a sample database, table, and user for accessing the database. You will also populate the table with sample data for testing purposes.

To do this,  Login to the MySQL server:

    mysql -uroot -p

You will be prompted to enter the root password of your MySQL database. Then, hit **Enter** to continue.

Next, you will see a mysql prompt similar to the one shown below.

    mysql >

Enter the command below to create a `test_db` database:

    mysql > Create database test_db;

Output:

    Query OK, 1 row affected (0.01 sec)

Create a database user and grant full access to the `test_db` database. Replace `PASSWORD` with a strong value:

    mysql > Create User 'test_user'@'localhost' IDENTIFIED BY 'PASSWORD';

Output

    Query OK, 1 row affected (0.01 sec)

Grant the `test_user` full privileges to the `test_db` database;

    mysql > GRANT ALL PRIVILEGES ON test_db.* TO 'test_user'@'localhost';

Output

    Query OK, 1 row affected (0.01 sec)

Flush privileges:

    mysql > FLUSH PRIVILEGES;

Output

    Query OK, 0 rows affected (0.01 sec)

Next, switch to the test_db database:

    mysql > Use test_db;

Output

    Database changed

Create a `products` table to store sample records:

    mysql > Create table products(product_id BIGINT PRIMARY KEY, product_name VARCHAR(50), category_name VARCHAR(50) ) ENGINE=INNODB;

Output;

    Query OK, 0 rows affected (0.01 sec)

You can now add a few products to the products table by executing the commands below one by one:

    mysql >Insert into products (product_id, product_name, category_name) values ('1', 'GAMING KEYBOARD', 'COMPUTER ACCESSORIES');
    mysql >Insert into products (product_id, product_name, category_name) values ('2', 'OPTICAL MOUSE', 'COMPUTER ACCESSORIES');
    mysql >Insert into products (product_id, product_name, category_name) values ('3', 'MOUSE PAD', 'COMPUTER ACCESSORIES');
    mysql >Insert into products (product_id, product_name, category_name) values ('4', 'STEREO SYSTEM', 'ELECTRONICS');
    mysql >Insert into products (product_id, product_name, category_name) values ('5', '32 INCH TV', 'ELECTRONICS');
    mysql >Insert into products (product_id, product_name, category_name) values ('6', 'DVB-T2 RECEIVER', 'ELECTRONICS');

You should get the below output after executing each `Insert` statement.

    Query OK, 1 row affected (0.00 sec)

Next. confirm if the sample products were inserted successfully to the database by running the `Select` command below:

    mysql > Select * from products;

Your sample products should listed as shown below:

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

Exit from MySQL server.

    Quit;

Output 

    Bye!

Once you have created a `test_db` database,  `products` table, a `test_user`, and added some sample products, you can now move on to creating the first stored procedure.

## Step 2 - Creating a Stored Procedure

In this step, we will learn the basic syntax of creating a stored procedure in MySQL database as shown below. 

    DELIMITER &&
    CREATE PROCEDURE [PROCEDURE NAME] ([PARAMETER 1, PARAMETER 2, PARAMETER N...])
    BEGIN
    [SQL STATEMENT]
    END &&
    DELIMITER ;

The line `DELIMITER &&;` at the beginning tells MySQL server to treat the following SQL statements before the `&&` as a single statement rather than executing them individually.

In the end, the statement `DELIMITER;` is issued again to change the delimiter back to the default value of `;`

The `[PROCEDURE NAME]` accepts the name of your stored procedure.

The `BEGIN...END` commands enclose the SQL statement that you want to be executed by the stored procedure.

Stored procedures support comma-separated parameters and this feature makes them more flexible. Parameters have a name, type, and a data type as shown below.

    [PARAMETER TYPE][PARAMETER NAME][DATA TYPE]

For instance, to create an `IN` parameter named category with a `VARCHAR` data type that has a length of **50** characters, use the syntax below.

    (IN category VARCHAR(50))

MySQL supports three types of parameters as discussed below:

`IN:` This means the value of the parameter must be specified by the calling client. This value can not be changed by the stored procedure.

`OUT:` This type of parameter is also specified by the calling program but its value can be changed by the stored procedure and retrieved by the calling program. If the value of the `OUT` parameter is modified when the stored procedure executes, the initial value can not be retrieved.

`INOUT:` The parameter of this type can be defined by the calling program and its initial value can be changed and retrieved after a stored procedure execution.

After understanding the basic syntax, let's create a simple stored procedure to filter products by category name supplied as an `IN` parameter.

Log in to the MySQL server using the test_user's credentials that you created in step 1.

    mysql -utest_user -p

Enter the password of the `test_user` and hit **Enter** to continue. You will get a MySQL prompt. Proceed by selecting the `test_db`.

    mysql> Use test_db;

Output 

    Database changed.

Then, enter the two SQLcommands below to create a `filter_by_category` stored procedure:

    mysql>DELIMITER &&
    mysql>CREATE PROCEDURE filter_by_category (IN category VARCHAR(50) )
    BEGIN
    Select * from products where category_name=category;
    END &&

Output

    Query OK, 0 rows affected (0.00 sec)

Change the DELIMITER back to ;

    mysql> DELIMITER ;

If the code for creating the stored procedure ran successfully, you will now move on to executing the stored procedure and see if it is working as expected.

## Step 3 - Executing a Stored Procedure

In this step, we will call the stored procedure that we created above. We will follow the basic syntax outlined below.

    mysql>CALL [PROCEDURE NAME](COMMA SEPARATED PARAMETER VALUES);

So, to execute the `filter_by_category` stored procedure that we created above, enter the command below.

    mysql>CALL filter_by_category('COMPUTER ACCESSORIES') ;

The stored procedure should now output all products in the `COMPUTER ACCESSORIES` category because we have specified `COMPUTER ACCESSORIES` as a parameter.

    +------------+-----------------+----------------------+
    | product_id | product_name    | category_name        |
    +------------+-----------------+----------------------+
    |          1 | GAMING KEYBOARD | COMPUTER ACCESSORIES |
    |          2 | OPTICAL MOUSE   | COMPUTER ACCESSORIES |
    |          3 | MOUSE PAD       | COMPUTER ACCESSORIES |
    +------------+-----------------+----------------------+
    3 rows in set (0.00 sec)

    Query OK, 0 rows affected (0.01 sec)

Similarly, you can retrieve a list of all products from the `ELECTRONICS` category by executing the command below.

    mysql> CALL filter_by_category('ELECTRONICS') ;

Output

    +------------+-----------------+---------------+
    | product_id | product_name    | category_name |
    +------------+-----------------+---------------+
    |          4 | STEREO SYSTEM   | ELECTRONICS   |
    |          5 | 32 INCH TV      | ELECTRONICS   |
    |          6 | DVB-T2 RECEIVER | ELECTRONICS   |
    +------------+-----------------+---------------+
    3 rows in set (0.00 sec)
    Query OK, 0 rows affected (0.01 sec)

Our stored procedure worked as we expected. Next, we will learn how to drop the stored procedures if we no longer want them to execute again.

## Step 4 - Deleting MySQL Stored Procedure

You can delete a MySQL stored procedure if you no longer want to use it or if you want to recreate it from scratch. The basic syntax of dropping the stored procedure is shown below

    mysql>DROP PROCEDURE IF EXISTS [PROCEDURE_NAME];

For instance, to delete our `filter_by_category` stored procedure, execute the MySQL command below:

    mysql>DROP PROCEDURE IF EXISTS filter_by_category;

If the stored procedure exists, you will get the output shown below.

    Query OK, 0 rows affected (0.00 sec)

That's all when it comes to creating, using and dropping MySQL stored procedures.

## Conclusion

In this guide, we took you through all the steps of creating and using a stored procedure on your MySQL database. We have also gone ahead and showed you to drop the stored procedures if you no longer need them. 
