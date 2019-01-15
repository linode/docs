---
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to download files, database dumps, or whole disks from your Linodes."
keywords: ["download", "files", "disk", "ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-09-25
modified_by:
  name: Linode
published: 2018-09-25
title: Download Files from Your Linode
---

There are a number of open source tools you can use to download files from your Linode. You have the option to either [download specific files and directories](#download-specific-files-or-directories-over-ssh) or [copy complete images](#download-a-disk-over-ssh) of your Linodes' disks.

{{< content "download-files-from-your-linode-shortguide" >}}

## Download Data from a Block Storage Volume

To download data from a Block Storage Volume, you'll first need to attach it to and mount it on a Linode. Once the Volume is mounted, you can download files from it by following the same instructions in the [Download Specific Files or Directories over SSH](#download-specific-files-or-directories-over-ssh) section of this guide. If you are not familiar with how to attach a Volume to a Linode, review Linode's [Block Storage](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/) guide.