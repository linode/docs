---
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
  - '[Backing Up Your Data](/docs/security/backups/backing-up-your-data/)'
---

## Why Should You Back Up Your Data?

A **backup** can refer to anything from a copy of an important file to a snapshot of a full disk on your Linode. Many modern desktop applications and operating systems automatically create backups of your data, but a Linode is a platform rather than an application. As a result, **data on your Linode is not backed up automatically**. This means that if your system is hacked or your files are corrupted or accidentally deleted, your data will be lost. If you store any critical or personal data on your Linode, you should take steps to make sure that data lost in these ways can be recovered.

## Linode Backups

One simple way to make sure your entire system is backed up is to use the official Linode Backup service. This is a paid add-on to your account, and it will automatically take a snapshot of your disk at regular intervals. If your data is ever lost, you can use the most recent snapshot to recover the disk. For more information, see our full guide on the [Linode Backup Service](/docs/platform/linode-backup-service/).

## Manual Backups

If your Linode contains a few important items (a directory with pictures or personal documents, for example), then backing up the entire disk may be overkill. You have probably made manual backups of this type of file on your personal computer, by dragging them onto a flash drive or other external device. A similar procedure can be used to save copies of your files on your Linode to your home computer, another Linode, or a [Block Storage Volume](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/). The simplest tool to use for this purpose is `scp`, which stands for "secure copy."

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


If you are more comfortable working on the command line, this kind of backup can be automated with a [cron job](/docs/tools-reference/tools/schedule-tasks-with-cron/) so that it can run automatically at a set interval.

## Database Backups

Many applications, including common CMS platforms like WordPress, store their data in a **database**. It is crucial to make sure that this data can be restored in the event of a system compromise. Fortunately, most database systems include tools to make backing up simple and painless.

If you are using MySQL or MariaDB, read more about  `mysqldump` in our [mysqldump](/docs/databases/mysql/use-mysqldump-to-back-up-mysql-or-mariadb/) guide, try making [physical backups](/docs/databases/mysql/create-physical-backups-of-your-mariadb-or-mysql-databases/).

If your application uses PostgreSQL, read our guide on [How to Back Up Your PostgreSQL Database](/docs/databases/postgresql/how-to-back-up-your-postgresql-database/).

## Third-Party Tools

Free command line tools such as [backupninja](https://0xacab.org/riseuplabs/backupninja) and Gnome desktop tools like [sbackup](https://sourceforge.net/projects/sbackup/) can also be used to create customized, automated backup routines.
