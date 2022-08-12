---
author:
  name: Rajakavitha Kodhandapani
  email: docs@linode.com
description: "PostgreSQL is a powerful, scalable, and standards-compliant open-source database. Here''s how to easily deploy PostgreSQL using Marketplace Apps."
keywords: ['database','postgresql','rdbms','relational database']
tags: ["linode platform","postgresql","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-17
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying PostgreSQL through the Linode Marketplace"
external_resources:
 - '[pgAdmin Documentation](http://www.pgadmin.org/docs/)'
 - '[PostgreSQL Documentation](http://www.postgresql.org/docs/)'
aliases: ['/platform/marketplace/deploy-postresql-with-marketplace-apps/', '/platform/one-click/deploy-postresql-with-one-click-apps/', '/guides/deploy-postresql-with-one-click-apps/','/guides/deploy-postresql-with-marketplace-apps/','/guides/postgresql-marketplace-app/']
---

The PostgreSQL relational database system is a powerful, scalable, and standards-compliant open-source database platform. It is designed to handle a range of workloads, from single machines to data warehouses or Web services with many concurrent users.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** PostgreSQL should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 11
- **Recommended minimum plan:** All plan types and sizes can be used.

### PostgreSQL Options

{{< content "marketplace-limited-user-fields-shortguide">}}

## Getting Started after Deployment

### Access PostgreSQL

After PostgreSQL has finished installing, you will be able to access PostgreSQL from the console via ssh with your Linode's IPv4 address:

1.  [SSH into your Linode](/docs/guides/set-up-and-secure/#connect-to-the-instance) and [create a limited user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account).

1.  Log out and log back in as your limited user account.

1.  Update your server:

        sudo apt-get update && sudo apt-get upgrade

## Using PostgreSQL

### Modify the Postgres Users

By default, PostgreSQL will create a Linux user named `postgres` to access the database software.

{{< caution >}}
The `postgres` user should not be used for other purposes (e.g. connecting to other networks). Doing so presents a serious risk to the security of your databases.
{{< /caution >}}

1.  Change the `postgres` user's Linux password:

        sudo passwd postgres

2.  Issue the following commands to set a password for the `postgres` database user. Be sure to replace `newpassword` with a strong password and keep it in a secure place.

        su - postgres
        psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"

    This user is distinct from the `postgres` Linux user. The Linux user is used to access the database, and the PostgreSQL user is used to perform administrative tasks on the databases.

    The password set in this step will be used to connect to the database via the network. Peer authentication will be used by default for local connections. See the [Secure Local PostgreSQL Access section](#secure-local-postgresql-access) for information about changing this setting.

### Create a Database

Run the commands in this section as the `postgres` Linux user.

1.  Create a sample database called `mytestdb`:

        createdb mytestdb

2.  Connect to the test database:

        psql mytestdb

3.  You will see the following output:

        psql (12.2 (Debian 12.2-2.pgdg90+1))
        Type "help" for help.

        mytestdb=#

    This is the PostgreSQL client shell, in which you can issue SQL commands. To see a list of available commands, use the `\h` command. You may find more information on a specific command by adding it after `\h`.

### Create Tables

This section contains examples which create a test database with an employee's first and last name, assigning each a unique key. When creating your own tables, you may specify as many parameters (columns) as you need and name them appropriately. Run the commands in this section from the PostgreSQL client shell that you opened to create `mytestdb` database.

1.  Create a table called "employees" in your test database:

        CREATE TABLE employees (employee_id int PRIMARY KEY, first_name varchar, last_name varchar);

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

PostgreSQL grants database access through *roles* which are used to specify privileges. Roles can be understood as having a similar function to Linux "users." In addition, roles may also be created as a set of other roles, similar to a Linux "group." PostgreSQL roles apply globally, so you will not need to create the same role twice if you'd like to grant it access to more than one database on the same server.

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

## Next Steps

{{< content "marketplace-update-note-shortguide">}}

For more on PostgreSQL, checkout the following guides:

- [Securely Manage Remote PostgreSQL Servers](/docs/guides/securely-manage-remote-postgresql-servers-with-pgadmin-on-macos-x/)
