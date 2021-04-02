---
slug: images-capture-image-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how capture an image with Linode Images.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Capture a Linode Disk Image
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/disk-images/images-capture-image-shortguide/']
---

Linode Images captures an exact copy of your disk at the moment when the process is kicked off. This section shows you how to create an image from an existing Linode.

{{< note >}}
- If your Linode is running any active databases, we recommend shutting your Linode down prior to capturing your image. Capturing an image that includes a running database can cause corruption or data loss in the imaged copy of the database.

- Linode Images are limited to 6144MB of data per disk. Ensure that the data within your disk does not exceed this size limit.

- Linode Images cannot be created if you are using raw disks or disks that have been formatted using custom filesystems.

- When an image is created, it is the smallest possible size based on the data present on the disk rather than the full Disk Allocation.
{{< /note >}}

1.  Navigate to your the Images page in the Linode Cloud Manager and select **Add an Image**.

    ![Select 'Add an Image'](images-add-an-image.png "Select 'Add an Image'")

1.  In the **Create an Image** menu select the Linode and disk you would like to freeze, and provide a label. You may also add an optional description of the image. Then, click **Create**.

    ![Create an Image menu](images-create-image-menu.png "Create an Image menu")

    {{< caution >}}
CoreOS disk images are in RAW format. Images made from CoreOS disks can't be used to deploy new Linodes.
{{< /caution >}}

1.  Once you click the **Create** button, your image is frozen for later use. You can view the progress under the bell notifications at the top of the page.

    ![Image creation status under the bell notifications](images-image-being-created.png "Image creation status under the bell notifications")

    Once the job has completed, your Linode's disk is captured, stored, and can be used to [deploy new Linode instances from your saved image](/docs/products/tools/images/guides/deploy-from-a-saved-image/).
