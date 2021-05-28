---
slug: backups-boot-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to boot from a backup with the Linode Backup Service.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Boot From a Backup with the Linode Backup Service
keywords: ["backups"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/disk-images/backups-boot-shortguide/']
---

After the backup has been restored, the disks and configuration profiles will be available to the destination Linode you selected. Select the restored configuration profile and reboot your Linode to start up from the restored disks:

1.  From the **Linodes** page, select the Linode that you restored the backup to. Navigate to the **Disks/Configs** tab.

1.  Select the **more options ellipsis** next to the configuration profile that was restored and select **Boot This Config**.

    ![Navigate to the Configurations section of your Linode's Disks/Configs tab](backups-boot-this-config.png "Navigate to the Configurations section of your Linode's Disks/Configs tab")

The Linode will start from the backup disks. Monitor the notifications area for progress.
