---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to upgrading and resizing your Linode
keywords: ["upgrading", "resizing"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['resizing/','migrate-to-linode/disk-images/resizing-a-linode/']
modified: 2017-03-02
modified_by:
  name: Linode
published: 2017-02-14
title: Resizing a Linode
---

We make it easy to upgrade or downgrade your Linode by changing plans and adding additional resources. If you're expecting a temporary burst of traffic to your website, or if you're not using your Linode as much as you thought, you can temporarily or permanently resize your Linode to a different plan.

![Resizing a Linode](/docs/assets/resizing_a_linode.png "Resizing a Linode")

{{< note >}}
Linodes can be resized to a smaller or larger plan. A [standard](https://www.linode.com/pricing#standard) plan can also be converted to a [high memory](https://www.linode.com/pricing#high-memory) plan, or vice versa.
{{< /note >}}

## Resizing Your Linode

You can move your Linode from one plan to another by using the *resize* feature. To complete the resizing process, your Linode will be powered off and migrated to a different host in the same data center. Your data, configuration profiles, and IP addresses will be all be moved to the new host. Please note that the migration will take approximately 1 minute for every 3-5 gigabytes of data.

{{< note >}}
If you're downgrading your plan, verify that your disks are using less space than the new plan provides. for more information, see our documentation on [resizing a disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk).
{{< /note >}}

Here's how to resize your Linode:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select a Linode from the list.
4.  Click the **Resize** tab. The webpage shown below appears.

    [![The Linode Manager interface.](/docs/assets/resizing-a-linode-small.png)](/docs/assets/resizing-a-linode.png)

5.  Select a plan.
6.  Click **Resize this Linode Now**. Your Linode will be powered off and moved to another host. Depending on the size of your Linode, this process can take up to one hour.
7.  (Optional) When the migration completes check your storage allocation meter. If you resized your Linode to a larger plan, you'll have additional un-used storage to allocate to your disks. You may want to add some of this storage to one of your disks if the internal filesystem on it is running low on free space, or just so you can use it in the future.

    In your Dashboard, click the **Edit** button next to the disk you'd like to allocate the extra storage to. Enter a new size in the specified range and click **Save Changes**.

    [![Adding storage space to an individual disk.](/docs/assets/resize-a-disk-small.png)](/docs/assets/resize-a-disk.png)

8.  Once completed, your Linode will still be powered off. From the **Dashboard** tab, click **Boot** to turn it on.

Your Linode has been successfully resized and migrated to the new host. This video goes through the resizing process in detail:

<iframe width="825" height="465" src="https://www.youtube.com/embed/RjCDNtHU0Z4?controls=0&amp;showinfo=0&amp;rel=0" frameborder="0" allowfullscreen></iframe>
