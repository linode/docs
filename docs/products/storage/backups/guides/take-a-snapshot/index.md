---
author:
  name: Linode
  email: docs@linode.com
title: Take a Manual Snapshot
description: "How to take a manual snapshot backup."
---

You can make a manual backup of your Linode by taking a *snapshot*. Here's how:

1.  From the **Linodes** page, select the Linode.

1.  Click the **Backups** tab.

1.  Under **Manual Snapshot**, give your snapshot a name and click **Take Snapshot**.

    {{< note >}}
Taking a new snapshot will overwrite a previously saved snapshot.
{{< /note >}}

The Linode Backup Service initiates the manual snapshot. Creating the manual snapshot can take several minutes, depending on the size of your Linode and the amount of data you have stored on it. Other Linode Cloud Manager jobs for this Linode will not run until the snapshot job has been completed.
