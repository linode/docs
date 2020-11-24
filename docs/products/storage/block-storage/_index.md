---
title: Block Storage
description: "Linode Block Storage is a scalable, high-speed, resilient and fault tolerant storage service."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Linode’s Block Storage service lets you increase your Linode’s storage capacity by attaching additional high-speed volumes. Volumes are managed independently of Linodes, so your data persists even if you delete your Linode."
---

## Availability

Dallas, TX, USA; Mumbai, India; Toronto, Canada; Sydney, Australia; Fremont, CA, USA; Newark, NJ, USA; London, United Kingdom; Singapore, Singapore; Frankfurt, Germany; Tokyo, Japan

{{< note >}}
To attach a Block Storage Volume to a Linode, the Volume and the Linode must be located in the same data center.
{{< /note >}}

## Features

A Block Storage Volume augments the raw storage capacity of a cloud instance, which can be useful if your storage needs are greater than your computing demands. Because a Volume is scalable, it can adapt as your data grows in size. Additionally, all data stored with Linode Block Storage is replicated three times, so your Volumes are highly available and fault tolerant.

-   Create hot-swappable drives with Block Storage when you need to perform the same kind of tasks across a fleet of instances with the same data.
-   Provide persistent storage to your containers when using Docker or Kubernetes.
-   Store your media library files in Block Storage Volume and increase its size as your library grows.
-   Create backups of your data that are scalable and easily transferable between Linodes.

### Resilient and Fault Tolerant

Block storage volumes are configured with 3x data replication. This replication, ensures that your data is highly-available.

### High-Speed Storage

Linode Block Storage is powered by a combination of large capacity HDDs and ultra-fast NVMe drives, offering a balance between price, performance, and capacity.

## Scalable Storage

A Block Storage Volume augments the raw storage capacity of a cloud instance, which can be useful if your storage needs are greater than your computing demands. Because a Volume is scalable, it can adapt as your data grows in size.

## Plans and Pricing

Block Storage Volumes cost $0.10/GiB per month and can range from 10 GiB to 10,000 GiB in size. When you create your Block Storage Volume you can designate its storage capacity and resize it up, if needed.