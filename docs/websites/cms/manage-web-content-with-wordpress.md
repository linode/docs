---
author:
  name: Linode
  email: docs@linode.com
description: 'Install and optimize the WordPress blogging and content management system on your Linux VPS.'
keywords: 'install WordPress,WordPress on Linode,WordPress howto'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/cms-guides/wordpress/']
modified: Wednesday, June 10, 2015
modified_by:
  name: Ramesh Vishveshwar
published: 'Tuesday, July 27th, 2010'
title: Manage Web Content with WordPress
external_resources:
- '[WordPress.org](http://wordpress.org)'
- '[WordPress Codex](http://codex.wordpress.org)'
- '[WordPress Support](http://wordpress.org/support)'
---

WordPress is popular dynamic blog-focused content management system. The software is built upon the LAMP stack and features an extensible plugin framework and extensive theme system, which allows site owners and developers to deploy easy-to-use and powerful publishing tools.

This guide assumes you have a complete and up-to-date Debian system, and that you have completed the [Getting Started](/docs/getting-started/) guide. If you are new to Linux system administration, you may want to review our [Administration Basics](/docs/using-linux/administration-basics) guide or the [Introduction to Linux Concepts](/docs/tools-reference/introduction-to-linux-concepts/) guide.

{: .note }
>The steps required in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Prerequisites

Before installing WordPress, you must ensure that your system has a fully functioning [LAMP stack](/docs/lamp-guides/). Alternatively, you may choose to deploy WordPress on top of a [LEMP stack](/docs/lemp-guides/); however, this may affect some aspects of configuration.

Additionally, this guide assumes that you are deploying WordPress on the domain `example.com`, where the directory `/var/www/example.com/public_html/` is the document root where all web accessible files are stored. Replace all instances of `example.com` in the code below with your own domain information.

###Prepare WordPress

The WordPress installer assumes you've already created a [MySQL](/docs/websites/lamp/lamp-server-on-debian-7-wheezy#configure-mysql-and-set-up-mysql-databases) database and user that it can use. If you haven't yet, use the following steps to create one.

1.  Enter the MySQL command line:

        mysql -u root -p

2.  Create a database for WordPress. In this example the database name reflects the domain that will serve the WordPress site, but you can choose your own naming convention:

        create database example_com;

3.  Create a user with privileges for the new database. Replace `wordpress` with your desired user name, and `5t1ck` with a strong password:

        grant all on example_com.* to 'wordpress' identified by '5t1ck';

## Install WordPress

As of this writing, the latest version of WordPress is 4.1. The latest version of WordPress is always available from the URL `http://wordpress.org/latest.tar.gz`. Issue the following sequence of commands to download and install the required files:

    mkdir /var/www/example.com/src/
    cd /var/www/example.com/src/
    chown -R www-data:www-data /var/www/
    wget http://wordpress.org/latest.tar.gz
    sudo -u www-data tar -xvf latest.tar.gz
    mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz
    cp -R wordpress/* ../public_html/
    rm -rf wordpress/

These commands create a `src/` folder within the `/var/www/example.com/` directory to store and manage pristine copies of the source files that you use to deploy your WordPress site. New versions of WordPress and plug-ins can be downloaded from within the WordPress administration interface, once installed.

## Configure WordPress

1.  Visit your domain in your web browser, and follow the steps outlined by the configuration process. Begin by reviewing the informational page and clicking the "Let's go!" button. Supply WordPress with the database credentials established when you installed the database server. Finally, select "Run the install" and supply the required values as prompted:

    [![WordPress Installer.](/docs/assets/wordpress-setup_small.png)](/docs/assets/wordpress-setup.png)

2.  As it stands, should you try to update WordPress or install new themes or plugins, you will be asked to input your FTP information. To bypass this you must alter your `wp-config.php` file by adding the following line:

    {: .file-excerpt}
    /var/www/example.com/public_html/wp-config.php
    :   ~~~
        define('FS_METHOD', 'direct');
        ~~~

    Next, give WordPress permission to add and edit files in the `wp_content` folder:

        chown -R www-data:www-data /var/www/example.com/public_html/wp-content

3.  Unless you've decided to use a web server other than Apache, issue the following commands to ensure that `mod_rewrite` is enabled:

        a2enmod rewrite
        service apache2 restart

4.  **Important!** If you plan to use permalinks using fancy names instead of the default (which uses post ID), Wordpress will update the `.htaccess` file. However, by default Apache will not allow individual sites to override the server settings. Open the apache config file and look for the Directory directive for `/var/www`. The initial value will be `AllowOverride None`. This must be changed to `All` to allow individual sites to override server settings


	```<Directory /var/www/>
			Options Indexes FollowSymLinks
			AllowOverride All
			Require all granted
	</Directory>```


You will now be able to log in to your new WordPress-powered website. You can continue the configuration of your WordPress site from the web-based interface.

Congratulations! You have now successfully installed WordPress!

## Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up-to-date versions of all software is crucial for the security and integrity of a system.

WordPress comes with update alerts, accessible within the "Updates" page of your web-based administration interface. From here you can also reinstall WordPress, and update both your WordPress version and any plug-ins you have installed, as needed.
