---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Getting started with MySQL for web and server applications on Fedora 14.'
keywords: ["mysql fedora 14", "mysql linux", "mysql fedora"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/fedora-14/']
modified: 2014-01-28
modified_by:
  name: Alex Fornuto
published: 2010-12-07
title: Use MySQL Relational Databases on Fedora 14
---



MySQL is a popular database management system, used as the data storage provider for thousands of web and server applications. This guide will help beginners get started with MySQL on a Fedora 14 Linode. For purposes of this tutorial, it is assumed that you've followed the steps outlined in our [getting started guide](/docs/getting-started/), that your system is up to date, and that you've logged into your Linode as root via SSH.

System Configuration
--------------------

Make sure your `/etc/hosts` file has proper entries, similar to the ones shown below. Replace "12.34.56.78" with your Linode's public address, "servername" with your short hostname, and "mydomain.com" with your system's domain name.

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
12.34.56.78 servername.mydomain.com servername

{{< /file >}}


Set your system's hostname by issuing the following commands. Replace "servername" with your system's short hostname.

    echo "HOSTNAME=servername" >> /etc/sysconfig/network
    hostname "servername"

Install MySQL
-------------

Issue the following commands to update your system and install MySQL:

    yum update
    yum install mysql-server
    chkconfig mysqld on

The MySQL server package will be installed on your server, along with dependencies and client libraries. Start MySQL by running the following command:

    service mysqld start

Configure MySQL
---------------

After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

By default, MySQL makes some assumptions about your server environment with respect to memory. To configure MySQL more conservatively, you'll need to edit some settings in its configuration file. Your file should resemble the following:

{{< file "/etc/my.cnf" ini >}}
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
key_buffer = 16M
max_allowed_packet = 1M
thread_stack = 64K
table_cache = 4
sort_buffer = 64K
net_buffer_length = 2K
bind-address = 127.0.0.1

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

{{< /file >}}


These settings are only suggested values for a low memory environment; please feel free to tune them to appropriate values for your server. Consult the "More Information" section at the end of this tutorial for additional resources for this topic.

If you made any changes to MySQL's configuration, issue the following command to restart it:

    service mysqld restart

MySQL will bind to localhost (127.0.0.1) by default. Please reference our [secure MySQL remote access guide](/docs/databases/mysql/mysql-ssh-tunnel) for information on connecting to your databases with local clients.

Allowing unrestricted access to MySQL on a public IP not advised, but you may change the address it listens on by modifying the `bind-address` parameter. If you decide to bind MySQL to your public IP, you should implement firewall rules that only allow connections from specific IP addresses.

Use MySQL
---------

The standard tool for interacting with MySQL is the `mysql` client program. To get started, issue the following command at your prompt:

    mysql -u root -p

You will be prompted to enter the root MySQL user's password. Enter the password you assigned when you installed MySQL, and you'll be presented with the MySQL monitor display:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 2
    Server version: 5.1.52 Source distribution

    Copyright (c) 2000, 2010, Oracle and/or its affiliates. All rights reserved.
    This software comes with ABSOLUTELY NO WARRANTY. This is free software,
    and you are welcome to modify and redistribute it under the GPL v2 license

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql>

To generate a list of commands for the MySQL prompt, type `\h`:

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

Let's create a database and assign a user to it. Issue the following commands at the MySQL prompt:

    CREATE DATABASE testdb;
    CREATE USER 'testuser'@localhost IDENTIFIED BY 'CHANGEME';
    GRANT ALL PRIVILEGES ON testdb.* TO 'testuser'@localhost;
    exit

Now let's log back into the MySQL client as `testuser` and create a sample table called "customers." Issue the following commands:

    mysql -u testuser -p
    USE testdb;
    CREATE TABLE customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);
    exit

This creates a table with a customer ID field of the type INT for integer (auto-incremented for new records, used as the primary key), as well as two fields for storing the customer's name. Of course, you'd probably want to store much more information than this for a customer, but it's a good example of a common case nonetheless.

How to Reset MySQL's Root Password
----------------------------------

If you've forgotten your root MySQL password, you may reset it by issuing the following commands:

    service mysqld stop
    mysqld_safe --skip-grant-tables &
    mysql -u root

The following part of the password reset will now be done within the MySQL client program:

    USE mysql;
    UPDATE user SET PASSWORD=PASSWORD("CHANGEME") WHERE User='root';
    FLUSH PRIVILEGES;
    exit

Last, restart MySQL by issuing the following command:

    service mysqld restart

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MySQL 5.1 Reference Manual](http://dev.mysql.com/doc/refman/5.1/en/)
- [PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)
- [Perl DBI examples for DBD::mysql](http://sql-info.de/mysql/examples/Perl-DBI-examples.html)
- [MySQLdb User's Guide](http://mysql-python.sourceforge.net/MySQLdb.html)



