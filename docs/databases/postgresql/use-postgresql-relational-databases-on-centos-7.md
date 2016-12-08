---
author:
  name: Linode
  email: docs@linode.com
description: 'Use PostgreSQL Relational Databases on CentOS 7.'
keywords: 'postgresql,CentOS 7,postgresql database,open source database,relational database'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Friday, May 20th, 2016
modified_by:
  name: Nick Brewer
published: 'Friday, May 20th, 2016'
title: 'Use PostgreSQL Relational Databases on CentOS 7'
external_resources:
 - '[PostgreSQL Online Documentation](http://www.postgresql.org/docs/)'
 - '[psql manual page](http://www.rootr.net/man/man/psql/1)'
---

The [PostgreSQL](http://www.postgresql.org/) relational database system is a powerful, scalable, and standards-compliant open-source database platform. This guide will help you install and configure PostgreSQL on your CentOS 7 Linode.

## Before You Begin

1.  Familiarize yourself with our [Getting Started guide](/docs/getting-started) and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server guide](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo yum update

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, visit the [Users and Groups guide](/docs/tools-reference/linux-users-and-groups) for more information.

## Install PostgreSQL

In this section we'll cover two different methods for installing PostgreSQL. If you do not need the latest version, we recommend using the first installation method to install PostgreSQL from the default CentOS repositories.

Unless otherwise noted, the instructions in subsequent sections of this guide will be compatible with both versions.

### Install From the CentOS Repositories
1.  As of this writing, the CentOS 7 repositories ship with PostgreSQL version `9.2.15`. To install from the CentOS repositories, simply run:

        sudo yum install postgresql-server postgresql-contrib

2.  Initialize your Postgres database, and start PostgreSQL:

        sudo postgresql-setup initdb
        sudo systemctl start postgresql

3.  **Optional**: Configure PostgreSQL to start on boot:

        sudo systemctl enable postgresql

### Install From the Postgres Repositories  
Alternatively, you can install the latest version from the Postgres repositories. As of this writing, PostgreSQL `9.6.3` is the most recent version available for CentOS 7, but these steps can be applied to any RPM-based installation.

{: .note}
>
>When Postgres is installed manually, the version number is included in its configuration directories. For example, `/var/lib/pgsql` becomes `/var/lib/pgsql-9.6`. This is also the case with SystemD units; `systemctl status postgresql` becomes `systemctl status postgresql-9.6`.


1.  Select the version you wish to install from the [Postgres Yum repositories](https://yum.postgresql.org/repopackages.php). Locate the CentOS 7 link for your chosen version, and download it to your Linode:

        wget https://download.postgresql.org/pub/repos/yum/9.6/redhat/rhel-7-x86_64/pgdg-centos96-9.6-3.noarch.rpm

2.  Install the RPM, as well as the [EPEL](https://fedoraproject.org/wiki/EPEL) repositories, which will be used to satisfy dependencies:

        sudo yum install pgdg-centos96-9.6-3.noarch.rpm epel-release

3.  Update Yum to apply your changes, and install PostgreSQL. When installing Postgres manually, you will have to specify the version:

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

{: .caution}
>
>The `postgres` user should not be used for for other purposes (e.g. connecting to other networks). Doing so presents a serious risk to the security of your databases.

1.  Change the `postgres` user's Linux password:

        sudo passwd postgres

2.  Issue the following commands to set a password for the `postgres` database user. Be sure to replace `newpassword` with a strong password and keep it in a secure place.

        su - postgres
        psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"

    Note that this user is distinct from the `postgres` Linux user. The Linux user is used to access the database, and the PostgreSQL user is used to perform administrative tasks on the databases.

    The password set in this step will be used to connect to the database via the network. Peer authentication will be used by default for local connections. See the [Secure Local PostgreSQL Access section](#secure-local-postgresql-access) for information about changing this setting.

### Access the PostgreSQL Shell

The PostgreSQL client shell allows you to issue SQL commands to administer your databases. As the `postgres` Linux user, log in by running:

    psql postgres

This will log you in as the `postgres` database user. You'll see a prompt similar to this:

    

### Connect

## Work with Databases

### Create a Database

You can create databases with the `createdb` command. Create a sample database called `mytestdb` by running this command as the `postgres` Linux user:

    createdb mytestdb

It's also possible to assign ownership of the database to a specific Postgres user/role. For example, you could assign ownership to the user `testuser` by running:

    createdb mytestdb -O testuser

The `createdb` command has several additional options, which can be found in the [PostgreSQL documentation](https://www.postgresql.org/docs/9.2/static/app-createdb.html).

### Delete a Database

You can delete databases using the `dropdb` command. For example, if you want to delete the `mytestdb` database created in the previous step, issue this command as the `postgres` Linux user:

    dropdb mytestdb

{: .caution}
>Deleted databases cannot be recovered.

### List All Databases

1.  You can list all of your databases by logging in as the `postgres` administrative user you created previously. This command should be run as the `postgres` Linux user:

        pgsl postgres

2.  From the Postgres command line, you can use either the `\l` or `\list` command. You will receive output similar to this:

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

### Connect to a Database



2.  Connect to the test database:

        psql mytestdb

3.  You will see the following output:

        psql (9.2.15)
        Type "help" for help.

        mytestdb=#

    This is the PostgreSQL client shell, in which you can issue SQL commands. To see a list of available commands, use the `\h` command. You may find more information on a specific command by adding it after `\h`. You can exit the shell at any time by running `\q`.

## Work with Tables and Rows

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

### Delete Tables

PostgreSQL has a number of options for deleting tables:

*  [DROP](https://www.postgresql.org/docs/9.2/static/sql-droptable.html) removes a table entirely.


*  [DELETE](https://www.postgresql.org/docs/9.2/static/sql-delete.html) is used to delete rows from a table.
*  [TRUNCATE](https://www.postgresql.org/docs/9.2/static/sql-truncate.html) is used to remove all rows form

### List Tables




### Create PostgreSQL Roles

PostgreSQL grants database access via *roles* which are used to specify privileges. Roles can be understood as having a similar function to Linux "users." In addition, roles may also be created as a set of other roles, similar to a Linux "group." PostgreSQL roles apply globally, so you will not need to create the same role twice if you'd like to grant it access to more than one database on the same server.

The example commands in this section should be run as the `postgres` Linux user unless otherwise specified.

1.  Add a new user role, then a password at the prompt:

        createuser examplerole --pwprompt

    If you need to delete a role, you can use the `dropuser` command in place of `createuser`.

2.  Connect to the database:

        psql mytestdb

    You'll be connected as the `postgres` database user by default.

3.  From the PostgreSQL shell, enter the following to grant all privileges on the table `employees` to the user `examplerole`:

        GRANT ALL ON employees TO examplerole;

4.  Exit the PostgreSQL shell by entering `\q`.

PostgreSQL uses peer authentication by default. This means that database connections will be granted to local system users if their Linux username matches the name of their PostgreSQL role. To make use of peer authentication effectively you would need to create both a Linux user and a corresponding PostgreSQL role. For the `examplerole` role you just created, you can use peer authentication by creating an `examplerole` local system user. This command must be run as a user with `sudo` access:

    sudo adduser examplerole && passwd examplerole

 Note that you will be prompted to create a password for the new `examplerole` Linux user. Alternatively, you can follow the steps in the next section to secure local PostgreSQL access.

### Secure Local PostgreSQL Access

While PostgreSQL's default peer authentication is useful in cases where a particular system user will be running a local program (e.g. scripts, CGI/FastCGI processes owned by separate users, etc.), you may wish to require passwords for greater security.

Commands in this section should be run as the `postgres` Linux user unless otherwise specified.

1.  Edit the `/var/lib/pgsql/data/pg_hba.conf` file, under the `# "local" is for Unix domain socket connections only` header:

    {: .file-excerpt }
    /var/lib/pgsql/data/pg_hba.conf
    :   ~~~
        # "local" is for Unix domain socket connections only
        local    all        all             peer
        ~~~

    Replace `peer` with `md5` on this line to activate password authentication using an MD5 hash.

2.  To enable these changes, we need to restart PostgreSQL. However, we did not grant the `postgres` user sudo privileges for security reasons. Return to the normal user shell:

        exit

3.  Restart PostgreSQL and switch back to the `postgres` user:

        sudo systemctl restart postgresql
        su - postgres

4.  As `postgres`, connect to the test database as the `examplerole` PostgreSQL user:

        psql -U examplerole -W mytestdb

    You will be prompted to enter the password for the `examplerole` user and given `psql` shell access to the database. When using a database, you may check access privileges for each of its tables with the `\z` command.

## Secure Remote PostgreSQL Access

PostgreSQL listens for connections on `localhost` and it is not advised to reconfigure it to listen on public IP addresses. If you would like to access your databases remotely using a graphical tool, please follow one of these guides:

-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/databases/postgresql/pgadmin-windows)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/databases/postgresql/pgadmin-macos-x)
