---
author:
    name: Alex Fornuto
    email: afornuto@linode.com
description: 'A simple tutorial on installing a LAMP (Linux, Apache, MySQL, PHP) stack on an Arch Linux-powered server.'
keywords: ["arch lamp", "arch lamp stack", "lamp linux", "arch linode", "arch linux lamp", "arch linux", "arch", "lamp", "lamp stack", "apache", "mysql", "php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lamp-guides/arch-linux/','lamp-guides/arch-linux-10-2013/','websites/lamp/lamp-server-on-arch-linux/','web-servers/lamp/lamp-server-on-arch-linux/']
modified: 2015-12-07
modified_by:
    name: Alex Fornuto
published: 2013-10-07
title: How to Install a LAMP Stack on Arch Linux
external_resources:
 - '[Arch Linux Wiki](http://wiki.ArchLinux.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[Oracle MySQL and MariaDB Comparison](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

# Install and Configure LAMP (Linux, Apache, MySQL, PHP) on an Arch Linux Server

A LAMP (Linux, Apache, MySQL, PHP) stack is a common web stack used to prepare servers for hosting web content. This guide shows you how to install a LAMP stack an Arch Linux server.

Since Arch does not come in specific versions, this guide is up-to-date as of the December 2015 Arch update.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

2.  Update your system:

        sudo pacman -Syu

## Apache

### Install and Configure

1.  Install Apache 2.4:

        sudo pacman -Syu apache

2.  Edit the `httpd-mpm.conf` Apache configuration file in `/etc/httpd/conf/extra/` to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

    {{< note >}}
Before changing any configuration files, it is advised that you make a backup of the file. To make a backup:

cp /etc/httpd/conf/extra/httpd-mpm.conf ~/httpd-mpm.conf.backup
{{< /note >}}

    {{< file-excerpt "/etc/httpd/conf/extra/httpd-mpm.conf" aconf >}}
<IfModule mpm_prefork_module>
        StartServers            4
        MinSpareServers         20
        MaxSpareServers         40
        MaxRequestWorkers       200
        MaxConnectionsPerChild  4500
</IfModule>

{{< /file-excerpt >}}


3. Edit the `httpd-default.conf` file to turn KeepAlive off.

    {{< file-excerpt "/etc/httpd/conf/extra/httpd-default.conf" aconf >}}
KeepAlive Off

{{< /file-excerpt >}}


4.  Set Apache to start at boot:

        sudo systemctl enable httpd.service

### Add Name-Based Virtual Hosts

Virtual hosting can be configured so that multiple domains (or subdomains) can be hosted on the server. These websites can be controlled by different users, or by a single user, as you prefer. There are different ways to set up virtual hosts; however, we recommend the method below.

1. Open `httpd.conf` and edit the line `DocumentRoot /srv/http` to define the default document root:

    {{< file-excerpt "/etc/httpd/conf/httpd.conf" >}}
DocumentRoot "/srv/http/default"

{{< /file-excerpt >}}


2. Uncomment the line that reads `Include  conf/extra/httpd-vhosts.conf` near the end of the `/etc/httpd/conf/httpd.conf` file:

    {{< file-excerpt "/etc/httpd/conf/httpd.conf" apache >}}
Include conf/extra/httpd-vhosts.conf

{{< /file-excerpt >}}


2. Open `httpd-vhosts.conf`, under the `extra` folder. Edit the example virtual hosts block to resemble the ones below, replacing `example.com` with your domain.

    {{< file-excerpt "/etc/httpd/conf/extra/httpd-vhosts.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /srv/http/example.com/public_html/
     ErrorLog /srv/http/example.com/logs/error.log
     CustomLog /srv/http/example.com/logs/access.log combined
            <Directory />
               Order deny,allow
               Allow from all
            </Directory>
</VirtualHost>

{{< /file-excerpt >}}


    Remove the second example in the file, or use it configure a second website.

    {{< note >}}
`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.
{{< /note >}}

4.  Create the directories referenced in the configuration above:

        sudo mkdir -p /srv/http/default
        sudo mkdir -p /srv/http/example.com/public_html
        sudo mkdir -p /srv/http/example.com/logs

5.  After you've set up your virtual hosts, issue the following command to run Apache for the first time:

        sudo systemctl start httpd.service

    You should now be able to access your website. If no files are uploaded you will see an *Index of /* page.

    {{< note >}}
Should any additional changes be made to a configuration file restart Apache:

sudo systemctl restart httpd.service
{{< /note >}}

## MySQL

### Install and Configure

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

## PHP

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Many popular web applications like WordPress are written in PHP. If you want to develop your websites using PHP, you must first install it.

1.  Install PHP:

        sudo pacman -Syu php php-apache

2.  Edit `/etc/php/php.ini` for better error messages and logs, and upgraded performance. These modifications provide a good starting point for a **Linode 2GB**:

    {{< file-excerpt "/etc/php/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
log_errors = On
error_log = /var/log/php/error.log
max_input_time = 30
extension=mysql.so

{{< /file-excerpt >}}


    {{< note >}}
Ensure that all lines noted above are uncommented. A commented line begins with a semicolon (**;**).
{{< /note >}}

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown http /var/log/php

4.  Enable the PHP module in the `/etc/httpd/conf/httpd.conf` file by adding the following lines in the appropriate sections:

    {{< file-excerpt "/etc/httpd/conf/httpd.conf" aconf >}}
# Dynamic Shared Object (DSO) Support
LoadModule php7_module modules/libphp7.so
AddHandler php7-script php

# Supplemental configuration
# PHP 7
Include conf/extra/php7_module.conf

# Located in the <IfModule mime_module>
AddType application/x-httpd-php .php
AddType application/x-httpd-php-source .phps

{{< /file-excerpt >}}

5.  In the same file, comment out the line `LoadModule mpm_event_module modules/mod_mpm_event.so` by adding a `#` in front, and add the line `LoadModule mpm_prefork_module modules/mod_mpm_prefork.so`:

    {{< file-excerpt "/etc/httpd/conf/httpd.conf" apache >}}
#LoadModule mpm_event_module modules/mod_mpm_event.so
LoadModule mpm_prefork_module modules/mod_mpm_prefork.so

{{< /file-excerpt >}}


6.  Restart the Apache:

        sudo systemctl restart httpd.service
