---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to automating server builds with the Linode Manager
keywords: 'server builds,disk images,golden disk image,puppet,chef'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Tuesday, July 9th, 2013
modified_by:
  name: Linode
published: 'Friday, June 28th, 2013'
title: Automating Server Builds
---

If you run a large website that requires multiple servers, or if you just love automating things, you'll want to automate your server builds. You can rapidly spin up multiple servers with exactly the same configuration by creating a *golden image* that can be cloned to multiple Linodes, or by making a *StackScript* that installs the same software and settings on each Linode. The goal is eliminating discrepancies among servers, and making the server-provisioning process fast and painless. This guide shows you how to do it.

Why You Should Automate Server Builds
-------------------------------------

When you set up your Linode for the first time, you manually installed the packages and applications you needed. For example, in the [Hosting a Website](/docs/hosting-website) guide, we walked you through the process of installing the Apache, MySQL, and PHP packages on your Linode to help you host a website. Manually installing packages is a good way to learn about virtual servers, but it's also a time-consuming and painstaking process. It's not something you'll want to do again when you set up servers in the future.

That's why we recommend that you take steps to automate the server-provisioning process now, even if you don't need multiple Linodes at this very moment. By duplicating the disk image or writing an install StackScript, you'll preserve the current state of your server - including all of the packages you've installed and settings you've configured. If you ever want to spin up another Linode in the future, your automatic server building process will save you a lot of time. Plus, this is a requirement for load balancing and high-availability, both of which require Linodes with exactly the same configuration.

Golden Disk Image
-----------------

The idea behind a golden disk image is simple. You'll create the perfect image and then save it for cloning to other servers. To get started, you'll set up a new Linode, install the packages you need, configure the settings the way you want them, and then test the configuration. Once you're satisfied that the server is the way you want it, simply shut down your Linode, duplicate the disk image, and then clone it to all of your other Linodes. (You can also [clone using our API](http://www.linode.com/api/linode/linode.clone).) Once you start your Linodes using the cloned disk image, they'll all be running the same operating system and packages with the same system settings.

[![Cloning your Linode disk image.](/docs/assets/1303-image_cloning_2.jpg)](/docs/assets/1303-image_cloning_2.jpg)

There are several places you can store a golden disk image:

