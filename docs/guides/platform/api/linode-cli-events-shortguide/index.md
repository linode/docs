---
slug: linode-cli-events-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the Events section of the Linode CLI guide.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Manage Events with the Linode CLI
keywords: ["linode cli"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-events-shortguide/']
---

1.  View a list of events on your account:

        linode-cli events list

1.  View details about a specific event:

        linode-cli events view $event_id

1.  Mark an event as read:

        linode-cli events mark-read $event_id
