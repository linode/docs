---
title: "Linode CLI Commands for NodeBalancers"
description: "How to use the Linode CLI to create and manage NodeBalancers."
published: 2020-07-20
modified: 2022-05-02
authors: ["Linode"]
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