---
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

MySQL is an open source relational database management system (DBMS) which is frequently deployed in a wide assortment of contexts. Most frequently it is deployed as part of the [LAMP Stack](/docs/lamp-guides). The database system is also easy to use and highly portable and is, in the context of many applications, extremely efficient. As MySQL is often a centralized data store for large amounts of mission critical data, making regular backups of your MySQL database is one of the most important disaster recovery tasks a system administrator can perform. This guide addresses a number of distinct methods for creating back ups of your database as well as restoring databases from backups.

![Back Up Your MySQL Databases](/docs/assets/back_up_your_mysql-databases.png "Back Up Your MySQL Databases")

Before beginning the installation process, we assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). Additionally, you will need to install the [MySQL Database](/docs/databases/mysql/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. If you're new to Linux server administration you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/linux-users-and-groups/), [beginner's guide](/content/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

## Backup Methodology

Most backups of MySQL databases in this guide are performed using the `mysqldump` tool, which is distributed with the default MySQL server installation. We recommend that you use `mysqldump` whenever possible because it is often the easiest and most efficient way to take database backups. Other methods detailed in this guide are provided for situations when you do not have access to the `mysqldump` tool, as in a recovery environment like [Finnix](/docs/troubleshooting/finnix-rescue-mode) or in situations where the local instance of the MySQL server will not start.

Nevertheless, this guide provides a mere overview of the `mysqldump` tool, as there are many options for and uses of `mysqldump` that fall beyond the scope of this document. We encourage you to become familiar with all of the procedures covered in this document, and to continue your exploration of `mysqldump` beyond the cases described here. Be sure to note the following:

-   The `*.sql` files created with `mysqldump` can be restored at any time. You can even edit the database `.sql` files manually (with great care!) using your favorite text editor.
-   If your databases only make use of the MyISAM storage engine, you can substitute the `mysqldump` command with the faster `mysqlhotcopy`.

## Creating Backups of the Entire Database Management System (DBMS)

It is often necessary to take a back up (or "dump") of an entire database management system along with all databases and tables, including the system databases which hold the users, permissions and passwords.

### Option 1: Create Backups of an Entire Database Management System Using the mysqldump Utility

The most straight forward method for creating a single coherent backup of the entire MySQL database management system uses the `mysqldump` utility from the command line. The syntax for creating a database dump with a current timestamp is as follows:

    mysqldump --all-databases > dump-$( date '+%Y-%m-%d_%H-%M-%S' ).sql -u root -p

This command will prompt you for a password before beginning the database backup in the current directory. This process can take anywhere from a few seconds to a few hours depending on the size of your databases.

Automate this process by adding a line to `crontab`:

    0 1 * * * /usr/bin/mysqldump --all-databases > dump-$( date '+%Y-%m-%d_%H-%M-%S' ).sql -u root -pPASSWORD

For the example above, use `which mysqldump` to confirm the correct path to the command, and replace `root` with the mysql user you would like to run backups as, and `PASSWORD` with the correct password for that user.

{{< note >}}
In the crontab example, ensure that there is no space between the -P flag, and your password entry.
{{< /note >}}

### Option 2: Create Backups of an Entire DBMS Using Copies of the MySQL Data Directory

While the `mysqldump` tool is the preferred backup method, there are a couple of cases that require a different approach. `mysqldump` only works when the database server is accessible and running. If the database cannot be started or the host system is inaccessible, we can copy MySQL's database directly. This method is often necessary in situations where you only have access to a recovery environment like [Finnix](/docs/troubleshooting/finnix-rescue-mode) with your system's disks mounted in that file system. If you're attempting this method on your system itself, ensure that the database is **not** running. Issue a command that resembles the following:

    /etc/init.d/mysqld stop

On most distribution's version of MySQL, the data directory is located in the `/var/lib/mysql/` directory. If this directory doesn't exist examine the `/etc/mysql/my.cnf` file for a path to the data directory. Alternatively, you can search your file system for the data directory by issuing the following command:

    find / -name mysql

Once you have located your MySQL data directory you can copy it to a backup location. The following example assumes that the MySQL data directory is located at `/var/lib/mysql/`:

    cp -R /var/lib/mysql/* /opt/database/backup-1266871069/

In this case, we have recursively copied the contents of the data directory (e.g. `/var/lib/mysql/`) to a directory within the `/opt/` hierarchy (e.g. `/opt/database/backup-1266871069/`). This directory must exist before initiating the copy operation. Consider the following sequence of operations:

    /etc/init.d/mysql stop
    mkdir -p /opt/database/backup-1266872202/
    cp -R /var/lib/mysql/* /opt/database/backup-1266872202/

These commands begin by stopping the MySQL server daemon, then creating a directory named `/opt/database/backup-1266872202/`, and performing a recursive copy of the data directory. Note that we've chosen to use the `backup-[time_t]` naming convention for our examples. Substitute the paths' above for your preferred organization and naming scheme. The `cp` command does not produce output and can take some time to complete depending on the size of your database. Do not be alarmed if it takes a while to complete. When the copy operation is finished, you may want to archive the data directory into a "tar" archive to make it easier to manage and move between machines. Issue the following commands to create the archive:

    cd /opt/database/backup-1266872202
    tar -czfv * > /opt/mysqlBackup-1266872202.tar.gz

Once the tarball is created, you can easily [transfer the file](/docs/using-linux/administration-basics#upload-files-to-a-remote-server) in the manner that is most convenient for you. Don't forget to restart the MySQL server daemon again if needed:

    /etc/init.d/mysql start

## Creating Backups of a Single Database

In many cases, creating a back up of the entire database server isn't required. In some cases such as upgrading a web application, the installer may recommend making a backup of the database in case the upgrade adversely affects the database. Similarly, if you want to create a "dump" of a specific database to move that database to a different server, you might consider the following method.

When possible, use the `mysqldump` tool to export a "dump" of a single database. This command will resemble the following:

    mysqldump -u username -ps3cr1t -h localhost danceLeaders > 1266861650-danceLeaders.sql

The above example is like the example in the previous section, except rather than using the `--all-databases` option, this example specifies a particular database name. In this case we create a back up of the `danceLeaders` database. The form of this command, in a more plain notation is as follows:

    mysqldump -u [username] -p[password] -h [host] [databaseName] > [backup-name].sql

For an additional example, we will backup the database named `customer` using the root database account by issuing the following command:

    mysqldump -u root -p -h localhost customer > customerBackup.sql

You will be prompted for a password before `mysqldump` begins it's backup process. As always the backup file, in this case `customerBackup.sql`, is created in the directory where you issue this command. The `mysqldump` command can complete in a few seconds or a few hours depending on the size of the database and the load on the host when running the backup.

## Creating Backups of a Single Table

### Option 1: Create Backups of a Single Table Using the mysqldump Utility

This operation, like previous uses of the `mysqldump` utility in this document, allows you to create a backup of a single database table. Continuing our earlier examples the following example allows you to back up the table `usernameRecords` in the `danceLeaders` database.

     mysqldump -u username -ps3cr1t -h localhost danceLeaders usernameRecords \> 1266861650-danceLeaders-usernameRecords.sql

The above example is like the example in the previous section, except that we've added a table name specification to the command to specify the name of the table that we want to back up. The form of this command in a more plain notation is as follows:

    mysqldump -u [username] -p[password] -h [host] [databaseName] [tableName] > [backup-name].sql

For an additional example, we will backup the table named "order" from the database named `customer` using the root database account by issuing the following command:

    mysqldump -u root -p -h localhost customer order > customerBackup-order.sql

You will be prompted for a password before `mysqldump` begins its backup process. As always, the backup file (in this case `customerBackup.sql`) is created in the directory where you issue this command. The `mysqldump` command can complete in a few seconds or a few hours depending on the size of the database and the load on the host when running the backup.

### Option 2: Create Backups of a Single Table Using the MySQL Client and an OUTFILE Statement

The MySQL client itself has some backup capability. It is useful when you are already logged in and you do not want to exit the current session. If you are using a live system and cannot afford down time, you should consider temporarily locking the table you're backing up.

Do be aware that when backing up a single table using the MySQL client, that table's structure is not maintained in the backup. Only the data itself is saved when using this method.

1. Before we begin, we recommend performing a `LOCK TABLES` on the tables you intend to backup up, followed by `FLUSH TABLES` to ensure that the database is in a consistent space during the backup operation. You only need a read lock. This allows other clients to continue to query the tables while you are making a copy of the files in the MySQL data directory. For a "read" lock, the syntax of `LOCK TABLES` looks like the following:

       LOCK TABLES tableName READ;

   To perform a `LOCK TABLES` on the `order` table of the `customer` database, issue the following command:

       mysql -u root -p -h localhost

   You will then be prompted for the root password. Once you have entered the database credentials, you will arrive at the mysql client prompt. Issue the following command to lock the `order` table in the `customer` database (the trailing `;` is required for MySQL commands):

       USE customer;
       LOCK TABLES order READ;
       FLUSH TABLES;

2. We can now begin the backup operation. To create a backup of a single table using the MySQL client, you will need to be logged in to your MySQL DBMS. If you are not currently logged in you may log in with the following command:

        mysql -u root -p -h localhost

    You will be prompted for a password. Once you have entered the correct password and are at the MySQL client prompt, you can use a `SELECT * INTO OUTFILE` statement. The syntax of this statement looks like the following:

        SELECT * INTO OUTFILE 'file_name' FROM tbl_name;

    In this example, we will create a backup of the data from the `order` table of the `customer` database. Issue the following command to begin the backup procedure (the trailing `;` is required for MySQL commands):

        USE customer;
        LOCK TABLES order READ;
        FLUSH TABLES;
        SELECT * INTO OUTFILE 'customerOrderBackup.sql' FROM order;
        UNLOCK TABLES;

    The `customerOrderBackup.sql` file will be created in the appropriate data sub-directory within MySQLs data directory. The MySQL data directory is commonly `/var/lib/mysql/`. In this example, the `OUTFILE` will be `/var/lib/mysql/customer/customerOrderBackup.sql`. The location of this directory and file can, however, vary between Linux distributions. If you can not find your backup file, you can search for it with the following command:

       find / -name customerOrderBackup.sql

3. Once you have completed the backup operation, you will want to unlock the tables using the following command in the MySQL client. This will return your database to its normal operation. Log in to the MySQL client with the first command if you are not presently logged in and then issue the second command:

       mysql -uroot -p -h localhost

       UNLOCK TABLES;

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

1. If you have a complete backup of your MySQL data directory (commonly `/var/lib/mysql`), you can restore it from the command line. To ensure a successful restore, you must first stop the MySQL server daemon and delete the current data in the MySQL data directory.

    /etc/init.d/mysql stop
    rm -R /var/lib/mysql/*

2. In the following example, the MySQL data directory backup is located in the `/opt/database/backup-1266872202` directory. If you made a tarball of the data directory when you backed up your DBMS data directory, you will need to extract the files from the tarball before copying with the following commands:

    cp mysqlBackup-1266872202.tar.gz /var/lib/mysql/
    cd /var/lib/mysql
    tar xzvf mysqlBackup-1266872202.tar.gz

3. Before we can restart the MySQL database process, we must ensure that the permissions are set correctly on the `/var/lib/mysql/` directory. For this example, we assume the MySQL server daemon runs as the user `mysql` with the group `mysql`. To change the permissions on the data directory issue the following command:

    chown -R mysql:mysql /var/lib/mysql

4. Alter the `mysql:mysql` portion of this command if your MySQL instance runs with different user and group permissions. The form of this argument is `[user]:[group]`. Finally we can start the MySQL server daemon with the following command:

		/etc/init.d/mysql start

	If you receive an error similar to the following:

		/usr/bin/mysqladmin: connect to server at 'localhost' failed
			error: 'Access denied for user 'debian-sys-maint'@'localhost' (using password: YES)'

	You'll need to find the old `debian-sys-maint` user's password in the `/etc/mysql/debian.cnf` and then change the new `debian-sys-maint` user's password to it. You can view the old password using `cat`:

		cat /etc/mysql/debian.cnf | grep password

	Copy (or remember) the password. Then you'll need to change the new `debian-sys-maint` user's password. You can do this by logging in as the MySQL root user and issuing the following command (where \<password\> is the password of the old `debian-sys-maint` user):

		GRANT ALL PRIVILEGES ON *.* TO 'debian-sys-maint'@'localhost' IDENTIFIED BY '<password>' WITH GRANT OPTION;

5.  You'll then need to restart MySQL with the following command:

        /etc/init.d/mysql restart

After MySQL server has successfully started, you will want to test your MySQL DBMS and ensure that all databases and tables restored properly. We also recommend that you audit your logs for potential errors. In some cases MySQL can start successfully despite database errors.

## Restoring a Single Database from Backup

In cases where you have only created a backup for one database, or only need to restore a single database, the restoration process is somewhat different.

Before beginning the restoration process, this section assumes your system is running a newly installed version of MySQL without any existing databases or tables. If you already have databases and tables in your MySQL DBMS, please make a backup before proceeding as this process will **overwrite current MySQL data.**

1. To restore a single database using the `mysql` command, first prepare the destination database. Log in to your (new) MySQL database server using the MySQL client:

		mysql -u root -p -h localhost

2. You will be prompted for the root MySQL user's password. After you have provided the correct credentials, you must create the destination database. In this case, the `customer` database will be restored:

		CREATE DATABASE customer;

3. As with all MySQL statements, do not omit the final semi-colon (e.g. `;`) at the conclusion of each command. Depending on your deployment, you may need to create a new MySQL user or recreate a previous user with access to the newly created database. The command for creating a new MySQL user takes the following form:

		CREATE USER '[username]'@'[host]' IDENTIFIED BY '[password]';

4.  In the next example, we will create a user named `customeradmin`:

        CREATE USER 'customeradmin'@'localhost' IDENTIFIED BY 's3cr1t';

5. Now we will give `customeradmin` privileges to access the `customer` database. The command for granting privileges to a database for a specific user takes the following form:

		GRANT [privilegeType] ON [databaseName].[tableName] TO '[username]'@'[host]'

6. For the purposes of the following example, we will give `customeradmin` full access to the `customer` database. Issue the following command in the MySQL client:

		GRANT ALL ON customer.* TO 'customeradmin'@'localhost';

7. You may need to specify different access grants depending on the demands of your deployment. Consult the official documentation for [MySQL's GRANT statement](http://dev.mysql.com/doc/refman/5.1/en/grant.html). Once the destination database and MySQL user have been created, you can close the MySQL client with the following command:

		quit

8. You can now use the `mysql` command to restore your SQL file. The form of this command resembles the following:

		mysql -u [username] -p[password] -h [host] [databaseName] < [filename].sql

In the following example, we will restore the `customer` database from a SQL backup file named `customerBackup.sql` (pay special attention to the `<` symbol in this command):

    mysql -u root -p -h localhost customer < customerBackup.sql

You will be prompted for the root MySQL user's password. Once the correct credentials are supplied, the restoration process will begin. The duration of this operation depends on your system's load and the size of the database that you are restoring. It may complete in a few seconds, or it may take many hours.

## Restoring a Single Table from Backup

### Option 1: Restoring a Single Table Using the MySQL and Backups Created by mysqldump

Before beginning the restoration process, we assume that your MySQL instance already has an existing database that can receive the table you wish to restore. If your MySQL instance does not have the required database, we'll need to create it before proceeding. First, log into your MySQL instance with the following command:

    mysql -u root -p -h localhost

You will be prompted for the root MySQL user's password. After you have provided the correct credentials, you must create the destination database. For the purpose of this example we will create the `customer` database and exit the `mysql` prompt by issuing the following statements:

    CREATE DATABASE customer;
        quit

If you already have the required database, you can safely skip the above step. To continue with the table restoration, issue a command in the following form:

    mysql -u [username] -p[password] -h [host] [databaseName] < [filename].sql

For the following, example, we will restore the `order` table into the existing `customer` database from an SQL backup file named `customerOrderBackup.sql`. Be very careful to use the `<` operator in the following command:

    mysql -u root -p -h localhost customer < customerOrderBackup.sql

You will be prompted for the root MySQL user's password. Once the correct credentials are supplied, the restoration process will begin. The duration of this operation depends on your system's load and the size of the table that you are restoring. It may complete in a few seconds, or it may take many hours.

### Option 2: Restoring a Single Table Using the MySQL Client and an INFILE Statement for Backups Created with OUTFILE

Before beginning the restoration process, we assume that your MySQL instance already has an existing database that can receive the table you wish to restore. If your MySQL instance does not have the required database, we'll need to create it before proceeding. First, log into your MySQL instance with the following command:

    mysql -u root -p -h localhost

You will be prompted for the root MySQL user's password. After you have provided the correct credentials, you must create the destination database. For the purpose of this example we will create the `customer` database and exit the `mysql` prompt by issuing the following statements:

    CREATE DATABASE customer;
        quit

The data backup used in this case was created using the `SELECT * INTO OUTFILE 'backupFile.sql' FROM tableName` command. This type of backup only retains the data itself so the table structure must be recreated. To restore a single table from within the MySQL client, you must first prepare the destination database and table. Log in to your (new) MySQL instance using the MySQL client:

    mysql -u root -p -h localhost

You will be prompted for the root MySQL user's password. Once the correct credentials are supplied, you must create the destination database. In this case, we will create the `customer` database. Issue the following statement:

    CREATE DATABASE customer;

Remember that the semi-colons (e.g. `;`) following each statement are required. Now you must create the destination table with the correct structure. The data types of the fields of the table must mirror those of the table where the backup originated. In this example, we will restore the `order` table of the `customer` database. There are 2 fields in the `order` table, `custNum` with data type `INT` and `orderName` with data type `VARCHAR(20)`; your table structure will be different:

    USE customer;
    CREATE TABLE order (custNum INT, orderName VARCHAR(20));

Depending on your deployment, you may need to create a new MySQL user or recreate a previous user with access to the newly created database. The command for creating a new MySQL user takes the following form:

    CREATE USER '[username]'@'[host]' IDENTIFIED BY '[password]';

In the next example, we will create a user named `customeradmin`:

    CREATE USER 'customeradmin'@'localhost' IDENTIFIED BY 's3cr1t';

Now we will give `customeradmin` privileges to access the `customer` database. The command for granting privileges to a database for a specific user takes the following form:

    GRANT [privilegeType] ON [databaseName].[tableName] TO '[username]'@'[host]'

For the purposes of the following example, we will give `customeradmin` full access to the `customer` database. Issue the following command in the MySQL client:

    GRANT ALL ON customer.* TO 'customeradmin'@'localhost';

You may need to specify different access grants depending on the demands of your deployment. Consult the official documentation for [MySQL's GRANT statement](http://dev.mysql.com/doc/refman/5.1/en/grant.html). Once the table and user have been created, we can import the backup data from the backup file using the `LOAD DATA` command. The syntax resembles the following:

    LOAD DATA INFILE '[filename]' INTO TABLE [tableName];

In the following, example we will restore data from a table from a file named `customerOrderBackup.sql`. When MySQL client is given path and filename after `INFILE`, it looks in the MySQL data directory for that file. If the filename `customerOrderBackup.sql` was given, the path would be `/var/lib/mysql/customerOrderBackup.sql`. Ensure that the file you are trying to restore from exists, especially if MySQL generates `File not found` errors.

To import the data from the `customerOrderBackup.sql` file located in `/var/lib/mysql/`, issue the following command:

    LOAD DATA INFILE 'customerOrderBackup.sql' INTO TABLE order;

This process can take anywhere from a few seconds to many hours depending on the size of your table. The duration of this operation depends on your system's load and the size of the table that you are restoring. It may complete in a few seconds, or it may take many hours. After you have verified that your data was imported successfully, you can log out:

    quit
