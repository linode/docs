---
slug: data retension
author:
  name: Linode
  email: docs@linode.com
description: Our guide about the data retension on a Linode that is deleted.
keywords: ["support", "delete", "data", "retension"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/platform/billing-and-support/delete-linode/','/support/','/platform/delete-linode/',]
modified: 2022-10-13
modified_by:
  name: Linode
published: 2012-10-13
title: Linode Data Retension
tags: ["linode platform"]
---



This guide provides information about retension of data on the Linode that was deleted.

# Initial deletion

When a Linode is deleted, the Linode Volumes remain on the host for a very short period of time. After a few hours, background host maintenance occurs and scrubs the Linode Volumes with zeros to reclaim space.
Only the Linode support team can restore these Volumes, you can make the restore process quicker if you reachout to the support team in time. For information about reaching out to the Linode support team, see [contact support](/docs/guides/support/).

## Restorable Image

During initial deletion, a temporary restore image of the disk is created on a backup node. Customer Linodes are not placed on these nodes and this image can be restored only to the customer that it originated from.
Linode purges your data on the old Linode when you delete the server or switch to a different sized plan. If Linode did not do this there would be huge potential liabilities for us legally, so that is definitely something that we do.
The only caveat would be that we retain images of the disks from a deleted Linode for a varied period of time depending on the length of time the server existed on your account. This is meant as a fail-safe in the event that you delete a server by mistake. These images are at no time made accessible to individuals outside of your account, or even potentially within your own account and depends on the permissions you grant to the various users on your account.


## Privacy policy

This information is also outlined in our privacy policy:https://www.linode.com/legal-privacy/

```
Keep in mind that the language in this document, depending on the section you are reading, might be confusing, because it discusses in various portions both Linode accounts and the servers/services we offer.
Hopefully that adequately addresses your concerns here. If you have any other questions or concerns, please feel free to reach back out to us via ticket or over the phone any time and we would be glad to help you out in any way that we can. If not, this ticket will automatically close in a few days.

	Data. You shall return all of Linode’s proprietary materials, Confidential Information, and other property, and immediately cease all access and use of the Service. Upon termination, Linode may, without obligation to do so and unless otherwise required by applicable law, delete the Covered User Data in its entirety without liability. Linode may maintain a copy of the Covered User Data in accordance with Linode’s then-current data retention practices and as otherwise expressly authorized hereunder. The provisions of the Terms of Service which relate to confidentiality, intellectual property ownership, indemnity, limitations of liability, disclaimers, and payment obligations, along with terms which expressly or by their nature should reasonably survive termination, shall survive expiration or termination hereof.

```
