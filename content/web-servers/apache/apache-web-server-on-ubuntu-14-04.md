---
author:
  name: Linode
  email: docs@linode.com
description: 'Install Apache on your Ubuntu 14.04 (Trusty Tahr) server, configure virtual hosting, and set up modules and scripting.'
keywords: ["apache", "ubuntu", "ubuntu 14.04", "trusty tahr", "http", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/apache/apache-web-server-on-ubuntu-14-04/']
modified: 2017-09-05
modified_by:
  name: Linode
published: 2015-07-31
title: 'Apache Web Server on Ubuntu 14.04 LTS'
external_resources:
 - '[Apache HTTP Server Version 2.4 Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[Apache Configuration](/docs/web-servers/apache/configuration/)'
---

![apache_ubuntu_banner](/docs/assets/Apache_Web_Server_on_Ubuntu_1404_LTS_smg.jpg)

The *Apache HTTP Web Sever* (Apache) is an open source web application for deploying web servers. This guide explains how to install and configure an Apache web server on Ubuntu 14.04 LTS.

If instead you would like to install a full LAMP (Linux, Apache, MySQL and PHP) stack, please see the [LAMP on Ubuntu 14.04](/docs/websites/lamp/lamp-server-on-ubuntu-14-04) guide.

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

1.  Install Apache 2.4, its documentation, and a collection of utilities:

        sudo apt-get install apache2 apache2-doc apache2-utils

2.  Edit the main Apache configuration file and turn off the `KeepAlive` setting:

    {{< file-excerpt "/etc/apache2/apache2.conf" >}}
KeepAlive Off

{{< /file-excerpt >}}


### Configure the Multi-Processing Module

Apache 2.4 offers various multi-processing modules (MPMs) to handle connections. The default MPM is the *event module*, although the *prefork module* is still recommended if you’re using standard PHP.

#### The Prefork Module

1.  Open `/etc/apache2/mods-available/mpm_prefork.conf` in your text editor and edit the values as needed. The following is optimized for a 2GB Linode:

    {{< file "/etc/apache2/mods-available/mpm_prefork.conf" aconf >}}
# prefork MPM
# StartServers: number of server processes to start
# MinSpareServers: minimum number of server processes which are kept spare
# MaxSpareServers: maximum number of server processes which are kept spare
# MaxRequestWorkers: maximum number of server processes allowed to start
# MaxConnectionsPerChild: maximum number of requests a server process serves

<IfModule mpm_prefork_module>
        StartServers              4
        MinSpareServers           20
        MaxSpareServers           40
        MaxRequestWorkers         200
        MaxConnectionsPerChild    4500
</IfModule>

{{< /file >}}


2.  On Ubuntu 14.04, the *event module* is enabled by default. Disable it, and enable the *prefork module* :

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

3.  Restart Apache:

        sudo service apache2 restart

#### The Event Module

If you choose to keep the *event module* enabled, these settings are suggested for a 2GB Linode.

1.  Open `/etc/apache2/mods-available/mpm_event.conf` in your text editor and edit the values as needed:

    {{< file "/etc/apache2/mods-available/mpm_event.conf" aconf >}}
# event MPM
# StartServers: initial number of server processes to start
# MinSpareThreads: minimum number of worker threads which are kept spare
# MaxSpareThreads: maximum number of worker threads which are kept spare
# ThreadsPerChild: constant number of worker threads in each server process
# MaxRequestWorkers: maximum number of worker threads
# MaxConnectionsPerChild: maximum number of requests a server process serves
<IfModule mpm_event_module>
        StartServers             2
        MinSpareThreads          25
        MaxSpareThreads          75
        ThreadLimit              64
        ThreadsPerChild          25
        MaxRequestWorkers        150
        MaxConnectionsPerChild   3000
</IfModule>

{{< /file >}}


2.  Restart Apache:

        sudo service apache2 restart


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

        sudo service apache2 restart


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


### Optional: Install Support for Scripting

The following commands install Apache support for server-side scripting in PHP, Ruby, Python, and Perl. Support for these languages is optional based on your server environment.

To install:

-   Perl support:

        sudo apt-get install libapache2-mod-perl2

-   Python support:

        sudo apt-get install libapache2-mod-python

-   PHP support:

        sudo apt-get install libapache2-mod-php5 php5 php-pear php5-xcache
