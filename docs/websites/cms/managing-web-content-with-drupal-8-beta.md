---
author:
    name: Linode
    email: docs@linode.com
description: 'Drupal 8 is the lastest version of the popular Drupal content management system. This guide will show you how to install, configure, and optimize the Drupal CMS on your Linode.'
keywords: 'drupal,cms,web framework,web application,php,content management system, content management framwork'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/cms-guides/drupal/']
modified: Tuesday, May 18th, 2015
modified_by:
    name: Linode
published: 'Friday, October 31, 2014'
title: Install and Configure Drupal 8
external_resources:
 - '[MariaDB Documentation](https://mariadb.com/kb/en/mariadb/documentation/)'
---

[Drupal 8](https://www.drupal.org/) is the lastest version of the popular [Drupal](https://www.drupal.org/) content management system. This how-to article demonstrates all of the necessary steps to install Drupal 8 on your Linode which runs CentOS, Debian or Ubuntu.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access, remove unnecessary network services and create firewall rules for your web server; you may need to make addional exceptions for your specific application.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

4.  Configure a LAMP stack using our [Hosting a Website](/docs/websites/hosting-a-website) guide.

    {: .note}
    >
    >If you're using Ubuntu, you can do the entire LAMP install with one command: `sudo apt-get install lamp-server^`.

## Download and Install Drupal 8

1.  See Drupal's [download page](https://www.drupal.org/project/drupal) for the exact URL of Drupal 8's core tarball.

    If you installed and configured your Apache server as described in our other guides, the publicly accessible DocumentRoot should be located in `/var/www/example.com/public_html/`. Change directories to there and download Drupal with wget:

        cd /var/www/example.com
        sudo wget http://ftp.drupal.org/files/projects/drupal-8.0.0.tar.gz

    {: .note}
    >
    >Ensure that the version number matches the version you wish to download:

2.  Extract the downloaded tarball into `/tmp` and copy its contents into `/var/www/example.com/public_html/drupal`:

        sudo tar -zxvf drupal-8.*.tar.gz -C /tmp
        sudo cp -r /tmp/drupal-8*/* /var/www/example.com/public_html

3.  Move the `.htaccess` file to the same directory:

         sudo cp /tmp/drupal-8.0.0-rc3/.htaccess public_html

     {: .note }
>
>If you want Drupal installed on the root level of your domain, copy the files into the `public_html/` directory rather than into the `public_html/drupal/` directory.

4. Drupal depends on a PHP5 graphics library called GD. Install GD with the following command:

        sudo apt-get install php5-gd

5. Drupal 8 requires that the Apache2 rewrite module is turned on for naming URLs. This should be enabled by default and you can verify with:

        sudo a2enmod staus

    If the module is not enabled, enable it with:

        sudo a2enmod rewrite

7. Restart Apache to apply your changes:

        sudo service apache2 restart


##Configure Drupal Settings

1. Change the working directory to the `drupal` default folder. Then, copy the `default.settings.php` file provided in the Drupal distribution to a `settings.php` file. Finally, change the permissions on the file so that Drupal can access the settings:
        
        cd /var/www/example.com/public_html/sites/default
        sudo cp default.settings.php settings.php && sudo chmod 757 settings.php

2. The same steps are necessary for the services.yml configuration file:

        sudo cp default.services.yml services.yml && sudo chmod 757 services.yml

3. We'll need to create a `drupal/sites/default/files/` directory that's writable by the web server and change the group ownership and permissions to match the user group your Apache instance runs under. The default group is `www-data`:

        sudo mkdir /var/www/example.com/public_html/drupal/sites/default/files/

        sudo chgrp www-data /var/www/example.com/public_html/drupal/sites/default/files/

        sudo chmod 775 /var/www/example.com/public_html/drupal/sites/default/files/

4. Visit `www.example.com/drupal/core/install.php`. Alter the previous URL to reflect your domain and the actual path to your Drupal files. You will arrive at the Drupal install page. Selecting "Install Drupal in English" will start the installation process.

    {: .note }
>
> During the creation of the LAMP stack, you should have created a MySQL database. If you have forgotten the name of that database, log back into MySQL with the `mysql -u root -p` command and then enter the `show databases;` command.

5. The installation process is fairly straightforward and asks you to provide information regarding your database, your site, and your administrative users. Follow each step as instructed. When you've completed the installation process you can remove the write access to the `settings.php` file:

        sudo chmod 755 /var/www/example.com/public_html/drupal/sites/default/settings.php

You're now ready to begin using Drupal.

##Taking the Next Steps with Drupal

Typically, the next steps would be to install a theme and then write up some content for the homepage. However, Drupal 8 may not have many themes available yet, so try [creating one](https://www.drupal.org/theme-guide/8). Once you have a theme, try [creating modules](https://www.drupal.org/developing/modules).





