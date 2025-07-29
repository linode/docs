---
slug: how-to-install-mariadb-on-debian-12
title: "Installing MariaDB on Debian 12"
title_meta: "How to Install MariaDB on Debian 12"
description: "This guide shows how to install and configure the MariaDB server on Debian 12."
og_description: "MariaDB is a robust, scalable and reliable SQL Server that can serve as a drop-in replacement for MySQL. This guide shows how to install and configure it on Debian 12 (Bookworm)."
authors: ["Ryan Syracuse"]
contributors: ["Ryan Syracuse"]
published: 2025-07-22
keywords: ["mariadb", "Debian 12", "debian", "bookworm", "database", "mysql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/databases/mariadb/how-to-install-mariadb-on-debian-12/','/databases/mariadb/mariadb-setup-debian/']
image: Installing_MariaDB_on_Debian12.png
external_resources:
 - '[MariaDB Knowledge Base](https://mariadb.com/kb/en)'
 - '[MariaDB FAQ](https://mariadb.com/kb/en/mariadb-mariadb-faq/)'
 - '[MariaDB SQL commands](https://mariadb.com/kb/en/sql-commands/)'
relations:
    platform:
        key: how-to-install-mariadb
        keywords:
            - distribution: Debian 12
tags: ["debian","mariadb","database"]
deprecated: false
---

MariaDB is a fork of the popular cross-platform MySQL database management system and is considered a full [drop-in replacement](https://mariadb.com/kb/en/mariadb/mariadb-vs-mysql-features/) for MySQL. MariaDB was created by one of MySQL's original developers in 2009 after MySQL was acquired by Oracle during the Sun Microsystems merger. Today MariaDB is maintained and developed by the [MariaDB Foundation](https://mariadb.org/en/foundation/) and community contributors with the intention that it remain GNU GPL software.

**Note:**
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Get Started](/docs/products/platform/get-started/) with Linode and [Creating a Linode (Compute Instance)](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system and configure your hostname. You can also to set the timezone, create a limited user account, and harden SSH access.

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN) if you have one assigned.

## Install and Setup MariaDB

Install MariaDB using the package manager.

    sudo apt install mariadb-server

MariaDB will bind to localhost (127.0.0.1) by default. For information on connecting to a remote database using SSH, see our [MySQL remote access](/docs/guides/create-an-ssh-tunnel-for-mysql-remote-access/) guide, which also applies to MariaDB.

**Note:**
Allowing unrestricted access to MariaDB on a public IP is not advised. However, you can change the address it listens on by modifying the `bind-address` parameter in `/etc/mysql/mariahdb.conf.d/50-server.cnf`. If you decide to bind MariaDB to your public IP address, you should implement firewall rules that restrict access to specific IP addresses.

### MariaDB Client

The standard tool for interacting with MariaDB is the `mariadb` client, which is installed alongside the `mariadb-server` package. You can access the MariaDB client in the terminal using the `mysql` command.

### Root Login

Log into MariaDB as the root user:

        sudo mysql -u root -p


**Note:**
  On Debian 12, MariaDB uses the `unix_socket` plugin by default. This means that if you're logged into the system as a user with root privileges, you can press **Enter** at the password prompt and still gain access--no password is required.

    You'll then be presented with a welcome header and the MariaDB prompt as shown below:

    {{< output >}}
MariaDB [(none)]>
{{</ output >}}

To view a list of available commands, type `\h` at the prompt. You then see:

    {{< output >}}
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

MariaDB [(none)]>
{{</ output >}}

### Securing the Installation

After accessing MariaDB as the root user, you can switch from socket-based authentication to password-based authentication by enabling the `mysql_native_password` plugin:

        USE mysql;
        UPDATE user SET plugin='mysql_native_password' WHERE user='root';
        FLUSH PRIVILEGES;
        exit;

**New in MariaDB 10.11 on Debian 12:**
The `mysql_secure_installation` script now offers the option to *set a root password,** which automatically switches the authentication method from `unix_socket` to `mysql_native_password`. This is a change from earlier versions, where socket-based authentication was the default and required manual reconfiguration.

Next, run the `mysql_secure_installation` script to address several security concerns in a default MariaDB installation:

        sudo mysql_secure_installation

This script will guide you through several options, including:
  - Setting a root password (if you haven't already).
  - Removing anonymous user accounts.
  - Disabling remote root logins
  - Removing the test database

It's recommended that you answer `yes` to these prompts for a more secure setup (to harden your MariaDB installation against unauthorized access). You can read more about the script in the [MariaDB Knowledge Base](https://mariadb.com/kb/en/mariadb/mysql_secure_installation/).

## Using MariaDB

### Create a New MariaDB User and Database

1.  Log in to the database again. When you're prompted to log in to MariaDB again, you should enter the password only if you previously set one during an earlier step. 

        sudo mysql -u root -p

1. In the example below, `testdb` is the name of the database, `testuser` is the user, and `password` is the user's password. You should replace `password` with a secure password:

        CREATE DATABASE testdb;
        CREATE user 'testuser'@localhost IDENTIFIED BY 'password';
        GRANT ALL ON testdb.* TO 'testuser' IDENTIFIED BY 'password';

    You can shorten this process by creating the user *while* assigning database permissions:

        CREATE DATABASE testdb;
        GRANT ALL ON testdb.* TO 'testuser' IDENTIFIED BY 'password';

1.  Then exit MariaDB:

        exit;

### Create a Sample Table

1.  Log back in as `testuser`, entering the password when prompted:

        sudo mysql -u testuser -p

1.  Create a sample table called `customers`:

        USE testdb;
        CREATE TABLE customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);

    - This creates a table with a `customer_id` field of the type `INT` for integer.
      - This field is auto-incremented for new records and used as the primary key.
    - Two other fields are created, `first_name` and `last_name` for storing the customer's name.

1.  View the new table:
        SHOW TABLES;

    {{< output >}}
+------------------+
| Tables_in_testdb |
+------------------+
| customers        |
+------------------+
1 row in set (0.00 sec)
{{</ output >}}

1.  Add some data:

        INSERT INTO customers (first_name, last_name) VALUES ('John', 'Doe');

1.  View the data:

        SELECT * FROM customers;

    {{< output >}}
+-------------+------------+-----------+
| customer_id | first_name | last_name |
+-------------+------------+-----------+
|           1 | John       | Doe       |
+-------------+------------+-----------+
1 row in set (0.00 sec)
{{</ output >}}

1.  Then exit MariaDB:

        exit;

## Reset the MariaDB Root Password

If you forget your root MariaDB password, it can be reset.

1.  Stop the current MariaDB server instance.

        sudo systemctl stop mariadb

1.  Then execute the following command which allows the database to start without loading the grant tables or networking.

        sudo systemctl set-environment MYSQLD_OPTS="--skip-grant-tables --skip-networking"

This still works in Debian 12, but it is temporary and insecure, and should only be used in emergency recovery situations.

1.  Restart MariaDB:

        sudo systemctl start mariadb

1.  Log in to the MariaDB server with the root account, this time without supplying a password:

        sudo mysql -u root

1.  Use the following commands to reset root's password. Replace `password` with a strong password:

        FLUSH PRIVILEGES;
        ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
        exit;

1.  Revert the environment settings to allow the database to start with grant tables and networking:

        sudo systemctl unset-environment MYSQLD_OPTS

1.  Then restart MariaDB:

        sudo systemctl start mariadb

1.  You should now be able to log into the database with your new root password:

        sudo mysql -u root -p
