---
author:
  name: Linode
  email: docs@linode.com
description: 'Install and begin using Flyspray to track project development.'
keywords: ["bug tracking", "flyspray", "issue management", "feature development"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/flyspray/','applications/development/track-bugs-and-manage-development-with-flyspray/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2010-05-03
title: Track Bugs and Manage Development with Flyspray
deprecated: true
---

Flyspray is an advanced bug tracking system that allows software development teams, open source software projects, and other teams to manage development progress, issue reports, feature development, and other project tasks. Written against the popular LAMP stack, and including support for email and Jabber (XMPP) notifications, Flyspray is an ideal solution for teams that want an easy to use and manage issue tracking system with advanced features.

Before beginning this guide we assume that you have completed our [getting started](/docs/getting-started/) guide. If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). To complete this guide, you must also install a web server. This guide will assume that you have completed the appropriate [LAMP guide](/content/lamp-guides/) for your operating system. Additionally you will need to install a local [MTA to send email](/content/tools-reference/linux-system-administration-basics#send-email-from-your-server) if you do not have an MTA installed.

# Installing Prerequisites

If you're running Debian or Ubuntu systems, ensure that your system's package repository is up to date, that all installed packages have been upgraded with the latest bug fixes and security patches with the following command sequence. Additionally, install all prerequisite packages by issuing these commands:

    apt-get update
    apt-get upgrade
    apt-get install unzip libgv-php5

On CentOS and Fedora systems issue the following command to ensure your system's packages up to date, and that all required dependencies are installed:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm
    yum update
    yum install unzip graphviz graphiz-php

For the purpose of this guide we will assume that you have virtual hosting configured for the domain `example.com` with all publicly accessible resources located in the document root `/srv/www/example.com/public_html/`. Furthermore, in this document you will install Flyspray in this document root. Modify all of the instructions below to agree with the architecture of your deployment.

# Install Flyspray

This document contains specific instructions for installing version 0.9.9.6 of Flyspray. Check the [upstream](http://flyspray.org/download) to confirm that 0.9.9.6 is the most recent stable release of Flyspray. By installing the latest version you may be able to prevent falling victim to known vulnerabilities or bugs with older versions of the software. Issue the following sequence of commands to download, extract, move the Flyspray files to your web servers' document root, and properly configure file permissions:

    mkdir -p /srv/www/example.com/src/
    mkdir -p /srv/www/example.com/public_html/
    cd /srv/www/example.com/public_html/
    wget http://flyspray.org/flyspray-0.9.9.6.zip
    unzip flyspray-0.9.9.6.zip
    mv flyspray-0.9.9.6.zip /srv/www/example.com/src/
    touch flyspray.conf.php
    chmod 777 flyspray.conf.php cache/ attachments/

Now visit `http://example.com/` in your web browser, and follow the setup procedure provided by Flyspray's web based interface. When the setup process has completed, issue the following commands to remove the setup files and reset permissions:

    rm -rf /srv/www/example.com/public_html/setup/
    chmod 755 /srv/www/example.com/public_html/flyspray.conf.php

Congratulations! You have now successfully deployed Flyspray.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the following mailing lists and bug databases to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Flyspray Project Mailing List Information](http://flyspray.org/mailing_list)
-   [Flyspray Project Bug Tracker](http://bugs.flyspray.org/)

When upstream sources offer new releases, repeat the instructions for installing Flyspray software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Fly Spray Development Home Page](http://flyspray.org/fly)



