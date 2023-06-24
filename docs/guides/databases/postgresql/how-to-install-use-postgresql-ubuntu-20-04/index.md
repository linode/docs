---
slug: how-to-install-use-postgresql-ubuntu-20-04
description: 'This guide provides an introduction to PostgreSQL, an open source object-relational database management system (ORDBMS).'
keywords: ['PostgreSQL','RDBMS','database','guide and tutorial']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-19
image: InstallUse_PostgreSQL_Ubuntu2004.png
modified_by:
  name: Linode
title: "Installing and Using PostgreSQL on Ubuntu 20.04"
title_meta: "How to Install and Use PostgreSQL on Ubuntu 20.04."
external_resources:
- '[PostgreSQL](https://www.postgresql.org/)'
relations:
    platform:
        key: use-postrgesql-database
        keywords:
           - distribution: Ubuntu 20.04
tags: ["ubuntu", "postgresql"]
authors: ["Jeff Novotny"]
---

This guide provides an introduction to [*PostgreSQL*](https://www.postgresql.org/), an open source *object-relational database management system* (ORDBMS). PostgreSQL builds upon the original *Structured Query Language* (SQL) specification with many new features, emphasizing compliance. PostgreSQL transactions are atomic, consistent, isolated, and durable (ACID)compliant. PostgreSQL is one of the most popular database systems, and is available for most operating systems, including Ubuntu 20.04.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Advantages and Disadvantages of PostgreSQL

PostgreSQL is a feature-rich application, offering advanced features such as materialized views, triggers, and stored procedures. It can handle a very high workload, including data warehouses or highly-scaled web applications, and is noted for its stability. PostgreSQL can be extended with custom data types and functions, and can integrate with code from different languages. However, due to its focus on compatibility, it does not always match other database systems in terms of performance. In addition, not all open source applications support PostgreSQL.

With a large database schema, PostgreSQL can consume a substantial amount of disc space. To store large amounts of data, we recommend hosting PostgreSQL on a [*High Memory Linode*](https://www.linode.com/products/high-memory/).

## A Summary of the PostgreSQL Installation and Configuration Process

A complete PostgreSQL installation, including basic configuration tasks, consists of the following high-level steps. The following sections describe each step in more detail:

1.  Installing PostgreSQL.
2.  Securing PostgreSQL and Accessing the PostgreSQL Shell.
3.  Installing the PostgreSQL Administration Package.

## Installing PostgreSQL

### Installing the Latest Version of PostgreSQL From the Ubuntu Packages

The easiest way to install PostgreSQL on Ubuntu is with the package installation program `apt`. This method installs the latest version of PostgreSQL that is included in the Ubuntu packages. At the time of writing this guide the version is 12.5.

1.  Update and upgrade the existing packages.

        sudo apt update
        sudo apt -y upgrade
2.  Install PostgreSQL and all dependencies, along with the `postgresql-contrib` module that provides additional functionality.

        sudo apt-get install postgresql postgresql-contrib
3.  Ensure PostgreSQL is running with `systemctl`.

        sudo systemctl start postgresql.service
4.  To automatically launch PostgreSQL upon system boot-up, register it with `systemctl`.

        sudo systemctl enable postgresql.service
5.  Verify PostgreSQL is running as expected.

        sudo systemctl status postgresql.service
    This returns a summary of the application and its status. PostgreSQL should be listed as `active`.
    {{< output >}}
postgresql.service - PostgreSQL RDBMS
Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
Active: active (exited) since Wed 2021-01-27 12:00:43 UTC; 50s ago
    {{< /output >}}

### Installing PostgreSQL From the PostgreSQL Apt Repository

Installing PostgreSQL from the PostgreSQL repository allows you more control over what version to choose. The following process installs the latest stable version of PostgreSQL. As of early 2021, this is version 13.1. You can also choose to install an earlier release of PostgreSQL.

1.  Update and upgrade the existing packages.

        sudo apt update
        sudo apt -y upgrade
2.  Add the new file repository configuration.

        sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
3.  Import the signing key for the repository.

        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
4.  Update the package lists.

        sudo apt-get update
5.  Install the latest version of PostgreSQL.

        sudo apt-get -y install postgresql postgresql-contrib
    {{< note respectIndent=false >}}
To install an earlier version of PostgreSQL, add the release number as a suffix, for example `install postgresql-11`.
    {{< /note >}}
6.  Ensure PostgreSQL is running with `systemctl`.

        sudo systemctl start postgresql.service
7.  To automatically launch PostgreSQL upon system boot-up, register it with `systemctl`.

        sudo systemctl enable postgresql.service
8.  Verify the status of PostgreSQL with `systemctl`. The status of PostgreSQL should be listed as `active`.

        sudo systemctl status postgresql.service

{{< note >}}
For a specific minor release of PostgreSQL, or more manual control over the installation, source code can be obtained from the [*PostgreSQL Downloads Page*](https://www.postgresql.org/ftp/source/). Download the file, transfer it to the Linode server, and extract the files with `tar`. Follow the [*installation procedure*](https://www.postgresql.org/docs/current/install-procedure.html) to build the application.
{{< /note >}}

## Securing PostgreSQL and Accessing the PostgreSQL Shell

Linode recommends increasing the security of new PostgreSQL installation before populating the database. PostgreSQL automatically creates a default user named `postgres` upon installation. The `postgres` user has full `superadmin` privileges, so it is particularly important to implement Linux and database passwords for the account.

1.  Change the password for the `postgres` Linux account. Choose a strong password and store it in a secure place.

        sudo passwd postgres
2.  Switch over to the `postgres` account.

        sudo su - postgres
3.  Change the password for the `postgres` PostgreSQL user to use when connecting over a network.

        psql -c "ALTER USER postgres WITH PASSWORD 'newpassword'"
    You can optionally choose to only apply the password to a specific database with the `-d` option.

        psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword'";
    {{< note respectIndent=false >}}
This password only applies when the `postgres` user connects to PostgreSQL over a network, not when logging in locally. This guarantees administrative access to the database for maintenance or cron jobs. It effectively means you can always log in locally to PostgreSQL as the `postgres` user without any password.
    {{< /note >}}
4.  Confirm PostgreSQL is working properly and you are running the version you expect with the following command. This command returns the version of the PostgreSQL server.

        psql -c "SELECT version();"
    This command returns the version of the server component, which might not be as recent as the overall release number.
    {{< output >}}
PostgreSQL 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0, 64-bit
        (1 row)
    {{< /output >}}
5.  Log in to PostgreSQL to confirm you can access the database.

        psql postgres
    PostgreSQL displays some information about the version and provides a prompt. The output depends upon the details of the installation.
    {{< output >}}
psql (13.1 (Ubuntu 13.1-1.pgdg20.04+1), server 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1))
Type "help" for help.
postgres=#
    {{< /output >}}
6.  By default, PostgreSQL grants access to local system users without requiring a password. This is known as `peer` authentication. PostgreSQL obtains the system name of the user and verifies it against the database privileges. To enforce password authentication from local users, you must edit the `pg_hba.conf` file. Run the following command within the `psql` shell to determine the location of this file.

        SHOW hba_file;
    PostgreSQl returns a table showing you where the file is located.
    {{< output >}}
              hba_file
-------------------------------------
 /etc/postgresql/12/main/pg_hba.conf
(1 row)
    {{< /output >}}
7.  Exit PostgreSQL with the `\q` meta-command, and return to the Linux shell.
    {{< note respectIndent=false >}}
PostgreSQL commands starting with a backslash are known as *meta-commands*. PostgreSQL pre-processes these commands, which are useful for administration and scripting. See the [*PostgreSQL PSQL Documentation page*](https://www.postgresql.org/docs/current/app-psql.html) for more details.
{{< /note >}}

8.  Edit the `pg_hba.conf` file to enforce authentication. Find the `local` line under "Unix domain socket connections only" and change the `METHOD` attribute from `peer` to `md5`.

    {{< note type="alert" respectIndent=false >}}
Ensure that you do not edit the top line for the default `postgres` user. The `postgres` account requires non-interactive access to PostgreSQL for maintenance tasks. Linode recommends you to make a back-up copy of `pg_hba.conf` before editing it.
    {{< /note >}}

    {{< file "/etc/postgresql/12/main/pg_hba.conf" >}}
...
# "local" is for Unix domain socket connections only
local   all             all                                     md5
...
    {{< /file >}}

9.  Restart PostgreSQL to apply the new access rule.

        sudo systemctl restart postgresql.service

{{< note >}}
Although they share the same user name, the `postgres` Linux user and the `postgres` database user are different. The Linux account is used to access the database, while the PostgreSQL user can perform administrative tasks inside the database.
{{< /note >}}

## Installing the PostgreSQL Administration Package

PostgreSQL provides an `Adminpack` module, which supplies a suite of management and administration tools. More details about the module can be found on the [*PostgreSQL documentation site*](https://www.postgresql.org/docs/13/adminpack.html). To install this component, perform the following actions.

1.  Log in to PostgreSQL as `postgres`.

        psql postgres
2.  Enable the extension.

        CREATE EXTENSION adminpack;
3.  Confirm you correctly installed the module with the `dx` meta-command.

        \dx
    `Adminpack` should be listed as one of the modules.
    {{< output >}}
List of installed extensions
   Name    | Version |   Schema   |               Description
-----------+---------+------------+-----------------------------------------
 adminpack | 2.0     | pg_catalog | administrative functions for PostgreSQL
 plpgsql   | 1.0     | pg_catalog | PL/pgSQL procedural language
    {{< /output >}}

## Using PostgreSQL

PostgreSQL operations are based on SQL, which is the standard language for RDBMS systems. If you have worked with SQL before, the commands in the following sections should look familiar. If not, the PostgreSQL documentation offers a [*short tutorial*](https://www.postgresql.org/docs/13/tutorial-sql.html) to get you started.

### Working With PostgreSQL Databases

Before creating any tables or adding any table rows, you must create a database to store the data. A database is a collection of one or more tables, and a database cluster refers to all the databases that a PostgreSQL server collectively manages. See the [*PostgreSQL documentation*](https://www.postgresql.org/docs/13/app-createdb.html) for more information about databases.

1.  From the Linux shell, while logged in as `postgres`, create a test database using the `createdb` command.

        createdb testdatabase
    {{< note respectIndent=false >}}
You can assign ownership to a specific PostgreSQL user with the `-O` option, as in `createdb testdatabase -O testuser`.
    {{< /note >}}
2.  Connect to the new database directly.

        psql testdatabase
    The PostgreSQL prompt now shows you are in the `testdatabase` database.
    {{< output >}}
testdatabase=#
    {{< /output >}}
3.  List all of the databases in the cluster with the `\l` meta-command.

        \l
    The new database should appear in the list.
    {{< output >}}
 List of databases
     Name     |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
--------------+----------+----------+-------------+-------------+-----------------------
 postgres     | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 testdatabase | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
    {{< /output >}}
4.  Whenever you are logged into PostgreSQL, you can always find out what database you are logged into, along with the name of the role, using the `conninfo` meta-command.

        \conninfo
    The command returns basic information about the database.
{{< output >}}
You are connected to database "postgres" as user "postgres" via socket in "/var/run/postgresql" at port "5432".
{{< /output >}}
5.  While you are logged into PostgreSQL, you can switch to a different database using the `\c` meta-command.

        \c testdatabase
6.  If you are absolutely certain you do not need a database any longer, you can delete it with the `dropdb` command.
    {{< note type="alert" respectIndent=false >}}
This command permanently deletes all of the tables and all data from the database. This command cannot be undone.
{{< /note >}}
    Run the command from the Linux shell while logged in as `postgres`.

        dropdb testdatabase

### Working With PostgreSQL Tables

A database table is defined as a set of named columns, each with a specific data type. More information about tables can be found in the [*PostgreSQL documentation*](https://www.postgresql.org/docs/13/ddl-basics.html). To create a table inside the `testdatabase` database, follow these steps.

1.  Connect to the database.

        psql testdatabase
2.  Use the `CREATE TABLE` SQL command to add a new table named `customers`. Provide a list of columns, and a data type for each column in the command.

        CREATE TABLE customers (customer_id int, first_name varchar(80), last_name varchar(80));
3.  List all of the tables in the database with the `\dt` meta-command.

        \dt
    PostgreSQL returns a list of all of the tables, including the table you created.
    {{< output >}}
List of relations
 Schema |   Name    | Type  |  Owner
--------+-----------+-------+----------
 public | customers | table | postgres
(1 row)
   {{< /output >}}

4.  View the complete schema of the `customers` table, including all of the columns and data types, with the `\d+` meta-command.

        \d+ customers
    {{< output >}}
Table "public.customers"
   Column    |         Type          | Collation | Nullable | Default | Storage  | Stats target | Description
-------------+-----------------------+-----------+----------+---------+----------+--------------+-------------
 customer_id | integer               |           |          |         | plain    |              |
 first_name  | character varying(80) |           |          |         | extended |              |
 last_name   | character varying(80) |           |          |         | extended |              |
Access method: heap
{{< /output >}}

5.  To delete an existing table, use the  `DROP TABLE` command.

    {{< note type="alert" respectIndent=false >}}
This operation deletes all of the data in the table and cannot be undone.
{{< /note >}}

        DROP TABLE customers;


### Adding and Reading Data With PostgreSQL

Tables store the actual data as a series of rows. Each row represents an entry within the table, with values for each of the columns. A row represents an individual record within the table. Data is added to a PostgreSQL table on a row-by-row basis with the `INSERT` command, and is retrieved with the `SELECT` command. For more information on row insertion, see the [*PostgreSQL Documentation*](https://www.postgresql.org/docs/13/dml-insert.html).

1.  Connect to the database.

        psql testdatabase
2.  Add rows to the `customers` table using the `INSERT INTO` command. Follow the command name with the name of the table, the keyword `VALUES` and a comma-separated list of the values to insert. The values must match the order of the columns in the table definition.

        INSERT INTO customers VALUES (1, 'John', 'Client');
        INSERT INTO customers VALUES (2, 'Jane', 'Purchaser');
3.  View the contents of a table with the `SELECT` command.

        SELECT * FROM customers;
    PostgreSQL returns a list of all columns from all rows in the table.
    {{< output >}}
 customer_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Client
           2 | Jane       | Purchaser
(2 rows)
    {{< /output >}}
    {{< note respectIndent=false >}}
The `*` symbol is a wild card indicating all columns.
    {{< /note >}}

4.  To view a subset of the table columns, list the specific columns you want to retrieve in place of the `*` symbol.

        SELECT last_name FROM customers;
    In this case, PostgreSQL only returns a list of the last names of the customers.
   {{< output >}}
 last_name
-----------
 Client
 Purchaser
(2 rows)
   {{< /output >}}
5.  You can conditionally select rows using the `WHERE` keyword along with a search condition. The search condition must evaluate to a Boolean expression. This query uses a simple expression where the `last_name` column must be equal to `Client`. However, PostgreSQL supports more complicated expressions involving multiple comparisons and set operations.

        SELECT * FROM customers WHERE last_name = 'Client';
    For this query, PostgreSQL only returns one row.
       {{< output >}}
 customer_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Client
(1 row)
   {{< /output >}}
6.  Use the `DELETE` command to remove a row from a PostgreSQL table. The `WHERE` keyword is used to conditionally select rows to delete. If you use the `*` symbol, all rows are deleted.

        DELETE FROM customers WHERE last_name = 'Purchaser';
7.  Rows can be edited with the `UPDATE` command. You must specify the columns you want to edit along with the new values. You should also include a conditional expression in the form of a `WHERE` clause to indicate the rows to change.

        UPDATE customers SET last_name= 'Buyer' WHERE customer_id = '1';
8.  View the contents of the entire `customers` table to see all of the changes.

        SELECT * FROM customers;
    {{< output >}}
        customer_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Buyer
(1 row)
   {{< /output >}}

    {{< note respectIndent=false >}}
A common example of a complex query involving two or more tables is a *join*. Joins are used to combine information from multiple tables. For a join, specify a column in each table where the values must match. The query returns a pair of rows (one from each table) every time a match occurs. For instance, if rows in the `customers` table and the `accounts` table both have the same value in the `customer_id` field, both rows are returned. Matches could be one-to-one, many-to-one, or many-to-many depending on the database schema. When a match has been located, PostgreSQL processes the two rows into one entity and returns the requested columns. The PostgreSQL site provides [*a helpful introduction to joins*](https://www.postgresql.org/docs/13/tutorial-join.html).
    {{< /note >}}

### Working With PostgreSQL Columns

Linode strongly recommends you finalize the complete database schema before implementing it. Nevertheless, there might be times when you have to change your table structure later. PostgreSQL provides the ability to add or delete columns from existing tables, even if they are already populated with data.

1.  If you want to add a column to a pre-existing table, use the `ALTER TABLE` command. PostgreSQL sets this field to empty for any existing rows in the table.

        ALTER TABLE customers ADD branch_id int;
2.  To delete a column from a table, use the `ALTER TABLE` command with the `DROP` keyword. PostgreSQL removes all data from the column from all rows.

        ALTER TABLE customers DROP first_name;
3.  Use the `d+` meta-command to view the new table structure.

        \d+ customers
    PostgreSQL displays the columns that are currently part of the table.
    {{< output >}}
Table "public.customers"
   Column    |         Type          | Collation | Nullable | Default | Storage  | Stats target | Description
-------------+-----------------------+-----------+----------+---------+----------+--------------+-------------
customer_id | integer               |           |          |         | plain    |              |
last_name   | character varying(80) |           |          |         | extended |              |
branch_id   | integer               |           |          |         | plain    |              |
Access method: heap
   {{< /output >}}

### Creating PostgreSQL Roles (Users) and Groups

For a small single-user database, you might only require the default PostgreSQL account. However, for most applications, you should create a separate account for each user. You can create new PostgreSQL users with the following steps:

1.  Log in with the `postgres` Linux account, and create a new PostgreSQL role with the `createuser` command.

        createuser testuser --pwprompt
    PostgreSQL prompts you for a password. Choose a secure password for this user and enter it twice.
2.  To confirm the role has been created, enter the PostgreSQL shell and execute the `\du` meta-command.

        \du
    PostgreSQL returns a list of all the roles. The new `testuser` role does not have any attributes yet.
    {{< output >}}
 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
 testuser  |                                                            | {}
    {{< /output >}}
3.  You can now access the database as this user.

        psql testdatabase -U testuser
    PostgreSQL shows a different prompt this time.
    {{< output >}}
testdatabase=>
    {{< /output >}}
4.  You can also grant specific privileges to a user. To give the `testuser` account full permission to `customers`, access the database as the `postgres` user and issue the following command.

        GRANT ALL ON customers TO testuser;
5.  A user's role can be expanded with the `ALTER ROLE` command. Run the following command as the     `postgres` user to allow `testuser` to create databases.

        ALTER ROLE testuser CREATEDB;
    The `\du` command now displays the new privilege.
    {{< output >}}
List of roles
Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
testuser  | Create DB                                                  | {}
    {{< /output >}}
6.  PostgreSQL allows you to create groups to simplify the assignment of database privileges. First create a group in the Linux shell.

        createuser testgroup --no-login
7.  Enter the PostgreSQL shell as the `postgres` user and then assign users to the new group.

        GRANT testgroup TO testuser;
8.  Use the `\du` meta-command to confirm the new group and its membership.

        \du
    {{< output >}}
List of roles
Role name |                         Attributes                         |  Member of
-----------+------------------------------------------------------------+-------------
postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
testgroup | Cannot login                                               | {}
testuser  | Create DB                                                  | {testgroup}
    {{< /output >}}
9.  To delete a user or group, execute the `dropuser` command from the Linux shell.

        dropuser testgroup

## Accessing PostgreSQL Remotely

Linode does not recommend opening up PostgreSQL to listen for connections on public IP addresses because this poses a security risk. If you want to access PostgreSQL remotely, you can use a graphical user interface called pgAdmin. See one of the following Linode guides to pgAdmin for more information:

*   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/guides/how-to-access-postgresql-database-remotely-using-pgadmin-on-windows/)
*   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/guides/securely-manage-remote-postgresql-servers-with-pgadmin-on-macos-x/)

## Learning More About PostgreSQL

This guide only covers the fundamentals, but PostgreSQL is a complex application with many options. Linode recommends you spend some time learning more about PostgreSQL. The [*PostgreSQL documentation*](https://www.postgresql.org/docs/13/index.html) is very comprehensive, and includes a good [*introductory tutorial*](https://www.postgresql.org/docs/13/tutorial.html). An active community of users supports PostgreSQL. You can find links to some of these user groups on the [*PostgreSQL site*](https://www.postgresql.org/community/).
