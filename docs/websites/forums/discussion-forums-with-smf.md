---
author:
  name: Amanda Folson
  email: docs@linode.com
description: 'Configuring the SMF system for hosting web-based discussion forums.'
keywords: 'smf,forum software,web applications,PHP'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/bulletin-boards/smf/']
modified: Tuesday, October 1st, 2013
modified_by:
  name: Linode
published: 'Thursday, March 18th, 2010'
title: Discussion Forums with SMF
deprecated: true
---

Simple Machines Forum (SMF) is a popular forum solution for small to large sized communities that offers a variety of features that make it ideal for many use cases. With its modular design and flexibility, users can create their own plugins to modify the behavior of SMF in any way they wish. Many users of the SMF community have even used the forum software as a back end to power the front end of their website.

Before we begin, we assume you have followed the steps outlined in the [getting started guide](/docs/getting-started/). You will also need a working [LAMP stack](/docs/lamp-guides/).

Prerequisites
-------------

You will need to create a MySQL user and database for SMF. To do so, login to the MySQL server as root as follows:

    mysql -u root -p

You will be greeted with a prompt; enter the following commands to create a user and database, taking care to change the password in the example below:

    CREATE DATABASE forums;
    CREATE USER 'forumuser'@localhost IDENTIFIED BY 'secretpassword';
    GRANT ALL PRIVILEGES ON forums.* TO 'forumuser'@localhost;
    exit

You will now need to perform the following steps as the user you intend to run SMF as.

Installing SMF
--------------

There are two ways to install SMF that you may choose from. The first way is a simple script that is uploaded onto the server. This script installs SMF for you, but may not allow fine-grained control over the installation process. The second option is to download the files, extract them, and set up SMF yourself. The SMF developers prefer you use the first method, however we suggest you use the second. The "webinstall" script requires you to have FTP installed on your Linode so that it may download files. Please keep in mind that FTP allows information to be sent in plain text, and should not be relied upon to transfer files that contain passwords or sensitive information.

### Installing with Webinstall

Download the webinstall script from the SMF website. For example, if you wanted your forums to be located at `http://www.mysite.com/forums/`, you would want to change directory into the `forums/` directory under your document root. Once you have moved to the directory you would like to install SMF in you will need to run:

    wget http://simplemachines.org/downloads/webinstall.php
    chown www-data .

Then navigate to the script using your browser (ex. `http://www.mysite.com/forums/webinstall.php`). You may then follow the instructions on the screen.

**Please note:** You will be asked to select which version of SMF you would like to install. As of this writing, 1.1.11 is the latest stable branch, and we encourage you to install this version instead of the 2.x development branch.

You will also be asked which languages you would like your forum to support. The next page asks you to enter your FTP credentials so that it can download and extract files. If there are no errors, the script will leave you with a fully functioning SMF installation!

### Installing SMF via Source

You will need to download and extract the SMF source. The following instructions will download the latest stable release, which is 1.1.11 at the time of this writing.

Make sure you are in the document root you would like to install SMF to before continuing. Issue the following commands to download the source and extract it:

    mkdir forums
    cd forums/
    wget http://mirror.ord.simplemachines.org/downloads/smf_1-1-11_install.tar.gz
    tar -zxvf smf_1-1-11_install.tar.gz

You may now continue the installation through the web interface. In your favorite web browser, navigate to the website you installed SMF to (ex. `http://www.mysite.com/forums/`)You will be asked for your FTP details so that SMF can attempt to set file permissions. However, if you do not provide this information or it fails, you will be asked to set the permissions manually. Issue the following commands to allow SMF to be installed:

    chmod -R 777 attachments/
    chmod -R 777 avatars/ 
    chmod -R 777 Packages/
    chmod -R 777 Smileys/
    chmod -R 777 Themes/
    chmod 777 agreement.txt
    chmod 777 Settings.php
    chmod 777 Settings_bak.php

You may then follow the instructions on the web interface to finish the installation. Once you have finished the installation you will want to remove the installation script by running:

    rm install.php

Your SMF installation is now complete!

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [SMF community](http://www.simplemachines.org/community/index.php) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing the SMF software as needed. These practices are crucial for the ongoing security and functioning of your system.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [SMF Documentation](http://docs.simplemachines.org/)
- [Modifications, Styles, and Upgrades](http://custom.simplemachines.org/)
- [Functions Database](http://support.simplemachines.org/function_db/)
- [SMF Community Forum](http://www.simplemachines.org/community/index.php)



