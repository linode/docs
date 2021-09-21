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
    product_description: "Linode’s Block Storage service lets you increase your Linode’s storage capacity by attaching additional high-speed volumes. Volumes are managed independently of Linodes, so your data persists even if you delete your Linode."
---

{{< content "nvme-block-storage-notice-shortguide" >}}

## Availability

Block Storage is available across [all regions](https://www.linode.com/global-infrastructure/).

**NVMe Block Storage** has been deployed in the Atlanta (USA) data center. In all other data centers, Block Storage currently utilizes a combination of NVMe storage and HDDs, which is not as performant as the newer NVMe-only solution. Upgrades are planned for the remaining data centers.

{{< note >}}
To attach a Block Storage Volume to a Linode, the Volume and the Linode must be located in the same data center.
{{< /note >}}

## Plans and Pricing

Block Storage Volumes cost $0.10/GB per month and can range from 10 GB to 10,000 GB in size.

## Features

A Block Storage Volume augments the raw storage capacity of a cloud instance, which can be useful if your storage needs are greater than your computing demands. Because a Volume is scalable, it can adapt as your data grows in size. Additionally, all data stored with Linode Block Storage is replicated three times, so your Volumes are highly available and fault tolerant.

-   Create hot-swappable drives with Block Storage when you need to perform the same kind of tasks across a fleet of instances with the same data.
-   Provide persistent storage to your containers when using Docker or Kubernetes.
-   Store your media library files in Block Storage Volume and increase its size as your library grows.
-   Create backups of your data that are scalable and easily transferable between Linodes.

### Resilient and Fault Tolerant

Block Storage Volumes are configured with 3x data replication. This built-in redundancy ensures that your data is highly-available and protected from loss.

### High-Speed Performance

Block Storage is powered entirely by NVMe SSDs storage devices. NVMe storage offers dramatically increased performance over standard SSDs, HDDs, or hybrid storage solutions.

{{< note >}}
**NVMe Block Storage** has been deployed to the Atlanta (USA) data center. All other data centers currently utilize a combination of NVMe SSDs and HDDs. This hybrid storage solution is less performant.
{{</ note >}}

### Scalable

A Block Storage Volume augments the raw storage capacity of a cloud instance, which can be useful if your storage needs are greater than your computing demands. Because a Volume is scalable, it can adapt as your data grows in size.

## Limits and Considerations

{{< content "block-storage-limitations-shortguide" >}}