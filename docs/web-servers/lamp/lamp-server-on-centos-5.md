---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Creating a LAMP stack on a CentOS 5 Linode.'
keywords: ["LAMP", "CentOS", "CentOS 5"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lamp-guides/centos-5/','websites/lamp/lamp-server-on-centos-5/']
modified: 2011-07-19
modified_by:
  name: Linode
published: 2009-10-19
title: LAMP Server on CentOS 5
external_resources:
  - '[CentOS Linux Home Page](http://www.centos.org/)'
  - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
  - '[MySQL Documentation](http://dev.mysql.com/doc/)'
  - '[PHP Documentation](http://www.php.net/docs.php)'
---



This guide provides step-by-step instructions for installing a full-featured LAMP stack on a CentOS 5.6 system.

In this guide, you will be instructed on setting up Apache, MySQL, and PHP. If you don't feel that you will need MySQL or PHP, please don't feel obligated to install them.

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Install and Configure the Apache Web Server

The Apache Web Server is a very popular choice for serving web pages. While many alternatives have appeared in the last few years, Apache remains a powerful option that we recommend for most uses.

To install the current version of the Apache web server (in the 2.x series) use the following command:

    yum update
    yum install httpd

The configuration for Apache is contained in the `httpd.conf` file, which is located at: `/etc/httpd/conf/httpd.conf`. We advise you to make a backup of this file into your home directory, like so:

    cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup

By default all files ending in the `.conf` extension in `/etc/httpd/conf.d/` are treated as Apache configuration files, and we recommend placing your non-standard configuration options in files in these directories. Regardless how you choose to organize your configuration files, making regular backups of known working states is highly recommended.

Now we'll configure virtual hosting so that we can host multiple domains (or subdomains) with the server. These websites can be controlled by different users, or by a single user, as you prefer.

Before we get started, we suggest that you combine all configuration on virtual hosting into a single file called `vhost.conf` located in the `/etc/httpd/conf.d/` directory. Open this file in your favorite text editor, and we'll begin by setting up virtual hosting.

### Configure Name-based Virtual Hosts

There are different ways to set up Virtual Hosts, however we recommend the method below. By default, Apache listens on all IP addresses available to it.

Now we will create virtual host entries for each site that we need to host with this server. Here are two examples for sites at "example.com" and "example.org".

{{< file-excerpt "/etc/httpd/conf.d/vhost.conf" apache >}}
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

{{< /file-excerpt >}}


Notes regarding this example configuration:

-   All of the files for the sites that you host will be located in directories that exist underneath `/srv/www` You can symbolically link these directories into other locations if you need them to exist in other places.
-   `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

Before you can use the above configuration you'll need to create the specified directories. For the above configuration, you can do this with the following commands:

    mkdir -p /srv/www/example.com/public_html
    mkdir /srv/www/example.com/logs

    mkdir -p /srv/www/example.org/public_html
    mkdir /srv/www/example.org/logs

After you've set up your virtual hosts, issue the following command to run Apache for the first time:

    /etc/init.d/httpd start

Assuming that you have configured the DNS for your domain to point to your Linode's IP address, Virtual hosting for your domain should now work. Remember that you can create as many virtual hosts with Apache as you need.

If you want to run Apache by default when the system boots, which is a typical setup, execute the following command:

    /sbin/chkconfig --levels 235 httpd on

Use the `chkconfig` command to setup [runlevels](http://en.wikipedia.org/wiki/Runlevel) as needed.

Anytime you change an option in your `vhost.conf` file, or any other Apache configuration remember to reload the configuration with the following command:

    /etc/init.d/httpd reload

## Install and Configure MySQL Database Server

MySQL is a relational database management system (RDBMS) and is a popular component in contemporary web development tool-chains. It is used to store data for many popular applications, including Wordpress and Drupal.

### Install MySQL

The first step is to install the mysql-server package, which is accomplished by the following command:

    yum install mysql-server

In CentOS 5.3 this provides version 5.0.45 of MySQL. Before you can use MySQL some configuration is required.

If you want to run MySQL by default when the system boots, which is a typical setup, execute the following command:

    /sbin/chkconfig --levels 235 mysqld on

Now you can start the mysql daemon (`mysqld`) with the following command (as root):

    /etc/init.d/mysqld start

At this point MySQL should be ready to configure and run. While you shouldn't need to change the configuration file, note that it is located at `/etc/my.cnf` for future reference.

### Configure MySQL and Set Up MySQL databases

After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

Next, we'll create a database and grant your users permissions to use databases. First, log in to MySQL:

    mysql -u root -p

Enter MySQL's root password, and you'll be presented with a prompt where you can issue SQL statements to interact with the database.

To create a database and grant your users permissions on it, issue the following command. Note, the semi-colons (`;`) at the end of the lines are crucial for ending the commands. Your command should look like this:

    create database lollipop;
    grant all on lollipop.* to 'foreman' identified by '5t1ck';

In the example above, `lollipop` is the name of the database, `foreman` is the username, and `5t1ck` password. Note that database user names and passwords are only used by scripts connecting to the database, and that database user account names need not (and perhaps should not) represent actual user accounts on the system.

With that completed you've successfully configured MySQL and you may now pass these database credentials on to your users. To exit the MySQL database administration utility issue the following command:

    quit

With Apache and MySQL installed you are now ready to move on to installing PHP to provide scripting support for your web pages.

## Installing and Configuring PHP

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Furthermore, many popular web applications like WordPress are written in PHP. If you want to be able to develop your websites using PHP, you must first install it.

CentOS includes packages for installing PHP from the terminal. Issue the following command:

    yum install php php-pear

Once PHP5 is installed we'll need to tune the configuration file located in `/etc/php.ini` to enable more descriptive errors, logging, and better performance. These modifications provide a good starting point if you're unfamiliar with PHP configuration.

Make sure that the following values are set, and relevant lines are uncommented (comments are lines beginning with a semi-colon (`;`)):

{{< file-excerpt "/etc/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php.log
max_execution_time = 300
memory_limit = 64M
register_globals = Off

{{< /file-excerpt >}}


If you need support for MySQL in PHP, then you must install the php5-mysql package with the following command:

    yum install php-mysql
