---
author:
  name: Linode
  email: docs@linode.com
title: "Migrate a MySQL or MariaDB Database to a Managed Database"
description: "Learn how to migrate an existing MySQL database to Linode's Managed Database service."
published: 2022-02-23
modified: 2022-06-30
---

This guide covers how to migrate an existing MySQL or MariaDB database to a Managed Database. When migrating a database, there are two important terms to keep in mind: the *source* database and the *target* database.

- **Source database:** The original database running on a software, system, or machine that you wish to decommission. This could be MySQL running within your own Linux server, a development database on your local machine, or even a cloud database.
- **Target database:** The new replacement database that you wish to use. For this guide, the target database will be a Managed Database running on Linode's platform.

Your individual migration workflow could deviate from the instructions provided here. You may need to consult your own developers or application's documentation to learn how to perform some of these steps and to gather any best practices. You should also perform the migration on a staging server first or during a time when downtime least affects your users and/or business.

## Before You Begin

- **Create a Managed Database:** To minimize downtime, make sure to create your Managed Database database cluster *before* continuing. This ensures that your database has been fully provisioned (which can take up to 30 minutes) and that you have the new database credentials available. See [Create a Managed Database](/docs/products/databases/managed-databases/guides/create-database/).

- **Ensure proper MySQL user grants:** The MySQL user you intend to use to export your existing database must have SELECT, LOCK TABLES, SHOW VIEW and TRIGGER grants.

## Export the Source Database

Export the data from the source database into a `.sql` file. While this file is eventually used to import your data to a different machine, it can also be stored as backup. The best method for generating a backup of your data highly depends on the applications you are using and what other databases are also stored on that same system.

-   **mysqldump:** In most cases, you can export the data using the mysqldump command-line tool. The following command exports the specified databases within the local mysql instance into a file called `db-backup.sql`. Replace *[username]* with the username you use to access the database and *[database-name]* with the name of your database.

        sudo mysqldump -u [user] -p --single-transaction [database-name] > db-backup.sql

    **Notes on additional command options:**

    - `-h`: If you prefer to run this command remotely and have access to MySQL from a remote system, add `-h [hostname]`, where *[hostname]* is the IP address or hostname of the remote database server.

    - `--ssl-mode=REQUIRED`: Force SSL when your existing database has SSL enabled.

    - `--set-gtid-purged=OFF`: Use this option if you have [GTID-based replication](https://dev.mysql.com/doc/refman/8.0/en/replication-gtids-howto.html) enabled.

    - `--all-databases`: **Do not use this option**. When importing this backup into your Managed Database, it may delete all existing users from the cluster.

    See [Backing Up MySQL Databases Using mysqldump](/docs/guides/mysqldump-backups/) for more details on running the mysqldump command.

- **cPanel:** See [Backup Wizard > Create a partial backup](https://docs.cpanel.net/cpanel/files/backup-wizard/#create-a-partial-backup) and [How to Back Up and Restore MySQL® Databases in cPanel](https://blog.cpanel.com/how-to-back-up-and-restore-mysql-databases-in-cpanel/).

- **Plesk:** See [Exporting and Importing Database Dumps](https://docs.plesk.com/en-US/obsidian/reseller-guide/website-management/website-databases/exporting-and-importing-database-dumps.69538/#).

### Preventing Corruption

If data is modified during the export, your dataset may become inconsistent or corrupted. Because of this, you may want to prevent new data from being written during the time. This can be accomplished by stopping any services or applications that are currently using your database. In many cases, stopping the web server software is one of the quickest ways to do this, though its not recommended if that web server is also running other websites that need to maintain access. The following instructions cover stopping the two most popular web services, NGINX and Apache.

-   **Stop NGINX:**

        sudo systemctl stop nginx

-   **Stop Apache on Ubuntu/Debian:**

        sudo systemctl stop apache2

-   **Stop Apache on RHEL/CentOS:**

        sudo systemctl stop httpd

Alternatively, you can activate a _maintenance mode_ (or whatever it may be called for your application) on any applications or services using your database. This typically disables some of your site's functionality and may present a web page to visitors to notify them of the downtime. The process for this varies greatly depending on the application you may be using.

## Import the Database

Next, you'll need to import the `.sql` file to your Managed Database (the target database). This process can be accomplished through the mysql command-line tool. Run the following command on a system that has the MySQL client or server software installed. Replace *[host]* and *[username]* with the appropriate values for your database cluster. See the [Connect to a MySQL Database](/docs/products/databases/managed-databases/guides/mysql-connect/) guide for additional information and to learn how to view your Managed Database's connection details.

    mysql -h [host] -u [username] -p < db-backup.sql

## Update the Database Connection Details within Your Application

After the data has been imported into the Managed Database, you should update any applications that were using the original source database so that they use the new Managed Database instead. This typically involves editing the database connection details (such as the host, username, password, and port) within the code or within your application's GUI. Please consult the documentation for your application to learn how to adjust the database settings. In WordPress, for instance, the database connection details are stored within the `wp-config.php` file on your web server (see [Editing wp-config.php > Configure Database Settings](https://wordpress.org/support/article/editing-wp-config-php/)).

## Enable Your Application

If you turned off your web server or placed your application in a *maintenance mode*, you can now enable your application again. While the instructions for turning off *maintenance mode* vary depending on your application, here are the commands for starting the two most common web servers:

-   **Start NGINX:**

        sudo systemctl start nginx

-   **Start Apache on Ubuntu/Debian:**

        sudo systemctl start apache2

-   **Start Apache on RHEL/CentOS:**

        sudo systemctl start httpd