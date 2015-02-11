---
author:
  name: Linode
  email: docs@linode.com
description: 'Configuring the SMF system for hosting web-based discussion forums.'
keywords: 'smf,forum software,web applications,PHP'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/bulletin-boards/smf/']
modified: Tuesday, January 27, 2015
modified_by:
  name: Elle Krout
published: 'Thursday, March 18th, 2010'
title: Discussion Forums with SMF
deprecated: false
external_resources:
 - '[SMF Documentation](http://docs.simplemachines.org/)'
 - '[Modifications, Styles, and Upgrades](http://custom.simplemachines.org/)'
 - '[Functions Database](http://support.simplemachines.org/function_db/)'
 - '[SMF Community Forum](http://www.simplemachines.org/community/index.php)'
---

Simple Machines Forum (SMF) is a popular forum solution for small- to large-sized communities that offers a variety of features. With its modular design and flexibility, users can create their own plugins to modify the behavior of SMF in any way they wish.

Before you begin, be sure you have followed the steps outlined in the [Getting Started Guide](/docs/getting-started/). You will also need a working [LAMP stack](/docs/websites/lamp/).

{: .note }
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Prerequisites

You will need to create a MySQL user and database for SMF. 

1.  Login to the MySQL server as root:

        mysql -u root -p

2.  Create a user and database, with `forums` being the database name, `forumadmin` being the username, and taking care to change the `password` in the example below:

        create databate forums;
        grant all on forums.* to 'forumadmin' identified by 'password';
        quit

##Installing SMF

The following instructions will download the latest stable release, which is 2.0.9 as of publication.

{: .note }
> If you're using a web server other than Apache, or otherwise have an alternate system user for your web server, be sure to replace `www-data` in the commands below with the appropriate system user.

1.  Navigate to the document root (typically similar to `/var/www/example.com/public_html`) and create a directory for the forums:

        sudo chown -R www-data:www-data /var/www
        sudo -u www-data mkdir forums
        cd forums/

    {: .note}
    >
    >If you would like to install SMF to your website's homepage, install it in the document root. If you would like the URL to be something other than `/forums` amend the above instructions as necessary.

2.  Download and extract the package:

        sudo -u www-data wget http://mirror.ord.simplemachines.org/downloads/smf_2-0-9_install.tar.gz
        sudo -u www-data tar -zxvf smf_2-0-9_install.tar.gz

3.  In your browser, navigate to the website where you installed SMF (ex. `http://www.example.com/forums/`). You will be asked for your FTP details; however, because of the insecure nature of FTP it is recommended that you instead change the permissions of the following files in your terminal to make them writable:

        chmod -R 777 attachments/
        chmod -R 777 avatars/
        chmod -R 777 cache/ 
        chmod -R 777 Packages/
        chmod -R 777 Smileys/
        chmod -R 777 Themes/
        chmod 777 agreement.txt
        chmod 777 Settings.php
        chmod 777 Settings_bak.php

    Click on `Click here to test if these files are writable again` to update the page, then `continue`.

4.  Follow the instructions on the web interface to finish the installation; then, in your terminal, remove the installation script:

        sudo rm install.php

Your SMF installation is now complete! In order to maintain the integrity of your system, please update your forums as needed.
