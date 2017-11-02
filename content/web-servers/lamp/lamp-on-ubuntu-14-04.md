---
author:
  name: Linode
  email: docs@linode.com
description: 'How to install a LAMP (Linux, Apache, MySQL, PHP) stack on an Ubuntu 14.04 long term support (LTS) system.'
keywords: ["ubuntu lamp", "ubuntu 14.04 lamp", "lamp install", "ubuntu web server", "apache", "mysql", "php", "ubuntu 14.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/lamp/lamp-server-on-ubuntu-14-04/','websites/lamp/how-to-install-a-lamp-stack-on-ubuntu-14-04/','websites/lamp/lamp-on-ubuntu-14-04/']
modified: 2015-12-07
modified_by:
  name: Alex Fornuto
published: 2015-01-28
title: 'LAMP on Ubuntu 14.04'
external_resources:
 - '[Ubuntu Server Edition Homepage](http://www.ubuntu.com/server)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

A LAMP (Linux, Apache, MySQL, PHP) stack is a common web stack used for hosting web content. This guide shows you hot to install a LAMP stack on an Ubuntu 14.04 (LTS) server.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Apache

### Install and Configure

1.  Install Apache 2.4:

        sudo apt-get install apache2

2.  Edit the main Apache configuration file, `apache2.conf`, to adjust the KeepAlive setting:

    {{< file "/etc/apache2/apache2.conf" aconf >}}
KeepAlive Off

{{< /file >}}


3.  The default *multi-processing module* (MPM) for Apache is the *event* module, but by default PHP uses the *prefork* module. Open the `mpm_prefork.conf` file located in `/etc/apache2/mods-available` and edit the configuration. Below is the suggested values for a **2GB Linode**:

    {{< file "/etc/apache2/mods-available/mpm_prefork.conf" aconf >}}
<IfModule mpm_prefork_module>
        StartServers            4
        MinSpareServers         20
        MaxSpareServers         40
        MaxRequestWorkers       200
        MaxConnectionsPerChild  4500
</IfModule>

{{< /file >}}


4.  Disable the event module and enable prefork:

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

5.  Restart Apache:

        sudo service apache2 restart


### Configure Virtual Hosts

There are several different ways to set up virtual hosts; however, below is the recommended method. By default, Apache listens on all IP addresses available to it.

1.  Within the `/etc/apache2/sites-available/` directory, create a configuration file for your website, `example.com.conf`, replacing `example.com` with your own domain information:

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
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

{{< /file >}}


    {{< note >}}
The `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.
{{< /note >}}

2.  Create the above-referenced directories:

        sudo mkdir -p /var/www/html/example.com/public_html
        sudo mkdir /var/www/html/example.com/logs

3.  Link your virtual host file from the `sites-available` directory to the `sites-enabled` directory:

        sudo a2ensite example.com.conf

    {{< note >}}
If you later need to disable your website, run:

a2dissite example.com.conf
{{< /note >}}

4.  Reload Apache:

        sudo service apache2 reload

    Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work.

    If there are additional websites you wish to add to your Linode repeat the above steps to add them.


## MySQL

### Install and Configure

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

## PHP

1.  Install PHP, and the PHP Extension and Application Repository:

        sudo apt-get install php5 php-pear

    If you need MySQL support also install `php5-mysql`

        sudo apt-get install php5-mysql

2.  Once PHP5 is installed, tune the configuration file located in `/etc/php5/apache2/php.ini` to enable more descriptive errors, logging, and better performance. The following modifications provide a good starting point:

    {{< file-excerpt "/etc/php5/apache2/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
error_log = /var/log/php/error.log
max_input_time = 30

{{< /file-excerpt >}}


    {{< note >}}
Ensure the lines above are uncommented. Commented lines begin with a semicolon (**;**).
{{< /note >}}

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown www-data /var/log/php

4.  Reload Apache:

        sudo service apache2 reload

Congratulations! You have now set up and configured a LAMP stack.
