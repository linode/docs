---
title: Get Started
description: "Get started with Linode Block Storage. Learn to add a new Block Storage volume to a Linode, increase the size of an attached volume, and transfer a Block Storage volume to a new Linode."
tab_group_main:
    weight: 20
modified: 2022-08-24
---

{{< content "nvme-block-storage-notice-shortguide" >}}

Block Storage Volumes are persistent storage devices that can be attached to a Compute Instance and used to store any type of data. They are especially useful for storing website files, databases, media, backups, and *much* more. To get started with Block Storage, create a Volume using the guide below.

- [View, Create, and Delete Volumes](/docs/products/storage/block-storage/guides/manage-volumes/)

Once a Block Storage Volume has been created, it can be attached to any Compute Instance in the same region. Since Volumes are external device, they are portable and can be attached and detached to Compute Instances as needed. Once attached, the device is assigned to an available block device (such as `/dev/sdc`) on a Compute Instance's Configuration Profile and has its own path in your instance's file system. When attaching and detaching a Volume, additional internal configuration is needed to create a file system (if one hasn't already been created), mount or unmount the Volume, and automatically mount the Volume at system boot.

- [Attach and Detach Existing Volumes](/docs/products/storage/block-storage/guides/attach-and-detach/)
- [Configure a Volume on a Compute Instance](/docs/products/storage/block-storage/guides/configure-volume/)

When a Volume is attached to a Compute Instance, you can [log in to that instance](/docs/guides/set-up-and-secure/#connect-to-the-instance) and access the Volume's data through its mount point. For instance, if the Volume was mounted in `/mnt/volume/`, you can navigate to that directly to view any files stored on that Volume. You can also use that directory when integrating your Volume with any software or tooling you might employ.