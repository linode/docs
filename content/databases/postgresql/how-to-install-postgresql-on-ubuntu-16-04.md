---
author:
  name: Linode
  email: docs@linode.com
description: 'A tutorial on installing and configuring the PostgreSQL relational database system on Ubuntu distributions.'
keywords: ["postgresql", "ubuntu 16.04", "postgresql database", "open source database", "relational database"]
aliases: ['databases/postgresql/use-postgresql-relational-databases-on-ubuntu-16-04/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-05-20
modified_by:
  name: Phil Zona
published: 2016-05-20
title: 'How to Install PostgreSQL on Ubuntu 16.04'
external_resources:
 - '[PostgreSQL Online Documentation](http://www.postgresql.org/docs/)'
 - '[psql manual page](http://www.rootr.net/man/man/psql/1)'
---

![How to Install PostgreSQL on Ubuntu 16.04](/docs/assets/how-to-install-postgresql-on-ubuntu-16-04.jpg "How to Install PostgreSQL on Ubuntu 16.04")

# A Guide to Installing PostgreSQL Relational Databases on Ubuntu 16.04

The [PostgreSQL](http://www.postgresql.org/) relational database system is a powerful, scalable, and standards-compliant open-source database platform. This guide will help you install and configure PostgreSQL on your Ubuntu 16.04 LTS (Xenial Xerus) Linode.

## Before You Begin

1.  Familiarize yourself with our [Getting Started guide](/docs/getting-started) and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server guide](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, visit the [Users and Groups guide](/docs/tools-reference/linux-users-and-groups) for more information.
{{< /note >}}

## Install PostgreSQL

Install PostgreSQL from the Ubuntu package repository:

    sudo apt-get install postgresql postgresql-contrib

## Configure PostgreSQL

### Modify the Postgres Users

By default, PostgreSQL will create a Linux user named `postgres` to access the database software.

{{< caution >}}
The `postgres` user should not be used for for other purposes (e.g. connecting to other networks). Doing so presents a serious risk to the security of your databases.
{{< /caution >}}

1.  Change the `postgres` user's Linux password:

        sudo passwd postgres

2.  Issue the following commands to set a password for the `postgres` database user. Be sure to replace `newpassword` with a strong password and keep it in a secure place.

        su - postgres
        psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"

    Note that this user is distinct from the `postgres` Linux user. The Linux user is used to access the database, and the PostgreSQL user is used to perform administrative tasks on the databases.

    The password set in this step will be used to connect to the database via the network. Peer authentication will be used by default for local connections. See the [Secure Local PostgreSQL Access section](#secure-local-postgresql-access) for information about changing this setting.

### Create a Database

Run the commands in this section as the `postgres` Linux user.

1.  Create a sample database called `mytestdb`:

        createdb mytestdb

2.  Connect to the test database:

        psql mytestdb

3.  You will see the following output:

        psql (9.5.2)
        Type "help" for help.

        mytestdb=#

    This is the PostgreSQL client shell, in which you can issue SQL commands. To see a list of available commands, use the `\h` command. You may find more information on a specific command by adding it after `\h`.

### Create Tables

This section contains examples which create a test database with an employee's first and last name, assigning each a unique key. When creating your own tables, you may specify as many parameters (columns) as you need and name them appropriately. Run the commands in this section from the PostgreSQL shell, opened in Step 2 of the [Create a Database](#create-a-database) section.

1.  Create a table called "employees" in your test database:

        CREATE TABLE employees (employee_id int, first_name varchar, last_name varchar);

2.  Insert a record into the table:

        INSERT INTO employees VALUES (1, 'John', 'Doe');

3.  View the contents of the "employees" table:

        SELECT * FROM employees;

    This produces the following output:

         employee_id | first_name | last_name
        -------------+------------+-----------
                   1 | John       | Doe
        (1 row)

4.  Exit the PostgreSQL shell by entering the `\q` command.

### Create PostgreSQL Roles

PostgreSQL grants database access via *roles* which are used to specify privileges. Roles can be understood as having a similar function to Linux "users." In addition, roles may also be created as a set of other roles, similar to a Linux "group." PostgreSQL roles apply globally, so you will not need to create the same role twice if you'd like to grant it access to more than one database on the same server.

The example commands in this section should be run as the `postgres` Linux user.

1.  Add a new user role, then a password at the prompt:

        createuser examplerole --pwprompt

    If you need to delete a role, you can use the `dropuser` command in place of `createuser`.

2.  Connect to the database:

        psql mytestdb

    You'll be connected as the `postgres` database user by default.

3.  From the PostgreSQL shell, enter the following to grant all privileges on the table `employees` to the user `examplerole`:

        GRANT ALL ON employees TO examplerole;

4.  Exit the PostgreSQL shell by entering `\q`.

### Secure Local PostgreSQL Access

PostgreSQL uses *peer authentication* by default. This means database connections will be granted to local system users that own or have privileges on the database being connected to. Such authentication is useful in cases where a particular system user will be running a local program (e.g. scripts, CGI/FastCGI processes owned by separate users, etc.), but for greater security, you may wish to require passwords to access your databases.

Commands in this section should be run as the `postgres` Linux user unless otherwise specified.

1.  Edit the `/etc/postgresql/9.5/main/pg_hba.conf` file, under the `# "local" is for Unix domain socket connections only` header:

    {{< file-excerpt "/etc/postgresql/9.5/main/pg_hba.conf" >}}
# "local" is for Unix domain socket connections only
local    all        all             peer

{{< /file-excerpt >}}


    Replace `peer` with `md5` on this line to activate password authentication using an MD5 hash.

2.  To enable these changes, we need to restart PostgreSQL. However, we did not grant the `postgres` user sudo privileges for security reasons. Return to the normal user shell:

        exit

3.  Restart PostgreSQL and switch back to the `postgres` user:

        sudo service postgresql restart
        su - postgres

4.  As `postgres`, connect to the test database as the `examplerole` PostgreSQL user:

        psql -U examplerole -W mytestdb

    You will be prompted to enter the password for the `examplerole` user and given `psql` shell access to the database. When using a database, you may check access privileges for each of its tables with the `\z` command.

## Secure Remote PostgreSQL Access

PostgreSQL listens for connections on `localhost` and it is not advised to reconfigure it to listen on public IP addresses. If you would like to access your databases remotely using a graphical tool, please follow one of these guides:

-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/databases/postgresql/pgadmin-windows)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/databases/postgresql/pgadmin-macos-x)
