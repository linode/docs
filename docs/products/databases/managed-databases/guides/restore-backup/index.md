---
author:
  name: Linode
  email: docs@linode.com
title: "Restore from a Backup"
description: "Learn how to restore one of the available backups for a Managed Database."
---

Each Managed Database includes daily backups of your data, taken on a 24 hour cadence. Up to 7 backups are stored for each database cluster, which provides you with a restore point for each day in the last week. This guide walks you through viewing and restoring from these backups.

{{<caution>}}
Restoring from a backup erases all data stored within the database cluster and replaces it with the data from that backup.
{{</caution>}}

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Databases** from the left navigation menu.

1. Select your Managed Database from the list. This opens the detail page for that database cluster.

1. Navigate to the **Backups** tab. A list of your available backups are displayed, organized by the date they were created.

1. Locate the backup you wish to restore and click the corresponding **Restore** link. A confirmation dialog appears.

1. Enter the name of the database cluster in the **Database Label** field and click the **Restore Database** button. This deletes all the data currently stored on the database and restores the data from the selected backup. The restore process takes a few moments, the length of which depends on the amount of data. You can monitor the progress by viewing the listing page for all your database clusters.