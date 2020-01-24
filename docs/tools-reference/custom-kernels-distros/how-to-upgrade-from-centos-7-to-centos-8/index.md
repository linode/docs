---
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for upgrading from CentOS 7 to CentOS 8.'
og_description: 'Instructions for upgrading from CentOS 7 to CentOS 8.'
keywords: ["upgrade", "centos8", "centos7", "upgrade centos", " centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-01-23
modified_by:
  name: Linode
published: 2020-01-23
title: 'How to Upgrade from CentOS 7 to CentOS 8'
h1_title: "Upgrading from CentOS 7 to CentOS 8"
---

CentOS 8 was released on X.
Although there is a script to "upgrade in place" this is not recommended. Instead it is generally recommended to backup your data, spin up a new server with CentOS 8, and migrate your data. This guide will show you how to make this process as quick and easy as possible. //make this better

## In This Guide


## Before You Begin


## Back Up Your Data
// back up your data in one of two ways
// use the backup service [Linode's Backup Service](/docs/platform/linode-backup-service/)
// back up manually [Backing Up Your Data](/docs/security/backups/backing-up-your-data/)    // took snapshot

## Create a New Deployment
1.  In Cloud Manager, click on the Linode that currently has CentOS 7 installed.

1.  Click on the **Rebuild** tab.

1.  From the **Images** drop down menu, select the CentOS 8 image and enter a Root Password. Optionally, add an SSH key.

1.  Click the **Rebuild** Button. This will create a new CentOS 8 disk and configuration profile. You can read more about configuration profiles in the [Disk Images and Configuration Profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles/) guide.

1.  Once the rebuild has completed, click **Resize** tab. Turn off Auto Resize Disk.

![]()

1.  Shut down the Linode by clicking on the status icon and choosing **Power Off** from the drop down menu.

1.  Click the **Disks/Configs** tab.

1.  Resize the CentOS 8 Disk by clicking the **More Options Ellipses** and choosing the Resize option from the drop down menu.

![]()

1.  Leave enough space to make a new disk for your backup.

1.  Click **Backups** tab and click the **More Options Ellipses** next to the backup you created and select **Restore to Existing Linode** from the drop down menu.

![]()

1.  Select the current Linode and leave the box for **Overwrite Linode** unchecked. Then click the **Restore** button.

1.  This will create two new disks, one for the main disk and one swap, and a new cofiguration profile. All will have *Restore* at the beginning of their names.

![]()

## Move Your Data

1.  When the restore has completed, click the **Disks/Configs** tab.

1.  Edit the CentOS 8 Disk Configuration by clicking the **More Options Ellipses** and choosing **Edit** from the drop down menu.

1.  The Edit Linode Configuration Panel will open. In the **Block Device Assignment** section add the *Restore CentOS 7* disk to `/dev/sdc`. Click the **Submit** button to save this change.

![]()

1.  Click the **More Options Ellipses** for the CentOS 8 Disk Configuration and select **Boot This Config** from the drop down menu.

![]()

1.  Now you can SSH into your server. Don't forget to [secure your new installation](/docs/security/securing-your-server/).

1.  Mount your old CentOS 7 drive:

// this needs more - mount point etc.

        mount /dev/sdc

1.  Your files should be listed under the directory `/media/sdc`. You can copy them with `cp`.

## Upgrade in Place
// reasons why this isn't recommended and a warning but maybe a link to a script that people are using
