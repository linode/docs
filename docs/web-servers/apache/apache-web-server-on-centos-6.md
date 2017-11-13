---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Install Apache on your CentOS 6 server, configure virtual hosting, and set up mod and scripting support.'
keywords: ["Apache", "web sever", "CentOS 6", "centos", "apache 2", "httpd"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/installation/centos-6/','websites/apache/apache-2-web-server-on-centos-6/']
modified: 2015-07-31
modified_by:
  name: Elle Krout
published: 2013-11-11
title: Apache Web Server on CentOS 6
external_resources:
 - '[Apache HTTP Server Version 2.2 Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[Apache Configuration](/docs/web-servers/apache/configuration/)'
---

![Apache Web Server on CentOS 6](/docs/assets/apache-web-server-on-centos-6/Apache_Web_Server_smg.jpg)

The *Apache HTTP Server* (Apache) is an open-source web server application. This guide explains how to install and configure an Apache web server on CentOS 6.

If instead you would like to install a full LAMP (Linux, Apache, MySQL, and PHP) stack, please see the [LAMP on CentOS 6](/docs/websites/lamp/lamp-server-on-centos-6) guide.

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

        sudo yum update

## Install Apache

1.  Install the Apache HTTP Server:

        sudo yum install httpd

2.  Edit the main Apache configuration file to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

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


### Configure Apache for Virtual Hosting

1.  Create a file under `/etc/httpd/conf.d` named `vhost.conf`. Replace instances of `example.com` with your own domain information:

    {{< file-excerpt "/etc/httpd/conf.d/vhost.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin admin@example.org
     ServerName example.org
     ServerAlias www.example.org
     DocumentRoot /srv/www/example.org/public_html/
     ErrorLog /srv/www/example.org/logs/error.log
     CustomLog /srv/www/example.org/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


    Additional virtual host blocks can be added to the file for any other domains you wish to host on the Linode.

2.  Create the directories referenced above:

        sudo mkdir -p /srv/www/example.org/public_html
        sudo mkdir -p /srv/www/example.org/logs

3.  Start Apache:

        sudo service httpd start

4.  Set Apache to start at boot:

        sudo chkconfig httpd on


## Apache Mods and Scripting

### Install Apache Modules

By default, modules are located in the `/etc/httpd/modules/` directory. Configuration directives for the default modules are located in `/etc/httpd/conf/httpd.conf`, while configuration options for optional modules installed with yum are generally placed in `.conf` files in `/etc/httpd/conf.d/`.

1.  List available Apache modules:

        sudo yum search mod_

2.  Install any desired modules:

        sudo yum install mod_[module-name]

    Modules should be enabled and ready to use following installation


### Install Support for Scripting

The following commands install Apache support for server-side scripting in PHP, Python, and Perl. Support for these languages is optional based on your server environment.

To install:

-   Perl support:

        sudo yum install mod_perl

-   Python support:

        sudo yum install mod_wsgi

-   PHP support:

        sudo yum install php php-pear
