---
slug: back-up-and-restore-using-mysqldump
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to use mysqldump to back up MySQL (and MariaDB) database clusters, individual databases, and tables."
keywords: ["mysql", "mariadb", "backup", "back up", "mysqldump"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/databases/mysql/backup-options/','/security/backups/back-up-your-mysql-databases/','/databases/mysql/back-up-your-mysql-databases/','/databases/mysql/use-mysqldump-to-back-up-mysql-or-mariadb/','/guides/use-mysqldump-to-back-up-mysql-or-mariadb/']
published: 2018-01-30
modified: 2022-06-29
modified_by:
  name: Linode
title: "Backing Up MySQL and MariaDB Databases Using mysqldump"
external_resources:
 - '[MySQL Database Backup Methods page](http://dev.mysql.com/doc/refman/5.1/en/backup-methods.html)'
 - '[mysqldump - A Database Backup Program, MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html)'
tags: ["mariadb","database","mysql"]
image: mysqldump-backup-title.jpg
---

[MySQL](http://www.mysql.com/) and [MariaDB](https://mariadb.com/) include the [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) utility to simplify the process to create a backup of a database or system of databases. Using `mysqldump` creates a *logical backup* and generates the SQL statements needed to reproduce the original database structure and data.

{{< note >}}
Since the mysqldump utility needs to connect to the database, the database management software must be running and accessible. If the database is not accessible for any reason, you can instead create a [*physical backup*](/docs/guides/create-physical-backups-of-your-mariadb-or-mysql-databases/), which is a copy of the file system directory containing your MySQL database.
{{</ note >}}

## Before You Begin

- **Obtain the connection details for the MySQL instance you wish to use.** If you do not have a MySQL instance yet, you can create a Managed Database, deploy the MySQL Marketplace App, or install MySQL (or MariaDB) on a Compute Instance.

- **Ensure your MySQL user has proper grants:** The MySQL user you intend to use to export your existing database must have `SELECT`, `LOCK TABLES`, `SHOW VIEW`, and `TRIGGER` grants.

## General mysqldump Syntax

The following list represents mysqldump commands for various scenarios. Within the commands, `[options]` represents all of the command options required to perform the backup according to your own needs. See [Common Command Options](#common-command-options) for a list of available options.

-   **Single database**:

        mysqldump [options] [database_name] > backup.sql

-   **Specific tables in single database**:

        mysqldump [options] [database_name] [table_name] > backup.sql

-   **Multiple specific databases**:

        mysqldump [options] --databases [database1_name] [database2_name] > backup.sql

-   **All databases**:

        mysqldump [options] --all-databases > backup.sql

    {{< caution >}}
Do not use the `--all-databases` option if you intend on restoring this database to a Linode MySQL Managed Database. It may delete existing users and restrict access to your database.
{{</ caution >}}

{{< note >}}
Depending on the size of the database, it could take a while to complete. For large tables, you may want to use the `--quick` option to receive rows one at a time instead of all at once.
{{</ note >}}

## Common Command Options

The following list is a collection of common options used with the mysqldump command. At minimum, the username and password is required. When connecting to a remote database server, the host (and perhaps the port) should be provided. For a full list of available options, reference the [Option Syntax](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html#mysqldump-option-summary) documentation.

{{< note >}}
When backing up a Linode MySQL [Managed Database](/docs/products/databases/managed-databases/) with mysqldump, review the [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/mysql-connect/) guide for instructions on viewing the connection details (including the username, password, host, and port).
{{</ note >}}

- **Username** (`--user=[]` or `-u []`): The username of your MySQL user. This user must have proper grants to access the database.

- **Password** (`--password=[]` or `-p[]`): Specifies that the user's password is required for the connection. The password can be entered directly in the command itself (though that is not recommended due to security concerns) or the password can be omitted (by just using the `--password` option with no value). In the password is omitted, mysqldump prompts you for the password before connecting to the database. For more details about password security, see MySQL's [End-User Guidelines for Password Security](https://dev.mysql.com/doc/refman/8.0/en/password-security-user.html).

- **Host** (`--host=[]` or `-h []`): The IP address or hostname of the remote database server. You can omit this option from the command if you are connecting to a local MySQL instance on your same system.

- **Port** (`--port=[]` or `-P []`): The port number of that the MySQL database instance uses. This can be omitted if your MySQL instance uses the default port of `3306`.

- **Output file** (`> backup.sql`): The name of the output file. To keep your backups organized with unique filenames, it may be helpful to add an automatically generated timestamp (ex: `backup-$(date +%F).sql` for just the date or `backup-$(date +%Y%m%d-%H%M%S).sql` for the date and time). You can reference the formatting options on the [date manual page](https://man7.org/linux/man-pages/man1/date.1.html) to further customize it.

If you are frequently backing up a database with mysqldump running a backup through a cron job, you can securely store many of these options (including the password). See the [Securely Storing Credentials](#securely-storing-credentials) section below. Other options can be stored in an [option file](https://dev.mysql.com/doc/refman/8.0/en/option-files.html).

### Additional Options

- `--single-transaction`: Issue a BEGIN SQL statement before dumping data from the server. See [--single-transaction](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html#option_mysqldump_single-transaction).
- `--quick` or `-q`: Enforce dumping tables row by row. This provides added safety for systems with low memory and for large databases where storing tables in memory could become problematic. See [--quick](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html#option_mysqldump_quick).
- `--lock-tables=false`: Do not lock tables for the backup session.
- `--ssl-mode=REQUIRED`: Force SSL when your existing database has SSL enabled.
- `--set-gtid-purged=OFF`: Use this option if you have [GTID-based replication](https://dev.mysql.com/doc/refman/5.6/en/replication-gtids-howto.html) enabled.

### Securely Storing Credentials

MySQL includes the [mysql_config_editor](https://dev.mysql.com/doc/refman/8.0/en/mysql-config-editor.html) utility, which is used to securely store your MySQL credentials inside of an encrypted file in your home directory: `~/.mylogin.cnf`. Each set of credentials is stored in option groups called *login paths*. You can create your own custom login paths, which you can specify when running the mysql or mysqldump commands.

-   **Create or edit a login path:** Run the `set` command to store your credentials and database connection details. Replace *[name]* with whatever name you wish to use for your custom login path, *[username]* with your MySQL username, and *[host]* with the remote host IP or domain (if you are connecting to a remote database). You can also specify the port (`--port`) and socket (`-socket`) if needed.

        mysql_config_editor set --login-path=[name] --user=[username] --host=[host] --password --warn

    {{< note >}}
You can also use special login path names, which are used by default in certain commands without needing to specify it. These special login paths include `client` and `mysql` for the mysql command and `mysqdump` for the mysqldump command.
{{</ note >}}

-   **View login paths:** Run the `print` command to view all login paths (`--all`) or a specific login path (`--login-path=[name]`).

        mysql_config_editor print --all

To specify a set of stored credentials in the mysql or mysqldump command, use the `--login-path=[]` (or `G []`) option as show below. Replace *[name]* with the name of your login path.

    mysqldump --login-path=[name] exampledatabase > backup.sql

## Examples

-   **Single database on a *local* system:** The following command backs up a single database called *SampleDatabase* from a MySQL instance on a local system. The user is *exampleuser* and the `-p` option without a given value indicates mysqldump should prompt for the password. The backup filename includes a timestamp.

        mysqldump -u exampleuser -p --single-transaction SampleDatabase > backup-$(date +%F).sql

-   **Single database on a *remote* system:** This command again backs up a single database, only this time the MySQL instance is on a remote system. The host in this example is an IP address of *192.0.2.1*, though a domain name could also be provided. Provided the remote database uses port 3306, no port needs to be specified (as is the case in this example).

        mysqldump -h 192.0.2.1 -u exampleuser -p --single-transaction SampleDatabase > backup-$(date +%F).sql

-   **Single database on a *Linode MySQL* [***Managed Database***](/docs/products/databases/managed-databases/):** In this example, the mysqldump command is used to backup a database called *Test* in a Linode MySQL Managed Database cluster. See [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/mysql-connect/) guide for instructions on viewing the connection details (including the username, password, host, and port).

        mysqldump -h lin-1111-1111-mysql-primary.servers.linodedb.net -u linroot -p --single-transaction --set-gtid-purged=OFF Test > backup-$(date +%F-%H.%M.%S).sql

## Automate Backups with cron

To schedule regular backups of your database, you can use the mysqldump command inside of a cron job.

1.  Store your database credentials and connection details using the `mysql_config_editor set` command. An example command is provided below, though be sure to replace the values with your own. See [Securely Storing Credentials](#securely-storing-credentials) section for additional details and options.

        mysql_config_editor set --login-path=[name] --user=[username] --host=[host] --password --warn

1.  Create the folder where you wish to store your backup files. This can be anywhere that is accessible by your user.

        mkdir ~/database-backups

1.  Edit your user's crontab file.

        crontab -e

1. Add the cron job to your crontab file. In the example below, replace *[name]* with the login path name you wish to use and *[database-name]* with the database you wish to back up. Edit the location where you are storing the backups, as well as any other options, as needed.

    {{< file >}}
0 1 * * * /usr/bin/mysqldump --login-path=[name] --single-transaction [database-name] > ~/database-backups/backup-$(date +%F-%H.%M.%S).sql
{{< /file >}}

For more information on cron, see our [Using Cron](/docs/guides/schedule-tasks-with-cron/) guide or review the the [cron(8)](https://linux.die.net/man/8/cron) and [cron(5)](https://linux.die.net/man/5/crontab) manual pages.

## Restore a Backup

The restoration command's general syntax is:

    mysql -u [username] -p [databaseName] < [filename].sql

-   Restore an entire DBMS backup. You will be prompted for the MySQL root user's password:\
  **This will overwrite all current data in the MySQL database system**

        mysql -u root -p < full-backup.sql

-   Restore a single database dump. An empty or old destination database must already exist to import the data into, and the MySQL user you're running the command as must have write access to that database:

        mysql -u [username] -p db1 < db1-backup.sql

-   Restore a single table, you must have a destination database ready to receive the data:

        mysql -u dbadmin -p db1 < db1-table1.sql
