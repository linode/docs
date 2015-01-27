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

Simple Machines Forum (SMF) is a popular forum solution for small- to large-sized communities that offers a variety of features that make it ideal for many use cases. With its modular design and flexibility, users can create their own plugins to modify the behavior of SMF in any way they wish. Many users of the SMF community have even used the forum software as a backend to power the frontend of their website.

Before you begin, be sure you have followed the steps outlined in the [getting started guide](/docs/getting-started/). You will also need a working [LAMP stack](/docs/lamp-guides/).

Prerequisites
-------------

You will need to create a MySQL user and database for SMF. To do so, login to the MySQL server as root as follows:

    mysql -u root -p

You will be greeted with a prompt; enter the following commands to create a user and database, with `forums` being the database name, `forumadmin` being the username, and taking care to change the password in the example below:

    create databate forums;
    grant all on forums.* to 'forumadmin' identified by 'password';
    quit

You will now need to perform the following steps as the user you intend to run SMF as.

Installing SMF
--------------

In order to install SMF you will need to download the files, extract them, and set up SMF. Previous iterations of SMF have offered a second "Webinstall" script, but this option has been removed in recent versions.

The following instructions will download the latest stable release, which is 2.0.9 at the time of this writing.

1.  Make sure you are in the document root you would like to install SMF in before continuing. Issue the following commands to download the source and extract it:

        mkdir forums
        cd forums/
        wget http://mirror.ord.simplemachines.org/downloads/smf_2-0-9_install.tar.gz
        tar -zxvf smf_2-0-9_install.tar.gz

2.  Continue the installation through the web interface. In your browser, navigate to the website where you installed SMF (ex. `http://www.example.com/forums/`). You will be asked for your FTP details so that SMF can attempt to set file permissions. However, if you do not provide this information, you do not have FTP, or it otherwise fails, issue the following commands in your terminal:

        chmod -R 777 attachments/
        chmod -R 777 avatars/
        chmod -R 777 cache/ 
        chmod -R 777 Packages/
        chmod -R 777 Smileys/
        chmod -R 777 Themes/
        chmod 777 agreement.txt
        chmod 777 Settings.php
        chmod 777 Settings_bak.php

    Click "Click here to test if these files are writable again" to update the page, then "continue."

3.  Follow the instructions on the web interface to finish the installation. Once you have finished the installation you will want to remove the installation script by running:

        rm install.php

Your SMF installation is now complete!

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up-to-date versions of all software is crucial for the security and integrity of a system.

Please monitor the [SMF community](http://www.simplemachines.org/community/index.php) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.





