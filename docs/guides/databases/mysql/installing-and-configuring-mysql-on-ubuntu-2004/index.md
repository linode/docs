---
slug: installing-and-configuring-mysql-on-ubuntu-2004
description: "This guide hows you how to install and configure MySQL server on Ubuntu 20.04 Linux"
keywords: ['mariadb vs mysql', 'install mysql linux', 'configure mysql linux']
tags: ['mysql', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-29
modified_by:
  name: Linode
title: "Installing and Configuring MySQL on Ubuntu 20.04"
title_meta: "How to Install and configure MySQL on Ubuntu 20.04"
external_resources:
- '[MariaDB website](https://mariadb.com/)'
- '[MySQL website](https://www.mysql.com/)'
authors: ["Jeff Novotny"]
---

Ubuntu users have a choice between two reliable *Relational Database Management Systems* (RDBMS), [*MySQL*](https://www.mysql.com/) and [*MariaDB*](https://mariadb.com/). MySQL has a long-standing edge in popularity, but there has been increased interest in MariaDB due to its performance advantages and added features. This guide compares the two database systems and provides instructions on how to install and use MySQL on Ubuntu 20.04.

## What is MySQL?

The MySQL RDBMS is one of the most popular open source applications. It is part of the *LAMP Stack*, which is the cornerstone of many Ubuntu systems. This stack consists of Linux, the Apache web server, the MySQL RDBMS, and the PHP programming language. These applications work together to support web applications, software development, and specialized activities such as data science. The main use of MySQL is in small to medium-sized single-server configurations.

MySQL queries are written in the *Structured Query Language* (SQL). As a relational database, it stores and organizes data in tables. Tables structure the actual data inside tables as a series of rows, with each row consisting of one or more columns. Each row represents a different entry in the table, while each column contains one data field within the entry. The fields of data in these tables can be related to one another, and these relations help structure and organize the database. Specialized SQL statements permit clients to add, delete, modify, and retrieve data.

MySQL is known for its stability and reliability and is considered simple and easy to use. It is available as free open source software under the GNU General Public License. MySQL is readily available for all Linux distributions as well as other operating systems. It is now owned by the Oracle Corporation. Oracle also offers the commercial [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/) as a higher-end product.

## MySQL vs. MariaDB

The two main open source database alternatives, MySQL and MariaDB, are very similar. They are both RDBMS products and both use SQL. Both database systems have free versions, and they look and act in much the same way. Because MariaDB originally branched off of MySQL, this is not surprising. MariaDB has since undergone further development and features many new improvements in security and performance. With MySQL, however, many advanced features are only found in the Enterprise Edition. Here is a summary of the similarities and differences between the two products:

- MariaDB supports more connections than MySQL.
- Both databases can work with multiple storage systems, although MariaDB offers more options.
- MariaDB can replicate data more quickly than MySQL and has better overall performance. MySQL handles large transactions more effectively, but MariaDB performs better in scaled situations.
- MySQL supports some features MariaDB does not have, such as dynamic columns. Each database has a few advanced features and improvements that the other does not.
- MySQL is older, better established, more popular, and has more community support. MySQL offers more comprehensive paid support plans.
- MariaDB and MySQL are fully compatible.
- Both products are open source, but the MySQL licensing model is more restrictive.

To summarize, both systems are more than adequate for most users. MariaDB features better performance, while MySQL is better established and better supported.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install MySQL Server

MySQL is available as part of the default Ubuntu packages, so it is not necessary to edit the source list. It can be easily installed using `apt`, but it is important to secure the application and edit the firewall afterwards. These instructions are geared towards Ubuntu users, but are generally applicable for those who want to install MySQL on another Linux distribution.

### Download MySQL

To install the MySQL server on Ubuntu, follow the steps below:

1.  Install the MySQL server application.

        sudo apt install mysql-server

1.  Confirm the MySQL server is running using the `systemctl` command. It should display a status of `active`.

        sudo systemctl status mysql

    {{< output >}}
mysql.service - MySQL Community Server
    Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset:>
    Active: active (running) since Thu 2021-09-09 12:24:29 UTC; 1h 44min ago
    {{< /output >}}

### Configure the MySQL Server on Linux

The `mysql_secure_installation` utility is the easiest way to configure the application. To use the set-up script, follow these steps:

1.  Launch the `mysql_secure_installation` utility to set the root password and configure other default options.

        sudo mysql_secure_installation

1.  The application asks whether to turn on the `VALIDATE PASSWORD COMPONENT` component. If you answer `y`, it then asks whether to set the password strength to `LOW`, `MEDIUM`, or `HIGH`.

    {{< output >}}
VALIDATE PASSWORD COMPONENT can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD component?
    {{< /output >}}

1.  At the next prompt, the utility asks for a password for the root account. Set the password and then re-enter it.

    {{< output >}}
Please set the password for root here.

New password:

Re-enter new password:
{{< /output >}}

1.  The following questions ask whether to remove anonymous users, to allow the `root` account to connect remotely, and to remove the `test` database. Enter `y` or `n` at each prompt according to your preferences. The `test` database is useful during initial validation, but for security reasons, it is best to disallow the `root` account from logging in remotely.

    {{< output >}}
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) :

Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) :

