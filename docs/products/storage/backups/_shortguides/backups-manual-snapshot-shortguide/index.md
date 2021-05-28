---
slug: backups-manual-snapshot-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to take a manual snapshot with the Linode Backup Service.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Take a Manual Snapshot with the Linode Backup Service
keywords: ["backups"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/disk-images/backups-manual-snapshot-shortguide/']
---

You can make a manual backup of your Linode by taking a *snapshot*. Here's how:

1.  From the **Linodes** page, select the Linode.

1.  Click the **Backups** tab.

1.  Under **Manual Snapshot**, give your snapshot a name and click **Take Snapshot**.

    {{< note >}}
Taking a new snapshot will overwrite a previously saved snapshot.
{{< /note >}}

The Linode Backup Service initiates the manual snapshot. Creating the manual snapshot can take several minutes, depending on the size of your Linode and the amount of data you have stored on it. Other Linode Cloud Manager jobs for this Linode will not run until the snapshot job has been completed.
