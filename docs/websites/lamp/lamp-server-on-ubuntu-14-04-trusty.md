---
author:
  name: Joel Kruger
  email: jkruger@linode.com
description: 'Creating a LAMP stack on a Ubuntu 14.04 LTS Linode.'
keywords: 'LAMP,Ubuntu,Ubuntu 14.04 LTS,LTS,14.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, February 2nd, 2015
modified_by:
  name: Joel Kruger
published: 'Monday, February 23rd, 2015'
title: LAMP Server on Ubuntu 14.04 LTS
---

This guide provides step by step instructions for installing a full featured LAMP stack on an Ubuntu 14.04 (Trusty Tahr) system. The 14.04 release is the most current LTS (long term support) version of the Ubuntu operating system, and will be supported with security updates until April of 2019.

In this guide, you'll learn how to set up Apache, MySQL, and PHP. If you don't need MySQL or PHP, please don't feel obligated to install them.

 {: .note }
> For this LAMP guide it was decided that using PHP-FPM is preferred over prefork MPM for performance benefits.
 
 {: .note }
> Throughout this guide we will offer several suggested values for specific configuration settings. Some of these values will be set by default. These settings are shown in the guide as a reference, in the event that you change these settings to suit your needs and then need to change them back.

## Prerequisites

Your Linode should already be set up according to the instructions in our [Getting Started](/docs/getting-started) guide.

