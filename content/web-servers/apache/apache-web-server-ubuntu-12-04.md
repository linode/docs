---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Install Apache on your Ubuntu 12.04 Server, configure virtual hosting, and set up module and scripting support.'
keywords: ["apache", "ubuntu", "ubuntu 12.04", "precise", "pengolin", "apache web server", "web server", ""]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-07-15
aliases: ['web-servers/apache/installation/ubuntu-12-04-precise-pangolin/','websites/apache/apache-2-web-server-on-ubuntu-12-04-lts-precise-pangolin/','websites/apache/how-to-install-and-configure-apache-2-web-server-on-ubuntu-12-04-lts-precise-pangolin/','websites/apache/apache-web-server-ubuntu-12-04/']
modified_by:
  name: Linode
published: 2012-10-10
title: 'Apache Web Server on Ubuntu 12.04 LTS (Precise Pangolin)'
external_resources:
 - '[Apache HTTP Server Version 2.2 Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[Apache Configuration](/docs/web-servers/apache/configuration/)'
---

The *Apache HTTP Web Server* (Apache) is an open source web application for running web servers.  This guide explains how to install and configure an Apache web server on Ubuntu 12.04 LTS.

If instead you would like to install a full LAMP (Linux, Apache, MySQL and PHP) stack, please see the [LAMP on Ubuntu 12.04](/docs/websites/lamp/lamp-server-on-ubuntu-12-04-precise-pangolin) guide.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade


## Install Apache

1.  Install the Apache 2 web server, its documentation, and a collection of utilities:

        sudo apt-get install apache2 apache2-doc apache2-utils

2.  Edit the main Apache configuration file to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

    {{< file "/etc/apache2/apache2.conf" aconf >}}
KeepAlive Off

...

<IfModule mpm_prefork_module>
    StartServers        4
    MinSpareServers     20
    MaxSpareServers     40
    MaxClients          200
    MaxRequestsPerChild 4500
</IfModule>

{{< /file >}}



### Configure Virtual Hosting

Apache supports *name-based virtual hosting*, which allows you to host multiple domains on a single server with a single IP. Although there are different ways to set up virtual hosts, the method below is recommended.

1.  Disable the default Apache virtual host:

        sudo a2dissite 000-default.conf

2.  Create an `example.com.conf` file in `/etc/apache2/sites-available` with your text editor, replacing instances of `example.com` with your own domain URL in both the configuration file and in the file name:

    {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/example.com/public_html/
     ErrorLog /var/www/example.com/logs/error.log
     CustomLog /var/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


    Repeat this process for any other domains you host.

    {{< note >}}
If you would like to enable Perl support, add the following lines above the closing `</VirtualHost>` tag:

{{< file-excerpt "/etc/apache2/sites-available/example.com.conf" aconf >}}
Options ExecCGI
AddHandler cgi-script .pl
{{< /note >}}

{{< /file-excerpt >}}



3.  Create directories for your websites and websites' logs, replacing `example.com` with your own domain information:

        sudo mkdir -p /var/www/example.com/public_html
        sudo mkdir /var/www/example.com/logs

6.  Enable the site:

        sudo a2ensite example.com.conf

7.  Restart Apache:

        sudo systemctl restart apache2


## Apache Mods and Scripting

### Install Apache Modules

One of Apache's strengths is its ability to be customized with modules. The default installation directory for Apache modules is the `/etc/apache2/mods-available/` directory.

1.  List available Apache modules:

        sudo apt-cache search libapache2*

2.  Install any desired modules:

        sudo apt-get install [module-name]

3.  All mods are located in the `/etc/apache2/mods-avaiable` directory. Edit the `.conf` file of any installed module if needed, then enable the module:

        sudo a2enmod [module-name]

    To disable a module that is currently enabled:

        a2dismod [module-name]


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

-   PHP support:

        sudo apt-get install libapache2-mod-php5 php5 php-pear php5-xcache

-   `php5-suhosin`, for additional PHP security:

        sudo apt-get install php5-suhosin

-   PHP with MySQL:

        sudo apt-get install php5-mysql
