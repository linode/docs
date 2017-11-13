---
author:
  name: Edward Angert
  email: docs@linode.com
description: 'Install and optimize the WordPress blogging and content management system on your Linode.'
keywords: ["install WordPress", " WordPress on Linode", " how to configure WordPress", " Permalink"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-10-21
modified_by:
  name: Edward Angert
published: 2016-10-21
title: Install WordPress on Ubuntu 16.04
external_resources:
- '[WordPress.org](http://wordpress.org)'
- '[WordPress Codex](http://codex.wordpress.org)'
- '[WordPress Support](http://wordpress.org/support)'
---

In this guide, you'll learn to how to install WordPress on a Linode running Ubuntu 16.04. WordPress is a popular dynamic content management system focused on blogs. WordPress can be deployed on a LAMP or LEMP stack, and features an extensive plugin framework and theme system that allows site owners and developers to use its simple, yet powerful publishing tools.

![Install WordPress on Ubuntu 16.04](/docs/assets/wordpress-ubuntu-16-04-title.png "Install WordPress on Ubuntu 16.04")

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

All configuration files should be edited with elevated privileges. Remember to include `sudo` before running your text editor.

Replace each instance of `example.com` in this guide with your site's domain name.
{{< /note >}}

## Before You Begin

-   This guide assumes you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and that your Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command will output your short hostname; the second, your fully-qualified domain name (FQDN).

-   Configure a [LAMP](/docs/websites/lamp/install-lamp-on-ubuntu-16-04) or [LEMP](/docs/websites/lemp/lemp-server-on-ubuntu-16-04) web stack.

-   Make sure MySQL has a database set up for WordPress. If you do not have a WordPress database, create one:

    1.  Log in to the MySQL command line as the root user:

            mysql -u root -p

    2.  Create the WordPress database:

            CREATE DATABASE wordpress;

    3.  Create a user and grant them privileges for the newly created `wordpress` database, replacing `wpuser` and `password` with the username and password you wish to use:

            CREATE USER 'wpuser' IDENTIFIED BY 'password';
            GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser';

    4.  Exit MySQL:

            quit

## Install WordPress

1.  Create a directory called `src` under your website's directory to store fresh copies of WordPress's source files. In this guide, the home directory `/var/www/html/example.com/` is used as an example. Navigate to that new directory:

        sudo mkdir /var/www/html/example.com/src/
        cd /var/www/html/example.com/src/

2.  Set your web server's user, `www-data`, as the owner of your site's home directory:

        sudo chown -R www-data:www-data /var/www/html/example.com/

3.  Install the latest version of WordPress and extract it:

        sudo wget http://wordpress.org/latest.tar.gz
        sudo -u www-data tar -xvf latest.tar.gz

4.  Rename `latest.tar.gz` as `wordpress` followed by the date to store a backup of the original source files. This will be useful if you install new versions in the future and need to revert back to a previous release:

        sudo mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz

5.  Create a `public_html` directory to be the root directory for WordPress. Move the WordPress files to your `public_html` folder:

        sudo mkdir /var/www/html/example.com/public_html/
        sudo mv wordpress/* ../public_html/

6.  Give your web server ownership of the `public_html` folder:

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html

## Configure WordPress

1.  Visit your domain in a web browser and follow the steps shown onscreen. Select your preferred language, review the information page and click the **Let's go!** button. Enter the database credentials that were set when you installed MySQL:

    ![WordPress Installer](/docs/assets/wordpress-setup_small.png)

    WordPress will test the credentials and if authentication is successful, prompt you to **Run the install**.

    {{< note >}}
If Wordpress doesn't display when you visit your domain, try adding `/wp-admin` to the end of the URL. This sometimes happens if you previously created an index file in your site's home directory.
{{< /note >}}

2.  Fill out the administration information and click **Install WordPress**.

    ![WordPress Administrative Information](/docs/assets/wordpress-installation-screen01.png)

    Click **Log In**, enter your credentials and proceed to the WordPress Dashboard.

3.  By default, WordPress will prompt you for FTP credentials when you install new themes or plugins. To bypass this, modify your `wp-config.php` file by adding the following lines:

    {{< file-excerpt "/var/www/html/example.com/public_html/wp-config.php" php >}}
/** Bypass FTP */
define('FS_METHOD', 'direct');

{{< /file-excerpt >}}


4.  If you're using Apache, run the following commands to ensure that `mod_rewrite` is enabled and then restart Apache to apply the changes:

        sudo a2enmod rewrite
        sudo systemctl restart apache2

5.  To make changes to your site in the future, you can access the Dashboard of your WordPress site from the web interface by adding `/wp-admin` to your site's URL: `example.com/wp-admin`.

Congratulations! You have now successfully installed WordPress.

## Create WordPress Permalinks (Optional)

*Permalink* is a portmanteau of the words *permanent* and *link*. Permalinks are URLs that are automatically created for specific posts or pages in WordPress so that you or others can link to them. WordPress's default settings assign post numbers as permalinks, meaning a link to a specific post would look like `example.com/?p=42`. To enforce a "prettier" permalink format, you'll need to make a few adjustments to Apache or nginx.

For more information on permalinks, visit the [WordPress guide on permalinks](https://codex.wordpress.org/Using_Permalinks).

To configure permalink settings:

1.  Log in to the WordPress admin panel through your site's `/wp-admin` URL.

2.  Mouseover **Settings** in the menu on the left of your screen, then click **Permalinks**:

    ![Wordpress Settings Permalinks](/docs/assets/wordpress-settings-permalinks.png)

3.  Select your preferred permalink style or create your own *Custom Structure* and click **Save Changes**

4.  Configure your web server to allow WordPress to create the customized URLs using the appropriate section below.

### Configure WordPress to Allow Permalinks on Apache

Instruct Apache to allow individual sites to update the `.htaccess` file, by adding the following options to the *Directory* section in your virtual host configuration:

{{< file-excerpt "/etc/apache2/sites-available/example.com.conf" apache >}}
<Directory /var/www/html/example.com/public_html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

{{< /file-excerpt >}}


Restart Apache to enable the changes:

    sudo systemctl restart apache2

### Configure WordPress to Allow Permalinks on nginx

Direct nginx to check whether each permalink refers to an existing page. By default, nginx assumes that it doesn't, and returns a server-side 404. Update the following lines in the `location / {` block in your virtual host configuration:

{{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
location / {
    index index.php index.html index.htm;
    try_files $uri $uri/ /index.php?$args;

{{< /file-excerpt >}}


## Configure Maximum File Size Upload Setting to Allow Larger Files

By default, PHP restricts web uploads to under two megabytes. To allow larger file uploads through the web interface, configure the `upload_max_filesize` setting in `php.ini`:

**Apache**: `/etc/php/7.0/apache2/php.ini`
**nginx**: `/etc/php/7.0/fpm/php.ini`

    {{< file-excerpt php >}}
; Maximum allowed size for uploaded files.
; http://php.net/upload-max-filesize
upload_max_filesize = 2M
{{< /file-excerpt >}}

## Install Optional PHP Extensions

Wordpress, and many of its plugins, use PHP extensions that you'll need to install manually. This section is optional, but it will allow you to access some Wordpress features you may not have with a basic PHP installation.

-   In order to modify photos or images in Wordpress, you'll need the PHP-GD extension. For example, when you upload an image to use as a header, you may need to crop the image to make it fit your page.

    To install the GD extension:

        sudo apt install php7.0-gd

-   For full non-English language support and to fix certain character encoding-related bugs, you'll need the multibyte string (MBSTRING) extension.

    To install MBSTRING:

        sudo apt install php7.0-mbstring

-   To use XML-RPC to access Wordpress via the mobile app, or to use Jetpack, you'll need `php-xmlrpc`.  For more information on XML-RPC, visit the [WordPress guide on XML-RPC](https://codex.wordpress.org/XML-RPC_Support). For more information on Jetpack, visit [Jetpack for Wordpress](https://jetpack.com/).

    To install the XML-RPC extension:

        sudo apt install php7.0-xmlrpc

These are only a few of the extensions you may find useful. Plenty of other PHP extensions exist and are required for certain plugin features, such as `php7.0-curl`, `php7.0-xml`, and `php7.0-mcrypt`. If you're having issues with a plugin or widget, check its documentation to see if a PHP extension is required.

{{< note >}}
The package names above assume you're working with PHP version 7.0. If you installed PHP 5 from the Ubuntu repositories, modify the commands to use the `php` prefix rather than `php7.0`. For example, instead of installing `php7.0-gd`, use `php-gd`.
{{< /note >}}
