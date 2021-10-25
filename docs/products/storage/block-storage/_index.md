---
title: Block Storage
description: "Linode Block Storage is a scalable, high-speed, resilient and fault tolerant storage service."
toc: true
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Block Storage is a scalable, high-speed, and fault tolerant storage service used to add additional storage to a Linode Compute Instance."
---

{{< content "nvme-block-storage-notice-shortguide" >}}

## Scalable

A Block Storage Volume augments the raw storage capacity of a cloud instance, which can be useful if your storage needs are greater than your computing demands. Because a Volume is scalable, it can adapt as your data grows in size.

## Resilient and Fault Tolerant

Block Storage Volumes are configured with 3x data replication. This built-in redundancy ensures that your data is highly-available and protected from loss. Since Volumes are managed independently of Compute Instances, your data persists even if you delete your attached instance.

## Ultra-Fast Performance

Newer Block Storage deployments are powered entirely by NVMe SSD storage devices. Review the [Availability](#availability) section to learn which data centers utilize this newer **NVMe Block Storage**.

NVMe storage offers dramatically increased performance over standard SATA SSDs, HDDs, or hybrid storage solutions. Performance is also automatically increased in 60 second bursts for even faster real-world speeds. See the table below for both standard and burst performance limits on the new NVMe-only Block Storage:

| | IOPS | Throughput |
| -- | -- | -- |
| **Standard** | 8,000 | 350 MB/s |
| **Burst** | 12,000 | 525 MB/s |

Performance may vary based on the workload and Compute Instance type. Plans with dedicated CPU resources (such as Dedicated CPU or High Memory Compute Instances) will not be impacted by resource contention, though a Shared Compute Instance may be impacted.

{{< note >}}
These performance details are only applicable to newer NVMe-backed Block Storage deployments. Volumes that are still using our older Block Storage solution are less performant.
{{</ note >}}

## Availability

Block Storage is available across [all regions](https://www.linode.com/global-infrastructure/). The newer NVMe-backed Block Storage has been deployed in the Atlanta (USA) and Newark (USA) data centers. See the [NVMe Block Storage Upgrade](/docs/products/storage/block-storage/guides/nvme-upgrade/) guide for additional details regarding this roll out, as well as information on upgrading existing Volumes.

## Plans and Pricing

Block Storage Volumes cost $0.10/GB per month and can range from 10 GB to 10,000 GB in size.

## Limits and Considerations

{{< content "block-storage-limitations-shortguide" >}}