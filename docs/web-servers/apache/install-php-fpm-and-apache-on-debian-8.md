---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Install PHP-FPM and Apache on Debian 8 for Improved Website Agility and Security'
keywords: ["php-fpm", "apache", "debian 8", "php5-mysql", "fastcgi", "php", "cgi", "mod_php", "php pool"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/apache/install-php-fpm-and-apache-on-debian-8/']
modified: 2017-02-21
modified_by:
  name: Nick Brewer
published: 2016-02-19
title: 'Install PHP-FPM and Apache on Debian 8 (Jessie)'
external_resources:
 - '[The PHP Homepage](http://php.net/)'
 - '[FastCGI Process Manager](http://php.net/manual/en/install.fpm.configuration.php)'
---

PHP-FPM is an implementation of the FastCGI protocol for PHP. This guide covers installing PHP-FPM for Apache on Debian 8 (Jessie).

![Install PHP-FPM and Apache on Debian 8](/docs/assets/install-php-fpm-and-apache-on-debian-8.png)

## Benefits over mod_php

While the `mod_php` module lets Apache run php scripts directly, it comes with the overhead of being loaded by every Apache process. For sites or servers that rely heavily on PHP this can be a benefit, but for largely static sites it makes more sense to only load php when needed.

PHP-FPM also offers more security, since scripts are not run as the Apache user. When running multiple sites, you can even set site-specific users to run php scripts, helping prevent one site's compromise from affecting the others.



## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Apache and PHP-FPM

1.  Due to the PHP-FPM's licensing, it's not available in Debian's main repository. Open the `sources.list` file and add `contrib` and `non-free` to each source line:

    {{< file "/etc/apt/sources.list" >}}
deb http://mirrors.linode.com/debian/ jessie main contrib non-free
deb-src http://mirrors.linode.com/debian/ jessie main contrib non-free

deb http://security.debian.org/ jessie/updates main contrib non-free
deb-src http://security.debian.org/ jessie/updates main non-free

# jessie-updates, previously known as 'volatile'
deb http://mirrors.linode.com/debian/ jessie-updates main contrib non-free
deb-src http://mirrors.linode.com/debian/ jessie-updates main contrib non-free

{{< /file >}}


2.  Update `apt-get`, and install Apache, the mod-fastcgi module, and PHP-FPM:

        sudo apt-get update
        sudo apt-get install apache2 libapache2-mod-fastcgi php5-fpm

3.  **Optional** If you need support for MySQL in PHP, install the php5-mysql package:

        sudo apt-get install php5-mysql

4.  You can now [configure virtual hosting](/docs/web-servers/apache/apache-web-server-debian-8#configure-apache-for-virtual-hosting) in accordance with the needs of your server. Once your site(s) is set up, you can configure Apache to pass PHP scripts to the CGI process.

## Configure PHP-FPM

1.  Enable the `mod_actions` module:

        sudo a2enmod actions

2.  Make a backup of the `fastcgi.conf` file:

        sudo cp /etc/apache2/mods-enabled/fastcgi.conf /etc/apache2/mods-enabled/fastcgi.conf.backup

3.  Replace the contents of `fastcgi.conf` with the following:

    {{< file "/etc/apache2/mods-enabled/fastcgi.conf" aconf >}}
<IfModule mod_fastcgi.c>
    AddType application/x-httpd-fastphp5 .php
    Action application/x-httpd-fastphp5 /php5-fcgi
    Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
    FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -socket /var/run/php5-fpm.sock -pass-header Authorization
    <Directory /usr/lib/cgi-bin>
        Require all granted
    </Directory>
</IfModule>

{{< /file >}}


4.  Confirm that you've properly copied the correct configuration:

        sudo apache2ctl configtest

    Disregard other output; if you see `Syntax OK`, you can proceed.

5.  Restart the Apache daemon to enable your new configuration:

        sudo systemctl restart apache2

6.  To confirm that PHP is working, create an `info.php` file in one of your web directories:

    {{< file "/var/www/example.com/public_html/info.php" php >}}
<?php phpinfo(); ?>

{{< /file >}}


    Navigate to `http://example.com/info.php` and look for the **Server API** line:

    ![The Server API Line.](/docs/assets/php-fpm-info.png)

## Configure PHP Pools

This is a separate and optional configuration scenario from that described above where specific Unix users are created to execute PHP code and to control system resources per site. Instead of the `www-data` user owning all of Apache's processes and sites, the configuration below allows each site to be run by Apache under its own system user (`site1` under `user1`, `site2` under `user2`, etc.).

This is particularly useful when running multiple client sites because you can give each customer write permissions in a respective web directory without affecting the security of the web server as a whole. The example below assumes two websites, each with its own Apache virtual host, and one system user for each website to which you want to assign a PHP pool. For more information see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

1.  Make a copy of `www.conf` for each pool:

        cd /etc/php5/fpm/pool.d/
        sudo cp www.conf {site1.conf,site2.conf}

2.  For each pool, adjust the pool name, user and group, and socket name:

    {{< file-excerpt "/etc/php5/fpm/pool.d/site1.conf" aconf >}}
; Start a new pool named 'www'.
; the variable $pool can we used in any directive and will be replaced by the
; pool name ('www' here)
[site1.com]

...

; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
user = site1
group = site1

...

; The address on which to accept FastCGI requests.
; Valid syntaxes are:
;   'ip.add.re.ss:port'    - to listen on a TCP socket to a specific IPv4 address on
;                            a specific port;
;   '[ip:6:addr:ess]:port' - to listen on a TCP socket to a specific IPv6 address on
;                            a specific port;
;   'port'                 - to listen on a TCP socket to all IPv4 addresses on a
;                            specific port;
;   '[::]:port'            - to listen on a TCP socket to all addresses
;                            (IPv6 and IPv4-mapped) on a specific port;
;   '/path/to/unix/socket' - to listen on a unix socket.
; Note: This value is mandatory.
listen = /var/run/php5-fpm-site1.com.sock

{{< /file-excerpt >}}


    {{< note >}}
In the file excerpt above, three sequential dots - `...`  - denote that there is more in this file than is being shown. The three sequential dots are not a literal section to be copied.
{{< /note >}}

3.  Restart the PHP-FPM service:

        systemctl restart php5-fpm.service

    If this is not successful, ensure that you've created a Linux system user for each one defined in your pools. If successful, you should see a similar output for `sudo systemctl status php5-fpm.service`:

        ● php5-fpm.service - The PHP FastCGI Process Manager
           Loaded: loaded (/lib/systemd/system/php5-fpm.service; enabled)
           Active: active (running) since Wed 2016-01-27 20:24:51 UTC; 2s ago
          Process: 28423 ExecStartPre=/usr/lib/php5/php5-fpm-checkconf (code=exited, status=0/SUCCESS)
         Main PID: 28428 (php5-fpm)
           Status: "Ready to handle connections"
           CGroup: /system.slice/php5-fpm.service
                   ├─28428 php-fpm: master process (/etc/php5/fpm/php-fpm.conf)
                   ├─28432 php-fpm: pool site2.com
                   ├─28433 php-fpm: pool site2.com
                   ├─28434 php-fpm: pool site1.com
                   ├─28435 php-fpm: pool site1.com
                   ├─28436 php-fpm: pool www
                   └─28437 php-fpm: pool www

4.  Add the `<IfModule mod_fastcgi.c>` block to each virtual host block:

    {{< file-excerpt "/etc/apache2/sites-available/site1.com.conf" aconf >}}
<VirtualHost *:80>

...

<IfModule mod_fastcgi.c>
    AddType application/x-httpd-fastphp5 .php
    Action application/x-httpd-fastphp5 /php5-fcgi
    Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi-site1.com
    FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi-site1.com -socket /var/run/php5-fpm-site1.com.sock -pass-header Authorization
</IfModule>

...

{{< /file-excerpt >}}


5.  Test the new configuration with `sudo apache2ctl configtest`. If there are no errors, reload Apache:

        sudo systemctl reload apache2

6.  You can confirm the user with the `info.php` file described above, by checking the **Environment** section:

    ![The PHP Environment Variable](/docs/assets/php-fpm-env.png)
