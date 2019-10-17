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
---

{{< note >}}
Object Storage is currently in a closed early access Beta, and you may not have access to Object Storage through the Cloud Manager or other tools. To gain access to the Early Access Program (EAP), open up a Customer Support ticket noting that you'd like to be included in the program, or e-mail objbeta@linode.com -- beta access is completely free. This guide reflects the policies that will be enacted when Object Storage is made available to the general public.
{{</ note >}}

Linode Object Storage offers affordable and full-featured cloud storage for unstructured data and static sites. This guide will outline Object Storage pricing, storage limitations, and data transfer quotas.

## Pricing

Linode Object Storage has a minimum monthly cost of $5, which provides 250 gigabytes of storage. Each additional gigabyte of storage will cost $0.02.

## Storage Limitations

Currently, Object Storage accounts are limited 10 terabytes of storage, or 100,000 objects, whichever comes first. Accounts can have up to 10 buckets.

{{< note >}}
If you need to increase the storage limit, the object limit, or the bucket limit, please [open up a Customer Support ticket](https://www.linode.com/docs/platform/billing-and-support/support/#contacting-linode-support).
{{</ note >}}

## Transfer Quotas

Object Storage adds 1 terabyte of outbound data transfer to your data transfer pool. At this time, all outbound data, including data transfer to a Linode in the same data center, is billable. You are not charged for uploading objects (inbound traffic) to Object Storage. Any further outbound data is charged at a rate of $0.02 a gigabyte. For more information on network transfer pools, review our [Network Transfer Quota guide](https://linode.com/docs/platform/billing-and-support/network-transfer-quota/).

{{< note >}}
The 1 terabyte of transfer from Object Storage is not prorated. If you use Object Storage at any point during the month, 1 terabyte of transfer will be added to your pool.
{{< /note >}}
