---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the FlatPress blogging tool to manage your blog and manage web content.'
keywords: ["flatpress", "cms", "php", "content management", "content management systems"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/cms-guides/flatpress/']
modified: 2013-10-02
modified_by:
  name: Linode
published: 2010-05-03
title: Manage Web Content with FlatPress
deprecated: true
---

FlatPress is a web application for managing and publishing blogs. Modeled on other popular content management systems for blogging, FlatPress uses a file-based system for storing content and does not require any kind of database system. FlatPress provides advanced features, and depending on the specific needs of your project, FlatPress may support higher load. Additionally, FlatPress provides a fully featured template engine and plugin framework for user-generated plug-ins.

This guide assumes that you have completed the appropriate [Apache Web server](/docs/web-servers/apache/) installation guide for your operating system but you may choose an alternate web server such as [nginx](/docs/web-servers/nginx/) to provide access to your FlatPress powered site.

# Installing Prerequisites

If you're running Debian or Ubuntu systems, ensure that your system's package repository is up to date, that all installed packages have been upgraded with the latest bug fixes and security patches using the following command sequence:

    apt-get update
    apt-get upgrade
    apt-get install apache2 php5 php-pear php5-suhosin bzip2

On CentOS and Fedora systems issue the following commands to ensure your system's packages are up to date, that all required packages are installed, and that the web server is running and will restart following future boots:

    yum update
    yum install httpd php php-pear bzip2
    /etc/init.d/httpd start
    chkconfig --levels 235 httpd on

For the purpose of this guide we will assume that you have virtual hosting configured for the domain `example.com` with all publicly accessible resources located in the document root `/srv/www/example.com/public_html/`. In this document you will install FlatPress into this document root. Modify all of the instructions below to agree with the architecture of your deployment.

# Install FlatPress

This document contains specific instructions for installing version 0.909.1 of FlatPress. Please check the [upstream](http://www.flatpress.org/home/) source to confirm that this is the most up to date version of the software and that there are no vulnerabilities or bugs. Issue the following sequence of commands to download, extract, move the FlatPress files to your web server's document root, and properly configure file permissions:

    mkdir -p /srv/www/example.com/src/
    cd /srv/www/example.com/src/
    wget http://downloads.sourceforge.net/project/flatpress/flatpress-0.909.1-arioso.tar.bz2
    tar -xjf flatpress-0.909.1-arioso.tar.bz2
    mv flatpress flatpress-0.909.1
    cp -R flatpress-0.909.1/* /srv/www/example.com/public_html/
    chmod 777 /srv/www/example.com/public_html/fp-content/

Now visit `http://example.com/setup.php` in your web browser and follow the setup procedure provided by the FlatPress web based interface. When the setup process has completed, issue the following commands to remove the setup files:

    rm /srv/www/example.com/public_html/setup.php
    rm -rf /srv/www/example.com/public_html/setup/

Congratulations! You have now successfully deployed FlatPress.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [Flatpress development list](https://lists.sourceforge.net/lists/listinfo/flatpress-dev) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing the Flatpress software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [FlatPress Home Page](http://www.flatpress.org/home/)



