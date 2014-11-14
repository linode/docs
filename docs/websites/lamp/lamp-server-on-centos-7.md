---
author:
  name: Joel Kruger
  email: jkruger@linode.com
description: 'Creating a LAMP stack on a CentOS 7 Linode.'
keywords: 'LAMP,CentOS,CentOS 7'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, Novemeber 10th, 2014
modified_by:
  name: Joel Kruger
published: 'Monday, Novemeber 10th, 2014'
title: LAMP Server on CentOS 7
---

This guide provides step-by-step instructions for installing a full-featured LAMP stack on a CentOS 7 system.

In this guide, you will be instructed on setting up Apache, MariaDB, and PHP. Please note: the CentOS 7 Project has elected to replace the `init` service management daemon with the newer, `systemd` daemon for this latest release. In addition, this release of CentOS ships with MariaDB repositories instead of MySQL. If you would prefer to use the more traditional MySQL instead, there are instructions provided below to use those repositories as well.

 {: .note }
>
> Throughout this guide we will offer several suggested values for specific configuration settings. Some of these values will be set by default. These settings are shown in the guide as a reference, in the event that you change these settings to suit your needs and then need to change them back.

## Prerequisites

Your Linode should already be set up according to the instructions in our [Getting Started](/docs/getting-started) guide.

