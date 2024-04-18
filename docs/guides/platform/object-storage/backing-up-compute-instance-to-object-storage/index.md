---
slug: backing-up-compute-instance-to-object-storage
title: "Backing Up a Compute Instance to Object Storage"
description: "Linode Object Storage is an efficient solution to store backups of Compute Instances. Learn how to create backups and store them in object storage buckets."
keywords: ['how to backup object storage','linux backup','snapshot object storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributors: ["Nathaniel Stickman"]
published: 2023-09-08
external_resources:
- '[Oracle Cloud Infrastructure Documentation: Backing Up Snapshots to Object Storage Using rclone](https://docs.oracle.com/en-us/iaas/Content/File/Tasks/backing-up-snapshots-to-object-storage.htm)'
- '[Ubuntu Forums: Heliode - Howto: Backup and Restore Your System!](https://ubuntuforums.org/showthread.php?t=35087)'
---

Linode's [Object Storage](https://www.linode.com/products/object-storage/) service is an S3-compatible cloud-based file storage solution that offers high availability. In addition to many other data-storage uses, Linode Object Storage can efficiently store backups of your Linode Compute Instances.

In this tutorial, learn how to create full-system backups from the command line and store them on Linode Object Storage. Afterwards, find out how to automate and schedule the entire process.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Back Up Your Data to a Single Archive File

There are a significant number of tools, third-party applications, and services that offer system backup solutions. Several useful methods are covered in our guide on [Backing Up Your Data](/docs/guides/backing-up-your-data/), including some methods specific to Linode instances.

Since the goal of this tutorial is to store backups on Object Storage, utilities that output a single backup file are preferred. After all, it's much easier to store and manage each backup as a single object than as many separate objects.

The `tar` command works well here. It can combine multiple files and directories into a single archive file as well as extract the contents of existing archive files. Such archive files are easier to manage and share. When combined with optional compression algorithms, they also take up less storage space.

You can use the following `tar` command to combine most of your system's files into a single compressed archive. The command creates an archive of the root directory and stores it as `/tmp/backup.tgz`. The first `--exclude` option ensures that `tar` does not attempt to archive the archive itself. The remaining `--exclude` options exclude the contents of various directories from the backup. You can adjust these as needed, but the options here provide a general guide:

```command
sudo tar -vcpzf /tmp/backup.tgz --exclude='backup.tgz' --exclude='dev/*' --exclude='proc/*' --exclude='sys/*' --exclude='tmp/*' --exclude='run/*' --exclude='mnt/*' --exclude='media/*' --exclude='lost+found/*' /
```

You can then restore your system from that backup file. Assuming you are working in the directory with the `backup.tgz`, you can extract the archive into root using a `tar` command like this:

```command
sudo tar -vxpzf backup.tgz -C /
```

Alternatively, if you want to extract the backup to a specific location, change the directory after the `-C` option to that location. For instance, to extract the backup to a `~/temp-backup-storage/` directory, use the following `tar` command:

```command
sudo tar -vxpzf backup.tgz -C ~/temp-backup-storage/
```

### Incremental Backups

This guide focuses on covering full backups, in which all of the files you've specified are backed up in their entirety each time you perform a backup. However, some use cases may benefit from *incremental backups*, in which each subsequent archive only contains modifications since the last backup.

Incremental backups mainly offer two benefits. They tend to take less time and fewer resources because each subsequent backup operation only archives new modifications. For a similar reason, each archive file tends to be significantly smaller.

That said, incremental backups typically require a more involved restore process. In most cases, you would first extract the initial archive and then each subsequent archive (in order) up to your desired restoration point. This is in contrast to restoring a full backup, where you only need to extract a single archive file.

The tar command also supports incremental backups, using its `--listed-incremental` option. To learn how to create incremental backups with `tar`, refer to the GNU documentation on [Using tar to Perform Incremental Dumps](https://www.gnu.org/software/tar/manual/html_node/Incremental-Dumps.html).

## Upload Backup Archive Files to Object Storage

With your backup made and stored in a convenient `backup.tgz` file, you can start the process of storing it on an Object Storage bucket.

The [rclone](https://rclone.org/) utility handles that process efficiently, especially when you plan on automating backups (covered in the next section). You can learn more about rclone and its usage with S3 object storage in our guide [Use Rclone to Sync Files to Linode Object Storage](/docs/guides/rclone-object-storage-file-sync/).

Follow along with the steps here to set up rclone and store your initial backup file to a Linode Object Storage instance.

1.  Create a Linode Object Storage bucket and generate access keys. Our [Object Storage - Get Started](/docs/products/storage/object-storage/get-started/) guide explains how.

    You need to keep track of some information from this step, as it is necessary further on:

    -   The name of your bucket. For example, this tutorial uses `compute-backup-bucket`.

    -   The region designation for your bucket. This is displayed when selecting a region for the bucket and as part of the bucket's URL. For example, the **Atlanta** region has the designation `us-southeast-1`.

    -   The access key and secret access key you generate. The Cloud Manager only displays the secret key once after generating it, so be sure to hold on to it.

1.  Install rclone. You can generally do so from your system's package manager, but for the latest release of rclone, you should follow the installation instructions in our [rclone guide](/docs/guides/rclone-object-storage-file-sync/#download-and-install-rclone-on-linux-and-macos).

1.  Create the `~/.config/rclone` directory if it does not yet exist. This is where your rclone configuration files will be stored.

    ```command
    cd ~
    mkdir -p .config/rclone
    ```

1.  Now, create the `~/.config/rclone/rclone.conf` configuration file to connect rclone to your Object Storage bucket:

    ```command
    nano ~/.config/rclone/rclone.conf
    ```

    Below is an example of a simple rclone configuration for Linode Object Storage. Replace `LINODE_S3_ACCESS_KEY` with your access key and `LINODE_S3_SECRET_KEY` with your secret key. Replace `LINODE_S3_REGION` with the region designation for your bucket.

    ```file {title="~/.config/rclone/rclone.conf" lang="conf" hl_lines="4-6"}
    [linodes3]
    type = s3
    provider = Ceph
    access_key_id = LINODE_S3_ACCESS_KEY
    secret_access_key = LINODE_S3_SECRET_KEY
    endpoint = https://LINODE_S3_REGION.linodeobjects.com
    acl = private
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Verify rclone's connectivity to your object storage bucket with one of its `list` commands. The example below lists the buckets within your Object Storage account.

    ```command
    rclone lsd linodes3:
    ```

    ```output
              -1 2023-03-01 21:30:45        -1 compute-backup-bucket
    ```

At this point, rclone is prepared to store your backups. With the `backup.tgz` file stored in `/tmp/` as shown in the previous section, you can send the backup to Object Storage with this command:

```command
rclone copyto /tmp/backup.tgz linodes3:compute-backup-bucket/backups/backup-$(date +%Y%m%d-%H%M%S).tgz
```

The command stores the file in the `compute-backup-bucket` bucket, specifically in a subdirectory named `backups`. The file's name is also changed, with a timestamp appended for easier sorting and identification.

Once the process is finished, you can verify the result either in the Cloud Manager or from the command line using another rclone command:

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

The whole process of creating backups and storing them on Linode Object Storage can be automated and scheduled. In fact, the methods above specifically lend themselves to this. You essentially need two things to do this: a script to create and store backups, and a cron job to schedule execution of the script.

The instructions below walk you through this process. This example uses the `tar` process outlined above for creating backups and assumes you followed the steps above for configuring rclone.

1.  Create a shell script to generate a backup file and then store that file in your Object Storage bucket:

    ```command
    sudo nano /usr/local/bin/backup-to-object-storage.sh
    ```

1.  Enter the following contents into the `backup-to-object-storage.sh` script file and then save the file.

    ```file {title="/usr/local/bin/backup-to-object-storage.sh" lang="sh"}
    #!/bin/sh

    # Create the backup file with tar
    tar -vcpzf /tmp/backup.tgz --exclude='backup.tgz' --exclude='dev/*' --exclude='proc/*' --exclude='sys/*' --exclude='tmp/*' --exclude='run/*' --exclude='mnt/*' --exclude='media/*' --exclude='lost+found/*' /

    # Store the backup in object storage with rclone
    rclone copyto /tmp/backup.tgz linodes3:compute-backup-bucket/backups/backup-$(date +%Y%m%d-%H%M%S).tgz --config=/etc/rclone/rclone.conf

    # Remove the backup file from the local system
    rm /tmp/backup.tgz
    ```

    This uses commands shown earlier in this tutorial. It simply omits `sudo`, since the task runs as root, and specifies a location for the rclone configuration file.

1.  Give the script executable permissions:

    ```command
    sudo chmod +x /usr/local/bin/backup-to-object-storage.sh
    ```

1.  The rclone configuration file should be copied to a new location for access during script execution. The example script above and the commands here use the location `/etc/rclone/rclone.conf`.

    ```command
    sudo mkdir /etc/rclone
    sudo cp ~/.config/rclone/rclone.conf /etc/rclone/rclone.conf
    ```

1.  Create a cron job to run the script at your desired frequency. The example here runs daily at 11:59 PM (minute `59` of hour `23`).

    First, open the root user's `crontab` for editing:

    ```command
    sudo crontab -e
    ```

    Then, create a new entry for the backup cron job:

    ```command
    59 23 * * * /usr/local/bin/backup-to-object-storage.sh
    ```

    {{< note >}}
    Typically, cron prefers the crontab file to end with a new line, so be sure to add one after your entry.
    {{< /note >}}

    Learn more about scheduling tasks with cron in our guide [Using Cron to Schedule Tasks for Certain Times or Intervals](/docs/guides/schedule-tasks-with-cron/). There you can see more options for setting up cron jobs and a full breakdown of scheduling frequency.

The example above schedules a daily task, so checking your Object Storage bucket the next day should show a new backup file. You can verify the results with a command like this:

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

Your Compute Instance is now equipped with a fully automated backup solution, with each archive file stored on Linode Object Storage. Moreover, all of the pieces can be adjusted and expanded on to your particular needs. Follow along with the links provided throughout this tutorial to learn more about the utilities and procedures used to get the most out of it.

The additional links below provide further reading on creating backups and can give you more context and options for the methods outlined in this tutorial.