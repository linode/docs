---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Install web applications with "LEMP," a LAMP-like stack using nginx, PostgreSQL/MySQL, and Perl/Python/PHP.'
keywords: ["nginx", "lemp", "php", "linux", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lemp-guides/fedora-13/','websites/lemp/lemp-server-on-fedora-13/']
modified: 2011-05-03
modified_by:
  name: Linode
published: 2010-06-30
title: LEMP Server on Fedora 13
---



This document describes a compatible alternative to the "LAMP" (Linux, Apache, MySQL, and PHP) stack, known as "LEMP." The LEMP stack replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP,) which can increase the ability of the server to scale in response to demand.

Prior to beginning this guide, please complete the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Prepare System For Deployment

Before beginning with the installation of this web application stack, issue the following command to ensure that your system's package database is up to date and that all installed software is running at the current version:

    yum update

# Install the Nginx Web Server

There are several viable and popular options for installing the nginx software. The first option retrieves packages from the Ubuntu Project's software repository and provides a stable and tested version of the web server.

The second option requires downloading the source for nginx from the upstream provider and compiling the software manually. Manual compilation makes it possible to run the most current version of the software at the expense of the testing and automatic updates from the Fedora project. All options are compatible, but in most cases we recommend using the packages from the Fedora repositories unless your needs require a version newer than the one available. Possible reasons for compiling nginx yourself include access to optional compile-time modules and features added in more recent versions.

For more in-depth installation instructions consider our [guide to installing nginx](/docs/web-servers/nginx/installation/fedora-13).

### Deploy from Fedora Project Packages

If you choose to install nginx and other dependencies from the Fedora repository, issue the following command:

    yum install nginx sudo

This will install version 0.7.65 of the nginx server. Issue the following commands to start nginx for the first and ensure that nginx will start following the next reboot cycle :

    /etc/init.d/nginx start
    chkconfig --add nginx
    chkconfig nginx on

### Compile nginx from Source

If you want to compile and install nginx from source, issue the following command to install the prerequisites:

    yum install zlib-devel wget openssl-devel pcre pcre-devel sudo gcc make autoconf automake

