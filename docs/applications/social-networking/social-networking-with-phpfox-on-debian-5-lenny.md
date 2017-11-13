---
author:
  name: Linode
  email: docs@linode.com
description: 'Use phpFox to create and maintain a social networking platform on Debian 5 (Lenny).'
keywords: ["phpfox", "social networking", "community"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/social-networking/phpfox/debian-5-lenny/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2010-08-13
title: 'Social Networking with phpFox on Debian 5 (Lenny)'
deprecated: true
---

phpFox is a proprietary social networking platform that allows groups to create and maintain communities of people with common interests. It contains a variety of features that are common on many popular social networking sites such as [Facebook](http://www.facebook.com) or [MySpace](http://www.myspace.com) including friend lists, activity feeds, instant messaging, and user groups. In addition to providing a robust networking platform, phpFox also allows developers to create "plug-ins" that are custom tailored to their community.

Please note that you must obtain a license from phpFox in order to run this software. License types and pricing can be obtained from [the phpFox website](http://www.phpfox.com/pricing/).

# Install Prerequisites

Before installing phpFox, make sure you have set up a [LAMP stack](/docs/lamp-guides/debian-5-lenny/). You will also need to install the "curl" and "gd" modules for PHP. Issue the following command:

    apt-get install php5-curl php5-gd

# Download phpFox

You will need to download phpFox from the member's area of the [phpFox website](http://www.phpfox.com). Additionally, you will be required to fill out some basic information such as the location (URL) of your future phpFox site. Once you have downloaded the source, you will need to upload it to your server. It is advisable to upload the source outside of the document root. Issue the following command to unzip the source code and move it to your `DocumentRoot`. If your phpFox version or package is different from the one used here, adjust the commands accordingly.

    unzip *phpfox-2.0.5-community.zip
    mv upload /srv/www/example.com/public_html

It is recommended that you leave the `tools/` directory where it is or move it to a logical place outside of your `DocumentRoot`. This directory contains tools to clone your phpFox instance that you may find useful later on.

You will now need to rename the settings file and change file permissions on a few files in order to install phpFox. Issue the following commands:

    cd /srv/www/example.com/public_html
    mv include/setting/server.sett.php.new include/setting/server.sett.php
    chmod 0777 include/setting/server.sett.php
    chmod -R 0777 file/
    chown -R www-data:www-data /srv/www/example.com/public_html/

You will now be able to visit `http://www.example.com/install/` to complete the installation of phpFox. Follow the instructions provided by the installation script in order to configure the database and admin user for your site. Once the installation is complete, you will be able to configure other aspects of your site via the admin control panel. Congratulations! Your phpFox site is now ready for use.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [phpFox Main Website](http://www.phpfox.com/)
- [phpFox Community](http://forums.phpfox.com/)
- [phpFox Add Ons](http://www.phpfox.com/add-ons/)
- [phpFox Support](http://www.phpfox.com/support/)



