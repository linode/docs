---
author:
  name: Linode
  email: docs@linode.com
title: Take a Manual Snapshot
description: "How to take a manual snapshot backup."
---

You can make a manual backup of your Linode Compute Instance by taking a *manual snapshot*. This can be useful to save a restore point before a major system upgrade or prior to significant changes to software or configuration within your Compute Instance.

{{< note >}}
The Backup service can store a single manual snapshot. Taking a new snapshot overwrites any previously saved snapshot.
{{< /note >}}

1.  From the **Linodes** page, select the Linode.

1.  Click the **Backups** tab.

1.  Under **Manual Snapshot**, enter a name/label for this new snapshot and click **Take Snapshot**.

    ![](backups-manual-snapshot.png)

1.  A pop-up box is displayed confirming that you intend to take a new manual snapshot and that any previous snapshot will be overwritten. Click **Take Snasphot** to proceed.

Creating the manual snapshot can take several minutes, depending on the size of your Linode and the amount of data you have stored on it. Other Cloud Manager jobs for this Linode will not run until the snapshot job has been completed.
