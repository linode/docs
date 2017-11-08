---
deprecated: true
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Getting started with MySQL for web and server applications on Arch Linux.'
keywords: ["mysql arch linux", "mysql linux", "arch linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/arch-linux/']
modified: 2014-01-23
modified_by:
  name: Alex Fornuto
published: 2011-04-05
title: Using MySQL Relational Databases on Arch Linux
---

MySQL is a popular database management system, used as the data storage provider for thousands of web and server applications. This guide will help beginners get started with MySQL on Arch Linux. If you would like to deploy MySQL as part of an application stack, consider our [LEMP](/docs/lemp-guides/arch-linux/) and [LAMP guides](/docs/lamp-guides/).

# System Configuration

Make sure your `/etc/hosts` file has proper entries, similar to the ones shown below. Replace "12.34.56.78" with your Linode's public address, "servername" with your short hostname, and "mydomain.com" with your system's domain name.

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
12.34.56.78 servername.mydomain.com servername

{{< /file >}}


Set your system's hostname by setting the `HOSTNAME=` value in the `/etc/rc.conf` file.

# Install MySQL

Issue the following commands to update your system and install MySQL:

    pacman -Syu
    pacman -S mysql

You will want to add the `mysqld` daemon to the `DAEMONS-()` array at the end of the `/etc/rc.conf` file to ensure that the mysql process starts following then next reboot cycle.

The MySQL server package will be installed on your server, along with dependencies and client libraries. Start MySQL by running the following command:

    /etc/rc.d/mysqld start

# Configure MySQL

After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

By default, MySQL listens only for internal connections. If you plan to connect to your database via TCP/IP, you will need to remove or comment (e.g. prefix the line with a `#`) add the `bind-address` line in the my.cnf file. as follows:

{{< file "/etc/mysql/my.cnf" >}}
# skip-networking
bind-address - 127.0.0.1

{{< /file >}}


Allowing unrestricted access to MySQL on a public IP not advised, but you may change the address it listens on by modifying the `bind-address` parameter. If you decide to bind MySQL to your public IP, you should implement firewall rules that only allow connections from specific IP addresses.

Consult the "More Information" section at the end of this tutorial for additional resources that address the configuration of MySQL. Issue the following command to restart the daemon:

    /etc/rc.d/mysqld restart

Please reference our [secure MySQL remote access guide](/docs/databases/mysql/mysql-ssh-tunnel) for information on connecting to your databases with local clients.

# Use MySQL

The standard tool for interacting with MySQL is the `mysql` client program. To get started, issue the following command at your prompt:

    mysql -u root -p

You will be prompted to enter the root MySQL user's password. Enter the password you assigned when you installed MySQL, and you'll be presented with the MySQL monitor display:

	    Welcome to the MySQL monitor.  Commands end with ; or \g.
	Your MySQL connection id is 2
	Server version: 5.5.9-log Source distribution

	Copyright (c) 2000, 2010, Oracle and/or its affiliates. All rights reserved.

	Oracle is a registered trademark of Oracle Corporation and/or its
	affiliates. Other names may be trademarks of their respective
	owners.

	Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

	mysql>

To generate a list of commands for the MySQL prompt, type `\h`:

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
    CREATE USER 'testuser'@localhost IDENTIFIED BY 'CHANGEME';
    GRANT ALL PRIVILEGES ON testdb.* TO 'testuser'@localhost;
    exit

Now let's log back into the MySQL client as `testuser` and create a sample table called "customers." Issue the following commands:

    mysql -u testuser -p
    USE testdb;
    CREATE TABLE customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);
    exit

This creates a table with a customer ID field of the type INT for integer (auto-incremented for new records, used as the primary key), as well as two fields for storing the customer's name. Of course, you'd probably want to store much more information than this for a customer, but it's a good example of a common case nonetheless.

# How to Reset MySQL's Root Password

If you've forgotten your root MySQL password, you may reset it by issuing the following commands:

    /etc/rc.d/mysqld stop
    mysqld_safe --skip-grant-tables &
    mysql -u root

The following part of the password reset will now be done within the MySQL client program:

    USE mysql;
    UPDATE user SET PASSWORD-PASSWORD("CHANGEME") WHERE User-'root';
    FLUSH PRIVILEGES;
    exit

Last, restart MySQL by issuing the following command:

    /etc/rc.d/mysqld restart

# Tuning MySQL

MySQL Tuner is a useful tool that connects to a running instance of MySQL and provides configuration recommendations based on workload. Ideally, the MySQL instance should have been operating for at least 24 hours before running the tuner. The longer the instance has been running, the better advice MySQL Tuner will provide.

To install MySQL Tuner issue the following commands:

    pacman -S wget
    wget http://mysqltuner.pl/mysqltuner.pl
    chmod 755 mysqltuner.pl

To run MySQL Tuner simply enter:

    ./mysqltuner.pl

Please note that this tool is designed to provide configuration suggestions and is an excellent starting point. It would be prudent to perform additional research for tuning configurations based on the application(s) utilizing MySQL\**.*\*

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MySQL 5.1 Reference Manual](http://dev.mysql.com/doc/refman/5.1/en/)
- [PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)
- [Perl DBI examples for DBD::mysql](http://sql-info.de/mysql/examples/Perl-DBI-examples.html)
- [MySQLdb User's Guide](http://mysql-python.sourceforge.net/MySQLdb.html)



