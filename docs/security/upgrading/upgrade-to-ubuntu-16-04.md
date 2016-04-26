---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Our guide to upgrading to Ubuntu 16.04 LTS'
keywords: 'upgrading,ubuntu,ubuntu 16.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Sunday, February 22, 2015
modified_by:
  name: Alex Fornuto
published: 'Tuesday, October 21st, 2014'
title: 'How to Upgrade to Ubuntu 16.04 LTS'
---

Ubuntu 16.04 is a long-term support (LTS) release that will be supported until April 2021. This guide explains how to upgrade your Linode from Ubuntu 14.04 (Trusty Tahr) to Ubuntu 16.04 (Xenial Xerus).

 {: .caution }
 >Distribution upgrades can yield unpredictable results, due to variations in software stacks. When possible, we recommend:
 >
 - Creating a new Linode with the latest disk template
 - Rebuilding your stack
 - Transferring your data
 - Swapping IP addresses
 >
 > You should use [Lish](/docs/networking/using-the-linode-shell-lish) or [Glish](/docs/networking/use-the-graphic-shell-glish) to perform this upgrade. In the event your internet connection is disconnected, your system may end up corrupted or the upgrade may be incomplete.


{: .note}
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Prepare to Upgrade

Before upgrading, you will need to prepare your Linode to be upgraded. In order to do so, we will:

1.  Install updates for Ubuntu 14.04

2.  Backup your data

3.  Check to ensure the kernel version you're using is the latest kernel

4.  Stop non-critical services

5.  Start a LISH session to ensure that the installation is not interrupted

Each of these will be discussed in more detail below.

{: .note }
>
>In the interest of security, Ubuntu 16.04 LTS disables password based SSH authentication for the root user.  If you log into your root account directly via SSH, you will need to ensure that you have configured key based authentication prior to following these upgrade steps.  If you have already followed our steps for [adding a new user](/docs/security/securing-your-server/#debian--ubuntu) to your Linode, you should be able to log in with that account after the upgrade process has completed.

### Install Available Updates


1.  Update your package lists:

        apt-get update

2.  Install all updates:

        apt-get upgrade

### Back Up Your Linode

It's a good idea to back up your Linode before performing a major upgrade. That way, you can restore from backup if anything goes wrong during the upgrade process. If you subscribe to the Linode Backup Service, we recommend that you [take a manual snapshot](/docs/security/backups/backup-service/#take-a-manual-snapshot) before upgrading to Ubuntu 16.04 LTS. If you use another backup service or application, we recommend that you make a manual backup now.

### Check Your Kernel

Verify that your Linode is using the latest supported kernel. See [Applying Kernel Updates](/docs/uptime/monitoring-and-maintaining-your-server/#applying-kernel-updates) for more information.

### Stop Services

We recommend that you stop as many services as possible before upgrading to Ubuntu 16.04 LTS. This includes web server daemons (Apache and nginx), database servers (PostgreSQL and MySQL), and any other non-critical services. To stop a service, enter the following command, replacing `apache2` with the name of the service you want to stop:

    service apache2 stop

You are now ready to install Ubuntu 16.04 LTS on your Linode.

## Upgrading from Ubuntu 14.04 LTS

Here's how to upgrade from Ubuntu 14.04 LTS to Ubuntu 16.04 LTS. Remember to perform these steps in a Lish or Glish session:

1.  If it's not already, install the `update-manager-core` package:

        apt-get install update-manager-core

2.  Open `/etc/update-manager/release-upgrades` and verify that the `Prompt` value is set to `lts`:

    {: .file}
    /etc/update-manager/release-upgrades
    :   ~~~
        # Default behavior for the release upgrader.

        [DEFAULT]
        # Default prompting behavior, valid options:
        #
        #  never  - Never check for a new release.
        #  normal - Check to see if a new release is available.  If more than one new
        #           release is found, the release upgrader will attempt to upgrade to
        #           the release that immediately succeeds the currently-running
        #           release.
        #  lts    - Check to see if a new LTS release is available.  The upgrader
        #           will attempt to upgrade to the first LTS release available after
        #           the currently-running one.  Note that this option should not be
        #           used if the currently-running release is not itself an LTS
        #           release, since in that case the upgrader won't be able to
        #           determine if a newer release is available.
        Prompt=lts
        ~~~

3.  You're now ready to begin the upgrade to Ubuntu 16.04 LTS:

        do-release-upgrade -d

    Follow the on-screen instructions to complete the installation process.

4.  Because Linode offers internal package mirrors for Ubuntu, you may see this message:

        No valid mirror found

        While scanning your repository information no mirror entry for the
        upgrade was found. This can happen if you run an internal mirror or
        if the mirror information is out of date.

        Do you want to rewrite your 'sources.list' file anyway? If you choose
        'Yes' here it will update all 'precise' to 'trusty' entries.
        If you select 'No' the upgrade will cancel.

        Continue [yN]

    Type `y` and **Enter** to continue.

5.  The upgrade will require a reboot. Afterwards, verify that it's running Ubuntu 16.04:

        lsb_release -a

6.  You should see output that resembles the following:

        No LSB modules are available.
        Distributor ID: Ubuntu
        Description:    Ubuntu 16.04 LTS
        Release:        16.04
        Codename:       xenial

Your Linode is now running Ubuntu 16.04 LTS.


## Upgrading from Previous Ubuntu Releases

If your Linode is running an release of Ubuntu older than 14.04 LTS, use the upgrade guides in the [Upgrading](/docs/security/upgrading) section to upgrade to Ubuntu 14.04 LTS first. You may then upgrade your Linode to Ubuntu 16.04 LTS.