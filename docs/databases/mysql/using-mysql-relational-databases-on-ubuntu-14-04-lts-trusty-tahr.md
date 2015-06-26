---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Getting started with MySQL for web and server applications on Ubuntu 14.04 LTS (Trusty Tahr).'
keywords: 'mysql ubuntu 14.04,mysql ubuntu,mysql on linux,mysql vps'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/mysql/ubuntu-14.04-trusty-pangolin/']
modified: Saturday, September 13th, 2014 
modified_by:
  name: Linode 
published: 'Monday, October 8th, 2012'
title: 'Using MySQL Relational Databases on Ubuntu 14.04 LTS (Trusty Tahr)'
external_resources:
 - '[MySQL 5.5 Reference Manual](http://dev.mysql.com/doc/refman/5.5/en/)'
 - '[PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)'
 - '[Perl DBI examples for DBD::mysql](http://sql-info.de/mysql/examples/Perl-DBI-examples.html)'
 - '[MySQLdb User''s Guide](http://mysql-python.sourceforge.net/MySQLdb.html)'
---

MySQL is a popular database management system, used as the data storage provider for thousands of web and server applications. This guide will help beginners get started with MySQL on an Ubuntu 14.04 LTS (Trusty Tahr) Linux VPS. For purposes of this tutorial, we'll assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/), and that your system is up to date. The commands listed will need to be run with root permissions. You can elevate your login session to your root user by using the "su" command, and then entering your root password when prompted. If you're performing these steps as a standard user with sudo privileges, remember to prepend "sudo" to the commands shown below.

## Basic System Configuration

Make sure your `/etc/hosts` file contains sensible values. In the example file below, you would replace "12.34.56.78" with your Linode's IP address, and "servername.example.com" with your Linode's fully qualified domain name (FQDN). It is advisable to use something unique and memorable for "servername" in this file.

{: .file }
/etc/hosts
:   ~~~
    127.0.0.1 localhost.localdomain localhost
    12.34.56.78 servername.example.com servername
    ~~~

Next, make sure your Linode's hostname is set to the short value you specified in `/etc/hosts`:

    echo "servername" > /etc/hostname
    hostname -F /etc/hostname

To make sure `universe` repositories are enabled, modify your `/etc/apt/sources.list` file to mirror the example file below.

{: .file }
/etc/apt/sources.list
:   ~~~
    ## main & restricted repositories
    deb http://us.archive.ubuntu.com/ubuntu/ trusty main restricted
    deb-src http://us.archive.ubuntu.com/ubuntu/ trusty main restricted

    deb http://security.ubuntu.com/ubuntu trusty-security main restricted
    deb-src http://security.ubuntu.com/ubuntu trusty-security main restricted

    ## universe repositories
    deb http://us.archive.ubuntu.com/ubuntu/ trusty universe
    deb-src http://us.archive.ubuntu.com/ubuntu/ trusty universe
    deb http://us.archive.ubuntu.com/ubuntu/ trusty-updates universe
    deb-src http://us.archive.ubuntu.com/ubuntu/ trusty-updates universe

    deb http://security.ubuntu.com/ubuntu trusty-security universe
    deb-src http://security.ubuntu.com/ubuntu trusty-security universe
    ~~~

## Installing MySQL

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Begin by issuing the following command in your terminal:

    apt-get install mysql-server

You will be prompted to set a password for the MySQL root user. Choose a strong password and keep it in a safe place for future reference.

[![Setting the MySQL root password in Ubuntu 14.04 LTS (Trusty Tahr).](/docs/assets/1130-tahr-01-mysql-root-password.png)](/docs/assets/1130-tahr-01-mysql-root-password.png)

The MySQL server package will be installed on your server, along with dependencies and client libraries. After installing MySQL, it's recommended that you run `mysql_secure_installation` in order to help secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

After running `mysql_secure_installation`, MySQL is secure and ready to be configured.

## Configuring MySQL

Issue the following command to restart MySQL after making configuration changes:

    /etc/init.d/mysql restart

MySQL will bind to localhost (127.0.0.1) by default. Allowing unrestricted access to MySQL on a public IP not advised, but you may change the address it listens on by modifying the `bind-address` parameter in `/etc/mysql/my.cnf`. If you decide to bind MySQL to your public IP, you should implement firewall rules that only allow connections from specific IP addresses.

## Using MySQL

The standard tool for interacting with MySQL is the `mysql` client program. To get started, issue the following command at your prompt:

    mysql -u root -p

You will be prompted to enter the root MySQL user's password. Enter the password you assigned when you installed MySQL, and you'll be presented with the MySQL monitor display:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 42
    Server version: 5.5.38-0ubuntu0.14.04.1 (Ubuntu)

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql>

If you've forgotten your root password, use the package reconfiguration tool to change that password:

    dpkg-reconfigure mysql-server-5.5

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
    CREATE USER 'testuser'@localhost IDENTIFIED BY 'changeme';
    GRANT ALL PRIVILEGES ON testdb.* TO 'testuser'@localhost;
    exit

Now let's log back into the MySQL client as `testuser` and create a sample table called "customers." Issue the following commands:

    mysql -u testuser -p

    USE testdb;
    CREATE TABLE customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);

This creates a table with a customer ID field of the type INT for integer (auto-incremented for new records and used as the primary key), as well as two fields for storing the customer's name.

By default, access to databases will be limited to connections from localhost. To securely administer your databases from a remote location, please follow our guide for [securely administering mysql with an SSH tunnel](/docs/databases/mysql/mysql-ssh-tunnel). It is *not* a good practice to run MySQL on your public IP address, unless you have a very good reason for doing so.

## Tuning MySQL

MySQL Tuner is a useful tool that connects to a running instance of MySQL and provides configuration recommendations based on workload. Ideally, the MySQL instance should have been operating for at least 24 hours before running the tuner. The longer the instance has been running, the better advice MySQL Tuner will provide.

To install MySQL Tuner issue the following command:

    sudo apt-get install mysqltuner

To run MySQL Tuner simply enter:

    mysqltuner

Please note that this tool is designed to provide configuration suggestions and is an excellent starting point. It would be prudent to perform additional research for tuning configurations based on the application(s) utilizing MySQL.