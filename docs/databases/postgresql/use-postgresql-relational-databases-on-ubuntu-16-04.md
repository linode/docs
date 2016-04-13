---
author:
  name: Linode
  email: docs@linode.com
description: 'Using the PostgreSQL relational database server with Ubuntu 16.04 LTS (Xenial Xerus).'
keywords: 'postgresql,ubuntu 16.04,postgresql database,open source database,relational database'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Tuesday, April 12th, 2016
modified_by:
  name: Phil Zona
published: 'Tuesday, April 12th, 2016'
title: 'Use PostgreSQL Relational Databases on Ubuntu 16.04'
alias: ['databases/postgresql/ubuntu-16-04-xenial-xerus/']
external_resources:
 - '[PostgreSQL Online Documentation](http://www.postgresql.org/docs/)'
 - '[psql manual page](http://www.rootr.net/man/man/psql/1)'
---

The [PostgreSQL](http://www.postgresql.org/) relational database system is a powerful, scalable, and standards-compliant open-source database platform. This guide will help you install and configure PostgreSQL on your Ubuntu 16.04 LTS (Xenial Xerus) Linode. We assume you've already followed the steps detailed in our [getting started guide](/docs/getting-started/).

{: .note}
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install PostgreSQL

Make sure your package repositories are up to date by issuing the following command:

    sudo apt-get update && apt-get upgrade

Install PostgreSQL from the Ubuntu packages:

    sudo apt-get install postgresql postgresql-contrib

## Configure PostgreSQL

### Set the Postgres User's Password

By default, PostgreSQL will create a Linux user named `postgres` to access the database software. It is important not to use the `postgres` user for any other purpose (e.g. connecting to other networks). Doing so presents a risk to the security of your databases.

1.  Change the `postgres` user's Linux password with the following command. If you are already logged in as the `postgres` user, issue the `exit` command first to return to your normal user shell.

        sudo passwd postgres

2.  Issue the following commands to set a password for the `postgres` database user. Note that this user is distinct from the `postgres` Linux user. Be sure to replace `newpassword` with a strong password and keep it in a secure place. This password will be used to connect to the database via the network; peer authentication will be used by default for local connections made with `psql` while logged into a shell as the `postgres` user.

        su - postgres
        psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"

### Create a Database

1.  Create a database by issuing the following command:

        createdb mytestdb 

2.  Connect to the test database:

        psql mytestdb 

3.  You will see the following output:

        psql (9.5.2)
        Type "help" for help.

        mytestdb=#

    This is the PostgreSQL client shell, in which you can issue SQL commands. To see a list of available commands, use the `\h` command. You may find more information on a specific command by adding it after `\h`.

### Create Tables

This section will demonstrate how to create a test database with an employee's first and last name, along with a unique key. When creating your own tables, you may specify as many parameters (columns) as you need, and name them appropriately.

1.  To create a table called "employees" in your test database:

        CREATE TABLE employees (employee_id int, first_name varchar, last_name varchar); 

2.  To insert a record into the table:

        INSERT INTO employees VALUES (1, 'John', 'Doe'); 

3.  To see the contents of the "employees" table:

        SELECT * FROM employees; 

    This produces the following output:

         employee_id | first_name | last_name 
        -------------+------------+-----------
                   1 | John       | Doe
        (1 row)

4.  To exit the PostgreSQL shell, enter the command `\q`. 

### Create PostgreSQL Roles

PostgreSQL grants database access via "roles", which are used to specify privileges. Roles can be understood as having a similar function to Linux "users," although you may also create a role that consists of a set of other roles, similar to a Linux "group." PostgreSQL roles apply globally, so you will not need to create the same role twice if you'd like to grant it access to more than one database on the same server.

1.  To add a new role and specify its password, issue the following command as the `postgres` Linux user:

        createuser examplerole --pwprompt 

    To delete this role:

        dropuser examplerole

2.  To grant all privileges on the table "employees" to the user "examplerole", connect to the database:

        psql mytestdb 

    From the PostgreSQL shell, enter the following command:

        GRANT ALL ON employees TO examplerole; 

3.  PostgreSQL uses peer authentication by default. This means database connections will be granted to local system users that own or have privileges on the database being connected to. Such authentication is useful in cases where a particular system user will be running a local program (e.g. scripts, CGI/FastCGI processes owned by separate users, etc), but for greater security, you may wish to require passwords to access your databases. To do so, edit `/etc/postgresql/9.5/main/pg_hba.conf` using `sudo` or as the `postgres` user:

    {: .file-excerpt }
    /etc/postgresql/9.5/main/pg_hba.conf
    :   ~~~

        #TYPE    DATABASE   USER   ADDRESS  METHOD

        # "local" is for Unix domain socket connections only
        local    all        all             peer
        ~~~

    Replace "peer" with "md5" on this line to activate password authentication and restart PostgreSQL:

        sudo service postgresql restart

4.  To access the database "mytestdb" as "examplerole", issue the following command from the `postgres` Linux user shell:

        psql -U examplerole -W mytestdb 

You will be prompted to enter the password for the "alison" user and given `psql` shell access to the database. When using a database, you may check access privileges for each of its tables with the `\z` command.

## Secure Remote Database Access

PostgreSQL listens for connections on localhost, and it is not advised to reconfigure it to listen on public IP addresses. If you would like to access your databases remotely using a graphical tool, please follow one of these guides:

-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/databases/postgresql/pgadmin-windows)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/databases/postgresql/pgadmin-macos-x)
