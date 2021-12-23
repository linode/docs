---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Mount your Linode Object Storage and access it as part of your filesystem.'
keywords: ['s3fs','fuse','Linode Object Storage','mount']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-16
modified_by:
  name: 
title: "Using Linode Object Storage as a Filesystem"
contributor:
  name: Harold Phillips
  link: https://github.com/hjpx
external_resources:
- '[File System in Userspace (FUSE)](https://github.com/libfuse/libfuse)'
- '[s3fs](https://github.com/s3fs-fuse/s3fs-fuse)'
- '[s3fs mount options](https://github.com/s3fs-fuse/s3fs-fuse/wiki/Fuse-Over-Amazon)'

---

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account that can use `sudo` to perform administrative tasks.
3.  This guide assumes that you have already created a bucket in the [Linode Cloud Manger](https://cloud.linode.com/object-storage/buckets). If you do not have a bucket, follow the instructions provided by [How to Use Block Storage with Your Linode](https://www.linode.com/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/).
4.  Make a note of your `bucket name` , `bucket region`, `Access Key`, and `Secret Key.`

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< caution >}}
Generally when using Linode Object Storage as a filesystem, it will not be as fast as the local file system or Linode Block Storage. More specifically:

- any change to a file requires rewriting the entire file.
- network latency can make listing directories slow.
- You cannot use hard links
- changes to your bucket from other s3 clients will not generate inotify events that would otherwise allow applications to detect changes behind the scenes. For example, an editor would not notice that the file you are editing has been modified. 

{{< /caution >}}

## Install FUSE and s3fs

[FUSE (Filesystem in Userspace)](https://github.com/libfuse/libfuse) is an interface for userspace programs to export a filesystem to the Linux kernel.

[s3fs](https://github.com/s3fs-fuse/s3fs-fuse) allows the Linux kernel to mount an S3 bucket via FUSE.

### Arch Linux (unverified)

    sudo pacman -Syu
    sudo pacman -S fuse2 s3fs 

### CentOS / Fedora (unverified)

    sudo yum update
    sudo yum install epel-release
    sudo yum install s3fs-fuse

### Debian / Ubuntu (verified Debian 9)

    sudo apt-get update && sudo apt-get upgrade
    sudo apt-get install fuse s3fs

### Gentoo (unverified)
   
    sudo maint -a sync
    sudo emerge net-fs/s3fs

### OpenSUSE (unverified)

    sudo zypper update
    sudo zypper install fuse
    sudo zypper install s3fs

### Slackware (unverified)

    sudo slackpkg update
    sudo slackpkg upgrade-all
    sudo slackpkg install fuse
    sudo slackpkg install s3fs

## Setup Your Credentials

Create a file called `/etc/passwd-s3fs` 

    sudo touch /etc/passwd-s3fs

Make your `/etc/passwd-s3fs` file only accessible by root so regular users cannot see your secret key once you put it in.

    sudo chmod 600 /etc/passwd-fs

Edit the file using your favorite editor.

    sudo nano /etc/passwd-s3fs

Add a line in your file, replacing `S3-ACCESS-KEY` and `S3-SECRET-KEY` with the values you got when you created your bucket.

{{< file "/etc/passwd-s3fs" text >}}
    S3-ACCESS-KEY:S3-SECRET-KEY
{{< /file >}}

## Setup Your Mount Point

First make a backup copy of your `/etc/fstab` file. In case something unexpected happens you can boot your Linode into [Rescue Mode](https://www.linode.com/docs/troubleshooting/rescue-and-rebuild/) to revert your changes.

    sudo cp /etc/fstab /etc/fstab.before_adding_s3fs

Find the `USERID` and `GROUPID` of the user that you want to own the files:

    # Find the USERID of root
    id -u root

    # Find the USERID of the current user
    id -u

    # Find the GROUPID of the current user
    id -g

    # Find the GROUPID of `www-data`
    sudo cat /etc/group | grep www-data | cut -d: -f3

Here are the values you will need to put into the `/etc/fstab` line to configure your mount point:

| Parameter     | Description                                           | Example                                     |
| ------------- | ----------------------------------------------------- | ------------------------------------------- |
| `BUCKET`      | Your bucket name.                                     | mybucket1                                   |
| `MOUNT-POINT` | Where your bucket will appear in your filesystem.     | `/mybucket1`                                |
| `REGION`      | The region where your bucket is located.              | us-east-1                                   |
| `USERID`      | The number of the Linux user who will own the files.  | 0 _for root, or use a value you got above._ |
| `GROUPID`     | The number of the Linux group who will own the files. | 0 _for root, or use a value you got above._ |

Create your mount point.

    sudo mkdir -p /mybucket1

Add a line to your `/etc/fstab` file with your favorite editor.

    sudo nano /etc/fstab

Append the following line:

{{< file "/etc/fstab" text >}}
    s3fs#BUCKET MOUNT-POINT fuse _netdev,allow_other,use_path_request_style,url=https://REGION.linodeobjects.com/,uid=USERID,gid=GROUPID 0 0 
{{< /file >}}

{{< file "Example /etc/fstab" text >}}
    s3fs#mybucket1 /mybucket1 fuse _netdev,allow_other,use_path_request_style,url=https://us-east-1.linodeobjects.com/,uid=0,gid=0 0 0 
{{< /file >}}


## Mount Your Bucket and Test Writing a File

You can mount your bucket with the command:

    sudo mount -a

Change your directory to your mount point.

    cd /mybucket1

To see if you are able to write a file to your Bucket open https://cloud.linode.com/object-storage/buckets and make a note of how many Objects are in your bucket.

Create a file in your directory.

    sudo touch test_file

Refresh https://cloud.linode.com/object-storage/buckets and you should note that the number of objects has increased.

