---
slug: transfer-block-storage-datacenter-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to transfer Block Storage Data Between Data Centers.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: Transfer Block Storage Data Between Data Centers
keywords: ["block storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/block-storage/transfer-block-storage-datacenter-shortguide/']
---

Block Storage Volumes cannot be directly migrated to a different data center. These steps will outline how to transfer a Volume's data to a different data center via the [SCP](/docs/security/data-portability/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) tool.

{{< note >}}
Consult our [Network Transfer Quota](/docs/platform/billing-and-support/network-transfer-quota/#which-traffic-applies-to-the-transfer-quota) guide for information on charges related to outbound traffic when downloading Linode data outside of Linode's private network.
{{</ note >}}

1. [Attach and mount](/docs/products/storage/block-storage/guides/attach-volume/) your Block Storage Volume to a Linode, if you have not already.

1. [Use the Secure Copy Protocol (SCP)](/docs/security/data-portability/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) to download your Volume's data to the receiving computer or Linode.

    {{< note >}}
You will need a device that has enough storage capacity to receive the entirety of your Block Storage Volume's data.
{{</ note >}}

1. Once your Block Storage Volume's data has been copied, [create a new Block Storage Volume in the desired data center and attach it to a Linode](/docs/products/storage/block-storage/guides/add-volume/).

1. [Use SCP to upload the data from the receiving computer or Linode](/docs/security/data-portability/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) to the new Block Storage Volume. The new Block Storage Volume must be attached and mounted to a Linode.
