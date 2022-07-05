---
slug: mysql-command-line-client
author:
  name: Linode
description: "This guide shows you how to install and use the MySQL command-Line client to connect to a database and run SQL commands."
keywords: ['mysql connect','remote database','mysql database']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-01
modified: 2022-07-01
modified_by:
  name: Linode
title: "Connect to a MySQL Database Using the mysql Command"
aliases: ['/guides/connect-to-a-mysql-or-mariadb-database/']
external_resources:
- '[MySQL Command-Line Client documentation](https://dev.mysql.com/doc/refman/8.0/en/mysql.html)'
---

This guide shows you how to connect to a MySQL database using [mysql](https://dev.mysql.com/doc/refman/8.0/en/mysql.html), the MySQL command-line client. This opens up a simple SQL shell environment, allowing you to perform [SQL queries and commands](/docs/guides/sql-commands/) on your database. If you require more advanced capabilities, consider using the [MySQL Shell](https://dev.mysql.com/doc/mysql-shell/8.0/en/).

{{< note >}}
If you wish to connect to a Linode MySQL Managed Database, review the [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/mysql-connect/) guide instead.
{{</ note >}}

## Before You Begin

- **Obtain the connection details for the MySQL instance you wish to use.** If you do not have a MySQL instance yet, you can [create a Managed Database](https://www.linode.com/products/mysql/), [deploy the MySQL Marketplace App](https://www.linode.com/marketplace/apps/linode/mysql-mariadb/), or [install MySQL server (or MariaDB) on a Compute Instance](/docs/guides/install-mysql/). **This instance must allow remote connections or you must run the mysql command from within same system.**

-   **Ensure mysql is installed and is compatible with the MySQL version on your database server.** Run the following command on the system you intend on using to verify that mysql is installed.

        mysql --version

    This should inform you which version you are using. If the command is not found or you are not on a compatible version, see the [Installing MySQL](/docs/guides/install-mysql/) guide.

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## General mysql Syntax

The main purpose of the mysql utility is to connect to a MySQL database server and open a simple SQL shell environment. The mysql command can be used to connect to either a *local* or *remote* database server. In the commands provided below, see the [Common Command Options](#common-command-options) for information on each of the available options.

-   **Local database server**: Use this command when connecting to a MySQL Server instance running on the same machine you are using.

        mysql -u [username] -p

-   **Remote database server**: In many cases, the database server is not on the same system you are using. In these cases, you can SSH in to the remote system (if permitted) and run the command above to connect to a local MySQL instance. Alternatively, you can use the mysql command to remotely connect to the database. If your MySQL server does not allow remote connections or your user cannot connect remotely, see [Configure the Database Server to Allow Remote Connections](#configure-the-database-server-to-allow-remote-connections).

        mysql -h [host] -p [port] -u [username] -p

    {{< note >}}
If you wish to connect to a Linode MySQL Managed Database, review the [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/mysql-connect/) guide instead.
{{</ note >}}

## Common Command Options

The following list is a collection of common options used with the mysqldump command. At minimum, the username and password is required. When connecting to a remote database server, the host (and perhaps the port) should be provided. For a full list of available options, reference the [Command Options for Connecting to the Server](https://dev.mysql.com/doc/refman/8.0/en/connection-options.html) documentation.

- **Username** (`--user=[]` or `-u []`): The username of your MySQL user. This user must have proper grants to access the database.

- **Password** (`--password=[]` or `-p[]`): Specifies that the user's password is required for the connection. The password can be entered directly in the command itself (though that is not recommended due to security concerns) or the password can be omitted (by just using the `--password` option with no value). In the password is omitted, mysql prompts you for the password before connecting to the database. For more details about password security, see MySQL's [End-User Guidelines for Password Security](https://dev.mysql.com/doc/refman/8.0/en/password-security-user.html).

- **Host** (`--host=[]` or `-h []`): The IP address or FQDN (fully qualified domain name) of the remote database server. You can omit this option from the command if you are connecting to a local MySQL instance on your same system.

- **Port** (`--port=[]` or `-P []`): The port number of that the MySQL database instance uses. This can be omitted if your MySQL instance uses the default port of `3306`.

- **SSL Settings** (`--ssl-mode`): This controls if the connection should be encrypted. This can be set to `DISABLED` (unencrypted - not recommended), `PREFERRED` (tries an encrypted connection first before falling back to unencrypted), or `REQUIRED` (fails if an encrypted connection can't be established. If omitted, this option is automatically set to `PREFERRED`. You can also set this to `VERIFY_CA` or `VERIFY_IDENTITY` to require an encrypted connection and either verify the CA certificate or both verify the CA certificate and the host name identity.

If you are frequently connecting to the same database, you can securely store many of these options (including the password). See the [Securely Storing Credentials](/docs/guides/securely-store-mysql-credentials/) guide. Other options can be stored in an [option file](https://dev.mysql.com/doc/refman/8.0/en/option-files.html).

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
