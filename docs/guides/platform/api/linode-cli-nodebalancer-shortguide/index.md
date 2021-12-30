---
slug: linode-cli-nodebalancer-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the NodeBalancer section of the CLI guide.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to manage NodeBalancers with the CLI
keywords: ["nodebalancer"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-nodebalancer-shortguide/']
---

1.  Create a new NodeBalancer:

        linode-cli nodebalancers create --region us-east --label new-balancer

1.  Create a configuration for a NodeBalancer:

        linode-cli nodebalancers config-create $nodebalancer_id

1.  Attach a Node to a NodeBalancer:

        linode-cli nodebalancers node-create --address 192.200.12.34:80 --label node-1

1.  To delete a node, you will need the ID of the NodeBalancer, configuration, and node:

        linode-cli nodebalancers node-delete $nodebalancer_id $config_id $node_id

Other actions are available. Use `linode-cli nodebalancers --help` for a complete list.
