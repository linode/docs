---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to upgrading and resizing your Linode
keywords: 'upgrading,resizing'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['resizing/']
modified: Tuesday, February 14th, 2017
modified_by:
  name: Linode
published: 'Tuesday, February 14th, 2017'
title: Resizing a Linode
---

We make it easy to upgrade or downgrade your Linode by changing plans and adding additional resources. If you're expecting a temporary burst of traffic to your website, or if you're not using your Linode as much as you thought, you can temporarily or permanently resize your Linode to a different plan.

{: .note }
>
> Linodes can be resized to a smaller or larger plan. A [standard](https://www.linode.com/pricing#standard) plan can also be converted to a [high memory](https://www.linode.com/pricing#high-memory) plan, or vice versa.

![Resizing a Linode](/docs/assets/resizing_a_linode.png "Resizing a Linode")

## Resizing Your Linode

You can move your Linode from one plan to another by using the *resize* feature. To complete the resizing process, your Linode will be powered off and migrated to a different host in the same data center. Your data, configuration profiles, and IP addresses will be all be moved to the new host. Please note that the migration will take approximately 1 minute for every 3-5 gigabytes of data.

 {: .note }
>
> If you're downgrading your plan, verify that your disks are using less space than the new plan provides. for more information, see our documentation on [resizing a disk](/docs/disk-images-config-profiles#resizing-a-disk).

Here's how to resize your Linode:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab. A list of your virtual private servers appears.
3.  Select a Linode from the list.
4.  Click the **Resize** tab. The webpage shown below appears.

[![The Linode Manager interface.](/docs/assets/resizing-a-linode-small.png)](/docs/assets/resizing-a-linode.png)

5.  Select a plan.
6.  Click **Resize this Linode Now**. Your Linode will be powered off and moved to another host. Depending on the size of your Linode, this process can take up to one hour.
7.  Once the migration completes, your Linode will still be powered off. From the **Dashboard** tab, click **Boot** to turn it on.

Your Linode has been successfully resized and migrated to the new host.
