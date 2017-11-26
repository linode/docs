---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the ISPConfig control panel to maintain your Linode.'
keywords: ["ispconfig", "control panel", "cpanel", "plesk", "gui"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/control-panels/ispconfig/fedora-14/']
modified: 2013-10-03
modified_by:
  name: Linode
published: 2011-04-05
title: Manage a Fedora 14 Linode with ISPConfig
---



ISPConfig is an open-source control panel similar to proprietary software like CPanel or Plesk. It features a wide variety of options to help you control your server and allow other users to maintain their websites.

This guide assumes you are installing this on a freshly deployed system. If you feel that you will not need certain features that are mentioned in this document, please feel free to exclude them from your setup.

# Prepare Your System

Set your system's host name by issuing the following commands:

    echo "HOSTNAME=example" >> /etc/sysconfig/network
    hostname "example"

Configure your `/etc/hosts` file to include your Linode's fully qualified domain name (FQDN) and localhost are set up in your `/etc/hosts` file. You can use the following example file, modifying the entries to suit your setup (12.34.56.78 should be replaced with your Linode's IP address):

{{< file >}}
/etc/hosts
{{< /file >}}

> 127.0.0.1 localhost.localdomain localhost 12.34.56.78 hostname.example.com hostname

It is essential that you set these values before proceeding with the installation of ISPConfig.

Begin the installation process by ensuring that your package lists and packages are up to date by issuing the following commands:

    yum update

Before you can install some components for ISPConfig, you will need to install some development packages. Issue the following commands:

    yum groupinstall 'Development Tools'
    yum groupinstall 'Development Libraries'

# Install Postfix, Courier, MySQL, and Dependencies

In order to use the email capabilities in ISPConfig, you will need to install the email applications it depends on in order to function. MySQL is a relational database management system (RDBMS) that is commonly used for dynamic web pages and email. If you have already installed this, you will not need to install is as part of the ISPConfig installation process. You are encouraged to read the [MySQL documentation](/docs/databases/mysql/). You will need to read the documentation for detailed installation instructions.

Issue the following command:

    yum install gcc postfix mysql-server getmail mysql-devel cyrus-sasl

Issue the following commands to ensure MySQL runs when your Linode boots and start the MySQL service:

    /sbin/chkconfig --levels 235 mysqld on
    service mysqld start

Issue the following commands to start saslauthd when your Linode boots and start the saslauth daemon:

    /sbin/chkconfig --levels 235 saslauthd on
    service saslauthd start

After installing MySQL, it's recommended that you run `mysql_secure_installation`, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

# Install Amavisd-new and SpamAssassin

The following command will install spam protection for your email server. Please be advised that using SpamAssassin by itself may consume a vast amount of system resources depending on your configuration. You will want to tune this application according to the [low memory settings](/docs/troubleshooting/troubleshooting-memory-and-networking-issues/#reducing-spamassassin-memory-consumption). Using amavisd-new should help alleviate some of these potential issues.

    yum install amavisd-new spamassassin unzip bzip2 perl-DBD-mysql

# Install Apache, PHP, phpMyAdmin, FCGI, suExec, Pear, and mcrypt

The following command will install the Apache web server and some other applications and their dependencies. If you have already installed the LAMP stack, you will not need to install Apache again. However, you will need the other packages for other aspects of the ISPConfig installation.

    yum install ntp httpd php php-mysql php-devel php-mbstring rpm-build openssl-devel cyrus-sasl-devel pkgconfig zlib-devel phpMyAdmin pcre-devel openldap-devel postgresql-devel expect libtool-ltdl-devel openldap-servers libtool gdbm-devel pam-devel gamin-devel php-gd php-imap php-ldap php-mysql php-odbc php-pear php-xml php-xmlrpc php-eaccelerator php-mbstring php-mcrypt php-mssql php-snmp php-soap php-tidy curl curl-devel perl-libwww-perl ImageMagick libxml2 libxml2-devel mod_fcgid php-cli httpd-devel

Make sure Apache starts on boot:

    /sbin/chkconfig --levels 235 httpd on

# Install Vlogger and Webalizer

Vlogger is a tool that logs information regarding Apache. Webalizer can then be used to analyze these logs and generate statistics. This step is completely optional, but you may find these tools useful for seeing website traffic.

    yum install webalizer perl-DateTime-Format-HTTP perl-DateTime-Format-Builder

    cd /tmp
    wget http://n0rp.chemlab.org/vlogger/vlogger-1.3.tar.gz
    tar xvfz vlogger-1.3.tar.gz
    mv vlogger-1.3/vlogger /usr/sbin/
    rm -rf vlogger*

More information on Webalizer can be found in our [Webalizer documentation](/docs/web-applications/analytics/webalizer/).

# Install fail2ban

Installing fail2ban is entirely optional, however ISPConfig can manage this service and show you the log output from it:

    yum install fail2ban

More information regarding fail2ban can be found in our [fail2ban guide](/docs/security/using-fail2ban-for-security).

# Installing ISPConfig

You are now ready to extract and install ISPConfig. To do this, issue the following commands:

    cd /tmp
    wget http://downloads.sourceforge.net/ispconfig/ISPConfig-3.0.3.tar.gz?use_mirror=
    tar -xvf ISPConfig-3.0.3.tar.gz
    cd ispconfig3_install/install
    php -q install.php

This script will configure services that you installed above to be monitored and controlled by ISPConfig. You will be asked a series of questions; in most cases the default answers will suffice. If you have configured services on your system in a manner that differs from the default, edit the answers accordingly.

You will now need to restart Apache. Issue the following command:

    /etc/init.d/httpd restart

Once it has completed, you may log into the control panel. By default, ISPConfig runs on port 8080, so you may find it at `http://12.34.56.78:8080/`. Replace `12.34.56.78` with your Linode's IP. The default login uses "admin" as the username and "admin" as the password. You will want to change these to prevent someone from accessing your system.

Congratulations! You now have ISPConfig installed on your Fedora 14 Linode. You are highly encouraged to see the links in the "More Information" section to help you install extra applications that may help you manage your system better.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the ISPConfig Newsletter and project forums to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [ISPConfig Newsletter](http://newsletter.howtoforge.com/ispconfig/user/login.php)
-   [ISPConfig Project Forums](http://www.howtoforge.com/forums/forumdisplay.php?f=33)

When upstream sources offer new releases, repeat the instructions for installing the ISPConfig software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [ISPConfig Home Page](http://www.ispconfig.org/)
- [ISPConfig Support](http://www.ispconfig.org/page/en/support.html)
- [ISPConfig Community](http://www.ispconfig.org/page/en/community.html)



