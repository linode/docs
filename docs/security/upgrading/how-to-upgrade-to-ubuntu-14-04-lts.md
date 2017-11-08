---
author:
  name: Dave Russell
  email: drussell@linode.com
description: 'Our guide to upgrading to Ubuntu 14.04 LTS'
keywords: ["upgrading", "ubuntu", "ubuntu 14.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-02-22
modified_by:
  name: Dave Russell
published: 2014-10-21
title: 'How to Upgrade to Ubuntu 14.04 LTS'
---

Ubuntu 14.04 is a long-term support (LTS) release that will be supported until April 2019. This guide explains how to upgrade your Linode from Ubuntu 12.04 (Precise Pangolin) to Ubuntu 14.04 (Trusty Tahr).

{{< caution >}}
Distribution upgrades can yield unpredictable results, due to variations in software stacks. When possible, we recommend:

 - Creating a new Linode with the latest disk template
 - Rebuilding your stack
 - Transferring your data
 - Swapping IP addresses

In addition, you should use [LISH](https://www.linode.com/docs/networking/using-the-linode-shell-lish) to perform this upgrade as, in the event your internet connection is disconnected, your system may end up corrupted or the upgrade may be incomplete.
{{< /caution >}}

{{< note >}}
This guide was written assuming that you have root access to your Linode. If you do not have root access, you will need to prepend each command with `sudo`.
{{< /note >}}

## Preparing to Upgrade

Before upgrading, you will need to prepare your Linode to be upgraded. In order to do so, we will:

1.  Install updates for Ubuntu 12.04

2.  Backup your data

3.  Check to ensure the kernel version you're using is the latest kernel

4.  Stop non-critical services

5.  Start a LISH session to ensure that the installation is not interrupted

Each of these will be discussed in more detail below.

{{< note >}}
In the interest of security, Ubuntu 14.04 LTS disables password based SSH authentication for the root user.  If you log into your root account directly via SSH, you will need to ensure that you have configured key based authentication prior to following these upgrade steps.  If you have already followed our steps for [adding a new user](/docs/security/securing-your-server/#ubuntu) to your Linode, you should be able to log in with that account after the upgrade process has completed.
{{< /note >}}

### Installing Available Updates

You should install all available updates for Ubuntu 12.04 LTS before upgrading to Ubuntu 14.04 LTS. You can do so by running these commands:

1.  Update your package lists by entering the following command:

        apt-get update

2.  Install the updates by entering the following command:

        apt-get upgrade

Any available updates for Ubuntu 12.04 LTS will be installed on your Linode.

### Backing Up Your Linode

It's a good idea to back up your Linode before performing a major upgrade. That way, you can restore from backup if anything goes wrong during the upgrade process. If you subscribe to the Linode Backup Service, we recommend that you [take a manual snapshot](/docs/security/backups/linode-backup-service/#take-a-manual-snapshot) before upgrading to Ubuntu 14.04 LTS. If you use another backup service or application, we recommend that you make a manual backup now.

### Checking Your Kernel

Verify that your Linode is using the latest supported kernel. See [Applying Kernel Updates](/docs/uptime/monitoring-and-maintaining-your-server/#applying-kernel-updates) for more information.

### Stopping Services

We recommend that you stop as many services as possible before upgrading to Ubuntu 14.04 LTS. This includes web server daemons (Apache and nginx), database servers (PostgreSQL and MySQL), and any other non-critical services. To stop a service, enter the following command, replacing `apache2` with the name of the service you want to stop:

    service apache2 stop

You are now ready to install Ubuntu 14.04 LTS on your Linode.

## Upgrading from Ubuntu 12.04 LTS

Here's how to upgrade from Ubuntu 12.04 LTS to Ubuntu 14.04 LTS:

1.  If it's not already installed, enter the following command to install the `update-manager-core` package:

        apt-get install update-manager-core

2.  Open the `release-upgrades` file for editing by entering the following command:

        nano /etc/update-manager/release-upgrades

3.  Verify that the following line is present in the file, and that `Prompt` is set to `lts`:

        Prompt=lts

4.  Exit nano and upgrade your Linode to Ubuntu 14.04 LTS by entering the following command:

        do-release-upgrade -d

5.  Follow the on-screen instructions to complete the installation process. You will be prompted as to whether you wish to continue; as you are on LISH, it is safe to continue via SSH.

6.  Because Linode offers internal package mirrors for Ubuntu, you may see this message:

        No valid mirror found

        While scanning your repository information no mirror entry for the
        upgrade was found. This can happen if you run an internal mirror or
        if the mirror information is out of date.

        Do you want to rewrite your 'sources.list' file anyway? If you choose
        'Yes' here it will update all 'precise' to 'trusty' entries.
        If you select 'No' the upgrade will cancel.

        Continue [yN]

    Type `y` and `return` to continue.

7.  The upgrade will cause your Linode to reboot. After it does so, verify that it's running Ubuntu 14.04 LTS by entering the following command:

        cat /etc/lsb-release

8.  You should see output that resembles the following:

        DISTRIB_ID=Ubuntu
        DISTRIB_RELEASE=14.04
        DISTRIB_CODENAME=trusty
        DISTRIB_DESCRIPTION="Ubuntu 14.04.1 LTS"

Your Linode is now running Ubuntu 14.04 LTS.


## Upgrading from Previous Ubuntu Releases

If your Linode is running an release of Ubuntu older than 12.04 LTS, use the upgrade guides in the [Upgrading](/docs/security/upgrading) section to upgrade to Ubuntu 12.04 LTS first. You may then upgrade your Linode to Ubuntu 14.04 LTS.
