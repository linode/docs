---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn to build and deploy websites using the PHP Fusion content management system.'
keywords: ["cms", "php fusion", "content mangement system", "lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/cms-guides/php-fusion/']
modified: 2013-10-02
modified_by:
  name: Linode
published: 2010-04-17
title: 'Manage Web Content with PHP-Fusion'
deprecated: true
---

PHP Fusion is a lightweight content management system built on the popular LAMP stack. Designed for maximum flexibility and broad support it's for internationalization, in its latest version PHP Fusion focuses on standards compliance, security, and modular design. PHP Fusion is an obvious choice for developers who need to deploy a system to manage content and community interaction.

Before installing PHP Fusion, we assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). Additionally, prior to installing PHP Fusion, you will need to install a fully functional [LAMP stack](/content/lamp-guides/) on your Linode.

# Install Prerequisites

After installing the [LAMP stack](/docs/lamp-guides/), there are a few additional prerequisites that you will need in order to complete this installation of PHP Fusion. Ensure that your distribution provides `wget` and `unzip` tools. On Debian and Ubuntu based systems, issue the following command:

    apt-get update
    apt-get upgrade --show-upgraded
    apt-get install wget unzip

On CentOS and Fedora powered systems, issue the following commands to run system updates and install required prerequisites:

    yum update
    yum install wget unzip

On Arch Linux systems, issue the following commands to update the package database and install required prerequisites:

    pacman -Sy
    pacman -S wget unzip

On Gentoo Linux systems, issue the following commands to update the package database and install required prerequisites:

    emerge --sync
    emerge wget unzip

Now we are ready to begin installing PHP Fusion. For the purposes of this document we will assume that the `DocumentRoot` for the virtual host where you will be installing PHP Fusion is located at `/srv/www/example.com/public_html/` for the domain `example.com`.

# Install PHP Fusion

At the time of publication, the latest stable version of PHP Fusion is 7.00.07. Remember to check the [PHP Fusion upstream](http://www.php-fusion.co.uk/downloads.php?cat_id=19) to determine and install the latest version of the software so that you will be able to take advantage of any bug and security fixes that the development team has released. Alter the commands in the following procedure to reflect the specifics of your deployment:

    mkdir -p /srv/www/example.com/src/php-fusion/
    cd /srv/www/example.com/src/php-fusion/
    wget http://downloads.sourceforge.net/project/php-fusion/PHP%20Fusion%20Core%207/Core%207.00.xx%20Stable/php-fusion_7-00-07.zip
    unzip php-fusion_7-00-07.zip
    cp -R /srv/www/example.com/src/php-fusion/7-00-7/files/* /srv/www/example.com/public_html/

Now issue the following commands to prepare your system for the installation process:

    cd /srv/www/example.com/public_html/
    mv _config.php config.php
    chmod 777 administration/db_backups/ images/ images/imagelist.js images/articles/ images/avatars/ images/news/ images/news_cats/ images/photoalbum/ images/photoalbum/submissions/ forum/attachments/ config.php

Now visit the PHP Fusion setup page located at `http://example.com/setup.php` and follow the steps outlined by the installer. Once the installation has completed successfully, issue the following commands, to secure your new installation and remove the installation script.

    chmod 644 /srv/www/example.com/public_html/config.php
    rm /srv/www/example.com/public_html/setup.php

Congratulations! You now have a fully functional PHP Fusion instance to power your website.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the PHP Fusion security forum and news page to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [PHP Fusion Security Forum](http://www.php-fusion.co.uk/forum/viewforum.php?forum_id=85)
-   [PHP Fusion News Page](http://www.php-fusion.co.uk/news.php)

When upstream sources offer new releases, repeat the instructions for installing the PHP Fusion software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [PHP Fusion Project Home Page](http://www.php-fusion.co.uk/news.php)



