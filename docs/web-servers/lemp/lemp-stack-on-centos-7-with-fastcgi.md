---
author:
    name: Linode
    email: docs@linode.com
description: This guide will teach you how to install a LEMP stack (Linux, Nginx, MariaDB, and PHP) with fastcgi on CentOS 7.
keywords: ["nginx", "lemp", "php", "fastcgi", "linux", "web applications", " CentOS"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/lemp-guides/centos-7/','websites/lemp/lemp-server-on-centos-7-with-fastcgi/','web-servers/lemp/lemp-server-on-centos-7-with-fastcgi/']
modified: 2014-12-11
modified_by:
    name: Ryan Arlan
published: 2014-12-11
title: Install a LEMP Stack on CentOS 7 with FastCGI
external_resources:
- '[Basic Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration/)'
- '[Nginx Documentation](http://nginx.org/en/docs/)'
- '[MariaDB Knowledgebase](https://mariadb.com/kb/en/)'
- '[MariaDB and MySQL compatibility](https://mariadb.com/kb/en/mariadb/mariadb-vs-mysql-compatibility/)'
---

This document describes how to install a Linux, Nginx (pronounced engine-x), MariaDB and PHP server, also called LEMP stack, on CentOS 7 with php-fastcgi. It includes configuring php-fastcgi as a service in systemd for easier administration.

Make sure that before starting this guide you have read through and completed our [Getting Started](/docs/getting-started/) guide.

## Set the hostname

Before you install any packages, ensure that your hostname is correct by completing the [Setting Your Hostname](/docs/getting-started#setting-the-hostname) section of the Getting Started guide. Issue the following commands to verify:

    hostname
    hostname -f

In the first example, the hostname command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## System Setup

Make sure your system is up to date using yum:

    yum update

This ensures that all software is up to date and running at the latest version.

## Install Nginx from the EPEL

The quickest and easiest way to install Nginx is from the Extra Packages for Enterprise Linux (EPEL) repository.  You can install this using rpm:

    sudo yum install epel-release
    yum update
    yum install nginx

This installs the EPEL repository, pulls the metadata from the new repository, and then installs Nginx.

## Configure Nginx

### Start Nginx with systemd

After installing Nginx it needs to be enabled and started in systemd. You can do this with the systemctl command:

    systemctl enable nginx.service
    systemctl start nginx.service

You can then check the status to make sure it is running at any time:

    systemctl status nginx.service

### Configure Nginx Virtual Hosts

Once Nginx is installed, you need to configure your 'server' directives to specify your server blocks.  Each server block needs to have a server and location directive.  You can do this multiple ways, either through different server block files or all in the `/etc/nginx/nginx.conf` file.  In this example, we will use the multiple file approach.  By default, Nginx uses the `/etc/nginx/conf.d directory`, and will include any files ending in `.conf`:

{{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
listen  80;
server_name www.example.com example.com;
access_log /var/www/example.com/logs/access.log;
error_log /var/www/example.com/logs/error.log;

location / {
    root  /var/www/example.com/public_html;
    index index.html index.htm index.php;
    }
}

{{< /file-excerpt >}}


Any additional websites you like to host can be added as new files in the `/etc/nginx/conf.d/` directory.  Once you set the configuration, you need to make the directories for your public html files, and your logs:

    mkdir -p /var/www/example.com/{public_html,logs}

Once you have configured your virtual hosts, you'll need to restart nginx for your changes to be implemented:

    systemctl restart nginx.service

# Deploy PHP with FastCGI

If you are using PHP code with your application, you will need to implement "PHP-FastCGI" in order to allow Nginx to properly handle and parse PHP code.  You can install this via YUM from the EPEL repository that was previously installed:

    yum install php-cli php spawn-fcgi

Once PHP-FastCGI is installed, you will need to create a script to start and control the php-cgi process.  Create the `/usr/bin/php-fastcgi` file in your favorite editor and place the following lines into the file:

{{< file-excerpt "/usr/bin/php-fastcgi" bash >}}
#!/bin/sh
if [ `grep -c "nginx" /etc/passwd` = "1" ]; then
    FASTCGI_USER=nginx
elif [ `grep -c "www-data" /etc/passwd` = "1" ]; then
    FASTCGI_USER=www-data
elif [ `grep -c "http" /etc/passwd` = "1" ]; then
    FASTCGI_USER=http
else
# Set the FASTCGI_USER variable below to the user that
# you want to run the php-fastcgi processes as

FASTCGI_USER=
fi

/usr/bin/spawn-fcgi -a 127.0.0.1 -p 9000 -C 6 -u $FASTCGI_USER -f /usr/bin/php-cgi

{{< /file-excerpt >}}


Once the `/usr/bin/php-fastcgi` file has been created, you need to make sure the script is executable:

    chmod +x /usr/bin/php-fastcgi

You can then run the file manually, or for easier administration, you can set up a systemd service.

### Configure PHP-FastCGI as a service

When PHP-FastCGI is installed it does not automatically get set up as a service in systemd. If you want to be able to more easily control PHP-FastCGI with systemd, you can configure PHP-FastCGI as a systemd service. To do this, you need to create a service file that points to the /usr/bin/php-fastcgi file you created:

{{< file "/etc/systemd/system/php-fastcgi.service" ini >}}
[Unit]
Description=php-fastcgi systemd service script

[Service]
Type=forking
ExecStart=/usr/bin/php-fastcgi start

[Install]
WantedBy=multi-user.target

{{< /file >}}


Once the file has been created, you will need to reload the systemd daemons, enable the service, then start it:

    systemctl daemon-reload
    systemctl enable php-fastcgi.service
    systemctl start php-fastcgi.service

Now PHP-FastCGI is installed as a systemd service!

## Install MariaDB

Last but not least, your LEMP stack needs a database.  MySQL is no longer supported in CentOS 7, so you need to use MySQL's drop in replacement, MariaDB.

1.  You can install this directly from the repositories:

        yum install mariadb-server

2.  Once the installation is complete, you can use it the same way you use MySQL. First however, you must enable and start it in systemd:

        systemctl enable mariadb.service
        systemctl start mariadb.service

3.  MariaDB installs with default information and no root password, so it is highly recommend to secure your installation using the build in mysql_secure_installation command:

        mysql_secure_installation

4.  You can follow the on screen prompts to remove the default information and set the root password for your mysql installation.  Once you set the root password you can log in start adding data:

        mysql -u root -p

5.  Enter the root password then you can issue the following commands to create the 'mydomain' and 'myuser' database and user.  You then grant full permissions to the 'mydomain' database for the 'myuser' login:

        CREATE DATABASE mydomain;
        CREATE USER 'myuser' IDENTIFIED BY 'MyPassword';
        GRANT ALL PRIVILEGES ON mydomain.* to 'myuser';
        exit

    You can edit the name of the user, database, and password to what you would like it to be.  You can then configure your application to use that database, username, and password to insert data.

Congratulations!  You now have a fully functioning and working LEMP stack on CentOS 7!