Check the [nginx download page](http://nginx.org/en/download.html) and ensure that version 1.0.0 is the most recent "stable" version. If not, replace the version specified in the following command sequence with the latest stable version. Issue the following commands to download and install the nginx web server:

    cd /opt/
    wget http://nginx.org/download/nginx-1.0.0.tar.gz
    tar -zxvf nginx-1.0.0.tar.gz
    cd /opt/nginx-1.0.0/

The following `./configure` command will prepare nginx for compilation:

    ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module

When the `./configure` command completes, it will display the following information regarding the location of important nginx-related files after the installation is completed.

    nginx path prefix: "/opt/nginx"
    nginx binary file: "/opt/nginx/sbin/nginx"
    nginx configuration prefix: "/opt/nginx/conf"
    nginx configuration file: "/opt/nginx/conf/nginx.conf"
    nginx pid file: "/opt/nginx/logs/nginx.pid"
    nginx error log file: "/opt/nginx/logs/error.log"
    nginx http access log file: "/opt/nginx/logs/access.log"
    nginx http client request body temporary files: "client_body_temp"
    nginx http proxy temporary files: "proxy_temp"
    nginx http fastcgi temporary files: "fastcgi_temp"

Issue the following commands to compile and then install the software as specified above:

    make
    make install

Create a dedicated system user to run the nginx process under by issuing the following command:

    useradd -M -r --shell /bin/sh --home-dir /opt/nginx nginx

Now install and configure the [init script](/docs/assets/546-init-rpm.sh) to make it possible to start and stop the web server more easily. Issue the following command sequence:

    wget -O init-rpm.sh http://www.linode.com/docs/assets/546-init-rpm.sh
    mv init-rpm.sh /etc/rc.d/init.d/nginx
    chmod +x /etc/rc.d/init.d/nginx
    chkconfig --add nginx
    chkconfig nginx on

Now, issue the following command to start the web-server:

    /etc/init.d/nginx start

# Configure nginx Virtual Hosting

Regardless of the method you use to install nginx, you will need to configure `server` declarations to specify name-based virtual hosts. There are a number of approaches to organizing configuration files with nginx. Regardless of the organizational strategy, all virtual host configurations are contained within `server` configuration blocks that are in turn contained within the `http` block in the `nginx.conf` file. Consider the following nginx virtual host configuration:

{{< file-excerpt "nginx server configuration" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/www/example.com/logs/access.log;
    error_log /srv/www/example.com/logs/error.log;

    location / {
        root   /srv/www/example.com/public_html;
        index  index.html index.htm;
    }
}

{{< /file-excerpt >}}


Create the directories referenced in this configuration by issuing the following commands:

    mkdir -p /srv/www/example.com/public_html
    mkdir -p /srv/www/example.com/logs

Beyond placing configuration directives in the `nginx.conf` directory, there are several methods you can use to ensure that these options are included in your nginx configuration. You may insert the server directives directly into the `http` section of the `/opt/nginx/conf/nginx.conf` or `/etc/nginx/nginx.con` file, although this may be difficult to manage. You may also replicate the management system created by the Debian/Ubuntu operating systems by creating `sites-available/` and `sites-enabled/` directories and inserting the following line into your `nginx.conf` file:

{{< file-excerpt "nginx.conf" nginx >}}
http {
# [...]

include /opt/etc/nginx/sites-enabled/*;

# [...]
}

{{< /file-excerpt >}}


Modify the include statement to point to the path of your `sites-enabled` directory. Create site configurations in the `sites-available` directory and then create symbolic links to these files in the `sites-enabled` directory. In other circumstances, it may make more sense to create and include a file named `/opt/nginx-sites.conf` that is included in the `nginx.conf` file as follows:

{{< file-excerpt "nginx.conf" nginx >}}
http {
# [...]

include /opt/nginx-sites.conf;

# [...]
}

{{< /file-excerpt >}}


Then, depending on the size and nature of your deployment, place your virtual host configurations either directly in the `/opt/nginx-sites.conf` file or include statements for server-specific configuration files in the `nginx-sites.file` format. For more information regarding nginx configuration options, consider our [overview of nginx configuration](/docs/websites/nginx/basic-nginx-configuration).

Once you've configured and loaded the nginx configuration, restart the web server to implement the new configuration by issuing the following command:

    /etc/init.d/nginx restart

Make sure that the directories referenced in your configuration exist on your file system before restarting.

# Deploy PHP with FastCGI

If your application includes PHP code, you will need to implement the following "PHP-FastCGI" solution to allow nginx to properly handle and serve pages that contain PHP code. For a more complete introduction to this subject consider our dedicated guide to [PHP FastCGI with Nginx](/docs/web-servers/nginx/nginx-and-phpfastcgi-on-fedora-13/). Begin the deployment process by issuing the following command to install the required dependencies:

    yum install php php-cli spawn-fcgi wget

Issue the following sequence of commands to download a small wrapper script for PHP-FastCGI, configure an init script to control the process, start the process for the first time, and ensure that the process will start following a reboot cycle:

    cd /opt/
    wget -O php-fastcgi-rpm.sh http://www.linode.com/docs/assets/548-php-fastcgi-rpm.sh
    mv php-fastcgi-rpm.sh /usr/bin/php-fastcgi
    chmod +x /usr/bin/php-fastcgi
    wget -O init-php-fastcgi-rpm.sh http://www.linode.com/docs/assets/547-init-php-fastcgi-rpm.sh
    mv init-php-fastcgi-rpm.sh /etc/init.d/php-fastcgi
    chmod +x /etc/init.d/php-fastcgi
    chkconfig --add php-fastcgi
    chkconfig php-fastcgi on

Consider the following nginx virtual host configuration. Modify your configuration to resemble the one below, and ensure that the `location ~ \.php$ { }` resembles the one in this example:

{{< file "nginx virtual host configuration" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/example.com/logs/access.log;
    error_log /srv/www/example.com/logs/error.log;
    root /srv/www/example.com/public_html;

    location / {
        index index.html index.htm index.php;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}

**Important security note:** If you're planning to run applications that support file uploads (images, for example), the above configuration may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP. For more information on the specifics of this behavior, you may wish to review the information provided on [Neal Poole's blog](https://nealpoole.com/blog/2011/04/setting-up-php-fastcgi-and-nginx-dont-trust-the-tutorials-check-your-configuration/).

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server.

{{< file-excerpt "nginx virtual host configuration" nginx >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
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
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

When you've completed the modifications to the configuration, make sure that the virtual host is enabled and issue the following command to restart the web server:

    /etc/init.d/nginx restart

Congratulations! You can now deploy PHP scripts with your LEMP stack.

# Install MySQL Database Server

The MySQL database engine may be the leading open source relational database engine, and is a popular database solution for web-based applications. Issue the following command to install the MySQL server packages:

    yum install mysql-server php-mysql

Issue the following commands to start the MySQL service and ensure that the service starts following the next boot sequence:

    /etc/rc.d/init.d/mysqld start
    chkconfig mysqld on

Issue the following command to secure the MySQL instance. Answer all questions as prompted during this process:

    mysql_secure_installation

Issue the following command to get a root prompt for the MySQL server:

    mysql -u root -p

Enter the root password created above and then issue the following sequence of commands to create the `example` and `username` database users, grant the `username` user access to the `example` database, and exit from the database:

    CREATE DATABASE example;
    CREATE USER 'username' IDENTIFIED BY 's8723hk2';
    GRANT ALL PRIVILEGES ON example.* TO 'username';
    exit

You may now provide the credentials for the `example` database and the `bagman` user to your application, which will now be able to use the database for its purposes. To ensure that PHP will be able to access the MySQL connector your just installed, restart the PHP service by issue the following command:

    /etc/init.d/php-fastcgi restart

Congratulations! You now have a fully functional and fully featured LEMP stack for application deployment.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please follow the announcements, lists, and RSS feeds on the pages linked below to ensure you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [nginx Security Advisories](http://nginx.org/en/security_advisories.html)
-   [nginx Announcements](http://nginx.org/)

When upstream sources offer new releases, repeat the instructions for installing nginx, and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)
- [Clustered Web Servers and Software Load Balancing with nginx](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)
- [Deploy CGI and Perl Scripts with Perl-FastCGI and nginx](/docs/web-servers/nginx/perl-fastcgi/fedora-13)
- [Use PostgeSQL as an Alternative to MySQL for data storage](/docs/databases/postgresql/fedora-13)
- [Deploy Python Applications with uWSGI and nginx](/docs/web-servers/nginx/python-uwsgi/fedora-13)
