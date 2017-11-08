---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the PostgreSQL relational database server with Ubuntu 12.04 LTS (Precise Pangolin).'
keywords: ["postgresql", "ubuntu 12.04", "postgresql database", "open source database", "relational database"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2012-10-08
modified_by:
  name: Linode
published: 2012-10-08
title: 'Use PostgreSQL Relational Databases on Ubuntu 12.04'
aliases: ['databases/postgresql/ubuntu-12-04-precise-pangolin/']
external_resources:
 - '[PostgreSQL Online Documentation](http://www.postgresql.org/docs/)'
 - '[psql manual page](http://www.rootr.net/man/man/psql/1)'
---

The [PostgreSQL](http://www.postgresql.org/) relational database system is a fast, scalable and standards-compliant open-source database platform. This guide will help you install and configure PostgreSQL on your Ubuntu 12.04 LTS (Precise Pangolin) Linode. We assume you've followed the steps detailed in our [getting started guide](/docs/getting-started/), and that you're logged into your Linode as root via SSH.

## Install PostgreSQL

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Issue the following command to install PostgreSQL, required dependencies, and some packages that provide additional functionality:

    apt-get install postgresql postgresql-contrib

The current version of the database server will be installed, along with several supporting packages.

## Configure PostgreSQL

### Install the Adminpack

This step is optional. Issue the following command to install the PostgreSQL `adminpack`, which provides additional functionality pertaining to remote management via tools like pgAdmin:

    su - postgres
    psql template1 < /usr/share/postgresql/9.1/contrib/adminpack.sql

You should see output similar to the following:

    CREATE FUNCTION
    CREATE FUNCTION
    CREATE FUNCTION
    CREATE FUNCTION
    CREATE FUNCTION
    CREATE FUNCTION
    CREATE FUNCTION
    CREATE FUNCTION

### Set the Postgres User's Password

Change the `postgres` user's system account password with the following command. If you are already logged in as the `postgres` user, please issue the `exit` command first to return to a root shell.

    passwd postgres

Issue the following commands to set a password for the `postgres` administrative user. Be sure to replace "changeme" with a strong password. This password will be used to connect to the database via the network; ident authentication will be used for local connections made with `psql` while logged into a shell as the `postgres` user.

    su - postgres
    psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'changeme';"

### Create a Database

Create a database by issuing the following command:

    createdb mytestdb

Connect to the test database by with this command:

    psql mytestdb

You should see output similar to the following:

    psql (9.1)
    Type "help" for help.

    mytestdb=#

This is the PostgreSQL client shell; you may use it to issue SQL statements. To see a list of available commands, use the following command in the shell:

    \h

You may find more information on a specific command by adding it after the `\h` command.

### Create Tables

To create a table in your test database called "employees", issue the following command:

    CREATE TABLE employees (employee_id int, first_name varchar, last_name varchar);

To insert a record into the table, you would issue a statement like this:

    INSERT INTO employees VALUES (1, 'Jack', 'Sprat');

To see the contents of the "employees" table, you would issue a SELECT statement similar to the following:

    SELECT * FROM employees;

This would produce output similar to the following:

    mytestdb=# SELECT * FROM employees;
     employee_id | first_name | last_name
    -------------+------------+-----------
               1 | Jack       | Sprat
    (1 row)

To exit the `psql` shell, issue this command:

    \q

### Create PostgreSQL Users (Roles)

PostgreSQL refers to users as "roles", which may have different privileges on your databases. If a user is classified as a "superuser" it will have administrative access to the database system. To add a new user to PostgreSQL, issue the following command as the "postgres" user:

    createuser alison --pwprompt

You will be asked to specify several values for the new user. To delete this user, issue the following command:

    dropuser alison

By default, PostgreSQL uses `ident` authentication. This means database connections will be granted to local system users that own or have privileges on the database being connected to. Such authentication is useful in cases where a particular system user will be running a program (local scripts, CGI/FastCGI processes owned by separate users, etc). However, you may wish to change this behavior to require passwords. To do so, edit the file `/etc/postgresql/9.1/main/pg_hba.conf` as root or the postgres user. Find the following line:

{{< file-excerpt "/etc/postgresql/9.1/main/pg\\_hba.conf" >}}
local all all ident

{{< /file-excerpt >}}


Change it to the following to use password authentication:

{{< file-excerpt "/etc/postgresql/9.1/main/pg\\_hba.conf" >}}
local all all md5

{{< /file-excerpt >}}


If you changed the authentication method as shown above, restart Postgresql with the following command:

    service postgresql restart

To grant all privileges on the table "employees" to a user named "alison", issue the following commands:

    psql mytestdb

    GRANT ALL ON employees TO alison;

To use the database "mytestdb" as "alison", issue the following command:

    psql -U alison -W mytestdb

You will be prompted to enter the password for the "alison" user and given `psql` shell access to the database.

## Secure Remote Database Access

PostgreSQL listens for connections on localhost, and it is not advised to reconfigure it to listen on public IP addresses. If you would like to access your databases remotely using a graphical tool, please follow one of these guides:

-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/databases/postgresql/pgadmin-windows)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/databases/postgresql/pgadmin-macos-x)
