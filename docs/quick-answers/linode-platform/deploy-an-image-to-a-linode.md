---
author:
  name: Nick Brewer
  email: docs@linode.com
description: 'Select and deploy the Linux distribution of your choice.'
keywords: ["linux", "linode manager", "image"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-05-08
modified_by:
  name: Linode
published: 2017-05-08
title: Deploy an Image to a Linode
---

This QuickAnswer will show you how to deploy a Linux distribution to your Linode. See our [Getting Started](/docs/getting-started) and [Disks and Configuration Profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles) guides for additional information.

1.  Once you've created your Linode, select it from the **Linodes** tab to access the Dashboard. Click on **Deploy an Image**:

    [![Linux Dashboard](/docs/assets/linode-manager-dashboard-newacct_small.png)](/docs/assets/linode-manager-dashboard-newacct.png)

    The *Deploy* page will open:

    [![Deploy a Linux Image](/docs/assets/linode-manager-deploy-an-image_small.png)](/docs/assets/linode-manager-deploy-an-image.png)

2.  Select a Linux distribution from the **Image** menu.

3.  Enter a size for the disk in the **Deployment Disk Size** field. By default, all of the available space on your Linode is allocated. Note that the minimum deployment size for you distribution is listed under the disk size field - in this example the minimum is **900MB** for a Debian 8 image.

4.  Select a swap disk size from the **Swap Disk** menu. Unless you have a specific reason to use more, the default **256MB** is recommended.

5. Enter a root password for your Linode in the **Root Password** field. This password must be provided when you log in to your Linode via SSH; it must be at least 6 characters long and contain at least two of the following:

    -   lowercase and uppercase case letters
    -   numbers
    -   punctuation marks

6.  Click **Deploy**. You can monitor the progress of your distribution deployment from the Linode's job queue. Once it completes, click the **Boot** button to boot your Linode.
