---
author:
  name: Linode
  email: docs@linode.com
description: 'Quick start on installing MySQL Workbench and setting up a database connection'
keywords: ''
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['databases/mysql/mysql-workbench']
modified: Wednesday, August 2nd, 2017
modified_by:
  name: Linode
published: 'Wednesday, August 2nd, 2017'
title: 'Install and Configure MySQL Workbench on Ubuntu 16.04'
external_resources:
 - '[MySQL Workbench Manual](https://dev.mysql.com/doc/workbench/en/)'
 - '[Deploy MySQL Workbench for Database Administration](/docs/databases/mysql/deploy-mysql-workbench-for-database-administration)'
---

MySQL Workbench is a feature-rich graphical tool used to model data, build SQL queries, manage MySQL servers, and much more. This guide will show how to install through the package manager or by compiling the source code. There are optional steps for creating a database connection to a Linode and testing configurations with a sample database.

## Before You Begin

1.  Update repositories and upgrade if needed.

         sudo apt update
         sudo apt upgrade

## Install MySQL Workbench

### Using Package Manager

1.  MySQL Workbench can be installed using the APT package manager.

        sudo apt install mysql-workbench

### Compiling From Source

1.  Download the debian package from [here](https://dev.mysql.com/downloads/workbench/).

2.  Nagivate to the directory containing the downloaded debian package then install using:

        sudo dpkg -i mysql-workbench-community-6.3.9-1ubuntu16.04-amd64.deb

    {: .note}
    >
    >Installation through a package manager is recommended because it resolves dependencies automatically. Compiling from source is useful if you are installing a newer version not yet available in your package manager's repositories.

## Running MySQL Workbench

There are two ways to run MySQL Workbench. The first way is to open the launcher and double click the `MySQL Workbench` icon. Starting MySQL Workbench for the first time will display this screen:

![MySQL Workbench First](/docs/assets/mysql-workbench-first.png)

The second method through the command line interface shows all the available options by running:

       /usr/bin/mysql-workbench --help

## Configurations

Click on `Edit` > `Preferences`. This opens a `Workbench Preferences` window allowing changes such as font colors, code completion, targeted MySQL server version, and saving upon opening/closing the editor.

![MySQL Workbench Preferences](/docs/assets/mysql-workbench-preferences.png)

## Optional: Load a Sample Database into MySQL Server

This step assumes having an existing MySQL server on a Linode and access through SSH. See [this guide on how to install MySQL server](/docs/databases/mysql/install-mysql-on-ubuntu-14-04) for more information.

1.  SSH into your Linode and download the sample [Sakila database provided in the MySQL documentation](http://downloads.mysql.com/docs/sakila-db.tar.gz):

        wget http://downloads.mysql.com/docs/sakila-db.tar.gz

2.  Uncompress the `tar.gz` file with the following command:

        tar -xzvf sakila-db.tar.gz

3.  On your local machine, navigate to MySQL Workbench then click `+` to create a new connection.

    ![MySQL Workbench Home](/docs/assets/mysql-workbench-home.png)

4.  Create a **Connection Name**. Using the dropdown menu for **Connection Method**, select `Standard TCP/IP over SSH`. Complete the credentials for SSH and MySQL user login.

    ![MySQL Workbench Connection](/docs/assets/mysql-workbench-connection.png)

    {: .note}
    >
    >The MySQL server default port should be 3306 on `l27.0.0.1`. If you wish to connect to another server with a different port, update the inputs accordingly. See [Deploy MySQL Workbench for Database Administration](/docs/databases/mysql/deploy-mysql-workbench-for-database-administration) for more information.

5.  Under `File`, select `Run SQL Script...`. Select `sakila-schema.sql` then click **Run**..

    ![MySQL Workbench Script](/docs/assets/mysql-workbench-run-script.png)

6.  Repeat again for `sakila-data.sql`.

7.  Under the `Query1` tab, use the sample query below to see a **Result Grid** of selected data;

        USE sakila;
        SELECT * FROM actors WHERE first_name LIKE 'A%';

    ![MySQL Workbench Query](/docs/assets/mysql-workbench-query.png)

The sample database provides a sandbox to test out configurations and integrating them into your workflow. MySQL Workbench offers a graphical interface to view database models in addition to building queries. While there are a lot of features, there are free and commercial lightweight alternatives available depending on needs of the user. 



