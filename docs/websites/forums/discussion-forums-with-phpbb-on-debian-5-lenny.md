---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Configuring the phpBB system for hosting web-based discussion forums on Debian 5 (Lenny).'
keywords: ["phpBB", "forum software", "web applications", "PHP"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/bulletin-boards/phpbb/debian-5-lenny/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2009-09-30
title: 'Discussion Forums with phpBB on Debian 5 (Lenny)'
---



phpBB is one of the most widely used open source forum solutions. It is easy to install and free to use, along with being fully customizable. If you don't want to spend money on other forum software like vBulletin, consider using phpBB.

For this guide, we'll assume you've already followed the [getting started](/docs/getting-started/) guide and have a working [LAMP stack](/docs/lamp-guides/debian-5-lenny/) on your Linode. You should be connected to your server via SSH and logged in as root.

# Downloading and Unpacking

We'll begin by downloading the latest release of phpBB. As of this writing, the latest stable release of phpBB is version 3.0.7-PL1. You can find the download for the latest link by visiting the [phpBB downloads](http://www.phpbb.com/downloads/) section of the phpBB website.

Use `wget` to download the latest package. You may need to install the wget command first by issuing `apt-get install wget`:

    wget http://d10xg45o6p6dbl.cloudfront.net/projects/p/phpbb/phpBB-3.0.7-PL1.tar.bz2

Install the `bzip2` package by issuing the following command:

    apt-get update
    apt-get upgrade --show-upgraded
    apt-get install bzip2

This will allow you to decompress the file you just downloaded. Using the following command, decompress the phpBB package:

    tar -jxvf phpBB-3.0.7-PL1.tar.bz2

Move the newly formed `phpBB3` folder into your `public_html` folder. This will make the location on your server `http://example.com/phpBB3/` in the example provided by our LAMP guides. Feel free to rename the folder after you move it:

    mv phpBB3/ /srv/www/example.com/public_html/

This will move the phpBB software into a directory called `phpBB3`. You can move the location of the phpBB software into the top level of your `DocumentRoot`, in this case `public_html`, but phpBB can be installed in any folder you wish.

We now need to create the MySQL user and database that will be used by phpBB. The following commands provide an example of what steps would need to be taken to accomplish this:

    mysql -u root -p
    CREATE DATABASE phpbb;
    CREATE USER phpbb;
    GRANT ALL ON phpbb.* TO 'phpbb' IDENTIFIED BY 'password';
    exit

We'll also need to set the following permissions on these files and folders:

    cd /srv/www/example.com/public_html/phpBB3/
    chmod 666 config.php
    chmod 777 store/ cache/ files/ images/avatars/upload/

Now, visit the `phpBB3` directory in your browser: In the above example, that would be `http://example.com/phpBB3/`. At this point, you will be guided through the rest of the configuration by phpBB's web-based installer.

# Configure phpBB

Click the "Install" tab in the top left region of the page. You should be looking at a requirements page. If you followed the [LAMP guide](/docs/lamp-guides/debian-5-lenny/), your server will meet the requirements specified by the phpBB installation process. Click "Proceed to next step." The next page is simply a confirmation that your server meets the minimum installation requirements. Click "Start Install."

You will now need to fill in your database information. Using the MySQL database, user and password we created earlier as an example, you would enter `phpbb` into the `database name` field, `phpbb` into the `database username` field, and `password` into the `database password` field. The other fields can remain blank for the defaults. Click "Proceed to next step."

This brings us to the "Administrator Configuration" page where you can set your Administrator username, password, and admin e-mail address. Fill this out, then click "Proceed to next step". Click "Proceed to next step" again on the next page confirming the settings worked. Click "Proceed to next step" again after you reach the next page.

Now you should be on the "Advanced Settings" page. Modify these settings as you wish. Continue following the instructions, clicking the "Proceed to next step" button. You should reach the "Congratulations" page. After completing the phpBB installation using the web-based installer, you will need to remove or rename the `install` folder and change the permissions on the `config.php` file:

    cd /srv/www/example.com/public_html/phpBB3/
    rm -rf install/
    chmod 0644 config.php

You should now be done configuring phpBB!

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the phpBB security announcement posts and community forums to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [phpBB Security Information](http://www.phpbb.com/security/)
-   [phpBB Community Forums](http://www.phpbb.com/community/index.php)

When upstream sources offer new releases, repeat the instructions for installing the phpBB software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [phpBB Styles Database](http://www.phpbb.com/styles)
- [Styles Forum](http://www.phpbb.com/community/viewforum.php?f=80)
- [phpBB Modifications](http://www.phpbb.com/mods/)
- [Modifications Forum](http://www.phpbb.com/community/viewforum.php?f=81)



