---
title: Object Storage
description: "Linode Object Storage is S3-compatible, doesn't require a Linode, and allows you to host static sites."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "An S3-compatible object storage solution designed to store, manage, and access unstructured data in the cloud."
aliases: ['/platform/object-storage/pricing-and-limitations/', '/guides/pricing-and-limitations','/products/storage/object-storage/guides/enable/']
---

Linode's Object Storage is a globally-available, S3-compatible method for storing and accessing data. Object Storage differs from traditional hierarchical data storage, such as a traditional filesystem on a physical/virtual disk and [Block Storage Volumes](/docs/guides/platform/block-storage/). Under Object Storage, files (also called *objects*) are stored in flat data structures (referred to as *buckets*) alongside their own rich metadata.

Due to the nature of Object Storage, **it does not require the use of a Compute Instance.** Instead, Object Storage gives each object a unique URL with which you can access the data. An object can be publicly accessible, or you can set it to be private and only visible to you. This makes Object Storage great for sharing and storing unstructured data like images, documents, archives, streaming media assets, and file backups, and the amount of data you store can range from small collections of files up to massive libraries of information.

## Availability

Object Storage is available within the following data centers:

| Data Center | Cluster ID |
| ------------| --------------------- |
| Atlanta, GA, USA | us-southeast-1 |
| Frankfurt, Germany | eu-central-1 |
| Newark, NJ, USA | us-east-1 |
| Singapore | ap-south-1 |

Cluster IDs correspond with the Object Storage Cluster located in each data center. They are used when [formatting URLs](/docs/products/storage/object-storage/guides/urls/) and integrating Object Storage with tools such as the [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli), [s3cmd](/docs/products/storage/object-storage/guides/s3cmd), [s4cmd](/docs/products/storage/object-storage/guides/s4cmd), and [Cyberduck](/docs/products/storage/object-storage/guides/cyberduck).

## Pricing

Linode Object Storage costs a flat rate of $5 a month, and includes 250 gigabytes of storage. This flat rate is prorated, so if you use Object Storage for a fraction of the month you are charged a fraction of the cost. For example, if you have Object Storage enabled for half of the month and use up to 250 gigabytes of storage you are billed $2.50 at the end of the month. Each additional gigabyte of storage over the first 250 gigabytes costs $0.02, and this usage is also prorated based on usage time.

{{< content "object-storage-cancellation-shortguide" >}}

## Features

### S3 Compatible

Linode Object Storage is a globally-available, S3 Compatible storage solution, maintaining the same performance as your data grows.

### No Linode Necessary

Object storage does not require the use of a Linode. Instead, Object Storage gives each object a unique URL which you can access your data.

### Host Static Sites

Using Object Storage to host your static site files means you do not have to worry about maintaining your site’s infrastructure. It is no longer necessary to perform typical server maintenance tasks, like software upgrades, web server configuration, and security upkeep.

Object Storage provides an HTTP REST gateway to objects, which means a unique URL over HTTP is available for every object. Once your static site is built, making it available publicly over the Internet is as easy as uploading files to an Object Storage bucket.

## Limits

- **Storage space:** The maximum amount of data you can store in *each* cluster is **50 terabytes**.
- **Number of objects:** The maximum amount of objects you can store in *each* cluster is **50 million**.
- **Number of buckets:** You can have up to **1000 buckets** in *each* cluster.
- **Upload file size limit:** 5 gigabytes. The maximum upload size of a single object is *5 gigabytes*, though this can easily be overcome by using multi-part uploads. Both [s3cmd](/docs/products/storage/object-storage/guides/s3cmd) and [cyberduck](/docs/products/storage/object-storage/guides/cyberduck/) will do this for you automatically if a file exceeds this limit as part of the uploading process.
- **Restricted characters:** Objects uploaded to object storage cannot contain the following special characters when using Cloud Manager or the Linode CLI: `" ' < > & + =`
- **Rate limiting:** Users accessing Object Storage resources are limited to **750 requests per second**, per bucket.

{{< note >}}
There is a temporary limit of 5TB per cluster for new Object Storage accounts. If you need to increase the storage limit, the object limit, or the bucket limit, please [open up a Customer Support ticket](/docs/guides/support/#contacting-linode-support).
{{</ note >}}

## Transfer Quotas

Object Storage adds 1 terabyte of outbound data transfer to your data transfer pool. This 1 terabyte of transfer data is prorated. If you use Object Storage for half of a month, only 500 gigabytes of transfer data will be added to your monthly transfer pool. At this time, all outbound data, including data transfer from Object Storage to a Linode in the same data center, is billable.

You are not charged for uploading objects (inbound traffic) to Object Storage, with a few exceptions. Uploading an object to Object Storage from a Linode is almost always billable, as that is considered outbound traffic from the origin Linode. However, uploading an object from a Linode to Object Storage over IPv6 will be free, provided both the Linode and the bucket are hosted in the same data center.  Any further outbound data past your transfer quota is charged at a rate of $0.01 a gigabyte. For more information on network transfer pools, review our [Network Transfer](/docs/guides/network-transfer/) guide.