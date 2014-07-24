---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to disk images and configuration profiles
keywords: 'disk images,config profiles'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['disk-images-config-profiles/']
modified: Thursday, June 19th, 2014
modified_by:
  name: Linode
published: 'Tuesday, April 24th, 2012'
title: Disk Images and Configuration Profiles
---

The Linode Manager allows you to create, edit, and use disk images and configuration profiles with your Linode virtual private servers. You can install different Linux distributions on the disk images, set device assignments, and configure boot settings. This guide will show you how to put the pieces together to create a custom setup.

Getting Started
---------------

Your Linode plan comes with persistent storage to hold your most important asset - data. This pool of storage can be broken up into individual containers called *disk images*. You'll use disk images to store all of the files on your VPS. It's easy to create, delete, resize, duplicate, and even clone disk images to different Linodes.

A *configuration profile* is a boot loader for your Linode VPS. It controls general boot settings, including the disk image your Linode will start up from, the disk images that will be mounted, and the kernel that will be used. You can create multiple configuration profiles and store them in the Linode Manager.

[![Overview of disk images and configuration profiles.](/docs/assets/1740-disk-images1.png)](/docs/assets/1740-disk-images1.png)

The Linode Manager automatically creates a disk image and configuration profile when you sign up for an account or create a Linode, but you can manually create as many as you want, provided you have the storage space available. The space for disk images is allocated from your Linode plan's storage. You can allocate all available storage to one disk image, or you can create multiple disk images, as shown in the examples above and below.

### Finding Your Way Around

All of a Linode's disk images and configuration profiles are displayed on the Linode's Dashboard. You can add, edit, select, and remove items from this webpage, as shown below.

[![Overview of Linode Manager interface.](/docs/assets/977-disk1-2-small.png)](/docs/assets/978-disk1-1.png)

1.  These are your configuration profiles. Select one and then click **Reboot** to start your Linode with the settings and disk images you have specified in the configuration profile.
2.  Click this link to create a new configuration profile.
3.  These are your disk images. Select one to resize it or duplicate it.
4.  Click this link to create a new disk image with a Linux distribution installed.
5.  Click this link to create a new blank disk image.
6.  This box indicates how much storage space is allocated to disk images. To see how much much space inside your disk image is currently being used, connect to your Linode via SSH and execute the `df -m` command.

Disk Images
-----------

Just like your desktop computer has a physical hard drive that can be partitioned into smaller virtual drives, your Linode plan's storage space can be split in to disk images. Disk images can be used to store anything, including files, applications, or other Linux distributions. The space allocated to disk images reduces your plan's available storage space.

### Creating a Disk Image with a Linux Distribution Installed

The Linode Manager makes it easy to create a new disk image with a fresh Linux distribution installed. This is a fast and easy way to try out other distributions. Here's how to create a disk image with a Linux distribution installed:

 {: .note }
>
> A new configuration profile will automatically be created when you make a disk image this way. After the disk image is created, you can select the new configuration profile to boot your Linode from the new disk image.

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Deploy a Linux Distribution** link. The webpage shown below appears.

[![Create a new disk image with a Linux distribution.](/docs/assets/980-disk2-small.png)](/docs/assets/979-disk2.png)

5.  Select a Linux distribution from the **Distribution** menu.

 {: .note }
>
> You can install a customized Linux distribution on your disk image by clicking **Deploying using StackScripts**. Some of the most popular StackScripts do things like install Apache, configure a firewall, and set up the WordPress.

6.  Enter a size for the disk image in the **Deployment Disk Size** field. The size must be smaller than the amount of storage space remaining in your Linode plan.
7.  By default, the new disk image is set to use your existing swap disk. If you'd like to create a new swap disk, select a size from the **Swap Disk** menu.
8.  Enter a password for the `root` user in the **Root Password** field.
9.  Click **Deploy**.

The disk image will be created. Watch the *Host Job Queue* on the Dashboard to monitor the progress. When the process is complete, the disk image will appear on the dashboard.

### Creating a Blank Disk Image

