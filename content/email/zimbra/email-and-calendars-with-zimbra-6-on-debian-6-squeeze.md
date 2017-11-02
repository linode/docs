---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Get started with the open source edition of Zimbra groupware on your Debian 6 (Squeeze) Linode.'
keywords: ["zimbra debian 6", "zimbra squeeze", "zimbra on debian", "zimbra groupware", "zimbra mail server", "linux mail server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/zimbra/install-zimbra-debian-6-squeeze/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2011-02-15
title: 'Email and Calendars with Zimbra 6 on Debian 6 (Squeeze)'
---

Zimbra is a groupware system that provides email, calendaring, integrated antivirus and spam filtering, and more for multiple domains. Available in several editions, this guide will help you get Zimbra Collaboration Suite - Open Source Edition installed on your Debian 6 (Squeeze) Linode.

Please note that Zimbra is a fairly "heavy" (resource-intensive) product compared to some other groupware offerings. We recommend a Linode 2048 or higher for best results; you may encounter issues using Zimbra with plans with less resources. Additionally, note that Zimbra works best as a standalone product on your Linode; installation alongside other software is not advised. Zimbra is deprecating support for 32-bit systems, and therefore it is assumed you have deployed the 64-bit version of Debian 6. If this is not the case, you will want to redeploy with the 64-bit version before continuing. All configuration will be performed through the terminal; please make sure you're logged into your Linode as root via SSH.

Please note that as of this writing, Zimbra is not officially supported on Debian 6. The software should function as expected, but your support options may be limited by choosing to install it on Debian 6. If this is a concern for you, you may wish to consider following our [Debian 5 (Lenny) Zimbra guide](/docs/email/zimbra/install-zimbra-debian-5-lenny) instead.

Basic System Configuration
--------------------------

Issue the following commands to set your system hostname, substituting a unique value for "hostname." :

    echo "hostname" > /etc/hostname
    hostname -F /etc/hostname

Edit your `/etc/hosts` file to resemble the following, substituting your Linode's public IP address for 12.34.56.78, your hostname for "hostname," and your primary domain name for "example.com." :

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
12.34.56.78 hostname.example.com hostname

{{< /file >}}


Before proceeding with the rest of this guide, you should create a DNS entry for your system's FQDN (fully qualified domain name). This means you'll need to make sure "hostname.example.com" (substituting your FQDN) points to your Linode's IP address. Additionally, you should create or edit the MX record for your domain to use your FQDN as the host that handles your email. For more information on this topic, please refer to our guides on [DNS basics](/docs/dns-guides/introduction-to-dns) and the [Linode DNS Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager).

Install Prerequisite Packages
-----------------------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Issue the following commands to install several packages required by Zimbra:

    apt-get install sudo libpcre3 libgmp3c2 lib32gmp3-dev libgmp3-dev sysstat libexpat1 libidn11 perl-modules wget lzma

Depending on the requirements for the current version of Zimbra, you may need to install additional packages later. The install program will notify you if additional packages are required.

Install Zimbra
--------------

Visit the download page for [Zimbra Open Source Edition](http://www.zimbra.com/downloads/os-downloads.html) and copy the link to the current version of the software for Debian 5 (Lenny) to your clipboard (unless there is a new link for Debian 6, in which case you should use that instead). Issue the following commands on your Linode via the shell to download and unpack the install package, replacing the filenames shown below after `wget` and `tar` with the current version. Please note that the version you download (32 or 64-bit) must match your Linode's architecture.

    wget http://files2.zimbra.com/downloads/6.0.10_GA/zcs-6.0.10_GA_2692.DEBIAN5.20101215161423.tgz
    tar -xzvf zcs*
    cd zcs*

Edit the file `util/utilfunc.sh`. Search for the first instance of the following line:

{{< file-excerpt "util/utilfunc.sh" >}}
PREREQ_PACKAGES="sudo libidn11 libgmp3 libstdc++6"

{{< /file-excerpt >}}


Change it to match the following excerpt:

{{< file-excerpt "util/utilfunc.sh" >}}
PREREQ_PACKAGES="sudo libidn11 libgmp3c2 libstdc++6"

{{< /file-excerpt >}}


Due to stricter behavior in the version supplied in Debian 6, you'll need to temporarily downgrade your `dpkg` binary before proceeding. Issue one of the following commands, depending on whether your running 32-bit or 64-bit Debian:

    wget http://security.ubuntu.com/ubuntu/pool/main/d/dpkg/dpkg_1.15.5.6ubuntu4.5_amd64.deb
    wget http://security.ubuntu.com/ubuntu/pool/main/d/dpkg/dpkg_1.15.5.6ubuntu4.5_i386.deb

Install the package with the following command:

    dpkg -i dpkg*deb

Launch the installer with the following command:

    ./install.sh --platform-override

The install will begin, prompting you to respond to a number of questions, and consuming a moment to perform various tasks. You can safely assume the default configuration. The system will offer the following prompt:

    The system will be modified.  Continue? [N] Y

As noted, answer `Y` to continue with the installation. The installation will take a few moments to install of the system packages.

After the installation completes, you may receive a warning similar to the one shown below:

    DNS ERROR resolving MX for hostname.example.com
    It is suggested that the domain name have an MX record configured in DNS
    Change domain name? [Yes] No

You'll then be presented with an admin menu next.

    Main menu

       1) Common Configuration:
       2) zimbra-ldap:                             Enabled
       3) zimbra-store:                            Enabled
            +Create Admin User:                    yes
            +Admin user to create:                 admin@hostname.example.com
    ******* +Admin Password                        UNSET
            +Enable automated spam training:       yes
            +Spam training user:                   spam.5jdzb7fy@hostname.example.com
            +Non-spam(Ham) training user:          ham.vhdq0mhzo@hostname.example.com
            +Global Documents Account:             wiki@hostname.example.com
            +SMTP host:                            hostname.example.com
            +Web server HTTP port:                 80
            +Web server HTTPS port:                443
            +Web server mode:                      http
            +IMAP server port:                     143
            +IMAP server SSL port:                 993
            +POP server port:                      110
            +POP server SSL port:                  995
            +Use spell check server:               yes
            +Spell server URL:                     http://hostname.example.com:7780/aspell.php
            +Configure for use with mail proxy:    FALSE
            +Configure for use with web proxy:     FALSE
            +Enable version update checks:         TRUE
            +Enable version update notifications:  TRUE
            +Version update notification email:    admin@hostname.example.com
            +Version update source email:          admin@hostname.example.com

       4) zimbra-mta:                              Enabled
       5) zimbra-snmp:                             Enabled
       6) zimbra-logger:                           Enabled
       7) zimbra-spell:                            Enabled
       8) Default Class of Service Configuration:
       r) Start servers after configuration        yes
       s) Save config to file
       x) Expand menu
       q) Quit

    Address unconfigured (**) items  (? - help)

