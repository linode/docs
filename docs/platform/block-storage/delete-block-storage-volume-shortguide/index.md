---
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
---

{{< caution >}}
The removal process is irreversible, and the data will be permanently deleted.
{{< /caution >}}

1.  Shut down the attached Linode.

1.  Detach the Volume as described [above](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/#how-to-detach-a-block-storage-volume-from-a-linode).

1.  On the **Volumes** page, click the **more options ellipsis** next to the Volume you would like to delete.

1.  Click **Delete**.

    {{< image src="bs-cloud-delete-volume-small.png" alt="Delete a Volume" title="Delete a Volume" >}}
