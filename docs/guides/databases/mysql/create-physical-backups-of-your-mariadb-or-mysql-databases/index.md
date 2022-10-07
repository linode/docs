---
slug: create-physical-backups-of-your-mariadb-or-mysql-databases
author:
  name: Linode
  email: docs@linode.com
description: "Create a physical MySQL backup databases by copying the relevant filesystem parts. Useful for recovering inaccessible databases."
keywords: ["mysql", "mariadb", backup", "back up", mysqldump"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-30
modified: 2018-01-30
modified_by:
  name: Linode
title: Create Physical Backups of your MariaDB or MySQL Databases
external_resources:
 - '[Backup and Restore Overview; MariaDB Library](https://mariadb.com/kb/en/library/backup-and-restore-overview/)'
 - '[Database Backup Methods; MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.7/en/backup-methods.html)'
tags: ["mariadb","database","mysql"]
aliases: ['/databases/mysql/create-physical-backups-of-your-mariadb-or-mysql-databases/']
---

While the `mysqldump` tool is the preferred backup method for a MariaDB or MySQL database or database system it only works when the database server is accessible and running. If the database cannot be started or the host system is inaccessible, the database can still be copied directly.

A *physical backup* is often necessary in situations when you only have access to a recovery environment (such as [Finnix](/docs/guides/rescue-and-rebuild/)) where you mount your system's disks as external storage devices. If you want to read about *logical backups* using `mysqldump`, [see our guide](/docs/guides/mysqldump-backups/) on the topic.

For simplification, the name MySQL will be used throughout this guide but the instructions will work for both MySQL and MariaDB.

{{< note >}}
The steps in this guide require root privileges. Log in as the root user with `su -` before you begin.
{{< /note >}}

## Create a Backup

1.  If you are not running in recovery mode (a Finnix session), stop the `mysql` service:

        systemctl stop mysql

2.  Locate your database directory. It should be `/var/lib/mysql/` on most systems but if that directory doesn't exist, examine `/etc/mysql/my.cnf` for a path to the data directory.

3.  Create a directory to store your backups. This guide will use `/opt/db-backups` but you can alter this to suit your needs:

        mkdir /opt/db-backups

4.  Copy MySQL's data directory to a storage location. The `cp` command, `rsync`, or other methods will work fine, but we'll use `tar` to recursively copy and gzip the backup at one time. Change the database directory, backup filename, and target directory as needed; the `-$(date +%F)` addition to the command will insert a timestamp into the filename.

        tar cfvz /opt/db-backups/db-$(date +%F).tar.gz /var/lib/mysql/*

5.  Restart the MySQL service:

        systemctl restart mysql

## Restore a Backup

1.  Change your working directory to a place where you can extract the tarball created above. The current user's home directory is used in this example:

        cd

2.  Stop the `mysql` service:

        systemctl stop mysql

3. Extract the tarball to the working directory. Change the tarball's filename in the command to the one with the date you want to restore to.

        tar zxvf /opt/db-backups/db-archive.tar.gz -C .

4.  Move the current contents of `/var/lib/mysql` to another location if you want to keep them for any reason, or delete them entirely. Create a new empty `mysql` folder to restore your backed up DMBS into.

        mv /var/lib/mysql /var/lib/mysql-old
        mkdir /var/lib/mysql

5.  Copy the backed up database system to the empty folder:

        mv ~/var/lib/mysql/* /var/lib/mysql

6.  Set the proper permissions for the files you just restored:

        chown -R mysql:mysql /var/lib/mysql

7.  Restart the MySQL service:

        systemctl restart mysql
