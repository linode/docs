---
author:
  name: Linode
  email: docs@linode.com
description: 'Use mysqldump to back up MySQL databases, tables, or entire database management systems.'
keywords: ["mysql", "mariadb", "backup", "mysqldump"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/backup-options/','security/backups/back-up-your-mysql-databases/','databases/mysql/back-up-your-mysql-databases/']
modified: 2018-01-10
modified_by:
  name: Linode
published: 2018-01-10
title: 'Use mysqldump to Back Up MySQL or MariaDB'
external_resources:
 - '[MySQL Database Backup Methods page](http://dev.mysql.com/doc/refman/5.1/en/backup-methods.html)'
 - '[mysqldump - A Database Backup Program, MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html)'
---

## What is mysqldump?

[MySQL](http://www.mysql.com/) and [MariaDB](https://mariadb.com/) include the [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) utility to simplify the process to create a backup of a database or system of databases. Using `mysqldump` is a form of *logical backup*, as opposed to a [*physical backup*](/docs/databases/mysql/create-physical-backups-of-your-mariadb-or-mysql-databases/), which is a copy of the filesystem structure which contains your data.

The instructions in this guide apply to both MySQL and MariaDB. For simplification, the name MySQL will be used to apply to either.

## Before You Begin

Install MySQL or MariaDB on your Linode. You'll need a database user to run the backup. For help with installation or login, visit the [Linode MySQL documentation](/docs/databases/mysql/).

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Back up a Database

### mysqldump General Syntax

    mysqldump -u [username] -p [databaseName] > [filename].sql

* mysqldump prompts for a password before it starts the backup process.
* Depending on the size of the database, it could take a while to complete.
* The database backup will be created in the directory the command is run.
* `-$(date +%F)` adds a timestamp to the filename.

### Backup Examples

* Create a backup of an entire Database Management System (DBMS):

        mysqldump --all-databases > full-backup-$(date +%F).sql -u root -p

* Back up a specific database. Replace `db1` with the name of the database you want to back up:

        mysqldump -u username -p db1 > db1-backup-$(date +%F).sql

* Back up a single table from any database. In the example below, `table1` is exported from the database `db1`:

        mysqldump -u username -p db1 table1 > db1-table1-$(date +%F).sql

## Automate Backups with cron

Entries can be added to `/etc/crontab` to regularly schedule database backups. The `mysqldump` command must be able to run without any user input, so it's important that the syntax of the username and password are given correctly. There should be no space between the `-p` flag and the password.

* Back up the entire database management system every day at 1am. Replace `root` and `PASSWORD` with the username and password you would like to run the backup as:

        0 1 * * * /usr/bin/mysqldump --all-databases > full-$(date +\%F).sql -u root -p PASSWORD

* Schedule a database backup of `db1`:

        0 1 * * * /usr/bin/mysqldump db1 > db1-backup-$(date +\%F).sql -u root -p PASSWORD

## Restore a Backup

The restoration command's general syntax is:

    mysql -u [username] -p [databaseName] < [filename].sql

* Restore an entire DBMS backup. You will be prompted for the MySQL root user's password:\
  **This will overwrite all current data in the MySQL database system**

        mysql -u root -p < full-backup.sql

* Restore a single database dump. An empty or old destination database must already exist to import the data into, and the MySQL user you're running the command as must have write access to that database:

        mysql -u [username] -p db1 < db1-backup.sql

* Restore a single table, you must have a destination database ready to receive the data:

        mysql -u dbadmin -p db1 < db1-table1.sql
