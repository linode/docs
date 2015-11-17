---
author:
    name: Linode
    email: docs@linode.com
description: 'Drupal 8 is the lastest version of the popular Drupal content management system. This guide will show you how to install, configure, and optimize the Drupal CMS on your Linode so you can begin developing your own websites.'
keywords: 'drupal,cms,web framework,web application,apache,apache2,php,content management system, content management framwork'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/cms-guides/drupal/']
modified: Friday, November 20, 2015
modified_by:
    name: Linode
published: 'Friday, November 20, 2015'
title: Install and Configure Drupal 8
---

Drupal 8 is the lastest version of the popular [Drupal](https://www.drupal.org/) content management system. This how-to article demonstrates all of the necessary steps to install Drupal 8 on your Linode running CentOS, Debian or Ubuntu.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access, remove unnecessary network services and create firewall rules for your web server; you may need to make addional firewall exceptions for your specific application.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

4.  Install and configure a LAMP stack. You can do this in one of two ways:

    *  See our [Hosting a Website](/docs/websites/hosting-a-website) guide to configure each component manually.

    *  Deploy using our LAMP [StackScript](/docs/platform/stackscripts).

## Download and Prepare Drupal

1.  See Drupal's [download page](https://www.drupal.org/project/drupal) for the exact URL of Drupal 8's core tarball.

    If you installed and configured your Apache server using one of the methods above, the publicly accessible DocumentRoot should be located at `/var/www/example.com/public_html/`. Change directories to there and download Drupal with wget:

        cd /var/www/example.com
        sudo wget http://ftp.drupal.org/files/projects/drupal-8.0.0.tar.gz

    {: .caution}
    >
    >Ensure that the version number matches the Drupal version you wish to download.

2.  Extract the downloaded tarball's contents into Apache's DocumentRoot:

        tar -zxvf drupal-8.*.tar.gz --strip-components=1 -C public_html

3.  Drupal depends on a PHP5 graphics library called GD. Install GD with:

        sudo apt-get install php5-gd

4.  Drupal's `settings.php` and `services.yml` files are configured when the first start configuration is run. The files must be created from the default templates and permissions changed so that Drupal can write to them.
        
        cd /var/www/example.com/public_html/sites/default
        sudo cp default.settings.php settings.php && sudo cp default.services.yml services.yml
        sudo chmod 666 {services.yml,settings.php}

5.  Enforce [trusted hostnames](https://www.drupal.org/node/2410395) with those that your site will be accessed by:

    {: .file-excerpt}
    /var/www/example.com/public_html/sites/default/settings.php
    :   ~~~ conf
    $settings['trusted_host_patterns'] = array(
      '^www\.example\.com$',
      '^example\.com$',
    );
        ~~~

    {: .note}
    >
    >*trusted_shost_patterns* also accepts IP addresses or localhost.

## Configure Apache 2.4

1.  Drupal enables [Clean URLS](https://www.drupal.org/getting-started/clean-urls) by default so Apache's rewrite module must also be enabled:

        sudo a2enmod rewrite

2.  Then specify the rewrite conditions for DocumentRoot in Apache's configuration file.

    {: .file-excerpt}
    /etc/apache2/apache2.conf
    :   ~~~ conf
        <Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
          RewriteEngine on
            RewriteBase /
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteCond %{REQUEST_URI} !=/favicon.ico
            RewriteRule ^ index.php [L]
        </Directory>
        ~~~

3.  Change ownership of Apache's DocumentRoot from the system's root user to Apache. This allows you to install modules and themes, or to update Drupal.

        sudo chown -R www-data /var/www/example.com

4.  Restart Apache so all changes are applied. If you’re using a Linux distribution which uses systemd (CentOS 7, Debian 8, Fedora):

        sudo systemctl restart apache2

    If your init system is SystemV or Upstart (CentOS 6, Debian 7, Ubuntu):

        sudo service apache2 restart

## Drupal First Start

1.  Go to your Linode's domain or IP address in a web browser. This will show you the first step of Drupal's web configuration. Choose your language and proceed to the next page.

    [![Drupal choose language.](/docs/assets/drupal-choose-language-small.png)](/docs/assets/drupal-choose-language.png)

2.  Choose whether you want a Standard or Minimal installation profile.

    [![Drupal choose installation profile.](/docs/assets/drupal-choose-installation-profile-small.png)](/docs/assets/drupal-choose-installation-profile.png)

3.  Complete the database configuration using the DB name, username and password you created when [setting up your LAMP stack](https://linode.com/docs/websites/hosting-a-website#database) with a MySQL or MariaDB database.

    [![Drupal database configuration.](/docs/assets/drupal-database-configuration-small.png)](/docs/assets/drupal-database-configuration.png)

    {: .note }
    >
    >If you forgot the name of your database, log back into MySQL with: `mysql -u root -p` and enter: `show databases;`.

4.  After Drupal installs your site, you'll be given a site configuration page. Here is where you create the admin user for your website. Do not use the same password as your database.

    [![Drupal site configuration.](/docs/assets/drupal-site-configuration-small.png)](/docs/assets/drupal-site-configuration.png)

    Next you'll be taken to the administrative dashboard which will say that Drupal was installed successfully.

    ![Drupal installed welcome.](/docs/assets/drupal-installed-welcome.png)

5.  Now that Drupal is finished writing to `settings.php` and `services.yaml`, you can restore their default permissions:

        sudo chmod 644 /var/www/example.com/public_html/sites/default/{settings.php,services.yml}

## Where to Go From Here

Drupal has a significant amount of documentation for [security best practices](https://www.drupal.org/security/secure-configuration) to consider when hardening a Drupal server. There is also extensive [community documentation](https://www.drupal.org/documentation) and there are multiple ways of [participating in the Drupal community](https://www.drupal.org/community).