By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.

Remove test database and access to it? (Press y|Y for Yes, any other key for No
{{< /output >}}

1.  When prompted, reload the `privilege` tables to update the database.

    {{< output >}}
Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No)
    {{< /output >}}

        y
    {{< output >}}
Success.

All done!
{{< /output >}}

1.  (**Optional**) To access MySQL remotely, ensure MySQL traffic is allowed through the `ufw` firewall. Add the following rule to open port `3306` on the firewall. This rule should not be added if remote access is not required.

        ufw allow mysql

    {{< output >}}
Status: active

To                         Action      From
--                         ------      ----
Apache Full                ALLOW       Anywhere
OpenSSH                    ALLOW       Anywhere
3306/tcp                   ALLOW       Anywhere
Apache Full (v6)           ALLOW       Anywhere (v6)
OpenSSH (v6)               ALLOW       Anywhere (v6)
3306/tcp (v6)              ALLOW       Anywhere (v6)
{{< /output >}}

### Log in to MySQL as the Root User

Although the `root` user has full access to the MySQL database, its use should be reserved for administrative purposes. This reduces the chance of accidentally overwriting critical sections of the database. Even in a single-user setup, a separate user account should be created for most MySQL activities.

To access the MySQL server as the `root` user and create a new user account, follow these steps:

1.  Use the `sudo mysql` command to access the database. MySQL authenticates the root user based on their root credentials when logging in locally, so no password is required. Alternatively, access the root account using `sudo mysql -u root -p`, along with the `root` password.

        sudo mysql

1.  MySQL displays the release number and some information about the installation and then presents the MySQL prompt.

    {{< output >}}
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 15
Server version: 8.0.26-0ubuntu0.20.04.2 (Ubuntu)
...
mysql>
{{< /output >}}

1.  To confirm MySQL is operating correctly, use the `SHOW DATABASES` command to display all the databases.

        SHOW DATABASES;

    {{< output >}}
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)
{{< /output >}}

1.  Create a new user using the `CREATE USER` command. Enter the user name in the format `'username'@'IP_Address'`, where `IP_Address` is the IP address of the user. If the user is accessing MySQL from the local Linode, substitute `localhost` in place of the IP Address. In the command below, replace `mysqluser` and `password` with the actual user name and password.

    {{< note respectIndent=false >}}
MySQL offers several different authentication mechanisms. The `caching_sha2_password` method is recommended for users who want to log in using a password and is used here. However, certain older applications might not be able to authenticate properly this way. In that case, `mysql_native_password` should be used instead. MySQL source-replica replication might require the `sha256_password` method.
    {{< /note >}}

        CREATE USER 'mysqluser'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'password';

1.  Grant access to the new user using the `GRANT PRIVILEGE` command, using the format `GRANT list of privileges ON table TO 'username'@'IP_Address';`. Some of the more common privileges include `CREATE`, `ALTER`, `DROP`, `INSERT`, `UPDATE`, `DELETE`, and `SELECT`. To apply these privileges to all databases, use the wildcard variable `*.*`. The following command grants common non-administrative privileges on all databases to `mysqluser`.

        GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD ON *.* TO 'mysqluser'@'localhost' WITH GRANT OPTION;

1.  To exit the MySQL prompt, type `exit`.

        exit

## How to Use MySQL

