---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Getting started with the open source edition of Zimbra groupware on your Ubuntu 8.04 (Hardy) Linode.'
keywords: ["zimbra on ubuntu", "zimbra groupware", "zimbra mail server", "linux mail server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/zimbra/install-zimbra-ubuntu-8-04-hardy/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2009-09-14
title: 'Email and Calendars with Zimbra 6 on Ubuntu 8.04 (Hardy)'
---



Zimbra is a groupware system that provides email, calendaring, integrated antivirus and spam filtering, and more for multiple domains. Available in several editions, this guide will help you get the Open Source Edition installed on your Ubuntu 8.04 (Hardy) Linode.

Please note that Zimbra is a fairly "heavy" (resource-intensive) product compared to some other groupware offerings. We recommend a Linode 2048 or higher for best results; you may encounter issues using Zimbra with lower-resource plans. Additionally, note that Zimbra works best as a standalone product on your Linode; installation alongside other common software such as web or email servers is not advised.

We assume you've already followed the steps outlined in our [getting started guide](/docs/getting-started/), and that your system is up to date. All configuration will be performed through the terminal; please make sure you're logged into your Linode as root via SSH.

Installing Prerequisite Packages
--------------------------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Issue the following command to install several packages required by Zimbra:

    apt-get install sudo libpcre3 libgmp3c2 libstdc++5 sysstat wget

Depending on the requirements for the current version of Zimbra, you may need to install additional packages later. The install program will notify you if there additional packages are required.

System Files Prerequisites
--------------------------

Before proceeding, make sure your `/etc/hosts` file has valid entries. For reference, your file should resemble the following:

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
12.34.56.78 hostname.example.com hostname

{{< /file >}}


Be sure to replace "12.34.56.78" with your Linode's IP address. Replace "hostname.example.com" with your Linode's fully qualified domain name. Next, make sure your hostname is set in `/etc/hostname` by issuing the following commands (insert your one-word hostname in place of "hostname").

    echo "hostname" > /etc/hostname
    hostname -F /etc/hostname

Issue the following commands to check your setup:

    hostname
    hostname -f

The first command should return only the one-word hostname for your system, while the second command should return the system's FQDN.

Installing Zimbra
-----------------

Visit the download page for [Zimbra Open Source Edition](http://www.zimbra.com/community/downloads.html) and copy the link to the current version of the software for Ubuntu 8.04 to your clipboard. Issue the following commands on your Linode via the shell to download and unpack the install package. Replace the filenames shown below after `wget` and `tar` with the current version.

    wget  http://files2.zimbra.com/downloads/6.0.5_GA/zcs-6.0.5_GA_2213.UBUNTU8.20100202225756.tgz
    tar -xzvf zcs-6.0.5_GA_2213.UBUNTU8.20100202225756.tgz

Switch to the install directory and launch the installer with the following commands.

    cd zcs-6.0.5_GA_2213.UBUNTU8.20100202225756
    ./install.sh

Before the install begins, you may receive a warning similar to the one shown below:

    DNS ERROR resolving MX for archimedes.example.com
    It is suggested that the domain name have an MX record configured in DNS
    Change domain name? [Yes] No

It is recommended (but not required) that the fully qualified domain name for your system (`hostname.example.com`) have an MX record pointing to it. You may wish to visit your DNS control panel and add such a record now, or proceed if you won't be receiving mail for your FQDN on this system (for example, if you'll be receiving email for your base domain or others).

The install will continue, prompting you to respond to a number of questions, and consuming a moment to perform various tasks. You can safely assume the default configuration. The system will offer the following prompt:

    The system will be modified.  Continue? [N] Y

As noted, answer `Y` to continue with the installation. The installation will take a few moments to install of the system packages. You'll be presented with an admin menu next.

    Main menu

       1) Common Configuration:
       2) zimbra-ldap:                             Enabled
       3) zimbra-store:                            Enabled
            +Create Admin User:                    yes
            +Admin user to create:                 admin@archimedes.example.com
    ******* +Admin Password                        UNSET
            +Enable automated spam training:       yes
            +Spam training user:                   spam.pvsjtuws@archimedes.example.com
            +Non-spam(Ham) training user:          ham.apqv8ks8@archimedes.example.com
            +Global Documents Account:             wiki@archimedes.example.com
            +SMTP host:                            archimedes.example.com
            +Web server HTTP port:                 80
            +Web server HTTPS port:                443
            +Web server mode:                      http
            +IMAP server port:                     143
            +IMAP server SSL port:                 993
            +POP server port:                      110
            +POP server SSL port:                  995
            +Use spell check server:               yes
            +Spell server URL:                     http://archimedes.example.com:7780/aspell.php
            +Configure for use with mail proxy:    FALSE
            +Configure for use with web proxy:     FALSE

       4) zimbra-mta:                              Enabled
       5) zimbra-snmp:                             Enabled
       6) zimbra-logger:                           Enabled
       7) zimbra-spell:                            Enabled
       8) Default Class of Service Configuration:
       r) Start servers after configuration        yes
       s) Save config to file
       x) Expand menu
       q) Quit

    Address unconfigured (**) items  (? - help) 3

Enter "3" to enter the zimbra-store menu, which will look similar to the following:

    Store configuration

       1) Status:                                  Enabled
       2) Create Admin User:                       yes
       3) Admin user to create:                    admin@archimedes.example.com
    ** 4) Admin Password                           UNSET
       5) Enable automated spam training:          yes
       6) Spam training user:                      spam.pvsjtuws@archimedes.example.com
       7) Non-spam(Ham) training user:             ham.apqv8ks8@archimedes.example.com
       8) Global Documents Account:                wiki@archimedes.example.com
       9) SMTP host:                               archimedes.example.com
      10) Web server HTTP port:                    80
      11) Web server HTTPS port:                   443
      12) Web server mode:                         http
      13) IMAP server port:                        143
      14) IMAP server SSL port:                    993
      15) POP server port:                         110
      16) POP server SSL port:                     995
      17) Use spell check server:                  yes
      18) Spell server URL:                        http://archimedes.example.com:7780/aspell.php
      19) Configure for use with mail proxy:       FALSE
      20) Configure for use with web proxy:        FALSE

    Select, or 'r' for previous menu [r] 4

You can configure various options here; but, the most important option is the one for setting the administrator password. Enter "4" to set it, choosing a strong password comprised of letters, numbers, and non-alphanumeric characters. After setting the admin password, enter "r" to return to the main menu. At this point you can enter "a" to apply the configuration that you have set, and follow this procedure. This allows Zimbra to proceed with the remaining installation steps.

After installation has completed, you may wish to reboot your Linode to make sure everything comes back up properly. After doing so, visit the Zimbra admin URL in your browser. It will be in the form `https://hostname.example.com:7071/`. You'll need to accept the SSL certificate presented to access the admin panel, which you may then use to continue configuring your new Zimbra server. Enjoy!

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [Zimbra Updates](http://www.zimbra.com/alerts/) page to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing Zimbra and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Zimbra Community Documentation](http://www.zimbra.com/community/documentation.html)
- [Zimbra Wiki](http://wiki.zimbra.com/index.php?title=Main_Page)
- [Zimbra Developer Zone](http://www.zimbra.com/community/developer_zone.html)



