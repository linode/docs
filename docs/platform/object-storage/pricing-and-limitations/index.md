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

Linode Object Storage has a prorated minimum monthly cost of $5, which provides 250 gigabytes of storage. If you use Object Storage for a fraction of the month you will be charged a fraction of the cost. For example, if you have Object Storage enabled for half of the month and use up to 250 gigabytes of storage you will be billed $2.50 at the end of the month. Each additional gigabyte of storage over the first 250 gigabytes will cost $0.02, and this usage is also prorated based on usage time.

## Storage Limitations

Currently, Object Storage accounts are limited 10 terabytes of storage, or 100,000 objects, whichever comes first. Accounts can have up to 10 buckets.

{{< note >}}
If you need to increase the storage limit, the object limit, or the bucket limit, please [open up a Customer Support ticket](https://www.linode.com/docs/platform/billing-and-support/support/#contacting-linode-support).
{{</ note >}}

## Transfer Quotas

Object Storage adds 1 terabyte of outbound data transfer to your data transfer pool. This 1 terabyte of transfer data is prorated. If you use Object Storage for half of a month, only 500 gigabytes of transfer data will be added to your monthly transfer pool. At this time, all outbound data, including data transfer to a Linode in the same data center, is billable. You are not charged for uploading objects (inbound traffic) to Object Storage. Any further outbound data is charged at a rate of $0.02 a gigabyte. For more information on network transfer pools, review our [Network Transfer Quota guide](https://linode.com/docs/platform/billing-and-support/network-transfer-quota/).
