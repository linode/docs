---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to delete a Linode Object Storage bucket.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Delete a Linode Object Storage Bucket
keywords: ["object storage"]
headless: true
show_on_rss_feed: false
---

{{< note >}}
You can only delete an empty Object Storage bucket. See the [Delete Objects from a Bucket](/docs/platform/object-storage/how-to-use-object-storage/#delete-objects-from-a-bucket) section for information on deleting a bucket's objects using the Cloud Manager.
{{</ note >}}

1.  If you have not already, log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Object Storage** link in the sidebar. A list of all the buckets appears.

1. Click the ellipsis menu corresponding to the bucket you'd like to delete. Then, select **Delete**.

    {{< image src="delete-bucket.png" alt="Delete an Object Storage bucket" title="Delete an Object Storage bucket" >}}

1. A dialog box appears that prompts you to enter the bucket's name as a way to confirm that you'd like to delete the bucket. Type the bucket's name into the text entry field and click **Delete**.

    {{< image src="confirm-bucket-delete.png" alt="Confirm deleting the Object Storage bucket" title="Confirm deleting the Object Storage bucket" >}}

    After the bucket has been deleted, it is no longer be visible on the **Buckets Listing Page**.
