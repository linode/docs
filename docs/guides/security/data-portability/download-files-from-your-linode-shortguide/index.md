---
slug: download-files-from-your-linode-shortguide
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to download files, database dumps, or whole disks from your Linodes."
keywords: ["download", "files", "disk", "ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-09-25
modified_by:
  name: Linode
published: 2018-09-25
title: Download Files from your Linode - Shortguide
headless: true
tags: ["security"]
aliases: ['/security/data-portability/download-files-from-your-linode-shortguide/']
---

## Download Specific Files or Directories over SSH

If you just need specific files from your Linode, you can download those over SSH. Downloading files over SSH can be done at a command-line interface, or with a graphical *SFTP* file browser.

### Secure Copy Protocol (SCP)

You can use SCP to retrieve a specific directory or file via the command-line. SCP is installed by default on most macOS and Linux systems, and is available with [Cygwin or PuTTY](/docs/networking/ssh/using-ssh-on-windows) for Windows.

-   The syntax for using SCP to copy a file from your Linode into a directory on another computer is:

        scp your_linode_username@your_linode_ip:/path/to/your/file.txt /path/to/your/local/directory/

    The file will be saved inside `/path/to/your/local/directory/`.

-   To copy a file from your Linode to another computer and give it a specific name (in this case, `file.txt.backup`):

        scp your_linode_username@your_linode_ip:/path/to/your/file.txt /path/to/your/local/directory/file.txt.backup

-   To copy an entire directory:

        scp -r your_linode_username@your_linode_ip:/path/to/your/directory /path/to/your/local/directory

    If `/path/to/your/local/directory` already exists on your computer, then the copied directory will be placed inside `/path/to/your/local/directory` (i.e. `/path/to/your/local/directory/directory`).

    If `/path/to/your/local/directory` does not already exist, then the copied directory will be created with that name.

For example:

* Download an NGINX configuration file to your user's `/home` folder:

        scp your_linode_username@your_linode_ip:/etc/nginx/conf.d/example.com.conf ~/example.com.conf.backup

* Download an Apache configuration file to your `/home` folder:

        scp your_linode_username@your_linode_ip:/etc/apache2/sites-available/example.com.conf ~/example.com.conf.backup

* Copy the entire document root from a web server:

        scp -r your_linode_username@your_linode_ip:/var/www/html/ ~/html_backup

If you intend to repeat this process regularly, consider [using rsync](/docs/security/backups/backing-up-your-data/#understand-the-rsync-command) to create additional local copies of your data. rsync is capable of performing incremental file copies, which means you do not have to fully transfer each file every time you download your data.

### FileZilla

FileZilla is a popular free and open source FTP, FTPS, and SFTP client which has a GUI but can also take CLI arguments. In contrast to SCP, SFTP can list directory contents, create or delete files, and resume interrupted file transfers.

See our [FileZilla guide](/docs/guides/filezilla/) for more information.

### Downloading Data from a Database

Special care is needed when downloading data from a database. Before it can be downloaded, the data in a database needs to first be *dumped* to a file. This database dump file can then be transferred just as any other normal file type.

-   To create a dump of a MySQL (or MariaDB) database, [use the `mysqldump` command](/docs/databases/mysql/use-mysqldump-to-back-up-mysql-or-mariadb). **You can only use this tool if your database process is accessible and running.**

-   If your MySQL database won't run for some reason, follow the instructions for creating [*physical* backups](/docs/guides/create-physical-backups-of-your-mariadb-or-mysql-databases/).

-   If you use PostgreSQL, follow the [How to Back Up Your PostgreSQL Database](/docs/guides/how-to-back-up-your-postgresql-database/) guide.

## Download a Disk over SSH

Downloading your disk will copy a `.img` file to your computer that encapsulates all of the data that is on your Linode’s disk. This *disk image* can later be re-uploaded to the Linode service at a later date, which can be useful if you'd like to temporarily remove your Linode and stop service. Follow our [Copy a Disk over SSH](/docs/guides/copying-a-disk-image-over-ssh/) guide for further instructions.
