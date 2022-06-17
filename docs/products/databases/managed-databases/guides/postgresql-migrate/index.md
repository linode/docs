---
author:
  name: Linode
  email: docs@linode.com
title: "Migrate a PostgreSQL Database to a Managed Database"
description: "Learn how to migrate an existing PostgreSQL database to Linode's Managed Database service."
published: 2022-06-17
---

This guide covers how to migrate an existing PostgreSQL database to a Managed Database. When migrating a database, there are two important terms to keep in mind: the *source* database and the *target* database.

- **Source database:** The original database running on a software, system, or machine that you wish to decommission. This could be PostgreSQL running within your own Linux server, a development database on your local machine, or even a cloud database.
- **Target database:** The new replacement database that you wish to use. For this guide, the target database will be a Managed Database running on Linode's platform.

Your individual migration workflow could deviate from the instructions provided here. You may need to consult with your developers or your application's documentation to learn how to perform some of these steps and to gather any best practices. You should also perform the migration on a staging server first and/or during a time when downtime least affects your users and/or business.

## Before You Begin

- **Create a Managed Database:** To minimize downtime, make sure to create your Managed Database database cluster *before* continuing. This ensures that your database has been fully provisioned (which can take up to 30 minutes) and that you have the new database credentials available. See [Create a Managed Database](/docs/products/databases/managed-databases/guides/create-database/).

- **Ensure that the PostgreSQL version on your new Managed Database is equal to or greater than the version on your source database cluster.** This guide uses the [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) utility, which cannot be used to import data into a PostgreSQL version *older* than on the source machine.

## Export from the Source Database

Exporting the data from the original database is facilitated through the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) and [pg_dumpall](https://www.postgresql.org/docs/current/app-pg-dumpall.html) utilities. The **pg_dump** tool saves a copy of a single database as a script file, while the **pg_dumpall** tool can save all databases as well as any [database roles](https://www.postgresql.org/docs/current/user-manag.html).

1.  **Export the database roles.** Replace *[user]* with the username for your source database. The default username for many PostgreSQL installations is `postgres`.

        pg_dumpall --roles-only --username=[user] --file=roles.backup

    If you are connecting to a remote database, add `--host [host]` and `--port [port]` to the command above, replacing *[host]* with the host url of your remote database and *[port]* with the port number.

    {{< note >}}
This step requires admin/superuser access to the PostgreSQL cluster. If you do not have this level of access and you still wish to preserve the existing roles, you can manually create the roles on your Managed Database though [SQL](https://www.postgresql.org/docs/current/sql-createrole.html) or the [`createuser`](https://www.postgresql.org/docs/current/app-createuser.html) functionality of psql. If you do not do this, all data will be owned by the `linpostgres` user once you import your data to your Managed Database cluster.
{{</ note >}}

1.  **Export each database you wish to backup.** Replace *[database-name]* with the name of your database and *[user]* with the username for your source database. The other options in this command are used to ensure maximum compatibility with Linode's PostgreSQL Managed Databases.

        pg_dump -Fd --quote-all-identifiers --verbose --lock-wait-timeout=480000 --no-unlogged-table-data --serializable-deferrable --jobs=1 --dbname [database-name] --username [user] --file database.backup

    Again, add `--host [host]` and `--port [port]` to the command above if you are connecting to a remote database. You can run this command for each database you wish to export, though you may want to edit the `--file` option with a custom filename.

## Import to the Target Managed Database

Once you've successfully backed up the source database, you can import your data into your Managed Database (the *target* database). To import the database, this guide covers the [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) utility.

1.  **Import your database roles to your Managed Database** using the psql command below. Replace *[host]*, and *[username]* with the corresponding values for your Managed Database. See [Connection Details](/docs/products/databases/managed-databases/guides/postgresql-connect/#view-connection-details).

        psql --host=[host] --username=[username] --dbname=postgres --file=roles.backup

    This assumes your database roles backup file is called *roles.backup* and is located in your current directory (as per previous steps in this guide). If you used a different filename or path for your backup, replace *roles.backup* as needed in the above command.

1.  **Create your database**, making sure that your preferred database name doesn't already exist. If it does, you can drop the database before creating it. In the commands below, replace *[database-name]* with the name of your database and *[host]* and *[username]* with the corresponding [Connection Details](/docs/products/databases/managed-databases/guides/postgresql-connect/#view-connection-details) for your Managed Database.

        psql --host=[host] --username=[username] --dbname=postgres --command='DROP DATABASE IF EXISTS [database-name];'
        psql --host=[host] --username=[username] --dbname=postgres --command='CREATE DATABASE [database-name];'

    {{< caution >}}
Using `DROP DATABASE` command results in the deletion of any data stored on that database. If you are replacing an existing database and would like to avoid data loss, make sure you have a backup containing any data you would like to retain prior to running the command.
{{</ caution >}}

1.  **Import your database file** to your newly created database.

        pg_restore --host=[host] --username=[user] --verbose --no-tablespaces --dbname=[database-name] database.backup

    This assumes your database backup file is called *database.backup* and located in your current directory (as per previous steps in this guide). If you used a different filename or path for your backup, replace *database.backup* as needed in the above command.