---
slug: managed-remove-service-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to remove a service from Linode Managed.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: Remove a Service from Monitoring in Linode Managed
keywords: ["linode managed"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/managed-remove-service-shortguide/']
---

If you decide to remove or stop using a monitored service on your Linode, you should also remove the service from Linode Managed. For example, you should remove the Apache service from Linode Managed if you decide to start using Linode as a dedicated database server. To remove a monitored service:

1.  Log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Managed** link in the sidebar.

1.  Select the **Monitors** tab. A table which lists your monitored services will appear below the tab.

1.  Find the service that you want to remove and click on the corresponding **more options ellipsis**. Select the **Delete** option from the menu that appears.

1.  A confirmation dialog will appear. Click the **Delete** button on this dialog to confirm.

Linode Managed will stop monitoring the service.
