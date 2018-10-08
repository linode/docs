---
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
title: How to Download Files and Data from your Linodes - Shortguide
headless: true
---

## Download Specific Files or Directories over SSH

If you just need specific files from your Linode, you can download those over SSH. Downloading files over SSH can be done at a command-line interface, or with a graphical *SFTP* file browser.

### Using SCP

To retrieve a specific directory or file via the command-line, you can use the secure copy (SCP) command from your computer. SCP is installed by default on most Mac and Linux systems, and you can install a tool like [Cygwin](#windows-cygwin-instructions) to use it on Windows.

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

As an alternative to the command-line, you can download and install an *SFTP* client. These applications provide a graphical user interface for your Linode's filesystem.

*FileZilla* is a popular free example. Windows and Mac users can download FileZilla [here](https://filezilla-project.org/download.php?show_all=1). To install FileZilla on Linux:

-   Debian/Ubuntu:

        sudo apt-get install filezilla

-   CentOS/Fedora:

        sudo yum install filezilla

After you've installed FileZilla on your computer:

{{< content "filezilla-shortguide" >}}

For more information on FileZilla, [review our full guide](/docs/tools-reference/file-transfer/filezilla/) on using the application.

### Downloading Data from a Database

Special care is needed when downloading data from a database. Before it can be downloaded, the data in a database needs to first be *dumped* to a file. This file can then be transferred just as any other normal file type.

To create a dump of a MySQL (or MariaDB) database, [use the `mysqldump` command](/docs/databases/mysql/use-mysqldump-to-back-up-mysql-or-mariadb) as in the following instructions.

{{< note >}}
An alternative to using `mysqldump` is to create [*physical* backups](/docs/databases/mysql/create-physical-backups-of-your-mariadb-or-mysql-databases/). If you use PostgreSQL, follow the [How to Back Up Your PostgreSQL Database](/docs/databases/postgresql/how-to-back-up-your-postgresql-database/) guide instead.
{{< /note >}}

{{< content "mysqldump-database-backup-short" >}}

{{< content "copy-disk-over-ssh-short" >}}