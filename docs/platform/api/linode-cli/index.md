---
author:
  name: Jared Kobos
  email: docs@linode.com
description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
og_description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
keywords: ["linode api", "linode cli", "python cli"]
aliases: ["/platform/api/using-the-linode-cli/", "cli/", "/platform/linode-cli/"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-03-05
modified_by:
  name: Linode
published: 2018-06-29
title: Using the Linode CLI
external_resources:
  - '[Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/)'
  - '[Linode API Documentation](https://developers.linode.com/)'
---

![Linode CLI](using-the-linode-cli.png "Linode CLI")

The Linode CLI is a wrapper around the [Linode API](https://developers.linode.com) that allows you to manage your Linode account from the command line. Virtually any task that can be done through the Linode Manager can be done through the CLI, making it an excellent tool for scripting.

This guide describes the basics of installing and working with the CLI. It also offers examples illustrating how to complete common tasks using the CLI.

## Install the CLI

The easiest way to install the CLI is through [Pip](https://pypi.org/project/pip/):

1.  Install the CLI:

        pip3 install linode-cli --upgrade

1.  You need a Personal Access Token to use the CLI. Use the [Linode Cloud Manager](https://cloud.linode.com/profile/tokens) to obtain a token.

1.  The first time you run any command, you will be prompted with the CLI's configuration script. Paste your access token (which will then be used by default for all requests made through the CLI) at the prompt. You will be prompted to choose defaults for Linodes created through the CLI (region, type, and image). These are optional, and can be overridden for individual commands. Update these defaults at any time by running `linode-cli configure`:

    {{< output >}}
Welcome to the Linode CLI.  This will walk you through some
initial setup.

First, we need a Personal Access Token.  To get one, please visit
https://cloud.linode.com/profile/tokens and click
"Create a Personal Access Token".  The CLI needs access to everything
on your account to work correctly.

Personal Access Token:
{{< /output >}}

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

The CLI will return output in tabulated format for easy readability. If you prefer to work with JSON, use the `--json` flag. Adding the `--pretty` flag will format the JSON output to make it more readable:

    linode-cli regions list --json --pretty

{{< highlight json >}}
[
  {
    "country": "us",
    "id": "us-central"
  },
  {
    "country": "us",
    "id": "us-west"
  },
  {
    "country": "us",
    "id": "us-southeast"
  },
  {
    "country": "us",
    "id": "us-east"
  },
  ...
]
{{< /highlight >}}

### Machine Readable Output

You can also display the output as plain text. By default, tabs are used as a delimiter, but you can specify another character with the `--delimiter` option:

    linode-cli regions list --text

{{< highlight text >}}
id	country
us-central	us
us-west	us
us-southeast	us
us-east	us
eu-west	uk
ap-south	sg
eu-central	de
ap-northeast	jp
ap-northeast-1a	jp
ca-east         ca
{{< /highlight >}}

    linode-cli regions list --text --delimiter ";"

{{< highlight text >}}
id;country
us-central;us
us-west;us
us-southeast;us
us-east;us
eu-west;uk
ap-south;sg
eu-central;de
ap-northeast;jp
ap-northeast-1a;jp
ca-east;ca
{{< /highlight >}}

## Examples

This section reviews some common examples related to [Accounts](#account) and [Events](#events), [Domains](#domains), [Linode Instances](#linode-instances), [Linode Kubernetes Engine (LKE)](#linode-kubernetes-engine-lke), [NodeBalancers](#nodebalancers), [Object Storage](#object-storage), [Block Storage Volumes](#block-storage-volumes), and [Support Tickets](#support-tickets). Other actions are available. Use `linode-cli linodes --help` for a complete list.

### Account

View or update your account information, add payment methods, view notifications, make payments, create OAuth clients, and do other related tasks through the `account` action:

1.  View your account:

        linode-cli account view

1.  View your account settings:

        linode-cli account settings

1.  Make a payment:

        linode-cli account payment-create --cvv 123 --usd 20.00

1.  View notifications:

        linode-cli account notifications-list

### Events

1.  View a list of events on your account:

        linode-cli events list

1.  View details about a specific event:

        linode-cli events view $event_id

1.  Mark an event as read:

        linode-cli events mark-read $event_id

### Domains

{{< content "linode-cli-domains-shortguide" >}}

### Linode Instances

{{< content "linode-cli-instances-shortguide" >}}

### Linode Kubernetes Engine (LKE)

{{< content "linode-cli-kubernetes-shortguide" >}}

### NodeBalancers

{{< content "linode-cli-nodebalancer-shortguide" >}}

### Object Storage

{{< content "linode-cli-object-storage-shortguide" >}}

### Block Storage Volumes

{{< content "linode-cli-block-storage-shortguide" >}}

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
