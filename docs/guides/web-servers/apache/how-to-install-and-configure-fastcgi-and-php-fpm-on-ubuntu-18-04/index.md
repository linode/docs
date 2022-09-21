---
slug: how-to-install-and-configure-fastcgi-and-php-fpm-on-ubuntu-18-04
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will show you how to install and configure mod_fcgid and PHP-FPM on Ubuntu 18.04.'
og_description: 'This guide will show you how to install mod_fcgid and PHP-FPM on Ubuntu 18.04. It will also provide a basic configuration that uses socket based connections, instead of TCP.'
keywords: ['list','of','keywords','and key phrases']
tags: ["web server","apache","ubuntu","php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-02-27
modified_by:
  name: Linode
title: "How to Install FastCGI and PHP-FPM on Ubuntu 18.04"
h1_title: "Installing and Configuring FastCGI and PHP-FPM on Ubuntu 18.04"
enable_h1: true
contributor:
  name: Linode
relations:
    platform:
        key: install-fastcgi-php-fpm
        keywords:
            - distribution: Ubuntu 18.04
aliases: ['/web-servers/apache/how-to-install-and-configure-fastcgi-and-php-fpm-on-ubuntu-18-04/']
---

`mod_fcgid` is an [Apache module](https://httpd.apache.org/mod_fcgid/) that uses the [FastCGI](https://en.wikipedia.org/wiki/FastCGI) protocol to provide an interface between Apache and Common Gateway Interface (CGI) programs. CGI helps a web server handle dynamic content generation and processing for scripting languages like PHP. This dynamic functionality is commonly used when running content management systems like WordPress on a LAMP stack.

This guide will show you how to install `mod_fcgid` and `PHP-FPM` on Ubuntu 18.04. It will also provide a basic configuration that uses socket based connections, instead of TCP. These steps will enable you to run PHP through `mod_fcgid`. Running PHP through `mod_fcgid` helps to reduce the amount of system resources used by forcing the web server to act as a proxy and only pass files ending with the *.php* file extension to PHP-FPM. Additionally, using PHP-FPM allows each virtual host to be configured to run PHP code as individual users.

This guide assumes that you are familiar and comfortable with setting up a [LAMP stack on Ubuntu 18.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-18-04/). If you are new to Linux server administration, you may be interested in reading our [Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics) guide.

## Before You Begin

1. Complete the steps in the [How to Install a LAMP Stack on Ubuntu 18.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-18-04/) guide. After completing the LAMP stack guide, you should have an Apache virtual hosts configuration for your own website. This guide will continue to refer to the site as `example.com`.

    {{< note >}}
This guide's examples will use PHP version 7.2. When running commands related to PHP, ensure you replace any version numbers with your own system's PHP version.
    {{</ note >}}

## Install mod_fcgid and PHP-FPM

In this section, you will install the `mod_fcgid` and `PHP-FPM` modules on your Ubuntu 18.04 Linode.

1.  Update your system's [Apt repositories](https://wiki.debian.org/SourcesList).

        sudo apt-get update && sudo apt-get upgrade --show-upgraded

1.  Install `mod_fcgid`, `PHP-FPM`, and `htop`. You will need the htop command line utility in a later section of this guide.

        sudo apt-get install libapache2-mod-fcgid php-fpm htop

1. Load the `mod_proxy` and `mod_proxy_fcgi` modules by editing your main Apache configuration to add the lines included in the example. Both these modules are included by default in your Apache installation, but the must be explicitly loaded in order to use them. You will need these modules to proxy requests through `mod_fcgid` to your socket.

    {{< file "/etc/apache2/apache2.conf" >}}
LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
LoadModule proxy_fcgi_module /usr/lib/apache2/modules/mod_proxy_fcgi.so
    {{</ file>}}

1. Verify that the configuration is correct:

        sudo apache2ctl configtest

1. Restart the Apache web server:

        sudo systemctl restart apache2

## Configure Apache with PHP-FPM

You will now configure Apache to pass all requests for files with the *.php* extension to the PHP wrapper through FastCGI.

1.  Configure `PHP-FPM` to use UNIX sockets instead of TCP. In this command, you will use `grep` to determine if the sockets are already being used. This command will search your `php-fpm` installation's default pool configuration file for the setting:

        sudo grep -E '^\s*listen\s*=\s*[a-zA-Z/]+' /etc/php/7.2/fpm/pool.d/www.conf

    You should see the example output:

    {{< output >}}
listen = /run/php/php7.2-fpm.sock
    {{</ output >}}
    If you see the above output, skip to step 6, otherwise continue to the next step to manually configure your UNIX sockets.

1.  If no output is returned, you will need to edit your [PHP pool configuration file](https://www.php.net/manual/en/install.fpm.configuration.php) by adding a `listen` setting with the address on which to accept FastCGI requests. Add the line in the example file.

    {{< file "/etc/php/7.2/fpm/pool.d/www.conf" >}}
listen = /var/run/php/php7.2-fpm.sock
    {{< /file >}}

1.  If the `listen = 127.0.0.1` is not already uncommented, do so now.

    {{< file "/etc/php/7.2/fpm/pool.d/www.conf" >}}
listen = 127.0.0.1
    {{< /file >}}

1.  Restart the `php-fpm` daemon for these changes to take effect.

        sudo systemctl restart php7.2-fpm

1. With the text editor of your choice, update your default Apache configuration file with the following basic settings for `mod_fcgid`. You may consider [changing these settings](https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html) based on your own needs.

      {{< file "/etc/apache2/apache2.conf" apache >}}
AddHandler  fcgid-script .fcgi .php .fpl
FcgidConnectTimeout 20
FcgidMaxRequestLen 268435456
FcgidMaxProcessesPerClass 10
FcgidIOTimeout 300
      {{</ file >}}

1.  Check for configuration errors:

        sudo apache2ctl configtest

1. Edit your FastCGI module's configuration file to add the settings in the example file. Some of the example settings may already be included in your configuration. Add the missing settings.

    {{< file "/etc/apache2/mods-available/fcgid.conf" >}}
<IfModule mod_fcgid.c>
  FcgidConnectTimeout 20
  AddType  application/x-httpd-php         .php
  AddHandler application/x-httpd-php .php
  Alias /php7-fcgi /usr/lib/cgi-bin/php7-fcgi
  <IfModule mod_mime.c>
    AddHandler fcgid-script .fcgi
  </IfModule>
</IfModule>
{{< /file >}}

1.  Check for configuration errors:

        sudo apache2ctl configtest

1.  If you received _Syntax OK_ for steps 6 and 8, restart the Apache service:

        sudo systemctl restart apache2

1. Check if PHP is working by creating and accessing a page with `phpinfo()` displayed. The following command will create a new file `info.php` in `/var/www/example.com/html/public_html/info.php`. Replace `example.com` with your own domain's root directory name.

        sudo echo "<?php phpinfo(); ?>" > /var/www/html/example.com/public_html/info.php

    Navigate to `www.example.com/info.php` to view your system's information.

## Configuring PHP Pools

[PHP-FPM](https://php-fpm.org/) brings in the concept of [pools](https://www.php.net/manual/en/class.pool.php). With pools, PHP-FPM can create and manage a pool of PHP processes to run PHP files from a site's root directory. Each pool that is run by PHP-FPM can be run with separate user and group ID's. Pools are a great way to provide more security when you are running multiple sites on one server. Running your site's PHP scripts using dedicated user and group IDs, means that no one user can execute scripts on all sites running on your Linode. In this section you will create a pool for the domain `example.com` which is owned by the user **bob**.

{{< note >}}
 To create the example bob user, you can follow the steps outlined in our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/#ubuntu) guide.
{{< /note >}}

1. Create a copy of your original pool file to use as the foundation for your `example.com` pool configuration.

        sudo cp /etc/php/7.2/fpm/pool.d/www.conf /etc/php/7.2/fpm/pool.d/example.com.conf

1.  Edit the file to change the socket name, user and group, and socket listen address. Ensure that the listen address is different from the listen address that you set in the main PHP pool configuration file. You can append the name of your site as part of the file name, for example, `listen = /var/run/php/php7.2-fpm_example.com.sock`. Also, ensure that you comment out any existing `user` and `group` and add or replace your own `user` and `group` settings as shown in the example.


    {{< file "/etc/php/7.2/fpm/pool.d/example.com.conf" >}}
; Start a new pool named 'www'.
; the variable $pool can be used in any directive and will be replaced by the
; pool name ('www' here)
[example.com]

...

; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
user = bob
group = bob

...

listen = /var/run/php/php7.2-fpm_example.com.sock

{{< /file >}}


1.  Restart the `php7.2-fpm` process for the new pool to be created.

        sudo systemctl restart php7.2-fpm

1.  Edit the virtual host file of `example.com` to use your new PHP-FPM pool. Depending on your current virtual hosts file what you need to add and edit may differ. The `<IfModuel mod_fcgid.c>` directive and its contents is what you should add to your file. Ensure you replace any instance of `example.com` with your own domain name.

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
<Directory /var/www/html/example.com/public_html>
        Require all granted
</Directory>
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/html/example.com/public_html
     ErrorLog /var/www/html/example.com/logs/error.log
     CustomLog /var/www/html/example.com/logs/access.log combined
     DirectoryIndex index.php
     <IfModule mod_fcgid.c>
         Options +ExecCGI
         FcgidConnectTimeout 20
         AddType  application/x-httpd-php         .php
         AddHandler application/x-httpd-php .php
         Alias /php7-fcgi /usr/lib/cgi-bin/php7-fcgi
         ProxyPassMatch " ^/(.*\.php(/.*)?)$" "unix:/run/php/php7.2-fpm_example.com.sock|fcgi://localhost/var/www/html/example.com/public_html/"
     </IfModule>
</VirtualHost>
{{< /file >}}


1.  Check the configuration file for errors.

        sudo apache2ctl configtest

1.  If there were no errors, restart Apache.

        sudo systemctl restart apache2

1. Use the command line tool, htop, to verify that PHP-FPM is running the `example.com` pool as the `bob` user and group. Replace `bob` with the user that you defined in your pool configuration file.

        top -c -u bob

    Your output should display `bob` as the user corresponding to the command that started the listed process `php-fpm: pool example.com`.

    {{< output >}}
PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
21720 bob       20   0  199276   8944   3376 S   0.0   0.2   0:00.00 php-fpm: pool example.com
21721 bob       20   0  199276   8944   3376 S   0.0   0.2   0:00.00 php-fpm: pool example.com
    {{</ output >}}
