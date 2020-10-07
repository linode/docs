---
slug: delete-block-storage-volume-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to delete a Block Storage Volume when you no longer need any of the data it stores.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: Delete a Block Storage Volume
keywords: ["block storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/block-storage/delete-block-storage-volume-shortguide/']
---

Follow these steps to delete a Block Storage Volume from the Cloud Manager:

{{< caution >}}
The removal process is irreversible, and the data will be permanently deleted.
{{< /caution >}}

1.  Shut down the attached Linode.

1.  [Detach the Volume](/docs/products/storage/block-storage/guides/detach-volume/).

1.  On the **Volumes** page, click the **more options ellipsis** next to the Volume you would like to delete.

1.  Click **Delete**.

    ![Delete a Volume](bs-cloud-delete-volume-small.png "Delete a Volume")
