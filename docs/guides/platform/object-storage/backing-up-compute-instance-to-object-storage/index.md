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
- '[Ubuntu Forums: Heliode - Howto: Backup and Restore Your System!](https://ubuntuforums.org/showthread.php?t=35087)'
---

Linode's [Object Storage](/products/object-storage/) service is a cloud-based file storage solution that offers high availability and is S3 compatible. In addition to many other data-storage uses, Linode Object Storage can also efficiently store backups of your Linode Compute Instances.

In this tutorial, learn how to create full-system backups from the command line and how to store those backups on Linode Object Storage. Also, find out how you can automate and schedule the whole process.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Back Up Your Data to a Single Archive File

When determining how to back up your system, there are a significant number of tools, third-party applications, and services that offer backup solutions. Several useful methods are covered in our guide on [Backing Up Your Data](/docs/guides/backing-up-your-data/), including some methods specific to Linode instances.

Since the goal of this tutorial is to store backups on Object Storage, utilities that output a single backup file are preferred. This is because it is much easier to store and manage each backup as a single object on Object Storage than as potentially thousands (or millions) of separate objects.

The tar command fits well here. It is able to combine multiple files or directories into a single archive file and to extract the contents of existing archive files. Such archive files are easier to manage (or share) and, when combined with optional compression algorithms, take up less storage space.

What follows is a tar command that you can use to combine most of your system's files into a single compressed archive. The command creates an archive of the root directory and stores it as `/tmp/backup.tgz`. The first `--exclude` option ensures that tar does not attempt to archive the archive itself. The remaining `--exclude` options exclude the contents of various directories from the backup. You can adjust these as needed, but the options here provide a general guide.

```command
sudo tar -vcpzf /tmp/backup.tgz --exclude='backup.tgz' --exclude='dev/*' --exclude='proc/*' --exclude='sys/*' --exclude='tmp/*' --exclude='run/*' --exclude='mnt/*' --exclude='media/*' --exclude='lost+found/*' /
```

You can now restore your system from that backup file. Assuming you are working in the directory with the `backup.tgz`, you can extract the archive into root using a `tar` command like this.

```command
sudo tar -vxpzf backup.tgz -C /
```

Alternatively, if you want to extract the backup to a specific location, change the directory after the `-C` option to that location. For instance, to extract the backup to a `~/temp-backup-storage/` directory, use the following `tar` command.

```command
sudo tar -vxpzf backup.tgz -C ~/temp-backup-storage/
```

### Incremental Backups

This guide focuses on covering full backups, where most of your system's files are backed up all at once, each backup containing a full account. But some use cases prefer *incremental backups*, where each archive contains only a modification of an initial backup.

Mainly, incremental backups offer two benefits. Each backup operation, because it only archives modifications to your system's files, tends to take less time and fewer resources. For a similar reason, each archive file tends to be significantly smaller.

That said, incremental backups require a more involved process for restoring your system's files. For instance, a traditional incremental backup requires that you restore first the initial archive and then, in order, each subsequent archive up to your desired restoration point.

The tar command also supports incremental backups, using its `--listed-incremental` option. To learn how that works and how you can create incremental backups with tar, refer to the GNU documentation on [Using tar to Perform Incremental Dumps](https://www.gnu.org/software/tar/manual/html_node/Incremental-Dumps.html).

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
    tar -vcpzf /tmp/backup.tgz --exclude='backup.tgz' --exclude='dev/*' --exclude='proc/*' --exclude='sys/*' --exclude='tmp/*' --exclude='run/*' --exclude='mnt/*' --exclude='media/*' --exclude='lost+found/*' /

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
