---
author:
  name: Tyler Nelson
  email: tylernelson12@gmail.com
description: 'Getting started with Box on Fedora 22'
keywords: 'box,box.com,cloud,cloud storage,file storage,file,webdav,davfs,davfs2'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, October 7th 2015
modified_by:
  name: Tyler Nelson
published: 'Wednesday, October 7th 2015'
title: 'Access Your Box.com Account from Your Linode'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

If you've discovered [Box](https://www.box.com/home/) then you know that it can be a great tool for moving files around. Here's how to install and configure a great free pisoftware to access your Box from your Linode!

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system.

        sudo dnf update

{: .note}
>
>This guide requires having a Box account.

## Set Box's Mount Point

The following step will create an empty directory where Box will live and all of your Box files and folders will appear here. You can mount it anywhere, but `/home/example_user/box` will be used for this guide.

1.  Create a mount point:

        mkdir ~/box

    {: .note}
    >
    >If only your `example_user` needs access to the Box account contents, making the mount point in that user's `/home` directory would be fine. If multiple system users (other than root) need to access the Box account, then it should be placed in a system directory such as `/mnt/box`. For more info, see [the davfs man page](http://linux.die.net/man/8/mount.davfs).
2.  Add Box to fstab.

    The fstab (or file systems table) file is a system configuration file commonly found at `/etc/fstab`. It contains the necessary information to automate the process of mounting. Add an entry for your Box account.

    {: .file-excerpt}
    /etc/fstab
    :   ~~~ conf
        https://dav.box.com/dav /home/example_user/box davfs rw,user,noauto 0 0
        ~~~

## Configure WebDAV and User Permissions

1.  Install davfs2, the WebDAV backend which is used to communicate between your Linode and Box account.

    **CentOS**

        sudo yum install davfs2


    **Debian / Ubuntu**

        sudo apt-get install davfs2

    When asked if unprivileged users should be allowed to mount WebDAV resources, choose `Yes`.

    **Fedora**

        sudo dnf install davfs2

2.  Give Your user permission to mount using davfs2. Replace `example_user` with your user name.

        sudo usermod -aG davfs2 "example_user"

3.  Reboot your distro. This is the best way to be sure there are no lingering open user sessions. If there are, you'll experience problems mounting the Box drive even after adding your user to the proper group.

        sudo reboot

4.  SSH back into your Linode and try mounting your Box account using WebDAV. It will fail saying that the davfs2 secrets file has the wrong permissions, but this is just to create the necessary files for davfs2 in your home directory at `~/.davfs2`.

        mount ~/box

5.  The WebDAV share exported by Box.com does not support file locks. Thus you need to disable file locks in the davfs2 configuration file. Otherwise, you will encounter "Input/output error" while attempting to create a file.

        echo 'use_locks 0' >> ~/.davfs2/davfs2.conf

6.  Add your Box account info to WebDAV's secrets file. Replacing `email` with the email addres you use to log in to your Box accounrt, and `password` with your Box password.

        echo 'https://dav.box.com/dav email password' >> ~/.davfs2/secrets

    {: .note}
    >
    >If your password contains quotation characters (`'` or `"`), you'll need to open edit the secrets file in a text editor.

7. Make the `secrets` file readable to only its owner.

        chmod 600 ~/.davfs2/secrets

## Mounting and Unmounting Your Box Drive

1.  To mount:

        mount ~/box

2.  To unmount:

        umount ~/box

## Wrapping Up

To confirm that your Box drive is mounted:

    df

The output should look similar to:

~~~
Filesystem              1K-blocks   Used Available Use% Mounted on
/dev/root                 4122048 886316   3009636  23% /
devtmpfs                   505636      0    505636   0% /dev
tmpfs                      507504      0    507504   0% /dev/shm
tmpfs                      507504   1420    506084   1% /run
tmpfs                      507504      0    507504   0% /sys/fs/cgroup
tmpfs                      507504      0    507504   0% /tmp
tmpfs                      101504      0    101504   0% /run/user/1000
https://dav.box.com/dav  10485756     72  10485684   1% /home/example_user/box
~~~

To see the mount options your Box drive is mounted with:

    cat /proc/mounts | grep box

The output should show:

    https://dav.box.com/dav /home/example_user/box fuse rw,nosuid,nodev,noexec,relatime,user_id=1000,group_id=1000,allow_other,max_read=16384 0 0

And you're done!  The directory `~/box` will now reflect your Box contents! The first time you access the folder it may take a few minutes for the contents to synchronize. After that, folder access is almost immediate.
