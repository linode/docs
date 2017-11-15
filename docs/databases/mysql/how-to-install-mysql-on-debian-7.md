---
author:
  name: Mike Rosabal
  email: docs@linode.com
description: 'Getting started with MySQL on Debian 7.'
keywords: ["MySQL on Linux", "Debian 7", "Debian Wheezy", "Debian", "cloud", "cloud hosting", "Linux", "MySQL", "database", "MariaDB", "install MySQL", "secure MySQL", "mysqltuner"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/debian-7-wheezy/','databases/mysql/using-mysql-relational-databases-on-debian-7-wheezy/']
modified: 2017-09-05
modified_by:
  name: Linode
published: 2014-01-14
title: 'How to Install MySQL on Debian 7'
external_resources:
 - '[MySQL 5.5 Reference Manual](https://dev.mysql.com/doc/refman/5.5/en/index.html)'
 - '[PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)'
 - '[Perl DBI examples for DBD::mysql](http://sql-info.de/mysql/examples/Perl-DBI-examples.html)'
 - '[MySQLdb User''s Guide](http://mysql-python.sourceforge.net/MySQLdb.html)'
 - '[MySQL Tuner Tutorial](http://www.debiantutorials.com/tuning-mysql-with-mysqltuner-to-increase-efficiency-and-performance/)'
---

![mysql_debian7_banner](/docs/assets/How_to_Install_MySQL_on_Debian_7_smg.jpg)

MySQL is a popular database management system used for web and server applications. This guide will introduce how to install, configure and manage MySQL on a Linode running Debian 7 (Wheezy).

Large MySQL databases can require a considerable amount of memory. For this reason, we recommend using a [high memory Linode](https://www.linode.com/pricing#high-memory) for such setups.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update
        sudo apt-get upgrade


## Install MySQL

    sudo apt-get install mysql-server

During the installation process, you will be prompted to set a password for the MySQL root user as shown below. Choose a strong password and keep it in a safe place for future reference.

[![Setting the MySQL root password in Debian 7.](/docs/assets/mysql-rootpw-debian.png)](/docs/assets/mysql-rootpw-debian.png)

MySQL will bind to localhost (127.0.0.1) by default. Please reference our [MySQL remote access guide](/docs/databases/mysql/create-an-ssh-tunnel-for-mysql-remote-access) for information on connecting to your databases with local clients.

{{< note >}}
Allowing unrestricted access to MySQL on a public IP not advised, but you may change the address it listens on by modifying the `bind-address` parameter in `/etc/my.cnf`. If you decide to bind MySQL to your public IP, you should implement firewall rules that only allow connections from specific IP addresses.
{{< /note >}}

## Harden MySQL Server

Run the `mysql_secure_installation` script to address several security concerns in a default MySQL installation.

    sudo mysql_secure_installation

You will be given the choice to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. You can read more about the script in the [MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.0/en/mysql-secure-installation.html).

## Using MySQL

The standard tool for interacting with MySQL is the `mysql` client which installs with the `mysql-server` package. The MySQL client is used through a terminal.

### Root Login

1.  To log in to MySQL as the root user:

        mysql -u root -p

2.  When prompted, enter the root password. You'll then be presented with a welcome header and the MySQL prompt as shown below:

        mysql>

3.  To generate a list of commands for the MySQL prompt, enter `\h`. You'll then see:

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

        mysql>

### Create a New MySQL User and Database
1. In the example below, `testdb` is the name of the database, `testuser` is the user, and `password` is the user's password.

        create database testdb;
        create user 'testuser'@'localhost' identified by 'password';
        grant all on testdb.* to 'testuser' identified by 'password';

2.  Then exit MySQL.

        exit

### Create a Sample Table

1.  Log back in as `testuser`.

        mysql -u testuser -p

2.  Create a sample table called `customers`. This creates a table with a customer ID field of the type `INT` for integer (auto-incremented for new records, used as the primary key), as well as two fields for storing the customer's name.

        use testdb;
        create table customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);

3.  Then exit MySQL.

        exit

## Reset the MySQL Root Password

If you forget your root MySQL password, it can be reset.

1. Stop the current MySQL server instance.

        sudo /etc/init.d/mysql stop

2. Use dpkg to re-run the configuration process MySQL goes through on first installation. You will again be asked to set a root password.

        sudo dpkg-reconfigure mysql-server-5.5

dpkg will restart MySQL automatically and you'll be able to log in using `mysql -u root -p`.

## Tune MySQL

[MySQL Tuner](https://github.com/major/MySQLTuner-perl) is a Perl script that connects to a running instance of MySQL and provides configuration recommendations based on workload. Ideally, the MySQL instance should have been operating for at least 24 hours before running the tuner. The longer the instance has been running, the better advice MySQL Tuner will give.

1.  Install MySQL Tuner from Ubuntu's repositories.

        sudo apt-get install mysqltuner

2.  To run it:

        mysqltuner

    You will be asked for the MySQL root user's name and password. The output will show two areas of interest: General recommendations and Variables to adjust.

MySQL Tuner is an excellent starting point to optimize a MySQL server but it would be prudent to perform additional research for configurations tailored to the application(s) utilizing MySQL on your Linode.
