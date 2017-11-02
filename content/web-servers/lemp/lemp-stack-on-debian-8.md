---
author:
  name: Linode
  email: docs@linode.com
description: 'This tutorial will teach you how to install a LEMP stack to serve websites and applications on Debian 8.'
keywords: ["nginx", "lemp", "lepp", "perl", "python", "php", "linux", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/lemp/lemp-server-on-debian-8/','web-servers/lemp/lemp-server-on-debian-8/']
modified: 2017-08-21
modified_by:
  name: Linode
published: 2014-02-07
title: Install a LEMP (Linux, Nginx, MariaDB, PHP) Stack on Debian 8
external_resources:
    - '[Basic Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
    - '[Clustered Web Servers and Software Load Balancing with Nginx](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)'
    - '[Deploy CGI and Perl Scripts with Perl-FastCGI and Nginx](/docs/web-servers/nginx/perl-fastcgi/debian-6-squeeze)'
    - '[Use PostgeSQL as an Alternative to MySQL for data storage](/docs/databases/postgresql/debian-6-squeeze)'
    - '[Deploy Python Applications with uWSGI and Nginx](/docs/web-servers/nginx/python-uwsgi/debian-6-squeeze)'
---

This document describes a compatible alternative to the **LAMP** (Linux, Apache, MySQL, and PHP) stack, known as **LEMP**. The LEMP stack replaces the Apache web server component (which is the "A" in LAMP) with Nginx (pronounced "engine x", providing the "E" in LEMP). LEMP is comprised of a variety of open source software used to build and run web servers.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

Prior to installing your LEMP stack ensure that:

-   You have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.
-   You have a hostname and *fully-qualified domain name* (FQDN) configured on your Linode. To ensure this is set run:

        hostname
        hostname -f

    The first command should output your hostname, with the second providing your FQDN.

-   Your Linode's repositories and packages are up-to-date:

        sudo apt-get update && sudo apt-get upgrade

## Install the Nginx Web Server

There are several ways to install Nginx. The method used here retrieves packages from the Debian Project's software repository and provides a stable and tested version of the web server. For other options to install Nginx, you can read our [Installing Nginx on Debian 8](/docs/websites/nginx/nginx-web-server-debian-8) guide.

Install Nginx:

    sudo apt-get install nginx

### Configure Server Blocks

1.  In Nginx `server blocks` are the equivalent of Apache's virtual hosts. Create the server block file `/etc/nginx/sites-available/example.com`. In this and all following steps, replace `example.com` with your domain:

    {{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /var/www/html/example.com/logs/access.log;
    error_log /var/www/html/example.com/logs/error.log;

    location / {
        root   /var/www/html/example.com/public_html;
        index  index.html index.htm;
    }
}

{{< /file-excerpt >}}



2.  Create the `public_html` and `log` directories referenced above:

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}

3.  Enable the site and restart the web server.

        sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled
        sudo systemctl restart nginx

    To deactivate a site, simply delete the symbolic link and restart Nginx:

        sudo rm /etc/nginx/sites-enabled/example.com
        sudo systemctl restart nginx

    The source file is saved, and the site can be re-enabled at any time.

For more information regarding Nginx configuration options, check out our [Overview of Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration).

## Deploy PHP with FastCGI

1.  In order to deploy PHP applications you need to implement "PHP-FastCGI", to allow Nginx to properly handle and serve pages that contain PHP code. Begin by installing the required dependencies:

        sudo apt-get install php5-cli php5-cgi spawn-fcgi php-pear

2.  The following sequence of commands will:

    * Download a small wrapper script for PHP-FastCGI.
    * Configure an init script to control the process.
    * Start the process for the first time.
    * Ensure that the process will start following a reboot cycle.

          cd /opt/
          sudo wget -O php-fastcgi-deb.sh http://www.linode.com/docs/assets/1548-php-fastcgi-deb.sh
          sudo mv /opt/php-fastcgi-deb.sh /usr/bin/php-fastcgi
          sudo chmod +x /usr/bin/php-fastcgi
          sudo wget -O init-php-fastcgi-deb.sh http://www.linode.com/docs/assets/1549-init-php-fastcgi-deb.sh
          sudo mv /opt/init-php-fastcgi-deb.sh /etc/init.d/php-fastcgi
          sudo chmod +x /etc/init.d/php-fastcgi
          sudo /etc/init.d/php-fastcgi start
          sudo update-rc.d php-fastcgi defaults

3.  In your server block file, add a `location` directive to pass PHP files through to FastCGI:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    fastcgi_pass  127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /var/www/html/example.com/public_html$fastcgi_script_name;
}

{{< /file >}}


    {{< caution >}}
If you are planning to run applications that support file uploads (images, for example), the configuration above may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP. For more information on the specifics of this behavior, you may wish to review the information provided on [Neal Poole's blog](https://nealpoole.com/blog/2011/04/setting-up-php-fastcgi-and-nginx-dont-trust-the-tutorials-check-your-configuration/).

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires Nginx and the php-fcgi workers to reside on the same server.

~~~ nginx
location ~ \.php$ {
try_files $uri =404;
include /etc/nginx/fastcgi_params;
fastcgi_pass 127.0.0.1:9000;
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME /var/www/html/example.com/public_html$fastcgi_script_name;
}
~~~

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an `/images` directory.

~~~ nginx
location ~ \.php$ {
include /etc/nginx/fastcgi_params;
if ($uri !~ "^/images/") {
fastcgi_pass 127.0.0.1:9000;
}
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME /var/www/html/example.com/public_html$fastcgi_script_name;
}
~~~
{{< /caution >}}

4.  When you have completed the modifications to the configuration, make sure that the sever block is enabled and restart Nginx:

        sudo systemctl restart nginx

You are now able to deploy PHP scripts with your LEMP stack.

## Install MySQL Database Server

MySQL database engine may be the leading open source relational database engine, and is a popular database solution for web-based applications.

1.  Install the MySQL server packages and required PHP support for MySQL:

        sudo apt-get install mysql-server php5-mysql

    You will be prompted to enter a secure password for the MySQL root user.

2.  Open the MySQL CLI:

        mysql -u root -p

    You will be prompted to enter the MySQL root user password.

3.  Create a database and grant your users permissions on it. Change the database name (`webdata`) and username (`username`). Change the password (`password`):

        create database webdata;
        grant all on webdata.* to 'username' identified by 'password';

4.  Exit MySQL:

        quit

5.  Now you can provide the credentials for the database and user to your application to use the database for its purposes. To ensure that PHP will be able to access the MySQL connector you just installed, restart the PHP service:

        sudo /etc/init.d/php-fastcgi restart

You now have a fully functional and fully featured LEMP stack for application deployment.
