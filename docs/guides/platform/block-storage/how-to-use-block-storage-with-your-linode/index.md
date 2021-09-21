---
slug: how-to-use-block-storage-with-your-linode
author:
  name: Linode
  email: docs@linode.com
description: This tutorial explains how to use Linode's block storage service.
keywords: ["block storage", " volume", "media", "resize", "storage", "disk"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-08-11
modified_by:
  name: Linode
published: 2018-08-17
aliases: ['/platform/block-storage/how-to-use-block-storage-with-your-linode/','/platform/block-storage/how-to-use-block-storage-with-your-linode-new-manager/','/platform/block-storage/how-to-use-block-storage-with-your-linode-classic-manager/','/platform/how-to-use-block-storage-with-your-linode/']
title: How to Use Block Storage with Your Linode
---

{{< content "nvme-block-storage-notice-shortguide" >}}

Linode’s Block Storage service allows you to attach additional storage drives (called *Volumes*) to your Linode. A single Volume can range from 10 GB to 10,000 GB in size and costs $0.10/GB per month. Each Volume be partitioned however you like and can accommodate any file system type you choose. Additional pricing details as well as availability, features, and limitations can be found on the [Block Storage Overview](/docs/products/storage/block-storage/) product guide.

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

## How to Transfer Block Storage Data Between Data Centers

{{< content "transfer-block-storage-datacenter-shortguide" >}}

## Limitations and Considerations

{{< content "block-storage-limitations-shortguide" >}}

## Where to Go From Here?

Need ideas for what to do with space? We have several guides which walk you through installing software that would make a great pairing with large storage Volumes:

- [Install Seafile with NGINX on Ubuntu 16.04](/docs/applications/cloud-storage/install-seafile-with-nginx-on-ubuntu-1604/)

- [Install Plex Media Server on Ubuntu 16.04](/docs/applications/media-servers/install-plex-media-server-on-ubuntu-16-04/)

- [Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm](/docs/applications/big-data/big-data-in-the-linode-cloud-streaming-data-processing-with-apache-storm/)

- [Using Subsonic to Stream Media From Your Linode](/docs/applications/media-servers/install-subsonic-media-server-on-ubuntu-or-debian/)

- [Install GitLab on Ubuntu 14.04](/docs/development/version-control/install-gitlab-on-ubuntu-14-04-trusty-tahr/)
