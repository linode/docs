---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to disks and configuration profiles
keywords: ["disks", "config profiles"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['disk-images-config-profiles/','migrate-to-linode/disk-images/disk-images-and-configuration-profiles/']
modified: 2014-06-19
modified_by:
  name: Linode
published: 2012-04-24
title: Disks and Configuration Profiles
---

The Linode Manager allows you to create, edit, and use disks and configuration profiles with your Linodes. You can install different Linux distributions on the disks, set device assignments, and configure boot settings. This guide will show you how to put the pieces together to create a custom setup.

## Getting Started

Your Linode plan comes with persistent storage to hold your most important asset - data. This pool of storage can be broken up into individual containers called *disks*. It's easy to create, delete, resize, duplicate, and even clone disks to different Linodes.

A *configuration profile* is a boot loader for your Linode. It controls general boot settings, including the disk your Linode will start up from, the disks that will be mounted, and the kernel that will be used. You can create multiple configuration profiles and store them in the Linode Manager.

[![Overview of disks and configuration profiles.](/docs/assets/1740-disk-images1.png)](/docs/assets/1740-disk-images1.png)

The Linode Manager automatically creates a disk and configuration profile when you sign up for an account or create a Linode, but you can manually create as many as you want, provided you have the storage space available. The space for disks is allocated from your Linode plan's storage. You can allocate all available storage to one disk, or you can create multiple disks, as shown in the examples above and below.

### Finding Your Way Around

All of a Linode's disks and configuration profiles are displayed on the Linode's Dashboard. You can add, edit, select, and remove items from this webpage, as shown below.

[![Overview of Linode Manager interface.](/docs/assets/977-disk1-2-small.png)](/docs/assets/978-disk1-1.png)

1.  These are your configuration profiles. Select one and then click **Reboot** to start your Linode with the settings and disks you have specified in the configuration profile.
2.  Click this link to create a new configuration profile.
3.  These are your disks. Select one to resize it or duplicate it.
4.  Click this link to create a new disk with a Linux distribution installed.
5.  Click this link to create a new blank disk.
6.  This box indicates how much storage space is allocated to disks. To see how much space inside your disk is currently being used, connect to your Linode via SSH and execute the `df -m` command.

## Disks

Just like your desktop computer has a physical hard drive that can be partitioned into smaller virtual drives, your Linode plan's storage space can be split in to disks. Disks can be used to store anything, including files, applications, or other Linux distributions. The space allocated to disks reduces your plan's available storage space.

### Creating a Disk with a Linux Distribution Installed

The Linode Manager makes it easy to create a new disk with a fresh Linux distribution installed. This is a fast and easy way to try out other distributions. Here's how to create a disk with a Linux distribution installed:

 {{< note >}}
A new configuration profile will automatically be created when you make a disk this way. After the disk is created, you can select the new configuration profile to boot your Linode from the new disk.
{{< /note >}}

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Deploy an Image** link. The webpage shown below appears.

[![Create a new disk with a Linux distribution.](/docs/assets/980-disk2-small.png)](/docs/assets/979-disk2.png)

5.  Select a Linux distribution from the **Distribution** menu.

 {{< note >}}
You can install a customized Linux distribution on your disk by clicking **Deploying using StackScripts**. Some of the most popular StackScripts do things like install Apache, configure a firewall, and set up the WordPress.
{{< /note >}}

6.  Enter a size for the disk in the **Deployment Disk Size** field. The size must be smaller than the amount of storage space remaining in your Linode plan.
7.  By default, the new disk is set to use your existing swap disk. If you'd like to create a new swap disk, select a size from the **Swap Disk** menu.
8.  Enter a password for the `root` user in the **Root Password** field.
9.  Click **Deploy**.

The disk will be created. Watch the *Host Job Queue* on the Dashboard to monitor the progress. When the process is complete, the disk will appear on the dashboard.

### Creating a Blank Disk

Create a blank disk if you need detachable storage space or want to download and install your own Linux distribution. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Create a new disk** link. The *Edit disk* webpage appears, as shown below.

[![Create a new blank disk.](/docs/assets/982-disk3-small.png)](/docs/assets/983-disk3.png)

5.  Enter a name for the disk in the **Label** field.
6.  By default, **Type** is set to `ext4`. We recommend that you stick with this setting.
7.  Enter a size for the disk in the **Deployment Disk Size** field. The size must be smaller than the amount of storage space remaining in your Linode plan.
8.  Click **Save Changes**.

The disk will be created. Watch the *Host Job Queue* on the Dashboard to monitor the progress. When the process is complete, the disk will appear on the dashboard. You'll need to create or modify a configuration profile to mount the new disk. For instructions, see [Configuration Profiles](#configuration-profiles).

### Resizing a Disk

Resizing allows you to allocate more storage to a disk so you can store more files, or shrink a disk so you have more storage for the other disks in your account. Here's how to resize a disk:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click **Shut down** to turn your Linode off. Watch the *Host Job Queue* for confirmation that the Linode has shut down.
5.  Select the disk you want to resize. The *Edit disk* webpage appears.
6.  In the **New Size** field, enter a different size for the disk in megabytes.
7.  Click **Save Changes**. The Linode's dashboard appears. Watch the *Host Job Queue* for confirmation that the disk has been resized.
8.  Click **Boot** to turn on the Linode.

You have successfully resized the disk.

### Duplicating a Disk

You can create an exact copy of a disk by duplicating it. This is an effective way to back up your server or clone an existing Linode to a new Linode. (To clone a disk, see [Cloning disks and Configuration Profiles](#cloning-disks-and-configuration-profiles).) Here's how to duplicate a disk:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click **Shut down** to turn your Linode off. Watch the *Host Job Queue* for confirmation that the Linode has shut down.
5.  Select the disk you want to duplicate. The *Edit disk* webpage appears.
6.  Click **Duplicate Disk**. The Linode's dashboard appears. Watch the *Host Job Queue* for confirmation that the disk has been duplicated.
7.  Click **Boot** to turn on the Linode.

The disk will be duplicated. Watch the *Host Job Queue* on the Dashboard to monitor the progress. When the process is complete, the disk will appear on the dashboard.

### Removing a Disk

You can delete a disk to remove it from your Linode and reallocate its storage space to another disk. This action is permanent and cannot be undone. Here's how to delete a disk:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click **Shut down** to turn your Linode off. Watch the *Host Job Queue* for confirmation that the Linode has shut down.
5.  Select the **Remove** link next to the Linode you want to delete, as shown below. The disk will be deleted. Watch the *Host Job Queue* for confirmation that the disk has been duplicated.

	[![Deleting a disk](/docs/assets/987-disk5-1-small.png)](/docs/assets/986-disk5-1.png)

6.  Click **Boot** to turn on the Linode.

The disk will be deleted. The storage space the disk was using is now available to other disks.

## Configuration Profiles

Linode's configuration profiles are similar to [GNU GRUB](http://en.wikipedia.org/wiki/GNU_GRUB), the Linux boot loader that allows you to select and boot from an operating system installed on your desktop computer. You can create different configuration profiles to build custom boot configurations with disks, kernels, and the operating system's run level.

### Creating a Configuration Profile

Making a new configuration profile allows you to create a new and separate boot configuration for your system. You can specify boot settings and disks to mount. Here's how to create a new configuration profile:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Create a new Configuration Profile** link. The *Configuration Profile* webpage appears, as shown below.

	[![Creating a configuration profile](/docs/assets/createconfprofile-small.png)](/docs/assets/createconfprofile.png)

5.  Enter a descriptive name for the configuration profile in the **Label** field. This name appears on the dashboard and will help you differentiate it from other configuration profiles.
6.  You can enter comments or notes about this configuration profile in the **Notes** field.
7.  Select a Linux kernel from the **Kernel** menu. We recommend selecting one of the current and latest kernels.
8.  In the *Block Device Assignment* section, select a bootable disk, a swap disk (optional), and any other disks that you would like to mount at start up.
9.  Select a bootable disk from the **root device Standard** menu.
10. Leave the settings in the *Filesystem/Boot Helpers* section alone, unless you have a specific reason to change them.
11. Click **Save Changes**.

The configuration profile will be created and will appear on the Linode's dashboard.

### Editing a Configuration Profile

You can edit existing configuration profiles to change boot settings, set other disks to mount, and more. Here's how to edit a configuration profile:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select a configuration profile. The *Configuration Profile* appears.
5.  Edit the settings as necessary.
6.  When finished, click **Save Changes**.

The changes to the configuration profile have been saved. You may need to reboot your Linode to activate the changes.

### Selecting and Using a Configuration Profile

You can create and store many different configuration profiles in the Linode Manager, but you can only boot your Linode from one configuration profile at a time. Here's how to select a configuration profile and boot your Linode from it:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click the button to select a configuration profile, as shown below.

	[![Selecting a configuration profile](/docs/assets/993-disk7-1.png)](/docs/assets/993-disk7-1.png)

5.  Click **Reboot** to restart your Linode using the selected configuration profile.

You have successfully selected and booted your Linode from a configuration profile.

### Removing a Configuration Profile

You can remove a configuration profile from the Linode Manager at anytime. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Remove** link next to the configuration profile you want to remove.

The configuration profile is removed from the dashboard.

## Cloning Disks and Configuration Profiles

You can *clone* disks and configuration profiles from one Linode to another, as long as both of the Linodes are on your account. This is an easy way to transfer your configuration between Linodes, or migrate your Linode to a different datacenter. See our guide on [cloning your Linode](/docs/migrate-to-linode/disk-images/clone-your-linode) for more information.

## Potential Uses

If you're wondering how you could use disks and configuration profiles, here are some ideas to get you started:

-   **Duplicate Server Configurations:** It takes time to configure your Linode. Preserve that hard work by [duplicating the disk](#duplicating-a-disk) to preserve all of your settings and applications in their current state. If you decide to create another Linode later, you could [clone a saved disk](#cloning-disks-and-configuration-profiles) to the new Linode in a matter of minutes, saving yourself hours of work.
-   **Automate Server Builds:** If you run a large website that requires multiple servers, or if you just love automating things, you'll want to [automate your server builds](/docs/platform/automating-server-builds). You can rapidly spin up multiple servers with exactly the same configuration by creating a *golden disk* that can be cloned to multiple Linodes.
-   **Experiment with Distributions:** New to Linux? Take different distributions out for a spin by creating a separate disk for each flavor of Linux. Once you find a distribution you like, you can delete all of the disks except the one with your favorite distribution.
-   **Create a Software Testing Environment:** If you're a developer, you can create different disks for testing purposes. Every disk can hold a different 32- or 64-bit distribution, and every configuration profile can be set to use a different kernel. Even if you're not a developer, this is ideal for testing open source or proprietary software on different distributions.

There are plenty of other ways you can use disks and configuration profiles. Use your imagination!
