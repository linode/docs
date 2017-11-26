---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the PostgreSQL relational database server with Ubuntu 8.04 (Hardy).'
keywords: ["postgresql", "postgresql database", "postgresql on ubuntu", "relational database"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2011-04-29
modified_by:
  name: Linode
published: 2009-09-13
title: 'Use PostgreSQL Relational Databases on Ubuntu 8.04 (Hardy)'
---



The [PostgreSQL](http://www.postgresql.org/) relational database system is a fast, scalable, and standards-compliant open source database platform. This guide will help you install and configure PostgreSQL on Ubuntu 8.04 LTS (Hardy). We assume you've followed the steps detailed in our [getting started guide](/docs/getting-started/), and that you're logged into your Linode as root via SSH.

# Installing PostgreSQL

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Issue the following command to install PostgreSQL and required dependencies:

    apt-get install postgresql

The current version of the database server will be installed, along with several supporting packages.

# Configuring PostgreSQL

### Creating a Database

Switch to the "postgres" user and create a database by issuing the following commands:

    su - postgres
    createdb mytestdb

Connect to the test database by issuing the following command:

    psql mytestdb

You should see output similar to the following:

    postgres@archimedes:~$ psql mytestdb
    Welcome to psql 8.3.7, the PostgreSQL interactive terminal.

    Type:  \copyright for distribution terms
           \h for help with SQL commands
           \? for help with psql commands
           \g or terminate with semicolon to execute query
           \q to quit

    mytestdb=#

This is the PostgreSQL client shell; you may use it to issue SQL statements. To see a list of available commands, use the following command in the shell:

    \h

You may find more information on a specific command by adding it after the `\h` command.

### Creating Tables

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

### Creating PostgreSQL Users (Roles)

PostgreSQL refers to users as "roles", which may have different privileges on your databases. If a user is classified as a "superuser" it will have administrative access to the database system. To add a new user to PostgreSQL, issue the following command as the "postgres" user:

    createuser alison --pwprompt

You will be asked to specify several values for the new user. To delete this user, issue the following command:

    dropuser alison

By default, PostgreSQL uses `ident` authentication. This means database connections will be granted to local system users that own or have privileges on the database being connected to. Such authentication is useful in cases where a particular system user will be running a program (local scripts, CGI/FastCGI processes owned by separate users, etc). However, you may wish to change this behavior to require passwords. To do so, edit the file `/etc/postgresql/8.4/main/pg_hba.conf` as root or the postgres user. Find the following line:

    local   all   all   ident sameuser

Change it to the following to use password authentication:

    local   all   all   md5

To grant all privileges on the table "employees" to a user named "alison", issue the following commands:

    psql mytestdb

    GRANT ALL ON employees TO alison;

To use the database "mytestdb" as "alison", issue the following command:

    psql -U alison -W mytestdb

You will be prompted to enter the password for the "alison" user and given `psql` shell access to the database.

# More Information

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [PostgreSQL Online Documentation](http://www.postgresql.org/docs/)
- [psql manual page](http://www.rootr.net/man/man/psql/1)