As a friendly reminder, since you will be exposing your server (and content) to the rest of the world, it is an excellent choice to implement some security precautions. For assistance with this, please see our documentation: [Securing Your Server](https://linode.com/docs/security/securing-your-server)

{: .note}
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#sph_setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install and Configure the Apache Web Server
-------------------------------------------

The Apache web server is a popular choice for serving web pages. While many alternatives have appeared in the last few years, Apache remains a powerful option that we recommend for most uses.

1. Make sure your package repositories and installed programs are up to date by issuing the following commands:

        sudo apt update
        sudo apt upgrade 

2. To install the current version of the Apache web server (in the 2.x series) on an Ubuntu system use the following command:

        sudo apt install apache2

3. Edit the main Apache configuration file to adjust the resource use settings.

{: .file }
/etc/apache2/apache2.conf
:   ~~~ apache
    KeepAlive On
    
    ~~~

Now we'll configure virtual hosting so that we can host multiple domains (or subdomains) with the server. These websites can be controlled by different users, or by a single user, as you prefer.

### Configure Name-based Virtual Hosts

There are different ways to set up virtual hosts, however we recommend the method below. By default, Apache listens on all IP addresses available to it.

1. First, create a file in the `/etc/apache2/sites-available/` directory for each virtual host that you want to set up. Name each file with the domain for which you want to provide virtual hosting, followed by `.conf`. See the following example configurations for the hypothetical "example.com" and "example.org" domains.

{: .file }
/etc/apache2/sites-available/example.com.conf
:   ~~~ apache
    <VirtualHost *:80> 
         ServerAdmin webmaster@example.com
         ServerName example.com
         ServerAlias www.example.com
         DocumentRoot /var/www/example.com/public_html/
         ErrorLog /var/www/example.com/logs/error.log 
         CustomLog /var/www/example.com/logs/access.log combined
    </VirtualHost>
    ~~~

{: .file }
/etc/apache2/sites-available/example.org.conf
:   ~~~ apache
    <VirtualHost *:80> 
         ServerAdmin webmaster@example.org     
         ServerName example.org
         ServerAlias www.example.org
         DocumentRoot /var/www/example.org/public_html/
         ErrorLog /var/www/example.org/logs/error.log 
         CustomLog /var/www/example.org/logs/access.log combined
    </VirtualHost>
    ~~~

Notes regarding this example configuration:

-   All of the files for the sites that you host will be located in directories that exist underneath `/srv/www` You can symbolically link these directories into other locations if you need them to exist in other places.
-   `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

2. Before you can use the above configuration you'll need to create the specified directories. For the above configuration, you can do this with the following commands:

        sudo mkdir -p /var/www/example.com/public_html
        sudo mkdir /var/www/example.com/logs

        sudo mkdir -p /var/www/example.org/public_html
        sudo mkdir /var/www/example.org/logs

3. After you've set up your virtual hosts, issue the following commands to symbolically link your virtual host file from `sites-available` to the `sites-enabled` directory:

        sudo a2ensite example.com.conf
        sudo a2ensite example.org.conf

4. Next, you should modify the permisstions of your `/var/www` directory to be sure that read access is given to the your web content in it's subdirectories. Issue the following comand:

        sudo chmod -R 755 /var/www

5. If you wanted to disable the `example.com` site, for example issue the following command:

        sudo a2dissite 000-default.conf

The `a2dissite` command is the inverse of `a2ensite`. After enabling, disabling, or modifying any part of your Apache configuration you will need to reload the Apache configuration again with the `/etc/init.d/apache2 reload` command. You can create as many virtual hosting files as you need to support the domains that you want to host with your Linode.


6. Finally, before you can access your sites you must reload Apache with the following command:

        sudo service apache2 reload

Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work.




Install and Configure the MySQL Database Server
-----------------------------------------------

MySQL is a relational database management system (RDBMS) and ships by default in Ubuntu 14.04, it is a popular component in contemporary web development tool-chains. It is used to store data for many popular applications, including Wordpress and Drupal.
### Install MySQL

1. The first step is to install the MySQL server package, which is accomplished by the following command:

        sudo apt install mysql-server php5-mysql

 {: .note }
>
> As of this writing, Ubuntu 14.04 provides version 5.5.41 of MySQL. Before you can use MySQL some configuration is required.

2. Create and Enter a password for MySQL’s root user, then you’ll be presented with a prompt where you can issue SQL statements to interact with the database.

3. At this point MySQL should be ready to configure and run. While you shouldn't need to change the configuration file, note that it is located at `/etc/mysql/my.cnf` for future reference. The default values should be fine for a **Linode 1GB**, but if you decide to adjust them you should first make a backup copy:

        sudo cp /etc/mysql/my.cnf ~/my.cnf.backup

### Configure MySQL and Set Up MySQL databases
 
 1. After installing MySQL, it’s recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases and reload privileges. It is recommended that you answer yes to these options but there is no obligation. Run the following command to execute the program:

        mysql_secure_installation

2. Next, we'll create a database and grant your users permissions to use databases. First, log in to MySQL:

        sudo mysql -u root -p
 
3. To create a new database and grant your users permissions on it, issue the following commands. Note, the semi-colons (`;`) at the end of the lines are crucial for ending the commands. Your commands should look similar to the following:

        create database example_database_name;
        grant all on example_database_name.* to 'example_user'@'localhost' identified by 'example_password';

4. Note that database user names and passwords are only used by scripts connecting to the database, and that database user account names need not (and perhaps should not) represent actual user accounts on the system. If you need to create additional users in the database you just created, simply run the command below, substituting the new user name and password where appropriate:

        grant all on example_database_name.* to 'example_user2'@'localhost' identified by 'example_password2';

5. With that completed, you’ve successfully configured MySQL. To exit the MySQL database administration utility issue the following command:

        quit

With Apache and MySQL installed you are now ready to move on to installing PHP to provide scripting support for your web pages.




Intall PHP5, PHP-FPM and Configuring them for use with Apache
-------------------------------
PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Furthermore, many popular web applications like WordPress are written in PHP. If you want to be able to develop your websites using PHP, you must first install it. 

1. Ubuntu includes packages for installing PHP5 with support for PHP5-FPM. From the terminal, issue the following command:

        sudo apt install libapache2-mod-fastcgi php5-fpm php5

2. We will now configure Apache to pass all requests for PHP files, with the _php_ file extension, to the PHP wrapper through FastCGI. Once PHP5 is installed we'll want to ensure that the PHP5-FPM module is enabled. Issue the following command to do this:

        sudo a2enmod actions fastcgi alias
        sudo a2enconf php5-fpm

3. It is best to configure PHP-FPM to use UNIX sockets instead of TCP. To verify if this is already the case, issue the following command in your terminal:

        sudo grep -E '^\s*listen\s*=\s*[a-zA-Z/]+' /etc/php5/fpm/pool.d/www.conf

    You should see the following output:

        listen = /var/run/php5-fpm.sock

    If you see the above output, skip to step 6.

3. If no output is returned, you will need to edit the following file and add this line:

    {: .file-excerpt } 
    etc/php5/fpm/pool.d/www.conf
    :   ~~~
        listen = /var/run/php5-fpm.sock
        ~~~

4. Find the following line and comment it out, if it is not already.

    {: .file-excerpt }
    /etc/php5/fpm/pool.d/www.conf
    :   ~~~
        listen = 127.0.0.1:9000
        ~~~

5. Restart the php5-fpm daemon for these changes to take effect.

        sudo service php5-fpm restart

6. Check for the version of Apache with the following command.

        apache2 -v

7. We will need to modify the file `fastcgi.conf`. As with all default configuration files, it is a good idea to back them up before modifying them in case you need to start over. Backup `fastcg.conf` by entering the following command:

        sudo cp /etc/apache2/mods-enabled/fastcgi.conf ~/fastcgi.conf.backup

8. Depending on your Apache version, edit the following file accordingly.

    **Apache 2.2 or earlier**

    {: .file-excerpt }
    /etc/apache2/mods-enabled/fastcgi.conf
    :   ~~~
        <IfModule mod_fastcgi.c>
         AddType application/x-httpd-fastphp5 .php
         Action application/x-httpd-fastphp5 /php5-fcgi
         Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
         FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -socket /var/run/php5-fpm.sock -pass-header Authorization
        </IfModule>
        ~~~

    **Apache 2.4 or later**

    {: .file-excerpt }
    /etc/apache2/mods-enabled/fastcgi.conf
    :   ~~~
        <IfModule mod_fastcgi.c>
         AddType application/x-httpd-fastphp5 .php
         Action application/x-httpd-fastphp5 /php5-fcgi
         Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
         FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -socket /var/run/php5-fpm.sock -pass-header Authorization
         <Directory /usr/lib/cgi-bin>
          Require all granted
         </Directory>
        </IfModule>
        ~~~

9. Save the file and check for configuration errors.

        sudo apache2ctl configtest

10. As long as you received _Syntax OK_ as a result of that command, restart the Apache service:

        sudo service apache2 restart

If you did not get the _Syntax OK_ result, check your configuration for errors.

11. Check if the PHP is working by creating and accessing a page with `phpinfo()` displayed. The following command will create info.php in /var/www (default directory for websites in Apache):

        sudo echo "<?php phpinfo(); ?>" > /var/www/info.php

 {: .note }
 >
 >If you get a permissions error, you may need to log in as the root user or change owner with `chown`.

Congratulations! You have now set up and configured a LAMP stack for Ubuntu 14.04 with support for Fast-cgi, using PHP-FPM.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Ubuntu Server Edition Homepage](http://www.ubuntu.com/products/whatisubuntu/serveredition)
- [Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)
- [MySQL Documentation](http://dev.mysql.com/doc/)
- [PHP-FPM Documentation](http://php.net/manual/en/install.fpm.php)
