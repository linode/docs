---
author:
    name: Joel Kruger
    email: docs@linode.com
description: 'Create a LAMP stack on a CentOS 7 Linode.'
keywords: ["LAMP", "CentOS", "CentOS 7", "apache", "mysql", "php", "centos lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-06-21
modified_by:
    name: Edward Angert
published: 2015-12-01
title: LAMP on CentOS 7
aliases: ['websites/lamp/lamp-server-on-centos-7/','websites/lamp/lamp-on-centos-7/']
external_resources:
 - '[CentOS Linux Home Page](http://www.centos.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[MariaDB Documentation](https://mariadb.com/kb/en/mariadb/documentation/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

![LAMP on CentOS 7](lamp-on-centos-7-title-graphic.jpg "LAMP on CentOS 7")

A *LAMP stack* is a particular bundle of software packages commonly used for hosting web content. The bundle consists of Linux, Apache, MySQL, and PHP. This guide shows how to install a LAMP stack on a CentOS 7 Linode.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#set-the-hostname).

    To check your hostname, run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo yum update

## Apache

### Install and Configure

1.  Install Apache 2.4:

        sudo yum install httpd

2.  Edit `httpd.conf` and add the code below to turn off KeepAlive and adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

    {{< note >}}
Before changing any configuration files, it is advised that you make a backup of the file. To make a backup:

    cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup
{{< /note >}}

    {{< file "/etc/httpd/conf/httpd.conf" aconf >}}
KeepAlive Off


<IfModule prefork.c>
    StartServers        4
    MinSpareServers     20
    MaxSpareServers     40
    MaxClients          200
    MaxRequestsPerChild 4500
</IfModule>

{{< /file >}}

    These settings can also be added to a separate file if so desired. The file must be located in the `conf.module.d` or `conf.d` directories, and must end in `.conf`.

### Configure Name-based Virtual Hosts

There are different ways to set up virtual hosts; however, the method below is recommended.

1.  Within the `conf.d` directory create a file named `vhost.conf` to store your virtual host configurations. The example below is a template for website `example.com`; change the necessary values for your domain:

    {{< file "/etc/httpd/conf.d/vhost.conf" aconf >}}
NameVirtualHost *:80

<VirtualHost *:80>
    ServerAdmin webmaster@example.com
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/html/example.com/public_html/
    ErrorLog /var/www/html/example.com/logs/error.log
    CustomLog /var/www/html/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


    Additional domains can be added to the `vhost.conf` file as needed.

    {{< note >}}
`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.
{{< /note >}}

2.  Create the directories referenced above:

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}

### Configure SELinux to Allow HTTP

SELinux is enabled by default on CentOS 7 Linodes. Its default setting is to restrict Apache's access to directories until explicit permissions are granted.

Without these steps, Apache will not start and may give the following error:

{{< output >}}
Jun 21 17:58:09 example.com systemd[1]: Failed to start The Apache HTTP Server.
Jun 21 17:58:09 example.com systemd[1]: Unit httpd.service entered failed state.
Jun 21 17:58:09 example.com systemd[1]: httpd.service failed.
{{< /output >}}

1.  Use `chown` to make `apache` the owner of the web directory:

        sudo chown apache:apache -R /var/www/html/example.com/

2.  Modify the permissions for files and directories:

        cd /var/www/html/example.com/
        find . -type f -exec sudo chmod 0644 {} \;
        find . -type d -exec sudo chmod 0755 {} \;

3.  Use SELinux's `chcon` to change the file security context for web content:

        sudo chcon -t httpd_sys_content_t /var/www/html/example.com -R
        sudo chcon -t httpd_sys_rw_content_t /var/www/html/example.com -R

4.  Enable Apache to start at boot, and restart the service for the above changes to take place:

        sudo systemctl enable httpd.service
        sudo systemctl restart httpd.service

    Visit your domain or public IP to test the Apache server and view the default Apache page.

### Configure FirewallD to Allow HTTP Connections

FirewallD is enabled for CentOS 7 Linodes, but HTTP is not included in the default set of services:

    sudo firewall-cmd --zone=public --list-services
{{< output >}}
ssh dhcpv6-client
{{< /output >}}

To allow connections to Apache, add HTTP as a service:

    sudo firewall-cmd --zone=public --add-service=http --permanent
    sudo firewall-cmd --zone=public --add-service=http

## MySQL / MariaDB

### Install and Configure

MySQL is replaced with MariaDB in CentOS 7. MariaDB is a popular drop-in replacement for MySQL.

{{< note >}}
If you prefer to use the MySQL branded database in CentOS 7, you will need to add the required repositories by issuing the following command:

    sudo yum install http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm
{{< /note >}}

1.  Install the MariaDB-server package:

        sudo yum install mariadb-server

2.  Set MariaDB to start at boot and start the daemon for the first time:

        sudo systemctl enable mariadb.service
        sudo systemctl start mariadb.service

3.  Run `mysql_secure_installation` to secure MariaDB. You will be given the option to change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases and reload privileges. It is recommended that you answer yes to these options:

        sudo mysql_secure_installation

### Create a MySQL/MariaDB Database

1.  Log in to MariaDB:

        mysql -u root -p

    Enter MariaDB’s root password. You will get the MariaDB prompt.

2.  Create a new database and user with permissions to use it:

        create database webdata;
        grant all on webdata.* to 'webuser' identified by 'password';

    In the above example `webdata` is the name of the database, `webuser` the user, and `password` a strong password.

5.  Exit MariaDB

        quit

With Apache and MariaDB installed, you are now ready to move on to installing PHP to provide scripting support for your web pages.


## PHP

###  Install and Configure

1.  Install PHP:

        sudo yum install php php-pear

    If you wish to install MySQL support for PHP also install the `php-mysql` package:

        sudo yum install php-mysql


2.  Edit `/etc/php.ini` for better error messages and logs, and upgraded performance. These modifications provide a good starting point for a **Linode 2GB**:

    {{< file "/etc/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
error_log = /var/log/php/error.log
max_input_time = 30

{{< /file >}}


    {{< note >}}
Ensure that all lines noted above are uncommented. A commented line begins with a semicolon (**;**).
{{< /note >}}

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown apache /var/log/php

4.  Reload Apache:

        sudo systemctl reload httpd
