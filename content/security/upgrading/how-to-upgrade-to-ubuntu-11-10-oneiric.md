---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'How to upgrade from Ubuntu 11.04 (Natty) to Ubuntu 11.10 (Oneiric).'
keywords: ["ubuntu 11.10 upgrade", " ubuntu oneiric upgrade", " distro upgrade", " linux upgrade howto"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['upgrading/upgrade-to-ubuntu-11-10-oneiric/']
modified: 2013-05-10
modified_by:
  name: Linode
published: 2011-10-13
title: 'How to Upgrade to Ubuntu 11.10 (Oneiric)'
---



This guide explains how to upgrade your system to Ubuntu 11.10 (Oneiric) from Ubuntu 11.04 (Natty). Before you begin, you should make sure that you have a working backup or a copy of your data. If you haven't already done so, you will also want to back up your configuration files (usually located in `/etc/`) in case they have changed in later versions of the software you are using. You should be logged in as root while performing these steps.

**Important:** If it isn't already selected in your Linode's configuration profile, you must edit the profile to use the "Latest 3.0" kernel (either 32-bit or 64-bit, depending on what architecture you have deployed). Please note that upgrades from older versions of Ubuntu will require you to follow the steps outlined in our other upgrade guides before upgrading to Ubuntu 11.10.

Preparing to Upgrade
--------------------

Make sure that you have properly set your hostname in `/etc/hostname`. If you have not set a hostname for your system yet, issue the following commands:

    echo "titan" > /etc/hostname
    hostname -F /etc/hostname

Be sure to replace "titan" with the name that you wish to give to your server.

Issue the following command to update your package lists:

    apt-get update

When running system upgrades, you may want to start a [screen](/docs/linux-tools/utilities/screen) session. This will ensure that your system updates continue to run in the event that you are disconnected from the server. Issue the following command to install `screen`:

    apt-get install screen

Once the installation has completed, issue the following command to start a screen session:

    screen

If at any time you get disconnected from your server, you can log back in and issue the following command to resume your screen session:

    screen -Dr

Upgrading
---------

Issue the following command to grab the latest version of key system utilities:

    apt-get install update-manager-core

Once this has completed, you may upgrade your system by issuing the following command:

    do-release-upgrade

The upgrade will download and install numerous packages. Please be advised that this task may take a while to complete.

You will also be advised that some services need to be restarted. In most cases the default list of services to be restarted will be fine. If you have additional services that you would like to be restarted, please add them to the list.

Additionally, you will also be asked if you'd like to replace some of your configuration files with the package maintainer's version. Please read through the prompts carefully and decide the best option for you.

The installation will restart services and configure new packages. Once the system is done updating, reboot your system through the Linode Manager to make sure that there were no problems during the upgrade. While your system reboots, you can watch your Linode's console for errors using the AJAX terminal or [Lish](/docs/troubleshooting/using-lish-the-linode-shell).

You may now check that you're running Ubuntu 11.10 (Oneiric) by issuing the following command as root:

    cat /etc/lsb-release

You should see output that resembles the following:

    DISTRIB_ID=Ubuntu
    DISTRIB_RELEASE=11.10
    DISTRIB_CODENAME=oneiric
    DISTRIB_DESCRIPTION="Ubuntu 11.10"

Congratulations! You are now running the latest version of Ubuntu!



