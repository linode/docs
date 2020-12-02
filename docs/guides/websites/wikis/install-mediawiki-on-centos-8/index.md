---
slug: how-to-install-mediawiki-centos-8
author:
  name: Linode Community
  email: docs@linode.com
description: 'MediaWiki is a versatile, open, and free software powering knowledge repositories like Wikipedia. This guide will show you how to install MediaWiki on CentOS 8.'
og_description: 'MediaWiki is a versatile, open, and free software powering knowledge repositories like Wikipedia. This guide will show you how to install MediaWiki on CentOS 8.'
keywords: ["mediawiki", "install mediawiki", "deploy mediawiki on centos 8"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-12-02
modified_by:
  name: Nathaniel Stickman
title: "How to Install Mediawiki on Centos 8"
h1_title: "How to Install Mediawiki on Centos 8"
contributor:
  name: Nathaniel Stickman
  link: https://twitter.com/nathaniel_ps
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

[MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) is the software behind Wikipedia and many of the "wikis" deployed by communities and companies around the world. It provides a versatile, open, and free tool for making knowledge easily accessible and navigable. This guide explains how to install MediaWiki on CentOS 8.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Install Apache
1. Install Apache 2.4:

        sudo yum install httpd
        sudo systemctl enable httpd.service
        sudo systemctl start httpd.service
				
2. See the guide for [How to Install Apache Web Server on CentOS 8](https://www.linode.com/docs/guides/how-to-install-apache-web-server-centos-8/) for more details and configuration options for the Apache web server.

## Install PHP
MediaWiki requires PHP 7.3.19–24, 7.4.3, or later. However, the CentOS package manager (Yum) only includes PHP 7.2 in its default repository. Thus, you will need to use the Remi repository to acquire one of the later PHP releases.

1. Add EPEL and the Remi repository:

        sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
        sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-8.rpm

2. Install PHP from the Remi repository:

        sudo dnf module reset php
        sudo dnf module install php:remi-8.0
        
    For this example, the latest version of PHP (8.0) was used. You can, alternatively, choose either 7.3 or 7.4; this will install the latest release for either version.
    
3. Install the `php-mysqlnd` module to support use of the MariaDB installation described below:

        sudo dnf install php-mysqlnd
        
## Install and Configure MariaDB
MediaWiki supports a variety of database options, including MariaDB, MySQL, and PostgreSQL. MariaDB is preferred in the MediaWiki documentation and has been selected for this guide.

1. Install MariaDB:

        sudo yum install mariadb-server
        sudo systemctl enable mariadb
        sudo systemctl start mariadb

2. Secure the MariaDB installation:

        sudo mysql_secure_installation
        
    This script will give you the choice to change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. You can read more about the script in the [MariaDB Knowledge Base](https://mariadb.com/kb/en/mariadb/mysql_secure_installation/).

3. See the guide for [How to Install MariaDB on CentOS 8](https://www.linode.com/docs/guides/how-to-install-mariadb-on-centos-8/) for more details and configuration options for the MariaDB instllation.

## Download and Extract the MediaWiki Files
1. Download the `tar.gz` containing the latest release of the MediaWiki software from the [official MediaWiki download page](https://www.mediawiki.org/wiki/Download).

    Alternatively, you can download MediaWiki from the command line:

        wget https://releases.wikimedia.org/mediawiki/1.35/mediawiki-1.35.0.tar.gz

2. Move the `tar.gz` file to the Apache web server's document directory. You can find the document directory as the `DocumentRoot` variable in the Apache configuration file,  located at `/etc/httpd/conf/httpd.conf`; the typical document directory is `/var/www/html`, which is assumed in the following example:

        sudo mv mediawiki-1.35.0.tar.gz /var/www/html

3. Navigate to the document directory, and extract the archived files:

        sudo tar xvzf /var/www/html/mediawiki-1.35.0.tar.gz

    It is recommended that you rename the resulting folder. The folder name will be part of the URL used for navigating to your MediaWiki. For the rest of this guide, the name `w` will be used for this folder.

    {{< note >}}
Extracting the archive as root will make the root user the files' owner. If this is not your intention, you will need to use the `chown` command to change the files' ownership after extraction.
    {{< /note >}}

## Install MediaWiki
1. In a web browser, navigate to `index.php` in the base MediaWiki folder; you can use either the Apache web server domain or localhost, as in:

        http://example-domain/w/index.php
        
        http://localhost/w/index.php

    {{< note  >}}
If you choose to set up the MediaWiki installation locally using localhost but later want to use a domain, you will need to modify the `LocalSettings.php` file (described below), changing `localhost` to the appropriate domain.
    {{< /note >}}

2. Proceed through the setup steps, selecting MariaDB when prompted for a database server and entering `root` as the username and the password you created during the MariaDB configuration.

3. Download the `LocalSettings.php` file when prompted at the completion of the setup, and store the file in the base MediaWiki folder; you can either download directly to the appropriate location or move it there as in:

        sudo mv path/to/download/LocalSettings.php var/www/html/w
        
4. Visit the MediaWiki by navigating again to `index.php` in a web browser.