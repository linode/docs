---
author:
  name: Edward Angert
  email: docs@linode.com
description: 'Install and optimize the WordPress blogging and content management system on your Linode.'
keywords: 'install WordPress,WordPress on Linode,WordPress how-to,how to install wordpress,how to configure wordpress,ubuntu 16.04'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Friday, October 21, 2016
modified_by:
  name: Edward Angert
published: 'Friday, October 21, 2016'
title: How to Install and Configure WordPress on Ubuntu 16.04
external_resources:
- '[WordPress.org](http://wordpress.org)'
- '[WordPress Codex](http://codex.wordpress.org)'
- '[WordPress Support](http://wordpress.org/support)'
---

WordPress is a popular, dynamic, blog-focused content management system. WordPress can be deployed on a LAMP or LEMP stack, and features an extensive plugin framework and theme system which allows site owners and developers to utilize easy-to-use and powerful publishing tools.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
>All configuration files should be edited with elevated privileges. Remember to include `sudo` before running your editor-of-choice.
>
>Replace each instance of `example.com` in this guide with your site's domain name.

## Before You Begin

-  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and that the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command will output your short hostname; the second, your fully-qualified domain name (FQDN).

-  Configure a [LAMP](/docs/websites/lamp/install-lamp-on-ubuntu-16-04) or [LEMP](/docs/websites/lemp/lemp-server-on-ubuntu-16-04) web stack and confirm that is configured properly.

-  Ensure that MySQL has a database set up for WordPress. If you do not have a WordPress database, create one:

    1.  Enter the MySQL command line:

            mysql -u root -p

    2.  Create the WordPress database:

            CREATE DATABASE wordpress;

    3.  Create a user and grant them privileges for the newly-created `wordpress` database, replacing `wpuser` and `password` with the username and password you wish to use:

            CREATE USER 'wpuser' IDENTIFIED BY 'password';
            GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser';

    4.  Exit MySQL:

            quit

## Install WordPress

1.  Create an `src` directory under your website's directory to store fresh copies of WordPress's source files. In this guide, the home directory `/var/www/html/example.com/` is used as an example. Navigate to that new directory:

        sudo mkdir /var/www/html/example.com/src/
        cd /var/www/html/example.com/src/

2.  Set your web server's user as the owner of your site's directory:

        sudo chown -R www-data:www-data /var/www/html/example.com/

3.  Install the latest version of WordPress and expand it:

        sudo wget http://wordpress.org/latest.tar.gz
        sudo -u www-data tar -xvf latest.tar.gz

4.  Move `latest.tar.gz`, so it is renamed `wordpress` followed by the date to store a backup of the original source files:

        sudo mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz

5.  Move the WordPress files to your `public_html` folder:

        sudo mv wordpress/* ../public_html/

6.  Give WordPress permission to add and edit files in the `public_html` folder:

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html

## Configure WordPress

1.  Visit your domain in your web browser and follow the steps outlined by the configuration process. Select your preferred language,  review the informational page and click the **Let's go!** button. Supply WordPress with the database credentials established when you installed the database server:

    ![WordPress Installer](/docs/assets/wordpress-setup_small.png)

    WordPress will test the credentials, and if successful will prompt you to "Run the install"

2. Fill out the administration information and click "Install WordPress"

    ![WordPress Administrative Information](/docs/assets/wordpress-installation-screen01.png)

    Click **Log In** to log in and continue to the WordPress Admin Area

3.  As currently configured, WordPress will prompt you for FTP information when you install new themes or plugins. To bypass this, modify `wp-config.php` by adding the following lines:

    {: .file-excerpt}
    /var/www/html/example.com/public_html/wp-config.php
    :   ~~~ php
        /** Bypass FTP */
        define('FS_METHOD', 'direct');
        ~~~

4.  If using Apache, issue the following commands to ensure that `mod_rewrite` is enabled and restart Apache to set the changes:

        sudo a2enmod rewrite
        sudo systemctl restart apache2

5.  You can continue the configuration of your WordPress site from the web-based interface, available by adding `/wp-admin` to your URL: `example.com/wp-admin`

Congratulations! You have now successfully installed WordPress.

## WordPress Permalinks

*Permalink* is a portmanteau of the words *permanent* and *link*. Permalinks are links that are automatically created to specific posts or pages in WordPress. WordPress defaults to assigning post numbers as permalinks, meaning that a link to a specific post would look like `example.com/?p=42`. To enforce a "prettier" permalink format, you'll need to make a few adjustments to Apache or nginx.

For more information on permalinks, visit the [WordPress guide on permalinks](https://codex.wordpress.org/Using_Permalinks).

To configure permalink settings:

1.  Log in to the WordPress admin panel through your site's `/wp-admin`

2.  Mouseover **Settings** in the left-hand menu, then click **Permalinks**:

    ![Wordpress Settings Permalinks](../../assets/wordpress-settings-permalinks.png)

3.  Select your preferred permalink style or create your own *Custom Structure* and click **Save Changes**

4.  Configure your webserver to allow WordPress to create the customized URLs:

### Configure WordPress to Allow Permalinks on Apache

Update Apache to allow individual sites to update the `.htaccess` file. To permit this, add the following options to the *Directory* section in your WordPress website's *VirtualHost* code block:

{: .file-excerpt}
/etc/apache2/sites-available/example.com.conf
:   ~~~ apache
        <Directory /var/www/html/example.com/public_html>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>
    ~~~

 Restart Apache to enable the changes:

     sudo systemctl restart apache2

### Configure WordPress to Allow Permalinks on nginx

Nginx needs to be directed to check if the page each permalink refers to exists. By default, nginx assumes that it doesn't, and returns a server-side 404. Update the `location / {` block in your virtual host configuration to match the following:

{: .file-excerpt}
/etc/nginx/sites-available/example.com
:   ~~~ nginx
    location / {
        index index.php index.html index.htm;
        try_files $uri $uri/ /index.php?$args;
    ~~~
