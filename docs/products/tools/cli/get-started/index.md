---
title: Get Started
title_meta: "Getting Started with the Linode CLI"
description: "Learn how to run basic commands on the Linode CLI and modify the output to fit your needs."
keywords: ["linode api", "linode cli", "python cli"]
tab_group_main:
    weight: 20
aliases: ['/platform/api/linode-cli/','/cli/','/platform/linode-cli/','/platform/api/using-the-linode-cli/','/guides/using-the-linode-cli/','/guides/linode-cli/']
published: 2018-06-29
modified: 2022-05-02
modified_by:
  name: Linode
---

## Installing the Linode CLI

See the [Install and Configure the Linode CLI](/docs/products/tools/cli/guides/install/) guide for installation instructions and details on performing the initial configuration.

## Basic Usage

To view a list of all Compute Instances on your account, run the following command:

    linode-cli linodes list

This command generates the following output, based on the information within your own account.

```output
┌──────────┬────────────────────┬────────────┬───────────────┬───────────────────────┬─────────┬───────────────────┐
│ id       │ label              │ region     │ type          │ image                 │ status  │ ipv4              │
├──────────┼────────────────────┼────────────┼───────────────┼───────────────────────┼─────────┼───────────────────┤
│ 00000001 │ example-instance   │ us-east    │ g6-standard-1 │ linode/ubuntu18.04    │ running │ 192.0.2.42         │
│ 00001111 │ centos-us-east     │ us-east    │ g6-nanode-1   │ linode/centos-stream9 │ running │ 192.0.2.108       │
└──────────┴────────────────────┴────────────┴───────────────┴───────────────────────┴─────────┴───────────────────┘
```

See [Using the Linode CLI](/docs/products/tools/cli/guides/#using-the-linode-cli) for additional usage details and examples.

## Help

View information about any part of the CLI, including available actions and required parameters, with the `--help` flag:

    linode-cli --help
    linode-cli linodes --help
    linode-cli linodes create --help

## Output

To make information easy to ready, the Linode CLI outputs responses in a text-based table format. The data is split into rows and columns, with the top row containing the fields.

    linode-cli regions list

```output
┌──────────────┬─────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬────────┐
│ id           │ country │ capabilities                                                                                                                                            │ status │
├──────────────┼─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────┤
│ ap-west      │ in      │ Linodes, NodeBalancers, Block Storage, GPU Linodes, Kubernetes, Cloud Firewall, Vlans, Block Storage Migrations, Managed Databases                      │ ok     │
│ ca-central   │ ca      │ Linodes, NodeBalancers, Block Storage, Kubernetes, Cloud Firewall, Vlans, Block Storage Migrations, Managed Databases                                   │ ok     │
│ ap-southeast │ au      │ Linodes, NodeBalancers, Block Storage, Kubernetes, Cloud Firewall, Vlans, Block Storage Migrations, Managed Databases                                   │ ok     │
│ us-central   │ us      │ Linodes, NodeBalancers, Block Storage, Kubernetes, Cloud Firewall, Block Storage Migrations, Managed Databases                                          │ ok     │
│ us-west      │ us      │ Linodes, NodeBalancers, Block Storage, Kubernetes, Cloud Firewall, Block Storage Migrations, Managed Databases                                          │ ok     │
│ us-southeast │ us      │ Linodes, NodeBalancers, Block Storage, Object Storage, GPU Linodes, Kubernetes, Cloud Firewall, Vlans, Block Storage Migrations, Managed Databases      │ ok     │
│ us-east      │ us      │ Linodes, NodeBalancers, Block Storage, Object Storage, GPU Linodes, Kubernetes, Cloud Firewall, Bare Metal, Block Storage Migrations, Managed Databases │ ok     │
│ eu-west      │ uk      │ Linodes, NodeBalancers, Block Storage, Kubernetes, Cloud Firewall, Block Storage Migrations, Managed Databases                                          │ ok     │
│ ap-south     │ sg      │ Linodes, NodeBalancers, Block Storage, Object Storage, GPU Linodes, Kubernetes, Cloud Firewall, Block Storage Migrations, Managed Databases             │ ok     │
│ eu-central   │ de      │ Linodes, NodeBalancers, Block Storage, Object Storage, GPU Linodes, Kubernetes, Cloud Firewall, Block Storage Migrations, Managed Databases             │ ok     │
│ ap-northeast │ jp      │ Linodes, NodeBalancers, Block Storage, Kubernetes, Cloud Firewall, Block Storage Migrations, Managed Databases                                          │ ok     │
└──────────────┴─────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴────────┘
```

### Fields

By default, most Linode CLI responses do not contain all the available fields. To keep the information digestible, the Linode CLI outputs a smaller subset of all of available fields. This behavior can be adjusted using the commands below.

- **Limited** (default behavior): Outputs a limited subset of the available fields.
- **All fields** (`--all`): Output all available fields.
- **Specific fields** (`--format 'field1,field2'`): Outputs only the fields specified within the given comma separated list.

### Output Format

The Linode CLI can output data in a variety of formats, as disclosed below:

- **Tabular** (default): Data is split into rows and columns, with the top row containing the fields.
- **JSON** (`--json` or `--json --pretty`): Data is structured using JavaScript Object Notation (JSON), typically used for importing into applications that require JSON. The `--pretty` tag is optional and makes the output more human readable.
- **Plain text** (`--text` or `--text --delimiter ","`): Data is outputted as plain text. By default, it uses a *tab* character as the delimiter, though this can be adjusted by specifying a custom character using the `--delimited ","` option.