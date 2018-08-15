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

The [Linode Backups](/docs/platform/disk-images/linode-backup-service/) service can create automatic and manual snapshots of your Linode. A completed backup can be directly restored to the same Linode it was created for or to a new Linode in the same data center. These workflows make it easy to revert to a working configuration if you run into any unexpected issues with your software.

Linode's backups are stored in a way that is only directly readable by the Linode Backups service. A common question for the service is how you can download the content from your Linode Backups to another storage location, like your home computer. This can be accomplished in two phases:

1. Restore a backup to a new Linode in the same data center.
2. Then, download either specific files or the entire disk image from that Linode, as needed.

## Before You Begin

### Account Permissions and Billing

Several of the steps in this guide involve adding services to or removing services from a Linode account. Visit our guide on [Users and Permissions](/docs/platform/manager/accounts-and-passwords/#users-and-permissions) for more information about restricted Linode users.

Note that the cost of adding Backups service and adding a Linode to your account is billed, pro-rated per hour. If the backups service is only enabled for a few hours, you will only be charged for a few hours of the service. See the [Backups pricing details](/docs/platform/disk-images/linode-backup-service/#pricing) for more information. Likewise, when you create a Linode, you will be billed per hour that the Linode exists, whether it is powered on or not.

The steps in this guide have been designed to minimize the potential costs associated with this process. Additionally, keep the following in mind:

- Removing a Linode from your account also cancels the associated Backup service for that Linode.
- A Linode's backups are deleted when a Linode is deleted.
- If you choose to leave the Backups service enabled, or if you do not remove the additional Linode from your account, you will be automatically billed. If you only power the Linode off, [you will still be billed for it](/docs/platform/billing-and-support/billing-and-payments/#if-my-linode-is-powered-off-will-i-be-billed).

### Enable Backups and Take a Snapshot

These steps are the minimum required for the scope of this guide. Visit our [Backups guide](/docs/platform/disk-images/linode-backup-service/) for information about how to implement regular backups of your Linode.

1.  Go to your Linode's dashboard, click **Backups**, click **Enable backups for this Linode »** and confirm the additional cost per month.

1.  This guide focuses on saving a snapshot or specific backup. Click **Take a New Snapshot Now**.

    The snapshot appears in the *Backup History* at the bottom of the page.

{{< content "restore-backup-image-short" >}}

## Download Specific Files or Directories over SSH

If you just need specific files from your Linode, you can download those over SSH. In order to do so, you'll first need to [reboot your Linode](http://localhost:1313/docs/platform/disk-images/disk-images-and-configuration-profiles/#selecting-and-using-a-configuration-profile) under the new configuration profile that was created by the restore process. This new profile is assigned to the restored disks, and your backed up data will be accessible when you boot from them.

Downloading files over SSH can be done at a command-line interface, or with a graphical *SFTP* file browser.

### Using SCP

To retrieve a specific directory or file via the command-line, you can use the secure copy (SCP) command from your computer. SCP is installed by default on most Mac and Linux systems, and you can install a tool like [Cygwin](/docs/platform/disk-images/copying-a-disk-image-over-ssh/#windows-cygwin-instructions) to use it on Windows.

-   The syntax for using SCP to copy a file from your Linode into a directory on your computer is:

        scp your_linode_username@your_linode_ip:/path/to/your/file.txt /path/to/your/local/directory/

    The file will be saved inside `/path/to/your/local/directory/` on your computer.

-   To copy a file from your Linode to your computer and give it a specific name (in this case, `file.txt.backup`):

        scp your_linode_username@your_linode_ip:/path/to/your/file.txt /path/to/your/local/directory/file.txt.backup

-   To copy a directory from your Linode to your computer:

        scp -r your_linode_username@your_linode_ip:/path/to/your/directory /path/to/your/local/directory

    If `/path/to/your/local/directory` already exists on your computer, then the copied directory will be placed inside `/path/to/your/local/directory` (i.e. `/path/to/your/local/directory/directory`).

    If `/path/to/your/local/directory` does not already exist, then the copied directory will be created with that name.

For example:

* Download an NGINX configuration file to your home folder:

        scp your_linode_username@your_linode_ip:/etc/nginx/conf.d/example.com.conf ~/example.com.conf.backup

* Download an Apache configuration file to your home folder:

        scp your_linode_username@your_linode_ip:/etc/apache2/sites-available/example.com.conf ~/example.com.conf.backup

* Copy the entire document root from a web server:

        scp -r your_linode_username@your_linode_ip:/var/www/html/ ~/html_backup

If you intend to repeat this process regularly, consider [using rsync](/docs/security/backups/backing-up-your-data/#understand-the-rsync-command) to create additional local copies of your data. rsync is capable of performing incremental file copies, which means you do not have to fully transfer each file every time you download your data.

### Using FileZilla

As an alternative to the command-line, you can download and install an *SFTP* client. These applications provide a graphical interface for your Linode's filesystem. 

*FileZilla* is a popular free example. Windows and OS X users can download FileZilla [here](https://filezilla-project.org/download.php?show_all=1). To install FileZilla on Linux:

-   Debian/Ubuntu:

        sudo apt-get install filezilla

-   CentOS/Fedora

        sudo yum install filezilla

After you've installed FileZilla on your computer:

{{< content "filezilla-shortguide" >}}

For more information on FileZilla, [review our full guide](/docs/tools-reference/file-transfer/filezilla/) on using the application.

### Using mysqldump to Back Up a Database

Special care is needed when downloading data from a database. Before it can be downloaded, the data in a database needs to first be *dumped* to a file. This file can then be transferred just as any other normal file type.

{{< content "mysqldump-database-backup-short" >}}

For more information on MySQL database backups, including how to restore the data in a dump file to a MySQL installation, review [our guide](http://localhost:1313/docs/databases/mysql/use-mysqldump-to-back-up-mysql-or-mariadb/#restore-a-backup) on the subject. An alternative to using `mysqldump` is to create [*physical* backups](/docs/databases/mysql/create-physical-backups-of-your-mariadb-or-mysql-databases/). It's also possible to [backup PostgreSQL databases](/docs/databases/postgresql/how-to-back-up-your-postgresql-database/).

{{< content "copy-disk-over-ssh-short" >}}


## Clean Up after Your Download

After you've finished downloading your files or disks, you can optionally [delete the restored disks](/docs/platform/disk-images/disk-images-and-configuration-profiles/#removing-a-disk). If you created a new Linode to perform the restore, consider [deleting the Linode](/docs/platform/billing-and-support/billing-and-payments/#removing-services). As a reminder, billing for that Linode will continue automatically if you do not remove it. If you only power the Linode off, [you will still be billed for it](/docs/platform/billing-and-support/billing-and-payments/#if-my-linode-is-powered-off-will-i-be-billed).