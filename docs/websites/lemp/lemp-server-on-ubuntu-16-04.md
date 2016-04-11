---
author:
  name: Linode
  email: docs@linode.com
description: 'Install web applications with "LEMP," a LAMP-like stack using nginx, MySQL, and PHP.'
keywords: 'nginx,lemp,php,linux,web applications'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['lemp-guides/ubuntu-16-04/']
modified: Friday, April 8, 2016
modified_by:
  name: Phil Zona
published: 'Friday, April 8, 2016'
title: 'LEMP Server on Ubuntu 16.04 (Xenial Xerus)'
external_resources:
 - '[Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
 - '[Official Nginx Documentation](http://nginx.org/en/docs/#introduction)'
 ---

This guide describes an alternative to the "LAMP" (Linux, Apache, MySQL, and PHP) stack, known as "LEMP." The LEMP stack replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP,) which can increase the ability of the server to scale in response to demand.

Prior to beginning this guide, please complete the [getting started guide](/docs/getting-started/), specifically [setting your hostname](/docs/getting-started#setting-the-hostname). If you are new to Linux systems administration, you may want to consider the [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts) and the [Linux administration basics guide](/docs/using-linux/administration-basics).

This guide is for a non-root user, although many commands will require root privileges. Be sure your system and all packages are fully up-to-date before beginning.

## Install the Nginx Web Server

Nginx may be installed from the Ubuntu package repository. This is the recommended installation method as all dependencies will be included and you will not need to monitor for nginx-specific updates.

Use APT to install nginx:

    sudo apt-get install nginx

As of this writing, this command will install version 1.9.14 of the nginx server. Future updates to the nginx version may take place if your system packages are continuously updated, but minor updates will not significantly affect the configuration process.

## Configure Nginx Virtual Hosting

Older versions of nginx specified site directories and other information in the main `nginx.conf` file, but newer versions, such as the ones included with Ubuntu 16.04, are more compartmentalized. As you read through this section, make note of each file's contents and location so that you are familiar with the structure and know where to go if you need to customize one particular aspect of your web server. 

You will need to configure `server` directives to specify name-based virtual hosts (also called "server blocks," a term specific to nginx). All virtual host configurations are contained within `server` directives that are in turn contained within the site files in `/etc/nginx/sites-available`. When activated, these are included in the main nginx configuration by default.

Nginx 1.9.14 includes a sample configuration that you may use as a template. To create a new file with a basic server block for configuration, enter the following command, replacing `example.com` with your domain:

    tail /etc/nginx/sites-available/default -n 18 >> /etc/nginx/sites-available/example.com

Alternatively, you may manually copy the last section from `/etc/nginx/sites-available/default` into a new file, `/etc/nginx/sites-available/example.com`. 

Consider the following nginx virtual host configuration (these lines will need to be uncommented if you copied the template from `default`):

{: .file-excerpt }
/etc/nginx/sites-available/example.com
:   ~~~ nginx
    server {
        listen 80;
        listen [::]:80;

        server_name www.example.com example.com;

        root   /var/www/example.com/public_html;
        index  index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }
    ~~~

{: .note}
> If your index page includes PHP, add `index.php` to the line beginning with `index`. 

Create the root directory referenced in this configuration by issuing the following command:

    mkdir -p /var/www/example.com/public_html

Issue the following command to enable the site and restart the web server:

    ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled
    sudo service nginx restart

To deactivate a site, simply delete the symbolic link by issuing the following commands:

    rm /etc/nginx/sites-enabled/example.com
    sudo service nginx restart

The source file is saved, and the site can be re-enabled at any time by recreating the symbolic link.

If you are using nginx to host more than one site, create multiple virtual host files using the method above.

You may also want to edit the `http` block in `/etc/nginx/nginx.conf`, which applies across all sites and allows the following options, among others:

-   Hiding HTTP header information using `server_tokens`
-   Configuring SSL/TLS settings
-   Customizing log file paths 

## Deploy PHP with FastCGI

In order to deploy PHP applications, you will need to implement the following "PHP-FastCGI" solution to allow nginx to properly handle and serve pages that contain PHP code. Begin the deployment process by issuing the following command to install the required dependencies:

    sudo apt-get install php7.0-cli php7.0-cgi php7.0-fpm

Consider the following nginx virtual host configuration. Modify your configuration to resemble the one below, and ensure that the `location ~ \.php$ { }` block resembles the one in this example:

{: .file }
/etc/nginx/sites-available/example.com
:   ~~~ nginx
    server {
    
        ...

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            include fastcgi_params;
            fastcgi_pass unix:/run/php/php7.0-fpm.sock;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public_html$fastcgi_script_name;
        }
    }    
    ~~~

When you've made these modifications to the configuration, make sure that the virtual host is enabled and issue the following command to restart the web server:

    sudo service php7.0-fpm restart
    sudo service nginx restart

Congratulations! You can now deploy PHP scripts with with your web server.

## Install the MySQL Database Server

The MySQL database engine is one of the leading open source relational database engines, and is a popular database solution for web-based applications. Issue the following command to install the MySQL server packages and required PHP support for MySQL:

    sudo apt-get install mysql-server php7.0-mysql

During the installation process you will be prompted to set a password for the MySQL root user via a graphical interface. Choose a strong password and keep it in a safe place for future reference.

<!-- [![Setting the MySQL root password in Ubuntu 10.04 Lucid.](/docs/assets/1129-66-lucid-01-mysql-root-password.png)](/docs/assets/1129-66-lucid-01-mysql-root-password.png)

Commenting this section out - the screenshot is outdated and needs to be either removed or updated. MySQL is version 5.7 now and has a different interface. -->

Issue the following command to secure the MySQL instance:

    sudo mysql_secure_installation

Answer all questions prompted during this process. Next, issue the following command to get a root prompt for the MySQL server:

    mysql -u root -p

Enter the root password created above and then issue the following sequence of commands to create the `example` and `username` database users (make sure you choose a secure `password`), grant the `username` user access to the `example` database, and exit from the database:

    CREATE DATABASE example;
    CREATE USER 'username' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON example.* TO 'username';
    exit

You may now provide the credentials for the `example` database and the `username` user to your application, which will now be able to use the database for its purposes. To ensure that PHP will be able to access the MySQL connector your just installed, restart the PHP service by issue the following command:

    sudo service php7.0-fpm restart

Congratulations! You now have a fully functional and fully featured LEMP stack for website and application deployment.
