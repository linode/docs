---
author:
  name: Linode
  email: skleinman@linode.com
description: 'Installing, configuring, and optimizing the Drupal content management framework on your Linode.'
keywords: 'drupal,cms,web framework,web application,php,content management system,content management framwork'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/cms-guides/drupal/']
modified: Friday, August 17th, 2012
modified_by:
  name: Linode
published: 'Tuesday, September 29th, 2009'
title: Managing Web Content with Drupal 7
---

Drupal is an advanced and powerful content management framework, built in the PHP programing language and supported by a [database](/docs/databases/) engine like [MySQL](/docs/databases/mysql/). Drupal provides a flexible system that can be used to manage websites of all different sorts and profiles. Drupal is capable of providing the tools necessary to create rich, interactive "community" websites with forums, user blogs, and private messaging; Drupal can also provide support for multifaceted personal publishing projects and can power podcasts, blogs, and knowledge bases systems all within a single unified system.

As the system's functionality is highly modular, one might even be inclined to think about Drupal not strictly as a content management system, but rather as a content management framework. In addition to a the core infrastructure, there are a number of Drupal modules that allow administrators of Drupal sites to provide specific functionality to the users of their sites without needing spend resources on custom development. Furthermore, Drupal has an advanced theming engine that allows for a great deal of flexibility for displaying content in a visually useful and productive manner.

Before we begin with the Drupal installation, there are few other guides in the Linode Library that provide instructions for installing the necessary prerequisites. If you're new to Linux system administration, consider our [using Linux guides](/docs/using-linux/). Before you can install Drupal, please complete our "[getting started guide](/docs/getting-started/)" to get a fully updated and running system. Then, you will want to use one of the [LAMP guides](/docs/lamp-guides/) to get a functioning Linux/Apache/MySQL/PHP stack installed on your Linode. If you want more information about installing [Apache](/docs/web-servers/apache/) or [the MySQL database](/docs/databases/mysql), our guides provide some additional information regarding these dependencies.

With these dependencies installed and running we're ready to begin installing the Drupal Content Management system. We assume that you have a working SSH connection to your server and database credentials to access your database server.

Download and Install Drupal
---------------------------

The Drupal software is frequently updated as bugs are patched and security vulnerabilities are found and removed. Visit the [Drupal download page](http://drupal.org/project/drupal) to find the latest version of the Drupal 7 Release, and download that file rather than the file mentioned in the example below.

If you installed and configured your Apache server as described in our other guides, the publicly accessible DocumentRoot will be in a directory similar to `/srv/www/ducklington.org/public_html/`. You will change directories to the *non-publically accessable* `/srv/www/ducklington.org/` directory, using the following command:

    cd /srv/www/ducklington.org 

Issue this command to download Drupal with `wget`:

    wget http://ftp.drupal.org/files/projects/drupal-7.7.tar.gz

Extract that folder with the following command:

    tar -zxvf drupal-7.7.tar.gz 

Remember to change the commands above to reflect the latest version that you downloaded. Now we can copy this instance of Drupal to your web accessible directory:

    cp -R drupal-7.7/* /srv/www/ducklington.org/public_html/drupal/

If you want Drupal to be installed in the root level of your domain copy the files into the `public_html/` directory rather than into the `public_html/drupal/` directory.

Configure Drupal Settings
-------------------------

First, we need to copy the `default.settings.php` file provided in the Drupal distribution to a `settings.php` file. Do this by issuing the following commands:

    cd /srv/www/ducklington.org/public_html/drupal/sites/default/

    cp default.settings.php settings.php

Secondly, we'll need to create a `drupal/sites/default/files/` directory that's writable by the web server, by changing the group ownership and permissions of the directory to `www-data` or whichever user group your Apache instance runs under:

    mkdir /srv/www/ducklington.org/public_html/drupal/sites/default/files/

    chgrp www-data /srv/www/ducklington.org/public_html/drupal/sites/default/files/

    chmod 775 /srv/www/ducklington.org/public_html/drupal/sites/default/files/

You will also want to grant Drupal (and thus the web server) the ability to read and write the `settings.php` file during the installation process. Note, that we will revoke these permissions following the installation. Issue the following command, while still in the `drupal/sites/default/` directory:

    chmod 757 settings.php

Now you can follow the Drupal installation process by visiting `http://ducklington.org/drupal/install.php`, altering the previous URL to reflect your domain and the actual path to your Drupal files. You will arrive at an iconic Drupal page and if you select "Install Drupal in English," you will enter the installation process.

The installation process is fairly straightforward and asks you to provide information regarding your database, your site, and your administrative users. Follow each step as instructed. When you've completed the installation process you can remove the write access to the `settings.php` file with the following command:

    chmod 755 /srv/www/ducklington.org/public_html/drupal/sites/default/settings.php 

You're now ready to begin using Drupal.

Using Drupal
------------

Because Drupal is such a flexible and versatile system, it is difficult to recommend any particular set of practices for effective Drupal administration. The following guidelines and suggestions may be helpful on your journey:

-   Drupal sites tend to consume a great deal of system resources because of the way the system interacts with the database server. If you're having this kind of problem, consider adding RAM to your server, or running your database server on a [dedicated database server](/docs/databases/mysql/standalone-mysql-server).
-   While it may be tempting to use many modules, it's often prudent to restrict your use of contributed modules to only those that provide functionality that you actively need. Turn off modules that you're not using to reduce your risk of running out of system resources or presenting possible security vulnerabilities.
-   We--and the Drupal Community--recommend that you avoid doing development work on you production machine. If at all possible, keep a clone of your production environment on an alternate server, or on your local machine. This will allow you to test new modules and changes without affecting your live site.



