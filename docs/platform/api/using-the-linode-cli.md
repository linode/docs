---
author:
  name: Jared Kobos
  email: docs@linode.com
description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
og_description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
keywords: ["linode api", "linode cli", "python cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/wget/']
modified: 2018-05-22
modified_by:
  name: Linode
published: 2018-05-22
title: Using the Linode CLI
external_resources:
  - '[Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/)'
---

The [Linode CLI](https://bits.linode.com/LinodeAPI/linode-cli) is a wrapper around the [Linode API](https://developers.linode.com) that allows you to manage your Linode account from the command line. Virtually any task that can be done through the Linode Manager can also be done through the CLI, making it an excellent tool for scripting.

## Install the CLI

The easiest way to install the CLI is through [Pip](https://pypi.org/project/pip/):

1.  Install the CLI:

        pip install linode-cli --upgrade

2.  You will need a Personal Access Token to use the CLI. Use the [beta Linode Manager](https://cloud.linode.com/profile/tokens) to obtain a token.

3.  The first time you run any command, you will be prompted with the CLI's configuration script. Paste your access token (which will then be used by default for all requests made through the CLI) at the prompt. You will also be prompted to choose defaults for Linodes created through the CLI (region, type, and image). These are optional, and can be overridden for individual commands. You can also update these defaults at any time by running `linode-cli configure`.

    {{< highlight text >}}
Welcome to the Linode CLI.  This will walk you through some
initial setup.

First, we need a Personal Access Token.  To get one, please visit
https://cloud.linode.com/profile/tokens and click
"Create a Personal Access Token".  The CLI needs access to everything
on your account to work correctly.

Personal Access Token:
{{< /highlight >}}

{{< note >}}
On OSX, you may have to source the configuration file before it can be used. Add `source /etc/bash_completion.d/linode-cli.sh` to your `~/.bashrc` file.
{{< /note >}}

## CLI Basics

The API uses a RESTful architecture, and as a result commands follow a similar structure across the CLI. For many resources, such as `regions` or `domains`, you can view a list of items with the following pattern:

    linode-cli <resource-name> list

To view a particular instance of a resource:

    linode-cli <resource-name> view <resource-id>

To delete a resource:

    linode-cli <resource-name> delete <resource-id>

Creating or updating resources follows the same pattern, with additional parameters specific to the resource:

    linode-cli <resource-name> create --color blue



Some resources are nested, or use slightly different patterns. Specific examples are covered in the [Examples](#examples) section.

## Options

### Help

You can view information about any part of the CLI, including available actions and required parameters, with the `--help` flag:

    linode-cli --help
    linode-cli linodes --help
    linode-cli linodes create --help

### Customize Output Fields

By default, the CLI displays on some pre-selected fields for a given type of response. If you would like to see all available fields, use the `--all` flag:

    linode-cli linodes list --all

You can also specify exactly which fields you would like to receive with the `-format` option:

    linode-cli linodes list --format 'id,region,memory'

### JSON Output

The CLI will return output in tabulated format for easy readability. If you would prefer to work with JSON, use the `--json` flag. Adding the `--pretty` flag will format the JSON output to make it more readable:

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
  {
    "country": "uk",
    "id": "eu-west"
  },
  {
    "country": "sg",
    "id": "ap-south"
  },
  {
    "country": "de",
    "id": "eu-central"
  },
  {
    "country": "jp",
    "id": "ap-northeast"
  },
  {
    "country": "jp",
    "id": "ap-northeast-1a"
  }
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
{{< /highlight >}}

    linode-cli regions list --text --delimiter ;

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
{{< /highlight >}}

## Examples

Almost any task that can be performed through the Linode Manager or API can also be done with the CLI. This section will review some common examples relating to Linodes, Domains, Block Storage Volumes, NodeBalancers, and account details.

### Linodes

Tasks related to Linode instances are performed with `linode-cli linodes [ACTION]`.

1.  List all of the Linodes on your account:

        linode-cli linodes list

    You can filter results to a particular region:

        linode-cli linodes list --region us-east

    Filtering works on many fields throughout the CLI; use `--help` for each action to see which properties are filterable.

2.  Create a new Linode:

        linode-cli linodes create --label new-linode --root_pass mypassword

    The defaults you specified when configuring the CLI will be used for the new Linode's type, region, and image. You can also override these options by specifying the values:

        linode-cli linodes create --label new-linode-2 --root_pass mypassword --region us-east --image linode/debian9 --group webservers

    If you are not writing a script, it is more secure to use `--root_pass` without specifying a password. You will then be prompted to enter a password:

        linode-cli linodes create --label new-linode-3 --root_pass

3.  For commands targeting a specific Linode, you will need that Linode's ID. The ID is returned when creating the Linode, and can be viewed by listing the Linodes on your account as described above. Store the ID of the new Linode (or an existing Linode) for later use:

        export linode_id=<id-string>

4.  View details about a particular Linode:

        linode-cli linodes view $linode_id

4.  Boot, shut down, or reboot a Linode:

        linode-cli linodes boot $linode_id
        linode-cli linodes reboot $linode_id
        linode-cli linodes shutdown $linode_id

5.  View a list of available IP addresses for a specific Linode:

        linode-cli linodes ips-list $linode_id

6.  Add a private IP address to a Linode:

        linode-cli linodes ip-add $linode_id --type ipv4 --public false

7.  List all disks provisioned for a Linode:

        linode-cli linodes disks-list $linode_id

8.  Upgrade your Linode. If an upgrade is available for the specified Linode, it will be placed in the Migration Queue. It will then be automatically shut down, migrated, and returned to its last state.

        linode-cli linodes upgrade $linode_id

9.  Rebuild a Linode:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass

Many other actions are available. Use `linode-cli linodes --help` for a complete list.

### Domains

1.  List the domains on your account:

        linode-cli domains list

2.  View all domain records in a specific domain:

        linode-cli domains records-list $domain_id

3.  Delete a domain:

        linode-cli domains delete $domain_id

4.  Create a domain:

        linode-cli domains create --type master --domain www.example.com --soa_email email@example.com

5.  Create a new A record in a domain:

        linode-cli domains records-create $domain_id --type A --name subdomain --target 192.0.2.0

### NodeBalancers

1.  Create a new NodeBalancer:

        linode-cli nodebalancers create --region us-east --label new-balancer

2.  Create a configuration for a NodeBalancer:

        linode-cli nodebalancers config-create $nodebalancer_id

3.  Attach a Node to a NodeBalancer:

        linode-cli nodebalancers node-create --address 192.200.12.34:80 --label node-1

4.  To delete a node, you will need the ID of the NodeBalancer, configuration, and node:

        linode-cli nodebalancers node-delete $nodebalancer_id $config_id $node_id

### Block Storage Volumes

1.  List your current Volumes:

        linode-cli volumes list

2.  Create a new Volume, with the size specified in GiB:

        linode-cli volumes create --label my-volume --size 100 --region us-east

    You can also create the Volume and automatically attach it to a specific Linode:

        linode-cli volumes create --label my-volume --size 100  --linode_id $linode_id

3.  Attach or detach the Volume from a Linode:

        linode-cli volumes attach $volume_id --linode_id $linode_id
        linode-cli volumes detach $volume_id

4.  Resize a Volume (size can only be increased):

        linode-cli volumes resize $volume_id --size 200

5.  Delete a Volume:

        linode-cli volumes delete $volume_id

### Account

You can view or update your account information, add payment methods, view notifications, make payments, create OAuth clients, and more through the `account` action.

1.  View your account:

        linode-cli account view

2.  View your account settings:

        linode-cli account settings

3.  Make a payment:

        linode-cli account payment-create --cvv 123 --usd 20.00