-   **Existing Linode:** This is the fastest and most cost-effective way to get started with automated server builds. The only downside is that you'll need to resize the disk image to store it, and you'll need to shut down the Linode before duplicating and cloning the image.
-   **Linode Backup Service:** After enabling the Linode Backup Service, you can [make a manual backup](/docs/backup-service#sph_id2) of your Linode (called a "snapshot"). This snapshot can function as your golden disk image. Instead of cloning a disk image to new Linodes, you can simply restore them from the snapshot backup.
-   **Dedicated Linode:** This is the preferred method. There's no need to resize the disk image, and you won't have to worry about downtime. Updating the disk image is easy - just boot the Linode, make the changes, and clone the disk image again.
-   **Different Computer:** You can also transfer the disk image to another computer. For instructions, see our guide on [Copying a Disk Image Over SSH](/docs/migration/ssh-copy).

These methods are discussed in further detail below.

### Existing Linode

You can create and store a golden disk image using an *existing Linode*, but there are a couple of drawbacks. All of the disk images stored on the Linode will need to be resized to fit within your Linode's allocated storage space. In addition, you will have to shut down the Linode to duplicate and clone the disk image, which will result in downtime.

Here's how to create a golden disk image on an existing Linode and clone it to other Linodes:

1.  Use the Linode's existing disk image, or [create a new disk image](/docs/disk-images-config-profiles#sph_creating-a-disk-image-with-a-linux-distribution-installed).
2.  Install all necessary packages and configure the system settings, if you haven't already done so.
3.  Verify that all installed packages are current. See our [Monitoring and Maintaining Your Server](/docs/monitoring-and-maintaining#sph_updating-software) guide for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Shut down the Linode.
6.  Resize the disk image. See our [Resizing a Disk Image](/docs/disk-images-config-profiles#sph_resizing-a-disk-image) guide for instructions.
7.  If you're planning on using the golden disk image on the existing Linode, you should duplicate the disk image. See our [Duplicating a Disk Image](/docs/disk-images-config-profiles#sph_duplicating-a-disk-image) guide for instructions.
8.  [Clone the disk image](/docs/disk-images-config-profiles#sph_id10) to another Linode. You can also optionally clone the configuration profile. The disk image can be cloned to as many Linodes as you like.

You have successfully created and stored a golden disk image on an existing Linode.

### Linode Backup Service

If you subscribe to the [Linode Backup Service](http://www.linode.com/backups/), you can create a golden disk image by making a manual backup of an existing disk image. Just take a *snapsnot* of the disk image to back it up, and then restore it to your other Linodes. There's no need to clone or resize the disk image. And since the snapshot will be stored until you overwrite it with another backup, this is an ideal storage solution.

Here's how to create a golden disk image on an existing Linode and clone it to other Linodes:

1.  Use the Linode's existing disk image, or [create a new disk image](/docs/disk-images-config-profiles#sph_creating-a-disk-image-with-a-linux-distribution-installed).
2.  Install all necessary packages and configure the system settings, if you haven't already done so.
3.  Verify that all installed packages are current. See our [Monitoring and Maintaining Your Server](/docs/monitoring-and-maintaining#sph_updating-software) guide for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Take a snapshot of the disk image. See the [manual snapshot](/docs/backup-service#sph_id2) instructions for more information.
6.  Restore your other Linodes from the snapshot. The disk image can be restored to as many Linodes as you like. See the [backup restore](/docs/backup-service#sph_restoring-from-a-backup) instructions for more information.

You have successfully created, stored, and deployed a golden disk image using the Linode backup system.

### Dedicated Linode

Users who manage dozens of Linodes will want to use a dedicated Linode to create, store, and maintain a golden disk image. This is an ideal solution, for several reasons. First, you can store and use the disk image on a regular Linode - there's no need to resize the disk image. You can Linode shut down after you've created the disk image, and then boot it to update the image.

Here's how to create a golden disk image on an existing Linode and clone it to other Linodes:

1.  Use an existing Linode, or [set up a new one](/docs/getting-started#sph_signing-up).
2.  Install all necessary packages and configure the system settings, if you haven't already done so.
3.  Verify that all installed packages are current. See our [Monitoring and Maintaining Your Server](/docs/monitoring-and-maintaining#sph_updating-software) guide for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Shut down your Linode.
6.  [Clone the disk image](/docs/disk-images-config-profiles#sph_id10) to another Linode. You can also optionally clone the configuration profile. The disk image can be cloned to as many Linodes as you like.

You have successfully created, stored, and deployed a golden disk image using a dedicated Linode.

### Updating the Hostname and IP Address

After you restore or clone a disk image to another Linode, you may need to change its hostname and IP address. For instructions on changing the hostname, see [Setting the Hostname](/docs/getting-started#sph_setting-the-hostname). If the golden disk image was configured to use a static IP address, you'll also need to replace the IP address. See [Static IP Configuration](/docs/networking/configuring-static-ip-interfaces#sph_static-ip-configuration) for more information.

StackScripts
------------

[StackScripts](http://www.linode.com/stackscripts) are custom scripts that run when a Linode boots for the first time. You can use public StackScripts that were contributed by members of the community, or you can create your own StackScript that is private to your account. StackScripts can update the system, set the host name, add SSH keys, install packages, and even configure settings. For more information about StackScripts, and to learn how you can use them to automate server builds, [see this article](https://library.linode.com/stackscripts).

Third-Party Tools
-----------------

Golden disk images and StackScripts are capable of handling automated server builds for most individuals and small businesses. But if you work for a large business that manages dozens of Linodes, you may need to turn to a third-party configuration management tool. Here are two of the most popular third-party configuration management tools:

-   **Puppet:** An open source configuration management tool capable of managing Linux systems declaratively. It also automates IT tasks like application configuration, patch management, and even infrastructure audit and compliance. We have several Puppet guides in the Linode Library:

    - [Basic Puppet Setup and Configuration](/docs/application-stacks/puppet/installation)
    - [Manage and Automate Systems Configuration with Puppet](/docs/application-stacks/puppet/automation)

-   **Chef:** An open source configuration management tool that allows you to write configuration "recipes." Chef can be used as a client-server tool, or it can be used in "solo" mode. See the [Opscode website](http://www.opscode.com/solutions/continuous-delivery/) for more information. You can use the [knife linode](http://docs.opscode.com/plugin_knife_linode.html) subcommand to manage Linodes with Chef.
-   **Ansible:** A "radically simple" open source platform for configuring and managing systems. It works by connecting to your systems via SSH — it doesn't install anything on the remote systems. See the [AnsibleWorks website](http://www.ansibleworks.com/) for more information. You can find a [Linode module for Ansible on GitHub](https://github.com/lextoumbourou/ansible-linode).

There are plenty of other third-party configuration management tools. Feel free to investigate other options if Puppet, Chef, or Ansible don't meet your needs for automating server builds and configuration management.