MySQL uses standard SQL syntax for all of its commands. The steps in this section demonstrates how to perform basic tasks in MySQL, such as creating databases, tables, and adding data. For full information on how to use MySQL, see the [MySQL Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/). For a brief but thorough introduction, try the [MySQL tutorial](https://dev.mysql.com/doc/refman/8.0/en/tutorial.html).

### Create a Database

1.  To create a database, log in to MySQL using an account holding `CREATE` privileges. Replace `mysqlusername` with the username you created.

        mysql -u mysqlusername -p

1.  Create a new database using the `CREATE DATABASE` command. Replace `newdatabasename` with the desired name for your database.

        CREATE DATABASE newdatabasename;

    {{< output >}}
Query OK, 1 row affected (0.00 sec)
{{< /output >}}

1.  To confirm the new database has been created correctly, use `SHOW DATABASES`.

        SHOW DATABASES;

    {{< output >}}
+--------------------+
| Database           |
+--------------------+
...
| newdatabasename   |
...
+--------------------+
5 rows in set (0.00 sec)
{{< /output >}}

1.  Indicate the database that you want to work with using the `USE` command. Replace `newdatabasename` with the name for the database that you just created.

        USE newdatabasename;

    {{< output >}}
Database changed
{{< /output >}}

    {{< note respectIndent=false >}}
You can also use the `USE` command when you have more than one database and you want to switch between them.
{{< /note >}}

1.  To find out the name of the current database, use the `SELECT DATABASE` command. The output displays the database name.

        SELECT DATABASE();

    {{< output >}}
+------------------+
| DATABASE()       |
+------------------+
| newdatabasename |
+------------------+
{{< /output >}}

### Create a Table

At this point, the database, `newdatabasename` does not have any tables, so it is not possible to store any data in it yet. To define a table, use the `CREATE TABLE` command. Along with the name of the table, this command requires the name and data type of each field. The data type characterizes the data stored in the field. For example, the data type could be a variable-length string, known as a `VARCHAR`. For a complete list of data types, consult the [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/data-types.html). Some of the more common data types are as follows.

- **INT:** This can contain a value between `-2147483648` and `2147483647`. If specified as `UNSIGNED`, it can store values between `0` and `4294967295`.
- **SMALLINT:** Holds an even smaller integer value between `-32768` and `32767`.
- **FLOAT:** This type can store a floating-point number.
- **DATE:** Stores a date in `YYYY-MM-DD` format.
- **DATETIME:** Stores a date and time combination in `YYYY-MM-DD HH:MM:SS` format. The same time can be stored without dashes and colons in the `TIMESTAMP` format.
- **VARCHAR(N):** This is a variable-length string between `1` and `N` characters in length, with a maximum length of `255` characters.
- **TEXT:** This data type holds up to `65535` characters. It can hold text, images, or binary data.
- **CHAR(N):** This type represents a fixed-length text field of length `N`. For example, to hold two-character state codes, use a data type of `CHAR(2)`.

Before creating any tables, it is important to decide upon a *schema* for the database. The schema describes what each table represents, what data is stored in each table, and how the tables relate. To create a table, follow these steps:

1.  While logged in to MySQL, switch to the database where you want to add the table.

        use newdatabasename;

1.  Use the `CREATE TABLE` command to generate a new table. Use the format `CREATE TABLE table_name (field_1 datatype, field_n datatype);`.

        CREATE TABLE newtablename (column1 VARCHAR(20), column2 CHAR(1), column3 DATE, column4 SMALLINT UNSIGNED);

    {{< output >}}
Query OK, 0 rows affected (0.02 sec)
{{< /output >}}

1.  To confirm the table now exists, use the `SHOW TABLES` command.

        SHOW TABLES;

    {{< output >}}
+----------------------------+
| Tables_in_newdatabasename |
+----------------------------+
| newtablename              |
+----------------------------+
1 row in set (0.00 sec)
{{< /output >}}

1.  To review the table structure and verify the list of fields, use the `DESCRIBE` command.

        DESCRIBE newtablename;

    {{< output >}}
+---------+-------------------+------+-----+---------+-------+
| Field   | Type              | Null | Key | Default | Extra |
+---------+-------------------+------+-----+---------+-------+
| column1 | varchar(20)       | YES  |     | NULL    |       |
| column2 | char(1)           | YES  |     | NULL    |       |
| column3 | date              | YES  |     | NULL    |       |
| column4 | smallint unsigned | YES  |     | NULL    |       |
+---------+-------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)
{{< /output >}}

