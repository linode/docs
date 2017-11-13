---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Install a LEMP stack to serve websites and applications on Arch Linux'
keywords: ["nginx", "lemp", "php", "linux", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lemp-guides/arch-linux/','websites/lemp/lemp-server-on-arch-linux/']
modified: 2012-06-21
modified_by:
  name: Linode
published: 2010-07-08
title: LEMP Server on Arch Linux
---

This document describes a compatible alternative to the "LAMP" (Linux, Apache, MySQL, and PHP) stack, known as "LEMP." The LEMP stack replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP,) which can increase the ability of the server to scale in response to demand.

Prior to beginning this guide, please complete the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install the Nginx Web Server

Before installing the nginx server, issue the following command to ensure that your system has an up to date version of the Arch Linux package repository. Issue the following command to update the package database:

    pacman -Sy

You can then install the nginx server with the following command:

    pacman -S nginx

Remember to update your system regularly using the `pacman -Su` command to take advantage of the latest updates and security fixes. However, when running full system updates, consult the `pacman` output carefully and follow reports within the [Arch Linux Community](http://archlinux.org/) to avoid unintended side effects or conflicts with packages that you have built yourself.

# Configure nginx Virtual Hosting

In the default installation of nginx, the main configuration file is located at `/etc/nginx/conf/nginx.conf`; however, there are a number of approaches to organizing configuration within nginx. Regardless of the organizational strategy, all virtual host configurations are contained within `server` configuration blocks that are in turn contained within the `http` block in the `nginx.conf` file. Consider the following nginx virtual host configuration:

{{< file-excerpt "nginx server configuration" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/http/example.com/logs/access.log;
    error_log /srv/http/example.com/logs/error.log;

    location / {
        root   /srv/http/example.com/public;
        index  index.html index.htm;
    }
}

{{< /file-excerpt >}}


Create the directories referenced in this configuration by issuing the following commands:

    mkdir -p /srv/http/example.com/public
    mkdir -p /srv/http/example.com/logs

You may insert the server directives directly into the `http` section of the `/etc/nginx/nginx.conf` file, although this may be difficult to manage. You may also replicate the management system created by the Debian/Ubuntu operating systems by creating a `site-available/` and `sites-enabled/` directories and inserting the following line into your `nginx.conf` file:

{{< file-excerpt "nginx.conf" nginx >}}
http {
# [...]

include /etc/nginx/sites-enabled/*;

# [...]
}

{{< /file-excerpt >}}


Modify the include statement to point to the path of your `sites-enabled` directory. Create site configurations in the `sites-available` directory and then create symbolic links to these files in the `sites-enabled` directory. In other circumstances, it may make more sense to create and include a file named `/srv/nginx-sites.conf` that is included in the `nginx.conf` file as follows:

{{< file-excerpt "nginx.conf" nginx >}}
http {
# [...]

include /srv/nginx-sites.conf;

# [...]
}

{{< /file-excerpt >}}


Then, depending on the size and nature of your deployment, place your virtual host configurations either directly in the `/srv/nginx-sites.conf` file or include statements for server-specific configuration files in the `nginx-sites.file` format. For more information regarding nginx configuration options, consider our [overview of nginx configuration](/docs/websites/nginx/basic-nginx-configuration).

Once you've configured and loaded the nginx configuration, restart the web server to implement the new configuration by issuing the following command:

    /etc/rc.d/nginx restart

You will want to add the `nginx` daemon to the `DAEMONS=()` array at the end of the `/etc/rc.conf` file to ensure that the nginx process starts following then next reboot cycle.

# Deploy PHP with FastCGI

If your application includes PHP code you will need to implement the following "PHP-FastCGI" solution to allow nginx to properly handle and serve pages that contain PHP code. Issue the following sequence of commands to build and install the packages required to run PHP as a FastCGI process:

    pacman -S sudo base-devel php-cgi spawn-fcgi
    cd /opt
    wget http://aur.archlinux.org/packages/spawn-fcgi-php/spawn-fcgi-php.tar.gz
    tar -zxvf spawn-fcgi-php.tar.gz
    cd /opt/spawn-fcgi-php
    makepkg --asroot
    pacman -U spawn-fcgi-php*.pkg.*

Because you have built these packages from source, you will want to monitor their pages in the Arch User Repository (AUR) so that you'll be able to recompile compile the [spawn-fcgi-php](http://aur.archlinux.org/packages.php?ID=37439) package when updates are available.

Issue the following command to start the PHP FastCGI process:

    /etc/rc.d/spawn-fcgi-php start

In the default configuration, `spawn-fcgi-php` starts four `php-cgi` children processes. Test this configuration under normal load, If you find that you want to modify the number of child processes that are spawned, you can modify this value by editing the `PHP_FCGI_CHILDREN` value in the `/etc/conf.d/spawn-fcgi-php.conf` file. Additionally, you will want to add the `spawn-fcgi-php` daemon to the `DAEMONS=()` array at the end of the `/etc/rc.conf` file to ensure that the PHP FastCGI daemon starts following then next reboot cycle.

Consider the following nginx virtual host configuration. Modify your configuration to resemble the one below, and ensure that the `location ~ \.php$ { }` resembles the one in this example:

{{< file "nginx virtual host configuration" nginx >}}
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

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server:

    {{< file-excerpt "nginx virtual host configuration" nginx >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/http/example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an "/images" directory.

    {{< file-excerpt "nginx virtual host configuration" nginx >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
        fastcgi_pass 127.0.0.1:9000;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/http/example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

When you've completed the modifications to the configuration, make sure that the virtual host is enabled and issue the following command to restart the web server:

    /etc/rc.d/nginx restart

Congratulations! You can now deploy PHP scripts with your LEMP stack.

# Install MySQL Database Server

The MySQL database engine may be the leading open source relational database engine, and is a popular database solution for web-based applications. Issue the following command to install the MySQL server packages:

    pacman -S mysql

Issue the following command to start the MySQL daemon:

    /etc/rc.d/mysqld start

Add the `mysqld` daemon to the `DAEMONS=()` array at the end of the `/etc/rc.conf` file to ensure that the MySQL daemon starts following then next reboot cycle. Issue the following command to secure the MySQL instance. Answer all questions as prompted during this process:

    mysql_secure_installation

Issue the following command to get a root prompt for the MySQL server:

    mysql -u root -p

Enter the root password created above and then issue the following sequence of commands to create the `example` and `username` database users, grant the `username` user access to the `example` database, and exit from the database:

    CREATE DATABASE example;
    CREATE USER 'username' IDENTIFIED BY 's8723hk2';
    GRANT ALL PRIVILEGES ON example.* TO 'username';
    exit

You may now provide the credentials for the `example` database and the `bagman` user to your application, which will now be able to use the database for its purposes. To ensure that PHP will be able to access the MySQL connector your just installed, restart the PHP service by issue the following command:

    /etc/rc.d/spawn-fcgi-php restart

Congratulations! You now have a fully functional and fully featured LEMP stack for application deployment.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)
- [Clustered Web Servers and Software Load Balancing with nginx](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)
