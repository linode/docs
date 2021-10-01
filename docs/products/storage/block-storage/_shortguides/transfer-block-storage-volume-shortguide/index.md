---
# Shortguide: How to transfer a Block Storage Volume to a different Linode

headless: true
show_on_rss_feed: false
---

Follow these steps to move a Block Storage Volume to a different Linode Compute Instance *within the same data center*.

{{< note >}}
Volumes cannot be attached to Linodes that are in a different data center. See the [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/) guide for help with migrating data on a Volume to a different data center.
{{< /note >}}

1. Detach the Volume from the original Linode. See [Detach a Block Storage Volume from a Linode](/docs/products/storage/block-storage/guides/detach-volume/) for instructions.

1. Attach the Volume to the desired Linode within the same data center as the original Linode. See [Attach a Block Storage Volume to a Linode](/docs/products/storage/block-storage/guides/attach-volume/) for instructions.