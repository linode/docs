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

Block Storage Volumes are configured with 3x data replication. This built-in redundancy ensures that your data is highly-available and protected from loss. Since Volumes are managed independently of Compute Instances, your data persists even if you delete your the attached instance.

## Ultra-Fast Performance

Newer Block Storage deployments are powered entirely by NVMe SSD storage devices. Review the [Availability](#availability) section to learn which data centers utilize this newer **NVMe Block Storage**.

NVMe storage offers dramatically increased performance over standard SATA SSDs, HDDs, or hybrid storage solutions. Performance is also automatically increased in 60 second bursts for even faster real-world speeds. See the table below for both standard and burst performance limits on the new NVMe-only Block Storage:

| | IOPS | Throughput |
| -- | -- | -- |
| **Standard** | 8,000 | 350 MB/s |
| **Burst** | 12,000 | 525 MB/s |

Performance may vary based on the workload and Compute Instance type. Plans with dedicated CPU resources (such as Dedicated CPU or High Memory Compute Instances) will not be impacted by resource contention, though a Shared Compute Instance may be impacted.

{{< note >}}
These performance details are only applicable to newer NVMe-only Block Storage deployments. Volumes that are still using our hybrid NVMe and HDD solution are less performant.
{{</ note >}}

## Availability

Block Storage is available across [all regions](https://www.linode.com/global-infrastructure/).

| Data Center | Block Storage Solution | Upgraded to NVMe-only |
| -- | -- | -- |
| **Atlanta (Georgia, USA)** | **NVMe** | **Yes** |
| Dallas (Texas, USA) | Hybrid NVMe and HDD | *No (coming soon)* |
| Frankfurt (Germany) | Hybrid NVMe and HDD | *No (coming soon)* |
| Fremont (California, USA) | Hybrid NVMe and HDD | *No (coming soon)* |
| London (United Kingdom) | Hybrid NVMe and HDD | *No (coming soon)* |
| Mumbai (India) | Hybrid NVMe and HDD | *No (coming soon)* |
| **Newark (New Jersey, USA)** | **NVMe** | **Yes** |
| Singapore | Hybrid NVMe and HDD | *No (coming soon)* |
| Sydney (Australia) | Hybrid NVMe and HDD | *No (coming soon)* |
| Tokyo (Japan) | Hybrid NVMe and HDD | *No (coming soon)* |
| Toronto (Canada) | Hybrid NVMe and HDD | *No (coming soon)* |

**NVMe Block Storage** has been deployed in the Atlanta (USA) and Newark (USA) data centers. This new hardware dramatically increases the performance of Block Storage and is offered at no additional cost. In all other data centers, Block Storage currently utilizes a combination of NVMe storage and HDDs, which is not as performant as the newer NVMe-only solution. Upgrades are planned for the remaining data centers.

### Upgrading a Volume to NVMe-only Block Storage

Existing Block Storage Volumes will soon be eligible for a free upgrade to the newer NVMe-only Block Storage solution. If you have a Block Storage Volume attached to a Linode, you will be notified with instructions to initiate the upgrade soon after NVMe Block Storage becomes available in your data center. This page will also be updated to reflect those instructions. Unattached Volumes will automatically be upgraded at a later date.

## Plans and Pricing

Block Storage Volumes cost $0.10/GB per month and can range from 10 GB to 10,000 GB in size.

## Limits and Considerations

{{< content "block-storage-limitations-shortguide" >}}