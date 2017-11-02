---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install and Configure mod_fastcgi and PHP-FPM on Debian with Apache'
keywords: ["apache", "fastcgi", "php-fpm", "php", "php pool"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/apache/php-fpm/debian-7/','web-servers/apache/php-fpm/apache-php-fpm-debian-ubuntu/','websites/apache/running-fastcgi-php-fpm-on-debian-7-with-apache/']
contributor:
    name: Jesin A
    link: https://twitter.com/jesin_a
external_resources:
 - '[PHP-FPM configuration directives](http://php.net/manual/en/install.fpm.configuration.php)'
 - '[mod_fastcgi configuration directives](http://www.fastcgi.com/mod_fastcgi/docs/mod_fastcgi.html)'
modified: 2014-08-16
modified_by:
  name: Linode
published: 2014-06-16
title: 'Running mod_fastcgi and PHP-FPM on Debian 7 (Wheezy) with Apache'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

This article explains how to configure and install `mod_fastcgi` and `PHP-FPM` on a Debian 7 instance using Apache. Apache's default configuration, which uses `mod_php` instead of `mod_fastcgi`, uses a significant amount of system resources.

The main reason `mod_php` uses more resources is because it is loaded even for non-PHP files (like plain HTML and JavaScript files). The FastCGI Process Manager (PHP-FPM) helps to reduce the amount of system resources used by forcing the web server to act as a proxy and passing only files ending with the _php_ file extension to PHP-FPM.

Additionally, using PHP-FPM allows each virtual host to be configured to run PHP code as individual users. Previously, this was only possible by using suPHP.

This guide assumes that you are familiar and comfortable with setting up [LAMP stacks](/docs/websites/lamp) on Debian 7. If you are new to Linux server administration, you may be interested in reading our [Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics) documentation series.

## Installing mod_fastcgi and PHP-FPM

Both `mod_fastcgi` and `PHP-FPM` are part of repositories for aptitude supported by Debian 7. The following are necessary steps to install `mod_fastcgi` and `PHP-FPM`.

1.  Update the apt-get repositories

        sudo apt-get update && sudo apt-get upgrade --show-upgraded

2.  See if `mod_fastcgi` is available. By default, the Debian 7 does not include the necessary repositories to install `mod_fastcgi` because it is a contrib module and is non-free (in terms of Debian's licensing restrictions).

        sudo apt-cache search libapache2-mod-fastcgi

3.  If it is not available, you will need to edit your `/etc/apt/sources.list` file to allow for contrib and non-free software to be loaded in the repository list. Your sources file should look like:

    a) If you are using Linode's mirrors:

    {{< file-excerpt "/etc/apt/sources.list" >}}
deb http://mirrors.linode.com/debian/ wheezy main contrib non-free
deb-src http://mirrors.linode.com/debian/ wheezy main contrib non-free

deb http://mirrors.linode.com/debian-security/ wheezy/updates main contrib non-free
deb-src http://mirrors.linode.com/debian-security/ wheezy/updates main contrib non-free

# wheezy-updates, previously known as 'volatile'
deb http://mirrors.linode.com/debian/ wheezy-updates main
deb-src http://mirrors.linode.com/debian/ wheezy-updates main

{{< /file-excerpt >}}


    b) If you are using Debian's mirrors:

    {{< file-excerpt "/etc/apt/sources.list" >}}
deb http://ftp.es.debian.org/debian stable main contrib non-free
deb-src http://ftp.es.debian.org/debian stable main contrib non-free

deb http://ftp.debian.org/debian/ wheezy-updates main contrib non-free
deb-src http://ftp.debian.org/debian/ wheezy-updates main contrib non-free

deb http://security.debian.org/ wheezy/updates main contrib non-free
deb-src http://security.debian.org/ wheezy/updates main contrib non-free

{{< /file-excerpt >}}


4.  Update the apt-get repositories.

        sudo apt-get update && sudo apt-get upgrade --show-upgraded

5.  Install `mod_fastcgi` and `PHP-FPM`.

        sudo apt-get install libapache2-mod-fastcgi php5-fpm


## Configuring Apache with PHP-FPM

We will now configure Apache to pass all requests for PHP files, with the _php_ file extension, to the PHP wrapper through FastCGI.

1.  Enable the `mod_actions` module with the following command:

        sudo a2enmod actions

