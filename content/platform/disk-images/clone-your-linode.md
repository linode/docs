---
author:
  name: Nick Brewer
  email: docs@linode.com
description: Clone your Disks to another Linode.
keywords: ["clone", " cloning", " linode manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['migrate-to-linode/disk-images/clone-your-linode/']
modified: 2017-02-15
modified_by:
  name: Linode
published: 2016-11-21
title: 'Clone Your Linode'
---

This guide will show you how to clone your Linode's existing disks or configuration profiles to another Linode on your account.

![Clone Your Linode](/docs/assets/clone-your-linode.png "Clone Your Linode")

{{< note >}}
To follow the steps in this guide, you will need a Linode with enough free storage space to accommodate your cloned disks.
{{< /note >}}

## Clone Your Linode

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **Linodes** tab to list your active Linodes.
3.  Click on the Linode you wish to clone. This will load its Dashboard.
4.  **Recommended:** Click **Shut down** to power down the Linode. This is recommended to prevent data corruption.
5.  Click the **Clone** tab to select the disks or configuration profiles you wish to clone. If you select a configuration profile, all of the disks attached to it will be included automatically. You can confirm this from the *Disks Attached* column.

	[![Selecting configuration profiles and disks to migrate](/docs/assets/clone-tab-small.png)](/docs/assets/clone-tab.png "Selecting configuration profiles and disks to migrate")

6.  Once you've applied your choices, hit **Select**. You'll be provided with an approximate estimate of how long it will take to clone your Linode:

	[![Clone summary page](/docs/assets/clone-tab-destination-small.png)](/docs/assets/clone-tab-destination.png "Clone summary page")

7.  From the **Destination Linode** menu, select the Linode you want to clone to.
8.  Click **Clone**. The receiving Linode's Dashboard will appear. Watch the *Host Job Queue* to monitor your progress.

Once the cloning process completes, your selected disks and configuration profiles will be available on the destination Linode.
