---
slug: how-to-install-and-configure-fastcgi-and-php-fpm-on-centos-8
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide will show you how to install and configure the mod_fcgid and PHP-FPM protocols for dynamic content generation and processing using Apache on CentOS 8."
keywords: ['list','of','keywords','and key phrases']
tags: ["centos","web server","apache","php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-02-27
modified: 2021-12-29
modified_by:
  name: Linode
title: "How to Install and Configure FastCGI and PHP-FPM on CentOS 8"
h1_title: "Installing and Configuring FastCGI and PHP-FPM on CentOS 8"
enable_h1: true
contributor:
  name: Linode
relations:
    platform:
        key: install-fastcgi-php-fpm
        keywords:
            - distribution: CentOS 8
aliases: ['/web-servers/apache/how-to-install-and-configure-fastcgi-and-php-fpm-on-centos-8/']
---

`mod_fcgid` is an [Apache module](https://httpd.apache.org/mod_fcgid/) that uses the [FastCGI](https://en.wikipedia.org/wiki/FastCGI) protocol to provide an interface between Apache and Common Gateway Interface (CGI) programs. CGI helps a web server handle dynamic content generation and processing for scripting languages like PHP. This dynamic functionality is commonly used when running content management systems like WordPress on a LAMP stack.

This guide will show you how to install `mod_fcgid` and `PHP-FPM` on CentOS 8. It will also provide a basic configuration that uses socket based connections, instead of TCP. These steps will enable you to run PHP through `mod_fcgid`. Running PHP through `mod_fcgid` helps to reduce the amount of system resources used by forcing the web server to act as a proxy and only pass files ending with the *.php* file extension to PHP-FPM. Additionally, using PHP-FPM allows each virtual host to be configured to run PHP code as individual users.

This guide assumes that you are familiar and comfortable with setting up a [LAMP stack on CentOS 8](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/). If you are new to Linux server administration, you may be interested in reading our [Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics) guide.

## Before You Begin

1. Complete the steps in the [How to Install a LAMP Stack on CentOS 8](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/) guide. After completing the LAMP stack guide, you should have an Apache virtual hosts configuration for your own website. This guide will continue to refer to the site as `example.com`.

    {{< note >}}
This guide's examples will use PHP version 7.2. By default, PHP 7.2 is available for installation from the default CentOS 8 repositories. When running commands related to PHP, ensure you replace any version numbers with your own system's PHP version.
    {{</ note >}}

## Install mod_fcgid and PHP-FPM

In this section, you will install the `mod_fcgid` and `PHP-FPM` modules on your CentOS 8 Linode.

1.  Update your system if you have not already done so and install the `wget` command line utility.

        sudo yum update && sudo yum install wget -y

1.  Install `mod_fcgid` and `PHP-FPM`:

        sudo yum install mod_fcgid php-fpm

1. Verify that the configuration is correct:

        sudo httpd -t

1. Restart the Apache web server:

        sudo systemctl restart httpd

## Configure Apache with PHP-FPM

You will now configure Apache to pass all requests for files with the *.php* extension, to the PHP wrapper through FastCGI.

1.  Configure `PHP-FPM` to use UNIX sockets instead of TCP. In this command, you will use `grep` to determine if the sockets are already being used. This command will search your `php-fpm` installation's default pool configuration file for the setting.

        sudo grep -E '^\s*listen\s*=\s*[a-zA-Z/]+' /etc/php-fpm.d/www.conf

    You should see the following output:

    {{< output >}}
listen = /var/run/php-fpm/www.sock
    {{</ output >}}
    If you see the above output, skip to step 6, otherwise continue to the next step to manually configure your UNIX sockets.

1.  If no output is returned, you will need to edit your [PHP pool configuration file](https://www.php.net/manual/en/install.fpm.configuration.php) by adding a `listen` setting with the address on which to accept FastCGI requests. Add the line in the example file.

    {{< file "/etc/php-fpm.d/www.conf" >}}
listen = /var/run/php-fpm/www.sock
    {{< /file >}}

1.  If the `listen = 127.0.0.1` is not already uncommented, do so now:

    {{< file "/etc/php-fpm.d/www.conf" >}}
listen.allowed_clients = 127.0.0.1
    {{< /file >}}

1.  Restart the `php-fpm` daemon for these changes to take effect.

        sudo systemctl restart php-fpm

1. With the text editor of your choice, update your default Apache configuration file with the following basic settings for `mod_fcgid`. You may consider [changing these settings](https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html) based on your own needs.

      {{< file "/etc/httpd/conf/httpd.conf" apache >}}
AddHandler  fcgid-script .fcgi .php .fpl
FcgidConnectTimeout 20
FcgidMaxRequestLen 268435456
FcgidMaxProcessesPerClass 10
FcgidIOTimeout 300
      {{</ file >}}

1.  Check for configuration errors.

        sudo httpd -t

1. Edit your FastCGI module's configuration file to add the settings in the example file.

    {{< file "/etc/httpd/conf.modules.d/10-fcgid.conf" >}}
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

1.  Check for configuration errors.

        sudo httpd -t

1.  If you received _Syntax OK_ for steps 6 and 8, restart the Apache service:

        sudo systemctl restart httpd

1. Check if PHP is working by creating and accessing a page with `phpinfo()` displayed. Create the `info.php` file.

        sudo touch /var/www/html/example.com/public_html/info.php

1. Open the `info.php` file with the editor of your choice and add the following line:

    {{< file "/var/www/html/example.com/public_html/info.php" >}}
<?php phpinfo(); ?>
    {{</ file >}}

    Navigate to `www.example.com/info.php` to view your system's information.

## Configuring PHP Pools

[PHP-FPM](https://php-fpm.org/) brings in the concept of [pools](https://www.php.net/manual/en/class.pool.php). With pools, PHP-FPM can create and manage a pool of php processes to run PHP files from a site's root directory. Each pool that is run by PHP-FPM can be run with separate user and group ID's. Pools are a great way to provide more security when you are running multiple sites on one server. Running your site's PHP scripts using dedicated user and group IDs, means that no one user can execute scripts on all sites running on your Linode. In this section you will create a pool for the domain `example.com` which is owned by the user **bob**.

{{< note >}}
 To create the example **bob** user, you can follow the steps outlined in our [Securing Your User](/docs/guides/set-up-and-secure/#centos-fedora) guide.
{{< /note >}}

1. Create a copy of your original pool file to use as the foundation for your `example.com` pool configuration.

        sudo cp /etc/php-fpm.d/www.conf /etc/php-fpm.d/example.com.conf

1.  Edit the file to change the socket name, user and group, and socket listen address. Ensure that the listen address is different from the listen address that you set in the main PHP pool configuration file. You can append the name of your site as part of the file name, for example, `listen = /var/run/php-fpm/example.com.sock`. Also, ensure that you comment out or replace any existing `user` and `group` and add your own `user` and `group` settings as shown in the example.

    {{< file "/etc/php-fpm.d/example.com.conf" >}}
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
listen = /var/run/php-fpm/example.com.sock

{{< /file >}}


1.  Restart the `php7.2-fpm` process for the new pool to be created.

        sudo systemctl restart php-fpm

1.  Edit the virtual host file of `example.com` to use your new PHP-FPM pool. Depending on your current virtual hosts file what you need to add and edit may differ. The `<IfModuel mod_fcgid.c>` directive and its contents is what you should add to your file. Ensure you replace any instance of `example.com` with your own domain name.

    {{< file "/etc/httpd/sites-available/example.com.conf" apache >}}
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
         ProxyPassMatch " ^/(.*\.php(/.*)?)$" "unix:/run/php-fpm/example.com.sock|fcgi://localhost/var/www/html/example.com/public_html/"
     </IfModule>
</VirtualHost>
{{< /file >}}


1.  Check the configuration file for errors.

        sudo httpd -t

1.  If there were no errors, restart Apache.

        sudo systemctl restart httpd

1. Use the command line tool, ps, to verify that PHP-FPM is running the `example.com` pool as the `bob` user and group. Replace `bob` with the user that you defined in your pool configuration file.

        ps aux | grep 'example.com'

    Your output should display `bob` as the user corresponding to the command that started the listed process `php-fpm: pool example.com`.

    {{< output >}}
bob      30425  0.0  0.2 179588 10156 ?        S    17:28   0:00 php-fpm: pool example.com
bob      30426  0.0  0.2 179588 10160 ?        S    17:28   0:00 php-fpm: pool example.com
bob      30427  0.0  0.2 179588 10160 ?        S    17:28   0:00 php-fpm: pool example.com
bob      30428  0.0  0.2 179588 10160 ?        S    17:28   0:00 php-fpm: pool example.com
bob      30429  0.0  0.2 179588 10160 ?        S    17:28   0:00 php-fpm: pool example.com
    {{</ output >}}
