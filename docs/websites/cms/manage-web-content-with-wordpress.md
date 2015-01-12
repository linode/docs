---
author:
  name: Linode
  email: skleinman@linode.com
description: 'Install and optimize the WordPress blogging and content management system on your Linux VPS.'
keywords: 'install WordPress,WordPress on Linode,WordPress howto'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/cms-guides/wordpress/']
modified: Tuesday, April 19th, 2011
modified_by:
  name: Linode
published: 'Tuesday, July 27th, 2010'
title: Manage Web Content with WordPress
---

WordPress is popular dynamic blog-focused content management system. The software is built upon the popular LAMP stack and features an extensible plugin framework and extensive theme system, which allows site owners and developers to deploy easy to use and powerful publishing tools. As a result, WordPress has in many ways become the default choice for developers and systems administrators who need easily managed blog systems.

This guide assumes you have a complete and up to date system, and that you have completed the [getting started guide](/docs/getting-started/). If you are new to Linux system administration, you may want to review our [administration basics guide](/docs/using-linux/administration-basics) or the [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/).

Install Prerequisites
---------------------

Before installing WordPress, you must ensure that your system has a fully functioning [LAMP stack](/docs/lamp-guides/). Alternatively, you may choose to deploy WordPress on top of a [LEMP stack](/docs/lemp-guides/); however, this may affect some aspects of configuration. Follow the appropriate guide for the distribution of Linux that your system runs.

Additionally, this guide assumes that you are deploying WordPress on the domain `ducklington.org`, where the directory `/srv/www/ducklington.org/public_html/` is the document root where all web accessible files are stored. As the names and locations of domains and files will certainly differ for your system, make the necessary modifications to the commands in this document to conform to the requirements of your deployment.

Install WordPress
-----------------

As of this writing, the latest version of WordPress is 3.0. The latest version of WordPress is always available from the URL `http://wordpress.org/latest.tar.gz`. Issue the following sequence of commands to download and install the required files:

    mkdir /srv/www/ducklington.org/src/
    cd /srv/www/ducklington.org/src/
    wget http://wordpress.org/latest.tar.gz
    tar -zxvf /srv/www/ducklington.org/src/latest.tar.gz
    mv /srv/www/ducklington.org/src/latest.tar.gz /srv/www/ducklington.org/src/wordpress-`date "+%Y-%m-%d"`.tar.gz
    cp -R /srv/www/ducklington.org/src/wordpress/* /srv/www/ducklington.org/public_html/
    rm -rf /srv/www/ducklington.org/src/wordpress/

These commands create a `src/` folder within the `/srv/www/ducklington.org/` directory to store and manage pristine copies of the source files that you use to deploy your WordPress site. The WordPress software contains a mechanism for downloading and installing new versions of WordPress and plug-ins from within the administration interface.

Configure WordPress
-------------------

Ensure that the WordPress installation process has the ability to create the required configuration file by issuing the following command:

    chmod 777 /srv/www/ducklington.org/public_html/

Visit `http://ducklington.org` in your web browser, and follow the steps outlined by the configuration process. Begin with "Creating a Configuration File," and continue past the next informational page by clicking on the "Let's Go!" button. Supply WordPress with the database credentials established when you installed the database server. Finally, select the "Run the install" option, and supply the required values as prompted.

As soon as the installation completes, issue the following commands to reset file permissions and ownership of your files to ensure basic security:

    chmod 755 /srv/www/ducklington.org/public_html/
    chown root:root /srv/www/ducklington.org/public_html/wp-config.php

Additionally, if you are using the Apache web server on a Debian or Ubuntu-based system, you will want to issue the following commands to ensure that `mod_rewrite` is enabled:

    a2enmod rewrite
    /etc/init.d/apache2 restart

You will now be able to log into your new WordPress powered web site site. You can continue the configuration of your WordPress site from the web based interface. Congratulations! You have now successfully installed WordPress!

Install WordPress Super Cache
-----------------------------

Further configuration of WordPress is largely beyond the scope of this document, but the following case provides an overview of the process for installing a new WordPress plugin. In the following procedure, you will install [WP Super Cache](http://wordpress.org/extend/plugins/wp-super-cache/), which provides a robust caching system that can substantially increase your site's performance. Begin by issuing the following commands:

    cd /srv/www/ducklington.org/src 
    wget http://downloads.wordpress.org/plugin/wp-super-cache.0.9.9.3.zip
    unzip wp-super-cache.0.9.9.3.zip
    mv /srv/www/ducklington.org/src/wp-super-cache/ /srv/www/ducklington.org/public_html/wp-content/plugins/

If your system does not have the `unzip` tool installed, you can install it using your system's [package management tool](/docs/using-linux/package-management/). You may now visit the "Plugins" page of the WordPress administration interface, which is located at `http://ducklington.org/wp-admin/plugins.php`. Select the "Activate" link in the "WP Super Cache" section to load the plugin and begin its configuration.

Congratulations, you have now installed the WP Super Cache Plugin! You can install other plugins from the [WordPress Plugin Directory](http://wordpress.org/extend/plugins/) using the method described above at any time.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor your WordPress instance for updates from the automatic upgrade tool to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed. You may additionally want to monitor the [WordPress.org mailing lists](http://codex.wordpress.org/Mailing_Lists) to

When upstream sources offer new releases, use the automatic tools to upgrade in a prompt manner. These practices are crucial for the on going security and functioning of your system.