Create a blank disk image if you need detachable storage space or want to download and install your own Linux distribution. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Create a new Disk Image** link. The *Edit Disk Image* webpage appears, as shown below.

[![Create a new blank disk image.](/docs/assets/982-disk3-small.png)](/docs/assets/983-disk3.png)

5.  Enter a name for the disk image in the **Label** field.
6.  By default, **Type** is set to `ext4`. We recommend that you stick with this setting.
7.  Enter a size for the disk image in the **Deployment Disk Size** field. The size must be smaller than the amount of storage space remaining in your Linode plan.
8.  Click **Save Changes**.

The disk image will be created. Watch the *Host Job Queue* on the Dashboard to monitor the progress. When the process is complete, the disk image will appear on the dashboard. You'll need to create or modify a configuration profile to mount the new disk image. For instructions, see [Configuration Profiles](#id5).

### Resizing a Disk Image

Resizing allows you to allocate more storage to a disk image so you can store more files, or shrink a disk image so you have more storage for the other disk images in your account. Here's how to resize a disk image:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click **Shut down** to turn your Linode off. Watch the *Host Job Queue* for confirmation that the Linode has shut down.
5.  Select the disk image you want to resize. The *Edit Disk Image* webpage appears.
6.  In the **New Size** field, enter a different size for the disk image in megabytes.
7.  Click **Save Changes**. The Linode's dashboard appears. Watch the *Host Job Queue* for confirmation that the disk image has been resized.
8.  Click **Boot** to turn on the Linode.

You have successfully resized the disk image.

### Duplicating a Disk Image

