---
author:
  name: Edward Angert
  email: docs@linode.com
description: "Learn how to download a local copy of your Linode backups."
keywords: ["backup", "backups", "rsync", "restore", "local"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-08
modified_by:
  name: Linode
published: 2018-08-08
title: Download a Local Copy of your Linode Backup
---

The [Linode Backups](/backups/) service can be set to create automatic and manual snapshots of your Linode. Backups can be restored as needed to overwrite an existing Linode's data or to another Linode, making it easy to get back to a working configuration after an issue or to create a duplicate of a file system.

Linode's backups are stored in a format that is only readable by the Linode Backups and Restore service. To help accommodate this, this guide shows how to restore a backup to a new Linode in the same data center, then create and download a disk image to a local disk.

Several of the steps in this guide involve adding services to or removing services from a Linode account. Visit our guide on [Users and Permissions](/docs/platform/manager/accounts-and-passwords/#users-and-permissions) for more information about restricted Linode users.

Note that the cost of adding Backups service and adding a Linode to your account is billed, pro-rated per hour. If the backups service is only enabled for a few hours, you will only be charged for a few hours of the service. See the [Backups pricing details](/docs/platform/disk-images/linode-backup-service/#pricing) for more information. Likewise, when you create a Linode, you will be billed per hour that the Linode exists, whether it is powered on or not.

The steps in this guide have been designed to minimize the potential costs associated with this process. Additionally, keep the following in mind:

- Removing a Linode from your account also cancels the associated Backup service for that Linode.
- A Linode's backups are deleted when a Linode is deleted.
- If you choose to leave the Backups service enabled, or if you do not remove the additional Linode from your account, you will be automatically billed.

## Enable Backups and Take a Snapshot

These steps are the minimum required for the scope of this guide. Visit our [Backups guide](/docs/platform/disk-images/linode-backup-service/) for information about how to implement regular backups of your Linode.

1.  Go to your Linode's dashboard, click **Backups**, click **Enable backups for this Linode »** and confirm the additional cost per month.

1.  This guide focuses on saving a snapshot or specific backup. Click **Take a New Snapshot Now**.

    The snapshot appears in the *Backup History* at the bottom of the page.

{{< content "restore-backup-image-short" >}}

{{< content "copy-disk-over-ssh-short" >}}

## Use SCP to Download a Specific Directory

To retrieve a specific directory or file from the backup, use the secure copy command from the Linode running the backup.

For example:

* Download the NGINX configuration file:

        scp /etc/nginx/conf.d/example.com.conf localuser@localhost:~/example.comBCKP

* Download the Apache configuration file:

        scp /etc/apache2/sites-available/example.com.conf localuser@localhost:~/example.comBCKP

* Include the recursive `-r` option to copy the entire `example.com` directory from the Linode to a local machine:

        scp -r linodeuser@backupLinode:/var/www/html/example.com ~/example.comBCKP

For future local backups, consider [using rsync](/docs/security/backups/backing-up-your-data/#understand-the-rsync-command) to create additional local copies of your data.

## Use mysqldump to Back up a Database

{{< content "mysqldump-database-backup-short" >}}

### Restore a MySQL Database from a mysqldump

{{< content "mysqldump-database-restore-short" >}}
