---
slug: upload-image-requirements-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that lists all requirements for uploading an image file.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-04-28
modified_by:
  name: Linode
published: 2021-04-28
title: Requirements for Uploading an Image
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

- **Raw disk image:** The image file must be a [raw disk image](https://en.wikipedia.org/wiki/IMG_(file_format)) (`.img`). Other file formats will not work.

- **Compressed using gzip:** The image file must be compressed using [gzip](https://en.wikipedia.org/wiki/Gzip) (`.gz`) before uploading it. Other compression algorithms are not compatible.

- **Maximum file size is 5GB:** The maximum size for an image file is 5GB (compressed).

- **Pricing considerations:** Once pricing goes into effect, you will be charged for the *uncompressed* size of the Image.

- **For compatibility, use unpartitioned disks formatted with ext3 or ext4 file systems:** [Network Helper](/docs/guides/network-helper/) and other Linode Helpers are compatible with non-partitioned image files formatted using the ext3 or ext4 file systems. Partitioned disks and other file systems may be used, but some manual configuration may be required.