---
# Shortguide: How to delete a Block Storage Volume when you no longer need any of the data it stores.

headless: true
show_on_rss_feed: false
---

Follow these steps to delete a Block Storage Volume from the Cloud Manager.

{{< caution >}}
Once a Block Storage Volume has been deleted, the data contained on that Volume will be permanently erased. This action cannot be reversed.
{{< /caution >}}

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes).

1.  If the Volume is attached to a Linode, power off that Linode and detach the Volume. To do so, follow the instructions within the [Detach the Volume](/docs/products/storage/block-storage/guides/detach-volume/) guide.

1.  Click on the **Volumes** link in the sidebar.

1.  Locate the desired Volume within the list, click the **more options ellipsis** dropdown menu, and select **Delete**.

1.  In the configuration dialog, click **Delete** once again.