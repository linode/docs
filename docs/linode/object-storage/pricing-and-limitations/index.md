---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Object Storage pricing breakdown, storage limits, transfer quotas, and other pertinent information.'
keywords: ['object','storage','pricing','price','limit','transfer']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-10-07
modified_by:
  name: Linode
title: "Object Storage Pricing and Limitations"
contributor:
  name: Linode
aliases: ['platform/object-storage/pricing-and-limitations/']
---

{{< note >}}
[Linode Object Storage](/docs/platform/object-storage/) is now available to the general public in the Newark data center! Starting November 1, 2019, all customers with the Object Storage service enabled on their account will be billed.
{{</ note >}}

Linode Object Storage offers affordable and full-featured cloud storage for unstructured data and static sites. This guide will outline Object Storage pricing, storage limitations, and data transfer quotas.

## Pricing

Linode Object Storage costs a flat rate of $5 a month, and includes 250 gigabytes of storage. This flat rate is prorated, so if you use Object Storage for a fraction of the month you will be charged a fraction of the cost. For example, if you have Object Storage enabled for half of the month and use up to 250 gigabytes of storage you will be billed $2.50 at the end of the month. Each additional gigabyte of storage over the first 250 gigabytes will cost $0.02, and this usage is also prorated based on usage time.

Object Storage is similar to a subscription service. **Once enabled, you will be billed at the flat rate regardless of whether or not there are active buckets on your account.** [Cancelling Object Storage](/docs/platform/object-storage/how-to-use-object-storage/#cancel-object-storage) will stop billing for this flat rate.

{{< note >}}
For more information on enabling Object Storage, cancelling Object Storage, and more, see our [How To Guide](/docs/platform/object-storage/how-to-use-object-storage/#enable-object-storage).
{{< /note >}}

## Storage Limitations

Currently, Object Storage accounts are limited to 10 terabytes of storage per cluster, or 1 million objects per cluster, whichever comes first. Separate clusters have separate limits, so it is possible to store 10 terabytes worth of objects in one cluster and 10 terabytes worth of objects in another.  In the future, individual clusters may have separate storage maximums, and this guide will be updated to include those limits. Accounts can have up to 25 buckets per cluster.

Individual object uploads are limited to a size of 5GB each, though larger object uploads can be facilitated with multipart uploads. [s3cmd](/docs/platform/object-storage/how-to-use-object-storage/#s3cmd) and [cyberduck](/docs/platform/object-storage/how-to-use-object-storage/#cyberduck) will do this for you automatically if a file exceeds this limit as part of the uploading process.

{{< note >}}
If you need to increase the storage limit, the object limit, or the bucket limit, please [open up a Customer Support ticket](https://www.linode.com/docs/platform/billing-and-support/support/#contacting-linode-support).
{{</ note >}}

## Transfer Quotas

Object Storage adds 1 terabyte of outbound data transfer to your data transfer pool. This 1 terabyte of transfer data is prorated. If you use Object Storage for half of a month, only 500 gigabytes of transfer data will be added to your monthly transfer pool. At this time, all outbound data, including data transfer from Object Storage to a Linode in the same data center, is billable.

You are not charged for uploading objects (inbound traffic) to Object Storage, with a few exceptions. Uploading an object to Object Storage from a Linode is almost always billable, as that is considered outbound traffic from the origin Linode. However, uploading an object from a Linode to Object Storage over IPv6 will be free, provided both the Linode and the bucket are hosted in the same data center.  Any further outbound data past your transfer quota is charged at a rate of $0.02 a gigabyte. For more information on network transfer pools, review our [Network Transfer Quota](https://linode.com/docs/platform/billing-and-support/network-transfer-quota/) guide.

## Rate Limiting

Users accessing Object Storage resources are limited to 750 requests per second, per bucket.

{{< note >}}
The rate limits for Object Storage may be subject to change. This document will be updated to include any future changes.
{{</ note >}}
