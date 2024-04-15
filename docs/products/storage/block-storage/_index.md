---
title: Block Storage
title_meta: "Block Storage Product Documentation"
description: "Linode Block Storage is a scalable, high-speed, resilient and fault tolerant storage service."
toc: true
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Block Storage is a scalable, high-speed, and fault tolerant storage service used to add additional storage to a Linode Compute Instance."
modified: 2024-04-15
aliases: ['/platform/block-storage/how-to-use-block-storage-with-your-linode/','/platform/block-storage/how-to-use-block-storage-with-your-linode-new-manager/','/platform/block-storage/how-to-use-block-storage-with-your-linode-classic-manager/','/platform/how-to-use-block-storage-with-your-linode/','/platform/block-storage/','/guides/platform/block-storage/','/guides/how-to-use-block-storage-with-your-linode/']
---

Linode's Block Storage service provides a method of adding additional storage drives to Compute Instances, enabling you to store more data without resizing your Compute Instance to a larger plan. These storage drives, called *Volumes*, can be formatted with any Linux-compatible file system and attached and mounted to a Compute Instance.

## Scalable

A Block Storage Volume augments the raw storage capacity of a cloud instance, which can be useful if your storage needs are greater than your computing demands. Because a Volume is scalable, it can adapt as your data grows in size.

## Resilient and Fault Tolerant

Block Storage Volumes are configured to be durable and fault tolerant using erasure coding, ensuring that your data is protected from loss. Since Volumes are managed independently of Compute Instances, your data persists even if you delete your attached instance.

## Ultra-Fast Performance

Block Storage is powered entirely by NVMe SSD storage devices (except within the Fremont data center). NVMe storage offers dramatically increased performance over standard SATA SSDs, HDDs, or hybrid storage solutions. Additionally, performance is automatically increased in 60 second bursts for even faster real-world speeds. See the table below for both sustained and burst performance limits on NVMe-only Block Storage:

| Performance Metric | IOPS | Throughput |
| -- | -- | -- |
| **Sustained** | 8,000 | 350 MB/s |
| **Burst** | 12,000 | 525 MB/s |

Performance may vary based on the workload and Compute Instance type. Plans with dedicated CPU resources (such as Dedicated CPU or High Memory Compute Instances) will not be impacted by resource contention, though a Shared Compute Instance may be impacted.

## Availability

Block Storage is available across [all regions](https://www.linode.com/global-infrastructure/). Additionally, the newer NVMe-backed Block Storage has been deployed to all data centers with the exception of Fremont.

## Plans and Pricing

Block Storage Volumes start at $0.10/GB per month ($0.00015/GB per hour) and can range from 10 GB to 10 TB in size. [Pricing](https://www.linode.com/pricing/) for Block Storage may vary between data centers.

## Technical Specifications

- Minimum size for a Volume is 10 GB and the maximum size is 10,240 GB (10 TB).
- Backed by high speed NVMe storage in *most* data centers, excluding Fremont.
- **Throughput**: Up to 350 MB/s sustained and 525 MB/s in 60 second bursts
- **IOPS**: Up to 8,000 sustained and 12,000 in 60 second bursts
- Built in redundancy maximizes availability and reduces possibility for data loss

## Limits and Considerations

- A Compute Instance can have multiple Volumes attached to it, but a Volume can only be attached to one Compute Instance at a time. To attach a Volume, both the Volume and the Compute Instance must be located in the same data center. Migrating a Volume to a different data center is not directly available at this time. See [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/) for a work-around.

- A combined total of 8 storage devices can be attached to a Compute Instance at the same time, including local disks and Block Storage Volumes. For example, if your Compute Instance has two main disks, root and swap, you can attach no more than 6 additional volumes to this Compute Instance.

- The maximum combined size of all Volumes on an account defaults to a limit of 100 TiB of block capacity per account per region. If you plan on exceeding this amount, contact [Support](https://www.linode.com/support/) to request an increase.

- You can attach Block Storage volumes to a Compute Instance in Full Virtualization mode only after you Power Off the Compute Instance. For further steps, see [Attach a Volume](/docs/products/storage/block-storage/guides/attach-and-detach/).

- Our Backup Service does not cover Block Storage Volumes. You must manage [your own backups](/docs/guides/backing-up-your-data/) if you wish to backup data stored on your Volumes.
