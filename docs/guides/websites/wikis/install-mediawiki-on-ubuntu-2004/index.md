---
slug: how-to-install-mediawiki-ubuntu-2004
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will show you how to install MediaWiki, a versatile, free and open-source application powering knowledge websites similar to Wikipedia, on Ubuntu 20.04.'
og_description: 'This guide will show you how to install MediaWiki, a versatile, free and open-source application powering knowledge websites similar to Wikipedia, on Ubuntu 20.04.'
keywords: ["mediawiki", "install mediawiki", "deploy mediawiki on ubuntu 20.04"]
tags: ["ubuntu", "wiki"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-04
modified_by:
  name: Nathaniel Stickman
title: "How to Install MediaWiki on Ubuntu 20.04"
h1_title: "Installing MediaWiki on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MediaWiki Installation Guide](https://www.mediawiki.org/wiki/Manual:Installation_guide)'
relations:
    platform:
        key: install-mediawiki
        keywords:
           - distribution: Ubuntu 20.04
---

[MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) is the software behind Wikipedia and many of the wiki websites used by organizations and communities around the world. It provides a versatile, open, and free tool for publishing collaborative content. This guide explains how to deploy MediaWiki on Ubuntu 20.04.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Apache

1. Install Apache 2.4:

        sudo apt install apache2

2. Check the web server's status, verifying that it started running after installation:

        sudo systemctl status apache2 --no-pager

    If it is not running, enable and start the Apache service:

        sudo systemctl enable apache2
        sudo systemctl start apache2

3. See the guide for [How to Install Apache Web Server on Ubuntu 18.04 LTS](/docs/guides/how-to-install-apache-web-server-ubuntu-18-04/) for more details and configuration options for the Apache web server.

## Install PHP

1. Install PHP, the Apache PHP module, and the additional PHP packages required by MediaWiki:

        sudo apt install php libapache2-mod-php php-mbstring php-mysql php-xml

    {{< note >}}
MediaWiki requires PHP 7.3.19–24, 7.4.3, or later; it does not work with PHP 7.4.0–7.4.2. The above command should install version 7.4.3, and you can verify this after installation with the command `php -v`.
    {{< /note >}}

## Install and Configure MariaDB

MediaWiki supports a variety of database options, including MariaDB, MySQL, and PostgreSQL. MariaDB is preferred in the MediaWiki documentation and has been selected for this guide.

1. Install MariaDB:

        sudo apt install mariadb-server

2. Secure the MariaDB installation:

        sudo mysql_secure_installation

    This script lets you change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to each of these options. You can read more about the script in the [MariaDB Knowledge Base](https://mariadb.com/kb/en/mariadb/mysql_secure_installation/).

3. Check the database server's status, verifying that it started running after installation:

        sudo systemctl status mariadb --no-pager

    If it is not running, enable and start the MariaDB service:

        sudo systemctl enable mariadb
        sudo systemctl start mariadb

4. See the guide for [How to Install MariaDB on Ubuntu 18.04 LTS](/docs/guides/how-to-install-mariadb-on-ubuntu-18-04/) for more details and configuration options for the MariaDB installation.

5. Create a database and a database user for MediaWiki by opening MariaDB as the root user (`sudo mariadb -u root -p`) and entering the commands given in the following example. Replace `wikidb` with the desired database name, `wikiuser` with the desired database username, and `password` with a password for that user, which should not match the database's root password:

        CREATE DATABASE my_wiki;
        CREATE USER 'wikiuser'@'localhost' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON my_wiki.* TO 'wikiuser'@'localhost' WITH GRANT OPTION;

6. Then exit MariaDB:

        exit;

## Download and Extract the MediaWiki Files

1. Download the `tar.gz` containing the latest release of the MediaWiki software from the [official MediaWiki download page](https://www.mediawiki.org/wiki/Download).

    Alternatively, you can download MediaWiki from the command line:

        wget https://releases.wikimedia.org/mediawiki/1.35/mediawiki-1.35.0.tar.gz

2. Move the `tar.gz` file to the Apache web server's document directory. You can find the document directory as the `DocumentRoot` variable in the Apache configuration file for your website. Apache's default website configuration on Ubuntu is located at `/etc/apache2/sites-enabled/000-default.conf`. Typically, the document directory defaults to `/var/www/html`, which is assumed in the rest of this guide:

        sudo mv mediawiki-1.35.0.tar.gz /var/www/html

3. Remove any other files and/or folders from the web server's document directory. Apache typically includes an `index.html` file in this folder by default, which you can remove with:

        cd /var/www/html
        sudo rm index.html

4. Navigate to the document directory, and extract the archived files:

        sudo tar xvzf /var/www/html/mediawiki-1.35.0.tar.gz

    It is recommended that you rename the resulting folder, as the folder name becomes part of the URL used for navigating to your MediaWiki. For the rest of this guide, the name `w` is used for this folder:

        sudo mv /var/www/html/mediawiki-1.35.0 /var/www/html/w

    {{< note >}}
 Extracting the archive as root makes the root user the files' owner. If this is not your intention, you need to use the `chown` command to change the files' ownership after extraction. For more information, see our guide on [Linux Users and Groups](/docs/guides/linux-users-and-groups/#changing-file-ownership).
    {{< /note >}}

## Install MediaWiki

1. In a web browser, navigate to `index.php` in the base MediaWiki folder; you can use either the web server domain (replacing `domain` in the example below) or your Linode's public IP address (replacing `192.0.2.1` below), as in:

        http://domain/w/index.php

        http://192.0.2.1/w/index.php

    {{< note >}}
If you choose to set up the MediaWiki installation using your Linode's IP but later want to use a domain, you can do so by changing the IP address to the appropriate domain in the `LocalSettings.php` file described below.
    {{< /note >}}

2. Select the setup link, and proceed through the setup steps. Choose the MariaDB option when prompted for a database server, and enter the database name, username, and user password you created for MediaWiki.

3. Download the `LocalSettings.php` file when prompted at the end of the setup process, then move it or copy its contents to `/var/www/html/w/LocalSettings.php` on your Linode.

4. Adjust the file's permissions:

        sudo chmod 664 /var/www/html/w/LocalSettings.php

    {{< note >}}
Depending on how you created the `LocalSettings.php` file on your Linode, you may need to adjust its ownership using `chown` as well.
    {{< /note >}}

5. Visit `index.php` again in a web browser to confirm that MediaWiki has been installed successfully.
