---
slug: capture-image-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how capture an image with Linode Images.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-04-28
modified_by:
  name: Linode
published: 2020-07-20
title: How to Capture an Image from a Linode
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

1. Log in to the Cloud Manager and open the **[Capture Image](https://cloud.linode.com/images/create/disk)** form by navigating to the **Images** page, clicking the **Create Image** button, and staying on the **Catpure Image** tab.

1. Select your *Linode* and *Disk* from their respective dropdown lists and type in an optional *Label* and *Description* for the Image. If no *Label* is entered, the label for the disk will be used. When selecting a Linode and Disk, keep in mind any limitations that may prevent the Image from creating successfully.

    [![Select the Linode and disk](images-capture.png)](images-capture.png "Select the Linode and disk")

1. Click the **Create** button to start creating the Image. It will take some time to fully complete. You can check the status of this process by navigating to the main **Images** page, finding the new image in the **Manual Images** table, and looking at the *Status* column. If the Image has been captured and processed, the status should be set to *Ready*. The *Size* of the Image is based on the disk's usage, not the size of the disk itself.

    [![Image status](images-capture-status.png)](images-capture-status.png "Image status")
