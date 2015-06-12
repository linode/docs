---
author:
  name: Mike Rosabal
  email: mrosabal@linode.com
description: 'Get started with MySQL for web and server applications on Debian 8'
keywords: 'mysql debian 8,mysql debian,mysql linux,mysql linux vps,mysql,debian,databases,debian 8'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, June 12th, 2015
modified_by:
  name: Elle Krout
published: 'Friday, June 12th, 2015'
title: 'Using MySQL Relational Databases on Debian 8'
external_resources:
 - '[MySQL 5.1 Reference Manual](http://dev.mysql.com/doc/refman/5.1/en)'
 - '[PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)'
 - '[Perl DBI examples for DBD::mysql](http://sql-info.de/mysql/examples/Perl-DBI-examples.html)'
 - '[MySQLdb User''s Guide](http://mysql-python.sourceforge.net/MySQLdb.html)'
 - '[MySQL Tuner Tutorial](http://www.debiantutorials.com/tuning-mysql-with-mysqltuner-to-increase-efficiency-and-performance)'
---

MySQL is a popular database management system, used as the data storage provider for thousands of web and server applications. This guide will help beginners get started with MySQL on a Debian 8 Linode. For purposes of this tutorial, it is assumed that you've followed the steps outlined in our [Getting Started](/docs/getting-started/) guide, your system is up to date, and you've logged into your Linode as root via SSH.

## Install MySQL

1.  Make sure your package repositories and installed programs are up to date by issuing the following commands:

        apt-get update
        apt-get upgrade 

2.  Begin by issuing the following command in your terminal:

        apt-get install mysql-server

    You will be prompted to set a password for the MySQL root user. Choose a strong password and keep it in a safe place for future reference.

    [![Setting the MySQL root password.](/docs/assets/1494-debian-7-mysql-root-password.png)](/docs/assets/1494-debian-7-mysql-root-password.png)

    The MySQL server package will be installed on your server, along with dependencies and client libraries.

3.  After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. It gives you the option to disable root logins from outside localhost, remove anonymous user accounts, and to remove the test database. Additionally, it allows you to set your root password. Run the following command to execute the program:

        mysql_secure_installation


## Configuring MySQL

Issue the following command to restart MySQL after making configuration changes:

    systemctl restart mysql

MySQL will bind to localhost (127.0.0.1) by default. Allowing unrestricted access to MySQL on a public IP not advised, but you may change the address it listens on by modifying the `bind-address` parameter in `/etc/mysql/my.cnf`. If you decide to bind MySQL to your public IP, you should implement firewall rules that only allow connections from specific IP addresses.

## Using MySQL

The standard tool for interacting with MySQL is the `mysql` client program. To get started, issue the following command at your prompt:

    mysql -u root -p

You will be prompted to enter the root MySQL user's password. Enter the password you assigned when you installed MySQL, and you'll be presented with the MySQL monitor display:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 37
    Server version: 5.5.43-0+deb8u1 (Debian)

    Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.

    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql>

To generate a list of commands for the MySQL prompt type `\h`:

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

    mysql>

Let's create a database and assign a user to it. Issue the following commands at the MySQL prompt:

    CREATE DATABASE testdb;

    CREATE USER 'testuser' IDENTIFIED BY 's8723hk2';

    GRANT ALL PRIVILEGES ON testdb.* TO 'testuser';

    exit

Now let's log back into the MySQL client as `testuser` and create a sample table called "customers." Issue the following commands:

    mysql -u testuser -p

    USE testdb;

    CREATE TABLE customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);

This creates a table with a customer ID field of the type INT for integer (auto-incremented for new records, used as the primary key), as well as two fields for storing the customer's name. Of course, you'd probably want to store much more information than this on a customer, but it's a good example of a common case nonetheless.


## Tuning MySQL

MySQL Tuner is a useful tool that connects to a running instance of MySQL and provides configuration recommendations based on workload. Ideally, the MySQL instance should have been operating for at least 24 hours before running the tuner. The longer the instance has been running, the better advice MySQL Tuner will provide.

To install MySQL Tuner issue the following command:

    apt-get install mysqltuner

To run MySQL Tuner simply enter:

    mysqltuner

Please note that this tool is designed to provide configuration suggestions and is an excellent starting point. It would be prudent to perform additional research for tuning configurations based on the application(s) utilizing MySQL.