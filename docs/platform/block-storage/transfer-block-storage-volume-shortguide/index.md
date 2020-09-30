---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to safely detach your Volume from a Linode and attach it to a different Linode.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: Transfer Your Block Storage to Another Linode
keywords: ["block storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

1. Follow the steps to safely detach your volume as mentioned in [How to Detach a Block Storage Volume from a Linode]
(/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/#how-to-detach-a-block-storage-volume-from-a-linode).

1.   Click the **more options ellipsis** to open the menu for the Volume you want to attach to a Linode and select **Attach**:

    {{< image src="bs-cloud-attach-volume.png" alt="Open Volume menu" title="Open Volume menu" >}}

1.   Since the Volume already has a filesystem on it, create a mountpoint for the new Linode, provided it hasn't already been created:

        mkdir /mnt/BlockStorage1

1.   Mount the new Volume, where FILE_SYSTEM_PATH is your Volume’s file system path:

        mount FILE_SYSTEM_PATH /mnt/BlockStorage1

1.  If you want to mount the new Volume automatically every time your Linode boots, you'll want to add the following line to your **/etc/fstab** file:

        FILE_SYSTEM_PATH /mnt/BlockStorage1 ext4 defaults 0 2
