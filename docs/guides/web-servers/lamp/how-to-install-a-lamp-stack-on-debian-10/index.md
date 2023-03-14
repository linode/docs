---
slug: how-to-install-a-lamp-stack-on-debian-10
description: 'Install a LAMP stack on a Debian 10. A LAMP stack includes Linux, Apache, MariaDB, and PHP.'
keywords: ["debian 10 LAMP server", "debian LAMP", "LAMP howto", "lamp", "debian", "debian 10", "websites", "apache", "mysql", "php", "apache 2.4", "lamp debian"]
tags: ["web server","php","mysql","apache","debian","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-19
modified_by:
  name: Linode
published: 2015-06-29
title: How to Install a LAMP Stack on Debian 10
title_meta: 'Install a LAMP Stack on Debian 10 (Buster)'
image: how-to-install-lamp-stack-on-debian-10.png
external_resources:
 - '[Debian Linux Home Page](http://www.debian.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
relations:
    platform:
        key: install-lamp-stack
        keywords:
            - distribution: Debian 10
aliases: ['/web-servers/lamp/how-to-install-a-lamp-stack-on-debian-10/']
authors: ["Linode"]
---

A *LAMP stack* is a particular bundle of software packages commonly used for hosting web content. The bundle consists of Linux, Apache, MariaDB, and PHP. This guide shows you how to install a LAMP stack on Debian 10 (Buster).

## Before You Begin

Prior to installing your LAMP stack ensure that:

1.  Ensure that you have followed the [Getting Started](/docs/products/platform/get-started/) and [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guides. Ensure that the Linode's [hostname is set](/docs/products/platform/get-started/#set-the-hostname).

    Check your Linode's hostname. The first command should show your short hostname and the second should show your fully qualified domain name (FQDN).

        hostname
        hostname -f

    {{< note respectIndent=false >}}If you have a registered domain name for your website, then [add the domain](/docs/products/networking/dns-manager/guides/create-domain/) to the Linode server on which you plan to install the LAMP stack. If you do not have a registered domain name, then replace `example.com` with the IP address of the Linode server in the following instructions.{{< /note >}}

1.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

    {{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
    {{< /note >}}

## Apache

### Install and Configure Apache

1.  Install Apache 2.4:

        sudo apt-get install apache2


1.  Open `/etc/apache2/mods-available/mpm_prefork.conf` in your text editor and edit the values as needed. The following is optimized for a 2GB Linode:

    {{< note respectIndent=false >}}
As a best practice, you should create a backup of your Apache configuration file, before making any configuration changes to your Apache installation. To make a backup in your home directory:

    cp /etc/apache2/apache2.conf ~/apache2.conf.backup
{{< /note >}}

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


    {{< note respectIndent=false >}}
These settings are good starting points, but they should be adjusted to best suit your deployment's needs.
{{< /note >}}

1.  Enable the firewall to allow web traffic. This guide lists the commands to enable web traffic if you configured UFW on your server.

    a. Check the ports that are enabled for `WWW Full` Profile:

        sudo apt install ufw
        sudo ufw app info "WWW Full"

       Ports `80` and `443` should be listed as enabled for `WWW Full` profile.

    b. To allow incoming HTTP and HTTPS traffic for `WWW Full` profile:

        sudo ufw allow in "WWW Full"


1.  On Debian 10, the *event module* is enabled by default. This should be disabled, and the *prefork module* enabled:

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

1.  Restart Apache:

        sudo systemctl restart apache2


### Configure Name-Based Virtual Hosts

There can be as many virtual hosts files as needed to support the amount of domains hosted on the Linode.

1.  Create directories for your websites and websites' logs, replacing `example.com` with your own domain name:

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}

    Repeat the process if you intend on hosting multiple websites on your Linode.

1.  Create a copy of the default Apache configuration file for your site:

         sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf

1.  Edit the `example.com.conf` file in `/etc/apache2/sites-available` with your text editor, replacing instances of `example.com` with your own domain URL in both the configuration file and in the file name:

    {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
<Directory /var/www/html/example.com/public_html>
        Require all granted
</Directory>
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/html/example.com/public_html
     ErrorLog /var/www/html/example.com/logs/error.log
     CustomLog /var/www/html/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


    Repeat this process for any other domains you host:

    {{< file "/etc/apache2/sites-available/example.org.conf" aconf >}}
<Directory /var/www/html/example.org/public_html>
        Require all granted
</Directory>

<VirtualHost *:80>
     ServerAdmin webmaster@example.org
     ServerName example.org
     ServerAlias www.example.org
     DocumentRoot /var/www/html/example.org/public_html
     ErrorLog /var/www/html/example.org/logs/error.log
     CustomLog /var/www/html/example.org/logs/access.log combined
</VirtualHost>

{{< /file >}}

1.  Assign ownership of `public_html` directory to the user `www-data`:

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html

1. Set the permissions for the `public_html` directory:

        sudo chmod -R 755 /var/www/html/example.com/public_html

1.  Link your virtual host file from the `sites-available` directory to the `sites-enabled` directory:

        sudo a2ensite example.com
        sudo a2ensite example.org

    {{< note respectIndent=false >}}
If you need to disable a site, you can use issue the following command:

    sudo a2dissite example.com
    {{< /note >}}

1.  Disable the default virtual host to minimize security risks:

        sudo a2dissite 000-default.conf

1.  Restart Apache:

        sudo systemctl restart apache2


## MariaDB

MariaDB is a *relational database management system* (RDBMS) and is a popular component of many applications.

### Install MariaDB

1.  Install MariaDB:

        sudo apt-get install mariadb-server

    Input a secure password when prompted by the installation.

1.  Run `mysql_secure_installation` to remove the test database and any extraneous user permissions added during the initial installation process:

        sudo mysql_secure_installation

    It is recommended that you select yes (`y`) for all questions. If you already have a secure root password, you do not need to change it.

### Set Up a MariaDB Database

Next, you can create a database and grant your users permissions to use databases.

1.  Log in to MariaDB:

        sudo mysql -u root -p

    Enter MariaDB's root password when prompted.

1.  Create a database and grant your users permissions on it. Change the database name (`webdata`) and username (`webuser`). Change the password (`password`):

        create database webdata;
        grant all on webdata.* to 'webuser' identified by 'password';

1.  Exit MariaDB:

        quit

## PHP

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks.

### Install PHP

PHP 7.3 is the [latest version available](http://php.net/supported-versions.php) and has the longest period of support offered as of this guide's publishing:

1.  Install PHP, the PHP Extension and Application Repository, Apache support, and MySQL support:

        sudo apt install php7.3 libapache2-mod-php7.3 php-mysql

    Optionally, install additional cURL, JSON, and CGI support:

        sudo apt install php-curl php-json php-cgi


### Configure PHP

1.  Open `/etc/php/7.3/apache2/php.ini` in your text editor and edit the following values. These settings are optimized for the 2GB Linode:

    {{< file "/etc/php/7.3/apache2/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
error_log = /var/log/php/error.log
max_input_time = 30

{{< /file >}}


    {{< note respectIndent=false >}}
Ensure that all values are uncommented, by making sure they do not start with a semicolon (**;**).
{{< /note >}}

1.  Create the log directory for PHP and give ownership to the Apache user (`www-data`):

        sudo mkdir /var/log/php
        sudo chown www-data /var/log/php

    {{< note respectIndent=false >}}
If you plan on using your LAMP stack to host a WordPress server, install additional PHP modules: `sudo apt install php-gd php-mbstring php-xml php-xmlrpc`
    {{< /note >}}

1.  Restart Apache:

        sudo systemctl restart apache2

1. Visit your site's domain (or IP address). You should see Apache's default welcome page. Your LAMP stack should be installed and is ready to host your site files.

## Optional: Test and Troubleshoot the LAMP Stack

In this section, you'll create a test page that shows whether Apache can render PHP and connect to the MariaDB database. This can be helpful in locating the source of an error if one of the elements of your LAMP stack is not communicating with the others.

1.  Paste the following code into a new file, `phptest.php`, in the `public_html` directory. Modify `webuser` and `password` to match the information entered in the [Set Up a MariaDB Database](#set-up-a-mariadb-database) section above:

     {{< file "/var/www/html/example.com/public_html/phptest.php" php >}}
<html>
<head>
<title>PHP Test</title>
</head>
    <body>
    <?php echo '<p>Hello World</p>';

    // In the variables section below, replace user and password with your own MariaDB credentials as created on your server
    $servername = "localhost";
    $username = "webuser";
    $password = "password";

    // Create MariaDB connection
    $conn = mysqli_connect($servername, $username, $password);

    // Check connection - if it fails, output will include the error message
    if (!$conn) {
    die('<p>Connection failed: </p>' . mysqli_connect_error());
    }
    echo '<p>Connected successfully</p>';
    ?>
</body>
</html>

{{< /file >}}

1.  Navigate to `example.com/phptest.php` from your local machine. If the components of your LAMP stack are working correctly, the browser will display a "Connected successfully" message. If not, the output will be an error message.

1.  Remove the test file:

        sudo rm /var/www/html/example.com/public_html/phptest.php
