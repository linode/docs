---
title: Get Started
description: "Get started with the Linode CLI. Learn to install the CLI and customize output fields."
tab_group_main:
    weight: 20
---

This guide describes the basics of installing and working with the CLI. It also offers examples illustrating how to complete common tasks using the CLI.

## Install the CLI

1.  List your Support Tickets:

        linode-cli tickets list

1.  Open a new Ticket:

        linode-cli tickets create --description "Detailed description of the issue" --summary "Summary or quick title for the Ticket"

    If your issue concerns a particular Linode, Volume, Domain, or NodeBalancer, pass the ID with `--domain_id`, `--linode-id`, `--volume_id`, etc.

1.  List replies for a Ticket:

        linode-cli tickets replies $ticket_id

1.  Reply to a Ticket:

        linode-cli tickets reply $ticket_id --description "The content of your reply"


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

The CLI returns output in tabulated format for easy readability. If you prefer to work with JSON, use the `--json` flag. Adding the `--pretty` flag formats the JSON output to make it more readable:

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
