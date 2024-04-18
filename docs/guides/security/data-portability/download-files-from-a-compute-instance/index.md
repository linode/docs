---
slug: download-files-from-a-compute-instance
description: "Learn how to download files, database dumps, or whole disks from your Linodes."
keywords: ["download", "files", "disk", "ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2023-07-07
published: 2018-09-25
title: Download Files from Your Compute Instance
tags: ["security"]
aliases: ['/security/data-portability/download-files-from-your-linode/','/guides/download-files-from-your-linode/']
authors: ["Linode"]
contributors: ["Linode"]
---

Periodically, you may wish to download files from a Compute Instance to retain as a local backup or work on them locally. This guide covers the techniques and tools you can use to download your remote files to your local machine.

## Optionally Create an Archive File {#create-an-archive-file}

If you intend to download lots of files, consider compressing them into a single archive file before continuing with this guide. This results in a faster and smoother download when compared with large numbers of individual files. Once the archive file has been downloaded, you can extract it and view the individual files on your local system.

To create an archive and compress it, [log in to your Compute Instance](/docs/products/compute/compute-instances/get-started/#connect-to-the-instance) and run the following command. Replace *[archive-name]* with the file name to use for the new file and *[file-or-directory]* with the path of the directory or the path and name of the file you'd like to archive. This command creates a tar file (also called a tarball) and compresses it with gzip. Most modern operating systems can extract tar files.

```command
tar -czvf [archive-name].tar.gz [fle-or-directory]
```

For example, to archive all of website data stored in `/var/www/example.com` to a file called `example-com-backup` in my home directory, the following command would be used:

```command
tar -czvf ~/example-com-backup.tar.gz /var/www/example.com/
```

To learn more about creating tar files, see [Archive, Compress, and Extract Files in Linux Using the Command Line](/docs/guides/compress-files-using-the-command-line/).

## Download Files with an FTP Client

SFTP (Secure File Transfer Protocol) is a common method of transferring files from a remote system to a local machine. It is often referred to as FTP, though SFTP is built using an entirely new protocol. For this guide, FTP and SFTP are used interchangeably unless otherwise noted.

FTP clients are a user-friendly way to access, download, and upload files from your Compute Instance. Many desktop FTP clients are available, including:

- [FileZilla](https://filezilla-project.org/): A free and open-source FTP client for Windows, macOS, and Linux.
- [WinSCP](https://winscp.net/eng/docs/introduction): A free and open-source FTP client for Windows.
- [Transmit](https://panic.com/transmit/): A paid FTP client for macOS.
- [ForkLift](https://binarynights.com/): A file manager and FTP client for macOS.

Whichever client you choose, you can connect to your Compute Instance using the same credentials you would use for SSH. Once connected, you should be presented with a visual file explorer of your remote system. From here, you can navigate to the directory where your files are located and then download those files.

For further instructions, see our [Transfer Files with FileZilla](/docs/guides/filezilla/) guide.

## Download Files with SCP

You can use SCP (Secure Copy Protocol) to retrieve a specific directory or file via the command-line. SCP is installed by default on most macOS and Linux systems and is available with [Cygwin or PuTTY](/docs/guides/connect-to-server-over-ssh-on-windows/) for Windows.

-   The syntax for using SCP to copy a file from your Linode into a directory on another computer is:

    ```command
    scp [user]@[ip-address]:[file] /path/to/your/local/directory/
    ```

    The file will be saved inside `/path/to/your/local/directory/`.

-   To copy a file from your Linode to another computer and give it a specific name (in this case, `file.txt.backup`):

    ```command
    scp your_linode_username@your_linode_ip:/path/to/your/file.txt /path/to/your/local/directory/file.txt.backup
    ```

-   To copy an entire directory:

    ```command
    scp -r your_linode_username@your_linode_ip:/path/to/your/directory /path/to/your/local/directory
    ```

    If `/path/to/your/local/directory` already exists on your computer, then the copied directory will be placed inside `/path/to/your/local/directory` (i.e. `/path/to/your/local/directory/directory`).

    If `/path/to/your/local/directory` does not already exist, then the copied directory will be created with that name.

For example:

-   Download an NGINX configuration file to your user's `/home` folder:

    ```command
    scp your_linode_username@your_linode_ip:/etc/nginx/conf.d/example.com.conf ~/example.com.conf.backup
    ```

-   Download an Apache configuration file to your `/home` folder:

    ```command
    scp your_linode_username@your_linode_ip:/etc/apache2/sites-available/example.com.conf ~/example.com.conf.backup
    ```

-   Copy the entire document root from a web server:

    ```command
    scp -r your_linode_username@your_linode_ip:/var/www/html/ ~/html_backup
    ```

If you intend to repeat this process regularly, consider [using rsync](/docs/guides/backing-up-your-data/#understand-the-rsync-command) to create additional local copies of your data. rsync is capable of performing incremental file copies, which means you do not have to fully transfer each file every time you download your data.

## Download a Database

Special care is needed when downloading data from a database. Before it can be downloaded, the data in a database needs to first be *dumped* to a file. This database dump file can then be transferred just as any other normal file type.

-   To create a dump of a MySQL (or MariaDB) database, [use the `mysqldump` command](/docs/guides/mysqldump-backups/). **You can only use this tool if your database process is accessible and running.**

-   If your MySQL database won't run for some reason, follow the instructions for creating [*physical* backups](/docs/guides/create-physical-backups-of-your-mariadb-or-mysql-databases/).

-   If you use PostgreSQL, follow the [How to Back Up Your PostgreSQL Database](/docs/guides/back-up-a-postgresql-database/) guide.

## Download a Disk

Downloading your disk will copy a `.img` file to your computer that encapsulates all of the data that is on your Linode’s disk. This *disk image* can later be re-uploaded to the Linode service at a later date, which can be useful if you'd like to temporarily remove your Linode and stop service. Follow our [Copy a Disk over SSH](/docs/products/compute/compute-instances/guides/copy-a-disk-image-over-ssh/) guide for further instructions.

## Download Data from a Block Storage Volume

1. [Attach and mount](/docs/products/storage/block-storage/guides/attach-and-detach/) the block storage volume.

2. Download files from it by following the same instructions in the [Download Specific Files or Directories over SSH](#download-specific-files-or-directories-over-ssh) section of this guide.