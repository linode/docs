---
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for backing up MySQL databases using the mysqldump tool.'
keywords: ["mysql", "backup", "mysqldump"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/backup-options/', 'security/backups/back-up-your-mysql-databases/','databases/mysql/back-up-your-mysql-databases/']
modified: 2017-12-06
modified_by:
  name: Linode
published: 2017-12-06
title: Use mysqldump to Back Up Your MySQL Databases
external_resources:
 - '[MySQL Database Backup Methods page](http://dev.mysql.com/doc/refman/5.1/en/backup-methods.html)'
 - '[mysqldump - A Database Backup Program, MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html)'
---

![Use mysqldump to Back Up Your MySQL Database](/docs/assets/back_up_your_mysql-databases.png "Use mysqldump to Back Up Your MySQL Database")

[MySQL](http://www.mysql.com/) provides the [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) utility to simplify the process of backing up a database, or system of databases.


## Before You Begin

You should have a working installation of MySQL on your system before beginning this guide, and a MySQL user to run the backup as. A MySQL user with read (e.g. `SELECT`) permission is able to use both the `mysqldump` and MySQL client tools to take backups as described below. See our [How to Install MySQL on Debian](/docs/databases/mysql/how-to-install-mysql-on-debian-8/) guide to install MySQL and create a sample database.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## MySQL Backups

The backup command's general syntax is shown below. You will be prompted for a password before `mysqldump` begins it's backup process. Depending on the size of the database, it could take a while to complete. The database backup will be created in the directory the command is run from, and the `-$(date +%F)` addition to the command will insert a timestamp into the filename.

    mysql -u [username] -p [databaseName] > [filename].sql

 - Create a backup of an entire database management system:

        mysqldump --all-databases > full-backup-$(date +%F).sql -u root -p

 - When backing up the entire DBMS isn't necessary, you can dump just a specific database of your choice. Replace `db1` with the name of the database you want to back up.

        mysqldump -u username -p db1 > db1-backup-$(date +%F).sql

- It's also possible to back up a single table from any database. In the example below, `table1` is exported from the database `db1`.

        mysqldump -u username -p db1 table1 > db1-table1-$(date +%F).sql

## Automate Backups with cron

Entries can be added to `/etc/crontab` to regularly schedule database backups. The mysqldump command must be able to run without any user input, so it's important that the syntax of the username and password are given correctly. There should be no space between the `-p` flag and the password.

- To back up the entire database management system at 1am. Replace `root` and `PASSWORD` with the username and password you would like to run the backup as.

        0 1 * * * /usr/bin/mysqldump --all-databases > full-$(date +%F).sql -u root -pPASSWORD

- To schedule only a database backup of `db1`, like was done further above:

        0 1 * * * /usr/bin/mysqldump db1 > db1-backup-$(date +%F).sql -u root -pPASSWORD

## Restoring a Backup

The restoration command's general syntax is:

    mysql -u [username] -p [databaseName] < [filename].sql

- Restore an entire DBMS backup. You will be prompted for the MySQL root user's password, and **this will overwrite all current data in the MySQL database system**.

        mysql -u root -p < full-backup.sql

- Restore a single database dump. An empty or old destination database must already exist to import the data into, and the MySQL user you're running the command as must have write access to that database.

        mysql -u [username] -p db1 < db1-backup.sql

- To restore a single table, you also must have a destination database ready to receive the data.

        mysql -u dbadmin -p db1 < db1-table1.sql