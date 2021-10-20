---
# Shortguide: Block Storage limitations and considerations

headless: true
show_on_rss_feed: false
---

- The minimum size for a Volume is 10GB and the maximum size is 10,000 GB (10 TB).

- To attach a Volume, both the Volume and the Compute Instance must be located in the same data center. Migrating a Volume to a different data center is not directly available at this time. See [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/) for a work-around.

- A combined total of 8 storage devices, including a Linode's local disks and Block Storage Volumes, can be attached to a Linode at the same time.

- Our Backup Service does not cover Block Storage Volumes. You must manage [your own backups](/docs/security/backups/backing-up-your-data/) if you wish to backup data stored on your Volumes.

- A Linode must be running in *Paravirtualization* mode in order to work with our Block Storage service. Block Storage currently does not support *Full-virtualization*.