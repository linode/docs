---
slug: connect-to-mysql-database
author:
  name: Nathaniel Stickman
description: "This guide shows you how to connect to your MySQL or MariaDB database server using the mysql command."
keywords: ['mysql connect to database','mariadb connect to database','mysql connect remote database','how to connect to mysql database']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-20
modified: 2022-06-30
modified_by:
  name: Linode
title: "Connect to a MySQL or MariaDB Database"
h1_title: "How to Connect to a MySQL or MariaDB Database"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MySQL installation documentation](https://dev.mysql.com/doc/refman/8.0/en/installing.html)'
- '[MySQL Workbench manual](https://dev.mysql.com/doc/workbench/en/)'
- '[MySQL Workbench with MariaDB](https://mariadb.com/products/skysql/docs/clients/third-party/mysql-workbench/)'
---

This guide shows you how to connect to a MySQL or MariaDB database using the mysql command-line tool.

{{< note >}}
If you wish to connect to a Linode MySQL Managed Database, review the [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/mysql-connect/) guide instead.
{{</ note >}}

## Before You Begin

- **Obtain the connection details for the MySQL instance you wish to use.** If you do not have a MySQL instance yet, you can create a Managed Database, deploy the MySQL Marketplace App, or install MySQL server (or MariaDB) on a Compute Instance. **This instance must allow remote connections or you must run the mysql command from within same system.**

-   **Install a MySQL client on the system you wish to connect using.** If you are connecting remotely on a different system than your database is located, you need a MySQL command-line client installed. Run the following command to verify that mysql is installed:

        mysql --version

    This should inform you which version you are using, needed when referencing the documentation. If mysql is not installed, see [Install a MySQL Client](#install-a-mysql-client).

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install a MySQL Client

If you do not currently have a MySQL command-line client installed on your system, follow the instructions below to install one through your distribution's repositories. More complete instructions can be found on the [Installing and Upgrading MySQL](https://dev.mysql.com/doc/refman/8.0/en/installing.html) guide in the official documentation.

-   **CentOS Stream 9 (and 8), CentOS/RHEL 8 (including AlmaLinux 8 and RockyLinux 8):**

        sudo dnf install mysql

-   **CentOS/RHEL 7:**

        sudo yum install mysql

-   **Debian:**

    *Debian does not include MySQL within its own repositories. Instead, it uses MariaDB. While this is largely compatible with MySQL, some commands and functionality may vary.*

        sudo apt update
        sudo apt install mariadb-client

-   **Fedora:**

        sudo dnf install community-mysql

-   **Ubuntu:**

        sudo apt update
        sudo apt install mysql-client

## Connect to a Local Database Server

If you are connecting to a MySQL server instance that's located on your same system, you can run the following command. Replace *[username]* with the username of the user you wish to connect using. This may be `root` or any other user you have defined. If you are connecting as root and have not yet defined a password, you can omit the `--password` option.

    mysql --user=[username] --password

The mysql command prompts you for a password if required.

Once you are connected successfully, the MySQL prompt appears and you can enter SQL queries. See [An Overview of MySQL](/docs/guides/an-overview-of-mysql/#the-sql-language) for examples.

## Connect to a Remote Database Server

{{< note >}}
If you wish to connect to a Linode MySQL Managed Database, review the [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/mysql-connect/) guide instead.
{{</ note >}}

In many cases, the database server is not on the same system you are using. In these cases, you can SSH in to the remote system (if permitted) and run the command to [connect to a local MySQL instance](#connect-to-a-local-database-server). Alternatively, you can use a mysql command-line client to remotely connect to the database. If your MySQL server does not allow remote connections or your user cannot connect remotely, see [Configure the Database Server to Allow Remote Connections](#configure-the-database-server-to-allow-remote-connections).

Use the mysql command below to connect to your database, replacing *[host]* with your database server's IP address or domain name and *[username]* with the MySQL user you wish to use.

    mysql --host=[host] --user=[username] --password

## Configure the Database Server to Allow Remote Connections

If you have installed the MySQL server yourself (not through a managed service) and wish to connect to a database remotely without first logging in to the database server through SSH, you may need to modify a few settings. This can be useful if you want to limit SSH access but still permit database access.

Refer to our [Create an SSH Tunnel for MySQL Remote Access](/docs/guides/create-an-ssh-tunnel-for-mysql-remote-access/) to learn how to connect to your database using an SSH tunnel.

1.  Make sure your database has a user set up to allow connections from your local machine's IP address.

    The example below displays a series of commands to create a new MySQL/MariaDB user named `example_user`. The user accepts connections from `192.0.2.0` and has `SELECT`, `INSERT`, `UPDATE`, and `DELETE` permissions on the `example_db` database:

        CREATE user 'example_user'@'192.0.2.0' IDENTIFIED BY 'password';
        GRANT SELECT,INSERT,UPDATE,DELETE ON example-db.* TO 'example_user' IDENTIFIED BY 'password';

1.  Locate you database's configuration files using the command below. The following command lists the files' default locations. The locations returned by the command may be different than those in the example shown below:

        sudo mysql --help

    {{< output >}}
...
Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf ~/.my.cnf
...
{{< /output >}}

1. Using your preferred text editor, locate the `[mysqld]` section and a `bind-address` parameter.

    If you see any `!includedir` parameters in the files, you may also need to check the files in the locations those parameters designate.

1. Once you locate the `bind-address` parameter, change it from the default `127.0.0.1` to `0.0.0.0`. This enables external connections on the database.

    Also, if the file contains a `skip-networking` parameter, comment it out with a `#`.

    {{< file "/etc/mysql/mysql.conf.d/mysqld.conf" >}}
...
[mysqld]

...
# skip-networking

bind-address = 0.0.0.0
...
{{< /file >}}

1.  Restart the MySQL service.

        sudo systemctl restart mysqld

## How to Connect to a Database Remotely Using the MySQL Workbench Tool

Follow our [Install MySQL Workbench for Database Administration](/docs/guides/deploy-mysql-workbench-for-database-administration/) guide for steps to install the MySQL Workbench tool on your local machine. This guide also shows you how to connect to a remote database via MySQL Workbench. These steps work whether your target database server is MySQL or MariaDB.

For more information, take a look at the [official MySQL Workbench manual](https://dev.mysql.com/doc/workbench/en/). You may also refer to MariaDB's documentation on [using the MySQL Workbench with MariaDB](https://mariadb.com/products/skysql/docs/clients/third-party/mysql-workbench/).

## Conclusion

Now that you have your remote database connection, you may want to learn more about using MySQL/MariaDB and working with more advanced database operations. You can refer to our extensive [list of MySQL guides](/docs/guides/databases/mysql/) and specific [MariaDB guides](/docs/guides/databases/mariadb/) to build your database management skills.
