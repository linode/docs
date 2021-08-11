---
# Shortguide: Block Storage limitations and considerations

headless: true
show_on_rss_feed: false
---

- The minimum size for a Volume is 10GiB and the maximum size is 10,000 GiB (10 TiB)

- A combined total of 8 storage devices, including a Linode's local disks and Block Storage Volumes, can be attached to a Linode at the same time.

- Our Backup Service does not cover Block Storage Volumes. You must manage [your own backups](/docs/security/backups/backing-up-your-data/) if you wish to backup data on your Volumes.

- A Linode must be running in *Paravirtualization* mode in order to work with our Block Storage service. Block Storage currently does not support *Full-virtualization*.