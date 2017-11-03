---
author:
  name: Jonathan Tsai
  email: docs@linode.com
description: 'This guide shows how to configure Apache Virtual Hosts to serve multiple WordPress sites from the same Linode.'
keywords: 'install WordPress, WordPress on Linode, multiple WordPress, how to configure WordPress'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Friday, October 27th, 2017
modified_by:
  name: Linode
contributor:
  name: Jonathan Tsai
published: 'Tuesday, October 24th, 2017'
title: Set Up Apache to Run Multiple WordPress Sites on a Single Linode
external_resources:
- '[WordPress.org](http://wordpress.org)'
- '[WordPress Codex](http://codex.wordpress.org)'
- '[WordPress Support](http://wordpress.org/support)'
- '[Apache Virtual Host documentation](http://httpd.apache.org/docs/current/vhosts/)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

![WordPress on Apache](/docs/assets/multiple-wordpress/Multiple_WordPress.jpg)

## What is WordPress?

WordPress is a popular, dynamic, content management system that makes it easy to build anything from blogs to complete websites and online stores. This guide shows you how to configure your system to run multiple WordPress sites on a single Linode, using Apache Virtual Hosts.

## Before You Begin

-   Configure a [LAMP](/docs/websites/lamp/install-lamp-on-ubuntu-16-04) web stack.

-   This guide assumes you have followed the [Install WordPress on Ubuntu 16.04](/docs/websites/cms/install-wordpress-on-ubuntu-16-04) guide, and are familiar with the procedures described there.

-   Make sure MySQL has a database set up for each separate instance of WordPress that you wish to run. If you do not have a WordPress database, create one:

    1.  Log in to the MySQL command line as the root user:

            mysql -u root -p

    2.  Create the WordPress databases with a separate namespace:

            CREATE DATABASE example1_wordpress;

    3.  Create a user and grant them privileges for the newly created `example1_wordpress` database, replacing `example1_wpuser` and `password` with the username and password you wish to use:

            CREATE USER 'example1_wpuser' IDENTIFIED BY 'password1';
            GRANT ALL PRIVILEGES ON example1_wordpress.* TO 'example1_wpuser';

    4.  Repeat Steps 2 and 3 for each instance of WordPress that you want to run, replacing the `example` namespace with a keyword of your choice representing the additional sites:

            CREATE USER 'example2_wpuser' IDENTIFIED BY 'password2';
            GRANT ALL PRIVILEGES ON example1_wordpress.* TO 'example2_wpuser';

    5.  Exit MySQL:

            quit

-  This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

    -  All configuration files should be edited with elevated privileges. Remember to include `sudo` before running your text editor.

An example of a two WordPress setup is:

{: .table .table-striped}
| Hostname | Database | Username | Password |
| ---------| ---------| ---------| -------- |
| example1.com | example1_wordpress | example1_wpuser | password1 |
| example2.com | example2_wordpress | example2_wpuser | password2 |

Replace each instance of `example.com`, `example`, `example1`, `example2`, and the other example variables in this guide with your respective site's domain name and namespace keyword.

## Install Multiple WordPress Instances

The following steps are adapted from the [Install WordPress](/docs/websites/cms/install-wordpress-on-ubuntu-16-04#install-wordpress) section of the [Install WordPress on Ubuntu 16.04](/docs/websites/cms/install-wordpress-on-ubuntu-16-04) guide.

1.  Create the directory that will host your website and WordPress source files. In this guide, the home directory `/var/www/html/example1.com/` is used as an example. Navigate to that new directory:

        sudo mkdir /var/www/html/example1.com/
        sudo mkdir /var/www/html/example2.com/
        cd /var/www/html/example1.com/

2.  Create a directory called `src` under `/var/www/html/example1.com/`. Download and extract the latest version of WordPress:

        sudo mkdir /var/www/html/example1.com/src/
        sudo mkdir /var/www/html/example2.com/src/
        cd /var/www/html/example1.com/src/
        sudo wget http://wordpress.org/latest.tar.gz
        tar -zxvf latest.tar.gz

3.  Rename `latest.tar.gz` as `wordpress` followed by the date to store a backup of the original source files. This will be useful if you install new versions in the future and need to revert back to a previous release:

        mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz

4.  Set your web server's user, `www-data`, as the owner of your site's home directory:

        sudo chown -R www-data:www-data /var/www/html/example1.com/
        sudo chown -R www-date:www-date /var/www/html/example2.com/

5.  Copy the WordPress files to your `public_html` folder:

        sudo cp -R /var/www/html/example1.com/src/wordpress/* ../public_html/
        sudo cp -R /var/www/html/example2.com/src/wordpress/* ../public_html/

6.  Give your web server ownership of the `public_html` folder:

        sudo chown -R www-data:www-data /var/www/html/example1.com/public_html
        sudo chown -R www-data:www-data /var/www/html/example2.com/public_html

7.  Repeat for each instance of WordPress that you want to run.

## Configure WordPress

Follow the steps from the [Configure WordPress](/docs/websites/cms/install-wordpress-on-ubuntu-16-04#configure-wordpress) section of the [Install WordPress on Ubuntu 16.04](/docs/websites/cms/install-wordpress-on-ubuntu-16-04) guide.

## Configure Apache Virtual Hosts

Up until this point, the steps have been fairly straightforward and similar to setting up a single instance of WordPress. In this section, configure Apache Virtual Hosts so that a visitor to `example1.com` will be served the content in `/var/www/html/example1.com/public_html` and backed by the MySQL database `example1_wordpress`.

1.  Go to the Apache `sites-available` directory:

        cd /etc/apache2/sites-avilable

2.  Copy `000-default.conf` as needed:

        cp 000-default.conf example1.conf
        cp 000-default.conf example2.conf

3.  Put the following contents in `example1.com`:

        <VirtualHost *:80>
          # The primary domain for this host
          ServerName example1.com
          # Optionally have other subdomains also managed by this Virtual Host
          ServerAlias example1.com *.example1.com
          DocumentRoot /var/www/html/example1.com/public_html

          <Directory /var/www/html/example1.com/public_html>
            Require all granted
            # Allow local .htaccess to override Apache configuration settings
            AllowOverride all
          </Directory>

          # Enable RewriteEngine
          RewriteEngine on
          RewriteOptions inherit
        
          # Block .svn, .git
          RewriteRule \.(svn|git)(/)?$ - [F]
        
          # Catchall redirect to www.example1.com
          RewriteCond %{HTTP_HOST}   !^www.example1\.com [NC]
          RewriteCond %{HTTP_HOST}   !^$
          RewriteRule ^/(.*)         https://www.example1.com/$1 [L,R]

          # Recommended: XSS protection
          <IfModule mod_headers.c>
            Header set X-XSS-Protection "1; mode=block"
            Header always append X-Frame-Options SAMEORIGIN
          </IfModule>
        </VirtualHost>

4.  Enable the site. This will create a symlink to the `example.com` Apache conf file in `/etc/apache2/sites-enabled/`:

        sudo a2ensite example1.com

5.  Restart Apache to enable the changes:

        sudo service restart apache2

6.  Repeat Steps 2 through 5 for each WordPress site that you want to run.
