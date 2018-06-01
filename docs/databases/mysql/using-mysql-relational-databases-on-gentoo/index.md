---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Getting started with MySQL for web and server applications on Gentoo.'
keywords: ["MySQL", "Gentoo", "database", "rdbms"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/gentoo/']
modified: 2014-01-28
modified_by:
  name: Alex Fornuto
published: 2011-01-21
title: Using MySQL Relational Databases on Gentoo
---

MySQL is a relational database management system (RDBMS) that is used as a backend for countless web and server applications. Originally released in 1995, it remains a popular choice for developers as a database server.

Before beginning this guide, please make sure that you have completed the steps outlined in our [getting started guide](/docs/getting-started/). Additionally, make sure you are logged into your system as the root user.

# Installing MySQL

Issue the following command to make sure that your package repository is up to date:

    emerge --sync

The following command will update all packages and their dependencies on the system. If you are not comfortable running this command, you may skip it or use `emerge --update world`:

    emerge --update --deep world

Issue the following command to install MySQL:

    emerge dev-db/mysql

Once this process has completed, you will also need to install the databases that MySQL uses. Issue the following command:

    mysql_install_db

You are now ready to start the MySQL server for the first time:

    /etc/init.d/mysql start

You will need to run `mysql_secure_installation` to set a root password and secure your MySQL instance. Issue the following command:

    mysql_secure_installation

If you would like MySQL to run when the system boots, issue the following command:

    rc-update add mysql default

# Configuring MySQL

By default, MySQL binds to localhost. If you wish for MySQL to listen on a public IP, you may change the `bind-address` value in `/etc/mysql/my.cnf` to reflect your Linode's IP address. Allowing unrestricted access to MySQL on a public IP is not advised, and you may wish to consider implementing firewall rules to only allow traffic from specific IP addresses.

The suggestions listed above may not be appropriate for all environments, so be sure that your application will not require different settings. Please see the additional resources in the "More Information" section of this guide for more verbose documentation on configuring MySQL.

Any time you modify the settings in `/etc/mysql/my.cnf`, you will need to restart the MySQL server. Issue the following command:

    /etc/init.d/mysql restart

# Using MySQL

Most interaction with MySQL happens via the `mysql` command line utility. Issue the following command to interact with MySQL:

    mysql -u root -p

When prompted, enter the password that you created during the `mysql_secure_installation` process. Once you have done so, you will be greeted with the MySQL prompt:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 9
    Server version: 5.1.51-log Gentoo Linux mysql-5.1.51

    Copyright (c) 2000, 2010, Oracle and/or its affiliates. All rights reserved.
    This software comes with ABSOLUTELY NO WARRANTY. This is free software,
    and you are welcome to modify and redistribute it under the GPL v2 license

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql>

If you forget your MySQL root password at a later date, it can be reset with the following sequence of commands:

    /etc/init.d/mysql stop
    mysqld_safe --skip-grant-tables --skip-networking &
    mysqladmin -u root

Once you have logged in, enter the following commands at the MySQL prompt:

    USE mysql;
    UPDATE user SET PASSWORD=PASSWORD("CHANGEME") WHERE User='root';
    FLUSH PRIVILEGES;
    exit

To see a list of available commands (**not** SQL syntax), issue `\h` at the MySQL prompt:

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

# Tuning MySQL

MySQL Tuner is a useful tool that connects to a running instance of MySQL and provides configuration recommendations based on workload. Ideally, the MySQL instance should have been operating for at least 24 hours before running the tuner. The longer the instance has been running, the better advice MySQL Tuner will provide.

To install MySQL Tuner issue the following command:

    emerge dev-db/mysqltuner

To run MySQL Tuner simply enter:

    mysqltuner

Please note that this tool is designed to provide configuration suggestions and is an excellent starting point. It would be prudent to perform additional research for tuning configurations based on the application(s) utilizing MySQL.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MySQL 5.1 Reference Manual](http://dev.mysql.com/doc/refman/5.1/en/)
- [PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)
- [Perl DBI examples for DBD::mysql](http://sql-info.de/mysql/examples/Perl-DBI-examples.html)
- [MySQLdb User's Guide](http://mysql-python.sourceforge.net/MySQLdb.html)



