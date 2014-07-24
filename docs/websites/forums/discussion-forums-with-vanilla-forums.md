---
author:
  name: Linode
  email: skleinman@linode.com
description: 'Install the lightweight Vanilla Forums software to power discussion forums on your Linux VPS.'
keywords: 'vanilla,bb,fourms,lamp,discussion forums'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/bulletin-boards/vanilla/']
modified: Tuesday, October 1st, 2013
modified_by:
  name: Linode
published: 'Monday, May 3rd, 2010'
title: Discussion Forums with Vanilla Forums
deprecated: true
---

Vanilla is a lightweight and flexible web-based discussion forum engine. Written against the popular LAMP stack, Vanilla combines simplicity and ease of use with a rich and customizable feature set.

Before beginning this guide we assume that you have completed our [getting started guide](/docs/getting-started/). If you're new to Linux systems administration consider the guides in our [using Linux](/docs/using-linux) section, particularly the guide for [administration basics](/docs/using-linux/administration-basics). To complete this guide, you must also install a web server. This guide will assume that you have completed the appropriate [LAMP guide](/docs/lamp-guides/) for your operating system.

Installing Prerequisites
------------------------

If you're running Debian or Ubuntu systems, ensure that your system's package repository is up to date, that all installed packages have been upgraded with the latest bug fixes and security patches using the following command sequence:

    apt-get update
    apt-get upgrade
    apt-get install php5-gd php-pear unzip

On CentOS and Fedora systems issue the following commands to ensure your system's packages are up to date, and that all required packages are installed:

    yum update
    yum install php-pear php-gd unzip

For the purpose of this guide we will assume that you have virtual hosting configured for the domain `ducklington.org` with all publicly accessible resources located in the document root `/srv/www/ducklington.org/public_html/`. In this document you will install Vanilla into this document root. Modify all of the instructions below to agree with the architecture of your deployment.

Install Vanilla
---------------

This document contains specific instructions for installing version 2.0.1 of Vanilla. Check the [upstream](http://vanillaforums.org/download/) source to confirm that this is the most up to date version of the software and that there are no vulnerabilities or bugs. Issue the following sequence of commands to download, extract, move the Vanilla files to your web server's document root, and properly configure file permissions:

    mkdir -p /srv/www/ducklington.org/src/
    cd /srv/www/ducklington.org/src/
    wget http://vanillaforums.org/uploads/AXAFETUQOHQN.zip
    mv AXAFETUQOHQN.zip vanilla-2.0.1.zip
    unzip vanilla-2.0.1.zip
    cp -R vanilla-2.0.1/* /srv/www/ducklington.org/public_html/
    cd /srv/www/ducklington.org/public_html/
    chmod -R 777 ./conf ./uploads ./cache

Now visit `http://ducklington.org/` in your web browser and follow the setup procedure provided by the Vanilla's web based interface. When the setup process has completed, issue the following commands to remove the setup files:

    rm -rf /srv/www/ducklington.org/public_html/setup/

Congratulations! You have now successfully deployed Vanilla.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Vanilla Project Upstream](http://vanillaforums.org/)



