---
slug: capture-image-requirements-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that lists all requirements for capturing an image.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-04-28
modified_by:
  name: Linode
published: 2021-04-28
title: Requirements for Capturing an Image
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

- **Disk must be formatted using ext3/ext4 filesystems.** Images cannot be created if you are using raw disks or disks that have been formatted using custom filesystems. CoreOS disk images are in RAW format. Images made from CoreOS disks can't be used to deploy new Linodes.

- **Power off Linode to avoid database corruption.** If your Linode is running any active databases, it's recommended to power off the Linode down prior to creating the image. Creating an image that includes a running database can cause corruption or data loss in the imaged copy of the database.

- **Only the selected disk is saved to the Image.** The Image is comprised only of the disk selected during the creation process. The Image does not store other aspects of the Linode, such as Configuration Profiles, Block Storage Volumes, IP Addresses, and other Linode-based settings.