2.  Configure PHP-FPM to use UNIX sockets instead of TCP. In this command, we will use `grep` to determine if the sockets are already being used. In a standard installation, they will be.

        sudo grep -E '^\s*listen\s*=\s*[a-zA-Z/]+' /etc/php5/fpm/pool.d/www.conf

    You should see the following output:

        listen = /var/run/php5-fpm.sock

    If you see the above output, skip to step 6.

3.  If no output is returned, you will need to edit the following file and add this line:

    {{< file-excerpt "etc/php5/fpm/pool.d/www.conf" >}}
listen = /var/run/php5-fpm.sock

{{< /file-excerpt >}}


4.  Find the following line and remove it.

    {{< file-excerpt "/etc/php5/fpm/pool.d/www.conf" >}}
listen = 127.0.0.1:9000

{{< /file-excerpt >}}


5.  Restart the php5-fpm daemon for these changes to take effect.

        sudo service php5-fpm restart

6.  Check for the version of Apache with the following command.

        apache2 -v

7.  Depending on your Apache version, edit the following file accordingly.

    **Apache 2.2 or earlier**

    {{< file-excerpt "/etc/apache2/mods-enabled/fastcgi.conf" >}}
<IfModule mod_fastcgi.c>
 AddType application/x-httpd-fastphp5 .php
 Action application/x-httpd-fastphp5 /php5-fcgi
 Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
 FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -socket /var/run/php5-fpm.sock -pass-header Authorization
</IfModule>

{{< /file-excerpt >}}


    **Apache 2.4 or later**

    {{< file-excerpt "/etc/apache2/mods-enabled/fastcgi.conf" >}}
<IfModule mod_fastcgi.c>
 AddType application/x-httpd-fastphp5 .php
 Action application/x-httpd-fastphp5 /php5-fcgi
 Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
 FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -socket /var/run/php5-fpm.sock -pass-header Authorization
 <Directory /usr/lib/cgi-bin>
  Require all granted
 </Directory>
</IfModule>

{{< /file-excerpt >}}


8.  Save the file and check for configuration errors.

        sudo apache2ctl configtest

9.  As long as you received _Syntax OK_ as a result of that command, restart the Apache service:

        sudo service apache2 restart

    If you did not get the _Syntax OK_ result, check your configuration for errors.

10. Check if the PHP is working by creating and accessing a page with `phpinfo()` displayed. The following command will create info.php in /var/www (default directory for websites in Apache):

        sudo echo "<?php phpinfo(); ?>" > /var/www/info.php

## Configuring PHP Pools (Optional)

PHP-FPM brings in the concept of pools. Using pools you can control the amount of resources dedicated to each virtual host, and also run PHP scripts as different users.

In this section we will create a pool for the domain example.com which is owned by the user **bob**.

1.  Create a copy of the original pool file to make changes to using the following command.

        sudo cp /etc/php5/fpm/pool.d/www.conf /etc/php5/fpm/pool.d/example.com.conf

2.  Edit the file to change the site name, socket name, and user/group.

    {{< file-excerpt "/etc/php5/fpm/pool.d/example.com.conf" >}}
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

listen = /var/run/php5-fpm_example.com.sock

{{< /file-excerpt >}}


3.  Restart the php5-fpm process for the new pool to be created.

        sudo service php5-fpm restart

4.  Edit the virtual host file of example.com to use this PHP-FPM pool

    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" >}}
<VirtualHost *:80>
    ServerAdmin webmaster@example.com
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/example.com/public_html/
    ErrorLog /var/www/example.com/error.log
    CustomLog /var/www/example.com/access.log combined

    <IfModule mod_fastcgi.c>
        AddType application/x-httpd-fastphp5 .php
        Action application/x-httpd-fastphp5 /php5-fcgi
        Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi_example.com
        FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi_example.com -socket /var/run/php5-fpm_example.com.sock -pass-header Authorization
    </IfModule>

</VirtualHost>

{{< /file-excerpt >}}


5.  Check the configuration file for errors.

        sudo apache2ctl configtest

6.  If there were no errors, restart Apache.

        sudo apache2 restart

7.  Create a PHP file inside the `DocumentRoot` of this domain to check the owner of this PHP-FPM pool.

    {{< file-excerpt "/var/www/example.com/public_html/user.php" >}}
<?php
$processUser = posix_getpwuid( posix_geteuid() );
print $processUser('name');
?>

{{< /file-excerpt >}}


8.  Access the following URL in a web browser, replacing example.com with your domain or IP address.

        http://example.com/user.php

The page should say **bob**.
