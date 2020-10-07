---
slug: backups-schedule-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to schedule your backups with the Linode Backup Service.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Schedule Your Backups with the Linode Backup Service
keywords: ["backups"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/disk-images/backups-schedule-shortguide/']
---

You can configure when automatic backups are initiated. Here's how:

1.  From the **Linodes** page, select the Linode.

1.  Click the **Backups** tab.

1.  Under **Settings**, select a time interval from the **Time of Day** menu. The Linode Backup Service will generate all backups between these hours.

1.  Select a day from the **Day of Week** menu. This is the day whose backup will be promoted to the weekly slot. The back up will be performed within the time period you specified in step 3.

1.  Click **Save Changes**.

The Linode Backup Service will backup your Linode according to the schedule you specified.
