---
# Shortguide: Requirements for uploading a custom image file

headless: true
show_on_rss_feed: false
---


- **Raw disk image:** The image file must be a [raw disk image](https://en.wikipedia.org/wiki/IMG_(file_format)) (`.img`). Other file formats will not work.

- **Compressed using gzip:** The image file must be compressed using [gzip](https://en.wikipedia.org/wiki/Gzip) (`.gz`) before uploading it. Other compression algorithms are not compatible.

- **Maximum file size is 5GB:** The maximum size for an image file is 5GB (compressed).

- **Maximum image size is 6GB:**
The maximum uncompressed size of each custom image is 6GB.

- **Pricing considerations:** Custom Images are billed based on the *uncompressed* size of the uploaded image file.

- **For compatibility, use unpartitioned disks formatted with ext3 or ext4 file systems:** [Network Helper](/docs/guides/network-helper/) and other Linode Helpers are compatible with non-partitioned image files formatted using the ext3 or ext4 file systems. Partitioned disks and other file systems may be used, but some manual configuration may be required.