---
author:
  name: Armin Stebich
  email: linode@mail.lordofbikes.de
description: 'How to upgrade from Debian 8 (Jessie) to Debian 9 (Stretch).'
keywords: ['debian', 'upgrade', 'jessie', 'stretch']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-11-24
modified: 2018-11-24
modified_by:
  name: Armin Stebich
title: "Upgrading to Debian 9 (Stretch)"
contributor:
  name: Armin Stebich
  link: https://github.com/lordofbikes
---

Debian 9 (Stretch) is the most recent version of Debian, supported on Linodes in 2018. This guide explains how to upgrade your system from Debian 8 (Jessie) to Debian 9.

Bear in mind that while package and distribution maintainers try to ensure cross-compatibility and problem-free upgrades, there is always the lingering possibility of something not working out as planned. This is one reason why backing up your data is so important.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Preparing to Upgrade

Prepare your Linode for Debian 9 by installing updates, backing up your Linode, checking your kernel, stopping services, and starting a screen session.

### Installing Available Updates

You should install all available updates for Debian 8 before upgrading to Debian 9.

    sudo apt-get update && sudo apt-get upgrade -y


### Backing Up Your Linode

It's a good idea to [back up](/docs/platform/backup-service) your Linode before performing a major upgrade. If you subscribe to the Linode Backup Service, we recommend that you [take a manual snapshot](/docs/security/backups/linode-backup-service/#take-a-manual-snapshot) before upgrading to Debian 9. If you use another backup service or application, we recommend that you make a manual backup now. You may also want to back up your configuration files (usually located in `/etc/`) in case they have changed in later versions of the software you are using. See our [backup guides](/docs/security/backups/) for more information.

### Checking Your Kernel

Verify that your Linode is using the latest supported kernel. See [Applying Kernel Updates](/docs/uptime/monitoring-and-maintaining-your-server/#applying-kernel-updates) for more information.

### Stopping Services

We recommend that you stop as many services as possible before upgrading to Debian 9. This includes web server daemons (Apache and nginx), database servers (PostgreSQL and MySQL), and any other non-critical services. To stop a service, enter the following command, replacing `apache2` with the name of the service you want to stop:

    sudo service apache2 stop

For a list of running services run this command:

    sudo service --status-all

### Starting a Screen Session

To ensure that the updates will continue to install in the unlikely event you are disconnected from the Linode during the upgrade process, go through the upgrade process in a screen session.

1.  Install screen:

        sudo apt-get install screen

2.  Start a screen session:

        screen

3.  If you are disconnected from your server, you can reconnect to the screen session by entering the following command:

        screen -rd

You are now ready to install Debian 9 on your Linode.

## Upgrading to Debian 9

1.  Edit your `/etc/apt/sources.list` file and change all instances of `jessie` to `stretch`. Once you have finished, your `/etc/apt/sources.list` should resemble the following:

    {{< file "/etc/apt/sources.list" >}}
deb http://mirrors.linode.com/debian/ stretch main
deb-src http://mirrors.linode.com/debian/ stretch main

deb http://security.debian.org/ stretch/updates main
deb-src http://security.debian.org/ stretch/updates main

# stretch-updates, previously known as 'volatile'
deb http://mirrors.linode.com/debian/ stretch-updates main
deb-src http://mirrors.linode.com/debian/ stretch-updates main
{{< /file >}}


    {{< note >}}
Check your `/etc/apt/sources.list.d` for additional package repositories, and ensure that they are querying for packages from `stretch`.  You will need to check with the maintainers of each package to ensure that their own repositories have been updated.
{{< /note >}}

2.  Update your package lists:

        sudo apt-get update

3.  Grab the latest versions of key system utilities:

        sudo apt-get install apt dpkg aptitude

4.  Upgrade your system by entering the following command. The upgrade will download and install numerous packages. This step may take a while to complete:

        sudo apt-get dist-upgrade

     {{< note >}}
There is a known issue which may stop the upgrade when fail2ban is installed, see [Debian Bug #860397](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=860397).
Find the solution in [Troubleshooting Problems](/docs/security/upgrading/upgrade-to-debian-9-stretch/#fail2ban-issue) below.
{{< /note >}}

    During the upgrade process, configuration files that you've modified and require updates will be presented for manual review. Here's an example:

        Configuration file '/etc/mysql/my.cnf'
        ==> Modified (by you or by a script) since installation.
        ==> Package distributor has shipped an updated version.
        What would you like to do about it ?  Your options are:
        Y or I  : install the package maintainer's version
        N or O  : keep your currently-installed version
        D     : show the differences between the versions


5.  Reboot your system using the [Linode Manager](https://manager.linode.com) to make sure that there were no problems during the upgrade. While your system reboots, you can watch your Linode's console for errors using the AJAX terminal or [Lish](/docs/platform/manager/using-the-linode-shell-lish/).

Your Linode is now running Debian 9!

## Troubleshooting Problems

### fail2ban issue

The upgrade will abort because of this known issue, caused by an error in `/etc/fail2ban/jail.local`. Use your preferred editor to repair this file:

    sudo vim /etc/fail2ban/jail.local

Then navigate to this line (around line 155) in section `[pam-generic]`:

    port = anyport

Delete this line or prepend a `#` to comment it out.
This is an error because this section has already the setting `port = all` a few lines above.

After fixing the fail2ban file, run these commands to finish the upgrade:

    sudo dpkg --configure -a
    sudo apt-get install --fix-broken

This will finish the upgrade.



