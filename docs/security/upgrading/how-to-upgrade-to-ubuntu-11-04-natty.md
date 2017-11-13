---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'How to upgrade from Ubuntu 10.10 (Maverick) to Ubuntu 11.04 (Natty).'
keywords: ["ubuntu 11.04 upgrade", " ubuntu natty upgrade", " distro upgrade", " linux upgrade howto"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['upgrading/upgrade-to-ubuntu-11-04-natty/']
modified: 2013-05-10
modified_by:
  name: Linode
published: 2011-04-28
title: 'How to Upgrade to Ubuntu 11.04 (Natty)'
---



This guide explains how to upgrade your system to Ubuntu 11.04 (Natty) from Ubuntu 10.10 (Maverick). Before you begin, you should make sure that you have a working backup or a copy of your data. If you haven't already done so, you will also want to back up your configuration files (usually located in `/etc/`) in case they have changed in later versions of the software you are using. You should be logged in as root while performing these steps.

**Important:** If it isn't already selected in your Linode's configuration profile, you must edit the profile to use the "Latest 3.0" kernel (either 32-bit or 64-bit, depending on what architecture you have deployed). Please note that upgrades from older versions of Ubuntu will require you to follow the steps outlined in our other upgrade guides before upgrading to Ubuntu 11.04 (Natty).

# Preparing to Upgrade

Make sure that you have properly set your hostname in `/etc/hostname`. If you have not set a hostname for your system yet, issue the following commands:

    echo "titan" > /etc/hostname
    hostname -F /etc/hostname

Be sure to replace "titan" with the name that you wish to give to your server.

Edit your `/etc/apt/sources.list` file and change instances of `maverick` to `natty`. Once you have finished this, your `/etc/apt/sources.list` should resemble the following:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://us.archive.ubuntu.com/ubuntu/ natty main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ natty main restricted
deb http://us.archive.ubuntu.com/ubuntu/ natty-updates main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ natty-updates main restricted
deb http://us.archive.ubuntu.com/ubuntu/ natty universe
deb-src http://us.archive.ubuntu.com/ubuntu/ natty universe
deb http://us.archive.ubuntu.com/ubuntu/ natty-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ natty-updates universe
deb http://us.archive.ubuntu.com/ubuntu/ natty multiverse
deb-src http://us.archive.ubuntu.com/ubuntu/ natty multiverse
deb http://us.archive.ubuntu.com/ubuntu/ natty-updates multiverse
deb-src http://us.archive.ubuntu.com/ubuntu/ natty-updates multiverse

# deb http://us.archive.ubuntu.com/ubuntu/ natty-backports main restricted universe multiverse
# deb-src http://us.archive.ubuntu.com/ubuntu/ natty-backports main restricted universe multiverse

# deb http://archive.canonical.com/ubuntu natty partner
# deb-src http://archive.canonical.com/ubuntu natty partner

# deb http://extras.ubuntu.com/ubuntu natty main
# deb-src http://extras.ubuntu.com/ubuntu natty main

deb http://security.ubuntu.com/ubuntu natty-security main restricted
deb-src http://security.ubuntu.com/ubuntu natty-security main restricted
deb http://security.ubuntu.com/ubuntu natty-security universe
deb-src http://security.ubuntu.com/ubuntu natty-security universe
deb http://security.ubuntu.com/ubuntu natty-security multiverse
deb-src http://security.ubuntu.com/ubuntu natty-security multiverse

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

You will also be advised that some services need to be restarted. In most cases the default list of services to be restarted will be fine. If you have additional services that you would like to be restarted, please add them to the list.

The installation will restart services and configure new packages. Once the system is done updating, reboot your system through the Linode Manager to make sure that there were no problems during the upgrade. While your system reboots, you can watch your Linode's console for errors using the AJAX terminal or [Lish](/docs/troubleshooting/using-lish-the-linode-shell). When your Linode boots up again, you may notice messages on the console regarding `ureadahead` and `plymouthd` being killed; these are not a cause for concern. You can prevent such messages from appearing again by issuing the following commands:

    cd /etc/init
    for i in plymouth* ureadahead*; do mv ${i} ${i}.disabled; done

You may now check that you're running Ubuntu 11.04 (Natty) by issuing the following command as root:

    cat /etc/lsb-release

You should see output that resembles the following:

    DISTRIB_ID=Ubuntu
    DISTRIB_RELEASE=11.04
    DISTRIB_CODENAME=natty
    DISTRIB_DESCRIPTION="Ubuntu 11.04"



