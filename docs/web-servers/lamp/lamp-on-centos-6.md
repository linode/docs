---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Create a LAMP stack on a CentOS 6 Linode.'
keywords: ["LAMP", "CentOS", "CentOS 6", "apache", "mysql", "php", "centos lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lamp-guides/centos-6/','websites/lamp/lamp-server-on-centos-6/','websites/lamp/lamp-on-centos-6/']
modified: 2015-12-01
modified_by:
  name: Alex Fornuto
published: 2011-07-19
title: LAMP on CentOS 6
external_resources:
 - '[CentOS Linux Home Page](http://www.centos.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---


A LAMP (Linux, Apache, MySQL, PHP) stack is a common web stack used to prepare servers for hosting web content. This guide shows you how to install a LAMP stack on a CentOS 6 system.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo yum update


## Apache Web

###  Install and Configure

1.  Install Apache 2:

        sudo yum install httpd

2.  Edit the `httpd.conf` under `/etc/httpd/conf/` to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

    {{< note >}}
Before changing any configuration files, it is advised that you make a backup of the file. To make a backup:

cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup
{{< /note >}}

    {{< file-excerpt "/etc/httpd/conf/httpd.conf" aconf >}}
KeepAlive Off

...

<IfModule prefork.c>
    StartServers        4
    MinSpareServers     20
    MaxSpareServers     40
    MaxClients          200
    MaxRequestsPerChild 4500
</IfModule>

{{< /file-excerpt >}}


### Configure Apache Virtual Hosts

There are different ways to set up virtual hosts; however, the method below is recommended. By default, Apache listens on all IP addresses available to it.

1.  Create a file under `/etc/httpd/conf.d` called `vhost.conf`. Replace instances of `example.com` with your own domain information:

    {{< file-excerpt "/etc/httpd/conf.d/vhost.conf" apache >}}
NameVirtualHost *:80

<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/example.com/public_html/
     ErrorLog /var/www/example.com/logs/error.log
     CustomLog /var/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


    Additional code blocks can be added to the file for any other domains you with to host on the Linode.

    {{< note >}}
`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.
{{< /note >}}

2.  Create the directories referenced above:

        sudo mkdir -p /var/www/example.com/public_html
        sudo mkdir /var/www/example.com/logs

3.  Start Apache for the first time, and set it to run at boot:

        sudo service httpd start
        sudo /sbin/chkconfig --levels 235 httpd on

    You should new be able to view a default Apache page on your website.

    {{< note >}}
Anytime you change an option in your `vhost.conf` file, or any other Apache configuration file, remember to reload the configuration with the following command:

sudo service httpd reload
{{< /note >}}

## MySQL

###  Install and Configure

1.  Install the MySQL package:

        sudo yum install mysql-server

2.  Start MySQL, and set it to run at boot:

        sudo service mysqld start
        sudo /sbin/chkconfig --levels 235 mysqld on

3.  Run `mysql_secure_installation` to secure MySQL. You will be given the option to change the root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases and reload privileges. It is recommended that you answer yes to these options:

        mysql_secure_installation

### Create a MySQL Database

1.  Log in to MySQL:

        mysql -u root -p

    Enter MySQL's root password. You will then be presented with a MySQL prompt.

2.  Create a database and user:

        create database webdata;
        grant all on webdata.* to 'webuser' identified by 'password';

    In the above example `webdata` is the name of the database, `webuser` the user, and `password` a strong password.

3.  Exit MySQL:

        quit

With Apache and MySQL installed you are ready to move on to installing PHP.


## PHP

### Install and Configure

1.  Install PHP:

        sudo yum install php php-pear

    If you wish to install MySQL support for PHP also install the `php-mysql` package:

        sudo yum install php-mysql

2.  Edit `/etc/php.ini` for better error messages and logs, and upgraded performance. These modifications provide a good starting point for a **Linode 2GB**:

    {{< file-excerpt "/etc/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
error_log = /var/log/php/error.log
max_input_time = 30

{{< /file-excerpt >}}


    {{< note >}}
Ensure that all the lines noted above are uncommented. A commented line begins with a semicolon (**;**).
{{< /note >}}

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown apache /var/log/php

4.  Restart Apache:

        sudo service httpd restart
