---
slug: introduction-to-backups
author:
  name: Linode
  email: docs@linode.com
keywords: ["backups", "snapshot", "Linode backup", "beginners"]
description: This guide explains to new users why and how they should back up data on their Linodes.
og_description: This guide explains to new users why and how they should back up data on their Linodes.
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-18
modified_by:
  name: Linode
published: 2018-05-18
title: Introduction to Backups
external_resources:
  - '[Backing Up Your Data](/docs/guides/backing-up-your-data/)'
tags: ["linux"]
aliases: ['/quick-answers/linux-essentials/introduction-to-backups/']
---

![Introduction to Backups](introduction-to-backups.png "Introduction to Backups")

## Why Should You Back Up Your Data?

A *backup* can refer to anything from a copy of an important file to a snapshot of a full disk. Many desktop applications and operating systems automatically create backups of your data. In contrast, Linode is a flexible platform where you have full control over which operating systems and applications are installed, which means that no backup system is installed by default.

If you do not create or install a backup system, **data on your Linode is not backed up automatically**. This means that if your files are corrupted, accidentally deleted, or removed during a security compromise of your deployment, your data will be lost. If you store any critical or personal data on your Linode, you should take steps to make sure that your data is recoverable.

Aside from protecting your files against data-loss scenarios, making periodic backups can help you restore earlier versions of your data. For example, if you decide to change your application's configuration, but the new configuration doesn't work as expected, then you can revert to your earlier configuration.

## Linode Backups

One simple way to make sure your entire system is backed up is to use the official Linode Backup service. This is a paid add-on to your account, and it will automatically take a snapshot of your disk at regular intervals. If your data is ever lost, you can use the most recent snapshot to recover the disk. For more information, see [Linode Backups](/docs/products/storage/backups/).

## Manual Backups

If your Linode contains only a few important items (a directory with pictures or personal documents, for example), then backing up the entire disk may be overkill.

You may have made manual backups of files on your personal computer by dragging them onto a flash drive or other external device. A similar procedure can be used to save copies of your files on your Linode to your home computer, another Linode, or a [Block Storage Volume](/docs/products/storage/block-storage/). The simplest tool to use for this purpose is `scp`, which stands for *secure copy*.

1.  On your Linode, use the `zip` tool to create a compressed archive of the directory you want to back up:

        sudo apt install zip
        zip backup-$(date +%F).zip my-directory

    This will create a timestamped `.zip` file in your current working directory.

2.  From your local computer, copy the archive to your hard drive. Replace `username` with your Linux username and `ip-address` with the public IP address of your Linode.

        scp username@ip-address:/home/username/backup.zip .

3.  To copy to another Linode, run the following command from the Linode that contains the archive. This time, replace `ip-address` with the public IP address of the Linode that will store the backup.

        scp backup.zip username@ip-address:/home/username/

4.  If you have a Block Storage Volume mounted to your Linode, copying is even simpler:

        cp backup.zip /mnt/my-volume

If you are more comfortable working on the command line, this kind of backup can be automated with a [cron job](/docs/guides/schedule-tasks-with-cron/) so that it can run automatically at a set interval.

## Database Backups

Many applications, including common CMS platforms like WordPress, store their data in a database. It is crucial to make sure that this data can be restored in the event of a system compromise. Fortunately, most database systems include tools to make backing up simple and painless.

If you are using MySQL or MariaDB, read more about  `mysqldump` in our [mysqldump](/docs/guides/mysqldump-backups/) guide, or try making [physical backups](/docs/guides/create-physical-backups-of-your-mariadb-or-mysql-databases/).

If your application uses PostgreSQL, read our guide on [How to Back Up Your PostgreSQL Database](/docs/guides/how-to-back-up-your-postgresql-database/).

## Third-Party Tools

Free command line tools such as [backupninja](https://0xacab.org/riseuplabs/backupninja) and Gnome desktop tools like [sbackup](https://sourceforge.net/projects/sbackup/) can also be used to create customized, automated backup routines.
