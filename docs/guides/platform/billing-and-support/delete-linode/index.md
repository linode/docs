---
slug: data-retention
author:
  name: Linode
  email: docs@linode.com
description: "What happens when a user deletes a Linode."
keywords: ["support", "delete", "data", "retention"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2022-10-13
modified_by:
  name: Linode
published: 2012-10-13
title: Linode Data Retention
tags: ["linode platform"]
---

This guide provides information about retention of data on a deleted Linode.

# Initial Deletion

When a Linode is deleted, the Linode data remains on the host for a very short period of time. After a few hours, background host maintenance occurs and scrubs the Linode disk by overwriting it with zeros then reclaiming the space.

Only the Linode support team can restore this data. If the removal was an accident, customers might be able to restore the data if they contact support immediately. For information about reaching out to the Linode support team, see [contact support](/docs/guides/support/).

## Restorable Image

During initial deletion, a temporary restore image of the disk is created, similar to a backup. Customer Linodes are not placed on these nodes and this image can be restored only to the customer that it originated from.

Linode purges the data on the old Linode when you delete the server or switch to a different sized plan.

Linode retains images of the disks for a varied period of time depending on the length of time the server existed on an account. This is meant as a fail-safe in the event that a server is deleted by mistake. These images are at no time made accessible to individuals outside of your account, or even potentially within your own account depending on the permissions granted to the various users on the account.

For more information on deploying an image, see our [Deploying an Image to a New Linode](https://www.linode.com/docs/products/tools/images/guides/deploy-image-to-new-linode/) guide.


## Privacy policy

Our data retention policy is also outlined in our [privacy policy](https://www.linode.com/legal-privacy/).