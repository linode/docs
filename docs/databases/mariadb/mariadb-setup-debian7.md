---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install and configure the MariaDB database server on Debian 7.'
keywords: ["mariadb", " debian 7", " reset", " root", " password", " install", " configure"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-06-12
contributor:
    name: Nashruddin Amin
    link: https://twitter.com/bsd_noobz
modified_by:
  name: Linode
published: 2014-06-12
title: MariaDB Setup on Debian 7
external_resources:
 - '[MariaDB Knowledge Base](https://mariadb.com/kb/en)'
 - '[MariaDB FAQ](https://mariadb.com/kb/en/mariadb-mariadb-faq/)'
 - '[MariaDB SQL commands](https://mariadb.com/kb/en/sql-commands/)'
 - '[MySQL 5.5 Reference Manual](http://dev.mysql.com/doc/refman/5.5/en/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

MariaDB is a drop-in replacement for MySQL and it strives to be the logical choice for database professionals looking for a robust, scalable, and reliable SQL Server. This guide will help beginners get started with MariaDB on a Debian 7 (Wheezy) Linode.

 {{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites

Execute the following commands to ensure that your system's package database is up to date and that all installed software is running at the latest version:

    apt-get update
    apt-get upgrade

## Installing MariaDB

In this section, you will install MariaDB and set the password for the MariaDB root user.

1.  First, import the GPG key so that APT can verify the integrity of the packages it downloads:

        apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db

    Sample output:

        Executing: gpg --ignore-time-conflict --no-options --no-default-keyring --secret-keyring /tmp/tmp.THMA4yorjI --trustdb-name /etc/apt//trustdb.gpg --keyring /etc/apt/trusted.gpg --primary-keyring /etc/apt/trusted.gpg --keyring /etc/apt/trusted.gpg.d//debian-archive-squeeze-automatic.gpg --keyring /etc/apt/trusted.gpg.d//debian-archive-squeeze-stable.gpg --keyring /etc/apt/trusted.gpg.d//debian-archive-wheezy-automatic.gpg --keyring /etc/apt/trusted.gpg.d//debian-archive-wheezy-stable.gpg --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db
        gpg: requesting key 1BB943DB from hkp server keyserver.ubuntu.com
        gpg: key 1BB943DB: public key "MariaDB Package Signing Key <package-signing-key@mariadb.org>" imported
        gpg: no ultimately trusted keys found
        gpg: Total number processed: 1
        gpg:               imported: 1

2.  Next, locate the MariaDB repository that's closest to your Linode datacenter location, using MariaDB's [repository configuration tool](http://downloads.mariadb.org/mariadb/repositories/). With the repository configuration tool, select **Debian**, then **Debian 7 (Wheezy)**, then **5.5**, and then select a mirror.
3.  Add your chosen MariaDB repository to your `sources.list` file. Open your `/etc/apt/sources.list` file for editing:

        nano /etc/apt/sources.list

    Add your chosen repository to the bottom of the file:

    {{< file-excerpt "/etc/apt/sources.list" >}}
# MariaDB 5.5 repository list
deb http://ftp.osuosl.org/pub/mariadb/repo/5.5/debian wheezy main
deb-src http://ftp.osuosl.org/pub/mariadb/repo/5.5/debian wheezy main

{{< /file-excerpt >}}


    Remember to choose the repository nearest to your server location.

4.  Retrieve the information APT needs to install MariaDB:

        apt-get update

5.  Install MariaDB:

        apt-get install mariadb-server

    You will be prompted to set a password for the MariaDB root user:

    [![Set the password for root during MariaDB installation](/docs/assets/1745-mariadb-set-root-password.png)](/docs/assets/1745-mariadb-set-root-password.png)

    Choose a strong password to secure your server.

After installation, Debian will start the MariaDB server and also set the service to start automatically on reboot.

## Using MariaDB

In this section you will learn how to connect to MariaDB and perform basic SQL commands.

1.  The standard tool for interacting with MariaDB is the MySQL client program. To get started, issue the following command to connect to MariaDB as the root user:

        mysql -u root -p

    When prompted, enter the root password you set when you installed MariaDB. You'll see output like the following:

        Welcome to the MariaDB monitor.  Commands end with ; or \g.
        Your MariaDB connection id is 30
        Server version: 5.5.37-MariaDB-1~wheezy-log mariadb.org binary distribution

        Copyright (c) 2000, 2014, Oracle, Monty Program Ab and others.

        Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

        MariaDB [(none)]>

    Note the `(none)` text in the MariaDB prompt. It will be used to display the current working database. Since you haven't selected any database yet, it is displayed as `(none)`.

2.  Let's try to create a sample database, which we'll later populate with data. Type the following commands to create a database named **testdb**, which is owned by a new user **testuser**. These commands also set the password **secretpassword** for the new user:

        CREATE DATABASE testdb;
        GRANT ALL PRIVILEGES ON testdb.* TO testuser@localhost IDENTIFIED BY 'secretpassword';
        FLUSH PRIVILEGES;
        quit

    The final line logs out the root user from MariaDB.

3.  Log in to MariaDB as **testuser**:

        mysql -u testuser -p

4.  Use the database **testdb**:

        USE testdb;

5.  Create a new table and populate it with some data:

        CREATE TABLE products (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price DECIMAL(6,2));
        INSERT INTO products (name, price) VALUES ('MacBook Pro', 1600.0);
        INSERT INTO products (name, price) VALUES ('Dell', 850.0);
        INSERT INTO products (name, price) VALUES ('Acer', 775.0);

6.  Verify that the new data has been inserted:

        SELECT * FROM products;

    Which should show this output:

        +----+-------------+---------+
        | id | name        | price   |
        +----+-------------+---------+
        |  1 | MacBook Pro | 1600.00 |
        |  2 | Dell        |  850.00 |
        |  3 | Acer        |  775.00 |
        +----+-------------+---------+
        3 rows in set (0.00 sec)

7.  Exit the MariaDB client by typing:

        quit

For more information about SQL commands, you might want to check the [SQL Commands](https://mariadb.com/kb/en/sql-commands/) page on the MariaDB Knowledge Base. To view MariaDB's command list from within the client, type:

    \h

Output:

    MariaDB [(none)]> \h

    General information about MariaDB can be found at
    http://mariadb.org

    List of all MySQL commands:
    Note that all text commands must be first on line and end with ';'
    ?         (\?) Synonym for `help'.
    clear     (\c) Clear the current input statement.
    connect   (\r) Reconnect to the server. Optional arguments are db and host.
    delimiter (\d) Set statement delimiter.
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

## Configuring MariaDB

To configure MariaDB to run the way you want, edit the `/etc/mysql/my.cnf` file. This file controls most of the server system variables, which you will generally want to leave at default.

Whenever you make changes to `/etc/mysql/my.cnf`, restart the server by issuing the following command:

    service mysql restart

## Securing MariaDB Server

We recommend that you secure your MariaDB server by executing the following command:

    mysql_secure_installation

You will be asked to change the root password, remove anonymous users, disable root logins outside of localhost, remove anonymous users, and remove the test database. It is recommended that you answer **Y** for all of the questions. View the sample output below:

    /usr/bin/mysql_secure_installation: 379: /usr/bin/mysql_secure_installation: find_mysql_client: not found

    NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
          SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

    In order to log into MariaDB to secure it, we'll need the current
    password for the root user.  If you've just installed MariaDB, and
    you haven't set the root password yet, the password will be blank,
    so you should just press enter here.

    Enter current password for root (enter for none):
    OK, successfully used password, moving on...

    Setting the root password ensures that nobody can log into the MariaDB
    root user without the proper authorization.

    You already have a root password set, so you can safely answer 'n'.

    Change the root password? [Y/n]
    New password:
    Re-enter new password:
    Password updated successfully!
    Reloading privilege tables..
     ... Success!


    By default, a MariaDB installation has an anonymous user, allowing anyone
    to log into MariaDB without having to have a user account created for
    them.  This is intended only for testing, and to make the installation
    go a bit smoother.  You should remove them before moving into a
    production environment.

    Remove anonymous users? [Y/n]
     ... Success!

    Normally, root should only be allowed to connect from 'localhost'.  This
    ensures that someone cannot guess at the root password from the network.

    Disallow root login remotely? [Y/n]
     ... Success!

    By default, MariaDB comes with a database named 'test' that anyone can
    access.  This is also intended only for testing, and should be removed
    before moving into a production environment.

    Remove test database and access to it? [Y/n]
     - Dropping test database...
    ERROR 1008 (HY000) at line 1: Can't drop database 'test'; database doesn't exist
     ... Failed!  Not critical, keep moving...
     - Removing privileges on test database...
     ... Success!

    Reloading the privilege tables will ensure that all changes made so far
    will take effect immediately.

    Reload privilege tables now? [Y/n]
     ... Success!

    Cleaning up...

    All done!  If you've completed all of the above steps, your MariaDB
    installation should now be secure.

    Thanks for using MariaDB!

 {{< note >}}
Do not be concerned about the `find_mysql_client: not found` message. This is a known bug as described in this [MariaDB mailing list](https://lists.launchpad.net/maria-developers/msg05358.html). Also, unlike MySQL, MariaDB does not install a test database by default, so you can ignore this error message:

ERROR 1008 (HY000) at line 1: Can't drop database 'test'; database doesn't exist

In short, neither warning is a problem.
{{< /note >}}

## Remote User Connections

Let's take a look at how to allow the previously created user, **testuser**, to connect to MariaDB remotely (by default, MariaDB will allow connections from only localhost).

 {{< caution >}}
Opening a MariaDB server up to the internet makes it less secure. If you need to connect from somewhere other than localhost, make sure you implement [firewall](/docs/security/firewalls/iptables) rules that allow connections only from specific IP addresses.
{{< /caution >}}

1.  First, we need to grant user connections from remote hosts for the **testuser** user. Log in to MariaDB as root:

        mysql -u root -p

2.  Allow **testuser** to connect from remote hosts:

        GRANT ALL PRIVILEGES ON testdb.* TO testuser@'%' IDENTIFIED BY 'secretpassword';
        FLUSH PRIVILEGES;
        quit

3.  Configure MariaDB to listen to all network interfaces. Open the `/etc/mysql/my.cnf` file:

        nano /etc/mysql/my.cnf

4.  Edit the `bind-address` variable to listen to all network interfaces:

    {{< file-excerpt "/etc/mysql/my.cnf" >}}
bind-address = 0.0.0.0

{{< /file-excerpt >}}

5.  Restart the server:

        service mysql restart

6.  Test your connection from your *local computer* to your MariaDB server, replacing **testuser** with your username, and **example.com** with your domain or IP address:

        mysql -u testuser -h example.com -p

If the login is successful, you should see the MariaDB welcome message and the shell prompt.

## Tuning MariaDB

MySQL Tuner is a useful tool that connects to a running instance of MariaDB and provides configuration recommendations based on workload. You should let your MariaDB instance run for at least 24 hours before running the tuner. The longer the instance has been running, the better advice the tuner will provide.

Install MySQL Tuner by issuing the following command:

    apt-get install mysqltuner

Run MySQL tuner with the following command:

    mysqltuner

Below is some sample output:

     >>  MySQLTuner 1.1.1 - Major Hayden <major@mhtx.net>
     >>  Bug reports, feature requests, and downloads at http://mysqltuner.com/
     >>  Run with '--help' for additional options and output filtering
    Please enter your MySQL administrative login: root
    Please enter your MySQL administrative password:

    -------- General Statistics --------------------------------------------------
    [--] Skipped version check for MySQLTuner script
    [OK] Currently running supported MySQL version 5.5.37-MariaDB-1~wheezy-log
    [OK] Operating on 32-bit architecture with less than 2GB RAM

    -------- Storage Engine Statistics -------------------------------------------
    [--] Status: +Archive -BDB +Federated +InnoDB -ISAM -NDBCluster
    [--] Data in PERFORMANCE_SCHEMA tables: 0B (Tables: 17)
    [!!] InnoDB is enabled but isn't being used
    [OK] Total fragmented tables: 0

    -------- Security Recommendations  -------------------------------------------
    [OK] All database users have passwords assigned

    -------- Performance Metrics -------------------------------------------------
    [--] Up for: 32m 45s (193 q [0.098 qps], 47 conn, TX: 60K, RX: 8K)
    [--] Reads / Writes: 100% / 0%
    [--] Total buffers: 496.0M global + 7.4M per thread (100 max threads)
    [!!] Maximum possible memory usage: 1.2G (245% of installed RAM)
    [OK] Slow queries: 0% (0/193)
    [OK] Highest usage of available connections: 2% (2/100)
    [OK] Key buffer size / total MyISAM indexes: 128.0M/99.0K
    [!!] Key buffer hit rate: 92.5% (53 cached / 4 reads)
    [!!] Query cache efficiency: 0.0% (0 cached / 72 selects)
    [OK] Query cache prunes per day: 0
    [OK] Temporary tables created on disk: 11% (10 on disk / 89 total)
    [OK] Thread cache hit rate: 95% (2 created / 47 connections)
    [OK] Table cache hit rate: 70% (41 open / 58 opened)
    [OK] Open file limit used: 5% (53/1K)
    [OK] Table locks acquired immediately: 100% (139 immediate / 139 locks)
    [!!] Connections aborted: 19%

    -------- Recommendations -----------------------------------------------------
    General recommendations:
        Add skip-innodb to MySQL configuration to disable InnoDB
        MySQL started within last 24 hours - recommendations may be inaccurate
        Reduce your overall MySQL memory footprint for system stability
        Enable the slow query log to troubleshoot bad queries
        Your applications are not closing MySQL connections properly
    Variables to adjust:
      *** MySQL's maximum memory usage is dangerously high ***
      *** Add RAM before increasing MySQL buffer variables ***
        query_cache_limit (> 128K, or use smaller result sets)
{{< output >}}

{{< /output >}}

Pay attention to the output, especially the recommendations at the end. It will point you towards which variables you should adjust in the `[mysqld]` section of your `/etc/mysql/my.cnf` file.

## How to Reset MariaDB's root Password

If you forget your root password, you can easily reset it by following the instructions below:

1.  Stop the MariaDB server:

        service mysql stop

2.  Start the server with the `skip-grant-tables` setting so you can log in to MariaDB without the password:

        mysqld_safe --skip-grant-tables &

3.  Now you can connect to the MariaDB server as root without a password:

        mysql -u root

4.  Within the MariaDB client, issue the following commands to reset the password for the **root** user and log out:

        USE mysql
        UPDATE user SET password=PASSWORD('yournewpassword') WHERE user='root';
        FLUSH PRIVILEGES;
        quit

5.  Restart the MariaDB server:

        service mysql restart

6.  Connect to the MariaDB server using your new password:

        mysql -u root -p
