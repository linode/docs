---
title: Cancel Backups
description: "How to cancel the Linode Backup Service."
authors: ["Linode"]
---

You can cancel the Backup Service at any time, which prevents any new backups from being created using the service and deletes any previously generated backups that may have been stored.

{{< note type="alert" >}}
Cancelling your Backup Service irretrievably deletes all of your Linode's Backups, including its manual Snapshot.

To preserve this data, you need to back up your data independently from the Backup Service before cancelling it. You may consult the suggestions in [Backing Up Your Data](/docs/guides/backing-up-your-data/) for more information on how to do this.
{{< /note >}}

1.  From the **Linodes** page, select the Linode.

1.  Click the **Backups** tab.

1.  Click the **Cancel Backups** button at the bottom of the page.