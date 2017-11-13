---
deprecated: yes
author:
  name: Linode
  email: docs@linode.com
description: 'How to upgrade from Debian 6 (Squeeze) to Debian 7 (Wheezy).'
keywords: ["debian upgrade", "upgrade distro", "wheezy upgrade", "wheezy"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['upgrading/upgrade-to-debian-7-wheezy/']
modified: 2013-05-10
modified_by:
  name: Linode
published: 2013-05-10
title: 'How to Upgrade to Debian 7 (Wheezy)'
---

Debian 7 (Wheezy) was released in May 2013. This guide explains how to upgrade your system from Debian 6 (Squeeze) to Debian 7 (Wheezy). Before you begin, you should make sure that you have a working [backup](/docs/platform/backup-service) or a copy of your data.

# Preparing to Upgrade

Prepare your Linode for Debian 7 by installing updates, backing up your Linode, checking your kernel, stopping services, and starting a screen session.

### Installing Available Updates

You should install all available updates for Debian 6 before upgrading to Debian 7. Here's how:

1.  Update your package lists by entering the following command:

        sudo apt-get update

2.  Install the updates by entering the following command:

        sudo apt-get upgrade

Any available updates for Debian 6 will be installed on your Linode.

### Backing Up Your Linode

It's a good idea to [back up](/docs/platform/backup-service) your Linode before performing a major upgrade. That way, you can restore from backup if anything goes wrong during the upgrade process. If you subscribe to the Linode Backup Service, we recommend that you [take a manual snapshot](/docs/security/backups/linode-backup-service/#take-a-manual-snapshot) before upgrading to Debian 7. If you use another backup service or application, we recommend that you make a manual backup now. You may also want to back up your configuration files (usually located in /etc/) in case they have changed in later versions of the software you are using.

### Checking Your Kernel

Verify that your Linode is using the latest supported kernel. See [Applying Kernel Updates](/docs/uptime/monitoring-and-maintaining-your-server/#applying-kernel-updates) for more information.

### Stopping Services

We recommend that you stop as many services as possible before upgrading to Debian 7. This includes web server daemons (Apache and nginx), database servers (PostgreSQL and MySQL), and any other non-critical services. To stop a service, enter the following command, replacing `apache2` with the name of the service you want to stop:

    sudo service apache2 stop

### Starting a Screen Session

We recommend that you start a screen session to ensure that the updates will continue to install in the unlikely event you are disconnected from the Linode during the upgrade process. Here's how to install `screen` and start a screen session:

1.  Install screen by entering the following command:

        sudo apt-get install screen

2.  After installation has completed, start a screen session by entering the following command:

        screen

3.  If you are disconnected from your server, you can reconnect to the screen session by entering the following command:

        screen -Dr

You are now ready to install Debian 7 on your Linode.

# Upgrading to Debian 7

Here's how to upgrade from Debian 6 to Debian 7:

1.  Edit your `/etc/apt/sources.list` file and change all instances of `squeeze` to `wheezy`. Once you have finished, your `/etc/apt/sources.list` should resemble the following:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://ftp.us.debian.org/debian/ wheezy main
deb-src http://ftp.us.debian.org/debian/ wheezy main

deb http://security.debian.org/ wheezy/updates main
deb-src http://security.debian.org/ wheezy/updates main

# wheezy-updates, previously known as 'volatile'
deb http://ftp.us.debian.org/debian/ wheezy-updates main
deb-src http://ftp.us.debian.org/debian/ wheezy-updates main

{{< /file-excerpt >}}


2.  Enter the following command to update your package lists:

        sudo apt-get update

3.  Enter the following command to grab the latest versions of key system utilities:

        sudo apt-get install apt dpkg aptitude

4.  After the package updates have completed, upgrade your system by entering the following command. The upgrade will download and install numerous packages. This step may take a while to complete.

        sudo apt-get dist-upgrade

 {{< note >}}
Services using "NSS" (Network Security Services) and "PAM" (Pluggable Authentication Modules) will need to be restarted. In most cases the default list of services to be restarted is fine. If you have additional services that you run that use NSS or PAM, please add them to the list.
{{< /note >}}

5.  Once the system is updated, reboot your system using the [Linode Manager](https://manager.linode.com) to make sure that there were no problems during the upgrade. While your system reboots, you can watch your Linode's console for errors using the AJAX terminal or [Lish](/docs/troubleshooting/using-lish-the-linode-shell).

Your Linode is now running Debian 7.

# Troubleshooting Problems

Errors about packages that are removed and not purged may be resolved by installing the latest version of the software or purging the old package. For example, if you receive an error about MySQL, you could try to resolve the issue by entering the following command:

    apt-get install mysql-server

If the above step does not work for the package you are trying to install, you may purge the package with the following command after **ensuring that you have a backup** of the program's data and configuration:

    apt-get remove --purge mysql-server



