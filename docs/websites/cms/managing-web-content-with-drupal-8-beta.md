---
author:
    name: Linode
    email: docs@linode.com
description: 'Installing, configuring, and optimizing the Drupal content management framework on your Linode.'
keywords: 'drupal, cms, web framework, web application, php, content management system, content management framwork'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/cms-guides/drupal/']
modified: Tuesday, May 18th, 2015
modified_by:
    name: Linode
published: 'Friday, October 31, 2014'
title: Installing Drupal 8 (beta)
---

[Drupal 8](https://www.drupal.org/drupal-8.0) is the lastest version of the extremely popular [Drupal](https://www.drupal.org/) content management system. The Drupal 8 beta-2 version was released on October 15th, and since it's so new, there isn't much documentation on the web. This how-to article demonstrates all of the necessary steps to install Drupal 8 on your Linode. 

Also consider the video tutorial linked below:

<iframe width="640" height="360" src="https://www.youtube.com/embed/103wI0EslBg" frameborder="0" allowfullscreen></iframe>


##Prerequisites

Before installing Drupal, you will need to ensure that the following prerequisites have been met.

1. Create a new Linode by following our [Getting Started](/docs/getting-started/) guide.
2. Address security concerns with the [Securing Your Server](/docs/securing-your-server) guide.
3. Configure a LAMP stack using the [Hosting a Website](/docs/websites/hosting-a-website) guide.
4. The Linode is up-to-date using the `sudo apt-get update && sudo apt-get upgrade` commands.

{: .note }
>Linode also has other CMS guides, including [Content Management System: an Overview](/docs/websites/cms/cms-overview), [Managing Web Content with Drupal 7](/docs/websites/cms/managing-web-content-with-drupal-7), [Managing Web Content with WordPress](/docs/websites/cms/manage-web-content-with-wordpress), and [Managing Web Content with Joomla](/docs/websites/cms/manage-web-content-with-joomla). Since Drupal 8 is fairly new, if you are not a developer, you may find more online support for Drupal 7.


##Download and Install Drupal 8

The Drupal developers actively update their application for security vulnerabilities and other upgrades. Visit the [Drupal download page](http://drupal.org/project/drupal) for the latest Drupal release. A sample release chart is pictured below. Download the latest Drupal 8 version using the listed version numbers. To download the correct version, replace the version numbers in all the following commands.

[![Drupal Download Versions.](/docs/assets/drupal-downloads.png)](/docs/assets/drupal-downloads.png)

1. If you installed and configured your Apache server as described in our other guides, the publicly accessible DocumentRoot should be located in `/var/www/example.com/public_html/`. Change directories to the *non-publically accessible* `/var/www/example.com/` directory, using the following command:

       cd /var/www/example.com

2. Download Drupal with `wget`. Ensure that the version number matches the version you wish to download:

        sudo wget http://ftp.drupal.org/files/projects/drupal-8.0.0-beta2.tar.gz

3. Extract the downloaded files. Replace the version number if necessary:

        sudo tar -zxvf drupal-8.0.0-beta2.tar.gz

4. Now copy this instance of Drupal to a new web accessible directory named `drupal`. Move the `.htaccess` file to the same directory:

         sudo mkdir /var/www/example.com/public_html/drupal/

         sudo cp -R drupal-8.0.0-beta2/* /var/www/example.com/public_html/drupal/

         sudo mv drupal-8.0.0-beta2/.htaccess /var/www/example.com/public_html/drupal/

     {: .note }
>
>If you want Drupal installed on the root level of your domain, copy the files into the `public_html/` directory, rather than into the `public_html/drupal/` directory.

5. Drupal depends on a PHP5 graphics library called GD. Install GD with the following command:

        sudo apt-get install php5-gd

6. Drupal 8 requires that the Apache2 rewrite module is turned on for naming URLs. This is optional for Drupal 7 and may have already been turned on. Enter the following command to ensure that it has been enabled:

        sudo a2enmod rewrite

7. Restart Apache to apply your changes:

        sudo service apache2 restart


##Configure Drupal Settings

1. Change the working directory to the `drupal` default folder. Then copy the `default.settings.php` file provided in the Drupal distribution to a `settings.php` file. Finally, change the permissions on the file so that Drupal can access the settings:

        cd /var/www/example.com/public_html/drupal/sites/default/

        sudo cp default.settings.php settings.php

        sudo chmod 757 settings.php

2. The same steps are necessary for the services.yml configuration file:

        sudo cp default.services.yml services.yml

        sudo chmod 757 services.yml

3. We'll need to create a `drupal/sites/default/files/` directory that's writable by the web server, and change the group ownership and permissions to match the user group your Apache instance runs under. The default group is `www-data`:

        sudo mkdir /var/www/example.com/public_html/drupal/sites/default/files/

        sudo chgrp www-data /var/www/example.com/public_html/drupal/sites/default/files/

        sudo chmod 775 /var/www/example.com/public_html/drupal/sites/default/files/

4. Visit `www.example.com/drupal/core/install.php`. Alter the previous URL to reflect your domain, and the actual path to your Drupal files. You will arrive at the Drupal install page. Selecting "Install Drupal in English," will start the installation process.

    {: .note }
>
> During the creation of the LAMP stack, you should have created a MySQL database. If you have forgotten the name of that database, log back into MySQL with the `mysql -u root -p` command, and then enter the `show databases;` command.

5. The installation process is fairly straightforward and asks you to provide information regarding your database, your site, and your administrative users. Follow each step as instructed. When you've completed the installation process you can remove the write access to the `settings.php` file:

        sudo chmod 755 /var/www/example.com/public_html/drupal/sites/default/settings.php

You're now ready to begin using Drupal.

##Taking the Next Steps with Drupal

Typically, the next steps would be to install a theme, and then write up some content for the homepage. However, Drupal 8 may not have many themes available yet, so try [creating one](https://www.drupal.org/theme-guide/8). Once you have a theme, try [creating modules](https://www.drupal.org/developing/modules).





