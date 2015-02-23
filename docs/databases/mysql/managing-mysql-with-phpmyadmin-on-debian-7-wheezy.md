---
deprecated: true
author:
  name: Brett Kaplan
  email: bkaplan@linode.com
description: 'Use phpMyAdmin to manage MySQL databases and users though a web interface.'
keywords: 'mysql,phpmyadmin,sql,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/mysql/phpmyadmin-debian-7-wheezy/']
modified: Wednesday, January 15th, 2014
modified_by:
  name: Alex Fornuto
published: 'Thursday, January 2nd, 2014'
title: 'Managing MySQL with phpMyAdmin on Debian 7 (Wheezy)'
---

phpMyAdmin is an open source web application written in PHP that provides a GUI to aid in MySQL database administration. It supports multiple MySQL servers, and is a robust and easy alternative to using the MySQL command line client.

We assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. We also assume that you have installed a working LAMP stack. For guides on installing a LAMP stack for your distribution, please visit the [LAMP guides](/docs/lamp-guides/) section of our Linode Library.

Be aware, if you have opted to install the `php-suhosin` package, there are some known issues when using phpMyAdmin. Please visit the [Suhosin phpMyAdmin Compatibility Issues page](http://www.hardened-php.net/hphp/troubleshooting.html) for more information about tuning and workarounds.

Preparing Your Apache Configuration
-----------------------------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade

In order to provide better security, this guide will install phpMyAdmin to an SSL secured apache virtual host. While you can use http to access your phpMyAdmin instance, it will send your passwords in plain text over the internet. Since you will most likely be logging in to phpMyAdmin using your MySQL root user, http is definitely not recommended.

If you need to set up SSL for your host, please refer to our [using Apache with SSL guide](/docs/web-servers/apache/ssl-guides/debian-5-lenny). Please ensure SSL is enabled for your virtual host before proceeding.

phpMyAdmin requires the `mcrypt` PHP module. You can install it using the following command:

    apt-get install php5-mcrypt

You may need to restart your Apache server daemon for the changes to take effect:

    service apache2 restart

Installing phpMyAdmin
---------------------

To install the current version of phpMyAdmin on a Debian system use the following command:

    apt-get install phpmyadmin

You will be asked which server to automatically configure phpMyAdmin for. Select "apache2".

![image](/docs/assets/1492-pmaconfig01.jpg)

When asked to configure database for phpmyadmin with dbconfig-common select yes.

![image](/docs/assets/1493-pmaconfig02.png)

Configuring phpMyAdmin
----------------------

For each virtual host that you would like to give access to your PHPMyAdmin installation, you must create a symbolic link from the document root to the phpMyAdmin installation location (`/usr/share/phpmyadmin`)

Change directory to your document root and issue the following commands to create the symbolic link (be sure to substitute the proper paths for your particular configuration):

    cd /srv/www/example.org/public_html
    ln -s /usr/share/phpmyadmin

This will create a symbolic link named `phpmyadmin` in your document root.

Securing phpMyAdmin
-------------------

### .htaccess File

We recommend securing your phpMyAdmin directory using an `.htaccess file` and only allowing specified IP addresses to access it. You can do this by creating an `.htaccess` file in your `phpmyadmin` directory. Refer to the sample `.htaccess` file below. Be sure to substitute the proper paths and replace **12.34.56.78** with your local IP address.

{: .file-excerpt }
/srv/www/example.org/public\_html/phpmyadmin/.htaccess
:   ~~~ apache
    order allow,deny
    allow from 12.34.56.78
    ~~~

### Force SSL

Since you are required to enter your MySQL credentials when using phpMyAdmin, we recommend that you use SSL to secure HTTP traffic to your phpMyAdmin installation. For more information on using SSL with your websites, please consult the guides that address [SSL certificates](/docs/security/ssl//).

You can force phpMyAdmin to use SSL in the phpMyAdmin configuration file `/etc/phpmyadmin/config.inc.php` by adding the following lines under the `Server(s) configuration` section:

{: .file-excerpt }
/etc/phpmyadmin/config.inc.php
:   ~~~ php
    $cfg['ForceSSL'] = 'true';
    ~~~

Testing Your phpMyAdmin Installation
------------------------------------

To test phpMyAdmin, open your favorite browser and navigate to `https://example.com/phpmyadmin`. You will be prompted for a username and password. Use the username "root" and the password you specified when you installed MySQL. Alternatively, you can log in using any MySQL user and retain their permissions.

If you can successfully log in, phpMyAdmin has been installed properly.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [phpMyAdmin Home page](http://www.phpmyadmin.net/home_page/index.php)
- [phpMyAdmin Documentation Page](http://www.phpmyadmin.net/home_page/docs.php)



