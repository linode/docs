---
author:
  name: Elle K.
  email: docs@linode.com
description: 'Get your website or web application online by setting up Apache, MySQL, and PHP'
keywords: ["debian 8 LAMP server", "debian LAMP", "LAMP howto", "lamp", "debian", "debian 8", "websites", "apache", "mysql", "php", "apache 2.4", "lamp debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-12-01
modified_by:
  name: Alex Fornuto
published: 2015-06-29
title: 'LAMP on Debian 8 (Jessie)'
aliases: ['websites/lamp/lamp-server-debian-8/','websites/lamp/lamp-on-debian-8-jessie/']
external_resources:
 - '[Debian Linux Home Page](http://www.debian.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

Setting up a LAMP (Linux, Apache, MySql, PHP) stack on your server will allow for the creation and hosting of websites and web applications. This guide shows you how to install a LAMP stack on Debian 8 (Jessie).

![LAMP on Debian 8 (Jessie)](/docs/assets/lamp-on-debian-8.png "LAMP on Debian 8 (Jessie)")

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

Prior to installing your LAMP stack ensure that:

-   You have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.
-   You have a hostname and *fully-qualified domain name* (FQDN) configured on your Linode. To ensure this is set run:

        hostname
        hostname -f

    The first command should output your hostname, with the second providing your FQDN.

-   Your Linode's repositories and packages are up-to-date:

        sudo apt-get update && sudo apt-get upgrade

## Apache

### Install and Configure Apache

1.  Install Apache 2.4:

        sudo apt-get install apache2

2.  Edit the main Apache configuration file and turn off the `KeepAlive` setting:

    {{< file "/etc/apache2/apache2.conf" aconf >}}
KeepAlive Off

{{< /file >}}


3.  Open `/etc/apache2/mods-available/mpm_prefork.conf` in your text editor and edit the values as needed. The following is optimized for a 2GB Linode:

    {{< file "/etc/apache2/mods-available/mpm_prefork.conf" aconf >}}
# prefork MPM
# StartServers: number of server processes to start
# MinSpareServers: minimum number of server processes which are kept spare
# MaxSpareServers: maximum number of server processes which are kept spare
# MaxRequestWorkers: maximum number of server processes allowed to start
# MaxConnectionsPerChild: maximum number of requests a server process serves

<IfModule mpm_prefork_module>
        StartServers              4
        MinSpareServers           20
        MaxSpareServers           40
        MaxRequestWorkers         200
        MaxConnectionsPerChild    4500
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet

{{< /file >}}


    {{< note >}}
These settings are good starting points, but should be adjusted to best suite your specific stack's needs.
{{< /note >}}

4.  On Debian 8, the *event module* is enabled by default. This should be disabled, and the *prefork module* enabled:

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

5.  Restart Apache:

        sudo systemctl restart apache2


### Configure Name-Based Virtual Hosts

There can be as many virtual hosts files as needed to support the amount of domains hosted on the Linode.

1.  Create directories for your websites and websites' logs, replacing `example.com` with your own domain name:

        sudo mkdir -p /var/www/html/example.com/public_html
        sudo mkdir /var/www/html/example.com/logs

    Repeat the process if you intend on hosting multiple websites on your Linode.

2.  Create an `example.com.conf` file in `/etc/apache2/sites-available` with your text editor, replacing instances of `example.com` with your own domain URL in both the configuration file and in the file name:

    {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/html/example.com/public_html/
     ErrorLog /var/www/html/example.com/logs/error.log
     CustomLog /var/www/html/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


    Repeat this process for any other domains you host:

    {{< file "/etc/apache2/sites-available/example.org.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin webmaster@example.org
     ServerName example.org
     ServerAlias www.example.org
     DocumentRoot /var/www/html/example.org/public_html/
     ErrorLog /var/www/html/example.org/logs/error.log
     CustomLog /var/www/html/example.org/logs/access.log combined
</VirtualHost>

{{< /file >}}


3.  Symbolically link your virtual hosts files from the `sites-available` directory to the `sites-enabled` directory. Replace the filename with your own:

        sudo a2ensite example.com.conf
        sudo a2ensite example.org.conf

    {{< note >}}
Should you need to disable a site, you can use `a2dissite example.com`.
{{< /note >}}

4.  Restart Apache:

        sudo systemctl restart apache2


## MySQL

MySQL is a *relational database management system* (RDBMS) and is a popular component of many applications.

### Install MySQL

1.  Install MySQL:

        sudo apt-get install mysql-server

    Input a secure password when prompted by the installation.

2.  Run `mysql_secure_installation` to remove the test database and any extraneous user permissions added during the initial installation process:

        sudo mysql_secure_installation

    It is recommended that you select yes (`y`) for all questions. If you already have a secure root password, you do not need to change it.

### Set Up a MySQL Database

Next, you can create a database and grant your users permissions to use databases.

1.  Log in to MySQL:

        mysql -u root -p

    Enter MySQL's root password when prompted.

2.  Create a database and grant your users permissions on it. Change the database name (`webdata`) and username (`username`). Change the password (`password`):

        create database webdata;
        grant all on webdata.* to 'username' identified by 'password';

3.  Exit MySQL:

        quit

## PHP

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks.

1.  Install PHP 5 and the PHP Extension and Application Repository:

        sudo apt-get install php5 php-pear

2.  Open `/etc/php5/apache2/php.ini` in your text editor, and edit the following values. These settings are optimized for the 2GB Linode:

    {{< file-excerpt "/etc/php5/apache2/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
error_log = /var/log/php/error.log
max_input_time = 30

{{< /file-excerpt >}}


    {{< note >}}
Ensure that all values are uncommented, by making sure they do not start with a semicolon (**;**).
{{< /note >}}

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown www-data /var/log/php

4.  If you need support for MySQL in PHP, then you must install the php5-mysql package:

        sudo apt-get install php5-mysql

5.  Restart Apache:

        sudo systemctl restart apache2
