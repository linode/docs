---
author:
  name: Linode
  email: docs@linode.com
description: 'Configuring a LAMP stack with Apache, MySQL, PHP and on Ubuntu 14.04 (Trusty Tahr).'
keywords: 'ubuntu lamp server,ubuntu 14.04 lamp,lucid lamp,ubuntu web server,ubuntu lucid'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, January 28, 2015
modified_by:
  name: Elle Krout
published: 'Wednesday, January 28, 2015'
title: 'LAMP Server on Ubuntu 14.04'
external_resources:
 - '[Ubuntu Server Edition Homepage](http://www.ubuntu.com/products/whatisubuntu/serveredition)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

This guide provides step-by-step instructions for installing a full-featured LAMP stack on an Ubuntu 14.04 (Trusty Tahr) system. The 14.04 release is the most current LTS (long term support) version of the Ubuntu operating system, and will be supported with security updates until April of 2019.

Before beginning this guide, we suggest you first read through [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server/).

 {: .note }
>
> Throughout this guide we will offer several suggested values for specific configuration settings. Some of these values will be set by default. These settings are shown in the guide as a reference, in the event that you change these settings to suit your needs and then need to change them back.

{: .note }
>The steps required in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Install and Configure the Apache Web Server

1.  Update your package repositories and installed programs:

        apt-get update
        apt-get upgrade

2.  Install the current version of the Apache web server (2.4):

        apt-get install apache2

3.  Edit the main Apache configuration file to adjust the KeepAlive setting, and add the `<IfModule mpm_prefork_module>` section. The settings shown below are a good starting point for a **Linode 1GB**:

    {: .file }
    /etc/apache2/apache2.conf
    :   ~~~ apache
        KeepAlive Off

        ...

        <IfModule mpm_prefork_module>
        StartServers 2
        MinSpareServers 6
        MaxSpareServers 12
        MaxClients 30
        MaxRequestsPerChild 3000
        </IfModule>
        ~~~


### Configure Name-based Virtual Hosts

There are several different ways to set up virtual hosts; however, we recommend the method below. By default, Apache listens on all IP addresses available to it.

1.  Create a file in the `/etc/apache2/sites-available/` directory for each virtual host that you want to set up. Name each file with the domain that will be hosted, followed by `.conf`. See the following example configurations for the `example.com` and `example.org` domains:

    {: .file }
    /etc/apache2/sites-available/example.com.conf
    :   ~~~ apache
        <VirtualHost *:80> 
             ServerAdmin webmaster@example.com
             ServerName example.com
             ServerAlias www.example.com
             DocumentRoot /var/www/html/example.com/public_html/
             ErrorLog /var/www/html/example.com/logs/error.log 
             CustomLog /var/www/html/example.com/logs/access.log combined
             <Directory /path/to/public/website/>
                Require all granted
             </Directory>
        </VirtualHost>
        ~~~

    /etc/apache2/sites-available/example.org.conf
    :   ~~~ apache
        <VirtualHost *:80> 
             ServerAdmin webmaster@example.org     
             ServerName example.org
             ServerAlias www.example.org
             DocumentRoot /var/www/html/example.org/public_html/
             ErrorLog /var/www/html/example.org/logs/error.log 
             CustomLog /var/www/html/example.org/logs/access.log combined
             <Directory /path/to/public/website/>
                Require all granted
             </Directory>
        </VirtualHost>
        ~~~

    {: .note}
    >
    >The `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

2.  Before you can use the above configuration you'll need to create the specified directories:

        mkdir -p /var/www/html/example.com/public_html
        mkdir /var/www/html/example.com/logs

        mkdir -p /var/www/html/example.org/public_html
        mkdir /var/www/html/example.org/logs

3.  Link your virtual host file from the `sites-available` directory to the `sites-enabled` directory:

        a2ensite example.com.conf
        a2ensite example.org.conf
    
4.  Reload Apache:

        service apache2 reload

Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work.

If later you wanted to disable the `example.com` site issue the following command:

    a2dissite example.com.conf

The `a2dissite` command is the inverse of `a2ensite`. After enabling, disabling, or modifying any part of your Apache configuration you will need to reload the Apache configuration again with the `/etc/init.d/apache2 reload` command. You can create as many virtual hosting files as you need to support the domains that you want to host with your Linode.

##Install and Configure the MySQL Database Server

1.  Install the mysql-server package:

        apt-get install mysql-server 

    During the installation you will be prompted for a password. Choose something secure and record it for future reference.

    At this point, MySQL should be ready to configure and run. While you shouldn't need to change the configuration file, note that it is located at `/etc/mysql/my.cnf`. The default values should be fine for a **Linode 1GB**, but if you decide to adjust them you should first make a backup copy:

        cp /etc/mysql/my.cnf ~/my.cnf.backup

2.  After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer `yes` to these options. If you are prompted to reload the privilege tables, select `yes`. Run the following command to execute the program:

        mysql_secure_installation

3.  Create a database and grant your users permissions to use databases. First, log in to MySQL:

        mysql -u root -p 

    Enter MySQL's root password, and you'll be presented with a MySQL prompt where you can issue SQL statements to interact with the database.

4.  Create a database and a user with permissions for it:

        create database webdata; 
        grant all on webdata.* to 'foreman' identified by '5t1ck'; 

    In the example above, `webdata` is the name of the database, `foreman` is the username, and `5t1ck` the password. Note that database user names and passwords are only used by scripts connecting to the database, and that database user account names need not (and perhaps should not) represent actual user accounts on the system.

5.  With that completed you've successfully configured MySQL and you may now pass these database credentials on to your users. Exit MySQL:

        quit 

##Install and Configure PHP

1.  Install PHP:

        apt-get install php5 libapache2-mod-php5 php-pear 

2.  Once PHP5 is installed you'll need to tune the configuration file located in `/etc/php5/apache2/php.ini` to enable more descriptive errors, logging, and better performance. These modifications provide a good starting point if you're unfamiliar with PHP configuration.

    Make sure that the following values are set, and relevant lines are uncommented (comments are lines beginning with a semi-colon [`;`]):

    {: .file-excerpt }
    /etc/php5/apache2/php.ini
    :   ~~~ ini
        max_execution_time = 30
        memory_limit = 128M
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        display_errors = Off
        log_errors = On
        error_log = /var/log/php/error.log
        register_globals = Off
        max_input_time = 30
        ~~~

3.  Create the log directory for PHP and give the Apache user ownership:

        mkdir /var/log/php
        chown www-data /var/log/php

4.  If you need support for MySQL in PHP, then you must install the php5-mysql package:

        apt-get install php5-mysql

5.  Restart Apache to make sure everything is loaded correctly:

        service apache2 reload

Congratulations! You have now set up and configured a LAMP stack.



