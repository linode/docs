---
slug: rclone-object-storage-file-sync
description: 'Learn how to use Rclone on Ubuntu 20.04 and macOS to sync and backup files to a Linode Object Storage Bucket. Rclone is a command-line alternative to the popular rsync tool.'
keywords: ['rclone vs rsync', 'install rclone', 'configure rclone', 'rlone sync', 'rclone copy', 'rclone mount']
tags: ['ubuntu', 'cloud manager']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-18
modified: 2023-07-27
modified_by:
  name: Linode
external_resources:
   - '[Rclone mount command Documentation](https://rclone.org/commands/rclone_mount/)'
   - '[Rclone copy command Documentation](https://rclone.org/commands/rclone_copy/)'
   - '[Rclone sync command Documentation](https://rclone.org/commands/rclone_sync/)'
title: "Use Rclone to Sync Files to Linode Object Storage"
title_meta: "How to Use Rclone to Sync Files to Linode Object Storage"
contributors: ["Jack Wallen"]
---

## What is Rclone?

[*Rclone*](https://rclone.org/) is a command-line tool for syncing files to remote services. A GUI called [Rclone Browser](https://kapitainsky.github.io/RcloneBrowser/) is also available. Rclone works with over 40 services like Dropbox, FTP, Google Drive, HTTP, OneDrive, Nextcloud, ownCloud, pCloud, WebDAV, and Linode.

Rclone is used to backup and sync files and includes cloud equivalents to Linux commands like `rsync`, `cp`, `mv`, `mount`, `ls`, `ncdu`, `tree`, `rm`, and `cat`. Rclone helps you to backup, restore, mirror, migrate, mount, analyze, and unify your data, and file systems. You can transfer, copy, sync, move, check, mount, and even serve local, or remote files over HTTP, WebDAV, FTP, SFTP, and DLNA.

This tutorial shows you how to use Rclone to sync your files to a Linode Object Storage Bucket. The steps in this guide can be followed on an Ubuntu 20.04 system and a macOS system.

## Rclone vs Rsync

For years, [rsync](/docs/guides/introduction-to-rsync/) has been the go-to backup and sync command-line tool for Linux. With that in mind, why would you make the switch to Rclone? Although Rsync is a great tool for local and LAN-based backup and sync, it doesn't have the built-in capacity to work with cloud storage providers. It is possible to mount your cloud storage service to a local drive and then use Rsync to backup files, but without the help of another tool, you're out of luck. That's where Rclone comes into play since it was built to work with cloud services. This guide shows you how to install and use Rclone.

## Download and Install Rclone on Linux and macOS

The Rclone installation process is the same on Linux and macOS. Log into either platform and open a terminal window. From the terminal, issue the following command:

```command
curl https://rclone.org/install.sh | sudo bash
```

{{< note >}}
To install cURL on an Ubuntu system, use the following command:

```command
sudo apt-get install curl -y
```

To install cURL on a macOS system use the following command:

```command
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null
brew install curl
```
{{< /note >}}

Verify the Rclone installation.

```command
rclone --version
```

You should see the version of Rclone installed, as well as some information about the platform on which it was installed.

## Configure Rclone

Before you configure Rclone, [create a new Linode bucket](/docs/products/storage/object-storage/guides/manage-buckets/) and then [generate an associated Access Key](/docs/products/storage/object-storage/guides/access-keys/) for that bucket. You can also create a new access key for an existing bucket. When you create an access key, you are given the **Access Key** and the **Secret Key**. Make sure to copy both of those strings, because you need them when configuring Rclone.

1.  Once you have created the Linode bucket and have the access keys, set up a new configuration with the following command:

    ```command
    rclone config
    ```

1.  Configure a **New Remote** by typing `n`.

1.  Next, enter a name to use your new remote.

1.  When prompted for the type of storage, select the option that corresponds with **S3** (*"AWS S3 Compliant Storage Providers including..."*).

    ```output
    / Amazon S3 Compliant Storage Providers including AWS, Alibaba, ArvanCloud, Ceph, China Mobile, Cloudflare, GCS, DigitalOcean, Dreamhost, Huawei OBS, IBM COS, IDrive e2, IONOS Cloud, Liara, Lyve Cloud, Minio, Netease, Petabox, RackCorp, Scaleway, SeaweedFS, StackPath, Storj, Tencent COS, Qiniu and Wasabi
      \ (s3)
    ```

1.  Then, select the option that corresponds to **Ceph** when choosing your provider.

    ```output
    / Ceph Object Storage
       \ (Ceph)
    ```

1.  You are then asked how you'd like to provide your AWS credentials. For this, select the option that corresponds to **false** to manually enter your access key and secret.

    ```output
    / Enter AWS credentials in the next step.
      \ (false)
    ```

    As part of this step, you'll be requested to enter an access key and secret key for our Object Storage service. If you do not have this information, you can [generate a new access key](/docs/products/storage/object-storage/guides/access-keys/#create-an-access-key).

1.  When prompted, leave the `region` section blank.

1.  For the endpoint, type the URL that corresponds with the region your buckets are located within. Review [Cluster URL (S3 Endpoint)](/docs/products/storage/object-storage/guides/urls/#cluster-url-s3-endpoint) for a full list.

1.  Leave `location_constraint` blank.

1.  Next, you are requested to enter the Access Control List (ACL) to use when creating buckets and objects. This is based on your preferences and how you intend to use your buckets. Review [Define Access and Permissions using ACLs (Access Control Lists)](/docs/products/storage/object-storage/guides/acls/) for more details about ACLs and the various permission levels. For a personal bucket (or if you are unsure), you may want to enter *private*.

1.  You are then given the option for advanced configuration. For this tutorial, select *no* or just hit enter.

1.  Finally, an output containing your configuration is displayed. Verify that this information looks correct and enter **y** to save it.

1.  To finish and exit the configuration tool, enter **q** at the last prompt.

## Rclone Sync

You can sync a local directory to your Linode storage bucket. To do that, create a new bucket using the command below. The example command names the bucket `test` and the remote is named `Linode`. Replace these names with your own.

```command
rclone mkdir Linode:test
```

When you open your Linode cloud manager, you now see a `test` object in your bucket.

When you want to sync your local `Documents` directory to that remote test object use the following command:

```command
rclone sync Documents Linode:test
```

Once the sync is complete, you now see all of the files in the local `Documents` directory, in your Linode Object Storage bucket.

## Rclone Copy

The `rclone copy` command copies the source to the destination but does not copy files from the destination to the source. Say you have a file named `testing.txt` and you want to copy it to the `test` bucket on your Linode Object Storage "remote". You can use the following command to accomplish this:

```command
rclone copy testing Linode:test
```

Check out your `test` bucket and you now see the `testing.txt` file added.

## Rclone Mount

You can also mount a local directory to a Linode Object Storage bucket. The one caveat to this is that the local directory must be empty. You should also know that the `rclone mount` command does take a long time to complete. You can run mount in either foreground or background or daemon mode. Mount runs in foreground mode by default. Use the `--daemon` flag to force background mode. To mount the local directory, `/home/example-user/LINODE` to a bucket named `DATA` on the Linode remote, use the following command:

```command
rclone mount Linode:DATA /home/example-user/LINODE --daemon
```

Once the directory is mounted, dump all of the necessary files into the local source and they are synced with the remote destination.

The command covered in this guide give you all the basics you need to use Rclone to sync and backup files to your Linode Object Storage buckets.
