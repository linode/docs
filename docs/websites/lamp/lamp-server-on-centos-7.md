---
author:
    name: Joel Kruger
    email: docs@linode.com
description: 'Creating a LAMP stack on a CentOS 7 Linode.'
keywords: 'LAMP,CentOS,CentOS 7,apache,mysql,php'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, June 26th, 2015
modified_by:
    name: Elle Krout
published: 'Tuesday, January 13th, 2015'
title: LAMP Server on CentOS 7
external_resources:
 - '[CentOS Linux Home Page](http://www.centos.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[MariaDB Documentation](https://mariadb.com/kb/en/mariadb/documentation/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

A LAMP (Linux, Apache, MySQL, PHP) stack is a common web stack used to prepare servers for hosting web content. This guide provides step-by-step instructions for installing a full-featured LAMP stack on a CentOS 7 system.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo yum update


## Install and Configure Apache

1.  Install Apache 2.4:

        sudo yum install httpd

2.  Edit `httpd.conf` and add the code below to turn off KeepAlive and adjust the resource use settings. The settings shown below are a good starting point for a **Linode 1GB**:

    {: .note}
    >
    >Before changing any configuration files, it is advised that you make a backup of the file. To make a backup:
    >
    >     cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ conf
        KeepAlive Off

        ...

        <IfModule prefork.c>
            StartServers        2
            MinSpareServers     6
            MaxSpareServers     12
            MaxClients          80
            MaxRequestsPerChild 3000
        </IfModule>
        ~~~

    These settings can also be added to a seperate file if so desired. The file must be located in the `conf.module.d` or `conf` directories, and must end in `.conf`.


### Configure Name-based Virtual Hosts

There are different ways to set up virtual hosts; however, the method below is recommended.

1.  Within the `conf.d` directory create `vhost.conf` to store your virtual host configurations. The example below is a template for website `example.com`; change the necessary values for your domain:

    {: .file-excerpt }
    /etc/httpd/conf.d/vhost.conf
    :   ~~~ conf
        NameVirtualHost *:80
        
        <VirtualHost *:80>
            ServerAdmin webmaster@example.com
            ServerName example.com
            ServerAlias www.example.com
            DocumentRoot /var/www/example.com/public_html/
            ErrorLog /var/www/example.com/logs/error.log
            CustomLog /var/www/example.com/logs/access.log combined
        </VirtualHost>
        ~~~

    Additional domains can be added to the `vhost.conf` file as needed.

    {: .note}
    >
    >`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

2.  Create the directories referenced above:

        sudo mkdir -p /var/www/example.com/public_html
        sudo mkdir /var/www/example.com/logs

3.  Enable Apache to start at boot, and restart the service for the above changes to take place:

        sudo systemctl enable httpd.service
        sudo systemctl restart httpd.service

    You can now visit your domain to test the Apache server; a default Apache page will be visible.


## Install and Configure MySQL/MariaDB

MySQL is replaced with MariaDB in CentOS 7. MariaDB is a popular drop-in replacement for MySQL.

{: .note }
>
> If you prefer to use the MySQL branded database in CentOS 7, you will need to add the required repositories by issuing the following command:
>
>     sudo yum install http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm

1.  Install the MariaDB-server package:

        sudo yum install mariadb-server

2.  Set MariaDB to start at boot and start the daemon for the first time:

        sudo systemctl enable mariadb.service
        sudo systemctl start mariadb.service

3.  Run `mysql_secure_installation` to secure MariaDB. You will be given the option to change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases and reload privileges. It is recommended that you answer yes to these options:

        mysql_secure_installation



### Create a MySQL/MariaDB Database

1.  Log in to MariaDB:

        mysql -u root -p

    Enter MariaDB’s root password. You will get the MariaDB prompt.

2.  Create a new database and user with permissions to use it:

        create database webdata;
        grant all on webdata.* to 'webuser' identified by 'password';

    In the above example `webdata` is the name of the database, `webuser` the user, and `password` a strong password.

5.  Exit MariaDB

        quit

With Apache and MariaDB installed, you are now ready to move on to installing PHP to provide scripting support for your web pages.


## Installing and Configuring PHP

1.  Install PHP:

        sudo yum install php php-pear

    If you wish to install MySQL support for PHP also install the `php-mysql` package:

        sudo yum install php-mysql


2.  Edit `/etc/php/php.ini` for better error messages and logs, and upgraded performance. These modifications provide a good starting point for a **Linode 1GB**:

    {: .file-excerpt }
    /etc/php.ini
    :   ~~~ ini
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        error_log = /var/log/php/error.log
        max_input_time = 30
        ~~~

    {: .note}
    >
    >Ensure that all lines noted above are uncommented. A commented line begins with a semicolon (**;**).

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown apache /var/log/php

4.  Reload Apache:

        sudo systemctl reload httpd