---
author:
  name: Linode
  email: docs@linode.com
description: 'Use mysqldump to back up MySQL databases, tables, or entire database management systems.'
keywords: ["mysql", "mariadb", "backup", "back up", "mysqldump"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/backup-options/','security/backups/back-up-your-mysql-databases/','databases/mysql/back-up-your-mysql-databases/']
published: 2018-01-30
modified: 2018-01-30
modified_by:
  name: Linode
title: 'Use mysqldump to Back Up MySQL or MariaDB'
external_resources:
 - '[MySQL Database Backup Methods page](http://dev.mysql.com/doc/refman/5.1/en/backup-methods.html)'
 - '[mysqldump - A Database Backup Program, MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html)'
---

![Use mysqldump to Back Up MySQL or MariaDB](mysqldump-backup-title.jpg "Use mysqldump to Back Up MySQL or MariaDB")


[MySQL](http://www.mysql.com/) and [MariaDB](https://mariadb.com/) include the [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) utility to simplify the process to create a backup of a database or system of databases. Using `mysqldump` creates a *logical backup*. **You can only use this tool if your database process is accessible and running.**

If your database isn't accessible for any reason, you can instead create a [*physical backup*](/docs/databases/mysql/create-physical-backups-of-your-mariadb-or-mysql-databases/), which is a copy of the filesystem structure which contains your data.

The instructions in this guide apply to both MySQL and MariaDB. For simplification, the name MySQL will be used to apply to either.

## Before You Begin

-  You will need a working MySQL or MariaDB installation, and a database user to run the backup. For help with installation, see the [Linode MySQL documentation](/docs/databases/mysql/).

-  You will need root access to the system, or a user account with `sudo` privileges.

## Back up a Database

{{< content "mysqldump-database-backup-short" >}}

## Automate Backups with cron

Entries can be added to `/etc/crontab` to regularly schedule database backups.

1.  Create a file to hold the login credentials of the MySQL root user which will be performing the backup. Note that the system user whose home directory this file is stored in can be unrelated to any MySQL users.

    {{< file "/home/example_user/.mylogin.cnf" >}}
[client]
user = root
password = MySQL root user's password
{{< /file >}}

2.  Restrict permissions of the credentials file:

        chmod 600 /home/example_user/.mylogin.cnf

3. Create the cron job file. Below is an example cron job to back up the entire database management system every day at 1am:

    {{< file "/etc/cron.daily/mysqldump" >}}
0 1 * * * /usr/bin/mysqldump --defaults-extra-file=/home/example_user/.my.cnf -u root --single-transaction --quick --lock-tables=false --all-databases > full-backup-$(date +%F).sql
{{< /file >}}

    For more information on cron, see the [cron(8)](https://linux.die.net/man/8/cron) and [cron(5)](https://linux.die.net/man/5/crontab) manual pages.

## Restore a Backup

{{< content "mysqldump-database-restore-short" >}}
