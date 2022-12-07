---
slug: how-to-install-mediawiki-centos-8
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will show you how to install MediaWiki, a versatile, free and open-source application powering knowledge websites similar to Wikipedia, on CentOS 8.'
og_description: 'This guide will show you how to install MediaWiki, a versatile, free and open-source application powering knowledge websites similar to Wikipedia, on CentOS 8.'
keywords: ["mediawiki", "install mediawiki", "deploy mediawiki on centos 8"]
tags: ["centos", "wiki"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-04
modified_by:
  name: Nathaniel Stickman
title: "How to Install Mediawiki on CentOS 8"
h1_title: "Installing Mediawiki on CentOS 8"
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
           - distribution: CentOS 8
---

[MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) is the software behind Wikipedia and many of the wikis deployed by communities and companies around the world. It provides a versatile, open, and free tool for making knowledge easily accessible and navigable. This guide explains how to install MediaWiki on CentOS 8.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Apache

1. Install Apache 2.4:

        sudo yum install httpd

2. Enable and start the Apache service:

        sudo systemctl enable httpd.service
        sudo systemctl start httpd.service

3. See the guide for [How to Install Apache Web Server on CentOS 8](/docs/guides/how-to-install-apache-web-server-centos-8/) for more details and configuration options for the Apache web server.

## Install PHP

MediaWiki requires PHP 7.3.19–24, 7.4.3, or later. However, the CentOS package manager (Yum) only includes PHP 7.2 in its default repository. Thus, you need to use the Remi repository to acquire one of the later PHP releases.

1. Add Extra Packages for Enterprise Linux (EPEL) and the Remi repository:

        sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
        sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-8.rpm

2. Install PHP from the Remi repository:

        sudo dnf module reset php
        sudo dnf module install php:remi-8.0

    For this example, the latest version of PHP (8.0) was used. You can, alternatively, choose either 7.3 or 7.4; doing so installs the latest release for either version.

3. Install the `php-mysqlnd` module to support the use of the MariaDB (described below):

        sudo dnf install php-mysqlnd

4. Restart the Apache service:

        sudo systemctl restart httpd

## Install and Configure MariaDB

MediaWiki supports a variety of database options, including MariaDB, MySQL, and PostgreSQL. MariaDB is preferred in the MediaWiki documentation and has been selected for this guide.

1. Install MariaDB:

        sudo yum install mariadb-server

2. Enable and start the MariaDB service:

        sudo systemctl enable mariadb
        sudo systemctl start mariadb

3. Secure the MariaDB installation:

        sudo mysql_secure_installation

    This script gives you the choice to change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. You can read more about the script in the [MariaDB Knowledge Base](https://mariadb.com/kb/en/mariadb/mysql_secure_installation/).

4. See the guide for [How to Install MariaDB on CentOS 8](/docs/guides/how-to-install-mariadb-on-centos-8/) for more details and configuration options for the MariaDB installation.

5. Create a database and a database user for MediaWiki by opening MariaDB as the root user (`sudo mysql -u root -p`) and entering the commands given in the following example. Replace `my_wiki` with the desired database name, `wikiuser` with the desired database username, and `password` with a password for that user, which should not match the database's root password:

        CREATE DATABASE my_wiki;
        CREATE USER 'wikiuser'@'localhost' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON my_wiki.* TO 'wikiuser'@'localhost' WITH GRANT OPTION;

6. Then exit MariaDB:

        exit;

## Download and Extract the MediaWiki Files

1. Download the `tar.gz` containing the latest release of the MediaWiki software from the [official MediaWiki download page](https://www.mediawiki.org/wiki/Download).

    Alternatively, you can download MediaWiki from the command line:

        sudo yum install wget
        wget https://releases.wikimedia.org/mediawiki/1.35/mediawiki-1.35.0.tar.gz

2. Move the `tar.gz` file to the Apache web server's document directory. You can find the document directory as the `DocumentRoot` variable in the Apache configuration file, located at `/etc/httpd/conf/httpd.conf`; the typical document directory is `/var/www/html`, which is assumed in the following example:

        sudo mv mediawiki-1.35.0.tar.gz /var/www/html

3. Navigate to the document directory, and extract the archived files:

        cd /var/www/html/
        sudo yum install tar
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
