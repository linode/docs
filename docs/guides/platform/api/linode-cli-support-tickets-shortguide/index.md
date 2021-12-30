---
slug: linode-cli-support-tickets-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the Support Tickets section of the Linode CLI guide.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Manage Support Tickets with the Linode CLI
keywords: ["linode cli"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-support-tickets-shortguide/']
---

1.  List your Support Tickets:

        linode-cli tickets list

1.  Open a new Ticket:

        linode-cli tickets create --description "Detailed description of the issue" --summary "Summary or quick title for the Ticket"

    If your issue concerns a particular Linode, Volume, Domain, or NodeBalancer, pass the ID with `--domain_id`, `--linode-id`, `--volume_id`, etc.

1.  List replies for a Ticket:

        linode-cli tickets replies $ticket_id

1.  Reply to a Ticket:

        linode-cli tickets reply $ticket_id --description "The content of your reply"