1.  If a table is no longer required, delete it using the `DROP TABLE` command.

    {{< note type="alert" respectIndent=false >}}
When a table is dropped, all data inside the table is lost and cannot be recovered.
{{< /note >}}

        DROP TABLE newtablename;

### Add and Retrieve Data

The main way to insert a new row of data into a table is with the `INSERT` command.

1.  To add a row, use the `INSERT` command. Specify the table name, the keyword `VALUES`, and a bracketed, comma-separated list of values in the format `INSERT INTO tablename VALUES ('value_1', ... 'value_n');`. The column values must have the same sequence as the table definition, with the string and date values in quotes. For example, to add data to `newtablename`, specify values for `column1`, `column2`, `column3`, and `column4`, in that order.

        INSERT INTO newtablename VALUES ('value1','a','2021-09-10',123);

    {{< output >}}
Query OK, 1 row affected (0.01 sec)
{{< /output >}}

1.  To retrieve data, use the `SELECT` command, along with some constraints telling MySQL which rows to return. The entire contents of the table can be returned, or only a subset. To select all rows in a table, use the `SELECT *` command, but do not add any qualifiers.

        SELECT * FROM newtablename;

    {{< output >}}
+---------+---------+------------+---------+
| column1 | column2 | column3    | column4 |
+---------+---------+------------+---------+
| value1  | a       | 2021-09-10 |     123 |
| value2  | b       | 2021-09-08 |     123 |
+---------+---------+------------+---------+
2 rows in set (0.00 sec)
{{< /output >}}

1.  It is also possible to only select rows fitting particular criteria, for example, where a column is set to a certain value. Use the `WHERE` keyword as a qualifier, followed by the match criteria as a constraint. In this example, only rows in which `column2` is set to `b` are displayed.

        SELECT * FROM newtablename WHERE column2 = 'b';

    {{< output >}}
+---------+---------+------------+---------+
| column1 | column2 | column3    | column4 |
+---------+---------+------------+---------+
| value2  | b       | 2021-09-08 |     123 |
+---------+---------+------------+---------+
1 row in set (0.00 sec)
{{< /output >}}

1.  For tables with many columns, it is often easier to limit the information that is displayed. To only select certain columns for each row, specify the column names instead of the `*` symbol.

        SELECT column1, column4 FROM newtablename;

    {{< output >}}
+---------+---------+
| column1 | column4 |
+---------+---------+
| value1  |     123 |
| value2  |     123 |
+---------+---------+
2 rows in set (0.00 sec)
{{< /output >}}

1.  To modify a row in a table, use the `UPDATE` command. The `SET` keyword indicates the column to update and the new value. If necessary, the `WHERE` keyword provides a method of constraining the operation to only apply to certain rows. In the following example, the value of `column4` is only changed to `155` if `column2` is equal to `b`.

        UPDATE newtablename SET column4 = 155 WHERE column2 = 'b';

    {{< output >}}
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
{{< /output >}}

1.  The `SELECT *` statement can be used to confirm the update.

        SELECT * FROM newtablename;

    {{< output >}}
+---------+---------+------------+---------+
| column1 | column2 | column3    | column4 |
+---------+---------+------------+---------+
| value1  | a       | 2021-09-10 |     123 |
| value2  | b       | 2021-09-08 |     155 |
+---------+---------+------------+---------+
2 rows in set (0.00 sec)
{{< /output >}}

## Conclusion: MySQL on Ubuntu 20.04

MySQL is a good choice for small to medium-sized web applications. It uses the industry-standard SQL programming language, which is fairly straightforward to use. MySQL is very stable and robust and has plenty of resources along with good support. The main alternative to MySQL is MariaDB. It features better performance and newer features, but is not as well established.

You can easily download and install the MySQL server on Ubuntu using the `apt` packages and the `mysql_secure_installation` utility. Even if you are the only person who is using MySQL, it is best to create a new MySQL user with more limited privileges.

To use MySQL, first determine the database schema and define the table contents. Next, create a database and the data tables. Data can be added using the `INSERT` command, modified using the `UPDATE` command, and retrieved using the `SELECT` command. Of course, MySQL can perform even highly complex operations. Work through the [MySQL tutorial](https://dev.mysql.com/doc/refman/8.0/en/tutorial.html) to get started, and consult the [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/) for a full overview.
