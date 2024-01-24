---
slug: data-retention
author:
  name: Linode
  email: docs@linode.com
description: "What happens when a user deletes a Linode."
keywords: ["support", "delete", "data", "retention"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2022-10-18
modified_by:
  name: Linode
published: 2022-10-18
title: "Data Deletion on the Linode Platform"
tags: ["linode platform"]
---

When storing sensitive information on a public cloud platform, it's important to consider how your data is secured. Part of data security includes understanding how data is deleted at the end of its life cycle. This guide outlines how the Linode platform handles deleting customer data when the associated service is deleted.

## Compute Instances

On Compute Instances, customer data is stored within *disks*, disk images that are located on physical host machines within our data centers. When a Compute Instance is deleted, any associated disk images are also marked for deletion. The deletion process occurs within a few hours and involves overwriting each byte of the disk image with zeros. This effectively destroys customer data and prevents any future recovery attempts. The physical disk space is them reclaimed and available for other customers to use.

---

## Initial Deletion

When a Linode is deleted, the Linode data remains on the host for a very short period of time. After a few hours, background host maintenance occurs and scrubs the Linode disk by overwriting each byte with zeros then reclaiming the space. This makes all previous data on the disk irretrievable.

Disks from removed compute instances are stored on average for 7 days after their removal, if technically feasible, if the customer initiated the removal. In instances such as a failure or file system incompatibility, the data may be deleted immediately. In other cases and for administrative purposes, data can be held for up to 90 days. Storage is then reserved by the system until it is scrubbed, which on average takes between one and two weeks.

Only the Linode support team can restore this data. If the removal was an accident, customers might be able to restore the data if they contact support immediately. For information about reaching out to the Linode support team, see [contact support](/docs/guides/support/).

## Restorable Image

During initial deletion, a temporary restore image of the disk is created, similar to a backup. Customer Linodes are not placed on these nodes and this image can be restored only to the customer that it originated from.

Linode purges the data on the old Linode when you delete the server or switch to a different sized plan.

Linode retains images of the disks for a varied period of time depending on the length of time the server existed on an account. This is meant as a fail-safe in the event that a server is deleted by mistake. These images are at no time made accessible to individuals outside of your account, or even potentially within your own account depending on the permissions granted to the various users on the account.

For more information on deploying an image, see our [Deploying an Image to a New Linode](https://www.linode.com/docs/products/tools/images/guides/deploy-image-to-new-linode/) guide.


## Privacy policy

Our data retention policy is also outlined in our [privacy policy](https://www.linode.com/legal-privacy/).