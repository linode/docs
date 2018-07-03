---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to upgrading to Ubuntu 12.04'
keywords: ["upgrading", "ubuntu", "precise"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['upgrading/upgrade-to-ubuntu-12-04-precise/']
modified: 2013-02-05
modified_by:
  name: Linode
published: 2012-06-01
title: 'How to Upgrade to Ubuntu 12.04 (Precise)'
---

Ubuntu 12.04 is a long-term support (LTS) release that will be supported until April 2017. This guide explains how to upgrade your Linode from Ubuntu 10.04 LTS (Lucid) or Ubuntu 11.04 (Natty) to Ubuntu 12.04 LTS (Precise).

# Preparing to Upgrade

Prepare your Linode for Ubuntu 12.04 LTS by installing available updates, backing up your Linode, checking your kernel, stopping services, and starting a screen session.

### Installing Available Updates

You should install all available updates for Ubuntu 10.04 LTS or Ubuntu 11.04 before upgrading to Ubuntu 12.04 LTS. Here's how:

1.  Update your package lists by entering the following command:

        sudo apt-get update

2.  Install the updates by entering the following command:

        sudo apt-get upgrade

Any available updates for Ubuntu 10.04 LTS or Ubuntu 11.04 will be installed on your Linode.

### Backing Up Your Linode

It's a good idea to back up your Linode before performing a major upgrade. That way, you can restore from backup if anything goes wrong during the upgrade process. If you subscribe to the Linode Backup Service, we recommend that you [take a manual snapshot](/docs/security/backups/linode-backup-service/#take-a-manual-snapshot) before upgrading to Ubuntu 12.04 LTS. If you use another backup service or application, we recommend that you make a manual backup now.

### Checking Your Kernel

Verify that your Linode is using the latest supported kernel. See [Applying Kernel Updates](/docs/uptime/monitoring-and-maintaining-your-server/#applying-kernel-updates) for more information.

### Stopping Services

We recommend that you stop as many services as possible before upgrading to Ubuntu 12.04 LTS. This includes web server daemons (Apache and nginx), database servers (PostgreSQL and MySQL), and any other non-critical services. To stop a service, enter the following command, replacing `apache2` with the name of the service you want to stop:

    sudo service apache2 stop

### Starting a Screen Session

We recommend that you start a screen session to ensure that the updates will continue to install in the unlikely event you are disconnected from the Linode during the upgrade process. Here's how to install `screen` and start a screen session:

1.  Install screen by entering the following command:

        sudo apt-get install screen

2.  After installation has completed, start a screen session by entering the following command:

        screen

3.  If you are disconnected from your server, you can reconnect to the screen session by entering the following command:

        screen -Dr

You are now ready to install Ubuntu 12.04 LTS on your Linode.

# Upgrading from Ubuntu 10.04 LTS

Here's how to upgrade from Ubuntu 10.04 LTS to Ubuntu 12.04 LTS:

1.  If it's not already installed, enter the following command to install the `update-manager-core` package:

        sudo apt-get install update-manager-core

2.  Open the `release-upgrades` file for editing by entering the following command:

        sudo nano /etc/update-manager/release-upgrades

3.  Verify that the following line is present in the file, and that `Prompt` is set to `lts`:

        Prompt=lts

4.  Upgrade your Linode to Ubuntu 12.04 LTS by entering the following command:

        sudo do-release-upgrade

5.  Follow the on-screen instructions to complete the installation process.
6.  When the upgrade process completes, verify that it's running Ubuntu 12.04 LTS by entering the following command:

        cat /etc/lsb-release

7.  You should see output that resembles the following:

        DISTRIB_ID=Ubuntu
        DISTRIB_RELEASE=12.04
        DISTRIB_CODENAME=precise
        DISTRIB_DESCRIPTION="Ubuntu 12.04"

Your Linode is now running Ubuntu 12.04 LTS.

# Upgrading from Ubuntu 11.10

Here's how to upgrade from Ubuntu 11.10 to Ubuntu 12.04 LTS:

1.  If it's not already installed, enter the following command to install the `update-manager-core` package:

        sudo apt-get install update-manager-core

2.  Upgrade your Linode to Ubuntu 12.04 LTS by entering the following command:

        sudo do-release-upgrade

3.  Follow the on-screen instructions to complete the installation process.
4.  After your Linode boots, verify that it's running Ubuntu 12.04 LTS by entering the following command:

        cat /etc/lsb-release

5.  You should see output that resembles the following:

        DISTRIB_ID=Ubuntu
        DISTRIB_RELEASE=12.04
        DISTRIB_CODENAME=precise
        DISTRIB_DESCRIPTION="Ubuntu 12.04"

Your Linode is now running Ubuntu 12.04 LTS.

# Upgrading from Previous Ubuntu Releases

If your Linode is running an release of Ubuntu older than 10.04 LTS, use the upgrade guides in the [Troubleshooting](/docs/troubleshooting) section to upgrade to Ubuntu 10.04 LTS or Ubuntu 11.10 first. You may then upgrade your Linode to Ubuntu 12.04 LTS.



