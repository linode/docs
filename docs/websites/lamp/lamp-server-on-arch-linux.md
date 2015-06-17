---
author:
    name: Alex Fornuto
    email: afornuto@linode.com
description: 'Creating a LAMP (Linux, Apache, MySQL, PHP) stack on an Arch Linux-powered Linode.'
keywords: 'arch lamp,arch linux lamp,lamp linux,arch linode,archlinux lamp,archlinux,arch,lamp,lamp stack,apache,mysql,php'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['lamp-guides/arch-linux/','lamp-guides/arch-linux-10-2013/']
modified: Tuesday, October 21, 2014
modified_by:
    name: Elle Krout
published: 'Monday, October 7th, 2013'
title: LAMP Server on Arch Linux
external_resources:
 - '[Arch Linux Wiki](http://wiki.ArchLinux.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[Oracle MySQL and MariaDB Comparison](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

A LAMP (Linux, Apache, MySQL, PHP) Stack is a basic web stack you can use to prepare your servers for hosting websites. This guide contains step-by-step instructions for installing a full-featured LAMP stack on an Arch Linux system.

Since Arch does not come in specific versions, this guide is up-to-date as of the June 2015 Arch update.

{: .note }
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname, run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo pacman -Syu

## Install and Configure Apache

1.  Install Apache 2.4:

        sudo pacman -Syu apache

2.  Edit the `httpd-mpm.conf` Apache configuration file in `/etc/httpd/conf/extras/` to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 1GB**:

    {: .note}
    >
    >Before changing any configuration files, it is advised that you make a backup of the file. To make a backup:
    >
    >     cp /etc/httpd/conf/extras/httpd-mpm.conf ~/httpd-mpm.conf.backup

    {: .file }
    /etc/httpd/conf/extra/httpd-mpm.conf
    :   ~~~ conf
        <IfModule mpm_prefork_module>
        StartServers        2
        MinSpareServers     6
        MaxSpareServers     12
        MaxRequestWorkers   30
        MaxRequestsPerChild 3000
        </IfModule>
        ~~~

3. Edit the `httpd-default.conf` file to turn KeepAlive off.

    {: .file }
    /etc/httpd/conf/extra/httpd-default.conf
    :   ~~~ conf
        KeepAlive Off
        ~~~

4.  Set Apache to start at boot, should the server need to be rebooted:

        sudo systemctl enable httpd.service

### Add Name-Based Virtual Hosts

Virtual hosting can be configured so that multiple domains (or subdomains) can be hosted on the server. These websites can be controlled by different users, or by a single user, as you prefer. There are different ways to set up virtual hosts; however, we recommend the method below.

1. Open `httpd.conf` and edit the line `DocumentRoot /srv/http` to define the default document root. Also define the directory:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~
        DocumentRoot "/var/http/default"
        <Directory "/var/http">
        ~~~

2. Uncomment the line that reads `Include  conf/extra/httpd-vhosts.conf` near the end of the `/etc/httpd/conf/httpd.conf` file:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ apache
        Include conf/extra/httpd-vhosts.conf
        ~~~

2. Open `httpd-vhosts.conf`, under `extras`. Edit the example virtual hosts block to resemble the ones below, replacing `example.com` with your domain.

    {: .file-excerpt }
    /etc/httpd/conf/extra/httpd-vhosts.conf
    :   ~~~ conf
        <VirtualHost *:80> 
             ServerAdmin webmaster@example.com
             ServerName example.com
             ServerAlias www.example.com
             DocumentRoot /var/http/example.com/public_html/
             ErrorLog /var/http/example.com/logs/error.log 
             CustomLog /var/http/example.com/logs/access.log combined
                    <Directory />
                       Order deny,allow
                       Allow from all
                    </Directory>
        </VirtualHost>
        ~~~

    Remove the second example in the file, or use it configure a second website.

    {: .note}
    >
    >`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

4.  Create the directories referenced in the configuration above:

        sudo mkdir -p /var/http/default
        sudo mkdir -p /var/http/example.com/public_html
        sudo mkdir -p /var/http/example.com/logs

5.  After you've set up your virtual hosts, issue the following command to run Apache for the first time:

        sudo systemctl start httpd.service

    You should now be able to access your website. If no files are uploaded you will see an *Index of /* page.

    {: .note}
    >
    >Should any additional changes be made to a configuration file restart Apache:
    >
    >       sudo systemctl restart apache


## Install and Configure MySQL

By default, Arch Linux provides MariaDB as a relational database solution. MariaDB is an open source drop-in replacement for MySQL, and all system commands that reference `mysql` are compatible with it.

1.  Install the `mariadb`, `mariadb-clients` and `libmariadbclient` packages:

        sudo pacman -Syu mariadb mariadb-clients libmariadbclient

2.  Install the MariaDB data directory:

        sudo mysql_install_db --user=mysql --basedir=/usr --datadir=/var/lib/mysql

3.  Start MySQL and set it to run at boot:
    
        sudo systemctl start mysqld.service
        sudo systemctl enable mysqld.service
    
4.  Run `mysql_secure_installation`, a program that helps secure MySQL. `mysql_secure_installation` gives you the option to set your root password, disable root logins from outside localhost, remove anonymous user accounts, remove the test database and then reload the privilege tables:

        mysql_secure_installation

### Create a Database

1.  Log into MySQL:

        mysql -u root -p

    `-u <user>` specifies the user, and `-p` will prompt you for the password.

2.  You will see the MariaDB prompt. Create a database and create and grant a user permissions on the database:

        CREATE DATABASE webdata;
        GRANT ALL ON webdata.* TO 'webuser' IDENTIFIED BY 'password';

    In this example `webdata` is the name of the database, `webuser` is the username, and `password` is the user's password. Note that database usernames and passwords do not correlate to system user accounts.

3.  Quit MariaDB:

        quit

With Apache and MySQL installed, you are now ready to move on to installing PHP to provide scripting support for your web application.

## Install and Configuring PHP

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Furthermore, many popular web applications like WordPress are written in PHP. If you want to be able to develop your websites using PHP, you must first install it.

1.  Install PHP:

        sudo pacman -Syu php php-apache

2.  Edit `/etc/php/php.ini` for better error messages and logs, and upgraded performance. These modifications provide a good starting point for a **Linode 1GB**:

    {: .file-excerpt }
    /etc/php/php.ini
    :   ~~~ ini
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        log_errors = On 
        error_log = /var/log/php/error.log
        max_input_time = 30
        extension=mysql.so
        ~~~

    {: .note}
    >
    >Ensure that all lines are uncommented. A commented line begins with a semicolon (**;**).

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown http /var/log/php

4.  Enable the PHP module in the `/etc/httpd/conf/httpd.conf` file by adding the following lines in the appropriate sections:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ conf
        # Dynamic Shared Object (DSO) Support
        LoadModule php5_module modules/libphp5.so
        
        # Supplemental configuration
        # PHP 5
        Include conf/extra/php5_module.conf

        # Located in the <IfModule mime_module>
        AddType application/x-httpd-php .php
        AddType application/x-httpd-php-source .phps
        ~~~
5.  In the same file, comment out the line `LoadModule mpm_event_module modules/mod_mpm_event.so` by adding a `#` in front, and add the line `LoadModule mpm_prefork_module modules/mod_mpm_prefork.so`:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ apache
        #LoadModule mpm_event_module modules/mod_mpm_event.so
        LoadModule mpm_prefork_module modules/mod_mpm_prefork.so
        ~~~

6.  Restart the Apache:

        sudo systemctl restart httpd.service
