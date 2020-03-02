---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-02-27
modified_by:
  name: Linode
title: "Run FastCGI and PHP-FPM using Apache on Debian 10"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

`mod_fcgid` is an Apache module that provides used the [FastCGI](https://en.wikipedia.org/wiki/FastCGI) protocol to provide an interface between Apache and Common Gateway Interface (CGI) programs. CGI helps a web server handle dynamic content generation and processing using scripting languages like PHP. This dynamic functionality is commonly used when running content management systems like WordPress using a LAMP stack.

This guide will show you how to install `mod_fcgid` and `PHP-FPM` on Debian 10. It will also provide a basic configuration that uses socket based connection, instead of TCP. These steps will enable you to run PHP through `mod_fcgid`. Running PHP through `mod_fcgid` helps to reduce the amount of system resources used by forcing the web server to act as a proxy and only pass files ending with the _php_ file extension to PHP-FPM. Additionally, using PHP-FPM allows each virtual host to be configured to run PHP code as individual users.

This guide assumes that you are familiar and comfortable with setting up a [LAMP stack on Debian 10](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-debian-10/). If you are new to Linux server administration, you may be interested in reading our [Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics) guide.

## Before You Begin

1. Complete the steps in the [How to Install a LAMP Stack on Debian 10](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-debian-10/) guide. After completing the LAMP stack guide, you should have an Apache virtual hosts configuration for your own website. This guide will continue to refer to the site as `example.com`.

    {{< note >}}
This guide's examples will use PHP version 7.3. When running commands related to PHP, ensure you replace any version numbers with your own system's PHP version.
    {{</ note >}}

## Install mod_fcgid and PHP-FPM

In this section you will install the mod_fcgid and PHP-FPM modules on your Debian 10 Linode.

1.  Update your system's [Apt repositories](https://wiki.debian.org/SourcesList).

        sudo apt-get update && sudo apt-get upgrade --show-upgraded

1.  Install `mod_fcgid` and `PHP-FPM`.

        sudo apt-get install libapache2-mod-fcgid php-fpm

1. Load the `mod_proxy` and `mod_proxy_fcgi` modules by editing your main Apache configuration to add the following lines:

        {{< file "/etc/apache2/apache2.conf" >}}
LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
LoadModule proxy_fcgi_module /usr/lib/apache2/modules/mod_proxy_fcgi.so
        {{</ file>}}

1. Verify that the configuration is correct:

        sudo apache2ctl configtest

1. Restart the Apache web server:

        sudo systemctl restart apache2

## Configure Apache with PHP-FPM

You will now configure Apache to pass all requests for PHP files, with the _php_ file extension, to the PHP wrapper through FastCGI.

1.  Enable the `mod_actions` module with the following command:

        sudo a2enmod actions

1. Activate the new configuration:

        sudo systemctl restart apache2

1.  Configure `PHP-FPM` to use UNIX sockets instead of TCP. In this command, you will use `grep` to determine if the sockets are already being used. This command will search your `php-fpm` installation's default pool configuration file for the setting.

        sudo grep -E '^\s*listen\s*=\s*[a-zA-Z/]+' /etc/php/7.3/fpm/pool.d/www.conf

    You should see the example output.

    {{< output >}}
listen = /run/php/php7.3-fpm.sock
    {{</ output >}}
    If you see the above output, skip to step 6, otherwise continue to the next step.

1.  If no output is returned, you will need to edit your [PHP pool configuration file](https://www.php.net/manual/en/install.fpm.configuration.php) by adding a `listen` setting with the address on which to accept FastCGI requests. Add the following line:

    {{< file "/etc/php/7.3/fpm/pool.d/www.conf" >}}
listen = /var/run/php/php7.3-fpm.sock
    {{< /file >}}

1.  If the `listen = 127.0.0.1:9000` is not already uncommented, do so now.

    {{< file "/etc/php/7.3/fpm/pool.d/www.conf" >}}
listen = 127.0.0.1:9000
    {{< /file >}}

1.  Restart the php-fpm daemon for these changes to take effect.

        sudo systemctl restart php7.3-fpm

1. With the text editor of your choice, update your default Apache configuration file with the following settings for `mod_fcgid`:

      {{< file "/etc/apache2/apache2.conf" apache >}}
AddHandler  fcgid-script .fcgi .php .fpl
FcgidConnectTimeout 20
FcgidMaxRequestLen 268435456
FcgidMaxProcessesPerClass 10
FcgidIOTimeout 300
      {{</ file >}}

1.  Check for configuration errors.

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

1.  Check for configuration errors.

        sudo apache2ctl configtest

1.  If you received _Syntax OK_ for steps 8 and 10, restart the Apache service:

        sudo systemctl restart apache2

1. Check if PHP is working by creating and accessing a page with `phpinfo()` displayed. The following command will create a new file `info.php` in `/var/www/example.com/html/public_html/info.php`. Replace `example.com` with your own domain's root directory name.

        sudo echo "<?php phpinfo(); ?>" > /var/www/html/example.com/public_html/info.php

    Navigate to `www.example.com/info.php` to view your system's information.

## Configuring PHP Pools (Optional)

[PHP-FPM](https://php-fpm.org/) brings in the concept of [pools](https://www.php.net/manual/en/class.pool.php). With pools you can control the amount of resources dedicated to each virtual host, and run PHP scripts as different users. In this section you will create a pool for the domain `example.com` which is owned by the user **bob**.

1. Create a copy of your original pool file to use as the foundation for your `example.com` pool configuration.

        sudo cp /etc/php/7.3/fpm/pool.d/www.conf /etc/php/7.3/fpm/pool.d/example.com.conf

1.  Edit the file to change the site name, socket name, and user/group.

    {{< file "/etc/php/7.3/fpm/pool.d/example.com.conf" >}}
; Start a new pool named 'www'.
; the variable $pool can we used in any directive and will be replaced by the
; pool name ('www' here)
[example.com]

...

; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
user = bob
group = bob

...

listen = /var/run/php/php7.3-fpm_example.com.sock

{{< /file >}}


1.  Restart the `php7.3-fpm` process for the new pool to be created.

        sudo systemctl restart php7.3-fpm

1.  Edit the virtual host file of example.com to use this PHP-FPM pool

    {{< file "/etc/apache2/sites-available/example.com.conf" >}}
     ServerName madreypadre.com
     ServerAlias www.madreypadre.com
     DocumentRoot /var/www/html/example.com/public_html
     ErrorLog /var/www/html/example.com/logs/error.log
     CustomLog /var/www/html/example.com/logs/access.log combined
     <IfModule mod_fcgid.c>
         Options +ExecCGI
         FcgidConnectTimeout 20
         AddType  application/x-httpd-php         .php
         AddHandler application/x-httpd-php .php
         Alias /php7-fcgi /usr/lib/cgi-bin/php7-fcgi
     </IfModule>
</VirtualHost>

{{< /file >}}


1.  Check the configuration file for errors.

        sudo apache2ctl configtest

1.  If there were no errors, restart Apache.

        sudo systemctl restart apache2

1.  Create a PHP file inside the `DocumentRoot` of this domain to check the owner of this PHP-FPM pool.

    {{< file "/var/www/html/example.com/public_html/user.php" >}}
<?php
$username = posix_getpwuid(posix_geteuid())['name'];
print $username;
?>
{{< /file >}}

1.  Access the following URL in a web browser, replacing example.com with your domain or IP address.

        http://example.com/user.php

The page should say **bob**.
