---
author:
  name: Linode
  email: docs@linode.com
description: 'Installing, configuring, and optimizing the Drupal content management framework on your Linode.'
keywords: ["drupal", "cms", "web framework", "web application", "php", "content management system", "content management framwork"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/cms-guides/drupal/']
modified: 2014-11-06
modified_by:
  name: Linode
published: 2009-09-29
title: Installing Drupal 7
---

Drupal is an advanced and powerful content management framework, built on the PHP scripting language and supported by a [database](/docs/databases/) engine like [MySQL](/docs/databases/mysql/). Drupal provides a flexible system that can be used to manage websites of all different types and profiles. Drupal is capable of providing the tools necessary to create rich, interactive "community" websites with forums, user blogs, and private messaging. Drupal can also provide support for multifaceted personal publishing projects and can power podcasts, blogs, and knowledge-based systems, all within a single, unified platform.

As the system's functionality is highly modular, one might even be inclined to think about Drupal not strictly as a content management system but rather as a content management framework. In addition to the core infrastructure, there are a number of Drupal modules that allow administrators of Drupal sites to provide specific functionality to the users of their sites without needing to spend resources on custom development. Furthermore, Drupal has an advanced theming engine that allows for a great amount of flexibility for displaying content in a visually useful and productive manner.

## Prerequisites

Before we begin with the Drupal installation, there are few other guides that provide instructions for installing the necessary prerequisites.

- If you're new to Linux system administration, consider our [Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics/) guides.
- Before you can install Drupal, please complete our [Getting Started](/docs/getting-started/) guide to get a fully updated and running system.
- Then, you will want to use one of the [LAMP](/docs/lamp-guides/) guides, or for beginners, the [Hosting a Website](/docs/websites/hosting-a-website) guide to get a functioning Linux/Apache/MySQL/PHP stack installed on your Linode.
- If you want more information about installing [Apache](/docs/web-servers/apache/) or [the MySQL database](/docs/databases/mysql), our guides provide some additional information regarding these dependencies.

With these dependencies installed and running, we're ready to begin installing the Drupal content management system. We assume that you have a working SSH connection to your server and database credentials to access your database server.

{{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as ``root`` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Download and Install Drupal 7

The Drupal software is frequently updated as bugs are patched and security vulnerabilities are found and removed. Visit the [Drupal download page](http://drupal.org/project/drupal) to find the latest version of the Drupal 7 Release, and download that file rather than the file mentioned in the example below. A sample release chart is pictured below.

[![Drupal Download Chart.](/docs/assets/drupal-download-7.png)](/docs/assets/drupal-download-7.png)

1.  If you installed and configured your Apache server as described in our other guides, the publicly accessible DocumentRoot will be in a directory similar to `/var/www/example.com/public_html/`. You will change directories to the *non-publicly accessible* `/var/www/example.com/` directory, using the following command:

        cd /var/www/example.com

2.  Download Drupal with `wget`:

        wget http://ftp.drupal.org/files/projects/drupal-7.32.tar.gz

3.  Extract the file:

        tar -zxvf drupal-7.32.tar.gz

4.  Now, we can copy this instance of Drupal to a new web-accessible directory:

         cp -R drupal-7.32/* /var/www/example.com/public_html/drupal/

5. Move the following files to the new directory as well:


         mv drupal-7.32/.htaccess /var/www/example.com/public_html/drupal/

         mv drupal-7.32/.gitignore /var/www/example.com/public_html/drupal/


     {{< note >}}
If you want Drupal to be installed in the root level of your domain, copy the files into the `public_html/` directory rather than into the `public_html/drupal/` directory.
{{< /note >}}

6. Drupal depends on a graphics library of PHP5 called GD. Install GD with the following command:

        apt-get install php5-gd

7. **Optional:** To name URLs, Drupal 8 requires that the Apache2 rewrite module is turned on. This is optional for Drupal 7. To enable rewrites enter the following command:

        a2enmod rewrite

8. Apache2 prompts you to restart:

        service apache2 restart

Remember to change the commands above to reflect the latest version or version that you want to download.

## Configure Drupal Settings

1.  Change directories to Drupal's `default` folder:

        cd /var/www/example.com/public_html/drupal/sites/default/

2. Copy the `default.settings.php` file to `settings.php`:

        cp default.settings.php settings.php

3.  Create a `drupal/sites/default/files/` directory that's writable by the web server by changing the group ownership and permissions of the directory to `www-data` or whichever user group your Apache instance runs under:

        mkdir /var/www/example.com/public_html/drupal/sites/default/files/

        chgrp www-data /var/www/example.com/public_html/drupal/sites/default/files/

        chmod 775 /var/www/example.com/public_html/drupal/sites/default/files/

4.  Grant Drupal - and thus the web server - the ability to read and write the `settings.php` file during the setup process. Note that we will revoke these permissions after completing the setup. Issue the following command while still in the `drupal/sites/default/` directory:

        chmod 757 settings.php

5.  Now, follow the Drupal installation process by visiting `http://example.com/drupal/install.php` and then altering the URL to reflect your domain or IP address and the actual path to your Drupal files. You will arrive at an iconic Drupal page where, if you select "Install Drupal in English," you will enter the installation process.


6.  The installation process is fairly straightforward and asks you to provide information regarding your database, your site, and your administrative users. Follow each step as instructed. When you've completed the installation process you can remove the write access to the `settings.php` file with the following command:

        chmod 755 /var/www/example.com/public_html/drupal/sites/default/settings.php

    {{< note >}}
During the creation of the LAMP stack, you should have created a MySQL database. If you have forgotten the name of that database, log back into MySQL with the `mysql -u root -p` command and then enter the `show databases;` command.
{{< /note >}}

You're now ready to begin using Drupal.

## Using Drupal


Because Drupal is such a flexible and versatile system, it is difficult to recommend any particular set of practices for effective Drupal administration. The following guidelines and suggestions may be helpful on your journey:

-   Drupal sites tend to consume a great deal of system resources because of the way the system interacts with the database server. If you're having this kind of problem, consider resizing your Linode for more RAM or running your database on a [dedicated database server](/docs/databases/mysql/using-mysql-relational-databases-on-debian-7-wheezy).
-   While it may be tempting to use many modules, it's often prudent to restrict your use of contributed modules to only those that provide functionality that you actively need. Turn off modules that you're not using to reduce your risk of running out of system resources or presenting possible security vulnerabilities.
-   Linode - and the Drupal community - recommend that you avoid doing development work on you production machine. If at all possible, keep a clone of your production environment on an alternate server or on your local machine. This will allow you to test new modules and changes without affecting your live site.



