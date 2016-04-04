---
author:
  name: Linode
  email: docs@linode.com
description: 'Install web applications with "LEMP," a LAMP-like stack using nginx, MySQL, and PHP.'
keywords: 'nginx,lemp,php,linux,web applications'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['lemp-guides/ubuntu-16-04/']
modified: Monday, April 4, 2016
modified_by:
  name: Phil Zona
published: 'Monday, April 4, 2016'
title: 'LEMP Server on Ubuntu 16.04 (Xenial Xerus)'
external_resources:
 - '[Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
 ---

This document describes a compatible alternative to the "LAMP" (Linux, Apache, MySQL, and PHP) stack, known as "LEMP." The LEMP stack replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP,) which can increase the ability of the server to scale in response to demand.

Prior to beginning this guide, please complete the [getting started guide](/docs/getting-started/), specifically [setting your hostname](/docs/getting-started#sph_setting-the-hostname). If you are new to Linux systems administration, you may want to consider the [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts) and the [Linux administration basics guide](/docs/using-linux/administration-basics).

This guide is for a non-root user, although many commands will require root privileges (using the `sudo` prefix). Be sure your system and all packages are fully up-to-date before beginning.

## Install the Nginx Web Server

There are two options for installing the nginx software. The first option retrieves packages from the Ubuntu Project's software repository and provides a stable and tested version of the web server.

The second option requires downloading the source for nginx from the upstream provider and compiling the software manually. Manual compilation makes it possible to run the most current version of the software at the expense of the testing and automatic updates from the Ubuntu project. 

Both options are compatible, but we recommend using the packages from the Ubuntu repositories unless you require a newer version. Possible reasons for compiling nginx yourself include access to optional compile-time modules and features added in more recent versions.

### Deploy from Ubuntu Project Packages

If you choose to install nginx from the Ubuntu repository, issue the following command:

    sudo apt-get install nginx

This will install version 1.9.13 of the nginx server. 

### Compile nginx from Source

If you want to compile and install nginx from source, issue the following commands to install the dependencies:

    sudo apt-get install gcc libpcre3 libpcre3-dev libssl-dev make

Check the [nginx download page](http://nginx.org/en/download.html) and ensure that version 1.9.13 is the most recent "mainline" version. If not, replace the version specified in the following command sequence with the latest mainline or stable version. Issue the following commands to download and install the nginx web server:

    cd /opt/
    sudo wget http://nginx.org/download/nginx-1.9.13.tar.gz
    sudo tar -zxvf nginx-1.9.13.tar.gz
    cd /opt/nginx-1.9.13/

The following `./configure` command will prepare nginx for compilation:

    sudo ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module

When the `./configure` command completes it will display the following information regarding the location of important nginx-related files after the installation is completed.

    nginx path prefix: "/opt/nginx"
    nginx binary file: "/opt/nginx/sbin/nginx"
    nginx modules path: "/opt/nginx/modules"
    nginx configuration prefix: "/opt/nginx/conf"
    nginx configuration file: "/opt/nginx/conf/nginx.conf"
    nginx pid file: "/opt/nginx/logs/nginx.pid"
    nginx error log file: "/opt/nginx/logs/error.log"
    nginx http access log file: "/opt/nginx/logs/access.log"
    nginx http client request body temporary files: "client_body_temp"
    nginx http proxy temporary files: "proxy_temp"
    nginx http fastcgi temporary files: "fastcgi_temp"
    nginx http uwsgi temporary files: "uwsgi_temp"
    nginx http scgi temporary files: "scgi_temp"

{: .note}
> The configuration section of this guide assumes that you installed nginx from the repository package, not source. If you are installing from source, make note of these file paths and be aware that they will be slightly different from the defaults when installing from the repository package.

Issue the following commands to compile and then install the software as specified above:

    sudo make
    sudo make install

Create a dedicated system user to run the nginx process under by issuing the following command:

    sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx 

Now install and configure the [init script](/docs/assets/1131-init-deb.sh) to make it possible to start and stop the web server more easily. Issue the following command sequence, prefixing all with `sudo`:

    wget -O init-deb.sh http://www.linode.com/docs/assets/1131-init-deb.sh
    mv init-deb.sh /etc/init.d/nginx
    chmod +x /etc/init.d/nginx
    /usr/sbin/update-rc.d -f nginx defaults 

Now, issue the following command to start the web-server:

    sudo /etc/init.d/nginx start

## Configure nginx Virtual Hosting

Regardless of the method you use to install nginx, you will need to configure `server` declarations to specify name-based virtual hosts. There are a number of approaches to organizing configuration files with nginx. Regardless of the organizational strategy, all virtual host configurations are contained within `server` configuration blocks that are in turn contained within the `http` block in the `nginx.conf` file. Consider the following nginx virtual host configuration:

{: .file-excerpt }
/etc/nginx/nginx.conf
:   ~~~ nginx
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
    ~~~

{: .note}
> If you installed nginx from source, the filepath for the configuration file will be different from the one above. For version 1.9.13, the virtual hosts configuration will be done in `/opt/nginx/conf/nginx.conf` and the default configuration may look a bit different.
>
> Rather than showing full file paths, the configuration will begin with directories within `/opt/nginx` and do not need to be manually created as in the next step. 
>
> For example, the document root will be set to `html` which simply means `/opt/nginx/html`.

Create the directories referenced in this configuration by issuing the following commands:

    mkdir -p /srv/www/example.com/public_html
    mkdir -p /srv/www/example.com/logs

There are several methods you can use to ensure that these options are included in your nginx configuration. If you're using the packages from the Ubuntu repositories, create the above virtual hosting configuration in the `/etc/nginx/sites-available/example.com` file and then issue the following command to enable the site and restart the web server:

    ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled
    /etc/init.d/nginx restart

To deactivate a site, simply delete the symbolic link by issuing the following commands:

    rm /etc/nginx/sites-enabled/example.com
    /etc/init.d/nginx restart

The source file is saved, and the site can be re-enabled at any time by recreating the symbolic link.

If you installed the web server after compiling it from source you have a number of options. You may insert the server directives directly into the `http` section of the `/opt/nginx/conf/nginx.conf` or `/etc/nginx/nginx.conf` file, although this may be difficult to manage. You may also replicate the management system created by the Ubuntu packages by creating `sites-available/` and `sites-enabled/` directories and inserting the following line into your `nginx.conf` file:

{: .file-excerpt }
nginx.conf
:   ~~~ nginx
    http {
    # [...]

    include /opt/nginx/sites-enabled/*;

    # [...]       
    }
    ~~~

Modify the include statement to point to the path of your `sites-enabled` directory. In some circumstances, it may make more sense to create and include a file named `/opt/nginx-sites.conf` that is included in the `nginx.conf` file as follows:

{: .file-excerpt }
nginx.conf
:   ~~~ nginx
    http {
    # [...]

    include /opt/nginx-sites.conf;

    # [...]       
    }
    ~~~

Then, depending on the size and nature of your deployment, place your virtual host configurations either directly in the `/opt/nginx-sites.conf` file or include statements for server-specific configuration files in the `nginx-sites.file`. For more information regarding nginx configuration options, consider our [overview of nginx configuration](/docs/websites/nginx/basic-nginx-configuration).

Once you've configured and loaded the nginx configuration, restart the web server to implement the new configuration by issuing the following command:

    /etc/init.d/nginx restart

Make sure that the directories referenced in your configuration exist on your file system before restarting.

## Deploy PHP with FastCGI

In order to deploy PHP applications, you will need to implement the following "PHP-FastCGI" solution to allow nginx to properly handle and serve pages that contain PHP code. Begin the deployment process by issuing the following command to install the required dependencies:

    sudo apt-get install php5-cli php5-cgi php5-fpm

Consider the following nginx virtual host configuration. Modify your configuration to resemble the one below, and ensure that the `location ~ \.php$ { }` resembles the one in this example:

{: .file }
nginx virtual host configuration
:   ~~~ nginx
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
    ~~~

**Important security note:** If you're planning to run applications that support file uploads (images, for example), the above configuration may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP. For more information on the specifics of this behavior, you may wish to review the information provided on [Neal Poole's blog](https://nealpoole.com/blog/2011/04/setting-up-php-fastcgi-and-nginx-dont-trust-the-tutorials-check-your-configuration/).

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server.

~~~ nginx
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
}
~~~

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an "/images" directory.

~~~ nginx
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
    fastcgi_pass unix:/var/run/php5-fpm.sock;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
}
~~~

When you've completed the modifications to the configuration, make sure that the virtual host is enabled and issue the following command to restart the web server:

    sudo service php5-fpm restart
    /etc/init.d/nginx restart

Congratulations! You can now deploy PHP scripts with with your LEMP stack.

## Install the MySQL Database Server

The MySQL database engine may be the leading open source relational database engine, and is a popular database solution for web-based applications. Issue the following command to install the MySQL server packages and required PHP support for MySQL:

    sudo apt-get install mysql-server php5-mysql

During the installation process you will be prompted to set a password for the MySQL root user via a graphical interface. Choose a strong password and keep it in a safe place for future reference.

<!---[![Setting the MySQL root password in Ubuntu 10.04 Lucid.](/docs/assets/1129-66-lucid-01-mysql-root-password.png)](/docs/assets/1129-66-lucid-01-mysql-root-password.png)

Commenting this section out - the screenshot is outdated and needs to be either removed or updated. MySQL is version 5.6 now and has a different interface.
-->

Issue the following command to secure the MySQL instance:

    sudo mysql_secure_installation

Answer all questions prompted during this process. If at any point you need to reset the root password for the *MySQL* server, issue the following command:

    dpkg-reconfigure mysql-server-5.0

Issue the following command to get a root prompt for the MySQL server:

    mysql -u root -p

Enter the root password created above and then issue the following sequence of commands to create the `example` and `username` database users, grant the `username` user access to the `example` database, and exit from the database:

    CREATE DATABASE example;
    CREATE USER 'username' IDENTIFIED BY 's8723hk2';
    GRANT ALL PRIVILEGES ON example.* TO 'username';
    exit

You may now provide the credentials for the `example` database and the `username` user to your application, which will now be able to use the database for its purposes. To ensure that PHP will be able to access the MySQL connector your just installed, restart the PHP service by issue the following command:

    sudo service php5-fpm restart

Congratulations! You now have a fully functional and fully featured LEMP stack for application deployment.

## Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please follow the announcements, lists, and RSS feeds on the pages linked below to ensure you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [nginx Security Advisories](http://nginx.org/en/security_advisories.html)
-   [nginx Announcements](http://nginx.org/)
-   [Spawn FCGI](http://redmine.lighttpd.net/projects/spawn-fcgi/news)

When upstream sources offer new releases, repeat the instructions for installing nginx, and spawn-fcgi, and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.