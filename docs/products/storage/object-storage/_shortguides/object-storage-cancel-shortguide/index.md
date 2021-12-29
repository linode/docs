---
slug: object-storage-cancel-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to cancel the Linode Object Storage service.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Cancel the Linode Object Storage Service
keywords: ["object storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/object-storage/object-storage-cancel-shortguide/']
---

The following steps outline how to cancel the Object Storage service from the Cloud Manager.

{{< caution >}}
Cancelling Object Storage deletes all objects and buckets from your account. Consider downloading any important files before continuing.
{{< /caution >}}

1.  Log in to the [Cloud Manager](https://cloud.linode.com/), select **Account** from the left menu, and navigate to the **Settings** tab.

1.  Find the section labeled *Object Storage* and click the **Cancel Object Storage** button.

    ![Cancel Object Storage](cancel-obj.png)

1. A prompt appears asking you to confirm the cancellation. Click **Confirm cancellation** to proceed. Any remaining buckets and objects on your account are deleted and you will no longer be billed for Object Storage.