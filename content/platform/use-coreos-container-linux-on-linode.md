---
author:
  name: Linode
  email: docs@linode.com
description: This tutorial shows how to configure and use CoreOS Container Linux on Linode
keywords: ["linux containers", "docker", "CoreOS"]
aliases: ['platform/using-coreos-container-linux-on-linode/','platform/using-coreos-container-linux-on-your-linode/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-07-17
modified_by:
  name: Linode
published: 2017-06-08
title: Use CoreOS Container Linux on Linode
---

CoreOS Container Linux is a container-focused distribution, designed for clustered deployments, that provides automation, security, and scalability for applications. The operating system is heavily streamlined and considered minimal compared to traditional distributions, like Debian or Ubuntu. Rather than being part of the host operating system, CoreOS's runtime or development environment takes place inside a Linux container.

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

{{< note >}}
The [Linode backup service](/docs/platform/linode-backup-service) is not available for Container Linux. You should back up your data and configurations using an [alternative backup method](/docs/security/backups/backing-up-your-data).
{{< /note >}}

## Log into Container Linux

The default user is the `core` user, so you must log in as `core` rather than `root`. The `root` user does not have a password assigned to it by default. This is the intended use of Container Linux.

## Container Linux Updates and Reboot Strategies

Container Linux has no package manager such as *apt* or *yum*, and in fact the operating system is not upgraded with individual package updates like most distributions. Instead, entire [system updates](https://coreos.com/why#updates) are pushed to the distribution and the system reboots in accordance with one of three [reboot strategies](https://coreos.com/os/docs/latest/update-strategies.html).

The default configuration is to follow the *etcd-lock* strategy if [etcd](https://coreos.com/etcd/) is being used (such as if you are clustering Linodes running Container Linux). If not, the system will reboot immediately after applying the update. For the Linode to boot back up automatically, you will want [Lassie](/docs/uptime/monitoring-and-maintaining-your-server#configuring-shutdown-watchdog) enabled in the Linode Manager.

If you find an update has undesirable effects, [roll back](https://coreos.com/os/docs/latest/manual-rollbacks.html) to the previous version you were using. Update checks will take place about 10 minutes after Container Linux boots and about every hour afterwards. Should you need to trigger a [manual update](https://coreos.com/os/docs/latest/update-strategies.html#manually-triggering-an-update), use:

    update_engine_client -check_for_update

## Recovery Mode

Should you need to access your Container Linux disk using Rescue Mode, use the boot instructions shown in our [Rescue and Rebuild](/docs/troubleshooting/rescue-and-rebuild#booting-into-rescue-mode) guide. The root partition is located on `/dev/sda9`. To access it, enter:

    mount /dev/sda9 && cd /media/sda9

That will put you at the root of your Container Linux filesystem. For more information on the partition layout of Container Linux, see the [Container Linux Disk Partitions Guide](https://coreos.com/os/docs/latest/sdk-disk-partitions.html).
