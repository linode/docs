---
slug: disk-images-and-configuration-profiles
author:
  name: Linode
  email: docs@linode.com
description: Our guide to disks and configuration profiles
keywords: ["disks", "config profiles", "disk space"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/platform/disk-images/disk-images-and-configuration-profiles-classic-manager/','/disk-images-config-profiles/','/platform/disk-images/disk-images-and-configuration-profiles/','/migrate-to-linode/disk-images/disk-images-and-configuration-profiles/']
modified: 2019-07-09
modified_by:
  name: Linode
published: 2012-04-24
title: Disks and Configuration Profiles
external_resources:
  - '[Types of File Systems](https://en.wikipedia.org/wiki/File_system#Types_of_file_systems)'
---

{{< caution >}}
This guide has been deprecated and the information is no longer accurate. Please use the newer [Linode Disks and Storage](/docs/guides/linode-disks/) or [Linode Configuration Profiles](/docs/guides/linode-configuration-profiles/) guides.
{{</ caution >}}


The Linode Cloud Manager allows you to create, edit, and use disks and configuration profiles with your Linodes. You can install different Linux distributions on the disks, set device assignments, and configure boot settings. This guide will show you how to put the pieces together to create a custom setup.

## Getting Started

Your Linode plan comes with persistent storage to hold your most important asset - data. This pool of storage can be broken up into individual containers called *disks*. It's easy to create, resize, and delete disks.

A *configuration profile* is a boot loader for your Linode. It controls general boot settings, including the disk your Linode will start up from, the disks that will be mounted, and the kernel that will be used. You can create multiple configuration profiles and store them in the Linode Cloud Manager.

[![Overview of disks and configuration profiles.](1740-disk-images1.png)](1740-disk-images1.png)

The Linode Cloud Manager automatically creates a disk and configuration profile when you create a Linode, but you can manually create as many as you want, provided you have the storage space available. The space for disks is allocated from your [Linode plan's](https://www.linode.com/pricing) storage size. You can allocate all available storage to one disk, or you can create multiple disks, as shown in the diagram above.

### Finding Your Way Around

All of a Linode's disks and configuration profiles are displayed on the Linode's detail page, under the **Disks/Configs**.

![Overview of Linode Manager interface.](disks-and-configs-tab.png)

1.  Your configuration profiles are listed in the **Configuration** table. Click on the **more options ellipsis** corresponding to a profile and then select **Boot This Config** from the dropdown menu that appears to boot your Linode under that configuration profile.

1.  Click the **Add a Configuration** link to create a new configuration profile.

1.  Your disks are listed in the **Disks** table. Select the corresponding **more options ellipsis** to resize, rename, imagize, or delete a disk.

1.  Click the **Add a Disk** link to create a new blank disk, or a disk with a Linux distribution installed.

1.  This pane indicates how much of your plan's available storage has been allocated to your disks. This does not represent how much disk space is available on any given disk that you've created. To see how much space inside your disk is currently being used, connect to your Linode via SSH and execute the `df -h` command.

1. The **Configure a Migration** section gives you access to the Linode's migration page where you can initiate a [cross-data center migration](/docs/platform/migrating-to-a-different-data-center/).

## Potential Uses

If you're wondering how you could use disks and configuration profiles, here are some ideas to get you started:

-   **Automate Server Builds:** If you run a large website that requires multiple servers, or if you just love automating things, you'll want to [automate your server builds](/docs/platform/automating-server-builds/). You can rapidly spin up multiple servers with exactly the same configuration by creating a *golden disk* that can be cloned to multiple Linodes.
-   **Experiment with Distributions:** New to Linux? Take different distributions out for a spin by creating a separate disk for each flavor of Linux. Once you find a distribution you like, you can delete all of the disks except the one with your favorite distribution.
-   **Create a Software Testing Environment:** If you're a developer, you can create different disks for testing purposes. Every disk can hold a different 32- or 64-bit distribution, and every configuration profile can be set to use a different kernel. Even if you're not a developer, this is ideal for testing open source or proprietary software on different distributions.
