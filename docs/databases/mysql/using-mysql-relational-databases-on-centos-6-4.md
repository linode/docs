---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Getting started with MySQL for web and server applications on CentOS 6.4'
keywords: 'MySQL on Linux,MySQL CentOS,MySQL VPS'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/mysql/centos-6/']
modified: Thursday, January 23rd, 2014
modified_by:
  name: Alex Fornuto
published: 'Wednesday, January 22nd, 2014'
title: 'Using MySQL Relational Databases on CentOS 6.4'
external_resources:
 - '[MySQL 5.1 Reference Manual](http://dev.mysql.com/doc/refman/5.1/en/)'
 - '[PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)'
 - '[Perl DBI examples for DBD::mysql](http://sql-info.de/mysql/examples/Perl-DBI-examples.html)'
 - '[MySQLdb User''s Guide](http://mysql-python.sourceforge.net/MySQLdb.html)'
---

MySQL is a popular database management system, used as the data storage provider for thousands of web and server applications. This guide will help beginners get started with MySQL on a CentOS 5 Linux VPS. For purposes of this tutorial, we'll assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/), that your system is up to date, and that you've logged into your Linode as root via SSH.

## System Configuration

Make sure your `/etc/hosts` file has proper entries, similar to the ones shown below:

{: .file }
/etc/hosts
:   ~~~
    127.0.0.1 localhost.localdomain localhost
    12.34.56.78 servername.mydomain.com servername
    ~~~
    
Be sure to substitute your Linode's public IP address for "12.34.56.78" in the example above.

## Installing MySQL

Issue the following commands to update your system and install MySQL:

    yum update
    yum install mysql-server
    /sbin/chkconfig --levels 235 mysqld on 

The MySQL server package will be installed on your server, along with dependencies and client libraries. Start MySQL by running the following command:

    service mysqld start

## Configuring MySQL

After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

MySQL will bind to localhost (127.0.0.1) by default. Please reference our [secure MySQL remote access guide](/docs/databases/mysql/mysql-ssh-tunnel) for information on connecting to your databases with local clients.

Allowing unrestricted access to MySQL on a public IP not advised, but you may change the address it listens on by modifying the `bind-address` parameter in `/etc/my.cnf`. If you decide to bind MySQL to your public IP, you should implement firewall rules that only allow connections from specific IP addresses.

## Using MySQL

The standard tool for interacting with MySQL is the `mysql` client program. To get started, issue the following command at your prompt:

    mysql -u root -p

You will be prompted to enter the root MySQL user's password. Enter the password you assigned when you installed MySQL, and you'll be presented with the MySQL monitor display:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 1
    Server version: 5.0.45 Source distribution

    Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

    mysql>

To generate a list of commands for the MySQL prompt type `\h`:

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

Let's create a database and assign a user to it. Issue the following commands at the MySQL prompt. Replace `CHANGEME` with the new user's password:

    CREATE DATABASE testdb;
    CREATE USER 'testuser'@localhost IDENTIFIED BY 'CHANGEME';
    GRANT ALL PRIVILEGES ON testdb.* TO 'testuser'@localhost;
    exit

Now let's log back into the MySQL client as `testuser` and create a sample table called "customers." Issue the following commands:

    mysql -u testuser -p
    USE testdb;
    CREATE TABLE customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);

This creates a table with a customer ID field of the type INT for integer (auto-incremented for new records, used as the primary key), as well as two fields for storing the customer's name. Of course, you'd probably want to store much more information than this on a customer, but it's a good example of a common case nonetheless.

## Resetting the MySQL Root Password

If you've forgotten your root MySQL password, you may recover it by issuing the following commands:

    /etc/init.d/mysqld stop 
    mysqld_safe --skip-grant-tables & 
    mysql -u root 

The following part of the password reset will now be done within the MySQL client program:

    USE mysql; 
    UPDATE user SET PASSWORD=PASSWORD("CHANGEME") WHERE USER='root'; 
    FLUSH PRIVILEGES; 
    exit 

Last, restart MySQL by issuing:

    service mysqld restart

## Tuning MySQL

MySQL Tuner is a useful tool that connects to a running instance of MySQL and provides configuration recommendations based on workload. Ideally, the MySQL instance should have been operating for at least 24 hours before running the tuner. The longer the instance has been running, the better advice MySQL Tuner will provide.

To install MySQL Tuner issue the following commands:

    wget http://mysqltuner.pl/mysqltuner.pl

    chmod 755 mysqltuner.pl

To run MySQL Tuner simply enter:

    ./mysqltuner.pl

Please note that this tool is designed to provide configuration suggestions and is an excellent starting point. It would be prudent to perform additional research for tuning configurations based on the application(s) utilizing MySQL.