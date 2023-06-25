---
slug: how-to-install-postgresql-on-ubuntu-16-04
description: 'A tutorial on installing and configuring the PostgreSQL relational database system on Ubuntu distributions using Ubuntu 16.04 as an example.'
keywords: ["postgresql", "ubuntu 16.04", "postgre", "postgresql database", "open source database", "relational database"]
tags: ["ubuntu","database","postgresql"]
aliases: ['/databases/postgresql/how-to-install-postgresql-on-ubuntu-16-04/','/databases/postgresql/use-postgresql-relational-databases-on-ubuntu-16-04/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-03-30
modified_by:
published: 2016-05-20
title: Installing PostgreSQL on Ubuntu 16.04
title_meta: 'How to Install PostgreSQL on Ubuntu 16.04'
external_resources:
 - '[PostgreSQL Online Documentation](http://www.postgresql.org/docs/)'
 - '[psql manual page](http://www.rootr.net/man/man/psql/1)'
relations:
    platform:
        key: install-postrgesql-database
        keywords:
            - distribution: Ubuntu 16.04
authors: ["Linode"]
---

![How to Install PostgreSQL on Ubuntu 16.04](how-to-install-postgresql-on-ubuntu-16-04.jpg "How to Install PostgreSQL on Ubuntu 16.04")

The [PostgreSQL](https://www.postgresql.org/) (also known as "Postgres") relational database system is a powerful, scalable, and standards-compliant open-source database platform. This guide will help you install and configure PostgreSQL on your Ubuntu 16.04 LTS (Xenial Xerus) Linode.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with sudo. If you’re not familiar with the sudo command, visit the [Users and Groups guide](/docs/guides/linux-users-and-groups/) for more information.
{{< /note >}}

## Installing PostgreSQL On Ubuntu 16.04

Install PostgreSQL from the Ubuntu package repository:

`sudo apt-get install postgresql postgresql-contrib`

## Configure PostgreSQL

### Modify the postgres User

By default, PostgreSQL creates a Linux user named "postgres" to access the database software.

{{< note type="alert" >}}
The postgres user should not be used for other purposes (e.g. connecting to other networks). Doing so presents a serious risk to the security of your databases.
{{< /note >}}

1. Change the postgres user’s Linux password: `sudo passwd postgres`

1. Issue the following commands to set a password for the postgres database user. Be sure to replace `newpassword` with a strong password and keep it in a secure place.

         su - postgres
         psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"

{{< note >}}
This user is distinct from the postgres Linux user. The Linux user is used to access the database, and the PostgreSQL user is used to perform administrative tasks on the databases. The password set in this step will be used to connect to the database via the network. Peer authentication will be used by default for local connections. See the [Secure Local PostgreSQL Access section](/docs/guides/how-to-install-postgresql-on-ubuntu-16-04/#secure-local-postgresql-access) for information about changing this setting.
{{< /note >}}

### Create a PostgreSQL Database

Run the commands in this section as the postgres Linux user.

1. Create a sample database called mytestdb: `createdb mytestdb`
1. Connect to the test database: `psql mytestdb`.

    The output is similar to the following:
      {{< output >}}
      psql (9.5.25)
Type "help" for help.
mytestdb=#
      {{< /output >}}
1.  This is the PostgreSQL client shell, in which you can issue SQL commands. To see a list of available commands, use the `\h` command. You may find more information on a specific command by adding it after `\h`.
1.  Exit the PostgreSQL shell by entering the `\q` command.

### Create Tables

This section contains examples that create a test database with an employee’s first and last name, assigning each a unique key. When creating the tables, you may specify as many parameters (columns) as you need and name them appropriately. Run the commands in this section from the PostgreSQL shell, opened in Step 2 of the [Create a Database](/docs/guides/how-to-install-postgresql-on-ubuntu-16-04/#create-a-database) section.

1.  Create a table called “employees” in the test database:

        CREATE TABLE employees (employee_id int, first_name varchar, last_name varchar);

1.  Insert a record into the table:

        INSERT INTO employees VALUES (1, 'John', 'Doe');

1.  View the contents of the “employees” table:

        SELECT * FROM employees;

    An output similar to the following appears:
       {{< output >}}
    employee_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Doe
(1 row)
      {{< /output >}}


### Merging Tables

It's also possible to merge two database tables. Merge the “employees” table with another table “employees_1.”

1.  Create a new table "employees_1"  and view the contents of "employees_1": `SELECT * FROM employees_1;`
        {{< output >}}
    employee_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Doe
           3 | Jax        | Smith
(2 rows)

  {{< /output >}}

1. Update the table "employees" with a new row and view contents of "employees": `SELECT * FROM employees;`
       {{< output >}}
     employee_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Doe
           2 | Jane       | Doe
(2 rows)

  {{< /output >}}
1. Use the `union` command to merge both tables. To do so, run the following command:

        SELECT * FROM employees union SELECT * FROM employees_1

     An output similar to the following appears:
    {{< output >}}
      employee_id | first_name | last_name
-------------+------------+-----------
           2 | Jane       | Doe
           3 | Jax        | Smith
           1 | John       | Doe
(3 rows)

  {{< /output >}}

1. To merge both tables by updating either of these tables, merge "employees_1" by updating data in the “employees” table:

       INSERT INTO employees SELECT * FROM employees_1 where not exists(SELECT * FROM employees where employee_id=employees_1.employee_id and first_name=employees_1.first_name and last_name=employees_1.last_name);

    An output similar to the following appears, when you try: `SELECT * FROM employees;`

   {{< output >}}
      employee_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Doe
           2 | Jane       | Doe
           3 | Jax        | Smith

  {{< /output >}}

### Creating New Tables with Selected Rows

To create a new table where you selectively wish to keep only rows with certain information, use the following syntax to create a new table:

    CREATE TABLE < ADD YOUR NAME FOR NEW TABLE HERE > AS
    SELECT * FROM < YOUR ORIGINAL TABLE > WHERE < YOUR COLUMN NAME > = < COLUMN VALUE>;

To illustrate this syntax, create a new table "employees_new" when "last_name" is equal to "Doe". Run the syntax above on the "employees" table and find rows with "last_name" as "Doe" To do this, type the following command:

    CREATE TABLE employees_new AS
    SELECT * FROM employees WHERE last_name = 'Doe';

This creates a new table named “employees_new” with “last_name” as “Doe.” To check our new table, we can run the following command:

    SELECT * FROM employees_new;

  An output similar to the following appears:
    {{< output >}}
      employee_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Doe
           2 | Jane       | Doe

  {{< /output >}}

### Extracting Relevant Information

You can run a range of operations where we can extract relevant information from these databases. For example, to extract all rows from "employees_1" where someone's last name is "Doe," we can run the following command:

    SELECT * FROM employees WHERE last_name = 'Doe';

An output similar to the following appears:
    {{< output >}}
      employee_id | first_name | last_name
-------------+------------+-----------
           1 | John       | Doe
           2 | Jane       | Doe

  {{< /output >}}

This is pretty straightforward. But let's say if you are trying to find a record where you don't remember the exact row value. In that case, you can use the partial match PostgreSQL operator “LIKE.” Let's try to pull out complete row information where “last_name” in the “employees_1” table starts with an "S". Run the following query on “employees_1” with a “LIKE” operator:

    SELECT * FROM employees_1 WHERE last_name LIKE 'S%';

An output similar to the following appears:
    |{{< output >}}
      employee_id | first_name | last_name
-------------+------------+-----------
           3 | Jax       | Smith
  {{< /output >}}

The way you defined the “LIKE” operator was such that the query checked every “last_name” value to find values that started with an "S". The trailing “%” in “last_name LIKE 'S%'” says find all strings that start with an "S".

### **Create PostgreSQL Roles**

PostgreSQL grants database access via _roles_ that are used to specify privileges. Roles can be understood as having a similar function to Linux “users.” In addition, roles may also be created as a set of other roles, similar to a Linux “group.” PostgreSQL roles apply globally, so you will not need to create the same role twice if you’d like to grant it access to more than one database on the same server.

The example commands in this section should be run as the postgres Linux user.

1. Add a new user role, then a password at the prompt:

         createuser examplerole --pwprompt

1. If you need to delete a role, use the `dropuser` command in place of `createuser`.

1. Connect to the database: `psql mytestdb`

1. You’ll be connected as the postgres database user by default.

1. From the PostgreSQL shell, enter the following to grant all privileges on the table employees to the user examplerole: `GRANT ALL ON employees TO examplerole;`

1. Exit the PostgreSQL shell by entering `\q`.

### **Secure Local PostgreSQL Access**

PostgreSQL uses _peer authentication_ by default. This means database connections will be granted to local system users that own or have privileges on the database being connected to. Such authentication is useful in cases where a particular system user will be running a local program (e.g. scripts, CGI/FastCGI processes owned by separate users, etc.), but for greater security, you may wish to require passwords to access your databases.

Commands in this section should be run as the postgres Linux user unless otherwise specified.

1.  Edit the `/etc/postgresql/9.5/main/pg_hba.conf` file, under the # "local" is for Unix domain socket connections only header:
{{< file "/etc/postgresql/9.5/main/pg_hba.conf" plaintext >}}
#"local" is for Unix domain socket connections only
local    all        all             peer
{{< /file >}}

1.  Replace "peer" with "md5" on this line to activate password authentication using an MD5 hash.

1.  To enable these changes, we need to restart PostgreSQL. However, we did not grant the postgres user sudo privileges for security reasons. Return to the normal user shell: `exit`

1.  Restart PostgreSQL: `sudo service postgresql restart`

1.  Switch back to the postgres user: `su - postgres`

1.  As postgres, connect to the test database as the examplerole PostgreSQL user: `psql -U examplerole -W mytestdb`

1.  You are prompted to enter the password for the examplerole user and given psql shell access to the database. When using a database, you may check access privileges for each of its tables with the `\z` command.

## Secure Remote PostgreSQL Access

PostgreSQL listens for connections on localhost and it is not advised to reconfigure it to listen on public IP addresses. If you would like to access your databases remotely using a graphical tool, please follow one of these guides:
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/guides/how-to-access-postgresql-database-remotely-using-pgadmin-on-windows/)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/guides/securely-manage-remote-postgresql-servers-with-pgadmin-on-macos-x/)
