---
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for backing up MySQL databases by copying the relevant filesystem parts.'
keywords: ["mysql", "mariadb", backup", "mysqldump"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-12-06
modified_by:
  name: Linode
published: 2017-12-06
title: Create Physical Backups of your MariaDB or MySQL Databases
external_resources:
 - '[Backup and Restore Overview; MariaDB Library](https://mariadb.com/kb/en/library/backup-and-restore-overview/)'
 - '[Database Backup Methods; MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.7/en/backup-methods.html)'
---

While the `mysqldump` tool is the preferred backup method for a MariaDB or MySQL database or database system, there are cases which require a different approach. `mysqldump` only works when the database server is accessible and running. If the database cannot be started or the host system is inaccessible, the database can still be copied directly.

This method is known as making a *physical backup*, and is often necessary in situations when you only have access to a recovery environment (such as [Finnix](/docs/troubleshooting/finnix-rescue-mode)) where you mount your system's disks as external storage devices. If you want to read about *logical backups* using `mysqldump`, [see our guide](/docs/databases/mysql/use-mysqldump-to-back-up-your-mysql-databases) on the topic.

For simplification, the name MySQL will be used throughout this guide but the instructions will work for both MySQL and MariaDB.

{{< caution >}}
If you're attempting this method directly on your running system (in other words, if you are not mounting the disks through a recovery method), ensure that the MySQL service is stopped during both backup and restore!
{{< /caution >}}

## Create a Backup

1.  Locate your database directory. It should be `/var/lib/mysql/` on most systems but if that directory doesn't exist, examine `/etc/mysql/my.cnf` for a path to the data directory.

2.  Copy MySQL's data directory to a storage location. The `cp` command, `rsync`, or other methods will work fine, but we'll use `tar` to recursively copy and gzip the backup at one time. The following example assumes that the MySQL data directory is located at `/var/lib/mysql/`, and `/opt/db-backups/` is the target directory. Change the backup's name and target directory as needed; the `-$(date +%F)` addition to the command will insert a timestamp into the filename.

        tar cfvz /opt/db-backups/db-$(date +%F).tar.gz /var/lib/mysql/*

3.  Restart the MySQL service:

        systemctl restart mysql

## Restore a Backup

1.  Change your working directory to a place where you can extract the tarball created above. The home directory of your current user is used in this example:

        cd

2.  Extract the tarball to the working directory. Change the tarball's filename in the command to the one with the date you want to restore to.

        tar zxvf /opt/db-backups/db-archive.tar.gz -C .

3.  Move the current contents of `/var/lib/mysql` to another location if you want to keep them for any reason. Or you could delete the contents entirely. Then create a new empty `mysql` folder to restore your backed up DMBS into.

        mv /var/lib/mysql /var/lib/mysql-bad
        mkdir /var/lib/mysql

4.  Copy the backed up database system to the empty folder. Remember, you extracted it to your current user's home directory.

        mv ~/var/lib/mysql/* /var/lib/mysql

5.  Set the proper permissions for the files you just restored:

        chown -R mysql:mysql /var/lib/mysql

6.  Restart the MySQL service:

        systemctl restart mysql