---
slug: connect-to-a-mysql-or-mariadb-database
author:
  name: Nathaniel Stickman
description: "Learn how to remotely connect to your MySQL or MariaDB database using the command line. Included in the guide are the database configuration steps to allow remote connections from a specific user."
og_description:  "Learn how to remotely connect to your MySQL or MariaDB database using the command line. Included in the guide are the database configuration steps to allow remote connections from a specific user."
keywords: ['mysql connect to database','mariadb connect to database','mysql connect remote database','how to connect to mysql database']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-20
modified_by:
  name: Nathaniel Stickman
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

This guide shows you how to connect to a remote MySQL or MariaDB database using the command line. You can also learn how to connect to a remote database via MySQL Workbench by using the referenced links at the end of this guide.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Install MySQL or MariaDB on your server. You can follow our guide on [How to Install MySQL](/docs/guides/how-to-install-mysql-on-debian-8/) or on [How to Install MariaDB](/docs/guides/how-to-install-mariadb-on-debian-9/). Use the **Distribution** drop down at the top of each guide to select the Linux distribution you want to install on.

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Connect to a Remote Database from the Command Line

This section shows you how to connect to your database without an SSH connection. This can be useful if you want to limit SSH access but still permit database access.

Refer to our [Create an SSH Tunnel for MySQL Remote Access](/docs/guides/create-an-ssh-tunnel-for-mysql-remote-access/) to learn how to connect to your database using an SSH tunnel.

### Configure the Database Server

1. Make sure your database has a user set up to allow connections from your local machine's IP address.

   The example below displays a series of commands to create a new MySQL/MariaDB user named `example_user`. The user accepts connections from `192.0.2.0` and has `SELECT`, `INSERT`, `UPDATE`, and `DELETE` permissions on the `example_db` database:

        CREATE user 'example_user'@'192.0.2.0' IDENTIFIED BY 'password';
        GRANT SELECT,INSERT,UPDATE,DELETE ON example-db.* TO 'example_user' IDENTIFIED BY 'password';

1. Locate you database's configuration files using the command below. The following command lists the files' default locations. The locations returned by the command may be different than those in the example shown below:

        sudo mysql --help

    {{< output >}}
[...]

Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf ~/.my.cnf

[...]
    {{< /output >}}

1. Using your preferred text editor, locate the `[mysqld]` section and a `bind-address` parameter.

    If you see any `!includedir` parameters in the files, you may also need to check the files in the locations those parameters designate.

1. Once you locate the `bind-address` parameter, change it from the default `127.0.0.1` to `0.0.0.0`. This enables external connections on the database.

    Also, if the file contains a `skip-networking` parameter, comment it out with a `#`.

    {{< file "/etc/mysql/mysql.conf.d/mysqld.conf" >}}
[...]

[mysqld]

[...]

# skip-networking

bind-address = 0.0.0.0

[...]
    {{< /file >}}

1. Restart the MySQL service.

        sudo systemctl restart mysqld

### Access the Database

1. You need to have the MySQL command-line, or CLI tool installed on your local machine to connect to the database. The installation methods below work for both MySQL and MariaDB.

    - If your local machine is running a Linux distribution, you can follow our [How to Install MySQL](/docs/guides/how-to-install-mysql-on-debian-8/) guide.
    - For other distributions, refer to the [official MySQL installation documentation](https://dev.mysql.com/doc/refman/8.0/en/installing.html).

1. Issue the command below from your local machine to connect to the database. Replace `198.51.100.0` with the IP address for your database server.

        mysql -u example_user -p -h 198.51.100.0

    You can also specify the port to connect to the database. This is required if the database server is set up to use anything other than the default port (`3306`).

        mysql -u example_user -p -h 198.51.100.0 -P 3312

1. You can verify your connection using the following command. This command fetches a list of databases that your current user has access to.

        SHOW DATABASES;

    {{< output >}}
+--------------------+
| Database           |
+--------------------+
| example_db         |
| information_schema |
+--------------------+
    {{< /output >}}

## How to Connect to a Database Remotely Using the MySQL Workbench Tool

Follow our [Install MySQL Workbench for Database Administration](/docs/guides/deploy-mysql-workbench-for-database-administration/) guide for steps to install the MySQL Workbench tool on your local machine. This guide also shows you how to connect to a remote database via MySQL Workbench. These steps work whether your target database server is MySQL or MariaDB.

For more information, take a look at the [official MySQL Workbench manual](https://dev.mysql.com/doc/workbench/en/). You may also refer to MariaDB's documentation on [using the MySQL Workbench with MariaDB](https://mariadb.com/products/skysql/docs/clients/third-party/mysql-workbench/).

## Conclusion

Now that you have your remote database connection, you may want to learn more about using MySQL/MariaDB and working with more advanced database operations. You can refer to our extensive [list of MySQL guides](/docs/guides/databases/mysql/?q=mysql) and specific [MariaDB guides](/docs/guides/databases/mariadb/?q=mysql) to build your database management skills.
