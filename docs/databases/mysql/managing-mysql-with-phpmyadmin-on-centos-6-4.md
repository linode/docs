---
deprecated: true
author:
  name: Mike Rosabal
  email: mrosabal@linode.com
description: 'Use phpMyAdmin to manage MySQL databases and users though a web interface.'
keywords: 'mysql,phpmyadmin,sql,centos'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/mysql/phpmyadmin-centos-6/']
modified: Tuesday, February 4th, 2014
modified_by:
  name: Alex Fornuto
published: 'Tuesday, February 4th, 2014'
title: 'Managing MySQL with phpMyAdmin on CentOS 6.4'
---

phpMyAdmin is an open source web application written in PHP that provides a GUI to aid in MySQL database administration. It supports multiple MySQL servers, and is a robust and easy alternative to using the MySQL command line client.

We assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. We also assume that you have installed a working LAMP stack. For guides on installing a LAMP stack for your distribution, please visit the [LAMP guides](/docs/lamp-guides/) section of our Linode Library.

Be aware, if you have opted to install the `php-suhosin` package, there are some known issues when using phpMyAdmin. Please visit the [Suhosin phpMyAdmin Compatibility Issues page](http://www.hardened-php.net/hphp/troubleshooting.html) for more information about tuning and workarounds.

Preparing Your Apache Configuration
-----------------------------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    yum update

Installing phpMyAdmin also requires access to the Fedora Projects EPEL Repositories. You can add it to your YUM source list by running the following commands:

    cd ~
    wget http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
    sudo rpm -ivh epel-release*

In order to provide better security, this guide will install phpMyAdmin to an SSL secured apache virtual host. While you can use http to access your phpMyAdmin instance, it will send your passwords in plain text over the internet. Since you will most likely be logging in to phpMyAdmin using your MySQL root user, http is definitely not recommended.

If you need to set up SSL for your host, please refer to our [using Apache with SSL guide](/docs/web-servers/apache/ssl-guides/centos). Please ensure SSL is enabled for your virtual host before proceeding.

phpMyAdmin requires the `mcrypt` PHP module. You can install it using the following command:

    yum install php-mcrypt*

You may need to restart your Apache server daemon for the changes to take effect:

    service httpd restart

Installing phpMyAdmin
---------------------

To install the current version of phpMyAdmin on a CentOS system use the following command:

    yum install phpmyadmin

Configuring phpMyAdmin
----------------------

Before you can proceed, you will need to make note of the external IP address being used by your home or work computer. This can be found by visiting the following website:

    http://www.whatismyip.com

By default, phpMyAdmin is configured to only permit access from the localhost (127.0.0.1). You will need to edit the configuration file and add the IP Address of your home and work computer in order to access it. Edit the configuration file by entering the following command:

    sudo nano /etc/httpd/conf.d/phpMyAdmin.conf

Replace the 4 instances of 127.0.0.1 with the IP address of your home or work computer.

For each virtual host that you would like to give access to your PHPMyAdmin installation, you must create a symbolic link from the document root to the phpMyAdmin installation location (`/usr/share/phpmyadmin`)

Change directory to your document root and issue the following commands to create the symbolic link (be sure to substitute the proper paths for your particular configuration):

    cd /srv/www/example.org/public_html
    ln -s /usr/share/phpmyadmin

This will create a symbolic link named `phpmyadmin` in your document root.

### Force SSL

Since you are required to enter your MySQL credentials when using phpMyAdmin, we recommend that you use SSL to secure HTTP traffic to your phpMyAdmin installation. For more information on using SSL with your websites, please consult the guides that address [SSL certificates](/docs/security/ssl-certificates/).

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



