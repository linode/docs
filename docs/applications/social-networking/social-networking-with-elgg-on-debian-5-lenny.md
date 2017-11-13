---
author:
  name: Linode
  email: docs@linode.com
description: 'Niche and community social networking with Elgg.'
keywords: ["social networking", "lamp", "elgg", "elgg debian lenny"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/social-networking/elgg/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2009-12-08
title: 'Social Networking with Elgg on Debian 5 (Lenny)'
deprecated: true
---

Elgg is an open source social networking tool that enables groups of people to create and manage common interest sites that allow users to keep blogs, create profiles, join groups, upload files, and update status messages (known as "microblogs"). Updates are shown in a centralized "information feed" so that users can see updates to their friends' profiles or activities.

The inspiration for Elgg comes from popular "general interest" social networking sites like Facebook and My Space, as well as smaller sites like Friendster and Virb. Nevertheless, Elgg sites generally do not compete with the general interest social networking. Rather, they provide an opportunity for smaller, more tightly knit communities to collaborate, share information, and communicate on the Internet. A list of [sites powered by Elgg](http://docs.elgg.org/wiki/Sites_powered_by_Elgg) may offer more insight into Elgg's potential.

Fundamentally, Elgg is a specialized CMS (content management system) designed to power a full-featured social networking site. While a developer familiar with a system like [Drupal](/docs/web-applications/cms-guides/drupal/), [Django](/docs/frameworks/), or [Ruby on Rails](/docs/frameworks/) could build a site with all of the features of Elgg, the Elgg package consolidates the core functionality for these kinds of sites into a single application.

Before beginning, we assume that you have followed our [getting started guide](/docs/getting-started/). You will also need to install a [LAMP stack](/docs/lamp-guides/debian-5-lenny/) before installing Elgg.

If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics). You will need to be logged into your Linode as root in order to complete the installation process.

# Prerequisites for Installing Elgg

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Before you can install Elgg, there are a number of software dependencies that must be installed first. Issue the following command:

    apt-get install php5-gd php-xml-parser unzip php5-mysql

Elgg also makes use of Apache's `mod_rewrite` to make more [human readable URLs](/docs/web-servers/apache/configuration/rewriting-urls). To enable this module, issue the following command:

    a2enmod rewrite

Run the following command to restart the Apache Web server so that `mod_rewrite` is properly initialized:

    /etc/init.d/apache2 restart

You're now ready to install Elgg. For the purposes of this guide, Elgg will be installed at the root level of an Apache virtual host. The `DocumentRoot` for the virtual host will be located at `/srv/www/example.com/public_html/` and the site will be located at `http://example.com/`. You will need to substitute these paths with the paths that you comfigured in your Elgg virtual host.

# Installing Elgg

This document is written against version 1.7 of the Elgg package. Consult the [Elgg download page](http://elgg.org/download.php) to see if there is a more up to date version of the software.

Enter the directory above your `DocumentRoot` and download the latest version of the application. Issue the following two commands:

    cd /srv/www/example.com/
    wget http://elgg.org/getelgg.php?forward=elgg-1.7.zip

You will need to decompress and extract the Elgg files from the archive, and then move them into the `DocumentRoot` root for your host. Issue the following two commands to accomplish this:

    unzip elgg-1.7.zip
    mv /srv/www/example.com/elgg-1.7/* /srv/www/example.com/public_html/

Elgg requires a `data/` directory that exists outside of the publicly accessible `DocumentRoot` to store user submitted content. For the purposes of this guide, this directory is located at `/srv/www/example.com/data/`. To create this directory, issue the following command:

    mkdir /srv/www/example.com/data/

The web server needs to be able to write to the `data/` directory; issue the following command to allow this:

    chmod 777 /srv/www/example.com/data/

Before you can begin to configure Elgg, you will need to create a MySQL username and password as well as a database for Elgg. You should have created a MySQL database as part of the [LAMP setup process](/docs/lamp-guides/debian-5-lenny/), but you can also [configure additional databases and user credentials](/docs/databases/mysql/debian-5-lenny#using-mysql) at any time.

### Configure Elgg

Elgg has an automated installation process; however, before you begin, several values must be set in Elgg's `settings.php` file. Issue the following commands, to duplicate the example file provided by the Elgg developers:

    cd /srv/www/example.com/public_html/engine
    cp settings.example.php settings.php

To configure the database connections, you'll need to edit the file in your preferred text editor and configure the following section. An example of the "standard configuration" follows:

{{< file-excerpt "/srv/www/example.com/public\\_html/engine/settings.php" php >}}
// Database username
      $CONFIG->dbuser = 'elggdbaccess';

// Database password
        $CONFIG->dbpass = 'lo1lip0p';

// Database name
        $CONFIG->dbname = 'elgg';

// Database server
// (For most configurations, you can leave this as 'localhost')
        $CONFIG->dbhost = 'localhost';

// Database table prefix
// If you're sharing a database with other applications,
// you will want to use this to differentiate Elgg's tables.
        $CONFIG->db prefix = 'elgg_example_';

{{< /file-excerpt >}}


Replace the relevant information in your config with the credentials for your database. The `dbhost` will be `localhost` unless you're running the database server on a [different machine](/docs/databases/mysql/standalone-mysql-server).

### Using the Elgg Installation Process

Now visit the Elgg home page. In our example, this is located at `http://example.com/`. You'll see an error presenting you with code needed for the `.htaccess` file. Copy this example `.htaccess` into a new `.htaccess` file in the `DocumentRoot` directory.

Edit the `/srv/www/example.com/.htaccess` file, and paste the content from the Elgg installation process.

When you've saved this file, refresh the page and you'll be presented with the "System Settings" page. Here you will be required to fill out several fields including the name of your site, the site's official email address, and the site URL, among other things. On this page, Elgg will also ask for the full path to the "data" folder that you created during the installation process. In our example, the path to this directory is as follows:

    /srv/www/example.com/data/

Elgg allows you to configure several additional options, including the default language, default access permissions, and an option to turn on the debugging mode. Alter any values as you see fit. When you select "Save", the process will continue and allow you to create an administrative account. When this is complete, Elgg is fully installed and you can begin to customize and develop your site. Congratulations, you now have the beginnings of your very own independent, self-hosted social networking site.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [Elgg development mailing list](http://groups.google.com/group/elgg-development/) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing the Elgg software as needed.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Plugins for Elgg](http://elgg.org/plugins.php)
- [Installing Elgg to Alternate Paths](http://docs.elgg.org/wiki/Install_Troubleshooting#I_installed_in_a_subdirectory_and_my_install_action_isn.27t_working.21)
- [Themes for Elgg](http://community.elgg.org/mod/plugins/search.php?category=themes)
- [The Elgg Project's Administration Guide](http://docs.elgg.org/wiki/Administration_Manual)



