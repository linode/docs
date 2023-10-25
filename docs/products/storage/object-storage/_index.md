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
modified: 2023-10-22
aliases: ['/platform/object-storage/pricing-and-limitations/', '/guides/pricing-and-limitations','/products/storage/object-storage/guides/enable/']
---

Linode's Object Storage is a globally-available, S3-compatible method for storing and accessing data. Object Storage differs from traditional hierarchical data storage, such as a traditional filesystem on a physical/virtual disk and [Block Storage Volumes](/docs/products/storage/block-storage/). Under Object Storage, files (also called *objects*) are stored in flat data structures (referred to as *buckets*) alongside their own rich metadata.

Due to the nature of Object Storage, it does not require the use of a Compute Instance. Instead, Object Storage gives each object a unique URL with which you can access the data. An object can be publicly accessible, or you can set it to be private and only visible to you. This makes Object Storage great for sharing and storing unstructured data like images, documents, archives, streaming media assets, and file backups, and the amount of data you store can range from small collections of files up to massive libraries of information.

## Features

### S3 Compatible

Linode Object Storage is a globally-available, S3 Compatible storage solution, maintaining the same performance as your data grows.

### No Compute Instance Required

Object storage does not require the use of a Compute Instance. Instead, Object Storage gives each object a unique URL which you can use to access your data.

### Host Static Sites

Using Object Storage to host your static site files means you do not have to worry about maintaining your site’s infrastructure. It is no longer necessary to perform typical server maintenance tasks, like software upgrades, web server configuration, and security upkeep. See [Deploy a Static Site using Hugo and Object Storage](/docs/guides/host-static-site-object-storage/).

## Availability

Object Storage is available within the following data centers. For a full list of specifications for each region, review the [Technical Specifications](#specifications).

| Data Center | Cluster ID |
| -- | -- |
| Amsterdam (Netherlands)\* | `nl-ams-1` |
| Atlanta, GA (USA) | `us-southeast-1` |
| Chennai (India)\* | `in-maa-1` |
| Chicago, IL (USA)\* | `us-ord-1` |
| Frankfurt (Germany) | `eu-central-1` |
| Jakarta (Indonesia)\* | `id-cgk-1` |
| Los Angeles, CA (USA)\* | `us-lax-1` |
| Miami, FL (USA)\* | `us-mia-1` |
| Milan (Italy)\* | `it-mil-1` |
| Newark, NJ (USA) | `us-east-1` |
| Osaka (Japan)\* | `jp-osa-1` |
| Paris (France)\* | `fr-par-1` |
| São Paulo (Brazil)\* | `br-gru-1` |
| Seattle, WA (USA)\* | `us-sea-1` |
| Singapore | `ap-south-1` |
| Stockholm (Sweden)\* | `se-sto-1` |
| Washington, DC (USA)\* | `us-iad-1` |

\**Higher capacity regions. These data centers offer increased capacity and are ideal for large enterprise workloads.*

Object Storage deployments in each data center are assigned a cluster ID. These are used when [formatting URLs](/docs/products/storage/object-storage/guides/urls/) and integrating Object Storage with tools such as the [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli/), [s3cmd](/docs/products/storage/object-storage/guides/s3cmd/), [s4cmd](/docs/products/storage/object-storage/guides/s4cmd/), and [Cyberduck](/docs/products/storage/object-storage/guides/cyberduck/).

## Pricing

Linode Object Storage costs a flat rate of $5 a month, and includes 250 gigabytes of storage. This flat rate is prorated, so if you use Object Storage for a fraction of the month you are charged a fraction of the cost. For example, if you have Object Storage enabled for half of the month and use up to 250 gigabytes of storage you are billed $2.50 at the end of the month. Each additional gigabyte of storage over the first 250 gigabytes costs $0.02, and this usage is also prorated based on usage time.

{{< note >}}
Object Storage for our **Jakarta** and **São Paulo** data centers is in currently in beta. While in beta, the Object Storage service remains free to use in these regions.
{{< /note >}}

{{< content "object-storage-cancellation-shortguide" >}}

## Technical Specifications and Considerations {#specifications}

The table below outlines default Object Storage limits. Limits apply **per region, per account**, unless otherwise specified.

| Resource | Limit |
| -- | -- |
| Maximum storage | 100 TB (Up to 1,000 TB by request)* |
| Maximum number of objects | 100 million (Up to 1 billion by request)* |
| Maximum number of buckets | 1,000 buckets |
| Maximum file upload size | 5 GB (5 TB with multipart uploads) |
| Rate limit (per bucket) | 750 requests per second |

*Limit varies by region. Data centers with exceptions to the default bucket limits are listed in the table below:

| Data Center | Max Storage<br><small>per account, per region</small> | Max # of objects<br><small>per account, per region</small> |
| -- | -- | -- |
| Atlanta, GA (USA) | 5 TB | 50 million |
| Frankfurt (Germany) | 5 TB | 50 million |
| Newark, NJ (USA) | 5 TB | 50 million |
| Singapore | 5 TB | 50 million |

If your workloads require additional storage or need to accommodate more objects, [contact the Support team](https://www.linode.com/support/) with your request. Be sure to include any details related to your application and requirements. Among other factors, the total capacity of the region is considered when processing a limit increase request. For larger enterprise workloads, consider using one of the data centers designated as *higher capacity* (see [Availability](#availability)).

### Network Transfer

- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Metered outbound network transfer, including traffic to other Linode services within the same data center (over both public IPv4 and IPv6 addresses)
- Includes 1 TB (prorated) of transfer allowance per month

See the [Network Transfer Usage and Costs](/docs/products/platform/get-started/guides/network-transfer/) guide for additional details, including costs for network transfer overages.

### Additional Limits and Specifications

- **Upload file size limit:** 5 GB. The maximum upload size of a single object is *5 GB*, though this can easily be overcome by using multi-part uploads. Both [s3cmd](/docs/products/storage/object-storage/guides/s3cmd/) and [cyberduck](/docs/products/storage/object-storage/guides/cyberduck/) will do this for you automatically if a file exceeds this limit as part of the uploading process.
- **Restricted characters:** Objects uploaded to object storage cannot contain the following special characters when using Cloud Manager or the Linode CLI: `" ' < > & + =`.
