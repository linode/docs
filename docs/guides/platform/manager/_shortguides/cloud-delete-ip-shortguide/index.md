---
slug: cloud-delete-ip-shortguide
description: 'Shortguide that shows you how to delete a public IP address from a Linode in the Cloud Manager.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Delete a Public IP Address From Your Linode in the Cloud Manager
keywords: ["cloud manager"]
headless: true
show_on_rss_feed: false
tags: ["linode platform","cloud manager"]
aliases: ['/platform/manager/cloud-delete-ip-shortguide/']
authors: ["Linode"]
---

You can delete a public IP addresses within the Cloud Manager from the **Network** tab in a Linode's details page.

1.  Click **Linodes** from the sidebar menu.

1.  Choose the Linode you wish to modify to enter the Linode detail screen. Then, click on the **Network** tab. Your IPv4 and IPv6 addresses are listed here.

1.  In the **IP Addresses** section, next to the public IPv4 address you want to delete, click **Delete**.

    ![Cloud Manager Delete a Public IP Address](classic-to-cloud-delete-an-ip.png "Cloud Manager Delete a Public IP Address")

1.  A confirmation popup appears where you can confirm or cancel the operation.

    {{< note respectIndent=false >}}
You must have at least one public IP on a Linode. If you attempt to delete the last public IP on a Linode, an error message appears *after* you confirm the deletion.
{{< /note >}}