You can create an exact copy of a disk image by duplicating it. This is an effective way to back up your server or clone an existing Linode to a new Linode. (To clone a disk image, see [Cloning Disk Images and Configuration Profiles](#id10).) Here's how to duplicate a disk image:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click **Shut down** to turn your Linode off. Watch the *Host Job Queue* for confirmation that the Linode has shut down.
5.  Select the disk image you want to duplicate. The *Edit Disk Image* webpage appears.
6.  Click **Duplicate Image**. The Linode's dashboard appears. Watch the *Host Job Queue* for confirmation that the disk image has been duplicated.
7.  Click **Boot** to turn on the Linode.

The disk image will be duplicated. Watch the *Host Job Queue* on the Dashboard to monitor the progress. When the process is complete, the disk image will appear on the dashboard.

### Removing a Disk Image

You can delete a disk image to remove it from your Linode and reallocate its storage space to another disk image. This action is permanent and cannot be undone. Here's how to delete a disk image:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click **Shut down** to turn your Linode off. Watch the *Host Job Queue* for confirmation that the Linode has shut down.
5.  Select the **Remove** link next to the Linode you want to delete, as shown below. The disk image will be deleted. Watch the *Host Job Queue* for confirmation that the disk image has been duplicated.

	[![Deleting a disk image](/docs/assets/987-disk5-1-small.png)](/docs/assets/986-disk5-1.png)

6.  Click **Boot** to turn on the Linode.

The disk image will be deleted. The storage space the disk image was using is now available to other disk images.

Configuration Profiles
----------------------

Linode's configuration profiles are similar to [GNU GRUB](http://en.wikipedia.org/wiki/GNU_GRUB), the Linux boot loader that allows you to select and boot from an operating system installed on your desktop computer. You can create different configuration profiles to build custom boot configurations with disk images, kernels, and the operating system's run level.

### Creating a Configuration Profile

Making a new configuration profile allows you to create a new and separate boot configuration for your system. You can specify boot settings and disk images to mount. Here's how to create a new configuration profile:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Create a new Configuration Profile** link. The *Configuration Profile* webpage appears, as shown below.

	[![Creating a configuration profile](/docs/assets/989-disk6-small.png)](/docs/assets/988-disk6.png)

5.  Enter a descriptive name for the configuration profile in the **Label** field. This name appears on the dashboard and will help you differentiate it from other configuration profiles.
6.  You can enter comments or notes about this configuration profile in the **Notes** field.
7.  Select a Linux kernel from the **Kernel** menu. We recommend selecting one of the current and latest kernels.
8.  In the *Block Device Assignment* section, select a bootable disk image, a swap image (optional), and any other disk images that you would like to mount at start up.
9.  Select a bootable disk image from the **root device Standard** menu.
10. Leave the settings in the *Filesystem/Boot Helpers* section alone, unless you have a specific reason to change them.
11. Click **Save Changes**.

The configuration profile will be created and will appear on the Linode's dashboard.

### Editing a Configuration Profile

You can edit existing configuration profiles to change boot settings, set other disk images to mount, and more. Here's how to edit a configuration profile:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select a configuration profile. The *Configuration Profile* appears.
5.  Edit the settings as necessary.
6.  When finished, click **Save Changes**.

The changes to the configuration profile have been saved. You may need to reboot your Linode to activate the changes.

### Selecting and Using a Configuration Profile

You can create and store many different configuration profiles in the Linode Manager, but you can only boot your Linode from one configuration profile at a time. Here's how to select a configuration profile and boot your Linode from it:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click the button to select a configuration profile, as shown below.

	[![Selecting a configuration profile](/docs/assets/993-disk7-1.png)](/docs/assets/993-disk7-1.png)

5.  Click **Reboot** to restart your Linode using the selected configuration profile.

You have successfully selected and booted your Linode from a configuration profile.

### Removing a Configuration Profile

You can remove a configuration profile from the Linode Manager at anytime. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Select the **Remove** link next to the configuration profile you want to remove.

The configuration profile is removed from the dashboard.

Cloning Disk Images and Configuration Profiles
----------------------------------------------

You can *clone* disk images and configuration profiles from one Linode to another, as long as both of the Linodes are in your account. This is an easy way to transfer disk images and configuration profiles between Linodes or migrate your Linode to a different datacenter or a new host in the same data center.

Here's how to clone your disk images and configuration profiles from one Linode to another:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select the Linode with the configuration profiles and disk images you want to clone. The Linode's dashboard appears.
4.  *Optional:* Click **Shut down** to power down the Linode. This is recommended to prevent data corruption.
5.  Click the **Clone** tab. The webpage shown below appears.

	[![Selecting configuration profiles and disk images to migrate](/docs/assets/1038-disk9-small.png)](/docs/assets/1037-disk9.png)

6.  Select the disk images and configuration profiles you want to clone to another Linode.
7.  Click **Select**. The webpage shown below appears.

	[![Clone summary webpage](/docs/assets/1036-disk8-small.png)](/docs/assets/1035-disk8.png)

8.  From the **Destination Linode** menu, select the Linode you want to receive the disk images and configuration profiles.
9.  Click **Clone**. The receiving Linode's dashboard appears. Watch the *Host Job Queue* to monitor the progress.

After the cloning process completes, the disk images and configuration profiles you selected will be available on the destination Linode.

Potential Uses
--------------

If you're wondering how you could use disk images and configuration profiles, here are some ideas to get you started:

-   **Duplicate Server Configurations:** It takes time to configure your Linode. Preserve that hard work by [duplicating the disk image](#duplicating-a-disk-image) to preserve all of your settings and applications in their current state. If you decide to create another Linode later, you could [clone a saved disk image](#id10) to the new VPS in a matter of minutes, saving yourself hours of work.
-   **Automate Server Builds:** If you run a large website that requires multiple servers, or if you just love automating things, you'll want to [automate your server builds](/docs/server-builds). You can rapidly spin up multiple servers with exactly the same configuration by creating a *golden disk image* that can be cloned to multiple Linodes.
-   **Experiment with Distributions:** New to Linux? Take different distributions out for a spin by creating a seperate disk image for each flavor of Linux. Once you find a distribution you like, you can delete all of the disk images except the one with your favorite distribution.
-   **Create a Software Testing Environment:** If you're a developer, you can create different disk images for testing purposes. Every disk image can hold a different 32- or 64-bit distribution, and every configuration profile can be set to use a different kernel. Even if you're not a developer, this is ideal for testing open source or proprietary software on different distributions.

There are plenty of other ways you can use disk images and configuration profiles. Use your imagination!



