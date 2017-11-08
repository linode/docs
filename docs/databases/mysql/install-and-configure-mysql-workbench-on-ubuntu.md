---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows how to install and configure MySQL Workbench and includes a sample MySQL database for testing.'
keywords: ["mysql", "mysql workbench", "mysql sample database"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/mysql-workbench']
modified: 2017-08-08
modified_by:
  name: Linode
published: 2017-08-08
title: 'Install and Configure MySQL Workbench on Ubuntu 16.04'
external_resources:
 - '[MySQL Workbench Manual](https://dev.mysql.com/doc/workbench/en/)'
 - '[Deploy MySQL Workbench for Database Administration](/docs/databases/mysql/deploy-mysql-workbench-for-database-administration)'
---

MySQL Workbench is a feature-rich graphical tool used to model data, build SQL queries, manage MySQL servers, and more. This guide will show you how to install Workbench using the Ubuntu package manager.

![MySQL Workbench](/docs/assets/mysql_workbench_ubuntu.jpg)

## Before You Begin

Update repositories and upgrade if necessary:

    sudo apt update && sudo apt upgrade

## Install MySQL Workbench

Install MySQL Workbench using the APT package manager:

    sudo apt install mysql-workbench

## Run MySQL Workbench

Launch MySQL Workbench from the terminal:

    mysql-workbench

To view more launch options from the command line interface, use the `--help` option:

    /usr/bin/mysql-workbench --help

MySQL Workbench shows this welcome screen on first run:

![MySQL Workbench Welcome Screen](/docs/assets/mysql-workbench-first.png "MySQL Workbench Welcome Screen")

## Configure MySQL Workbench

Use the built-in Workbench Preferences to adjust settings such as targeted MySQL server version, font color, code completion, and others.

To open the preferences, click on `Edit`, then `Preferences` in the main menu:

![MySQL Workbench Preferences](/docs/assets/mysql-workbench-preferences.png "MySQL Workbench Preferences")

## Optional: Load a Sample Database into MySQL Server

See the guide on how to [Install a MySQL server on Ubuntu 14.04](/docs/databases/mysql/install-mysql-on-ubuntu-14-04) or [Debian 8](/docs/databases/mysql/how-to-install-mysql-on-debian-8) for more information on creating or logging into a MySQL server.

1.  Access the MySQL server on your Linode [via SSH](/docs/getting-started#connect-to-your-linode-via-ssh) and download the sample [Sakila database provided in the MySQL documentation](http://downloads.mysql.com/docs/sakila-db.tar.gz):

        wget http://downloads.mysql.com/docs/sakila-db.tar.gz

2.  Decompress the `tar.gz` file:

        tar -xzvf sakila-db.tar.gz

3.  Open MySQL Workbench on your local machine and click `+` to create a new connection:

    ![MySQL Workbench Home](/docs/assets/mysql-workbench-home.png "MySQL Workbench Home")

4.  Create a **Connection Name**. Click the **Connection Method** dropdown menu and select `Standard TCP/IP over SSH`. Complete the credentials for SSH and MySQL user login:

    ![MySQL Workbench Connection](/docs/assets/mysql-workbench-connection.png "MySQL Workbench Connection")

    {{< note >}}
The MySQL server default port should be `3306` on `l27.0.0.1`. If you wish to connect to another server with a different port, update the inputs accordingly. See [Deploy MySQL Workbench for Database Administration](/docs/databases/mysql/deploy-mysql-workbench-for-database-administration) for more information.
{{< /note >}}

5.  Under **File**, select **Run SQL Script...**. Select `sakila-schema.sql` then click **Run**:

    ![MySQL Workbench Script](/docs/assets/mysql-workbench-run-script.png "MySQL Workbench Script")

6.  Repeat Step 5 for `sakila-data.sql`.

7.  Under the `Query1` tab, use the sample query below to see a **Result Grid** of selected data:

        USE sakila;
        SELECT * FROM actors WHERE first_name LIKE 'A%';

    ![MySQL Workbench Query](/docs/assets/mysql-workbench-query.png "MySQL Workbench Query")

The sample database provides a sandbox in which to test configurations and show how to integrate them into your workflow. MySQL Workbench offers a graphical interface to view database models in addition to building queries. While there are plenty of features, free and commercial, lightweight alternatives are available, depending on needs of the user. MySQL Workbench remains a great choice for most database administration tasks.
