---
title: Object Storage
title_meta: "Object Storage Product Documentation"
description: "Linode Object Storage is S3-compatible, doesn't require a Linode, and allows you to host static sites."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "An S3-compatible object storage solution designed to store, manage, and access unstructured data in the cloud."
modified: 2022-11-16
aliases: ['/platform/object-storage/pricing-and-limitations/', '/guides/pricing-and-limitations','/products/storage/object-storage/guides/enable/']
---

{{< note >}}
On June 30th 2023, Akamai released three additional data centers: Chicago (USA), Paris (France), and Washington, DC (USA). Customers can leverage these data centers to deploy the full suite of Akamai's cloud computing services. In addition, Premium plans and upgraded Object Storage clusters are only available in these new data centers. Existing data centers will receive these features in the future as part of planned upgrades.
{{< /note >}}

Linode's Object Storage is a globally-available, S3-compatible method for storing and accessing data. Object Storage differs from traditional hierarchical data storage, such as a traditional filesystem on a physical/virtual disk and [Block Storage Volumes](/docs/products/storage/block-storage/). Under Object Storage, files (also called *objects*) are stored in flat data structures (referred to as *buckets*) alongside their own rich metadata.

Due to the nature of Object Storage, **it does not require the use of a Compute Instance.** Instead, Object Storage gives each object a unique URL with which you can access the data. An object can be publicly accessible, or you can set it to be private and only visible to you. This makes Object Storage great for sharing and storing unstructured data like images, documents, archives, streaming media assets, and file backups, and the amount of data you store can range from small collections of files up to massive libraries of information.

## Features

### S3 Compatible

Linode Object Storage is a globally-available, S3 Compatible storage solution, maintaining the same performance as your data grows.

### No Compute Instance Required

Object storage does not require the use of a Compute Instance. Instead, Object Storage gives each object a unique URL which you can use to access your data.

### Host Static Sites

Using Object Storage to host your static site files means you do not have to worry about maintaining your site’s infrastructure. It is no longer necessary to perform typical server maintenance tasks, like software upgrades, web server configuration, and security upkeep. See [Deploy a Static Site using Hugo and Object Storage](/docs/guides/host-static-site-object-storage/).

## Availability

Object Storage is available within the following data centers. New data centers are built with the latest Object Storage upgrades, which include drastically increased storage space and the number of objects per region. Existing data centers will receive these upgrades in the future.

| Data Center | Upgrade Status | Cluster ID |
| -- | -- | -- |
| Atlanta, GA (USA) | Planned | `us-southeast-1` |
| Chicago, IL (USA) | **Upgraded** | `us-ord-1` |
| Frankfurt (Germany) | Planned | `eu-central-1` |
| Newark, NJ (USA) | Planned | `us-east-1` |
| Paris (France) | **Upgraded** | `fr-par-1` |
| Singapore | Planned | `ap-south-1` |
| Washington, DC (USA) | **Upgraded** | `us-iad-1` |

Object Storage deployments in each data center are assigned a cluster ID. These are used when [formatting URLs](/docs/products/storage/object-storage/guides/urls/) and integrating Object Storage with tools such as the [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli), [s3cmd](/docs/products/storage/object-storage/guides/s3cmd), [s4cmd](/docs/products/storage/object-storage/guides/s4cmd), and [Cyberduck](/docs/products/storage/object-storage/guides/cyberduck).

## Pricing

Linode Object Storage costs a flat rate of $5 a month, and includes 250 gigabytes of storage. This flat rate is prorated, so if you use Object Storage for a fraction of the month you are charged a fraction of the cost. For example, if you have Object Storage enabled for half of the month and use up to 250 gigabytes of storage you are billed $2.50 at the end of the month. Each additional gigabyte of storage over the first 250 gigabytes costs $0.02, and this usage is also prorated based on usage time.

{{< content "object-storage-cancellation-shortguide" >}}

## Technical Specifications and Considerations

The table below shows Object Storage specifications, including those for the existing clusters as well as the latest upgraded clusters currently available n new data centers. Most of the specifications apply **per region, per account**, unless otherwise specified.

| Specification | Existing clusters | Upgraded clusters |
| -- | -- | -- |
| Minimum storage | 250 GB | 250 GB |
| **Maximum storage** | **5 TB** | **1 PB** |
| **Maximum number of objects** | **50 million** | **1 billion** |
| Maximum number of buckets | 1,000 buckets | 1,000 buckets |
| Maximum file upload size | 5 GB (5 TB with multipart uploads) | 5 GB (5 TB with multipart uploads) |
| Rate limiting (per bucket) | 750 requests per second | 750 requests per second |

To increase these limits beyond their default values (where possible), [contact the Support team](https://www.linode.com/support/) with your request. Be sure to include any details related to your application and requirements.

### Network Transfer

- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Metered outbound network transfer, including traffic to other Linode services within the same data center (over both public IPv4 and IPv6 addresses)
- Includes 1 TB (prorated) of transfer allowance per month

See the [Network Transfer Usage and Costs](/docs/products/platform/get-started/guides/network-transfer/) guide for additional details, including costs for network transfer overages.

### Additional Limits and Specifications

- **Upload file size limit:** 5 GB. The maximum upload size of a single object is *5 GB*, though this can easily be overcome by using multi-part uploads. Both [s3cmd](/docs/products/storage/object-storage/guides/s3cmd) and [cyberduck](/docs/products/storage/object-storage/guides/cyberduck/) will do this for you automatically if a file exceeds this limit as part of the uploading process.
- **Restricted characters:** Objects uploaded to object storage cannot contain the following special characters when using Cloud Manager or the Linode CLI: `" ' < > & + =`.