---
slug: how-to-use-block-storage-with-your-linode
author:
  name: Linode
  email: docs@linode.com
description: This tutorial explains how to use Linode's block storage service.
keywords: ["block storage", " volume", "media", "resize", "storage", "disk"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-02-01
modified_by:
  name: Linode
published: 2018-08-17
aliases: ['/platform/block-storage/how-to-use-block-storage-with-your-linode/','/platform/block-storage/how-to-use-block-storage-with-your-linode-new-manager/','/platform/block-storage/how-to-use-block-storage-with-your-linode-classic-manager/','/platform/how-to-use-block-storage-with-your-linode/']
title: How to Use Block Storage with Your Linode
---

Linode’s Block Storage service allows you to attach additional storage Volumes to your Linode. A single Volume can range from 10 GiB to 10,000 GiB in size and costs $0.10/GiB per month. They can be partitioned however you like and can accommodate any filesystem type you choose.

You can attach up to eight Volumes per Linode. Both your Linode plan's standard disks and Block Storage Volumes count towards this total, including swap devices. The volumes can be newly created or already existing, so you do not need to recreate your server to add a Block Storage Volume.

The Block Storage service is currently available in the Dallas, Fremont, Frankfurt, London, Newark, Tokyo, Toronto, Mumbai, Singapore, and Sydney data centers.

{{< caution >}}
-  Linode's backup services do not cover Block Storage Volumes. You must execute [your own backups](/docs/security/backups/backing-up-your-data/) for this data.

-  Your Linode must be running in Paravirtualization mode. Block storage currently does not support Full-virtualization.
{{< /caution >}}

## How to Add a Block Storage Volume to a Linode

This guide assumes a Linode with the root disk mounted as `/dev/sda` and swap space mounted as `/dev/sdb`. In this scenario, the Block Storage Volume will be available to the operating system as `/dev/disk/by-id/scsi-0Linode_Volume_EXAMPLE`, where `EXAMPLE` is a label you assign the Volume in the Linode Cloud Manager. Storage Volumes can be added when your Linode is already running, and will show immediately in `/dev/disk/by-id/`.

{{< note >}}
A Linode can have multiple Block Storage Volumes attached to it. However, a Block Storage Volume can only be attached to one Linode at a time.
{{</ note >}}

### Add a Volume from the Linode Detail Page

{{< content "add-block-storage-volume-shortguide" >}}

### Attach a Volume from Your Account's Volume List

{{< content "attach-block-storage-volume-shortguide" >}}

## How to Detach a Block Storage Volume from a Linode

{{< content "detach-block-storage-volume-shortguide" >}}

## How to Delete a Block Storage Volume

{{< content "delete-block-storage-volume-shortguide" >}}

## How to Resize a Block Storage Volume

{{< content "resize-block-storage-volume-shortguide" >}}

## How to Transfer a Volume to a New Linode

{{< content "transfer-block-storage-volume-shortguide" >}}

## How to Transfer Block Storage Data Between Data Centers

{{< content "transfer-block-storage-datacenter-shortguide" >}}

## Where to Go From Here?

Need ideas for what to do with space? We have several guides which walk you through installing software that would make a great pairing with large storage Volumes:

- [Install Seafile with NGINX on Ubuntu 16.04](/docs/applications/cloud-storage/install-seafile-with-nginx-on-ubuntu-1604/)

- [Install Plex Media Server on Ubuntu 16.04](/docs/applications/media-servers/install-plex-media-server-on-ubuntu-16-04/)

- [Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm](/docs/applications/big-data/big-data-in-the-linode-cloud-streaming-data-processing-with-apache-storm/)

- [Using Subsonic to Stream Media From Your Linode](/docs/applications/media-servers/install-subsonic-media-server-on-ubuntu-or-debian/)

- [Install GitLab on Ubuntu 14.04](/docs/development/version-control/install-gitlab-on-ubuntu-14-04-trusty-tahr/)
