---
author:
  name: Linode
  email: docs@linode.com
description: 'Install the advanced bug tracking and issue management software Bug Genie on your Linode to manage projects.'
keywords: ["bug tracking", "issue tracking", "feature development", "bug genie", "the bug genie"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/bug-genie/', 'applications/development/track-bugs-and-manage-development-with-bug-genie/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2010-05-03
title: Track Bugs and Manage Development with Bug Genie
deprecated: true
---

Bug Genie is an issue tracking system used to help manage all phases of the development process, including planning, bug tracking, feature development, and overall project management. Bug Genie also provides the ability to generate sophisticated reports and graphs to help project leaders and stakeholders gain a rich understanding of the ongoing state and progress of projects' development.

Before beginning this guide we assume that you have completed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics). To complete this guide, you must also install a web server. This guide will assume that you have completed the appropriate [LAMP guide](/docs/lamp-guides/) for your operating system.

Installing Prerequisites
------------------------

If you're running Debian or Ubuntu systems, ensure that your system's package repository is up to date and that all installed packages have been upgraded with the latest bug fixes and security patches. Additionally, install all prerequisite packages by issuing these commands:

    apt-get update
    apt-get upgrade
    apt-get install php-pear php5-suhosin unzip

On CentOS and Fedora systems, issue the following command to ensure your system's packages are up to date and that the required dependencies are installed on your system:

    yum update
    yum install php-pear unzip

For the purpose of this guide we will assume that you have virtual hosting configured for the domain `example.com` with all publicly accessible resources located in the document root `/srv/www/example.com/public_html/`. Furthermore, in this document you will install Bug Genie in this document root. Modify all of the instructions below to agree with the architecture of your deployment.

Install Bug Genie
-----------------

This document contains specific instructions for installing version 2.1.1 of Bug Genie. Although work proceeds on version 3 of Bug Genie, we recommend installing the latest stable version in the 2.x series. Check the [upstream](http://www.thebuggenie.com/) to confirm that 2.1.1 is the current version of Bug Genie and that there are no vulnerabilities or bugs with this version of the software. Issue the following sequence of commands to download, extract, move the Bug Genie files to your web server's document root, and properly configure file permissions:

    mkdir -p /srv/example.com/src/
    cd /srv/example.com/src/
    wget http://sourceforge.net/projects/bugs-bug-genie/files/The%20Bug%20Genie/The%20Bug%20Genie%202.1.1/thebuggenie_2.0.11.zip/download
    unzip thebuggenie._2.1.1.zip
    mv thebuggenie/ bug-genie-2.1.1/
    cp -R bug-genie-2.1.1/* /srv/www/example.com/public_html/
    chmod 777 /srv/www/example.com/public_html/config.php
    chmod 777 /srv/www/example.com/public_html/include/B2DB/
    chmod 777 /srv/www/example.com/public_html/files

Now visit `http://example.com/install.php` in your web browser, and follow the setup procedure provided by Bug Genie's web based interface. When the setup process has completed, issue the following commands to remove the setup files and reset proper permissions:

    rm /srv/www/example.com/public_html/install.php
    rm /srv/www/example.com/public_html/b2
    chmod 755 /srv/www/example.com/public_html/thebuggenie/config.php

Congratulations! You have now successfully deployed Bug Genie.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the following pages for updates regarding Bug Genie to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [The Bug Genie Development Blog](http://thebuggenie.wordpress.com/)
-   [The Bug Genie Project Overview](http://www.thebuggenie.com/index.php)

When upstream sources offer new releases, repeat the instructions for installing The Bug Genie and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Bug Genie Project Upstream](http://www.thebuggenie.com/)
- [The Bug Genie Community Documentation](http://www.thebuggenie.com/support.php?section=general)



