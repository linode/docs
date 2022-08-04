---
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how to install and configure MySQL/MariaDB so you can run databases for anything from a CRM to WordPress by using the Linode One-Click Marketplace."
keywords: ['database','mysql','rdbms','relational database','mariadb']
tags: ["database","cloud-manager","linode platform","mysql","marketplace","mariadb"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-13
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying MySQL/MariaDB through the Linode Marketplace"
external_resources:
- '[MySQL 5.6 Reference Manual](https://dev.mysql.com/doc/refman/5.6/en/index.html)'
- '[PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)'
- '[MySQLdb User''s Guide](http://mysql-python.sourceforge.net/MySQLdb.html)'
aliases: ['/platform/marketplace/deploy-mysql-with-marketplace-apps/', '/platform/one-click/deploy-mysql-with-one-click-apps/', '/guides/deploy-mysql-with-one-click-apps/', '/guides/deploy-mysql-with-marketplace-apps/','/guides/mysql-marketplace-app/']
---

MySQL is an open-source database management system that uses a relational database and SQL (Structured Query Language) to manage its data. In Debian 9, MySQL is replaced with MariaDB as the default database system. MariaDB is an open-source, multi-threaded relational database management system, backward compatible replacement for MySQL. It is maintained and developed by the MariaDB Foundation.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** MySQL should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** Depends on the size of your MySQL database and the amount of traffic you expect.

### MySQL/MariaDB Options

- **MySQL or MariaDB** *(required)*: Select which database service you'd like to use.
- **MySQL Root Password** *(required)*: The root password for your MySQL database.
- **MySQL User** *(required)*: The user for your MySQLDB database.
- **MySQL User Password** *(required)*: The user password for your MySQL database.
- **Create Database** *(required)*: The database on your MySQL.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

### Access MySQL/MariaDB

After MySQL has finished installing, you will be able to access MySQL from the console via ssh with your Linode's IPv4 address:

1.  [SSH into your Linode](/docs/guides/set-up-and-secure/#connect-to-the-instance) and [create a limited user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account).

1.  Log out and log back in as your limited user account.

1.  Update your server:

        sudo apt-get update && apt-get upgrade

## Using MySQL/MariaDB

The standard tool for interacting with MySQL is the `mysql` client which installs with the `mysql-server` package. The MySQL client is used through a terminal.

### Root Login

1.  To log in to MySQL as the root user:

        sudo mysql -u root -p

1.  When prompted, enter the MySQL root password that you set when launching the Marketplace App. You'll then be presented with a welcome header and the MySQL prompt as shown below:

        MariaDB [(none)]>

1.  To generate a list of commands for the MySQL prompt, enter `\h`. You'll then see:

        List of all MySQL commands:
        Note that all text commands must be first on line and end with ';'
        ?         (\?) Synonym for `help'.
        clear     (\c) Clear command.
        connect   (\r) Reconnect to the server. Optional arguments are db and host.
        delimiter (\d) Set statement delimiter. NOTE: Takes the rest of the line as new delimiter.
        edit      (\e) Edit command with $EDITOR.
        ego       (\G) Send command to mysql server, display result vertically.
        exit      (\q) Exit mysql. Same as quit.
        go        (\g) Send command to mysql server.
        help      (\h) Display this help.
        nopager   (\n) Disable pager, print to stdout.
        notee     (\t) Don't write into outfile.
        pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
        print     (\p) Print current command.
        prompt    (\R) Change your mysql prompt.
        quit      (\q) Quit mysql.
        rehash    (\#) Rebuild completion hash.
        source    (\.) Execute an SQL script file. Takes a file name as an argument.
        status    (\s) Get status information from the server.
        system    (\!) Execute a system shell command.
        tee       (\T) Set outfile [to_outfile]. Append everything into given outfile.
        use       (\u) Use another database. Takes database name as argument.
        charset   (\C) Switch to another charset. Might be needed for processing binlog with multi-byte charsets.
        warnings  (\W) Show warnings after every statement.
        nowarning (\w) Don't show warnings after every statement.

        For server side help, type 'help contents'

        MariaDB [(none)]>

1.  Grant access to the database that you created when launching the Marketplace App for **MySQL User**. In this example, the database is called `webdata`, the user `webuser`, and password of the user is `password`. Be sure to enter your own password. This should be different from the root password for MySQL:

        GRANT ALL ON webdata.* TO 'webuser' IDENTIFIED BY 'password';

1.  To Exit MySQL/MariaDB type:

        exit

### Create a Sample Table

1.  Log back in as **MySQL User** that you set when launching the Marketplace App. In the following example the **MySQL User** is `webuser`.

        sudo mysql -u webuser -p

2.  Create a sample table called `customers`. This creates a table with a customer ID field of the type `INT` for integer (auto-incremented for new records, used as the primary key), as well as two fields for storing the customer's name. In the following example `webdata` is the database that you created when launching the Marketplace App.

        use webdata;
        create table customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);

3.  To view the contents of the table that you created:

        describe customers;

       The output would be:

        +-------------+---------+------+-----+---------+----------------+
        | Field       | Type    | Null | Key | Default | Extra          |
        +-------------+---------+------+-----+---------+----------------+
        | customer_id | int(11) | NO   | PRI | NULL    | auto_increment |
        | first_name  | text    | YES  |     | NULL    |                |
        | last_name   | text    | YES  |     | NULL    |                |
        +-------------+---------+------+-----+---------+----------------+


4. Then exit MySQL/MariaDB.

        exit

## Next Steps

{{< content "marketplace-update-note-shortguide">}}

For more on MySQL/MariaDB, checkout the following guides:

- [MariaDB Clusters with Galera](/docs/guides/set-up-mariadb-clusters-with-galera-debian-and-ubuntu/)
