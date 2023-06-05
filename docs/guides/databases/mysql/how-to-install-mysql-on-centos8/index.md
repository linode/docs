---
slug: how-to-install-mysql-on-centos8
description: 'Learn how to install MySQL on CentOS 8 Linux on a cloud server with cloud apps.'
keywords: ['Install MySQL on CentOS 8', 'Install MySQL on CentOS Stream 8', 'Install MySQL', 'CentOS 8', 'Connect MySQL to CentOS 8', 'Install MySQL server in Linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-11
modified_by:
  name: Linode
title: "How to Install MySQL on CentOS 8"
title_meta: "Installing MySQL on CentOS 8"
external_resources:
- '[MySQL vs MariaDB](https://blog.devart.com/mysql-vs-mariadb.html)'
- '[MariaDB vs MySQL compatibility](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)'
- '[Introduction to Uncomplicated Firewall](https://www.linux.com/training-tutorials/introduction-uncomplicated-firewall-ufw/)'
authors: ["John Mueller"]
---

## How to Install MySQL on CentOS Stream 8

Most business applications require access to data, which in turn makes it important to know how to install and manage a Database Management System (DBMS). There are different types of DBMS, but the most popular is the Relational DBMS (RDBMS) which is based on Structured Query Language (SQL). One of the most popular RDBMS is MySQL. This guide explains how to download, and install MySQL on CentOS Stream 8, and set up important configurations.


## The Difference Between MySQL and MariaDB

Before we get started, understand the relationship between MySQL and MariaDB through their shared history. MySQL is an open-source RDBMS used for everything from small-scale to large-scale industrial applications. Oracle purchased MySQL in May 1995. However, Oracle’s vision of what MySQL should be fell short of some of MySQL developers' and users' expectations. These developers created MariaDB based on the Community Edition of MySQL and released it in October 2009.

MariaDB is touted as a drop-in replacement for MySQL, but there are differences between the two products. A significant number of features present in MariaDB make the move to the RDBMS a one-way process. Especially, when you plan to use the advanced features without using some sort of special tool to help with the transfer. It also pays to know that [MySQL and MariaDB vary in functionality](https://blog.devart.com/mysql-vs-mariadb.html). For example, MySQL doesn’t support `JSON_EXISTS` or `JSON_QUERY`, and MariaDB lacks support for `JSON_TABLE`. When it comes to SQL support, MySQL provides superior indexing capabilities, while MariaDB supports sequences. The following table provides a quick overview of the significant differences between the two products:

| Feature                                                   | MySQL                   | MariaDB                 |
|-----------------------------------------------------------|-------------------------|-------------------------|
| Underlying development languages                          | C/C++                   | C/C++                   |
| Maturity                                                  | Developed in 1995 so it has a long-term existence. [The server currently has 8K stars and 3.1 forks on GitHub.](https://github.com/mysql/mysql-server) | Developed in 2009 so it’s less mature, especially given the use of additional development languages. [The server currently has 4.4k stars and 1.4k forks on GitHub.](https://github.com/MariaDB/server) |
| Server Operating Systems                                  | [FreeBSD, Linux, OS X, Solaris, and Windows](https://www.mysql.com/support/supportedplatforms/database.html)| [Linux and Windows](https://mariadb.com/docs/deploy/operating-systems/) |
| Compatibility                                             | [MySQL and MariaDB have different views of JSON support.](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/#incompatibilities-between-currently-supported-mariadb-versions-and-mysql) MySQL uses the Internet Engineering Task Force (IETF) [RFC 7159](https://datatracker.ietf.org/doc/html/rfc7159) and [RFC 7396](https://datatracker.ietf.org/doc/html/rfc7396) standards for JSON support.| [Drop-in compatibility with MySQL up to version 5.5.](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/) Since then, new features make MariaDB increasingly incompatible with MySQL, so it’s important to verify compatibility before using MariaDB in an existing application. |
| Linux Distributions that include as part of Distribution  | Unknown                 | Some of the most popular Linux distributions [include MariaDB by default](https://mariadb.com/kb/en/distributions-which-include-mariadb/): CentOS, Debian, Fedora, OpenSUSE, and Red Hat Enterprise. |
| Companies Using                                           | [At least 5,878](https://stackshare.io/mysql) companies (not including development firms) currently use MySQL, including Uber, Airbnb, Shopify, Pinterest, Netflix, Amazon, Udemy, and Twitter. | The number of verified companies using MariaDB varies, but [featured customers](https://mariadb.com/resources/customer-stories/) include: Samsung, Virgin Media, Red Hat, Nokia, Select Quote, Tock, Walgreens, Pixid, Development Bank of Singapore (DBS), and Whitebox. |


## Download and Install MySQL Server

The steps in this section detail installing MySQL on [CentOS Stream 8](https://linuxhint.com/what_is_centos_stream/). The process also works well with the older, and now deprecated, CentOS 8. The goal is to connect MySQL to CentOS 8, no matter what form it takes. Ultimately, you install MySQL server on Linux using the following steps:

1. Update the system using the command below:

    ```command
    sudo dnf update
    ```

    A message displays at the end with the number of packages that need to be upgraded.

    -  You may see some messages during the update process, such as whether the upgrade requires additional disk space. If additional disk space is required, type `Y` and press **Enter** to continue.

    -  A progress indicator is shown for each upgrade to keep the user apprised of how the process is going.

    -  In case there is a kernel upgrade, reboot your system to reflect the changes after the upgrade.

    -  Restart the services with outdated libraries using the GUI screens provided.

1. Perform required package upgrades to keep the system up to date.

    ```command
    sudo dnf upgrade
    ```

    During the update process, you may be asked questions such as if you want to use additional disk space. Also, a progress indicator is shown anytime the system performs an upgrade. Mostly, you see a message telling you that the upgrades completed at the same time as the updates, so there is nothing to upgrade.

1.	MySQL 8 is conveniently provided as part of the default repositories for CentOS Stream 8. You can directly run the command for MySQL set up as below.

    ```command
    sudo dnf install @mysql
    ```

    As with the update process, you are asked questions like whether you want to use additional disk space and also see the progress indicator.

1. Start the MySQL server using the command below:

    ```command
    sudo systemctl start mysqld.service
    ```

1. Verify the status of MySQL 8.0.

    ```command
    sudo systemctl status mysqld
    ```

    You see output similar to that shown below:

    ```output
    mysqld.service - MySQL 8.0 database server
      Loaded: loaded (/usr/lib/systemd/system/mysqld.service; disabled; vendor preset: disabled)
      Active: active (running) since Fri 2022-07-29 15:53:50 UTC; 52s ago
      Process: 29625 ExecStartPost=/usr/libexec/mysql-check-upgrade (code=exited, status=0/SUCCESS)
      Process: 29501 ExecStartPre=/usr/libexec/mysql-prepare-db-dir mysqld.service (code=exited, status=0/SUCCESS)
      Process: 29477 ExecStartPre=/usr/libexec/mysql-check-socket (code=exited, status=0/SUCCESS)
    Main PID: 29581 (mysqld)
      Status: "Server is operational"
        Tasks: 38 (limit: 4921)
      Memory: 456.1M
      CGroup: /system.slice/mysqld.service
              └─29581 /usr/libexec/mysqld --basedir=/usr

    Jul 29 15:53:37 172-105-17-53.ip.linodeusercontent.com systemd[1]: Starting MySQL 8.0 database server...
    Jul 29 15:53:37 172-105-17-53.ip.linodeusercontent.com mysql-prepare-db-dir[29501]: Initializing MySQL database
    Jul 29 15:53:50 172-105-17-53.ip.linodeusercontent.com systemd[1]: Started MySQL 8.0 database server.
    ```

1. Allow MySQL 8 to automatically start every time you reboot your server using the command below:

    ```command
    sudo systemctl enable mysqld
    ```

    Your MySQL server is now ready to use.

## Configure MySQL Using MySQL Installation Script

For a safer MySQL installation, use the `mysql_secure_installation` script to create a secure environment. The following steps show you how:

1. Run `mysql_secure_installation` script. You may be asked to provide the `root` password.

    ```command
    sudo mysql_secure_installation
    ```

    A welcome message is displayed on the screen and then the option to install `VALIDATE PASSWORD COMPONENT`. This component verifies that users are relying on strong passwords to log into MySQL, so it’s an important addition to your security suite.

1. Type `Y` and press **Enter** to install the component. If you choose to install `VALIDATE PASSWORD COMPONENT`, go through the following series of sub-steps to install the same:

    -  Firstly you need to set the password validation policy. Here, `0` is for low, `1` for medium, and `2` for strong. Setting a strong password option is the best option because it requires a password length of at least eight characters and the use of numeric, mixed case, special characters, and words that don’t appear in the dictionary. Enter a numeric value in a valid range of `0` and `3`, then press `Enter`.

    -	Enter the `root` user password. Type a password that matches the validation policy you set and press **Enter**. You are shown the strength of the password you entered, with 100 being quite strong. In case you do not wish to change the password, press **Enter** to signify no changes in the MySQL `root` user’s password.

    -	Type `Y` and press **Enter** if you’re happy with the password.

    - Now, you are prompted if you want to remove anonymous users. Type `Y` and press **Enter** unless you want to allow users without authentication to access your server.

    - Further, you are prompted if you want to disallow remote logins. Remote login access is required to access the MySQL server from outside, so press **Enter** to signify no.

    - Next in the script, it prompts the user to remove the test database. The test database can be helpful during the experimental phase of MySQL. If you wish to remove the test database type `Y` and press **Enter**. Press **Enter** if you want to keep the test database.

    - The next prompt is important because you need to reload the privilege tables for the changes to become permanent and have immediate effect. Type `Y` and press **Enter**. MySQL is now configured.

## Start, Stop, and Restart MySQL on CentOS Stream 8

As you work with MySQL on CentOS Stream 8, ensure that the server is in the expected state. Check the status of the MySQL server using the command below:

```command
sudo systemctl status mysqld
```

The output shows MySQL as started and enabled. The following is a list of helpful commands to start, stop, and restart MySQL as needed:

-	**Start MySQL server**:

```command
sudo systemctl start mysqld.service
sudo systemctl enable mysqld
```

-	**Stop MySQL server**:

```command
sudo systemctl stop mysqld.service
sudo systemctl disable mysqld
```

-	**Restart MySQl server**:

```command
sudo systemctl restart mysqld.service
```

## Test the Installation

To run a quick test of your MySQL installation, run the below command to verify the service runtime status.

```command
sudo systemctl status mysqld
```

Then, perform the following checks:

1. **Check MySQL version**: Use the command below to check the version of MySQL installed. You are asked for the password that you created earlier. If the entered password is successful, you see information about your version of MySQL.

    ```command
    mysqladmin -u root -p version
    ```

1. **Access MySQL server**: You can access the MySQL server with the following sub-steps:

      -	Login to MySQL as the `root` user. Provide the root user password when prompted.

      ```command
      mysql -u root -p
      ```

      -	Create a database named `Test` in MySQL server.

      ```command
      CREATE DATABASE Test;
      ```

      {{< note >}}
Don’t forget the semicolon at the end of the command.
      {{< /note >}}

      MySQL gives the following output:

      ```output
      Query OK, 1 rows affected (0.00 sec)
      ```

      -	To check the list of current databases, which includes the ``Test`` database, on MySQL, run the command below:

      ```command
      SHOW DATABASES;
      ```

      -	To remove a database from the server, run the command below:

      ```command
      DROP DATABASE Test;
      ```

      -	Again, check the list of databases present on the MySQL server. Now you have the latest list of available databases. You see `Test` database deleted in the previous step is missing from the list.

      ```command
      SHOW DATABASES;
      ```

      -	Exit MySQL and return to the terminal prompt.

      ```command
      EXIT
      ```

## Conclusion

One of the biggest takeaways is that both MySQL and MariaDB provide enterprise-level database functionality. Each has its specialization. Installing either product is relatively easy using the Package Manager. When installing MySQL, take additional steps when working with the [MySQL installation script](/docs/guides/how-to-install-mysql-on-centos8/#configure-mysql-using-mysql-installation-script). Remote access to MySQL setup requires that you configure MySQL to allow remote login and then set up UFW as well.
