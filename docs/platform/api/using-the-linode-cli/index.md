---
author:
  name: Jared Kobos
  email: docs@linode.com
description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
og_description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
keywords: ["linode api", "linode cli", "python cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-06-29
modified_by:
  name: Linode
published: 2018-06-29
title: Using the Linode CLI
external_resources:
  - '[Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/)'
  - '[Linode API Documentation](https://developers.linode.com/)'
---

![Linode CLI](linode-cli.png "Linode CLI")

The Linode CLI is a wrapper around the [Linode API](https://developers.linode.com) that allows you to manage your Linode account from the command line. This guide describes the basics of installing and working with the CLI.

## Install the CLI

1.  Install the CLI using [Pip](https://pypi.org/project/pip/):

        pip install linode-cli --upgrade

1.  You need a Personal Access Token to use the CLI. Use the [beta Linode Manager](https://cloud.linode.com/profile/tokens) to obtain a token.


1.  The first time you run any command, you will be prompted with the CLI's configuration script. Paste your access token at the prompt and proceed with the remaining configurations. Update these defaults at any time by running `linode-cli configure`.


    {{< note >}}
The CLI installs a bash completion file. On OSX, you may have to source this file before it can be used. To do this, add `source /etc/bash_completion.d/linode-cli.sh` to your `~/.bashrc` file.
    {{< /note >}}

## Options

### Help

View information about any part of the CLI, including available actions and required parameters, with the `--help` flag:

    linode-cli --help
    linode-cli linodes --help
    linode-cli linodes create --help

### Customize Output Fields

By default, the CLI displays a set of pre-selected fields for each type of response. If you would like to see all available fields, use the `--all` flag:

    linode-cli linodes list --all

Specify exactly which fields you would like to receive with the `-format` option:

    linode-cli linodes list --format 'id,region,memory'

### JSON Output

The CLI will return output in tabulated format for easy readability. Use the `--json` and `--pretty` flag to work with a readable JSON output:

    linode-cli regions list --json --pretty

### Machine Readable Output

Display the output as plain text using the default tab delimiter:

    linode-cli regions list --text

Display the output as plain text using a `;` as the delimiter:

    linode-cli regions list --text --delimiter ";"

## Examples
### Linodes

Tasks related to Linode instances are performed with `linode-cli linodes [ACTION]`.

1.  List all of the Linodes on your account:

        linode-cli linodes list

    Filter results to a particular region:

        linode-cli linodes list --region us-east

1.  Create a new Linode:

        linode-cli linodes create --root_pass mypassword

    The defaults you specified when configuring the CLI will be used for the new Linode's type, region, and image. Override these options by specifying the values:

        linode-cli linodes create --root_pass mypassword --region us-east --image linode/debian9 --group webservers

    It is more secure to use `--root_pass` without specifying a password. You will then be prompted to enter a password:

        linode-cli linodes create --root_pass

1.  View details about a particular Linode:

        linode-cli linodes view $linode_id

1.  Boot, shut down, or reboot a Linode:

        linode-cli linodes boot $linode_id
        linode-cli linodes reboot $linode_id
        linode-cli linodes shutdown $linode_id

1.  View a list of available IP addresses for a specific Linode:

        linode-cli linodes ips-list $linode_id

1.  Add a private IP address to a Linode:

        linode-cli linodes ip-add $linode_id --type ipv4 --public false

1.  List all disks provisioned for a Linode:

        linode-cli linodes disks-list $linode_id

1.  Upgrade your Linode:

        linode-cli linodes upgrade $linode_id

1.  Rebuild a Linode:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass

Many other actions are available. Use `linode-cli linodes --help` for a complete list.

### Domains

1.  List the Domains on your account:

        linode-cli domains list

1.  View all domain records in a specific Domain:

        linode-cli domains records-list $domain_id

1.  Delete a Domain:

        linode-cli domains delete $domain_id

1.  Create a Domain:

        linode-cli domains create --type master --domain www.example.com --soa_email email@example.com

1.  Create a new A record in a Domain:

        linode-cli domains records-create $domain_id --type A --name subdomain --target 192.0.2.0

### NodeBalancers

1.  Create a new NodeBalancer:

        linode-cli nodebalancers create --region us-east --label new-balancer

1.  Create a configuration for a NodeBalancer:

        linode-cli nodebalancers config-create $nodebalancer_id

1.  Attach a Node to a NodeBalancer:

        linode-cli nodebalancers node-create --address 192.200.12.34:80 --label node-1

1.  To delete a node, you will need the ID of the NodeBalancer, configuration, and node:

        linode-cli nodebalancers node-delete $nodebalancer_id $config_id $node_id

### Block Storage Volumes

1.  List your current Volumes:

        linode-cli volumes list

1.  Create a new Volume, with the size specified in GiB:

        linode-cli volumes create --label my-volume --size 100 --region us-east

    Specify a `linode_id` to create the Volume and automatically attach it to a specific Linode:

        linode-cli volumes create --label my-volume --size 100  --linode_id $linode_id

1.  Attach or detach the Volume from a Linode:

        linode-cli volumes attach $volume_id --linode_id $linode_id
        linode-cli volumes detach $volume_id

1.  Resize a Volume (size can only be increased):

        linode-cli volumes resize $volume_id --size 200

1.  Delete a Volume:

        linode-cli volumes delete $volume_id

### Account

1.  View your account:

        linode-cli account view

1.  View your account settings:

        linode-cli account settings

1.  Make a payment:

        linode-cli account payment-create --cvv 123 --usd 20.00

1.  View notifications:

        linode-cli account notifications-list

### Support Tickets

1.  List your Support Tickets:

        linode-cli tickets list

1.  Open a new Ticket:

        linode-cli tickets create --description "Detailed description of the issue" --summary "Summary or quick title for the Ticket"

    If your issue concerns a particular Linode, Volume, Domain, or NodeBalancer, pass the ID with `--domain_id`, `--linode-id`, `--volume_id`, etc.

1.  List replies for a Ticket:

        linode-cli tickets replies $ticket_id

1.  Reply to a Ticket:

        linode-cli tickets reply $ticket_id --description "The content of your reply"

### Events

1.  View a list of events on your account:

        linode-cli events list

1.  View details about a specific event:

        linode-cli events view $event_id

1.  Mark an event as read:

        linode-cli events mark-read $event_id
