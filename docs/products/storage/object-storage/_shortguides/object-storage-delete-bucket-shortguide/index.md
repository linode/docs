---
# Shortguide: How to Delete a Linode Object Storage Bucket

headless: true
show_on_rss_feed: false
---

Follow these steps to delete an Object Storage bucket from the Cloud Manager:

{{< note >}}
You can only delete an empty Object Storage bucket. See the [Delete Objects from a Bucket](/docs/products/storage/object-storage/guides/delete-objects/) how-to for information on deleting a bucket's objects using the Cloud Manager.
{{</ note >}}

1.  If you have not already, log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Object Storage** link in the sidebar. A list of all the buckets appears.

1. Click the ellipsis menu corresponding to the bucket you'd like to delete. Then, select **Delete**.

    ![Delete an Object Storage bucket](delete-bucket.png "Delete an Object Storage bucket")

1. A dialog box appears that prompts you to enter the bucket's name as a way to confirm that you'd like to delete the bucket. Type the bucket's name into the text entry field and click **Delete**.

    ![Confirm deleting the Object Storage bucket](confirm-bucket-delete.png "Confirm deleting the Object Storage bucket")

    After the bucket has been deleted, it is no longer be visible on the **Buckets Listing Page**.
