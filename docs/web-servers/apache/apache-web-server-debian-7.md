---
author:
  name: Linode
  email: docs@linode.com
description: 'Install Apache on your Debian 7 server, configure virtual hosting, and set up module and scripting support.'
keywords: ["apache", "apache 2", "debian", "debian 7", "wheezy", "apache web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/installation/debian-7-wheezy/','websites/apache/apache-2-web-server-on-debian-7-wheezy/','websites/apache/how-to-install-and-configure-the-apache-web-server-on-debian-7-wheezy/','websites/apache/apache-web-server-debian-7/']
modified: 2014-01-10
modified_by:
  name: Linode
published: 2013-09-05
title: 'Apache Web Server on Debian 7 (Wheezy)'
external_resources:
 - '[Apache HTTP Server Version 2.2 Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[Apache Configuration](/docs/web-servers/apache/configuration/)'
 - '[Tuning Your Apache Sever](/docs/websites/apache-tips-and-tricks/tuning-your-apache-server)'
---

The *Apache HTTP Web Sever* (Apache) is an open source web application for deploying web servers. This tutorial explains how to install and configure the Apache web server on Debian 7 (Wheezy).

Note that if you're looking to install a full LAMP (Linux, Apache, MySQL and PHP) stack, you may want to consider using our [LAMP guide for Debian 7](/docs/websites/lamp/lamp-server-on-debian-7-wheezy).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

-   Make sure you've followed the [Getting Started](/docs/getting-started/) guide.
-   As part of the Getting Started guide, make sure you [set the hostname](/docs/getting-started#setting-the-hostname) for your server.

    Issue the following commands to make sure your hostname is set properly:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

-   Update your system:

        sudo apt-get update && apt-get upgrade

## Install Apache

1.  Install the Apache 2 web server, its documentation, and a collection of utilities:

        sudo apt-get install apache2 apache2-doc apache2-utils

3.  Edit the main Apache configuration file to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

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



### Configure Apache for Virtual Hosting

Apache supports *name-based virtual hosting*, which allows you to host multiple domains on a single server with a single IP.

1.  Disable the default virtual host:

        sudo a2dissite default

2.  Each virtual host needs its own configuration file in the `/etc/apache2/sites-available/` directory. Create the file for **example.com**, called `/etc/apache2/sites-available/example.com.conf`, with the following content. Be sure to replace **example.com** with your own domain name.

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/example.com/public_html/
     ErrorLog /var/www/example.com/logs/error.log
     CustomLog /var/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


    {{< note >}}
If you would like to enable Perl support, add the following lines to the `VirtualHost` entry, right above the closing `</VirtualHost>` tag:

{{< file-excerpt "> /etc/apache2/sites-available/example.com.conf" apache >}}
Options ExecCGI
AddHandler cgi-script .pl
{{< /note >}}

{{< /file-excerpt >}}

    >

3.  Create the directories for **example.com's** website files and logs:

        sudo mkdir -p /var/www/example.net/public_html
        sudo mkdir /var/www/example.net/logs

6.  Enable the sites by issuing these commands:

        sudo a2ensite example.com.conf

7.  Restart the Apache server to initialize all the changes:

        sudo service apache2 restart

Congratulations! You have now installed Apache on your Debian Linode and configured it for virtual hosting.

## Apache Modules and Scripting

### Install Apache Modules

One of Apache's strengths is its ability to be customized with modules. The default installation directory for Apache modules is the `/etc/apache2/mods-available/` directory.

1.  List the available modules:

        sudo apt-cache search libapache2*

2.  Install a module:

        sudo apt-get install [module-name]

    Modules, after being installed, should be enabled and ready to use, although you may need to apply additional configuration options depending on the module. Consult the [Apache module documentation](http://httpd.apache.org/docs/2.0/mod/) for more information regarding the configuration of specific modules.


### Install Support for Scripting

The following commands install Apache support for server-side scripting in PHP, Ruby, Python, and Perl. Support for these languages is optional based on your server environment.

To install:

-   Ruby support:

        sudo apt-get install libapache2-mod-ruby

-   Perl support:

        sudo apt-get install libapache2-mod-perl2

-   Python support:

        sudo apt-get install libapache2-mod-python

-   MySQL in Python support:

        sudo apt-get install python-mysqldb
