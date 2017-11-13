---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Install web applications with "LEMP," a LAMP-like stack using nginx, PostgreSQL/MySQL, and Perl/Python/PHP.'
keywords: ["nginx", "lemp", "php", "linux", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lemp-guides/fedora-15/','websites/lemp/lemp-server-on-fedora-15/']
modified: 2012-06-21
modified_by:
  name: Linode
published: 2011-06-24
title: LEMP Server on Fedora 15
---

This guide will help you get up and running quickly with a LEMP (Linux, nginx, MySQL, PHP) stack on your Linode. If you haven't done so already, please follow the instructions in our [getting started guide](/docs/getting-started/) before proceeding. If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install the nginx Web Server

Issue the following commands to update your system, install nginx, set it to start on boot, and start it now.

    yum update
    yum install nginx
    chkconfig nginx on
    service nginx start

# Configure nginx Virtual Hosting

Replace the contents of the file `/etc/nginx/nginx.conf` with the following contents.

{{< file "/etc/nginx/nginx.conf" nginx >}}
user nginx;
worker_processes 1;
error_log /var/log/nginx/error.log;

pid /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}

{{< /file >}}


Issue the following commands to create directories for your web content and logs, replacing "example.com" with your domain name.

    mkdir -p /srv/www/www.example.com/public_html
    mkdir -p /srv/www/www.example.com/logs

Issue the following command to create directories for your nginx configuration files.

    mkdir /etc/nginx/sites-available
    mkdir /etc/nginx/sites-enabled

Create the file `/etc/nginx/sites-available/www.example.com`, replacing "example.com" with your domain name. It should contain the following configuration directives; again, be sure to replace "example.com" with your domain name.

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/www.example.com/logs/access.log;
    error_log /srv/www/www.example.com/logs/error.log;
    root /srv/www/www.example.com/public_html;

    location / {
        index index.html index.htm;
    }
}

{{< /file >}}


Issue the following commands to enable your site, replacing "example.com" with your domain name.

    cd /etc/nginx/sites-enabled
    ln -s /etc/nginx/sites-available/www.example.com

Create a test index page for your website with the following contents.

{{< file "/srv/www/www.example.com/public\\_html/index.html" html >}}
<html>
<head>
<title>Welcome to example.com</title>
</head>
<body>
<h1>Welcome to example.com</h1>
<p>If you can see this, nginx is configured to serve your site.</p>
</body>
</html>

{{< /file >}}


Issue the following command to restart nginx.

    service nginx restart

Once nginx has restarted, you should be able to view your test page in a web browser.

# Configure PHP-FastCGI

### Install and Configure Packages

Issue the following command to install packages required for PHP-FastCGI.

    yum install php spawn-fcgi

Edit the file `/etc/sysconfig/spawn-fcgi` to match the following contents.

{{< file "/etc/sysconfig/spawn-fcgi" ini >}}
FASTCGI_USER=nginx
FASTCGI_GROUP=nginx
SOCKET=/var/run/spawn-fcgi.sock
PIDFILE=/var/run/spawn-fcgi.pid
PHP5_SOCKET=/var/run/php-fcgi.sock
CHILDREN=6
PHP5=/usr/bin/php-cgi
MODE=0600
OPTIONS="-s $PHP5_SOCKET -S -M $MODE -P $PIDFILE -C $CHILDREN -u $FASTCGI_USER -g $FASTCGI_GROUP -f $PHP5"

{{< /file >}}


Issue the following command to set PHP-FastCGI to start on boot and start it now.

    chkconfig spawn-fcgi on
    service spawn-fcgi start

Edit your site's nginx configuration file to resembled the following example.

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/www.example.com/logs/access.log;
    error_log /srv/www/www.example.com/logs/error.log;
    root /srv/www/www.example.com/public_html;

    location / {
        index  index.html index.htm;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass unix:/var/run/php-fcgi.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}

Issue the following command to restart nginx.

    service nginx restart

Create a PHP test page so you can verify that everything is working correctly.

{{< file "/srv/www/www.example.com/public\\_html/test.php" php >}}
<?php phpinfo(); ?>

{{< /file >}}


### Important Security Considerations

If you're planning to run applications that support file uploads (images, for example), the above configurations may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP.

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server.

{{< file-excerpt "/etc/nginx/sites-available/www.example.com" nginx >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass unix:/var/run/php-fcgi.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an "/images" directory.

{{< file-excerpt "/etc/nginx/sites-available/www.example.com" nginx >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
        fastcgi_pass unix:/var/run/php-fcgi.sock;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

# Install MySQL Database Server

Issue the following commands to install the MySQL database server, set it to start at boot, and secure the installation.

    yum install mysql-server
    chkconfig mysqld on
    service mysqld start
    mysql_secure_installation

If you need support for PHP, issue the following commands to install the required package and restart php.

    yum install php-mysql
    service spawn-fcgi restart

# Monitor for Software Updates and Security Notices

Please follow the announcements, lists, and RSS feeds on the pages linked below to ensure you are aware of all security updates and can upgrade appropriately or apply patches and recompile as needed:

-   [Fedora Security Mailing List](https://admin.fedoraproject.org/mailman/listinfo/security)
-   [nginx Security Advisories](http://nginx.org/en/security_advisories.html)
-   [nginx Announcements](http://nginx.org/)
-   [PHP Mailing Lists](http://php.net/mailing-lists.php)
-   [MySQL Mailing Lists](http://lists.mysql.com/)

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)
- [nginx Wiki](http://wiki.nginx.org/Main)
- [PHP Documentation](http://php.net/docs.php)
- [MySQL Documentation](http://dev.mysql.com/doc/)
