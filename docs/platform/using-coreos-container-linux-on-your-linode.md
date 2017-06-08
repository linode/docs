---
author:
  name: Linode
  email: docs@linode.com
description: Using CoreOS Container Linux on Linode
keywords: 'block storage,volume,disk,media,recovery,finnix'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Thursday, June 8th, 2017
modified_by:
  name: Linode
published: 'Thursday, June 8th, 2017'
title: Using CoreOS Container Linux on Linode
---

CoreOS Container Linux is a distribution which focuses on containerization. The operating system is heavily streamlined and considered minimal compared to traditional distributions like Debian or Ubuntu. Rather than being part of the host operating system, the runtime or development environment takes place inside a container.

Container Linux supports running [Docker](https://coreos.com/os/docs/latest/getting-started-with-docker.html), [Kubernetes](https://coreos.com/kubernetes/docs/latest/) and [rkt](https://coreos.com/rkt) container environments.

![Linode Beginners Guide](/docs/assets/container-linux-title-graphic.png)

## Container Linux Configuration Profile

When you deploy a Container Linux image, you'll notice the default settings in the configuration profile are different from those of other distributions.

[![CoreOS configuration profile](/docs/assets/container-linux-config-profile-small.png)](/docs/assets/container-linux-config-profile.png)

### Boot Settings

Container Linux boots with the Direct Disk setting as opposed to GRUB2 or any other. Container Linux is not compatible with the Linode kernels.

### Block Device Assignment

Container Linux does not use a swap space, so while Linode's other distributions use `/dev/sdb` as a swap area, this is not necessary with Container Linux.

### Filesystem/Boot Helpers

These are not needed for Container Linux, and Network Helper is not compatible so they are all disabled. Linode's Container Linux images use `systemd-networkd`, so see our [static networking](https://www.linode.com/docs/networking/linux-static-ip-configuration/#arch--coreos) guide if you want to configure static and/or multiple IP addresses for your deployment.

{: .note}
>
> The [Linode backup service](/docs/platform/linode-backup-service) is not available for Container Linux. You should back up your data and configurations using an [alternative backup method](/docs/security/backups/backing-up-your-data).

## Logging into Container Linux

The default user is the `core` user, so you must log in as `core` rather than `root`. The `root` user does not have a password assigned to it by default. This is the intended use of Container Linux.

## Container Linux Updates and Reboot Strategies

Container Linux has no package manager such as *apt* or *yum*, and in fact the operating system is not upgraded with individual package updates like most distributions. Instead, entire [system updates](https://coreos.com/why#updates) are pushed to the distribution and the system reboots in accordance with one of three [reboot strategies](https://coreos.com/os/docs/latest/update-strategies.html).

The default configuration is to follow the *etcd-lock* strategy if [etcd](https://coreos.com/etcd/) is being used (such as if you are clustering linodes running Container Linux). If not, the system will reboot immediately after applying the update. For the linode to boot back up automatically, you will want [Lassie](/docs/uptime/monitoring-and-maintaining-your-server#configuring-shutdown-watchdog) enabled in the Linode Manager.

If you find an update has undesirable effects, [roll back](https://coreos.com/os/docs/latest/manual-rollbacks.html) to the previous version you were using. Update checks will take place about 10 minutes after Container Linux boots and about every hour afterwards. Should you need to trigger a [manual update](https://coreos.com/os/docs/latest/update-strategies.html#manually-triggering-an-update), use:

    update_engine_client -check_for_update

## Recovery Mode

Should you need to access your Container Linux disk using Rescue Mode, use the boot instructions shown in our [Rescue and Rebuild](/docs/troubleshooting/rescue-and-rebuild#booting-into-rescue-mode) guide. The root partition is located on `/dev/sda9`. To access it, enter:

    mount /dev/sda9 && cd /media/sda9

That will put you at the root of your Container Linux filesystem. For more information on the partition layout of Container Linux, see the [Container Linux Disk Partitions Guide](https://coreos.com/os/docs/latest/sdk-disk-partitions.html).

## Password Resets

Recovery Mode must be used to reset the login password to your Container Linux disk image:

1.  Boot into [Rescue Mode](/docs/troubleshooting/rescue-and-rebuild#booting-into-rescue-mode) using [Lish](https://www.linode.com/docs/networking/using-the-linode-shell-lish).

2.  Mount the partition /usr/share/oem is attached to so you can edit the Grub configuration:

        mount -o exec /dev/sda6

3.  Add the string to the Grub config:

        echo 'set linux_append="coreos.autologin=ttyS0"' >> /media/sda6/grub.cfg

4.  Reboot into Container Linux. You still want to be in Lish, and you will automatically be logged in as the `core` user.

5.  Reset your password:

        sudo passwd core

6.  Remove the line from `grub.cfg` which you added in step 3 above:

        sudo sed -i '$ d' /usr/share/oem/grub.cfg

7. Reboot the linode again and log in with your new password.
