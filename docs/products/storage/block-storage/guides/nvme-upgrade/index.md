---
author:
  name: Linode
  email: docs@linode.com
title: "NVMe Block Storage Upgrade"
description: "Information about the new NVMe Block Storage product and how to upgrade a Volume."
---

## What is NVMe-backed Block Storage?

We’re rolling out an ultra-fast, better-performing, and more reliable NVMe-backed Block Storage service across all 11 of our global data centers. NVMe (nonvolatile memory express) is the hardware interface for next-generation SSDs (solid-state drives). The technology is a significant improvement over traditional spinning hard disk drives, with a 10-20x increase in throughput and up to 2000x improvement in IOPS. With NVMe-backed Block Storage, you can experience a significant performance upgrade for database storage and other tasks where high storage speeds and consistency are critical.

To learn more about Block Storage, visit the [Block Storage Overview](/docs/products/storage/block-storage/) page.

## Availability

**NVMe Block Storage** has already been deployed to a few of our data centers, as indicated in the table below. NVMe Block Storage infrastructure upgrades will soon be deployed across the remaining data centers in our fleet.

| Data Center | NVMe Block Storage |
| -- | -- |
| **Atlanta (Georgia, USA)** | **Deployed** |
| Dallas (Texas, USA) | *Coming soon* |
| **Frankfurt (Germany)** | **Deployed** |
| Fremont (California, USA) | *Coming soon* |
| London (United Kingdom) | *Coming soon* |
| Mumbai (India) | *Coming soon* |
| **Newark (New Jersey, USA)** | **Deployed** |
| Singapore | *Coming soon* |
| Sydney (Australia) | *Coming soon* |
| Tokyo (Japan) | *Coming soon* |
| **Toronto (Canada)** | **Deployed** |

Once NVMe Block Storage has been deployed in a data center, all *new* Volumes created after will use the new NVMe architecture.

## Upgrading a Volume to NVMe Block Storage

Existing Volumes can be upgraded to NVMe soon after NVMe Block Storage has been deployed within a data center. Once NVMe upgrades are available, our team will schedule a migration for each eligible Volume on your account. You will receive a notification detailing the Volumes scheduled to be upgraded along with their migration schedule. You can view your scheduled upgrades on the [Account > Maintenance](https://cloud.linode.com/account/maintenance/) page of the Cloud Manager under the *Volumes* section. You can also choose to immediately enter the upgrade queue *after* the migration has been scheduled by following the instructions below:

1.  Log in to the Cloud Manager and navigate to the [Volumes](https://cloud.linode.com/volumes) page.

1.  Click the **Upgrade to NVMe** button next to the Volume you wish to upgrade. If this button does not appear next to your desired *non-NVMe* Volume, the Volume is not yet eligible for an upgrade.

    ![A list of Volumes with a red box highlighting the NVMe upgrade button](nvme-volume-upgrade.png)

1.  A confirmation pop-up is displayed notifying you of the upgrade details. Click the **Enter Upgrade Queue** button to continue. The Volume will be upgraded shortly, though the length of time the upgrade process takes depends on the number of other Volumes that are also in the upgrade queue as well as the size of your Volume.

{{< note >}}
If the Volume is attached to a Linode Compute Instance during the upgrade process, the Compute Instance may be rebooted to complete the upgrade. If this occurs, it will return to its last known power state.
{{</ note >}}

## Frequently Asked Questions

### What are the performance benefits of NVMe Block Storage?

The table below displays the performance you can expect from NVMe-backed Block Storage. Performance is automatically increased in 60 second bursts for even faster real-world speeds.

| | IOPS | Throughput |
| -- | -- | -- |
| **Standard** | 8,000 | 350 MB/s |
| **Burst** | 12,000 | 525 MB/s |

For detailed benchmarks along with comparisons to other Cloud providers, review the [Cloud Block Storage Benchmark Report](https://www.linode.com/content/cloud-block-storage-benchmarks/) prepared by Cloud Spectator.

### How much extra will NVMe-backed Block Storage cost?

We were able to provide a tremendous performance boost with NVMe Block Storage at **no additional charge.** Block Storage will remain priced at $0.10/GB per month.

### How can I determine if my Volume uses NVMe storage?

All Volumes using the newer NVMe-backed Block Storage will display an *NVMe* label next to the Volume on the [Volumes](https://cloud.linode.com/volumes) page of the Cloud Manager. This should look similar to the following:

![A list of Volumes with a red box highlighting the NVMe label](nvme-volume-list.png)

### When will my Volume receive an upgrade to NVMe?

Soon after NVMe-backed Block Storage becomes available in your Volume's data center, you will be notified how to upgrade your existing Volumes. We do not yet have a definitive timeline.