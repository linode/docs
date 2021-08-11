---
# Shortguide: How to delete a Block Storage Volume when you no longer need any of the data it stores.

headless: true
show_on_rss_feed: false
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
