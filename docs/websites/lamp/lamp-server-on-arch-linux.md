---
deprecated: false
author:
    name: Alex Fornuto
    email: afornuto@linode.com
description: 'Creating a LAMP (Linux, Apache, MySQL, PHP) stack on an Arch Linux-powered Linode.'
keywords: 'arch lamp,arch linux lamp,lamp linux,arch linode,archlinux lamp,archlinux'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['lamp-guides/arch-linux/','lamp-guides/arch-linux-10-2013/']
modified: Tuesday, October 21, 2014
modified_by:
    name: Alex Fornuto
published: 'Monday, October 7th, 2013'
title: LAMP Server on Arch Linux
---

Arch Linux is a contemporary minimalist Linux distribution. It was started in 2002 in an effort to provide a clean, lightweight distribution of the Linux operating system. Arch uses a rolling release system, which means that Arch eschews specific distribution versions in favor of the ability to bring any system up to date with a simple `pacman -Syu` command.

As a result, Arch Linux is a great distribution for users who want or need to run the most up-to-date versions of their software packages and libraries. Arch's [package management tool](/docs/using-linux/package-management), [pacman](https://wiki.Arch%20Linux.org/index.php/Pacman), is clean and coherent.

Because of its minimalist underpinnings and focus on simplicity, many users find it easy to gain a deep understanding of how Arch systems work. It's great for people who want to learn more about the inner workings of a Linux system, or even go on to develop environments and applications on top of Arch Linux.

This guide contains step-by-step instructions for installing a full-featured LAMP stack on an Arch Linux system, which includes Apache, MySQL, and PHP. This stack sets you up with a solid web server. If you feel that you don't need MySQL or PHP, please don't feel obligated to install them.

Arch Linux doesn't come in specific versions. This guide is current as of 2014-10-01.

{: .note }
>
> Throughout this guide we will offer several suggested values for specific configuration settings. Some of these values will be set by default. These settings are shown in the guide as a reference, in the event that you change these settings to suit your needs and then need to change them back.

Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#sph_setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install and Configure the Apache Web Server
-------------------------------------------

The Apache Web Server is a very popular choice for serving web pages. While many alternatives have appeared in the last few years, Apache remains a powerful option that we recommend for most uses.

1. Make sure your system is up to date by issuing the following command:

        pacman -Syyu

2. To install the current version of the Apache web server (2.4 as of the writing of this article) use the following command:

        pacman -Syu apache

3. Configurations directives for Apache are contained in the `httpd.conf` file, which is located at `/etc/httpd/conf/httpd.conf`. We advise you to make a backup of this file into your home directory, like so:

        cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup

    There are additional Apache configuration files, which are included near the end of the `httpd.conf` file, and referenced in the `/etc/httpd/conf/extra/` directory. You may also choose to include additional files in your Apache configuration using a similar syntax. Regardless of how you choose to organize your configuration files, making regular backups of known working states is highly recommended.

4. Edit the httpd-mpm.conf Apache configuration file in /etc/httpd/conf/extras/ to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 1GB**.

    {: .file }
    /etc/httpd/conf/extra/httpd-mpm.conf
    :   ~~~ apache
        <IfModule mpm_prefork_module>
        StartServers 2
        MinSpareServers 6
        MaxSpareServers 12
        MaxRequestWorkers 80
        MaxRequestsPerChild 3000
        </IfModule>
        ~~~

5. Edit the httpd-default.conf file to turn KeepAlives off.

    {: .file }
    /etc/httpd/conf/extra/httpd-default.conf
    :   ~~~ apache
        KeepAlive Off
        ~~~

### Enable Starting Apache at Boot

Unless configured to do so, Arch will not instruct Apache to start when the system boots or reboots. To ensure that this happens, we'll need to add `httpd` to the list of daemons started by systemd at boot:

    systemctl enable httpd.service

### Prepare Apache for Virtual Hosting

Now we'll configure virtual hosting so that we can host multiple domains (or subdomains) with the server. These websites can be controlled by different users, or by a single user, as you prefer.

1. Begin by defining the default site. Edit the line that reads `DocumentRoot /srv/http` so that it reads:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~
        DocumentRoot "/srv/http/default"
        ~~~

2. Now, uncomment (remove the leading `#` character) line that reads `Include  conf/extra/httpd-vhosts.conf` near the end of the `/etc/httpd/conf/httpd.conf` file, like so:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ apache
        Include conf/extra/httpd-vhosts.conf
        ~~~

All of the configuration for the specific virtual hosting setups will be combined in a single file called `httpd-vhosts`, located in the `/etc/httpd/conf/extra/` directory. Open this file in your favorite text editor, and we'll begin by setting up virtual hosts.

### Configure Name-based Virtual Hosts

There are different ways to set up Virtual Hosts, however we recommend the method below. By default, Apache listens on all IP addresses available to it.

