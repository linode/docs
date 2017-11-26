---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Creating a LAMP stack with Apache, MySQL, and PHP on a Gentoo Linux powered Linode.'
keywords: ["LAMP", "Gentoo Linux", "Gentoo"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lamp-guides/gentoo/','websites/lamp/set-up-a-lamp-server-on-gentoo/']
modified: 2013-10-24
modified_by:
  name: Linode
published: 2011-12-02
title: Set Up a LAMP Server on Gentoo
external_resources:
  - '[Gentoo Documentation](http://www.gentoo.org/doc/en/index.xml)'
  - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
  - '[MySQL Documentation](http://dev.mysql.com/doc/)'
  - '[PHP Documentation](http://www.php.net/docs.php)'
---



This guide provides step-by-step instructions for installing a full-featured LAMP stack on a Gentoo Linux system.

In this guide, you will be instructed on setting up Apache, MySQL, and PHP. If you don't feel that you will need MySQL or PHP, please don't feel obligated to install them.

## Set the Hostname and Configure /etc/hosts

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    echo "HOSTNAME=\"titan\"" > /etc/conf.d/hostname
    /etc/init.d/hostname restart

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Next, edit your `/etc/hosts` file to resemble the following example, replacing "titan" with your chosen hostname, "example.com" with your system's domain name, and "12.34.56.78" with your Linode's IP address.

{{< file "/etc/hosts" apache >}}
127.0.0.1 localhost.localdomain localhost 12.34.56.78 titan.example.com titan
{{< /file >}}

If you have IPv6 enabled on your Linode, you will also want to add an entry for your IPv6 address, as shown in this example:

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost 12.34.56.78 titan.example.com titan 2600:3c01::a123:b456:c789:d012 titan.example.com titan
{{< /file >}}

The value you assign as your system's FQDN should have an "A" record in DNS pointing to your Linode's IPv4 address. For Linodes with IPv6 enabled, you should also set up a "AAAA" record in DNS pointing to your Linode's IPv6 address. For more information on configuring DNS, please see our guide on [configuring DNS with the Linode Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager).

## Install and Configure the Apache Web Server

Begin by making sure that your package repositories and installed programs are up to date by issuing the following commands:

    emerge --sync
    emerge --update world

Once this process has completed, issue the following command to install Apache:

    emerge www-servers/apache

Apache's main configuration file is located at `/etc/httpd/conf/httpd.conf`. Additional files are located in `/etc/apache2/modules.d/` and `/etc/apache2/vhosts.d/`.

Issue the following command to start Apache for the first time:

    /etc/init.d/apache2 start

If you would like Apache to start following the next reboot, issue the following command:

    rc-update add apache2 default

You will now need to configure virtual hosting in order to be able to serve content for multiple domains.

### Configure Virtual Hosts

By default, Apache listens on all available IP addresses. While this may be ideal for some setups, it's generally a good idea to manually specify which IPs you would like Apache to listen on.

Begin by replacing the existing `NameVirtualHost` line in the `/etc/apache2/vhosts.d/00_default_vhost.conf` so that it reads:

{{< file-excerpt "/etc/apache2/vhosts.d/00\_default\_vhost.conf" >}}
NameVirtualHost 12.34.56.78:80
{{< /file-excerpt >}}

Be sure to replace "12.34.56.78" with your Linode's public IP address.

There are numerous ways to configure virtual hosts, but we recommend that you do it in the following manner in order to keep them organized. We suggest creating a separate virtual hosting file for each site that you intended to configure in the `vhosts.d/` directory, in the form of `[site-name].conf`. For the "example" site, the path to the virtual hosting file would be `/etc/apache2/vhosts.d/example.conf`.

Now we will create virtual host entries for each site that we need to host with this server. We'll want to replace the existing `VirtualHost` blocks with ones that resemble the following.

{{< file "/etc/apache2/vhosts.d/example.conf" apache >}}
<VirtualHost 12.34.56.78:80>
     ServerAdmin username@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /srv/www/example.com/public_html/
     ErrorLog /srv/www/example.com/logs/error.log
     CustomLog /srv/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

Before you can use the above configuration, you'll need to create the specified directories. For the above configuration, you can do this with the following commands:

    mkdir -p /srv/www/example.com/public_html
    mkdir /srv/www/example.com/logs

After you've set up your virtual hosts, if you have not done so already, issue the following command Apache for the first time:

    /etc/init.d/apache2 start

Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work. Remember that you can create as many virtual hosts with Apache as you need.

Any time that you change an option in any of your Apache configuration files, remember to reload Apache with the following command:

    /etc/init.d/apache2 reload

## Install and Configure the MySQL Database Server

MySQL is a relational database management system (RDBMS) and is a popular component in contemporary web development tool-chains. It is used to store data for many popular applications, including Wordpress and Drupal.

### Install MySQL

The first step is to install the mysql-server package, which is accomplished by the following command:

    emerge dev-db/mysql

In Gentoo Linux this provides version 5.1.51 of MySQL. Before starting MySQL, the MySQL database needs to be installed. Run the following command:

    /usr/bin/mysql_install_db

If you are starting MySQL for the first time, issue the following command:

    /etc/init.d/mysql start

To ensure that the MySQL daemon starts during the boot process, issue the following command:

    rc-update add mysql default

At this point, MySQL should be ready to configure and run. While you shouldn't need to change the configuration file, note that it is located at `/etc/mysql/my.cnf` for future reference.

### Configure MySQL and Set Up Databases

After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

Next, we'll create a database and grant your users permissions to use databases. First, log in to MySQL:

    mysql -u root -p

Enter MySQL's root password, and you'll be presented with a prompt where you can issue SQL statements to interact with the database.

To create a database and grant your users permissions on it, issue the following command. Note, the semi-colons (`;`) at the end of the lines are crucial for ending the commands. Your command should look like this:

    create database lollipop;
    grant all on lollipop.* to 'foreman' identified by '5t1ck';

In the example above, `lollipop` is the name of the database, `foreman` is the username, and `5t1ck` password. Note that database user names and passwords are only used by scripts connecting to the database, and that database user account names need not (and perhaps should not) represent actual user accounts on the system.

With that completed, you've successfully configured MySQL and you may now pass these database credentials on to your users. To exit the MySQL database administration utility issue the following command:

    quit

With Apache and MySQL installed you are now ready to move on to installing PHP to provide scripting support for your web pages.

## Install and Configure PHP

PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. Furthermore, many popular web applications like WordPress are written in PHP. If you want to be able to develop your websites using PHP, you must first install it.

Gentoo includes portage scripts for installing PHP from the terminal. Issue the following command:

    USE="cli cgi apache2 xml" emerge 'dev-lang/php'

Before we can use PHP with Apache, we'll need to add the `-D PHP5` option in the `APACHE2_OPTS` setting in the `/etc/conf.d/apache2` file, if it isn't already set. This line should now resemble:

{{< file-excerpt "/etc/conf.d/apache2" >}}
APACHE2_OPTS="-D DEFAULT_VHOST -D INFO -D LANGUAGE -D SSL -D SSL_DEFAULT_VHOST -D PHP5"
{{< /file-excerpt >}}

Now, restart Apache with the following command:

    /etc/init.d/apache2 restart

Once PHP is installed and enabled, we'll need to tune the configuration file located in `/etc/php/apache2-php5/php.ini` to enable more descriptive errors, logging, and better performance. These modifications provide a good starting point if you're unfamiliar with PHP configuration.

Make sure that the following values are set, and relevant lines are uncommented (comments are lines beginning with a semi-colon (`;` character)):

{{< file-excerpt "/etc/php/apache2-php5.5/php.ini" >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php.log
max_execution_time = 300
memory_limit = 64M
register_globals = Off
{{< /file-excerpt >}}

If you decide to use PHP via the CGI interface later, you'll need to edit the `/etc/php/cgi-php5/php.ini` file.
