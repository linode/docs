---
author:
  name: Linode
  email: docs@linode.com
description: Using CoreOS Container Linux on Linode
keywords: 'block storage, volume, media'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Tuesday, May 23rd, 2017
modified_by:
  name: Linode
published: 'Tuesday, May 23rd, 2017'
title: Using CoreOS Container Linux on Linode
---

Container Linux is a Linux distribution which focuses on containerization and ***. The operating system is considered heavily streamlined and minimal compared to traditional distributions like Debian or Ubuntu, but the purpose of this is to **


{: .note}
> The following features can not be used with Container Linux:
>
>  Filesystem and boot helpers.
>
>  Linode Backups.
>
>  The Linode kernel



## Container Linux Configuration Profile

When you deploy a Container Linux image from the Linode Manager, you'll notice the configuration profile is different from the default settings of other distributions.

    [![CoreOS configuration profile](/docs/assets/bs-manager-manage-volumes-small.png)](/docs/assets/bs-manager-manage-volumes.png)

1.  Boot Settings

  Container Linux boots with the Direct Disk setting as opposed to GRUB 2 or any other. Container Linux also must use its own kernel, so will not with any of the Linode kernels.

2.  Block Device Assignment

  Container Linux does not use a swap space, so while Linode's other distribution will use /dev/sdb as a swap area, this is not necessary with Container Linux.

3.  Filesystem/Boot Helpers

  These are not needed for Container Linux so they are disabled. See our [static networking](https://www.linode.com/docs/networking/linux-static-ip-configuration/#coreos) guide if you wish to configure multiple IP addresses for your Container Linux deployment.


## Logging into Container Linux

The default user is the *core* user, so you must log in as *core* rather than *root*. Once logged in as *core*, you can change to the root user with full sudo privileges using:

        sudo su - root

## Automatic Updating

Container Linux has no package manager such as *apt* or *Pacman*, and updates take place automatically. Instead, updates are pushed to the distribution and reboots take place depending on your [reboot strategy](https://coreos.com/os/docs/latest/update-strategies.html). Update checks will take place about 10 minutes after bootup and about every hour afterwards. Should you need to trigger a manual update, see [these instructions](https://coreos.com/os/docs/latest/update-strategies.html#manually-triggering-an-update) for doing so.