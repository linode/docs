---
deprecated: true
author:
  name: Brett Kaplan
  email: docs@linode.com
description: 'Instructions for backing up MySQL databases using various methods.'
keywords: ["mysql", "backup", "mysqldump"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/backup-options/', 'security/backups/back-up-your-mysql-databases/']
modified: 2013-09-11
modified_by:
  name: Linode
published: 2010-04-19
title: Back Up Your MySQL Databases
external_resources:
 - '[The Official MySQL Web Site](http://www.mysql.com/)'
 - '[MySQL Database Backup Methods page](http://dev.mysql.com/doc/refman/5.1/en/backup-methods.html)'
 - '[mysqldump Manual Page](http://linuxcommand.org/man_pages/mysqldump1.html)'
 - '[Schedule Tasks With Cron](/docs/linux-tools/utilities/cron)'
 - '[MySQL''s Grant Statement, Official Documentation](http://dev.mysql.com/doc/refman/5.1/en/grant.html)'
---

MySQL is often a centralized data store for large amounts of mission critical data. This makes regular backups of your MySQL database one of the most important disaster recovery tasks a system administrator can perform. This guide addresses a number of methods for backing up and restoring your database.

## Before You Begin

This guide assumes:

1.  You already have a [MySQL Database](/docs/databases/mysql/) installed and populated with data.

2.  You are logged into your Linode as root via SSH. If you're new to Linux server administration you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/linux-users-and-groups/), [beginner's guide](/content/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

## Backup Methodology

Most backups in this guide are performed using the `mysqldump` tool, which is distributed with the default MySQL server installation. We recommend that you use `mysqldump` whenever possible because it is often the easiest and most efficient way to take database backups.

Be sure to note the following:

-   The `*.sql` files created with `mysqldump` can be restored at any time. You can even edit the database `.sql` files manually (with great care!) using your favorite text editor.
-   If your databases only make use of the MyISAM storage engine, you can substitute the `mysqldump` command with the faster `mysqlhotcopy`.

Other methods are provided in this guide for situations when you do not have access to the `mysqldump` tool, such as in a recovery environment like [Finnix](/docs/troubleshooting/finnix-rescue-mode) or in situations where the local instance of the MySQL server will not start.

## Back Up the Entire Database Management System (DBMS)

It is often necessary to take a back up (or "dump") of an entire database management system, along with all databases and tables, and including the system databases which hold the users, permissions, and passwords.

### Option 1: Using the mysqldump Utility

The most straightforward method for creating a coherent backup of an entire MySQL database management system is to use the `mysqldump` utility. The command below will will prompt you for a password before beginning, and add a timestamp to the filename of the database dump. Replace `root` with the mysql user you will run backups as.

    mysqldump --all-databases > dump-$( date '+%Y-%m-%d_%H-%M-%S' ).sql -u root -p

This can be automated by adding a line to `/etc/crontab`. Replace `root` and `PASSWORD` with the username and password you would like to run the backup as. Also ensure that there is no space between the `-p` flag and the password entry.

    0 1 * * * /usr/bin/mysqldump --all-databases > dump-$( date '+%Y-%m-%d_%H-%M-%S' ).sql -u root -pPASSWORD

### Option 2: Copying the MySQL Data Directory

`mysqldump` only works when the database server is accessible and running. If the database cannot be started or the host system is inaccessible, the database can be directly copied.

1.  If you're attempting this method on your running host system, stop the MySQL service before going further.

2.  Most distribution's version of MySQL create the data directory at `/var/lib/mysql/`. If that doesn't exist, examine the `/etc/mysql/my.cnf` file for a path to the data directory.

3.  Create a location to store the backup if you don't already have one. A backup directory located in `/opt` is used as an example.

    sudo mkdir -p /opt/db-backups/DB-system

4.  Create a tarball of the `/var/lib/mysql` directory in the storage area from the previous step:

        sudo tar czvf /opt/db-backups/DB-system/DB-system-$(date +%F).tar.gz /var/lib/mysql/*

5.  Restart the MySQL service if you stopped it in step 1.

## Back Up a Single Database

When backing up the entire database system isn't necessary, you can dump a specific database using the `mysqldump` tool. The command will resemble the following, and back up database `DB1` to the directory the command is run from.

    mysqldump -u username -p -h localhost DB1 > DB1-backup.sql

You will be prompted for a password before `mysqldump` begins it's backup process. Depending on the size of the database, it could take a while to complete.

## Backing Up a Single Table

### Option 1: Use mysqldump

This operation allows you to create a backup of a single database table. The following example will back up the table `Table1` from the `DB1` database.

     mysqldump -u username -ppassword -h localhost DB1 Table1 \> DB1-Table1.sql

The above example is like the example in the previous section, except that we've added a table name specification to the command to specify the name of the table that we want to back up. The form of this command in a more plain notation is as follows:

    mysqldump -u [username] -p[password] -h [host] [databaseName] [tableName] > [backup-name].sql

For an additional example, we will backup the table named "order" from the database named `customer` using the root database account by issuing the following command:

    mysqldump -u root -p -h localhost customer order > customerBackup-order.sql

You will be prompted for a password before `mysqldump` begins its backup process. As always, the backup file (in this case `DB2-backup.sql`) is created in the directory where you issue this command. The `mysqldump` command can complete in a few seconds or a few hours depending on the size of the database and the load on the host when running the backup.

### Option 2: Create Backups of a Single Table Using the MySQL Client and an OUTFILE Statement

The MySQL client itself has some backup capability. It is useful when you are already logged in and you do not want to exit the current session. If you are using a live system and cannot afford down time, you should consider temporarily locking the table you're backing up.

Do be aware that when backing up a single table using the MySQL client, that table's structure is not maintained in the backup. Only the data itself is saved when using this method.

1.  Before we begin, we recommend performing a `LOCK TABLES` on the tables you intend to backup up, followed by `FLUSH TABLES` to ensure that the database is in a consistent space during the backup operation. You only need a read lock. This allows other clients to continue to query the tables while you are making a copy of the files in the MySQL data directory. For a "read" lock, the syntax of `LOCK TABLES` looks like the following:

    {{< highlight sql >}}
LOCK TABLES tableName READ;
{{< /highlight >}}

    To perform a `LOCK TABLES` on the `order` table of the `customer` database, issue the following command:

        mysql -u root -p -h localhost

    You will then be prompted for the root password. Once you have entered the database credentials, you will arrive at the mysql client prompt. Issue the following command to lock the `order` table in the `customer` database (the trailing `;` is required for MySQL commands):

    {{< highlight sql >}}
USE customer;
LOCK TABLES order READ;
FLUSH TABLES;
{{< /highlight >}}

2.  We can now begin the backup operation. To create a backup of a single table using the MySQL client, you will need to be logged in to your MySQL DBMS. If you are not currently logged in you may log in with the following command:

        mysql -u root -p -h localhost

    You will be prompted for a password. Once you have entered the correct password and are at the MySQL client prompt, you can use a `SELECT * INTO OUTFILE` statement. The syntax of this statement looks like the following:

    {{< highlight sql >}}
SELECT * INTO OUTFILE 'file_name' FROM tbl_name;
{{< /highlight >}}

    In this example, we will create a backup of the data from the `order` table of the `customer` database. Issue the following command to begin the backup procedure (the trailing `;` is required for MySQL commands):

    {{< highlight sql >}}
USE customer;
LOCK TABLES order READ;
FLUSH TABLES;
SELECT * INTO OUTFILE 'customerOrderBackup.sql' FROM order;
UNLOCK TABLES;
{{< /highlight >}}

    The `customerOrderBackup.sql` file will be created in the appropriate data sub-directory within MySQLs data directory. The MySQL data directory is commonly `/var/lib/mysql/`. In this example, the `OUTFILE` will be `/var/lib/mysql/customer/customerOrderBackup.sql`. The location of this directory and file can, however, vary between Linux distributions. If you can not find your backup file, you can search for it with the following command:

        find / -name customerOrderBackup.sql

3.  Once you have completed the backup operation, you will want to unlock the tables using the following command in the MySQL client. This will return your database to its normal operation. Log in to the MySQL client with the first command if you are not presently logged in and then issue the second command:

        mysql -uroot -p -h localhost

    {{< highlight sql >}}
UNLOCK TABLES;
{{< /highlight >}}

You can continue using your database as normal from this point.

## Considerations for an Effective Backup Strategy

Creating backups of your MySQL database should be a regular and scheduled task. You might like to consider scheduling periodic backups using `cron`, `mysqldump` and/or `mail`. Consider our documentation for more information regarding [cron](/docs/linux-tools/utilities/cron). Implementing an automated backup solution may help minimize down time in a disaster recovery situation.

You do not need to log in as root when backing up databases. A MySQL user with read (e.g. `SELECT`) permission is able to use both the `mysqldump` and `mysql` (e.g. the MySQL client) tools to take backups, as described below. As a matter of common practice, we recommend that you not use the MySQL `root` user whenever possible to minimize security risks.

You may want to consider incremental backups as part of a long-term database backup plan. While this process is not covered here, we recommend that you consider the [MySQL Database Backup Methods](http://dev.mysql.com/doc/refman/5.1/en/backup-methods.html) resource for more information.

## Restoring an Entire DBMS From Backup

A backup that cannot be restored is of minimal value. We recommend testing your backups regularly to ensure that they can be restored in the event that you may need to restore from backups. When using restoring backups of your MySQL database, the method you use depends on the method you used to create the backup in question.

### Option 1: Restoring an Entire DBMS Using the MySQL Client and Backups Created by mysqldump

Before beginning the restoration process, this section assumes your system is running a newly installed version of MySQL without any existing databases or tables. If you already have databases and tables in your MySQL DBMS, please make a backup before proceeding as this process will **overwrite current MySQL data.**

You can easily restore your entire DBMS using the `mysql` command. The syntax for this will resemble the following:

    mysql -u [username] -p [password] < backupFile.sql

In this case we're simply restoring the entire DBMS. The command will look like the following:

    mysql -u root -p < 1266861650-backup-all.sql

You will be prompted for the root MySQL user's password. Once the correct credentials are supplied, the restoration process will begin. Since this process restores an entire DBMS, it can take anywhere from a few seconds to many hours.

### Option 2: Restoring an Entire DBMS Using MySQL Data Files Copied Directly from MySQL's Data Directory

Before beginning the restoration process, this section assumes your system is running a newly installed version of MySQL without any existing databases or tables. If you already have databases and tables in your MySQL DBMS, please make a backup before proceeding as this process will **overwrite current MySQL data.**

1.  If you have a complete backup of your MySQL data directory (commonly `/var/lib/mysql`), you can restore it from the command line. To ensure a successful restore, you must first stop the MySQL server daemon and delete the current data in the MySQL data directory.

        /etc/init.d/mysql stop
        rm -R /var/lib/mysql/*

2.  In the following example, the MySQL data directory backup is located in the `/opt/database/backup-1266872202` directory. If you made a tarball of the data directory when you backed up your DBMS data directory, you will need to extract the files from the tarball before copying with the following commands:

         cp mysqlBackup-1266872202.tar.gz /var/lib/mysql/
         cd /var/lib/mysql
         tar xzvf mysqlBackup-1266872202.tar.gz

3.  Before we can restart the MySQL database process, we must ensure that the permissions are set correctly on the `/var/lib/mysql/` directory. For this example, we assume the MySQL server daemon runs as the user `mysql` with the group `mysql`. To change the permissions on the data directory issue the following command:

        chown -R mysql:mysql /var/lib/mysql

4.  Alter the `mysql:mysql` portion of this command if your MySQL instance runs with different user and group permissions. The form of this argument is `[user]:[group]`. Finally we can start the MySQL server daemon with the following command:

        /etc/init.d/mysql start

    If you receive an error similar to the following:

        /usr/bin/mysqladmin: connect to server at 'localhost' failed
            error: 'Access denied for user 'debian-sys-maint'@'localhost' (using password: YES)'

    You'll need to find the old `debian-sys-maint` user's password in the `/etc/mysql/debian.cnf` and then change the new `debian-sys-maint` user's password to it. You can view the old password using `cat`:

        cat /etc/mysql/debian.cnf | grep password

    Copy (or remember) the password. Then you'll need to change the new `debian-sys-maint` user's password. You can do this by logging in as the MySQL root user and issuing the following command (where \<password\> is the password of the old `debian-sys-maint` user):

    {{< highlight sql >}}
GRANT ALL PRIVILEGES ON *.* TO 'debian-sys-maint'@'localhost' IDENTIFIED BY '<password>' WITH GRANT OPTION;
{{< /highlight >}}

5.  You'll then need to restart MySQL with the following command:

        /etc/init.d/mysql restart

After MySQL server has successfully started, you will want to test your MySQL DBMS and ensure that all databases and tables restored properly. We also recommend that you audit your logs for potential errors. In some cases MySQL can start successfully despite database errors.

## Restoring a Single Database from Backup

In cases where you have only created a backup for one database, or only need to restore a single database, the restoration process is somewhat different.

Before beginning the restoration process, this section assumes your system is running a newly installed version of MySQL without any existing databases or tables. If you already have databases and tables in your MySQL DBMS, please make a backup before proceeding as this process will **overwrite current MySQL data.**

1.  To restore a single database using the `mysql` command, first prepare the destination database. Log in to your (new) MySQL database server using the MySQL client:

        mysql -u root -p -h localhost

2.  You will be prompted for the root MySQL user's password. After you have provided the correct credentials, you must create the destination database. In this case, the `customer` database will be restored:

    {{< highlight sql >}}
CREATE DATABASE customer;
{{< /highlight >}}

3.  As with all MySQL statements, do not omit the final semi-colon (e.g. `;`) at the conclusion of each command. Depending on your deployment, you may need to create a new MySQL user or recreate a previous user with access to the newly created database. The command for creating a new MySQL user takes the following form:

    {{< highlight sql >}}
CREATE USER '[username]'@'[host]' IDENTIFIED BY '[password]';
{{< /highlight >}}

4.  In the next example, we will create a user named `customeradmin`:

    {{< highlight sql >}}
CREATE USER 'customeradmin'@'localhost' IDENTIFIED BY 's3cr1t';
{{< /highlight >}}

5.  Now we will give `customeradmin` privileges to access the `customer` database. The command for granting privileges to a database for a specific user takes the following form:

    {{< highlight sql >}}
GRANT [privilegeType] ON [databaseName].[tableName] TO '[username]'@'[host]'
{{< /highlight >}}

6. For the purposes of the following example, we will give `customeradmin` full access to the `customer` database. Issue the following command in the MySQL client:

    {{< highlight sql >}}
GRANT ALL ON customer.* TO 'customeradmin'@'localhost';
{{< /highlight >}}

7. You may need to specify different access grants depending on the demands of your deployment. Consult the official documentation for [MySQL's GRANT statement](http://dev.mysql.com/doc/refman/5.1/en/grant.html). Once the destination database and MySQL user have been created, you can close the MySQL client with the following command:

        quit

8. You can now use the `mysql` command to restore your SQL file. The form of this command resembles the following:

        mysql -u [username] -p[password] -h [host] [databaseName] < [filename].sql

In the following example, we will restore the `customer` database from a SQL backup file named `customerBackup.sql` (pay special attention to the `<` symbol in this command):

    mysql -u root -p -h localhost customer < customerBackup.sql

You will be prompted for the root MySQL user's password. Once the correct credentials are supplied, the restoration process will begin. The duration of this operation depends on your system's load and the size of the database that you are restoring. It may complete in a few seconds, or it may take many hours.

## Restoring a Single Table from Backup

### Option 1: Restoring a Single Table Using the MySQL and Backups Created by mysqldump

1.  Before beginning the restoration process, we assume that your MySQL instance already has an existing database that can receive the table you wish to restore. If your MySQL instance does not have the required database, we'll need to create it before proceeding. First, log into your MySQL instance with the following command:

        mysql -u root -p -h localhost

2.  You will be prompted for the root MySQL user's password. After you have provided the correct credentials, you must create the destination database. For the purpose of this example we will create the `customer` database.

    {{< highlight sql >}}
CREATE DATABASE customer;
{{< /highlight >}}

    Then exit the `mysql` prompt:

        quit

    If you already have the required database, you can safely skip the above step. To continue with the table restoration, issue a command in the following form:

        mysql -u [username] -p[password] -h [host] [databaseName] < [filename].sql

3.  For the following example, we will restore the `order` table into the existing `customer` database from an SQL backup file named `customerOrderBackup.sql`. Be very careful to use the `<` operator in the following command:

        mysql -u root -p -h localhost customer < customerOrderBackup.sql

You will be prompted for the root MySQL user's password. Once the correct credentials are supplied, the restoration process will begin. The duration of this operation depends on your system's load and the size of the table that you are restoring. It may complete in a few seconds, or it may take many hours.

### Option 2: Restoring a Single Table Using the MySQL Client and an INFILE Statement for Backups Created with OUTFILE

1.  Before beginning the restoration process, we assume that your MySQL instance already has an existing database that can receive the table you wish to restore. If your MySQL instance does not have the required database, we'll need to create it before proceeding. First, log into your MySQL instance with the following command:

        mysql -u root -p -h localhost

2.  You will be prompted for the root MySQL user's password. After you have provided the correct credentials, you must create the destination database. For the purpose of this example we will create the `customer` database.

    {{< highlight sql >}}
CREATE DATABASE customer;
{{< /highlight >}}

    Then exit the `mysql` prompt:

        quit

3.  The data backup used in this case was created using the `SELECT * INTO OUTFILE 'backupFile.sql' FROM tableName` command. This type of backup only retains the data itself so the table structure must be recreated. To restore a single table from within the MySQL client, you must first prepare the destination database and table. Log in to your (new) MySQL instance using the MySQL client:

        mysql -u root -p -h localhost

4.  You will be prompted for the root MySQL user's password. Once the correct credentials are supplied, you must create the destination database. In this case, we will create the `customer` database. Issue the following statement:

    {{< highlight sql >}}
CREATE DATABASE customer;
{{< /highlight >}}

5.  Remember that the semi-colons (e.g. `;`) following each statement are required. Now you must create the destination table with the correct structure. The data types of the fields of the table must mirror those of the table where the backup originated. In this example, we will restore the `order` table of the `customer` database. There are 2 fields in the `order` table, `custNum` with data type `INT` and `orderName` with data type `VARCHAR(20)`; your table structure will be different:

    {{< highlight sql >}}
USE customer;
CREATE TABLE order (custNum INT, orderName VARCHAR(20));
{{< /highlight >}}

6.  Depending on your deployment, you may need to create a new MySQL user or recreate a previous user with access to the newly created database. The command for creating a new MySQL user takes the following form:

    {{< highlight sql >}}
CREATE USER '[username]'@'[host]' IDENTIFIED BY '[password]';
{{< /highlight >}}

7.  In the next example, we will create a user named `customeradmin`:

    {{< highlight sql >}}
CREATE USER 'customeradmin'@'localhost' IDENTIFIED BY 's3cr1t';
{{< /highlight >}}

8.  Now we will give `customeradmin` privileges to access the `customer` database. The command for granting privileges to a database for a specific user takes the following form:

    {{< highlight sql >}}
GRANT [privilegeType] ON [databaseName].[tableName] TO '[username]'@'[host]'
{{< /highlight >}}

    For the purposes of the following example, we will give `customeradmin` full access to the `customer` database. Issue the following command in the MySQL client:

    {{< highlight SQL >}}
GRANT ALL ON customer.* TO 'customeradmin'@'localhost';
{{< /highlight >}}

9.  You may need to specify different access grants depending on the demands of your deployment. Consult the official documentation for [MySQL's GRANT statement](http://dev.mysql.com/doc/refman/5.1/en/grant.html). Once the table and user have been created, we can import the backup data from the backup file using the `LOAD DATA` command. The syntax resembles the following:

    {{< highlight sql >}}
LOAD DATA INFILE '[filename]' INTO TABLE [tableName];
{{< /highlight >}}

    In the following example, we will restore data from a table from a file named `customerOrderBackup.sql`. When MySQL client is given path and filename after `INFILE`, it looks in the MySQL data directory for that file. If the filename `customerOrderBackup.sql` was given, the path would be `/var/lib/mysql/customerOrderBackup.sql`. Ensure that the file you are trying to restore from exists, especially if MySQL generates `File not found` errors.

10. To import the data from the `customerOrderBackup.sql` file located in `/var/lib/mysql/`, issue the following command:

    {{< highlight sql >}}
LOAD DATA INFILE 'customerOrderBackup.sql' INTO TABLE order;
{{< /highlight >}}

    This process can take anywhere from a few seconds to many hours depending on the size of your table. The duration of this operation depends on your system's load and the size of the table that you are restoring. It may complete in a few seconds, or it may take many hours. After you have verified that your data was imported successfully, you can log out:

        quit