---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and PHP-FastCGI on Ubuntu 9.10 (Karmic).'
keywords: ["nginx", "nginx ubuntu 9.10", "nginx fastcgi", "nginx php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/php-fastcgi/ubuntu-9-10-karmic/','websites/nginx/nginx-and-phpfastcgi-on-ubuntu-9-10-karmic/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2009-12-14
expiryDate: 2013-05-17
title: 'Nginx and PHP-FastCGI on Ubuntu 9.10 (Karmic)'
deprecated: true
---

The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you get nginx up and running with PHP and FastCGI on your Ubuntu 9.10 Linode.

It is assumed that you've already followed the steps outlined in our [getting started guide](/docs/getting-started/). These steps should be performed via a root login to your Linode over SSH.

# Basic System Configuration

Issue the following commands to set your system hostname, substituting a unique value for "hostname." :

    echo "hostname" > /etc/hostname
    hostname -F /etc/hostname

Edit your `/etc/hosts` file to resemble the following, substituting your Linode's public IP address for 12.34.56.78, your hostname for "hostname," and your primary domain name for "example.com." :

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost 12.34.56.78 hostname.example.com hostname
{{< /file >}}

# Install Required Packages

Make sure you have the "universe" repositories enabled in `/etc/apt/sources.list`. Your file should resemble the following:

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntuu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe
{{< /file >}}

Issue the following commands to update your system and install the nginx web server, PHP, and compiler tools:

    apt-get update
    apt-get upgrade
    apt-get install nginx php5-cli php5-cgi spawn-fcgi

Various additional dependency packages will be installed along with the ones we requested. Once the installation process finishes, you may wish to make sure nginx is running by browsing to your Linode's IP address (found on the "Remote Access" tab in the [Linode Manager](http://manager.linode.com//)). You should get the default ngnix page.

# Configure Your Site

In this guide, we'll be using the domain "example.com" as our example site. You should substitute your own domain name in the configuration steps that follow. First, we'll need to create directories to hold our content and log files:

    mkdir -p /srv/www/www.example.com/public_html
    mkdir /srv/www/www.example.com/logs
    chown -R www-data:www-data /srv/www/www.example.com

Next, define your site's virtual host file:

{{< file "/etc/nginx/sites-available/www.example.com" >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/example.com/www/logs/access.log;
    error_log /srv/www/example.com/www/logs/error.log;
    root /srv/www/example.com/www/public_html;

    location / {
        index index.html index.htm index.php;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/www/example.com/www/public_html$fastcgi_script_name;
    }
}
{{< /file >}}

**Important security note:** If you're planning to run applications that support file uploads (images, for example), the above configuration may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP. For more information on the specifics of this behavior, you may wish to review the information provided on [Neal Poole's blog](https://nealpoole.com/blog/2011/04/setting-up-php-fastcgi-and-nginx-dont-trust-the-tutorials-check-your-configuration/).

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server.

{{< file-excerpt "nginx" >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/www/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an "/images" directory.

{{< file-excerpt "nginx" >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
        fastcgi_pass 127.0.0.1:9000;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/www/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

After reviewing your configuration for potential security issues, issue the following commands to enable the site:

    cd /etc/nginx/sites-enabled/
    ln -s /etc/nginx/sites-available/www.example.com
    /etc/init.d/nginx restart

You may wish to create a test HTML page under `/srv/www/www.example.com/public_html/` and view it in your browser to verify that nginx is properly serving your site (PHP will not work yet). Please note that this will require an [entry in DNS](/docs/dns-guides/configuring-dns-with-the-linode-manager) pointing your domain name to your Linode's IP address.

# Install spawn-fcgi

Visit the [spawn-fcgi project page](http://redmine.lighttpd.net/projects/spawn-fcgi) and locate the download link to the latest version. Issue the following commands, substituting your link for the one shown below if a newer version is available.

    cd /opt
    wget http://www.lighttpd.net/download/spawn-fcgi-1.6.3.tar.gz
    tar -xf spawn*
    cd spawn*
    ./configure
    make
    cp src/spawn-fcgi /usr/bin/spawn-fcgi

Issue the following command sequence to download scripts to control spawn-fcgi and php-fastcgi, set privileges, make the init script run at startup, and launch it for the first time:

    cd /opt
    wget -O php-fastcgi-deb.sh http://www.linode.com/docs/assets/644-php-fastcgi-deb.sh
    mv php-fastcgi-deb.sh /usr/bin/php-fastcgi
    chmod +x /usr/bin/php-fastcgi
    wget -O php-fastcgi-init-deb.sh http://www.linode.com/docs/assets/643-php-fastcgi-init-deb.sh
    mv php-fastcgi-init-deb.sh /etc/init.d/php-fastcgi
    chmod +x /etc/init.d/php-fastcgi
    update-rc.d php-fastcgi defaults
    /etc/init.d/php-fastcgi start

# Test PHP with FastCGI

Create a file called "test.php" in your site's "public\_html" directory with the following contents:

{{< file "/srv/www/www.example.com/public\_html/test.php" >}}
<?php echo phpinfo(); ?>
{{< /file >}}

When you visit `http://www.example.com/test.php` in your browser, the standard "PHP info" output is shown. Congratulations, you've configured the nginx web server to use PHP-FastCGI for dynamic content!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The nginx Homepage](http://nginx.org/)
- [FastCGI Project Homepage](http://www.fastcgi.com/)
- [PHP Documentation](http://www.php.net/docs.php)
- [Installing Nginx on Ubuntu 9.10 (Karmic)](/docs/web-servers/nginx/installation/ubuntu-9-10-karmic)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
