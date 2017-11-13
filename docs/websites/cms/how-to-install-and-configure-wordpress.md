---
author:
  name: Linode
  email: docs@linode.com
description: 'Install and optimize the WordPress blogging and content management system on your Linode.'
keywords: ["install WordPress", "WordPress on Linode", "WordPress how-to", " how to install wordpress", " how to configure wordpress"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/cms-guides/wordpress/','websites/cms/manage-web-content-with-wordpress/']
modified: 2015-10-05
modified_by:
  name: Elle Krout
published: 2010-07-27
title: How to Install and Configure WordPress
deprecated: true
external_resources:
- '[WordPress.org](http://wordpress.org)'
- '[WordPress Codex](http://codex.wordpress.org)'
- '[WordPress Support](http://wordpress.org/support)'
---

WordPress is a popular, dynamic, blog-focused content management system. The software is built upon a LAMP or LEMP stack and features an extensive plugin framework and theme system, which allows site owners and developers to deploy easy-to-use and powerful publishing tools.

If you're using Ubuntu 16.04, please use our guide on how to [Install Wordpress on Ubuntu 16.04](/docs/websites/cms/install-wordpress-on-ubuntu-16-04).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/weh2nc2dad?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div>
<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Before You Begin

-  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and that the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command will output your short hostname; the second, your fully-qualified domain name (FQDN).

-  You have a configured web stack set up. This can be a [LAMP](/docs/websites/lamp/) or [LEMP](/docs/websites/lemp/) stack.


-   MySQL has a database set up for WordPress. If you do not have a database, create it:

    1.  Enter the MySQL command line:

            mysql -u root -p

    2.  Create a WordPress database:

            create database wordpress;

    3.  Create and grant a user privileges for the newly-created `wordpress` database, replacing `user` and `password` with the username and password you wish to use:

            grant all on wordpress.* to 'user' identified by 'password';

    4.  Exit MySQL:

            quit


## Install WordPress

1.  Create an `src` directory under your website's directory to store pristine copies of WordPress's source files. In this guide, the home directory `/var/www/example.com/` is used as an example. Navigate to that new directory:

        sudo mkdir /var/www/html/example.com/src/
        cd /var/www/html/example.com/src/

2.  Set the owner of the new directory to be your web server's user. In this instance, our web server is Apache:

        sudo chown -R www-data:www-data /var/www/

3.  Install the latest version of WordPress and expand it:

        sudo wget http://wordpress.org/latest.tar.gz
        sudo -u www-data tar -xvf latest.tar.gz

4.  Move `latest.tar.gz`, so it is renamed as `wordpress`, followed by the date to store a pristine backup of the source files:

        sudo mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz

5.  Move the WordPress files to your `public_html` folder:

        sudo mv wordpress/* ../public_html/


## Configure WordPress

1.  Visit your domain in your web browser and follow the steps outlined by the configuration process. Begin by reviewing the informational page and clicking the "Let's go!" button. Supply WordPress with the database credentials established when you installed the database server. Finally, select "Run the install" and supply the required values as prompted:

    [![WordPress Installer.](/docs/assets/wordpress-setup_small.png)](/docs/assets/wordpress-setup.png)

2.  As it stands, should you try to update WordPress or install new themes or plugins, you will be asked to input your FTP information. To bypass this, you must alter your `wp-config.php` file by adding the following line:

    {{< file-excerpt "/var/www/html/example.com/public_html/wp-config.php" php >}}
/** Bypass FTP */
define('FS_METHOD', 'direct');

{{< /file-excerpt >}}


    Next, give WordPress permission to add and edit files in the `public_html` folder:

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html

3.  If using Apache, issue the following commands to ensure that `mod_rewrite` is enabled:

        sudo a2enmod rewrite

    Restart Apache.

    {{< note >}}
If using permalinks to set your posts' URLs, Apache will need to be updated to allow individual sites to update the `.htaccess` file. To permit this, add the following to you WordPress website's *VirtualHosts* codeblock:

{{< file-excerpt >}}
<Directory /var/www/>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
{{< /file-excerpt >}}

You will now be able to login to your new WordPress-powered website. You can continue the configuration of your WordPress site from the web-based interface.

Congratulations! You have now successfully installed WordPress.
