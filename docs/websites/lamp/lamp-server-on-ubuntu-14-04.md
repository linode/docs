---
author:
  name: Linode
  email: docs@linode.com
description: 'Configure a LAMP stack with Apache, MySQL, PHP and on Ubuntu 14.04'
keywords: 'ubuntu lamp server,ubuntu 14.04 lamp,lamp,ubuntu web server,apache,mysql,php,ubuntu 14.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, June 29th, 2015
modified_by:
  name: Elle Krout
published: 'Wednesday, January 28th, 2015'
title: 'LAMP Server on Ubuntu 14.04'
external_resources:
 - '[Ubuntu Server Edition Homepage](http://www.ubuntu.com/products/whatisubuntu/serveredition)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

A LAMP (Linux, Apache, MySQL, PHP) stack is a basic web stack used to prepare servers for hosting online. This guide provides step-by-step instructions for installing a full-featured LAMP stack on an Ubuntu 14.04 long term support (LTS) system.

Before beginning this guide, we suggest you first read through [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server/).

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

        sudo apt-get update && sudo apt-get upgrade

## Install and Configure Apache

1.  Install Apache 2.4:

        sudo apt-get install apache2

2.  Edit the main Apache configuration file, `apache2.conf`, to adjust the KeepAlive setting:

    {: .file }
    /etc/apache2/apache2.conf
    :   ~~~ conf
        KeepAlive Off
        ~~~

3.  The default *multi-processing module* (MPM) for Apache is the *event* module, but by default PHP uses the *prefork* module. Open the `mpm_prefork.conf` file located in `/etc/apache2/mods-available` and edit the configuration. Below is the suggested values for a **1GB Linode**:

    {: .file}
    /etc/apache2/mods-available/mpm_prefork.conf
    :   ~~~ conf
        <IfModule mpm_prefork_module>
                StartServers            2
                MinSpareServers         6
                MaxSpareServers         12
                MaxRequestWorkers       39
                MaxConnectionsPerChild  3000
        </IfModule>
        ~~~

4.  Disable the event module and enable prefork:

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

5.  Restart Apache:

        sudo service apache2 restart


### Configure Virtual Hosts

There are several different ways to set up virtual hosts; however, below is the recommended method. By default, Apache listens on all IP addresses available to it.

1.  Within the `/etc/apache2/sites-available/` directory, create a configuration file for your website, `example.com.conf`, replacing `example.com` with your own domain information:

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

    {: .note}
    >
    >The `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

2.  Create the above-referenced directories:

        sudo mkdir -p /var/www/html/example.com/public_html
        sudo mkdir /var/www/html/example.com/logs

3.  Link your virtual host file from the `sites-available` directory to the `sites-enabled` directory:

        sudo a2ensite example.com.conf

    {: .note}
    >
    >If you later need to disable your website, run:
    >
    >     a2dissite example.com.conf
    
4.  Reload Apache:

        sudo service apache2 reload

    Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work.

    If there are additional websites you wish to add to your Linode repeat the above steps to add them.


## Install and Configure MySQL

1.  Install the `mysql-server` package:

        sudo apt-get install mysql-server 

    Choose a secure password when prompted.

2.  Run `mysql_secure_installation`, a program that helps secure MySQL. You will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases:

        mysql_secure_installation

### Create a MySQL Database

1.  Log into MySQL:

        mysql -u root -p 

    Enter MySQL's root password, and you'll be presented with a MySQL prompt.

4.  Create a database and a user with permissions for it. In this example the databse is called `webdata`, the user `webuser` and password `password`:

        create database webdata; 
        grant all on webdata.* to 'webuser' identified by 'password'; 

5.  Exit MySQL:

        quit 

##Install and Configure PHP

1.  Install PHP, and the PHP Extension and Application Repository:

        sudo apt-get install php5 php-pear

    If you need MySQL support also install `php5-mysql`

        sudo apt-get install php5-mysql

2.  Once PHP5 is installed, tune the configuration file located in `/etc/php5/apache2/php.ini` to enable more descriptive errors, logging, and better performance. The following modifications provide a good starting point:

    {: .file-excerpt}
    /etc/php5/apache2/php.ini
    :   ~~~ ini
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        error_log = /var/log/php/error.log
        max_input_time = 30
        ~~~

    {: .note}
    >
    >Ensure the lines above are uncommented. Commented lines begin with a semicolon (**;**).

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown www-data /var/log/php

4.  Reload Apache:

        sudo service apache2 reload

Congratulations! You have now set up and configured a LAMP stack.



 a database and a user with permissions for it:

        create database webdata; 
        grant all on webdata.* to 'foreman' identified by '5t1ck'; 

    In the example above, `webdata` is the name of the database, `foreman` is the username, and `5t1ck` the password. Note that database user names and passwords are only used by scripts connecting to the database, and that database user account names need not (and perhaps should not) represent actual user accounts on the system.

5.  With that completed you've successfully configured MySQL and you may now pass these database credentials on to your users. Exit MySQL:

        quit 

##Install and Configure PHP

1.  Install PHP:

        apt-get install php5 php-pear 

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