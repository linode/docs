---
slug: delete-cloud-firewall-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to delete a Cloud Firewall'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-11-09
modified_by:
  name: Ryan Syracuse
published: 2020-11-09
title: Delete a Cloud Firewall
keywords: ["cloud firewall"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/cloud-firewall/delete-cloud-firewall-shortguide/']
---

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/) and select **Firewalls** from the navigation menu. This takes you to the **Firewalls** listing page.

1. Click on the **more options ellipsis** corresponding to the Firewall that you'd like to delete.

1. From the dropdown menu, click on **Delete**. You are prompted to confirm deleting the Firewall. Click **Delete** to proceed.

    ![Click on the delete button to delete your Firewall.](delete-your-firewall.png "Click on the delete button to delete your Firewall.")

    The Firewall is deleted and any services that the Firewall was applied to no longer have their network traffic filtered by the Firewall.