Enter "3" to enter the zimbra-store menu, which will look similar to the following:

    Store configuration

       1) Status:                                  Enabled
       2) Create Admin User:                       yes
       3) Admin user to create:                    admin@hostname.example.com
    ** 4) Admin Password                           UNSET
       5) Enable automated spam training:          yes
       6) Spam training user:                      spam.5jdzb7fy@hostname.example.com
       7) Non-spam(Ham) training user:             ham.vhdq0mhzo@hostname.example.com
       8) Global Documents Account:                wiki@hostname.example.com
       9) SMTP host:                               hostname.example.com
      10) Web server HTTP port:                    80
      11) Web server HTTPS port:                   443
      12) Web server mode:                         http
      13) IMAP server port:                        143
      14) IMAP server SSL port:                    993
      15) POP server port:                         110
      16) POP server SSL port:                     995
      17) Use spell check server:                  yes
      18) Spell server URL:                        http://hostname.example.com:7780/aspell.php
      19) Configure for use with mail proxy:       FALSE
      20) Configure for use with web proxy:        FALSE
      21) Enable version update checks:            TRUE
      22) Enable version update notifications:     TRUE
      23) Version update notification email:       admin@hostname.example.com
      24) Version update source email:             admin@hostname.example.com

    Select, or 'r' for previous menu [r] 4

You can configure various options here; but, the most important option is the one for setting the administrator password. Enter "4" to set it, choosing a strong password comprised of letters, numbers, and non-alphanumeric characters. After setting the admin password, enter "r" to return to the main menu. At this point you can enter "a" to apply the configuration that you have set, and follow this procedure. This allows Zimbra to proceed with the remaining installation steps.

Issue the following command to restore your original version of `dpkg`:

    apt-get install dpkg

After installation has completed, you may wish to reboot your Linode to make sure everything comes back up properly. After doing so, visit the Zimbra admin URL in your browser. It will be in the form `https://hostname.example.com:7071/`. You'll need to accept the SSL certificate presented to access the admin panel, which you may then use to continue configuring your new Zimbra server.

Once you have configured the server and added accounts, users may log in using a link similar to `http://hostname.example.com/zimbra/mail`. Enjoy!

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



