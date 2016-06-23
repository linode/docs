---
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'A guide for getting started with the popular MediaWiki engine for powering wiki sites.'
keywords: 'mediawiki,wiki,web-applications'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['web-applications/wikis/mediawiki/']
modified: Tuesday, November 1st, 2011
modified_by:
  name: Linode
published: 'Wednesday, September 30th, 2009'
title: MediaWiki Engine
external_resources:
 - '[MediaWiki Wiki](http://www.mediawiki.org/wiki/MediaWiki)'
 - '[Web Application Guides](/docs/web-applications/)'
 - '[Web Application Frameworks](/docs/frameworks/)'
 - '[Database Management Systems](/docs/databases/)'
---

MediaWiki is a popular free wiki software package, and is the same software used by Wikipedia. It is fully dynamic and runs on a LAMP stack, taking advantage of the PHP language and the MySQL database backend. With easy installation and configuration, MediaWiki is a good solution when you need a familiar, full-featured dynamic wiki engine.

For this guide, we'll assume you've already read the [getting started](/docs/getting-started/) guide and have configured a working [LAMP stack](/docs/lamp-guides/) for your chosen distribution of Linux on your Linode VPS. You should be connected to your server via SSH and logged in as root.

## Downloading and Unpacking

To begin, download the latest release of MediaWiki. As of this writing, the latest stable release of MediaWiki is version 1.17.0. You will want to check for the latest version of this software regularly and upgrade to avoid allowing your site to become vulnerable to known security bugs. You can find the download location for the latest release by visiting the [MediaWiki homepage](http://www.mediawiki.org/wiki/MediaWiki).

If you followed our [LAMP guide](/docs/lamp-guides/), your web accessible `DocumentRoot` should be located in `/srv/www/example.com/public_html/`, or some similar directory (replacing "example.com" with your own domain name). If you set up virtual hosting with a different directory structure, adjust the following directions to your particular setup. We'll download and uncompressed the files in the directory above the `DocumentRoot`:

    cd /srv/www/example.com/

Use `wget` to download the latest package. You may need to install the `wget` program first by issuing the command `apt-get install wget` under Debian/Ubuntu, or `yum install wget` under CentOS/Fedora.

    wget http://download.wikimedia.org/mediawiki/1.17/mediawiki-1.17.0.tar.gz

Decompress the package by using the `tar` command, as shown below:

    tar -xvzf mediawiki-1.17.0.tar.gz

Move the uncompressed `mediawiki-1.17.0` directory into your `public_html/` folder, renaming the directory to `mediawiki/` in the process.

    mv mediawiki-1.17.0/ public_html/mediawiki/

The name of the directory beneath the `public_html/` will determine the path to your wiki. In this case, the wiki would be located at `example.com/mediawiki/`. You can copy the wiki to any publicly accessible location in the `public_html/` hierarchy.

The `config/` directory inside the `mediawiki/` directory needs to allow MediaWiki to write to it during the installation process. Change into the `mediawiki/` directory and run the following `chmod` command:

    cd /srv/www/example.com/public_html/mediawiki/
    chmod a+w config

## Configuring MediaWiki

Point your browser to the URL of your wiki (in this example, `example.com/mediawiki/`) and click the "Please set up the wiki first" link. The setup page contains everything you need to complete the installation.

You will need to know the database name, username, and password of your MySQL installation. Giving MediaWiki superuser access to your MySQL database allows it to create new accounts and databases for you, which you may want to enable. If you are having trouble at this point, read the [MySQL guide](/docs/databases/mysql) to become more comfortable with the database. If you plan on having a large number of users or content, consider setting up a second Linode as a [dedicated database server](/docs/databases/mysql/standalone-mysql-server).

After completing the installation form and submitting it, you will arrive at the "MediaWiki Installation" page. Follow the directions at the bottom and move the `config/LocalSettings.php` file to MediaWiki's root directory (e.g. `/srv/www/example.com/public_html/mediawiki/`) as instructed:

    mv /srv/www/example.com/public_html/mediawiki/config/LocalSettings.php ..

Since the `LocalSettings.php` file will contain your MySQL password, make sure to restrict access to it:

    chmod 700 /srv/www/example.com/public_html/media/wiki/LocalSettings.php

After moving LocalSettings.php, you can safely delete the `/config` folder, as per the instructions:

    cd /srv/www/example.com/public_html/mediawiki/
    rm -rf config

MediaWiki is now successfully installed and configured!

## Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [MediaWiki development mailing list](https://lists.wikimedia.org/mailman/listinfo/mediawiki-announce) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing the MediaWiki software as needed. These practices are crucial for the ongoing security and functioning of your system.