---
author:
  name: Linode
  email: docs@linode.com
description: 'How-to guide for getting started with the Apache web server on Debian 7 (Wheezy).'
keywords: 'apache debian 7,apache debian wheezy,linux web server,apache on debian,apache wheezy, install apache, configure apache'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-servers/apache/installation/debian-7-wheezy/','websites/apache/apache-2-web-server-on-debian-7-wheezy/']
modified: Friday, January 10th, 2014
modified_by:
  name: Linode
published: 'Thursday, September 5th, 2013'
title: 'How to Install and Configure the Apache web server on Debian 7 (Wheezy)'
external_resources:
 - '[Apache HTTP Server Version 2.2 Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[Apache Configuration](/docs/web-servers/apache/configuration/)'
---

This tutorial explains how to install and configure the Apache web server on Debian 7 (Wheezy).

Note that if you're looking to install a full LAMP stack, you may want to consider using our [LAMP guide for Debian 6](/docs/lamp-guides/debian-6-squeeze).

## Before You Begin

-   Make sure you've followed the [Getting Started](/docs/getting-started/) guide.
-   As part of the Getting Started guide, make sure you [set the hostname](/docs/getting-started#sph_set-the-hostname) for your server.

Issue the following commands to make sure your hostname is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

All of the commands in this article should be executed either as **root** or as a [user with sudo access](/docs/securing-your-server#sph_adding-a-new-user).

## Install Apache 2

1.  Make sure your package repositories and installed programs are up to date by issuing the following commands:

        apt-get update
        apt-get upgrade --show-upgraded

2.  Enter the following command to install the Apache 2 web server, its documentation, and a collection of utilities:

        apt-get install apache2 apache2-doc apache2-utils

3.  Edit the main Apache configuration file to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 1GB**.

        nano /etc/apache2/apache2.conf

    {: .file }
/etc/apache2/apache2.conf
    :   ~~~ apache
        KeepAlive Off

        ...

        <IfModule mpm_prefork_module>
        StartServers 2
        MinSpareServers 6
        MaxSpareServers 12
        MaxClients 80
        MaxRequestsPerChild 3000
        </IfModule>
        ~~~

## Optional: Install Support for Scripting

The following commands install Apache support for server-side scripting in PHP, Ruby, Python, and Perl. Support for these languages is optional based on your server environment.

To install Ruby support, issue the following command:

    apt-get install libapache2-mod-ruby

To install Perl support, issue the following command:

    apt-get install libapache2-mod-perl2 

To install Python support, issue the following command:

    apt-get install libapache2-mod-python 

If you need support for MySQL in Python, you will also need to install Python MySQL support:

    apt-get install python-mysqldb

Your PHP application may require additional dependencies included in Debian. To check for available PHP dependencies run this command:

    apt-cache search php

The output of that command will show you a list of package names and descriptions. To install them, issue the following command:

    apt-get install libapache2-mod-php5 php5 php-pear php5-xcache

If you want to run PHP with MySQL, then you should also install MySQL support:

    apt-get install php5-mysql

## Configure Apache for Named-Based Virtual Hosting

Apache supports *name-based virtual hosting*, which allows you to host multiple domains on a single server with a single IP. (IP-based hosting is also available.) In this example, you'll create two virtually hosted sites, example.net and example.org.

Follow these instructions:

1.  Run this command to disable the default Apache virtual host:

        a2dissite default

2.  Each virtual host needs its own configuration file in the `/etc/apache2/sites-available/` directory. Create the file for **example.net**, called `/etc/apache2/sites-available/example.net.conf`, with the following content. Be sure to replace **example.net** with your own domain name.

        nano /etc/apache2/sites-available/example.net.conf

    {: .file }
/etc/apache2/sites-available/example.net.conf
    :   ~~~ apache
        <VirtualHost *:80> 
             ServerAdmin webmaster@example.net     
             ServerName example.net
             ServerAlias www.example.net
             DocumentRoot /srv/www/example.net/public_html/
             ErrorLog /srv/www/example.net/logs/error.log 
             CustomLog /srv/www/example.net/logs/access.log combined
        </VirtualHost>
        ~~~

    {:.note}
    >
    > If you would like to enable Perl support, add the following lines to the `VirtualHost` entry, right above the closing `</VirtualHost>` tag:
    >
    > {: .file-excerpt }
/etc/apache2/sites-available/example.net.conf
    > :   ~~~ apache
    >     Options ExecCGI
    >     AddHandler cgi-script .pl
    >     ~~~
    >
3.  Now you'll make the configuration file for the second domain. Create the file for **example.org**, called `/etc/apache2/sites-available/example.org.conf`, with the following content. Be sure to replace **example.org** with your own domain name.

        nano /etc/apache2/sites-available/example.org.conf

    {: .file }
/etc/apache2/sites-available/example.org.conf
    :   ~~~ apache
        <VirtualHost *:80> 
             ServerAdmin admin@example.org
             ServerName example.org
             ServerAlias www.example.org
             DocumentRoot /srv/www/example.org/public_html/
             ErrorLog /srv/www/example.org/logs/error.log 
             CustomLog /srv/www/example.org/logs/access.log combined
        </VirtualHost>
        ~~~

    {:.note}
    >
    > Some basic options are specified for both **example.net** and **example.org**, including the location for the website files: under `/srv/www/`. You can add (or remove) additional configuration options, such as the Perl support shown in Step 2, on a site-by-site basis.

4.  Create the directories for **example.net's** website files and logs by executing the following commands:

        mkdir -p /srv/www/example.net/public_html
        mkdir /srv/www/example.net/logs

5.  Create the directories for **example.org's** website files and logs by executing the following commands:

        mkdir -p /srv/www/example.org/public_html
        mkdir /srv/www/example.org/logs

6.  Enable the sites by issuing these commands:

        a2ensite example.net.conf
        a2ensite example.org.conf

7.  Finally, restart the Apache server to initialize all the changes:

        /etc/init.d/apache2 restart

Note that whenever you create or edit any virtual host file, you'll need to reload Apache's configuration. You can do this without restarting the server with the following command:

    /etc/init.d/apache2 reload

Congratulations! You have now installed Apache on your Debian Linode and configured it for virtual hosting.

## Install Apache Modules

One of Apache's strengths is its ability to be customized with modules. The default installation directory for Apache modules is the `/etc/apache2/mods-available/` directory.

To get a list of available Apache modules in the Debian repository, run the following command:

    apt-cache search libapache2* 

To install one of these modules, run this command:

    apt-get install [module-name]

Modules, after being installed, should be enabled and ready to use, although you may need to apply additional configuration options depending on the module. Consult the [Apache module documentation](http://httpd.apache.org/docs/2.0/mod/) for more information regarding the configuration of specific modules.

An easy way to see which modules are installed is to run a list command on the directory:

    ls -al /etc/apache2/mods-available/

To enable an installed module, run the following command:

    a2enmod [module-name]

 {: .note }
>
> In the `/etc/apache2/mods-available/` directory, files have `.load` and `.conf` extensions. Module names do not include the extensions.

To disable a module that is currently enabled, run this command:

    a2dismod [module-name]

## Order of Configuration Options

In the default installation of Apache 2 on Debian, the main configuration file is `/etc/apache2/apache2.conf`. However, Apache loads configuration files directives from a number of other files as well, in a specific order. The configuration files are read in the following order, with *later* directives overriding earlier ones:

1.  `/etc/apache2/apache2.conf`
2.  Files with `.load` or `.conf` extensions in the `/etc/apache2/mods-enabled/` directory.
3.  `/etc/apache2/ports.conf`
4.  Files in the `/etc/apache2/conf.d/` directory.
5.  Files in the `/etc/apache2/sites-enabled/` directory.
6.  Per-directory `.htaccess` files.

Later files take precedence over earlier ones. Within a directory, files are read in order alphabetically.

Apache will follow symbolic links to read configuration files, so it's possible to put files in other locations as well.

Generally, as specified in our [LAMP Guide for Debian 6 (Squeeze)](/docs/lamp-guides/debian-6-squeeze) and elsewhere, you should create configuration files for your virtual hosts in the `/etc/apache2/sites-available/` directory, then use the `a2ensite` tool to symbolically link to files in the `sites-enabled/` directory. This allows for a clear and specific per-site configuration.

We recommend that you *not* modify these files:

-   `/etc/apache2/httpd.conf`
-   files in `/etc/apache2/mods-enabled/`
-   `/etc/apache2/apache2.conf`

In practice, the vast majority of your configuration options should go in site-specific virtual host configuration files. If you need to set a system-wide configuration option or aren't using virtual hosting, the best practice is to specify options in files created beneath the `conf.d/` directory.

For more help with conflicting directives, see our [Apache Troubleshooting](/docs/web-servers/apache/troubleshooting#sph_troubleshooting-conflicting-directives) article.

## Multi-Processing Module

The default Apache configuration uses a tool called MPM-worker. This multi-processing module can handle a large number of requests quickly by using multiple threads per worker process. However, this use of multiple threads is not compatible with some PHP extensions. When PHP is installed, MPM-worker is replaced with MPM-prefork, which allows Apache to handle requests without threading for greater compatibility with some software. Furthermore, using MPM-prefork allows Apache to isolate requests in separate processes so that if one request fails for some reason, other requests will be unaffected.

For more complex setups, however, we recommend that you consider using an alternate MPM module called ITK. mpm-itk is quite similar to prefork, but it goes one step further and runs the processes for each site under a distinct user account. This is particularly useful in situations where you're hosting a number of distinct sites that you need to isolate based on user privileges.

1.  Install the mpm-itk module:

        apt-get install apache2-mpm-itk

2.  Open the `/etc/apache2/sites-available/example.net` file for editing:

        nano /etc/apache2/sites-available/example.net

    Add the following lines to the file's `<VirtualHost >` block:

    {: .file-excerpt }
/etc/apache2/sites-available/example.net
    :   ~~~ apache
        <IfModule mpm_itk_module>
           AssignUserId webeditor webgroup
        </IfModule>
        ~~~

    In this example, `webeditor` is the name of the user for example.net, and `webgroup` is the name of the group that owns example.net. Remember that you must create the user accounts and groups using the `useradd` command.

3.  Repeat Step 2 for your other websites.
4.  Reload the Apache configuration:

        /etc/init.d/apache2 reload
