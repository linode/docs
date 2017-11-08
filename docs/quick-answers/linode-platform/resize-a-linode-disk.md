---
author:
  name: Nick Brewer
  email: docs@linode.com
description: 'Increase or decrease the size of your Linode disk.'
keywords: ["linux", "linode manager", "image"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-05-08
modified_by:
  name: Linode
published: 2017-05-08
title: Resize a Linode Disk
---

This QuickAnswer will show you how to resize a disk on your Linode. See our [Disks and Configuration Profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles) guide for additional information.

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select the Linode with the disk that you want to resize.
4.  Click **Shut down** to turn your Linode off. Watch the *Host Job Queue* for confirmation that the Linode has shut down.
5.  Click the **Edit** link next to the disk you wish to resize.
6.  In the **New Size** field, enter a different size for the disk in megabytes.
7.  Click **Save Changes**. Watch the *Host Job Queue* for confirmation that the disk has been resized.
8.  Click **Boot** to turn on the Linode.

{{< note >}}
The Linode Manager will not allow you to resize your disk to an amount smaller than the space taken up by files on your filesystem. To confirm how much space you're using, issue the `df -h` command on your Linode
{{< /note >}}