As a friendly reminder, since you will be exposing your server (and content) to the rest of the world, it is an excellent choice to implement some security precautions. For assistance with this, please see our documentation: [Securing Your Server](https://linode.com/docs/security/securing-your-server)

{: .note}
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

### Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](https://www.linode.com/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install and Configure the Apache Web Server
-------------------------------------------

The Apache Web Server is a very popular choice for serving web pages. While many alternatives have appeared in the last few years, Apache remains a powerful option that we recommend for most uses.

1. Update existing packages:

        sudo yum update

2. Install the current version of the Apache web server (in the 2.x series):

        sudo yum install httpd

3. The configuration for Apache is contained in the `httpd.conf` file, which is located at: `/etc/httpd/conf/httpd.conf`. We advise you to make a backup of this file into your home directory, like so:

        cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup

    {: .note}
    > By default all files ending in the `.conf` extension in `/etc/httpd` and `/etc/httpd/conf.d/` are treated as Apache configuration files, and we recommend placing your non-standard configuration options in files in these directories. Regardless how you choose to organize your configuration files, making regular backups of known working states is highly recommended.

4. Edit the main Apache configuration file to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 1GB**.

    {: .file }
    /etc/httpd/conf/httpd.conf
    :   ~~~ apache
        KeepAlive Off

        ...

        <IfModule prefork.c>
        StartServers 2
        MinSpareServers 6
        MaxSpareServers 12
        MaxClients 80
        MaxRequestsPerChild 3000
        </IfModule>
        ~~~

Now we'll configure virtual hosting so that we can host multiple domains (or subdomains) with the server. These websites can be controlled by different users, or by a single user, as you prefer.

Before we get started, we suggest that you combine all configuration on virtual hosting into a single file called `vhost.conf` located in the `/etc/httpd/conf.d/` directory. Open this file in your favorite text editor, and we'll begin by setting up virtual hosting.

### Configure Name-based Virtual Hosts

There are different ways to set up virtual hosts, however we recommend the method below. By default, Apache listens on all IP addresses available to it.

5.  Now we will create virtual host entries for each site that we need to host with this server. Here are two examples for sites at "example.com" and "example.org".

      {: .file-excerpt }
      /etc/httpd/conf.d/vhost.conf
      :   ~~~ apache
        NameVirtualHost *:80

        <VirtualHost *:80> 
            ServerAdmin webmaster@example.com
            ServerName example.com
            ServerAlias www.example.com
            DocumentRoot /srv/www/example.com/public_html/
            ErrorLog /srv/www/example.com/logs/error.log 
            CustomLog /srv/www/example.com/logs/access.log combined
        </VirtualHost>

        <VirtualHost *:80> 
            ServerAdmin webmaster@example.org     
            ServerName example.org
            ServerAlias www.example.org
            DocumentRoot /srv/www/example.org/public_html/
            ErrorLog /srv/www/example.org/logs/error.log 
            CustomLog /srv/www/example.org/logs/access.log combined
          </VirtualHost>
          ~~~

Notes regarding this example configuration:

-   All of the files for the sites that you host will be located in directories that exist underneath `/srv/www` You can symbolically link these directories into other locations if you need them to exist in other places.
-   `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

6. Before you can use the above configuration you’ll need to create the specified directories. For the above configuration, you can do this by issuing the following commands:

        sudo mkdir -p /srv/www/example.com/public_html
        sudo mkdir /srv/www/example.com/logs

        sudo mkdir -p /srv/www/example.org/public_html
        sudo mkdir /srv/www/example.org/logs

7. After you’ve set up your virtual hosts, you can issue the following commands to enable Apache to start on boot and run it, for the first time:

        sudo /bin/systemctl enable httpd.service
        sudo /bin/systemctl start httpd.service 

Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work. Remember that you can create as many virtual hosts with Apache as you need.

Anytime you change an option in your `vhost.conf` file, or any other Apache configuration file, remember to reload the configuration with the following command:

        sudo /bin/systemctl reload httpd.service 

Install and Configure MariaDB Database Server
-------------------------------------------

MariaDB is a relational database management system (RDBMS) and ships by default in CentOS 7. MariaDB is a popular component in contemporary web development tool-chains. It is used to store data for many popular applications, including Wordpress and Drupal. If you instead, would prefer to use the MySQL branded database in CentOS 7, you will need to add the required repositories by issuing the following command:


        sudo yum install http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm 

### Install MariaDB

1. The first step is to install the MariaDB-server package, which is accomplished by the following command:

        sudo yum install mariadb-server  

2. CentOS 7 provides version 10.1.1 of MariaDB. Before you can use MariaDB some configuration is required. If you want to run MariaDB by default when the system boots, which is a typical setup, execute the following command:

        sudo /bin/systemctl enable mariadb.service

3. Now you can start the MariaDB daemon (`mariadb`) with the following command:

        sudo /bin/systemctl start mariadb.service

4. At this point MariaDB should be ready to configure and run. While you shouldn't need to change the configuration file, note that it is located at `/etc/my.cnf` for future reference. The default values should be fine for a **Linode 1GB**, but if you decide to adjust them you should first make a backup copy:

        cp /etc/my.cnf ~/my.cnf.backup

### Configure MariaDB and Set Up MariaDB databases

5. After installing MariaDB, it’s recommended that you run `mysql_secure_installation`, a program that helps secure MariaDB. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases and reload privileges. It is recommended that you answer yes to these options. Run the following command to execute the program:

        mysql_secure_installation

6. Next, we'll create a database and grant your users permissions to use databases. First, log in to MariaDB:

        mysql -u root -p

Enter MariaDB’s root password, and you’ll be presented with a prompt where you can issue SQL statements to interact with the database.

In the example below, `example_database_name` is the name of the database, `example_user` is used as the username, and `example_password` is used as the password for the root account on this newly established database. You should replace all three of these parameters to reflect your unique circumstances. It is recommended to create both a root and one additional user account within your database. This practice is beneficial since, it is better not to use root on your server unless absolutely necessary.

7. Now, to create a new database and grant your users permissions on it, issue the following commands. Note, the semi-colons (`;`) at the end of the lines are crucial for ending the commands. Your commands should look similar to the following:

        create database example_database_name;
        grant all on example_database_name.* to 'example_user'@'localhost' identified by 'example_password';

8. Note that database user names and passwords are only used by scripts connecting to the database, and that database user account names need not (and perhaps should not) represent actual user accounts on the system. If you need to create additional users in the database you just created, simply run the command below, as like before:

        grant all on example_database_name.* to 'example_user'@'localhost' identified by 'example_password';

9. With that completed you’ve successfully configured MariaDB and you may now pass these database credentials on to your users. To exit the MariaDB database administration utility issue the following command:

        quit;

With Apache and MariaDB installed you are now ready to move on to installing PHP to provide scripting support for your web pages.

Installing and Configuring PHP
------------------------------

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Furthermore, many popular web applications like WordPress are written in PHP. If you want to be able to develop your websites using PHP, you must first install it.

1. CentOS includes packages for installing PHP from the terminal. Issue the following command:

        sudo yum install php php-pear

Once PHP5 is installed we'll need to tune the configuration file located in `/etc/php.ini` to enable more descriptive errors, logging, and better performance. These modifications provide a good starting point if you're unfamiliar with PHP configuration.

2. Make sure that the following values are set, and relevant lines are uncommented (comments are lines beginning with a semi-colon (`;`)):

  {: .file-excerpt }
  /etc/php.ini
  :   ~~~ ini
      error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
      display_errors = Off 
      log_errors = On 
      error_log = /var/log/php/error.log
      max_execution_time = 30 
      memory_limit = 128M
      register_globals = Off
      max_input_time = 30
      ~~~

3. You will need to create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown apache /var/log/php

4. If you need support for MariaDB in PHP, then you must install the php5-mysql package with the following command:

        sudo yum install php-mysql

5. After making changes to PHP, restart Apache by issuing the following command:

        sudo /bin/systemctl reload httpd

Wonderful, you should now have a fully functioning LAMP stack on your CentOS 7 Linode! From here, you can serve up tons of delicious content to your eager followers on the internet. If you are interested in setting up a wordpress site on your new LAMP stack, please consider reviewing this tutorial: [Manage Web Content with WordPress](https://www.linode.com/docs/websites/cms/manage-web-content-with-wordpress).

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [CentOS Linux Home Page](http://www.centos.org/)
- [Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)
- [MariaDB Documentation](https://mariadb.com/kb/en/mariadb/documentation/)
- [PHP Documentation](http://www.php.net/docs.php)


