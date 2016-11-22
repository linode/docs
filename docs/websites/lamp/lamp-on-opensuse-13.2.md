---
author:
    name: Jake Macek
    email: docs@linode.com
description: 'Create a LAMP stack on a OpenSUSE 13.2.'
keywords: 'LAMP,OpenSUSE,OpenSUSE 13.2,apache,mysql,php,opensuse lamp'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
title: LAMP on OpenSUSE 13.2
alias: ['websites/lamp/lamp-on-opensuse-13.2/']
external_resources:
 - '[OpenSUSE Linux Home Page](https://www.opensuse.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

A LAMP (Linux, Apache, MySQL, PHP) stack is a common web stack used for hosting web content. This guide shows you how to install a LAMP stack on an OpenSUSE 13.2 server.

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

        sudo zypper refresh


## Apache

### Install and Configure

1.  Install Apache 2.4:

        sudo zypper install httpd

2.  Edit `httpd.conf` and add the code below to turn off KeepAlive and adjust the resource use settings. The settings shown below are a good starting point for a **Linode 1GB**:

    {: .note}
    >
    >Before changing any configuration files, it is advised that you make a backup of the file. To make a backup:
    >
    >     cp /etc/apache2/httpd.conf ~/httpd.conf.backup

    {: .file-excerpt }
    /etc/apache2/httpd.conf
    :   ~~~ conf
        KeepAlive Off


        <IfModule prefork.c>
            StartServers        2
            MinSpareServers     6
            MaxSpareServers     12
            MaxClients          80
            MaxRequestsPerChild 3000
        </IfModule>
        ~~~

    These settings can also be added to a separate file if so desired. The file must be located in the `conf.module.d` or `conf` directories, and must end in `.conf`.


### Configure Name-based Virtual Hosts

There are different ways to set up virtual hosts; however, the method below is recommended.

1.  Within the `conf.d` directory create `vhost.conf` to store your virtual host configurations. The example below is a template for website `example.com`; change the necessary values for your domain:

    {: .file-excerpt }
    /etc/apache2/conf.d/vhost.conf
    :   ~~~ conf
        NameVirtualHost *:80

        <VirtualHost *:80>
            ServerAdmin webmaster@example.com
            ServerName example.com
            ServerAlias www.example.com
            DocumentRoot /srv/www/example.com/public_html/
            ErrorLog /srv/www/example.com/logs/error.log
            CustomLog /srv/www/example.com/logs/access.log combined
            <Directory /srv/www/example.com/public_html>
                Options Indexes FollowSymLinks
                AllowOverride All
                Require all granted
            </Directory>
        </VirtualHost>
        ~~~

    Additional domains can be added to the `vhost.conf` file as needed.

    {: .note}
    >
    >`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

2.  Create the directories referenced above:

        sudo mkdir -p /srv/www/example.com/public_html
        sudo mkdir /srv/www/example.com/logs

3.  Enable Apache to start at boot, and restart the service for the above changes to take place:

        sudo systemctl enable apache2.service
        sudo systemctl restart apache2.service

    You can now visit your domain to test the Apache server; a default Apache page will be visible.

    {: .note}
    >
    >Anytime you change an option in your `vhost.conf` file, or any other Apache configuration file, remember to reload the configuration with the following command:
    >
    >     sudo service apache2 reload

## MySQL / MariaDB

### Install and Configure

MySQL is replaced with MariaDB in OpenSUSE 13.2. MariaDB is a popular drop-in replacement for MySQL.

{: .note }
>
> If you prefer to use the MySQL branded database in OpenSUSE 13.2, you will need to add the required repositories by issuing the following commands:
>
>     sudo rpm -Uvh http://dev.mysql.com/get/mysql57-community-release-sles12-7.noarch.rpm

1.  Install the MariaDB-server and mariadb-tools package:

        sudo zypper in mariadb mariadb-tools

2.  Set MariaDB to start at boot and start the daemon for the first time:

        sudo systemctl enable mysql.service
        sudo systemctl start mysql.service

3.  Run `mysql_secure_installation` to secure MariaDB. The default password is blank. You will be given the option to change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases and reload privileges. It is recommended that you answer yes to these options:

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


## PHP

###  Install and Configure

1.  Install PHP:

        sudo zypper install php php-pear apache2-mod_php5

    If you wish to install MySQL support for PHP also install the `php-mysql` package:

        sudo zypper install php-mysql


2.  Edit `/etc/php5/apache2/php.ini` for better error messages and logs, and upgraded performance. These modifications provide a good starting point for a **Linode 1GB**:

    {: .file-excerpt }
    /etc/php5/apache2/php.ini
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
        sudo chown wwwrun /var/log/php

4.  Reload Apache:

        sudo systemctl reload apache2.service
