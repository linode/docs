---
author:
  name: Linode
  email: docs@linode.com
title: "Connect to a MySQL Database"
description: "Learn how to connect to a MySQL Managed Databse through the command line or MySQL Workbench."
---

To connect to a MySQL Managed Database, you need to know a few important details, such as the username, password, and host (or IP). You'll also need a MySQL client. This guide details how to access your database using popular tools.

## View Connection Details

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Databases** from the left navigation menu.

1. Select your Managed Database from the list. This opens the detail page for that database cluster.

The *Database Details* section contains information and credentials needed for you to connect to your database.

- **Username:** The default user for all Managed Databases is `linroot`, which has superuser admin privileges. This replaces the `root` user, which is not accessible.
- **Password:** The randomly generated password for your database cluster. See [Reset Root Password](/docs/products/databases/managed-databases/guides/reset-root-password/) if you wish to change it.
- **Host:** The fully qualified domain name you can use to reach your database cluster.
- **Port:** The default port for your database is `3306`.

## Connect Using MySQL (CLI)

To connect direct to the database from a command-line, you can use the `mysql` tool. This tool is typically not available by default on most operating systems, but is included along with many MySQL clients (and servers)

1.  Make sure the IP address assigned to your system is included within your database's access controls. If not, add it now. See [Manage Access Controls](/docs/products/databases/managed-databases/guides/manage-access-controls/).

1.  Verify that the `mysql` tool is installed on your system by running the following command:

        mysql --version

    If it is not installed, follow the steps for your operating system under [Install a MySQL Client](#install-a-mysql-client).

1.  Use the `mysql` command below to connect to your database, replacing `[host]` and `[username]` with the corresponding values in the [Connection Details](#view-connection-details) section.

        mysql --host=[host] --user=[username] --password

1.  Enter your password at the prompt.

Once you are connected successfully, the MySQL prompt appears and you can enter SQL queries. See [An Overview of MySQL](/docs/guides/an-overview-of-mysql/#the-sql-language) for examples.

See [How to Connect to a MySQL or MariaDB Database](/docs/guides/connect-to-a-mysql-or-mariadb-database/) for more information or reference [Connecting to the MySQL Server Using Command Options](https://dev.mysql.com/doc/refman/8.0/en/connecting.html) within MySQL's own documentation.

### Install a MySQL Client

If you do not currently have a MySQL command-line client installed on your system, follow the instructions below to install it one.

-   **Ubuntu and Debian:**

        sudo apt install mysql-client

-   **CentOS Stream 9 (and 8), CentOS/RHEL 8 (including AlmaLinux 8 and RockyLinux 8):**

        sudo dnf install mysql

-   **CentOS/RHEL 7:**

        sudo yum install mysql

-   **Fedora:**

        sudo dnf install community-mysql

## Connect Using MySQL Workbench (GUI)

The MySQL Workbench provides a graphical interface for connecting to MySQL databases. Using this tool, you can visualize your database, its structure, and the data it contains.

1. Install the MySQL Workbench software from the [MySQL Community Downloads](https://dev.mysql.com/downloads/workbench/) page. Be sure to select the operating system you're using locally.

1. Open the software and select **Database > Manage Connections** from the menu. This displays the **Manage Server Connections** window.

1. Enter the details for your connection, including the **Hostname**, **Username**, and **Port**. The rest of the settings can remain as the defaults, including **Use SSL** (set to *If available*). You can optionally store your password by clicking the **Store in Keychain...** button and entering your password or, more recommended, do not store your password and enter it manually each time you connect.

1. Click **Test Connection** to verify you can successfully connect to the database and then click **Close** to store the connection settings and return to the main screen.

1. To connect to the database, select **Database > Connect to Database** from the main menu. In the following screen, select the stored connection you just created and click **OK**.

For instructions on using MySQL Workbench to interact with your database, see [Install MySQL Workbench for Database Administration](/docs/guides/deploy-mysql-workbench-for-database-administration/#creating-and-populating-databases) or look through the [MySQL Workbench Manual](https://dev.mysql.com/doc/workbench/en/).
