---
author:
  name: Linode
  email: docs@linode.com
description: 'Install the simple and lightweight Discussion forum FluxBB on your Linode.'
keywords: ["bulletin board", "forum", "discussion forum", "fluxbb"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/bulletin-boards/fluxbb/']
modified: 2013-10-01
modified_by:
  name: Linode
published: 2010-05-03
title: Discussion Forums with FluxBB
deprecated: true
---

FluxBB is a web application that powers discussion forums. It strives to be faster and more lightweight than other contenders in this space, and its developers strive for maximum stability and security. Thus, FluxBB is a viable option for those who need a web based discussion forum and require simplicity and stability without an expansive feature set.

Before beginning with this guide we assume that you have completed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics). To complete this guide, you must also install a web server. This guide will assume that you have completed the appropriate [LAMP guide](/docs/lamp-guides/) for your operating system.

Installing Prerequisites
------------------------

If you're running Debian or Ubuntu systems, ensure that your system's package repository is up to date, that all installed packages have been upgraded with the latest bug fixes and security patches using the following command sequence:

    apt-get update
    apt-get upgrade

On CentOS and Fedora systems, issue the following commands to ensure your system's packages are up to date:

    yum update

For the purpose of this guide we will assume that you have virtual hosting configured for the domain `example.com` with all publicly accessible resources located in the document root `/srv/www/example.com/public_html/`. In this document you will install FluxBB into this document root. Modify all of the instructions below to agree with the architecture of your deployment.

Install FluxBB
--------------

This document contains specific instructions for installing version 1.2.22 of FluxBB. Check the [upstream](http://fluxbb.org/downloads/) source to confirm that this is the most up to date version of the software and that there are no vulnerabilities or bugs. Issue the following sequence of commands to download, extract, move the FluxBB files to your web server's document root, and properly configure file permissions:

    mkdir -p /srv/www/example.com/src/fluxbb-1.2.22
    cd /srv/www/example.com/src/
    wget http://fluxbb.org/download/releases/1.2.22/fluxbb-1.2.22.tar.gz
    cp fluxbb-1.2.22.tar.gz /srv/www/example.com/src/fluxbb-1.2.22
    cd /srv/www/example.com/src/fluxbb-1.2.22
    tar -zxvf fluxbb-1.2.22.tar.gz; rm fluxbb-1.2.22.tar.gz
    cp -R /srv/www/example.com/src/fluxbb-1.2.33/upload/* /srv/www/example.com/public_html/
    chmod -R 777 /srv/www/example.com/public_html/cache/
    chmod -R 777 /srv/www/example.com/public_html/img/avatars/

Now visit `http://example.com/install.php` in your web browser, and follow the setup procedure provided by the FluxBB web based interface. During this process you will be asked to create a `config.php` file that resembles the following:

{{< file "/srv/www/example.com/public\\_html/config.php" php >}}
<?php

$db_type = 'mysqli';
$db_host = 'localhost';
$db_name = 'lollipop';
$db_username = 'foreman';
$db_password = '5t1ck';
$db_prefix = 'new_';
$p_connect = false;

$cookie_name = 'forum_cookie';
$cookie_domain = '';
$cookie_path = '/';
$cookie_secure = 0;
$cookie_seed = 'a3647cd58bd28fa9';

define('PUN', 1);

{{< /file >}}


When you have created this file, you will have completed the installation of FluxBB. Issue the following command to remove the setup files:

    rm -rf /srv/www/example.com/public_html/install.php

Congratulations! You have now successfully deployed FluxBB.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [FluxBB Forums](http://fluxbb.org/forums/index.php) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing the FluxBB software as needed. These practices are crucial for the ongoing security and functioning of your system.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [FluxBB Project Home Page](http://fluxbb.org/)



