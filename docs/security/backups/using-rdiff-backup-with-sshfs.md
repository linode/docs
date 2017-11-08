---
author:
  name: Linode
  email: docs@linode.com
description: 'Automating offsite backups with the open source Rdiff-backup package and SSHFS for remote filesystem mounting.'
keywords: ["rdiff-backup", "sshfs", "network backup", "linux backup"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/rdiff-backup/']
modified: 2012-04-13
modified_by:
  name: James Sinclair
published: 2009-09-14
title: 'Using Rdiff-backup with SSHFS'
external_resources:
 - '[Rdiff-backup Documentation](http://rdiff-backup.nongnu.org/docs.html)'
 - '[SSHFS Home Page](http://fuse.sourceforge.net/sshfs.html)'
 - '[Linux Security Basics](/docs/security/basics)'
---

`Rdiff-backup` is an open source backup system that performs incremental, differential backups on a wide variety of platforms. Many people use `rdiff-backup` on both sides of a backup operation, but this can be problematic when different operating systems or `rdiff-backup` versions are in use. This guide will show you how to use `rdiff-backup` in combination with `sshfs` to securely mount a remote filesystem on your Linux backup server, eliminating the need to run `rdiff-backup` on the server being backed up.

Please note that this method of performing remote backups depends heavily upon the security of your backup server, as your backup user will have SSH access to the remote host. The remote host's filesystem will be mounted read-only on the backup server as a basic safeguard, but this does not offer strong protection if a malicious individual were to compromise the backup user's account (or the root account on the backup server).

We assume the remote host to be backed up has an SSH daemon installed, and that you can log into it from the backup server. If you haven't already done so, please review the steps outlined in our [getting started guide](/docs/getting-started/) before following these instructions. All configuration will be performed through the terminal; please make sure you're logged into your backup server as root via SSH.

## Install Required Packages

On your backup server, you'll need to install `rdiff-backup` and `sshfs`. For Debian and Ubuntu systems, issue the following command:

    apt-get update
    apt-get upgrade
    apt-get install rdiff-backup sshfs

For CentOS or Fedora systems, use this command:

    yum install rdiff-backup sshfs

The requested packages will be installed, along with several dependencies.

## Configure the Backup User on the Remote Host

On the remote host (the server being backed up), log in as the username that will used for backups from the backup server. If this user does not already have a `.ssh` directory, create one along with an SSH keypair by issuing the following command:

    ssh-keygen -t rsa

## Add and Configure a Backup User

Issue the following commands to add a user for `rdiff-backup` and make the user a member of the `fuse` group on the backup server. Backups will be stored under this user's home directory.

    adduser rdiffbackup
    usermod -a -G fuse rdiffbackup

Issue the following commands to create an SSH key for the new user and copy it to the remote server's `authorized_keys` file. This will allow the `rdiffbackup` user on your backup server to mount a filesystem on the remote host without the need to enter a password. In these commands, `user@hostname` means a user account on the server that is to be backed up (`joey@server1.flyingturtles.com`, for example).

    su - rdiffbackup
    ssh-keygen -t rsa
    scp ~/.ssh/id_rsa.pub user@hostname.com:/home/user/.ssh/uploaded_key.pub
    ssh user@hostname.com "echo \`cat ~/.ssh/uploaded_key.pub\` >> ~/.ssh/authorized_keys"

You can test this by issuing the following command to log into the remote host from your backup server:

    ssh user@hostname.com

You should not be prompted for a password. If you are, please review the previous steps, as something is amiss. Once you're able to log in without a password, issue the `exit` command to return to the root shell on your backup server.

## Create Mount Point and Backup Directories

Issue the following commands to create directories in the `rdiffbackup` user's home directory for mounting the remote filesystem and storing backups. Change "remotehost" and "remotepath" to values that make sense for your needs.

    mkdir -p /home/rdiffbackup/mnt/remotehost/remotepath
    mkdir -p /home/rdiffbackup/backup/remotehost/remotepath
    chown -R rdiffbackup:rdiffbackup /home/rdiffbackup

An an example, if you wanted to back up the "/home" directory on a remote host named "squiggles.drawing.org", you might issue these commands:

    mkdir -p /home/rdiffbackup/mnt/squiggles.drawing.org/home
    mkdir -p /home/rdiffbackup/backup/squiggles.drawing.org/home
    chown -R rdiffbackup:rdiffbackup /home/rdiffbackup

## Configure an SSHFS Filesystem Mount

Add a line to your `/etc/fstab` file that resembles the following example. Change the value for `user@remotehost` to match your remote host's configuration. Change the values for `remotehost` and `remotepath` to the ones you used in the last step for your mount point directory.

{{< file "/etc/fstab" >}}
<sshfs#user@remotehost>:/remotepath /home/rdiffbackup/mnt/remotehost/remotepath fuse user,noauto,ro 0 0

{{< /file >}}


This will allow the `rdiffbackup` user to mount and read the remote filesystem. It will be mounted read-only as a basic safeguard. Run a test backup by issuing the following commands, changing values where appropriate to match the earlier steps:

    su - rdiffbackup
    mount /home/rdiffbackup/mnt/remotehost/remotepath
    rdiff-backup -v5 /home/rdiffbackup/mnt/remotehost/remotepath /home/rdiffbackup/backup/remotehost/remotepath

Examine the contents of your backup directory after the initial backup completes to make sure everything was copied over correctly.

## Automate Daily Backups

Create a shell script named `/home/rdiffbackup/backup.sh` with the following contents. Adjust the values for directories to match those used in the previous step.

{{< file "/home/rdiffbackup/backup.sh" >}}
#!/bin/sh
mount /home/rdiffbackup/mnt/remotehost/remotepath
rdiff-backup /home/rdiffbackup/mnt/remotehost/remotepath /home/rdiffbackup/backup/remotehost/remotepath
umount /home/rdiffbackup/mnt/remotehost/remotepath

{{< /file >}}


This script will mount the remote filesystem, back it up, and unmount it upon completion. Make the script executable by issuing the following command:

    chmod +x /home/rdiffbackup/backup.sh

Add the following entry to the `rdiffbackup` user's crontab (edit it with `crontab -e`) to perform daily backups at 2:00 AM.

    00 02 * * * /home/rdiffbackup/backup.sh

You may wish to consult the `cron` manual page for guidance on how to specify different times.

## Restoring a Backup

To restore a backup, issue a command on the backup server similar to the following. Note that whatever location you specify for "/restoredir" will be overwritten on the backup server; backups are not automatically restored on the remote host. Take care not to specify a directory that contains anything you wish to keep.

    rdiff-backup -r now /home/rdiffbackup/backup/remotehost/remotepath /restoredir

This will restore the most recent version of your backup directory to the directory "/restoredir" on your backup server. As `rdiff-backup` supports restoring filesystems as they existing at specific points in time, you could issue this command to restore the remote host's backed up files as they were ten days ago:

    rdiff-backup -r 10D /home/rdiffbackup/backup/remotehost/remotepath /restoredir

Please consult the resources given below for more `rdiff-backup` usage examples. Congratulations, you've configured your backup server to perform automatic backups using `rdiff-backup` and `sshfs`!
