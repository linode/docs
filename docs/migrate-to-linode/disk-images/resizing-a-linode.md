---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to upgrading and resizing your Linode
keywords: 'upgrading,resizing'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['resizing/']
modified: Saturday, October 18th, 2014
modified_by:
  name: Dave Russell
published: 'Tuesday, March 20th, 2012'
title: Resizing a Linode
---

We make it easy to upgrade or downgrade your Linode VPS by changing plans and adding additional resources. If you're expecting a temporary burst of traffic to your website, or if you're not using your VPS as much as you thought, you can temporarily or permanently resize your Linode to a different plan.

![Resizing a Linode](/docs/assets/resizing_a_linode.png "Resizing a Linode")

## Resizing Your Linode

You can move your Linode from one plan to another by using the *resize* feature. To complete the resizing process, your Linode will be powered off and migrated to a different host in the same data center. Your data, configuration profiles, and IP addresses will be all be moved to the new host. Please note that the migration will take approximately 1 minute for every 3-5 gigabytes of data.

 {: .note }
>
> If you're downgrading your plan, verify that your disks are using less space than the new plan provides. For instructions on resizing disks, see [Manage Linode Disks](/docs/disk-images-config-profiles).

Here's how to resize your Linode:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode from the list.
4.  Click the **Resize** tab. The webpage shown below appears.

[![The Linode Manger interface.](/docs/assets/1741-resize1_small.png)](/docs/assets/1742-resize1.png)

5.  Select a plan.
6.  Click **Resize this Linode Now**. Your Linode will be powered off and moved to another host. Depending on the size of your Linode, this process can take up to one hour.
7. (Optional) When the migration completes check your storage allocation meter. If you resized your Linode to a larger plan, you'll have additional un-used storage to allocate to your disks. In your Dashboard, click the "Edit" link next to the disk you'd like to add the extra free storage to. Enter a new size in the specified range and click "Save Changes".

[![Adding storage space to an invidivual disk.](/docs/assets/resize-a-disk.png)](/docs/assets/resize-a-disk.png)

8. Once completed, your Linode will still be powered off. From the **Dashboard** tab, click **Boot** to turn it on.

Your Linode has been successfully resized and migrated to the new host.
