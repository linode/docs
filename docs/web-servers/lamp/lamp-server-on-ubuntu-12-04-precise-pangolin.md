---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Configuring a LAMP stack with Apache, MySQL, PHP and on Ubuntu 12.04 (Precise Pangolin).'
keywords: ["ubuntu lamp server", "ubuntu 12.04 lamp", "lamp", "ubuntu server", "ubuntu", "apache", "mysql", "php", "lamp stacks"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lamp-guides/ubuntu-12-04-precise-pangolin/','websites/lamp/lamp-server-on-ubuntu-12-04-precise-pangolin/']
modified: 2015-06-30
modified_by:
  name: Alex Fornuto
published: 2012-10-03
title: 'LAMP Server on Ubuntu 12.04 (Precise Pangolin)'
external_resources:
 - '[Ubuntu Server Edition Homepage](http://www.ubuntu.com/server)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

Setting up a LAMP (Linux, Apache, MySql, PHP) stack will allow for the creation and hosting of websites and web applications. This guide provides step by step instructions for installing a LAMP stack on an Ubuntu 12.04 (Precise Pangolin) Linode.

![LAMP Server on Ubuntu 12.04](/docs/assets/lamp_server_on_ubuntu_12_04.png "LAMP Server on Ubuntu 12.04")

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Apache

### Install and Configure

1.  Install Apache 2:

        sudo apt-get install apache2

2.  Edit the main Apache configuration file to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

    {{< file-excerpt "/etc/apache2/apache2.conf" aconf >}}
KeepAlive Off

<IfModule mpm_prefork_module>
StartServers 4
MinSpareServers 20
MaxSpareServers 40
MaxClients 200
MaxRequestsPerChild 4500
</IfModule>

{{< /file-excerpt >}}



### Configure Name-based Virtual Hosts

There are different ways to set up virtual hosts; however, the method below is recommended.

1.  Within the `/etc/apache2/sites-available/` directory, create a configuration file for your website, `example.com.conf`, replacing `example.com` with your own domain information:

    {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/example.com/public_html/
     ErrorLog /var/www/example.com/logs/error.log
     CustomLog /var/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


    {{< note >}}
The `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.
{{< /note >}}

2.  Create the directories referenced above:

        sudo mkdir -p /var/www/example.com/public_html
        sudo mkdir /var/www/example.com/logs

3.  Enable the website's virtual host:

        sudo a2ensite example.com.conf

    {{< note >}}
If you need to disable your website later, run:

sudo a2dissite example.com.conf
{{< /note >}}

4.  Reload Apache:

        sudo service apache2 reload

    Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work.


## MySQL

### Install and Configure

1.  Install MySQL:

        sudo apt-get install mysql-server

    Choose a secure password when prompted.

2.  Run `mysql_secure_installation`, a program that helps secure MySQL. You will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases:

        mysql_secure_installation

### Create a MySQL Database

1.  Log into MySQL:

        mysql -u root -p

    Enter the root password. The MySQL prompt will appear.

2.  Create a database and a user with permissions for it. In this example the database is called `webdata`, the user `webuser` and password `password`:

        create database webdata;
        grant all on webdata.* to 'webuser' identified by 'password';

3.  Exit MySQL:

        quit

With Apache and MySQL installed you are now ready to install PHP.


## PHP

1.  Install PHP, and the PHP Extension and Application Repository:

        sudo apt-get install php5 php-pear

    If you need MySQL support, also install `php5-mysql`

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

4.  Restart Apache:

        sudo service apache2 restart

Congratulations! You have now set up and configured a LAMP stack.
