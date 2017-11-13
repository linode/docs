---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'How to upgrade from Debian 5 (Lenny) to Debian 6 (Squeeze).'
keywords: ["debian upgrade", "upgrade distro", "squeeze upgrade", "squeeze"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['upgrading/upgrade-to-debian-6-squeeze/']
modified: 2013-10-01
modified_by:
  name: Linode
published: 2011-02-05
title: 'How to Upgrade to Debian 6 (Squeeze)'
---



This guide explains how to upgrade your system to Debian 6 (Squeeze) from Debian 5 (Lenny). Before you begin, you should make sure that you have a working backup or a copy of your data. If you haven't already done so, you will also want to back up your configuration files (usually located in `/etc/`) in case they have changed in later versions of the software you are using. You should be logged in as root while performing these steps.

# Preparing to Upgrade

Make sure that you have properly set your hostname in `/etc/hostname`. If you have not set a hostname for your system yet, issue the following commands:

    echo "titan" > /etc/hostname
    hostname -F /etc/hostname

Be sure to replace "titan" with the name that you wish to give to your server.

Edit your `/etc/apt/sources.list` file and change instances of `lenny` to `squeeze`. Once you have finished this, your `/etc/apt/sources.list` should resemble the following:

{{< file-excerpt "/etc/apt/sources.list" >}}
# main repo
deb http://ftp.debian.org/debian/ squeeze main
deb-src http://ftp.debian.org/debian/ squeeze main
deb http://security.debian.org/ squeeze/updates main
deb-src http://security.debian.org/ squeeze/updates main

# contrib & non-free repos
#deb http://ftp.debian.org/debian/ squeeze contrib non-free
#deb-src http://ftp.debian.org/debian/ squeeze contrib non-free
#deb http://security.debian.org/debian/ squeeze/updates contrib non-free
#deb-src http://security.debian.org/debian/ squeeze/updates contrib non-free

{{< /file-excerpt >}}


Issue the following command to update your package lists:

    apt-get update

When running system upgrades, you may want to start a [screen](/docs/linux-tools/utilities/screen) session. This will ensure that your system updates continue to run in the event that you are disconnected from the server. Issue the following command to install `screen`:

    apt-get install screen

Once the installation has completed, issue the following command to start a screen session:

    screen

If at any time you get disconnected from your server, you can log back in and issue the following command to resume your screen session:

    screen -Dr

# Upgrading

Issue the following command to grab the latest version of key system utilities:

    apt-get install apt dpkg aptitude

Once this has completed, you may upgrade your system by issuing the following command:

    apt-get dist-upgrade

The upgrade will download and install numerous packages. Please be advised that this task may take a while to complete.

During the upgrade process, you will be asked if you want to use `dash` instead of your current shell. `dash` is a Unix shell that is distributed by the Debian project. Most users will not notice a difference between `dash` and `bash` or `sh`, and most shell scripts should continue to function normally if you decide to switch to `dash`.

You will also be advised that services using "NSS" (Network Security Services) and "PAM" (Pluggable Authentication Modules) need to be restarted. In most cases the default list of services to be restarted will be fine. If you have additional services that you run that use NSS or PAM, please add them to the list.

The installation will restart services and configure new packages. Once the system is done updating, reboot your system through the Linode Manager to make sure that there were no problems during the upgrade. While your system reboots, you can watch your Linode's console for errors using the AJAX terminal or [Lish](/docs/troubleshooting/using-lish-the-linode-shell).

# System Errors

You may receive some errors similar to "missing LSB tags and overrides" or "package removed but not purged" when attempting to upgrade your system. The LSB tags error can be safely ignored. More information on why you are receiving this error can be found in [Debian's dependency based boot sequence article](http://wiki.debian.org/LSBInitScripts/DependencyBasedBoot).

Errors about packages that are removed and not purged may be resolved by installing the latest version of the software or purging the old package. For example, if you receive an error about MySQL, you may try to resolve the issue by issuing the following command:

    apt-get install mysql-server

If the above step does not work for the software you are trying to install, you may purge the package with the following command after **ensuring that you have a backup** of the program's data and configuration:

    apt-get remove --purge mysql-server



