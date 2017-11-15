---
deprecated: true
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Creating a LAMP stack with Apache, MySQL, and PHP on a Gentoo Linux powered Linode.'
keywords: ["LAMP","Gentoo Linux","Gentoo"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lamp-guides/gentoo-10-2013/','websites/lamp/lamp-server-on-gentoo/']
modified: 2014-02-10
modified_by:
  name: Alex Fornuto
published: 2013-10-24
title: LAMP Server on Gentoo
external_resources:
  - '[Gentoo Documentation](http://www.gentoo.org/doc/en/index.xml)'
  - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
  - '[MySQL Documentation](http://dev.mysql.com/doc/)'
  - '[PHP Documentation](http://www.php.net/docs.php)'
---

This guide provides step-by-step instructions for installing a full-featured LAMP stack on a Gentoo Linux system.

In this guide, you will be instructed on setting up Apache, MySQL, and PHP. If you don't feel that you will need MySQL or PHP, please don't feel obligated to install them.

{{< note >}}
Throughout this guide we will offer several suggested values for specific configuration settings. Some of these values will be set by default. These settings are shown in the guide as a reference, in the event that you change these settings to suit your needs and then need to change them back.
{{< /note >}}

## Set the Hostname and Configure /etc/hosts

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Install and Configure the Apache Web Server

Begin by making sure that your package repositories and installed programs are up to date by issuing the following commands:

    emerge --sync
    emerge --update world

Once this process has completed, issue the following command to install Apache:

    emerge www-servers/apache

Configurations directives for Apache are contained in the `httpd.conf` file, which is located at ''/etc/aoache2/httpd.conf''. We advise you to make a backup of this file into your home directory, like so:

    cp /etc/apache2/httpd.conf ~/httpd.conf.backup

Additional files are located in `/etc/apache2/modules.d/` and `/etc/apache2/vhosts.d/`.

Edit the 00\_mpm.conf Apache configuration file in /etc/apache2/modules.d/ to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**.

{{< file "/etc/apache2/modules.d/00_mpm.conf" >}}
<IfModule prefork.c>
        StartServers        4
        MinSpareServers     20
        MaxSpareServers     40
        MaxClients          200
        MaxRequestsPerChild 4500
</IfModule>
{{< /file >}}

Also edit the 00\_default\_settings.conf file to turn KeepAlives off.

{{< file "/etc/apache2/modules.d/00_default_settings.conf" >}}
KeepAlive Off
{{< /file >}}

Issue the following command to start Apache for the first time:

    /etc/init.d/apache2 start

If you would like Apache to start automatically after the next reboot, issue the following command:

    rc-update add apache2 default

You will now need to configure virtual hosting so you can serve content for multiple domains.

### Configure Virtual Hosts

By default, Apache listens on all available IP addresses. While this may be preferable in certain situations, it's generally a good idea to manually specify which IPs you would like Apache to listen on.

Begin by replacing the existing `NameVirtualHost` line in the `/etc/apache2/vhosts.d/00_default_vhost.conf` so that it reads:

{{< file "/etc/apache2/vhosts.d/00_default_vhost.conf" >}}
NameVirtualHost 12.34.56.78:80
{{< /file >}}

Be sure to replace "12.34.56.78" with your Linode's public IP address.

There are numerous ways to configure virtual hosts, but we recommend that you create a separate virtual hosting file for each site, and that you use the name `[site-name].conf` for each file. For the "example" site, the path to the virtual hosting file would be `/etc/apache2/vhosts.d/example.conf`.

Now we will create virtual host entries for each site being hosted on this server. We'll want to replace the existing `VirtualHost` blocks with ones that resemble the following:

{{< file "/etc/apache2/vhosts.d/example.conf" >}}
<VirtualHost 12.34.56.78:80>
     ServerAdmin username@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /srv/www/example.com/public_html/
     ErrorLog /srv/www/example.com/logs/error.log
     CustomLog /srv/www/example.com/logs/access.log combined
</VirtualHost>
{{< /file >}}

`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required.

Before you can use the above configuration, you'll need to create the specified directories. For the above configuration, you can do this with the following commands:

    mkdir -p /srv/www/example.com/public_html
    mkdir /srv/www/example.com/logs

You'll also need to adjust the restrictive default access settings in `00_default_settings.conf` by commenting out the `Deny from all` line.

{{< file "/etc/apache2/modules.d/00_default_settings.conf" >}}
<Directory />
        Options FollowSymLinks
        AllowOverride None
        Order deny,allow
#       Deny from all
</Directory>
{{< /file >}}

After you've set up your virtual hosts, load them into your running apache session:

    apache2ctl reload

Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work. Remember that you can create as many virtual hosts with Apache as you need.

Any time you change an option in any of your Apache configuration files, remember to reload Apache with the following command:

    /etc/init.d/apache2 reload

## Install and Configure the MySQL Database Server

MySQL is a relational database management system (RDBMS) and is a popular component in contemporary web development tool-chains. It is used to store data for many popular applications, including WordPress and Drupal.

### Install MySQL

The first step is to install the mysql-server package, with the following command:

    emerge dev-db/mysql

In Gentoo Linux this provides version 5.1.70 of MySQL (at the time of this guides publication). Before starting MySQL, the MySQL database needs to be installed. Run the following command:

    /usr/bin/mysql_install_db

If you are starting MySQL for the first time, issue the following command:

    /etc/init.d/mysql start

To ensure that the MySQL daemon starts during the boot process, issue the following command:

    rc-update add mysql default

At this point, MySQL should be ready to configure and run. While you shouldn't need to change the configuration file, note that it is located at `/etc/mysql/my.cnf` for future reference.

### Configure MySQL and Set Up Databases

After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

The settings for your MySQL daemon are located in `/etc/mysql/my.cnf`. The default values should be fine for a **Linode 2GB**, but if you decide to adjust them you should first make a backup copy:

    cp /etc/mysql/my.cnf ~/my.cnf.backup

Next, we'll create a database and grant your users permissions to use databases. First, log in to MySQL:

    mysql -u root -p

Enter MySQL's root password, and you'll be presented with a prompt where you can issue SQL statements to interact with the database.

To create a database and grant your users permissions on it, issue the following command. Note, the semi-colons (`;`) at the end of the lines are crucial for ending the commands. Your command should look like this:

    create database webdata;
    grant all on webdata.* to 'username' identified by 'password';

In the example above, `webdata` is the name of the database, `username` is the username, and `password` password. Note that database user names and passwords are only used by scripts connecting to the database, and that database user account names need not (and perhaps should not) represent actual user accounts on the system.

With that completed, you've successfully configured MySQL and you may now pass these database credentials on to your users. To exit the MySQL database administration utility issue the following command:

    quit

With Apache and MySQL installed you are now ready to move on to installing PHP to provide scripting support for your web pages.

## Install and Configure PHP

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Furthermore, many popular web applications like WordPress are written in PHP. If you want to be able to develop your websites using PHP, you must first install it.

Gentoo includes portage scripts for installing PHP from the terminal. Issue the following command:

    USE="cli cgi apache2 xml" emerge 'dev-lang/php'

Before we can use PHP with Apache, we'll need to add the `-D PHP5` option in the `APACHE2_OPTS` setting in the `/etc/conf.d/apache2` file, if it isn't already set. This line should now resemble:

{{< file "/etc/conf.d/apache2" >}}
APACHE2_OPTS="-D DEFAULT_VHOST -D INFO -D LANGUAGE -D SSL -D SSL_DEFAULT_VHOST -D PHP5"
{{< /file >}}

Now, restart Apache with the following command:

    /etc/init.d/apache2 restart

Once PHP is installed and enabled, we'll need to tune the configuration file located in `/etc/php/apache2-php5/php.ini` to enable more descriptive errors, logging, and better performance. These modifications provide a good starting point if you're unfamiliar with PHP configuration.

Make sure that the following values are set, and relevant lines are uncommented (comments are lines beginning with a semi-colon (`;` character)):

{{< file "/etc/php/apache2-php5.5/php.ini" >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
max_execution_time = 30
memory_limit = 128M
register_globals = Off
max_input_time = 30
{{< /file >}}

You will need to create the log directory for PHP and give the Apache user ownership:

    mkdir /var/log/php
    chown apache /var/log/php

If you decide to use PHP via the CGI interface later, you'll need to edit the `/etc/php/cgi-php5/php.ini` file.
