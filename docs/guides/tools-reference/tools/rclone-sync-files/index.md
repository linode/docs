---
slug: using-rclone-to-sync-files-to-linode-object-storage
author:
  name: Jack Wallen
  email: docs@linode.com
description: 'This guide shows you how to use Rclone on Ubuntu 20.04 and macOS to sync files to a Linode Object Storage Bucket'
keywords: ['rclone vs rsync', 'install rclone', 'configure rclone', 'rlone sync', 'rclone copy', 'rclone mount']
tags: ['ubuntu', 'cloud manager']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-07
modified_by:
  name: Linode
title: "Using Rclone to Sync Files to Linode Object Storage"
h1_title: "How to Use Rclone to Sync Files to Linode Object Storage"
enable_h1: true
contributor:
  name: Jack Wallen
---

## What is Rclone?

[*Rclone*](https://rclone.org/) is a command-line tool (although there is a GUI available, called Rclone Browser) for syncing files to remote services. Rclone works with over 40 services like Amazon S3, Dropbox, FTP, Google Drive, HTTP, OneDrive, Nextcloud, ownCloud, pCloud, WebDAV, and Linode.

Rclone offers plenty of features sure to meet your backup/sync needs, and even includes cloud equivalents to Linux commands like `rsync`, `cp`, `mv`, `mount`, `ls`, `ncdu`, `tree`, `rm`, and `cat`. Rclone makes it easy for you to backup, restore, mirror, migrate, mount, analyze, and unify your data, and file systems. You can transfer, copy, sync, move, check, mount, and even serve local, or remote files over HTTP, WebDAV, FTP, SFTP, and DLNA.

This tutorial shows you how to use Rclone to sync your files to a Linode Object Storage Bucket. The steps in this guide can be followed on an Ubuntu 20.04 system and a macOS system.

## Rclone vs Rsync

For years, [rsync](/docs/guides/introduction-to-rsync/) has been the go-to backup/sync command-line tool for Linux. With that in mind, why would you make the switch to Rclone? Although Rsync is a great tool for local and LAN-based backup and sync, it doesn't have the built-in capacity to work with cloud storage providers. You could pull off some trickery and mount your cloud storage service to a local drive and then use Rsync to backup files, but without the help of another tool, you're out of luck.

That's where Rclone comes into play, as it was built to work with cloud services. The following section shows you how to install and use Rclone.

## Download and Install Rclone on Linux and macOS

The Rclone installation process is the same on Linux and macOS. Log into either platform and open a terminal window. From the terminal, issue the following command:

    curl https://rclone.org/install.sh | sudo bash

If cURL isn't installed, install it on Ubuntu with the following command:

    sudo apt-get install curl -y

If cURL isn't installed on macOS, install it with the following commands:

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null
    brew install curl

Verify the Rclone installation.

    rclone --version

You should see the version of Rclone installed, as well as some information about the platform on which it was installed.

## Configure Rclone

Before you configure Rclone, [create a new Linode bucket](/docs/products/storage/object-storage/guides/create-bucket/) and then [generate an associated Access Key](/docs/products/storage/object-storage/guides/generate-access-keys/) for that bucket. You can also create a new Access Key for an existing bucket. When you create an access key, you are given the **Access Key** and the **Secret Key**. Make sure to copy both of those strings, because you need them for the configuration.

Once you have created the Linode bucket and have the access keys, run the `rclone config` command to set up a new configuration. When you run the command, type `n`, for **New remote**. Below are the steps you need to set up the new remote.

1. Name the configuration with a human-readable name (such as "Linode").

1.  Select cloud storage service. For this, select AWS S3 Compliant Storage Provider (option 4), followed by selecting any other S3 compatible provider (option 14)

1. Get AWS credentials. For this step, type `2` and then type your **Access Key** string (for `access_key_id`) and then paste your Secret Key for `secret_access_key`.

1. Leave the `region` section blank.

1. For the endpoint, type the address for your Linode bucket, such as `rclone.us-east-1.linodeobjects.com`.

1. Leave `location_constraint` blank.

1. Select the `acl` you'd like to use. If this is a personal bucket, type `1` for private. If this is a team bucket, you might select `public-read` (option 2) or `authentication-read` (option 4).

1. Hit **enter** to opt-out of editing the advanced configuration file.

1. Verify the configuration and, if it is correct, type **y** to save the options.

1. Type **q** to quit the configuration tool.

## Rclone Sync

You can sync a local directory to your Linode storage bucket. To do that, create a new bucket using the command below. The example command names the bucket `test` and the remote is named `Linode`. Replace these names with your own.

    rclone mkdir Linode:test

When you open your Linode cloud manager, you now see a `test` object in your bucket.

When you want to sync your local `Documents` directory to that remote test object use the following command:

    rclone sync Documents Linode:test

Once the sync is complete, you now see all of the files in the local `Documents` directory, in your Linode object storage bucket.

## Rclone Copy

The `rclone copy` command copies the source to the destination but does not copy files from the destination to the source. Say you have a file named `testing.txt` and you want to copy it to the `TEST` bucket on your Linode object storage "remote". You can use the following command to accomplish this:

    rclone copy testing Linode:TEST

Check out your `TEST` bucket and you now see the `testing.txt` file added.

## Rclone Mount

You can also mount a local directory to a Linode object storage bucket. The one caveat to this is that the local directory must be empty. You should also know that the `rclone mount` command does take a very long time to complete. It's a known issue that writes to `rclone mount` are extremely slow. Because of this, your best bet is to use the `rclone sync` command instead. However, if you still want to mount a directory, the command is straightforward. To mount the local directory, `/home/example-user/LINODE` to a bucket named `DATA` on the Linode remote, use the following command:

    rclone mount Linode:DATA /home/example-user/LINODE

Once the directory is mounted, dump all of the necessary files into the local source and they are synced with the remote destination.

You now know the basics to use Rclone with your Linode Object Storage buckets.
