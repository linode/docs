---
slug: install-and-configure-mysql-on-ubuntu-22-04
description: 'This guide shows you how to install and configure MySQL server on Ubuntu 20.04 Linux.'
keywords: ['Install MySQL ubuntu 22.04', 'Install MySQL server ubuntu', 'Install MySQL Linux', 'Configure MySQL']
tags: ['mysql', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-29
modified_by:
  name: Linode
title: "Install and Configure MySQL on Ubuntu 22.04"
title_meta: "How to Install and Configure MySQL on Ubuntu 22.04"
external_resources:
- '[MySQL vs MariaDB](https://blog.devart.com/mysql-vs-mariadb.html)'
- '[MariaDB vs MySQL compatibility](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)'
- '[Introduction to Uncomplicated Firewall](https://www.linux.com/training-tutorials/introduction-uncomplicated-firewall-ufw/)'
authors: ["John Mueller"]
---

## How to Install and Configure MySQL on Ubuntu 22.04

Most business applications require access to data, which in turn makes it important to know how to install and manage a Database Management System (DBMS). There are different types of DBMS, but the most popular is the Relational DBMS (RDBMS) which is based on Structured Query Language (SQL). One of the most popular RDBMS is MySQL. This guide explains how to download, and install MySQL Ubuntu 22.04, and set up important configurations.

## The Difference Between MySQL and MariaDB

Before we get started, let's understand the relationship between MySQL and MariaDB through their shared history. MySQL is an open-source RDBMS used for everything from small-scale to large-scale industrial applications. Oracle purchased MySQL in May 1995. However, Oracle’s vision of what MySQL should be fell short of some of MySQL developers' and users' expectations. These developers created MariaDB based on the Community Edition of MySQL and released it in October 2009.

MariaDB is touted as a drop-in replacement for MySQL, but there are differences between the two products. A significant number of features present in MariaDB make the move to the RDBMS a one-way process. Especially, when you plan to use the advanced features without using some sort of special tool to help with the transfer. It also pays to know that [MySQL and MariaDB vary in functionality](https://blog.devart.com/mysql-vs-mariadb.html). For example, MySQL doesn’t support `JSON_EXISTS` or `JSON_QUERY`, and MariaDB lacks support for `JSON_TABLE`. When it comes to SQL support, MySQL provides superior indexing capabilities, while MariaDB supports sequences. The following table provides a quick overview of the significant differences between the two products:


| Feature                                                   | MySQL                   | MariaDB                 |
|-----------------------------------------------------------|-------------------------|-------------------------|
| Underlying development languages                          | C/C++                   | C/C++                   |
| Maturity                                                  | Developed in 1995 so it has a long-term existence. [The server currently has 8K stars and 3.1 forks on GitHub.](https://github.com/mysql/mysql-server) | Developed in 2009 so it’s less mature, especially given the use of additional development languages. [The server currently has 4.4k stars and 1.4k forks on GitHub.](https://github.com/MariaDB/server) |
| Server Operating Systems                                  | [FreeBSD, Linux, OS X, Solaris, and Windows](https://www.mysql.com/support/supportedplatforms/database.html)| [Linux and Windows](https://mariadb.com/docs/deploy/operating-systems/) |
| Compatibility                                             | [MySQL and MariaDB have different views of JSON support.](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/#incompatibilities-between-currently-supported-mariadb-versions-and-mysql) MySQL uses the Internet Engineering Task Force (IETF) [RFC 7159](https://datatracker.ietf.org/doc/html/rfc7159) and [RFC 7396](https://datatracker.ietf.org/doc/html/rfc7396) standards for JSON support.| [Drop-in compatibility with MySQL up to version 5.5.](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/) Since then, new features make MariaDB increasingly incompatible with MySQL, so it’s important to verify compatibility before using MariaDB in an existing application. |
| Linux Distributions that Include as Part of Distribution  | Unknown                 | Some of the most popular Linux distributions [include MariaDB by default](https://mariadb.com/kb/en/distributions-which-include-mariadb/): CentOS, Debian, Fedora, OpenSUSE, and Red Hat Enterprise. |
| Companies Using                                           | [At least 5,878](https://stackshare.io/mysql) companies (not including development firms) currently use MySQL, including Uber, Airbnb, Shopify, Pinterest, Netflix, Amazon, Udemy, and Twitter. | The number of verified companies using MariaDB varies, but [featured customers](https://mariadb.com/resources/customer-stories/) include: Samsung, Virgin Media, Red Hat, Nokia, Select Quote, Tock, Walgreens, Pixid, Development Bank of Singapore (DBS), and Whitebox. |

## Download and Install MySQL Server

The steps in this installation guide are for Ubuntu 22.04 as described at the beginning of the guide. Open a terminal window and log into the system as a user with administrative privileges.

1. Check for any pending updates, with the below command. A message displays at the end, with the number of packages that need to be upgraded.

    ```command
    sudo apt update
    ```

1. In case of any pending updates, upgrade to the latest packages.

    ```command
    sudo apt upgrade
    ```

    - You may see some messages during this process, such as whether the upgrade requires additional disk space. If additional disk space is required, type `Y` and press **Enter** to continue.

    - A progress indicator is shown for each upgrade to keep the user apprised of how the process is going.

    - In case there is a kernel upgrade, reboot your system to reflect the changes after the upgrade.

    - Restart the services with outdated libraries using the GUI screens provided.

1. MySQL 8 is provided as part of the default repositories for Ubuntu 22.04, so installation is easy. Give the below command to install the MySQL server.

    ```command
    sudo apt install mysql-server
    ```

    During the update process, you may be asked questions such as if you want to use additional disk space. Also, a progress indicator is shown as before.

1. At this point, you can verify MySQL's running status with the following command.

    ```command
    sudo service mysql status
    ```

    You should see the output below:

    ```output
    mysql.service - MySQL Community Server
      Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset:>
      Active: active (running) since Sat 2022-07-23 19:12:02 UTC; 1min 2s ago
      Process: 1583 ExecStartPre=/usr/share/mysql/mysql-systemd-start pre (code=e>
      Main PID: 1591 (mysqld)
      Status: "Server is operational"
        Tasks: 37 (limit: 1033)
      Memory: 356.5M
        CPU: 773ms
      CGroup: /system.slice/mysql.service
              └─1591 /usr/sbin/mysqld

        Jul 23 19:12:01 localhost systemd[1]: Starting MySQL Community Server...
        Jul 23 19:12:02 localhost systemd[1]: Started MySQL Community Server.
    ```

1. Once finished viewing the information, type `q` and press **Enter** to exit the command prompt.

### Configure MySQL Using MySQL Installation Script

For a safer MySQL installation, use the `mysql_secure_installation` script to create a secure environment. On Ubuntu, some additional steps are needed to be executed to allow the script to run to completion. Else, there is a risk of getting into a recursive loop while setting the root password that can be exited by closing the terminal window. The following steps show how to setup the root password and run the MySQL script:

1. Launch the MySQL prompt to change its configurations.

    ```command
    sudo mysql
    ```

1. To change the password run the below command. Use single quotes for passwords.

    ```command
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY <Password That Satisfies Password Policy to be Set in Step 5>;
    ```


    After the password has been set, the output is displayed below:

    ```output
    Query OK, 0 rows affected (0.00 sec)
    ```

1. Exit from the previous state to get back to the command prompt.

    ```command
    exit
    ```

1. Launch `mysql_secure_installation` utility. In case the system prompts for the password, enter the password that was set in **Step 2** before proceeding.

    ```command
    sudo mysql_secure_installation
    ```

    A welcome message is displayed on the screen and then the option to install `VALIDATE PASSWORD COMPONENT`. This component verifies that users are relying on strong passwords to log into MySQL, so it’s an important addition to your security suite.

1. Type `Y` and press **Enter** to install the component. If you choose to install `VALIDATE PASSWORD COMPONENT`, go through the following series of sub-steps to install the same:

    - Firstly you need to set the password validation policy, which can be between the range 0 and 3. Here, 0 is for low, 1 for medium, and 2 for strong. Setting a strong password option would be the best option because it requires a password length of at least eight characters and the use of numeric, mixed case, special characters, and words that don’t appear in the dictionary. Enter a numeric value in a valid range.

    - You are either prompted to provide a password for the root user or to change the MySQL root user’s password. When asked for a password, type a password that matches the validation policy set in the previous step and then press **Enter**. You are shown the strength of the password entered with 100 being quite strong. In case you do not wish to change the password, press **Enter** to signify no changes in the MySQL root user’s password.

    - Type `Y` and press **Enter** if you’re happy with the password.

    - Now, you are prompted if you want to remove anonymous users. Type Y and press **Enter** unless you want to allow users without authentication to access your server.

    - Further, you are prompted if you want to disallow remote logins. Remote login access is required to access the MySQL server from outside, so press **Enter** to ensure access to remote login is allowed.

    - Next in the script, it prompts the user to remove the test database. Test database can be helpful during the experimental phase of MySQL. If you wish to remove the test database type `Y` and press **Enter**. Press **Enter** if you want to keep the test database.

    - The next prompt is important because you need to reload the privilege tables for the changes to become permanent and have immediate effect. Type `Y` and press Enter. MySQL is now configured on your system.

1. To directly access MySQL from the command prompt using just the `sudo mysql` command, the first login to MySQL as the root user.

    ```command
    mysql -u root -p
    ```

    You are prompted to enter a password. Once you enter the password, you see the MySQL prompt.

1. Next, modify the root user to give the user access to `auth_socket`, which allows the user to directly login to MySQL using `sudo mysql` command.

    ```command
    ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
    ```

    You see the below output:

    ```output
    Query OK, 0 rows affected (0.00 sec)
    ```

1. Type `exit` and press **Enter**. You are back at the command prompt with the default access to MySQL again.

    ```command
    exit
    ```

### Configure UFW to Allow Traffic to MySQL

Normally, MySQL doesn’t allow remote connections. By default, MySql can only be accessed from the local system. To allow remote access, a configuration change to MySQL and [Uncomplicated Firewall (UFW)](https://www.linux.com/training-tutorials/introduction-uncomplicated-firewall-ufw/) is required. The following steps show you how:

1. Open the MySQL configuration file with the below command.

    ```command
    sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
    ```

    You see the configuration file loaded.

1. Locate the bind-address entry near the top of the file and comment it out. Then comment out the old bind address using `#` and add a new `bind-address` that looks like the following:

    ```command
    #bind-address           = 127.0.0.1
    bind-address            = 0.0.0.0
    ```

1. Restart MySQL.

    ```command
    sudo systemctl restart mysql
    ```

1. Before you can go forward, ensure that the terminal stays connected during the MySQL UFW steps that follow. Observe the next steps for the same.
    - List the applications in UFW. The application of interest is OpenSSH.

        ```command
        sudo ufw app list
        ```

    - Enable OpenSSH on UFW.

        ```command
        sudo ufw allow OpenSSH
        ```

        You see two Rules Updated messages: One for IPv4, and another for IPv6.

        ```output
        Rule added
        Rule added (v6)
        ```

    - Now you can enable UFW. You may see a message stating that your remote terminal connection might be severed. If this happens, you need to reconnect. After you type `Y` and press **Enter**, you see that the firewall is now active.

        ```command
        sudo ufw enable
        ```

    - Check UFW status.

        ```command
        sudo ufw status
        ```

        You should see two messages for the OpenSSH application that say the application is allowed access from anywhere.

        ```output
        ufw status
        Status: active

        To                         Action      From
        --                         ------      ----
        22/tcp                     ALLOW       Anywhere
        22/tcp (v6)                ALLOW       Anywhere (v6)
        ```

1. List the users logged into the server.

    ```command
    sudo who
    ```

    You see a list of users currently logged into the server, including yourself. The output also shows your remote IP address, which is needed for the next step.

1. Allow access from the remote machine to MySQL. This step provides you with remote access to your MySQL setup.

    ```command
    sudo ufw allow 3306
    ```

    Once remote access is successfully enabled, you should see the following output:

    ```output
    Rule updated
    ```

1. Check UFW status using the below command. You should see the output that OpenSSH allows access from anywhere and that port `3306` (for MySQL) allows access from your specific remote login address.

    ```command
    sudo ufw status
    ```

1. To access MySQL from the remote server, type the command below and press **Enter**:

    ```command
    mysql -u user -h <database_server_ip> -p
    ```

## Conclusion

One of the biggest takeaways, from this guide, is that both MySQL, and MariaDB provide enterprise-level database functionality. Each has its specialization. Installing either product is relatively easy using the Package Manager. When installing MySQL, take additional steps when working with the [MySQL Installation Script](/docs/guides/install-and-configure-mysql-on-ubuntu-22-04/#configure-mysql-using-mysql-installation-script) script. If the script fails recursively, then you are required to end your terminal session and log back in. Making the required alterations to the MySQL setup (as shown in this guide) gets the script working again and you can complete it. Remote access to MySQL setup requires that you configure MySQL to allow remote login and then set up UFW as well.
