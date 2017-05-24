---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides an introduction to rsync, the incremental file transfer utility.'
keywords: 'rsync,unix,liunx,samba,utilities,backup'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['linux-tools/utilities/rsync/']
modified: Friday, August 31st, 2012
modified_by:
  name: Linode
published: 'Tuesday, September 8th, 2009'
title: Introduction to Rsync
external_resources:
 - '[Rsync tips at Calomel.org](https://calomel.org/rsync_tips.html)'
 - '[Rsync Guide at Comentum.com](http://www.comentum.com/rsync.html)'
---

[Rsync](http://www.samba.org/rsync/) is a tool created as part of the [Samba](http://www.samba.org/) project that provides quick and incremental file transfer. It serves as a replacement for the `scp` and `rcp` tools. Rsync is a great way to upload files to a remote server, particularly when you need the remote machine to maintain a current mirror of the local files using minimal transfer, because rsync is very efficient in what it transfers over the network.

There are many great tools and workflows that can be implemented using rsync. This includes deploying updated content from a development machine to production hosts, backing up files to a remote file server, and keeping two production servers synchronized. You can even use rsync to [migrate servers to Linode](/docs/migrate-to-linode/disk-images/migrating-a-server-to-your-linode) from other providers.

This document provides an introductory overview of rsync along with example applications of rsync. We assume you've already reviewed our [getting started guide](/docs/getting-started/), and that you're logged into your Linode as root via SSH.

## Installing Rsync

Most contemporary Linux distributions provide packages for installing rsync from software repositories. On Debian/Ubuntu systems use `apt-get install rsync`. On CentOS and Fedroa systems, use `yum install rsync`.

Typically, rsync uses SSH as a transport layer to encrypt traffic over the network. While it is possible to use anonymous rsync to synchronize files from a remote machine without SSH, in conventional usage rsync traffic is sent over an SSH connection. We recommend setting up SSH keys to facilitate transfers between machines.

To configure SSH keys, issue the following command on the local system:

    ssh-keygen

Answer the program's inquiries; generally the defaults are acceptable. This will generate an SSH key using the RSA algorithm. If you want to use the DSA algorithm, append `-t dsa` to the command.

Your SSH key will be generated with the private key in `~/.ssh/id_rsa` and the public key in `~/.ssh/id_rsa.pub`. You will want to copy the **public key** into the `~/.ssh/authorized_keys` file on the **remote machine**, using the following commands (replacing your own SSH user and host names).

    scp ~/.ssh/id_rsa.pub user@hostname.com:/home/user/.ssh/uploaded_key.pub
    ssh user@hostname.com "echo `cat ~/.ssh/uploaded_key.pub` >> ~/.ssh/authorized_keys"

You can use this process to create SSH keys for your servers to make it possible to rsync files between two remote machines over a secure connections, without the need to enter passwords for machines.

## The Rsync Command

Once installed, the rsync command is fairly uncomplicated for basic usage. There are four major options to the `rsync` command that cover most basic usage. They are as follows:

-   The `-r` option tells rsync to recurse into directories and copy the total contents of the directory and all sub-directories.
-   Use the `-v` flag to increase verbosity. This will make rsync print out which files are being copied while it is running.
-   The `-a` argument triggers the archive option, which combines a number of additional options. This performs a recursive copy, preserving symlinks, permissions and modification times, user and group ownership, as well as devices and special files.
-   The `-z` option compresses data during the transfer. This will speed up remote transfers where bandwidth is an issue, but will increase computational overhead on local transfers.

There are many other options that allow you to constrain the behavior of the rsync command, including advanced features like bandwidth rate limiting. You can view a full list of these options by issuing the command `rsync --help`.

Once options are specified, provide the source followed by the destination for transfer. You can use rsync to synchronize two directories locally to perform efficient local backups. Locations may also be specified using the following SSH/SCP syntax:

    username@example.com:/home/username/dir/

In this example, `username` represents the username, `example.com` represents the location of the remote source, and finally `/home/username/dir/` is the path to the source files.

By default rsync uses SSH; if you're using the `rsync` daemon rather than SSH, by prefixing the location with `rsync://`.

You can also specify local paths for rsync commands using the format you're likely already familiar with, using either absolute paths (e.g. `/home/username/photos/bells.png`) or relative paths with the `-R` option (e.g. `../../photos/bells.png`).

For remote rsync operations, either the source **or** the destination can be remote, depending on their order. See the following example use cases to get a more clear idea of how you might use rsync.

## Example Rsync Commands

To more fully understand the capabilities of rsync consider the following applied examples.

### Use Rsync to Deploy Content to the Network

If you develop your content or applications locally before publishing it to the network, you may benefit from using rsync as a deployment tool. Because rsync is efficient and incremental, once you've done the initial deployment, minor changes can be pushed out very quickly. Here is an example of what this might look like:

    rsync -zr /home/username/wiki/ username@web.example.com:/home/username/public/wiki

The `-z` and `-r` options were enabled to recursively copy files from the `wiki/` directory and compress the files during transfer. Local files were copied from the `/home/username/wiki` directory to the `/home/username/public/wiki` directory on the `web.example.com` machine. You might combine this command with other commands, including `sed`, to further automate deployment processes.

### Use Rsync to Back Up Production Environments

Rsync is a great tool for maintaining a backup copy of a production environment. As rsync works on both binary and text files, and because its operations are incremental and efficient, we can use rsync commands to keep a set of files synchronized between more than one machine or image. As a result, backup systems will always have the latest content. This means they can take the place of the primary systems on short notice.

Note: rsync commands copy files to or from local filesystems to local or remote filesystems. To copy files between two remote servers you would have to execute rsync commands on one of the remote machines over SSH.

    ssh username@web.example.com rsync -a /home/username/public/wiki \ 
        fore@web-backup.example.com:/home/fore/public/wiki

This command, issued on the local machine, copies the `/home/username/public/wiki` directory (with the `-a` option enabled for archive mode) on the `web.example.com` server to the `/home/fore/public/wiki` folder on the `web-backup.example.com` server.

You could also back up a production environment to the local filesystem with the following command:

    rsync -rz username@web.example.com:/home/username/public/wiki \ 
        /home/robin/web-backups/duck-wiki

This command creates a backup of `/home/username/public/wiki` on the `web.example.com` server in the local directory `/home/robin/web-backups/duck-wiki`.

The locations in this command can be swapped in order to back up a set of local files to a remote machine for efficient off-site backups. Use the `-a` option if you want to preserve file permissions and ownership after the sync operation.

You can also combine rsync commands with `cron` "jobs" to run a backup regularly to ensure that your backups remain up to date. Because rsync is incremental, once the initial operation has completed, successive backup operations complete very quickly. Only the differences between the source and the destination files are copied. This property of rsync makes it an ideal solution for automated operation.