---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the PostgreSQL relational database server with Fedora 12.'
keywords: ["postgresql fedora 12", "postgresql database", "relational database"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2011-04-29
modified_by:
  name: Linode
published: 2009-09-13
title: Use PostgreSQL Relational Databases on Fedora 12
---



The [PostgreSQL](http://www.postgresql.org/) relational database system is a fast, scalable, and standards-compliant open source database platform. This guide will help you install and configure PostgreSQL on Fedora 12. We assume you've followed the steps detailed in our [getting started guide](/docs/getting-started/), and that you're logged into your Linode as root via SSH.

Installing PostgreSQL
---------------------

Make sure your system is up to date by issuing the following command:

    yum update

Issue the following command to install PostgreSQL and required dependencies:

    yum install postgresql postgresql-server

The current version of the database server will be installed, along with several supporting packages. Start the database server with the following commands:

    /sbin/chkconfig --levels 235 postgresql on
    service postgresql initdb
    service postgresql start

Configuring PostgreSQL
----------------------

### Setting the postgres Password

Set a password for the "postgres" user by issuing the following commands (be sure to substitute your postgres password for "CHANGME" below):

    passwd postgres
    su - postgres
    psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'CHANGEME';"

You should pick a password consisting of numbers, letters, and non-alphanumeric characters. As with other account passwords, it should be a minimum of eight characters in length.

### Creating a Database

Create a database and connect to it with `psql` by issuing the following commands:

    createdb mytestdb
    psql mytestdb

You should see output similar to the following:

    -bash-4.0$ psql mytestdb
    psql (8.4.3)
    Type "help" for help.

    mytestdb=#

This is the PostgreSQL client shell; you may use it to issue SQL statements. To see a list of available commands, use the following command in the shell:

    \h

To get help on a specific command enter it after `\h`, as shown below for the "SELECT" command:

    \h SELECT

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

By default, PostgreSQL uses `ident` authentication. This means database connections will be granted to local system users that own or have privileges on the database being connected to. Such authentication is useful in cases where a particular system user will be running a program (local scripts, CGI/FastCGI processes owned by separate users, etc). However, you may wish to change this behavior to require passwords. To do so, edit the file `/var/lib/pgsql/data/pg_hba.conf` as root or the postgres user. Find the following line:

{{< file-excerpt "/var/lib/pgsql/data/pg\\_hba.conf" >}}
local all all ident

{{< /file-excerpt >}}


Change it to the following to use password authentication:

{{< file-excerpt "/var/lib/pgsql/data/pg\\_hba.conf" >}}
local all all md5

{{< /file-excerpt >}}


As root, restart the Postgresql service:

    service postgresql restart

Resume these instructions as the `postgres` user:

    su - postgres

To grant all privileges on the table "employees" to a user named "alison", issue the following commands:

    psql mytestdb

    GRANT ALL ON employees TO alison;

To use the database "mytestdb" as "alison", issue the following command:

    psql -U alison -W mytestdb

You will be prompted to enter the password for the "alison" user and given `psql` shell access to the database.

Secure Remote Database Access
-----------------------------

PostgreSQL listens for connections on localhost, and it is not advised to reconfigure it to listen on public IP addresses. If you would like to access your databases remotely using a graphical tool, please follow one of these guides:

-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/databases/postgresql/pgadmin-windows)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/databases/postgresql/pgadmin-macos-x)

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [PostgreSQL Online Documentation](http://www.postgresql.org/docs/)
- [psql manual page](http://www.rootr.net/man/man/psql/1)



