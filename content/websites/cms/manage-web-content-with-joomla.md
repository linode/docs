---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Joomla! content management system to ease administration overhead for websites.'
keywords: ["joomla", "cms", "content management systems"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/cms-guides/joomla/']
modified: 2011-04-19
modified_by:
  name: Linode
published: 2010-01-22
title: 'Manage Web Content with Joomla!'
---

Joomla is an advanced "content management system" (CMS) used to facilitate the easy creation and ongoing maintenance of dynamic websites. Comparable in some respects to other web applications like [Drupal](/docs/web-applications/cms-guides/drupal/) and [WordPress](/docs/web-applications/cms-guides/wordpress/), Joomla also has advanced features that resemble web-development frameworks like [Ruby On Rails](/docs/frameworks/) and [Django](/docs/frameworks/). Deployed on top of the industry standard [LAMP Stack](/docs/lamp-guides/), Joomla is designed to be both easy to use and manage from the end-user's perspective and easy to administer and host.

Before installing Joomla, we assume that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics). Additionally, you will need to follow the [LAMP Guide](/docs/lamp-guides) appropriate for the distribution you have deployed.

## Installing Prerequisites

After installing the [LAMP stack](/docs/lamp-guides/), you must attend to a few additional prerequsites to complete this Joomla installation. Ensure that your distribution provides `wget` and `unzip` tools. In Debian- and Ubuntu-based systems, issue the following command:

    apt-get update
    apt-get upgrade --show-upgraded
    apt-get install wget unzip

In CentOS- and Fedora-powered systems, issue the following commands to run system updates and install required prerequisites:

    yum update
    yum install wget unzip

On Arch Linux systems, issue the following commands to update the package database and install required prerequisites:

    pacman -Sy
    pacman -S wget unzip

On Gentoo Linux systems, issue the following commands to update the package database and install required prerequisites:

    emerge --sync
    emerge wget unzip

Now we are ready to begin to install Joomla. For the purposes of this document we will assume that the `DocumentRoot` for the virtual host where you will be installing Joomla is located at `/srv/www/example.com/public_html/` for the domain `example.com`.

## Download and Install Joomla

At the time of publication, the latest stable version of Joomla was 1.5.15. [Consult the upstream](http://www.joomla.org/download.html) to ensure that you're installing the most up-to-date version of the software. This is important to avoid deploying software with known security holes and resolved bugs. Begin by issuing the following sequence of commands to create the required directories, change directories, download the required files, extract the archive and move the files into the `DocumentRoot`:

    mkdir -p /srv/www/example.com/src/joomla-1.5.15-stable
    cd /srv/www/example.com/src/joomla-1.5.15-stable
    wget http://joomlacode.org/gf/download/frsrelease/11396/45610/Joomla_1.5.15-Stable-Full_Package.zip
    mv Joomla_1.5.15-Stable-Full_Package.zip joomla-1.5.15-stable.zip
    unzip /srv/www/example.com/src/joomla-1.5.15-stable/joomla-1.5.15-stable.zip
    cp /srv/www/example.com/src/joomla-1.5.15-stable/joomla-1.5.15-stable.zip /srv/www/example.com/src/joomla-1.5.15-stable.zip
    cp -R /srv/www/example.com/src/joomla-1.5.15-stable/* /srv/www/example.com/public_html/

These commands create a `src/` folder within the `/srv/www/example.com/` directory to store and manage pristine copies of the source files from which you deploy your Joomla site. Repeat this process, changing file names as appropriate, following new releases and updates of the Joomla software, to ensure that you have easily accessible copies of releases - in case you need to restore or reference the code you have running on your site.

We encourage you to monitor the [Joomla download page](http://www.joomla.org/download.html) for new releases and updates to ensure you're always running the most up-to-date version of Joomla software.

## Configure Joomla

Before we proceed with the installation of Joomla, we must create a configuration file that Joomla can write to. Issue the following sequence of commands:

    touch /srv/www/example.com/public_html/configuration.php
    chmod 777 /srv/www/example.com/public_html/configuration.php

Now, visit your site in your web browser. In the case of our example, this would correspond to the URL of `http://example.com/`. Follow the steps laid out in the Joomla installer presented on your screen. We do not recommend that you install or enable an FTP server. When the installation is complete, issue the following commands to remove the installation files and secure the `configuration.php` file:

    rm -rf /srv/www/example.com/public_html/installation/
    chmod 755 /srv/www/example.com/public_html/configuration.php

Congratulations! You now have a fully functional Joomla-powered website!

## Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up-to-date versions of all software is crucial for the security and integrity of a system.

Please monitor the Joomla developer email lists and security web forum to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Joomla Developer Email Lists](http://docs.joomla.org/Developer_Email_lists)
-   [Joomla Security Forum](http://forum.joomla.org/viewforum.php?f=432)

When upstream sources offer new releases, repeat the instructions for installing the Joomla software as needed. These practices are crucial for the ongoing security and functioning of your system.
