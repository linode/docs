---
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'A guide for getting started with the popular MediaWiki engine for powering wiki sites.'
keywords: ["mediawiki", "wiki", "web-applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/wikis/mediawiki/','websites/wikis/mediawiki-engine/']
modified: 2017-08-16
modified_by:
  name: Linode
published: 2009-09-30
title: Install MediaWiki on Ubuntu 16.04
external_resources:
 - '[MediaWiki Wiki](http://www.mediawiki.org/wiki/MediaWiki)'
 - '[What is Media Wiki](https://www.mediawiki.org/wiki/Manual:What_is_MediaWiki%3F)'
 - '[Media Wiki Extensions Blog](https://phabricator.wikimedia.org/source/extensions/browse/)'
---

![mediawiki Banner](/docs/assets/MediaWiki.jpg)

MediaWiki is a popular, free wiki software package. It's the same software Wikipedia uses. It is fully dynamic and runs on a LAMP stack, taking advantage of the PHP language and the MySQL database backend. With easy installation and configuration, MediaWiki is a good solution when you need a familiar, full-featured, dynamic wiki engine.

This guide assumes that you already have a working [LAMP stack](/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04) running on Ubuntu. Your web accessible `DocumentRoot` should be located in `/var/www/html/example.com/public_html/`. You should be connected to your server via SSH and logged in as root.

## Download and Unpack MediaWiki

1.  Change your working directory to Apache's `DocumentRoot` and download the latest release of MediaWiki. As of this writing, the latest stable release of MediaWiki is version 1.29.0.

        cd /var/www/html/example.com/
        curl -O https://releases.wikimedia.org/mediawiki/1.29/mediawiki-1.29.0.tar.gz

You will want to check for the latest version of this software regularly and upgrade to avoid allowing your site to become vulnerable to known security bugs. You can find the download location for the latest release by visiting the [MediaWiki homepage](http://www.mediawiki.org/wiki/MediaWiki).

2.  Decompress the package:

        tar -xvf mediawiki-1.29.0.tar.gz

3.  Move the uncompressed `mediawiki-1.29.0` directory into your site's `public_html/` folder, renaming the directory to `mediawiki/` in the process.

        mv mediawiki-1.29.0/ public_html/mediawiki/

The name of the directory beneath the `public_html/` will determine the path to your wiki. In this case, the wiki would be located at `example.com/mediawiki/`. You can copy the wiki to any publicly accessible location in the `public_html/` hierarchy.


### Configure MySQL

Mediawiki needs to communicate with a database to store information. Create a database and a user with a secure password, then grant all privileges on the new database to the user.


    CREATE DATABASE my_wiki;
    CREATE USER 'media_wiki'@'localhost' IDENTIFIED BY 'password';
    GRANT ALL ON my_wiki.* TO 'mediawiki'@'localhost' IDENTIFIED BY 'password';


## Configure MediaWiki

Point your browser to the URL of your wiki, for example: `example.com/mediawiki/` and click the "Please set up the wiki first" link. The setup page contains everything you need to complete the installation.

From the database section above, you will need:
- The database name
- DB username
- DB user's password

Giving MediaWiki superuser access to your MySQL database allows it to create new accounts. If you plan on having a large number of users or content, consider setting up a second Linode as a [dedicated database server](/docs/databases/mysql/standalone-mysql-server).

 After the installation is finished, MediaWiki will create a `LocalSettings.php` file, with the configurations from the installation process. Move the `LocalSettings.php` file to `/var/www/html/example.com/public_html/mediawiki/` and restrict access to the file:

    chmod 700 /var/www/html/example.com/public_html/media/wiki/LocalSettings.php

MediaWiki is now successfully installed and configured!


## Upgrade MediaWiki

You can monitor the [MediaWiki development mailing list](https://lists.wikimedia.org/mailman/listinfo/mediawiki-announce) to ensure that you are aware of all updates to the software. When upstream sources offer new releases, repeat the instructions for installing the MediaWiki software as needed.