1. First, we will create virtual host entries for each site that we need to host with this server; we'll want to replace the existing `VirtualHost` blocks with ones that resemble the following. We'll use "example.com" and "example.org" as example sites.

    {: .file-excerpt }
    /etc/httpd/conf/extra/httpd-vhosts.conf
    :   ~~~ apache
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

        <VirtualHost *:80> 
             ServerAdmin webmaster@example.org     
             ServerName example.org
             ServerAlias www.example.org
             DocumentRoot /srv/http/example.org/public_html/
             ErrorLog /srv/http/example.org/logs/error.log 
             CustomLog /srv/http/example.org/logs/access.log combined
                    <Directory />
                       Order deny,allow
                       Allow from all
                    </Directory>
        </VirtualHost>
        ~~~

    Notes regarding this example configuration:

    - All of the files for the sites that you host will be located in directories that exist underneath `/srv/http`. You can symbolically link these directories into other locations if you need them to exist in other places.
    - `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

2. Before you can use the above configuration, you'll need to create the specified directories. You can do this with the following commands:

       mkdir /srv/http/default        

       mkdir -p /srv/http/example.com/public_html
       mkdir -p /srv/http/example.com/logs

       mkdir -p /srv/http/example.org/public_html
       mkdir -p /srv/http/example.org/logs

3. After you've set up your virtual hosts, issue the following command to run Apache for the first time:

       systemctl start httpd.service

Assuming that you have configured DNS for your domain to point to your Linode's IP address, Virtual hosting for your domain should now work. Remember that you can create as many virtual hosts with Apache as you need.

Anytime you change an option in your `httpd-vhosts.conf` file, or any other Apache configuration directive, remember to reload the configuration with the following command:

    systemctl reload httpd.service

Install and Configure MySQL Database Server
-------------------------------------------

MySQL is a relational database management system (RDBMS), and is a popular component in contemporary web development tool chains. Many popular applications, including WordPress and Drupal, use MySQL as their primary database. Arch Linux has chosen MariaDB as the default MySQL implementation, pushing Oracle MySQL to the [AUR](https://aur.Arch%20Linux.org/packages/mysql/). For the purposes of this guide, we will be using MariaDB.

### Install MariaDB

By default, Arch Linux provides MariaDB as a relational database solution. MariaDB is an open source drop-in replacement for MySQL, and all system commands that reference `mysql` are compatible with it.

Install the `mariadb`, `mariadb-clients` and `libmariadbclient` packages:

    pacman -Syu mariadb mariadb-clients libmariadbclient

### Enable Starting MySQL at Boot

Issue the following command to start mysql at boot:

    systemctl enable mysqld.service

### Configure MySQL and Set Up MySQL databases

We need to edit the MySQL configuration file located at `/etc/mysql/my.cnf` so that MySQL only listens to connections on the loopback interface (localhost).

1. Add the line `bind-address=127.0.0.1` to the `[mysqld]` block.

    {: .file-excerpt}
    /etc/mysql/my.cnf
    :   ~~~
        # The MariaDB server
        [mysqld]
        bind-address=127.0.0.1
        port            = 3306
        ~~~
    
2. After installing MySQL, run `mysql_secure_installation`, a program that helps secure MySQL. `mysql_secure_installation` gives you the option to set your root password, disable root logins from outside localhost, remove anonymous user accounts, remove the test database and then reload the privilege tables. 

    You will need to start MySQL before running the program:

       systemctl start mysqld.service

    Run the following command to execute the program:

       mysql_secure_installation

3. Next, we'll create a database and grant your users permission to use it. First, log in to MySQL:

       mysql -u root -p

    `-u <user>` specifies the user, and `-p` will prompt you for the password. Enter MySQL's root password, and you'll be presented with a prompt where you can issue SQL statements to interact with the database.

4. To create a database and grant your users permissions on it, issue the following command. Note that the semi-colons (`;`) at the end of the lines are crucial for ending the commands. Your command should look like this:

       CREATE DATABASE webdata;
       GRANT ALL ON lollipop.* TO 'webuser' IDENTIFIED BY '5t1ck';

    In this example `webdata` is the name of the database, `webuser` is the username, and `5t1ck` is the user's password. Note that database usernames and passwords do not correlate to system user accounts.

5. With that completed, you've successfully configured MySQL and you may now pass these database credentials on to your users. To exit the MySQL database administration utility, issue the following command:

       QUIT

With Apache and MySQL installed, you are now ready to move on to installing PHP to provide scripting support for your web application.

Installing and Configuring PHP
------------------------------

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Furthermore, many popular web applications like WordPress are written in PHP. If you want to be able to develop your websites using PHP, you must first install it.

1. Install PHP using pacman:

       pacman -Syu php php-apache

2. Once PHP is installed we'll need to tune the configuration file located in `/etc/php/php.ini` for better error messages and logs, and better performance. These modifications provide a good starting point if you're unfamiliar with PHP configuration.

    Make sure that the following values are set and relevant lines are uncommented (comments are lines beginning with a semi-colon (`;`)):

    {: .file-excerpt }
    /etc/php/php.ini
    :   ~~~ ini
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        display_errors = Off 
        log_errors = On 
        error_log = /var/log/php/error.log
        max_execution_time = 30 
        memory_limit = 128M
        extension=mysql.so
        max_input_time = 30
        ~~~

3. You will need to create the log directory for PHP and give the Apache user ownership:

       mkdir /var/log/php
       chown http /var/log/php

4. We'll need to enable the PHP module in the `/etc/httpd/conf/httpd.conf` file by adding the following lines in the appropriate sections:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ apache
        LoadModule php5_module modules/libphp5.so
        
        Include conf/extra/php5_module.conf

        AddType application/x-httpd-php .php
        AddType application/x-httpd-php-source .phps
        ~~~
5. While in that file, comment out the line `LoadModule mpm_event_module modules/mod_mpm_event.so` by adding a `#` in front:

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ apache
        #LoadModule mpm_event_module modules/mod_mpm_event.so
        ~~~

6. With this completed, restart the httpd service:

       systemctl restart httpd.service

At this point, PHP should be fully functional.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Arch Linux Wiki](http://wiki.Arch%20Linux.org/)
- [Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)
- [MySQL Documentation](http://dev.mysql.com/doc/)
- [Oracle MySQL and MariaDB Comparison](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)
- [PHP Documentation](http://www.php.net/docs.php)
