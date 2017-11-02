---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to automating server builds with the Linode Manager
keywords: ["server builds", "disks", "golden disk", "puppet", "chef"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-04-15
modified_by:
  name: Alex Fornuto
published: 2013-06-28
title: Automating Server Builds
---

If you run a large website that requires multiple servers, or have a general interest in server automation, you may want to automate your server builds. You can rapidly spin up multiple servers with exactly the same configuration by creating a *golden image* that can be cloned to multiple Linodes with the intention of eliminating server discrepancies.

Server configuration can also be automated through [Stackscripts](https://www.linode.com/stackscripts). View the [Stackscripts](/docs/platform/stackscripts/) guide for more information.

## Why You Should Automate Server Builds

When you set up a Linode for the first time, you manually install packages and applications. For example, in the [Hosting a Website](/docs/hosting-website) guide, the Apache, MySQL, and PHP packages are installed. Manually installing packages is a good way to learn about virtual servers, but it's also a time-consuming process.

It is recommended that you take steps to automate the server-provisioning process, even if you don't need multiple Linodes at this moment. By duplicating the disk or writing an install StackScript, you'll preserve the current state of your server -- including all of the packages you've installed and settings you've configured. If you want to spin up another Linode in the future, your automatic server building process will save you time.

## Golden Disk

The idea behind a golden disk is simple: Create the perfect image and then save it for cloning to other servers. To get started, set up a new Linode, install the desired packages, configure the settings, and then test the configuration. Once satisfied with the server configuration, shut down the Linode, duplicate the disk, and then clone it to all of your other Linodes, either manually or though [the Linode API](http://www.linode.com/api/linode/linode.clone).

{{< note >}}
Be aware that certain files like `/etc/hosts`, `/etc/hostname`, and static networking configurations may need to be modified for individual Linodes.
{{< /note >}}

[![Cloning your Linode disk.](/docs/assets/1303-image_cloning_2.jpg)](/docs/assets/1303-image_cloning_2.jpg)

There are several places to store a golden disk:

-   **Linode Images:** [Linode Images](/docs/platform/linode-images) allows you to take snapshots of your disks, and then deploy them to any Linode under your account.
-   **Linode Backup Service:** After enabling the Linode Backup Service, you can [make a manual backup](/docs/security/backups/linode-backup-service/#take-a-manual-snapshot) of your Linode (called a "snapshot"). This snapshot can function as your golden disk. Instead of cloning a disk to new Linodes, you can simply restore them from the snapshot backup.
-   **Dedicated Linode:** Boot the Linode, make the desired changes, and clone the disk again.
-   **Existing Linode:** You can clone from an existing Linode, but you will need to power down the Linode to ensure a consistent copy.
-   **Different Computer:** You can transfer the disk to another computer. For instructions, see our guide on [Copying a Disk Over SSH](/docs/migration/ssh-copy).

These methods are discussed in further detail below, with the exception of [Linode Images](/docs/platform/linode-images) which has its own article.



### Linode Backup Service

If you subscribe to the [Linode Backup Service](http://www.linode.com/backups/), you can create a golden disk by making a manual backup of an existing disk. Take a *snapsnot* of the disk to back it up, and then restore it to your other Linodes. There's no need to clone or resize the disk. The snapshot will be stored until you overwrite it with another backup.

1.  Use the Linode's existing disk, or [create a new disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-disk-with-a-linux-distribution-installed).
2.  Install all necessary packages and configure the system settings.
3.  Verify that all installed packages are current. See [Monitoring and Maintaining Your Server](/docs/uptime/monitoring-and-maintaining-your-server/#updating-software) for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Take a snapshot of the disk. See the [manual snapshot](/docs/security/backups/linode-backup-service/#take-a-manual-snapshot) instructions for more information.
6.  Restore your other Linodes from the snapshot. The disk can be restored to as many Linodes as you like. See the [backup restore](/docs/security/backups/linode-backup-service/#restore-from-a-backup) instructions for more information.



### Dedicated Linode

A dedicated Linode can be used to store and maintain a golden disk. It can be shut down after you've created the disk, and then boot it to update the image.

1.  Use an existing Linode, or [set up a new one](/docs/getting-started#sign-up).
2.  Install all necessary packages and configure the system settings, if you haven't already done so.
3.  Verify that all installed packages are current. See our [Monitoring and Maintaining Your Server](/docs/uptime/monitoring-and-maintaining-your-server/#updating-software) guide for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Shut down your Linode.
6.  [Clone the disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#cloning-disks-and-configuration-profiles) to another Linode. You can also clone the configuration profile. The disk can be cloned to as many Linodes as you like.


### Existing Linode

You can create and store a golden disk using an *existing Linode*, with some drawbacks: All of the disks stored on the Linode will need to be resized to fit within your target Linode's allocated storage space, and you will have to shut down the Linode to ensure an accurate clone, which will result in downtime.

1.  Use the Linode's existing disk, or [create a new disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-disk-with-a-linux-distribution-installed).
2.  Install all necessary packages and configure the system settings, if you haven't already done so.
3.  Verify that all installed packages are current. See our [Monitoring and Maintaining Your Server](/docs/uptime/monitoring-and-maintaining-your-server/#updating-software) guide for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Shut down the Linode.
6.  Resize the disk. See our [Resizing a Disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk) guide for instructions.
7.  If you're planning on using the golden disk on the existing Linode, you should duplicate the disk. See our [Duplicating a Disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#duplicating-a-disk) guide for instructions.
8.  [Clone the disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#cloning-disks-and-configuration-profiles) to another Linode. You can also clone the configuration profile. The disk can be cloned to as many Linodes as you like.


### Updating the Hostname and IP Address

After you restore or clone a disk to another Linode, you may need to change its hostname and IP address. For instructions on changing the hostname, see [Setting the Hostname](/docs/getting-started#setting-the-hostname). If the golden disk was configured to use a static IP address, you'll also need to replace the IP address. See [Static IP Configuration](/docs/networking/linux-static-ip-configuration/#static-network-configuration) for more information.

## Third-Party Tools

Golden disks are capable of handling automated server builds for most individuals and small businesses, but if you work for a large business that manages dozens of Linodes, you may need to turn to a third-party configuration management tool such as:

-   **Puppet:** An open source configuration management tool that manages systems declaratively. It can automates IT tasks like application configuration, patch management, and even infrastructure audit and compliance. See the following Puppet guides:

    - [Basic Puppet Setup and Configuration](/docs/websites/puppet/basic-puppet-setup-and-configuration/)
    - [Manage and Automate Systems Configuration with Puppet](/docs/websites/puppet/manage-and-automate-systems-configuration-with-puppet/)

-   **Chef:** An open source configuration management tool that allows you to "turn your infrastructure into code." See the [Chef website](https://www.chef.io/) for more information. The [knife linode](https://github.com/chef/knife-linode) subcommand can also be used to manage Linodes with Chef.

-   **Ansible:** A "radically simple" open source platform for configuring and managing systems. It works by connecting to your systems via SSH — it doesn't install anything on the remote systems. See the [AnsibleWorks website](http://www.ansible.com/) for more information. You can find a [Linode module for Ansible on GitHub](https://github.com/lextoumbourou/ansible-linode).

There are plenty of other third-party configuration management tools to be used should the above options not suit your needs.


