---
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
---

Block Storage volumes cannot be directly migrated to a different Data Center. These steps will outline how to transfer a volume's data to a different data center via the [SCP](/docs/security/data-portability/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) tool.

{{< note >}}
Consult our [Network Transfer Quota](/docs/platform/billing-and-support/network-transfer-quota/#which-traffic-applies-to-the-transfer-quota) guide for information on charges related to outbound traffic when downloading Linode data outside of Linode's private network.
{{</ note >}}

1. [Attach and mount](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/#how-to-add-a-block-storage-volume-to-a-linode) your Block Storage volume to a Linode, if you have not already.

1. [Use the Secure Copy Protocol (SCP)](/docs/security/data-portability/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) to download your volume's data to the receiving computer or Linode.

    {{< note >}}
  You will need a device that has enough storage capacity to receive the entirety of your Block Storage volume's data.
    {{</ note >}}

1. Once your Block Storage volume's data has been copied, [create a new Block Storage volume in the desired data center and attach it to a Linode](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/#how-to-add-a-block-storage-volume-to-a-linode).

1. [Use SCP to upload the data from the receiving computer or Linode](/docs/security/data-portability/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) to the new Block Storage volume. The new Block Storage volume must be attached and mounted to a Linode.
