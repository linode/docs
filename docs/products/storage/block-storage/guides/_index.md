---
title: Guides
description: "Find guides on Block Storage basics, Volume management, and other related Block Storage topics."
tab_group_main:
    weight: 30
---

{{< content "nvme-block-storage-notice-shortguide" >}}

## Basics

- [View, Create, and Delete Volumes](/docs/products/storage/block-storage/guides/manage-volumes/): Learn how to view and manage Block Storage Volumes.

- [Attach and Detach Existing Volumes](/docs/products/storage/block-storage/guides/attach-and-detach/): Instructions on attaching and *safely* detaching existing Volumes to (and from) Compute Instances

- [Configure a Volume on a Compute Instance](/docs/products/storage/block-storage/guides/configure-volume/): To use a Volume on a Compute Instance, it needs to first be configured by creating a file system and mounting the device.

- [Resize a Volume](/docs/products/storage/block-storage/guides/resize-volume/): Increase the size of a Block Storage Volume after it has been created.

- [Transfer a Volume to a Different Compute Instance](/docs/products/storage/block-storage/guides/transfer-volume/): Move a Block Storage Volume to a different Compute Instance within the same data center.

- [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/): Volumes are not able to be migrated between data centers. Instead, you can transfer the data from one Volume into another Volume within a data center.

## Going Further

- [Use Cases for Block Storage](/docs/products/storage/block-storage/guides/use-cases/)

- [Boot a Linode from a Block Storage Volume](/docs/products/storage/block-storage/guides/boot-from-a-volume/)

- [Manage Block Storage Volumes with the Linode API](/docs/guides/create-block-storage-volumes-with-the-linode-api/)

### Kubernetes

- [Deploy Persistent Volume Claims with the Linode Block Storage CSI Driver](/docs/guides/deploy-volumes-with-the-linode-block-storage-csi-driver/)

### Third-Party Applications

- [Use a Block Storage Volume with Plex Media Server](/docs/guides/use-block-storage-with-plex-media-server/)

- [Use a Block Storage Volume with Nextcloud](/docs/guides/use-block-storage-volume-with-nextcloud/)

- [Install FreeNAS on a Linode with Block Storage](/docs/guides/freenas-blockstorage/)
