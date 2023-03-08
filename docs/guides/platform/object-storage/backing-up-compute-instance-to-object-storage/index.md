---
slug: backing-up-compute-instance-to-object-storage
author:
  name: Linode Community
  email: docs@linode.com
description: "Linode Object Storage offers an efficient solution for a range of storage needs, and it can also work well to store backups of your Linode Compute Instances. Follow along with this tutorial to learn how you can create system backups and store them on your object storage buckets."
keywords: ['how to backup object storage','linux backup','snapshot object storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-08
modified_by:
  name: Nathaniel Stickman
title: "Backing Up a Compute Instance to Object Storage"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Oracle Cloud Infrastructure Documentation: Backing Up Snapshots to Object Storage Using rclone](https://docs.oracle.com/en-us/iaas/Content/File/Tasks/backing-up-snapshots-to-object-storage.htm)'
- '[OSTechNix: How To Backup Your Entire Linux System Using Rsync](https://ostechnix.com/backup-entire-linux-system-using-rsync/)'
- '[Average Linux User: Backup and Restore Your Linux System with rsync](https://averagelinuxuser.com/backup-and-restore-your-linux-system-with-rsync/)
- '[Ubuntu Forums: Heliode - Howto: Backup and Restore Your System!](https://ubuntuforums.org/showthread.php?t=35087)'
---

Linode Object Storage offers a range of benefits, with high availability and S3-compatibility. In addition to many other data-storage uses, Linode Object Storage can also efficiently store backups of your Linode Compute Instances.

Learn in this tutorial how to create full-system backups from the command line and how to store those backups on Linode Object Storage. And see also how you can automate and schedule the whole process.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Create an Instance Image

Methods for backing up your system abound. Several useful methods are covered in our guide on [Backing Up Your Data](/docs/guides/backing-up-your-data/), including some methods specific to Linode instances.

Since this tutorial aims to store backups on object storage, it favors methods that archive and compress your system files into a single file. This leaves a cleaner and easier to manage collection of backups. Both of the approaches covered below use tar to create a `backup.tgz` file archiving system files.

Follow along with whichever method fits your interests. Each section begins with a brief overview to give you a perspective on how the covered method operates.

### Backup via tar

The tar command creates and extracts archives and is useful for compressing collections of files. Both this backup method and the next use tar for this purpose. But the simplest backup approach just uses tar itself, without any other tools.

Here, you execute a `tar` command from the system's root directory (`/`). The command creates an archive of the root directory and stores it as `backup.tgz`. The first `--exclude` option ensures that tar does not attempt to archive the archive itself.

The remaining `--exclude` options exclude the contents of various directories from the backup. You can adjust this as needed, but the options here provide a general guide.

```command
cd /
sudo tar cvpzf backup.tgz --exclude='backup.tgz' --exclude='dev/*' --exclude='proc/*' --exclude='sys/*' --exclude='tmp/*' --exclude='run/*' --exclude='mnt/*' --exclude='media/*' --exclude='lost+found/*' /
sudo mv backup.tgz /tmp
```

For convenience, the last command moves the `backup.tgz` file to the `/tmp/` directory for later processing.

You can now restore your system from that backup file. Move the `backup.tgz` to the root directory, change into that directory, and extract the archive there using `tar`.

```command
sudo mv /tmp/backup.tgz /
cd /
sudo tar xvpfz backup.tgz -C /
```

### Backup via rsync

The rsync utility provides robust and versatile options for copying data from one location to another. Here, rsync is used precisely and just to do that, but rsync also includes the noteworthy feature of incremental backups. That feature would allow you to only alter a backup directory relative to changes in the source directory or directories.

Beyond its versatility, rsync also offers a faster backup operation. Though a little more complex, the rsync method can more quickly handle large backup tasks than the tar method alone.

Learn more about rsync in our [Introduction to rsync](https://www.linode.com/docs/guides/introduction-to-rsync/).

To start the backup, run the `rsync` command with the root directory (`/*`) as the source and a destination directory (`/tmp/backup`) to store the backup in.

The `--exclude` option keeps the contents of some directories from being backed up. This should at least include the destination directory. The other options here provide a good guide for other directories to exclude, but adjust this as needed.

```command
sudo rsync -aAX --exclude={"/dev/*","/proc/*","/sys/*","/tmp/*","/run/*","/mnt/*","/media/*","/lost+found"} /* /tmp/backup
```

From there, it is useful to compress the backup directory into a single archive file. This makes backups easier to manage and much more size efficient. To create the archive, change into the `/tmp/` directory, compress the `backup/` subdirectory, and then remove it.

```command
cd /tmp
sudo tar cvpzf backup.tgz backup/
sudo rm -r /tmp/backup/
```

Later, you can restore the backup with a similar set of commands. After extracting the archive file to `/tmp/backup/`, run the `rsync` command from above again but with the source and destination paths reversed.

```command
cd /tmp
sudo tar xvpfz backup.tgz backup/
sudo rsync -aAX --exclude={"/dev/*","/proc/*","/sys/*","/tmp/*","/run/*","/mnt/*","/media/*","/lost+found"} /tmp/backup /*
```

## How to Back an Image Up to Object Storage

With your backup made and stored in a convenient `backup.tgz` file, you can start the process of storing it on your Linode Object Storage instance.

The [rclone](https://rclone.org/) utility handles that process efficiently, especially when you plan on automating backups, like in the next section of this tutorial. You can learn more about rclone and its usage with S3 object storage in our guide [Use Rclone to Sync Files to Linode Object Storage](https://www.linode.com/docs/guides/rclone-object-storage-file-sync/).

Follow along with the steps here to set up rclone and store your initial backup file to a Linode Object Storage instance.

1. Create a Linode Object Storage bucket, and generate access keys. Our [Object Storage - Get Started](/docs/products/storage/object-storage/get-started/) guide shows you how.

    You need to keep track of some information from this step, as it is necessary further on.

    - The name of your bucket. For examples, this tutorial uses `compute-backup-bucket`.

    - The region designation for your bucket. This is displayed when selecting a region for the bucket and as part of the bucket's URL. For example, the "Atlanta" region has the designation `us-southeast-1`.

    - The access key and secret access key you generate. The cloud manager only displays the secret key once after generating it, so be sure to hold on to it.

1. Install rclone. The easiest way to do so is using your system's package manager. You can generally do so from your system's package manager, but for the latest release of rclone, you should follow the installation instructions in our [rclone guide](/docs/guides/rclone-object-storage-file-sync/#download-and-install-rclone-on-linux-and-macos) linked above.

1. Create a configuration file to connect rclone to your object storage bucket. The file should be stored at `~/.config/rclone/rclone.conf`, and you may need to create the file (and directory) if it does not already exist.

    Below you can find an example of a simple rclone configuration for Linode Object Storage. Replace `$LINODE_S3_ACCESS_KEY` with your access key and `$LINODE_S3_SECRET_KEY` with your secret key. Replace `$LINODE_S3_REGION` with the region designation for your bucket.

    ```file {title="~/.config/rclone/rclone.conf" lang="conf"}
    [linodes3]
    type = s3
    env_auth = false
    acl = private
    access_key_id = $LINODE_S3_ACCESS_KEY
    secret_access_key = $LINODE_S3_SECRET_KEY
    region = $LINODE_S3_REGION
    endpoint = $LINODE_S3_REGION.linodeobjects.com
    ```

1. Verify rclone's connectivity to your object storage bucket with one of its `list` commands. The example below lists the buckets within your object storage instance.

    ```command
    rclone lsd linodes3:
    ```

    ```output
              -1 2023-03-01 21:30:45        -1 compute-backup-bucket
    ```

At this point, rclone is prepared to store your backups. With the `backup.tgz` file stored in `/tmp/` as shown in the previous section, you can send the backup to object storage anytime with the command here.

```command
rclone copyto /tmp/backup.tgz linodes3:compute-backup-bucket/backups/backup-$(date +%Y%m%d-%H%M%S).tgz
```

The command stores the file in the `compute-backup-bucket`, specifically in a subdirectory named `backups`. Additionally, the stored file gets its name changed, adding in a timestamp for easier sorting and identification of backups later.

Once the process has finished, you can verify the result either in the Linode Cloud Manager or from the command line using another rclone command.

```command
rclone tree linodes3:compute-backup-bucket
```

```output
/
└── backups
    └── backup-20230301-214530.tgz

1 directories, 1 files
```

## How to Schedule Regular Backups

The whole process of creating backups and storing them on Linode Object Storage can be readily automated and scheduled. In fact, the methods above specifically lend themselves to this.

To do this, essentially you need two things: A script to create and store backups and a cron job to schedule execution of the script.

The steps here help you set these up. This example uses the tar process outlined further above for creating backups and assumes you followed along above for configuring rclone.

1. Create a shell script to generate a backup file and store that file in your object storage bucket. This uses commands shown throughout this tutorial, just omitting `sudo`, since the task runs as root, and specifying a location for the rclone configuration file.

    ```file {title="/usr/local/bin/backup-to-object-storage.sh" lang="sh"}
    #!/bin/sh

    # Create the backup file with tar
    cd /
    tar cvpzf backup.tgz --exclude='backup.tgz' --exclude='dev/*' --exclude='proc/*' --exclude='sys/*' --exclude='tmp/*' --exclude='run/*' --exclude='mnt/*' --exclude='media/*' --exclude='lost+found/*' /
    mv backup.tgz /tmp

    # Store the backup in object storage with rclone
    rclone copyto /tmp/backup.tgz linodes3:compute-backup-bucket/backups/backup-$(date +%Y%m%d-%H%M%S).tgz --config=/etc/rclone/rclone.conf

    # Remove the backup file from the local system
    rm /tmp/backup.tgz
    ```

1. Give the script executable permission.

    ```command
    sudo chmod +x /usr/local/bin/backup-to-object-storage.sh
    ```

1. The rclone configuration file should be copied to a new location for access during script execution. The example script above and the commands here use the location `/etc/rclone/rclone.conf`.

    ```command
    sudo mkdir /etc/rclone
    sudo cp ~/.config/rclone/rclone.conf /etc/rclone/rclone.conf
    ```

1. Create a cron job to run the script at your desired frequency. The example here runs daily at 11:59 PM — minute `59` of hour `23`.

    First, open root user's `crontab` for editing.

    ```command
    sudo crontab -e
    ```

    Then, create a new entry for the backup cron job. (Typically, cron prefers the crontab file to end with a new line, so be sure to add one after your entry.)

    ```command
    59 23 * * * /usr/local/bin/backup-to-object-storage.sh
    ```

    Learn more about scheduling tasks with cron in our guide [Using Cron to Schedule Tasks for Certain Times or Intervals](/docs/guides/schedule-tasks-with-cron/). There you can see more options for setting up cron jobs and a full breakdown of scheduling frequency.

Now it only remains for you to verify the results. The example above schedules a daily task, so checking your object storage bucket the next day should show a new backup file.

```command
rclone tree linodes3:compute-backup-bucket
```

```output
/
└── backups
    └── backup-20230301-214530.tgz
    └── backup-20230302-000749.tgz

1 directories, 2 files
```

## Conclusion

Your Linode Compute Instance is now equipped with a fully-automated backup process, storing your backups with the efficiency of object storage. Moreover, all of the pieces can be adjusted and expanded on to your particular needs. Follow along with the links provided throughout this tutorial to learn more about the utilities and procedures used to get the most out of it.

The additional links below provide further reading on creating backups and can give you more context and options for the methods outlined in the tutorial.
