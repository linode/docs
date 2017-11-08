---
author:
  name: Linode
  email: docs@linode.com
description: 'Configuring the MyBB system for hosting web-based discussion forums.'
keywords: ["mybb", "forum software", "web applications", "PHP"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/bulletin-boards/mybb/']
modified: 2013-10-01
modified_by:
  name: Linode
published: 2010-03-18
title: Discussion Forums with MyBB
deprecated: true
---

MyBB is a popular alternative to large forum systems like SMF and phpBB. It is designed to be lightweight yet fully customizable, and can be modified to suit your needs. While MyBB will work with MySQL and SQLite, this guide will use MySQL as the database engine.

Before we begin, we assume you have followed the steps outlined in the [getting started guide](/docs/getting-started/). You will also need a working [LAMP stack](/docs/lamp-guides/).

# Prerequisites

You will need to create a MySQL user and database for MyBB. To do so, login to the MySQL server as root as follows:

    mysql -u root -p

You will be greeted with a prompt; enter the following commands to create a user and database, taking care to change the password in the example below:

    CREATE DATABASE forums;
    CREATE USER 'forumuser'@localhost IDENTIFIED BY 'secretpassword';
    GRANT ALL PRIVILEGES ON forums.* TO 'forumuser'@localhost;
    exit

You will now need to perform the following steps as the user you intend to run MyBB as.

# Installing MyBB

The following commands should be done in the `DocumentRoot` of your website. You may need to adjust these commands depending on your setup, however these commands will set up MyBB in a directory called `forums/`.

To begin the installation of MyBB, issue the following commands:

    wget http://www.mybboard.net/download/latest
    unzip latest
    mv Documentation/ ~/
    mv Upload/ forums/
    cd forums/
    mv ./inc/config.default.php ./inc/config.php
    chmod 666 ./inc/config.php
    chmod 666 ./inc/settings.php
    chmod 777 ./cache/
    chmod 777 ./cache/themes/
    chmod 777 ./uploads/
    chmod 777 ./uploads/avatars/
    chmod 777 ./admin/backups
    chmod 777 ./inc/languages

You will now need to navigate to the installer using your favorite browser. If you installed your forum in the `forums/` directory as shown above, you will likely find the installer at a URL such as `http://www.mysite.com/forums/install/`. Follow the instructions on the web interface to set up MyBB and configure it appropriately.

After you have completed the installation, issue the following command on your Linode to remove the installation files:

    rm -r install/

If there are no errors, you should be able to start making boards with MyBB!

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [MyBB mailing list](http://www.mybb.com/mailing-list) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing the MyBB software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MyBB Wiki](http://wiki.mybboard.net/index.php/Main_Page)
- [Mods Database](http://mods.mybboard.net/)
- [MyBB Community Forum](http://community.mybboard.net/)



