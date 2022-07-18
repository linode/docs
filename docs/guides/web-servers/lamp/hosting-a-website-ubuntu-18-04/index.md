---
slug: hosting-a-website-ubuntu-18-04
author:
  name: Linode
  email: docs@linode.com
description: 'In this guide, you will learn how to set up a LAMP (Linux, Apache, MySQL, PHP) stack and then configure a hosted website using Ubuntu 18.04.'
keywords: ["linode guide", "hosting a website", "website", "linode quickstart guide"]
tags: ["web server","php","mysql","ubuntu","apache","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/websites/hosting-a-website/','/hosting-website/', '/websites/hosting-a-website-ubuntu-18-04/']
modified: 2021-08-16
modified_by:
  name: Linode
published: 2012-03-13
title: How to Host a Website on Ubuntu 18.04
h1_title: Hosting a Website on Ubuntu 18.04
enable_h1: true
---

In this guide, you learn how to host a website on Ubuntu 18.04 using the LAMP stack (Linux, Apache, MySQL and PHP). First, you install the LAMP stack and then, you create or import a database. Finally, you upload files and add DNS records. By the time you reach the end of this guide, your Linode hosts one or more websites.

This guide is intended for small and medium-sized websites running on WordPress, Drupal, or another PHP content management system. If your website doesn't belong in that category, you need to assess your requirements and install custom packages tailored for your particular requirements.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, check the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Hosting an Apache Web Server on Ubuntu 18.04

Hosting a website starts with installing a *web server*, which is an application on your Linode that delivers content through the Internet. This section helps you get started with *Apache*, the world's most popular web server. For more information about Apache and other web servers, see the [guides on web servers](/docs/web-servers/).

If you are using Ubuntu 18.04, instead of installing each component separately, use *Tasksel* to install a LAMP stack on your Linode. When *Tasksel* completes, skip the installation steps in each section below and continue on to the configuration steps of each part of the stack:

    sudo tasksel install lamp-server

### Installing Apache Web Server on Ubuntu 18.04

Check for and install all system updates, and install Apache on your Linode:

    sudo apt update && sudo apt upgrade
    sudo apt install apache2

Your Linode downloads, installs, and starts the Apache web server.

### Optimize Apache Web Server for a Linode 2GB

Installing Apache is uncomplicated, but if you leave it running with the default settings, your server could run out of memory. That's why it's important to optimize Apache *before* you start hosting a website on your Linode.

These guidelines are designed to optimize Apache for a **Linode 2GB**, but you can use this information for any size Linode. These values are based on the amount of memory available. If you have a Linode 4GB, multiply all of the values by 2 and use those numbers for your settings.

1.  Make a copy of Apache's configuration file. You can restore the duplicate `apache2.backup.conf` file if anything happens to the configuration file:

        sudo cp /etc/apache2/apache2.conf /etc/apache2/apache2.backup.conf

1.  Open Apache's configuration file for editing:

        sudo nano /etc/apache2/apache2.conf

    This opens the file in `nano`, but you may use a text editor of your choice.

1.  Add this section to the end of the file:

    {{< file "/etc/apache2/apache2.conf" apache >}}
KeepAlive Off

   ...

   <IfModule mpm_prefork_module>
       StartServers 4
       MinSpareServers 20
       MaxSpareServers 40
       MaxClients 200
       MaxRequestsPerChild 4500
   </IfModule>
{{< /file >}}

1.  Save the changes to Apache's configuration file. If you are using `nano`, do this by pressing **CTRL+X** and then **Y**. Press **ENTER** to confirm.

1.  Restart Apache to incorporate the new settings:

        sudo systemctl restart apache2

You've successfully optimized Apache for your Linode, increasing performance and implementing safeguards to prevent excessive resource consumption. You're almost ready to host websites with Apache.

## Modifying Apache Firewall Settings

Before starting your Apache web server configuration, you should make changes to the firewall to enable access to ports. This is an optional step to restrict access to the Apache server. You can skip this step and start with the next step, but it is highly recommended for hosting a website in a production environment.

Apache comes with a few firewall profiles by default. To check which ones are installed on your Ubuntu 18.04 server, run the following command:

        sudo ufw app list

An output similar to the following appears:

{{< output >}}
Available applications:
Apache
Apache Full
Apache Secure
OpenSSH
{{< /output >}}

From the returned list of available applications the following information applies:

- Apache opens only port 80
- Apache Full can open both port 443 and port 80
- Apache Secure only opens port 443

To allow incoming traffic for a certain profile, use the `command sudo ufw allow <Apache ufw profile>`. For example, if you wish to enable the Apache profile, use the following command:

        sudo ufw allow Apache

Next, check if the Apache profile is enabled by running the following command:

        sudo ufw status

An output similar to the following appears:

{{< output >}}
Status: active

To                         	Action      	From
--                           ------            -----
OpenSSH                    	ALLOW       	Anywhere
Apache                    	ALLOW       	Anywhere
OpenSSH (v6)             	ALLOW       	Anywhere (v6)
Apache (v6)                	ALLOW       	Anywhere (v6)
{{< /output >}}

### Configure Name-based Virtual Hosts in Apache Web Server

Now that Apache is optimized for performance, it's time to starting hosting one or more websites. There are several possible methods of doing this. In this section, you use *name-based virtual hosts* to host websites in your home directory.

{{< note >}}
You should *not* be logged in as `root` while executing these commands. To learn how to create a new user account and log in as that user, see [Add a Limited User Account](/docs/guides/set-up-and-secure/#add-a-limited-user-account).
{{< /note >}}

1.  Disable the default Apache virtual host:

        sudo a2dissite *default

1.  Navigate to your /var/www/html directory:

        cd /var/www/html

1.  Create a folder to contain the files, logs, and backups of the website by replacing `example.com` with your domain name:

        sudo mkdir -p /var/www/html/example.com/{public_html,log,backups}

1.  Create the virtual host file for your website. Replace the `example.com` in `example.com.conf` with your domain name:

        sudo nano /etc/apache2/sites-available/example.com.conf

1.  Create a configuration file for your virtual host. Copy the basic settings in the following example and paste it into the virtual host file you just created. Replace all instances of `example.com` with your domain name:

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
# domain: example.com
# public: /var/www/html/example.com/public_html/

<VirtualHost *:80>
  # Admin email, Server Name (domain name), and any aliases
  ServerAdmin webmaster@example.com
  ServerName  example.com
  ServerAlias www.example.com

  # Index file and Document Root (where the public files are located)
  DirectoryIndex index.html index.php
  DocumentRoot /var/www/html/example.com/public_html
  # Log file locations
  LogLevel warn
  ErrorLog  /var/www/html/example.com/log/error.log
  CustomLog /var/www/html/example.com/log/access.log combined
</VirtualHost>
{{< /file >}}

1.  Save the changes to the virtual host configuration file by typing **CTRL+X** and then type **Y**. Press **ENTER** to confirm.

1.  Enable your new website, replacing `example.com` with your domain name:

        sudo a2ensite example.com.conf

    This creates a symbolic link to your `example.com.conf` file in the appropriate directory for active virtual hosts.

1.  Reload to apply your new configuration:

        sudo systemctl reload apache2

1. Repeat Steps 1-8 for any other websites you want to host on your Linode.

You've configured Apache to host one or more websites on your Linode. After you [upload files](#upload-files) and [add DNS records](#add-dns-records) later in this guide, your websites are accessible to the outside world.

## Hosting a Website on Ubuntu - Installing MySQL

Databases store data in a structured and easily accessible manner, serving as the foundation for hundreds of web and server applications. A variety of open source database platforms exist to meet the needs of applications running on your Linode. This section helps you get started with *MySQL*, one of the most popular database platforms. For more information about MySQL and other databases, see our [database reference guides](/docs/databases/).

### Install MySQL

1.  Install and automatically start the database MySQL server:

        sudo apt install mysql-server

1.  Secure MySQL using the `mysql_secure_installation` utility:

        sudo mysql_secure_installation

1.  The `mysql_secure_installation` utility appears. You are prompted to:

    - Set up the `VALIDATE PASSWORD` plugin that checks the strength of password and allows the users to set only those passwords which are secure enough.

    - Set a password for `root`.

    - Remove anonymous users.

    - Disallow remote root logins.

    - Remove the test database.

    It is recommended that you answer `yes` to these options. You can read more about the script in the [MySQL Reference Manual](https://dev.mysql.com/doc/refman/5.7/en/mysql-secure-installation.html).

MySQL is now installed and running on your Linode.

### Optimize MySQL for a Linode 2GB

MySQL consumes a lot of memory when using the default configuration. To set resource constraints, edit the MySQL configuration file.

If you have a Linode larger than 2GB, modify these values while carefully watching for memory and performance issues.

1.  Open the MySQL configuration file for editing:

        sudo nano /etc/mysql/my.cnf

1.  If applicable, comment out all lines beginning with `key_buffer` by adding a `#` to each. This is a deprecated setting and this guide uses the correct option instead.

1.  Add the following values:

    {{< file "/etc/mysql/my.cnf" aconf >}}
[mysqld]
max_allowed_packet = 1M
thread_stack = 128K
max_connections = 75
table_open_cache = 32M
key_buffer_size = 32M
{{< /file >}}

1.  Save the changes to MySQL's configuration file by typing **CTRL+X**, then typing **Y**, and finally hitting **ENTER** to save.

1.  Restart MySQL to save the changes:

        sudo systemctl restart mysql

Now that you've edited the MySQL configuration file, you're ready to start creating and importing databases.

### Create a Database

The first thing you need to do in MySQL is create a *database*. If you already have a database that you'd like to import, skip to the section [Import a Database](#import-a-database).

1.  Log in using the MySQL root password:

        sudo mysql -u root -p

1.  Create a database, replacing `exampleDB` with your own database name:

        CREATE DATABASE exampleDB;

1.  Create a new user in MySQL and grant that user permission to access the new database, replacing `example_user` with your username, and `password` with your password:

        GRANT ALL ON exampleDB.* TO 'example_user' IDENTIFIED BY 'password';

    {{< note >}}
MySQL usernames and passwords are only used by scripts connecting to the database. They do not need to represent actual user accounts on the system.
{{< /note >}}

1.  Reload the grant tables and exit MySQL:

        FLUSH PRIVILEGES;
        quit

Now you have a new database that you can use for your website. If you don't need to import a database, skip to the [PHP section](#php).

### Import a Database

If you have an existing website, you may want to import an existing database in to MySQL. It's easy and it allows you to have an established website up and running on your Linode in a matter of minutes.

1.  Upload the database file to your Linode. See the instructions in the [Upload Files](#upload-files) section.

1.  Import the database, replacing `username` with your MySQL username and `database_name` with the database name you want to import to. You are prompted for your MySQL password:

        mysql -u username -p database_name < FILE.sql

Your database is imported into MySQL.

## PHP

PHP is a general-purpose scripting language that allows you to produce dynamic and interactive webpages. Many popular web applications and content management systems, like WordPress and Drupal, are written in PHP. To develop or host websites using PHP, install the base package and a couple of modules.

### Install PHP

1.  Install the base PHP package and the PHP Extension and Application Repository:

        sudo apt install php php-pear

1.  Add the MySQL support extension for PHP:

        sudo apt install php-mysql

1. Add the PHP module for the Apache 2 webserver:

        sudo apt install libapache2-mod-php

### Optimize PHP for a Linode 2GB

Enable logging and tune PHP for better performance. Pay attention to the `memory_limit` setting. It controls how much memory is allocated to PHP.

If you have a Linode larger than 2GB, increase the memory limit to a larger value, like 256M.

1.  Open the PHP configuration files:

        sudo nano /etc/php/7.2/apache2/php.ini

1.  Verify that the following values are set. All of the lines listed below should be uncommented. Be sure to remove any semicolons (`;`) at the beginning of the lines:

    {{< file "/etc/php/7.0/apache2/php.ini" ini >}}
max_execution_time = 30
memory_limit = 128M
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
display_errors = Off
log_errors = On
error_log = /var/log/php/php_errors.log

{{< /file >}}

    {{< note >}}
The 128M setting for `memory_limit` is a general guideline. While this value should be sufficient for most websites, larger websites and some web applications may require 256 megabytes or more.
{{< /note >}}

1.  Save the changes by pressing `Control-X` and then `Y`. Hit `Enter` to confirm the changes.

1.  Create the `/var/log/php/` directory for the PHP error log:

        sudo mkdir -p /var/log/php

1.  Change the owner of the `/var/log/php/` directory to `www-data`:

        sudo chown www-data /var/log/php

1.  Restart Apache to load the PHP module:

        sudo service apache2 restart

PHP is now installed on your Linode and configured for optimal performance.

## Upload Files

You've successfully installed Apache, MySQL, and PHP. Now it's time to upload a website to your Linode. This is one of the last steps before you "flip the switch" and publish your website on the Internet.

1.  If you haven't done so already, download and install an SFTP capable client on your computer. Linode recommends using the [FileZilla](/docs/guides/filezilla/) SFTP client. Follow the instructions in that guide to connect to your Linode.

1.  Upload your website's files to the `/var/www/html/example.com/public_html` directory. Replace `example.com` with your domain name.

    If you configured multiple name-based virtual hosts, don't forget to upload the files for the other websites to their respective directories.

If you're using a content management system like WordPress or Drupal, you may need to configure the appropriate settings file to point the content management system to the MySQL database.

## Hosting Multiple Websites on Ubuntu 18.04

In this guide so far, you have used `example.com.conf` to host our website `example.com`. If you would like to host an additional website on this same Ubuntu server, follow the instructions below.

1.  Add another virtual host for your second website. To do this, copy the existing *example.com* virtual host file to use as a base for your new site.

        sudo cp /etc/apache2/sites-available/example.com.conf /etc/apache2/sites-available/example2.com.conf

1.  Open the new virtual host file for *example2.com*.

        sudo nano /etc/apache2/sites-available/example2.com.conf

1.  Replace the contents of this file with the following example or, alternatively, adjust the existing file as needed.

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
# domain: example2.com
# public: /var/www/html/example2.com/public_html/

<VirtualHost *:80>
  # Admin email, Server Name (domain name), and any aliases
  ServerAdmin webmaster@example2.com
  ServerName  example2.com
  ServerAlias www.example2.com

  # Index file and Document Root (where the public files are located)
  DirectoryIndex index.html index.php
  DocumentRoot /var/www/html/example2.com/public_html
  # Log file locations
  LogLevel warn
  ErrorLog  /var/www/html/example2.com/log/error.log
  CustomLog /var/www/html/example2.com/log/access.log combined
</VirtualHost>
{{< /file >}}

1.  Place the new website's files under the directory you've defined above. The example uses `/var/www/html/example2.com/public_html/`.

1.  Enable your new website by using the command below.

        sudo a2ensite example2.com

1.  After the second virtual host is enabled, restart your Apache web server.

        sudo systemctl reload apache2

## Test your Website Hosted on Ubuntu 18.04

It's a good idea to test your website(s) before you add the DNS records. This is your last chance to check everything and make sure that it looks good before it goes live.

1.  Enter your Linode's IP address in a web browser (e.g., type `http://192.0.2.0` in the address bar, replacing the example IP address with your own). Your website should load in the web browser.

    {{< note >}}
  If you have configured a firewall on your Linode, ensure your firewall rules allow traffic to your Apache web server. For more information on configuring firewall rules on Ubuntu, see [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/).
    {{</ note >}}

1.  If you plan on hosting multiple websites, you can test the virtual hosts by editing the `hosts` file on your local computer. Check out the [Previewing Websites Without DNS](/docs/guides/previewing-websites-without-dns/) guide for more information.

1.  Test the name-based virtual hosts by entering the domain names in the address bar of the web browser on a local device. Your websites should load in the web browser.

    {{< caution >}}
Remember to remove the entries for the name-based virtual hosts from your `hosts` file when you're ready to test the DNS records.
{{< /caution >}}

## Next Steps

Now that you have tested your website by visiting its IP address, you can create DNS records so that you can access the website with a domain name. Read the [DNS Manager guide](/docs/guides/dns-manager/) for more information on how to add DNS records for your website. After you have a domain name set up, you should also add reverse DNS. Check out our [Reverse DNS guide](/docs/guides/configure-your-linode-for-reverse-dns/) for more information on how to set up reverse DNS.
