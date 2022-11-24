---
slug: how-to-install-and-configure-drupal-on-debian-10
author:
    name: Linode
    email: docs@linode.com
description: 'This guide will show you how to install and configure the very popular content management system, Drupal 8, on your Linode running Debian 10.'
keywords: ["drupal", "cms", "apache", "php", "content management system", "drupal 8", "debian 10"]
tags: ["drupal","apache","lamp","php","cms","debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
    name: Linode
published: 2020-02-18
title: How to Install and Configure Drupal on Debian 10
h1_title: Install and Configure Drupal on Debian 10 (Buster)
image: L_Drupal_on_Debian10.png
relations:
    platform:
        key: how-to-install-drupal
        keywords:
           - distribution: Debian 10
aliases: ['/websites/cms/drupal/how-to-install-and-configure-drupal-on-debian-10/']
---

Drupal 8 is the latest version of the popular [Drupal](https://www.drupal.org/) content management system. This guide demonstrates how to install Drupal 8 on your Linode running Debian 10.

{{< note >}}
If you are not using Debian 10, you can view different Linux distribution versions of this guide in the [Drupal](/docs/websites/cms/drupal/) section of our documentation site.
{{</ note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for [setting your Linode's hostname](/docs/guides/set-up-and-secure/#configure-a-custom-hostname) and [timezone](/docs/guides/set-up-and-secure/#set-the-timezone).

1. Follow our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account), [harden SSH access](/docs/guides/set-up-and-secure/#harden-ssh-access), [remove unnecessary network services](/docs/guides/set-up-and-secure/#remove-unused-network-facing-services) and [create firewall rules](/docs/guides/set-up-and-secure/#configure-a-firewall) for your web server; you may need to make additional firewall exceptions for your specific application.

    {{< content "limited-user-note-shortguide" >}}

3.  Install and configure a [LAMP stack on Debian 10](/docs/guides/how-to-install-a-lamp-stack-on-debian-10/)

## Download and Prepare Drupal 8

1. Navigate to your site's document root. If you installed and configured your Apache server using our [LAMP stack on Debian 10](/docs/guides/how-to-install-a-lamp-stack-on-debian-10/) guide, your document root should be located in the `/var/www/html/example.com/public_html/` directory. Replace `example.com` with your own document root path's name.

        cd /var/www/html/example.com

1. Download the Drupal 8 tarball. As of writing this guide, Drupal 8.8.2 is the latest version. See [Drupal's download page](https://www.drupal.org/project/drupal) for their latest core tarball.

        sudo wget http://ftp.drupal.org/files/projects/drupal-8.8.2.tar.gz

    {{< caution >}}
Ensure that the version number matches the Drupal 8 version you wish to download.
{{< /caution >}}

1.  Extract the downloaded tarball's contents into your site's document root:

        sudo tar -zxvf drupal-8.*.tar.gz --strip-components=1 -C public_html

1.  Drupal depends on a PHP graphics library called GD. Install GD and other dependencies:

        sudo apt-get install php-gd php-xml php-dom php-Simplexml php-mbstring

1. Create your Drupal 8 installation's `settings.php` file from the default settings file. This file will be configured when you run through Drupal's web configuration in the [Drupal First Start](#drupal-first-start) section.

        sudo cp /var/www/html/example.com/public_html/sites/default/default.settings.php /var/www/html/example.com/public_html/sites/default/settings.php

1.  Enforce [trusted hostnames](https://www.drupal.org/node/2410395) with those that users will access your site from. With the text editor of your choice, edit your `settings.php` file replacing the [regular expression (RegEx)](https://www.php.net/manual/en/reference.pcre.pattern.syntax.php) with a pattern that matches your own site's URL(s).

    {{< file "/var/www/html/example.com/public_html/sites/default/settings.php" conf >}}
$settings['trusted_host_patterns'] = array(
  '^www\.example\.com$',
  '^example\.com$',
  );

{{< /file >}}

    {{< note >}}
`trusted_host_patterns` also accepts IP addresses or localhost.
{{< /note >}}

## Configure Apache 2.4

1.  Enable Apache's [rewrite module](https://httpd.apache.org/docs/current/mod/mod_rewrite.html). This module is necessary since Drupal 8 enables [Clean URLs](https://www.drupal.org/getting-started/clean-urls) by default.

        sudo a2enmod rewrite

2.  Specify the rewrite conditions for your Drupal site's document root in Apache's configuration file using the text editor of your choice. If you installed and configured your Apache server using [LAMP stack on Debian 10](/docs/guides/how-to-install-a-lamp-stack-on-debian-10/) guide, the configuration file for your site is located at `/etc/apache2/sites-available/example.com.conf`.

    {{< file "/etc/apache2/sites-available/example.com.conf" conf >}}
<Directory /var/www/html/example.com/public_html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
      RewriteEngine on
      RewriteBase /
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule ^(.*)$ index.php?q=$1 [L,QSA]
</Directory>
{{< /file >}}

1.  Change the ownership of your site's document root from `root` to `www-data`. This allows you to install modules and themes, and to update Drupal, without being prompted for FTP credentials.

        sudo chown -R www-data:www-data /var/www/html/example.com

4.  Restart Apache so all changes are applied.

        sudo systemctl restart apache2

## Drupal First Start

1.  Go to your Linode's domain or IP address in a web browser. This will show you the first step of Drupal 8's web configuration. Choose your language and proceed to the next page.

    ![Drupal 8 choose language.](drupal-choose-language.png)

2.  Choose whether you want a *Standard* or *Minimal* installation profile.

    ![Drupal 8 choose installation profile.](drupal-choose-installation-profile.png)

3.  Complete the database configuration using the DB name, username and password you created when [setting up your LAMP stack](/docs/guides/how-to-install-a-lamp-stack-on-debian-10/) with a MySQL or MariaDB database.

    ![Drupal 8 database configuration.](drupal-database-configuration.png)

    {{< note >}}
If you forgot the name of your database, log back in to MySQL or MariaDb with: `mysql -u root -p` and enter: `show databases;`.
{{< /note >}}

4.  After Drupal 8 installs your site, you'll be shown a site configuration page where you must create the admin user for your website. Do not use the same password that you used for your database.

    ![Drupal 8 site configuration.](drupal-site-configuration.png)

    Next, you'll be taken to the administrative dashboard which will say that Drupal 8 was installed successfully.

    ![Drupal 8 installed welcome.](drupal-installed-welcome.png)

5.  Now that Drupal 8 is finished writing to `settings.php` and `services.yaml`, you can restore their default permissions:

        sudo chmod 644 /var/www/html/example.com/public_html/sites/default/{settings.php,services.yml}

## Where to Go From Here

Drupal has a significant amount of documentation for [security best practices](https://www.drupal.org/security/secure-configuration) to consider when hardening any Drupal server. There is also extensive [community documentation](https://www.drupal.org/documentation) and there are multiple ways of [participating in the Drupal community](https://www.drupal.org/community).
