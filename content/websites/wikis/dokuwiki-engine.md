---
author:
  name: Linode
  email: docs@linode.com
description: 'Build a fully featured wiki text with the DokuWiki software.'
keywords: ["wiki", "doku wiki", "php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/wikis/dokuwiki/']
modified: 2017-07-27
modified_by:
  name: Linode
published: 2010-04-17
title: DokuWiki Engine
external_resources:
 - '[The Doku Wiki Project Home Page](http://www.dokuwiki.org/dokuwiki)'
 - '[Doku Wiki Manual](http://www.dokuwiki.org/manual)'
---

DokuWiki is a flexible and extensible wiki engine that aims to be easy to manage while providing a rich feature set to enable collaborative document editing and creation for users of all skill levels and technical inclinations. DokuWiki stores wiki pages in text files on the web-server rather than in a database management system, which increases data usability and portability for moderately sized wiki projects without requiring the system resources to power a relational database server.

![DokuWiki Title Graphic](/docs/assets/dokuwiki_title_graphic.png)

Before beginning the installation of DokuWiki, we assume that you have completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

## Install Prerequisites

There are a few prerequisites that you will need before embarking on the installation of DokuWiki. These commands will ensure that your system is up to date and that the packages for the Apache web server, PHP programing language, and other dependencies are installed. In Debian and Ubuntu-based systems issue the following commands:

    apt-get update
    apt-get upgrade
    apt-get install php5 php-pear apache2 wget

Additionally, you will likely want to configure your Apache instance for virtual hosting according to our guide for [name based virtual hosting](/docs/web-servers/apache/installation/debian-5-lenny). On CentOS and Fedora powered systems, issue the following commands to run system updates, install required prerequisites, and ensure that Apache will resume following the next reboot cycle:

    yum update
    yum install php php-pear httpd wget
    chkconfig --add httpd
    chkconfig --levels 235 httpd on
    /etc/init.d/httpd start

Be sure to configure virtual hosting for your domains. Now we are ready to begin installing DokuWiki. For the purposes of this document, we will assume that the `DocumentRoot` for the virtual host where you will be installing DokuWiki is located at `/srv/www/example.com/public_html/` for the domain `example.com`, and the wiki will be accessible at the address `http://www.example.com/`. Modify the instructions below to conform to the requirements of your own configuration.

## Installing DokuWiki

At the time of writing, the latest stable version of DokuWiki is 2009-12-25c. However, be sure to check the [DokuWiki upstream](http://www.splitbrain.org/projects/dokuwiki) to ensure that you are downloading the latest version of the software. Issue the following commands with the paths adjusted for the requirements of your specific deployment:

    mkdir -p /srv/www/example.com/src/
    cd /srv/www/example.com/src/
    wget http://www.splitbrain.org/_media/projects/dokuwiki/dokuwiki-2009-12-25c.tgz
    tar -zxvf dokuwiki-2009-12-25c.tgz
    cp -R /srv/www/example.com/src/dokuwiki-2009-12-25/* /srv/www/example.com/public_html/
    chmod -R 777 /srv/www/example.com/public_html/data/ /srv/www/example.com/public_html/conf/

Navigate to the resource located at `http://example.com/install.php` to complete the installation and follow the steps outlined by the installer. When this has completed, issue the following commands:

    chmod -R 755 /srv/www/example.com/public_html/conf/
    chmod -R 775 /srv/www/example.com/public_html/data/
    chmod 664 /srv/www/example.com/public_html/conf/local.php /srv/www/example.com/public_html/conf/users.auth.php /srv/www/example.com/public_html/conf/acl.auth.php

For Debian and Ubuntu systems, issue the following commands:

    chgrp -R www-data /srv/www/example.com/public_html/data/ /srv/www/example.com/public_html/conf/local.php /srv/www/example.com/public_html/conf/users.auth.php /srv/www/example.com/public_html/conf/acl.auth.php

For CentOS and Fedora systems, issue the following command:

    chgrp -R apache /srv/www/example.com/public_html/data/ /srv/www/example.com/public_html/conf/local.php /srv/www/example.com/public_html/conf/users.auth.php /srv/www/example.com/public_html/conf/acl.auth.php

When you have completed these commands and the installation process has finished, issue the following command to remove the installation script and secure your application:

    rm /srv/www/example.com/public_html/install.php

Congratulations! Your DokuWiki instance is installed and you will be able to access and edit a functional wiki at `http://example.com/`.

## Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the DokuWiki newsletter and mailing lists to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [DokuWiki Newsletter](http://www.dokuwiki.org/newsletter)
-   [DokuWiki Mailing List](http://www.dokuwiki.org/mailinglist)

When upstream sources offer new releases, repeat the instructions for installing the DokuWiki software as needed. These practices are crucial for the ongoing security and functioning of your system.