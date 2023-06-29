---
slug: using-rdiff-backup-with-sshfs
deprecated: true
description: 'Automating offsite backups with the open source rdiff-backup package and SSHFS for remote filesystem mounting.'
keywords: ["rdiff-backup", "sshfs", "network backup", "linux backup"]
tags: ["security","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linux-tools/rdiff-backup/','/security/backups/using-rdiff-backup-with-sshfs/']
modified: 2017-11-29
modified_by:
  name: Linode
published: 2009-09-14
title: Using rdiff-backup with SSHFS
authors: ["Linode"]
---

[Rdiff-backup](http://www.nongnu.org/rdiff-backup/docs.html) is an open source backup system that performs incremental, differential backups on a wide variety of platforms. Many people use rdiff-backup on both sides of a backup operation, but this can be problematic when different operating systems or rdiff-backup versions are in use.

This guide will show you how to use rdiff-backup with [SSHFS](https://github.com/libfuse/sshfs) to pull data to the backup storage server, rather than pushing from the device you wish to back up. This eliminates the need to run rdiff-backup on the server being backed up. It is assumed you have a local machine such as a laptop or home workstation with data you want to back up to a remote server, which will be your Linode.

{{< note respectIndent=false >}}
Throughout this guide, *backup server* will be used to indicate the machine (probably your Linode) which will be running rdiff-backup. This is also where all copies of other machines' backup data will be stored.

The machines with data being backed up *to* the backup server, will be referred to as a *remote device*. Each remote device also must have its own static IP address.
{{< /note >}}


## Configure the Backup Server

1.  SSH in to your backup server.

2.  Install rdiff-backup and SSHFS. How you do this depends on the Linux distribution running on your backup server, but distributions based on Debian and RedHat use the package names `rdiff-backup` and `sshfs`.

3.  SSH in to your backup server.

4.  Add a user to run rdiff-backup and add that user to the system's `fuse` user group. The username `rdbadmin` is used as an example, and backups will be stored in this user's home directory.

        adduser rdbadmin
        usermod -aG fuse rdbadmin

4.  Create a directory structure for mounting the remote filesystem and storing backups. You can organize this however you like, but the example will sort backup directories by the hostname of the device its backups corresponds to.

        mkdir /home/rdbadmin/mounts/device_hostname
        mkdir /home/rdbadmin/backups/device_hostname
        chown -R rdbadmin:rdbadmin /home/device_hostname


## Configure SSH Access

Your backup server will be pulling data from remote devices by SSHFS, so SSH must be configured on the remote device or devices to allow access for the rdbadmin user from the backup server.

1.  You should still be logged in to the backup server by SSH. Create an SSH keypair for the rdbadmin user. This will create the files `~/.ssh/rdbadmin.pub` and `~/.ssh/rdbadmin`:

        ssh-keygen -b 4096 -f rdbadmin

2.  Transfer the public key to the remote device to be backed up. Replace the IP address in the example below with that of your device:

        ssh-copy-id rdbadmin@203.0.113.10

3.  Add the output of the cat command to the `authorized_keys` file on the remote device:

        ssh user@remote_IP "echo \`cat ~/.ssh/rdbadmin.pub\` >> ~/.ssh/authorized_keys"


## Configure an SSHFS Filesystem Mount

1.  Add the remote device's mount point to the backup server's *fstab* file. This will allow the rdbadmin user to mount and read the remote filesystem. It will be mounted read-only as a basic safeguard.

    You'll need to specify the remote device's login information so change the value for *user@remotehost* appropriately. Change *remote_path* to the top-level directory on the remote device you want to create a back up of.

    {{< file "/etc/fstab" >}}
<sshfs#user@remotehost>:/remote_path /home/rdbadmin/device_hostname fuse user,noauto,ro 0 0
{{< /file >}}

2.  Run a test backup, changing the values where appropriate to match the earlier steps. First witch to the rdbadmin user if you have not already, and mount the remote device's directory to back up. If you don't have any data there yet, create three empty files just so something can move between the servers. Then run the backup.

        su - rdbadmin
        mount /home/rdbadmin/mounts/device_hostname
        touch {file1,file2,file3}
        rdiff-backup -v5 /home/rdbadmin/mounts/device_hostname /home/rdbadmin/backups/device_hostname

3.  When the backup completes, examine the contents of `/home/rdbadmin/backups/device_hostname` on the backup server to make sure everything was copied over correctly.


## Automate Daily Backups

1.  Create a shell script to mount the remote directory, run rdiff-backup, and unmount the remote directory when finished. Adjust the values for directories to meet your own needs.

    {{< file "/home/rdbadmin/backup.sh" >}}
#!/bin/sh
mount /home/rdbadmin/mounts/device_hostname
rdiff-backup /home/rdbadmin/mounts/device_hostname /home/rdbadmin/backups/device_hostname
umount /home/rdbadmin/mounts/device_hostname

{{< /file >}}

2.  Make the script executable:

        chmod +x /home/rdbadmin/backup.sh

3.  Add the following entry to the `rdiffbackup` user's crontab (edit it with `crontab -e`) to perform daily backups at 2:00 AM.

        00 02 * * * /home/rdbadmin/backup.sh

    See `man cron` in a terminal for more information on creating cron jobs.


## Restoring a Backup

1.  To restore a backup, first mount the restore path:

        mount /home/rdbadmin/mounts/device_hostname

2.  Issue a command on the backup server similar to the following, adjusting for your directory paths and needs. This will restore the most recent version of your backup directory to the location the backup was created from above.

    **Beware that the restore directory will be entirely overwritten.** Take care not to specify a directory that contains anything you wish to keep.

        rdiff-backup -r now /home/rdbadmin/backups/device_hostname /home/rdbadmin/mounts/device_hostname

    Rdiff-backup also supports restoring filesystems as they exist at specific points in time. As another example, you could use the command below to restore the remote host's backed up files as they were ten days ago:

        rdiff-backup -r 10D /home/rdbadmin/backups/device_hostname /home/rdbadmin/mounts/device_hostname

3.  When the backup has been restored, unmount the restore path:

        umount /home/rdbadmin/mounts/device_hostname
