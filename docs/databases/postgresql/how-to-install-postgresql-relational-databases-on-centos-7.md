---
author:
  name: Linode
  email: docs@linode.com
description: 'The PostgreSQL relational database is a powerful open source database platform. Learn how to install it on CentOS 7 in this simple tutorial.'
keywords: ["postgresql", "CentOS 7", "open source database", "relational database"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-12-12
modified_by:
  name: Nick Brewer
published: 2016-12-12
title: 'How to Install PostgreSQL Relational Databases on CentOS 7'
external_resources:
 - '[PostgreSQL Online Documentation](http://www.postgresql.org/docs/)'
 - '[psql manual page](http://www.rootr.net/man/man/psql/1)'
aliases: ['databases/postgresql/use-postgresql-relational-databases-on-centos-7/']
---

The [PostgreSQL](http://www.postgresql.org/) relational database system is a powerful, scalable, and standards-compliant open-source database platform. This guide will help you install and configure PostgreSQL on your CentOS 7 Linode.

![Use PostgreSQL Relational Databases on CentOS 7](/docs/assets/use-postgresql-on-centos-7-title.png "Use PostgreSQL Relational Databases on CentOS 7")

## Before You Begin

1.  Familiarize yourself with our [Getting Started guide](/docs/getting-started) and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server guide](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo yum update

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, visit the [Users and Groups guide](/docs/tools-reference/linux-users-and-groups) for more information.
{{< /note >}}

## Install PostgreSQL

In this section, we'll cover two different methods for installing PostgreSQL. If you do not need the latest version, we recommend using the first method to install PostgreSQL from the CentOS repositories.

Unless otherwise noted, the instructions in subsequent sections of this guide will be compatible with versions installed by either method.

### Install From the CentOS Repositories

1.  As of this writing, the CentOS 7 repositories ship with PostgreSQL version `9.2.15`. To install from the CentOS repositories, simply run:

        sudo yum install postgresql-server postgresql-contrib

2.  Initialize your Postgres database and start PostgreSQL:

        sudo postgresql-setup initdb
        sudo systemctl start postgresql

3.  **Optional**: Configure PostgreSQL to start on boot:

        sudo systemctl enable postgresql

### Install From the Postgres Repositories

Alternatively, you can install the latest version from the Postgres repositories. As of this publication, PostgreSQL `9.6.3` is the most recent version available for CentOS 7, but these steps can be applied to any RPM-based installation.

{{< note >}}
When Postgres is installed using this method, the version number is included in its configuration directories. For example, `/var/lib/pgsql` becomes `/var/lib/pgsql/9.6`. This is also the case with systemd units; `systemctl status postgresql` becomes `systemctl status postgresql-9.6`.
{{< /note >}}

1.  Select the version you wish to install from the [Postgres Yum repositories](https://yum.postgresql.org/repopackages.php). Locate the CentOS 7 link for your chosen version and download it to your Linode:

        wget https://download.postgresql.org/pub/repos/yum/9.6/redhat/rhel-7-x86_64/pgdg-centos96-9.6-3.noarch.rpm

2.  Install the RPM, as well as the [EPEL](https://fedoraproject.org/wiki/EPEL) repositories, which will be used to satisfy dependencies:

        sudo yum install pgdg-centos96-9.6-3.noarch.rpm epel-release

3.  Update Yum to apply your changes and install PostgreSQL. When installing Postgres manually, you will have to specify the version:

        sudo yum update
        sudo yum install postgresql96-server postgresql96-contrib

4.  Initialize your database and start PostgreSQL:

        sudo /usr/pgsql-9.6/bin/postgresql96-setup initdb
        sudo systemctl start postgresql-9.6

5.  **Optional**: Configure PostgreSQL to start on boot:

        sudo systemctl enable postgresql-9.6

## Configure PostgreSQL

### Secure the Postgres Users

By default, PostgreSQL will create a Linux user named `postgres` to access the database software.

{{< caution >}}
The `postgres` user should not be used for other purposes (e.g., connecting to other networks). Doing so presents a serious risk to the security of your databases.
{{< /caution >}}

1.  Change the `postgres` user's Linux password:

        sudo passwd postgres

2.  Issue the following commands to set a password for the `postgres` database user. Be sure to replace `newpassword` with a strong password and keep it in a secure place.

        su - postgres
        psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"

    Note that this user is distinct from the `postgres` Linux user. The Linux user is used to access the database, and the PostgreSQL user is used to perform administrative tasks on the databases.

    The password set in this step will be used to connect to the database via the network. Peer authentication will be used by default for local connections. See the [Secure Local PostgreSQL Access section](/docs/databases/postgresql/how-to-install-postgresql-relational-databases-on-centos-7#secure-local-access) for information about changing this setting.

### Access the PostgreSQL Shell

The PostgreSQL client shell allows you to issue SQL commands to administer your databases. As the `postgres` Linux user, log in by running:

    psql postgres

This will log you in as the `postgres` database user. You'll see a prompt similar to this:

    psql (9.2.15)
    Type "help" for help.

    postgres=#

In the last line, `postgres=#` indicates the name of the current database. To see a list of available commands, type `\h`. You may find more information on a specific command by adding it after `\h`. Once you’ve finished using the shell, you can exit with `\q`.

## Work with Databases

This section will cover how to create, delete and access databases.

### Create a Database

You can create databases with the `createdb` command. Create a sample database called `mytestdb` by running this command as the `postgres` Linux user:

    createdb mytestdb

It's also possible to assign ownership of the database to a specific Postgres user/role. For example, you could assign ownership to the `examplerole` role by running:

    createdb mytestdb -O examplerole

The `createdb` command has several additional options, which can be found in the [PostgreSQL documentation](https://www.postgresql.org/docs/9.2/static/app-createdb.html).

### Connect to a Database

You can use the `psql` command to connect to a specific database.

1.  Connect to the test database:

        psql mytestdb

2.  You will see the following output:

        psql (9.2.15)
        Type "help" for help.

        mytestdb=#

    By default, you will connect to a database as your [peer-authenticated](#peer-authentication) user. However, if you've enabled [local password access](#secure-local-access), it's also possible to specify which user you wish to connect as:

        psql mytestdb -U examplerole

    You'll be prompted to enter the password for the `examplerole` database user before you access the shell.

### List Databases

From the [Postgres shell](#access-the-postgresql-shell), you can list all of your databases with the `\l` or `\list` command. You will receive output similar to this:

    postgres=# \l
                              List of databases
    Name    |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
    -----------+----------+----------+-------------+-------------+-----------------------
    mytestdb  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
    postgres  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
    template0 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
    |         |          |          |             | postgres=CTc/postgres
    template1 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
    |         |          |          |             | postgres=CTc/postgres
    (4 rows)

You may also show the current database and user by entering `\c` from the Postgres shell. Additional info, like socket and port, will be included if you use `\conninfo`:

    You are connected to database "mytestdb" as user "postgres" via socket in "/var/run/postgresql" at port "5432".

### Delete a Database

You can delete, or *drop*, databases with the `dropdb` command. For example, to delete the `mytestdb` database created previously, issue this command as the `postgres` Linux user:

    dropdb mytestdb

{{< caution >}}
Deleted databases cannot be recovered.
{{< /caution >}}

## Work With Tables

PostgreSQL databases use tables to store and organize information within a database. In this section, you'll find practical examples for adding, removing and manipulating tables. Unless otherwise noted, the commands in this section should be issued from the Postgres shell once you've [connected to your database](#connect-to-a-database).

### Create Tables

This section contains examples that create a test database with an employee's first and last name, assigning each a unique key. When creating your own tables, you may specify as many parameters (columns) as you need and name them appropriately.

1.  Create a table called "employees" in your test database:

        CREATE TABLE employees (employee_id int, first_name varchar, last_name varchar);

2.  Insert a record into the table:

        INSERT INTO employees VALUES (1, 'John', 'Doe');

### View the Content of a Table

To view the contents of the "employees" table:

    SELECT * FROM employees;

This produces the following output:

    employee_id | first_name | last_name
    -------------+------------+-----------
              1 | John       | Doe
    (1 row)

### List Tables in a Database

You can list all tables in the current database with the `\dt` command:

    mytestdb-# \dt
              List of relations
    Schema |   Name    | Type  |  Owner
    --------+-----------+-------+----------
    public | employees | table | postgres

### Delete Tables

Delete tables with `DROP TABLE`. To delete the `employees` table:

    DROP TABLE employees;

`DROP TABLE` accepts multiple comma-separated table names as arguments. For example, if you had two separate tables called `employees1` and `employees2`, you could delete them both by running:

    DROP TABLE employees1, employees2;

### Add Columns

Tables can be altered to add definitions, data types and columns. In this example you'll add a new `start_date` column that uses the [date](https://www.postgresql.org/docs/9.2/static/datatype-datetime.html) data type.

1.  Add the `start_date` column to the `employees` table:

        ALTER TABLE employees ADD start_date date;

2.  Verify your change:

        SELECT * FROM employees;

    You'll see that the new column has been created, but it does not contain any data:

        employee_id | first_name | last_name | start_date
        -------------+------------+-----------+------------
                  1 | John       | Doe       |
        (1 row)

    In this example you've used the `date` data type, but PostgreSQL tables support several different types of data. See the [PostgreSQL Documentation](https://www.postgresql.org/docs/9.2/static/datatype.html) for a full explanation of supported data types.

### Add and Update Rows

In this section, you'll use `UPDATE` to enter a value into the existing row you've created. Then, you'll create an entirely new row with `INSERT`.

1.  Update the `start_date` field for the user with the value `1` in the `employee_id` column:

        UPDATE employees SET start_date = '2016-09-28' WHERE employee_id = '1';

2.  Create a new row in the `employees` table:

        INSERT INTO employees VALUES (2, 'Jane', 'Smith', '2015-03-09');

3.  Verify your changes:

        SELECT * FROM employees;

    You'll see that the start date of `2016-09-28` has been added to the first row, and that a new row has been created for "Jane Smith":

        employee_id | first_name | last_name | start_date
        -------------+------------+-----------+------------
                  1 | John       | Doe       | 2016-09-28
                  2 | Jane       | Smith     | 2015-03-09
        (2 rows)

### Remove Columns and Rows

In this section, you'll remove a column from your table and then remove the second row.

1.  Use `ALTER TABLE` to remove the `start_date` column you made previously:

        ALTER TABLE employees DROP start_date;

2.  Now use `DELETE` to remove the second row of your `employees` table. The following command will remove the row with a value of `2` in the `employee_id` column:

        DELETE FROM employees WHERE employee_id = '2';

3.  Confirm your changes:

        SELECT * FROM employees;

    Your table now consists of a single row, with the `start_date` column removed:

        employee_id | first_name | last_name
        -------------+------------+-----------
                  1 | John       | Doe
        (1 row)

### Query a Table

You can use queries to pull specific information from your database. This command will query your `employees` table to only return values for the `employee_id` and `last_name` columns:

    SELECT last_name,employee_id FROM employees;

You'll receive an output similar to this:

    last_name | employee_id
    -----------+-------------
    Doe       |           1
    (1 row)

PostgreSQL supports many querying options. See the [PostgreSQL Documentation](https://www.postgresql.org/docs/9.2/static/sql-select.html) for more information.

## Work With Roles

PostgreSQL grants database access via **roles**, which are used to specify privileges. Roles can be understood as having a similar function to Linux "users." In addition, roles may also be created as a set of other roles, similar to a Linux "group." PostgreSQL roles apply globally, so you will not need to create the same role twice if you'd like to grant it access to more than one database on the same server.

### Create Roles

New user roles are added with the `createuser` command. To create a new user called `examplerole`, issue this command as the `postgres` Linux user:

    createuser examplerole --pwprompt

You will be prompted to create a password for the new user.

### Give a Role Access to a Database

In this example, you'll give the newly created `examplerole` user access to your database.

1.  Connect to the database:

        psql mytestdb

    You'll be connected as the `postgres` database user by default.

2.  From the PostgreSQL shell, enter the following to grant all privileges on the table `employees` to the user `examplerole`:

        GRANT ALL ON employees TO examplerole;

3.  Exit the database with `\q`.

### List All Roles

You can list all roles from the [Postgres Shell](#access-the-postgresql-shell) by running `\du`. You'll see an output similar to this:

    postgres=# \du
                                 List of roles
    Role name   |                   Attributes                   | Member of
    -------------+------------------------------------------------+-----------
    examplerole |                                                | {}
    postgres    | Superuser, Create role, Create DB, Replication | {}

### Group Roles

For ease of administration, it's possible to add multiple user roles to a single group, so that their privileges can be managed as a whole. In this section you'll create a new group and add the `examplerole` user to it. These commands should be run as the `postgres` Linux user.

1.  Use the `createuser` command to create a new group role. The `--no-login` option is specified because groups do not need login capability.

        createuser examplegroup --no-login

2.  Log into the Postgres shell and add `examplerole` to the new group:

        psql postgres
        GRANT examplegroup TO examplerole;

3.  From the Postgres shell, verify your changes with `\du`. You'll see that the `examplerole` user is now listed as a member of the `examplegroup` group:

        postgres=# \du
                                        List of roles
        Role name    |                   Attributes                   |   Member of
        --------------+------------------------------------------------+----------------
        examplegroup | Cannot login                                   | {}
        examplerole  |                                                | {examplegroup}
        group        |                                                | {}
        postgres     | Superuser, Create role, Create DB, Replication | {}

    The `createuser` command has several other options. See the [PostgreSQL documentation](https://www.postgresql.org/docs/9.2/static/app-createuser.html) for more details.

4.  When you've finished applying your changes, exit the Postgres shell with `\q`.

### Alter Roles

While specific settings and privileges can be applied to a role when it's created, you can also modify a role's properties later on. In this example, we'll modify the `examplerole` user so that it can create new databases. The commands in this section should be run as the `postgres` Linux user.

1.  Log in as the `postgres` database user:

        psql postgres

2.  From the Postgres shell, add the `CREATEDB` parameter to the `examplerole` user:

        ALTER ROLE examplerole CREATEDB;

    A number of permissions can be applied when creating or altering a role. See the [PostgeSQL Documentation](https://www.postgresql.org/docs/9.2/static/sql-createrole.html) for more details.

3.  Use `\du` to confirm your changes. You'll see that the "Create DB" attribute is listed next to the `examplerole` user:

        postgres=# \du
                                     List of roles
        Role name   |                   Attributes                   | Member of
        -------------+------------------------------------------------+-----------
        examplerole | Create DB                                      | {}
        group       |                                                | {}
        postgres    | Superuser, Create role, Create DB, Replication | {}

4.  Once you've finished, exit the Postgres shell with `\q`.

### Delete Roles

The `dropuser` command is used to delete PostgreSQL roles. To delete the `examplerole` user, issue this command as the `postgres` Linux user:

    dropuser examplerole

### Peer Authentication

PostgreSQL uses **peer authentication** by default. This means that database connections will be granted to local system users if their Linux username matches the name of their PostgreSQL role. To make use of peer authentication effectively, you would need to create both a Linux user and a corresponding PostgreSQL role. For the `examplerole` role you just created, you can use peer authentication by creating an `examplerole` local system user. This command must be run as a user with `sudo` access:

    sudo adduser examplerole && passwd examplerole

Note that you will be prompted to create a password for the new `examplerole` Linux user. Alternatively, you can follow our steps to [secure local access](#secure-local-access).

## Secure PostgreSQL

### Secure Local Access

While PostgreSQL's default peer authentication is useful in cases where a particular system user will be running a local program (e.g., scripts, CGI/FastCGI processes owned by separate users, etc.), you may wish to require passwords for greater security.

Commands in this section should be run as the `postgres` Linux user unless otherwise specified.

1.  Edit the `/var/lib/pgsql/data/pg_hba.conf` file, under the `# "local" is for Unix domain socket connections only` header:

    {{< file-excerpt "/var/lib/pgsql/data/pg_hba.conf" >}}
# "local" is for Unix domain socket connections only
local    all        all             peer

{{< /file-excerpt >}}


    Replace `peer` with `md5` on this line to activate password authentication using an MD5 hash.

    {{< note >}}
If you installed PostgreSQL from the [Postgres repositories](#install-from-the-postgres-repositories), you will need to specify your version number in this file path, for example: `/var/lib/pgsql/9.6/data/pg_hba.conf`.
{{< /note >}}

2.  To enable these changes, you need to restart PostgreSQL. However, you did not grant the `postgres` user sudo privileges for security reasons. Return to the normal user shell:

        exit

3.  Restart PostgreSQL and switch back to the `postgres` user:

        sudo systemctl restart postgresql
        su - postgres

4.  As `postgres`, connect to the test database as the `examplerole` PostgreSQL user:

        psql mytestdb -U examplerole

    You will be prompted to enter the password for the `examplerole` user and then given `psql` shell access to the database. When using a database, you may check access privileges for each of its tables with the `\z` command.

### Secure Remote Access

PostgreSQL listens for connections on `localhost` by default, and it is not advised to reconfigure it to listen on public IP addresses. If you wish to make PostgreSQL externally accessible, it's recommended that you follow the Postgres documentation for [using SSL](https://www.postgresql.org/docs/9.2/static/ssl-tcp.html) to secure your remote connections. Alternatively, you could connect to PostgreSQL over an [SSH tunnel](https://www.postgresql.org/docs/9.2/static/ssh-tunnels.html). To access your databases remotely using a graphical tool, please follow one of these guides:

-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/databases/postgresql/pgadmin-windows)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/databases/postgresql/pgadmin-macos-x)
