---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to enable the Linode Object Storage service.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Enable the Linode Object Storage Service
keywords: ["object storage"]
headless: true
show_on_rss_feed: false
---

Object Storage is not enabled for a Linode account by default. All that is required to enable Object Storage is to create a bucket or an Object Storage access key. To cancel Object Storage, see the [Cancel Object Storage](/docs/platform/object-storage/how-to-use-object-storage/#cancel-object-storage) section.

{{< note >}}
Billing for Object Storage starts when it is enabled on the account, **regardless of how it is enabled**. For example, if you enable the service by creating an access key, but you have not yet created a bucket, the $5 monthly flat rate (prorated) for Object Storage is charged for the account. [Cancelling Object Storage](/docs/platform/object-storage/how-to-use-object-storage/#cancel-object-storage) stops billing for it.
{{< /note >}}
