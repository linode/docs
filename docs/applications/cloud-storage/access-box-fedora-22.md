---
author:
  name: Tyler Nelson
  email: tylernelson12@gmail.com
description: 'Getting started with Box on Fedora 22'
keywords: 'Box on Linux,Fedora 22,Fedora,cloud,cloud storage,box'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, October 7th 2015
modified_by:
  name: Tyler Nelson
published: ''
title: 'How to Access Box on fedora 22'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

If you've discovered Box then you know that it can be a great tool for moving files around.  Here's how to install and configure a great free pisoftware to access your Box from your Linode!

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

2.  Update your system:

        sudo dnf update
        sudo dnf upgrade

## Choose Where Box Will Show Up

The following step will create an empty directory where Box will live.  All of your Box files and folders will appear here.

    1.  Create a mount point:

          mkdir ~/box

## Install davfs2

    sudo dnf install davfs2

## Give A User Permission To Use davfs2

    1. Replace `username` with your username.

        sudo /sbin/usermod -a -G davfs2 "username"

## Configure davfs2 for Box

The WebDAV share exported by Box.com does not support file locks. Thus you need to disable file locks in the davfs2 configuration file. Otherwise, you will encounter "Input/output error" while attempting to create a file.

    1.  Create a davfs2 configuration file and open it.

            mkdir ~/.davfs2
            vi ~/.davfs2/davfs2.conf

    2.  Add the following to the configuration file.

            use_locks 0

## Configure fstab For Box

The fstab (or file systems table) file is a system configuration file commonly found at /etc/fstab.  It contains the necessary information to automate the process of mounting.

    1. Open /etc/fstab configuration file.

            sudo vi /etc/fstab

    2. Add the following line, replacing `username` with your username or replacing `/home/username/box` with your mount point.

            https://dav.box.com/dav /home/username/box davfs rw,user,noauto 0 0

## Store Login Information Securely

In order to login to box as a non-root user you must store your login credentials in a secrets file.

    1.  Create a davfs2 configuration file and open it.

            vi ~/.davfs2/secrets

    2.  Add the following to the secrets file, replacing `email` with your email and `password` with your password.

            https://dav.box.com/dav  email  password

    3. Secure login credentials. Replace `username` with your username

            chmod 600 ~/.davfs2/secrets

## Mount Your Box Drive:

    1. Run the following, replacing `username` with your username or replacing `/home/username/box` with your mount point.

            mount /home/username/box

## Unmount Your Box Drive:

    1. Run the following, replacing `username` with your username or replacing `/home/username/box` with your mount point.

            umount /home/username/box

## Wrapping Up

And you're done!  The directory **googleDrive** will now reflect your Google Drive contents!  The first time you access the folder it may take a few minutes for the contents to synchronize.  After that folder access is almost immediate.
