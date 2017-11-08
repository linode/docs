---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'How to avoid common pitfalls when upgrading your Linode to Ubuntu 10.10.'
keywords: 'ubuntu 10.10 upgrade,ubuntu maverick upgrade,distro upgrade,linux upgrade howto'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['upgrading/upgrade-to-ubuntu-10-10-maverick/']
modified: Friday, May 10th, 2013
modified_by:
  name: Linode
published: 'Wednesday, October 13th, 2010'
title: 'How to Upgrade to Ubuntu 10.10 (Maverick)'
---



This guide explains how to upgrade your Linode to Ubuntu 10.10 (Maverick). As with any task involving major system changes, you are strongly encouraged to make backups of your data before proceeding. You should be logged in as root for these procedures. Ubuntu only officially supports direct upgrades between LTS releases. However, you may follow these steps to upgrade your system if you're willing to handle any potential snags that may occur.

**Important:** If it isn't already selected in your Linode's configuration profile, you must edit the profile to use the "Latest 3.0" kernel (either 32-bit or 64-bit, depending on what architecture you have deployed).

Upgrade Instructions
--------------------

You should stop as many services as possible before upgrading your system. This should include web server deaemons (Apache, nginx, etc), database servers (PostgreSQL, MySQL, etc), and any other non-critical services.

If you are running Ubuntu 8.04 or 9.10, edit your `/etc/fstab` file to include the following line (see later notes on Ubuntu 9.04).

{: .file-excerpt }
/etc/fstab

> dev /dev devtmpfs rw 0 0

Issue the following commands to update your existing packages:

    apt-get update
    apt-get upgrade

Issue the following command to install the `screen` utility and the update manager program:

    apt-get install screen update-manager-core

Edit the `/etc/update-manager/release-upgrades` file, setting "Prompt=normal" as shown below. Please note that if you are running Ubuntu 9.04, you will be upgraded to Ubuntu 9.10 instead of Ubuntu 10.10; afterward, you may upgrade to Ubuntu 10.10 by rebooting your Linode and repeating the `do-release-upgrade` process. Likewise, if you're running Ubuntu 9.10, you'll be upgraded to Ubuntu 10.04 first.

{: .file-excerpt }
/etc/update-manager/release-upgrades

> Prompt=normal

Start a screen session and issue the upgrade command:

    screen
    do-release-upgrade --proposed

If you're logged in via SSH, you will receive the following warning:

    Continue running under SSH?

    This session appears to be running under ssh. It is not recommended
    to perform a upgrade over ssh currently because in case of failure it
    is harder to recover.

    If you continue, an additional ssh daemon will be started at port
    '9004'.
    Do you want to continue?

    Continue [yN]

Enter "y" to continue. If something goes wrong and your SSH session is interrupted, you should be able to connect to your Linode via the additional SSH daemon by connecting to port 9004 with your SSH client. If you need to do this, you may resume your screen session by issuing the following command at your Linode's root shell prompt:

    screen -Dr

At the end of the upgrade process, you'll see this message:

    System upgrade is complete.

    Restart required

    To finish the upgrade, a restart is required.
    If you select 'y' the system will be restarted.

    Continue [yN] n

Enter "n" to avoid rebooting from the console. Reboot your Linode using the "Reboot" button on the dashboard of the Linode Manager. When your Linode boots up again, you may notice messages on the console regarding `ureadahead` and `plymouthd` being killed; these are not a cause for concern. You can prevent such messages from appearing again by issuing the following commands:

    cd /etc/init
    for i in plymouth* ureadahead*; do mv ${i} ${i}.disabled; done

If you were running Ubuntu 9.04 previously and have gone through this guide once, you're now running Ubuntu 9.10. If you were running Ubuntu 9.10, you're now running Ubuntu 10.04, and will need to repeat this process to finish upgrading to Ubuntu 10.10.

Fixing a Broken System
----------------------

If you've already attempted to upgrade but your Linode is failing to boot properly, you'll need to start by creating a [Finnix rescue profile](/docs/troubleshooting/finnix-rescue-mode). In that profile, set your Ubuntu disk to attach to `xvda`. Boot into Finnix and issue the following command to open your Linode's `fstab` file for editing:

    mount /dev/xvda
    nano /media/xvda/etc/fstab

Add the following line to your file:

{: .file-excerpt }
/media/xvda/etc/fstab

> dev /dev devtmpfs rw 0 0

Save the file by entering `Ctrl+x` and agreeing to the changes. You may now reboot your Linode from the Linode Manager dashboard using its normal configuration profile.



