---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and PHP-FastCGI on Fedora 14'
keywords: ["nginx", "nginx fedora 14", "nginx fastcgi", "nginx php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/php-fastcgi/fedora-14/','websites/nginx/nginx-and-phpfastcgi-on-fedora-14/']
modified: 2013-10-07
modified_by:
  name: Linode
published: 2011-01-07
title: 'Nginx and PHP-FastCGI on Fedora 14'
deprecated: true
---

The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you get nginx up and running with PHP and FastCGI on your Fedora 14 system.

It is assumed that you've already followed the steps outlined in our [getting started guide](/docs/getting-started/). These steps should be performed via a root login to your Linode over SSH.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Required Packages

Issue the following commands to update your system and install the nginx web server, PHP, and compiler tools:

    yum update
    yum install nginx php-cli php spawn-fcgi wget
    chkconfig --add nginx
    chkconfig --level 35 nginx on
    service nginx start

Once the installation process finishes, you may wish to make sure nginx is running by browsing to your Linode's IP address (found on the "Remote Access" tab in the [Linode Manager](http://manager.linode.com//)). You should get the default ngnix page.

# Configure Your Site

In this guide, the domain "example.com" will be used for an example site. You should substitute your own domain name in the configuration steps that follow. First, create directories to hold your content and log files:

    mkdir -p /srv/www/www.example.com/public_html
    mkdir /srv/www/www.example.com/logs
    chown -R nginx:nginx /srv/www/www.example.com

Issue the following commands to create virtual hosting directories:

    mkdir /etc/nginx/sites-available
    mkdir /etc/nginx/sites-enabled

Add the following lines to your `/etc/nginx/nginx.conf` file, immediately after the line for `include /etc/nginx/conf.d/*.conf`:

{{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
# Load virtual host configuration files.
include /etc/nginx/sites-enabled/*;

{{< /file-excerpt >}}


Next, define your site's virtual host file:

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/www.example.com/logs/access.log;
    error_log /srv/www/www.example.com/logs/error.log;
    root /srv/www/www.example.com/public_html;

    location / {
        index index.html index.htm index.php;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
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
    fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
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
    fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

After reviewing your configuration for potential security issues, issue the following commands to enable the site:

    cd /etc/nginx/sites-enabled/
    ln -s /etc/nginx/sites-available/www.example.com
    service nginx restart

You may wish to create a test HTML page under `/srv/www/www.example.com/public_html/` and view it in your browser to verify that nginx is properly serving your site (PHP will not work yet). Please note that this will require an [entry in DNS](/docs/dns-guides/configuring-dns-with-the-linode-manager) pointing your domain name to your Linode's IP address.

# Configure spawn-fcgi

Issue the following command sequence to download scripts to control spawn-fcgi and php-fastcgi, set privileges, make the init script run at startup, and launch it for the first time:

    cd /opt
    wget -O php-fastcgi-rpm.sh http://www.linode.com/docs/assets/698-php-fastcgi-rpm.sh
    mv php-fastcgi-rpm.sh /usr/bin/php-fastcgi
    chmod +x /usr/bin/php-fastcgi
    wget -O php-fastcgi-init-rpm.sh http://www.linode.com/docs/assets/699-php-fastcgi-init-rpm.sh
    mv php-fastcgi-init-rpm.sh /etc/rc.d/init.d/php-fastcgi
    chmod +x /etc/rc.d/init.d/php-fastcgi
    chkconfig --add php-fastcgi
    chkconfig php-fastcgi on
    /etc/init.d/php-fastcgi start

# Test PHP with FastCGI

Create a file called "test.php" in your site's "public\_html" directory with the following contents:

{{< file "/srv/www/www.example.com/public\\_html/test.php" php >}}
<?php echo phpinfo(); ?>

{{< /file >}}


When you visit `http://www.example.com/test.php` in your browser, the standard "PHP info" output is shown. Congratulations, you've configured the nginx web server to use PHP-FastCGI for dynamic content!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The nginx Homepage](http://nginx.org/)
- [FastCGI Project Homepage](http://www.fastcgi.com/)
- [PHP Documentation](http://www.php.net/docs.php)
- [Installing Nginx on Fedora 14](/docs/web-servers/nginx/installation/fedora-14)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
