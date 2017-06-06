---
author:
  name: Linode
  email: docs@linode.com
description: Using CoreOS Container Linux on Linode
keywords: 'block storage, volume, disk, media'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Tuesday, May 23rd, 2017
modified_by:
  name: Linode
published: 'Tuesday, May 23rd, 2017'
title: Using CoreOS Container Linux on Linode
---

Container Linux is a Linux distribution which focuses on containerization. The operating system is heavily streamlined and considered minimal compared to traditional distributions like Debian or Ubuntu, but it's intended that your runtime or development environment takes place inside a container rather than in the host operating system. Container Linux supports running [Docker](https://coreos.com/os/docs/latest/getting-started-with-docker.html), [Kubernetes](https://coreos.com/kubernetes/docs/latest/) and [rkt](https://coreos.com/rkt) container environments.

At this time, Container Linux is a brand new release on the Linode platform and available by opting in to a test program for the distribution. If you'd like to use Container Linux, open a support ticket asking to be added to the trial. Once you've been added, Container Linux will be accessible from the *Deploy an Image* screen of the Linode Manager.


## Container Linux Configuration Profile

When you deploy a Container Linux image, you'll notice the default settings in the configuration profile are different from those of other distributions.

    [![CoreOS configuration profile](/docs/assets/bs-manager-manage-volumes-small.png)](/docs/assets/bs-manager-manage-volumes.png)

### Boot Settings

Container Linux boots with the Direct Disk setting as opposed to GRUB 2 or any other. Container Linux is not compatible with the Linode kernels.

### Block Device Assignment

Container Linux does not use a swap space, so while Linode's other distribution will use /dev/sdb as a swap area, this is not necessary with Container Linux.

### Filesystem/Boot Helpers

These are not needed for Container Linux, and Network Helper is not compatible so they are all disabled. Our Container Linux images use `systemd-networkd`, so see our [static networking](https://www.linode.com/docs/networking/linux-static-ip-configuration/#arch--coreos) guide if you wish to configure static and/or multiple IP addresses for your deployment.

{: .note}
>
> The [Linode backup service](/docs/platform/linode-backup-service) is not available for Container Linux. You should back up your data and configurations using an [alternative method](/docs/security/backups/backing-up-your-data).


## Logging into Container Linux

The default user is the *core* user, so you must log in as *core* rather than *root*.


## Accessing the Root User Account

The *root* account is not accessible by default, by console nor by SSH. If you wish to, you must log in as *core* and then assign *root* a password with:

        sudo passwd root

Then you can change to the root user:

        sudo su - root


## Updating and Reboot Strategies

Container Linux has no package manager such as *apt* or *yum*, and in fact the operating system is not upgraded with individual package updates like most distributions. Instead, entire [system updates](https://coreos.com/why#updates) are pushed to the distribution and the system reboots in accordance with one of three [reboot strategies](https://coreos.com/os/docs/latest/update-strategies.html).

The default configuration is to follow the *etcd-lock* strategy if [etcd](https://coreos.com/etcd/) is being used (i.e., if you are clustering linodes running Container Linux). If not, then the system will reboot immediately after applying the update. For the linode to boot back up automatically, you will want [Lassie](/docs/uptime/monitoring-and-maintaining-your-server#configuring-shutdown-watchdog) enabled in the Linode Manager.

If you find an update has undesirable effects, then you can roll back to the previous Container Linux version you were using. Update checks will take place about 10 minutes after Container Linux boots and about every hour afterwards. Should you need to trigger a [manual update](https://coreos.com/os/docs/latest/update-strategies.html#manually-triggering-an-update), use:

        update_engine_client -check_for_update
