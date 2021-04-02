---
slug: linode-images
author:
  name: Linode
  email: docs@linode.com
description: Linode Images allows you to take snapshots of your disks, and then deploy them to any Linode under your account. This can be useful for bootstrapping a master image for a large deployment, along with other use cases.
og_description: Linode Images allows you to take snapshots of your disks, and then deploy them to any Linode under your account. This can be useful for bootstrapping a master image for a large deployment, along with other use cases.
keywords: ["linode Images", "imagize"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linode-images/','/platform/disk-images/linode-images/','/platform/disk-images/linode-images-classic-manager/','/platform/linode-images/','/platform/disk-images/linode-images-new-manager/']
modified: 2018-08-22
modified_by:
  name: Linode
published: 2014-09-25
title: Linode Images
---

{{< youtube UNlJUzQrBBI >}}

*Linode Images* allows you to take snapshots of your disks, and then deploy them to any Linode under your account. This can be useful for bootstrapping a master image for a large deployment, or retaining a disk for a configuration that you may not need running, but wish to return to in the future. Linode Images will be retained whether or not you have an active Linode on your account, which also makes them useful for long term storage of a private template that you may need in the future. There is no additional charge to store Images for Linode users. Images are limited to 6GB per Image and 3 Images per account. Additionally, images can only be created on disks with ext3 or ext4 filesystems with a single partition.

{{< note >}}
When saving a Linode image, it is the aspects of the Linode that are on the **disk** that are saved, not any additional aspects such as IP addresses, fully qualified domain names, and MAC addresses.
{{< /note >}}

## Capturing Your Image

{{< content "images-capture-image-shortguide" >}}

## Managing Your Images

{{< content "images-manage-images-shortguide" >}}

## Deploy From A Saved Image

{{< content "images-deploy-from-image-shortguide" >}}
