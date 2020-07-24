---
author:
  name: Andy Heathershaw
  email: docs@linode.com
description: 'This guide shows you how to use Restic to backup your MariaDB or MySQL databases onto Linode Object Storage.'
og_description: 'Learn how to backup your MariaDB and MySQL databases off your Linode and onto Linode Object Storage with Restic.'
keywords: ['mariadb','mysql','backup','backups','restic','off-site backups','Object Storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-08
modified_by:
  name: Linode
title: "Backup MariaDB databases to Linode Object Storage with Restic"
h1_title: "Backup MariaDB or MySQL databases to Linode Object Storage with Restic"
contributor:
  name: Andy Heathershaw
  link: https://andysh.uk
external_resources:
- '[mysqldump - MariaDB Knowledge Base](https://mariadb.com/kb/en/mysqldump/)'
- '[Preparing a new Restic repository](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html)'
- '[Backing up](https://restic.readthedocs.io/en/stable/040_backup.html)'
- '[Removing snapshots according to a policy](https://restic.readthedocs.io/en/stable/060_forget.html#removing-snapshots-according-to-a-policy)'
---

## Introduction

It is vital to have backups of your databases to allow you to restore in the event of a server fault, a user error or - worst-case - a hacking or defacing of your website or applications.

To be successful, backups should be automatic, reliable and secure. This guide explains how to configure [Restic](https://restic.net/) on your Linode to backup your MariaDB (or MySQL) databases
onto Linode Object Storage, so they can be recovered even if your Linode is no longer accessible.

Restic is a backup utility written in Go. It is cross-platform and works on most Linux distributions with a kernel newer than 2.6.23. Each backup is stored as a "snapshot" in a "repository." 
The repository can be stored on most cloud storage providers, or even in a separate directory on your Linode (not recommended.)

This guide will explain how to use Linode Object Storage to hold your backup repository.

{{< note >}}
MariaDB is a generally-compatible fork of MySQL. Where you see a reference to "MariaDB" in this guide, it should apply to MySQL also.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started/), the [Securing Your Server](/docs/security/securing-your-server/) guides, and the ["How to Install MariaDB on..." guides](/docs/databases/mariadb/) for your Linode's operating system.

1.  Create an Object Storage bucket to hold your backup repository. Follow the [Create a Bucket](/docs/platform/object-storage/how-to-use-object-storage/#create-a-bucket) section of the How to Use Linode Object Storage guide if you do not already have one.

    {{< content "object-storage-cancellation-shortguide" >}}
    
1.  [Generate Object Storage access keys](/docs/platform/object-storage/how-to-use-object-storage/#generate-a-key-pair).

1.  Ensure your Linode has the `wget` and `bzip2` commands available. Run `yum install wget bzip2` (on CentOS/Fedora) or `apt install wget bzip2` on Ubuntu/Debian.

## Install Restic

Download the latest version of Restic from [the Github Releases page](https://github.com/restic/restic/releases) (version 0.9.6 at the time of writing):

    wget https://github.com/restic/restic/releases/download/v0.9.6/restic_0.9.6_linux_amd64.bz2
    
{{< note >}}
Ensure you select the correct file for your system. The above command is correct for most Linuxes on Linode.
{{< /note >}}

Extract the downloaded file:

    bzip2 -d restic_0.9.6_linux_amd64.bz2
    
Move it to somewhere in your PATH and make it executable for all users:

    sudo mv restic_0.9.6_linux_amd64 /usr/local/bin/restic
    sudo chmod ugo+x /usr/local/bin/restic
    
You can now run Restic using the command "restic":

    restic version
    
{{< output >}}
restic 0.9.6 compiled with go1.13.4 on linux/amd64
{{< /output >}}

## Create the Restic Repository

[Create an Object Storage access key pair](/docs/platform/object-storage/how-to-use-object-storage/#generate-a-key-pair) if you have not done so already.

Run the below command, replacing "your-key" with your access key, "your-secret" with your key's secret and "your-bucket-name" with the name of your bucket:

    AWS_ACCESS_KEY_ID=your-key AWS_SECRET_ACCESS_KEY=your-secret restic -r s3:us-east-1.linodeobjects.com/your-bucket-name init

{{< note >}}
If your bucket is not in the Newark, NJ region, replace "us-east-1.linodeobjects.com" with the cluster name where your bucket is located.
Example: for Frankfurt, DE, the command would be:

    AWS_ACCESS_KEY_ID=your-key AWS_SECRET_ACCESS_KEY=your-secret restic -r s3:eu-central-1.linodeobjects.com/your-bucket-name init
{{< /note >}}

{{< note >}}
Ensure the name of your bucket is correct. If the bucket does not exist, Restic will create it for you on the cluster you are connecting to.
{{< /note >}}

You will be prompted to set a password to encrypt your repository's data. Enter your desired password twice, and you should see similar output to the below, confirming your repository has been created:
    
{{< output >}}
enter password for new repository:
enter password again:
created restic repository c3ffbd1ea6 at s3:us-east-1.linodeobjects.com/restic-backups-example

Please note that knowledge of your password is required to access
the repository. Losing your password means that your data is
irrecoverably lost.
{{< /output >}}

{{< caution >}}
Store this password securely and somewhere away from your Linode. Your backups will be inaccessible without it!
{{< /caution >}}

### Store the access key and secret

Your access key, secret key and password are required every time Restic communicates with your repository. To make it easier to work with your repository, create a shell script containing your credentials. 

To keep it secure, create this script within the root user's home directory, and run all your Restic scripts as the root user.

    sudo nano /root/restic_params
    
{{< file "/root/restic_params" >}}export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
{{< /file >}}

Whenever you want to use Restic, import this file or include it in your user's logon script:

    source /root/restic_params
    
Create a password file to hold your Restic password:

{{< file "/root/restic_pw" >}}YourPasswordGoesHere
{{< /file >}}
    
You can pass your password filename to Restic using the "-p" flag:

    restic -p /root/restic_pw ...

## Set Up Automated Database Backups

{{< note >}}
In each of the below commands, remember to replace "your-bucket-name" and "us-east-1.linodeobjects.com" with the name of your Object Storage bucket and cluster hostname.
{{< /note >}}

### Backup all databases

The mysqldump utility is used to dump the contents of a database to a SQL file on-disk on your Linode. This simple shell script will loop through all
databases on your server, and dump each one to its own SQL file.

Create a file in /usr/local/bin:

    sudo nano /usr/local/bin/backup_mariadb

Copy the following contents into the file:

{{< file "/usr/local/bin/backup_mariadb" >}}#!/bin/bash
source /root/restic_params
mysql -N -e 'show databases' | while read dbname; do /usr/bin/mysqldump --complete-insert "$dbname" > "/var/backups/mariadb/$dbname".sql; done
restic -r s3:us-east-1.linodeobjects.com/your-bucket-name -p /root/restic_pw backup /var/backups/mariadb
{{< /file >}}

Make the script executable and create the folder to hold the backup files (if it doesn't already exist):

    chmod u+x /usr/local/bin/backup_mariadb
    mkdir -p /var/backups/mariadb/
    
You can now run your first backup:

    backup_mariadb

{{< output >}}
mysqldump: Got error: 1044: "Access denied for user 'root'@'localhost' to database 'information_schema'" when using LOCK TABLES
mysqldump: Got error: 1142: "SELECT, LOCK TABLES command denied to user 'root'@'localhost' for table 'accounts'" when using LOCK TABLES
repository 1689c602 opened successfully, password is correct

Files:           4 new,     0 changed,     0 unmodified
Dirs:            2 new,     0 changed,     0 unmodified
Added to the repo: 470.844 KiB

processed 4 files, 469.825 KiB in 0:01
snapshot 81072f28 saved
{{< /output >}}

Check your backups have been created - you should get one file per database:

    ls -al /var/backups/mariadb
    
{{< output >}}
total 492
drwxr-xr-x 2 root root   4096 Jul 21 19:47 .
drwxr-xr-x 3 root root   4096 Jul 21 19:46 ..
-rw-r--r-- 1 root root    830 Jul 21 19:47 information_schema.sql
-rw-r--r-- 1 root root 479441 Jul 21 19:47 mysql.sql
-rw-r--r-- 1 root root    830 Jul 21 19:47 performance_schema.sql
-rw-r--r-- 1 root root   1292 Jul 21 19:47 wordpress.sql
{{< /output >}}

You should also have one snapshot in your Restic repository:

    restic -r s3:us-east-1.linodeobjects.com/your-bucket-name -p /root/restic_pw snapshots

{{< output >}}
repository 1689c602 opened successfully, password is correct
ID        Time                 Host        Tags        Paths
---------------------------------------------------------------------------
81072f28  2020-07-21 19:47:19  li1356-54               /var/backups/mariadb
---------------------------------------------------------------------------
1 snapshots
{{< /output >}}

### Run the backup script automatically

Linux has several ways of running a job on a schedule basis. Pick one of the methods below to configure the backup script to run periodically.

{{< note >}}
Consider your databases' usage, how much data you could potentially lose, and the storage space required when choosing how often to run your script.
{{< /note >}} 

### 1. Cron

Edit your "crontab" file:

    sudo crontab -e
    
Add a line for your backup script. This example runs the backup every hour, on the hour. See the [Schedule tasks with Cron](https://www.linode.com/docs/tools-reference/tools/schedule-tasks-with-cron/) article for additional scheduling options.

    0 * * * * /usr/local/bin/backup_mariadb > /tmp/mariadb-backup-log.txt 2>&1

### 2. Systemd

Systemd can run commands (known as "units") on a periodic basis using "timers". You can use systemd commands to monitor when the timers and commands last ran, and the output from them.

To schedule a command, you need 2 configuration files - the command to run (known as the service) and when to run it (the timer.)

Create the unit configuration file:

    sudo nano /etc/systemd/system/backup-mariadb.service
    
{{< file "/etc/systemd/system/backup-mariadb.service" >}}[Unit]
Description=Backup MariaDB databases
[Service]
ExecStart=/usr/local/bin/backup_mariadb
Environment=USER=root HOME=/root
{{< /file >}}

Create the timer configuration file:

    sudo nano /etc/systemd/system/backup-mariadb.timer
    
{{< file "/etc/systemd/system/backup-mariadb.timer" >}}[Unit]
Description=Backup MariaDB databases
[Timer]
OnCalendar=*-*-* *:00:00
[Install]
WantedBy=timers.target
{{< /file >}}

The `OnCalendar` line instructs Systemd when to execute this command. In the example above, this is on-the-hour, every hour.

Enable the timer:

    sudo systemctl enable --now backup-mariadb.timer
    
Monitor it with:

    sudo systemctl list-timers
    
{{< output >}}
NEXT                        LEFT          LAST                        PASSED        UNIT                         ACTIVATES
Mon 2020-07-20 16:00:00 BST 35min left    Mon 2020-07-20 15:00:03 BST 24min ago     backup-mariadb.timer         backup-mariadb.service
{{< /output >}}
    
The "NEXT" and "LEFT" column tells you the exact time, and how long until, the command will next be executed. The "LAST" and "PASSED" tells you the same but for the last time the command was executed.
    
## Finishing Up

If you view your Object Storage bucket in the Linode Cloud Manager, you should see a set of files like below. These files collectively make up the Restic repository; you will not see your individual database backup files.

To explore the backups and files held within Restic repository, you must use the `restic` command on your Linode, or another machine running Restic.

![Restic Object Storage bucket in Cloud Manager](backup-restic-bucket-object-storage.png)

### Create an alias

It can get tedious typing out the arguments to the Restic command. To make life easier for maintenance and daily management, create an alias for the command with the arguments you need.

In your profile's aliases file, add the line:

    alias myrestic='restic -r s3:us-east-1.linodeobjects.com/your-bucket-name -p /root/restic_pw'
    
After logging out and back in again, you can run restic using your aliased command:

    myrestic snapshots
    
### Restore a backup

Backups are no good if you cannot restore them. It's a good idea to test our your backups once in a while.

To restore the latest good backup from Restic, run the "restore latest" command:

    restic -r s3:us-east-1.linodeobjects.com/your-bucket-name -p /root/restic_pw restore latest -t /root
    
{{< note >}}
The "-t" (target) parameter tells Restic where to restore your backup. Restic restores the files and recreates the full folder structure at the time of the backup.

**Example:** consider the backup file /var/backups/mariadb/wordpress.sql. Restoring a backup containing this file to a target of /home/myuser would result in the file being restored as:

    /home/myuser/var/backups/mariadb/wordpress.sql
{{< /note >}}
    
To restore a backup from a specific point-in-time, identify the snapshot ID in which it was backed up using the snapshots command (the first column is the Snapshot ID):

    restic -r s3:us-east-1.linodeobjects.com/your-bucket-name -p /root/restic_pw snapshots

{{< output >}}
repository 1689c602 opened successfully, password is correct
ID        Time                 Host        Tags        Paths
---------------------------------------------------------------------------
81072f28  2020-07-21 19:47:19  li1356-54               /var/backups/mariadb
---------------------------------------------------------------------------
1 snapshots
{{< /output >}}

Pass the selected ID to the restore command instead of "latest":

    restic -r s3:us-east-1.linodeobjects.com/your-bucket-name -p /root/restic_pw restore 81072f28 -t /root
    
The above commands will restore all databases taken in the backup. If you only want a selected backup, pass the filename using the "-i" parameter - along with either "latest" or the snapshot ID, as above:

    restic -r s3:us-east-1.linodeobjects.com/your-bucket-name -p /root/restic_pw restore 81072f28 -i wordpress.sql -t /root
    
### Maintain your repository

Your backups can grow very quickly, especially if you backup a sizeable database every hour.

Restic can automatically clean-up your backup snapshots according to a flexible policy using [snapshot policies](https://restic.readthedocs.io/en/stable/060_forget.html#removing-snapshots-according-to-a-policy).

Consider running a policy using the `forget` command as described in Restic's snapshot policies article automatically on a frequent basis (e.g. daily) to keep your backup repository's size down.

{{< note >}}
Don't forget to pass the `--prune` option to the `forget` command or the space won't actually be freed from your repository!

Pruning a repository can take significant time and stops backups taking place while it is being run, so it is best to run it often and non-interactively. 
{{< /note >}}