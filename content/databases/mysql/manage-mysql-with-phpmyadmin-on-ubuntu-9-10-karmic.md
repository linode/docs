---
deprecated: true
author:
  name: Brett Kaplan
  email: docs@linode.com
description: 'Use phpMyAdmin to manage MySQL databases and users though a web interface.'
keywords: ["mysql", "phpmyadmin", "sql", "ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/phpmyadmin-ubuntu-9-10-karmic/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-04-17
title: 'Manage MySQL with phpMyAdmin on Ubuntu 9.10 (Karmic)'
external_resources:
    - '[phpMyAdmin Home page](http://www.phpmyadmin.net/home_page/index.php)'
    - '[phpMyAdmin Documentation Page](http://www.phpmyadmin.net/home_page/docs.php)'
---



phpMyAdmin is an open source web application written in PHP that provides a GUI to aid in MySQL database administration. It supports multiple MySQL servers and is a robust and easy alternative to using the MySQL command line client.

We assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. We also assume that you have installed a working LAMP stack. For guides on installing a LAMP stack for your distribution, please visit the [LAMP guides](/docs/lamp-guides/) section of Linode Guides & Tutorials.

Be aware, if you have opted to install the `php-suhosin` package, there are some known issues when using phpMyAdmin. Please visit the [Suhosin phpMyAdmin Compatibility Issues page](http://www.hardened-php.net/hphp/troubleshooting.html) for more information about tuning and workarounds.

## Enabling the "Universe" Repository

The `mcrypt` PHP module required by phpMyAdmin is contained in the "universe" repository for Ubuntu Karmic. Edit your `/etc/apt/sources.list` file to enable the "universe" repositories by removing the hash symbol in front of the universe lines. The file should resemble the following example:

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file >}}


When you have saved this file, issue the following command to refresh your system's package database:

    apt-get update
    apt-get upgrade  --show-upgraded

## Preparing Your Apache Configuration

In order to provide better security, this guide will install phpMyAdmin to an SSL secured Apache `VirtualHost`. While you can use HTTP to access your phpMyAdmin instance, it will send your passwords in plain text over the internet. Since you will most likely be logging in to phpMyAdmin using your MySQL root user, HTTP is definitely not recommended.

If you need to set up SSL for your host, please refer to our [using Apache with SSL guide](/docs/web-servers/apache/ssl-guides/ubuntu-9-10-karmic). Please ensure SSL is enabled for your virtual host before proceeding.

phpMyAdmin requires the `mcrypt` PHP module. You can install it using the following command:

    apt-get install php5-mcrypt

You may need to restart your Apache server daemon for the changes to take effect:

    /etc/init.d/apache2 restart

## Installing phpMyAdmin

To install the current version of phpMyAdmin on a Debian system use the following command:

    apt-get install phpmyadmin

You will be asked which server to configure phpMyAdmin for. Choose your current web server.

phpMyAdmin will be installed to `/usr/share/phpmyadmin`. During installation, it will be configured for the Apache default site. However, if you are using Apache virtual hosts a little more configuration is needed.

## Configuring phpMyAdmin

For each virtual host that you would like to give access to your PHPMyAdmin installation, you must create a symbolic link from the document root to the phpMyAdmin installation location (`/usr/share/phpmyadmin`)

Change directory to your document root and issue the following commands to create the symbolic link (be sure to substitute the proper paths for your particular configuration):

    cd /srv/www/example.com/public_html
    ln -s /usr/share/phpmyadmin

This will create a symbolic link named `phpmyadmin` in your document root.

## Securing phpMyAdmin

### .htaccess File

We recommend securing your phpMyAdmin directory using an `.htaccess file` and only allowing specified IP addresses to access it. You can do this by creating an `.htaccess` file in your `phpmyadmin` directory. Refer to the sample `.htaccess` file below. Be sure to substitute the proper paths and **IP addresses** for your particular configuration.

{{< file-excerpt "/srv/www/example.com/public\\_html/phpmyadmin/.htaccess" apache >}}
Order Deny,Allow
Deny from all
Allow from 12.34.56.78

{{< /file-excerpt >}}


### Force SSL

Since you are required to enter your MySQL credentials when using phpMyAdmin, we recommend that you use SSL to secure HTTP traffic to your phpMyAdmin installation. For more information on using SSL with your websites, please consult guides that address [SSL certificates](/docs/security/ssl//).

You can force phpMyAdmin to use SSL in the phpMyAdmin configuration file `/etc/phpmyadmin/config.inc.php` by adding the following lines under the `Server(s) configuration` section:

{{< file-excerpt "/etc/phpmyadmin/config.inc.php" php >}}
$cfg['ForceSSL'] = 'true';

{{< /file-excerpt >}}


## Testing Your phpMyAdmin Installation

To test phpMyAdmin, open your favorite browser and navigate to `https://example.com/phpmyadmin`. You will be prompted for a username and password. Use the username "root" and the password you specified when you installed MySQL. Alternatively, you can log in using any MySQL user and retain their permissions.

If you can successfully log in, phpMyAdmin has been installed properly.
