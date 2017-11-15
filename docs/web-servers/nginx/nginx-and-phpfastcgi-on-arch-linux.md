---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and PHP-FastCGI on Arch Linux.'
keywords: ["nginx arch linux", "nginx arch", "nginx fastcgi", "nginx php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/php-fastcgi/arch-linux/','websites/nginx/nginx-and-phpfastcgi-on-arch-linux/']
modified: 2013-10-07
modified_by:
  name: Linode
published: 2011-02-02
title: 'Nginx and PHP-FastCGI on Arch Linux'
---



The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you get nginx up and running with PHP and FastCGI on your Arch Linux-powered Linode system.

It is assumed that you've already followed the steps outlined in our [getting started guide](/docs/getting-started/). These steps should be performed via a root login to your Linode over SSH.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Software

Issue the following commands to update your system and install the nginx web server, PHP, and compiler tools:

    pacman -Sy
    pacman -S pacman
    pacman -S sudo base-devel php-cgi spawn-fcgi nginx
    cd /opt
    wget http://aur.archlinux.org/packages/spawn-fcgi-php/spawn-fcgi-php.tar.gz
    tar -zxvf spawn-fcgi-php.tar.gz
    cd /opt/spawn-fcgi-php
    makepkg --asroot
    pacman -U spawn-fcgi-php*.pkg.*

Edit the `/etc/rc.conf` file, adding "nginx" and "spawn-fcgi-php" to the "DEAMONS=" line as shown in the following excerpt:

{{< file-excerpt "/etc/rc.conf" >}}
DAEMONS=(syslog-ng network netfs crond sshd ntpd nginx spawn-fcgi-php)

{{< /file-excerpt >}}


Since you have built spawn-fcgi-php from source, you will want to monitor its page in the Arch User Repository (AUR) so that you'll be able to recompile compile the [spawn-fcgi-php](http://aur.archlinux.org/packages.php?ID=37439) package when updates are available.

Issue the following command to start the PHP FastCGI process:

    /etc/rc.d/spawn-fcgi-php start

In the default configuration, `spawn-fcgi-php` starts four `php-cgi` child processes. Test this configuration under normal load. If you find that you want to modify the number of child processes that are spawned, you can modify this value by editing the `PHP_FCGI_CHILDREN` value in the `/etc/conf.d/spawn-fcgi-php.conf` file.

# Configure Virtual Hosting

Create directories for your web content and logs by issuing the following commands. Be sure to replace "example.com" with your domain name.

    mkdir -p /srv/http/example.com/public_html
    mkdir /srv/http/example.com/logs

Issue the following commands to create nginx virtual host directories:

    mkdir /etc/nginx/conf/sites-available
    mkdir /etc/nginx/conf/sites-enabled

Next, define your site's virtual host file:

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/http/example.com/logs/access.log;
    error_log /srv/http/example.com/logs/error.log;
    root /srv/http/example.com/public_html;

    location / {
        index index.html index.htm index.php;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/http/example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}


**Important security note:** If you're planning to run applications that support file uploads (images, for example), the above configuration may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP. For more information on the specifics of this behavior, you may wish to review the information provided on [Neal Poole's blog](https://nealpoole.com/blog/2011/04/setting-up-php-fastcgi-and-nginx-dont-trust-the-tutorials-check-your-configuration/).

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server.

{{< file-excerpt "/etc/nginx/sites-available/www.example.com" nginx >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/http/example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an "/images" directory.

{{< file-excerpt "/etc/nginx/sites-available/www.example.com" nginx >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
    fastcgi_pass 127.0.0.1:9000;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/http/example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

After reviewing your configuration for potential security issues, issue the following commands to enable the site:

    cd /etc/nginx/conf/sites-enabled/
    ln -s /etc/nginx/conf/sites-available/www.example.com

Edit the file `/etc/nginx/conf/nginx.conf`, inserting the line `include /etc/nginx/conf/sites-enabled/*;` at the start of the `http {` block, as shown in the following file excerpt:

{{< file-excerpt "/etc/nginx/conf/nginx.conf" nginx >}}
http {

    include /etc/nginx/conf/sites-enabled/*;

{{< /file-excerpt >}}


Issue the following command to start nginx:

    /etc/rc.d/nginx start

# Test PHP with FastCGI

Create a file called "test.php" in your site's "public\_html" directory with the following contents:

{{< file "/srv/http/example.com/public\\_html/test.php" php >}}
<?php phpinfo(); ?>

{{< /file >}}


When you visit `http://www.example.com/test.php` in your browser, the standard "PHP info" output is shown. Congratulations, you've configured the nginx web server to use PHP-FastCGI for dynamic content!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The nginx Homepage](http://nginx.org/)
- [FastCGI Project Homepage](http://www.fastcgi.com/)
- [PHP Documentation](http://www.php.net/docs.php)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
