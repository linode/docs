---
title: "Deploy PostgreSQL through the Linode Marketplace"
description: "PostgreSQL is a powerful, scalable, and standards-compliant open-source database. Here''s how to easily deploy PostgreSQL using Marketplace Apps."
published: 2020-03-17
modified: 2025-03-05
keywords: ['database','postgresql','rdbms','relational database']
tags: ["linode platform","postgresql","marketplace","cloud-manager"]
external_resources:
 - '[pgAdmin Documentation](http://www.pgadmin.org/docs/)'
 - '[PostgreSQL Documentation](http://www.postgresql.org/docs/)'
aliases: ['/products/tools/marketplace/guides/postgresql/','/platform/marketplace/deploy-postresql-with-marketplace-apps/', '/platform/one-click/deploy-postresql-with-one-click-apps/', '/guides/deploy-postresql-with-one-click-apps/','/guides/deploy-postresql-with-marketplace-apps/','/guides/postgresql-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 611376
marketplace_app_name: "PostgreSQL"
---

The PostgreSQL relational database system is a powerful, scalable, and standards-compliant open-source database platform. It is designed to handle a range of workloads, from single machines to data warehouses or Web services with many concurrent users.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** PostgreSQL should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used.

### PostgreSQL Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Getting Started after Deployment

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Using PostgreSQL

### Modify the Postgres Users

By default, PostgreSQL creates a Linux user named `postgres` to access the database software.

{{< note type="alert" >}}
The `postgres` user should not be used for other purposes (e.g. connecting to other networks). Doing so presents a serious risk to the security of your databases.
{{< /note >}}
1. To change to the PostgreSQL user's Linux shell from `root` or the sudo user created during deployment, run the commands:
```
as root: su postgres
as sudo: sudo su postgres
```
### Create a Database

To create a database and connect to it as the `postgres` Linux user:

1.  To create a sample database called `mytestdb`, run:

        createdb mytestdb

2.  To connect to the `mytestdb` database, run:

        psql mytestdb

You get the following output:

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

{{% content "marketplace-update-note-shortguide" %}}

For more on PostgreSQL, checkout the following guides:

- [Securely Manage Remote PostgreSQL Servers](/docs/guides/securely-manage-remote-postgresql-servers-with-pgadmin-on-macos-x/)
