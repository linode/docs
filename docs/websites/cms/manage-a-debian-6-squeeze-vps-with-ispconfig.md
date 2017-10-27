---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the ISPConfig control panel to maintain your Debian 6 (Squeeze) Linode.'
keywords: 'ispconfig,control panel,cpanel,plesk,gui'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['web-applications/control-panels/ispconfig/debian-6-squeeze/']
modified: Friday, April 29th, 2011
modified_by:
  name: Linode
published: 'Tuesday, April 5th, 2011'
title: 'Manage a Debian 6 (Squeeze) Linode with ISPConfig'
---

ISPConfig is an open-source control panel similar to proprietary software like CPanel or Plesk. It features a wide variety of options to help you control your server and allow other users to maintain their websites.

Before beginning this guide we assume that you have completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

This guide assumes you are installing this on a clean system. If you feel that you will not need certain features that are mentioned in this document, please feel free to exclude them from your setup.

Update Your System
------------------

Ensure your package lists and packages are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade

Install Postfix, Courier, MySQL, and Dependencies
-------------------------------------------------

In order to use the email capabilities in ISPConfig, you will need to install the email applications it depends on in order to function. More information on Postfix and Courier can be found in [our documentation](/docs/email/postfix/courier-mysql-debian-5-lenny), and you are encouraged to read it to gain a better understanding of this software. MySQL is a relational database management system (RDBMS) that is commonly used for dynamic web pages and email. If you have already installed this, you will not need to install is as part of the ISPConfig installation process. You are encouraged to read the [MySQL documentation](/docs/databases/mysql/). You will need to read the documentation for detailed installation instructions.

Issue the following command (all one line):

    apt-get install postfix postfix-mysql postfix-doc mysql-client mysql-server courier-authdaemon courier-authlib-mysql courier-pop courier-pop-ssl courier-imap courier-imap-ssl libsasl2-2 libsasl2-modules libsasl2-modules-sql sasl2-bin libpam-mysql openssl courier-maildrop getmail4 binutils

You will be asked a series of questions during the installation; please refer to the [Postfix guide](/docs/email/postfix/courier-mysql-debian-5-lenny) to determine what the needs of your system will be. In most cases, the defaults are fine.

Install Amavisd-new and SpamAssassin
------------------------------------

The following command will install spam protection for your email server. Please be advised that using SpamAssassin by itself may consume a vast amount of system resources depending on your configuration. You will want to tune this application according to the [low memory settings](/docs/troubleshooting/troubleshooting-memory-and-networking-issues/#reducing-spamassassin-memory-consumption). Using amavisd-new should help alleviate some of these potential issues.

    apt-get install amavisd-new spamassassin zoo unzip bzip2 arj nomarch lzop cabextract apt-listchanges libnet-ldap-perl libauthen-sasl-perl clamav-docs daemon libio-string-perl libio-socket-ssl-perl libnet-ident-perl zip libnet-dns-perl

Install Apache, PHP, phpMyAdmin, FCGI, suExec, Pear, and mcrypt
---------------------------------------------------------------

The following command will install the Apache web server and some other applications and their dependencies. If you have already installed the LAMP stack, you will not need to install Apache again. However, you will need the other packages for other aspects of the ISPConfig installation.

    apt-get install apache2 apache2.2-common apache2-doc apache2-mpm-prefork apache2-utils libexpat1 ssl-cert libapache2-mod-php5 php5 php5-common php5-gd php5-mysql php5-imap phpmyadmin php5-cli php5-cgi libapache2-mod-fcgid apache2-suexec php-pear php-auth php5-mcrypt mcrypt php5-imagick imagemagick libapache2-mod-suphp

You will then need to enable some modules in Apache. Issue the following command:

    a2enmod suexec rewrite ssl actions include

Install Vlogger and Webalizer
-----------------------------

Vlogger is a tool that logs information regarding Apache. Webalizer can then be used to analyze these logs and generate statistics. This step is completely optional, but you may find these tools useful for seeing website traffic.

    apt-get install vlogger webalizer

More information on Webalizer can be found in our [Webalizer documentation](/docs/web-applications/analytics/webalizer/debian-5-lenny).

Install fail2ban
----------------

Installing fail2ban is entirely optional, however ISPConfig can manage this service and show you the log output from it:

    apt-get install fail2ban

More information regarding fail2ban can be found in our [fail2ban guide](/docs/security/using-fail2ban-for-security).

Installing ISPConfig
--------------------

You are now ready to extract and install ISPConfig. To do this, issue the following commands:

    cd /tmp
    wget http://downloads.sourceforge.net/ispconfig/ISPConfig-3.0.3.tar.gz
    tar -xvf ISPConfig-3.0.3.tar.gz
    cd ispconfig3_install/install

You may now start the installation process by issuing:

    php -q install.php

This script will configure services that you installed above to be monitored and controlled by ISPConfig. You will be asked a series of questions; in most cases the default answers will suffice. If you have configured services on your system in a manner that differs from the default, edit the answers accordingly.

Once it has completed, you may log into the control panel. By default, ISPConfig runs on port 8080, so you may find it at `http://12.34.56.78:8080/`. Replace `12.34.56.78` with your Linode's IP. The default login uses "admin" as the username and "admin" as the password. You will want to change these to prevent someone from accessing your system.

Congratulations! You now have ISPConfig installed on your Debian 6 (Squeeze) Linode. You are highly encouraged to see the links in the "More Information" section to help you install extra applications that may help you manage your system better. Additionally, we highly recommend becoming familiar with our [SFTP guides](/docs/networking/file-transfer), as you'll need to use this method for uploading files to your Linode.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the ISPConfig project forums to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [ISPConfig Project Forums](http://www.howtoforge.com/forums/forumdisplay.php?f=33)

When upstream sources offer new releases, repeat the instructions for installing the ISPConfig software as needed. These practices are crucial for the ongoing security and functioning of your system.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [ISPConfig Home Page](http://www.ispconfig.org/)
- [ISPConfig Support](http://www.ispconfig.org/page/en/support.html)
- [ISPConfig Community](http://www.ispconfig.org/page/en/community.html)
- [Limit User Access with SFTP Jails](/docs/security/sftp-jails)



