---
author:
  name: Jonathan Tsai
  email: docs@linode.com
description: 'Running Multiple WordPress Sites on One Linode.'
keywords: 'install WordPress, WordPress on Linode, multiple WordPres, how to configure WordPress, Permalink'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, October 16, 2017
modified_by:
  name: Jonathan Tsai
published: 'Monday, October 16, 2017'
title: Running Multiple WordPress Sites on One Linode
external_resources:
- '[WordPress.org](http://wordpress.org)'
- '[WordPress Codex](http://codex.wordpress.org)'
- '[WordPress Support](http://wordpress.org/support)'
- '[Apache Virtual Host documentation](http://httpd.apache.org/docs/current/vhosts/)
---

In this guide, you'll learn to how to run multiple WordPress sites on a single Linode running Ubuntu 16.04 using Apache Virtual Hosts. WordPress is a popular dynamic content management system that can build anything from blogs to websites to ecommerce stores with the right plugins and setup.

For smaller trafficked websites and personal blogs, it's much more economical to host multiple sites on one server.

![Install WordPress on Ubuntu 16.04](/docs/assets/wordpress-ubuntu-16-04-title.png "Running Multiple WordPress Sites on One Linode")

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
>
>All configuration files should be edited with elevated privileges. Remember to include `sudo` before running your text editor.
>
>Replace each instance of `example.com` or `example` in this guide with your respective site's domain name and namespace keyword.

## Before You Begin

-   This guide assumes you have followed the [Install WordPress on Ubuntu 16.04](/docs/website/cms/install-wordpress-on-ubuntu-16-04) guide, and are familiar with the procedures described there.

-   Configure a [LAMP](/docs/websites/lamp/install-lamp-on-ubuntu-16-04) or [LEMP](/docs/websites/lemp/lemp-server-on-ubuntu-16-04) web stack.

-   Make sure MySQL has a database set up for each separate instance of WordPress that you wish to run. If you do not have a WordPress database, create one:

    1.  Log in to the MySQL command line as the root user:

            mysql -u root -p

    2.  Create the WordPress database(s) with a separate namespace:

            CREATE DATABASE example_wordpress;

    3.  Create a user and grant them privileges for the newly created `example_wordpress` database, replacing `example_wpuser` and `password` with the username and password you wish to use:

            CREATE USER 'example_wpuser' IDENTIFIED BY 'password';
            GRANT ALL PRIVILEGES ON example_wordpress.* TO 'example_wpuser';

    4.  Repeat steps 2 and 3 for each instance of WordPress that you want to run, replacing the `example` namespace with a keyword of your choice representing the additional sites:

            CREATE USER 'example_wpuser' IDENTIFIED BY 'password';
            GRANT ALL PRIVILEGES ON example_wordpress.* TO 'wpuser';

    5.  Exit MySQL:

            quit

## Install Multiple WordPress Instances

The following steps are adapted from the **Install WordPress** section from the [Install WordPress on Ubuntu 16.04](/docs/website/cms/install-wordpress-on-ubuntu-16-04) guide.

1.  Download the latest version of WordPress into a downloads directory and extract it:

        mkdir -p ~/downloads
        cd ~/downloads        
        sudo wget http://wordpress.org/latest.tar.gz
        tar -zxvf latest.tar.gz

2.  Rename `latest.tar.gz` as `wordpress` followed by the date to store a backup of the original source files. This will be useful if you install new versions in the future and need to revert back to a previous release:

        mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz

3.  Create a directory called `src` under your website's directory to store fresh copies of WordPress's source files. In this guide, the home directory `/var/www/html/example.com/` is used as an example. Navigate to that new directory:

        sudo mkdir -p /var/www/html/example.com/src/
        cd /var/www/html/example.com/src/

4.  Set your web server's user, `www-data`, as the owner of your site's home directory:

        sudo chown -R www-data:www-data /var/www/html/example.com/

6.  Copy the WordPress files to your `public_html` folder:

        sudo cp -R ~/downloads/wordpress/* ../public_html/

6.  Give your web server ownership of the `public_html` folder:

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html

7.  Repeat steps 3 through 6 for each instance of WordPress that you want to run.

## Configure WordPress

1.  Follow the steps from the **Configure WordPress** section of the [Install WordPress on Ubuntu 16.04](/docs/website/cms/install-wordpress-on-ubuntu-16-04) guide.

## Configure Apache

Up until this point, the steps have been fairly straightforward and similar to setting up a single instance of WordPress. This guide will now walk through configuring Apache Virtual Hosts so that visiting `example.com` in your browser will show the content served by the code running at `/var/www/html/example.com/public_html` and backed by the MySQL database `example_wordpress`.

1.  Go to the Apache `sites-available` directory:

        cd /etc/apache2/sites-avilable

2.  Create a Virtual Host configuration file, replacing `emacs` with the your editor of choice.

        sudo emacs example.com

3.  Put the following contents in `example.com`:

        <VirtualHost *:80>
          ServerName example.com
          ServerAlias example.com *.example.com
          DocumentRoot /var/www/html/example.com/public_html

          <Directory /var/www/html/example.com/public_html>
            Require all granted
            AllowOverride all
          </Directory>

          RewriteEngine on
          RewriteOptions inherit
        
          # Block .svn, .git
          RewriteRule \.(svn|git)(/)?$ - [F]
        
          # Catchall redirect to www.example.com
          RewriteCond %{HTTP_HOST}   !^www.example\.com [NC]
          RewriteCond %{HTTP_HOST}   !^$
          RewriteRule ^/(.*)         https://www.example.com/$1 [L,R]

          # XSS protection
          <IfModule mod_headers.c>
            Header set X-XSS-Protection "1; mode=block"
            Header always append X-Frame-Options SAMEORIGIN
          </IfModule>
        </VirtualHost>

4.  Enable the site:

        # this will create a symlink to the example.com Apache conf file
        # in /etc/apache2/sites-enabled/
        sudo a2ensite example.com

5.  Restart Apache to enable the changes:

        sudo service restart apache2

6.  Repeat steps 2 through 5 for each instance of WordPress that you want to run.

Finished!
