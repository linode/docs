---
slug: download-files-from-your-linode
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to download files, database dumps, or whole disks from your Linodes."
keywords: ["download", "files", "disk", "ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-01-15
modified_by:
  name: Linode
published: 2018-09-25
title: Download Files from Your Linode
tags: ["security"]
aliases: ['/security/data-portability/download-files-from-your-linode/']
---

There are a number of open source tools you can use to download files from your Linode. You have the option to either [download specific files and directories](#download-specific-files-or-directories-over-ssh) or [copy complete images](#download-a-disk-over-ssh) of your Linodes' disks.

{{< content "download-files-from-your-linode-shortguide" >}}

## Download Data from a Block Storage Volume

1. [Attach and mount](/docs/products/storage/block-storage/guides/attach-and-detach/) the block storage volume.

2. Download files from it by following the same instructions in the [Download Specific Files or Directories over SSH](#download-specific-files-or-directories-over-ssh) section of this guide.