---
author:
    name: Linode
    email: docs@linode.com
description: 'Use phpMyAdmin to manage MySQL databases and users though a web interface.'
keywords: ["mysql", "phpmyadmin", "sql", "ubuntu", "precise", "ubuntu 14.04", "lts", "ubuntu lts", "localhost phpmyadmin", "php mysql", "http localhost phpmyadmin"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/mysql/phpmyadmin-ubuntu-12-04-precise/','databases/mysql/mysql-phpmyadmin-ubuntu-14-04']
modified: 2017-08-01
modified_by:
    name: Linode
published: 2013-09-12
title: 'How to Install MySQL with phpMyAdmin on Ubuntu 14.04'
external_resources:
    - '[phpMyAdmin Home page](http://www.phpmyadmin.net/home_page/index.php)'
    - '[phpMyAdmin Documentation Page](http://www.phpmyadmin.net/home_page/docs.php)'
---

![Install MySQL phpMyAdmin on Ubuntu 14.04](/docs/assets/how-to-install-mysql-phpmyadmin-on-ubuntu-1404.png "Install MySQL phpMyAdmin on Ubuntu 14.04")

phpMyAdmin is a web application that provides a GUI to aid in MySQL database administration. It supports multiple MySQL servers and is a robust and easy alternative to using the MySQL command line client.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade -y

3.  Set up a working LAMP stack. Please see the [LAMP on Ubuntu 14.04](/docs/websites/lamp/how-to-install-a-lamp-stack-on-ubuntu-14-04) guide if needed.

    {{< note >}}
If you have installed the `php-suhosin` package, there are some known issues when using phpMyAdmin. Please visit the [Suhosin phpMyAdmin Compatibility Issues page](http://www.hardened-php.net/hphp/troubleshooting.html) for more information about tuning and workarounds.
{{< /note >}}

4.  Set up Apache with SSL, so your passwords will not be sent over plain text. To do so, go trough the [SSL Certificates with Apache on Debian & Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu) guide.

5.  Install the `mcrypt` PHP module:

        sudo apt-get install mcrypt

6.  Restart Apache:

        sudo service apache2 restart


## Setting Up phpMyAdmin

1.  Install the current version of phpMyAdmin:

        sudo apt-get install phpmyadmin

    You will be asked which server to automatically configure phpMyAdmin for. Select the web server that you have installed. If you have more than one web server installed, select the best option for your deployment. Follow through the rest of the guided installer to set passwords.

2.  For each virtual host that you would like to give access to your PHPMyAdmin installation, create a symbolic link from the document root to the phpMyAdmin installation location (`/usr/share/phpmyadmin`):

        cd /var/www/html/example.com/public_html
        sudo ln -s /usr/share/phpmyadmin

    This will create a symbolic link named `phpmyadmin` in your document root.


## Securing phpMyAdmin

### .htaccess File

Secure your phpMyAdmin directory using an `.htaccess file` that only allows specified IP addresses to access it. You can do this by creating an `.htaccess` file in your `phpmyadmin` directory. Substitute the proper paths and **IP addresses** for your particular configuration:

{{< file-excerpt "/var/www/example.com/public_html/phpmyadmin/.htaccess" apache >}}
order allow,deny
allow from 12.34.56.78

{{< /file-excerpt >}}


### Force SSL

You can force phpMyAdmin to use SSL in the phpMyAdmin configuration file `/etc/phpmyadmin/config.inc.php` by adding the following lines under the `Server(s) configuration` section:

{{< file-excerpt "/etc/phpmyadmin/config.inc.php" php >}}
$cfg['ForceSSL'] = 'true';

{{< /file-excerpt >}}


## Testing Your phpMyAdmin Installation

To test phpMyAdmin, open your favorite browser and navigate to `https://example.com/phpmyadmin`. You will be prompted for a username and password. Use the username "root" and the password you specified when you installed MySQL. Alternatively, you can log in using any MySQL user and retain their permissions.

If you can successfully log in, phpMyAdmin has been installed properly.
