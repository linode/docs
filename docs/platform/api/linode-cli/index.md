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

### Linode Instances

Tasks related to Linode instances are performed with `linode-cli linodes [ACTION]`.

1.  List all of the Linodes on your account:

        linode-cli linodes list

    Filter results to a particular region:

        linode-cli linodes list --region us-east

    Filtering works on many fields throughout the CLI. Use `--help` for each action to see which properties are filterable.

1.  Create a new Linode:

        linode-cli linodes create --root_pass mypassword

    The defaults you specified when configuring the CLI will be used for the new Linode's type, region, and image. Override these options by specifying the values:

        linode-cli linodes create --root_pass mypassword --region us-east --image linode/debian9 --group webservers

    If you are not writing a script, it is more secure to use `--root_pass` without specifying a password. You will then be prompted to enter a password:

        linode-cli linodes create --root_pass

1.  For commands targeting a specific Linode, you will need that Linode's ID. The ID is returned when creating the Linode, and can be viewed by listing the Linodes on your account as described above. Store the ID of the new Linode (or an existing Linode) for later use:

        export linode_id=<id-string>

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

1.  Create a new disk for a Linode:

        linode-cli linodes disk-create $linode_id --size 2700 --root_pass mypassword --filesystem raw --no-defaults

    {{< note >}}
Even if you set the `--filesystem` to `raw`, the defaults you specified when configuring the CLI will be used for setting a Linode's disk image for this disk, overriding the filesystem setting. To create a disk without the default image, using only the parameters you send in this command, use the `--no-defaults` flag.
{{</ note >}}

1.  List all disks provisioned for a Linode:

        linode-cli linodes disks-list $linode_id

1.  Upgrade your Linode. If an upgrade is available for the specified Linode, it will be placed in the Migration Queue. It will then be automatically shut down, migrated, and returned to its last state:

        linode-cli linodes upgrade $linode_id

1.  Rebuild a Linode:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass

1. Rebuild a Linode, adding a populated authorized_keys file:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass --authorized_keys "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEC+DOVfw+8Jsw1IPrYCcU9/HCuKayCsV8bXjsHqX/Zq email@example.com"

    If your key exists on your filesystem, you can also substitute its value in the CLI command with `cat`. For example:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass --authorized_keys "$(cat ~/.ssh/id_rsa.pub)"

Many other actions are available. Use `linode-cli linodes --help` for a complete list.

### Linode Kubernetes Engine (LKE)

1.  Lists current Kubernetes Clusters available on your account:

        linode-cli lke clusters-list

1.  Create a Kubernetes Cluster. The Kubernetes Cluster will be created asynchronously. You can use the events system to determine when the Kubernetes Cluster is ready to use:

        linode-cli lke cluster-create \
          --label cluster12345 \
          --region us-central \
          --k8s_version 1.16 \
          --node_pools.type g6-standard-4 --node_pools.count 6 \
          --node_pools.type g6-standard-8 --node_pools.count 3 \
          --tags ecomm

1.  Update Kubernetes Cluster:

        linode-cli lke cluster-update $cluster_id \
          --label lkecluster54321 \
          --tags ecomm \
          --tags blog \
          --tags prod \
          --tags monitoring

1.  Delete a Cluster you have permission to `read_write`:

        linode-cli lke cluster-delete $cluster_id

1.  List all active Node Pools on a Kubernetes Cluster:

        linode-cli lke pools-list $cluster_id

1.  Create a Node Pool on a Kubernetes Cluster:

        linode-cli lke pool-create $cluster_id \
          --type g6-standard-4 \
          --count 6

1.  Update Node Pool in a Kubernetes Cluster. When a Node Pool's count is changed, the Nodes in that pool will be replaced in a rolling fashion.

        linode-cli lke pool-update $cluster_id $pool_id \
          --count 6

1.  Delete a Node Pool from a Kubernetes Cluster:

        linode-cli lke pool-delete $cluster_id $pool_id

1.  View the Kubeconfig file for the Kubernetes Cluster:

        linode-cli lke kubeconfig-view $cluster_id

Other actions are available. Use `linode-cli lke --help` for a complete list.

### NodeBalancers

1.  Create a new NodeBalancer:

        linode-cli nodebalancers create --region us-east --label new-balancer

1.  Create a configuration for a NodeBalancer:

        linode-cli nodebalancers config-create $nodebalancer_id

1.  Attach a Node to a NodeBalancer:

        linode-cli nodebalancers node-create --address 192.200.12.34:80 --label node-1

1.  To delete a node, you will need the ID of the NodeBalancer, configuration, and node:

        linode-cli nodebalancers node-delete $nodebalancer_id $config_id $node_id

Other actions are available. Use `linode-cli nodebalancers --help` for a complete list.

### Object Storage

1.  List the current Object Storage Clusters available to use:

        linode-cli object-storage clusters-list

1.  Create a new Object Storage Key for your account:

        linode-cli object-storage keys-create --label "my-object-storage-key"

1.  List Object Storage Keys for authenticating to the Object Storage S3 API:

        linode-cli object-storage keys-list

1.  Update an Object Storage Key label:

        linode-cli object-storage keys-update --keyId $key_id --label "my-new-object-storage-key"

1.  Revoke an Object Storage Key:

        linode-cli object-storage keys-delete $key_id

1.  Cancel Object Storage on your Account. All buckets on the Account must be empty before Object Storage can be cancelled.

        linode-cli object-storage cancel

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
